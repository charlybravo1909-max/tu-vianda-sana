/**
 * WEBHOOK RECEPTOR DE PEDIDOS — TU VIANDA SANA
 * Pegar este código en Extensiones > Apps Script dentro de la planilla Tu_Vianda_Sana_Pedidos_Diarios
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Pedidos");
    if (!sheet) {
      throw new Error("No se encontró la pestaña 'Pedidos' en la planilla.");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var now = new Date();
    var idPedido = data.id_pedido || data.id || ("TVS-" + Utilities.formatDate(now, "GMT-3", "yyMMdd-HHmmss"));
    var fecha = data.fecha || Utilities.formatDate(now, "GMT-3", "dd/MM/yyyy");
    var hora = data.hora || Utilities.formatDate(now, "GMT-3", "HH:mm");

    var cliente = data.cliente || data.nombre || "";
    var telefono = data.telefono || "";
    var direccion = data.direccion_entrega || data.direccion || "";
    var detalle = data.detalle_pedido || data.detalle || (Array.isArray(data.items) ? data.items.join(" | ") : "");
    var total = Number(data.total_ars || data.total || 0);

    var formaPago = data.forma_pago || (data.metodo_pago === "efectivo" ? "Efectivo" : "Transferencia");
    var detallePago = data.detalle_pago_o_vuelto || data.detalle_pago || data.vuelto || "";

    var comprobante = data.comprobante_validado || (formaPago === "Efectivo" ? "Efectivo" : "Pendiente");
    var comentarios = data.comentarios || data.notas || "";
    var estado = data.estado_pedido || data.estado || "Pendiente";

    sheet.appendRow([
      idPedido, fecha, hora, cliente, telefono, direccion, detalle,
      total, formaPago, detallePago, comprobante, comentarios, estado
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", id_pedido: idPedido }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "online", message: "Webhook de Tu Vianda Sana operativo." }))
    .setMimeType(ContentService.MimeType.JSON);
}

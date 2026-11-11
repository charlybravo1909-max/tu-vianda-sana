/* Tu Vianda Sana — catálogo por defecto y cálculo de precios.
   Lo usan la página (navegador) y las funciones del servidor, así el precio
   que ve el cliente y el que se cobra salen de la misma lógica. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Calc = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const CATEGORIAS = ['base', 'proteina', 'legumbre', 'vegetal', 'fruto', 'especial', 'aderezo'];

  const DEFAULTS = {
    config: {
      horarioTexto: '⏰ Pedido hasta 10:00 am',
      whatsapp: '5492995981735',
      alias: 'tuvianda.sana',
      precioMenu: 15000,
      precioArma: 12000,
      maxIngredientes: 6,
      limites: { base: 1, proteina: 2, legumbre: 5, vegetal: 6, fruto: 1, especial: 1, aderezo: 1 }
    },
    menus: [
      { id: 'm1', codigo: '1.1 Opción 1', nombre: 'Pollo con Arroz', descripcion: 'Porción fresca del día preparada con ingredientes naturales.', stock: true },
      { id: 'm2', codigo: '1.2 Opción 2', nombre: 'Guiso de Lentejas', descripcion: 'Guiso casero nutritivo de lentejas seleccionadas.', stock: true }
    ],
    casa: [
      { id: 'h1', codigo: '2.1', nombre: 'Power Bowl Integral', precio: 13500, descripcion: 'Tallarines integrales con arvejas, queso, palta, zanahoria, pollo y aderezo de la casa.', stock: true },
      { id: 'h2', codigo: '2.2', nombre: 'Premium Tropical', precio: 14500, descripcion: 'Lechuga, fetas de lomo, queso azul, mango, palta, tomates cherry, crutones y aderezo de la casa.', stock: true },
      { id: 'h3', codigo: '2.3', nombre: 'Proteica', precio: 13500, descripcion: 'Lechuga, zanahoria, palta, cherry, huevo duro, pechuga de pollo, crutones y aderezo de la casa.', stock: true },
      { id: 'h4', codigo: '2.4', nombre: 'César', precio: 13000, descripcion: 'Lechuga, crutones, pollo, panceta, queso y salsa césar.', stock: true },
      { id: 'h5', codigo: '2.5', nombre: 'Clásica', precio: 12500, descripcion: 'Lechuga, zanahoria, cherry, choclo, queso y pollo.', stock: true },
      { id: 'h6', codigo: '2.6', nombre: 'Mediterránea', precio: 13500, descripcion: 'Fideos de vegetales, zanahoria, cherry, atún, huevo y lechuga.', stock: true }
    ],
    wraps: [
      { id: 'w1', nombre: 'Wrap de Pollo & Vegetales', precio: 12500, descripcion: 'Tortilla tibia con pollo grillado, hojas verdes, zanahoria, queso y aderezo de la casa.', stock: true },
      { id: 'w2', nombre: 'Wrap Mediterráneo de Atún', precio: 12800, descripcion: 'Atún al natural, huevo duro, tomate cherry, lechuga fresca y queso.', stock: true },
      { id: 'w3', nombre: 'Wrap Especial Lomo & Palta', precio: 13800, descripcion: 'Fetas de lomo, palta, rúcula, queso y aderezo César.', stock: true }
    ],
    ingredientes: [
      ['101', 'Lechuga fresca', 'base'], ['102', 'Rúcula', 'base'], ['103', 'Mix de rúcula y lechuga', 'base'],
      ['201', 'Pollo', 'proteina'], ['202', 'Atún', 'proteina'], ['203', 'Huevo', 'proteina'],
      ['204', 'Queso', 'proteina'], ['205', 'Jamón', 'proteina'], ['206', 'Panceta', 'proteina'],
      ['301', 'Garbanzos', 'legumbre'], ['302', 'Porotos', 'legumbre'], ['303', 'Lentejas', 'legumbre'],
      ['304', 'Arvejas', 'legumbre'], ['305', 'Choclo', 'legumbre'], ['306', 'Brócoli', 'legumbre'],
      ['401', 'Zanahoria', 'vegetal'], ['402', 'Tomates cherry', 'vegetal'], ['403', 'Remolacha', 'vegetal'],
      ['404', 'Repollo', 'vegetal'], ['405', 'Pepino', 'vegetal'], ['406', 'Espinaca', 'vegetal'],
      ['501', 'Castaña de cajú', 'fruto'], ['502', 'Nueces', 'fruto'], ['503', 'Almendras', 'fruto'],
      ['504', 'Pasas de uva', 'fruto'], ['505', 'Maíz tostado', 'fruto'], ['506', 'Maní japonés saborizado', 'fruto'],
      ['601', 'Mango', 'especial'], ['602', 'Palta', 'especial'], ['603', 'Queso azul', 'especial'], ['604', 'Lomo feteado', 'especial'],
      ['701', 'Dip de la casa', 'aderezo'], ['702', 'Aceite, limón y sal', 'aderezo'], ['703', 'Salsa César', 'aderezo'],
      ['704', 'Salsa de garbanzos', 'aderezo'], ['705', 'Tradicionales (ketchup, mayonesa y mostaza)', 'aderezo']
    ].map(([id, nombre, categoria]) => ({ id, nombre, categoria, stock: true })),
    adicionales: [
      { id: 'add_prot', nombre: 'Proteína adicional', precio: 2000, ayuda: 'Especificar cuál (ej: Pollo, Atún, Jamón...)' },
      { id: 'add_ader', nombre: 'Aderezo adicional', precio: 2000, ayuda: 'Especificar cuál (ej: Salsa César, Dip...)' },
      { id: 'add_esp', nombre: 'Ingredientes especiales', precio: 2000, ayuda: 'Especificar cuál (ej: Palta, Mango, Lomo...)' },
      { id: 'add_frut', nombre: 'Frutos secos', precio: 1700, ayuda: 'Especificar cuál (ej: Castañas, Nueces...)' },
      { id: 'add_veg', nombre: 'Vegetales adicionales', precio: 1000, ayuda: 'Especificar cuál (ej: Tomates cherry...)' },
      { id: 'add_leg', nombre: 'Legumbres', precio: 1000, ayuda: 'Especificar cuál (ej: Garbanzos, Choclo...)' }
    ]
  };

  // ---------- utilidades ----------
  function txt(v) { return v == null ? '' : String(v).trim(); }
  function num(v, def) {
    let s = txt(v).replace(/[^\d.,-]/g, '');
    if (!s) return def;
    s = s.replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : def;
  }
  function hayStock(v) {
    const s = txt(v).toUpperCase();
    return !['NO', 'N', 'FALSE', 'FALSO', '0', 'AGOTADO', 'SIN STOCK'].includes(s);
  }
  function corto(v, max) { return txt(v).replace(/[\r\n]+/g, ' ').slice(0, max); }
  function pesos(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }
  function errorUsuario(msg) { const e = new Error(msg); e.usuario = true; return e; }

  // ---------- planilla -> catálogo ----------
  // `t` trae, por pestaña, una lista de filas {columna: valor}. Si una pestaña
  // no se pudo leer viene undefined y se usan los valores por defecto.
  function normalizar(t) {
    const d = DEFAULTS;
    const c = (t.config && t.config[0]) || {};
    const config = {
      horarioTexto: txt(c.horario_texto) || d.config.horarioTexto,
      whatsapp: txt(c.whatsapp).replace(/\D/g, '') || d.config.whatsapp,
      alias: txt(c.alias) || d.config.alias,
      precioMenu: num(c.precio_menu, d.config.precioMenu),
      precioArma: num(c.precio_arma_ensalada, d.config.precioArma),
      maxIngredientes: num(c.max_ingredientes, d.config.maxIngredientes),
      limites: {}
    };
    CATEGORIAS.forEach(k => { config.limites[k] = num(c['limite_' + k], d.config.limites[k]); });

    const filas = arr => arr.filter(r => txt(r.id));
    return {
      config,
      menus: t.menus ? filas(t.menus).map(r => ({ id: txt(r.id), codigo: txt(r.codigo), nombre: txt(r.nombre), descripcion: txt(r.descripcion), stock: hayStock(r.stock) })) : d.menus,
      casa: t.casa ? filas(t.casa).map(r => ({ id: txt(r.id), codigo: txt(r.codigo), nombre: txt(r.nombre), precio: num(r.precio, 0), descripcion: txt(r.descripcion), stock: hayStock(r.stock) })).filter(x => x.precio > 0) : d.casa,
      wraps: t.wraps ? filas(t.wraps).map(r => ({ id: txt(r.id), nombre: txt(r.nombre), precio: num(r.precio, 0), descripcion: txt(r.descripcion), stock: hayStock(r.stock) })).filter(x => x.precio > 0) : d.wraps,
      ingredientes: t.ingredientes ? filas(t.ingredientes).map(r => ({ id: txt(r.id), nombre: txt(r.nombre), categoria: txt(r.categoria).toLowerCase(), stock: hayStock(r.stock) })).filter(x => CATEGORIAS.includes(x.categoria)) : d.ingredientes,
      adicionales: t.adicionales ? filas(t.adicionales).map(r => ({ id: txt(r.id), nombre: txt(r.nombre), precio: num(r.precio, 0), ayuda: txt(r.ayuda) || 'Especificar cuál' })) : d.adicionales
    };
  }

  // ---------- precio de una línea del carrito ----------
  function calcularItem(cat, it) {
    const cfg = cat.config;
    if (!it || typeof it !== 'object') throw errorUsuario('Hay un ítem inválido en el pedido.');

    if (it.tipo === 'menu' || it.tipo === 'casa' || it.tipo === 'wrap') {
      const lista = it.tipo === 'menu' ? cat.menus : it.tipo === 'casa' ? cat.casa : cat.wraps;
      const p = lista.find(x => x.id === txt(it.id));
      if (!p) throw errorUsuario('Un plato de tu pedido ya no está en el menú. Quitalo y volvé a agregarlo.');
      if (!p.stock) throw errorUsuario(`"${p.nombre}" se quedó sin stock. Quitalo del pedido para continuar.`);
      if (it.tipo === 'menu') return { titulo: 'Menú del día: ' + p.nombre, detalle: p.codigo, precio: cfg.precioMenu };
      if (it.tipo === 'casa') return { titulo: 'Ensalada ' + p.nombre, detalle: 'Creación de la casa ' + p.codigo, precio: p.precio };
      return { titulo: p.nombre, detalle: 'Wrap fresco', precio: p.precio };
    }

    if (it.tipo === 'arma') {
      const ids = Array.isArray(it.ingredientes) ? [...new Set(it.ingredientes.map(txt))] : [];
      const ings = ids.map(id => cat.ingredientes.find(x => x.id === id));
      if (ings.some(x => !x)) throw errorUsuario('Un ingrediente de tu ensalada ya no está disponible. Quitala y armala de nuevo.');
      const agotado = ings.find(x => !x.stock);
      if (agotado) throw errorUsuario(`"${agotado.nombre}" se quedó sin stock. Quitá la ensalada y armala de nuevo.`);
      if (ings.filter(x => x.categoria === 'base').length !== 1) throw errorUsuario('La ensalada tiene que tener una base.');
      if (ings.length > cfg.maxIngredientes) throw errorUsuario(`La ensalada incluye hasta ${cfg.maxIngredientes} ingredientes.`);
      CATEGORIAS.forEach(k => {
        if (ings.filter(x => x.categoria === k).length > cfg.limites[k]) throw errorUsuario('La ensalada supera el máximo de una categoría.');
      });

      let precio = cfg.precioArma;
      const extras = [];
      (Array.isArray(it.adicionales) ? it.adicionales : []).forEach(a => {
        const ad = cat.adicionales.find(x => x.id === txt(a && a.id));
        const q = Math.floor(Number(a && a.cantidad));
        if (!ad || !(q > 0)) return;
        if (q > 20) throw errorUsuario('Cantidad de adicionales demasiado alta.');
        precio += q * ad.precio;
        const det = corto(a.detalle, 60);
        extras.push(`${q}x ${ad.nombre}${det ? ' (' + det + ')' : ''}`);
      });

      let detalle = `Ingredientes (${ings.length}/${cfg.maxIngredientes}): ` + ings.map(x => x.nombre).join(', ');
      if (extras.length) detalle += ' | Adicionales: ' + extras.join(', ');
      return { titulo: 'Ensalada armada a medida', detalle, precio };
    }

    throw errorUsuario('Hay un ítem inválido en el pedido.');
  }

  function calcular(cat, items) {
    if (!Array.isArray(items) || !items.length) throw errorUsuario('El pedido está vacío.');
    if (items.length > 30) throw errorUsuario('El pedido tiene demasiados ítems.');
    const lineas = items.map(it => calcularItem(cat, it));
    return { lineas, total: lineas.reduce((s, l) => s + l.precio, 0) };
  }

  // Texto del pedido para WhatsApp (sin encabezado de estado de pago).
  function resumen(calc, cliente) {
    let m = `👤 *Cliente:* ${cliente.nombre}\n`;
    if (cliente.telefono) m += `📞 *Teléfono:* ${cliente.telefono}\n`;
    m += '\n';
    calc.lineas.forEach((l, i) => { m += `*${i + 1}. ${l.titulo}* (${pesos(l.precio)})\n   _${l.detalle}_\n`; });
    m += `\n💰 *TOTAL:* ${pesos(calc.total)}\n📍 *Dirección:* ${cliente.direccion}\n📝 *Notas:* ${cliente.notas || 'Sin comentarios'}`;
    return m;
  }

  function limpiarCliente(c) {
    c = c || {};
    return {
      nombre: corto(c.nombre, 80),
      direccion: corto(c.direccion, 150),
      telefono: corto(c.telefono, 30),
      notas: corto(c.notas, 300)
    };
  }

  return { DEFAULTS, CATEGORIAS, normalizar, calcular, calcularItem, resumen, limpiarCliente, pesos };
});

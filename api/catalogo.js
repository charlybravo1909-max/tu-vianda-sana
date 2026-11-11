export default function handler(req, res) {
  res.status(200).json({
    config: {
      horarioTexto: "⏰ Pedido hasta 10:00 am",
      whatsapp: "5492995981735",
      alias: "tuvianda.sana",
      precioMenu: 15000,
      precioArma: 12000,
      maxIngredientes: 6,
      limites: {
        base: 1,
        proteina: 2,
        legumbre: 5,
        vegetal: 6,
        fruto: 1,
        especial: 1,
        aderezo: 1
      }
    },
    menus: [
      {
        id: "m1",
        codigo: "1.1 Opción 1",
        nombre: "Pollo con Arroz",
        descripcion: "Porción fresca del día preparada con ingredientes naturales.",
        stock: true
      },
      {
        id: "m2",
        codigo: "1.2 Opción 2",
        nombre: "Guiso de Lentejas",
        descripcion: "Guiso casero nutritivo de lentejas seleccionadas.",
        stock: true
      }
    ],
    casa: [],
    wraps: [],
    ingredientes: [],
    adicionales: []
  });
}

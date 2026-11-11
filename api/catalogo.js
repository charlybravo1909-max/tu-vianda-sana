export default function handler(req, res) {
  res.status(200).json({
    config: {
      horarioTexto: "⏰ Pedido hasta 10:00 am",
      whatsapp: "5492995981735",
      alias: "tuvianda.sana",
      precioMenu: 15000,
      precioArma: 15000,
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

    casa: [
      {
        id: "h1",
        codigo: "2.1",
        nombre: "Power Bowl Integral",
        precio: 13500,
        descripcion: "Tallarines integrales con arvejas, queso, palta, zanahoria, pollo y aderezo de la casa.",
        stock: true
      },
      {
        id: "h2",
        codigo: "2.2",
        nombre: "Premium Tropical",
        precio: 14500,
        descripcion: "Lechuga, fetas de lomo, queso azul, mango, palta, tomates cherry, crutones y aderezo de la casa.",
        stock: true
      }
    ],

    wraps: [
      {
        id: "w1",
        nombre: "Wrap de Pollo & Vegetales",
        precio: 12500,
        descripcion: "Tortilla tibia con pollo grillado, hojas verdes, zanahoria, queso y aderezo de la casa.",
        stock: true
      },
      {
        id: "w2",
        nombre: "Wrap Cesar",
        precio: 12800,
        descripcion: "Tortilla tibia con pollo grillado, lechuga, queso, cubos de panceta ahumada, salsa cesar (casera) y crutones.",
        stock: true
      },
      {
        id: "o1",
        nombre: "Omelette Especial",
        precio: 13800,
        descripcion: "Omelette especial con fetas de lomo, espinaca y cherry",
        stock: true
      }
    ],

    ingredientes: [
      {
        id: "101",
        nombre: "Lechuga fresca",
        categoria: "base",
        stock: true
      }
    ],

    adicionales: [
      {
        id: "add_prot",
        nombre: "Proteína adicional",
        precio: 2000,
        ayuda: "Especificar cuál"
      }
    ]
  });
}

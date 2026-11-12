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
        nombre: "Pollo con Arroz TEST",
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
  { id: "101", nombre: "Lechuga fresca", categoria: "base", stock: true },
  { id: "102", nombre: "Rúcula", categoria: "base", stock: true },
  { id: "103", nombre: "Mix de rúcula y lechuga", categoria: "base", stock: true },

  { id: "201", nombre: "Pollo", categoria: "proteina", stock: true },
  { id: "202", nombre: "Atún", categoria: "proteina", stock: true },
  { id: "203", nombre: "Huevo", categoria: "proteina", stock: true },
  { id: "204", nombre: "Queso", categoria: "proteina", stock: true },
  { id: "205", nombre: "Jamón", categoria: "proteina", stock: true },
  { id: "206", nombre: "Panceta", categoria: "proteina", stock: true },

  { id: "301", nombre: "Garbanzos", categoria: "legumbre", stock: true },
  { id: "302", nombre: "Porotos", categoria: "legumbre", stock: true },
  { id: "303", nombre: "Lentejas", categoria: "legumbre", stock: true },
  { id: "304", nombre: "Arvejas", categoria: "legumbre", stock: true },
  { id: "305", nombre: "Choclo", categoria: "legumbre", stock: true },
  { id: "306", nombre: "Brócoli", categoria: "legumbre", stock: true },

  { id: "401", nombre: "Zanahoria", categoria: "vegetal", stock: true },
  { id: "402", nombre: "Tomates cherry", categoria: "vegetal", stock: true },
  { id: "403", nombre: "Remolacha", categoria: "vegetal", stock: true },
  { id: "404", nombre: "Repollo", categoria: "vegetal", stock: true },
  { id: "405", nombre: "Pepino", categoria: "vegetal", stock: true },
  { id: "406", nombre: "Espinaca", categoria: "vegetal", stock: true },

  { id: "501", nombre: "Castaña de cajú", categoria: "fruto", stock: true },
  { id: "502", nombre: "Nueces", categoria: "fruto", stock: true },
  { id: "503", nombre: "Almendras", categoria: "fruto", stock: true },
  { id: "504", nombre: "Pasas de uva", categoria: "fruto", stock: true },

  { id: "601", nombre: "Mango", categoria: "especial", stock: true },
  { id: "602", nombre: "Palta", categoria: "especial", stock: true },
  { id: "603", nombre: "Queso azul", categoria: "especial", stock: true },
  { id: "604", nombre: "Lomo feteado", categoria: "especial", stock: true },

  { id: "701", nombre: "Dip de la casa", categoria: "aderezo", stock: true },
  { id: "702", nombre: "Aceite, limón y sal", categoria: "aderezo", stock: true },
  { id: "703", nombre: "Salsa César", categoria: "aderezo", stock: true },
  { id: "704", nombre: "Salsa de garbanzos", categoria: "aderezo", stock: true },
  { id: "705", nombre: "Tradicionales", categoria: "aderezo", stock: true }
],

    adicionales: [
  {
    id: "add_prot",
    nombre: "Proteína adicional",
    precio: 2000,
    ayuda: "Especificar cuál (ej: Pollo, Atún, Jamón...)"
  },
  {
    id: "add_ader",
    nombre: "Aderezo adicional",
    precio: 2000,
    ayuda: "Especificar cuál (ej: Salsa César, Dip...)"
  },
  {
    id: "add_esp",
    nombre: "Ingredientes especiales",
    precio: 2000,
    ayuda: "Especificar cuál (ej: Palta, Mango, Lomo...)"
  },
  {
    id: "add_frut",
    nombre: "Frutos secos",
    precio: 1700,
    ayuda: "Especificar cuál (ej: Castañas, Nueces...)"
  },
  {
    id: "add_veg",
    nombre: "Vegetales adicionales",
    precio: 1000,
    ayuda: "Especificar cuál (ej: Tomates cherry...)"
  },
  {
    id: "add_leg",
    nombre: "Legumbres",
    precio: 1000,
    ayuda: "Especificar cuál (ej: Garbanzos, Choclo...)"
  }
]
      
 

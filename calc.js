/* Tu Vianda Sana — catálogo por defecto y cálculo de precios.
   Lo usan la página (navegador) y las funciones del servidor, así el precio
   que ve el cliente y el que se cobra salen de la misma lógica. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Calc = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const CATEGORIAS = ['base', 'proteina', 'legumbre', 'vegetal', 'fruto', 'especial', 'aderezo'];
  const PRECIO_LICUADO_PROMO = 6000;

  const DEFAULTS = {
    config: {
      horarioTexto: '⏰ Pedido hasta 10:15 am',
      whatsapp: '5492995981735',
      alias: 'tuvianda.sana',
      precioMenu: 15000,
      precioArma: 15000,
      maxIngredientes: 6,
      limites: { base: 1, proteina: 2, legumbre: 5, vegetal: 6, fruto: 1, especial: 1, aderezo: 1 }
    },
    menus: [
      { id: 'm1', codigo: '1.1 Opción 1', nombre: 'Sorrentinos', descripcion: 'Sorrentinos de jamón y queso con carne picada en salsa boloñesa, incluye pan y queso rallado.', stock: true },
      { id: 'm2', codigo: '1.2 Opción 2', nombre: 'Guiso de Lentejas', descripcion: 'Guiso casero nutritivo de lentejas seleccionadas.', stock: false }
    ],
    casa: [
      { id: 'h1', codigo: '2.1', nombre: '🥘 Power Bowl Integral', precio: 15000, descripcion: 'Tallarines integrales con arvejas, calabaza, huevo, zanahoria, pollo y aderezo de la casa.', stock: true },
      { id: 'h2', codigo: '2.2', nombre: '🌴 Premium Tropical', precio: 15000, descripcion: 'Lechuga, fetas de lomo, queso azul, mango, palta, tomates cherry, crutones y aderezo de la casa.', stock: true },
      { id: 'h3', codigo: '2.3', nombre: '🥚 Proteica', precio: 15000, descripcion: 'Lechuga, zanahoria, palta, quinoa, huevo duro, pechuga de pollo, crutones y aderezo de la casa.', stock: true },
      { id: 'h4', codigo: '2.4', nombre: '🥓 César', precio: 15000, descripcion: 'Lechuga, crutones, pollo, panceta, queso y salsa césar.', stock: true },
      { id: 'h5', codigo: '2.5', nombre: '🌽 Clásica', precio: 15000, descripcion: 'Lechuga, zanahoria, cherry, choclo, queso y pollo.', stock: true },
      { id: 'h6', codigo: '2.6', nombre: '🐟 Mediterránea', precio: 15000, descripcion: 'Fideos de vegetales, zanahoria, cherry, atún, huevo y lechuga.', stock: true },
      { id: 'h7', codigo: '2.7', nombre: '🥭 Ensalada Tropical Crunch', precio: 15000, descripcion: 'Lechuga, queso, fetas de lomo, nueces, mango y palta. Acompañada de dip de la casa y croutones artesanales.', stock: false },
      { id: 'h8', codigo: '2.8', nombre: '👑 Premium Tropical', precio: 15000, descripcion: 'Lechuga, cherry, choclo, pollo desmechado, queso y palta. Acompañado de crutones artesanales y el dip de la casa.', stock: false },
      { id: 'h9', codigo: '2.9', nombre: '🥑 Ensalada Brisa Gourmet', precio: 15000, descripcion: 'Mix de rúcula y lechuga, queso azul, fetas de lomo, nueces, palta y mango. Acompañada con nuestro aderezo de la casa y croutones artesanales.', stock: false },
      { id: 'h10', codigo: '2.10', nombre: '🥗 Ensalada Protein Crunch', precio: 15000, descripcion: 'Mix de rúcula y lechuga, tallarines integrales con lentejas, cubos de pollo crunchy, huevo, palta y tomates cherrys. Acompañada con nuestro aderezo de la casa y croutones artesanales.', stock: false },
      { id: 'h11', codigo: '2.11', nombre: '💪🏼 Fit y Fresh', precio: 15000, descripcion: 'Mix de verdes, quinoa, pollo, huevo duro, choclo y cherry. Acompañado del aderezo de la casa y fruta como postre.', stock: false },
      { id: 'h12', codigo: '2.12', nombre: '🥑 Crunchy Deli', precio: 15000, descripcion: 'Lechuga, arroz yamaní, pollo crunchy en cubos, palta, queso y zanahoria. Acompañado de nuestros crutones artesanales y el dip de la casa, incluye fruta como postre.', stock: false },
      { id: 'h13', codigo: '2.13', nombre: '🥒 La Refrescante', precio: 15000, descripcion: 'Lechuga, pepino, cebolla morada, cherry, pollo y queso. Acompañado de nuestros crutones artesanales y el dip de la casa, incluye fruta como postre.', stock: false },
      { id: 'h14', codigo: '2.14', nombre: '🫜 Ensalada de la Casa (Vital)', precio: 15000, descripcion: 'Lechuga, zanahoria, remolacha, choclo, huevo duro, pollo desmechado. Acompañada de crutones artesanales, el dip de la casa y fruta como postre.', stock: false },
      { id: 'h15', codigo: '2.15', nombre: '👑 La Consentida (De Autoría)', precio: 15000, descripcion: 'Lechuga, zanahoria, queso rallado, queso azul, pollo y crutones. Acompañado de un dip especial 😍.', stock: false }
    ],
    wraps: [
      { id: 'w1', nombre: 'Wrap de Pollo & Vegetales', precio: 15000, descripcion: 'Tortilla tibia con pollo grillado, hojas verdes, zanahoria, queso y aderezo de la casa.', stock: false },
      { id: 'w2', nombre: 'Wrap Cesar', precio: 15000, descripcion: 'Tortilla tibia con pollo grillado, lechuga, queso, cubos de panceta ahumada, salsa cesar (casera) y crutones.', stock: false },
      { id: 'o1', nombre: 'Omelette Capresse', precio: 15000, descripcion: 'Omelette con tomates frescos, queso y orégano, acompañado de tallarines con choclo.', stock: true }
    ],
    licuadosPostres: [
      { id: 'lp1', tipo: 'Licuado / Smoothie', nombre: 'Smoothie Frutos Rojos & Banana', precio: 8000, descripcion: 'Frutillas, arándanos, banana y base natural sin azúcar agregada (400 ml).', stock: true },
      { id: 'lp2', tipo: 'Licuado / Smoothie', nombre: 'Licuado Verde Detox', precio: 8000, descripcion: 'Espinaca, ananá, manzana verde, limón y toque de jengibre (400 ml).', stock: true },
      { id: 'lp3', tipo: 'Licuado / Smoothie', nombre: 'Smoothie Mango & Maracuyá', precio: 8000, descripcion: 'Pulpa natural de mango, maracuyá y naranja recién exprimida (400 ml).', stock: true },
      { id: 'lp4', tipo: 'Postre Saludable', nombre: 'Yogur Griego con Granola y Fruta', precio: 7000, descripcion: 'Pote con yogur natural, granola casera, miel y frutas frescas de estación.', stock: true },
      { id: 'lp5', tipo: 'Postre Saludable', nombre: 'Ensalada de Frutas Fresca', precio: 7000, descripcion: 'Mix de frutas de estación cortadas en el día, lista para disfrutar.', stock: true },
      { id: 'lp6', tipo: 'Postre Saludable', nombre: 'Budín Integral de Banana y Nueces', precio: 7000, descripcion: 'Porción individual casera con harina integral y sin azúcares refinados.', stock: true }
    ],
    ingredientes: [
      ['101', 'Lechuga fresca', 'base'], ['102', 'Rúcula', 'base'], ['103', 'Mix de rúcula y lechuga', 'base'],
      ['201', 'Pollo', 'proteina'], ['202', 'Atún', 'proteina'], ['203', 'Huevo', 'proteina'],
      ['204', 'Queso', 'proteina'], ['205', 'Jamón', 'proteina'], ['206', 'Panceta', 'proteina'],
      ['301', 'Garbanzos', 'legumbre'], ['302', 'Porotos', 'legumbre'], ['303', 'Lentejas', 'legumbre'],
      ['304', 'Arvejas', 'legumbre'], ['305', 'Choclo', 'legumbre'], ['306', 'Brócoli', 'legumbre'], ['307', 'Calabaza', 'legumbre'],
      ['401', 'Zanahoria', 'vegetal'], ['402', 'Tomates cherry', 'vegetal'], ['403', 'Remolacha', 'vegetal'],
      ['404', 'Repollo', 'vegetal'], ['405', 'Pepino', 'vegetal'], ['406', 'Espinaca', 'vegetal'],
      ['501', 'Castaña de cajú', 'fruto'], ['502', 'Nueces', 'fruto'], ['503', 'Almendras', 'fruto'],
      ['504', 'Pasas de uva', 'fruto'], ['505', 'Maíz tostado', 'fruto'], ['506', 'Maní japonés saborizado', 'fruto'], ['507', 'Quinoa', 'fruto'],
      ['601', 'Mango', 'especial'], ['602', 'Palta', 'especial'], ['603', 'Queso azul', 'especial'], ['604', 'Lomo feteado', 'especial'],
      ['701', 'Dip de la casa', 'aderezo'], ['702', 'Aceite, limón y sal', 'aderezo'], ['703', 'Salsa César', 'aderezo'],
      ['704', 'Salsa de garbanzos', 'aderezo'], ['705', 'Tradicionales (ketchup, mayonesa y mostaza)', 'aderezo']
    ].map(([id, nombre, categoria]) => ({ id, nombre, categoria, stock: true })),
    adicionales: [
      { id: 'add_prot', nombre: 'Proteína adicional', precio: 2000, ayuda: 'Especificar cuál (ej: Pollo, Atún, Jamón...)' },
      { id: 'add_ader', nombre: 'Aderezo adicional', precio: 2000, ayuda: 'Especificar cuál (ej: Salsa César, Dip...)' },
      { id: 'add_esp', nombre: 'Ingredientes especiales', precio: 2000, ayuda: 'Especificar cuál (ej: Palta, Mango, Lomo...)' },
      { id: 'add_frut', nombre: 'Frutos secos', precio: 2000, ayuda: 'Especificar cuál (ej: Castañas, Nueces...)' },
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
    return !['NO', 'N', 'FALSE', 'FALSO', '0', 'AGOTADO', 'SIN STOCK', 'NO DISPONIBLE'].includes(s);
  }
  function esLicuado(p) {
    const t = txt(p && p.tipo).toLowerCase();
    const n = txt(p && p.nombre).toLowerCase();
    return t.includes('licuado') || t.includes('smoothie') || n.includes('licuado') || n.includes('smoothie');
  }
  function corto(v, max) { return txt(v).replace(/[\r\n]+/g, ' ').slice(0, max); }
  function pesos(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }
  function errorUsuario(msg) { const e = new Error(msg); e.usuario = true; return e; }

  // ---------- planilla -> catálogo ----------
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
      menus: (t.menus ? filas(t.menus).map(r => ({ id: txt(r.id), codigo: txt(r.codigo), nombre: txt(r.nombre || r[''] || 'Menú del día'), descripcion: txt(r.descripcion), stock: hayStock(r.stock) })) : d.menus).filter(x => x.stock),
      casa: (t.casa ? filas(t.casa).map(r => ({ id: txt(r.id), codigo: txt(r.codigo), nombre: txt(r.nombre), precio: num(r.precio, 0), descripcion: txt(r.descripcion), stock: hayStock(r.stock) })).filter(x => x.precio > 0) : d.casa).filter(x => x.stock),
      wraps: (t.wraps ? filas(t.wraps).map(r => ({ id: txt(r.id), nombre: txt(r.nombre), precio: num(r.precio, 0), descripcion: txt(r.descripcion), stock: hayStock(r.stock) })).filter(x => x.precio > 0) : d.wraps).filter(x => x.stock),
      licuadosPostres: (t.licuadosPostres ? filas(t.licuadosPostres).map(r => ({ id: txt(r.id), tipo: txt(r.tipo || 'Licuados y Postres'), nombre: txt(r.nombre), precio: num(r.precio, 0), descripcion: txt(r.descripcion), stock: hayStock(r.stock) })).filter(x => x.precio > 0) : d.licuadosPostres).filter(x => x.stock),
      ingredientes: (t.ingredientes ? filas(t.ingredientes).map(r => ({ id: txt(r.id), nombre: txt(r.nombre), categoria: txt(r.categoria).toLowerCase(), stock: hayStock(r.stock) })).filter(x => CATEGORIAS.includes(x.categoria)) : d.ingredientes).filter(x => x.stock),
      adicionales: t.adicionales ? filas(t.adicionales).map(r => ({ id: txt(r.id), nombre: txt(r.nombre), precio: num(r.precio, 0), ayuda: txt(r.ayuda) || 'Especificar cuál' })) : d.adicionales
    };
  }

  // ---------- precio de una línea del carrito ----------
  function calcularItem(cat, it, estadoPromo) {
    const cfg = cat.config;
    if (!it || typeof it !== 'object') throw errorUsuario('Hay un ítem inválido en el pedido.');

    if (it.tipo === 'menu' || it.tipo === 'casa' || it.tipo === 'wrap') {
      const lista = it.tipo === 'menu' ? cat.menus : it.tipo === 'casa' ? cat.casa : cat.wraps;
      const p = lista.find(x => x.id === txt(it.id));
      if (!p) throw errorUsuario('Un plato de tu pedido ya no está en el menú. Quitalo y volvé a agregarlo.');
      if (!p.stock) throw errorUsuario(`"${p.nombre}" se quedó sin stock. Quitalo del pedido para continuar.`);
      if (it.tipo === 'menu') return { titulo: 'Menú del día: ' + p.nombre, detalle: p.codigo, precio: cfg.precioMenu };
      if (it.tipo === 'casa') return { titulo: 'Ensalada ' + p.nombre, detalle: 'Creación de la casa ' + p.codigo, precio: p.precio };
      return { titulo: p.nombre, detalle: 'Wrap / Omelette fresco', precio: p.precio };
    }

    if (it.tipo === 'licuado_postre' || it.tipo === 'lp') {
      const lista = cat.licuadosPostres || DEFAULTS.licuadosPostres;
      const p = lista.find(x => x.id === txt(it.id));
      if (!p) throw errorUsuario('Un licuado o postre de tu pedido ya no está disponible.');
      if (!p.stock) throw errorUsuario(`"${p.nombre}" se quedó sin stock. Quitalo del pedido para continuar.`);
      const usaCupoPromo = esLicuado(p) && estadoPromo && estadoPromo.cupos > 0;
      if (usaCupoPromo) estadoPromo.cupos -= 1;
      const precioFinal = usaCupoPromo ? PRECIO_LICUADO_PROMO : p.precio;
      return {
        titulo: p.nombre + (usaCupoPromo ? ' [Promo con plato $6.000]' : ''),
        detalle: p.tipo,
        precio: precioFinal
      };
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
    const estadoPromo = {
      cupos: items.filter(it => it && ['menu', 'casa', 'wrap', 'arma'].includes(it.tipo)).length
    };
    const lineas = items.map(it => calcularItem(cat, it, estadoPromo));
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

  return { DEFAULTS, CATEGORIAS, PRECIO_LICUADO_PROMO, normalizar, calcular, calcularItem, resumen, limpiarCliente, pesos };
});

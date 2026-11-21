/* Tu Vianda Sana — Nutri-Visor (Capa Nutricional Desacoplada, Solo Lectura)
   - NO modifica precios, carrito, pagos, transferencias, WhatsApp ni Google Sheets.
   - Si algo falla, queda aislado en try/catch para que la app siga vendiendo igual.
   - Valores aproximados de referencia para viandas de aprox. 360 a 450 gramos. */
(function () {
  'use strict';

  const WEIGHT_LABEL = '360 a 450 g';
  const APPROX_NOTICE =
    'La cantidad de calorías a consumir es un valor aproximado en base al peso habitual de cada vianda (360–450 g) y a las cantidades de ingredientes que conforman tu comida.';

  const GOALS = [
    { id: 'light', label: 'Liviano', kcal: 450, icon: '🌿' },
    { id: 'balanced', label: 'Equilibrado', kcal: 650, icon: '⚖️' },
    { id: 'power', label: 'Power / Fit', kcal: 850, icon: '💪' },
    { id: 'free', label: 'Solo mirar', kcal: null, icon: '✨' }
  ];

  // Tabla de referencia por ID (porción estándar 360–450 g)
  const REF_BY_ID = {
    // Ensaladas de la casa
    h1: { kcal: 515, p: 32, c: 54, f: 18, tag: '⚡ Integral & Saciante', satiety: 'Muy alta' },
    h2: { kcal: 530, p: 31, c: 28, f: 32, tag: '🌴 Gourmet Tropical', satiety: 'Alta' },
    h3: { kcal: 485, p: 39, c: 31, f: 22, tag: '💪 Alta en Proteína', satiety: 'Muy alta' },
    h4: { kcal: 520, p: 35, c: 24, f: 31, tag: '🧀 Clásica Intensa', satiety: 'Alta' },
    h5: { kcal: 430, p: 32, c: 28, f: 19, tag: '🌿 Fresca & Clásica', satiety: 'Alta' },
    h6: { kcal: 395, p: 34, c: 24, f: 17, tag: '🐟 Liviana & Proteica', satiety: 'Alta' },
    h7: { kcal: 545, p: 30, c: 29, f: 34, tag: '🥭 Tropical Crunch', satiety: 'Muy alta' },
    h8: { kcal: 465, p: 33, c: 34, f: 21, tag: '🌿 Fresca & Balanceada', satiety: 'Alta' },
    h9: { kcal: 550, p: 30, c: 25, f: 36, tag: '🥑 Brisa Gourmet', satiety: 'Muy alta' },
    h10: { kcal: 540, p: 37, c: 44, f: 23, tag: '💪 Protein Crunch', satiety: 'Muy alta' },
    h11: { kcal: 460, p: 36, c: 34, f: 18, tag: '💪 Fit & Fresh', satiety: 'Alta' },
    h12: { kcal: 525, p: 33, c: 45, f: 23, tag: '🥑 Crunchy Deli', satiety: 'Muy alta' },
    h13: { kcal: 390, p: 30, c: 22, f: 19, tag: '🥒 Súper Refrescante', satiety: 'Alta' },
    h14: { kcal: 445, p: 34, c: 32, f: 19, tag: '🌿 Vital & Casera', satiety: 'Alta' },
    h15: { kcal: 535, p: 36, c: 22, f: 34, tag: '👑 Gourmet de Autoría', satiety: 'Alta' },
    // Wraps, Omelettes y Tequeños
    w1: { kcal: 440, p: 31, c: 39, f: 16, tag: '🌿 Liviano & Proteico', satiety: 'Alta' },
    w2: { kcal: 550, p: 34, c: 41, f: 27, tag: '🥓 Clásico Saciante', satiety: 'Muy alta' },
    o1: { kcal: 410, p: 32, c: 22, f: 21, tag: '⚡ Proteico & Fit', satiety: 'Alta' },
    t1: { kcal: 570, p: 20, c: 54, f: 30, tag: '🧀 Gustito Artesanal', satiety: 'Media-alta' },
    t2: { kcal: 1140, p: 40, c: 108, f: 60, tag: '🤝 Para Compartir', satiety: 'Muy alta' },
    // Ingredientes Armá tu Ensalada (aporte estimado por porción en bowl)
    '101': { kcal: 15, p: 1, c: 3, f: 0 },
    '102': { kcal: 18, p: 2, c: 2, f: 0 },
    '103': { kcal: 16, p: 1, c: 3, f: 0 },
    '201': { kcal: 145, p: 27, c: 0, f: 3 },
    '202': { kcal: 115, p: 25, c: 0, f: 1 },
    '203': { kcal: 78, p: 6, c: 1, f: 5 },
    '204': { kcal: 110, p: 7, c: 1, f: 9 },
    '205': { kcal: 70, p: 10, c: 1, f: 3 },
    '206': { kcal: 135, p: 8, c: 0, f: 11 },
    '301': { kcal: 95, p: 5, c: 16, f: 1 },
    '302': { kcal: 85, p: 6, c: 15, f: 0 },
    '303': { kcal: 80, p: 6, c: 14, f: 0 },
    '304': { kcal: 55, p: 4, c: 10, f: 0 },
    '305': { kcal: 65, p: 2, c: 14, f: 1 },
    '306': { kcal: 28, p: 2, c: 5, f: 0 },
    '307': { kcal: 38, p: 1, c: 9, f: 0 },
    '401': { kcal: 25, p: 1, c: 6, f: 0 },
    '402': { kcal: 20, p: 1, c: 4, f: 0 },
    '403': { kcal: 32, p: 1, c: 7, f: 0 },
    '404': { kcal: 18, p: 1, c: 4, f: 0 },
    '405': { kcal: 12, p: 0, c: 3, f: 0 },
    '406': { kcal: 14, p: 2, c: 2, f: 0 },
    '501': { kcal: 115, p: 4, c: 6, f: 9 },
    '502': { kcal: 130, p: 3, c: 3, f: 13 },
    '503': { kcal: 115, p: 4, c: 4, f: 10 },
    '504': { kcal: 75, p: 1, c: 20, f: 0 },
    '505': { kcal: 90, p: 2, c: 14, f: 3 },
    '506': { kcal: 105, p: 4, c: 10, f: 6 },
    '507': { kcal: 85, p: 3, c: 15, f: 1 },
    '601': { kcal: 55, p: 1, c: 14, f: 0 },
    '602': { kcal: 120, p: 2, c: 6, f: 11 },
    '603': { kcal: 125, p: 7, c: 1, f: 10 },
    '604': { kcal: 130, p: 22, c: 0, f: 4 },
    '701': { kcal: 85, p: 2, c: 3, f: 7 },
    '702': { kcal: 60, p: 0, c: 1, f: 7 },
    '703': { kcal: 115, p: 2, c: 2, f: 11 },
    '704': { kcal: 75, p: 3, c: 7, f: 4 },
    '705': { kcal: 110, p: 1, c: 6, f: 9 },
    // Adicionales
    add_prot: { kcal: 115, p: 20, c: 1, f: 3 },
    add_ader: { kcal: 85, p: 2, c: 3, f: 7 },
    add_esp: { kcal: 110, p: 6, c: 5, f: 8 },
    add_frut: { kcal: 110, p: 3, c: 6, f: 9 },
    add_veg: { kcal: 22, p: 1, c: 5, f: 0 },
    add_leg: { kcal: 75, p: 4, c: 13, f: 1 }
  };

  // Aderezos del Paso 7 (por nombre)
  const DRESSING_BY_NAME = {
    'Dip de la casa (incluido)': { kcal: 85, p: 2, c: 3, f: 7, short: 'Dip de la casa' },
    'Mayonesa, ketchup y mostaza': { kcal: 110, p: 1, c: 6, f: 9, short: 'Mayonesa, ketchup y mostaza' },
    'Aceite, limón y sal': { kcal: 60, p: 0, c: 1, f: 7, short: 'Aceite, limón y sal' }
  };

  let nvState = {
    enabled: true,
    goalId: 'balanced',
    lastSaladKcal: 0
  };

  try {
    const saved = JSON.parse(localStorage.getItem('tvs_nutrivisor_v1') || 'null');
    if (saved && typeof saved === 'object') {
      if (typeof saved.enabled === 'boolean') nvState.enabled = saved.enabled;
      if (GOALS.some((g) => g.id === saved.goalId)) nvState.goalId = saved.goalId;
    }
  } catch (e) {}

  function saveNvState() {
    try {
      localStorage.setItem('tvs_nutrivisor_v1', JSON.stringify({
        enabled: nvState.enabled,
        goalId: nvState.goalId
      }));
    } catch (e) {}
  }

  function norm(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function getAppState() {
    return typeof window.__TVS_GET_STATE__ === 'function' ? window.__TVS_GET_STATE__() : null;
  }

  function getGoal() {
    return GOALS.find((g) => g.id === nvState.goalId) || GOALS[1];
  }

  // Estimador inteligente para platos que cambian a diario en Google Sheets (Menús, Licuados, Postres, etc.)
  function estimateNutrition(item, kind) {
    if (!item) return { kcal: 460, p: 28, c: 42, f: 18, tag: '⚖️ Equilibrado', satiety: 'Alta' };

    // 1. Si el dueño algún día agrega columna opcional "kcal" en Google Sheets, la respetamos primero
    const sheetKcal = Number(String(item.kcal || '').replace(/[^\d]/g, ''));
    if (sheetKcal > 0 && sheetKcal < 4000) {
      return {
        kcal: sheetKcal,
        p: Math.round((sheetKcal * 0.25) / 4),
        c: Math.round((sheetKcal * 0.43) / 4),
        f: Math.round((sheetKcal * 0.32) / 9),
        tag: sheetKcal < 420 ? '🌿 Liviano' : sheetKcal > 600 ? '🔥 Power' : '⚖️ Equilibrado',
        satiety: sheetKcal > 500 ? 'Muy alta' : 'Alta'
      };
    }

    // 2. Búsqueda exacta por ID (ensaladas de la casa, wraps, ingredientes, adicionales)
    const idKey = String(item.id || '').trim();
    if (kind !== 'menu' && kind !== 'pl' && REF_BY_ID[idKey]) {
      return REF_BY_ID[idKey];
    }

    const text = norm((item.nombre || '') + ' ' + (item.descripcion || '') + ' ' + (item.tipo || ''));

    // 3. Licuados y Postres
    if (kind === 'pl' || text.includes('licuado') || text.includes('smoothie') || text.includes('yogur') || text.includes('gelatina') || text.includes('postre')) {
      if (text.includes('gelatina')) return { kcal: 65, p: 2, c: 15, f: 0, tag: '🪶 Súper Liviano', satiety: 'Ligera' };
      if (text.includes('choco') && text.includes('banana')) return { kcal: 295, p: 11, c: 49, f: 6, tag: '⚡ Energía & Avena', satiety: 'Alta' };
      if (text.includes('avena') && (text.includes('fresa') || text.includes('frutilla') || text.includes('banana'))) return { kcal: 265, p: 10, c: 44, f: 5, tag: '🍓 Cremoso Fit', satiety: 'Alta' };
      if (text.includes('yogur') || text.includes('yogurt') || text.includes('yogourt')) {
        if (text.includes('power') || (text.includes('frutos secos') && text.includes('fruta'))) return { kcal: 290, p: 17, c: 26, f: 13, tag: '⚡ Completo', satiety: 'Muy alta' };
        if (text.includes('proteico') || text.includes('frutos secos')) return { kcal: 245, p: 16, c: 14, f: 14, tag: '💪 Alto en Proteína', satiety: 'Alta' };
        if (text.includes('granola') || text.includes('fitness')) return { kcal: 230, p: 14, c: 28, f: 7, tag: '🥣 Crunch Fit', satiety: 'Alta' };
        return { kcal: 185, p: 13, c: 24, f: 4, tag: '🍓 Fresco & Suave', satiety: 'Media-alta' };
      }
      if (text.includes('budin')) return { kcal: 270, p: 7, c: 38, f: 10, tag: '🍌 Casero Integral', satiety: 'Media-alta' };
      if (text.includes('ensalada de fruta')) return { kcal: 140, p: 2, c: 34, f: 0, tag: '🍉 Natural & Fresco', satiety: 'Ligera' };
      if (text.includes('banana') || text.includes('leche') || text.includes('avena')) return { kcal: 240, p: 8, c: 42, f: 4, tag: '⚡ Energético', satiety: 'Alta' };
      if (text.includes('detox') || text.includes('verde') || text.includes('green')) return { kcal: 115, p: 1, c: 28, f: 0, tag: '🍏 Detox & Vit C', satiety: 'Refrescante' };
      if (text.includes('berries') || text.includes('arandano') || text.includes('frambuesa')) return { kcal: 135, p: 2, c: 32, f: 0, tag: '🫐 Antioxidante', satiety: 'Refrescante' };
      return { kcal: 125, p: 2, c: 30, f: 0, tag: '🍍 Refrescante', satiety: 'Refrescante' };
    }

    // 4. Ingredientes nuevos agregados en la planilla
    if (kind === 'ing') {
      const cat = norm(item.categoria);
      if (cat === 'base') return { kcal: 16, p: 1, c: 3, f: 0 };
      if (cat === 'proteina') return { kcal: 115, p: 18, c: 1, f: 4 };
      if (cat === 'legumbre') return { kcal: 70, p: 4, c: 13, f: 1 };
      if (cat === 'vegetal') return { kcal: 20, p: 1, c: 4, f: 0 };
      if (cat === 'fruto') return { kcal: 105, p: 3, c: 7, f: 8 };
      if (cat === 'especial') return { kcal: 110, p: 6, c: 6, f: 7 };
      if (cat === 'aderezo') return { kcal: 85, p: 2, c: 3, f: 7 };
      return { kcal: 60, p: 3, c: 7, f: 2 };
    }

    // 5. Estimador inteligente para Menús del Día y Platos Principales (porción 360–450 g)
    if (text.includes('tequeno') && text.includes('docena') && !text.includes('1/2') && !text.includes('media')) {
      return { kcal: 1140, p: 40, c: 108, f: 60, tag: '🤝 Para Compartir', satiety: 'Muy alta' };
    }
    if (text.includes('tequeno')) return { kcal: 570, p: 20, c: 54, f: 30, tag: '🧀 Gustito Artesanal', satiety: 'Media-alta' };
    if (text.includes('papas fritas') || text.includes('tex-mex') || text.includes('tex mex')) {
      return { kcal: 650, p: 36, c: 55, f: 31, tag: '🔥 Power & Saciante', satiety: 'Muy alta' };
    }
    if (text.includes('sorrentino') || text.includes('raviol') || text.includes('lasana') || text.includes('lasagna') || text.includes('canelon')) {
      return { kcal: 610, p: 30, c: 66, f: 24, tag: '🍝 Casero & Saciante', satiety: 'Muy alta' };
    }
    if (text.includes('guiso') || text.includes('lenteja') || text.includes('locro')) {
      return { kcal: 510, p: 29, c: 58, f: 16, tag: '🫘 Nutritivo & Casero', satiety: 'Muy alta' };
    }
    if (text.includes('wok') || text.includes('salteado') || text.includes('arroz')) {
      return { kcal: 525, p: 34, c: 54, f: 18, tag: '💪 Power Proteico', satiety: 'Muy alta' };
    }
    if (text.includes('wrap') && text.includes('palta')) {
      return { kcal: 495, p: 34, c: 40, f: 21, tag: '⚖️ Equilibrado', satiety: 'Alta' };
    }
    if (text.includes('wrap')) {
      return { kcal: 465, p: 31, c: 40, f: 19, tag: '🌯 Fresco & Práctico', satiety: 'Alta' };
    }
    if (text.includes('omelette') || text.includes('omelet')) {
      return { kcal: 410, p: 32, c: 20, f: 22, tag: '⚡ Low Carb & Fit', satiety: 'Alta' };
    }
    if (text.includes('milanesa') || text.includes('napolitana') || text.includes('empanada')) {
      return { kcal: 590, p: 35, c: 50, f: 26, tag: '🔥 Clásico Saciante', satiety: 'Muy alta' };
    }
    if (text.includes('tarta') || text.includes('pastel')) {
      return { kcal: 520, p: 26, c: 46, f: 25, tag: '🥧 Casero', satiety: 'Alta' };
    }
    if (text.includes('fideo') || text.includes('tallarin') || text.includes('pasta') || text.includes('noqui')) {
      return { kcal: 540, p: 24, c: 68, f: 18, tag: '🍝 Energía', satiety: 'Alta' };
    }
    if (text.includes('pollo') || text.includes('pechuga') || text.includes('atun') || text.includes('pescado')) {
      return { kcal: 470, p: 38, c: 34, f: 19, tag: '💪 Alto en Proteína', satiety: 'Muy alta' };
    }
    if (text.includes('carne') || text.includes('lomo') || text.includes('bife') || text.includes('cerdo')) {
      return { kcal: 545, p: 37, c: 38, f: 26, tag: '🔥 Proteico & Saciante', satiety: 'Muy alta' };
    }
    return { kcal: 490, p: 30, c: 46, f: 20, tag: '⚖️ Equilibrado', satiety: 'Alta' };
  }

  function getSaladStats(appState) {
    let kcal = 0, p = 0, c = 0, f = 0;
    const picked = (appState.armaSelection || [])
      .map((id) => (appState.catalog.ingredientes || []).find((i) => i.id === id))
      .filter(Boolean)
      .map((ing) => ({ ...ing, ...estimateNutrition(ing, 'ing') }));

    picked.forEach((it) => {
      kcal += it.kcal;
      p += it.p;
      c += it.c;
      f += it.f;
    });

    const dressingObj = DRESSING_BY_NAME[appState.armaAderezo] || DRESSING_BY_NAME['Dip de la casa (incluido)'];
    if (picked.length > 0) {
      kcal += dressingObj.kcal;
      p += dressingObj.p;
      c += dressingObj.c;
      f += dressingObj.f;
    }

    // Extras opcionales en Armá tu Ensalada
    let extrasCount = 0;
    Object.entries(appState.armaAdicionales || {}).forEach(([id, qty]) => {
      if (qty > 0) {
        const ref = REF_BY_ID[id] || { kcal: 75, p: 5, c: 6, f: 4 };
        kcal += ref.kcal * qty;
        p += ref.p * qty;
        c += ref.c * qty;
        f += ref.f * qty;
        extrasCount += qty;
      }
    });

    let badge = '🥗 Elegí tus ingredientes y mirá cómo suma';
    let badgeClass = 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (picked.length > 0) {
      if (p >= 30 && kcal <= 520) {
        badge = '💪 Ensalada Proteica Fitness';
        badgeClass = 'bg-emerald-100 text-emerald-950 border-emerald-300';
      } else if (kcal < 340) {
        badge = '🌿 Ultra Liviana & Detox';
        badgeClass = 'bg-teal-100 text-teal-950 border-teal-300';
      } else if (f >= 22 && c <= 20) {
        badge = '🥑 Bowl Grasas Saludables';
        badgeClass = 'bg-lime-100 text-lime-950 border-lime-300';
      } else if (kcal > 580) {
        badge = '🔥 Power Bowl Saciante';
        badgeClass = 'bg-amber-100 text-amber-950 border-amber-300';
      } else {
        badge = '⚖️ Bowl Equilibrado Gourmet';
        badgeClass = 'bg-emerald-100 text-emerald-950 border-emerald-300';
      }
    }

    return { kcal, p, c, f, picked, dressingObj, count: picked.length, extrasCount, badge, badgeClass };
  }

  function estimateCartItem(cartItem, appState) {
    const key = String(cartItem.key || '');
    const cat = appState.catalog || {};
    if (key.startsWith('menu_')) {
      const m = (cat.menus || []).find((x) => x.id === key.slice(5));
      return estimateNutrition(m || { nombre: cartItem.name, descripcion: cartItem.detail }, 'menu');
    }
    if (key.startsWith('ens_')) {
      const e = (cat.ensaladas || []).find((x) => x.id === key.slice(4));
      return estimateNutrition(e || { nombre: cartItem.name, descripcion: cartItem.detail }, 'casa');
    }
    if (key.startsWith('wrap_')) {
      const w = (cat.wraps || []).find((x) => x.id === key.slice(5));
      return estimateNutrition(w || { nombre: cartItem.name, descripcion: cartItem.detail }, 'wrap');
    }
    if (key.startsWith('pl_')) {
      const p = (cat.postresLicuados || []).find((x) => x.id === key.slice(3));
      return estimateNutrition(p || { nombre: cartItem.name, tipo: cartItem.detail }, 'pl');
    }
    if (key.startsWith('house_ader_')) {
      return { kcal: 85, p: 2, c: 3, f: 7 };
    }
    if (key.startsWith('arma_')) {
      // Estimar desde el detalle guardado en el ítem del carrito
      const detail = String(cartItem.detail || '');
      const mainPart = detail.split('|')[0] || '';
      const names = mainPart.split(',').map((s) => norm(s.trim())).filter(Boolean);
      let kcal = 0, p = 0, c = 0, f = 0;
      names.forEach((n) => {
        const ing = (cat.ingredientes || []).find((i) => norm(i.nombre) === n);
        const est = estimateNutrition(ing || { nombre: n }, 'ing');
        kcal += est.kcal; p += est.p; c += est.c; f += est.f;
      });
      // Aderezo incluido
      const aderMatch = detail.match(/Aderezo:\s*([^|]+)/i);
      const aderName = aderMatch ? aderMatch[1].trim() : 'Dip de la casa (incluido)';
      const dObj = DRESSING_BY_NAME[aderName] || DRESSING_BY_NAME['Dip de la casa (incluido)'];
      kcal += dObj.kcal; p += dObj.p; c += dObj.c; f += dObj.f;
      // Extras si existieran
      const extMatch = detail.match(/Extras:\s*([^|]+)/i);
      if (extMatch) {
        extMatch[1].split(',').forEach((chunk) => {
          const m = chunk.trim().match(/^(\d+)x/i);
          const q = m ? Number(m[1]) : 1;
          kcal += 85 * q; p += 6 * q; c += 6 * q; f += 4 * q;
        });
      }
      return kcal > 0 ? { kcal, p, c, f } : { kcal: 420, p: 26, c: 28, f: 20 };
    }
    return estimateNutrition({ nombre: cartItem.name, descripcion: cartItem.detail }, 'menu');
  }

  function getCartNutriTotals(appState) {
    let totalKcal = 0, totalP = 0, totalC = 0, totalF = 0;
    const items = (appState.cart || []).map((ci) => {
      const est = estimateCartItem(ci, appState);
      const qty = ci.qty || 1;
      totalKcal += est.kcal * qty;
      totalP += est.p * qty;
      totalC += est.c * qty;
      totalF += est.f * qty;
      return { ...ci, unitKcal: est.kcal, lineKcal: est.kcal * qty, est };
    });
    return { items, totalKcal, totalP, totalC, totalF };
  }

  // =========================================================================
  // RENDERIZADO DE LA CAPA VISUAL (100% DESACOPLADA)
  // =========================================================================
  function ensureStyles() {
    if (document.getElementById('nv-styles')) return;
    const style = document.createElement('style');
    style.id = 'nv-styles';
    style.textContent = `
      .nv-gauge-arc { transition: stroke-dashoffset 0.5s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.35s ease; }
      .nv-macro-bar { transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
      .nv-kcal-pop { animation: nvPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      @keyframes nvPop { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      .nv-no-scrollbar::-webkit-scrollbar { display: none; }
      .nv-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
  }

  function renderGoalBar() {
    const host = document.getElementById('nutri-goal-bar-host');
    if (!host) return;

    host.innerHTML = `
      <div class="rounded-2xl bg-white border border-emerald-200/90 px-3.5 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div class="flex items-center gap-2 overflow-x-auto nv-no-scrollbar flex-1 min-w-0">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 shrink-0">🔥 Tu meta de hoy:</span>
          <div class="flex items-center gap-1.5 shrink-0 ${nvState.enabled ? '' : 'opacity-45 pointer-events-none'}">
            ${GOALS.map((g) => {
              const active = g.id === nvState.goalId;
              return `
                <button type="button" data-nv-goal="${g.id}"
                  class="px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }">
                  ${g.icon} ${g.label}${g.kcal ? ` · ${g.kcal}` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
        <button type="button" id="nv-toggle-btn"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border transition cursor-pointer shrink-0 ${
            nvState.enabled
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
          }">
          <span class="w-2 h-2 rounded-full ${nvState.enabled ? 'bg-amber-300' : 'bg-slate-400'}"></span>
          <span>Nutri-Visor: ${nvState.enabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    `;

    host.querySelectorAll('[data-nv-goal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        nvState.goalId = btn.dataset.nvGoal;
        saveNvState();
        refreshAll();
      });
    });

    const toggleBtn = document.getElementById('nv-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        nvState.enabled = !nvState.enabled;
        saveNvState();
        refreshAll();
      });
    }
  }

  function injectCardBadges(appState) {
    // Limpiar badges previos
    document.querySelectorAll('.nv-card-badge').forEach((el) => el.remove());
    if (!nvState.enabled) return;

    const goal = getGoal();

    function attach(selector, attr, list, kind) {
      document.querySelectorAll(selector).forEach((btn) => {
        const id = btn.getAttribute(attr);
        const item = (list || []).find((x) => String(x.id) === String(id));
        if (!item) return;
        const card = btn.closest('.card-hover');
        if (!card) return;
        const topBlock = card.firstElementChild;
        if (!topBlock) return;

        const est = estimateNutrition(item, kind);
        const pct = goal.kcal ? Math.round((est.kcal / goal.kcal) * 100) : null;

        const wrap = document.createElement('div');
        wrap.className = 'nv-card-badge mt-2.5 flex flex-wrap items-center gap-1.5';
        wrap.innerHTML = `
          <button type="button" class="nv-open-dish inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-[11px] font-extrabold transition cursor-pointer">
            <span>🔥 ~${est.kcal} kcal aprox.</span>
            <span class="text-emerald-700 font-semibold">· Ver macros</span>
          </button>
          <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">${est.tag}</span>
          ${pct !== null ? `<span class="text-[10px] font-bold text-emerald-700">${pct}% de tu meta</span>` : ''}
        `;
        wrap.querySelector('.nv-open-dish').addEventListener('click', (ev) => {
          ev.stopPropagation();
          openDishModal(item, est);
        });
        topBlock.appendChild(wrap);
      });
    }

    attach('[data-add-menu]', 'data-add-menu', appState.catalog.menus, 'menu');
    attach('[data-add-ensalada]', 'data-add-ensalada', appState.catalog.ensaladas, 'casa');
    attach('[data-add-wrap]', 'data-add-wrap', appState.catalog.wraps, 'wrap');
    attach('[data-add-pl]', 'data-add-pl', appState.catalog.postresLicuados, 'pl');
  }

  function injectSaladLiveGauge(appState) {
    const ingContainer = document.getElementById('ingredientes-container');
    if (!ingContainer) return;

    let gaugeHost = document.getElementById('nv-salad-gauge-host');
    if (!gaugeHost) {
      gaugeHost = document.createElement('div');
      gaugeHost.id = 'nv-salad-gauge-host';
      ingContainer.parentNode.insertBefore(gaugeHost, ingContainer);
    }

    // Limpiar micro-badges previos en chips
    document.querySelectorAll('.nv-chip-kcal').forEach((el) => el.remove());

    if (!nvState.enabled) {
      gaugeHost.innerHTML = '';
      return;
    }

    const stats = getSaladStats(appState);
    const goal = getGoal();
    const target = goal.kcal || 650;
    const ratio = Math.min(stats.kcal / target, 1);
    const arcLen = 213.6;
    const offset = arcLen * (1 - ratio);

    let stroke = '#10b981';
    if (stats.kcal === 0) stroke = '#cbd5e1';
    else if (stats.kcal < 340) stroke = '#14b8a6';
    else if (stats.kcal > 600) stroke = '#f59e0b';

    const totalG = Math.max(stats.p + stats.c + stats.f, 1);
    const pPct = Math.round((stats.p / totalG) * 100);
    const cPct = Math.round((stats.c / totalG) * 100);
    const fPct = Math.round((stats.f / totalG) * 100);
    const popClass = stats.kcal !== nvState.lastSaladKcal ? 'nv-kcal-pop' : '';
    nvState.lastSaladKcal = stats.kcal;

    gaugeHost.innerHTML = `
      <div class="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 text-white p-4 sm:p-5 shadow-md border border-emerald-800">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="relative w-44 h-24 shrink-0 flex flex-col items-center justify-end">
            <svg viewBox="0 0 160 92" class="w-44 h-24 overflow-visible">
              <path d="M 12 82 A 68 68 0 0 1 148 82" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="12" stroke-linecap="round" />
              <path d="M 12 82 A 68 68 0 0 1 148 82" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${arcLen}" stroke-dashoffset="${offset.toFixed(1)}" class="nv-gauge-arc" />
            </svg>
            <div class="absolute bottom-0 text-center">
              <div class="text-3xl font-extrabold tracking-tight tabular-nums leading-none ${popClass}">~${stats.kcal}</div>
              <div class="text-[11px] text-emerald-300 font-semibold mt-0.5">kcal aprox.</div>
            </div>
          </div>

          <div class="flex-1 w-full space-y-2.5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold border ${stats.badgeClass}">
                ${stats.badge}
              </span>
              ${goal.kcal && stats.kcal > 0 ? `<span class="text-xs font-bold text-amber-300">${Math.round((stats.kcal / goal.kcal) * 100)}% de tu meta (${goal.kcal})</span>` : ''}
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div class="bg-white/10 rounded-xl p-2">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-emerald-200">Proteína</span>
                  <span class="font-extrabold tabular-nums">${stats.p}g</span>
                </div>
                <div class="h-1.5 bg-white/15 rounded-full mt-1 overflow-hidden">
                  <div class="h-full bg-emerald-400 rounded-full nv-macro-bar" style="width:${stats.count ? pPct : 0}%"></div>
                </div>
              </div>
              <div class="bg-white/10 rounded-xl p-2">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-emerald-200">Carbos</span>
                  <span class="font-extrabold tabular-nums">${stats.c}g</span>
                </div>
                <div class="h-1.5 bg-white/15 rounded-full mt-1 overflow-hidden">
                  <div class="h-full bg-sky-400 rounded-full nv-macro-bar" style="width:${stats.count ? cPct : 0}%"></div>
                </div>
              </div>
              <div class="bg-white/10 rounded-xl p-2">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-emerald-200">Grasas</span>
                  <span class="font-extrabold tabular-nums">${stats.f}g</span>
                </div>
                <div class="h-1.5 bg-white/15 rounded-full mt-1 overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full nv-macro-bar" style="width:${stats.count ? fPct : 0}%"></div>
                </div>
              </div>
            </div>

            <div class="text-[11px] text-emerald-100/90 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 leading-snug">
              ℹ️ ${APPROX_NOTICE}
            </div>
          </div>
        </div>
      </div>
    `;

    // Agregar micro-pill +kcal en cada chip de ingrediente
    document.querySelectorAll('[data-toggle-ing]').forEach((btn) => {
      const id = btn.getAttribute('data-toggle-ing');
      const ing = (appState.catalog.ingredientes || []).find((i) => String(i.id) === String(id));
      if (!ing) return;
      const est = estimateNutrition(ing, 'ing');
      const active = (appState.armaSelection || []).includes(id);
      const pill = document.createElement('span');
      pill.className = `nv-chip-kcal ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
        active ? 'bg-emerald-800/80 text-amber-200' : 'bg-white text-emerald-800 border border-lime-200'
      }`;
      pill.textContent = `+${est.kcal}`;
      btn.appendChild(pill);
    });

    // Agregar micro-pill +kcal en Paso 7 (aderezos)
    document.querySelectorAll('[data-arma-aderezo]').forEach((btn) => {
      const name = btn.getAttribute('data-arma-aderezo');
      const dObj = DRESSING_BY_NAME[name];
      if (!dObj) return;
      const active = appState.armaAderezo === name;
      const pill = document.createElement('span');
      pill.className = `nv-chip-kcal ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
        active ? 'bg-emerald-800/80 text-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
      }`;
      pill.textContent = `+${dObj.kcal} kcal`;
      btn.appendChild(pill);
    });
  }

  function injectBottomPill(appState) {
    const bar = document.querySelector('#floating-cart-bar > div');
    if (!bar) return;

    let pill = document.getElementById('nv-balance-pill');
    if (!nvState.enabled) {
      if (pill) pill.remove();
      return;
    }

    const totals = getCartNutriTotals(appState);
    const goal = getGoal();
    const target = goal.kcal || 650;
    const ratio = Math.min(totals.totalKcal / target, 1);
    const circ = 87.96; // r=14
    const strokeColor = goal.kcal && totals.totalKcal > goal.kcal * 1.15 ? '#fbbf24' : '#34d399';

    if (!pill) {
      pill = document.createElement('button');
      pill.id = 'nv-balance-pill';
      pill.type = 'button';
      pill.className = 'flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-white px-3 py-2 rounded-2xl shadow-md border border-emerald-800 transition cursor-pointer shrink-0';
      pill.addEventListener('click', () => openBalanceModal());
      bar.insertBefore(pill, bar.firstChild);
    }

    pill.innerHTML = `
      <div class="relative w-8 h-8 shrink-0">
        <svg viewBox="0 0 34 34" class="w-8 h-8 -rotate-90">
          <circle cx="17" cy="17" r="14" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="3" />
          <circle cx="17" cy="17" r="14" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${(circ * (1 - ratio)).toFixed(1)}" class="nv-gauge-arc" />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-[11px]">🔥</span>
      </div>
      <div class="text-left leading-tight">
        <div class="text-[10px] text-emerald-300 font-bold">Tu Balance</div>
        <div class="text-xs sm:text-sm font-extrabold tabular-nums">~${totals.totalKcal} <span class="text-[10px] font-medium text-emerald-200">kcal</span></div>
      </div>
    `;
  }

  function injectFooterDisclaimer() {
    const main = document.querySelector('main');
    if (!main) return;
    let box = document.getElementById('nv-footer-disclaimer');
    if (!nvState.enabled) {
      if (box) box.remove();
      return;
    }
    if (!box) {
      box = document.createElement('div');
      box.id = 'nv-footer-disclaimer';
      box.className = 'rounded-2xl bg-white/90 border border-emerald-100 p-3.5 text-xs text-emerald-800/90 flex items-start gap-2.5 shadow-xs';
      main.appendChild(box);
    }
    box.innerHTML = `
      <span class="text-base leading-none mt-0.5">ℹ️</span>
      <p><strong class="text-emerald-950">Calorías aproximadas (${WEIGHT_LABEL}):</strong> ${APPROX_NOTICE}</p>
    `;
  }

  // =========================================================================
  // MODALES INDEPENDIENTES DEL NUTRI-VISOR
  // =========================================================================
  function getModalRoot() {
    let root = document.getElementById('nv-modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'nv-modal-root';
      root.className = 'fixed inset-0 z-50 hidden bg-emerald-950/55 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4';
      root.innerHTML = '<div id="nv-modal-panel" class="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 max-h-[88vh] overflow-y-auto"></div>';
      root.addEventListener('click', (e) => {
        if (e.target === root) closeNvModal();
      });
      document.body.appendChild(root);
    }
    return root;
  }

  function closeNvModal() {
    const root = document.getElementById('nv-modal-root');
    if (root) root.classList.add('hidden');
  }

  function openDishModal(item, est) {
    const root = getModalRoot();
    const panel = document.getElementById('nv-modal-panel');
    const goal = getGoal();
    const pctGoal = goal.kcal ? Math.round((est.kcal / goal.kcal) * 100) : null;

    const totalG = Math.max(est.p + est.c + est.f, 1);
    const pPct = Math.round((est.p / totalG) * 100);
    const cPct = Math.round((est.c / totalG) * 100);
    const fPct = Math.max(0, 100 - pPct - cPct);

    const circ = 251.3;
    const pLen = (pPct / 100) * circ;
    const cLen = (cPct / 100) * circ;
    const fLen = (fPct / 100) * circ;

    panel.innerHTML = `
      <div class="p-5 sm:p-6 space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">${est.tag || '🥗 Tu Vianda Sana'}</span>
            <h3 class="text-lg font-extrabold text-emerald-950 mt-1">${item.nombre}</h3>
            <p class="text-xs text-slate-500">Valor aproximado · Viandas de aprox. ${WEIGHT_LABEL}</p>
          </div>
          <button type="button" data-nv-close class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer">✕</button>
        </div>

        <div class="bg-emerald-50/80 rounded-2xl p-4 flex items-center gap-4 border border-emerald-100">
          <div class="relative w-26 h-26 shrink-0">
            <svg viewBox="0 0 100 100" class="w-24 h-24 -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" stroke-width="11" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" stroke-width="11" stroke-dasharray="${pLen.toFixed(1)} ${circ}" stroke-dashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#38bdf8" stroke-width="11" stroke-dasharray="${cLen.toFixed(1)} ${circ}" stroke-dashoffset="${(-pLen).toFixed(1)}" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" stroke-width="11" stroke-dasharray="${fLen.toFixed(1)} ${circ}" stroke-dashoffset="${(-(pLen + cLen)).toFixed(1)}" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-lg font-extrabold text-emerald-950 tabular-nums">~${est.kcal}</span>
              <span class="text-[9px] font-bold text-emerald-700 uppercase">kcal aprox.</span>
            </div>
          </div>
          <div class="flex-1 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 font-semibold text-slate-700"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Proteínas</span>
              <span class="font-extrabold text-emerald-950">${est.p} g (${pPct}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 font-semibold text-slate-700"><span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>Carbohidratos</span>
              <span class="font-extrabold text-emerald-950">${est.c} g (${cPct}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 font-semibold text-slate-700"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Grasas</span>
              <span class="font-extrabold text-emerald-950">${est.f} g (${fPct}%)</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2.5 text-xs">
          <div class="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <div class="text-[11px] text-slate-500 font-semibold">Saciedad estimada</div>
            <div class="text-sm font-extrabold text-emerald-950 mt-0.5">⚡ ${est.satiety || 'Alta'}</div>
          </div>
          <div class="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <div class="text-[11px] text-slate-500 font-semibold">${pctGoal !== null ? `Meta "${goal.label}"` : 'Ref. diaria (2000 kcal)'}</div>
            <div class="text-sm font-extrabold text-emerald-950 mt-0.5">🎯 ${pctGoal !== null ? pctGoal + '% de tu meta' : Math.round((est.kcal / 2000) * 100) + '% del día'}</div>
          </div>
        </div>

        <div class="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-950 leading-relaxed">
          ℹ️ <strong>Aclaración:</strong> ${APPROX_NOTICE}
        </div>

        <button type="button" data-nv-close class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold cursor-pointer">
          Entendido
        </button>
      </div>
    `;

    panel.querySelectorAll('[data-nv-close]').forEach((b) => b.addEventListener('click', closeNvModal));
    root.classList.remove('hidden');
  }

  function openBalanceModal() {
    const appState = getAppState();
    if (!appState) return;
    const root = getModalRoot();
    const panel = document.getElementById('nv-modal-panel');
    const totals = getCartNutriTotals(appState);
    const goal = getGoal();
    const target = goal.kcal || 650;
    const pct = Math.min(Math.round((totals.totalKcal / target) * 100), 100);
    const diff = goal.kcal ? goal.kcal - totals.totalKcal : null;

    let statusHtml = '';
    if (totals.items.length === 0) {
      statusHtml = '<div class="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center text-xs text-emerald-800">Todavía no agregaste platos a tu pedido. ¡Probá sumar un menú o armar tu ensalada!</div>';
    } else if (diff !== null) {
      if (diff >= 90) {
        statusHtml = `<div class="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-900">🌿 Te quedan ~${diff} kcal dentro de tu meta "${goal.label}" (${goal.kcal} kcal). Ideal si querés sumar un licuado o postre saludable.</div>`;
      } else if (diff >= -80) {
        statusHtml = `<div class="rounded-2xl bg-emerald-100 border border-emerald-300 p-3 text-xs font-bold text-emerald-950">🎯 ¡Muy buen balance! Estás cerca de tu meta "${goal.label}" (${goal.kcal} kcal).</div>`;
      } else {
        statusHtml = `<div class="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs font-bold text-amber-950">🔥 Almuerzo energético (+${Math.abs(diff)} kcal aprox. sobre "${goal.label}"). Ideal para jornadas activas o pedidos compartidos.</div>`;
      }
    }

    panel.innerHTML = `
      <div class="p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-extrabold text-emerald-950">🔥 Tu Balance Nutricional Hoy</h3>
            <p class="text-xs text-slate-500">Suma aproximada según peso (${WEIGHT_LABEL}) e ingredientes</p>
          </div>
          <button type="button" data-nv-close class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer">✕</button>
        </div>

        <div class="bg-emerald-950 text-white rounded-2xl p-4 space-y-3">
          <div class="flex items-end justify-between">
            <div>
              <div class="text-xs text-emerald-300 font-semibold">Total aproximado del pedido</div>
              <div class="text-3xl font-extrabold tabular-nums">~${totals.totalKcal} <span class="text-sm font-medium text-emerald-200">kcal aprox.</span></div>
            </div>
            ${goal.kcal ? `<div class="text-right text-xs text-emerald-200">Meta ${goal.icon}<br/><strong>${goal.kcal} kcal</strong></div>` : ''}
          </div>
          ${goal.kcal ? `
            <div class="h-2.5 bg-white/15 rounded-full overflow-hidden">
              <div class="h-full rounded-full nv-macro-bar ${totals.totalKcal > goal.kcal * 1.15 ? 'bg-amber-400' : 'bg-emerald-400'}" style="width:${pct}%"></div>
            </div>
          ` : ''}
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-white/10 rounded-xl py-2">
              <div class="text-[10px] text-emerald-200 uppercase font-bold">Proteína</div>
              <div class="text-sm font-extrabold">${totals.totalP}g</div>
            </div>
            <div class="bg-white/10 rounded-xl py-2">
              <div class="text-[10px] text-emerald-200 uppercase font-bold">Carbos</div>
              <div class="text-sm font-extrabold">${totals.totalC}g</div>
            </div>
            <div class="bg-white/10 rounded-xl py-2">
              <div class="text-[10px] text-emerald-200 uppercase font-bold">Grasas</div>
              <div class="text-sm font-extrabold">${totals.totalF}g</div>
            </div>
          </div>
          <p class="text-[11px] text-emerald-200/90 pt-1.5 border-t border-white/10 leading-snug">ℹ️ ${APPROX_NOTICE}</p>
        </div>

        ${statusHtml}

        ${totals.items.length > 0 ? `
          <div class="space-y-1">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Desglose aproximado</div>
            <div class="rounded-2xl border border-slate-200 divide-y divide-slate-100 px-3.5">
              ${totals.items.map((it) => `
                <div class="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div class="min-w-0">
                    <div class="font-bold text-emerald-950 truncate">${it.qty}x ${it.name}</div>
                    ${it.detail ? `<div class="text-[11px] text-slate-500 truncate">${it.detail}</div>` : ''}
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold tabular-nums shrink-0">~${it.lineKcal} kcal</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <button type="button" data-nv-close class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold cursor-pointer">
          Seguir eligiendo
        </button>
      </div>
    `;

    panel.querySelectorAll('[data-nv-close]').forEach((b) => b.addEventListener('click', closeNvModal));
    root.classList.remove('hidden');
  }

  function refreshAll() {
    try {
      ensureStyles();
      const appState = getAppState();
      if (!appState) return;
      renderGoalBar();
      injectCardBadges(appState);
      injectSaladLiveGauge(appState);
      injectBottomPill(appState);
      injectFooterDisclaimer();
    } catch (e) {
      // Aislado: nunca interrumpe la app principal
    }
  }

  window.NutriVisor = { refresh: refreshAll };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshAll);
  } else {
    refreshAll();
  }
})();

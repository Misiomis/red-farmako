/* =========================================================
   Red Farmako · Pensando en vos
   Toda la información editable está en la sección CONFIG.
   ========================================================= */

/* ---------------- CONFIG: RUTAS DE IMÁGENES ---------------- */

// Carpeta base de todas las imágenes. En la PC la carpeta se llama "img" (minúscula):
// en un hosting Linux las mayúsculas importan, así que debe coincidir exactamente.
const ASSETS_BASE_PATH = './img/';

// Los originales de img/ miden 6250×6250 px. Para la web se usan copias recortadas y
// livianas en img/web/ (generadas a partir de los originales indicados en cada línea).
const ASSETS = {
  logoHorizontal: 'web/logo-horizontal.png', // ← imagen de perfil-17.png (header)
  logoVertical: 'web/logo-vertical.png',     // ← imagen de perfil-09.png (footer)
  isotipo: 'web/isotipo.png',                // ← recorte de imagen de perfil-17.png (favicon)
  petal: 'web/petalo.png',                   // ← imagen de perfil-13.png (marca de agua)
};

// GIFs de historias destacadas. Si un archivo todavía no está en la carpeta,
// la burbuja muestra un ícono de reemplazo automáticamente.
const asset = path => ASSETS_BASE_PATH + path.split('/').map(encodeURIComponent).join('/');

/* ---------------- CONFIG: SUCURSALES ---------------- */

// Comandante Andresito, Misiones · código de área 3757.
// phone: WhatsApp en formato internacional sin "+" (54 9 3757 + número sin el 15).
// ⚠️ hours: horario comercial ESTIMADO, confirmar con cada sucursal.
//    Índice 0 = domingo … 6 = sábado. null = cerrado. Admite varios tramos por día.
//    Cuando la sucursal está de turno, se muestra abierta 24 h automáticamente.
const BRANCHES = [
  {
    id: 'farmavida',
    name: 'Farma Vida',
    lead: 'Gabriela Knack',
    phone: '5493757627205',
    phoneDisplay: '(03757) 15-627205',
    instagram: 'redfarmako_farmavida',
    address: 'Av. Neuquén (Fte. al Gallego), Comandante Andresito, Misiones',
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Neuquen+Comandante+Andresito+Misiones',
    logoWhite: 'web/farmavida-blanco.png', // ← 14.png
    logoGray: 'web/farmavida-gris.png',    // ← 15.png
    colors: ['#72bd99', '#3bb49c'],
    hours: [null, [['08:00', '21:00']], [['08:00', '21:00']], [['08:00', '21:00']], [['08:00', '21:00']], [['08:00', '21:00']], [['08:30', '13:30']]],
    hoursLabel: 'Lun a Vie 8 a 21 h · Sáb 8:30 a 13:30 h',
  },
  {
    id: 'libertad',
    name: 'Farmacia Libertad',
    lead: 'Claudia Knack',
    phone: '5493757518656',
    phoneDisplay: '(03757) 15-518656',
    instagram: 'redfarmako_farmacialibertad',
    address: 'Av. Libertador s/n, Comandante Andresito, Misiones',
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Libertador+Comandante+Andresito+Misiones',
    logoWhite: 'web/libertad-blanco.png', // ← 22.png
    logoGray: 'web/libertad-gris.png',    // ← 17.png
    colors: ['#3bb49c', '#2a8f7b'],
    hours: [null, [['07:30', '13:00'], ['16:00', '21:00']], [['07:30', '13:00'], ['16:00', '21:00']], [['07:30', '13:00'], ['16:00', '21:00']], [['07:30', '13:00'], ['16:00', '21:00']], [['07:30', '13:00'], ['16:00', '21:00']], [['08:00', '13:00']]],
    hoursLabel: 'Lun a Vie 7:30 a 13 y 16 a 21 h · Sáb 8 a 13 h',
  },
  {
    id: 'central',
    name: 'Farmacia Central',
    lead: 'Gimena Knack',
    // En un afiche figuró también 54937575278702 (parece tener un dígito de más).
    // Si se confirma que es el correcto, reemplazar acá.
    phone: '5493757528702',
    phoneDisplay: '(03757) 15-528702',
    instagram: 'redfarmako_farmaciacentral',
    address: 'Av. Los Pioneros s/n, Comandante Andresito, Misiones',
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Pioneros+Comandante+Andresito+Misiones',
    logoWhite: 'web/central-blanco.png', // ← 13.png
    logoGray: 'web/central-gris.png',    // ← 12.png
    colors: ['#5ea886', '#72bd99'],
    hours: [[['09:00', '13:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']]],
    hoursLabel: 'Lun a Sáb 8 a 22 h · Dom 9 a 13 h',
  },
];
const shortName = b => b.name.replace('Farmacia ', '');

/* ---------------- CONFIG: FARMACIAS DE TURNO (COMANDANTE ANDRESITO) ---------------- */

// Plataforma oficial de turnos de la localidad.
const TURNOS_URL = 'https://farmacias-de-turno.github.io/Farmacias-de-turno/';

// Los turnos comienzan a las 08:00 h y terminan a las 08:00 h del día siguiente.
const DUTY_CHANGE_HOUR = 8;
const AR_UTC_OFFSET = -3; // Argentina (sin horario de verano)

// Rotación continua de 8 farmacias. El ciclo se repite cada 8 días a partir de la
// fecha semilla (1/11/2026 = Central). Verificado contra el cronograma oficial
// (jun–nov 2026). branch: id de BRANCHES si es una sucursal de Red Farmako.
const DUTY_SEED_DATE = '2026-11-01';
// match: cómo se reconoce cada farmacia en el cronograma de la plataforma oficial.
const DUTY_ROTATION = [
  { name: 'Farmacia Central', branch: 'central', address: 'Av. Los Pioneros s/n', phone: '15528702', match: /central/i },
  { name: 'Farmanat', address: 'Av. Ecuador, Quintas Altas (al lado de Librería Acuarela)', phone: '15674723', match: /farmanat/i },
  { name: 'Farma Vida', branch: 'farmavida', address: 'Av. Neuquén (Fte. al Gallego)', phone: '15627205', match: /farma\s*vida/i },
  { name: 'Farmacia Libertad', branch: 'libertad', address: 'Av. Libertador s/n', phone: '15518656', match: /libertad/i },
  { name: 'Farma Fiorella', address: 'Frente a la ex terminal', phone: '15650529', match: /fiorella/i },
  { name: 'Farmacia Vital', address: 'Av. Corrientes y Buenos Aires', phone: '15442816', match: /vital/i },
  { name: 'Farmacia Andresito', address: 'Los Helechos y Pioneros', phone: '15525341', match: /andresito/i },
  { name: 'Farmacia Avenida', address: 'Av. Los Pioneros casi Los Helechos', phone: '15673710', match: /avenida/i },
];
// Excepciones manuales (tienen prioridad sobre todo): 'AAAA-MM-DD' → índice de DUTY_ROTATION.
const DUTY_OVERRIDES = {
  // '2026-12-25': 2,
};
// Sincronización en vivo con la plataforma oficial: si publica un intercambio de turnos,
// esta web lo toma sola. Si no responde, se usa la rotación de 8 días.
const TURNOS_SCHEDULE_URL = TURNOS_URL + 'script.js';

/* ---------------- CONFIG: CATEGORÍAS Y PRODUCTOS ---------------- */

// gif: archivo dentro de ASSETS_BASE_PATH. gifAlt: variante de temporada
// (se usa de septiembre a febrero, primavera/verano en Argentina).
const CATEGORIES = [
  { id: 'faciales', name: 'Faciales y Dermocosmética', short: 'Faciales', gif: 'faciales.gif', icon: '<path d="M12 3c4 3 6 6 6 10a6 6 0 0 1-12 0c0-4 2-7 6-10z"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5"/>' },
  { id: 'maquillaje', name: 'Maquillaje', short: 'Maquillaje', gif: 'maquillaje.gif', icon: '<path d="M9 21V11h6v10z"/><path d="M10 11V6l4-3v8"/>' },
  { id: 'sol', name: 'Sol y Agua', short: 'Sol y Agua', gif: 'sol-y-agua.gif', icon: '<circle cx="12" cy="10" r="4"/><path d="M12 2v1.5M4.2 5.2l1 1M2 10h1.5M20.5 10H22M18.8 5.2l-1 1M3 19c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>' },
  { id: 'gym', name: 'Gym y Suplementos', short: 'Gym', gif: 'gym.gif', icon: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>' },
  { id: 'regalos', name: 'Regalería y Perfumería', short: 'Regalos', gif: 'regalos.gif', icon: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1.5S9 8 12 8zm0 0c2-4 6-4 6-1.5S15 8 12 8z"/>' },
  { id: 'carteras', name: 'Carteras y Marroquinería', short: 'Carteras', gif: 'carteras.gif', icon: '<path d="M5 9h14l-1 11H6z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>' },
  { id: 'indumentaria', name: 'Indumentaria y Temporada', short: 'Indumentaria', gif: 'ropa-otoño.gif', gifAlt: 'shorts.gif', icon: '<path d="M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>' },
];
const isWarmSeason = (m = new Date().getMonth()) => m >= 8 || m <= 1;
const categoryGif = c => (c.gifAlt && isWarmSeason() ? c.gifAlt : c.gif);

// art: ilustración del producto (tube | bottle | jar | dropper | pump | box | compact | bag | tee)
const PRODUCTS = [
  { id: 1, name: 'Protector Solar Facial FPS 50 Toque Seco 50 ml', cat: 'sol', price: 18900, old: 26990, art: 'tube', color: '#f5b54a', tag: 'Más vendido' },
  { id: 2, name: 'Sérum Facial Ácido Hialurónico + Vitamina C 30 ml', cat: 'faciales', price: 22400, old: 29900, art: 'dropper', color: '#e8a87c' },
  { id: 3, name: 'Citrato de Magnesio + B6 · 60 comprimidos', cat: 'gym', price: 9800, old: 12250, art: 'jar', color: '#72bd99', tag: 'Nuevo' },
  { id: 4, name: 'Gel Limpiador Facial Piel Grasa 200 ml', cat: 'faciales', price: 14300, old: 17900, art: 'pump', color: '#7fb6d9' },
  { id: 5, name: 'Protector Solar Corporal Spray FPS 30 200 ml', cat: 'sol', price: 21500, old: 30700, art: 'bottle', color: '#f2c14e' },
  { id: 6, name: 'Base de Maquillaje Fluida Larga Duración 30 ml', cat: 'maquillaje', price: 16700, old: 20900, art: 'dropper', color: '#d9a585' },
  { id: 7, name: 'Proteína Whey Sabor Vainilla 1 kg', cat: 'gym', price: 38900, old: 45800, art: 'jar', color: '#3bb49c' },
  { id: 8, name: 'Crema Hidratante Facial Piel Sensible 50 ml', cat: 'faciales', price: 19900, old: 24900, art: 'jar', color: '#c9b6e4' },
  { id: 9, name: 'Paleta de Sombras Tonos Nude · 12 colores', cat: 'maquillaje', price: 13200, old: 16500, art: 'compact', color: '#c98b7a' },
  { id: 10, name: 'Remera Deportiva Dry-Fit Mujer', cat: 'indumentaria', price: 15900, old: 19900, art: 'tee', color: '#72bd99', tag: 'Temporada' },
  { id: 11, name: 'Set de Regalo Body Splash + Crema de Manos', cat: 'regalos', price: 17600, old: 22000, art: 'box', color: '#e79bb0' },
  { id: 12, name: 'Cartera Neceser Matelassé con Cierre', cat: 'carteras', price: 24900, old: 31100, art: 'bag', color: '#1e2925' },
  { id: 13, name: 'Agua Micelar Desmaquillante 400 ml', cat: 'faciales', price: 11900, old: 14900, art: 'bottle', color: '#8fd0e8' },
  { id: 14, name: 'After Sun Gel Aloe Vera Refrescante 250 ml', cat: 'sol', price: 9900, old: 13200, art: 'tube', color: '#7cc576' },
  { id: 15, name: 'Colágeno Hidrolizado + Vitamina C · 30 sobres', cat: 'gym', price: 26500, old: 33100, art: 'box', color: '#f0a35e' },
  { id: 16, name: 'Máscara de Pestañas Volumen Extremo', cat: 'maquillaje', price: 10400, old: 13000, art: 'tube', color: '#2f3b37' },
];

const STORAGE = { branch: 'rf_branch', cart: 'rf_cart', customer: 'redfarmako_customer' };

/* ---------------- HOOK: BASE DE DATOS DE PEDIDOS ---------------- */

/**
 * Se llama con cada pedido enviado por WhatsApp. Hoy no persiste nada en servidor:
 * queda listo para conectar Firebase Firestore cuando se cargue el stock real.
 *
 * Ejemplo con Firebase v10 (modular):
 *   import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
 *   const db = getFirestore(app);
 *   await addDoc(collection(db, 'orders'), { ...orderData, createdAt: serverTimestamp() });
 *
 * @param {{
 *   id: string, createdAt: string, channel: 'whatsapp',
 *   branch: { id: string, name: string, phone: string },
 *   customer: { name: string, phone: string, address: string },
 *   delivery: 'retiro' | 'envio', note: string,
 *   items: { id: number, name: string, qty: number, unitPrice: number, subtotal: number }[],
 *   total: number
 * }} orderData
 * @returns {Promise<void>}
 */
async function saveOrderToDatabase(orderData) {
  // TODO: reemplazar por la escritura en Firestore.
  console.info('[Red Farmako] Pedido listo para guardar:', orderData);
}

/* ---------------- Helpers ---------------- */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => '$' + Math.round(n).toLocaleString('es-AR');
const offPct = p => Math.round((1 - p.price / p.old) * 100);
const catById = id => CATEGORIES.find(c => c.id === id);
const branchById = id => BRANCHES.find(b => b.id === id);
const productById = id => PRODUCTS.find(p => p.id === +id);
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin storage */ } },
};
const icon = (paths, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  wa: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  bag: '<path d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
};
const brandVars = b => `--c1:${b.colors[0]};--c2:${b.colors[1]}`;

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-show'), 2400);
}

/* ---------------- Imágenes de marca ---------------- */

$$('[data-asset]').forEach(img => { img.src = asset(ASSETS[img.dataset.asset]); });

/* ---------------- Ilustraciones de producto (SVG) ---------------- */

function productArt(p) {
  const c = p.color;
  const shapes = {
    tube: `<path d="M34 18h32l-4 92a6 6 0 0 1-6 6H44a6 6 0 0 1-6-6z" fill="#fff" stroke="#e3eae7"/><path d="M36 50h28l-1.5 34h-25z" fill="${c}"/><rect x="38" y="116" width="24" height="16" rx="3" fill="${c}"/><rect x="32" y="12" width="36" height="8" rx="3" fill="#e9efec"/>`,
    bottle: `<rect x="40" y="10" width="20" height="16" rx="4" fill="${c}"/><path d="M30 34c0-5 4-8 9-8h22c5 0 9 3 9 8v86a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8z" fill="#fff" stroke="#e3eae7"/><rect x="30" y="60" width="40" height="38" fill="${c}" opacity=".9"/><rect x="36" y="68" width="18" height="3" rx="1.5" fill="#fff"/><rect x="36" y="75" width="26" height="3" rx="1.5" fill="#fff" opacity=".7"/>`,
    jar: `<rect x="24" y="30" width="52" height="16" rx="5" fill="${c}"/><rect x="22" y="46" width="56" height="74" rx="10" fill="#fff" stroke="#e3eae7"/><rect x="22" y="66" width="56" height="32" fill="${c}" opacity=".85"/><circle cx="50" cy="82" r="8" fill="#fff" opacity=".9"/>`,
    dropper: `<rect x="44" y="6" width="12" height="22" rx="6" fill="#2f3b37"/><rect x="40" y="26" width="20" height="12" rx="3" fill="#c8a76a"/><rect x="30" y="38" width="40" height="82" rx="10" fill="${c}" opacity=".85"/><rect x="36" y="64" width="28" height="30" rx="3" fill="#fff"/><rect x="40" y="72" width="16" height="3" rx="1.5" fill="${c}"/><rect x="40" y="79" width="20" height="2.5" rx="1.25" fill="#cfd8d4"/>`,
    pump: `<path d="M46 8h18v6H52v10h-6z" fill="#2f3b37"/><rect x="42" y="22" width="16" height="10" rx="2" fill="#2f3b37"/><rect x="30" y="32" width="40" height="92" rx="12" fill="#fff" stroke="#e3eae7"/><rect x="30" y="56" width="40" height="44" fill="${c}"/><rect x="36" y="66" width="22" height="3" rx="1.5" fill="#fff"/><rect x="36" y="73" width="16" height="3" rx="1.5" fill="#fff" opacity=".7"/>`,
    box: `<path d="M22 34l28-12 28 12v84H22z" fill="#fff" stroke="#e3eae7"/><path d="M22 34l28-12 28 12-28 10z" fill="#f4f7f6" stroke="#e3eae7"/><rect x="22" y="62" width="56" height="30" fill="${c}"/><rect x="30" y="70" width="26" height="4" rx="2" fill="#fff"/><rect x="30" y="78" width="18" height="3" rx="1.5" fill="#fff" opacity=".7"/>`,
    compact: `<rect x="14" y="40" width="72" height="62" rx="10" fill="#2f3b37"/><g transform="translate(22 50)">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${10 + (i % 3) * 18}" cy="${10 + Math.floor(i / 3) * 22}" r="8" fill="${c}" opacity="${0.45 + i * 0.1}"/>`).join('')}</g>`,
    bag: `<path d="M34 50V40a16 16 0 0 1 32 0v10" fill="none" stroke="${c}" stroke-width="4"/><rect x="16" y="50" width="68" height="64" rx="10" fill="${c}"/><path d="M16 70h68M16 90h68M38 50v64M62 50v64" stroke="#fff" stroke-opacity=".12"/><rect x="42" y="64" width="16" height="10" rx="3" fill="#c8a76a"/>`,
    tee: `<path d="M36 30l-22 12 8 18 10-5v55h36V55l10 5 8-18-22-12c-2 7-8 11-14 11s-12-4-14-11z" fill="${c}"/><path d="M36 30c2 7 8 11 14 11s12-4 14-11" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`,
  };
  return `<svg viewBox="0 0 100 140" aria-hidden="true">${shapes[p.art] || shapes.box}</svg>`;
}

/* ---------------- Horarios / turno ---------------- */

const HOUR = 3_600_000, DAY = 24 * HOUR;
const toMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const isoUTC = d => d.toISOString().slice(0, 10);
const DAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fmtDayAR = d => `${DAYS_ES[d.getUTCDay()]} ${d.getUTCDate()} de ${MONTHS_ES[d.getUTCMonth()]}`;

// Cronograma oficial sincronizado ('AAAA-MM-DD' → índice). Se cachea 6 h en el navegador.
const SCHEDULE_CACHE_KEY = 'rf_turnos_oficial';
let officialSchedule = (() => {
  try {
    const c = JSON.parse(localStorage.getItem(SCHEDULE_CACHE_KEY));
    return c && Date.now() - c.at < 6 * 3_600_000 ? c.map : {};
  } catch { return {}; }
})();

async function syncOfficialSchedule() {
  try {
    const res = await fetch(TURNOS_SCHEDULE_URL, { cache: 'no-cache' });
    if (!res.ok) return;
    const js = await res.text();
    const map = {};
    for (const [, date, name] of js.matchAll(/"(\d{4}-\d{2}-\d{2})"\s*:\s*\{\s*farmacia\s*:\s*"([^"]+)"/g)) {
      const idx = DUTY_ROTATION.findIndex(f => f.match.test(name));
      if (idx > -1) map[date] = idx;
    }
    if (!Object.keys(map).length) return; // formato cambió: seguimos con la rotación
    officialSchedule = map;
    try { localStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify({ at: Date.now(), map })); } catch { /* sin storage */ }
    renderDuty(); renderBranches(); renderBranchPicker();
  } catch { /* sin conexión o bloqueado: seguimos con la rotación */ }
}

// Hora de pared de Argentina, independiente de la zona horaria del dispositivo.
// El Date resultante se lee SIEMPRE con getUTC*().
const nowAR = (ms = Date.now()) => new Date(ms + AR_UTC_OFFSET * HOUR);

/** Turno vigente en este instante: a las 02:30 rige todavía el turno que empezó ayer a las 08:00. */
function dutyAt(ms = Date.now()) {
  const shifted = new Date(nowAR(ms).getTime() - DUTY_CHANGE_HOUR * HOUR); // regla de las 08:00
  const dutyDate = isoUTC(shifted);
  const days = Math.round((Date.parse(dutyDate) - Date.parse(DUTY_SEED_DATE)) / DAY);
  const n = DUTY_ROTATION.length;
  const idx = DUTY_OVERRIDES[dutyDate] ?? officialSchedule[dutyDate] ?? (((days % n) + n) % n);
  const ends = new Date(Date.parse(dutyDate) + DAY); // día en que termina, a las 08:00
  return { ...DUTY_ROTATION[idx], idx, dutyDate, endsLabel: fmtDayAR(ends) };
}
/** Próximos turnos (el actual incluido). */
const upcomingDuties = (count = 4) => Array.from({ length: count }, (_, k) => {
  const d = dutyAt(Date.now() + k * DAY);
  const label = fmtDayAR(new Date(Date.parse(d.dutyDate)));
  return { ...d, dayLabel: label[0].toUpperCase() + label.slice(1) };
});
// "15674723" → WhatsApp 5493757674723 · tel +5493757674723 · "(03757) 15-674723"
const localPhone = p => {
  const n = p.replace(/^15/, '');
  return { wa: `549${3757}${n}`, tel: `+549${3757}${n}`, display: `(03757) 15-${n}` };
};

function branchStatus(b, ms = Date.now()) {
  if (dutyAt(ms).branch === b.id) return { open: true, duty: true, label: 'HOY DE TURNO 24 HS (hasta las 08:00 hs)' };
  const now = nowAR(ms);
  const ranges = b.hours[now.getUTCDay()] || [];
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  const current = ranges.find(([a, z]) => mins >= toMin(a) && mins < toMin(z));
  if (current) return { open: true, duty: false, label: `Abierto ahora · cierra ${current[1]}` };
  const next = ranges.find(([a]) => mins < toMin(a));
  return { open: false, duty: false, label: next ? `Cerrado · abre ${next[0]}` : 'Cerrado ahora' };
}
function statusPill(st) {
  const cls = st.duty ? 'status--duty' : st.open ? 'status--open' : 'status--closed';
  return `<span class="status ${cls}">${st.duty ? '🟢' : '<span class="dot"></span>'}${esc(st.label)}</span>`;
}

/* ---------------- Turnos: barra superior, banner comunitario y modal ---------------- */

function renderDuty() {
  const d = dutyAt();
  const b = d.branch && branchById(d.branch);
  const ph = localPhone(d.phone);
  const bar = $('#dutyBar');

  if (b) {
    bar.className = 'dutybar dutybar--ours';
    bar.innerHTML = `<div class="container dutybar__row">
      <span class="dutybar__text"><b>🟢 HOY DE TURNO 24 HS</b> · Red Farmako ${esc(b.name)} <span class="hide-sm">· hasta las 08:00 hs del ${esc(d.endsLabel)}</span></span>
      <a class="dutybar__btn" href="${waLink(b.phone, `Hola ${b.name}! 👋 Los contacto por el turno de hoy.`)}" target="_blank" rel="noopener">${icon(ICONS.wa)}WhatsApp</a>
    </div>`;
  } else {
    bar.className = 'dutybar';
    bar.innerHTML = `<div class="container dutybar__row">
      <span class="dutybar__text">📅 De turno hoy en Andresito: <b>${esc(d.name)}</b> <span class="hide-sm">· ${esc(d.address)}</span></span>
      <a class="dutybar__btn" href="#turno">Ver datos</a>
    </div>`;
  }

  const next = upcomingDuties(4).slice(1);
  $('#turnoCard').innerHTML = `
    <div class="turno__now ${b ? 'is-ours' : ''}">
      <span class="eyebrow">${b ? 'Hoy estamos de turno' : 'Servicio a la comunidad'}</span>
      <h2>${b ? `Red Farmako <em>${esc(b.name)}</em>` : `Hoy está de turno <em>${esc(d.name)}</em>`}</h2>
      <ul class="turno__meta">
        <li>${icon(ICONS.pin)}<span>${esc(d.address)}, Comandante Andresito</span></li>
        <li>${icon(ICONS.phone)}<a href="tel:${ph.tel}">${esc(ph.display)}</a></li>
        <li>${icon(ICONS.clock)}<span>Abierta 24 hs · hasta las 08:00 hs del ${esc(d.endsLabel)}</span></li>
      </ul>
      <div class="turno__actions">
        ${b
          ? `<a class="btn btn--wa" href="${waLink(b.phone, `Hola ${b.name}! 👋 Los contacto por el turno de hoy.`)}" target="_blank" rel="noopener">${icon(ICONS.wa)}WhatsApp directo</a>`
          : `<a class="btn btn--primary" href="tel:${ph.tel}">${icon(ICONS.phone)}Llamar</a>`}
        <a class="btn btn--ghost" href="${TURNOS_URL}" target="_blank" rel="noopener" data-turnos-modal>Ver Cronograma Completo de Turnos en Vivo ↗</a>
      </div>
    </div>
    <div class="turno__next">
      <h4>Próximos turnos</h4>
      <ol>${next.map(n => `<li class="${n.branch ? 'is-ours' : ''}"><span>${esc(n.dayLabel)}</span><b>${esc(n.name)}</b>${n.branch ? '<small>Red Farmako</small>' : ''}</li>`).join('')}</ol>
      <small class="turno__rule">Los turnos comienzan a las 08:00 hs y terminan a las 08:00 hs del día siguiente.</small>
    </div>`;
}

const turnosModal = $('#turnosModal');
function openTurnosModal() {
  const frame = $('#turnosFrame');
  if (!frame.src) frame.src = TURNOS_URL; // se carga recién al abrir
  if (typeof turnosModal.showModal === 'function') turnosModal.showModal();
  else window.open(TURNOS_URL, '_blank', 'noopener');
}
// Click normal → modal dentro de la página. Ctrl/⌘+click o click medio → pestaña nueva (link real).
document.addEventListener('click', e => {
  const link = e.target.closest('[data-turnos-modal]');
  if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  openTurnosModal();
});
$('#turnosClose').addEventListener('click', () => turnosModal.close());
turnosModal.addEventListener('click', e => { if (e.target === turnosModal) turnosModal.close(); });
$$('[data-turnos-url]').forEach(a => { a.href = TURNOS_URL; });

/* ---------------- Estado ---------------- */

const state = {
  branch: store.get(STORAGE.branch, null),
  filter: 'all',
  cart: store.get(STORAGE.cart, {}),
  customer: store.get(STORAGE.customer, store.get('rf_customer', { name: '', phone: '', address: '' })),
};
if (state.branch && !branchById(state.branch)) state.branch = null;
for (const id of Object.keys(state.cart)) if (!productById(id)) delete state.cart[id];

function setBranch(id, { silent } = {}) {
  state.branch = id;
  store.set(STORAGE.branch, id);
  renderBranchPicker();
  renderCartBranches();
  updateCheckoutLabel();
  if (!silent) toast(`Sucursal elegida: ${branchById(id).name}`);
}

/* ---------------- Top bar (loop continuo) ---------------- */

const tb = $('.topbar__track');
tb.innerHTML += tb.innerHTML;
$$('span', tb).slice(3).forEach(s => s.setAttribute('aria-hidden', 'true'));

/* ---------------- Header ---------------- */

const header = $('#header');
addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 8), { passive: true });

const branchBtn = $('#branchBtn');
const branchMenu = $('#branchMenu');

function renderBranchPicker() {
  const b = branchById(state.branch);
  $('#branchLabel').textContent = b ? shortName(b) : 'Elegir';
  branchMenu.innerHTML = BRANCHES.map(br => `<li><button role="option" aria-selected="${br.id === state.branch}" data-branch="${br.id}">
      ${icon(ICONS.pin)}<span><b>${esc(br.name)}</b><small>${esc(br.lead)} · ${esc(branchStatus(br).label)}</small></span>
    </button></li>`).join('');
}
function toggleBranchMenu(open = branchMenu.hidden) {
  branchMenu.hidden = !open;
  branchBtn.setAttribute('aria-expanded', open);
}
branchBtn.addEventListener('click', e => { e.stopPropagation(); toggleBranchMenu(); });
branchMenu.addEventListener('click', e => {
  const btn = e.target.closest('[data-branch]');
  if (!btn) return;
  setBranch(btn.dataset.branch);
  toggleBranchMenu(false);
});

/* ---------------- Stories (GIFs) ---------------- */

$('#stories').innerHTML = CATEGORIES.map(c => `
  <button class="story" data-cat="${c.id}" aria-label="${esc(c.name)}">
    <span class="story__ring"><span class="story__media">
      ${icon(c.icon)}
      <img src="${asset(categoryGif(c))}" alt="" loading="lazy" decoding="async" onerror="this.remove()" />
    </span></span>
    <small>${esc(c.short)}</small>
  </button>`).join('');

$('#stories').addEventListener('click', e => {
  const s = e.target.closest('[data-cat]');
  if (s) applyFilter(state.filter === s.dataset.cat ? 'all' : s.dataset.cat, true);
});

/* ---------------- Hero ---------------- */

$('#logoFan').innerHTML = BRANCHES.map((b, n) =>
  `<figure style="--d:${n * 0.12}s"><img src="${asset(b.logoGray)}" alt="Red Farmako ${esc(b.name)}" /></figure>`).join('');

// Placeholder corto en pantallas angostas para que no se corte
const searchInput = $('#searchInput');
const setPlaceholder = () => {
  searchInput.placeholder = innerWidth < 600 ? '¿Qué estás buscando hoy?' : '¿Qué estás buscando hoy? Ej: protector solar, magnesio, dermocosmética…';
};
setPlaceholder();
addEventListener('resize', setPlaceholder, { passive: true });
$('#heroProducts').innerHTML = [PRODUCTS[13], PRODUCTS[0], PRODUCTS[4]].map(productArt).join('');

(() => {
  const track = $('#heroSlides');
  const slides = $$('.slide', track);
  const dots = $('#heroDots');
  let i = 0, timer;
  dots.innerHTML = slides.map((_, n) => `<button aria-label="Ir al slide ${n + 1}"></button>`).join('');
  const go = n => {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    $$('button', dots).forEach((d, k) => d.setAttribute('aria-current', k === i));
    slides.forEach((s, k) => { s.inert = k !== i; });
  };
  const play = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(i + 1), 6500); };
  dots.addEventListener('click', e => { const k = $$('button', dots).indexOf(e.target); if (k > -1) { go(k); play(); } });
  $('#heroPrev').addEventListener('click', () => { go(i - 1); play(); });
  $('#heroNext').addEventListener('click', () => { go(i + 1); play(); });
  const vp = $('.hero__viewport');
  vp.addEventListener('mouseenter', () => clearInterval(timer));
  vp.addEventListener('mouseleave', play);
  let x0 = null;
  vp.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  vp.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    x0 = null; play();
  });
  go(0); play();
})();

/* ---------------- Sucursales ---------------- */

function renderBranches() {
  $('#branches').innerHTML = BRANCHES.map((b, n) => {
    const st = branchStatus(b);
    return `
    <article class="branch ${st.duty ? 'is-duty' : ''}" style="${brandVars(b)}">
      <div class="branch__top">
        ${statusPill(st)}
        <span class="branch__num">0${n + 1}</span>
        <img class="branch__logo" src="${asset(b.logoWhite)}" alt="Red Farmako ${esc(b.name)}" loading="lazy" />
      </div>
      <div class="branch__body">
        <span class="branch__kicker">Dir. Técnica / Atención</span>
        <h3>Farm. ${esc(b.lead)}</h3>
        <p class="branch__lead">Red Farmako · <b>${esc(b.name)}</b></p>
        <ul class="branch__meta">
          <li>${icon(ICONS.pin)}<a href="${b.maps}" target="_blank" rel="noopener">${esc(b.address)}</a></li>
          <li>${icon(ICONS.phone)}<a href="tel:+${b.phone}">${esc(b.phoneDisplay)}</a></li>
          <li>${icon(ICONS.clock)}<span>${st.duty ? 'Hoy abierta 24 hs (turno hasta las 08:00 hs)' : esc(b.hoursLabel)}</span></li>
          <li>${icon(ICONS.ig)}<a href="https://www.instagram.com/${b.instagram}" target="_blank" rel="noopener">@${esc(b.instagram)}</a></li>
        </ul>
        <div class="branch__actions">
          <a class="btn btn--wa btn--sm" href="${waLink(b.phone, `Hola ${b.name}! 👋 Quería hacer una consulta.`)}" target="_blank" rel="noopener">${icon(ICONS.wa)}WhatsApp</a>
          <a class="icon-btn" href="${b.maps}" target="_blank" rel="noopener" aria-label="Ver ${esc(b.name)} en el mapa">${icon(ICONS.map)}</a>
          <a class="icon-btn" href="https://www.instagram.com/${b.instagram}" target="_blank" rel="noopener" aria-label="Instagram de ${esc(b.name)}">${icon(ICONS.ig)}</a>
        </div>
      </div>
    </article>`;
  }).join('');
}

/* ---------------- Catálogo ---------------- */

$('#filters').innerHTML = [{ id: 'all', short: 'Todo' }, ...CATEGORIES].map(c =>
  `<button role="tab" data-filter="${c.id}" aria-selected="${c.id === 'all'}">${esc(c.short)}</button>`).join('');
$('#filters').addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (b) applyFilter(b.dataset.filter); });

function applyFilter(cat, scroll) {
  state.filter = cat;
  $$('#filters button').forEach(b => b.setAttribute('aria-selected', b.dataset.filter === cat));
  $$('.story').forEach(s => s.classList.toggle('is-active', s.dataset.cat === cat));
  renderProducts();
  if (scroll) $('#ofertas').scrollIntoView();
}

function renderProducts() {
  const list = PRODUCTS.filter(p => state.filter === 'all' || p.cat === state.filter);
  $('#productsEmpty').hidden = list.length > 0;
  $('#products').innerHTML = list.map((p, n) => `
    <article class="product" id="p-${p.id}" style="animation-delay:${n * 40}ms">
      <div class="product__media">
        <span class="product__off">-${offPct(p)}%</span>
        ${p.tag ? `<span class="product__tag">${esc(p.tag)}</span>` : ''}
        ${productArt(p)}
      </div>
      <div class="product__body">
        <span class="product__cat">${esc(catById(p.cat).short)}</span>
        <h3 class="product__name">${esc(p.name)}</h3>
        <div class="product__price"><b>${money(p.price)}</b><s>${money(p.old)}</s></div>
        <button class="btn product__btn" data-add="${p.id}">${icon(ICONS.bag)}Consultar / Comprar</button>
      </div>
    </article>`).join('');
}

$('#products').addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  addToCart(+btn.dataset.add);
  btn.classList.add('is-added');
  btn.innerHTML = `${icon(ICONS.check)}Agregado`;
  setTimeout(() => { btn.classList.remove('is-added'); btn.innerHTML = `${icon(ICONS.bag)}Consultar / Comprar`; }, 1400);
});

/* ---------------- Buscador predictivo ---------------- */

(() => {
  const input = $('#searchInput');
  const box = $('#searchResults');
  let active = -1;

  const highlight = (text, q) => {
    const i = norm(text).indexOf(norm(q));
    if (!q || i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  };

  function render() {
    const q = input.value.trim();
    active = -1;
    if (q.length < 2) {
      box.innerHTML = `<div class="search__group">Búsquedas populares</div>` +
        ['Protector solar', 'Magnesio', 'Sérum', 'Proteína'].map(t =>
          `<button class="search__item" data-q="${esc(t)}"><span class="thumb">${icon(ICONS.trend)}</span><b>${esc(t)}</b></button>`).join('');
      box.hidden = false;
      return;
    }
    const terms = norm(q).split(/\s+/).filter(Boolean);
    const match = s => terms.every(t => norm(s).includes(t));
    const cats = CATEGORIES.filter(c => match(c.name));
    const prods = PRODUCTS.filter(p => match(p.name + ' ' + catById(p.cat).name)).slice(0, 6);
    let html = '';
    if (cats.length) html += `<div class="search__group">Categorías</div>` + cats.map(c =>
      `<button class="search__item" data-cat="${c.id}"><span class="thumb">${icon(c.icon)}</span><b>${highlight(c.name, q)}</b></button>`).join('');
    if (prods.length) html += `<div class="search__group">Productos</div>` + prods.map(p =>
      `<button class="search__item" data-pid="${p.id}"><span class="thumb">${productArt(p)}</span><span><b>${highlight(p.name, q)}</b><small>${esc(catById(p.cat).short)} · -${offPct(p)}%</small></span><span class="price">${money(p.price)}</span></button>`).join('');
    if (!html) {
      const b = branchById(state.branch) || BRANCHES[0];
      html = `<div class="search__empty">No encontramos "<b>${esc(q)}</b>" en el catálogo online.<br/>
        <a class="link" target="_blank" rel="noopener" href="${waLink(b.phone, `Hola ${b.name}! ¿Tienen ${q}?`)}">Consultá por WhatsApp a ${esc(b.name)}</a> y te lo conseguimos.</div>`;
    }
    box.innerHTML = html;
    box.hidden = false;
  }

  function choose(el) {
    if (!el) return;
    if (el.dataset.q) { input.value = el.dataset.q; render(); input.focus(); return; }
    box.hidden = true;
    if (el.dataset.cat) { applyFilter(el.dataset.cat, true); return; }
    if (el.dataset.pid) {
      const p = productById(el.dataset.pid);
      if (state.filter !== 'all' && state.filter !== p.cat) applyFilter('all');
      const card = $('#p-' + p.id);
      card.scrollIntoView({ block: 'center' });
      card.classList.add('is-flash');
      setTimeout(() => card.classList.remove('is-flash'), 1800);
    }
  }

  let debounce;
  input.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(render, 90); });
  input.addEventListener('focus', render);
  input.addEventListener('keydown', e => {
    const items = $$('.search__item', box);
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && items.length) {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((it, k) => it.classList.toggle('is-active', k === active));
      items[active].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(items[active] || $('[data-pid], [data-cat]', box));
    } else if (e.key === 'Escape') { box.hidden = true; input.blur(); }
  });
  box.addEventListener('mousedown', e => e.preventDefault());
  box.addEventListener('click', e => choose(e.target.closest('.search__item')));
  document.addEventListener('click', e => { if (!e.target.closest('#search')) box.hidden = true; });
})();

/* ---------------- Carrito + checkout por WhatsApp ---------------- */

const drawer = $('#cart');
const backdrop = $('#drawerBackdrop');
const checkoutForm = $('#checkout');
const nameInput = $('#custName');
const phoneInput = $('#custPhone');
const addrInput = $('#custAddress');
const noteInput = $('#custNote');

const cartEntries = () => Object.entries(state.cart).map(([id, q]) => [productById(id), q]).filter(([p, q]) => p && q > 0);
const deliveryMode = () => $('input[name="delivery"]:checked').value;

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  toast(`Agregado a tu pedido · ${productById(id).name.split(' ').slice(0, 3).join(' ')}…`);
  const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
}
function saveCart() { store.set(STORAGE.cart, state.cart); renderCart(); }

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((s, [, q]) => s + q, 0);
  const subtotal = entries.reduce((s, [p, q]) => s + p.price * q, 0);
  $('#cartCount').textContent = count;
  $('#cartSummary').textContent = `${count} producto${count === 1 ? '' : 's'}`;
  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartShipping').textContent = deliveryMode() === 'envio' ? 'A coordinar por WhatsApp' : 'Sin cargo (retiro)';
  $('#cartTotal').textContent = money(subtotal);
  $('#cartCheckout').disabled = !count;
  checkoutForm.hidden = !count;
  $('#cartItems').innerHTML = entries.length ? entries.map(([p, q]) => `
    <div class="cart-item">
      <span class="thumb">${productArt(p)}</span>
      <div><b>${esc(p.name)}</b><small>${money(p.price * q)}</small></div>
      <div class="qty"><button type="button" data-dec="${p.id}" aria-label="Quitar uno">−</button><span>${q}</span><button type="button" data-inc="${p.id}" aria-label="Agregar uno">+</button></div>
    </div>`).join('')
    : `<div class="cart-empty">${icon(ICONS.bag)}<h4>Tu pedido está vacío</h4><p>Agregá productos del catálogo o consultanos por WhatsApp lo que necesites.</p></div>`;
}

$('#cartItems').addEventListener('click', e => {
  const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
  if (inc) state.cart[inc.dataset.inc]++;
  if (dec) { const id = dec.dataset.dec; if (--state.cart[id] <= 0) delete state.cart[id]; }
  if (inc || dec) saveCart();
});

function renderCartBranches() {
  $('#cartBranches').innerHTML = BRANCHES.map(b => `
    <label class="branch-opt" style="${brandVars(b)}">
      <input type="radio" name="cartBranch" value="${b.id}" ${b.id === state.branch ? 'checked' : ''} />
      <span class="branch-opt__box">
        <span class="av"><img src="${asset(ASSETS.isotipo)}" alt="" /></span>
        <span><b>${esc(shortName(b))}</b><small>${esc(b.lead.split(' ')[0])} · ${esc(branchStatus(b).label)}</small></span>
        <span class="check">${icon(ICONS.check)}</span>
      </span>
    </label>`).join('');
}
$('#cartBranches').addEventListener('change', e => {
  $('#cartBranches').classList.remove('is-invalid');
  setBranch(e.target.value, { silent: true });
});

function updateCheckoutLabel() {
  const b = branchById(state.branch);
  $('#checkoutLabel').textContent = b ? `Enviar pedido a ${shortName(b)}` : 'Enviar pedido por WhatsApp';
}

$$('input[name="delivery"]').forEach(r => r.addEventListener('change', () => {
  addrInput.hidden = deliveryMode() !== 'envio';
  renderCart();
}));
// Datos del cliente: se autocompletan y se guardan solos mientras escribe (sin registro).
nameInput.value = state.customer.name || '';
phoneInput.value = state.customer.phone || '';
addrInput.value = state.customer.address || '';
let customerSaveTimer;
function persistCustomer() {
  state.customer = { name: nameInput.value.trim(), phone: phoneInput.value.trim(), address: addrInput.value.trim() };
  store.set(STORAGE.customer, state.customer);
}
[nameInput, phoneInput, addrInput].forEach(el => el.addEventListener('input', () => {
  el.classList.remove('is-invalid');
  clearTimeout(customerSaveTimer);
  customerSaveTimer = setTimeout(persistCustomer, 300);
}));

function buildOrderMessage(b, entries, { name, phone, mode, address, note }) {
  const subtotal = entries.reduce((s, [p, q]) => s + p.price * q, 0);
  return [
    `Hola ${b.name}! 👋`,
    `Soy *${name}*${phone ? ` (tel. ${phone})` : ''} y quiero hacer este pedido desde la web de Red Farmako:`,
    '',
    '🛍️ *Detalle del pedido*',
    ...entries.map(([p, q]) => `• ${q} × ${p.name} — ${money(p.price * q)}`),
    '',
    `💳 *Total estimado:* ${money(subtotal)}`,
    mode === 'envio' ? `🚚 *Entrega:* Envío a domicilio` : `🏪 *Entrega:* Retiro en sucursal`,
    mode === 'envio' ? `📍 *Dirección:* ${address}` : null,
    note ? `📝 *Nota:* ${note}` : null,
    '',
    '¿Me confirman stock y forma de pago? ¡Gracias!',
  ].filter(l => l !== null).join('\n');
}

checkoutForm.addEventListener('submit', e => {
  e.preventDefault();
  const entries = cartEntries();
  if (!entries.length) return;
  const b = branchById(state.branch);
  const mode = deliveryMode();
  const name = nameInput.value.trim();
  const address = addrInput.value.trim();
  const errors = [];
  if (!b) { $('#cartBranches').classList.add('is-invalid'); errors.push('la sucursal'); }
  if (!name) { nameInput.classList.add('is-invalid'); errors.push('tu nombre'); }
  if (mode === 'envio' && !address) { addrInput.classList.add('is-invalid'); errors.push('la dirección'); }
  if (errors.length) { toast(`Completá ${errors.join(', ')}`); return; }

  persistCustomer();
  const phone = phoneInput.value.trim();
  const note = noteInput.value.trim();
  const text = buildOrderMessage(b, entries, { name, phone, mode, address, note });
  // window.open debe ir primero y sincrónico (si no, el navegador bloquea la ventana).
  window.open(waLink(b.phone, text), '_blank', 'noopener');
  toast(`Abrimos WhatsApp con ${b.name} ✓`);

  saveOrderToDatabase({
    id: `RF-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    channel: 'whatsapp',
    branch: { id: b.id, name: b.name, phone: b.phone },
    customer: { name, phone, address: mode === 'envio' ? address : '' },
    delivery: mode,
    note,
    items: entries.map(([p, q]) => ({ id: p.id, name: p.name, qty: q, unitPrice: p.price, subtotal: p.price * q })),
    total: entries.reduce((s, [p, q]) => s + p.price * q, 0),
  }).catch(err => console.error('[Red Farmako] No se pudo guardar el pedido:', err));
});

function openCart(open) {
  drawer.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', !open);
  backdrop.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) { renderCart(); $('#cartClose').focus(); }
}
$('#cartBtn').addEventListener('click', () => openCart(true));
$('#cartClose').addEventListener('click', () => openCart(false));
backdrop.addEventListener('click', () => openCart(false));
$$('[data-open-cart]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openCart(true); }));

/* ---------------- Widget WhatsApp multi-sucursal ---------------- */

const waFab = $('#waFab');
const waPanel = $('#waPanel');

function renderWaList() {
  $('#waList').innerHTML = BRANCHES.map(b => {
    const st = branchStatus(b);
    return `<li><a href="${waLink(b.phone, `Hola ${b.name}! 👋 Quería hacer una consulta.`)}" target="_blank" rel="noopener">
      <span class="av ${st.open ? 'is-open' : ''}" style="${brandVars(b)}"><img src="${asset(ASSETS.isotipo)}" alt="" /></span>
      <span><b>${esc(b.name)}</b><small>${esc(b.lead)} · ${esc(st.label)}</small></span>
      <span class="go">${icon(ICONS.arrow)}</span>
    </a></li>`;
  }).join('');
}
function toggleWa(open = waPanel.hidden) {
  if (open) renderWaList();
  waPanel.hidden = !open;
  waFab.setAttribute('aria-expanded', open);
}
waFab.addEventListener('click', e => { e.stopPropagation(); toggleWa(); });
$('#waClose').addEventListener('click', () => toggleWa(false));
$$('[data-open-wa]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleWa(true); }));
$$('[data-filter-cat]').forEach(el => el.addEventListener('click', () => applyFilter(el.dataset.filterCat, true)));

document.addEventListener('click', e => {
  if (!e.target.closest('#waWidget')) toggleWa(false);
  if (!e.target.closest('.branch-picker')) toggleBranchMenu(false);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  toggleWa(false); toggleBranchMenu(false);
  if (drawer.classList.contains('is-open')) openCart(false);
});

/* ---------------- Footer ---------------- */

$('#footerCats').innerHTML = CATEGORIES.map(c => `<li><button data-fcat="${c.id}">${esc(c.name)}</button></li>`).join('');
$('#footerCats').addEventListener('click', e => { const b = e.target.closest('[data-fcat]'); if (b) applyFilter(b.dataset.fcat, true); });
$('#footerBranches').innerHTML = BRANCHES.map(b => `<li class="footer__branch"><b>${esc(b.name)}</b>
  <a href="tel:+${b.phone}">${esc(b.phoneDisplay)}</a>
  <a href="https://www.instagram.com/${b.instagram}" target="_blank" rel="noopener">@${esc(b.instagram)}</a></li>`).join('');
$('#year').textContent = new Date().getFullYear();

/* ---------------- Init ---------------- */

renderDuty();
renderBranchPicker();
renderBranches();
renderProducts();
renderCartBranches();
updateCheckoutLabel();
renderCart();
syncOfficialSchedule();
// Refresca estados cada minuto (incluye el cambio de turno de las 08:00).
setInterval(() => { renderDuty(); renderBranches(); renderBranchPicker(); }, 60_000);

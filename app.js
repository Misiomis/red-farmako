/* =========================================================
   Red Farmako · Pensando en vos
   Toda la información editable está en las secciones CONFIG.
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
const asset = path => ASSETS_BASE_PATH + path.split('/').map(encodeURIComponent).join('/');

/* ---------------- CONFIG: SUCURSALES ---------------- */

// Comandante Andresito, Misiones · código de área 3757.
// phone: WhatsApp en formato internacional sin "+" (54 9 3757 + número sin el 15).
// featuredCats: categorías que se destacan primero cuando se elige esa sucursal.
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
    shortAddress: 'Av. Neuquén, Fte. al Gallego',
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Neuquen+Comandante+Andresito+Misiones',
    logoWhite: 'web/farmavida-blanco.png', // ← 14.png
    logoGray: 'web/farmavida-gris.png',    // ← 15.png
    colors: ['#72bd99', '#3bb49c'],
    featuredCats: ['juguetes', 'indumentaria', 'joyas'],
    highlight: 'Nuestra sucursal más grande: Juguetería, Indumentaria y Joyas.',
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
    shortAddress: 'Av. Libertador s/n',
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Libertador+Comandante+Andresito+Misiones',
    logoWhite: 'web/libertad-blanco.png', // ← 22.png
    logoGray: 'web/libertad-gris.png',    // ← 17.png
    colors: ['#3bb49c', '#2a8f7b'],
    featuredCats: ['bebes', 'gym'],
    highlight: 'Pañales, leches y suplementos con ofertas propias de Libertad.',
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
    shortAddress: 'Los Pioneros s/n',
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Pioneros+Comandante+Andresito+Misiones',
    logoWhite: 'web/central-blanco.png', // ← 13.png
    logoGray: 'web/central-gris.png',    // ← 12.png
    colors: ['#5ea886', '#72bd99'],
    featuredCats: ['gym', 'faciales'],
    highlight: '',
    hours: [[['09:00', '13:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']]],
    hoursLabel: 'Lun a Sáb 8 a 22 h · Dom 9 a 13 h',
  },
];
const ALL_BRANCHES = BRANCHES.map(b => b.id);
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
// match: cómo se reconoce cada farmacia en el cronograma de la plataforma oficial.
const DUTY_SEED_DATE = '2026-11-01';
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

/* ---------------- CONFIG: PANEL DE ADMINISTRACIÓN Y SINCRONIZACIÓN ---------------- */

// PIN de acceso al panel de productos. ⚠️ Es un filtro simple, NO es seguridad real:
// cualquiera que lea este archivo lo ve. Para seguridad real, usar Firebase Auth (SYNC_CONFIG).
const ADMIN_PIN = '2026';

// Catálogo publicado para todos los clientes. Lo que se edita en el panel queda guardado
// en ESE dispositivo; para publicarlo, descargar el JSON desde el panel y reemplazar
// este archivo en el repositorio (o conectar Firebase abajo).
const CATALOG_URL = 'catalogo-farmako.json';

// Conectores para el próximo paso (sincronización en la nube).
const SYNC_CONFIG = {
  provider: 'local', // 'local' | 'firebase'
  firebase: {
    // Completar con los datos del proyecto (Consola Firebase → Configuración del proyecto).
    apiKey: '',
    authDomain: '',
    projectId: '',
    collection: 'products',
  },
  cloudinary: {
    // Cloudinary Free: crear un "upload preset" sin firma (Settings → Upload).
    // Si cloudName y uploadPreset están completos, las fotos subidas desde el panel
    // se alojan en Cloudinary en lugar de guardarse dentro del catálogo.
    cloudName: '',
    uploadPreset: '',
    folder: 'red-farmako/productos',
  },
};

/* ---------------- CONFIG: CATEGORÍAS ---------------- */

// branches: en qué sucursales existe la categoría (si una sucursal no la tiene, la
// burbuja y sus productos se ocultan al elegir esa sucursal).
// gif: archivo dentro de ASSETS_BASE_PATH (si no existe, se muestra el ícono).
// gifAlt: variante de temporada (septiembre a febrero, primavera/verano en Argentina).
// art/color: ilustración por defecto para productos sin foto.
const CATEGORIES = [
  { id: 'faciales', name: 'Faciales y Dermocosmética', short: 'Faciales', branches: ALL_BRANCHES, gif: 'faciales.gif', art: 'pump', color: '#7fb6d9', icon: '<path d="M12 3c4 3 6 6 6 10a6 6 0 0 1-12 0c0-4 2-7 6-10z"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5"/>' },
  { id: 'maquillaje', name: 'Maquillaje', short: 'Maquillaje', branches: ALL_BRANCHES, gif: 'maquillaje.gif', art: 'dropper', color: '#d9a585', icon: '<path d="M9 21V11h6v10z"/><path d="M10 11V6l4-3v8"/>' },
  { id: 'sol-y-agua', name: 'Sol y Agua', short: 'Sol y Agua', branches: ALL_BRANCHES, gif: 'sol-y-agua.gif', art: 'tube', color: '#f5b54a', icon: '<circle cx="12" cy="10" r="4"/><path d="M12 2v1.5M4.2 5.2l1 1M2 10h1.5M20.5 10H22M18.8 5.2l-1 1M3 19c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>' },
  { id: 'bebes', name: 'Pañales y Leches', short: 'Bebés', branches: ALL_BRANCHES, gif: 'bebes.gif', art: 'box', color: '#9fd3f0', icon: '<circle cx="12" cy="8" r="4"/><path d="M8 7.5c1-.8 2.5-1 4-.5M10.5 9h.01M13.5 9h.01"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7"/>' },
  { id: 'gym', name: 'Gym y Suplementos', short: 'Gym', branches: ALL_BRANCHES, gif: 'gym.gif', art: 'jar', color: '#3bb49c', icon: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>' },
  { id: 'joyas', name: 'Joyas y Accesorios', short: 'Joyas', branches: ALL_BRANCHES, gif: 'joyas.gif', art: 'ring', color: '#d4af6a', icon: '<path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18M9 3l3 5 3-5M12 8v13"/>' },
  { id: 'juguetes', name: 'Juguetería', short: 'Juguetería', branches: ['farmavida'], gif: 'juguetes.gif', art: 'toy', color: '#f08a7e', icon: '<rect x="3" y="11" width="8" height="8" rx="1"/><rect x="13" y="11" width="8" height="8" rx="1"/><rect x="8" y="3" width="8" height="8" rx="1"/>' },
  { id: 'indumentaria', name: 'Indumentaria y Shorts', short: 'Indumentaria', branches: ['farmavida', 'central'], gif: 'ropa-otoño.gif', gifAlt: 'shorts.gif', art: 'tee', color: '#72bd99', icon: '<path d="M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>' },
  { id: 'regalos', name: 'Regalería', short: 'Regalos', branches: ALL_BRANCHES, gif: 'regalos.gif', art: 'box', color: '#e79bb0', icon: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1.5S9 8 12 8zm0 0c2-4 6-4 6-1.5S15 8 12 8z"/>' },
  { id: 'carteras', name: 'Carteras', short: 'Carteras', branches: ['farmavida', 'central'], gif: 'carteras.gif', art: 'bag', color: '#1e2925', icon: '<path d="M5 9h14l-1 11H6z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>' },
];
const isWarmSeason = (m = new Date().getMonth()) => m >= 8 || m <= 1;
const categoryGif = c => (c.gifAlt && isWarmSeason() ? c.gifAlt : c.gif);

/* ---------------- CATÁLOGO DE RESPALDO ---------------- */

// ⚠️ Productos de MUESTRA. Solo se usan si no carga catalogo-farmako.json.
// El catálogo real se administra desde el panel (☰ → Administrar Productos).
// price: precio normal · discount: % de descuento (0 = sin oferta)
// branches: en qué sucursales está disponible · featured: aparece primero ("Destacado")
const FV_CEN = ['farmavida', 'central'];
const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Protector Solar Facial FPS 50 Toque Seco 50 ml', brand: '', cat: 'sol-y-agua', price: 26990, discount: 30, branches: ALL_BRANCHES, featured: true, art: 'tube', color: '#f5b54a' },
  { id: 'p2', name: 'Sérum Facial Ácido Hialurónico + Vitamina C 30 ml', brand: '', cat: 'faciales', price: 29900, discount: 25, branches: ALL_BRANCHES, featured: true, art: 'dropper', color: '#e8a87c' },
  { id: 'p3', name: 'Pañales Premium Talle G x 36', brand: '', cat: 'bebes', price: 28900, discount: 15, branches: ALL_BRANCHES, featured: true, art: 'box', color: '#9fd3f0' },
  { id: 'p4', name: 'Set de Bloques Didácticos x 60 piezas', brand: '', cat: 'juguetes', price: 27900, discount: 15, branches: ['farmavida'], featured: true, art: 'toy', color: '#f08a7e' },
  { id: 'p5', name: 'Whey Protein 1 kg Vainilla', brand: 'Star Nutrition', cat: 'gym', price: 45800, discount: 15, branches: FV_CEN, featured: true, art: 'jar', color: '#3bb49c' },
  { id: 'p6', name: 'Whey Protein 2 lb Chocolate', brand: 'Gentech', cat: 'gym', price: 42500, discount: 12, branches: ['libertad', 'farmavida'], featured: true, art: 'jar', color: '#8a5a44' },
  { id: 'p7', name: 'Gel Limpiador Facial Piel Grasa 200 ml', brand: '', cat: 'faciales', price: 17900, discount: 20, branches: ALL_BRANCHES, art: 'pump', color: '#7fb6d9' },
  { id: 'p8', name: 'Crema Hidratante Facial Piel Sensible 50 ml', brand: '', cat: 'faciales', price: 24900, discount: 20, branches: FV_CEN, art: 'jar', color: '#c9b6e4' },
  { id: 'p9', name: 'Agua Micelar Desmaquillante 400 ml', brand: '', cat: 'faciales', price: 14900, discount: 20, branches: ALL_BRANCHES, art: 'bottle', color: '#8fd0e8' },
  { id: 'p10', name: 'Base de Maquillaje Fluida Larga Duración 30 ml', brand: '', cat: 'maquillaje', price: 20900, discount: 20, branches: ALL_BRANCHES, art: 'dropper', color: '#d9a585' },
  { id: 'p11', name: 'Paleta de Sombras Tonos Nude · 12 colores', brand: '', cat: 'maquillaje', price: 16500, discount: 20, branches: ['farmavida', 'libertad'], art: 'compact', color: '#c98b7a' },
  { id: 'p12', name: 'Máscara de Pestañas Volumen Extremo', brand: '', cat: 'maquillaje', price: 13000, discount: 20, branches: ALL_BRANCHES, art: 'tube', color: '#2f3b37' },
  { id: 'p13', name: 'Protector Solar Corporal Spray FPS 30 200 ml', brand: '', cat: 'sol-y-agua', price: 30700, discount: 30, branches: ALL_BRANCHES, art: 'bottle', color: '#f2c14e' },
  { id: 'p14', name: 'After Sun Gel Aloe Vera Refrescante 250 ml', brand: '', cat: 'sol-y-agua', price: 13200, discount: 25, branches: FV_CEN, art: 'tube', color: '#7cc576' },
  { id: 'p15', name: 'Creatina Monohidrato 300 g', brand: 'ENA', cat: 'gym', price: 32900, discount: 10, branches: FV_CEN, art: 'jar', color: '#2f3b37' },
  { id: 'p16', name: 'BCAA 2:1:1 · 120 cápsulas', brand: 'Hoch Sport', cat: 'gym', price: 21900, discount: 10, branches: ['libertad', 'farmavida'], art: 'jar', color: '#e2685c' },
  { id: 'p17', name: 'Citrato de Magnesio + B6 · 60 comprimidos', brand: '', cat: 'gym', price: 12250, discount: 20, branches: ALL_BRANCHES, art: 'jar', color: '#72bd99' },
  { id: 'p18', name: 'Colágeno Hidrolizado + Vitamina C · 30 sobres', brand: '', cat: 'gym', price: 33100, discount: 20, branches: ALL_BRANCHES, art: 'box', color: '#f0a35e' },
  { id: 'p19', name: 'Leche Infantil Etapa 3 · 800 g', brand: '', cat: 'bebes', price: 24500, discount: 0, branches: ALL_BRANCHES, art: 'jar', color: '#9fd3f0' },
  { id: 'p20', name: 'Toallitas Húmedas Hipoalergénicas x 80', brand: '', cat: 'bebes', price: 4900, discount: 20, branches: ALL_BRANCHES, art: 'box', color: '#b9e2c9' },
  { id: 'p21', name: 'Aros de Acero Quirúrgico Bañados en Oro', brand: '', cat: 'joyas', price: 15900, discount: 20, branches: ALL_BRANCHES, art: 'ring', color: '#d4af6a' },
  { id: 'p22', name: 'Pulsera Tejida con Dije', brand: '', cat: 'joyas', price: 9900, discount: 0, branches: ALL_BRANCHES, art: 'ring', color: '#c9a0dc' },
  { id: 'p23', name: 'Muñeca Articulada con Accesorios', brand: '', cat: 'juguetes', price: 32500, discount: 10, branches: ['farmavida'], art: 'toy', color: '#e79bb0' },
  { id: 'p24', name: 'Short Deportivo Dry-Fit Mujer', brand: '', cat: 'indumentaria', price: 18900, discount: 20, branches: FV_CEN, art: 'shorts', color: '#3bb49c' },
  { id: 'p25', name: 'Remera Deportiva Dry-Fit', brand: '', cat: 'indumentaria', price: 19900, discount: 20, branches: FV_CEN, art: 'tee', color: '#72bd99' },
  { id: 'p26', name: 'Set de Regalo Body Splash + Crema de Manos', brand: '', cat: 'regalos', price: 22000, discount: 20, branches: ALL_BRANCHES, art: 'box', color: '#e79bb0' },
  { id: 'p27', name: 'Cartera Neceser Matelassé con Cierre', brand: '', cat: 'carteras', price: 31100, discount: 20, branches: FV_CEN, art: 'bag', color: '#1e2925' },
];

const STORAGE = {
  branch: 'rf_branch',
  cart: 'rf_cart',
  customer: 'redfarmako_customer',
  catalog: 'redfarmako_catalog',
  adminSession: 'rf_admin_ok',
};

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
 *   items: { id: string, name: string, brand: string, qty: number, unitPrice: number, subtotal: number }[],
 *   total: number
 * }} orderData
 * @returns {Promise<void>}
 */
async function saveOrderToDatabase(orderData) {
  // TODO: reemplazar por la escritura en Firestore.
  console.info('[Red Farmako] Pedido listo para guardar:', orderData);
}

/**
 * Conector de sincronización del catálogo (próximo paso). Hoy solo guarda local.
 * Con SYNC_CONFIG.provider = 'firebase', acá va la escritura en Firestore:
 *   await setDoc(doc(db, SYNC_CONFIG.firebase.collection, p.id), p) por cada producto.
 * @param {object[]} products
 */
async function syncCatalogToCloud(products) {
  if (SYNC_CONFIG.provider !== 'firebase') return;
  console.info('[Red Farmako] Pendiente: sincronizar', products.length, 'productos con Firestore.');
}

/** Sube una foto a Cloudinary (si está configurado). Devuelve la URL pública o null. */
async function uploadImageToCloud(file) {
  const { cloudName, uploadPreset, folder } = SYNC_CONFIG.cloudinary;
  if (!cloudName || !uploadPreset) return null;
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);
  if (folder) body.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body });
  if (!res.ok) throw new Error('Cloudinary respondió ' + res.status);
  return (await res.json()).secure_url;
}

/* ---------------- Helpers ---------------- */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => '$' + Math.round(n).toLocaleString('es-AR');
const catById = id => CATEGORIES.find(c => c.id === id);
const branchById = id => BRANCHES.find(b => b.id === id);
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* sin storage */ } },
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
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18"/><path d="M9 20v-5h6v5"/>',
};
const brandVars = b => `--c1:${b.colors[0]};--c2:${b.colors[1]}`;

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-show'), 2600);
}

/* ---------------- Imágenes de marca ---------------- */

$$('[data-asset]').forEach(img => { img.src = asset(ASSETS[img.dataset.asset]); });
$$('[data-turnos-url]').forEach(a => { a.href = TURNOS_URL; });

/* ---------------- Catálogo: modelo y almacenamiento ---------------- */

const finalPrice = p => Math.round(p.price * (1 - (p.discount || 0) / 100));
const clampNum = (v, min, max, def = 0) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };

/** Solo acepta imágenes http(s), data:image o rutas relativas dentro del sitio. */
function safeImageSrc(src) {
  const s = String(src || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(s)) return s;
  if (/^[^:]+$/.test(s) && !s.startsWith('//')) {
    const clean = s.replace(/^\.\//, '');
    return clean.startsWith('img/') ? './' + clean.split('/').map(encodeURIComponent).join('/') : asset(clean);
  }
  return '';
}

/** Normaliza un producto (del panel, del JSON o de un CSV importado). Devuelve null si es inválido. */
function sanitizeProduct(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name || '').trim();
  const cat = catById(raw.cat) ? raw.cat : null;
  const price = clampNum(raw.price, 0, 1e9, NaN);
  if (!name || !cat || !Number.isFinite(price) || price <= 0) return null;
  let branches = Array.isArray(raw.branches) ? raw.branches : String(raw.branches || '').split(/[|,;]/);
  branches = [...new Set(branches.map(s => String(s).trim()).filter(id => branchById(id)))];
  if (!branches.length) branches = [...ALL_BRANCHES];
  const bool = (v, def) => (v === undefined || v === '' ? def : v === true || v === 'true' || v === '1' || v === 1 || v === 'si' || v === 'sí');
  return {
    id: String(raw.id || 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)).slice(0, 40),
    name: name.slice(0, 140),
    brand: String(raw.brand || '').trim().slice(0, 60),
    cat,
    price: Math.round(price),
    discount: Math.round(clampNum(raw.discount, 0, 90)),
    branches,
    image: String(raw.image || '').trim(),
    featured: bool(raw.featured, false),
    inStock: bool(raw.inStock, true),
    active: bool(raw.active, true),
    art: raw.art || catById(cat).art,
    color: /^#[0-9a-f]{3,8}$/i.test(raw.color || '') ? raw.color : catById(cat).color,
  };
}

const Catalog = {
  products: DEFAULT_PRODUCTS.map(sanitizeProduct),
  updatedAt: 0,
  source: 'muestra', // 'muestra' | 'publicado' | 'local'
  remoteUpdatedAt: 0,

  /** Carga inicial sincrónica: cambios locales del panel (si hay) o la muestra. */
  boot() {
    const local = store.get(STORAGE.catalog, null);
    if (local && Array.isArray(local.products)) {
      this.products = local.products.map(sanitizeProduct).filter(Boolean);
      this.updatedAt = local.updatedAt || 0;
      this.source = 'local';
    }
  },

  /** Trae el catálogo publicado. Gana el más reciente entre publicado y local. */
  async loadPublished() {
    try {
      const res = await fetch(CATALOG_URL, { cache: 'no-cache' });
      if (!res.ok) return false;
      const data = await res.json();
      const list = (Array.isArray(data) ? data : data.products || []).map(sanitizeProduct).filter(Boolean);
      if (!list.length) return false;
      this.remoteUpdatedAt = data.updatedAt || 0;
      if (this.source === 'local' && this.updatedAt >= this.remoteUpdatedAt) return false;
      this.products = list;
      this.updatedAt = this.remoteUpdatedAt;
      this.source = 'publicado';
      return true;
    } catch { return false; }
  },

  saveLocal() {
    this.updatedAt = Date.now();
    this.source = 'local';
    const ok = store.set(STORAGE.catalog, { version: 1, updatedAt: this.updatedAt, products: this.products });
    if (!ok) toast('⚠️ No hay espacio para guardar. Usá fotos por link o Cloudinary.');
    syncCatalogToCloud(this.products).catch(err => console.error(err));
    return ok;
  },

  async discardLocal() {
    store.del(STORAGE.catalog);
    this.products = DEFAULT_PRODUCTS.map(sanitizeProduct);
    this.updatedAt = 0;
    this.source = 'muestra';
    await this.loadPublished();
  },

  byId(id) { return this.products.find(p => String(p.id) === String(id)); },
  upsert(p) {
    const i = this.products.findIndex(x => x.id === p.id);
    if (i > -1) this.products[i] = p; else this.products.unshift(p);
    this.saveLocal();
  },
  remove(id) { this.products = this.products.filter(p => p.id !== id); this.saveLocal(); },
  toJSON() { return { version: 1, updatedAt: this.updatedAt || Date.now(), products: this.products }; },
};
Catalog.boot();
const productById = id => Catalog.byId(id);

/* ---------------- Disponibilidad por sucursal ---------------- */

const catAvailable = (c, branchId) => !!c && (!branchId || c.branches.includes(branchId));
const productVisible = (p, branchId) => p.active && (!branchId || p.branches.includes(branchId)) && catAvailable(catById(p.cat), branchId);
const visibleCategories = branchId => {
  const cats = CATEGORIES.filter(c => catAvailable(c, branchId));
  const featured = branchById(branchId)?.featuredCats || [];
  return [...cats.filter(c => featured.includes(c.id)), ...cats.filter(c => !featured.includes(c.id))];
};
const branchNames = ids => ids.map(id => shortName(branchById(id))).join(', ');

/* ---------------- Ilustraciones de producto (SVG, si no hay foto) ---------------- */

function productArt(p) {
  const c = p.color || '#72bd99';
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
    shorts: `<path d="M24 40h52l6 66H58l-8-34-8 34H18z" fill="${c}"/><rect x="24" y="40" width="52" height="10" fill="#fff" opacity=".35"/><path d="M50 50v14" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`,
    ring: `<circle cx="50" cy="84" r="24" fill="none" stroke="${c}" stroke-width="7"/><path d="M38 52l6-12h12l6 12-12 12z" fill="#bfe6f5" stroke="#fff" stroke-width="2"/><path d="M38 52h24M44 40l6 12 6-12" stroke="#fff" stroke-opacity=".7" fill="none"/>`,
    toy: `<rect x="18" y="74" width="30" height="30" rx="4" fill="${c}"/><rect x="52" y="74" width="30" height="30" rx="4" fill="#72bd99"/><rect x="35" y="40" width="30" height="30" rx="4" fill="#f5b54a"/><circle cx="33" cy="89" r="5" fill="#fff" opacity=".6"/><circle cx="67" cy="89" r="5" fill="#fff" opacity=".6"/><circle cx="50" cy="55" r="5" fill="#fff" opacity=".6"/>`,
  };
  return `<svg viewBox="0 0 100 140" aria-hidden="true">${shapes[p.art] || shapes.box}</svg>`;
}
const productMedia = p => {
  const src = safeImageSrc(p.image);
  return src ? `<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" decoding="async" />` : productArt(p);
};

/* ---------------- Turnos: hora argentina y regla de las 08:00 ---------------- */

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
    return c && Date.now() - c.at < 6 * HOUR ? c.map : {};
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
    refreshStatus();
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
const upcomingDuties = (count = 4) => Array.from({ length: count }, (_, k) => {
  const d = dutyAt(Date.now() + k * DAY);
  const label = fmtDayAR(new Date(Date.parse(d.dutyDate)));
  return { ...d, dayLabel: label[0].toUpperCase() + label.slice(1) };
});
// "15674723" → WhatsApp 5493757674723 · tel +5493757674723 · "(03757) 15-674723"
const localPhone = p => {
  const n = p.replace(/^15/, '');
  return { wa: `5493757${n}`, tel: `+5493757${n}`, display: `(03757) 15-${n}` };
};

function branchStatus(b, ms = Date.now()) {
  if (dutyAt(ms).branch === b.id) return { open: true, duty: true, label: 'De turno hoy · 24 hs' };
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
  return `<span class="status ${cls}"><span class="dot"></span>${esc(st.label)}</span>`;
}

/* ---------------- Estado ---------------- */

const state = {
  branch: store.get(STORAGE.branch, null),
  filter: 'all',
  cart: store.get(STORAGE.cart, {}),
  customer: store.get(STORAGE.customer, store.get('rf_customer', { name: '', phone: '', address: '' })),
};
if (state.branch && !branchById(state.branch)) state.branch = null;

/** Cambia la sucursal activa (null = todas) y sincroniza header, pestañas, catálogo y carrito. */
function setBranch(id, { silent = true, scroll = false } = {}) {
  state.branch = branchById(id) ? id : null;
  store.set(STORAGE.branch, state.branch);
  if (state.filter !== 'all' && !catAvailable(catById(state.filter), state.branch)) state.filter = 'all';
  renderBranchPicker();
  renderBranchTabs();
  renderStories();
  renderFilters();
  renderProducts();
  renderCartBranches();
  updateCheckoutLabel();
  renderCart();
  if (!silent) toast(state.branch ? `Viendo ${branchById(state.branch).name}` : 'Viendo todas las sucursales');
  if (scroll) $('#ofertas').scrollIntoView({ behavior: 'smooth' });
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
  $('#branchLabel').textContent = b ? shortName(b) : 'Todas';
  branchMenu.innerHTML = `<li><button role="option" aria-selected="${!state.branch}" data-branch="">
      ${icon(ICONS.store)}<span><b>Todas las sucursales</b><small>Ver el catálogo completo</small></span></button></li>` +
    BRANCHES.map(br => `<li><button role="option" aria-selected="${br.id === state.branch}" data-branch="${br.id}">
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
  setBranch(btn.dataset.branch || null, { silent: false });
  toggleBranchMenu(false);
});

// Placeholder corto en pantallas angostas para que no se corte
const searchInput = $('#searchInput');
const setPlaceholder = () => {
  searchInput.placeholder = innerWidth < 600 ? '¿Qué estás buscando hoy?' : '¿Qué estás buscando hoy? Ej: protector solar, pañales, magnesio…';
};
setPlaceholder();
addEventListener('resize', setPlaceholder, { passive: true });

/* ---------------- Menú lateral (☰) ---------------- */

const sideMenu = $('#sideMenu');
const sideBackdrop = $('#sideBackdrop');
const menuBtn = $('#menuBtn');

function openMenu(open) {
  sideMenu.classList.toggle('is-open', open);
  sideMenu.setAttribute('aria-hidden', !open);
  sideBackdrop.hidden = !open;
  menuBtn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) { renderSideDuty(); $('#menuClose').focus(); }
}
menuBtn.addEventListener('click', () => openMenu(true));
$('#menuClose').addEventListener('click', () => openMenu(false));
sideBackdrop.addEventListener('click', () => openMenu(false));
$$('[data-close-menu]').forEach(el => el.addEventListener('click', () => openMenu(false)));

function renderSideDuty() {
  const d = dutyAt();
  const b = d.branch && branchById(d.branch);
  const ph = localPhone(d.phone);
  const next = upcomingDuties(3).slice(1);
  $('#sideDuty').innerHTML = `
    <h4>📅 Farmacia de Turno Hoy</h4>
    <div class="side-duty__card ${b ? 'is-ours' : ''}">
      <b>${b ? `<span class="dot dot--live"></span>Red Farmako ${esc(b.name)}` : esc(d.name)}</b>
      <small>${esc(d.address)} · <a href="tel:${ph.tel}">${esc(ph.display)}</a></small>
      <small>24 hs · hasta las 08:00 hs del ${esc(d.endsLabel)}</small>
      ${b ? `<a class="btn btn--wa btn--sm" href="${waLink(b.phone, `Hola ${b.name}! 👋 Los contacto por el turno de hoy.`)}" target="_blank" rel="noopener">${icon(ICONS.wa)}WhatsApp</a>` : ''}
    </div>
    <ol class="side-duty__next">${next.map(n => `<li><span>${esc(n.dayLabel)}</span><b>${esc(n.name)}</b></li>`).join('')}</ol>
    <a class="btn btn--ghost btn--sm btn--block" href="${TURNOS_URL}" target="_blank" rel="noopener" data-turnos-modal>Ver cronograma completo ↗</a>`;
}

/* ---------------- Modal de turnos ---------------- */

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
  openMenu(false);
  openTurnosModal();
});
$('#turnosClose').addEventListener('click', () => turnosModal.close());
turnosModal.addEventListener('click', e => { if (e.target === turnosModal) turnosModal.close(); });

/** Punto verde sutil en el menú si una de las 3 sucursales está de turno. */
function renderDutyDot() {
  const d = dutyAt();
  $('#menuDot').hidden = !d.branch;
  menuBtn.setAttribute('aria-label', d.branch ? `Abrir menú (hoy de turno: ${branchById(d.branch).name})` : 'Abrir menú');
}

/* ---------------- Stories (GIFs) ---------------- */

function renderStories() {
  const featured = branchById(state.branch)?.featuredCats || [];
  $('#stories').innerHTML = visibleCategories(state.branch).map(c => `
    <button class="story ${state.filter === c.id ? 'is-active' : ''}" data-cat="${c.id}" aria-label="${esc(c.name)}">
      <span class="story__ring"><span class="story__media">
        ${icon(c.icon)}
        <img src="${asset(categoryGif(c))}" alt="" loading="lazy" decoding="async" onerror="this.remove()" />
      </span>${featured.includes(c.id) ? '<span class="story__star" title="Destacado en esta sucursal">★</span>' : ''}</span>
      <small>${esc(c.short)}</small>
    </button>`).join('');
}
$('#stories').addEventListener('click', e => {
  const s = e.target.closest('[data-cat]');
  if (s) applyFilter(state.filter === s.dataset.cat ? 'all' : s.dataset.cat, true);
});

/* ---------------- Hero ---------------- */

$('#logoFan').innerHTML = BRANCHES.map((b, n) =>
  `<figure style="--d:${n * 0.12}s"><img src="${asset(b.logoGray)}" alt="Red Farmako ${esc(b.name)}" /></figure>`).join('');
$('#heroProducts').innerHTML = [
  { art: 'tube', color: '#7cc576' }, { art: 'tube', color: '#f5b54a' }, { art: 'bottle', color: '#f2c14e' },
].map(productArt).join('');

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
        <button class="btn btn--ghost btn--sm btn--block branch__catalog" data-view-branch="${b.id}">${icon(ICONS.bag)}Ver productos de esta sucursal</button>
        <div class="branch__actions">
          <a class="btn btn--wa btn--sm" href="${waLink(b.phone, `Hola ${b.name}! 👋 Quería hacer una consulta.`)}" target="_blank" rel="noopener">${icon(ICONS.wa)}WhatsApp</a>
          <a class="icon-btn" href="${b.maps}" target="_blank" rel="noopener" aria-label="Ver ${esc(b.name)} en el mapa">${icon(ICONS.map)}</a>
          <a class="icon-btn" href="https://www.instagram.com/${b.instagram}" target="_blank" rel="noopener" aria-label="Instagram de ${esc(b.name)}">${icon(ICONS.ig)}</a>
        </div>
      </div>
    </article>`;
  }).join('');
}
$('#branches').addEventListener('click', e => {
  const btn = e.target.closest('[data-view-branch]');
  if (btn) setBranch(btn.dataset.viewBranch, { silent: false, scroll: true });
});

/* ---------------- Catálogo: pestañas de sucursal, filtros y productos ---------------- */

function renderBranchTabs() {
  const tabs = [{ id: '', label: 'Todas las sucursales' }, ...BRANCHES.map(b => ({ id: b.id, label: shortName(b), sub: b.lead.split(' ')[0], b }))];
  $('#branchTabs').innerHTML = tabs.map(t => `
    <button role="tab" class="branch-tab" data-tab-branch="${t.id}" aria-selected="${(t.id || null) === state.branch}" ${t.b ? `style="${brandVars(t.b)}"` : ''}>
      ${t.b ? `<span class="branch-tab__av"><img src="${asset(ASSETS.isotipo)}" alt="" /></span>` : icon(ICONS.store)}
      <span><b>${esc(t.label)}</b>${t.sub ? `<small>${esc(t.sub)}</small>` : ''}</span>
    </button>`).join('');

  const b = branchById(state.branch);
  const notice = $('#branchNotice');
  notice.hidden = !b;
  if (b) notice.innerHTML = `${icon(ICONS.pin)}<span>Viendo stock y ofertas disponibles en <b>${esc(b.name)}</b> (${esc(b.shortAddress)}).${b.highlight ? ` ${esc(b.highlight)}` : ''}</span>`;
}
$('#branchTabs').addEventListener('click', e => {
  const t = e.target.closest('[data-tab-branch]');
  if (t) setBranch(t.dataset.tabBranch || null);
});

function renderFilters() {
  $('#filters').innerHTML = [{ id: 'all', short: 'Todo' }, ...visibleCategories(state.branch)].map(c =>
    `<button role="tab" data-filter="${c.id}" aria-selected="${c.id === state.filter}">${esc(c.short)}</button>`).join('');
}
$('#filters').addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (b) applyFilter(b.dataset.filter); });

function applyFilter(cat, scroll) {
  if (cat !== 'all' && !catAvailable(catById(cat), state.branch)) {
    toast(`${catById(cat).name} no está disponible en ${branchById(state.branch).name}`);
    cat = 'all';
  }
  state.filter = cat;
  $$('#filters button').forEach(b => b.setAttribute('aria-selected', b.dataset.filter === cat));
  $$('.story').forEach(s => s.classList.toggle('is-active', s.dataset.cat === cat));
  renderProducts();
  if (scroll) $('#ofertas').scrollIntoView({ behavior: 'smooth' });
}

function catalogList() {
  return Catalog.products
    .filter(p => productVisible(p, state.branch) && (state.filter === 'all' || p.cat === state.filter))
    .sort((a, b) => (b.featured - a.featured) || (b.inStock - a.inStock));
}

function productCard(p, n) {
  const off = p.discount > 0;
  const where = !state.branch && p.branches.length < BRANCHES.length ? `<span class="product__where">Solo en ${esc(branchNames(p.branches))}</span>` : '';
  return `
    <article class="product ${p.inStock ? '' : 'is-out'}" id="p-${esc(p.id)}" style="animation-delay:${Math.min(n, 12) * 40}ms">
      <div class="product__media">
        ${off ? `<span class="product__off">-${p.discount}% OFF</span>` : ''}
        ${p.featured ? '<span class="product__tag">Destacado</span>' : ''}
        ${productMedia(p)}
        ${p.inStock ? '' : '<span class="product__stock">Sin stock</span>'}
      </div>
      <div class="product__body">
        <span class="product__cat">${esc(catById(p.cat).short)}${p.brand ? ` · ${esc(p.brand)}` : ''}</span>
        <h3 class="product__name">${esc(p.name)}</h3>
        ${where}
        <div class="product__price"><b>${money(finalPrice(p))}</b>${off ? `<s>${money(p.price)}</s>` : ''}</div>
        ${p.inStock
          ? `<button class="btn product__btn" data-add="${esc(p.id)}">${icon(ICONS.bag)}Consultar / Comprar</button>`
          : `<button class="btn product__btn product__btn--ask" data-ask="${esc(p.id)}">${icon(ICONS.wa)}Consultar disponibilidad</button>`}
      </div>
    </article>`;
}

function renderProducts() {
  const list = catalogList();
  $('#productsEmpty').hidden = list.length > 0;
  $('#products').innerHTML = list.map(productCard).join('');
}

$('#products').addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  const ask = e.target.closest('[data-ask]');
  if (ask) {
    const p = productById(ask.dataset.ask);
    const b = branchById(state.branch) || branchById(p.branches[0]);
    window.open(waLink(b.phone, `Hola ${b.name}! 👋 ¿Cuándo vuelve a ingresar "${p.name}"${p.brand ? ` (${p.brand})` : ''}?`), '_blank', 'noopener');
    return;
  }
  if (!add) return;
  addToCart(add.dataset.add);
  add.classList.add('is-added');
  add.innerHTML = `${icon(ICONS.check)}Agregado`;
  setTimeout(() => { add.classList.remove('is-added'); add.innerHTML = `${icon(ICONS.bag)}Consultar / Comprar`; }, 1400);
});

/* ---------------- Buscador predictivo ---------------- */

(() => {
  const input = searchInput;
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
        ['Protector solar', 'Pañales', 'Proteína', 'Sérum'].map(t =>
          `<button class="search__item" data-q="${esc(t)}"><span class="thumb">${icon(ICONS.trend)}</span><b>${esc(t)}</b></button>`).join('');
      box.hidden = false;
      return;
    }
    const terms = norm(q).split(/\s+/).filter(Boolean);
    const match = s => terms.every(t => norm(s).includes(t));
    const cats = visibleCategories(state.branch).filter(c => match(c.name));
    const prods = Catalog.products.filter(p => productVisible(p, state.branch) && match(`${p.name} ${p.brand} ${catById(p.cat).name}`)).slice(0, 6);
    let html = '';
    if (cats.length) html += `<div class="search__group">Categorías</div>` + cats.map(c =>
      `<button class="search__item" data-cat="${c.id}"><span class="thumb">${icon(c.icon)}</span><b>${highlight(c.name, q)}</b></button>`).join('');
    if (prods.length) html += `<div class="search__group">Productos${state.branch ? ` en ${esc(shortName(branchById(state.branch)))}` : ''}</div>` + prods.map(p =>
      `<button class="search__item" data-pid="${esc(p.id)}"><span class="thumb">${productMedia(p)}</span><span><b>${highlight(p.name, q)}</b><small>${esc(p.brand || catById(p.cat).short)}${p.discount ? ` · -${p.discount}%` : ''}</small></span><span class="price">${money(finalPrice(p))}</span></button>`).join('');
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
      const card = document.getElementById('p-' + p.id);
      if (!card) return;
      card.scrollIntoView({ block: 'center', behavior: 'smooth' });
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

const cartEntries = () => Object.entries(state.cart).map(([id, q]) => [productById(id), q]).filter(([p, q]) => p && p.active && q > 0);
const deliveryMode = () => $('input[name="delivery"]:checked').value;
const cartTotal = entries => entries.reduce((s, [p, q]) => s + finalPrice(p) * q, 0);

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
  const subtotal = cartTotal(entries);
  const b = branchById(state.branch);
  $('#cartCount').textContent = count;
  $('#cartSummary').textContent = `${count} producto${count === 1 ? '' : 's'}`;
  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartShipping').textContent = deliveryMode() === 'envio' ? 'A coordinar por WhatsApp' : 'Sin cargo (retiro)';
  $('#cartTotal').textContent = money(subtotal);
  $('#cartCheckout').disabled = !count;
  checkoutForm.hidden = !count;
  $('#cartItems').innerHTML = entries.length ? entries.map(([p, q]) => {
    const missing = b && !p.branches.includes(b.id);
    return `
    <div class="cart-item ${missing ? 'is-missing' : ''}">
      <span class="thumb">${productMedia(p)}</span>
      <div><b>${esc(p.name)}</b><small>${money(finalPrice(p) * q)}</small>
        ${missing ? `<em class="cart-item__warn">No disponible en ${esc(shortName(b))} · disponible en ${esc(branchNames(p.branches))}</em>` : ''}
        ${p.inStock ? '' : '<em class="cart-item__warn">Sin stock: te confirmamos ingreso</em>'}</div>
      <div class="qty"><button type="button" data-dec="${esc(p.id)}" aria-label="Quitar uno">−</button><span>${q}</span><button type="button" data-inc="${esc(p.id)}" aria-label="Agregar uno">+</button></div>
    </div>`;
  }).join('')
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
  setBranch(e.target.value);
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
  return [
    `Hola ${b.name}! 👋`,
    `Soy *${name}*${phone ? ` (tel. ${phone})` : ''} y quiero hacer este pedido desde la web de Red Farmako:`,
    '',
    '🛍️ *Detalle del pedido*',
    ...entries.map(([p, q]) => `• ${q} × ${p.name}${p.brand ? ` (${p.brand})` : ''} — ${money(finalPrice(p) * q)}`),
    '',
    `💳 *Total estimado:* ${money(cartTotal(entries))}`,
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
  const missing = entries.filter(([p]) => !p.branches.includes(b.id));
  if (missing.length) {
    toast(`${missing.length === 1 ? 'Un producto no está' : `${missing.length} productos no están`} en ${shortName(b)}. Quitalos o elegí otra sucursal.`);
    return;
  }

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
    items: entries.map(([p, q]) => ({ id: p.id, name: p.name, brand: p.brand, qty: q, unitPrice: finalPrice(p), subtotal: finalPrice(p) * q })),
    total: cartTotal(entries),
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
$$('[data-open-cart]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openMenu(false); openCart(true); }));

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
  if (sideMenu.classList.contains('is-open')) openMenu(false);
});

/* =========================================================
   PANEL DE ADMINISTRACIÓN DE PRODUCTOS Y OFERTAS
   ========================================================= */

const adminModal = $('#adminModal');
const adminBody = $('#adminBody');
const admin = {
  unlocked: (() => { try { return sessionStorage.getItem(STORAGE.adminSession) === '1'; } catch { return false; } })(),
  view: 'list', // 'list' | 'edit'
  editing: null,
  draftImage: '',
  q: '', fBranch: '', fCat: '',
};

function openAdmin() {
  admin.view = 'list';
  renderAdmin();
  adminModal.showModal();
}
$('#adminOpen').addEventListener('click', () => { openMenu(false); openAdmin(); });
$('#adminClose').addEventListener('click', () => adminModal.close());
$('#adminLock').addEventListener('click', () => {
  admin.unlocked = false;
  try { sessionStorage.removeItem(STORAGE.adminSession); } catch { /* */ }
  renderAdmin();
});

function renderAdmin() {
  $('#adminLock').hidden = !admin.unlocked;
  if (!admin.unlocked) { adminBody.innerHTML = adminPinHTML(); setTimeout(() => $('#adminPin')?.focus(), 50); return; }
  adminBody.innerHTML = admin.view === 'edit' ? adminEditorHTML() : adminListHTML();
  if (admin.view === 'list') renderAdminList();
  else updateFinalPricePreview();
}

/* ---- PIN ---- */
const adminPinHTML = () => `
  <form class="admin-pin" id="adminPinForm">
    <span class="admin-pin__icon" aria-hidden="true">🔐</span>
    <h3>Acceso para farmacéuticas</h3>
    <p>Ingresá el PIN para administrar productos y ofertas.</p>
    <input class="field field--pin" id="adminPin" type="password" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="PIN" aria-label="PIN" />
    <button class="btn btn--primary btn--block" type="submit">Ingresar</button>
  </form>`;

/* ---- Listado ---- */
const SOURCE_LABEL = { muestra: 'Catálogo de muestra', publicado: 'Catálogo publicado', local: 'Cambios guardados en este dispositivo' };

function adminListHTML() {
  const d = Catalog.updatedAt ? new Date(Catalog.updatedAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  return `
  <div class="admin-info ${Catalog.source === 'local' ? 'is-local' : ''}">
    <b>${SOURCE_LABEL[Catalog.source]}</b> · ${Catalog.products.length} productos · actualizado ${esc(d)}
    <p>Los cambios se ven al instante <b>en este dispositivo</b>. Para que los vean todos los clientes:
    descargá el catálogo (JSON) y reemplazá <code>catalogo-farmako.json</code> en el sitio, o conectá Firebase (SYNC_CONFIG).</p>
  </div>
  <div class="admin-toolbar">
    <button class="btn btn--primary btn--sm" data-admin="new">${icon(ICONS.plus)}Nuevo producto</button>
    <button class="btn btn--ghost btn--sm" data-admin="export-json">${icon(ICONS.download)}📥 Descargar catálogo (JSON)</button>
    <button class="btn btn--ghost btn--sm" data-admin="export-csv">${icon(ICONS.download)}CSV</button>
    <label class="btn btn--ghost btn--sm">${icon(ICONS.upload)}📤 Importar catálogo<input type="file" id="adminImport" accept=".json,.csv,application/json,text/csv" hidden /></label>
    ${Catalog.source === 'local' ? `<button class="btn btn--ghost btn--sm admin-danger" data-admin="discard">Descartar cambios locales</button>` : ''}
  </div>
  <div class="admin-filters">
    <input class="field" id="adminSearch" type="search" placeholder="Buscar por nombre o marca…" value="${esc(admin.q)}" />
    <select class="field" id="adminFBranch">
      <option value="">Todas las sucursales</option>
      ${BRANCHES.map(b => `<option value="${b.id}" ${admin.fBranch === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}
    </select>
    <select class="field" id="adminFCat">
      <option value="">Todas las categorías</option>
      ${CATEGORIES.map(c => `<option value="${c.id}" ${admin.fCat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
    </select>
  </div>
  <div class="admin-list" id="adminList"></div>`;
}

function renderAdminList() {
  const q = norm(admin.q);
  const list = Catalog.products.filter(p =>
    (!q || norm(`${p.name} ${p.brand}`).includes(q)) &&
    (!admin.fBranch || p.branches.includes(admin.fBranch)) &&
    (!admin.fCat || p.cat === admin.fCat));
  $('#adminList').innerHTML = list.length ? list.map(p => `
    <div class="admin-row ${p.active ? '' : 'is-paused'}">
      <span class="thumb">${productMedia(p)}</span>
      <div class="admin-row__main">
        <b>${esc(p.name)}</b>
        <small>${esc(catById(p.cat).short)}${p.brand ? ` · ${esc(p.brand)}` : ''} · ${esc(branchNames(p.branches))}</small>
        <span class="admin-row__price">${money(finalPrice(p))}${p.discount ? ` <s>${money(p.price)}</s> <em>-${p.discount}%</em>` : ''}</span>
      </div>
      <div class="admin-row__toggles">
        <button class="chip-toggle ${p.active ? 'is-on' : ''}" data-admin="toggle-active" data-id="${esc(p.id)}" title="Pausar / publicar">${p.active ? 'Publicado' : 'Pausado'}</button>
        <button class="chip-toggle ${p.inStock ? 'is-on' : ''}" data-admin="toggle-stock" data-id="${esc(p.id)}">${p.inStock ? 'En stock' : 'Sin stock'}</button>
        <button class="chip-toggle ${p.featured ? 'is-on' : ''}" data-admin="toggle-featured" data-id="${esc(p.id)}">${p.featured ? '★ Destacado' : '☆ Destacar'}</button>
      </div>
      <div class="admin-row__actions">
        <button class="icon-btn" data-admin="edit" data-id="${esc(p.id)}" aria-label="Editar ${esc(p.name)}">${icon(ICONS.edit)}</button>
        <button class="icon-btn admin-danger" data-admin="delete" data-id="${esc(p.id)}" aria-label="Eliminar ${esc(p.name)}">${icon(ICONS.trash)}</button>
      </div>
    </div>`).join('') : '<p class="admin-empty">No hay productos con esos filtros.</p>';
}

/* ---- Editor ---- */
function adminEditorHTML() {
  const p = admin.editing;
  const isNew = !Catalog.byId(p.id);
  return `
  <form class="admin-form" id="adminForm" novalidate>
    <div class="admin-form__head">
      <button type="button" class="btn btn--ghost btn--sm" data-admin="back">← Volver</button>
      <h3>${isNew ? 'Nuevo producto' : 'Editar producto'}</h3>
    </div>
    <div class="admin-form__grid">
      <div class="admin-form__col">
        <label class="lbl">Nombre del producto *<input class="field" name="name" required maxlength="140" value="${esc(p.name)}" placeholder="Ej: Pañales Talle G x 36" /></label>
        <label class="lbl">Marca<input class="field" name="brand" maxlength="60" value="${esc(p.brand)}" placeholder="Ej: Star Nutrition" /></label>
        <label class="lbl">Categoría *
          <select class="field" name="cat">${CATEGORIES.map(c => `<option value="${c.id}" ${p.cat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
        </label>
        <div class="admin-form__row">
          <label class="lbl">Precio normal ($) *<input class="field" name="price" type="number" inputmode="numeric" min="1" step="1" value="${p.price || ''}" required /></label>
          <label class="lbl">% Descuento<input class="field" name="discount" type="number" inputmode="numeric" min="0" max="90" step="1" value="${p.discount || 0}" /></label>
        </div>
        <p class="admin-final" id="adminFinal"></p>

        <fieldset class="lbl">
          <legend>Disponible en *</legend>
          <div class="admin-checks">
            ${BRANCHES.map(b => `<label class="admin-check"><input type="checkbox" name="branches" value="${b.id}" ${p.branches.includes(b.id) ? 'checked' : ''} /><span>${esc(shortName(b))} <small>(${esc(b.lead.split(' ')[0])})</small></span></label>`).join('')}
          </div>
          <small class="admin-hint" id="adminCatHint"></small>
        </fieldset>

        <div class="admin-switches">
          <label class="switch"><input type="checkbox" name="featured" ${p.featured ? 'checked' : ''} /><span></span>Destacar en Ofertas de la Semana</label>
          <label class="switch"><input type="checkbox" name="inStock" ${p.inStock ? 'checked' : ''} /><span></span>En stock</label>
          <label class="switch"><input type="checkbox" name="active" ${p.active ? 'checked' : ''} /><span></span>Publicado (visible en la web)</label>
        </div>
      </div>

      <div class="admin-form__col">
        <span class="lbl">Imagen del producto</span>
        <div class="admin-img" id="adminImgPreview">${productMedia({ ...p, image: admin.draftImage })}</div>
        <label class="btn btn--ghost btn--sm btn--block">${icon(ICONS.upload)}Subir foto (celular o PC)<input type="file" id="adminImgFile" accept="image/*" hidden /></label>
        <label class="lbl">…o pegá un link / archivo de img/
          <input class="field" name="image" id="adminImgUrl" value="${esc(admin.draftImage.startsWith('data:') ? '' : admin.draftImage)}" placeholder="https://… o productos/panales.jpg" />
        </label>
        <small class="admin-hint">${admin.draftImage.startsWith('data:') ? 'Foto subida desde el dispositivo (comprimida). ' : ''}Si no hay foto se muestra una ilustración.
          ${admin.draftImage ? '<button type="button" class="link" data-admin="clear-img">Quitar imagen</button>' : ''}</small>
      </div>
    </div>
    <div class="admin-form__foot">
      <button type="button" class="btn btn--ghost" data-admin="back">Cancelar</button>
      <button type="submit" class="btn btn--primary">${icon(ICONS.check)}Guardar producto</button>
    </div>
  </form>`;
}

function updateFinalPricePreview() {
  const f = $('#adminForm');
  if (!f) return;
  const price = Number(f.price.value) || 0;
  const disc = clampNum(f.discount.value, 0, 90);
  $('#adminFinal').innerHTML = price
    ? (disc ? `Precio final: <b>${money(price * (1 - disc / 100))}</b> <span class="product__off">-${Math.round(disc)}% OFF</span>` : `Precio final: <b>${money(price)}</b> (sin oferta)`)
    : '';
  const cat = catById(f.cat.value);
  const blocked = BRANCHES.filter(b => !cat.branches.includes(b.id));
  $('#adminCatHint').textContent = blocked.length ? `${cat.name} no se muestra en ${branchNames(blocked.map(b => b.id))} (esa sucursal no tiene la sección).` : '';
}

/** Comprime una foto a máx. 900 px (WebP/JPEG) para que entre en el catálogo. */
function compressImage(file, max = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      let out = c.toDataURL('image/webp', quality);
      if (!out.startsWith('data:image/webp')) out = c.toDataURL('image/jpeg', quality);
      resolve(out);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
    img.src = url;
  });
}

/* ---- Exportar / importar ---- */
function download(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const CSV_COLS = ['id', 'name', 'brand', 'cat', 'price', 'discount', 'branches', 'image', 'featured', 'inStock', 'active'];
const csvCell = v => { const s = String(v ?? ''); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
function toCSV(products) {
  return [CSV_COLS.join(','), ...products.map(p => CSV_COLS.map(k => csvCell(k === 'branches' ? p.branches.join('|') : p[k])).join(','))].join('\n');
}
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter(r => r.some(c => c.trim()));
  const keys = head.map(h => h.trim());
  return body.map(r => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ''])));
}
async function importCatalog(file) {
  const text = await file.text();
  let raw;
  try {
    raw = /\.csv$/i.test(file.name) || file.type === 'text/csv' ? parseCSV(text.replace(/^﻿/, '')) : JSON.parse(text);
  } catch { toast('El archivo no tiene un formato válido'); return; }
  const list = (Array.isArray(raw) ? raw : raw.products || []).map(sanitizeProduct).filter(Boolean);
  if (!list.length) { toast('No se encontraron productos válidos en el archivo'); return; }
  if (!confirm(`¿Reemplazar el catálogo actual por ${list.length} productos del archivo?`)) return;
  Catalog.products = list;
  Catalog.saveLocal();
  refreshCatalog();
  renderAdmin();
  toast(`Catálogo importado: ${list.length} productos ✓`);
}

/* ---- Eventos del panel ---- */
adminBody.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'adminPinForm') {
    if ($('#adminPin').value.trim() === ADMIN_PIN) {
      admin.unlocked = true;
      try { sessionStorage.setItem(STORAGE.adminSession, '1'); } catch { /* */ }
      renderAdmin();
    } else {
      $('#adminPin').classList.add('is-invalid');
      toast('PIN incorrecto');
    }
    return;
  }
  if (e.target.id === 'adminForm') {
    const f = e.target;
    const data = {
      ...admin.editing,
      name: f.name.value, brand: f.brand.value, cat: f.cat.value,
      price: f.price.value, discount: f.discount.value || 0,
      branches: $$('input[name="branches"]:checked', f).map(i => i.value),
      featured: f.featured.checked, inStock: f.inStock.checked, active: f.active.checked,
      image: admin.draftImage,
    };
    const errs = [];
    if (!data.name.trim()) { f.name.classList.add('is-invalid'); errs.push('el nombre'); }
    if (!(Number(data.price) > 0)) { f.price.classList.add('is-invalid'); errs.push('el precio'); }
    if (!data.branches.length) errs.push('al menos una sucursal');
    if (errs.length) { toast(`Completá ${errs.join(', ')}`); return; }
    // Si cambió la categoría, la ilustración por defecto pasa a ser la de la nueva categoría.
    const sameCat = data.cat === admin.editing.cat;
    const p = sanitizeProduct({ ...data, art: sameCat ? admin.editing.art : undefined, color: sameCat ? admin.editing.color : undefined });
    Catalog.upsert(p);
    refreshCatalog();
    admin.view = 'list';
    renderAdmin();
    toast(`Guardado: ${p.name} ✓`);
  }
});

adminBody.addEventListener('click', e => {
  const btn = e.target.closest('[data-admin]');
  if (!btn) return;
  const id = btn.dataset.id;
  const p = id && Catalog.byId(id);
  switch (btn.dataset.admin) {
    case 'new':
      admin.editing = { id: 'p' + Date.now().toString(36), name: '', brand: '', cat: CATEGORIES[0].id, price: '', discount: 0, branches: [...ALL_BRANCHES], image: '', featured: false, inStock: true, active: true };
      admin.draftImage = '';
      admin.view = 'edit'; renderAdmin(); break;
    case 'edit':
      admin.editing = { ...p, branches: [...p.branches] };
      admin.draftImage = p.image || '';
      admin.view = 'edit'; renderAdmin(); break;
    case 'back':
      admin.view = 'list'; renderAdmin(); break;
    case 'clear-img':
      admin.draftImage = ''; renderAdminImage(); break;
    case 'delete':
      if (confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) { Catalog.remove(id); refreshCatalog(); renderAdminList(); toast('Producto eliminado'); }
      break;
    case 'toggle-active': p.active = !p.active; Catalog.saveLocal(); refreshCatalog(); renderAdminList(); toast(p.active ? 'Producto publicado' : 'Producto pausado'); break;
    case 'toggle-stock': p.inStock = !p.inStock; Catalog.saveLocal(); refreshCatalog(); renderAdminList(); break;
    case 'toggle-featured': p.featured = !p.featured; Catalog.saveLocal(); refreshCatalog(); renderAdminList(); break;
    case 'export-json':
      download('catalogo-farmako.json', JSON.stringify(Catalog.toJSON(), null, 2), 'application/json');
      toast('Descargado catalogo-farmako.json'); break;
    case 'export-csv':
      download('catalogo-farmako.csv', '﻿' + toCSV(Catalog.products), 'text/csv;charset=utf-8');
      toast('Descargado catalogo-farmako.csv'); break;
    case 'discard':
      if (confirm('¿Descartar los cambios de este dispositivo y volver al catálogo publicado?')) {
        Catalog.discardLocal().then(() => { refreshCatalog(); renderAdmin(); toast('Se restauró el catálogo publicado'); });
      }
      break;
  }
});

function renderAdminImage() {
  const prev = $('#adminImgPreview');
  if (!prev) return;
  prev.innerHTML = productMedia({ ...admin.editing, cat: $('#adminForm').cat.value, art: catById($('#adminForm').cat.value).art, image: admin.draftImage });
}

adminBody.addEventListener('input', e => {
  const t = e.target;
  t.classList?.remove('is-invalid');
  if (t.id === 'adminSearch') { admin.q = t.value; renderAdminList(); }
  if (t.id === 'adminImgUrl') { admin.draftImage = t.value.trim(); renderAdminImage(); }
  if (t.closest?.('#adminForm') && ['price', 'discount', 'cat'].includes(t.name)) updateFinalPricePreview();
});

adminBody.addEventListener('change', async e => {
  const t = e.target;
  if (t.id === 'adminFBranch') { admin.fBranch = t.value; renderAdminList(); }
  if (t.id === 'adminFCat') { admin.fCat = t.value; renderAdminList(); }
  if (t.name === 'cat') { updateFinalPricePreview(); renderAdminImage(); }
  if (t.id === 'adminImport' && t.files[0]) { await importCatalog(t.files[0]); t.value = ''; }
  if (t.id === 'adminImgFile' && t.files[0]) {
    const file = t.files[0];
    try {
      toast('Procesando foto…');
      const cloudUrl = await uploadImageToCloud(file).catch(err => { console.warn(err); return null; });
      admin.draftImage = cloudUrl || await compressImage(file);
      $('#adminImgUrl').value = cloudUrl || '';
      renderAdminImage();
      toast(cloudUrl ? 'Foto subida a Cloudinary ✓' : 'Foto lista ✓ (guardada en el catálogo)');
    } catch { toast('No se pudo procesar la foto'); }
    t.value = '';
  }
});
adminModal.addEventListener('click', e => { if (e.target === adminModal) adminModal.close(); });

/* ---------------- Footer ---------------- */

$('#footerCats').innerHTML = CATEGORIES.map(c => `<li><button data-fcat="${c.id}">${esc(c.name)}</button></li>`).join('');
$('#footerCats').addEventListener('click', e => { const b = e.target.closest('[data-fcat]'); if (b) applyFilter(b.dataset.fcat, true); });
$('#footerBranches').innerHTML = BRANCHES.map(b => `<li class="footer__branch"><b>${esc(b.name)}</b>
  <a href="tel:+${b.phone}">${esc(b.phoneDisplay)}</a>
  <a href="https://www.instagram.com/${b.instagram}" target="_blank" rel="noopener">@${esc(b.instagram)}</a></li>`).join('');
$('#year').textContent = new Date().getFullYear();

/* ---------------- Init ---------------- */

/** Re-dibuja todo lo que depende del catálogo. */
function refreshCatalog() {
  for (const id of Object.keys(state.cart)) if (!productById(id)) delete state.cart[id];
  renderStories();
  renderFilters();
  renderProducts();
  renderCart();
}
/** Re-dibuja todo lo que depende de la hora / turno. */
function refreshStatus() {
  renderDutyDot();
  renderBranches();
  renderBranchPicker();
  if (sideMenu.classList.contains('is-open')) renderSideDuty();
}

renderBranchTabs();
renderCartBranches();
updateCheckoutLabel();
refreshCatalog();
refreshStatus();
Catalog.loadPublished().then(changed => { if (changed) refreshCatalog(); });
syncOfficialSchedule();
// Refresca estados cada minuto (incluye el cambio de turno de las 08:00).
setInterval(refreshStatus, 60_000);

/* =========================================================
   Red Farmako · núcleo compartido (tienda + admin.html)
   Configuración, sucursales, categorías, catálogo y utilidades.
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
// lead: Dirección Técnica (solo se muestra en la sección institucional "Nuestras Sucursales").
// featuredCats: categorías que se ordenan primero cuando se elige esa sucursal.
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
    shortAddress: 'Av. Neuquén (Fte. al Gallego)',
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Neuquen+Comandante+Andresito+Misiones',
    logoWhite: 'web/farmavida-blanco.png', // ← 14.png
    logoGray: 'web/farmavida-gris.png',    // ← 15.png
    colors: ['#72bd99', '#3bb49c'],
    featuredCats: ['juguetes', 'indumentaria', 'joyas'],
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
    hours: [[['09:00', '13:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']], [['08:00', '22:00']]],
    hoursLabel: 'Lun a Sáb 8 a 22 h · Dom 9 a 13 h',
  },
];
const ALL_BRANCHES = BRANCHES.map(b => b.id);

/* ---------------- CONFIG: CATÁLOGO Y SINCRONIZACIÓN ---------------- */

// Catálogo publicado para todos los clientes. Lo que se edita en admin.html queda guardado
// en ESE navegador (y se ve al instante en la tienda abierta en ese mismo navegador); para
// publicarlo para todos, descargar el JSON desde el panel y reemplazar este archivo en el
// repositorio, o conectar Firebase abajo.
const CATALOG_URL = 'catalogo-farmako.json';

// Conectores para el próximo paso (sincronización en la nube).
const SYNC_CONFIG = {
  provider: 'local', // 'local' | 'firebase'
  firebase: {
    // Completar con los datos del proyecto (Consola Firebase → Configuración del proyecto).
    apiKey: '',
    authDomain: '',
    projectId: '',
    productsCollection: 'products',
    customersCollection: 'customers',
    ordersCollection: 'orders',
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
// El catálogo real se administra desde admin.html.
// price: precio normal · discount: % de descuento (0 = sin oferta)
// branches: en qué sucursales está disponible · featured: aparece primero ("Destacado")
// overrides: valores propios de una sucursal { central: { price, discount, inStock, featured, active } }
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
  account: 'redfarmako_account',
  orders: 'redfarmako_orders',
  catalog: 'redfarmako_catalog',
  adminSession: 'rf_admin_scope',
};

/* ---------------- CONECTORES EN LA NUBE (próximo paso) ---------------- */

/**
 * Sincroniza el catálogo con la nube. Hoy solo guarda local.
 * Con SYNC_CONFIG.provider = 'firebase', acá va la escritura en Firestore:
 *   await setDoc(doc(db, SYNC_CONFIG.firebase.productsCollection, p.id), p) por cada producto.
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
// normalize('NFC'): evita tildes "sueltas" (e + ´) si un texto llega descompuesto (ej. pegado de otra app).
const esc = s => String(s ?? '').normalize('NFC').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = (phone, text) => `https://wa.me/${phone}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* sin storage */ } },
};
const icon = (paths, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
// Logo oficial de WhatsApp (relleno, no trazo).
const WA_PATH = 'M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.3z';
const waIcon = (cls = 'i i--wa') => `<svg class="${cls}" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="${WA_PATH}"/></svg>`;
const ICONS = {
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  bag: '<path d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18"/><path d="M9 20v-5h6v5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  repeat: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
  logout: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
};
const brandVars = b => `--c1:${b.colors[0]};--c2:${b.colors[1]}`;

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-show'), 2600);
}

/* ---------------- Catálogo: modelo, valores por sucursal y almacenamiento ---------------- */

const clampNum = (v, min, max, def = 0) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };
const toBool = (v, def) => (v === undefined || v === '' || v === null ? def : v === true || v === 'true' || v === '1' || v === 1 || v === 'si' || v === 'sí');
const OVERRIDE_KEYS = ['price', 'discount', 'inStock', 'featured', 'active'];

/** Valores efectivos de un producto en una sucursal (precio, oferta, stock, destacado, publicado propios). */
const eff = (p, branchId) => {
  const o = branchId && p.overrides && p.overrides[branchId];
  return o ? { ...p, ...o } : p;
};
const finalPrice = (p, branchId) => { const e = eff(p, branchId); return Math.round(e.price * (1 - (e.discount || 0) / 100)); };

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

function sanitizeOverrides(raw) {
  let o = raw;
  if (typeof o === 'string') { try { o = JSON.parse(o || '{}'); } catch { o = {}; } }
  const out = {};
  for (const [bid, v] of Object.entries(o || {})) {
    if (!branchById(bid) || !v || typeof v !== 'object') continue;
    const s = {};
    if (v.price !== undefined && Number(v.price) > 0) s.price = Math.round(Number(v.price));
    if (v.discount !== undefined) s.discount = Math.round(clampNum(v.discount, 0, 90));
    for (const k of ['inStock', 'featured', 'active']) if (v[k] !== undefined) s[k] = toBool(v[k], true);
    if (Object.keys(s).length) out[bid] = s;
  }
  return out;
}

/** Normaliza un producto (del panel, del JSON o de un CSV importado). Devuelve null si es inválido. */
function sanitizeProduct(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name || '').normalize('NFC').trim();
  const cat = catById(raw.cat) ? raw.cat : null;
  const price = clampNum(raw.price, 0, 1e9, NaN);
  if (!name || !cat || !Number.isFinite(price) || price <= 0) return null;
  let branches = Array.isArray(raw.branches) ? raw.branches : String(raw.branches || '').split(/[|,;]/);
  branches = [...new Set(branches.map(s => String(s).trim()).filter(id => branchById(id)))];
  if (!branches.length) branches = [...ALL_BRANCHES];
  const overrides = sanitizeOverrides(raw.overrides);
  for (const bid of Object.keys(overrides)) if (!branches.includes(bid)) delete overrides[bid];
  const p = {
    id: String(raw.id || 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)).slice(0, 40),
    name: name.slice(0, 140),
    brand: String(raw.brand || '').normalize('NFC').trim().slice(0, 60),
    cat,
    price: Math.round(price),
    discount: Math.round(clampNum(raw.discount, 0, 90)),
    branches,
    image: String(raw.image || '').trim(),
    featured: toBool(raw.featured, false),
    inStock: toBool(raw.inStock, true),
    active: toBool(raw.active, true),
    art: raw.art || catById(cat).art,
    color: /^#[0-9a-f]{3,8}$/i.test(raw.color || '') ? raw.color : catById(cat).color,
  };
  if (Object.keys(overrides).length) p.overrides = overrides;
  return p;
}

const Catalog = {
  products: DEFAULT_PRODUCTS.map(sanitizeProduct),
  updatedAt: 0,
  source: 'muestra', // 'muestra' | 'publicado' | 'local'
  remoteUpdatedAt: 0,

  /** Carga sincrónica: cambios locales del panel (si hay) o la muestra. */
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
    const ok = store.set(STORAGE.catalog, { version: 2, updatedAt: this.updatedAt, products: this.products });
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
  toJSON() { return { version: 2, updatedAt: this.updatedAt || Date.now(), products: this.products }; },
};
Catalog.boot();
const productById = id => Catalog.byId(id);

/* ---------------- Disponibilidad por sucursal ---------------- */

const catAvailable = (c, branchId) => !!c && (!branchId || c.branches.includes(branchId));
const productVisible = (p, branchId) => eff(p, branchId).active && (!branchId || p.branches.includes(branchId)) && catAvailable(catById(p.cat), branchId);
const visibleCategories = branchId => {
  const cats = CATEGORIES.filter(c => catAvailable(c, branchId));
  const featured = branchById(branchId)?.featuredCats || [];
  return [...cats.filter(c => featured.includes(c.id)), ...cats.filter(c => !featured.includes(c.id))];
};
const branchNames = ids => ids.map(id => branchById(id).name).join(', ');

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

/* ---------------- Imágenes de marca (ambas páginas) ---------------- */

$$('[data-asset]').forEach(img => { img.src = asset(ASSETS[img.dataset.asset]); });

/* =========================================================
   Red Farmako · Pensando en vos — TIENDA (index.html)
   Requiere core.js (configuración, sucursales, catálogo y utilidades).
   ========================================================= */

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

/* ---------------- HOOKS: CLIENTES Y PEDIDOS (listos para Firebase) ---------------- */

/**
 * Se llama con cada pedido enviado por WhatsApp. Hoy queda en el historial local del cliente.
 * Con Firebase: addDoc(collection(db, SYNC_CONFIG.firebase.ordersCollection), { ...orderData, createdAt: serverTimestamp() })
 */
async function saveOrderToDatabase(orderData) {
  console.info('[Red Farmako] Pedido listo para guardar:', orderData);
}

/**
 * Se llama al iniciar sesión o actualizar el perfil del cliente.
 * Con Firebase Auth + Firestore: setDoc(doc(db, SYNC_CONFIG.firebase.customersCollection, uid), profile)
 */
async function saveCustomerProfile(profile) {
  console.info('[Red Farmako] Perfil de cliente listo para guardar:', profile);
}

/* ---------------- Utilidades de la tienda ---------------- */

$$('[data-turnos-url]').forEach(a => { a.href = TURNOS_URL; });
$$('[data-wa-icon]').forEach(el => { el.outerHTML = waIcon(el.dataset.waIcon || 'i i--wa'); });

/** Nombre y apellido: al menos dos palabras de 2 letras o más. */
const isFullName = s => /^[\p{L}'´.-]{2,}(\s+[\p{L}'´.-]{2,})+$/u.test(String(s).normalize('NFC').trim());
const initials = name => String(name).trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
/** Link de WhatsApp con logo oficial para un teléfono de sucursal. */
const waPhoneLink = (b, text = `Hola ${b.name}! 👋 Quería hacer una consulta.`) =>
  `<a class="wa-link" href="${waLink(b.phone, text)}" target="_blank" rel="noopener">${waIcon()}${esc(b.phoneDisplay)}</a>`;

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
// "15674723" → WhatsApp 5493757674723 · "(03757) 15-674723"
const localPhone = p => {
  const n = p.replace(/^15/, '');
  return { wa: `5493757${n}`, display: `(03757) 15-${n}` };
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
  account: store.get(STORAGE.account, null),
};
if (state.branch && !branchById(state.branch)) state.branch = null;

/** Cambia la sucursal activa (null = todas) y sincroniza pestañas, catálogo y carrito. */
function setBranch(id, { silent = true, scroll = false } = {}) {
  state.branch = branchById(id) ? id : null;
  store.set(STORAGE.branch, state.branch);
  if (state.filter !== 'all' && !catAvailable(catById(state.filter), state.branch)) state.filter = 'all';
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
      <small>${esc(d.address)}</small>
      <a class="wa-link" href="${waLink(b ? b.phone : ph.wa, b ? `Hola ${b.name}! 👋 Los contacto por el turno de hoy.` : '')}" target="_blank" rel="noopener">${waIcon()}${esc(b ? b.phoneDisplay : ph.display)}</a>
      <small>24 hs · hasta las 08:00 hs del ${esc(d.endsLabel)}</small>
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
      </span>${featured.includes(c.id) ? '<span class="story__star" aria-hidden="true">★</span>' : ''}</span>
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

/* ---------------- Sucursales (sección institucional) ---------------- */

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
        <span class="branch__kicker">Red Farmako</span>
        <h3>${esc(b.name)}</h3>
        <p class="branch__lead">Dirección técnica: Farm. ${esc(b.lead)}</p>
        <ul class="branch__meta">
          <li>${icon(ICONS.pin)}<a href="${b.maps}" target="_blank" rel="noopener">${esc(b.address)}</a></li>
          <li>${waIcon()}<a href="${waLink(b.phone, `Hola ${b.name}! 👋 Quería hacer una consulta.`)}" target="_blank" rel="noopener">${esc(b.phoneDisplay)}</a></li>
          <li>${icon(ICONS.clock)}<span>${st.duty ? 'Hoy abierta 24 hs (turno hasta las 08:00 hs)' : esc(b.hoursLabel)}</span></li>
          <li>${icon(ICONS.ig)}<a href="https://www.instagram.com/${b.instagram}" target="_blank" rel="noopener">@${esc(b.instagram)}</a></li>
        </ul>
        <button class="btn btn--ghost btn--sm btn--block branch__catalog" data-view-branch="${b.id}">${icon(ICONS.bag)}Ver productos de esta sucursal</button>
        <div class="branch__actions">
          <a class="btn btn--wa btn--sm" href="${waLink(b.phone, `Hola ${b.name}! 👋 Quería hacer una consulta.`)}" target="_blank" rel="noopener">${waIcon()}WhatsApp</a>
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
  const tabs = [{ id: '', label: 'Todas las sucursales' }, ...BRANCHES.map(b => ({ id: b.id, label: b.name, sub: b.shortAddress, b }))];
  $('#branchTabs').innerHTML = tabs.map(t => `
    <button role="tab" class="branch-tab" data-tab-branch="${t.id}" aria-selected="${(t.id || null) === state.branch}" ${t.b ? `style="${brandVars(t.b)}"` : ''}>
      ${t.b ? `<span class="branch-tab__av"><img src="${asset(ASSETS.isotipo)}" alt="" /></span>` : icon(ICONS.store)}
      <span><b>${esc(t.label)}</b>${t.sub ? `<small>${esc(t.sub)}</small>` : ''}</span>
    </button>`).join('');

  const b = branchById(state.branch);
  const notice = $('#branchNotice');
  notice.hidden = !b;
  if (b) notice.innerHTML = `${icon(ICONS.pin)}<span>Viendo stock y ofertas disponibles en <b>${esc(b.name)}</b> (${esc(b.shortAddress)}).</span>`;
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
    .map(p => eff(p, state.branch))
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
          : `<button class="btn product__btn product__btn--ask" data-ask="${esc(p.id)}">${waIcon()}Consultar disponibilidad</button>`}
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
    const prods = Catalog.products.filter(p => productVisible(p, state.branch) && match(`${p.name} ${p.brand} ${catById(p.cat).name}`)).slice(0, 6).map(p => eff(p, state.branch));
    let html = '';
    if (cats.length) html += `<div class="search__group">Categorías</div>` + cats.map(c =>
      `<button class="search__item" data-cat="${c.id}"><span class="thumb">${icon(c.icon)}</span><b>${highlight(c.name, q)}</b></button>`).join('');
    if (prods.length) html += `<div class="search__group">Productos${state.branch ? ` en ${esc(branchById(state.branch).name)}` : ''}</div>` + prods.map(p =>
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

const cartEntries = () => Object.entries(state.cart).map(([id, q]) => [productById(id), q]).filter(([p, q]) => p && eff(p, state.branch).active && q > 0);
const deliveryMode = () => $('input[name="delivery"]:checked').value;
const cartTotal = (entries, branchId = state.branch) => entries.reduce((s, [p, q]) => s + finalPrice(p, branchId) * q, 0);

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
    const e = eff(p, state.branch);
    const missing = b && !p.branches.includes(b.id);
    return `
    <div class="cart-item ${missing ? 'is-missing' : ''}">
      <span class="thumb">${productMedia(p)}</span>
      <div><b>${esc(p.name)}</b><small>${money(finalPrice(p, state.branch) * q)}</small>
        ${missing ? `<em class="cart-item__warn">No disponible en ${esc(b.name)} · disponible en ${esc(branchNames(p.branches))}</em>` : ''}
        ${e.inStock ? '' : '<em class="cart-item__warn">Sin stock: te confirmamos ingreso</em>'}</div>
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

/** Tarjetas compactas de sucursal: nombre en negrita y dirección chiquita. */
function renderCartBranches() {
  $('#cartBranches').innerHTML = BRANCHES.map(b => `
    <label class="branch-opt" style="${brandVars(b)}">
      <input type="radio" name="cartBranch" value="${b.id}" ${b.id === state.branch ? 'checked' : ''} />
      <span class="branch-opt__box">
        <span><b>${esc(b.name)}</b><small>${esc(b.shortAddress)}</small></span>
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
  $('#checkoutLabel').textContent = b ? `Enviar pedido a ${b.name}` : 'Enviar pedido por WhatsApp';
}

$$('input[name="delivery"]').forEach(r => r.addEventListener('change', () => {
  addrInput.hidden = deliveryMode() !== 'envio';
  renderCart();
}));

// Datos del cliente: se autocompletan (desde Mi Cuenta o el último pedido) y se guardan solos.
function fillCheckoutFromProfile() {
  const a = state.account;
  nameInput.value = nameInput.value || a?.name || state.customer.name || '';
  phoneInput.value = phoneInput.value || a?.whatsapp || state.customer.phone || '';
  addrInput.value = addrInput.value || a?.address || state.customer.address || '';
}
fillCheckoutFromProfile();
let customerSaveTimer;
function persistCustomer() {
  state.customer = { name: nameInput.value.trim(), phone: phoneInput.value.trim(), address: addrInput.value.trim() };
  store.set(STORAGE.customer, state.customer);
}
[nameInput, phoneInput, addrInput].forEach(el => el.addEventListener('input', () => {
  el.classList.remove('is-invalid');
  el.setCustomValidity('');
  clearTimeout(customerSaveTimer);
  customerSaveTimer = setTimeout(persistCustomer, 300);
}));

function buildOrderMessage(b, entries, { name, phone, mode, address, note }) {
  return [
    `Hola ${b.name}! 👋`,
    `Soy *${name}*${phone ? ` (tel. ${phone})` : ''} y quiero hacer este pedido desde la web de Red Farmako:`,
    '',
    '🛍️ *Detalle del pedido*',
    ...entries.map(([p, q]) => `• ${q} × ${p.name}${p.brand ? ` (${p.brand})` : ''} — ${money(finalPrice(p, b.id) * q)}`),
    '',
    `💳 *Total estimado:* ${money(cartTotal(entries, b.id))}`,
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
  const name = nameInput.value.normalize('NFC').trim().replace(/\s+/g, ' ');
  const address = addrInput.value.trim();
  const errors = [];
  if (!b) { $('#cartBranches').classList.add('is-invalid'); errors.push('la sucursal'); }
  if (!isFullName(name)) {
    nameInput.classList.add('is-invalid');
    nameInput.setCustomValidity('Ingresá tu nombre y apellido');
    errors.push(name ? 'tu nombre y apellido completos' : 'tu nombre y apellido');
  }
  if (mode === 'envio' && !address) { addrInput.classList.add('is-invalid'); errors.push('la dirección'); }
  if (errors.length) {
    toast(`Completá ${errors.join(', ')}`);
    if (!isFullName(name)) nameInput.focus();
    return;
  }
  const missing = entries.filter(([p]) => !p.branches.includes(b.id));
  if (missing.length) {
    toast(`${missing.length === 1 ? 'Un producto no está' : `${missing.length} productos no están`} en ${b.name}. Quitalos o elegí otra sucursal.`);
    return;
  }

  nameInput.value = name;
  persistCustomer();
  const phone = phoneInput.value.trim();
  const note = noteInput.value.trim();
  const text = buildOrderMessage(b, entries, { name, phone, mode, address, note });
  // window.open debe ir primero y sincrónico (si no, el navegador bloquea la ventana).
  window.open(waLink(b.phone, text), '_blank', 'noopener');
  toast(`Abrimos WhatsApp con ${b.name} ✓`);

  const order = {
    id: `RF-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    channel: 'whatsapp',
    branch: { id: b.id, name: b.name, phone: b.phone },
    customer: { name, phone, address: mode === 'envio' ? address : '' },
    delivery: mode,
    note,
    items: entries.map(([p, q]) => ({ id: p.id, name: p.name, brand: p.brand, qty: q, unitPrice: finalPrice(p, b.id), subtotal: finalPrice(p, b.id) * q })),
    total: cartTotal(entries, b.id),
  };
  const history = store.get(STORAGE.orders, []);
  history.unshift(order);
  store.set(STORAGE.orders, history.slice(0, 30));
  saveOrderToDatabase(order).catch(err => console.error('[Red Farmako] No se pudo guardar el pedido:', err));
});

function openCart(open) {
  drawer.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', !open);
  backdrop.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) { fillCheckoutFromProfile(); renderCart(); $('#cartClose').focus(); }
}
$('#cartBtn').addEventListener('click', () => openCart(true));
$('#cartClose').addEventListener('click', () => openCart(false));
backdrop.addEventListener('click', () => openCart(false));
$$('[data-open-cart]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openMenu(false); openCart(true); }));

/* ---------------- Mi Cuenta (clientes) ---------------- */

const accountModal = $('#accountModal');
const accountBody = $('#accountBody');

function renderAccountButton() {
  const a = state.account;
  $('#accountBtn').innerHTML = a ? `<span class="account-btn__initials">${esc(initials(a.name))}</span>` : icon(ICONS.user);
  $('#accountBtn').setAttribute('aria-label', a ? `Mi cuenta (${a.name})` : 'Iniciar sesión / Mi cuenta');
}

function openAccount() {
  renderAccount();
  accountModal.showModal();
}
$('#accountBtn').addEventListener('click', openAccount);
$$('[data-open-account]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openMenu(false); openAccount(); }));
$('#accountClose').addEventListener('click', () => accountModal.close());
accountModal.addEventListener('click', e => { if (e.target === accountModal) accountModal.close(); });

function accountFormHTML(a = {}) {
  return `
  <form class="account-form" id="accountForm" novalidate>
    <p class="account-intro">${state.account ? 'Actualizá tus datos.' : 'Ingresá o registrate en segundos, sin contraseña. Tus datos se completan solos en cada pedido.'}</p>
    <label class="lbl">Nombre y apellido *<input class="field" name="name" autocomplete="name" required value="${esc(a.name || nameInput.value)}" placeholder="Ej: Ana Pérez" /></label>
    <label class="lbl">WhatsApp *<input class="field" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" required value="${esc(a.whatsapp || phoneInput.value)}" placeholder="Ej: 3757 15-123456" /></label>
    <label class="lbl">Correo electrónico <small>(opcional)</small><input class="field" name="email" type="email" autocomplete="email" value="${esc(a.email || '')}" placeholder="tu@correo.com" /></label>
    <label class="lbl">Dirección habitual <small>(opcional, para envíos)</small><input class="field" name="address" autocomplete="street-address" value="${esc(a.address || addrInput.value)}" placeholder="Calle, número, barrio" /></label>
    <button class="btn btn--primary btn--block" type="submit">${state.account ? 'Guardar cambios' : 'Ingresar / Registrarme'}</button>
    ${state.account ? '<button class="btn btn--ghost btn--block" type="button" data-account="cancel">Cancelar</button>' : ''}
    <small class="account-legal">Guardamos tus datos solo en este dispositivo. No compartimos tu información.</small>
  </form>`;
}

function accountProfileHTML() {
  const a = state.account;
  const orders = store.get(STORAGE.orders, []);
  return `
  <div class="account-profile">
    <div class="account-card">
      <span class="account-avatar">${esc(initials(a.name))}</span>
      <div>
        <h3>Hola, ${esc(a.name.split(' ')[0])}</h3>
        <small>${waIcon()} ${esc(a.whatsapp)}${a.email ? ` · ${esc(a.email)}` : ''}</small>
        ${a.address ? `<small>${icon(ICONS.pin)} ${esc(a.address)}</small>` : ''}
      </div>
      <button class="icon-btn" data-account="edit" aria-label="Editar mis datos">${icon(ICONS.edit)}</button>
    </div>

    <h4 class="account-subtitle">Mis pedidos</h4>
    ${orders.length ? `<ul class="order-list">${orders.map(o => `
      <li class="order">
        <div class="order__head">
          <b>${esc(o.branch.name)}</b>
          <span>${esc(new Date(o.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }))}</span>
        </div>
        <small>${o.items.map(i => `${i.qty} × ${esc(i.name)}`).join(' · ')}</small>
        <div class="order__foot">
          <b>${money(o.total)}</b>
          <span>${o.delivery === 'envio' ? 'Envío a domicilio' : 'Retiro en sucursal'}</span>
          <button class="btn btn--ghost btn--sm" data-account="repeat" data-order="${esc(o.id)}">${icon(ICONS.repeat)}Repetir</button>
        </div>
      </li>`).join('')}</ul>`
      : '<p class="account-empty">Todavía no enviaste pedidos desde esta web. Cuando confirmes uno por WhatsApp, aparece acá.</p>'}

    <button class="btn btn--ghost btn--block account-logout" data-account="logout">${icon(ICONS.logout)}Cerrar sesión</button>
  </div>`;
}

let accountEditing = false;
function renderAccount() {
  $('#accountTitle').textContent = state.account && !accountEditing ? '👤 Mi cuenta' : '👤 Iniciar sesión / Registrarme';
  accountBody.innerHTML = state.account && !accountEditing ? accountProfileHTML() : accountFormHTML(state.account || {});
}

accountBody.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const data = {
    name: f.name.value.normalize('NFC').trim().replace(/\s+/g, ' '),
    whatsapp: f.whatsapp.value.trim(),
    email: f.email.value.trim(),
    address: f.address.value.trim(),
  };
  const errs = [];
  if (!isFullName(data.name)) { f.name.classList.add('is-invalid'); errs.push('nombre y apellido'); }
  if (data.whatsapp.replace(/\D/g, '').length < 8) { f.whatsapp.classList.add('is-invalid'); errs.push('un WhatsApp válido'); }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { f.email.classList.add('is-invalid'); errs.push('un correo válido'); }
  if (errs.length) { toast(`Completá ${errs.join(', ')}`); return; }
  state.account = { ...data, createdAt: state.account?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.set(STORAGE.account, state.account);
  // El carrito toma los datos de la cuenta.
  nameInput.value = data.name; phoneInput.value = data.whatsapp;
  if (data.address) addrInput.value = data.address;
  persistCustomer();
  saveCustomerProfile(state.account).catch(err => console.error(err));
  accountEditing = false;
  renderAccount();
  renderAccountButton();
  toast(`¡Listo, ${data.name.split(' ')[0]}! Tus datos quedan guardados ✓`);
});
accountBody.addEventListener('input', e => e.target.classList?.remove('is-invalid'));
accountBody.addEventListener('click', e => {
  const btn = e.target.closest('[data-account]');
  if (!btn) return;
  switch (btn.dataset.account) {
    case 'edit': accountEditing = true; renderAccount(); break;
    case 'cancel': accountEditing = false; renderAccount(); break;
    case 'logout':
      store.del(STORAGE.account);
      state.account = null;
      renderAccount(); renderAccountButton();
      toast('Sesión cerrada');
      break;
    case 'repeat': {
      const o = store.get(STORAGE.orders, []).find(x => x.id === btn.dataset.order);
      if (!o) return;
      let added = 0;
      for (const it of o.items) if (productById(it.id)) { state.cart[it.id] = (state.cart[it.id] || 0) + it.qty; added++; }
      saveCart();
      if (branchById(o.branch.id)) setBranch(o.branch.id);
      accountModal.close();
      if (added) openCart(true);
      toast(added ? 'Agregamos los productos de ese pedido ✓' : 'Esos productos ya no están en el catálogo');
      break;
    }
  }
});

/* ---------------- Widget WhatsApp multi-sucursal ---------------- */

const waFab = $('#waFab');
const waPanel = $('#waPanel');

function renderWaList() {
  $('#waList').innerHTML = BRANCHES.map(b => {
    const st = branchStatus(b);
    return `<li><a href="${waLink(b.phone, `Hola ${b.name}! 👋 Quería hacer una consulta.`)}" target="_blank" rel="noopener">
      <span class="av ${st.open ? 'is-open' : ''}" style="${brandVars(b)}"><img src="${asset(ASSETS.isotipo)}" alt="" /></span>
      <span><b>${esc(b.name)}</b><small>${esc(b.shortAddress)} · ${esc(st.label)}</small></span>
      <span class="go">${waIcon()}</span>
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
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  toggleWa(false);
  if (drawer.classList.contains('is-open')) openCart(false);
  if (sideMenu.classList.contains('is-open')) openMenu(false);
});

/* ---------------- Footer (acordeón en celular) ---------------- */

$('#footerCats').innerHTML = CATEGORIES.map(c => `<li><button data-fcat="${c.id}">${esc(c.name)}</button></li>`).join('');
$('#footerCats').addEventListener('click', e => { const b = e.target.closest('[data-fcat]'); if (b) applyFilter(b.dataset.fcat, true); });
$('#footerBranches').innerHTML = BRANCHES.map(b => `<li class="footer__branch"><b>${esc(b.name)}</b>
  <small>${esc(b.shortAddress)}</small>
  ${waPhoneLink(b)}</li>`).join('');
$('#year').textContent = new Date().getFullYear();

$$('.fcol__toggle').forEach(btn => btn.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') !== 'true';
  $$('.fcol__toggle').forEach(b => b.setAttribute('aria-expanded', b === btn && open));
  $$('.fcol').forEach(c => c.classList.toggle('is-open', c.contains(btn) && open));
}));

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
  if (sideMenu.classList.contains('is-open')) renderSideDuty();
}

renderBranchTabs();
renderCartBranches();
updateCheckoutLabel();
renderAccountButton();
refreshCatalog();
refreshStatus();
Catalog.loadPublished().then(changed => { if (changed) refreshCatalog(); });
syncOfficialSchedule();
// Refresca estados cada minuto (incluye el cambio de turno de las 08:00).
setInterval(refreshStatus, 60_000);

// Si una farmacéutica edita el catálogo en admin.html (otra pestaña de este navegador),
// la tienda se actualiza al instante.
addEventListener('storage', e => {
  if (e.key !== STORAGE.catalog) return;
  Catalog.boot();
  if (!store.get(STORAGE.catalog, null)) Catalog.discardLocal().then(refreshCatalog);
  else refreshCatalog();
});

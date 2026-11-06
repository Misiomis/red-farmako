/* =========================================================
   Red Farmako · PANEL DE PRODUCTOS Y OFERTAS (admin.html)
   Acceso por sucursal: admin.html?sucursal=central | libertad | farmavida | general
   Requiere core.js.
   ========================================================= */

/* ---------------- CONFIG: PINES DE ACCESO ---------------- */

// ⚠️ Los PIN son un filtro simple, NO seguridad real: este archivo es público y cualquiera
// que lo lea los ve. Lo que se edite queda en el navegador de quien lo edita (no afecta a los
// clientes hasta publicar el catálogo). Para seguridad real: Firebase Auth (SYNC_CONFIG).
const ADMIN_PINS = {
  central: '1111',
  libertad: '2222',
  farmavida: '3333',
  general: '2026', // Administración general: todas las sucursales
};

/* ---------------- Estado ---------------- */

const body = $('#adminBody');
const params = new URLSearchParams(location.search);
const urlScope = params.get('sucursal');

const admin = {
  scope: (() => { try { return sessionStorage.getItem(STORAGE.adminSession); } catch { return null; } })(),
  loginScope: ADMIN_PINS[urlScope] ? urlScope : 'central',
  view: 'list',      // 'list' | 'edit'
  tab: 'mine',       // sucursal: 'mine' (mis productos) | 'network' (resto de la red)
  editing: null,
  draftImage: '',
  q: '', fBranch: '', fCat: '',
};
if (admin.scope && !ADMIN_PINS[admin.scope]) admin.scope = null;
// Si entran con otra sucursal en la URL, se pide el PIN de esa sucursal.
if (admin.scope && urlScope && ADMIN_PINS[urlScope] && urlScope !== admin.scope) admin.scope = null;

const isGeneral = () => admin.scope === 'general';
const myBranch = () => (isGeneral() ? null : branchById(admin.scope));
const scopeLabel = s => (s === 'general' ? 'Administración general' : branchById(s).name);

/** Valores que ve/edita la sucursal (sus propios precios, stock, etc.). */
const viewOf = p => (isGeneral() ? p : eff(p, admin.scope));
/** Una sucursal edita nombre, marca, categoría y foto solo de los productos exclusivos suyos. */
const canEditBase = p => isGeneral() || (p.branches.length === 1 && p.branches[0] === admin.scope);

/** Cambia precio/oferta/stock/destacado/publicado respetando el alcance de la sucursal. */
function setField(p, key, value) {
  if (canEditBase(p)) {
    p[key] = value;
    if (!isGeneral() && p.overrides?.[admin.scope]) delete p.overrides[admin.scope][key];
  } else {
    p.overrides = p.overrides || {};
    const own = { ...(p.overrides[admin.scope] || {}) };
    // Solo se guarda lo que difiere de la red; si vuelve al valor general, se borra el propio.
    if (p[key] === value) delete own[key]; else own[key] = value;
    p.overrides[admin.scope] = own;
  }
  if (p.overrides) {
    for (const [b, o] of Object.entries(p.overrides)) if (!Object.keys(o).length) delete p.overrides[b];
    if (!Object.keys(p.overrides).length) delete p.overrides;
  }
}

/* ---------------- Render principal ---------------- */

function render() {
  $('#adminTop').hidden = !admin.scope;
  document.title = admin.scope ? `Panel · ${scopeLabel(admin.scope)} · Red Farmako` : 'Panel de productos · Red Farmako';
  if (!admin.scope) { body.innerHTML = loginHTML(); setTimeout(() => $('#pin')?.focus(), 50); return; }
  $('#adminScope').innerHTML = `${isGeneral() ? icon(ICONS.store) : icon(ICONS.pin)}<span><b>${esc(scopeLabel(admin.scope))}</b>${myBranch() ? `<small>${esc(myBranch().shortAddress)}</small>` : '<small>Todas las sucursales</small>'}</span>`;
  body.innerHTML = admin.view === 'edit' ? editorHTML() : listHTML();
  if (admin.view === 'list') renderList(); else updatePreview();
}

/* ---------------- Login ---------------- */

function loginHTML() {
  const opts = [...BRANCHES.map(b => ({ id: b.id, name: b.name, sub: b.shortAddress })), { id: 'general', name: 'Administración general', sub: 'Todas las sucursales' }];
  return `
  <form class="admin-login" id="loginForm" novalidate>
    <img src="${asset(ASSETS.logoVertical)}" alt="Red Farmako" class="admin-login__logo" />
    <h1>Panel de productos</h1>
    <p>Elegí tu sucursal e ingresá su PIN.</p>
    <div class="admin-login__opts" role="radiogroup" aria-label="Sucursal">
      ${opts.map(o => `
        <label class="branch-opt">
          <input type="radio" name="scope" value="${o.id}" ${o.id === admin.loginScope ? 'checked' : ''} />
          <span class="branch-opt__box"><span><b>${esc(o.name)}</b><small>${esc(o.sub)}</small></span><span class="check">${icon(ICONS.check)}</span></span>
        </label>`).join('')}
    </div>
    <input class="field field--pin" id="pin" type="password" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="PIN" aria-label="PIN" />
    <button class="btn btn--primary btn--block" type="submit">Ingresar</button>
    <a class="admin-login__back" href="./">← Volver a la tienda</a>
  </form>`;
}

/* ---------------- Listado ---------------- */

const SOURCE_LABEL = { muestra: 'Catálogo de muestra', publicado: 'Catálogo publicado', local: 'Cambios guardados en este navegador' };

function listHTML() {
  const d = Catalog.updatedAt ? new Date(Catalog.updatedAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  const b = myBranch();
  const cats = b ? CATEGORIES.filter(c => c.branches.includes(b.id)) : CATEGORIES;
  return `
  <div class="admin-info ${Catalog.source === 'local' ? 'is-local' : ''}">
    <b>${SOURCE_LABEL[Catalog.source]}</b> · actualizado ${esc(d)}
    <p>Los cambios se ven al instante en la tienda abierta <b>en este mismo navegador</b>. Para que los vean todos los clientes:
    descargá el catálogo (JSON) y reemplazá <code>catalogo-farmako.json</code> en el sitio, o conectá Firebase (SYNC_CONFIG en core.js).</p>
  </div>
  ${b ? `
  <div class="admin-tabs" role="tablist">
    <button role="tab" aria-selected="${admin.tab === 'mine'}" data-tab="mine">Productos de ${esc(b.name)}</button>
    <button role="tab" aria-selected="${admin.tab === 'network'}" data-tab="network">Sumar desde la red</button>
  </div>` : ''}
  <div class="admin-toolbar">
    <button class="btn btn--primary btn--sm" data-a="new">${icon(ICONS.plus)}Nuevo producto</button>
    <button class="btn btn--ghost btn--sm" data-a="export-json">${icon(ICONS.download)}📥 Descargar catálogo (JSON)</button>
    <button class="btn btn--ghost btn--sm" data-a="export-csv">${icon(ICONS.download)}CSV</button>
    ${isGeneral() ? `<label class="btn btn--ghost btn--sm">${icon(ICONS.upload)}📤 Importar catálogo<input type="file" id="importFile" accept=".json,.csv,application/json,text/csv" hidden /></label>` : ''}
    ${Catalog.source === 'local' ? `<button class="btn btn--ghost btn--sm admin-danger" data-a="discard">Descartar cambios locales</button>` : ''}
  </div>
  <div class="admin-filters ${b ? 'admin-filters--2' : ''}">
    <input class="field" id="q" type="search" placeholder="Buscar por nombre o marca…" value="${esc(admin.q)}" />
    ${b ? '' : `<select class="field" id="fBranch">
      <option value="">Todas las sucursales</option>
      ${BRANCHES.map(x => `<option value="${x.id}" ${admin.fBranch === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}
    </select>`}
    <select class="field" id="fCat">
      <option value="">Todas las categorías</option>
      ${cats.map(c => `<option value="${c.id}" ${admin.fCat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
    </select>
  </div>
  <p class="admin-count" id="count"></p>
  <div class="admin-list" id="list"></div>`;
}

function filtered() {
  const q = norm(admin.q);
  const b = myBranch();
  return Catalog.products.filter(p => {
    if (q && !norm(`${p.name} ${p.brand}`).includes(q)) return false;
    if (admin.fCat && p.cat !== admin.fCat) return false;
    if (b) {
      const mine = p.branches.includes(b.id);
      if (admin.tab === 'mine' ? !mine : (mine || !catById(p.cat).branches.includes(b.id))) return false;
    } else if (admin.fBranch && !p.branches.includes(admin.fBranch)) return false;
    return true;
  });
}

function rowHTML(p) {
  const b = myBranch();
  if (b && admin.tab === 'network') {
    return `
    <div class="admin-row">
      <span class="thumb">${productMedia(p)}</span>
      <div class="admin-row__main">
        <b>${esc(p.name)}</b>
        <small>${esc(catById(p.cat).short)}${p.brand ? ` · ${esc(p.brand)}` : ''} · hoy en ${esc(branchNames(p.branches))}</small>
        <span class="admin-row__price">${money(finalPrice(p))}</span>
      </div>
      <div class="admin-row__actions">
        <button class="btn btn--primary btn--sm" data-a="adopt" data-id="${esc(p.id)}">${icon(ICONS.plus)}Sumar a ${esc(b.name)}</button>
      </div>
    </div>`;
  }
  const v = viewOf(p);
  const own = b && p.overrides?.[b.id];
  const custom = isGeneral() && p.overrides ? Object.keys(p.overrides).map(id => branchById(id).name) : [];
  return `
    <div class="admin-row ${v.active ? '' : 'is-paused'}">
      <span class="thumb">${productMedia(p)}</span>
      <div class="admin-row__main">
        <b>${esc(p.name)}</b>
        <small>${esc(catById(p.cat).short)}${p.brand ? ` · ${esc(p.brand)}` : ''}${isGeneral() ? ` · ${esc(branchNames(p.branches))}` : (p.branches.length > 1 ? ' · compartido con la red' : ' · exclusivo')}</small>
        <span class="admin-row__price">${money(finalPrice(p, b?.id))}${v.discount ? ` <s>${money(v.price)}</s> <em>-${v.discount}%</em>` : ''}${own ? ' <em class="admin-own">precio/estado propio</em>' : ''}</span>
        ${custom.length ? `<small class="admin-own">Valores propios en: ${esc(custom.join(', '))}</small>` : ''}
      </div>
      <div class="admin-row__toggles">
        <button class="chip-toggle ${v.active ? 'is-on' : ''}" data-a="toggle" data-key="active" data-id="${esc(p.id)}">${v.active ? 'Publicado' : 'Pausado'}</button>
        <button class="chip-toggle ${v.inStock ? 'is-on' : ''}" data-a="toggle" data-key="inStock" data-id="${esc(p.id)}">${v.inStock ? 'En stock' : 'Sin stock'}</button>
        <button class="chip-toggle ${v.featured ? 'is-on' : ''}" data-a="toggle" data-key="featured" data-id="${esc(p.id)}">${v.featured ? '★ Destacado' : '☆ Destacar'}</button>
      </div>
      <div class="admin-row__actions">
        <button class="icon-btn" data-a="edit" data-id="${esc(p.id)}" aria-label="Editar ${esc(p.name)}">${icon(ICONS.edit)}</button>
        <button class="icon-btn admin-danger" data-a="delete" data-id="${esc(p.id)}" aria-label="${canEditBase(p) ? 'Eliminar' : 'Quitar de mi sucursal'} ${esc(p.name)}">${icon(ICONS.trash)}</button>
      </div>
    </div>`;
}

function renderList() {
  const list = filtered();
  $('#count').textContent = `${list.length} producto${list.length === 1 ? '' : 's'}`;
  $('#list').innerHTML = list.length ? list.map(rowHTML).join('')
    : `<p class="admin-empty">${admin.tab === 'network' ? 'No hay productos de otras sucursales para sumar.' : 'No hay productos con esos filtros.'}</p>`;
}

/* ---------------- Editor ---------------- */

function editorHTML() {
  const p = admin.editing;
  const isNew = !Catalog.byId(p.id);
  const v = viewOf(p);
  const base = canEditBase(p);
  const b = myBranch();
  const cats = b ? CATEGORIES.filter(c => c.branches.includes(b.id)) : CATEGORIES;
  const dis = base ? '' : 'disabled';
  return `
  <form class="admin-form" id="form" novalidate>
    <div class="admin-form__head">
      <button type="button" class="btn btn--ghost btn--sm" data-a="back">← Volver</button>
      <h3>${isNew ? 'Nuevo producto' : 'Editar producto'}${b ? ` · ${esc(b.name)}` : ''}</h3>
    </div>
    ${base ? '' : `<p class="admin-note">Este producto es compartido con ${esc(branchNames(p.branches.filter(x => x !== b.id)))}. Acá cambiás <b>precio, oferta y stock de ${esc(b.name)}</b>; los datos generales (nombre, marca, foto) los edita la Administración general.</p>`}
    <div class="admin-form__grid">
      <div class="admin-form__col">
        <label class="lbl">Nombre del producto *<input class="field" name="name" required maxlength="140" value="${esc(p.name)}" placeholder="Ej: Pañales Talle G x 36" ${dis} /></label>
        <label class="lbl">Marca<input class="field" name="brand" maxlength="60" value="${esc(p.brand)}" placeholder="Ej: Star Nutrition" ${dis} /></label>
        <label class="lbl">Categoría *
          <select class="field" name="cat" ${dis}>${(base ? cats : CATEGORIES).map(c => `<option value="${c.id}" ${p.cat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
        </label>
        <div class="admin-form__row">
          <label class="lbl">Precio normal ($) *<input class="field" name="price" type="number" inputmode="numeric" min="1" step="1" value="${v.price || ''}" required /></label>
          <label class="lbl">% Descuento<input class="field" name="discount" type="number" inputmode="numeric" min="0" max="90" step="1" value="${v.discount || 0}" /></label>
        </div>
        <p class="admin-final" id="final"></p>

        ${isGeneral() ? `
        <fieldset class="lbl">
          <legend>Disponible en *</legend>
          <div class="admin-checks">
            ${BRANCHES.map(x => `<label class="admin-check"><input type="checkbox" name="branches" value="${x.id}" ${p.branches.includes(x.id) ? 'checked' : ''} /><span>${esc(x.name)} <small>${esc(x.shortAddress)}</small></span></label>`).join('')}
          </div>
          <small class="admin-hint" id="catHint"></small>
        </fieldset>` : `<p class="admin-hint">Disponible en: <b>${esc(branchNames(isNew ? [b.id] : p.branches))}</b></p>`}

        <div class="admin-switches">
          <label class="switch"><input type="checkbox" name="featured" ${v.featured ? 'checked' : ''} /><span></span>Destacar en Ofertas de la Semana</label>
          <label class="switch"><input type="checkbox" name="inStock" ${v.inStock ? 'checked' : ''} /><span></span>En stock${b ? ` en ${esc(b.name)}` : ''}</label>
          <label class="switch"><input type="checkbox" name="active" ${v.active ? 'checked' : ''} /><span></span>Publicado (visible en la web)</label>
        </div>
      </div>

      <div class="admin-form__col">
        <span class="lbl">Imagen del producto</span>
        <div class="admin-img" id="imgPreview">${productMedia({ ...p, image: admin.draftImage })}</div>
        ${base ? `
        <label class="btn btn--ghost btn--sm btn--block">${icon(ICONS.upload)}Subir foto (celular o PC)<input type="file" id="imgFile" accept="image/*" hidden /></label>
        <label class="lbl">…o pegá un link / archivo de img/
          <input class="field" name="image" id="imgUrl" value="${esc(admin.draftImage.startsWith('data:') ? '' : admin.draftImage)}" placeholder="https://… o productos/panales.jpg" />
        </label>
        <small class="admin-hint">${admin.draftImage.startsWith('data:') ? 'Foto subida desde el dispositivo (comprimida). ' : ''}Si no hay foto se muestra una ilustración.
          ${admin.draftImage ? '<button type="button" class="link" data-a="clear-img">Quitar imagen</button>' : ''}</small>` : ''}
      </div>
    </div>
    <div class="admin-form__foot">
      <button type="button" class="btn btn--ghost" data-a="back">Cancelar</button>
      <button type="submit" class="btn btn--primary">${icon(ICONS.check)}Guardar producto</button>
    </div>
  </form>`;
}

function updatePreview() {
  const f = $('#form');
  if (!f) return;
  const price = Number(f.price.value) || 0;
  const disc = clampNum(f.discount.value, 0, 90);
  $('#final').innerHTML = price
    ? (disc ? `Precio final: <b>${money(price * (1 - disc / 100))}</b> <span class="product__off">-${Math.round(disc)}% OFF</span>` : `Precio final: <b>${money(price)}</b> (sin oferta)`)
    : '';
  const hint = $('#catHint');
  if (hint) {
    const cat = catById(f.cat.value);
    const blocked = BRANCHES.filter(x => !cat.branches.includes(x.id));
    hint.textContent = blocked.length ? `${cat.name} no se muestra en ${branchNames(blocked.map(x => x.id))} (esa sucursal no tiene la sección).` : '';
  }
}
function renderImg() {
  const prev = $('#imgPreview');
  if (!prev) return;
  const cat = $('#form').cat.value;
  prev.innerHTML = productMedia({ ...admin.editing, cat, art: cat === admin.editing.cat ? admin.editing.art : catById(cat).art, image: admin.draftImage });
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

/* ---------------- Exportar / importar ---------------- */

function download(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const CSV_COLS = ['id', 'name', 'brand', 'cat', 'price', 'discount', 'branches', 'image', 'featured', 'inStock', 'active', 'overrides'];
const csvCell = v => { const s = String(v ?? ''); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const toCSV = products => [CSV_COLS.join(','), ...products.map(p => CSV_COLS.map(k =>
  csvCell(k === 'branches' ? p.branches.join('|') : k === 'overrides' ? (p.overrides ? JSON.stringify(p.overrides) : '') : p[k])).join(','))].join('\n');
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
  const [head, ...rest] = rows.filter(r => r.some(c => c.trim()));
  const keys = head.map(h => h.trim());
  return rest.map(r => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ''])));
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
  render();
  toast(`Catálogo importado: ${list.length} productos ✓`);
}

/* ---------------- Eventos ---------------- */

body.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;

  if (f.id === 'loginForm') {
    const scope = $('input[name="scope"]:checked', f)?.value;
    if (scope && $('#pin').value.trim() === ADMIN_PINS[scope]) {
      admin.scope = scope;
      try { sessionStorage.setItem(STORAGE.adminSession, scope); } catch { /* */ }
      admin.view = 'list'; admin.tab = 'mine'; admin.fBranch = ''; admin.fCat = '';
      render();
      toast(`Hola, ${scopeLabel(scope)} 👋`);
    } else {
      $('#pin').classList.add('is-invalid');
      $('#pin').value = '';
      toast('PIN incorrecto para esa sucursal');
    }
    return;
  }

  if (f.id === 'form') {
    const p = admin.editing;
    const isNew = !Catalog.byId(p.id);
    const errs = [];
    const price = Number(f.price.value);
    if (canEditBase(p) && !f.name.value.trim()) { f.name.classList.add('is-invalid'); errs.push('el nombre'); }
    if (!(price > 0)) { f.price.classList.add('is-invalid'); errs.push('el precio'); }
    const branches = isGeneral() ? $$('input[name="branches"]:checked', f).map(i => i.value) : (isNew ? [admin.scope] : p.branches);
    if (!branches.length) errs.push('al menos una sucursal');
    if (errs.length) { toast(`Completá ${errs.join(', ')}`); return; }

    // Producto nuevo: el precio cargado es también el precio base (necesario para validarlo).
    let next = { ...p, branches, ...(isNew ? { price: Math.round(price), discount: Math.round(clampNum(f.discount.value, 0, 90)) } : {}) };
    if (canEditBase(p)) {
      const sameCat = f.cat.value === p.cat;
      next = { ...next, name: f.name.value, brand: f.brand.value, cat: f.cat.value, image: admin.draftImage, art: sameCat ? p.art : undefined, color: sameCat ? p.color : undefined };
    }
    const sanitized = sanitizeProduct(next);
    if (!sanitized) { toast('Revisá los datos del producto'); return; }
    setField(sanitized, 'price', Math.round(price));
    setField(sanitized, 'discount', Math.round(clampNum(f.discount.value, 0, 90)));
    setField(sanitized, 'featured', f.featured.checked);
    setField(sanitized, 'inStock', f.inStock.checked);
    setField(sanitized, 'active', f.active.checked);
    Catalog.upsert(sanitized);
    admin.view = 'list';
    render();
    toast(`Guardado: ${sanitized.name} ✓`);
  }
});

body.addEventListener('click', e => {
  const btn = e.target.closest('[data-a], [data-tab]');
  if (!btn) return;
  if (btn.dataset.tab) { admin.tab = btn.dataset.tab; render(); return; }
  const p = btn.dataset.id && Catalog.byId(btn.dataset.id);
  const b = myBranch();
  switch (btn.dataset.a) {
    case 'new':
      admin.editing = { id: 'p' + Date.now().toString(36), name: '', brand: '', cat: (b ? CATEGORIES.find(c => c.branches.includes(b.id)) : CATEGORIES[0]).id, price: '', discount: 0, branches: b ? [b.id] : [...ALL_BRANCHES], image: '', featured: false, inStock: true, active: true };
      admin.draftImage = '';
      admin.view = 'edit'; render(); break;
    case 'edit':
      admin.editing = JSON.parse(JSON.stringify(p));
      admin.draftImage = p.image || '';
      admin.view = 'edit'; render(); break;
    case 'back':
      admin.view = 'list'; render(); break;
    case 'clear-img':
      admin.draftImage = ''; renderImg(); break;
    case 'toggle': {
      const key = btn.dataset.key;
      setField(p, key, !viewOf(p)[key]);
      Catalog.saveLocal(); renderList();
      if (key === 'active') toast(viewOf(p).active ? 'Producto publicado' : 'Producto pausado');
      break;
    }
    case 'delete':
      if (canEditBase(p)) {
        if (confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) { Catalog.remove(p.id); renderList(); toast('Producto eliminado'); }
      } else if (confirm(`¿Quitar "${p.name}" de ${b.name}? Sigue disponible en ${branchNames(p.branches.filter(x => x !== b.id))}.`)) {
        p.branches = p.branches.filter(x => x !== b.id);
        if (p.overrides) { delete p.overrides[b.id]; if (!Object.keys(p.overrides).length) delete p.overrides; }
        Catalog.saveLocal(); renderList(); toast(`Quitado de ${b.name}`);
      }
      break;
    case 'adopt':
      p.branches = [...new Set([...p.branches, b.id])];
      Catalog.saveLocal(); renderList();
      toast(`"${p.name}" ahora está en ${b.name}. Revisá precio y stock en "Productos de ${b.name}".`);
      break;
    case 'export-json':
      download('catalogo-farmako.json', JSON.stringify(Catalog.toJSON(), null, 2), 'application/json');
      toast('Descargado catalogo-farmako.json'); break;
    case 'export-csv':
      download('catalogo-farmako.csv', '﻿' + toCSV(Catalog.products), 'text/csv;charset=utf-8');
      toast('Descargado catalogo-farmako.csv'); break;
    case 'discard':
      if (confirm('¿Descartar los cambios de este navegador y volver al catálogo publicado?')) {
        Catalog.discardLocal().then(() => { render(); toast('Se restauró el catálogo publicado'); });
      }
      break;
  }
});

body.addEventListener('input', e => {
  const t = e.target;
  t.classList?.remove('is-invalid');
  if (t.id === 'q') { admin.q = t.value; renderList(); }
  if (t.id === 'imgUrl') { admin.draftImage = t.value.trim(); renderImg(); }
  if (t.closest?.('#form') && ['price', 'discount', 'cat'].includes(t.name)) updatePreview();
});

body.addEventListener('change', async e => {
  const t = e.target;
  if (t.id === 'fBranch') { admin.fBranch = t.value; renderList(); }
  if (t.id === 'fCat') { admin.fCat = t.value; renderList(); }
  if (t.name === 'cat') { updatePreview(); renderImg(); }
  if (t.name === 'scope') admin.loginScope = t.value;
  if (t.id === 'importFile' && t.files[0]) { await importCatalog(t.files[0]); t.value = ''; }
  if (t.id === 'imgFile' && t.files[0]) {
    const file = t.files[0];
    try {
      toast('Procesando foto…');
      const cloudUrl = await uploadImageToCloud(file).catch(err => { console.warn(err); return null; });
      admin.draftImage = cloudUrl || await compressImage(file);
      $('#imgUrl').value = cloudUrl || '';
      renderImg();
      toast(cloudUrl ? 'Foto subida a Cloudinary ✓' : 'Foto lista ✓ (guardada en el catálogo)');
    } catch { toast('No se pudo procesar la foto'); }
    t.value = '';
  }
});

$('#adminLogout').addEventListener('click', () => {
  try { sessionStorage.removeItem(STORAGE.adminSession); } catch { /* */ }
  admin.loginScope = admin.scope || admin.loginScope;
  admin.scope = null;
  render();
});

// Si otra pestaña del panel guarda cambios, este panel se actualiza.
addEventListener('storage', e => {
  if (e.key === STORAGE.catalog && admin.scope && admin.view === 'list') { Catalog.boot(); renderList(); }
});

/* ---------------- Init ---------------- */

render();
Catalog.loadPublished().then(changed => { if (changed && admin.scope && admin.view === 'list') render(); });

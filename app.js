/* ==========================================================
   My Practicals - app.js (vanilla JavaScript, no backend)
   Data comes from practicals.js. Each practical has 4 fields:
   { prNo, title, code, theory }. Edits live in memory until you export
   the updated practicals.js file and replace the project file.
   ========================================================== */
// localStorage is used ONLY for small preferences (theme, layout, favorite stars)
const KEYS = { theme: 'mp_theme', layout: 'mp_layout', favs: 'mp_favs' };
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- State: working copy loaded from practicals.js ---------- */
const clone = list => list.map(p => ({ prNo: Number(p.prNo), title: p.title == null ? '' : String(p.title), code: String(p.code), theory: String(p.theory) }));
// Older practicals may have no title: show a clear fallback until one is added
const titleOf = p => p.title.trim() || 'Untitled practical';
const original = typeof practicals !== 'undefined' && Array.isArray(practicals) ? practicals : [];
let items = clone(original);
let favs = store.get(KEYS.favs, []); if (!Array.isArray(favs)) favs = [];
const state = { view: 'dashboard', filter: 'all', sort: 'asc', layout: store.get(KEYS.layout, 'grid'),
                q: '', id: null, editNo: null, formInit: null, onYes: null, dirty: false };

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const byNo = n => items.find(p => p.prNo === n);
const sortedItems = () => [...items].sort((a, b) => a.prNo - b.prNo);
function markDirty() { state.dirty = true; }
function saveFavs() { store.set(KEYS.favs, favs); }

/* ---------- Toast, confirm dialog, copy, download ---------- */
let toastTimer;
function toast(msg, type) {
  const t = $('#toast'); t.textContent = msg; t.className = 'toast-box show ' + (type || 'success');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
function confirmBox(title, msg, okLabel, onYes) {
  $('#modalTitle').textContent = title; $('#modalMsg').textContent = msg; $('#modalYes').textContent = okLabel;
  state.onYes = onYes; $('#modal').classList.remove('d-none'); $('#modalNo').focus();
}
function closeModal() { $('#modal').classList.add('d-none'); state.onYes = null; }
async function copyText(text, label) {
  try {
    if (!(navigator.clipboard && window.isSecureContext)) throw new Error('no clipboard api');
    await navigator.clipboard.writeText(text);
  } catch (e) {
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove();
      if (!ok) throw new Error('copy failed');
    } catch (e2) { toast('Copy failed. Select the text and press Ctrl+C.', 'danger'); return; }
  }
  toast(label + ' copied successfully!');
}
function downloadFile(name, text, type) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) { toast('Download failed.', 'danger'); }
}

/* ---------- Export / import ---------- */
// Turn text into a safe JavaScript template literal (escape \ ` and ${)
const tpl = s => '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
function buildPracticalsJs() {
  const body = sortedItems().map(p => `  {\n    prNo: ${p.prNo},\n    title: ${JSON.stringify(p.title)},\n    code: ${tpl(p.code)},\n    theory: ${tpl(p.theory)}\n  }`).join(',\n');
  return '// Exported from My Practicals on ' + new Date().toLocaleString() + '\nconst practicals = [\n' + body + '\n];\n';
}
function exportJs() {
  downloadFile('practicals.js', buildPracticalsJs(), 'text/javascript');
  state.dirty = false; render();
  toast('Exported! Replace the project\'s practicals.js with this file, then redeploy.');
}
function exportJson() { downloadFile('practicals-backup.json', JSON.stringify(sortedItems(), null, 2), 'application/json'); toast('JSON backup downloaded.'); }
async function importJson(file) {
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data)) throw new Error('The file must contain a list of practicals.');
    const seen = new Set();
    const list = data.map(p => {
      const n = Number(p && p.prNo);
      if (!Number.isInteger(n) || n < 1 || typeof p.code !== 'string' || typeof p.theory !== 'string' || (p.title != null && typeof p.title !== 'string')) throw new Error('Each practical needs prNo, code and theory (title must be text).');
      if (seen.has(n)) throw new Error('Duplicate PR No. ' + n + ' in the file.');
      seen.add(n); return { prNo: n, title: p.title || '', code: p.code, theory: p.theory };
    });
    confirmBox('Import backup?', 'This replaces the ' + items.length + ' practical(s) currently open with ' + list.length + ' from the file.', 'Import', () => {
      items = list; markDirty(); toast('Backup imported. Export practicals.js to make it permanent.'); go('dashboard');
    });
  } catch (e) { toast('Import failed: ' + (e.message || 'invalid file'), 'danger'); }
}

/* ---------- Search, filter, sort ---------- */
function visible() {
  const q = state.q.trim().toLowerCase();
  const list = items.filter(p => (state.filter === 'all' || favs.includes(p.prNo)) &&
    (!q || String(p.prNo).includes(q) || p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.theory.toLowerCase().includes(q)));
  return list.sort((a, b) => state.sort === 'asc' ? a.prNo - b.prNo : b.prNo - a.prNo);
}

/* ---------- Views (order everywhere: PR No. -> Code -> Theory) ---------- */
function card(p) {
  const fav = favs.includes(p.prNo);
  return `<article class="p-card">
    <div class="d-flex justify-content-between align-items-center"><div class="d-flex align-items-center gap-2"><div class="p-icon"><i class="bi bi-file-earmark-code"></i></div>
      <span class="num-badge">PR No. ${p.prNo}</span></div>
      <button class="icon-btn ${fav ? 'on' : ''}" data-action="fav" data-id="${p.prNo}" aria-pressed="${fav}" aria-label="Toggle favorite"><i class="bi ${fav ? 'bi-star-fill' : 'bi-star'}"></i></button></div>
    <h3 class="pr-title ${p.title.trim() ? '' : 'untitled'}">${esc(titleOf(p))}</h3>
    <pre class="preview-code">${esc(p.code)}</pre><p class="preview-theory muted small">${esc(p.theory)}</p>
    <div class="p-actions"><span class="muted small">${p.code.split('\n').length} lines</span>
      <button class="btn btn-accent btn-sm" data-action="open" data-id="${p.prNo}">View <i class="bi bi-arrow-right"></i></button></div></article>`;
}
function fillGrid() {
  const list = visible(); let html;
  if (!items.length) html = `<div class="empty"><div class="empty-icon"><i class="bi bi-journal-code"></i></div><h3 class="h5">No practicals yet</h3>
      <p class="muted">Add a practical, or add entries to <code>practicals.js</code>.</p>
      <button class="btn btn-accent" data-action="add"><i class="bi bi-plus-lg"></i> Add Your First Practical</button></div>`;
  else if (!list.length) html = `<div class="empty"><div class="empty-icon"><i class="bi bi-search"></i></div><h3 class="h5">Nothing found</h3>
      <p class="muted mb-0">${state.filter === 'fav' && !state.q ? 'You have not starred any practicals yet.' : 'Try a different search or switch the filter.'}</p></div>`;
  else html = list.map(card).join('');
  const g = $('#grid'); g.innerHTML = html; g.className = 'grid ' + (state.layout === 'list' ? 'list' : '');
}
function librarySection() {
  const seg = (a, k, label) => `<button class="${state[k] === a ? 'active' : ''}" data-action="${k === 'filter' ? 'setfilter' : 'setlayout'}" data-v="${a}">${label}</button>`;
  return `<div class="toolbar"><h2 class="h5 mb-0">My Practicals</h2><div class="d-flex flex-wrap gap-2 align-items-center">
      <div class="seg" role="group" aria-label="Filter">${seg('all', 'filter', 'All')}${seg('fav', 'filter', '<i class="bi bi-star-fill"></i> Favorites')}</div>
      <select id="sort" class="form-select form-select-sm w-auto" aria-label="Sort practicals">
        <option value="asc" ${state.sort === 'asc' ? 'selected' : ''}>PR No. Ascending</option><option value="desc" ${state.sort === 'desc' ? 'selected' : ''}>PR No. Descending</option></select>
      <div class="seg" role="group" aria-label="Layout">${seg('grid', 'layout', '<i class="bi bi-grid"></i>')}${seg('list', 'layout', '<i class="bi bi-list-ul"></i>')}</div>
    </div></div><div id="grid" class="grid"></div>`;
}
function banner() {
  return state.dirty ? `<div class="banner"><div><i class="bi bi-exclamation-triangle"></i> <b>Unsaved changes.</b> Edits exist only in this browser tab. Export
    <code>practicals.js</code>, replace the project file, then redeploy to make them permanent.</div>
    <button class="btn btn-accent btn-sm" data-action="export-js"><i class="bi bi-download"></i> Export practicals.js</button></div>` : '';
}
function viewDashboard() {
  const stat = (icon, n, label) => `<div class="col-sm-4"><div class="panel stat"><div class="stat-icon"><i class="bi ${icon}"></i></div><div><b>${n}</b><span>${label}</span></div></div></div>`;
  const favCount = items.filter(p => favs.includes(p.prNo)).length;
  return `<section class="hero mb-4"><h2>Your AI Lab Workspace</h2>
    <p class="muted mb-0">Organize your practicals, understand the theory, and copy code in seconds.</p></section>
    <div class="row g-3">${stat('bi-journal-code', items.length, 'Total practicals')}${stat('bi-star', favCount, 'Favorites')}
    ${stat('bi-hash', items.length ? Math.max(...items.map(p => p.prNo)) : '-', 'Highest PR No.')}</div>${librarySection()}`;
}
function viewDetail() {
  const p = byNo(state.id); if (!p) return '<div class="empty">Practical not found.</div>';
  const fav = favs.includes(p.prNo), lines = p.code.split('\n').length;
  return `<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div><span class="num-badge">PR No. ${p.prNo}</span><h2 class="h3 mt-2 mb-0 pr-title ${p.title.trim() ? '' : 'untitled'}">${esc(titleOf(p))}</h2>${p.title.trim() ? '' : '<div class="muted small">Click Edit to add a title.</div>'}</div>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-soft" data-action="back"><i class="bi bi-arrow-left"></i> Back</button>
        <button class="icon-btn ${fav ? 'on' : ''}" data-action="fav" data-id="${p.prNo}" aria-pressed="${fav}" aria-label="Toggle favorite"><i class="bi ${fav ? 'bi-star-fill' : 'bi-star'}"></i></button>
        <button class="btn btn-soft" data-action="edit" data-id="${p.prNo}"><i class="bi bi-pencil"></i> Edit</button>
        <button class="btn btn-soft text-danger" data-action="del" data-id="${p.prNo}"><i class="bi bi-trash"></i> Delete</button></div></div>
    <section class="code-panel mb-4"><div class="code-head"><span><i class="bi bi-code-slash"></i> Code &middot; ${lines} line${lines > 1 ? 's' : ''}</span>
      <span class="d-flex gap-2"><button class="btn btn-soft btn-sm" data-action="download"><i class="bi bi-download"></i> Download Code</button>
      <button class="btn btn-accent btn-sm" data-action="copy" data-what="code"><i class="bi bi-clipboard"></i> Copy Code</button></span></div>
      <pre class="code-body" tabindex="0"><code>${esc(p.code)}</code></pre></section>
    <section class="panel"><div class="panel-head"><h2><i class="bi bi-book"></i> Theory</h2>
      <button class="btn btn-soft btn-sm" data-action="copy" data-what="theory"><i class="bi bi-clipboard"></i> Copy Theory</button></div>
      <div class="reading">${esc(p.theory)}</div></section>`;
}
function viewForm() {
  const f = state.formInit, editing = state.editNo !== null;
  return `<form id="pform" novalidate class="panel"><div class="row g-3">
    <div class="col-sm-4 col-md-3"><label class="form-label fw-semibold" for="f_prNo">PR No. <span class="text-danger">*</span></label>
      <input id="f_prNo" type="number" min="1" step="1" class="form-control" placeholder="e.g. 1" value="${esc(f.prNo)}"><div class="invalid-feedback" id="e_prNo"></div></div>
    <div class="col-sm-8 col-md-9"><label class="form-label fw-semibold" for="f_title">Title <span class="text-danger">*</span></label>
      <input id="f_title" type="text" maxlength="200" class="form-control" placeholder="e.g. Addition of Two Numbers" value="${esc(f.title)}"><div class="invalid-feedback" id="e_title"></div></div>
    <div class="col-12"><label class="form-label fw-semibold" for="f_code">Code <span class="text-danger">*</span></label>
      <textarea id="f_code" class="form-control editor" rows="16" spellcheck="false" placeholder="Paste your program code here...">${esc(f.code)}</textarea><div class="invalid-feedback" id="e_code"></div></div>
    <div class="col-12"><label class="form-label fw-semibold" for="f_theory">Theory <span class="text-danger">*</span></label>
      <textarea id="f_theory" class="form-control" rows="9" placeholder="Write the theory here...">${esc(f.theory)}</textarea><div class="invalid-feedback" id="e_theory"></div></div>
    <div class="col-12 d-flex flex-wrap gap-2">
      <button type="submit" class="btn btn-accent"><i class="bi bi-check2-circle"></i> ${editing ? 'Update Practical' : 'Save Practical'}</button>
      <button type="button" class="btn btn-soft" data-action="reset"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
      <button type="button" class="btn btn-soft" data-action="cancel">Cancel</button></div></div></form>`;
}
function viewSettings() {
  const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  const btn = (a, icon, label, cls) => `<button class="btn ${cls || 'btn-soft'}" data-action="${a}"><i class="bi ${icon}"></i> ${label}</button>`;
  return `<section class="panel mb-3"><h2 class="h6">Appearance</h2><div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" id="themeSwitch" data-action="theme" ${dark ? 'checked' : ''}><label class="form-check-label" for="themeSwitch">Dark mode</label></div></section>
    <section class="panel mb-3"><h2 class="h6">Save your changes permanently</h2>
      <p class="muted">Browsers cannot edit project files. After adding, editing or deleting, export <code>practicals.js</code>, replace the file in your project, then commit and redeploy (for example to Vercel).</p>
      <div class="d-flex flex-wrap gap-2">${btn('export-js', 'bi-filetype-js', 'Export practicals.js', 'btn-accent')}</div></section>
    <section class="panel"><h2 class="h6">Backup</h2><p class="muted">A JSON backup lets you save or restore your working copy.</p>
      <div class="d-flex flex-wrap gap-2">${btn('export-json', 'bi-filetype-json', 'Export JSON backup')}${btn('import', 'bi-upload', 'Import JSON backup')}
      ${btn('discard', 'bi-arrow-counterclockwise', 'Discard changes &amp; reload original')}</div></section>`;
}

/* ---------- Rendering and navigation ---------- */
function pageMeta() {
  const D = ['Dashboard', 'dashboard'], L = ['Practicals', 'library'];
  switch (state.view) {
    case 'library': return state.filter === 'fav' ? { t: 'Favorites', c: [D, L] } : { t: 'All Practicals', c: [D] };
    case 'detail': return { t: 'PR ' + state.id + (byNo(state.id) ? ' - ' + titleOf(byNo(state.id)) : ''), c: [D, L] };
    case 'form': return { t: state.editNo !== null ? 'Edit Practical' : 'Add Practical', c: [D, L] };
    case 'settings': return { t: 'Settings', c: [D] };
    default: return { t: 'Dashboard', c: [] };
  }
}
function render() {
  const views = { dashboard: viewDashboard, library: () => librarySection(), detail: viewDetail, form: viewForm, settings: viewSettings };
  $('#app').innerHTML = banner() + views[state.view]();
  if ($('#grid')) fillGrid();
  const m = pageMeta();
  $('#pageTitle').textContent = m.t;
  $('#crumbs').innerHTML = `<ol class="crumbs">${m.c.map(([l, v]) => `<li><button class="crumb-link" data-action="nav" data-view="${v}" data-filter="all">${l}</button></li>`).join('')}<li aria-current="page">${esc(m.t)}</li></ol>`;
  document.querySelectorAll('.nav-item-btn').forEach(b =>
    b.classList.toggle('active', state.view === b.dataset.view && (b.dataset.view !== 'library' || b.dataset.filter === state.filter)));
  $('#themeBtn').innerHTML = `<i class="bi ${document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'bi-sun' : 'bi-moon'}"></i>`;
}
function go(view, opts) { Object.assign(state, { view }, opts || {}); closeMenu(); render(); window.scrollTo(0, 0); }
const openMenu = () => { $('#sidebar').classList.add('open'); $('#backdrop').classList.add('show'); };
function closeMenu() { $('#sidebar').classList.remove('open'); $('#backdrop').classList.remove('show'); }
function setTheme(t) {
  document.documentElement.setAttribute('data-bs-theme', t); store.set(KEYS.theme, t);
  const sw = $('#themeSwitch'); if (sw) sw.checked = t === 'dark';
  $('#themeBtn').innerHTML = `<i class="bi ${t === 'dark' ? 'bi-sun' : 'bi-moon'}"></i>`;
}

/* ---------- Form logic ---------- */
const readForm = () => ({ prNo: $('#f_prNo').value, title: $('#f_title').value, code: $('#f_code').value, theory: $('#f_theory').value });
function formDirty() {
  if (state.view !== 'form') return false;
  const a = readForm(), b = state.formInit; return Object.keys(a).some(k => a[k] !== b[k]);
}
function navigate(fn) {   // ask before leaving a form with unsaved text
  if (formDirty()) confirmBox('Discard changes?', 'You have unsaved changes in this form. If you leave now they will be lost.', 'Discard', fn); else fn();
}
function startForm(no) {
  const p = no == null ? null : byNo(no);
  go('form', { editNo: p ? p.prNo : null, formInit: p ? { prNo: String(p.prNo), title: p.title, code: p.code, theory: p.theory } : { prNo: '', title: '', code: '', theory: '' } });
  $('#f_prNo').focus();
}
function markInvalid(id, msg) { $('#f_' + id).classList.toggle('is-invalid', !!msg); if (msg) $('#e_' + id).textContent = msg; }
function saveForm() {
  const f = readForm(), n = Number(f.prNo.trim());
  const valid = f.prNo.trim() !== '' && Number.isInteger(n) && n > 0;
  const dup = valid && items.some(p => p.prNo === n && p.prNo !== state.editNo);
  markInvalid('prNo', !valid ? 'Enter a whole number (1 or more).' : dup ? 'This PR No. already exists.' : '');
  markInvalid('title', f.title.trim() ? '' : 'Please enter a title.');
  markInvalid('code', f.code.trim() ? '' : 'Please enter the code.');
  markInvalid('theory', f.theory.trim() ? '' : 'Please enter the theory.');
  const bad = document.querySelector('#pform .is-invalid');
  if (bad) { bad.focus(); toast(dup ? 'PR No. already exists.' : 'Please fix the highlighted fields.', 'danger'); return; }
  const rec = { prNo: n, title: f.title.trim(), code: f.code.replace(/\r\n/g, '\n').replace(/\s+$/, ''), theory: f.theory.replace(/\r\n/g, '\n').trim() };
  const editing = state.editNo !== null;
  if (editing) {
    items[items.findIndex(p => p.prNo === state.editNo)] = rec;
    if (n !== state.editNo && favs.includes(state.editNo)) { favs = favs.map(x => x === state.editNo ? n : x); saveFavs(); }
  } else items.push(rec);
  markDirty(); state.formInit = readForm();
  toast(editing ? 'Practical updated. Export practicals.js to keep it.' : 'Practical added. Export practicals.js to keep it.');
  go('detail', { id: n, editNo: null });
}

/* ---------- Events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]'); if (!t) return;
  const a = t.dataset.action, id = Number(t.dataset.id), p = byNo(state.id);
  switch (a) {
    case 'nav': navigate(() => go(t.dataset.view, { filter: t.dataset.filter || state.filter })); break;
    case 'menu': $('#sidebar').classList.contains('open') ? closeMenu() : openMenu(); break;
    case 'add': navigate(() => startForm()); break;
    case 'open': go('detail', { id }); break;
    case 'back': go('library', { filter: 'all' }); break;
    case 'edit': startForm(id); break;
    case 'fav': favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id]; saveFavs(); render();
      toast(favs.includes(id) ? 'Added to favorites.' : 'Removed from favorites.'); break;
    case 'del': confirmBox('Delete practical?', 'Delete PR No. ' + id + (byNo(id) && byNo(id).title.trim() ? ' (' + byNo(id).title.trim() + ')' : '') + ' from the working copy? Export practicals.js afterwards to make this permanent.', 'Delete', () => {
      items = items.filter(x => x.prNo !== id); favs = favs.filter(x => x !== id); saveFavs(); markDirty(); toast('Practical deleted.'); go('library', { filter: 'all' }); }); break;
    case 'copy': if (p) copyText(t.dataset.what === 'code' ? p.code : p.theory, t.dataset.what === 'code' ? 'Code' : 'Theory'); break;
    case 'download': if (p) { downloadFile('practical-' + p.prNo + '-code.txt', p.code, 'text/plain'); toast('Code downloaded.'); } break;
    case 'setfilter': state.filter = t.dataset.v; render(); break;
    case 'setlayout': state.layout = t.dataset.v; store.set(KEYS.layout, state.layout); render(); break;
    case 'theme': setTheme(t.type === 'checkbox' ? (t.checked ? 'dark' : 'light') : (document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark')); break;
    case 'reset': if (Object.values(readForm()).every(v => !v.trim())) break;
      confirmBox('Reset form?', 'All the content you entered will be cleared.', 'Reset', () => {
        ['prNo', 'title', 'code', 'theory'].forEach(k => { $('#f_' + k).value = ''; markInvalid(k, ''); }); $('#f_prNo').focus(); }); break;
    case 'cancel': navigate(() => state.editNo !== null ? go('detail', { id: state.editNo, editNo: null }) : go('library', { filter: 'all' })); break;
    case 'export-js': exportJs(); break;
    case 'export-json': exportJson(); break;
    case 'import': $('#importFile').click(); break;
    case 'discard': confirmBox('Discard all changes?', 'The working copy will be reloaded from the original practicals.js.', 'Discard', () => {
      items = clone(original); state.dirty = false; toast('Original practicals reloaded.'); go('dashboard'); }); break;
    case 'yes': { const fn = state.onYes; closeModal(); if (fn) fn(); break; }
    case 'no': closeModal(); break;
  }
});
document.addEventListener('submit', e => { if (e.target.id === 'pform') { e.preventDefault(); saveForm(); } });
document.addEventListener('change', e => {
  if (e.target.id === 'sort') { state.sort = e.target.value; fillGrid(); }
  if (e.target.id === 'importFile') { const f = e.target.files[0]; e.target.value = ''; if (f) importJson(f); }
});
$('#search').addEventListener('input', e => {
  state.q = e.target.value;
  if (['detail', 'settings'].includes(state.view)) go('library', { filter: 'all' }); else if ($('#grid')) fillGrid();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeMenu(); } });
window.addEventListener('beforeunload', e => { if (state.dirty || formDirty()) { e.preventDefault(); e.returnValue = ''; } });

/* ---------- Start (no server needed) ---------- */
setTheme(store.get(KEYS.theme, 'light'));
render();

import { STORAGE_KEY, FIELDS, LIMITS, TITLES, CHOICES, charLength, escapeHtml as e, safePhoto, createFreshState, validateStep, isComplete, normaliseState, getEnding, getActCopy, makeBookHtml } from './core.js?v=2';
import { icon, scene, compassRose, sealArt } from './art.js?v=2';

let state = createFreshState();
let storageAvailable = true;
let view = 'home';
let toastTimer;
let photoBusy = false;
let revision = 0;
const $ = selector => document.querySelector(selector);
document.querySelectorAll('[data-art-icon]').forEach(el => { el.innerHTML = icon(el.dataset.artIcon); });
document.querySelectorAll('[data-art-rose]').forEach(el => { el.innerHTML = compassRose(); });
try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) state = normaliseState(JSON.parse(saved)); } catch { storageAvailable = false; }
$('#storage-notice').hidden = storageAvailable;

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; } catch { storageAvailable = false; }
  $('#storage-notice').hidden = storageAvailable;
  const status = $('.journey-status');
  if (status) status.textContent = storageAvailable ? '进度已留在这台设备' : '暂存于本页，请下载留存';
  updateHome();
}
function toast(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4300);
}
function updateHome() {
  $('#hero-start-label').textContent = isComplete(state) ? '翻看我的冒险小册子' : state.unlocked ? '继续我的这条支线' : '拆开这封来信';
  $('#resume-hint').hidden = !state.unlocked;
  $('#resume-hint').textContent = isComplete(state) ? '你已经留下一份原件，随时可以回来翻看。' : `你的旅程停在第 ${Math.min(state.unlocked, 3)} 幕。现在继续，刚刚好。`;
}
function navigate(target, focus = true) {
  const hash = '#' + target;
  if (location.hash !== hash) { history.pushState(null, '', hash); }
  showRoute(target, focus);
}
function showRoute(target, focus = true) {
  state = normaliseState(state);
  if (target === 'book' && !isComplete(state)) target = 'play';
  view = target === 'play' ? 'play' : target === 'book' ? 'book' : 'home';
  $('#home-view').hidden = view !== 'home'; $('#play-view').hidden = view !== 'play'; $('#book-view').hidden = view !== 'book';
  document.querySelectorAll('.home-nav').forEach(link => { link.hidden = view !== 'home'; });
  if (view === 'play') renderPlay();
  if (view === 'book') renderBook();
  updateHome();
  document.title = view === 'home' ? '下一条支线 · 今天，走一点不一样的路' : view === 'book' ? '我的冒险小册子 · 下一条支线' : `${TITLES[state.cursor]} · 下一条支线`;
  if (focus) { window.scrollTo(0, 0); const heading = view === 'home' ? $('#main') : $(`#${view}-view h1`); heading?.focus({ preventScroll: true }); }
  if (['chapter', 'how'].includes(target)) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView());
}
function sidebar() {
  return `<aside class="story-side"><small>VOL.001 / CAMPUS CALENDAR</small><h2>被复制的<br>星期三</h2><ol class="journey-steps">${[1, 2, 3].map(step => `<li><button class="journey-step ${state.cursor === step ? 'active' : ''} ${state.unlocked > step ? 'done' : ''}" data-action="jump" data-step="${step}" ${state.unlocked < step ? 'disabled' : ''} ${state.cursor === step ? 'aria-current="step"' : ''}><span>${state.unlocked > step ? '✓' : '0' + step}</span>${['发现一处不同', '走一条支线', '留下我的原件'][step - 1]}</button></li>`).join('')}</ol><p class="side-note">没有标准答案，也不必着急。<br>这段故事可以在原地完成。<br>想离开时，进度会为你留着。</p><div class="field-kit" aria-hidden="true"><small>日历室 / 随身物件</small><img class="field-book" src="./assets/vendor/kitbitz/book.svg" alt="" width="52" height="72"><img class="field-clock" src="./assets/vendor/kitbitz/clock.svg" alt="" width="94" height="110"><img class="field-plant" src="./assets/vendor/kitbitz/plant.svg" alt="" width="85" height="179"></div></aside>`;
}
function renderPlay() {
  if (state.cursor === 4 && !isComplete(state)) state.cursor = Math.min(state.unlocked, 3);
  $('#play-view').innerHTML = `<div class="journey-top"><button class="back-link" data-action="home">← 回到故事首页</button><span class="journey-status">${storageAvailable ? '进度已留在这台设备' : '暂存于本页，请下载留存'}</span></div><div class="story-layout">${sidebar()}<div>${state.cursor === 0 ? invitation() : state.cursor === 4 ? endingView() : actView(state.cursor)}</div></div>`;
}
function invitation() {
  return `<article class="story-paper"><div class="scene-banner" aria-hidden="true">${scene(0)}</div><div class="story-kicker">收到一封来自校园日历室的信</div><h1 tabindex="-1">今天，需要一份原件。</h1><div class="story-prose"><p>同学，你好：</p><p>很抱歉，今天的星期三误用了上周的副本。</p><p>课表、铃声和便利店的饭团都复制成功了，只有“你亲眼看见的事”，无法自动补齐。</p><p>请找出三处小小的不同，帮我们完成今天。你不需要走远，也不需要做一件大事。</p><p class="signature">—— 校园日历室 · 临时值班员</p><p class="ps">P.S. 这封信的落款暂时空着。也许最后该由你来签。</p></div><form id="invitation-form" class="invitation-form"><label class="field-label" for="alias">我们怎么称呼你？<small>可不填，不需要真名</small></label><input id="alias" class="text-input" name="alias" maxlength="24" value="${e(state.alias)}" placeholder="比如：小林 / 路过的同学" autocomplete="off"><fieldset class="mode-group"><legend>今天，想在哪里开始？</legend><label class="mode-option"><input type="radio" name="mode" value="nearby" ${state.mode === 'nearby' ? 'checked' : ''}>在校园里随手观察</label><label class="mode-option"><input type="radio" name="mode" value="indoors" ${state.mode === 'indoors' ? 'checked' : ''}>就坐在自己的座位上</label></fieldset><button class="button primary" type="submit">收下这封信 <span aria-hidden="true">↗</span></button><p class="form-footnote">这是一个约 6—10 分钟的虚构短篇。星期三是故事里的时间，任何一天都可以开始。<br>照片可选；不读取位置，也不需要和陌生人互动。</p></form></article>`;
}
function actView(step) {
  const field = FIELDS[step - 1], key = ['lens', 'thread', 'destination'][step - 1];
  const labels = ['我注意到：', '我又发现：', state.thread === 'connect' ? '把它们写进一句话：此刻，……' : '为这格空白留一句话：此刻，……'];
  const placeholders = ['比如：窗边那道像逗号的光', state.lens === 'echo' ? '比如：桌上那本书也折了一个小角' : '比如：走廊另一头忽然安静下来', '比如：什么都没变，但我记住了它们'];
  let recap = '';
  if (step === 2) recap = `你给「${e(state.detail)}」选择了${state.lens === 'echo' ? '一个同伴' : '一个反差'}。这一次，换个角度看。`;
  if (step === 3) recap = state.thread === 'connect' ? '你把两件小事连成了一条线。这一幕，给这条线一个收尾。' : '你为两件小事留了一格空白。这一幕，可以不急着想明白。';
  return `<article class="story-paper"><div class="scene-banner" aria-hidden="true">${scene(step, state)}</div><div class="story-kicker">ACT 0${step} / ${['一份原件', '一条支线', '一个结局'][step - 1]}</div><h1 tabindex="-1">${TITLES[step]}</h1>${recap ? `<p class="recap-line">${recap}</p>` : ''}<div class="story-prose">${getActCopy(state, step).map(text => `<p>${e(text)}</p>`).join('')}</div><form id="act-form" class="act-form" data-step="${step}" novalidate><label class="field-label" for="observation">${labels[step - 1]}<small><span id="char-count">${charLength(state[field])}</span> / ${LIMITS[field]}</small></label><textarea class="observation-input" id="observation" name="${field}" maxlength="${LIMITS[field] * 2}" rows="3" placeholder="${placeholders[step - 1]}" aria-describedby="field-hint form-error">${e(state[field])}</textarea><p class="field-hint" id="field-hint">记下 2—${LIMITS[field]} 个字。普通一点、奇怪一点，都可以。</p><div class="photo-tools"><label class="photo-label">${icon('camera')} ${photoBusy ? '正在整理照片…' : '加一张照片（可选）'}<input type="file" id="photo-input" accept="image/jpeg,image/png,image/webp" ${photoBusy ? 'disabled' : ''} aria-label="为第${step}幕添加一张照片"></label><span class="photo-note">仅在本机保存 · JPG / PNG / WebP · 10 MB以内</span></div>${state.photos[step - 1] ? `<div class="photo-preview"><img src="${safePhoto(state.photos[step - 1])}" alt="这一幕的观察照片"><button type="button" data-action="remove-photo" data-step="${step}">移除照片</button></div>` : ''}<fieldset class="choice-group"><legend>${step === 3 ? '最后，你想把这一页留在哪里？' : '接下来，你想走哪条支线？'}</legend><div class="choice-grid">${CHOICES[key].map(choice => `<label class="choice-card"><input type="radio" name="${key}" value="${choice.value}" ${state[key] === choice.value ? 'checked' : ''}><strong>${choice.title}</strong><small>${choice.description}</small><span class="choice-mark" aria-hidden="true">${choice.mark}</span></label>`).join('')}</div></fieldset><p id="form-error" class="form-error" role="alert" hidden></p><div class="form-actions"><button type="button" class="back-link" data-action="previous">← ${step === 1 ? '回看那封信' : '回到上一幕'}</button><button type="submit" class="button primary" ${photoBusy ? 'disabled' : ''}>${step === 3 ? '为今天盖章' : '把这一刻收入故事'} <span aria-hidden="true">↗</span></button></div><p class="form-footnote">${step === 3 ? '“寄给明天”是故事里的动作，不会发送消息或设置提醒。' : '每一次输入和选择都会保存在本浏览器。可以回看修改，也可以稍后回来。'}</p></form></article>`;
}
function endingView() {
  const ending = getEnding(state);
  return `<article class="story-paper ending-paper"><div class="story-kicker">THE END / 这一版，只有你见过</div><div class="ending-stamp" aria-hidden="true">${sealArt(state.destination)}<b>${ending.stamp}</b></div><h1 tabindex="-1">${ending.title}</h1><div class="story-prose">${ending.paragraphs.map(text => `<p>${e(text)}</p>`).join('')}</div><div class="ending-actions"><button class="button primary" data-action="book">翻开我的冒险小册子 ↗</button><button class="button secondary" data-action="jump" data-step="3">试试另一种结局</button></div><p class="ending-note">没有更好的结局，只有你选择留下的这一页。</p></article>`;
}
function renderBook() {
  if (!isComplete(state)) return;
  const ending = getEnding(state);
  const labels = ['第一处不同', state.lens === 'echo' ? '找到一个同伴' : '看见另一面', '最后一格，由我填写'];
  const subtitles = ['课表写下了时间。我另外记住了这一刻。', state.thread === 'connect' ? '两件小事，连成了今天。' : '有些空白，也属于今天。', ending.closing];
  $('#book-view').innerHTML = `<button class="back-link" data-action="ending">← 回看我的结局</button><div class="book-heading"><div><span class="overline">A COPY THAT BELONGS TO YOU</span><h1 tabindex="-1">今天的原件，请收好。</h1><p>${e(state.alias || '同学')}，你的三处观察，已经装订成一本小册子。</p></div><div class="book-actions"><button class="button primary" data-action="download-book">下载完整小册子 ↓</button><button class="button secondary" data-action="share-card">保存结局卡 ↓</button><button class="button secondary" data-action="print">打印 / 存为 PDF</button></div></div><div class="book-grid"><article class="book-page book-cover"><small>下一条支线 · 校园日历室出品</small><span class="cover-symbol" aria-hidden="true">${scene(4)}</span><h2>被复制的<br>星期三</h2><p>这一版，只有${e(state.alias || '我')}见过。</p><p class="cover-bottom">VOL.001 / ${e(formatDate(state.finishedAt))}</p></article>${FIELDS.map((field, index) => `<article class="book-page ${index === 2 ? 'book-final' : ''}"><small>0${index + 1} / ${labels[index]}</small>${state.photos[index] ? `<img class="book-photo" src="${safePhoto(state.photos[index])}" alt="我记录的第${index + 1}张观察照片">` : index < 2 ? `<div class="book-art" aria-hidden="true">${scene(index + 1, state)}</div>` : ''}<blockquote>${e(state[field])}</blockquote>${index === 2 ? `<span class="mini-seal">${icon(state.destination === 'tomorrow' ? 'mail' : 'sun')}${ending.stamp}</span>` : ''}<p class="page-note">${subtitles[index]}</p><span class="book-page-number">${index + 2} / 4</span></article>`).join('')}</div><section class="book-end-summary"><span class="overline">MY ENDING / 我的结局</span><h2>${ending.title}</h2>${ending.paragraphs.map(text => `<p>${e(text)}</p>`).join('')}<div class="chapter-path">我的支线：${state.lens === 'echo' ? '找一个同伴' : '找一个反差'} → ${state.thread === 'connect' ? '连成一条线' : '留一格空白'} → ${state.destination === 'today' ? '留给今天' : '寄给明天'}</div></section><div class="book-afterword"><p>完整小册子会下载为可离线打开的网页，包含你的文字与可选照片。<br>结局卡是一张图片；分享前，请先确认其中的内容适合给对方看。</p><button class="text-link" data-action="reset">重新走一条支线 ↗</button></div>`;
}
function formatDate(value) { if (!value) return '我的星期三'; return new Date(value).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }); }
function focusHeading() { document.title = view === 'play' ? `${TITLES[state.cursor]} · 下一条支线` : document.title; const heading = $(`#${view}-view h1`); if (heading) { window.scrollTo(0, 0); heading.focus({ preventScroll: true }); } }

document.addEventListener('input', event => {
  if (event.isComposing) return;
  const target = event.target;
  if (target.id === 'alias') { state.alias = Array.from(target.value).slice(0, LIMITS.alias).join(''); if (target.value !== state.alias) target.value = state.alias; save(); }
  if (target.id === 'observation') {
    const field = FIELDS[state.cursor - 1]; if (!field) return;
    state[field] = Array.from(target.value).slice(0, LIMITS[field]).join('');
    if (target.value !== state[field]) target.value = state[field];
    $('#char-count').textContent = charLength(state[field]); $('#form-error').hidden = true; target.removeAttribute('aria-invalid'); save();
  }
});
document.addEventListener('change', event => {
  const target = event.target;
  if (Object.keys(CHOICES).includes(target.name) && CHOICES[target.name].some(choice => choice.value === target.value)) { state[target.name] = target.value; save(); }
  if (target.name === 'mode') { state.mode = target.value === 'indoors' ? 'indoors' : 'nearby'; save(); }
  if (target.id === 'photo-input' && target.files?.[0]) addPhoto(target.files[0]);
});
document.addEventListener('submit', event => {
  if (event.target.id === 'invitation-form') {
    event.preventDefault(); state.cursor = 1; state.unlocked = Math.max(1, state.unlocked); state.startedAt ||= new Date().toISOString(); save(); renderPlay(); focusHeading();
  }
  if (event.target.id === 'act-form') {
    event.preventDefault(); if (photoBusy) return;
    const step = Number(event.target.dataset.step), earlierInvalid = Array.from({ length: step - 1 }, (_, i) => i + 1).find(i => validateStep(state, i));
    if (earlierInvalid) { state.cursor = earlierInvalid; renderPlay(); focusHeading(); toast('前面有一格还没有写完，先把它留好。'); return; }
    const error = validateStep(state, step);
    if (error) { const field = $('#form-error'); field.textContent = error; field.hidden = false; if (charLength(state[FIELDS[step - 1]].trim()) < 2) { $('#observation').setAttribute('aria-invalid', 'true'); $('#observation').focus(); } else { document.querySelector(`input[name="${['lens', 'thread', 'destination'][step - 1]}"]`)?.focus(); } return; }
    state[FIELDS[step - 1]] = state[FIELDS[step - 1]].trim();
    state.unlocked = Math.max(state.unlocked, step + 1); state.cursor = step + 1;
    if (step === 3) { state.completed = true; state.finishedAt = new Date().toISOString(); }
    save(); renderPlay(); focusHeading();
  }
});
document.addEventListener('click', async event => {
  if (event.target.closest('.skip-link')) { event.preventDefault(); $('#main').focus(); return; }
  const target = event.target.closest('[data-action]'); if (!target || target.disabled) return;
  const action = target.dataset.action;
  if (action === 'start' || action === 'resume') { navigate(isComplete(state) ? 'book' : 'play'); }
  if (action === 'home') navigate('home');
  if (action === 'book') navigate('book');
  if (action === 'ending') { state.cursor = 4; save(); navigate('play'); }
  if (action === 'previous') { state.cursor = Math.max(0, state.cursor - 1); save(); renderPlay(); focusHeading(); }
  if (action === 'jump') { const step = Number(target.dataset.step); if (step > 0 && step <= Math.min(3, state.unlocked)) { state.cursor = step; save(); navigate('play'); } }
  if (action === 'remove-photo') { const index = Number(target.dataset.step) - 1; state.photos[index] = ''; save(); renderPlay(); toast('这张照片已从本次旅程移除。'); }
  if (action === 'privacy') $('#info-dialog').showModal();
  if (action === 'close-info') $('#info-dialog').close();
  if (action === 'reset') $('#reset-dialog').showModal();
  if (action === 'cancel-reset') $('#reset-dialog').close();
  if (action === 'confirm-reset') { revision++; state = createFreshState(); photoBusy = false; try { localStorage.removeItem(STORAGE_KEY); } catch {} save(); $('#reset-dialog').close(); navigate('play'); toast('新的一页，已经为你翻开。'); }
  if (action === 'download-book') { try { download(new Blob([makeBookHtml(state)], { type: 'text/html;charset=utf-8' }), '被复制的星期三-我的冒险小册子.html'); toast('小册子已交给浏览器下载，可离线打开。'); } catch (error) { toast(error.message); } }
  if (action === 'print') window.print();
  if (action === 'share-card') { const original = target.textContent; target.disabled = true; target.textContent = '正在装订这一页…'; try { await shareCard(); } catch { toast('结局卡暂时未能生成。你仍可下载完整小册子。'); } finally { target.disabled = false; target.textContent = original; } }
});
window.addEventListener('hashchange', () => showRoute(location.hash.slice(1) || 'home'));
window.addEventListener('popstate', () => showRoute(location.hash.slice(1) || 'home'));
for (const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

async function addPhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast('请选择 JPG、PNG 或 WebP 照片。也可以只写文字。'); return; }
  if (file.size > 10 * 1024 * 1024) { toast('这张照片超过 10 MB，请换一张较小的照片。'); return; }
  const step = state.cursor, currentRevision = revision;
  if (step < 1 || step > 3) return;
  photoBusy = true;
  $('#photo-input').disabled = true; const submit = $('#act-form button[type="submit"]'); if (submit) submit.disabled = true;
  let objectUrl;
  try {
    objectUrl = URL.createObjectURL(file);
    const img = await loadImage(objectUrl);
    if (img.naturalWidth * img.naturalHeight > 80000000) throw new Error('这张照片尺寸过大，请换一张。');
    const scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('浏览器暂时无法处理照片。');
    ctx.fillStyle = '#fffaf0'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let quality = .78, photo = canvas.toDataURL('image/jpeg', quality);
    while (photo.length > 480000 && quality > .3) { quality -= .12; photo = canvas.toDataURL('image/jpeg', quality); }
    if (!safePhoto(photo)) throw new Error('这张照片仍然太大，请换一张。');
    if (revision !== currentRevision) return;
    state.photos[step - 1] = photo; save(); toast('照片已留在本机，没有上传。');
  } catch (error) { toast(error.message && !error.message.startsWith('Event') ? error.message : '没有读懂这张照片，请换一张。也可以只写文字。'); }
  finally { if (objectUrl) URL.revokeObjectURL(objectUrl); if (revision === currentRevision) { photoBusy = false; if (view === 'play') renderPlay(); } }
}
function loadImage(source) { return new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('没有读懂这张照片，请换一张 JPG、PNG 或 WebP。')); img.src = source; }); }
function download(blob, filename) { const url = URL.createObjectURL(blob), anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000); }
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '', offset = y;
  for (const char of Array.from(text)) { if (char === '\n') { ctx.fillText(line, x, offset); line = ''; offset += lineHeight; continue; } if (ctx.measureText(line + char).width > maxWidth && line) { ctx.fillText(line, x, offset); line = char; offset += lineHeight; } else line += char; }
  if (line) ctx.fillText(line, x, offset);
  return offset + lineHeight;
}
async function paintSvg(ctx, svg, x, y, width, height) {
  const image = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  ctx.drawImage(image, x, y, width, height);
}
async function shareCard() {
  if (!isComplete(state)) { toast('先为今天写下结局，再来保存这一页。'); return; }
  const ending = getEnding(state), canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1600;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas unavailable');
  ctx.fillStyle = '#f4efe5'; ctx.fillRect(0, 0, 1200, 1600); ctx.strokeStyle = '#b9c4ac'; ctx.lineWidth = 2; ctx.strokeRect(45, 45, 1110, 1510);
  ctx.fillStyle = '#65765e'; ctx.font = '22px sans-serif'; ctx.fillText('下一条支线 / VOL.001 / 我的冒险小册子', 92, 112);
  ctx.fillStyle = '#183f36'; ctx.font = '64px serif'; ctx.fillText('被复制的星期三', 88, 225);
  ctx.fillStyle = '#d9613c'; ctx.font = '26px sans-serif'; ctx.fillText(`这一版，只有${state.alias || '我'}见过。`, 92, 285);
  await paintSvg(ctx, scene(4), 808, 151, 310, 111);
  let y = 335;
  const labels = ['01 / 我另外记住了', state.lens === 'echo' ? '02 / 它有一个同伴' : '02 / 我看见另一面', '03 / 最后这一格'];
  for (let index = 0; index < 3; index++) {
    ctx.fillStyle = index === 2 ? '#e4eada' : '#fbf7ee'; ctx.fillRect(90, y, 1020, 240);
    ctx.strokeStyle = '#c7d1b7'; ctx.lineWidth = 1; ctx.strokeRect(90, y, 1020, 240);
    ctx.fillStyle = '#d9613c'; ctx.fillRect(90, y, 5, 240);
    ctx.fillStyle = '#68776b'; ctx.font = '21px sans-serif'; ctx.fillText(labels[index], 120, y + 42);
    ctx.fillStyle = '#183f36'; ctx.font = '35px serif'; wrapCanvasText(ctx, state[FIELDS[index]], 120, y + 108, 945, 50);
    y += 270;
  }
  ctx.fillStyle = '#183f36'; ctx.font = '43px serif'; ctx.fillText(ending.title, 92, 1250);
  await paintSvg(ctx, sealArt(state.destination), 890, 1170, 160, 160);
  ctx.fillStyle = '#d9613c'; ctx.font = '24px serif'; ctx.fillText(ending.stamp, 908, 1362);
  ctx.fillStyle = '#68776b'; ctx.font = '27px serif'; ctx.fillText(ending.closing, 92, 1320);
  ctx.beginPath(); ctx.moveTo(92, 1400); ctx.lineTo(1105, 1400); ctx.lineWidth = 1; ctx.strokeStyle = '#b9c4ac'; ctx.stroke();
  ctx.font = '20px sans-serif'; ctx.fillText('三处小小的不同，一份我的原件。', 92, 1455); ctx.fillText(formatDate(state.finishedAt), 92, 1495);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); if (!blob) throw new Error('PNG unavailable');
  download(blob, '下一条支线-我的星期三.png'); toast('结局卡已交给浏览器下载，可以把图片发给朋友。');
}

updateHome();
showRoute(location.hash.slice(1) || 'home', false);

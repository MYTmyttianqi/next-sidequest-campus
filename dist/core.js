import { scene, sealArt } from './art.js?v=2';

export const STORAGE_KEY = 'sidequest:copied-wednesday:v1';
export const FIELDS = ['detail', 'second', 'now'];
export const LIMITS = { alias: 12, detail: 36, second: 36, now: 48 };
export const TITLES = ['一封未签收的来信', '副本里没有的东西', '两件小事之间', '最后一格，由你填写', '今天，已有你的原件'];
export const CHOICES = {
  lens: [{ value: 'echo', title: '给它找一个同伴', description: '下一幕，寻找一个与它呼应的细节。', mark: '≈' }, { value: 'contrast', title: '给它找一个反差', description: '下一幕，看看与它不同的另一面。', mark: '≠' }],
  thread: [{ value: 'connect', title: '把它们连成一条线', description: '用这两条线索，为今天写一句话。', mark: '⌁' }, { value: 'leave_space', title: '在中间留一格空白', description: '也可以保留一点还没想明白的事。', mark: '□' }],
  destination: [{ value: 'today', title: '把这一页留给今天', description: '这一天，值得拥有自己的原件。', mark: '☀' }, { value: 'tomorrow', title: '把这一页寄给明天', description: '收入小册子，为下一页留一个位置。', mark: '↗' }]
};
export const charLength = value => Array.from(String(value ?? '')).length;
const clip = (value, max) => Array.from(typeof value === 'string' ? value : '').slice(0, max).join('');
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const safePhoto = value => typeof value === 'string' && value.length < 700000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value) ? value : '';
export function createFreshState() { return { version: 1, alias: '', mode: 'nearby', cursor: 0, unlocked: 0, completed: false, detail: '', second: '', now: '', lens: '', thread: '', destination: '', photos: ['', '', ''], startedAt: '', finishedAt: '' }; }
export function validateStep(state, step) {
  const field = FIELDS[step - 1];
  if (!field) return '';
  if (charLength(state[field]?.trim()) < 2) return '先记下至少两个字，让这一格属于你。';
  if (charLength(state[field]) > LIMITS[field]) return `这一格最多写${LIMITS[field]}个字。`;
  const choiceKey = ['lens', 'thread', 'destination'][step - 1];
  if (!CHOICES[choiceKey].some(choice => choice.value === state[choiceKey])) return '再选一条你想走的支线。';
  return '';
}
export function isComplete(state) { return !!state.completed && [1, 2, 3].every(step => !validateStep(state, step)); }
export function normaliseState(value) {
  const state = createFreshState();
  if (!value || typeof value !== 'object' || value.version !== 1) return state;
  for (const field of ['alias', ...FIELDS]) state[field] = clip(value[field], LIMITS[field]);
  for (const key of Object.keys(CHOICES)) state[key] = CHOICES[key].some(choice => choice.value === value[key]) ? value[key] : '';
  state.mode = value.mode === 'indoors' ? 'indoors' : 'nearby';
  state.photos = [0, 1, 2].map(index => safePhoto(value.photos?.[index]));
  for (const key of ['startedAt', 'finishedAt']) state[key] = typeof value[key] === 'string' && !Number.isNaN(Date.parse(value[key])) ? value[key] : '';
  state.unlocked = Math.max(0, Math.min(4, Number.isInteger(value.unlocked) ? value.unlocked : 0));
  for (let step = 1; step <= 3; step++) if (validateStep(state, step)) { state.unlocked = Math.min(state.unlocked, step); break; }
  state.completed = value.completed === true && [1, 2, 3].every(step => !validateStep(state, step));
  if (state.completed) state.unlocked = 4;
  state.cursor = Math.max(0, Math.min(state.completed ? 4 : Math.min(state.unlocked, 3), Number.isInteger(value.cursor) ? value.cursor : 0));
  return state;
}
export function getEnding(state) {
  const today = state.destination !== 'tomorrow';
  return { id: today ? 'signed-today' : 'unwritten-tomorrow', title: today ? '今日已签收' : '明天未定稿', stamp: today ? '今日见证人' : '明日改稿人', closing: today ? '今天已有原件。' : '下一页，还没写完。', paragraphs: today ? [
    '日历室合上档案。封面上的“星期三·副本”变成了“星期三·你的原件”。',
    `「${state.detail}」和「${state.second}」都留了下来。它们未必会出现在任何人的课表里，但你见过。`,
    `最后一格写着：${state.now}`,
    state.thread === 'connect' ? '那条由你连起的线，成了这一页的装订线。' : '那一格空白也一起存档；想不明白的事，今天可以先留下。',
    '值班员说：“今天不必发生大事，才算确实来过。”你在空着的落款处，留下一个小小的印章。'
  ] : [
    '日历室把这一页折成一封信。信封上的收件人是“明天的我”。',
    `里面装着「${state.detail}」、「${state.second}」，以及你写下的这一句：${state.now}`,
    state.thread === 'connect' ? '你把两条线索打成一个结，当作信封的封口。' : '你没有封死信口，给未来可能发现的事留了一个位置。',
    '副本没有被撕掉，只是最后一页留出了一个能继续写的地方。',
    '值班员没有替明天排好剧情。信封背面只留了一行字：“如果愿意，下次再看看。”'
  ] };
}
export function getActCopy(state, step) {
  if (step === 1) return [ '日历室发来一张空白底片。课表上没有写阳光落在哪儿，也没有写哪片叶子卷了边。', state.mode === 'indoors' ? '就在自己的座位上，看一会儿手边的东西。找一个刚刚才注意到的小细节：颜色、形状、声音都可以。' : '抬头看一会儿，找一个刚刚才注意到的小细节。可以是颜色、形状、声音，或你手边的一样东西。', '你写下的细节，将成为今天的第一份原件。' ];
  if (step === 2) return [ `「${state.detail}」让底片上多了一点颜色。`, state.lens === 'echo' ? '值班员想知道：它会不会有个同伴？再看一会儿，找一个与它有些相像的颜色、轮廓、声音或感觉。' : '值班员想知道：它的另一面是什么？再看一会儿，找一个与它不同的颜色、轮廓、声音或感觉。', '不用移动，在手边找也可以。原来，今天已经悄悄留下了两处不同。' ];
  return [ `副本终于停了下来。它能复制日程，却猜不到你会看见「${state.detail}」，再发现「${state.second}」。`, '把屏幕放低片刻，看看此刻身边的东西。与刚开始相比，有什么变化？没有变化也可以。', '最后一格不需要漂亮，只需要属于现在。' ];
}
export function makeBookHtml(state) {
  if (!isComplete(state)) throw new Error('请先完成三幕故事，再保存小册子。');
  const e = escapeHtml, ending = getEnding(state);
  const labels = ['第一处不同', state.lens === 'echo' ? '我为它找到一个同伴' : '我看见了它的另一面', '最后一格，由我填写'];
  const cards = FIELDS.map((field, index) => `<section class="card"><small>0${index + 1} / ${labels[index]}</small>${safePhoto(state.photos[index]) ? `<img src="${state.photos[index]}" alt="我留下的第${index + 1}张观察照片">` : `<div class="light">${scene(index + 1, state)}</div>`}<blockquote>${e(state[field])}</blockquote><p>${index === 1 ? (state.thread === 'connect' ? '两件小事，连成了今天。' : '有些空白，也属于今天。') : index === 2 ? e(ending.closing) : '课表写下了时间。我另外记住了这一刻。'}</p></section>`).join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>被复制的星期三 · ${e(state.alias || '我的')}原件</title><style>*{box-sizing:border-box}body{margin:0;background:#f4efe5;color:#173f37;font-family:system-ui,-apple-system,'Microsoft YaHei',sans-serif;line-height:1.8}main{max-width:1000px;margin:60px auto;padding:0 24px}header{border-bottom:1px solid #b9b9a8;padding:36px 0}small{letter-spacing:.16em;font-size:12px}h1{font-size:clamp(34px,6vw,64px);font-family:serif;font-weight:500;line-height:1.3}header p{font-size:18px}.cover-scene{float:right;width:260px;height:100px;margin:12px 0 10px 20px}.cover-scene svg{width:100%;height:100%}header:after{content:"";display:block;clear:both}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px;margin:36px 0}.card{background:#fffaf0;padding:28px;border:1px solid #d0cabb;break-inside:avoid}.card img{width:100%;height:210px;object-fit:cover;margin-top:20px}.light{height:150px;display:grid;place-items:center;background:#e9eddf;margin:20px 0;border:1px solid #d5dcc6;transform:rotate(-2deg)}.light svg{width:100%;height:100%}blockquote{margin:20px 0;font-family:serif;font-size:23px;overflow-wrap:anywhere}.ending{background:#173f37;color:#f4efe5;padding:36px}.stamp{display:inline-block;border:3px double #e8aa83;padding:8px 16px;color:#e8aa83}.end-seal{float:right;width:128px;height:128px;margin:0 0 18px 24px}.end-seal svg{width:100%;height:100%}.ending:after{content:"";display:block;clear:both}@media(max-width:560px){main{margin-top:30px}.cover-scene{float:none;width:100%;height:115px;margin:0 0 22px}.grid{display:block}.card{margin:22px 0;padding:24px}.card small{font-size:11px}blockquote{font-size:25px}.ending{padding:26px}.end-seal{width:90px;height:90px;margin-left:12px}}footer{font-size:12px;margin:30px 0;color:#576e5f}@media print{main{margin:0;max-width:none}.ending{background:transparent;color:#173f37;border:1px solid}.grid{display:block}.card{margin:20px 0}.stamp{color:#173f37}}</style></head><body><main><header><div class="cover-scene">${scene(4)}</div><small>下一条支线 / VOL.001 / 我的冒险小册子</small><h1>被复制的星期三</h1><p>这一版，只有${e(state.alias || '我')}见过。</p><small>${e((state.finishedAt || '').slice(0, 10))} · 三处小小的不同，一份我的原件</small></header><div class="grid">${cards}</div><section class="ending"><div class="end-seal">${sealArt(state.destination)}</div><small>我的结局</small><h2>${e(ending.title)}</h2>${ending.paragraphs.map(p => `<p>${e(p)}</p>`).join('')}<span class="stamp">${e(ending.stamp)}</span></section><footer>这是一个原创虚构故事和你自己记录的观察。此文件包含你主动保存的文字与可选照片，可离线打开，请自行选择分享对象。<br>下一条支线 · 为容易被忽略的小事，留一个位置。</footer></main></body></html>`;
}

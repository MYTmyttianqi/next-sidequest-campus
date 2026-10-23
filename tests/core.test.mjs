import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHOICES, FIELDS, LIMITS, createFreshState, normaliseState,
  validateStep, isComplete, getActCopy, getEnding, makeBookHtml,
  escapeHtml, safePhoto, charLength,
} from '../dist/core.js';

const fresh = () => createFreshState();
const filled = () => ({
  ...fresh(), alias: '小林', detail: '窗边像逗号的光', second: '书页也卷了一角',
  now: '什么都没有改变，但我记住了它们', lens: 'echo', thread: 'connect',
  destination: 'today', unlocked: 4, cursor: 4, completed: true,
  startedAt: '2026-10-23T07:00:00.000Z', finishedAt: '2026-10-23T07:08:00.000Z',
});

test('eight choice routes complete, survive JSON reload, and yield distinct booklets', () => {
  const books = new Set();
  for (const lens of CHOICES.lens) for (const thread of CHOICES.thread) for (const destination of CHOICES.destination) {
    const state = { ...filled(), lens: lens.value, thread: thread.value, destination: destination.value };
    for (let step = 1; step <= 3; step++) assert.equal(validateStep(state, step), '');
    const restored = normaliseState(JSON.parse(JSON.stringify(state)));
    assert.deepEqual(restored, state);
    assert.equal(isComplete(restored), true);
    assert.equal(getEnding(restored).id, destination.value === 'today' ? 'signed-today' : 'unwritten-tomorrow');
    assert.match(getActCopy(restored, 2).join(''), lens.value === 'echo' ? /相像/ : /不同/);
    const book = makeBookHtml(restored);
    for (const field of FIELDS) assert.ok(book.includes(escapeHtml(restored[field])));
    books.add(book);
  }
  assert.equal(books.size, 8);
});

test('each partial act keeps draft text and selected choice after reload', () => {
  for (let step = 1; step <= 3; step++) {
    const state = { ...filled(), cursor: step, unlocked: step, completed: false, finishedAt: '' };
    for (let future = step; future < 3; future++) { state[FIELDS[future]] = ''; state[['lens','thread','destination'][future]] = ''; }
    const restored = normaliseState(JSON.parse(JSON.stringify(state)));
    assert.equal(restored.cursor, step);
    assert.equal(restored.unlocked, step);
    assert.equal(isComplete(restored), false);
    assert.equal(restored[FIELDS[step - 1]], state[FIELDS[step - 1]]);
  }
});

test('missing, incompatible, and malformed states normalise without throwing', () => {
  for (const invalid of [null, undefined, true, 7, 'bad', [], {}, { version: 2 }]) assert.deepEqual(normaliseState(invalid), fresh());
  const damaged = normaliseState({ version: 1, alias: 99, detail: {}, second: null, now: [],
    lens: 'injected', thread: 'bad', destination: '__proto__', cursor: 99, unlocked: 99,
    completed: true, photos: ['javascript:alert(1)', 'data:image/svg+xml,<svg/>', null],
    startedAt: 'not a date', finishedAt: false });
  assert.equal(damaged.completed, false);
  assert.equal(damaged.cursor, 1);
  assert.equal(damaged.unlocked, 1);
  assert.deepEqual(damaged.photos, ['', '', '']);
  assert.equal(damaged.startedAt, '');
  assert.equal(damaged.finishedAt, '');
});

test('inconsistent saved progress returns to the first incomplete act without losing future drafts', () => {
  const damaged = { ...filled(), detail: '', cursor: 4 };
  const restored = normaliseState(damaged);
  assert.equal(restored.completed, false);
  assert.equal(restored.cursor, 1);
  assert.equal(restored.unlocked, 1);
  assert.equal(restored.second, damaged.second);
  assert.equal(restored.now, damaged.now);
});

test('all incomplete and invalid states refuse export', () => {
  assert.throws(() => makeBookHtml(fresh()), /先完成三幕/);
  assert.throws(() => makeBookHtml({ ...filled(), completed: false }), /先完成三幕/);
  for (const field of FIELDS) {
    for (const bad of ['', ' ', '字', 'a'.repeat(LIMITS[field] + 1)]) {
      const state = { ...filled(), [field]: bad };
      assert.equal(isComplete(state), false);
      assert.throws(() => makeBookHtml(state), /先完成三幕/);
    }
  }
  for (const key of Object.keys(CHOICES)) {
    const state = { ...filled(), [key]: '' };
    assert.equal(isComplete(state), false);
    assert.throws(() => makeBookHtml(state), /先完成三幕/);
  }
});

test('Unicode input limits count code points and survive reload', () => {
  const state = { ...filled(), alias: '😀'.repeat(20), detail: '😀'.repeat(50), second: '字'.repeat(50), now: '好'.repeat(80) };
  const restored = normaliseState(state);
  for (const field of ['alias', ...FIELDS]) assert.equal(charLength(restored[field]), LIMITS[field]);
  assert.ok(!restored.detail.includes('\uFFFD'));
});

test('user HTML is escaped in booklet and photo URL cannot break its attribute', () => {
  const state = { ...filled(), alias: '</title><x>', detail: '<img src=x onerror=alert(1)>',
    second: '</textarea><script>x</script>', now: '&<\"\'>' };
  const book = makeBookHtml(state);
  for (const field of ['alias', ...FIELDS]) assert.ok(book.includes(escapeHtml(state[field])));
  assert.equal(book.includes('<script>'), false);
  assert.equal(book.includes('<img src=x'), false);
  assert.equal(book.includes('</textarea>'), false);
  assert.equal(escapeHtml('&<>\"\''), '&amp;&lt;&gt;&quot;&#39;');
  assert.match(book, /default-src 'none'/);
  for (const unsafe of [null, {}, 'javascript:alert(1)', 'data:image/png;base64,AA==',
    'data:image/jpeg;base64,AA==\" onerror=\"alert(1)', 'data:image/jpeg;base64,' + 'A'.repeat(700000)]) assert.equal(safePhoto(unsafe), '');
  assert.equal(safePhoto('data:image/jpeg;base64,AA=='), 'data:image/jpeg;base64,AA==');
});

test('generated booklet is self-contained, contains all notes and optional JPEG photos', () => {
  const state = { ...filled(), photos: ['data:image/jpeg;base64,AA==', '', 'data:image/jpeg;base64,QQ=='] };
  const book = makeBookHtml(normaliseState(state));
  assert.equal((book.match(/<section class="card">/g) || []).length, 3);
  assert.equal((book.match(/<img src="data:image\/jpeg/g) || []).length, 2);
  assert.equal(/<(?:script|link)\b/.test(book), false);
  assert.equal(/(?:src|href)="https?:/i.test(book), false);
  assert.match(book, /可离线打开/);
});

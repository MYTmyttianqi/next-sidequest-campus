/*
 * Next Sidequest — original paper illustrations and decorative SVG helpers.
 * Scenes, compass rose and seals are original project artwork.
 *
 * The seven UI icon paths are adapted without geometry changes from Tabler
 * Icons, assets/vendor/tabler/*.svg. Their license follows:
 *
 * MIT License
 * Copyright (c) 2020-2026 Paweł Kuna
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const INK = '#183f36';
const VERMILION = '#d9613c';
const PAPER = '#f4efe5';
const SAGE = '#e3e8d8';

export const TABLER_LICENSE = `MIT License

Copyright (c) 2020-2026 Paweł Kuna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

const ICON_PATHS = Object.freeze({
  "book": "<path d=\"M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18\" />\n  <path d=\"M13 8l2 0\" />\n  <path d=\"M13 12l2 0\" />",
  "camera": "<path d=\"M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2\" />\n  <path d=\"M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" />",
  "compass": "<path d=\"M8 16l2 -6l6 -2l-2 6l-6 2\" />\n  <path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" />\n  <path d=\"M12 3l0 2\" />\n  <path d=\"M12 19l0 2\" />\n  <path d=\"M3 12l2 0\" />\n  <path d=\"M19 12l2 0\" />",
  "mail": "<path d=\"M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10\" />\n  <path d=\"M3 7l9 6l9 -6\" />",
  "sun": "<path d=\"M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0\" />\n  <path d=\"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7\" />",
  "route": "<path d=\"M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\" />\n  <path d=\"M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4\" />\n  <path d=\"M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5\" />",
  "download": "<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\" />\n  <path d=\"M7 11l5 5l5 -5\" />\n  <path d=\"M12 4l0 12\" />"
});

/** A decorative Tabler icon; unknown names safely use the book icon. */
export function icon(name) {
  const paths = Object.hasOwn(ICON_PATHS, name) ? ICON_PATHS[name] : ICON_PATHS.book;
  return `<svg class="art-icon ui-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><!-- Tabler Icons, Copyright (c) 2020-2026 Paweł Kuna, MIT. License included in art.js and assets/vendor/tabler/LICENSE. -->${paths}</svg>`;
}

function sprig(x, y, rotate = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate})" stroke="${INK}" stroke-width="1.1"><path d="M0 0c5-14 5-26 2-39"/><path d="M2-10C-9-9-11-17-10-21 0-23 4-17 2-10Z" fill="${SAGE}"/><path d="M4-21c11 0 14-8 12-12-9-1-14 6-12 12Z" fill="${SAGE}"/><path d="M3-30c-9 1-13-5-12-10 8-2 13 3 12 10Z" fill="${SAGE}"/></g>`;
}

function ticks(x, y, color = VERMILION) {
  return `<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.5"><path d="M0-8v-6M6-6l5-5M8 0h6"/></g>`;
}

function paperBase() {
  return `<path d="M32 133h355" stroke="${INK}" stroke-opacity=".16"/><path d="M41 137h68m211 0h56" stroke="${INK}" stroke-opacity=".08"/>`;
}

function letterScene() {
  return `${paperBase()}<g transform="rotate(-5 191 77)"><path d="M88 31h201v91H88z" fill="${SAGE}" stroke="none" transform="translate(3 4)"/><path d="M88 31h201v91H88z" fill="${PAPER}" stroke="${INK}" stroke-opacity=".65"/><path d="M102 44h98m-98 8h73" stroke="${INK}" stroke-opacity=".18"/><path d="M211 41v68" stroke="${INK}" stroke-opacity=".2"/><path d="M105 72c13-3 17 4 30 0s18 3 29-1m-59 13c19-2 23 3 43-1m-43 14h62" stroke="${INK}" stroke-opacity=".65"/><g transform="translate(261 58) rotate(12)"><path d="M-13-15h26v32h-26z" fill="${SAGE}" stroke="${INK}" stroke-dasharray="1 3"/><path d="M-8 11V-3l8-6 8 6v14M-4 11V3h8v8" stroke="${INK}" stroke-width="1"/><path d="M-8-3H8" stroke="${INK}" stroke-width="1"/></g><g transform="translate(233 91) rotate(-12)"><circle r="22" stroke="${VERMILION}" stroke-width="1.4"/><circle r="17" stroke="${VERMILION}" stroke-width=".7"/><path d="M-29-5h-20m20 6h-24m24 6h-20" stroke="${VERMILION}" stroke-opacity=".7"/><text y="3" text-anchor="middle" font-family="monospace" font-size="7" fill="${VERMILION}" stroke="none">WED. 001</text></g></g><g transform="rotate(8 76 107)"><path d="M31 85h87v46H31z" fill="${SAGE}" stroke="${INK}" stroke-width="1.1"/><path d="m31 85 44 28 43-28m-87 46 30-26m57 26-30-26" stroke="${INK}" stroke-width="1.1"/><circle cx="75" cy="108" r="7" fill="${VERMILION}" stroke="none"/><path d="m72 108 2 2 4-5" stroke="${PAPER}" stroke-width="1"/></g><path d="m171 26 2-10 46 1-1 10" fill="${SAGE}" fill-opacity=".85" stroke="none"/>${sprig(337, 127, 26)}${ticks(307, 46)}<text x="350" y="43" font-family="monospace" font-size="7" letter-spacing="1.5" fill="${INK}" fill-opacity=".45" stroke="none">TO YOU</text>`;
}

function observationScene() {
  return `${paperBase()}<path d="m140 48 179 57-54 28-141-14Z" fill="${SAGE}" fill-opacity=".8" stroke="none"/><path d="m127 31 162 62-56 27-122-34Z" fill="${VERMILION}" fill-opacity=".08" stroke="none"/><g transform="rotate(-3 111 68)"><path d="M67 18h93v104H67z" fill="${SAGE}" stroke="${INK}"/><path d="M74 25h79v89H74z" fill="${PAPER}" stroke="${INK}" stroke-opacity=".5"/><path d="M112 25v89M74 69h79M60 122h109" stroke="${INK}"/><path d="m89 39 8-7m-9 13 15-13" stroke="${INK}" stroke-opacity=".25"/><path d="M143 40a13 13 0 0 0-19-3" stroke="${VERMILION}" stroke-width="1.5"/><path d="m138 35 6 5-1-8" stroke="${VERMILION}"/></g><g transform="rotate(7 252 80)"><path d="M202 32h105v98H202z" fill="${SAGE}" stroke="none" transform="translate(3 4)"/><path d="M202 32h105v98H202z" fill="${PAPER}" stroke="${INK}"/><path d="M211 42h87v60h-87z" fill="${SAGE}" stroke="${INK}" stroke-opacity=".5"/><path d="M237 43v59m-26-30h87" stroke="${PAPER}" stroke-width="3"/><path d="m216 95 56-47 20 1-56 48Z" fill="${PAPER}" stroke="none"/><circle cx="276" cy="62" r="7" fill="${VERMILION}" fill-opacity=".65" stroke="none"/><path d="M218 114h50m7 0h12" stroke="${INK}" stroke-opacity=".35"/><path d="M196 43v7m0 7v7m0 7v7m0 7v7m0 7v7M313 43v7m0 7v7m0 7v7m0 7v7m0 7v7" stroke="${INK}" stroke-width="2" stroke-opacity=".45"/></g>${sprig(344, 126, -12)}<g stroke="${VERMILION}" stroke-width="1.4"><circle cx="354" cy="41" r="8"/><path d="M354 27v-4m10 8 3-3m1 13h4m-8 10 3 3m-13 1v4m-10-8-3 3m-1-13h-4m8-10-3-3"/></g><text x="180" y="17" font-family="monospace" font-size="7" letter-spacing="1.6" fill="${INK}" fill-opacity=".45" stroke="none">NOTICE THE LIGHT</text>`;
}

function connectionScene(state) {
  const leavingSpace = state?.thread === 'leave_space';
  const middle = leavingSpace
    ? `<path d="M177 65h67v45h-67z" fill="${PAPER}" stroke="${VERMILION}" stroke-dasharray="4 5"/><path d="M184 58h50" stroke="${VERMILION}" stroke-opacity=".3"/><text x="210" y="91" text-anchor="middle" font-family="monospace" font-size="8" letter-spacing="2" fill="${VERMILION}" stroke="none">SPACE</text>`
    : `<path d="M134 87c33 42 63-61 98-17s49-11 66-9" stroke="${VERMILION}" stroke-width="2"/><circle cx="134" cy="87" r="4" fill="${PAPER}" stroke="${VERMILION}"/><circle cx="298" cy="61" r="4" fill="${PAPER}" stroke="${VERMILION}"/><path d="m203 88 6-8 4 9" stroke="${VERMILION}" stroke-width="1.3"/>`;
  return `${paperBase()}<g transform="rotate(-8 112 73)"><path d="M61 24h98v104H61z" fill="${SAGE}" stroke="none" transform="translate(3 3)"/><path d="M61 24h98v104H61z" fill="${PAPER}" stroke="${INK}"/><path d="M70 34h80v63H70z" fill="${SAGE}" stroke="${INK}" stroke-opacity=".4"/><path d="M94 96c-3-21-1-37 7-52m-6 26c-12-1-16-10-15-14 13-2 17 7 15 14Zm2-10c13-1 16-10 13-15-11 0-14 7-13 15Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/><path d="M74 110h29m5 0h17" stroke="${INK}" stroke-opacity=".35"/><path d="M95 20v15a5 5 0 0 0 10 0V19a3 3 0 0 0-6 0v14" stroke="${INK}" stroke-width="1.2"/></g><g transform="rotate(7 304 75)"><path d="M259 25h99v104h-99z" fill="${SAGE}" stroke="none" transform="translate(3 3)"/><path d="M259 25h99v104h-99z" fill="${PAPER}" stroke="${INK}"/><path d="M268 35h81v63h-81z" fill="${SAGE}" stroke="${INK}" stroke-opacity=".4"/><path d="M275 87c24-22 41-15 66-38m-66 43c26-7 48-11 66-2" stroke="${INK}" stroke-width="1.2"/><circle cx="323" cy="51" r="6" fill="${VERMILION}" fill-opacity=".7" stroke="none"/><path d="M274 112h28m6 0h20" stroke="${INK}" stroke-opacity=".35"/><path d="m288 20 38 2-1 11-38-2Z" fill="${SAGE}" stroke="none"/></g>${middle}${ticks(371, 69)}<path d="m38 53-4-6m2 19h-8m10 8-5 5" stroke="${INK}" stroke-opacity=".4"/><text x="176" y="23" font-family="monospace" font-size="7" letter-spacing="1.4" fill="${INK}" fill-opacity=".45" stroke="none">TWO SMALL THINGS</text>`;
}

function letterToTomorrowScene() {
  return `${paperBase()}<g transform="rotate(-5 267 80)"><path d="m202 67 66-48 68 48v64H202Z" fill="${SAGE}" stroke="${INK}"/><path d="m211 28 109 3-3 87-109-4Z" fill="${PAPER}" stroke="${INK}"/><path d="m222 44 72 2m-72 11 62 2m-62 10 70 2m-71 11 47 1" stroke="${INK}" stroke-opacity=".35"/><path d="m202 67 66 39 68-39v64H202Z" fill="${PAPER}" stroke="${INK}"/><path d="m202 131 47-40m87 40-47-40" stroke="${INK}"/><path d="m239 119 36 1" stroke="${VERMILION}" stroke-width="1.5"/><g transform="translate(310 106) rotate(8)"><circle r="21" stroke="${VERMILION}" stroke-width="1.2"/><circle r="16" stroke="${VERMILION}" stroke-width=".7"/><path d="M-9 0H9m-9-4h18m-18 8H5" stroke="${VERMILION}" stroke-width=".9"/><path d="M24-5h22m-22 6h26m-26 6h20" stroke="${VERMILION}" stroke-opacity=".6"/></g></g><g transform="rotate(28 137 79)"><path d="M130 24h14v79l-7 19-7-19Z" fill="${SAGE}" stroke="${INK}"/><path d="M130 44h14M134 24v79m6-79v79m-10 0h14m-7 0v12" stroke="${INK}" stroke-width=".9"/><path d="M130 24v-7a7 7 0 0 1 14 0v7Z" fill="${INK}"/><path d="m130 103 7 19 7-19" fill="${PAPER}" stroke="${INK}"/><path d="m135 116 2 6 2-6" fill="${INK}" stroke="none"/></g><path d="M66 119c22-11 40-7 46-2 8 6-7 15-15 11-5-3 6-6 17-3m8 1h23" stroke="${VERMILION}" stroke-width="1.3"/>${sprig(361, 130, 24)}${ticks(183, 39)}<text x="44" y="31" font-family="monospace" font-size="7" letter-spacing="1.4" fill="${INK}" fill-opacity=".45" stroke="none">THE NEXT PAGE</text>`;
}

function bookletScene() {
  return `${paperBase()}<g transform="rotate(-7 148 78)"><path d="m52 33 62-11 64 10 63-11v101l-63 11-64-10-62 11Z" fill="${PAPER}" stroke="${INK}"/><path d="m114 22 64 10v101l-64-10Z" fill="${SAGE}" stroke="none"/><path d="M114 23v100m64-91v100" stroke="${INK}" stroke-opacity=".25"/><path d="m65 65 162-6m-158 46 159-10M93 30l-5 95m64-97 2 98m47-100-2 101" stroke="${INK}" stroke-opacity=".18" stroke-width="5"/><path d="M77 104c-7-38 54 7 65-25s26-7 43-27 27 1 34-9" stroke="${VERMILION}" stroke-width="1.9" stroke-dasharray="3 5"/><g fill="${PAPER}" stroke="${VERMILION}" stroke-width="1.6"><circle cx="77" cy="104" r="7"/><circle cx="142" cy="79" r="7"/><circle cx="219" cy="43" r="7"/></g><g fill="${VERMILION}" stroke="none"><circle cx="77" cy="104" r="2"/><circle cx="142" cy="79" r="2"/><circle cx="219" cy="43" r="2"/></g><path d="M66 42h15v15H66zM185 93h15v19h-15z" fill="${SAGE}" stroke="${INK}" stroke-width="1"/></g><g transform="rotate(8 294 76)"><path d="M248 20h90a4 4 0 0 1 4 4v109h-94Z" fill="${SAGE}" stroke="none" transform="translate(4 2)"/><path d="M248 17h90a4 4 0 0 1 4 4v109h-94Z" fill="${INK}" stroke="${INK}"/><path d="M257 17v113M263 25h70v94h-70z" stroke="${PAPER}" stroke-opacity=".3" stroke-width=".8"/><path d="M277 49h43m-43 9h30" stroke="${PAPER}" stroke-opacity=".75"/><path d="M278 96c0-32 24 2 24-19s18-4 18-12" stroke="${VERMILION}" stroke-width="1.8"/><g fill="${PAPER}" stroke="none"><circle cx="278" cy="96" r="3"/><circle cx="302" cy="78" r="3"/><circle cx="320" cy="65" r="3"/></g><text x="299" y="40" text-anchor="middle" font-family="monospace" font-size="6" letter-spacing="1.5" fill="${PAPER}" stroke="none">MY ORIGINAL</text><path d="m326 17-1 17 5-4 4 4V17" fill="${VERMILION}" stroke="none"/></g>${sprig(365, 129, 17)}${ticks(355, 37)}<text x="36" y="18" font-family="monospace" font-size="7" letter-spacing="1.3" fill="${INK}" fill-opacity=".45" stroke="none">THREE STOPS / ONE STORY</text>`;
}

/** Original story strip. All state-dependent branches choose fixed artwork only. */
export function scene(step, state = {}) {
  const number = Number.isInteger(step) && step >= 0 && step <= 4 ? step : 0;
  const artwork = number === 0 ? letterScene() : number === 1 ? observationScene() : number === 2 ? connectionScene(state) : number === 3 ? letterToTomorrowScene() : bookletScene();
  return `<svg class="scene-art scene-art--${number}" xmlns="http://www.w3.org/2000/svg" width="420" height="150" viewBox="0 0 420 150" fill="none" stroke="${INK}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${artwork}</svg>`;
}

/** A compact, original eight-point compass. */
export function compassRose() {
  return `<svg class="compass-art" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="22" stroke-opacity=".25" stroke-width=".8"/><circle cx="32" cy="32" r="16" stroke-opacity=".15" stroke-width=".8"/><path d="M32 4v7m0 42v7M4 32h7m42 0h7" stroke-width="1.2"/><path d="m16 16 5 5m22 22 5 5m0-32-5 5M21 43l-5 5" stroke-width=".8" stroke-opacity=".45"/><path d="m32 12 5 15 15 5-15 5-5 15-5-15-15-5 15-5Z" fill="${PAPER}" stroke-width="1"/><path d="m32 12 5 15-5 5-5-5Z" fill="${VERMILION}" stroke="${VERMILION}" stroke-width=".8"/><path d="m32 32 5 5-5 15Z" fill="${INK}" stroke-width=".8"/><path d="M12 32h40M32 12v40" stroke-opacity=".2" stroke-width=".8"/><circle cx="32" cy="32" r="2.5" fill="${PAPER}" stroke="${VERMILION}" stroke-width="1.2"/></svg>`;
}

/** Decorative ending art. The readable ending title/stamp belongs in the UI. */
export function sealArt(destination = 'today') {
  const tomorrow = destination === 'tomorrow';
  const artwork = tomorrow
    ? `<g transform="rotate(-7 80 83)"><path d="m27 71 51-39 53 39v60H27Z" fill="${SAGE}" stroke="${VERMILION}" stroke-width="1.7"/><path d="M38 30h81v81H38Z" fill="${PAPER}" stroke="${VERMILION}" stroke-width="1.3"/><path d="M49 46h54m-54 10h45m-45 10h50" stroke="${VERMILION}" stroke-opacity=".5" stroke-width="1"/><path d="m27 71 51 31 53-31v60H27Z" fill="${PAPER}" stroke="${VERMILION}" stroke-width="1.7"/><path d="m27 131 37-38m67 38-39-38" stroke="${VERMILION}" stroke-width="1.3"/><path d="m63 119 31 1" stroke="${VERMILION}" stroke-width="1.2"/></g><g transform="translate(121 47) rotate(12)" stroke="${VERMILION}"><circle r="22" stroke-width="1.6"/><circle r="17" stroke-width=".8" stroke-dasharray="2 3"/><path d="M-9-4H9m-18 5h18m-18 5H5" stroke-width="1.1"/></g><path d="M20 37v-6m-9 11-5-3m19 104h16" stroke="${VERMILION}" stroke-width="1.2"/>`
    : `<g stroke="${VERMILION}"><circle cx="80" cy="80" r="61" stroke-width="2"/><circle cx="80" cy="80" r="55" stroke-width=".8"/><circle cx="80" cy="80" r="48" stroke-width=".8" stroke-dasharray="1 5"/><path d="M42 63h76m-76 34h76" stroke-width="1" stroke-opacity=".6"/><path d="m58 81 14 11 32-31" stroke-width="3.1"/><path d="m80 32 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="${VERMILION}" stroke-width=".8"/><path d="M66 111h28m-22 6h16" stroke-width="1.2"/><circle cx="35" cy="80" r="2" fill="${VERMILION}" stroke="none"/><circle cx="125" cy="80" r="2" fill="${VERMILION}" stroke="none"/><path d="M25 51c-6 10-9 20-9 30m121 25c6-11 8-21 7-31" stroke-width=".8" stroke-opacity=".4"/></g>`;
  return `<svg class="seal-art seal-art--${tomorrow ? 'tomorrow' : 'today'}" xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${artwork}</svg>`;
}

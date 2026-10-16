// What is wrong with a screen, looked at in a real browser. `inspect` is sent to the page (it must not use anything outside itself)
// and looks at everything inside a scope:
//   broken       "undefined", "NaN", "[object Object]" or "Infinity" in the words on screen
//   overflow     text that spills out of its box, text cut off by a box that hides what does not fit, and anything that makes
//                the page wider than the screen (a row that scrolls on purpose is not one)
//   unreadable   text (or a field's value) whose colour is nearly the colour behind it; weaker contrast is counted as "low"
//   hidden       text clipped away entirely by a box that hides its overflow
// With opts.stress the words are made longer first, the way German or Vietnamese text runs longer than English (about 40%), to
// see which screens would break with a translation.
export function inspect(scopeSel, opts) {
  const pick = (sel) =>
    sel && sel.startsWith('last:')
      ? [...document.querySelectorAll(sel.slice(5))].pop()
      : sel && document.querySelector(sel);
  const scope = pick(scopeSel) || document.body;
  const out = { broken: [], overflow: [], unreadable: [], low: 0, hidden: [], wide: false, checked: 0 };
  const label = (el) => {
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    const tx = (el.innerText || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 28);
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${tx ? ' “' + tx + '”' : ''}`;
  };
  if (opts && opts.map) {
    // a language file's words put in place of the English ones (exact matches; a text with a number in it is left as it is)
    const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode,
        t = n.data.trim();
      if (t && Object.prototype.hasOwnProperty.call(opts.map, t)) n.data = n.data.replace(t, opts.map[t]);
    }
    for (const el of scope.querySelectorAll('[placeholder],[title]'))
      for (const a of ['placeholder', 'title']) {
        const v = el.getAttribute(a);
        if (v && Object.prototype.hasOwnProperty.call(opts.map, v)) el.setAttribute(a, opts.map[v]);
      }
  }
  if (opts && opts.stress) {
    const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) {
      if (n.parentElement && /^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentElement.tagName)) continue;
      n.data = n.data.replace(/[A-Za-zÀ-ÿ]{3,}/g, (m) => m + m.slice(0, Math.ceil(m.length * 0.4)).toLowerCase());
    }
  }
  const text = scope.innerText || '';
  out.text = text.length;
  if (!(opts && (opts.stress || opts.map))) {
    const BROKEN = /\bundefined\b|\bNaN\b|\[object |\bInfinity\b/;
    const m = text.match(BROKEN);
    if (m) {
      const at = text.indexOf(m[0]);
      out.broken.push(`“${m[0]}” in …${text.slice(Math.max(0, at - 30), at + 20).replace(/\s+/g, ' ')}…`);
    }
  }
  // colours: any CSS colour to [r, g, b, a] through a canvas
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const memo = new Map();
  const rgba = (c) => {
    if (memo.has(c)) return memo.get(c);
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#000';
    cx.fillStyle = c;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    // (a transparent colour reads back as 0,0,0,0 whatever it was: take its alpha from the string)
    const v = [d[0], d[1], d[2], d[3] / 255];
    memo.set(c, v);
    return v;
  };
  const over = (top, bot) => {
    const a = top[3] + bot[3] * (1 - top[3]);
    if (!a) return [0, 0, 0, 0];
    return [0, 1, 2].map((i) => (top[i] * top[3] + bot[i] * bot[3] * (1 - top[3])) / a).concat([a]);
  };
  const lum = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  // what is behind an element: null when a gradient or picture is (the colour is not known)
  const backdrop = (el) => {
    let acc = [0, 0, 0, 0];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      acc = over(acc, rgba(cs.backgroundColor));
      if (acc[3] >= 0.999) return acc;
    }
    return over(acc, [255, 255, 255, 1]);
  };
  const opacityOf = (el) => {
    let o = 1;
    for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
    return o;
  };
  const scroller = (el) => {
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (/(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 1) return e;
    }
    return null;
  };
  const seen = new Set();
  const add = (list, key, msg) => {
    if (seen.has(key) || list.length >= 8) return;
    seen.add(key);
    list.push(msg);
  };
  const vw = document.documentElement.clientWidth;
  const els = scope.querySelectorAll('*');
  for (const el of els) {
    const tag = el.tagName;
    if (/^(SCRIPT|STYLE|SVG|PATH|CIRCLE|RECT|LINE|G|DEFS|TEXT|TSPAN|CANVAS|OPTION|BR)$/i.test(tag)) continue;
    const field =
      /^(INPUT|TEXTAREA|SELECT)$/.test(tag) &&
      el.type !== 'hidden' &&
      el.type !== 'checkbox' &&
      el.type !== 'radio' &&
      el.type !== 'range';
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.data.trim()).map((n) => n.data.trim());
    if (!field && !own.length) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const op = opacityOf(el);
    if (op < 0.05) continue;
    out.checked++;
    // --- colour against what is behind it
    const fg = rgba(
      cs.webkitTextFillColor && cs.webkitTextFillColor !== 'rgba(0, 0, 0, 0)' ? cs.webkitTextFillColor : cs.color,
    );
    const shown = field ? (el.value || '').length > 0 || el.tagName === 'SELECT' : true;
    if (shown) {
      const bg = backdrop(el);
      if (bg) {
        const f = over([fg[0], fg[1], fg[2], fg[3] * op], bg);
        const l1 = lum(f),
          l2 = lum(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (ratio < 1.6)
          add(
            out.unreadable,
            'u' + label(el),
            `${label(el)} (contrast ${ratio.toFixed(2)}:1, colour ${cs.color} on ${bg.slice(0, 3).map(Math.round).join(',')})`,
          );
        else if (ratio < 3) out.low++;
      }
    }
    // --- spilling out of its own box
    if (cs.display !== 'inline' && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1 && own.length) {
      const ox = cs.overflowX;
      if (ox === 'visible') {
        if (!scroller(el))
          add(
            out.overflow,
            'o' + label(el),
            `${label(el)} spills out of its box (${el.scrollWidth}px of text in ${el.clientWidth}px)`,
          );
      } else if ((ox === 'hidden' || ox === 'clip') && cs.textOverflow !== 'ellipsis') {
        add(
          out.overflow,
          'c' + label(el),
          `${label(el)} is cut off (${el.scrollWidth}px of text in ${el.clientWidth}px, nothing shows it is cut)`,
        );
      }
    }
    // --- out past the screen's edge, or clipped away by a parent
    if (own.length && !scroller(el)) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const tr = range.getBoundingClientRect();
      if (tr.width > 0) {
        // what can be seen of the text: cut to the boxes around it that hide what does not fit (an ellipsis hides on purpose)
        let left = tr.left,
          right = tr.right;
        for (let a = el; a && a !== document.body; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (acs.overflowX === 'hidden' || acs.overflowX === 'clip') {
            const ar = a.getBoundingClientRect();
            if (a !== el && ar.width && (tr.left >= ar.right - 0.5 || tr.right <= ar.left + 0.5)) {
              add(out.hidden, 'h' + label(el), `${label(el)} is clipped away by ${label(a)}`);
              break;
            }
            left = Math.max(left, ar.left);
            right = Math.min(right, ar.right);
          }
        }
        if (right > vw + 1 || left < -1)
          add(out.overflow, 'w' + label(el), `${label(el)} is past the edge of the screen`);
      }
    }
  }
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1 || document.body.scrollWidth > de.clientWidth + 1) {
    out.wide = true;
    out.overflow.unshift(
      `the page is wider than the screen (${Math.max(de.scrollWidth, document.body.scrollWidth)}px in ${de.clientWidth}px)`,
    );
  }
  return out;
}

// A one-line verdict per kind, for the crawler's report
export const problemsOf = (r) => [
  ...r.broken.map((t) => `shows ${t}`),
  ...r.overflow,
  ...r.unreadable.map((t) => `unreadable: ${t}`),
  ...r.hidden,
];

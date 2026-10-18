// Core utilities + global namespace. No build step: every file attaches to window.FM.
(function () {
  const FM = (window.FM = window.FM || {});

  // what text from another person's file may not contain: the characters that open a tag or leave a quoted attribute, and control characters
  // eslint-disable-next-line no-control-regex -- the control characters are the point
  const BAD_TEXT = new RegExp('[<>"\u0000-\u001f\u007f\u2028\u2029]');
  const BAD_TEXT_ALL = new RegExp(BAD_TEXT.source, 'g');

  const U = (FM.U = {
    rand: (a = 0, b = 1) => a + Math.random() * (b - a),
    randi: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    chance: (p) => Math.random() < p,
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    sum: (arr, f = (x) => x) => arr.reduce((s, x) => s + f(x), 0),
    avg: (arr, f = (x) => x) => (arr.length ? U.sum(arr, f) / arr.length : 0),
    gauss(mean = 0, sd = 1) {
      let u = 0,
        v = 0;
      while (!u) u = Math.random();
      while (!v) v = Math.random();
      return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    wpick(arr, wf) {
      const ws = arr.map(wf);
      let t = U.sum(ws) * Math.random();
      for (let i = 0; i < arr.length; i++) {
        t -= ws[i];
        if (t <= 0) return arr[i];
      }
      return arr[arr.length - 1];
    },
    poisson(l) {
      const L = Math.exp(-l);
      let k = 0,
        p = 1;
      do {
        k++;
        p *= Math.random();
      } while (p > L);
      return k - 1;
    },
    // Display currency: amounts are kept in dollars and shown in the club's currency (settings.currency 'auto'),
    // or a chosen one: £ for British clubs, € in the eurozone, $ elsewhere, converted at fixed rates
    currency() {
      const S = FM.S;
      if (!S || !S.user) return FM.U.CURRENCIES.USD;
      let k = (S.settings && S.settings.currency) || 'auto';
      if (k === 'auto') {
        const c = S.user.clubId && S.clubs[S.user.clubId];
        const nat = (c && c.nat) || S.user.nat;
        k = FM.U.CURRENCY_OF[nat] || 'USD';
      }
      return FM.U.CURRENCIES[k] || FM.U.CURRENCIES.USD;
    },
    // Amounts are kept in dollars; a currency is its symbol, its name and its (rough, fixed) rate against the dollar
    CURRENCIES: {
      USD: { sym: '$', rate: 1, name: 'US dollar' },
      EUR: { sym: '€', rate: 0.92, name: 'Euro' },
      GBP: { sym: '£', rate: 0.79, name: 'Pound sterling' },
      JPY: { sym: '¥', rate: 150, name: 'Japanese yen' },
      CNY: { sym: 'CN¥', rate: 7.2, name: 'Chinese yuan' },
      KRW: { sym: '₩', rate: 1350, name: 'South Korean won' },
      INR: { sym: '₹', rate: 83, name: 'Indian rupee' },
      AUD: { sym: 'A$', rate: 1.5, name: 'Australian dollar' },
      CAD: { sym: 'C$', rate: 1.36, name: 'Canadian dollar' },
      CHF: { sym: 'CHF ', rate: 0.88, name: 'Swiss franc' },
      SEK: { sym: 'kr ', rate: 10.5, name: 'Swedish krona' },
      NOK: { sym: 'kr ', rate: 10.7, name: 'Norwegian krone' },
      DKK: { sym: 'kr ', rate: 6.9, name: 'Danish krone' },
      PLN: { sym: 'zł ', rate: 4, name: 'Polish złoty' },
      CZK: { sym: 'Kč ', rate: 23, name: 'Czech koruna' },
      HUF: { sym: 'Ft ', rate: 360, name: 'Hungarian forint' },
      RON: { sym: 'lei ', rate: 4.6, name: 'Romanian leu' },
      TRY: { sym: '₺', rate: 32, name: 'Turkish lira' },
      RUB: { sym: '₽', rate: 92, name: 'Russian rouble' },
      BRL: { sym: 'R$', rate: 5, name: 'Brazilian real' },
      ARS: { sym: 'AR$', rate: 900, name: 'Argentine peso' },
      MXN: { sym: 'MX$', rate: 17, name: 'Mexican peso' },
      COP: { sym: 'COL$', rate: 3900, name: 'Colombian peso' },
      CLP: { sym: 'CL$', rate: 940, name: 'Chilean peso' },
      ZAR: { sym: 'R ', rate: 18.5, name: 'South African rand' },
      NGN: { sym: '₦', rate: 1500, name: 'Nigerian naira' },
      EGP: { sym: 'E£', rate: 48, name: 'Egyptian pound' },
      MAD: { sym: 'MAD ', rate: 10, name: 'Moroccan dirham' },
      SAR: { sym: 'SR ', rate: 3.75, name: 'Saudi riyal' },
      AED: { sym: 'AED ', rate: 3.67, name: 'UAE dirham' },
      QAR: { sym: 'QR ', rate: 3.64, name: 'Qatari riyal' },
      IRR: { sym: 'IRR ', rate: 42000, name: 'Iranian rial' },
      THB: { sym: '฿', rate: 36, name: 'Thai baht' },
      MYR: { sym: 'RM ', rate: 4.7, name: 'Malaysian ringgit' },
      SGD: { sym: 'S$', rate: 1.35, name: 'Singapore dollar' },
      IDR: { sym: 'Rp ', rate: 15800, name: 'Indonesian rupiah' },
      VND: { sym: '₫', rate: 25000, name: 'Vietnamese dong' },
      PHP: { sym: '₱', rate: 57, name: 'Philippine peso' },
    },
    // The currency a nation's clubs use ('auto'); a nation not listed uses the dollar
    CURRENCY_OF: {
      ENG: 'GBP',
      SCO: 'GBP',
      WAL: 'GBP',
      NIR: 'GBP',
      ESP: 'EUR',
      GER: 'EUR',
      FRA: 'EUR',
      ITA: 'EUR',
      POR: 'EUR',
      NED: 'EUR',
      BEL: 'EUR',
      IRL: 'EUR',
      AUT: 'EUR',
      GRE: 'EUR',
      CRO: 'EUR',
      CAT: 'EUR',
      EUS: 'EUR',
      JPN: 'JPY',
      CHN: 'CNY',
      KOR: 'KRW',
      IND: 'INR',
      AUS: 'AUD',
      CAN: 'CAD',
      SUI: 'CHF',
      SWE: 'SEK',
      NOR: 'NOK',
      DEN: 'DKK',
      POL: 'PLN',
      CZE: 'CZK',
      HUN: 'HUF',
      ROU: 'RON',
      TUR: 'TRY',
      RUS: 'RUB',
      BRA: 'BRL',
      ARG: 'ARS',
      MEX: 'MXN',
      COL: 'COP',
      CHI: 'CLP',
      RSA: 'ZAR',
      NGA: 'NGN',
      EGY: 'EGP',
      MAR: 'MAD',
      KSA: 'SAR',
      UAE: 'AED',
      QAT: 'QAR',
      IRN: 'IRR',
      THA: 'THB',
      MYS: 'MYR',
      SGP: 'SGD',
      IDN: 'IDR',
      VIE: 'VND',
      PHI: 'PHP',
    },
    // Money with enough precision to tell $6.35M from $6.4M
    money(v) {
      const s = v < 0 ? '-' : '',
        { sym: $, rate } = FM.U.currency();
      v = Math.abs(v) * rate;
      const trim = (x, d) => {
        const t = x.toFixed(d);
        return t.includes('.') ? t.replace(/\.?0+$/, '') : t;
      };
      if (v >= 1e9) return s + $ + trim(v / 1e9, 2) + 'B';
      if (v >= 1e6) return s + $ + trim(v / 1e6, v >= 1e8 ? 0 : v >= 1e7 ? 1 : 2) + 'M';
      if (v >= 1e3) return s + $ + trim(v / 1e3, v >= 1e5 ? 0 : 1) + 'K';
      return s + $ + Math.round(v);
    },
    // Realistic fee granularity: $1K steps under $100K, $10K under $10M, $50K under $50M, then $100K
    roundMoney(v) {
      const step = v < 1e5 ? 1e3 : v < 1e7 ? 1e4 : v < 5e7 ? 5e4 : 1e5;
      return Math.round(v / step) * step;
    },
    moneyStep(v) {
      return v < 1e5 ? 1e3 : v < 1e6 ? 5e3 : v < 1e7 ? 1e4 : v < 5e7 ? 5e4 : 1e5;
    },
    esc: (s) =>
      String(s ?? '').replace(
        /[&<>"']/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
      ),
    // Markup that escapes what goes into it, so safety is the default: U.html`<b>${name}</b>` escapes name (a pack's club name
    // cannot run code). Markup that is already safe is passed through: U.raw(text), or another U.html result; lists are joined.
    raw: (s) => ({ __html: String(s), toString: () => String(s) }),
    // Text from a file somebody else made (a pack, a backup) is cleaned where it comes in: no < > " or control characters, which
    // is what it takes to open a tag or to leave a quoted attribute. The screens escape too (esc, U.html); this is the second lock.
    clean: (s) => String(s).replace(BAD_TEXT_ALL, ''),
    // Every string in a loaded structure cleaned in place; returns how many were changed. (Walks with a stack: a save is deep.)
    cleanDeep(root) {
      let changed = 0;
      const stack = [root];
      while (stack.length) {
        const o = stack.pop();
        if (!o || typeof o !== 'object') continue;
        for (const k of Object.keys(o)) {
          const v = o[k];
          if (typeof v === 'string') {
            if (BAD_TEXT.test(v)) {
              o[k] = U.clean(v);
              changed++;
            }
          } else if (v && typeof v === 'object') stack.push(v);
        }
      }
      return changed;
    },
    htmlVal(v) {
      return v && v.__html !== undefined ? v.__html : Array.isArray(v) ? v.map((x) => U.htmlVal(x)).join('') : U.esc(v);
    },
    html(strings, ...vals) {
      return U.raw(strings.reduce((out, s, i) => out + s + (i < vals.length ? U.htmlVal(vals[i]) : ''), ''));
    },
    ordinal(n) {
      const s = ['th', 'st', 'nd', 'rd'],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    },
    // Reputations and staff abilities are numbers inside the game; players see them as stars like everything else.
    // A reputation of about 30 is half a star, 95 is five; staff abilities run 1-20.
    repStars: (rep) => Math.min(5, Math.max(0.5, Math.round((0.5 + ((rep - 30) / 65) * 4.5) * 2) / 2)),
    repText(rep) {
      return `${U.repStars(rep)}★`;
    },
    staffText: (v) => `${Math.min(5, Math.max(0.5, Math.round((v / 4) * 2) / 2))}★`,
    // "1 pt", "3 pts"
    pts: (n) => `${n} pt${Math.abs(n) === 1 ? '' : 's'}`,
    hash(str) {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
      return h >>> 0;
    },
    // Contrast-aware text colour for a background hex
    ink(hex) {
      const c = hex.replace('#', '');
      const r = parseInt(c.substr(0, 2), 16),
        g = parseInt(c.substr(2, 2), 16),
        b = parseInt(c.substr(4, 2), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0b0f14' : '#ffffff';
    },
    // A banner colour white text can sit on: a light kit colour (white, gold, sky blue) is darkened toward navy,
    // keeping its hue, until white text reads clearly on it; dark colours are left as they are
    heroShade(hex) {
      const c = String(hex || '#1b2533').replace('#', '');
      if (c.length < 6) return hex;
      const v = [0, 2, 4].map((i) => parseInt(c.substr(i, 2), 16));
      const lum = (v[0] * 299 + v[1] * 587 + v[2] * 114) / 1000;
      if (lum <= 120) return hex;
      const f = Math.min(0.75, (lum - 110) / (lum - 14)); // share of navy mixed in
      const n = [14, 23, 38];
      return (
        '#' +
        v
          .map((x, i) =>
            Math.round(x * (1 - f) + n[i] * f)
              .toString(16)
              .padStart(2, '0'),
          )
          .join('')
      );
    },
    // Grammar helpers
    // 1 point, 2 points; a plural that is not word + s is the third argument: plural(2, 'match', 'matches')
    plural: (n, w, pl) => `${n} ${+n === 1 ? w : (pl ?? w + 's')}`,
    // "a" or "an" with the word: an attacking midfielder, an ST (said "ess-tee"), a CB, an hour, a university
    a: (w) => {
      const s = String(w).trim();
      const first = s.replace(/^[^A-Za-z]+/, '');
      if (!first) return `a ${s}`;
      const acronym = /^[A-Z]{2,4}(?![A-Za-z])/.test(first);
      const an = acronym
        ? 'AEFHILMNORSX'.includes(first[0])
        : /^(hour|honest|honou?r|heir)/i.test(first) ||
          (/^[aeiou]/i.test(first) && !/^(uni|use|usu|eu|one|once|ubi)/i.test(first));
      return `${an ? 'an' : 'a'} ${s}`;
    },
  });

  // ---------- A club's abbreviation ----------
  // Three letters from the club's name: the first word that is not a generic one (Little, Real, Club, Associazione,
  // Atlético ...), then the next letters of it or the start of the next word, never a rude or silly code, and one nobody
  // else has. Fan accounts and the live match header use it, so "Little Tarncaster City" is TAR, not LIE.
  const GENERIC = new Set(
    `fc afc cf sc ac as ssc sv fk bk if sk bsc tsv vfl vfb rc ud cd sd cs ca ec club clube clubs associazione associacao
    asociacion calcio futbol football sports sport sporting society social little great new old north south east west upper
    lower real atletico athletic deportivo deportes deportiva olympique olympic racing royal stade stadium union unione
    united inter dinamo dynamo al el la le los las de del da do di der die the b ii iii reserves city town rovers wanderers
    albion county rangers argyle harriers alexandra wednesday hotspur borough academical thistle vale welfare orient villa
    saint`.split(/\s+/),
  );
  const BAD_CODES = new Set(
    `ASS ARS POO PEE SEX GAY FAG FAP CUM TIT WTF KKK NAZ NZI HIV DIE LIE DED BUM GAS PIG HAG SAD BAD DIM FAT WAR CUN CNT
    COC COK DIK FUK FUC SHT PIS JAP KYS RAT BUB GUG`.split(/\s+/),
  );
  U.abbrev = function (name, taken = new Set(), isRude = () => false) {
    const words = String(name || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter(Boolean);
    const core = words.filter((w) => !GENERIC.has(w)),
      c0 = core[0] || words[0] || 'xxx',
      c1 = core[1] || '';
    const generic = words.filter((w) => GENERIC.has(w));
    const rest = (core.slice(1).concat(generic).join('') || 'x').split('');
    const cands = [];
    if (c0.length >= 3) cands.push(c0.slice(0, 3));
    if (c1 || generic.length) cands.push(c0.slice(0, 2) + (c1 || generic[0])[0]);
    if (c0.length >= 3) {
      const cons = c0.slice(1).replace(/[aeiou]/g, '');
      if (cons.length >= 2) cands.push(c0[0] + cons.slice(0, 2));
      for (let k = 2; k < c0.length; k++) cands.push(c0[0] + c0[1] + c0[k]);
      for (let k = 2; k < c0.length - 1; k++) cands.push(c0[0] + c0[k] + c0[k + 1]);
    }
    cands.push(
      words
        .map((w) => w[0])
        .join('')
        .slice(0, 3),
    );
    cands.push((c0 + rest.join('')).slice(0, 3));
    for (let k = 1; k < Math.min(rest.length, 6); k++) cands.push((c0.slice(0, 2) + rest[k]).padEnd(3, 'x'));
    for (const l of 'abcdefghijklmnopqrstuvwxyz') cands.push(c0.slice(0, 2).padEnd(2, 'x') + l);
    for (const raw of cands) {
      const c = raw.toUpperCase().padEnd(3, 'X').slice(0, 3);
      if (c.length === 3 && !taken.has(c) && !BAD_CODES.has(c) && !isRude(c)) return c;
    }
    return c0.slice(0, 3).toUpperCase().padEnd(3, 'X');
  };

  // Save format version. Bump it with a migration in save.js whenever the saved state changes shape.
  FM.VERSION = '0.5.0'; // the game's version (package.json)
  FM.SAVE_VERSION = 9;

  FM.nextId = function (prefix) {
    FM.S.nextId = (FM.S.nextId || 1) + 1;
    return prefix + FM.S.nextId;
  };
})();

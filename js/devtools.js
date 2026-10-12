// Developer tools: interactive checks on a running game, for the developer only. This file is left out of the public and
// store builds (tools/build.mjs), so a player never sees it; from the source folder it adds a Developer tools button to
// Settings. Everything that plays the game runs on a copy of your save and puts the real one back afterwards.
(function () {
  const FM = window.FM,
    UI = FM.UI,
    U = FM.U,
    W = FM.W,
    D = FM.D;
  const S = () => FM.S;
  const esc = U.esc;
  const Dev = (FM.Dev = {});

  // ---------- Checks on a world ----------
  // Each check is [what, passes?]. A few of the headless suite's invariants, run on the world you are playing.
  Dev.invariants = function (s = S()) {
    const out = [],
      chk = (what, ok) => out.push([what, !!ok]);
    const clubs = Object.values(s.clubs),
      players = Object.values(s.players).filter((p) => !p.retired);
    chk(
      'every player is at a club that exists',
      players.every((p) => !p.clubId || s.clubs[p.clubId]),
    );
    chk(
      'every position is a known one, every ability a number',
      players.every((p) => D.POS.includes(p.pos) && Number.isFinite(p.ca) && Number.isFinite(p.pa)),
    );
    chk(
      'second positions are real and different from his own',
      players.every((p) => Object.keys(p.alt || {}).every((t) => D.POS.includes(t) && t !== p.pos)),
    );
    const playing = clubs.filter((c) => c.sim === 'full' || c.sim === 'light');
    chk(
      'every full and light club has a keeper',
      playing.every((c) => W.squad(c.id).some((p) => p.pos === 'GK')),
    );
    chk(
      'every full club can field an eleven',
      playing.filter((c) => c.sim === 'full').every((c) => W.pickXI(c.id, c.tactic).xi.every(Boolean)),
    );
    chk(
      'every tactic has roles that exist for its slots',
      playing.every((c) => {
        const sl = D.FORMATIONS[c.tactic.formation];
        return c.tactic.roles.every((r, i) => D.ROLES[sl[i].t][r]);
      }),
    );
    chk(
      'every league has the clubs its table has',
      W.leagues().every(
        (l) => Object.keys(l.table).length === l.clubs.length && new Set(l.clubs).size === l.clubs.length,
      ),
    );
    chk(
      'league tables are in points order',
      W.leagues().every((l) => W.sortedTable(l).every((r, i, a) => !i || a[i - 1].pts >= r.pts)),
    );
    chk(
      'no club is in two continental cups',
      (() => {
        const seen = new Set();
        for (const c of W.continentals())
          for (const id of c.clubs || [])
            if (seen.has(id)) return false;
            else seen.add(id);
        return true;
      })(),
    );
    chk(
      'no player has a pre-contract with a club that is gone',
      players.every((p) => !p.pre || s.clubs[p.pre.c]),
    );
    chk('the calendar and the day agree', s.calendar && s.day >= 0 && s.day <= s.calendar.length);
    chk(
      'national teams have a coefficient',
      Object.values(s.nteams || {}).every((t) => Number.isFinite(t.coef)),
    );
    chk(
      'history rows are for real seasons and clubs',
      players.every((p) => (p.history || []).every((h) => h.y && h.apps > 0 && (h.c == null || s.clubs[h.c]))),
    );
    return out;
  };
  // The market so far this season, from the transfer log: how many, how much, and the shares that matter
  Dev.market = function (s = S()) {
    const log = (s.seasonLog && s.seasonLog.transfers) || [],
      moves = log.filter((t) => !t.loan);
    const pct = (n, d) => (d ? Math.round((100 * n) / d) + '%' : '—');
    return [
      ['transfers (not loans)', moves.length],
      ['loans', log.length - moves.length],
      ['free', pct(moves.filter((t) => !t.fee).length, moves.length)],
      ['across a border', pct(moves.filter((t) => t.intl).length, moves.length)],
      ['biggest fee', U.money(Math.max(0, ...moves.map((t) => t.fee)))],
      ['elite moves (ability 82+)', moves.filter((t) => s.players[t.pid] && s.players[t.pid].ca >= 82).length],
    ];
  };
  Dev.wonderkids = function (s = S()) {
    const kids = Object.values(s.players)
      .filter((p) => !p.retired && W.age(p) <= 19 && p.pa >= 80)
      .sort((a, b) => b.pa - a.pa);
    return { n: kids.length, top: kids.slice(0, 12) };
  };

  // ---------- Runs on a copy of the save ----------
  const tick = () => new Promise((r) => setTimeout(r, 0));
  const copyOf = () => FM.Save.relink(JSON.parse(JSON.stringify(S())));
  // fn(copy) runs with the copy as the world; the real save goes back whatever happens
  Dev.onCopy = async function (fn) {
    const real = S(),
      busy = UI.simBusy;
    UI.simBusy = true; // nothing saves the copy over your career
    try {
      FM.S = copyOf();
      W.rosterVer++;
      return await fn(FM.S);
    } finally {
      FM.S = real;
      W.rosterVer++;
      UI.simBusy = busy;
    }
  };
  const play = (s) => {
    const Sea = FM.Season;
    const fx = Sea.userFixture();
    if (fx) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
    return Sea.advance(null);
  };
  Dev.speed = (days = 5) =>
    Dev.onCopy(async (s) => {
      const t = [];
      for (let i = 0; i < days && s.day < s.calendar.length - 1; i++) {
        const t0 = performance.now();
        play(s);
        t.push(performance.now() - t0);
        await tick();
      }
      return { days: t.length, avg: U.avg(t), worst: Math.max(...t) };
    });
  Dev.season = (progress) =>
    Dev.onCopy(async (s) => {
      const t0 = performance.now(),
        e0 = { ...(s.eraLog || { g: 0, n: 0 }) },
        total = s.calendar.length - s.day;
      let summary = null,
        mk = null,
        i = 0;
      while (!summary) {
        summary = play(s);
        if (!summary) mk = Dev.market(s); // (the log starts again with the new season)
        progress && progress(++i, total);
        await tick();
      }
      const e = s.eraLog || e0;
      return {
        secs: (performance.now() - t0) / 1000,
        days: i,
        goals: e.n - e0.n ? ((e.g - e0.g) / (e.n - e0.n)).toFixed(2) : '—',
        market: mk || Dev.market(s),
        checks: Dev.invariants(FM.S),
      };
    });

  // ---------- UI smoke test ----------
  // Opens every tab, every sub-tab on it and a sample of sheets (players of each kind, clubs, settings), and reports what
  // threw or showed a broken value ("undefined", "NaN", "[object Object]"). Runs on a copy of the save.
  const BROKEN = /\bundefined\b|\bNaN\b|\[object |\bInfinity\b/;
  const lastSheet = () => [...document.querySelectorAll('.sheet-wrap')].pop() || document.body;
  Dev.smoke = () =>
    Dev.onCopy(async (s) => {
      const problems = [];
      let opened = 0;
      const look = (what, el) => {
        opened++;
        const t = el ? el.innerText || '' : '';
        if (!t.trim()) return problems.push(`${what}: nothing on screen`);
        const m = what === 'sheet whatsNew' ? null : t.match(BROKEN); // (the changelog talks about bugs)
        if (m) {
          const at = t.indexOf(m[0]);
          problems.push(`${what}: shows "${m[0]}" (…${t.slice(Math.max(0, at - 30), at + 20).replace(/\s+/g, ' ')}…)`);
        }
      };
      const attempt = (what, fn) => {
        try {
          fn();
        } catch (e) {
          opened++;
          problems.push(`${what}: ${e && e.message}`);
        }
      };
      const main = () => document.getElementById('main');
      for (const tab of Object.keys(UI.screens)) {
        attempt(`tab ${tab}`, () => {
          UI.go(tab);
          look(`tab ${tab}`, main());
        });
        const subs = [...document.querySelectorAll('#main [data-act="sub"]')].map((b) => [b.dataset.k, b.dataset.v]);
        for (const [k, v] of subs) {
          attempt(`${tab} › ${k}=${v}`, () => {
            UI.acts.sub({ k, v });
            look(`${tab} › ${k}=${v}`, main());
          });
          await tick();
        }
      }
      // sheets: your players of each kind, someone else's, a club of each size, and the standard sheets
      const mine = W.squad(W.userClub().id),
        others = Object.values(s.players).filter((p) => !p.retired && p.clubId && !W.ownPlayer(p));
      const sample = [
        mine.find((p) => p.pos === 'GK'),
        mine.find((p) => p.pos !== 'GK'),
        mine.find((p) => p.team),
        mine.find((p) => p.inj),
        others.find((p) => p.pos === 'GK'),
        others[0],
        others[others.length >> 1],
        others.find((p) => W.age(p) <= 18),
        others.find((p) => W.age(p) >= 35),
        Object.values(s.players).find((p) => !p.clubId && !p.retired),
      ].filter(Boolean);
      for (const p of sample) {
        attempt(`player ${p.id}`, () => {
          UI.playerSheet(p.id);
          look(`player ${W.name(p)} (${p.pos})`, lastSheet());
          UI.closeAllSheets();
        });
        await tick();
      }
      const clubs = Object.values(s.clubs).sort((a, b) => b.rep - a.rep);
      for (const c of [clubs[0], clubs[clubs.length >> 1], clubs[clubs.length - 1], W.userClub()]) {
        attempt(`club ${c.name}`, () => {
          UI.clubSheet(c.id);
          look(`club ${c.name}`, lastSheet());
          UI.closeAllSheets();
        });
        await tick();
      }
      for (const act of ['whatsNew', 'reportProblem', 'sendFeedback'])
        attempt(`sheet ${act}`, () => {
          UI.acts[act]({});
          look(`sheet ${act}`, lastSheet());
          UI.closeAllSheets();
        });
      UI.go('home');
      return { opened, problems };
    });

  // ---------- The panel ----------
  const lines = (rows) =>
    rows
      .map(
        ([k, v]) =>
          `<div class="row small" style="padding:4px 0;border-top:1px solid var(--line)"><span class="grow">${esc(k)}</span><b>${esc(String(v))}</b></div>`,
      )
      .join('');
  const checks = (rows) =>
    rows
      .map(
        ([k, ok]) =>
          `<div class="row small" style="padding:4px 0;border-top:1px solid var(--line)"><span>${ok ? '✅' : '❌'}</span><span class="grow" style="margin-left:8px">${esc(k)}</span></div>`,
      )
      .join('');
  const show = (title, html) => {
    const out = document.getElementById('dev-out');
    if (out) out.innerHTML = `<div class="h3" style="margin:12px 0 4px">${esc(title)}</div>${html}`;
  };
  UI.acts.devPanel = () =>
    UI.sheet(
      `<div class="small dim" style="line-height:1.5">Developer tools. Runs on a copy of your save; the real one is put back. This panel isn't in public builds.</div>
      <div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap">
        <button class="btn sm" data-act="devCheck">✅ World check</button>
        <button class="btn sm" data-act="devMarket">💱 Market so far</button>
        <button class="btn sm" data-act="devKids">🌱 Wonderkids</button>
        <button class="btn sm" data-act="devSpeed">⏱ Speed (5 days)</button>
        <button class="btn sm" data-act="devSeason">🏁 Play a season</button>
        <button class="btn sm" data-act="devSmoke">🔎 UI smoke test</button>
        <button class="btn sm" data-act="devReplay">🎞 Goal replay</button>
      </div><div id="dev-out"></div>`,
      { title: '🛠 Developer tools', full: true },
    );
  UI.acts.devCheck = () => {
    const r = Dev.invariants();
    show(`World check: ${r.filter((x) => x[1]).length} of ${r.length} pass`, checks(r));
  };
  UI.acts.devMarket = () => show('Market so far this season', lines(Dev.market()));
  UI.acts.devKids = () => {
    const k = Dev.wonderkids();
    show(
      `${k.n} wonderkids (19 or under, potential 80+)`,
      lines(
        k.top.map((p) => [
          `${W.name(p)} · ${W.posLabel(p)} · ${W.age(p)}`,
          `${Math.round(p.ca)} → ${Math.round(p.pa)}`,
        ]),
      ),
    );
  };
  UI.acts.devSpeed = async () => {
    show('Speed', '<div class="small dim">Playing five days on a copy…</div>');
    await tick();
    try {
      const r = await Dev.speed(5);
      show(
        'Speed',
        lines([
          ['days played', r.days],
          ['average a day', `${r.avg.toFixed(0)} ms`],
          ['slowest day', `${r.worst.toFixed(0)} ms`],
        ]),
      );
    } catch (e) {
      show('Speed failed', `<div class="small">${esc(String(e.stack || e))}</div>`);
    }
  };
  UI.acts.devSmoke = async () => {
    show('UI smoke test', '<div class="small dim">Opening every screen…</div>');
    await tick();
    try {
      const r = await Dev.smoke();
      UI.acts.devPanel(); // (the sheets were closed to look at the rest)
      show(
        `UI smoke test: ${r.opened} screens, ${r.problems.length} problems`,
        r.problems.length
          ? lines(r.problems.map((x) => [x, '']))
          : '<div class="small">Everything opened cleanly.</div>',
      );
    } catch (e) {
      show('Smoke test failed', `<div class="small">${esc(String(e.stack || e))}</div>`);
    }
  };
  UI.acts.devSeason = async () => {
    show('Season', '<div class="small dim" id="dev-prog">Starting…</div>');
    await tick();
    try {
      const r = await Dev.season((i, n) => {
        const el = document.getElementById('dev-prog');
        if (el) el.textContent = `Day ${i} of about ${n}…`;
      });
      show(
        'Season on a copy',
        lines([
          ['days', r.days],
          ['time', `${r.secs.toFixed(0)} s`],
          ['goals a match', r.goals],
        ]) +
          `<div class="small b dim" style="margin:10px 0 2px">MARKET</div>${lines(r.market)}<div class="small b dim" style="margin:10px 0 2px">CHECKS AFTER</div>${checks(r.checks)}`,
      );
    } catch (e) {
      show('Season failed', `<div class="small">${esc(String(e.stack || e))}</div>`);
    }
  };

  // ---------- Goal replay: real goals next to the match view's ----------
  // Nineteen Liverpool goals tracked by hand (the Last Row data, js/devclips.js, made by tools/lastrow-clips.mjs) played on a pitch
  // beside the goals of a match you have watched, to judge by eye how the match view's runs, spacing, timing and keeper look next to
  // real ones. Recording is switched on from the panel; it keeps the last few seconds of the match view and saves them when a goal
  // is scored. Both are drawn attacking toward the right.
  Dev.clips = () => FM.DEVCLIPS || [];
  Dev.loadClips = () =>
    new Promise((res, rej) => {
      if (FM.DEVCLIPS) return res(FM.DEVCLIPS);
      const s = document.createElement('script');
      s.src = 'js/devclips.js?v=' + Date.now();
      s.onload = () => res(FM.DEVCLIPS);
      s.onerror = () =>
        rej(
          new Error(
            'js/devclips.js is missing: run node tools/lastrow-clips.mjs --data <the Last Row positional_data folder>',
          ),
        );
      document.head.appendChild(s);
    });
  Dev.rec = { on: false, buf: [], goals: [], keep: 6 }; // (keep: seconds of the match view kept: about the minute of match time the goal was built in)
  Dev.record = (on) => {
    const MV = FM.MatchView;
    Dev.rec.on = on;
    if (!on || Dev._wrapped || !MV) return;
    Dev._wrapped = true;
    const orig = MV.moveDots;
    MV.moveDots = function (dt) {
      orig.call(this, dt);
      if (!Dev.rec.on || !MV.st || !MV.m) return;
      const st = MV.st,
        b = st.ball;
      Dev.rec.buf.push({
        dt,
        b: [b.x, b.y, b.h || 0],
        d: st.dots.map((side) => side.map((d) => (d ? [d.x, d.y] : null))),
      });
      let total = 0,
        i = Dev.rec.buf.length;
      while (i > 0 && total < Dev.rec.keep) total += Dev.rec.buf[--i].dt;
      if (i > 0) Dev.rec.buf.splice(0, i);
      // the frame the shot is struck in (the goal's last frame: after it the scorer runs off to celebrate)
      const shot = st.act && st.act.a && st.act.a.k === 'shot' && st.act.a.outcome === 'goal';
      if (shot && !Dev._shotFrame) Dev._shotFrame = Dev.rec.buf[Dev.rec.buf.length - 1];
      if (!shot && !st.celebrate) Dev._shotFrame = null;
      if (st.celebrate && Dev._celebrated !== st.celebrate) {
        // a goal: keep the seconds before it, turned to attack toward the right from the scoring side
        Dev._celebrated = st.celebrate;
        const k = st.celebrate.side,
          fr = (x, y) => (k === 0 ? { x, y } : { x: 1 - x, y: 1 - y });
        let t = 0;
        const upTo = Dev._shotFrame ? Dev.rec.buf.indexOf(Dev._shotFrame) : -1,
          kept = upTo >= 0 ? Dev.rec.buf.slice(0, upTo + 1) : Dev.rec.buf;
        const frames = kept.map((f) => {
          t += f.dt;
          const bb = fr(f.b[0], f.b[1]),
            p = [];
          f.d.forEach((side, s) =>
            side.forEach((d, j) => {
              if (!d) return;
              const q = fr(d[0], d[1]);
              p.push(j + s * 100, s === k ? 1 : 0, q.x, q.y);
            }),
          );
          return { t, f: [bb.x, bb.y, f.b[2], p] };
        });
        Dev.rec.goals.push({ name: `Touchline goal, ${MV.m.minute}'`, view: true, seconds: t, frames });
      }
      if (!st.celebrate) Dev._celebrated = null;
    };
  };
  // What a goal looks like at its last frame: who is in the area, how close the nearest defender is, how high the ball got
  Dev.clipStats = (c) => {
    const last = c.view ? c.frames[c.frames.length - 1].f : c.frames[c.frames.length - 1],
      P = last[3],
      inBox = (x, y) => x > 1 - 16.5 / 105 && Math.abs(y - 0.5) < 20.16 / 68;
    let att = 0,
      def = 0,
      near = 9;
    for (let i = 0; i < P.length; i += 4) {
      if (!inBox(P[i + 2], P[i + 3])) continue;
      P[i + 1] ? att++ : def++;
    }
    const bx = last[0] * 105,
      by = last[1] * 68;
    for (let i = 0; i < P.length; i += 4)
      if (!P[i + 1]) near = Math.min(near, Math.hypot(P[i + 2] * 105 - bx, P[i + 3] * 68 - by));
    const fs = c.view ? c.frames.map((f) => f.f) : c.frames;
    let zmax = 0,
      path = 0;
    for (let i = 0; i < fs.length; i++) {
      zmax = Math.max(zmax, fs[i][2]);
      if (i) path += Math.hypot((fs[i][0] - fs[i - 1][0]) * 105, (fs[i][1] - fs[i - 1][1]) * 68);
    }
    return { att, def, near, zmax, path, tracked: P.length / 4 };
  };
  const drawClip = (cv, c, p) => {
    const x = cv.getContext('2d'),
      w = cv.width,
      h = cv.height;
    x.fillStyle = '#1f7a3f';
    x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(255,255,255,.6)';
    x.lineWidth = 1;
    const px = (a, b) => [a * w, b * h],
      rect = (x0, y0, x1, y1) => {
        const A = px(x0, y0),
          B = px(x1, y1);
        x.strokeRect(Math.min(A[0], B[0]), Math.min(A[1], B[1]), Math.abs(B[0] - A[0]), Math.abs(B[1] - A[1]));
      };
    rect(0.001, 0.001, 0.999, 0.999);
    rect(0.843, 0.2, 1, 0.8);
    rect(0.948, 0.37, 1, 0.63);
    rect(0, 0.2, 0.157, 0.8);
    rect(0, 0.37, 0.052, 0.63);
    x.beginPath();
    x.moveTo(w / 2, 0);
    x.lineTo(w / 2, h);
    x.stroke();
    if (!c) return;
    let f;
    if (c.view) {
      const T = c.seconds * p;
      let i = 0;
      while (i < c.frames.length - 1 && c.frames[i].t < T) i++;
      f = c.frames[i].f;
    } else f = c.frames[Math.min(c.frames.length - 1, Math.round(p * (c.frames.length - 1)))];
    const P = f[3];
    for (let i = 0; i < P.length; i += 4) {
      const [X, Y] = px(P[i + 2], P[i + 3]);
      x.fillStyle = P[i + 1] ? '#e53935' : '#1e88e5';
      x.beginPath();
      x.arc(X, Y, 5, 0, Math.PI * 2);
      x.fill();
    }
    const [BX, BY] = px(f[0], f[1]);
    x.fillStyle = 'rgba(0,0,0,.35)';
    x.beginPath();
    x.arc(BX, BY, 3, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#fff';
    x.beginPath();
    x.arc(BX, BY - f[2] * 10, 3.5 + f[2] * 1.5, 0, Math.PI * 2);
    x.fill();
  };
  Dev.replay = { real: 0, mine: -1, p: 0, playing: false, secs: 8 };
  const replayHtml = () => {
    const R = Dev.replay,
      clips = Dev.clips(),
      mine = Dev.rec.goals;
    const stat = (c) => {
      if (!c) return '';
      const s = Dev.clipStats(c);
      return `<div class="tiny dim" style="line-height:1.5">${s.tracked} tracked · ${s.att} attackers and ${s.def} defenders in the area at the shot · nearest defender ${s.near.toFixed(1)} m from the ball · ball path ${s.path.toFixed(0)} m, highest ${s.zmax.toFixed(2)}</div>`;
    };
    return `<div class="small dim" style="line-height:1.5">Real goals (Last Row data, tracked by hand, so players are missing) beside goals of the match view, attacking to the right. Switch recording on, watch a match (Fast 4x helps), and the goals appear on the right.</div>
      <div class="row" style="gap:8px;margin:8px 0;flex-wrap:wrap"><select id="rp-real" data-input="devReplayPick" data-k="real" style="flex:1;min-width:0;padding:8px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink)">${clips.map((c, i) => `<option value="${i}" ${i === R.real ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
        <select id="rp-mine" data-input="devReplayPick" data-k="mine" style="flex:1;min-width:0;padding:8px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink)"><option value="-1">${mine.length ? 'Pick a goal of the match view' : 'No goals recorded yet'}</option>${mine.map((c, i) => `<option value="${i}" ${i === R.mine ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
      <div class="row" style="gap:8px;align-items:flex-start"><div class="grow"><canvas id="rp-a" width="320" height="206" style="width:100%;border-radius:8px"></canvas>${stat(clips[R.real])}</div><div class="grow"><canvas id="rp-b" width="320" height="206" style="width:100%;border-radius:8px"></canvas>${stat(mine[R.mine])}</div></div>
      <div class="row" style="gap:8px;margin-top:10px;align-items:center"><button class="btn sm" data-act="devReplayPlay" id="rp-play">${R.playing ? '⏸' : '▶'}</button><input type="range" id="rp-slider" min="0" max="1000" value="${Math.round(R.p * 1000)}" data-input="devReplaySeek" style="flex:1"></div>
      <div class="row" style="gap:8px;margin-top:8px"><button class="btn sm ${Dev.rec.on ? 'pri' : ''}" data-act="devReplayRec">${Dev.rec.on ? '⏺ Recording (tap to stop)' : '⏺ Record goals of the match view'}</button><span class="tiny dim">${mine.length} recorded</span></div>`;
  };
  const replayDraw = () => {
    const R = Dev.replay,
      a = document.getElementById('rp-a'),
      b = document.getElementById('rp-b');
    if (a) drawClip(a, Dev.clips()[R.real], R.p);
    if (b) drawClip(b, Dev.rec.goals[R.mine], R.p);
    const sl = document.getElementById('rp-slider');
    if (sl) sl.value = Math.round(R.p * 1000);
  };
  const replayTick = (t0) => (t) => {
    const R = Dev.replay;
    if (!R.playing || !document.getElementById('rp-a')) return (R.playing = false);
    R.p += (t - (t0 || t)) / 1000 / R.secs;
    if (R.p >= 1) R.p = 0;
    replayDraw();
    requestAnimationFrame(replayTick(t));
  };
  const replayShow = () => {
    UI.closeAllSheets(); // (a sheet drawn over another would leave two of every id)
    UI.sheet(replayHtml(), { title: '🎞 Goal replay', full: true });
    replayDraw();
  };
  UI.acts.devReplay = async () => {
    try {
      await Dev.loadClips();
    } catch (e) {
      return UI.toast(e.message, 5000);
    }
    Dev.replay.playing = false;
    replayShow();
  };
  UI.acts.devReplayPick = (d, el) => {
    const was = Dev.replay.playing;
    Dev.replay[d.k] = +el.value;
    Dev.replay.playing = false;
    replayShow();
    if (was) UI.acts.devReplayPlay();
  };
  UI.acts.devReplaySeek = (d, el) => {
    Dev.replay.p = +el.value / 1000;
    replayDraw();
  };
  UI.acts.devReplayPlay = () => {
    const R = Dev.replay;
    R.playing = !R.playing;
    const b = document.getElementById('rp-play');
    if (b) b.textContent = R.playing ? '⏸' : '▶';
    if (R.playing) requestAnimationFrame(replayTick(0));
  };
  UI.acts.devReplayRec = () => {
    Dev.record(!Dev.rec.on);
    Dev.replay.playing = false;
    replayShow();
  };
})();

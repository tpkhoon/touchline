// Match motion v2: steering-based player movement, off-the-ball runs, dribbles, weighted passes,
// lofted balls, receivers running onto passes, goalkeeper dives and goal celebrations.
// Replaces the simple lerp animation in matchview.js; the simulation (engine.js) is unchanged —
// the view only decides *how* the scripted events look.
(function () {
  const FM = window.FM,
    U = FM.U,
    MV = FM.MatchView;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const easeOut = (f) => 1 - (1 - f) * (1 - f); // ground pass: decelerates as it arrives
  const easeInOut = (f) => (f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2);

  // Attacking direction in global coordinates for a side (home attacks +x)
  const dir = (side) => (side === 0 ? 1 : -1);

  // ---------- Plan a minute: turn the engine's script into timed, natural-looking actions ----------
  MV.planActions = function (script) {
    const st = MV.st,
      sp = st.speed;
    st.cor = null; // (a new minute: no corner is under way)
    st.wall = null;
    st.layout = null;
    st.chance = null;
    const acts = [];
    let prevWasPass = false;
    // the second half starts from the centre spot: the sides walk back to their halves, then the kick-off
    if (st.restartNext) {
      const r = st.restartNext;
      st.restartNext = null;
      acts.push(
        { k: 'restart', side: r.side, to: r.to, nat: 7000 },
        { k: 'kickoff', side: r.side, to: r.to, nat: 420 },
      );
    }
    script.forEach((a, idx) => {
      if (a.k === 'pass' || a.k === 'cross') {
        const from = st.dots[a.side][a.from],
          to = st.dots[a.side][a.to];
        const d = from && to ? dist(from, to) : 0.2;
        // Take a touch / dribble first (more often after receiving, less when first-timing it)
        // a patient side takes a touch and looks up; a counter or a direct side plays it first time
        // a corner: the ball is put down at the flag first, and nobody dribbles it
        if (a.flag) acts.push({ k: 'spot', side: a.side, slot: a.from, dead: 'cor', flag: a.flag, nat: 3200 });
        // a goal kick, a throw-in or a free-kick cross: the ball is put down first (the box fills for a free-kick cross)
        if (a.restart)
          acts.push({
            k: 'spot',
            side: a.side,
            slot: a.from,
            dead: a.restart,
            at: a.restart === 'gk' ? null : a.at,
            nat: a.restart === 'gk' ? 2200 : a.restart === 'fkc' ? 800 : 1800, // (a goal kick, a throw-in and a corner wait for the players to take their places)
          });
        // A carry before the pass. How often and how far is the real thing (FM.D.CARRIES, js/carries.js, from the DFL and PFF tracking):
        // about a third of receptions are followed by a carry of 4 m or more (median 6.7 m, a tenth over 14), and about half by a short
        // touch of 1 to 4 m (median 2.3 m), by the third of the pitch he is in; the rest are played first time.
        const cd = st.dots[a.side][a.from],
          CR = FM.D.CARRIES,
          zone = cd ? Math.min(2, Math.floor(MV.toFrame(a.side, cd.x, cd.y).x * 3)) : 1;
        if (!a.flag && !a.restart && !a.fast) {
          const Z = CR && CR.carries.zones[zone];
          if (Z && MV.vr() < Z.share) {
            const s = Z.sample[Math.floor(MV.vr() * Z.sample.length)],
              len = Math.hypot(s[0], s[1]);
            acts.push({
              k: 'carry',
              side: a.side,
              slot: a.from,
              nat: 240 + len * 45,
              fwd: s[0] / 105,
              lat: s[1] / 68,
            });
          } else {
            const S = CR && CR.carries.short && CR.carries.short.zones[zone];
            if (S) {
              // (of the receptions that are not a long carry, the share that are a short touch)
              if (MV.vr() < S.share / Math.max(0.2, 1 - Z.share)) {
                const s = S.sample[Math.floor(MV.vr() * S.sample.length)],
                  len = Math.hypot(s[0], s[1]);
                acts.push({
                  k: 'carry',
                  side: a.side,
                  slot: a.from,
                  nat: 160 + len * 70,
                  fwd: s[0] / 105,
                  lat: s[1] / 68,
                });
              }
            } else if (MV.vr() < (prevWasPass ? (a.slow ? 0.6 : 0.5) : 0.3))
              acts.push({ k: 'carry', side: a.side, slot: a.from, nat: MV.vrange(220, 420) * (a.slow ? 1.2 : 1) });
          }
        }
        const lofted = a.k === 'cross' || d > 0.36;
        acts.push({
          ...a,
          lofted,
          nat: MV.flightMs(d, a.k === 'cross', lofted) * (a.fast ? 0.8 : a.slow ? 1.15 : 1),
        });
        prevWasPass = true;
      } else if (a.k === 'shot') {
        if (a.dead)
          acts.push({ k: 'spot', side: a.side, slot: a.from, dead: a.dead, nat: a.dead === 'fk' ? 1700 : 900 }); // the ball placed, the run-up (a free kick waits for the wall to form)
        else {
          // a striker who is played in by a through ball or on a counter takes it on toward goal before he shoots
          const prev = acts[acts.length - 1],
            thru = prev && prev.k === 'pass' && (prev.ctype === 'through' || prev.ctype === 'counter');
          if (thru) acts.push({ k: 'carry', side: a.side, slot: a.from, nat: 520, pre: true, thru: true });
          else if (MV.vr() < 0.6) acts.push({ k: 'carry', side: a.side, slot: a.from, nat: 240, pre: true });
        }
        acts.push({ ...a, nat: a.type === 'longshot' ? 520 : 380 });
        prevWasPass = false;
      } else if (a.k === 'takeon') {
        acts.push({ ...a, nat: 520 });
        prevWasPass = false;
      } else if (a.k === 'win') {
        acts.push({ ...a, nat: 260 });
        prevWasPass = false;
      } else if (a.k === 'kickoff') {
        // after a goal the sides walk back to their own halves before the ball is played from the centre spot
        acts.push({ k: 'restart', side: a.side, to: a.to, nat: 7000 }, { ...a, nat: 420 });
        prevWasPass = false;
      }
    });
    // Fit the minute: compress long sequences, pad short ones with the carrier on the ball
    const budget = st.minuteMs * 0.92;
    const natural = acts.reduce((t, a) => t + a.nat / sp, 0);
    const scale = natural > budget ? Math.max(0.42, budget / natural) : 1;
    acts.forEach(
      (a) =>
        (a.dur = Math.max(
          140,
          (a.nat / sp) * (a.k === 'restart' || (a.k === 'spot' && ['cor', 'gk', 'throw'].includes(a.dead)) ? 1 : scale),
        )),
    ); // (a restart is not squeezed: the sides need the time to walk back)
    const total = acts.reduce((t, a) => t + a.dur, 0);
    if (total > st.minuteMs) st.minuteMs = total / 0.92;
    // a shot is coming (not a penalty or a free kick): the attacking side fills the area, the defending side drops into its own
    const shotAct = acts.find((a) => a.k === 'shot' && !a.dead);
    st.chance = shotAct ? { side: shotAct.side, full: !['counter', 'longshot'].includes(shotAct.type) } : null;
    st.actions = acts;
    st.nActions = acts.length;
  };

  // ---------- Action lifecycle ----------
  MV.tick = function (ms) {
    const st = MV.st;
    if (st.hold > 0) {
      st.hold -= ms;
      if (st.hold <= 0) st.celebrate = null;
      return;
    }
    st.minuteT += ms;
    if (st.act) {
      st.act.t += ms;
      const f = Math.min(1, st.act.t / st.act.dur);
      const A = st.act;
      if (A.kind === 'ball') {
        const e = A.lofted ? easeInOut(f) * 0.25 + f * 0.75 : A.shot ? f : easeOut(f);
        // crosses and lofted balls bend slightly
        const bend = A.curve ? Math.sin(f * Math.PI) * A.curve : 0;
        st.ball.x = U.lerp(A.x0, A.x1, e) + A.nx * bend;
        st.ball.y = U.lerp(A.y0, A.y1, e) + A.ny * bend;
        st.ball.h = A.arc ? 4 * A.arc * f * (1 - f) : 0;
      }
      // a restart lasts until the sides are back in place (or a time limit), not a fixed few hundred milliseconds at the faster speeds
      if (
        f >= 1 ||
        (A.a.k === 'restart' && A.t > 500 && MV.settled()) ||
        (A.kind === 'spot' && st.layout && A.t > 500 && MV.layoutSettled())
      )
        MV.endAction();
    } else if (st.actions.length) MV.beginAction(st.actions.shift());
    if (!st.act && !st.actions.length && st.minuteT >= st.minuteMs) MV.nextMinute();
  };

  // everybody within a few steps of the place he is heading for
  MV.settled = () => {
    const st = MV.st;
    return st.dots.every((side, k) =>
      side.every(
        (d, i) => !d || !st.targets || !st.targets[k] || !st.targets[k][i] || dist(d, st.targets[k][i]) < 0.035,
      ),
    );
  };

  // ---------- Real layouts at restarts (FM.D.LAYOUTS, js/layouts.js, from the StatsBomb 360 frames) ----------
  // The players of a side go to the places of a real layout: each place to the nearest player still free (the taker and the keeper
  // aside), so the side keeps its own shape as far as it can. places are in global coordinates.
  MV.assign = function (k, places, skip) {
    const st = MV.st,
      sd = MV.m.sides[k],
      pairs = [];
    st.dots[k].forEach((d, i) => {
      if (!d || i === skip || sd.slots[i].t === 'GK') return;
      places.forEach((p, j) => pairs.push({ i, j, d: dist(d, p) }));
    });
    pairs.sort((x, y) => x.d - y.d);
    const usedI = new Set(),
      usedJ = new Set(),
      out = [];
    for (const p of pairs) {
      if (usedI.has(p.i) || usedJ.has(p.j)) continue;
      usedI.add(p.i);
      usedJ.add(p.j);
      out.push({ k, i: p.i, x: places[p.j].x, y: places[p.j].y });
    }
    return out;
  };
  // the layout for a dead ball: corner, throw-in or goal kick; f is the ball's place in the taking side's frame
  MV.layoutFor = function (a, f, taker) {
    const LY = FM.D.LAYOUTS;
    if (!LY) return null;
    const pickOf = (arr) => arr[Math.floor(MV.vr() * arr.length)];
    const G = (side, fx, fy) => MV.toGlobal(side, U.clamp(fx, 0.01, 0.99), U.clamp(fy, 0.02, 0.98));
    let out = [];
    if (a.dead === 'cor' && LY.corner.layouts.length) {
      const c = pickOf(LY.corner.layouts),
        flip = f.y > 0.5; // (the layouts have the corner at y = 0)
      const at = (p) => G(a.side, p[0] / 105, flip ? 1 - p[1] / 68 : p[1] / 68);
      out = out.concat(MV.assign(a.side, c.att.map(at), a.slot), MV.assign(1 - a.side, c.def.map(at), -1));
      const gk = MV.m.sides[1 - a.side].slots.findIndex((s) => s.t === 'GK');
      if (c.keeper && gk >= 0) {
        const p = at(c.keeper);
        out.push({ k: 1 - a.side, i: gk, x: p.x, y: p.y });
      }
    } else if (a.dead === 'throw' || a.dead === 'gk') {
      const list = a.dead === 'gk' ? LY.goalkick.layouts : LY.throwin.layouts[f.x < 1 / 3 ? 0 : f.x < 2 / 3 ? 1 : 2];
      if (!list || !list.length) return null;
      const L = pickOf(list),
        flipSrc = L.ball[1] > 34 ? -1 : 1, // (turned so the thrower is at the top touchline; a goal kick either way)
        s = a.dead === 'throw' ? (f.y < 0.5 ? 1 : -1) : MV.vr() < 0.5 ? 1 : -1; // (toward the inside of the pitch)
      const at = (p) => G(a.side, f.x + p[0] / 105, f.y + (s * flipSrc * p[1]) / 68);
      out = out.concat(MV.assign(a.side, L.mine.map(at), a.slot), MV.assign(1 - a.side, L.opp.map(at), -1));
    }
    return out.length ? out : null;
  };

  // everybody sent to a place of the real layout is within a few steps of it
  MV.layoutSettled = () => {
    const st = MV.st;
    return st.layout.every((L) => !st.dots[L.k][L.i] || dist(st.dots[L.k][L.i], L) < 0.04);
  };

  MV.beginAction = function (a) {
    const st = MV.st,
      b = st.ball;
    st.override = {};
    // A through ball or a counter is coming next: the runner sets off before the pass, into the space behind
    const nx = st.actions[0];
    if (nx && nx.k === 'pass' && (nx.ctype === 'through' || nx.ctype === 'counter')) {
      const r = st.dots[nx.side][nx.to];
      if (r) {
        const f = MV.toFrame(nx.side, r.x, r.y),
          g = MV.toGlobal(nx.side, U.clamp(f.x + 0.12, 0.05, 0.9), U.clamp(f.y + (0.5 - f.y) * 0.25, 0.08, 0.92));
        st.override[`${nx.side}:${nx.to}`] = { x: g.x, y: g.y, sprint: true };
      }
    }
    if (a.k === 'spot') {
      // A dead ball: on the penalty spot (or where the free kick was given), the taker a few steps behind it
      // a goal kick: on the six-yard line; a throw-in: on the touchline by the taker; a free-kick cross: wide in the final third
      const taker = st.dots[a.side][a.slot],
        tf = taker ? MV.toFrame(a.side, taker.x, taker.y) : { x: 0.5, y: 0.5 },
        side = tf.y < 0.5 ? 0 : 1;
      const f =
        a.dead === 'cor'
          ? a.flag
          : a.dead === 'pen'
            ? { x: 0.885, y: 0.5 }
            : a.dead === 'gk'
              ? { x: 0.055, y: 0.5 + MV.vrange(-0.12, 0.12) }
              : a.dead === 'throw'
                ? { x: U.clamp(tf.x, 0.04, 0.96), y: side ? 0.995 : 0.005 }
                : a.dead === 'fkc'
                  ? { x: MV.vrange(0.64, 0.8), y: MV.vr() < 0.5 ? MV.vrange(0.1, 0.28) : MV.vrange(0.72, 0.9) }
                  : a.at
                    ? { x: U.clamp(a.at.x, 0.6, 0.9), y: a.at.y } // (a direct free kick, from where real ones are taken)
                    : { x: MV.vrange(0.68, 0.76), y: MV.vrange(0.3, 0.7) };
      // the box fills up until the corner or the free-kick cross has been played, and for a throw-in in the final third
      if (a.dead === 'cor' || a.dead === 'fkc' || (a.dead === 'throw' && f.x > 0.75)) st.cor = { side: a.side };
      // a direct free kick: the defending side builds a wall (below, in moveDots)
      if (a.dead === 'fk') st.wall = { side: a.side, x: f.x, y: f.y };
      const g = MV.toGlobal(a.side, f.x, f.y),
        t =
          a.dead === 'throw'
            ? MV.toGlobal(a.side, f.x, f.y + (side ? -0.015 : 0.015))
            : MV.toGlobal(
                a.side,
                f.x - (a.dead === 'cor' ? 0.02 : a.dead === 'gk' ? 0.02 : 0.035),
                f.y + (a.dead === 'cor' ? (f.y < 0.5 ? 0.02 : -0.02) : 0.01),
              );
      b.x = g.x;
      b.y = g.y;
      b.h = 0;
      b.side = a.side;
      b.slot = a.slot;
      st.override[`${a.side}:${a.slot}`] = { x: t.x, y: t.y, sprint: true };
      st.layout = MV.layoutFor(a, f, taker); // (corners, throw-ins and goal kicks: the players stand where real ones did)
      st.act = { kind: 'spot', a, t: 0, dur: a.dur };
      return;
    }
    if (a.k === 'restart') {
      const sd = MV.m.sides[a.side],
        pick = sd.slots.findIndex((s, i) => i !== a.to && (s.t === 'ST' || s.t === 'AM') && sd.xi[i]),
        kicker = pick >= 0 ? pick : sd.slots.findIndex((s, i) => i !== a.to && s.t !== 'GK' && sd.xi[i]);
      st.restart = { side: a.side, to: a.to, kicker: kicker >= 0 ? kicker : null };
      b.x = 0.5;
      b.y = 0.5;
      b.h = 0;
      b.side = a.side;
      b.slot = st.restart.kicker != null ? st.restart.kicker : a.to;
      st.act = { kind: 'restart', a, t: 0, dur: a.dur };
      return;
    }
    if (a.k === 'takeon') {
      // The carrier runs at a defender. If he beats him he goes past (a little to one side) and the defender is left behind; if not, they
      // meet and the defender comes away with it (the next act gives him the ball).
      const d = st.dots[a.side][a.from],
        o = st.dots[1 - a.side][a.vs];
      b.side = a.side;
      b.slot = a.from;
      if (d && o) {
        const L = Math.hypot(o.x - d.x, o.y - d.y) || 1,
          ux = (o.x - d.x) / L,
          uy = (o.y - d.y) / L,
          side = MV.vr() < 0.5 ? -1 : 1;
        st.override[`${a.side}:${a.from}`] = a.won
          ? {
              x: U.clamp(o.x + ux * 0.07 - uy * 0.03 * side, 0.03, 0.97),
              y: U.clamp(o.y + uy * 0.07 + ux * 0.03 * side, 0.04, 0.96),
              sprint: true,
            }
          : { x: o.x, y: o.y, sprint: true };
        st.override[`${1 - a.side}:${a.vs}`] = a.won
          ? { x: U.lerp(d.x, o.x, 0.55) + uy * 0.02 * side, y: U.lerp(d.y, o.y, 0.55) - ux * 0.02 * side, sprint: true } // (goes in and is left behind)
          : { x: d.x + ux * 0.02, y: d.y + uy * 0.02, sprint: true };
      }
      st.act = { kind: 'carry', a, t: 0, dur: a.dur };
      return;
    }
    if (a.k === 'carry') {
      // Dribble: carrier pushes forward (and a little sideways) with the ball at his feet
      const d = st.dots[a.side][a.slot];
      // (a fitted carry has its own length and direction from the real data; a through-ball runner cuts in toward the middle of the goal)
      const fwd =
        (a.fwd != null ? a.fwd : a.thru ? MV.vrange(0.05, 0.09) : MV.vrange(0.02, a.pre ? 0.03 : 0.065)) * dir(a.side);
      const tx = U.clamp(d.x + fwd, 0.03, 0.97),
        ty =
          a.lat != null
            ? U.clamp(d.y + a.lat * (a.side === 0 ? 1 : -1), 0.05, 0.95)
            : a.thru
              ? U.clamp(d.y + (0.5 - d.y) * 0.4, 0.05, 0.95)
              : U.clamp(d.y + MV.vrange(-0.035, 0.035), 0.05, 0.95);
      st.override[`${a.side}:${a.slot}`] = { x: tx, y: ty, sprint: true };
      b.side = a.side;
      b.slot = a.slot;
      st.act = { kind: 'carry', a, t: 0, dur: a.dur };
      return;
    }
    if (a.k === 'kickoff') {
      b.x = 0.5;
      b.y = 0.5;
      b.h = 0;
    }
    let x1,
      y1,
      arc = 0,
      curve = 0,
      shot = false,
      lofted = !!a.lofted;
    if (a.k === 'pass' || a.k === 'cross' || a.k === 'win' || a.k === 'kickoff') {
      // Lead the receiver: aim where he's heading, and send him onto the ball
      const d = st.dots[a.side][a.to];
      const tgt = (st.targets && st.targets[a.side] && st.targets[a.side][a.to]) || d;
      // into space for a through ball (the runner is already going), a lead pass otherwise
      const lead = a.k === 'win' ? 0 : a.ctype === 'through' || a.ctype === 'counter' ? 1.05 : 0.55;
      x1 = U.clamp(d.x + (tgt.x - d.x) * lead + (a.k === 'win' ? 0 : dir(a.side) * 0.012), 0.02, 0.98);
      y1 = U.clamp(d.y + (tgt.y - d.y) * lead, 0.03, 0.97);
      // the pass to the man who shoots goes to the place the shot is taken from
      if (a.at) {
        x1 = U.clamp(a.at.x, 0.02, 0.98);
        y1 = U.clamp(a.at.y, 0.03, 0.97);
        const g = MV.toGlobal(a.side, x1, y1);
        x1 = g.x;
        y1 = g.y;
      }
      st.override[`${a.side}:${a.to}`] = { x: x1, y: y1, sprint: true };
      if (lofted) arc = 0.02 + Math.min(0.05, dist(b, { x: x1, y: y1 }) * 0.09);
      if (a.k === 'cross') {
        arc = 0.045;
        curve = 0.03 * (MV.vr() < 0.5 ? -1 : 1);
      }
    } else if (a.k === 'shot') {
      shot = true;
      const gy = 0.5 + MV.vrange(-0.035, 0.035);
      let gx = 1.012,
        fy = gy;
      const gk = a.gk != null ? st.dots[1 - a.side][a.gk] : null;
      if (a.outcome === 'saved' && gk) {
        const g = MV.toFrame(a.side, gk.x, gk.y);
        gx = Math.min(0.99, g.x + 0.006);
        fy = U.clamp(gy + MV.vrange(-0.02, 0.02), 0.44, 0.56);
      }
      if (a.outcome === 'wide') {
        gx = 1.03;
        fy = 0.5 + (MV.vr() < 0.5 ? -1 : 1) * MV.vrange(0.06, 0.14);
      }
      if (a.outcome === 'blocked') {
        const f = MV.toFrame(a.side, b.x, b.y);
        gx = f.x + 0.045;
        fy = f.y + MV.vrange(-0.05, 0.05);
      }
      const g = MV.toGlobal(a.side, gx, fy);
      x1 = g.x;
      y1 = g.y;
      arc = a.type === 'longshot' ? 0.03 : a.type === 'cross' ? 0.015 : 0.006;
      curve = a.type === 'longshot' ? 0.02 * (MV.vr() < 0.5 ? -1 : 1) : 0;
      // Keeper reacts: shuffles and dives toward where the ball is going
      if (gk && a.gk != null)
        st.override[`${1 - a.side}:${a.gk}`] = {
          x: U.lerp(gk.x, x1, a.outcome === 'saved' ? 0.9 : 0.5),
          y: U.lerp(gk.y, y1, a.outcome === 'saved' ? 1 : 0.6),
          sprint: true,
          dive: true,
        };
      if (a.big) MV.banner(`${MV.m.clock}`, MV.pendingChanceText || 'Big chance…', false);
    }
    // perpendicular unit vector for curling balls
    const dx = x1 - b.x,
      dy = y1 - b.y,
      L = Math.hypot(dx, dy) || 1;
    st.act = {
      kind: 'ball',
      a,
      t: 0,
      dur: a.dur,
      x0: b.x,
      y0: b.y,
      x1,
      y1,
      arc,
      curve,
      nx: -dy / L,
      ny: dx / L,
      lofted,
      shot,
    };
    if (a.k !== 'shot') {
      b.side = a.side;
      b.slot = a.to;
      b.inFlight = true;
    }
  };

  MV.endAction = function () {
    const st = MV.st,
      A = st.act,
      a = A.a;
    st.act = null;
    st.ball.inFlight = false;
    st.ball.h = 0;
    if (a.k === 'restart') st.restart = null;
    if (a.restart === 'throw' || a.restart === 'gk') st.layout = null;
    if (a.restart === 'throw') st.cor = null; // (the throw-in is taken: the box empties)
    if (a.k !== 'shot') st.touch = 0.22; // the receiver's first touch: the ball settles rather than sticks
    if (a.k === 'shot') {
      st.cor = null;
      st.wall = null;
      st.layout = null;
      st.chance = null;
      const ev = st.pendingEv.shift();
      if (ev) MV.showEvent(ev);
      if (a.outcome === 'goal') {
        st.hold = 1700;
        st.celebrate = { side: a.side, slot: a.from };
      } else if (a.big) st.hold = 700;
      st.override = {};
    }
  };

  // ---------- Real speeds (FM.D.MOVE, js/movement.js, from the Metrica Sports sample data) ----------
  // How long a ball takes over a pass: the real speed for the length of the pass (9 m/s over ten metres to nearly 15 over thirty-five;
  // a cross about 20), shown at a fixed share of real time (a twenty-metre pass takes about a quarter of a second on screen).
  const BALL_VIEW_S = 6.5; // seconds of match time for each second on screen
  MV.flightMs = (d, cross, lofted) => {
    const M = FM.D.MOVE;
    if (!M) return U.clamp((d / (lofted ? 0.6 : 0.95)) * 1000, 200, 1000);
    const m = d * 105,
      bins = M.ball.pass;
    // the speed from the middle of the nearest length bands, smoothly between them
    const mid = bins.map((b) => (b.from + Math.min(b.to, 60)) / 2),
      sp = bins.map((b) => b.mean);
    let v = sp[sp.length - 1];
    if (m <= mid[0]) v = sp[0];
    else
      for (let i = 1; i < mid.length; i++)
        if (m <= mid[i]) {
          v = sp[i - 1] + ((sp[i] - sp[i - 1]) * (m - mid[i - 1])) / (mid[i] - mid[i - 1]);
          break;
        }
    if (cross && M.ball.cross) v = M.ball.cross.mean;
    return U.clamp((m / v / BALL_VIEW_S) * 1000, 140, 1000);
  };
  // Players: a top speed that follows pace and the real spread of speeds (a sprint is the real 99.9th percentile, an ordinary hard
  // run the 99th), and a limit on how fast the velocity can change (3.3 m/s each second at any speed up to a sprint, a little more
  // when slowing), so a player cannot turn or reach full speed at once. The pitch is not drawn at real time (a match minute
  // lasts about a second), so metres a second become units of the pitch a second by a fixed scale.
  const PLAYER_VIEW_S = 3.4; // seconds of match time for each second on screen, for a player's movement
  MV.paceK = (pace) => 0.8 + 0.4 * (pace / 20);
  MV.vmaxUnits = (pace, sprint) => {
    const S = FM.D.MOVE && FM.D.MOVE.speed.out;
    if (!S) return null;
    return ((sprint ? S.p999 : S.p99) * MV.paceK(pace) * PLAYER_VIEW_S) / 105;
  };
  MV.accelUnits = (vUnits, slowing) => {
    const M = FM.D.MOVE;
    if (!M) return null;
    const ms = (vUnits * 105) / PLAYER_VIEW_S,
      bin = M.accel[Math.min(6, Math.floor(ms))] || M.accel[6];
    const a = Math.abs((slowing ? bin.down : bin.up) || 3.3);
    return (a * PLAYER_VIEW_S * PLAYER_VIEW_S) / 105;
  };

  // the final third's crowding: from where the ball is that far up the pitch (in the attacking side's frame), over how far it builds up,
  // how many attackers join the area and how hard attackers and defenders are pulled to their places
  const PosC = (MV.PosC = { from: 0.7, span: 0.15, att: 4, attPull: 0.95, defPull: 0.75 });
  // ---------- Movement: steering with pace-limited acceleration ----------
  MV.moveDots = function (dt) {
    const st = MV.st,
      m = MV.m,
      b = st.ball;
    if (!st) return;
    st.clockT = (st.clockT || 0) + dt * (st.paused || st.prompt ? 0.2 : 1);
    const t = st.clockT,
      owner = b.side;
    st.targets = st.targets || [[], []];
    m.sides.forEach((sd, k) => {
      const bf = MV.toFrame(k, b.x, b.y);
      const inPoss = owner === k;
      const opp = m.sides[1 - k],
        oppDots = st.dots[1 - k];
      const fr = sd.slots.map((s, i) => {
        const p = FM.Pos(sd, i, inPoss, bf);
        let x = p.x,
          y = p.y;
        if (s.t !== 'GK') {
          // natural shuffle so the shape breathes instead of standing still
          x += 0.008 * Math.sin(t * 0.7 + i * 2.1 + k * 1.3);
          y += 0.012 * Math.sin(t * 0.53 + i * 1.37 + k * 2.2);
          if (inPoss) {
            // timed forward runs by attacking players when the ball is in a good area
            if (['ST', 'W', 'WM', 'AM', 'WB'].includes(s.t) || (s.t === 'FB' && Math.abs(y - bf.y) < 0.35)) {
              const phase = Math.sin(t * 0.45 + i * 1.9 + k);
              if (phase > 0.5 && bf.x > 0.32) {
                const run = (phase - 0.5) / 0.5;
                x += (s.t === 'ST' ? 0.08 : 0.06) * run;
                if (s.t === 'W' || s.t === 'WM' || s.t === 'WB' || s.t === 'FB') y += (y < 0.5 ? -1 : 1) * 0.025 * run;
                else y += (0.5 - y) * 0.15 * run;
              }
            }
          }
        } else {
          // keeper stays between ball and goal
          y = 0.5 + (bf.y - 0.5) * 0.35;
          x = 0.025 + Math.max(0, 0.5 - bf.x) * 0.06;
        }
        return { x, y };
      });
      if (!inPoss) {
        // the back line steps up and drops together, and stays goal-side of the ball
        const back = sd.slots.map((s, i) => i).filter((i) => ['CB', 'FB', 'WB'].includes(sd.slots[i].t));
        if (back.length >= 2) {
          let line = U.avg(back, (i) => fr[i].x);
          line = Math.min(line, Math.max(0.07, bf.x - 0.05));
          // the press and the block show on the pitch as the engine treats them: a high press squeezes up the field behind the
          // ball, a low block drops the line and the banks of players in front of it
          if (sd.tactic.press === 'High Press') line = Math.max(line, Math.min(0.45, bf.x - 0.22));
          else if (sd.tactic.press === 'Low Block') line = Math.min(line, 0.17);
          back.forEach((i) => (fr[i].x = U.lerp(fr[i].x, line, sd.slots[i].t === 'WB' ? 0.5 : 0.8)));
        }
        if (sd.tactic.press === 'Low Block') {
          // two compact banks in front of the box: nobody stays high but the forwards, and the shape narrows
          sd.slots.forEach((sl, i) => {
            if (sl.t === 'GK' || sl.t === 'ST') return;
            fr[i].x = Math.min(fr[i].x, ['CB', 'FB', 'WB'].includes(sl.t) ? 0.2 : 0.36);
            fr[i].y = 0.5 + (fr[i].y - 0.5) * 0.78;
          });
        } else if (sd.tactic.press === 'High Press') {
          // the midfield and forwards push up with the line
          sd.slots.forEach((sl, i) => {
            if (sl.t === 'GK' || ['CB', 'FB', 'WB'].includes(sl.t)) return;
            fr[i].x = Math.max(fr[i].x, Math.min(0.62, bf.x - 0.08));
          });
        }
        // defenders pick up the nearest runner in their zone, goal-side of him
        const att = oppDots.map((d) => MV.toFrame(k, d.x, d.y));
        back.forEach((i) => {
          const z = fr[i],
            a = att
              .map((q, j) => ({ q, j, d: Math.hypot(q.x - z.x, q.y - z.y) }))
              .filter((o) => o.j !== b.slot && opp.slots[o.j].t !== 'GK' && o.d < 0.16)
              .sort((p, q) => p.d - q.d)[0];
          if (a) {
            z.y = U.lerp(z.y, a.q.y, 0.45);
            z.x = Math.min(z.x, a.q.x - 0.025);
          }
        });
      }
      const targets = fr.map((p) => MV.toGlobal(k, U.clamp(p.x, 0.02, 0.98), U.clamp(p.y, 0.03, 0.97)));

      if (inPoss) {
        // two nearest teammates come short to offer angles to the carrier
        const carrier = st.dots[k][b.slot];
        if (carrier && !b.inFlight) {
          targets
            .map((tg, i) => ({ i, d: dist(st.dots[k][i], carrier) }))
            .filter((o) => o.i !== b.slot && sd.slots[o.i].t !== 'GK')
            .sort((p, q) => p.d - q.d)
            .slice(0, 2)
            .forEach(({ i }, n) => {
              targets[i].x = U.lerp(targets[i].x, carrier.x - dir(k) * 0.02, 0.22);
              targets[i].y = U.lerp(targets[i].y, carrier.y + (n ? 0.09 : -0.09), 0.25);
            });
          // the carrier himself drives forward gently when not in an action
          if (!st.act) {
            targets[b.slot] = { x: U.clamp(carrier.x + dir(k) * 0.03, 0.04, 0.96), y: U.lerp(carrier.y, 0.5, 0.05) };
          }
        }
      } else {
        // press the ball, and cut the nearest passing lane
        const n = sd.tactic.press === 'High Press' ? 2 : 1,
          pull = { 'High Press': 0.75, 'Mid Block': 0.55, 'Low Block': 0.35 }[sd.tactic.press];
        const near = targets
          .map((tg, i) => ({ i, d: dist(st.dots[k][i], b) }))
          .filter((o) => sd.slots[o.i].t !== 'GK')
          .sort((p, q) => p.d - q.d);
        // the nearest presser closes down goal-side of the ball and jockeys; a second one (high press) shows him wide
        near.slice(0, n).forEach(({ i }, j) => {
          const gx = b.x - dir(k) * (j ? 0.05 : 0.028),
            gy = b.y + (j ? (b.y < 0.5 ? 0.04 : -0.04) : 0);
          targets[i].x = U.lerp(targets[i].x, gx, j ? pull * 0.8 : Math.max(pull, 0.85));
          targets[i].y = U.lerp(targets[i].y, gy, j ? pull * 0.8 : Math.max(pull, 0.85));
        });
        const outlet = oppDots
          .map((d, i) => ({ d, i }))
          .filter((o) => o.i !== b.slot && opp.slots[o.i].t !== 'GK')
          .sort((p, q) => dist(p.d, b) - dist(q.d, b))[0];
        const cover = near[n];
        if (outlet && cover) {
          targets[cover.i].x = U.lerp(targets[cover.i].x, (outlet.d.x + b.x) / 2, 0.55);
          targets[cover.i].y = U.lerp(targets[cover.i].y, (outlet.d.y + b.y) / 2, 0.55);
        }
      }

      // celebrations: scorer to the corner flag, team-mates follow
      if (st.celebrate) {
        const C = st.celebrate,
          sc = st.dots[C.side][C.slot];
        if (k === C.side && sc) {
          const corner = { x: C.side === 0 ? 0.97 : 0.03, y: sc.y < 0.5 ? 0.04 : 0.96 };
          targets[C.slot] = corner;
          targets.forEach((tg, i) => {
            if (i !== C.slot && sd.slots[i].t !== 'GK') {
              tg.x = U.lerp(tg.x, corner.x, 0.35);
              tg.y = U.lerp(tg.y, corner.y, 0.35);
            }
          });
        }
      }
      // The final third is crowded, as real goals are (the Last Row goals: about three attackers and six defenders in the area at the
      // shot): when the ball is near the goal a few attackers go into the area around it, and most of the defending side drops into
      // its own area, shading toward the ball's side.
      if (!st.cor) {
        // (a minute that ends in a shot is known to the view: the attacking side starts moving into the area from its start; a long
        // shot or a counter brings fewer men)
        const ch = st.chance,
          att = ch ? ch.side : owner,
          ba = MV.toFrame(att, b.x, b.y), // the ball in the attacking side's frame
          wC = ch ? 1 : U.clamp((ba.x - PosC.from) / PosC.span, 0, 1),
          few = ch && !ch.full;
        if (wC > 0) {
          if (k === att) {
            const n = few ? 2 : PosC.att;
            targets
              .map((tg, i) => ({ tg, i, t: sd.slots[i].t, d: (tg.x - b.x) ** 2 + (tg.y - b.y) ** 2 }))
              .filter((o) => ['ST', 'W', 'AM', 'WM', 'CM'].includes(o.t))
              .sort((x, y) => x.d - y.d)
              .slice(0, n)
              .forEach((o, r) => {
                const g = MV.toGlobal(
                  k,
                  U.clamp(Math.max(ba.x, 0.88) + (r % 2 ? -0.03 : 0.01), 0.86, 0.95),
                  U.clamp(ba.y + (r - (n - 1) / 2) * 0.07, 0.3, 0.7),
                );
                o.tg.x = U.lerp(o.tg.x, g.x, PosC.attPull * wC);
                o.tg.y = U.lerp(o.tg.y, g.y, PosC.attPull * wC);
              });
          } else {
            const by = MV.toFrame(k, b.x, b.y).y;
            targets.forEach((tg, i) => {
              const s = sd.slots[i];
              if (!s || s.t === 'GK' || ((s.t === 'ST' || s.t === 'W') && i % 2)) return; // (a forward or a winger stays up)
              const g = MV.toGlobal(
                k,
                0.07 + 0.1 * (((i * 7) % 5) / 4),
                U.clamp(0.5 + (((i * 3) % 9) - 4) * 0.04 + (by - 0.5) * 0.4, 0.2, 0.8),
              );
              tg.x = U.lerp(tg.x, g.x, PosC.defPull * wC * (few ? 0.5 : 1));
              tg.y = U.lerp(tg.y, g.y, PosC.defPull * wC * (few ? 0.5 : 1));
            });
          }
        }
      }
      // a corner: most of both teams crowd into the area, the attackers staggered across it, the defenders marking
      if (st.cor && !st.layout)
        targets.forEach((tg, i) => {
          const s = sd.slots[i];
          if (!s || s.t === 'GK') return;
          const att = k === st.cor.side;
          if (att ? ['FB', 'WB', 'DM'].includes(s.t) && i % 2 : s.t === 'ST' && i % 2) return; // (a couple stay back, a forward stays up)
          const g = MV.toGlobal(
            k,
            att ? 0.84 + 0.1 * (((i * 7) % 5) / 4) : 0.05 + 0.1 * (((i * 7) % 5) / 4),
            0.5 + (((i * 3) % 9) - 4) * 0.045,
          );
          tg.x = U.lerp(tg.x, g.x, 0.8);
          tg.y = U.lerp(tg.y, g.y, 0.8);
        });
      // a corner, throw-in or goal kick: the places of a real layout (StatsBomb 360), for the players assigned to them
      if (st.layout) for (const L of st.layout) if (L.k === k) targets[L.i] = { x: L.x, y: L.y };
      // a direct free kick: a wall of two to five (by how far from goal), nine and a bit metres from the ball on the line to the middle of
      // the goal, the defenders nearest to that place making it
      if (st.wall && k !== st.wall.side) {
        const Wl = st.wall,
          bxm = Wl.x * 105,
          bym = Wl.y * 68,
          dm = Math.hypot(105 - bxm, 34 - bym) || 1,
          ux = (105 - bxm) / dm,
          uy = (34 - bym) / dm,
          bd = dm < 20 ? 0 : dm < 26 ? 1 : dm < 32 ? 2 : 3,
          WB = FM.D.LAYOUTS && FM.D.LAYOUTS.freekick.bands[bd], // (real walls: 6, 4 or 5, 2 and 1 men by distance, 9 to 10 m from the ball)
          n = WB ? Math.max(1, Math.round(WB.wallMen)) : dm < 20 ? 5 : dm < 26 ? 4 : dm < 32 ? 3 : 2,
          wd = WB ? WB.wallDist : 9.15,
          cx = bxm + ux * wd,
          cy = bym + uy * wd,
          mid = MV.toGlobal(Wl.side, cx / 105, cy / 68);
        const wallIds = new Set(),
          ball = MV.toGlobal(Wl.side, Wl.x, Wl.y);
        targets
          .map((tg, i) => ({ i, d: dist(st.dots[k][i], mid) }))
          .filter((o) => sd.slots[o.i].t !== 'GK')
          .sort((p, q) => p.d - q.d)
          .slice(0, n)
          .forEach((o, r) => {
            const off = (r - (n - 1) / 2) * 0.9,
              g = MV.toGlobal(Wl.side, (cx - uy * off) / 105, (cy + ux * off) / 68);
            targets[o.i] = { x: g.x, y: g.y, sprint: true };
            st.override[`${k}:${o.i}`] = targets[o.i];
            wallIds.add(o.i);
          });
        // nobody else of the defending side stands within the ten metres of the ball
        targets.forEach((tg, i) => {
          if (wallIds.has(i) || sd.slots[i].t === 'GK') return;
          const dx = (tg.x - ball.x) * 105,
            dy = (tg.y - ball.y) * 68,
            m = Math.hypot(dx, dy);
          if (m < 10) {
            tg.x = ball.x + ((dx || 1) / (m || 1)) * (10 / 105);
            tg.y = ball.y + (dy / (m || 1)) * (10 / 68);
          }
        });
      }
      // a restart from the centre spot: both sides in their own halves, the side without the ball outside the circle, the kicker on the
      // ball with the man he passes to beside him
      if (st.restart) {
        const R = st.restart;
        targets.forEach((tg, i) => {
          const s = sd.slots[i];
          if (!s || s.t === 'GK') return;
          const f = MV.toFrame(k, tg.x, tg.y),
            g = MV.toGlobal(k, Math.min(f.x, k === R.side ? 0.47 : 0.37), f.y);
          tg.x = g.x;
          tg.y = g.y;
        });
        if (k === R.side) {
          if (R.kicker != null) targets[R.kicker] = { x: 0.5, y: 0.5 };
          if (R.to != null && R.to !== R.kicker) targets[R.to] = MV.toGlobal(k, 0.46, 0.55);
        }
      }
      // action overrides (receiver running onto a pass, dribbler, diving keeper)
      for (const key in st.override || {}) {
        const [ks, is] = key.split(':');
        if (+ks === k) targets[+is] = st.override[key];
      }
      st.targets[k] = targets;

      targets.forEach((tg, i) => {
        const d = st.dots[k][i],
          p = sd.xi[i];
        if (!d) return;
        d.vx = d.vx || 0;
        d.vy = d.vy || 0;
        const energy = p && sd.st[p.id] != null ? 0.75 + 0.25 * (sd.st[p.id] / 100) : 1;
        const pace = p ? p.attrs.pace : 10;
        const ov = st.override && st.override[`${k}:${i}`];
        const real = MV.vmaxUnits(pace, ov && ov.sprint);
        let vmax =
          (real == null ? (0.13 + 0.09 * (pace / 20)) * (ov && ov.sprint ? 1.45 : 1) : real) *
          energy *
          (ov && ov.dive ? 2.2 : 1) *
          Math.max(1, st.speed * 0.75);
        if (st.celebrate && st.celebrate.side === k) vmax *= 1.2;
        else if (!ov && Math.hypot(tg.x - d.x, tg.y - d.y) < 0.08) vmax *= 0.6; // jog into shape, sprint to recover
        let dvx = (tg.x - d.x) * 3.2,
          dvy = (tg.y - d.y) * 3.2;
        const sp = Math.hypot(dvx, dvy);
        if (sp > vmax) {
          dvx *= vmax / sp;
          dvy *= vmax / sp;
        }
        // the velocity moves toward what the player wants no faster than a player can speed up, slow down or turn
        const sp0 = Math.hypot(d.vx, d.vy),
          aMax = MV.accelUnits(sp0, Math.hypot(dvx, dvy) < sp0);
        if (aMax == null || (ov && ov.dive)) {
          const acc = Math.min(1, dt * (ov ? 9 : 5));
          d.vx += (dvx - d.vx) * acc;
          d.vy += (dvy - d.vy) * acc;
        } else {
          const ex = dvx - d.vx,
            ey = dvy - d.vy,
            e = Math.hypot(ex, ey),
            step = aMax * dt * Math.max(1, st.speed * 0.75) * Math.max(1, st.speed * 0.75); // (the faster the view runs, the faster players can change pace)
          if (e <= step) ((d.vx = dvx), (d.vy = dvy));
          else ((d.vx += (ex / e) * step), (d.vy += (ey / e) * step));
        }
        d.x += d.vx * dt;
        d.y += d.vy * dt;
      });
    });

    // Nobody stands on anybody: players closer than a stride ease apart (the ball carrier holds his line)
    const all = [];
    st.dots.forEach((side, k) => side.forEach((d, i) => d && all.push({ d, k, i })));
    for (let i = 0; i < all.length; i++)
      for (let j = i + 1; j < all.length; j++) {
        const A = all[i].d,
          B = all[j].d,
          dx = B.x - A.x,
          dy = B.y - A.y,
          L = Math.hypot(dx, dy),
          min = all[i].k === all[j].k ? 0.04 : 0.02;
        if (L >= min || L === 0) continue;
        const push = (min - L) * Math.min(1, dt * 6),
          ux = dx / L,
          uy = dy / L;
        const holdA = all[i].k === b.side && all[i].i === b.slot,
          holdB = all[j].k === b.side && all[j].i === b.slot;
        if (!holdA) ((A.x -= ux * push * (holdB ? 1 : 0.5)), (A.y -= uy * push * (holdB ? 1 : 0.5)));
        if (!holdB) ((B.x += ux * push * (holdA ? 1 : 0.5)), (B.y += uy * push * (holdA ? 1 : 0.5)));
      }
    // Ball at the carrier's feet, slightly ahead in the direction he's moving
    if (!st.act || st.act.kind === 'carry') {
      const d = st.dots[b.side] && st.dots[b.side][b.slot];
      if (d) {
        const v = Math.hypot(d.vx || 0, d.vy || 0);
        const fx = v > 0.01 ? d.vx / v : dir(b.side),
          fy = v > 0.01 ? d.vy / v : 0;
        const tx = d.x + fx * 0.011,
          ty = d.y + fy * 0.011;
        st.touch = Math.max(0, (st.touch || 0) - dt);
        const k = Math.min(1, dt * (st.touch > 0 ? 7 : 18));
        b.x = U.lerp(b.x, tx, k);
        b.y = U.lerp(b.y, ty, k);
        b.h = 0;
      }
    }
    st.trail.push([b.x, b.y]);
    if (st.trail.length > 10) st.trail.shift();
  };

  // Dots now carry velocity
  const origInit = MV.initDots;
  MV.initDots = function () {
    origInit();
    MV.st.dots.forEach((side) =>
      side.forEach((d) => {
        d.vx = 0;
        d.vy = 0;
      }),
    );
    MV.st.override = {};
    MV.st.celebrate = null;
  };
})();

// Help, backups and the end of the season: report a problem, send feedback, What's new, exporting and importing a save, the
// database export, and the season review (with its league follow chips). Split from ui-screens.js.
(function () {
  const FM = window.FM,
    U = FM.U,
    W = FM.W,
    UI = FM.UI,
    C = UI.C;
  const esc = U.esc;
  const S = () => FM.S;
  const NOCLUB = { colors: ['#1b2533', '#0c1118'], short: '', name: '' };
  const CL = (id) => FM.S.clubs[id];

  // ---------- Help: report a problem, feedback, what's new ----------
  // What a report carries: the version, the build, the platform and where the save stands: nothing personal
  UI.diagnostics = async function () {
    const s = S(),
      m = FM.Save.metaOf ? FM.Save.metaOf(UI.slot) : null;
    let kb = '';
    try {
      const raw = await FM.Save.read(UI.slot);
      kb = raw ? ` · save ${Math.round(raw.length / 1024)} KB` : '';
    } catch (e) {
      /* no size */
    }
    const build = ((document.querySelector('script[src*="core.js"]') || {}).src || '').match(/v=(\d+)/);
    const cap = window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web';
    return [
      `Touchline ${FM.VERSION} (build ${build ? build[1] : '?'}) · ${cap} · save format ${FM.SAVE_VERSION}${kb}`,
      s && s.user
        ? `Season ${s.year}, day ${s.day} of ${(s.calendar || []).length}${m && m.club ? ' · ' + m.club.name : ''}`
        : 'No career open',
      `${navigator.userAgent.slice(0, 120)}`,
    ].join('\n');
  };
  // The parts of the game a report can be about: they go on each report as its area, so the developer can group what comes in
  UI.REPORT_AREAS = [
    'Match day',
    'Squad and tactics',
    'Transfers and contracts',
    'Finances',
    'Youth and training',
    'Fixtures and competitions',
    'Screens and text',
    'Saving and loading',
    'Speed',
    'Something else',
  ];
  // Where a report or a piece of feedback is posted when the game has a private inbox: the address of tools/inbox.mjs (or anything
  // that takes the same POST). Empty: feedback opens the project page, and a report is shared as a file.
  UI.INBOX_URL = '';
  // The tag on everything sent: the version, the build, the platform and the area the player picked
  UI.reportTag = () => {
    const build = ((document.querySelector('script[src*="core.js"]') || {}).src || '').match(/v=(\d+)/);
    return {
      version: FM.VERSION,
      build: build ? +build[1] : null,
      platform: window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web',
      saveFormat: FM.SAVE_VERSION,
      area: (document.getElementById('help-area') || {}).value || '',
      at: Date.now(),
    };
  };
  const helpSheet = async (title, intro, ph, buttons, opts = {}) => {
    const diag = await UI.diagnostics();
    UI.sheet(
      `<div class="small dim" style="line-height:1.5">${intro}</div>
      <div class="tiny dim" style="margin-top:10px">What was it about?</div>
      <select id="help-area" style="width:100%;margin-top:4px;padding:10px;border-radius:12px;border:1px solid var(--line2)">${UI.REPORT_AREAS.map((a) => `<option>${esc(a)}</option>`).join('')}</select>
      <textarea id="help-text" rows="5" placeholder="${ph}" style="width:100%;margin-top:10px;padding:10px;border-radius:12px;border:1px solid var(--line2);background:var(--card2);color:var(--ink);font:inherit"></textarea>
      ${opts.contact ? `<input id="help-contact" type="email" autocomplete="email" placeholder="Your email, only if you would like a reply" style="width:100%;margin-top:8px;padding:10px;border-radius:12px;border:1px solid var(--line2);background:var(--card2);color:var(--ink);font:inherit">` : ''}
      <div class="tiny dim" style="margin-top:8px;white-space:pre-line">${esc(diag)}</div>
      ${buttons.map(([act, label, pri]) => `<button class="btn ${pri ? 'pri' : ''} block" style="margin-top:12px" data-act="${act}">${label}</button>`).join('')}`,
      { title },
    );
  };
  // Posts to the inbox; throws when there is none or it does not answer
  UI.postInbox = async (payload) => {
    if (!UI.INBOX_URL) throw new Error('No inbox');
    const r = await fetch(UI.INBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`The inbox answered ${r.status}`);
  };
  const b64 = (bytes) => {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };
  UI.acts.reportProblem = () =>
    helpSheet(
      'Report a problem',
      UI.INBOX_URL
        ? 'Describe what went wrong. The report is sent privately to the developer with your save and the version details below; nothing is made public. You can also keep it as a file to send yourself.'
        : 'Describe what went wrong. The report is your save as a backup file, with the version details below; it goes wherever you share it (email, messages, a file).',
      'What happened, and what were you doing?',
      UI.INBOX_URL
        ? [
            ['sendReport', '⬆️ Send the report', true],
            ['shareReport', '📎 Keep it as a file instead'],
          ]
        : [['shareReport', '⬆️ Share the report', true]],
    );
  // The report is the save with a "report" section: the note, the tag and the details, so the file says what it is about
  UI.makeReport = async (kind) => {
    const note = (document.getElementById('help-text') || {}).value || '';
    if (FM.S && FM.S.user) await FM.Save.write(UI.slot, S());
    const report = { kind, note, ...UI.reportTag(), diag: await UI.diagnostics() };
    const f = await FM.Save.exportFile(UI.slot, report);
    return { report, f, note };
  };
  UI.acts.sendReport = async () => {
    try {
      const { report, f } = await UI.makeReport('problem');
      await UI.postInbox({ ...report, name: f.name, file: b64(f.bytes) });
      UI.closeSheet();
      UI.toast('Report sent. Thank you', 3500);
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ Could not send it: use “Keep it as a file instead”', 4500);
    }
  };
  UI.acts.shareReport = async () => {
    try {
      const { f, note } = await UI.makeReport('problem');
      const r = await FM.Native.shareFile({
        bytes: f.bytes,
        name: f.name.replace(/^touchline-/, 'touchline-problem-'),
        type: f.type,
        title: 'Touchline problem report',
        text: `${note}\n\n${await UI.diagnostics()}`,
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      UI.closeSheet();
      if (r !== 'cancelled')
        UI.toast(r === 'saved' ? 'Report saved: send the file to us' : 'Report ready to send', 3500);
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ ' + (e.message || 'Could not make the report'), 4000);
    }
  };
  UI.FEEDBACK_URL = 'https://github.com/tpkhoon/touchline/issues/new';
  UI.acts.sendFeedback = () =>
    helpSheet(
      'Send feedback',
      UI.INBOX_URL
        ? 'An idea, something confusing, something you loved? It is sent privately to the developer with the version details attached; no save is sent and no account is needed.'
        : 'An idea, something confusing, something you loved? It opens a new note on the project page with the version details attached; no save is sent.',
      'What would make the game better?',
      [['sendFeedbackGo', UI.INBOX_URL ? '💬 Send the feedback' : '💬 Open the feedback page', true]],
      { contact: !!UI.INBOX_URL },
    );
  UI.acts.sendFeedbackGo = async () => {
    const note = (document.getElementById('help-text') || {}).value || '';
    const tag = UI.reportTag();
    if (UI.INBOX_URL) {
      try {
        await UI.postInbox({
          kind: 'feedback',
          note,
          ...tag,
          contact: ((document.getElementById('help-contact') || {}).value || '').slice(0, 120),
          diag: await UI.diagnostics(),
        });
        UI.closeSheet();
        return UI.toast('Thank you: your feedback was sent', 3500);
      } catch (e) {
        console.warn(e);
        UI.toast('⚠️ Could not send it just now. Try again later', 4000);
        return;
      }
    }
    const url = `${UI.FEEDBACK_URL}?title=${encodeURIComponent('Feedback: ' + (note.split('\n')[0].slice(0, 60) || 'my thoughts'))}&body=${encodeURIComponent(`${note}\n\nArea: ${tag.area} · version ${tag.version}\n\n---\n${await UI.diagnostics()}`)}`;
    window.open(url, '_blank', 'noopener');
    UI.closeSheet();
  };
  UI.acts.whatsNew = () =>
    UI.sheet(
      `<div class="tiny dim" style="margin-bottom:8px">The latest builds, newest first.</div>${
        (FM.CHANGELOG || [])
          .map(
            (b) =>
              `<div class="card flat" style="margin-bottom:8px"><div class="b">${esc(b.build)}</div>${
                b.items
                  ? `<ul class="small dim" style="margin:6px 0 0;padding-left:18px;line-height:1.5">${b.items.map((i) => `<li style="margin-bottom:4px">${i.lead ? `<b style="color:var(--ink)">${esc(i.lead)}.</b> ` : ''}${esc(i.text)}</li>`).join('')}</ul>`
                  : `<div class="small dim" style="margin-top:4px;line-height:1.5">${esc(b.text)}</div>`
              }</div>`,
          )
          .join('') || '<div class="empty">Nothing recorded yet.</div>'
      }`,
      { title: "What's new", full: true },
    );
  // ---------- Backups ----------
  // The world as a database file (a world definition: FM.DbImport reads it back)
  UI.acts.exportDb = async (d) => {
    try {
      const withPlayers = d.p === '1';
      const bytes = new TextEncoder().encode(FM.DbImport.export({ withPlayers }));
      const name = `touchline-database-${S().year}${withPlayers ? '-players' : ''}.json`;
      const r = await FM.Native.shareFile({
        bytes,
        name,
        type: 'application/json',
        title: 'Touchline database',
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      if (r !== 'cancelled')
        UI.toast(
          `Database ${r === 'saved' ? 'saved' : 'ready'}: ${name} (${Math.max(1, Math.round(bytes.length / 1024))} KB)`,
          3500,
        );
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ ' + (e.message || 'Export failed'), 4000);
    }
  };
  UI.acts.exportSave = async () => {
    try {
      await FM.Save.write(UI.slot, S());
      const f = await FM.Save.exportFile(UI.slot);
      const r = await FM.Native.shareFile({
        bytes: f.bytes,
        name: f.name,
        type: f.type,
        title: 'Touchline backup',
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      if (r !== 'cancelled') {
        // Remember when (real date and game date) for the Settings line and the season-end reminder
        S().settings.lastBackup = { at: Date.now(), year: S().year, day: S().day };
        UI.save();
        document.getElementById('backupNudge')?.remove();
        if (UI.tab === 'club' && UI.sub.club === 'settings' && !document.querySelector('.sheet-wrap')) UI.render();
        UI.toast(
          `Backup ${r === 'saved' ? 'saved' : 'ready'}: ${f.name} (${Math.max(1, Math.round(f.bytes.length / 1024))} KB)`,
          3500,
        );
      }
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ ' + (e.message || 'Export failed'), 4000);
    }
  };
  UI.acts.importSave = async () => {
    const bytes = await FM.Native.pickFile('');
    if (!bytes) return;
    let res;
    try {
      res = await FM.Save.importBytes(bytes);
    } catch (e) {
      return UI.toast('⚠️ ' + e.message, 4500);
    }
    UI._import = res.state;
    const st = res.state,
      // (a backup made out of work has no club: shown by the manager's name, with a plain badge)
      c = st.clubs[st.user.clubId] || {
        id: 'none',
        name: `${st.user.name} (out of work)`,
        short: '—',
        colors: ['#334155', '#94a3b8'],
      };
    UI.sheet(
      `<div class="card row">${C.crest(c, 36)}<div class="grow"><div class="b">${esc(c.name)}</div><div class="small dim">${esc(st.user.name)} · ${st.year} · day ${st.day + 1}${res.from < FM.Save.VERSION ? ` · upgraded from v${res.from}` : ''}</div></div></div>
      <div class="h3" style="margin:10px 0 6px">Import into</div>
      <div class="list">${FM.Save.SLOTS.map((n) => {
        const m = UI.slotMeta(n);
        return `<div class="prow tap" data-act="importTo" data-n="${n}"><b style="width:52px">Slot ${n}</b><div class="grow small ${m ? '' : 'dim'}">${m ? `${esc(m.club.name)} · ${m.year} — <span style="color:var(--bad)">will be replaced</span>` : 'Empty'}</div><span class="dim">›</span></div>`;
      }).join('')}</div>`,
      { title: 'Import backup' },
    );
  };
  UI.acts.importTo = async (d) => {
    const st = UI._import,
      n = +d.n;
    if (!st) return;
    try {
      await FM.Save.write(n, st);
      UI._import = null;
      UI.closeAllSheets();
      if (!(await UI.load(n))) return;
      UI.applyTheme();
      UI.tab = 'home';
      UI.mount();
      UI.toast(`Backup imported into slot ${n}`, 3000);
      UI.finishPendingDay();
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ Could not import: ' + (e.message || 'storage error'), 4500);
    }
  };
  UI.acts.toTitle = () => {
    UI.save();
    UI.title();
  };

  // ---------- Season review ----------
  // The biggest leagues (by the reputation of their clubs) with a tap to follow, for the review's list of leagues
  const followPicks = () => {
    const fol = UI.follows().comps;
    const top = Object.values(S().comps)
      .filter((c) => c.type === 'league' && c.tier === 1 && c.clubs.length)
      .map((c) => ({ c, r: U.avg(c.clubs, (id) => (S().clubs[id] || { rep: 0 }).rep) }))
      .sort((a, b) => b.r - a.r)
      .slice(0, 8)
      .map((x) => x.c);
    if (!top.length) return '';
    return `<div class="tiny dim" style="margin-top:10px">Follow more leagues: their champions are listed here next season.</div><div class="chips" style="flex-wrap:wrap;margin-top:6px">${top
      .map(
        (c) =>
          `<button class="chip ${fol.includes(c.id) ? 'on' : ''}" data-act="reviewFollow" data-id="${esc(c.id)}">${C.flag(c.nat)} ${esc(c.name)}</button>`,
      )
      .join('')}</div>`;
  };
  UI.acts.reviewFollow = (d, el) => {
    const f = UI.follows(),
      on = f.comps.includes(d.id);
    f.comps = on ? f.comps.filter((x) => x !== d.id) : f.comps.concat(d.id);
    UI.save();
    if (el) el.classList.toggle('on', !on);
  };
  UI.seasonReview = function (sm) {
    const e = sm.entry;
    const c = e.user ? CL(e.user.club) : NOCLUB; // out of work all season: no club to review
    // only the leagues you follow (and your own) are told about: the whole world's champions would be a long list
    const fol = new Set([...UI.follows().comps, ...(e.user && e.user.comp ? [e.user.comp] : [])]),
      shown = Object.entries(e.comps).filter(([id]) => fol.has(id)),
      cupsShown = Object.entries(e.cups || {}).filter(([id, x]) => fol.has(id) || FM.W.isUser(x.winner));
    UI.sheet(
      `<div class="hero" style="--c1:${U.heroShade(c.colors[0])};--c2:${U.heroShade(c.colors[1])}"><div class="tag">Season review · ${esc(e.label)}</div><div class="h1" style="margin:10px 0">${!e.user ? 'A season out of the dugout' : sm.trophies.length ? '🏆 ' + esc(sm.trophies.join(' & ')) : `Finished ${U.ordinal(sm.userPos)}`}</div><div class="small" style="opacity:.9">${sm.promoted ? `⬆️ Promoted to the ${esc(S().comps[c.comp].name)}!` : sm.relegated ? '⬇️ Relegated. The rebuild starts now.' : esc(c.name)}</div></div>
      ${!e.user ? '<div class="small muted" style="margin:4px 2px 12px">The football world carried on without you. Your offers are on the Home tab.</div>' : ''}
      ${e.user ? `<div class="card"><div class="h3">Board verdict</div>${sm.objs.map((o) => `<div class="row small" style="margin-top:8px"><span>${o.ok || (o.promo && sm.promoted) ? '✅' : '❌'}</span><span class="grow">${esc(o.text)}</span></div>`).join('')}<div class="small muted" style="margin-top:10px">${sm.sacked ? 'The board have seen enough.' : 'Board confidence: ' + Math.round(c.boardConf) + '%'}</div></div>` : ''}
      ${shown
        .map(([, x]) => x)
        .filter(W.homeLeague)
        .map(
          (x) =>
            `<div class="card flat"><div class="small b dim">${esc(x.name.toUpperCase())}</div><div class="row small" style="margin-top:6px">🏆 ${C.crest(CL(x.champion), 18)}<b class="grow">${esc(CL(x.champion).name)}</b></div>${x.topScorer ? `<div class="small" style="margin-top:4px">👟 ${esc(x.topScorer.name)} (${x.topScorer.goals})</div>` : ''}${x.poty ? `<div class="small" style="margin-top:4px">⭐ ${esc(x.poty.name)}</div>` : ''}</div>`,
        )
        .join('')}
      <div class="card flat"><div class="small b dim">LEAGUES YOU FOLLOW</div>${
        shown
          .map(([, x]) => x)
          .filter((x) => !W.homeLeague(x))
          .map(
            (x) =>
              `<div class="row small" style="margin-top:6px">${C.flag(x.nat)} <span class="grow ellip">${esc(x.name)}</span>${C.crest(CL(x.champion), 16)} <b>${esc(CL(x.champion).short)}</b></div>`,
          )
          .join('') ||
        '<div class="tiny dim" style="margin-top:6px">Follow a league (☆ on its screen) to see its champion here.</div>'
      }${followPicks()}</div>
      ${UI.regionalSeason(e, true)}
      ${
        cupsShown.length
          ? `<div class="card flat"><div class="small b dim">CUPS</div>${cupsShown
              .map(([, x]) => x)
              .map(
                (x) =>
                  `<div class="row small" style="margin-top:6px">🏆 <span class="grow">${esc(x.name)}</span>${C.crest(CL(x.winner), 16)} <b>${esc(CL(x.winner).short)}</b></div>`,
              )
              .join('')}</div>`
          : ''
      }
      ${e.intl && e.intl.length ? `<div class="card flat"><div class="small b dim">THIS SUMMER</div>${e.intl.map((x) => `<div class="row small" style="margin-top:6px">🌍 <span class="grow">${esc(x.name)}</span><b>${C.flag(FM.S.nteams[x.winner].code)} ${esc(FM.S.nteams[x.winner].name)}</b></div>`).join('')}</div>` : ''}
      ${UI.backupDue() ? `<div class="warnline row" id="backupNudge" style="gap:10px"><span class="grow">💾 A good moment to export a backup of your career — one small file, safe anywhere.</span><button class="btn sm" data-act="exportSave">Export</button></div>` : ''}
      <div class="small muted center" style="margin:10px 0">Everything has been written into the Football Archive.<br>Players have aged, contracts expired, veterans retired, and the world moved on — check the feed.</div>
      <button class="btn pri block" data-act="closeSheet">Start ${FM.Season.seasonLabel()} →</button>`,
      { title: 'End of season' },
    );
  };
})();

// A private inbox for feedback and problem reports: a small server that takes what the game posts (Report a problem → Send, and
// Send feedback) and keeps it in a folder, so a player needs no GitHub account and nothing is public. Put it behind whatever
// gives it an https address (a tunnel, a small server), set UI.INBOX_URL in js/ui-screens.js to that address, and read what
// arrives on the dashboard's Reports tab, where it is grouped by version and area.
//   node tools/inbox.mjs [--port 5191] [--dir .devtools/inbox] [--host 127.0.0.1] [--max-per-hour 20]
// What it accepts: one JSON object by POST: { kind: 'problem' | 'feedback', note, version, build, platform, saveFormat, area, at,
// diag, contact?, name?, file? }. For a problem, `file` is the report (a save with a "report" section) as base64; it is written
// beside the note as a .touchline file the report inspector opens. Everything is size-limited and nothing is ever run.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseArgs, ROOT } from './harness.mjs';

export const INBOX = path.join(ROOT, '.devtools', 'inbox');

// Reads the folder: one row per item, newest first
export function readInbox(dir = INBOX) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        return {
          id: f.replace(/\.json$/, ''),
          ...j,
          hasFile: fs.existsSync(path.join(dir, f.replace(/\.json$/, '.touchline'))),
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b.received || 0) - (a.received || 0));
}
// Groups by version and area: what the inspector shows first
export function groupInbox(rows) {
  const by = new Map();
  for (const r of rows) {
    const k = `${r.version || '?'}|${r.area || '—'}`;
    if (!by.has(k)) by.set(k, { version: r.version || '?', area: r.area || '—', problems: 0, feedback: 0, ids: [] });
    const g = by.get(k);
    g[r.kind === 'problem' ? 'problems' : 'feedback']++;
    g.ids.push(r.id);
  }
  return [...by.values()].sort((a, b) => b.problems + b.feedback - (a.problems + a.feedback));
}

const clip = (v, n) => String(v == null ? '' : v).slice(0, n);

export function startInbox({ port = 5191, host = '127.0.0.1', dir = INBOX, perHour = 20 } = {}) {
  fs.mkdirSync(dir, { recursive: true });
  const seen = new Map(); // ip → [times]
  const server = http.createServer((req, res) => {
    const head = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    const reply = (code, body) => {
      res.writeHead(code, { 'Content-Type': 'application/json', ...head });
      res.end(JSON.stringify(body));
    };
    if (req.method === 'OPTIONS') return reply(204, {});
    if (req.method === 'GET') return reply(200, { ok: true, inbox: true });
    if (req.method !== 'POST') return reply(405, { error: 'POST only' });
    const ip = req.socket.remoteAddress || '?';
    const now = Date.now();
    const times = (seen.get(ip) || []).filter((t) => now - t < 3600e3);
    if (times.length >= perHour) return reply(429, { error: 'Too many today' });
    let size = 0;
    const chunks = [];
    req.on('data', (d) => {
      size += d.length;
      if (size > 40e6) req.destroy();
      else chunks.push(d);
    });
    req.on('end', () => {
      let b;
      try {
        b = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch (e) {
        return reply(400, { error: 'Not JSON' });
      }
      if (!b || !['problem', 'feedback'].includes(b.kind)) return reply(400, { error: 'Unknown kind' });
      times.push(now);
      seen.set(ip, times);
      const id = `${new Date(now).toISOString().replace(/[-:T]/g, '').slice(0, 14)}-${b.kind}-${crypto.randomBytes(3).toString('hex')}`;
      const item = {
        kind: b.kind,
        received: now,
        note: clip(b.note, 5000),
        version: clip(b.version, 20),
        build: Number.isFinite(+b.build) ? +b.build : null,
        platform: clip(b.platform, 20),
        saveFormat: Number.isFinite(+b.saveFormat) ? +b.saveFormat : null,
        area: clip(b.area, 60),
        at: Number.isFinite(+b.at) ? +b.at : null,
        contact: clip(b.contact, 120),
        diag: clip(b.diag, 6000),
      };
      fs.writeFileSync(path.join(dir, id + '.json'), JSON.stringify(item, null, 1));
      if (b.kind === 'problem' && typeof b.file === 'string' && /^[A-Za-z0-9+/=]+$/.test(b.file))
        fs.writeFileSync(path.join(dir, id + '.touchline'), Buffer.from(b.file, 'base64'));
      reply(200, { ok: true, id });
    });
  });
  return new Promise((resolve) => server.listen(port, host, () => resolve(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const args = parseArgs();
  const port = +(args.port || 5191),
    host = args.host || '127.0.0.1';
  await startInbox({
    port,
    host,
    dir: args.dir ? path.resolve(String(args.dir)) : INBOX,
    perHour: +(args['max-per-hour'] || 20),
  });
  console.log(
    `Touchline inbox: POST to http://${host}:${port}/  (kept in ${path.relative(ROOT, args.dir ? path.resolve(String(args.dir)) : INBOX)})`,
  );
}

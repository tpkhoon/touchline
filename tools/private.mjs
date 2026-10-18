// The files that are not in this repository: the real-world names database and the real-world pack built from it. They live in a
// private folder beside the repository (touchline-private/), or wherever TOUCHLINE_PRIVATE points, so that nothing in the project's
// history or its site carries real clubs or players. The tools that need them say so and skip when the folder is not there (as in CI).
//   touchline-private/real-world.json              each club's real structure and names, keyed by club code
//   touchline-private/packs/real-world.json        the real-world pack (made by tools/realplayers-build.mjs)
//   touchline-private/packs/real-world-sources.txt where its squads came from
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PRIVATE = process.env.TOUCHLINE_PRIVATE
  ? path.resolve(process.env.TOUCHLINE_PRIVATE)
  : path.resolve(ROOT, '..', 'touchline-private');
// The path of a private file that is here, or null (a tool that needs it explains and skips)
export const privateFile = (name) => {
  const f = path.join(PRIVATE, name);
  return fs.existsSync(f) ? f : null;
};
// Where a private file is written (the folder is made)
export const privatePath = (name) => {
  const f = path.join(PRIVATE, name);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
};
// The text that explains what is missing, for a tool that stops
export const missing = (name) =>
  `${name} is not here: it lives in the private folder (${PRIVATE}, or TOUCHLINE_PRIVATE). Without it this tool has nothing to work from, so it stops.`;

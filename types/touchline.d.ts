// The shapes of the game's main data, for the editor (VS Code reads this file; the game does not load it). To have a file checked
// against them, put `// @ts-check` on its first line and describe a value with JSDoc, for example
//   /** @param {import('../types/touchline').Player} p */
// A missing or misspelled field (p.fn, p.clubID, club.stadium.capacity) is then underlined as you write it. The shapes were taken from
// a world built by the game; a field that only some players have is optional (?).

export type Attr =
  | 'pace'
  | 'stamina'
  | 'strength'
  | 'dribbling'
  | 'technique'
  | 'passing'
  | 'vision'
  | 'finishing'
  | 'tackling'
  | 'positioning'
  | 'composure'
  | 'workRate'
  | 'reflexes'
  | 'handling';
export type Pos = 'GK' | 'CB' | 'FB' | 'WB' | 'DM' | 'CM' | 'WM' | 'AM' | 'W' | 'ST';

export interface PlayerSeason {
  apps: number;
  goals: number;
  ast: number;
  rsum: number;
  motm: number;
  yc: number;
  rc: number;
  lapps: number;
  mins: number;
  sh: number;
  sot: number;
  kp: number;
  tk: number;
  pas: number;
  cs: number;
  sv: number;
  ga: number;
  xga: number;
  yapps: number;
  ic: number;
  xg: number;
  xa: number;
}
export interface Spell {
  c: string;
  from: number;
  to?: number | null;
  apps: number;
  goals: number;
}
export interface HistoryRow {
  y: number;
  c: string;
  apps: number;
  g: number;
  a: number;
  r: number;
  mins: number;
  sh: number;
  kp: number;
  tk: number;
  ic: number;
  cs: number;
  sv: number;
  ga: number;
  xga: number;
  motm: number;
  yc: number;
  rc: number;
}
export interface Player {
  id: string;
  /** given name; empty for a player known by one name (his name is then in ln) */
  fn: string;
  ln: string;
  nat: string;
  nat2?: string | null;
  alleg?: string;
  heritage?: string;
  born: number;
  pos: Pos;
  foot: 'Left' | 'Right' | 'Both';
  attrs: Record<Attr, number>;
  /** current ability, potential, market value */
  ca: number;
  pa: number;
  value: number;
  morale: number;
  form: number[];
  fitness: number;
  inj: { name?: string; days: number } | null;
  susp: number;
  wage: number;
  contract: number;
  traits: string[];
  hid: { cons: number; inj: number; prof: number; amb: number; loy: number; temp: number; big: number; lead: number };
  clubId: string | null;
  youth: string | null;
  team?: string;
  loan?: unknown;
  retired?: boolean;
  no?: number;
  season: PlayerSeason;
  career: { apps: number; goals: number; spells: Spell[] };
  history?: HistoryRow[];
  intl?: { caps: number; goals: number; first: number; by: Record<number, number>; cs?: number };
  personality?: string;
}

export interface Stadium {
  name: string;
  cap: number;
  cap0: number;
}
export interface Club {
  id: string;
  name: string;
  short: string;
  nick: string;
  city: string;
  nat: string;
  founded: number | null;
  colors: [string, string];
  identity: 'giant' | 'historic' | 'oil' | 'fallen' | 'fan' | 'youth' | 'selling' | string;
  /** who the club may sign: a nation, a part of the world or a heritage; null for anyone */
  policy: { nat?: string; region?: string; heritage?: string; military?: boolean; label?: string } | null;
  rep: number;
  parent: string | null;
  stadium: Stadium;
  comp: string;
  sim: 'full' | 'light' | 'minimal' | 'nation';
  balance: number;
  budget: number;
  fanMood: number;
  boardConf: number;
  facilities: Record<'training' | 'academy' | 'medical' | 'analytics' | 'stadium' | 'fanzone' | 'museum', number>;
  tactic: {
    formation: string;
    buildup: string;
    press: string;
    width: string;
    roles: string[];
    invFB: boolean;
    lineup: string[] | null;
  };
  manager: string | null;
  rival?: string;
  derby?: string;
  titles: Record<string, number>;
  attr: { market: number; support: number; catchment: number; own: string; hist: number; ceil: number; floor: number };
}

export interface Fixture {
  id: string;
  comp: string;
  round: number;
  h: string;
  a: string;
  /** null until it is played */
  res: null | { hg: number; ag: number; [more: string]: unknown };
  day?: number;
}
export interface Competition {
  id: string;
  type: 'league' | 'cup' | 'domestic' | 'continental' | 'world';
  nat?: string;
  name: string;
  short: string;
  tier?: number;
  sim?: string;
  repBand?: [number, number];
  clubs: string[];
  fixtures: Fixture[];
  table?: Record<string, { p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }>;
}
/** the world being played: FM.S */
export interface State {
  version: number;
  year: number;
  day: number;
  players: Record<string, Player>;
  clubs: Record<string, Club>;
  comps: Record<string, Competition>;
  rules: {
    win: number;
    subs: number;
    reg: string;
    foreignLimit: number;
    twoLegs: boolean;
    awayGoals: boolean;
    regionNations?: boolean;
  };
  user: { clubId: string | null; name: string; [more: string]: unknown };
  archive: unknown[];
  [more: string]: unknown;
}

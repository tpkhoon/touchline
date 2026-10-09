// The name library behind tools/worldgen.mjs: how towns sound in each language group, how clubs and grounds are
// named there, and the native words for divisions and cups. Everything here is invented material in the manner of
// each language; none of it is a real club's name.
const words = (s) => s.trim().split(/\s+/);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const rep = (list, n) => Array.from({ length: n }, () => list).flat(); // (weights: a pattern listed twice is twice as likely)
const cross = (tpl, list) => words(list).map((w) => tpl.replace('{w}', w));
const VOWELS = 'aeiouyáéíóúàèìòùâêîôûäöüåæøãõ';
const isVowel = (c) => VOWELS.includes((c || '').toLowerCase());

// Words no generated name may contain, in the languages the library writes in (matched on the name with accents
// and spaces removed, so a rude word split across two parts is caught too). The short ones only count as a whole
// word, so real surnames such as Dickens or Cocker stay.
const RUDE_PART =
  `cabron cabrona puta puto putas putos mierda coño joder pendej culo culos polla pollas verga chinga marica maricon
  zorra gilipoll hijoput cojon capullo merde putain salope connard encule foutre bordel batard nique scheiss scheisse
  fotze wichser arsch hure schwuchtel hurensohn votze cazzo merda vaffa troia stronz puttana vaffanculo minchia
  fuck shit cunt cunts twat wank bollock bastard piss slut whore nigg porra caralho buceta viado piroca
  kurwa pierdol chuj jebac pizda sikmek orospu amcik yarrak kokot hovno`.split(/\s+/);
const RUDE_WORD = new Set('dick dicks cock cocks fag fags tit tits ass arse anus sex pene bite con cul'.split(' '));
const plain = (t) =>
  String(t)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export const isRude = (text) => {
  const t = plain(text);
  if (RUDE_PART.some((w) => t.replace(/[^a-z]/g, '').includes(w))) return true;
  return t.split(/[^a-z]+/).some((w) => RUDE_WORD.has(w));
};

export const LANG = {
  eng: {
    nations: 'ENG SCO WAL IRL AUS USA RSA GHA NGA',
    a: words(
      `Abing Ald Ames Ash Aston Bar Bay Beck Bed Bever Bex Birk Black Bourn Brad Bran Brent Brid Brom Buck Bur Bux Cal Cam
      Cans Car Chal Chel Chip Clay Cleve Clif Cob Col Cran Crew Croy Dal Dar Dart Dav Den Der Dor Dun Eden Elm Ep Ever Ex
      Fair Fal Farn Fen Fil Flit Fol Gain Gil Glas Glen Glos Gran Gren Had Hal Har Hart Has Hat Hay Hel Her Hex High Hin Hol
      Hor How Huck Hun Hyde Ing Ket Kes Kil Kirk Lam Lan Lang Lea Led Lew Lich Lin Lit Lud Lyme Mal Mans Mar Mel Mer Mid Mil
      Mor Nan Nor Oak Ol Ot Ox Pad Pen Pet Pick Ply Pres Pud Quar Rad Ram Rea Red Rey Rich Rip Rod Rom Ros Roth Rug Rus Rye
      Sal Sand Saw Scar Sed Sel Shaf Shep Shir Sop Spald Stam Stan Staf Sto Stow Strat Sud Sut Swan Tad Tam Tarn Tav Tet Thir
      Thorn Til Tiv Tod Tor Tun Tut Wad Wal War Wat Wed Wel Wend Wes Wex Whit Wick Wil Win Wis Wit Wok Wor Wrex Wyn Yar Yeo`,
    ),
    b: words(
      `ford ham ton bury field wick mouth chester worth by ley stead brook dale port minster wood combe bridge thorpe mere wold
      cliff haven gate borough well hurst don ney sea stow holm castle pool wich sey shall caster ington ingham`,
    ),
    elide: false,
    pre: [
      ...rep(['North', 'South', 'East', 'West'], 2),
      'Upper',
      'Lower',
      'Great',
      'Little',
      'Market',
      'Castle',
      'Church',
      "King's",
      "Bishop's",
      'Saint',
      'New',
      'Old',
    ],
    preGap: ' ',
    joins: ['-on-Sea', '-in-the-Marsh', '-le-Moors', '-by-the-Sea', '-on-the-Hill', '-on-Wold', '-under-Wood'],
    club: [
      ...rep(['{c} Town', '{c} City', '{c} United'], 3),
      ...rep(['{c} Athletic', '{c} Rovers'], 2),
      '{c} Albion',
      '{c} Wanderers',
      '{c} Rangers',
      '{c} County',
      '{c} Borough',
      '{c} Victoria',
      '{c} Orient',
      '{c} Argyle',
      '{c} Alexandra',
      '{c} Wednesday',
      '{c} Harriers',
      '{c} Villa',
      '{c} Rovers',
      'Athletic Club {c}',
    ],
    ground: [
      '{c} Park',
      '{x} Road',
      '{x} Lane',
      '{c} Ground',
      'The {x} Stadium',
      '{p} Park',
      '{x} Field',
      '{x} Park',
      '{x} Green',
    ],
    colours: {
      red: 'Reds',
      blue: 'Blues',
      white: 'Whites',
      black: 'Blacks',
      yellow: 'Yellows',
      green: 'Greens',
      orange: 'Oranges',
      claret: 'Maroons',
      sky: 'Sky Blues',
      navy: 'Navy',
    },
    misc: words(
      'Lions Eagles Wolves Rams Stags Kestrels Otters Badgers Herons Mariners Miners Ironmen Drovers Foresters Chargers Spartans Falcons',
    ),
    tiers: ['Premier Division', 'First Division', 'Second Division', 'Third Division', 'Fourth Division'],
    cup: 'Challenge Cup',
  },
  spa: {
    nations: 'ESP CHI COL VEN PER ECU BOL',
    link: 'aeo',
    a: words(
      `Alcal Almaz Arroy Benav Cabr Calat Casti Cerv Cord Corv Cuen Escal Frag Fresn Fuent Gand Guad Jarand Lerm Lior Mayor
      Medi Mont Nav Olm Oñat Orih Ped Peñ Pied Plas Pozo Quint Riba Robl Sepúlv Sor Tal Tord Torr Val Valde Vill Zafr Alba
      Aranj Bail Bena Calp Elch Gand Hinoj Luc Marb Moral Nerj Osun Palom Rond Salam Segov Tarif Úbed Valdem Yeste Zam`,
    ),
    b: words('a ara edo osa ares illa eda ejo ón al era ana ena ero ino anes ete ar ador ero iel'),
    elide: true,
    pre: [
      ...rep(['San', 'Santa', 'Villa', 'Puerto'], 2),
      'Alto',
      'Nueva',
      'Los',
      'Las',
      'El',
      'La',
      'Cerro',
      'Monte',
      'Torre',
      'Campo',
    ],
    preGap: ' ',
    preDe: 0.35, // "Villa de Navares"
    joins: [' del Mar', ' de la Sierra', ' del Valle', ' de Abajo', ' de Arriba'],
    club: [
      ...rep(['{c} CF', 'Deportivo {c}', 'Atlético {c}'], 2),
      'Sporting {c}',
      'Racing {c}',
      'Unión {c}',
      'Club {c}',
      'Real {c}',
      '{c} Balompié',
      'CD {c}',
      'UD {c}',
      '{c} Atlético',
      'Real Club {c}',
      '{c} Sporting Club',
      'Juventud {c}',
    ],
    ground: [
      'Estadio Municipal de {c}',
      'Estadio {x}',
      'Campo de {c}',
      'Estadio {p}',
      'Estadio La {x}',
      'Nuevo Estadio {c}',
      'Ciudad Deportiva {c}',
    ],
    colours: {
      red: 'Rojos',
      blue: 'Azules',
      white: 'Blancos',
      black: 'Negros',
      yellow: 'Amarillos',
      green: 'Verdes',
      orange: 'Naranjas',
      claret: 'Granates',
      sky: 'Celestes',
      navy: 'Azulones',
    },
    misc: words(
      'Leones Águilas Lobos Halcones Tiburones Toros Cóndores Jaguares Gladiadores Alacranes Mineros Marineros Venados',
    ),
    tiers: ['Liga de Honor', 'Liga de Plata', 'Liga Federal', 'Liga Regional', 'Liga Provincial'],
    cup: 'Copa de la Federación',
  },
  por: {
    nations: 'POR',
    link: 'aeo',
    a: words(
      `Alcob Alent Arga Ave Barc Bragan Cast Cov Elv Estr Fig Gouv Guim Lam Leir Lous Marv Matos Mir Moncor Ovar Pen Port Sant
      Sert Tom Torr Vil Alvor Amar Cart Ferr Gaia Lag Monch Nazar Oliv Paiv Pomb Sesim Tavir Valen Vend Vidig`,
    ),
    b: words('a ela ais eiro inha ouro ães al ão ares ura ada eira ela'),
    elide: true,
    pre: [...rep(['São', 'Santa', 'Vila', 'Porto'], 2), 'Nova', 'Praia', 'Serra', 'Ribeira', 'Alto', 'Campo', 'Boa'],
    preGap: ' ',
    preDe: 0.3,
    joins: [' do Mar', ' da Serra', ' do Vale', ' de Cima'],
    club: [
      ...rep(['{c} FC', 'Sporting {c}', 'Atlético {c}'], 2),
      'Clube {c}',
      '{c} EC',
      'Associação {c}',
      'Esporte Clube {c}',
      'Grémio {c}',
      'União {c}',
      'Racing {c}',
      '{c} Atlético Clube',
      'Sport Clube {c}',
      '{c} Futebol Clube',
    ],
    ground: [
      'Estádio {x}',
      'Estádio Municipal de {c}',
      'Arena {x}',
      'Estádio {p}',
      'Estádio Nova {x}',
      'Complexo Desportivo {c}',
    ],
    colours: {
      red: 'Rubro-Negros',
      blue: 'Azuis',
      white: 'Brancos',
      black: 'Pretos',
      yellow: 'Amarelos',
      green: 'Verdes',
      orange: 'Laranjas',
      claret: 'Grenás',
      sky: 'Celestes',
      navy: 'Azuis-Marinho',
    },
    misc: words('Leões Águias Lobos Tubarões Falcões Tigres Gaviões Onças Corvos Mineiros Marinheiros Veados'),
    tiers: ['Liga de Honra', 'Liga de Prata', 'Liga Federal', 'Liga Regional', 'Liga Distrital'],
    cup: 'Taça da Federação',
  },
  bra: {
    nations: 'BRA',
    link: 'aeo',
    a: words(
      `Ita Ipi Ibi Pira Jacar Gua Itapi Cari Mara Para Tiju Arapi Ubatu Guara Pindo Capi Cata Aracat Biri Camb Itaj Ipat Jabot Mogi
      Nhan Pitang Sant Tabo Uruc Vass`,
    ),
    b: words('ba pe ú ara ma iba guá ópolis ina tuba rama mirim açu ia ão ai'),
    elide: true,
    pre: [...rep(['São', 'Santa'], 3), 'Nova', 'Vila', 'Porto', 'Campo', 'Barra'],
    preGap: ' ',
    preDe: 0.2,
    joins: [' do Sul', ' do Norte', ' das Pedras', ' da Serra'],
    club: [
      ...rep(['{c} EC', 'Sport Clube {c}', 'Atlético {c}'], 2),
      '{c} FC',
      'Esporte Clube {c}',
      'Clube {c}',
      'Associação Atlética {c}',
      'Grêmio {c}',
      'União {c}',
      'Sociedade Esportiva {c}',
      'Racing {c}',
      '{c} Futebol Clube',
    ],
    ground: ['Estádio {x}', 'Arena {x}', 'Estádio Municipal de {c}', 'Estádio {p}', 'Estádio Novo {x}', 'Complexo {x}'],
    colours: {
      red: 'Rubro-Negros',
      blue: 'Azuis',
      white: 'Alvinegros',
      black: 'Pretos',
      yellow: 'Amarelos',
      green: 'Verdões',
      orange: 'Laranjas',
      claret: 'Grenás',
      sky: 'Celestes',
      navy: 'Azuis-Marinho',
    },
    misc: words('Leões Águias Lobos Tubarões Falcões Tigres Gaviões Onças Corvos Galos Jaguares Tucanos'),
    tiers: ['Liga Nacional', 'Liga Nacional B', 'Liga Nacional C', 'Liga Nacional D', 'Liga Nacional E'],
    cup: 'Copa da Federação',
  },
  mex: {
    nations: 'MEX',
    link: 'aeoi',
    a: words('Tlax Cuau Xal Teo Ahu Zac Tepo Ixt Chal Mix Tec Coat Hui Ocot Papan Tamp Uru Yau Zap Cuer Jil Pach Tul'),
    b: words('tlán pan co tepec hua lco catl chitlán pa tzin lán cán ec'),
    elide: true,
    pre: [...rep(['San', 'Santa'], 3), 'Villa', 'Nueva', 'Puerto', 'Ciudad'],
    preGap: ' ',
    preDe: 0.15,
    joins: [' de Allende', ' del Valle', ' de las Flores'],
    club: [
      ...rep(['Club {c}', 'Atlético {c}', 'Deportivo {c}'], 2),
      '{c} FC',
      'Unión {c}',
      'Club Deportivo {c}',
      '{c} Atlético',
      'Santos {c}',
      'Real {c}',
      'Halcones de {c}',
    ],
    ground: ['Estadio {x}', 'Estadio Municipal de {c}', 'Estadio {p}', 'Estadio Olímpico de {c}', 'Estadio La {x}'],
    colours: {
      red: 'Rojos',
      blue: 'Azules',
      white: 'Blancos',
      black: 'Negros',
      yellow: 'Amarillos',
      green: 'Verdes',
      orange: 'Naranjas',
      claret: 'Guindas',
      sky: 'Celestes',
      navy: 'Azulones',
    },
    misc: words('Leones Águilas Lobos Tigres Toros Jaguares Venados Alacranes Mineros Gallos Panteras Tuzos'),
    tiers: ['Liga Mayor', 'Liga de Ascenso', 'Liga de Expansión', 'Liga Regional', 'Liga Estatal'],
    cup: 'Copa de la Federación',
  },
  arg: {
    nations: 'ARG URU PAR',
    link: 'aeo',
    a: words(
      'Alver Bel Cabr Dorr Esc Fer Gar Her Lav Mir Pell Quir Rod Sar Tor Urq Vel Arr Bust Cast Dom Fran Lez Mol Ort Pues',
    ),
    b: words('ez o as ia ini ano ón ero ona illa eda ar ui'),
    elide: true,
    pre: [...rep(['General', 'Coronel'], 2), 'Presidente', 'Doctor', 'Villa', 'San', 'Santa', 'Puerto'],
    preGap: ' ',
    joins: [' del Plata', ' de los Arroyos', ' del Sur'],
    club: [
      ...rep(['Club Atlético {c}', 'Club Deportivo {c}', 'Atlético {c}'], 2),
      '{c} FC',
      'Club Social y Deportivo {c}',
      'Sportivo {c}',
      'Gimnasia de {c}',
      'Estudiantes de {c}',
      'Unión de {c}',
      'Racing de {c}',
      'Defensores de {c}',
      'Independiente {c}',
    ],
    ground: ['Estadio {x}', 'Estadio Municipal de {c}', 'Estadio {p}', 'Estadio Monumental {x}', 'Cancha de {c}'],
    colours: {
      red: 'Rojos',
      blue: 'Azules',
      white: 'Albos',
      black: 'Negros',
      yellow: 'Amarillos',
      green: 'Verdes',
      orange: 'Naranjas',
      claret: 'Granates',
      sky: 'Celestes',
      navy: 'Azulones',
    },
    misc: words('Leones Gauchos Lobos Halcones Pumas Toros Cóndores Tigres Pampas Arrieros Matadores'),
    tiers: ['Liga Mayor', 'Primera B Nacional', 'Primera C', 'Primera D', 'Liga Federal'],
    cup: 'Copa de la Federación',
  },
  ger: {
    nations: 'GER AUT SUI',
    a: words(
      `Alt Bach Berg Bran Dorn Eich Els Frei Furt Gold Grün Hag Heid Hohen Holz Kirch Kron Lind Lüt Mühl Nieder Ober Rhein Rot
      Schwarz Stein Thal Wald Wester Wies Zell Burg Hirsch Ahr Bruch Dill Eber Fels Greif Hain Imm Kal Lang Marien Neckar`,
    ),
    b: words(
      'burg berg stadt feld bach dorf heim hafen au kirchen tal hausen see ingen furt stein brück hof wald horst weiler',
    ),
    elide: false,
    pre: ['Bad', 'Neu', 'Alt', 'Ober', 'Unter', 'Hohen', 'Groß', 'Klein'],
    preGap: ' ',
    joins: [' am See', ' im Tal', ' an der Au', ' am Berg'],
    club: [
      ...rep(['SV {c}', 'FC {c}', 'TSV {c}'], 2),
      '{c} SC',
      'FSV {c}',
      'VfB {c}',
      'VfL {c}',
      'Sportfreunde {c}',
      'SpVgg {c}',
      '{c} 04',
      'Fortuna {c}',
      'Eintracht {c}',
      'Union {c}',
      'Viktoria {c}',
      'Teutonia {c}',
      '{c} 1899',
      'Germania {c}',
    ],
    ground: [
      '{c}-Arena',
      'Stadion {x}',
      '{x}-Stadion',
      'Sportpark {x}',
      'Stadion am {x}',
      '{p}-Stadion',
      'Waldstadion {c}',
    ],
    colours: {
      red: 'Roten',
      blue: 'Blauen',
      white: 'Weißen',
      black: 'Schwarzen',
      yellow: 'Gelben',
      green: 'Grünen',
      orange: 'Orangen',
      claret: 'Weinroten',
      sky: 'Himmelblauen',
      navy: 'Dunkelblauen',
    },
    misc: words('Löwen Adler Wölfe Füchse Falken Bären Bergleute Hirsche Schmiede Fischer Ritter Pioniere'),
    tiers: ['Hauptliga', 'Zweite Hauptliga', 'Dritte Liga', 'Vierte Liga', 'Fünfte Liga'],
    cup: 'Verbandspokal',
  },
  nld: {
    nations: 'NED BEL',
    a: words(
      'Oost West Noord Zuid Hoog Laag Groot Klein Nieuw Oud Berg Dijk Veen Haar Wage Zaan Bred Alk Deven Gron Hoorn Leid Maas Sneek Til Vlaar Zwol',
    ),
    b: words('dam burg hoven stad dijk veen wijk brug horst kerk lo rade zand voort waard hout beek'),
    elide: false,
    pre: ['Oud', 'Nieuw', 'Groot', 'Klein', 'Sint'],
    preGap: ' ',
    joins: [' aan Zee', ' aan de Maas'],
    club: [
      ...rep(['FC {c}', 'SC {c}', 'VV {c}'], 2),
      'RKC {c}',
      'KV {c}',
      'Sparta {c}',
      'AFC {c}',
      'ADO {c}',
      '{c} Boys',
      'Victoria {c}',
      'Racing {c}',
      '{c} Vooruit',
      'Eendracht {c}',
    ],
    ground: ['{x} Stadion', 'Stadion {x}', '{c} Arena', 'De {x}', '{p} Stadion', 'Sportpark {x}'],
    colours: {
      red: 'Rooien',
      blue: 'Blauwen',
      white: 'Witten',
      black: 'Zwarten',
      yellow: 'Geelen',
      green: 'Groenen',
      orange: 'Oranjes',
      claret: 'Bordeauxen',
      sky: 'Hemelsblauwen',
      navy: 'Donkerblauwen',
    },
    misc: words('Leeuwen Arenden Wolven Valken Stieren Zwanen Ruiters Kikkers Spechten Bijen'),
    tiers: ['Eerste Klasse', 'Tweede Klasse', 'Derde Klasse', 'Vierde Klasse', 'Vijfde Klasse'],
    cup: 'Federatiebeker',
  },
  nor: {
    nations: 'DEN NOR SWE FIN ISL',
    a: words(
      'Nord Syd Øst Vest Stor Lille Ny Gammel Fjord Skov Berg Dal Strand Bro Hav Sol Ring Sønder Lang Hol Ål Ask Bjørn Dyr Fre Hed Kil Mar Nes',
    ),
    b: words('by borg sund vik næs holm lund strup gård løkke fors dal vang stad rud ø'),
    elide: false,
    pre: ['Nord', 'Sønder', 'Øster', 'Vester', 'Ny', 'Gamle'],
    preGap: '',
    joins: [],
    club: [
      ...rep(['{c} IF', '{c} FK', 'FC {c}'], 2),
      'IK {c}',
      '{c} BK',
      '{c} Boldklub',
      'BK {c}',
      '{c} IL',
      'Fremad {c}',
      '{c} Fotball',
    ],
    ground: ['{x} Stadion', '{c} Arena', '{x} Park', '{p} Stadion', '{x} Idrætspark', '{c} Idrætsanlæg'],
    colours: {
      red: 'De Røde',
      blue: 'De Blå',
      white: 'De Hvide',
      black: 'De Sorte',
      yellow: 'De Gule',
      green: 'De Grønne',
      orange: 'De Orange',
      claret: 'De Mørkerøde',
      sky: 'De Lyseblå',
      navy: 'De Mørkeblå',
    },
    misc: words('Løver Ørne Ulve Bjørne Falke Elge Vikinger Svaner Rever Bæverne'),
    tiers: ['Topliga', 'Første Division', 'Anden Division', 'Tredje Division', 'Fjerde Division'],
    cup: 'Forbundspokal',
  },
  fra: {
    nations: 'FRA MAR ALG TUN SEN CIV CMR COD MLI BFA GUI',
    a: words(
      `Aub Bel Cha Dur Fon Lan Mon Nan Pon Roc Tour Vil Val Mar Bour Beau Cler Cour Lav Mont Cher Ar Dam Blan Cass Dieu Gren
      Joy Lun Mir Pau Quim Rib Sar Tho Vend`,
    ),
    b: words('ville mont eau court ac ens ay on lac gnan lieu bourg ières ac ault ange'),
    elide: false,
    pre: [...rep(['Saint-', 'Sainte-'], 3), 'Mont-', 'Pont-', 'Château-', 'Port-', 'Beau-', 'Villeneuve-'],
    preGap: '',
    joins: ['-sur-Mer', '-les-Bains', '-sur-Aure', '-en-Vallée', '-lès-Bois'],
    club: [
      ...rep(['FC {c}', 'AS {c}', 'US {c}'], 2),
      'Stade {c}',
      '{c} FC',
      'RC {c}',
      'AJ {c}',
      'SC {c}',
      'Athlétic {c}',
      'ES {c}',
      'Étoile de {c}',
      'Racing {c}',
      'Union {c}',
    ],
    ground: [
      'Stade {x}',
      'Stade Municipal de {c}',
      'Parc des Sports de {c}',
      'Stade {p}',
      'Stade de la {x}',
      'Complexe {x}',
    ],
    colours: {
      red: 'Rouges',
      blue: 'Bleus',
      white: 'Blancs',
      black: 'Noirs',
      yellow: 'Jaunes',
      green: 'Verts',
      orange: 'Oranges',
      claret: 'Grenats',
      sky: 'Ciel et Blancs',
      navy: 'Marines',
    },
    misc: words('Lions Aigles Loups Faucons Cerfs Lynx Cigognes Mineurs Dragons Marins Forgerons Pionniers'),
    tiers: [
      'Division Nationale',
      'Division Nationale 2',
      'Division Nationale 3',
      'Division Nationale 4',
      'Division Nationale 5',
    ],
    cup: 'Coupe de la Fédération',
  },
  ita: {
    nations: 'ITA',
    link: 'aeo',
    a: words(
      `Alba Bor Cas Fer Gal Lan Mon Pie Rav Sant Tor Ven Vil Ser Mar San Val Bel Pon Rocca Cor Mir Fos Frasc Mod Pad
      Amal Arez Cest Fabri Gubb Lecc Orvi Pesc Sass Tren`,
    ),
    b: words('ino ara ento ola etto ate ana ello ona ezia ago ia ano ale one ucci ara'),
    elide: true,
    pre: [...rep(['San', 'Santa', 'Monte', 'Castel'], 2), 'Porto', 'Villa', 'Borgo', 'Torre'],
    preGap: ' ',
    joins: [' sul Mare', ' di Sotto', ' al Monte'],
    club: [
      ...rep(['{c} Calcio', 'AC {c}', 'US {c}'], 2),
      'Unione {c}',
      '{c} 1908',
      'Virtus {c}',
      'ASD {c}',
      'Atletico {c}',
      'SSC {c}',
      'FC {c}',
      'Sporting {c}',
      'Pro {c}',
      'Audace {c}',
    ],
    ground: [
      'Stadio {x}',
      'Stadio Comunale di {c}',
      'Stadio {p}',
      'Stadio Nuovo {x}',
      'Arena {x}',
      'Stadio Civico di {c}',
    ],
    colours: {
      red: 'Rossi',
      blue: 'Azzurri',
      white: 'Bianchi',
      black: 'Neri',
      yellow: 'Gialli',
      green: 'Verdi',
      orange: 'Arancioni',
      claret: 'Granata',
      sky: 'Celesti',
      navy: 'Blu',
    },
    misc: words('Leoni Aquile Lupi Falchi Grifoni Tori Cavalieri Minatori Marinai Cervi Fabbri Pionieri'),
    tiers: ['Campionato Nazionale', 'Campionato Cadetto', 'Terza Divisione', 'Quarta Divisione', 'Quinta Divisione'],
    cup: 'Coppa della Federazione',
  },
  pol: {
    nations: 'POL',
    a: words(
      'Biał Brzez Chełm Dąbr Gnie Jaros Kal Lub Mław Nowo Opol Pił Rad Siedl Tarn Wło Zam Brodn Czar Gorz Kost Ostr Płoc Rybn Słup Wiel',
    ),
    b: words('ów ice in ka ówka owice ewo ów sk no a ec'),
    elide: true,
    link: 'oe',
    pre: ['Nowy', 'Stary', 'Górny', 'Dolny', 'Wielki'],
    preGap: ' ',
    joins: [],
    club: [
      ...rep(['KS {c}', 'MKS {c}', '{c} FC'], 2),
      'GKS {c}',
      'LKS {c}',
      'Stal {c}',
      'Górnik {c}',
      'Ruch {c}',
      'Zagłębie {c}',
      'Polonia {c}',
      '{c} Sokół',
      'Unia {c}',
      'Znicz {c}',
    ],
    ground: ['Stadion Miejski im. {p}', 'Stadion {x}', 'Arena {x}', 'Stadion im. {p}', 'Stadion Ludowy {c}'],
    colours: {
      red: 'Czerwoni',
      blue: 'Niebiescy',
      white: 'Biali',
      black: 'Czarni',
      yellow: 'Żółci',
      green: 'Zieloni',
      orange: 'Pomarańczowi',
      claret: 'Bordowi',
      sky: 'Błękitni',
      navy: 'Granatowi',
    },
    misc: words('Orły Wilki Lwy Sokoły Żubry Niedźwiedzie Górnicy Husaria Kosynierzy Rycerze'),
    tiers: ['Liga Główna', 'Liga Pierwsza', 'Liga Druga', 'Liga Trzecia', 'Liga Czwarta'],
    cup: 'Puchar Federacji',
  },
  cze: {
    nations: 'CZE',
    a: words(
      'Bran Hrad Jab Kar Lib Mlad Nym Olom Pard Prost Roky Stra Tren Vsetín Zlín Boh Doub Hol Kost Lys Pelh Rych Sed Vys',
    ),
    b: words('ice ov any ín ec ná ná dov ice ava ice ov'),
    elide: true,
    link: 'oe',
    pre: ['Nový', 'Starý', 'Horní', 'Dolní', 'Velký'],
    preGap: ' ',
    joins: [],
    club: [
      ...rep(['FK {c}', 'SK {c}', 'FC {c}'], 2),
      'Slavoj {c}',
      'Sokol {c}',
      'Baník {c}',
      '{c} Slovan',
      'Viktoria {c}',
      'Dynamo {c}',
      'TJ {c}',
      '1. FC {c}',
    ],
    ground: ['Stadion {x}', 'Městský stadion {c}', 'Letní stadion {c}', 'Stadion u {x}', 'Aréna {x}'],
    colours: {
      red: 'Červení',
      blue: 'Modří',
      white: 'Bílí',
      black: 'Černí',
      yellow: 'Žlutí',
      green: 'Zelení',
      orange: 'Oranžoví',
      claret: 'Vínoví',
      sky: 'Nebesky modří',
      navy: 'Námořníci',
    },
    misc: words('Lvi Orli Vlci Sokoli Medvědi Horníci Husité Rytíři Kováři Býci'),
    tiers: ['První Liga', 'Druhá Liga', 'Třetí Liga', 'Čtvrtá Liga', 'Pátá Liga'],
    cup: 'Pohár Federace',
  },
  hun: {
    nations: 'HUN',
    a: words('Bak Csaj Dab Gyön Hajd Kisv Nagy Ors Pász Sár Szarv Tisz Vesz Zala Bar Dun Fehér Győr Kál Lőr Mez Rác'),
    b: words('háza falva vár szeg ád ény lak ó hegy kert város telek'),
    elide: true,
    link: 'ae',
    pre: ['Kis', 'Nagy', 'Felső', 'Alsó', 'Új'],
    preGap: '',
    joins: [],
    club: [
      ...rep(['{c} FC', '{c} SE', '{c} SC'], 2),
      '{c} TE',
      '{c} VSC',
      '{c} Futball Club',
      'FC {c}',
      '{c} AC',
      '{c} Atlétikai Klub',
      'Egyetértés {c}',
      '{c} Sport Egylet',
    ],
    ground: ['{x} Stadion', '{c} Városi Stadion', '{x} Aréna', '{p} Stadion', '{c} Sportpálya'],
    colours: {
      red: 'Vörösök',
      blue: 'Kékek',
      white: 'Fehérek',
      black: 'Feketék',
      yellow: 'Sárgák',
      green: 'Zöldek',
      orange: 'Narancsok',
      claret: 'Bordók',
      sky: 'Égszínkékek',
      navy: 'Sötétkékek',
    },
    misc: words('Oroszlánok Sasok Farkasok Sólymok Bikák Medvék Bányászok Huszárok Kovácsok Lovagok'),
    tiers: ['Első Osztály', 'Második Osztály', 'Harmadik Osztály', 'Negyedik Osztály', 'Ötödik Osztály'],
    cup: 'Szövetségi Kupa',
  },
  gre: {
    nations: 'GRE',
    a: words('Ag Alex Arg Chal Kal Kor Lar Mes Nik Pat Pir Ser Thes Tri Xan Ioan Kav Kyp Lam Mar Nax Pel'),
    b: words('ópoli ina os ia ikos ás aki ida ópetra ouli ánia'),
    elide: true,
    link: 'oa',
    pre: ['Ágios', 'Néa', 'Palaiá', 'Ano', 'Kato'],
    preGap: ' ',
    joins: [],
    club: [
      ...rep(['AO {c}', 'AE {c}', '{c} FC'], 2),
      'PAE {c}',
      'GS {c}',
      'Panathlitikos {c}',
      'Ethnikos {c}',
      'Apollon {c}',
      'Doxa {c}',
      'Niki {c}',
    ],
    ground: ['Stadio {x}', 'Dimotiko Stadio {c}', '{x} Arena', 'Stadio {p}', 'Ethniko Stadio {c}'],
    colours: {
      red: 'Kókkinoi',
      blue: 'Galázioi',
      white: 'Áspri',
      black: 'Mávroi',
      yellow: 'Kítrinoi',
      green: 'Prásinoi',
      orange: 'Portokalí',
      claret: 'Kókkino Krasí',
      sky: 'Ouránioi',
      navy: 'Mple',
    },
    misc: words('Léontes Aetoí Lýkoi Ierakes Taýroi Delfínia Nautikoí Ypsilánti Spartiátes Titánes'),
    tiers: ['Alfa Liga', 'Beta Liga', 'Gamma Liga', 'Delta Liga', 'Epsilon Liga'],
    cup: 'Federation Kypello',
  },
  slav: {
    nations: 'SRB ROU SVK SVN BUL CRO BIH',
    a: words(
      `Bor Dra Gor Kra Lub Mal Nov Pol Rad Sla Tar Vel Zag Bel Ples Brat Kos Mir Zel Bog Doln Hrad Jas Kam Lipt Mik Ost
      Pet Ryb Slav Tur Vys`,
    ),
    b: words('ovo grad ice ava ina ovac ica ek in pol ec any ovice ik'),
    elide: false,
    pre: ['Novi', 'Stari', 'Gornji', 'Donji', 'Veliki', 'Mali', 'Nova', 'Stara'],
    preGap: ' ',
    joins: [],
    club: [
      ...rep(['FK {c}', 'SK {c}', 'FC {c}'], 2),
      '{c} Sokol',
      'Slavia {c}',
      'KS {c}',
      'NK {c}',
      'Union {c}',
      'MFK {c}',
      'AO {c}',
      'Lokomotiva {c}',
      'Zora {c}',
    ],
    ground: ['Stadion {x}', '{x} Arena', 'Gradski Stadion {c}', 'Stadion {p}', '{c} Park', 'Stadion Mir {c}'],
    colours: {
      red: 'Crveni',
      blue: 'Plavi',
      white: 'Beli',
      black: 'Crni',
      yellow: 'Žuti',
      green: 'Zeleni',
      orange: 'Narandžasti',
      claret: 'Bordo',
      sky: 'Svetloplavi',
      navy: 'Tamnoplavi',
    },
    misc: words('Orlovi Vukovi Lavovi Sokolovi Medvedi Zmajevi Gavranovi Bikovi Rakete Baroni'),
    tiers: ['Prva Liga', 'Druga Liga', 'Treća Liga', 'Četvrta Liga', 'Peta Liga'],
    cup: 'Savezni Kup',
  },
  tur: {
    nations: 'TUR',
    a: words(
      'Ak Bay Çam Dem Kar Mer Öz Sar Tek Yeni Gül Esk Kız Boz Kara Sultan Ali Yal Ayd Çan Dur Gön İnc Kay Orh Tav Uşa',
    ),
    b: words('ova ehir köy pınar tepe kale lar saray bahçe dere'),
    elide: true,
    pre: ['Yeni', 'Eski', 'Büyük', 'Küçük'],
    preGap: ' ',
    joins: [],
    club: [
      ...rep(['{c}spor', '{c} Belediyespor', '{c} SK'], 2),
      '{c} FK',
      'Yeni {c}spor',
      '{c} Gençlik',
      '{c} İdman Yurdu',
      '{c} Atletik',
      '{c} Gücü',
      '{c}gücü',
      '{c} Birlik',
    ],
    ground: ['{x} Stadyumu', '{c} Şehir Stadyumu', '{p} Stadyumu', '{x} Arena', '{c} Cumhuriyet Stadyumu'],
    colours: {
      red: 'Kırmızılar',
      blue: 'Mavililer',
      white: 'Beyazlar',
      black: 'Siyahlar',
      yellow: 'Sarılar',
      green: 'Yeşiller',
      orange: 'Turuncular',
      claret: 'Bordolar',
      sky: 'Gökler',
      navy: 'Lacivertler',
    },
    misc: words('Aslanlar Kartallar Kurtlar Şahinler Boğalar Akbabalar Atmacalar Yıldızlar Kaplanlar Ejderler'),
    tiers: ['Birinci Lig', 'İkinci Lig', 'Üçüncü Lig', 'Dördüncü Lig', 'Beşinci Lig'],
    cup: 'Federasyon Kupası',
  },
  jpn: {
    nations: 'JPN',
    a: words(
      'Aka Hoku Kawa Miya Naga Oka Sai Taka Yama Kita Minami Shin Higashi Nishi Fuji Sakura Take Haru Aki Nari Asa Ina Kuro Mats Oga Toy',
    ),
    b: words('saki gawa moto hama yama shima mori kami ta no ura hara zawa'),
    elide: false,
    pre: ['Kita', 'Minami', 'Higashi', 'Nishi', 'Shin'],
    preGap: '',
    joins: [],
    club: [
      ...rep(['{c} FC', '{c} United', '{c} Athletic'], 2),
      '{c} Sport Club',
      '{c} City',
      'FC {c}',
      '{c} Verde',
      '{c} Blaze',
      '{c} Sevens',
      '{c} Phoenix',
      '{c} Vortex',
    ],
    ground: ['{x} Stadium', '{c} Athletic Stadium', '{x} Arena', '{x} Park', '{c} Sports Complex'],
    colours: {
      red: 'Reds',
      blue: 'Blues',
      white: 'Whites',
      black: 'Blacks',
      yellow: 'Yellows',
      green: 'Greens',
      orange: 'Oranges',
      claret: 'Crimsons',
      sky: 'Sky Blues',
      navy: 'Navy',
    },
    misc: words('Dragons Tigers Phoenixes Hawks Wolves Samurai Warriors Cranes Bears Typhoons'),
    tiers: ['Premier League', 'Division 1', 'Division 2', 'Division 3', 'Regional League'],
    cup: 'National Cup',
  },
  kor: {
    nations: 'KOR CHN',
    a: words('Dae Gang Hae Chung Jeon Gyeong Nam Bu Jin Chun Seo Pyeong Dong Wol Sin Mun Ban Bo Cho Gim'),
    b: words('gu ju san cheon jeong seong ri yang won jin dong hwa'),
    elide: false,
    pre: [],
    preGap: '',
    joins: [],
    club: [
      ...rep(['{c} FC', '{c} United', '{c} Citizen'], 2),
      '{c} Dolphins',
      'FC {c}',
      '{c} Athletic',
      '{c} Stars',
      '{c} Tigers',
    ],
    ground: ['{c} Stadium', '{x} Sports Complex', '{x} Arena', '{c} Civic Stadium'],
    colours: {
      red: 'Reds',
      blue: 'Blues',
      white: 'Whites',
      black: 'Blacks',
      yellow: 'Yellows',
      green: 'Greens',
      orange: 'Oranges',
      claret: 'Crimsons',
      sky: 'Sky Blues',
      navy: 'Navy',
    },
    misc: words('Tigers Dragons Eagles Dolphins Hawks Bears Phoenixes Wolves'),
    tiers: ['Premier League', 'First League', 'Second League', 'Third League', 'Regional League'],
    cup: 'National Cup',
  },
  tha: {
    nations: 'THA IND UZB IRN',
    a: words('Ban Chiang Nakhon Sri Phra Lam Pak Ubon Sing Mae Nong Kao Phu Tha Wang Khao Bang Rat Sak Tak'),
    b: words('buri pur mai nong kaeo chan ra sai yai thong lek nam'),
    elide: false,
    pre: [],
    preGap: '',
    joins: [],
    club: [
      ...rep(['{c} United', 'FC {c}', '{c} City'], 2),
      '{c} Athletic',
      '{c} FC',
      'Muang {c}',
      '{c} Rangers',
      '{c} Mariners',
    ],
    ground: ['{x} Stadium', '{c} Provincial Stadium', '{x} Arena', '{x} Sports Park'],
    colours: {
      red: 'Reds',
      blue: 'Blues',
      white: 'Whites',
      black: 'Blacks',
      yellow: 'Yellows',
      green: 'Greens',
      orange: 'Oranges',
      claret: 'Crimsons',
      sky: 'Sky Blues',
      navy: 'Navy',
    },
    misc: words('Elephants Tigers Eagles Dragons Cobras Hornbills Lions Panthers'),
    tiers: ['Premier League', 'Division 1', 'Division 2', 'Division 3', 'Regional League'],
    cup: 'Champions Cup',
  },
  // The Gulf and the Arab world: "Al" ("the") and a concept — a quality, a bird, a direction, a hope: Al Fajr (dawn).
  // Clubs are named for the idea and then the town; the club's own story decides which (a company, a prince, a tribe).
  arab: {
    nations: 'KSA QAT UAE IRQ',
    a: words(
      'Bur Hof Maj Kha Naj Tab Sak Abh Yan Qas Jub Ras Sha Tur Ula Diri Zul Mah Ain Bah Dam Jed Riy Hai Taim Bish Raf',
    ),
    b: words('aydah uf maah is an ik at ra ma a um ayma ud abah alif ir'),
    elide: true,
    pre: ['Ras', 'Umm', 'Ain', 'Wadi'],
    preGap: ' ',
    joins: [],
    club: [
      ...cross(
        'Al {w}',
        `Fajr Saqr Wahat Rimal Nakhil Qamar Shams Sahab Bahr Zahra Majd Izz Wafaa Tahaddi Taqaddum Burj Jabal Wadi Sahil Dhahab
        Ward Yasmin Aseel Basil Shuja Fursan Nimr Asad Dhib Ghazal Nawras Sanabil Mawj Ufuq Raya Sharq Janub Shamal Gharb Sarh
        Qimma Hadaf Tafawuq Ibda Tatwir Watan Hurriya Karama Ihsan Nahda Nour Falah Salam Yaqin Haqiqa Tarab Rayyan Zaman Khalid`,
      ),
      'Al {c}',
      '{c} SC',
      'Al {c} Club',
    ],
    ground: [
      '{x} Stadium',
      'Prince {x} Stadium',
      'King {x} Sports City',
      '{c} Sports City',
      '{x} Arena',
      '{c} Club Stadium',
    ],
    colours: {
      red: 'Reds',
      blue: 'Blues',
      white: 'Whites',
      black: 'Blacks',
      yellow: 'Yellows',
      green: 'Greens',
      orange: 'Oranges',
      claret: 'Maroons',
      sky: 'Sky Blues',
      navy: 'Navy',
    },
    misc: words('Falcons Knights Lions Eagles Tigers Gazelles Foxes Sandstorm Camels Hawks Horsemen'),
    tiers: ['Premier League', 'First Division', 'Second Division', 'Third Division', 'Regional League'],
    cup: "King's Trophy",
    quirk: ['Ras', 'Umm', 'Wadi'],
  },
};
// ---------------------------------------------------------------- more variety
// Extra nickname words, club-name patterns, division names and cup names, so the world is not 700 "Town", "United" and
// "Premier Division". Nations that share a language each draw their own division and cup names (worldgen, by seed).
const NICK_MORE = {
  eng: words(
    `Bluebirds Canaries Magpies Saints Pilgrims Shrimpers Seagulls Hornets Swans Potters Tykes Cobblers Millers Posh
    Imps Gulls Grecians Stags Terriers Bantams Lilywhites Royals Robins Cherries Clarets Owls Blades Foxes Seahawks
    Warriors Knights Smiths Dockers Weavers Brewers Colliers Anglers Shepherds Tinners Bees Bulldogs Cats Wasps
    Eagles Panthers Kings Pioneers Harriers Thistles Dragons Comets Rockets Lancers Archers Yeomen Wanderers`,
  ),
  spa: words('Halcones Cóndores Zorros Osos Gladiadores Corsarios Marineros Cruzados Leñadores Pastores Titanes Rayos'),
  por: words('Gladiadores Corsários Pescadores Cavaleiros Pioneiros Dragões Raposas Ursos Foguetes Pastores'),
  bra: words('Gladiadores Corsários Pescadores Cavaleiros Raposas Ursos Foguetes Pioneiros Bandeirantes Capivaras'),
  mex: words('Gladiadores Corsarios Pescadores Charros Zorros Osos Rayos Titanes Cruzados Pioneros'),
  arg: words('Gladiadores Corsarios Pescadores Zorros Osos Rayos Titanes Cruzados Pioneros Ñandúes'),
  ger: words('Gladiatoren Seeadler Raben Kicker Kumpel Stahlwerker Brauer Pioniere Schwarzbären Rothirsche Wikinger'),
  nld: words('Gladiatoren Zeemeeuwen Raven Kasteelheren Vissers Brouwers Pioniers Beren Herten Vikingen'),
  nor: words('Gladiatorer Måker Ravner Fiskere Bryggere Pionerer Bjørner Hjorter Soldater Kometer'),
  fra: words('Gladiateurs Mouettes Corbeaux Pêcheurs Brasseurs Pionniers Ours Chevaliers Renards Comètes'),
  ita: words('Gladiatori Gabbiani Corvi Pescatori Birrai Pionieri Orsi Cavalieri Volpi Comete'),
  pol: words('Gladiatorzy Mewy Kruki Rybacy Piwosze Pionierzy Niedźwiedzie Rycerze Lisy Komety'),
  cze: words('Gladiátoři Racci Havrani Rybáři Sládci Průkopníci Medvědi Rytíři Lišky Komety'),
  hun: words('Gladiátorok Sirályok Hollók Halászok Sörfőzők Úttörők Medvék Lovagok Rókák Üstökösök'),
  gre: words('Gladiátores Lárioi Korákia Psarádes Pioníri Arkoúdes Ippótes Alepoúdes Kometes'),
  slav: words('Gladijatori Galebovi Vrane Ribari Pivari Pioniri Vitezovi Lisice Komete'),
  tur: words('Gladyatörler Martılar Kargalar Balıkçılar Öncüler Ayılar Şövalyeler Tilkiler Kuyruklu_Yıldızlar'),
  jpn: words('Falcons Sharks Foxes Stags Ravens Comets Knights Pioneers Rockets Lancers'),
  kor: words('Sharks Foxes Stags Ravens Comets Knights Pioneers Rockets Lancers Cranes'),
  tha: words('Sharks Foxes Stags Ravens Comets Knights Pioneers Rockets Crocodiles Buffaloes'),
};
const CLUB_MORE = {
  eng: [
    '{c} Hotspur',
    '{c} Vale',
    '{c} Stanley',
    '{c} North End',
    '{c} Royals',
    '{c} Swifts',
    '{c} Olympic',
    '{c} Corinthians',
    '{c} Dynamo',
    '{c} Sporting',
    'FC {c}',
    'AFC {c}',
    '{c} & District',
  ],
  spa: ['Racing {c}', 'Real {c}', 'Unión {c}', '{c} Balompié', 'Juventud {c}', 'Estudiantes de {c}'],
  ger: [
    'SV {c}',
    'TuS {c}',
    'Rot-Weiß {c}',
    'Blau-Weiß {c}',
    'SC {c} 1901',
    'Hertha {c}',
    'Borussia {c}',
    'Arminia {c}',
  ],
  fra: ['Olympique {c}', 'AS {c}', 'Racing {c}', 'Union {c}', 'Sporting {c}', 'FC {c}', 'Stade {c}', 'Étoile {c}'],
  ita: ['Virtus {c}', 'Unione {c}', 'Audace {c}', 'Atletico {c}', 'Pro {c}', 'Juventus {c}', 'Sporting {c}'],
  por: ['Sporting {c}', 'Académico {c}', 'União {c}', 'Os Belenenses de {c}', 'Naval {c}', 'Desportivo {c}'],
  nld: ['SV {c}', 'FC {c}', 'VV {c}', 'Sparta {c}', 'Go Ahead {c}', 'RKC {c}', 'ADO {c}'],
};
// Division and cup names a nation of that language may take instead of the first set
const TIER_SETS = {
  eng: [
    ['Super League', 'Challenge League', 'Second League', 'Third League', 'Fourth League'],
    ['Top Division', 'Division One', 'Division Two', 'Division Three', 'Division Four'],
    ['Elite Division', 'Challenge Division', 'Premier Division B', 'Union Division', 'Regional Division'],
    ['Premier Union', 'Union One', 'Union Two', 'Union Three', 'Union Four'],
  ],
  spa: [
    ['Liga Suprema', 'Liga Nacional', 'Segunda Federal', 'Tercera Federal', 'Liga Regional'],
    ['Primera Honor', 'Segunda Honor', 'Tercera Honor', 'Cuarta Honor', 'Quinta Honor'],
  ],
  por: [['Superliga', 'Liga Nacional', 'Liga Federal', 'Liga Regional', 'Liga Distrital']],
  bra: [['Série Nacional', 'Série Acesso', 'Série Federal', 'Série Estadual', 'Série Regional']],
  mex: [['Liga Premier', 'Liga de Plata', 'Liga Nacional', 'Liga Regional', 'Liga Estatal']],
  arg: [['Superliga', 'Primera Nacional', 'Primera Federal', 'Primera Regional', 'Liga Provincial']],
  ger: [
    ['Spitzenliga', 'Zweitliga', 'Drittliga', 'Viertliga', 'Fünftliga'],
    ['Meisterliga', 'Aufstiegsliga', 'Nordliga', 'Regionalliga', 'Landesliga'],
  ],
  nld: [['Hoofdklasse', 'Eerste Divisie', 'Tweede Divisie', 'Derde Divisie', 'Vierde Divisie']],
  nor: [['Elitserien', 'Første Divisjon', 'Andre Divisjon', 'Tredje Divisjon', 'Fjerde Divisjon']],
  fra: [
    ['Ligue Nationale', 'Ligue Deux', 'Nationale', 'Régional', 'Départemental'],
    ['Championnat de France', 'Division Deux', 'Division Trois', 'Régional Un', 'Régional Deux'],
  ],
  ita: [
    ['Serie Nazionale', 'Serie Cadetta', 'Serie C', 'Serie D', 'Eccellenza'],
    ['Lega Nazionale', 'Lega Cadetta', 'Lega Terza', 'Lega Quarta', 'Lega Regionale'],
  ],
  jpn: [['Super League', 'Challenge League', 'Regional League', 'Prefectural League', 'Local League']],
  kor: [['Super League', 'Challenge League', 'Regional League', 'Local League', 'Amateur League']],
  tha: [['Super League', 'League One', 'League Two', 'League Three', 'Regional League']],
};
const CUP_SETS = {
  eng: ['Challenge Cup', 'National Cup', 'Union Cup', 'Federation Trophy', 'Football Cup'],
  spa: ['Copa de la Federación', 'Copa Nacional', 'Copa del Rey Fundador', 'Copa de Campeones'],
  por: ['Taça da Federação', 'Taça Nacional', 'Taça de Portugal Nova', 'Taça dos Campeões'],
  bra: ['Copa da Federação', 'Copa Nacional', 'Copa Brasileira Nova', 'Copa dos Campeões'],
  ger: ['Verbandspokal', 'Nationalpokal', 'Meisterpokal', 'Bundespokal Neu'],
  nld: ['Federatiebeker', 'Nationale Beker', 'Landsbeker', 'Kampioensbeker'],
  fra: ['Coupe de la Fédération', 'Coupe Nationale', 'Coupe des Champions de France', 'Coupe de l’Union'],
  ita: ['Coppa della Federazione', 'Coppa Nazionale', 'Coppa dei Campioni d’Italia', 'Coppa dell’Unione'],
};
for (const [k, more] of Object.entries(NICK_MORE)) LANG[k].misc.push(...more.map((w) => w.replace(/_/g, ' ')));
for (const k of Object.keys(LANG)) LANG[k].key = k;
const langKey = (L) => L.key;
// The division names of a nation: the language's usual set, or one of its alternatives (r: a seeded random)
export const tiersFor = (L, r) => {
  const sets = [L.tiers, ...(L.tierSets || TIER_SETS[langKey(L)] || [])];
  return sets[Math.floor(r() * sets.length)];
};
// Alternative club-name patterns a language adds to its usual ones (worldgen uses them for a share of the clubs)
export const clubMoreFor = (L) => L.clubMore || CLUB_MORE[langKey(L)] || [];
export const cupFor = (L, r) => {
  const sets = [L.cup, ...(L.cups || CUP_SETS[langKey(L)] || []).filter((c) => c !== L.cup)];
  return sets[Math.floor(r() * sets.length)];
};
// An alternative nickname for a colour, where the language has some ("Red Devils", "Bluebirds")
export const colourAltFor = (L) => (L.colourAlt !== undefined ? L.colourAlt : COLOUR_ALT[langKey(L)]);
const COLOUR_ALT = {
  eng: {
    red: ['Red Devils', 'Crimsons', 'Scarlets', 'Reds'],
    blue: ['Bluebirds', 'Royals', 'Blue Army', 'Blues'],
    white: ['Lilywhites', 'Magpies', 'Whites', 'Seagulls'],
    black: ['Blackcats', 'Panthers', 'Blacks', 'Dark Horses'],
    yellow: ['Canaries', 'Hornets', 'Yellows', 'Bees'],
    green: ['Gladiators', 'Greens', 'Emeralds', 'Robins'],
    orange: ['Tangerines', 'Oranges', 'Foxes', 'Flames'],
    claret: ['Clarets', 'Maroons', 'Wine Reds', 'Burgundies'],
    sky: ['Sky Blues', 'Cityzens', 'Azure', 'Skyhawks'],
    navy: ['Navy', 'Mariners', 'Admirals', 'Navy Blues'],
  },
};
export const TIERS_BY = {
  CZE: ['První Liga', 'Druhá Liga', 'Třetí Liga', 'Čtvrtá Liga'],
  SVK: ['První Liga', 'Druhá Liga', 'Třetí Liga'],
  POL: ['Liga Główna', 'Liga Pierwsza', 'Liga Druga', 'Liga Trzecia'],
  HUN: ['Első Osztály', 'Második Osztály', 'Harmadik Osztály'],
  GRE: ['Alfa Liga', 'Beta Liga', 'Gamma Liga'],
  ROU: ['Liga Întâi', 'Liga a Doua', 'Liga a Treia'],
  SUI: ['Super Liga', 'Challenge Liga', 'Promotion Liga'],
  AUT: ['Bundesstaffel', 'Zweite Bundesstaffel', 'Regionalliga'],
};
export const CUP_BY = {
  CZE: 'Pohár Federace',
  SVK: 'Pohár Federácie',
  POL: 'Puchar Federacji',
  HUN: 'Szövetségi Kupa',
  GRE: 'Federation Kypello',
  ROU: 'Cupa Federației',
};
// ---------------------------------------------------------------- how clubs were founded
// Real clubs take their names from how they began: a works team, a church, a merger, a university, a migrant community, a
// company. These patterns follow that, region by region (see docs/NAMING_RULES.md). A pattern is a template: {c} is the
// town. Nothing here is a real club's name, only the words real clubs are built from.
// England and the British Isles: works teams, collieries, railways, churches and mergers
CLUB_MORE.eng.push(
  '{c} Works',
  '{c} Ironworks',
  '{c} Colliery Athletic',
  '{c} Railway',
  '{c} Foundry',
  "{c} St. Mary's",
  "{c} St. Luke's",
  '{c} Trinity',
  '{c} Bohemians',
  '{c} & Hallam',
);
// Germany and its neighbours
CLUB_MORE.ger.push(
  'Hansa {c}',
  'Schwarz-Weiß {c}',
  'Rot-Weiss {c}',
  'Fortuna {c}',
  'Eintracht {c}',
  'Concordia {c}',
  'Alemannia {c}',
  'Preußen {c}',
  'Kickers {c}',
  'Energie {c}',
);
// Spain and Portugal
CLUB_MORE.spa.push(
  'SD {c}',
  'Real Unión {c}',
  'Real Club Deportivo {c}',
  'Sporting {c}',
  'Racing Club {c}',
  'Atlético {c}',
);
CLUB_MORE.por.push('GD {c}', 'SC {c}', 'Sporting Clube de {c}', 'Clube Desportivo {c}', 'Atlético Clube {c}');
// Italy
CLUB_MORE.ita.push(
  'SS {c}',
  'Associazione Calcio {c}',
  'Polisportiva {c}',
  'Fidelis {c}',
  'Libertas {c}',
  'Robur {c}',
  'Vis {c}',
);
// France: Olympique, Stade, Racing, Athletic Club, Sporting Club
CLUB_MORE.fra.push(
  'Olympique de {c}',
  'Sporting Club de {c}',
  'Athletic Club {c}',
  'Stade de {c}',
  'Racing Club de {c}',
  'Union Sportive {c}',
);
// The Netherlands: Latin ideals and the old sportclubs
CLUB_MORE.nld.push('Excelsior {c}', 'Vitesse {c}', 'Fortuna {c}', 'Sportclub {c}', 'Concordia {c}', 'DVC {c}');
// South America: rowing clubs, neighbourhood clubs, "Independiente" and "Nacional"
LANG.bra.club.push('Clube de Regatas {c}', 'Nacional {c}', 'Sport Club {c}', 'Clube Atlético {c}');
LANG.arg.club.push('Club de Regatas {c}', 'Club Sportivo {c}', 'Nacional {c}', 'Club Atlético Unión {c}');
// Eastern Europe: Dinamo, Rapid, Partizan, Radnički (workers); the Soviet-era sports societies only for clubs old enough
LANG.slav.clubMore = [
  'Dinamo {c}',
  'Rapid {c}',
  'Partizan {c}',
  'Radnički {c}',
  'Rudar {c}',
  'Železničar {c}',
  'Mladost {c}',
];
LANG.slav.oldClub = [
  'Lokomotiv {c}',
  'Spartak {c}',
  'Torpedo {c}',
  'Metalac {c}',
  'Zenit {c}',
  'Dinamo {c}',
  'Sloga {c}',
];
LANG.pol.oldClub = ['Gwardia {c}', 'Włókniarz {c}', 'Budowlani {c}', 'Stal {c}'];
LANG.cze.oldClub = ['Dukla {c}', 'Spartak {c}', 'Železárny {c}', 'Sparta {c}'];
// Mexico: companies and cooperatives, universities, trades and animals (Cementeros, Mineros, Venados, Zorros)
LANG.mex.club.push(
  'Universidad de {c}',
  'Club Universidad {c}',
  'Cooperativa {c}',
  'Mineros de {c}',
  'Petroleros de {c}',
  'Cementeros de {c}',
  'Azucareros de {c}',
  'Venados de {c}',
  'Zorros de {c}',
  'Toros de {c}',
  'Lobos {c}',
  'Club Deportivo {c}',
);
LANG.mex.misc.push(...words('Zorros Venados Cementeros Petroleros Azucareros Cobras Guerreros Pumas'));
// Japan: the hometown, then a foreign word for something local (cherry tree, arrow, deer): Italian, Spanish, Latin, English
LANG.jpn.club.push(
  ...cross(
    '{c} {w}',
    'Albatros Falcons Kestrels Kingfishers Aurora Stella Vento Lumina Nova Cometa Sol Rayo Mare Fiore Riverside Bluewave Verdant Pino',
  ),
  'FC {c} Riverside',
);
LANG.jpn.misc.push(...words('Albatros Kingfishers Falcons Stella Aurora Vento Cranes Deer'));
// South Korea and China: the city, the owning company's trade and a nickname
LANG.kor.club.push(
  ...cross(
    '{c} {w}',
    'Steel_Mariners Dynamics_FC Motors_FC Shipbuilders_FC Electric_Tigers Chemical_Dolphins Heavy_Eagles Silk_Dragons Petroleum_FC Copper_Phoenix',
  ).map((x) => x.replace(/_/g, ' ')),
);
// Thailand: United above all, with a province or a company
LANG.tha.club.push('{c} Rapids United', '{c} Port', 'Muang {c} United', '{c} Provincial United');
// The way a club's name hints at its nickname: a Colliery side are the Miners
const NAME_NICK = {
  Colliery: 'Miners',
  Ironworks: 'Ironmen',
  Foundry: 'Foundrymen',
  Railway: 'Railwaymen',
  Works: 'Workmen',
  Mineros: 'Mineros',
  Cementeros: 'Cementeros',
  Petroleros: 'Petroleros',
  Steel: 'Steelmen',
  Shipbuilders: 'Shipwrights',
  Lumberjacks: 'Lumberjacks',
  Silk: 'Silkmen',
};
// Words that mark a culture: a club named with one is flagged when it turns up in a nation whose language doesn't use it
// ("Real Hamburg", "Dinamo Cardiff", an Al- club in Turkey). word -> the language groups that may use it.
const MARKERS = {
  Real: ['spa', 'mex'],
  Deportivo: ['spa', 'mex', 'arg'],
  Olympique: ['fra'],
  Stade: ['fra'],
  Eintracht: ['ger'],
  Borussia: ['ger'],
  Hansa: ['ger'],
  Viktoria: ['ger', 'cze'],
  Teutonia: ['ger'],
  Germania: ['ger'],
  Arminia: ['ger'],
  Hertha: ['ger'],
  Alemannia: ['ger'],
  Preußen: ['ger'],
  Fortuna: ['ger', 'nld', 'pol', 'por'],
  Dinamo: ['slav', 'pol', 'cze', 'hun', 'gre', 'eng', 'rus', 'blr'],
  Dynamo: ['slav', 'pol', 'cze', 'hun', 'gre', 'eng', 'ger', 'ukr'],
  Lokomotiv: ['slav', 'cze', 'pol', 'rus', 'blr'],
  Lokomotyv: ['ukr'],
  Lokomotiva: ['slav', 'cze', 'pol'],
  Spartak: ['slav', 'cze', 'pol', 'rus', 'blr', 'ukr'],
  Torpedo: ['slav', 'rus', 'blr', 'ukr'],
  Zenit: ['slav', 'rus'],
  CSKA: ['rus'],
  Krylia: ['rus'],
  Zvezda: ['rus'],
  Shinnik: ['rus'],
  Shakhtyor: ['rus', 'blr'],
  Shakhtar: ['ukr'],
  Metalist: ['ukr'],
  Metalurh: ['ukr'],
  Karpaty: ['ukr'],
  Chornomorets: ['ukr'],
  Zorya: ['ukr'],
  Naftovyk: ['ukr'],
  Hirnyk: ['ukr'],
  Neman: ['blr'],
  Naftan: ['blr'],
  Belshina: ['blr'],
  Isloch: ['blr'],
  Partizan: ['slav'],
  Al: ['arab'],
  Royal: ['nld'],
  Koninklijke: ['nld'],
  Unione: ['ita'],
  Calcio: ['ita'],
  Esporte: ['por', 'bra'],
  Clube: ['por', 'bra'],
  Grêmio: ['por', 'bra'],
  Gimnasia: ['arg'],
  Estudiantes: ['arg', 'spa'],
  Defensores: ['arg'],
  Belediyespor: ['tur'],
  Górnik: ['pol'],
  Zagłębie: ['pol'],
  Slavia: ['cze', 'slav', 'blr'],
  Slavoj: ['cze', 'slav'],
  Sokol: ['cze', 'slav', 'pol'],
  Panathlitikos: ['gre'],
  Ethnikos: ['gre'],
  Apollon: ['gre'],
};
// the first marker word in a name that its nation's language does not use, else null
export const crossCulture = (name, L) => {
  for (const w of String(name).split(/[\s-]+/)) {
    const ok = MARKERS[w];
    if (ok && !ok.includes(L.key) && !(L.markersOk || []).includes(w)) return w;
  }
  return null;
};
// Fantasy names read as parody on a football club (Dragonheart FC): these words are kept out of club names
const FANTASY = words(
  'dragonheart shadowfang doomhammer wraith inferno skullcrusher reaper venom bloodfang ironfist stormborn nightblade hellfire',
);
export const isFantasy = (name) => {
  const t = plain(name).replace(/[^a-z]/g, '');
  return FANTASY.some((w) => t.includes(w));
};
export const nameNick = (name) => {
  for (const [w, n] of Object.entries(NAME_NICK)) if (String(name).split(/\s+/).includes(w)) return n;
  return null;
};

// Nations that share a language but not a landscape get building blocks of their own: Scottish, Welsh and Irish
// towns, American and Australian ones, instead of one English list with different spellings
const NATION_L = {
  SCO: {
    ...LANG.eng,
    a: words(
      `Aber Auch Bal Bannock Blair Cal Clack Craig Cumb Dal Drum Dun Fal Glen Inver Kil Kin Kirk Lang Loch Mon Nairn Pit Strath
      Tay Torry Tulli Dun Fraser Gal Haw Innes Jed Kel Lin Lock Moff Peeb Ros Selk Stran`,
    ),
    b: words('burgh ness dee ie more ray rie ock wick mouth loch kirk side bridge ton land shiels'),
    pre: ['Upper', 'Nether', 'Easter', 'Wester', 'Mid', 'Kirk'],
    joins: ['-on-Tay', '-on-Spey', '-by-the-Sea', ' of the Glens', '-on-Forth'],
    // Scottish clubs: Thistle, Academical, Juniors, Athletic ...; parks and gardens, lairds and clansmen
    club: [
      ...rep(['{c} United', '{c} Town'], 3),
      ...rep(['{c} Athletic', '{c} Rovers'], 2),
      '{c} Thistle',
      '{c} Albion',
      '{c} Vale',
      '{c} Academical',
      '{c} Juniors',
      '{c} Victoria',
      '{c} City',
      '{c} Wanderers',
    ],
    ground: ['{c} Park', '{x} Park', '{c} Gardens', '{x} Green', '{x} Road', '{c} Muir', '{x} Brae'],
    misc: words(
      'Lairds Highlanders Clansmen Pipers Mariners Drovers Foresters Weavers Fishermen Ironmen Thistles Stags',
    ),
    colourAlt: null,
    clubMore: ['{c} Burgh', 'Inter {c}', '{c} Hearts Athletic'],
    tiers: ['Premier Division', 'Division One', 'Division Two', 'Division Three', 'Regional Division'],
    tierSets: [['Elite Division', 'Championship Division', 'Second Division', 'Third Division', 'Highland Division']],
    cup: 'Challenge Shield',
    cups: ['Scottish Shield', 'National Trophy', 'Federation Cup'],
    quirk: ['Upper', 'Nether', 'Mid', 'Easter', 'Wester', 'Old', 'New'],
  },
  WAL: {
    ...LANG.eng,
    a: words(
      `Aber Bala Bangor Caer Carn Clyn Cors Cwm Dyff Fish Glyn Llan Llang Llwyn Mach Pen Pont Porth Rhos Rhyd Tal Tre Ysgy
      Brec Conw Dolg Harl Mol Neat Ogm Rhay Tenb Ystrad`,
    ),
    b: words('wyn ydd fa ni dre oed dy gwyn ogg fan bach llyn nant ach ant ddu'),
    pre: ['Llan', 'Pen', 'Aber', 'Caer', 'Porth'],
    preGap: '',
    joins: [' Bach', ' Fawr', '-y-Bont', ' Uchaf'],
    // Welsh clubs: Town, City, AFC, Vale, Welfare; Parc grounds, dragons and valleymen
    club: [
      ...rep(['{c} Town', '{c} City'], 3),
      ...rep(['{c} Rovers', '{c} United'], 2),
      '{c} Athletic',
      '{c} Albion',
      'AFC {c}',
      '{c} Vale',
      '{c} Wanderers',
      '{c} Welfare',
      '{c} Borough',
    ],
    ground: ['{c} Park', 'Parc {x}', '{x} Road', 'Stadiwm {c}', '{c} Ground', '{x} Field', 'Maes {x}'],
    misc: words('Dragons Miners Valleymen Druids Harpers Quarrymen Drovers Ravens Choristers Shepherds'),
    colourAlt: null,
    clubMore: ['{c} Cymru', 'Clwb {c}', '{c} Hotspur'],
    tiers: ['Premier Division', 'Division One', 'Division Two', 'Division Three', 'Regional Division'],
    tierSets: [['Uwch Division', 'Ail Division', 'Trydedd Division', 'Pedwaredd Division', 'Cynghrair Rhanbarthol']],
    cup: 'Challenge Cup',
    cups: ['Cwpan Her', 'National Cup', 'Federation Shield'],
    quirk: ['Upper', 'Lower', 'Old', 'New', 'Caer', 'Pen'],
  },
  IRL: {
    ...LANG.eng,
    a: words(
      `Bally Ard Bun Carrick Clon Cor Dun Drom Glen Kil Kin Lis Mal Mon Naa New Rath Ros Slig Tul Tub Ath Bal Cas Dro Enn
      Glin Kell Lim Mull Oran Port Tram Wick`,
    ),
    b: words('more agh drum town gar garvan lough mullen na kenny bridge ford ard ree glass dara'),
    pre: ['Upper', 'Lower', 'Old', 'Little', 'Castle', 'Port'],
    joins: [' Cross', '-on-Shannon', ' Bridge', ' Upper'],
    // Irish clubs: Rovers, United, Celtic, Swifts, Harps, Hibernians; showgrounds and parks
    club: [
      ...rep(['{c} Rovers', '{c} United'], 3),
      ...rep(['{c} City', '{c} Town'], 2),
      '{c} Celtic',
      '{c} Athletic',
      '{c} Wanderers',
      '{c} Swifts',
      '{c} Harps',
      '{c} Shamrocks',
      '{c} Gaels',
    ],
    ground: ['{c} Park', '{x} Park', '{c} Showgrounds', '{x} Road', '{c} Oval', '{x} Street', '{c} Lawn'],
    misc: words('Rebels Shamrocks Saints Harps Gaels Clansmen Fianna Corsairs Drovers Hurlers Tricolours'),
    colourAlt: null,
    clubMore: ['{c} Bohs', 'Inter {c}', '{c} Dynamos'],
    tiers: ['Premier Division', 'Division One', 'Division Two', 'Division Three', 'Provincial League'],
    tierSets: [['Senior Premier', 'Senior One', 'Senior Two', 'Senior Three', 'Provincial League']],
    cup: 'Challenge Cup',
    cups: ['Irish Trophy', 'National Shield', 'Federation Cup'],
    quirk: ['Upper', 'Lower', 'Old', 'Little', 'Castle', 'Port'],
  },
  USA: {
    ...LANG.eng,
    a: words(
      `Spring Lake Fort Port Oak River Pine Cedar Maple Elk Bear Eagle Red Blue White Rock Silver Golden Sun Green Mill Bay
      Cherry Walnut Hickory Prairie Mesa Canyon Harbor Summit Willow Aspen Cypress`,
    ),
    b: words('field ville port ton burg wood dale ford view haven falls springs ridge bluff creek hills grove'),
    pre: ['New', 'Port', 'Fort', 'Lake', 'Mount', 'San', 'Santa', 'El', 'North', 'South', 'West', 'East'],
    joins: [' Heights', ' Springs', ' Falls', ' Park', ' Beach'],
    // American clubs: FC and SC, Inter, Sporting, Real, and a mascot after the city; arenas and fields
    club: [
      ...rep(['{c} FC', '{c} SC'], 3),
      ...rep(['FC {c}', '{c} United'], 2),
      'Inter {c}',
      'Sporting {c}',
      'Real {c}',
      'AC {c}',
      '{c} City FC',
      '{c} Athletic',
      // company towns and old industry: Foundry, Lumber, Ironworks, Brewers
      '{c} Foundry United',
      '{c} Lumberjacks',
      '{c} Ironworks SC',
      '{c} Brewers',
      ...[
        'Thunder',
        'Storm',
        'Blaze',
        'Surge',
        'Fury',
        'Heat',
        'Mustangs',
        'Pioneers',
        'Rockets',
        'Stallions',
        'Express',
        'Fire',
      ].map((m) => `{c} ${m}`),
    ],
    ground: ['{c} Stadium', '{x} Field', '{x} Park', '{c} Arena', '{x} Stadium', '{c} Field', '{p} Field'],
    misc: words(
      'Wolves Mustangs Eagles Bison Pioneers Thunder Storm Lightning Rockets Stallions Comets Voyagers Dragons Foxes Crush Fire',
    ),
    colourAlt: null,
    markersOk: ['Real'],
    clubMore: ['{c} Rapids', '{c} Union Club', '{c} Revolution'],
    tiers: ['Major League', 'Championship League', 'Division Two', 'Division Three', 'Regional League'],
    tierSets: [['Super League', 'Challenge League', 'Open Division', 'Amateur Division', 'Regional League']],
    cup: 'Challenge Cup',
    cups: ['National Cup', 'Federation Cup', 'Founders Cup', 'Liberty Cup'],
    quirk: ['New', 'Port', 'Fort', 'Lake', 'Mount'],
  },
  AUS: {
    ...LANG.eng,
    a: words(
      `Bunda Bun Carn Cob Dub Geral Gin Gol Kal Katoo Kyne Mand Mor Nar Now Wag Wall War Yarr Wodo Albu Bal Tam
      Mil Port Coff Cess Echu Gym Hayl Yas`,
    ),
    b: words('bool dah gong nup bin ton ra by ville lea wa ooka dale ford more cannon nunda'),
    pre: ['Port', 'Mount', 'North', 'South', 'East', 'West', 'Lake', 'New'],
    joins: [' Heights', ' Bay', ' Beach', ' Creek', ' Plains'],
    // Australian clubs: FC, City, United, Wanderers, Strikers
    club: [
      ...rep(['{c} FC', '{c} City'], 3),
      ...rep(['{c} United', '{c} Wanderers'], 2),
      '{c} Athletic',
      '{c} Strikers',
      '{c} Roar',
      '{c} Heart',
      'Sporting {c}',
      // one-word city nicknames, and the migrant communities' clubs (Hellas, Olympic, Knights)
      '{c} Victory',
      '{c} Jets',
      '{c} Mariners',
      '{c} Hellas',
      '{c} Olympic',
      '{c} Knights',
      '{c} Azzurri',
    ],
    ground: ['{c} Oval', '{x} Park', '{c} Stadium', '{x} Reserve', '{c} Sportsground', '{x} Field'],
    misc: words('Kookaburras Koalas Wallabies Dingoes Sharks Stingers Roos Magpies Emus Crocs Drovers Miners'),
    colourAlt: null,
    clubMore: ['{c} Rovers', '{c} Strikers FC'],
    tierSets: [['A-Division', 'B-Division', 'State Premier', 'State One', 'Regional League']],
    cup: 'Challenge Cup',
    cups: ['National Cup', 'Federation Cup', 'Southern Cross Cup'],
    quirk: ['North', 'South', 'East', 'West', 'Port', 'Mount'],
  },
  BEL: {
    ...LANG.nld,
    // Belgium: Royal and Koninklijke (KV, KRC, KSC, RSC), Standard, Union, Racing
    club: [
      ...rep(['KV {c}', 'KRC {c}', 'FC {c}'], 2),
      'KSC {c}',
      'RSC {c}',
      'Royal {c}',
      'Standard {c}',
      'Union {c}',
      'Racing {c}',
      'KFC {c}',
      'KAA {c}',
      'SK {c}',
    ],
    clubMore: ['Sporting {c}', 'Koninklijke {c}', 'Royal Union {c}', 'Excelsior {c}'],
    ground: ['Stedelijk Stadion {c}', 'Stade Communal de {c}', '{x} Stadion', 'Gemeentelijk Stadion {c}', 'Stade {x}'],
  },
  THA: {
    ...LANG.tha,
    // Thailand: United above all, with a province or a company
    club: [
      ...rep(['{c} United'], 5),
      'FC {c}',
      '{c} City',
      '{c} Rapids United',
      '{c} Port',
      'Muang {c} United',
      '{c} Provincial United',
      '{c} Athletic',
      '{c} FC',
    ],
  },
  NGA: {
    ...LANG.eng,
    a: words('Ib Kan Ab Ow En Il Kad Jos Mai Uy Ad Sag Ogb Awk Nsu Umu Osh Ake Ond Ika Bad Ede'),
    b: words('adan ano a erri ugu orin una ri ara yo ure ede ibo ozo wa gun uko'),
    elide: true,
    pre: [],
    joins: [],
    // Nigerian clubs: United, Stars, Rangers, Pillars, Warriors; township stadiums
    club: [
      ...rep(['{c} United', '{c} Stars', '{c} Rangers'], 2),
      '{c} FC',
      '{c} City',
      '{c} Warriors',
      '{c} Pillars',
      '{c} Lions',
      '{c} Wolves',
      'Sunshine {c}',
      'Shooting {c}',
      '{c} Heartland',
      '{c} Eagles',
      '{c} Rovers',
    ],
    ground: ['{x} Stadium', '{c} Township Stadium', '{c} Sports Complex', '{x} Arena', '{c} Independence Stadium'],
    misc: words('Pillars Lions Eagles Elephants Wolves Warriors Stars Porcupines Leopards Chiefs'),
    colourAlt: null,
    clubMore: ['{c} Pillars FC', '{c} Giants', 'Union {c}'],
    cup: 'Federation Cup',
    cups: ['National Cup', 'Challenge Cup', 'Independence Cup'],
    quirk: ['Old', 'New', 'Upper', 'Lower'],
  },
  GHA: {
    ...LANG.eng,
    a: words('Ak Ku Ta Ho Sek Ko Ba Ad Wa Su Ber Tem Tak Yen Ana Bol Dun Eff Nko'),
    b: words('ra masi male ho ondi ase adi umu ofu ora kam'),
    elide: true,
    pre: [],
    joins: [],
    // Ghanaian clubs: United, Stars, Hearts, Lions; animal and spirit nicknames
    club: [
      ...rep(['{c} United', '{c} Stars'], 3),
      '{c} FC',
      '{c} Hearts',
      '{c} Lions',
      '{c} Heroes',
      '{c} Gold Stars',
      'Real {c}',
      '{c} Porcupines',
      '{c} Mighty United',
    ],
    ground: ['{x} Stadium', '{c} Sports Stadium', '{c} Park', '{x} Arena', '{c} Cultural Stadium'],
    misc: words('Porcupines Lions Stars Hearts Elephants Eagles Leopards Antelopes Buffaloes'),
    colourAlt: null,
    markersOk: ['Real'],
    clubMore: ['{c} Hearts of Oak', '{c} Great United', 'Union {c}'],
    cup: 'Federation Cup',
    cups: ['National Cup', 'Challenge Cup', 'Independence Cup'],
    quirk: ['Old', 'New', 'Upper', 'Lower'],
  },
  SEN: {
    ...LANG.fra,
    a: words('Dak Thi Zig Kao Lou Tamb Kol Mbo Fat Sed Bak Bou Yam Dal San Kor Man Odi Gag Dab'),
    b: words('ar ès inchor lack ack ouo ra oro dougou kro ssou ké ma gou'),
    elide: false,
    pre: [],
    joins: [],
    // West African clubs on the French pattern: AS, ASC, US, Stade, Étoile, Jeunesse, with animal nicknames
    club: [
      ...rep(['AS {c}', 'ASC {c}', 'US {c}'], 2),
      'Stade de {c}',
      'Étoile de {c}',
      'Union Sportive de {c}',
      'Jeunesse Sportive {c}',
      'Racing {c}',
      'Sporting {c}',
      'Olympique de {c}',
      '{c} FC',
    ],
    clubMore: ['Académie {c}', 'AS {c} Mimosas', 'Union {c}'],
    ground: ['Stade {x}', 'Stade Municipal de {c}', 'Stade de la Paix {c}', 'Stade {p}', 'Complexe Sportif {c}'],
    misc: words('Lions Éléphants Panthères Aigles Mimosas Gazelles Crocodiles Buffles'),
    quirk: [],
  },
  MAR: {
    ...LANG.fra,
    a: words('Ben Sid Tif Ouj Ber Taz Kha Mek Saf Ag Tan Tet Ned Nad Oul Mid Ifr Sal Azr'),
    b: words('ane ar at ira ouan ine ad et ali oun ia ek'),
    elide: false,
    pre: ['Sidi', 'Ain', 'Bir', 'Oued', 'Ben', 'Beni'],
    preGap: ' ',
    joins: ['-el-Kebir', ' el Jadida'],
    // Moroccan clubs: the French pattern (US, Étoile Sportive, Olympique) with Arabic words (Chabab, Najah, Amal, Nahda)
    club: [
      ...rep(['US {c}', 'Union Sportive {c}', 'Chabab {c}'], 2),
      'Étoile Sportive de {c}',
      'Olympique {c}',
      'Association Sportive {c}',
      'Racing {c}',
      'Najah {c}',
      'Amal {c}',
      'Itihad {c}',
      'Nahda {c}',
      '{c} FC',
      'SC {c}',
      'Hilal {c}',
    ],
    clubMore: ['Union {c}', 'Sporting {c}'],
    ground: ['Stade {x}', 'Stade Municipal de {c}', 'Complexe Sportif {c}', 'Stade {p}', 'Grand Stade de {c}'],
    misc: words('Lions Atlas Aigles Faucons Gazelles Léopards Fennecs Cèdres'),
    quirk: ['Sidi', 'Ain', 'Oued', 'Ben'],
  },
  // The East Slavic nations each have a library of their own, apart from the Balkan one: Latin transliterations of
  // Russian, Ukrainian and Belarusian, the sports societies of the Soviet years (kept for older clubs) and the
  // factory, mine and railway names that came with them
  RUS: {
    ...LANG.slav,
    key: 'rus',
    nations: 'RUS',
    a: words(
      `Bel Vor Kras Svet Tul Ryaz Kal Yar Smol Tver Per Sar Kurs Orl Bry Vlad Chel Kem Tom Irk Khab Pesk Lug Ust Bor Dmit
      Zar Kol Mur Pod Nar Zvon Lip Ros Yel Sort Kin Arz`,
    ),
    b: words('grad sk ov ino insk ovsk ka ovo evo ensk gorsk burg bor'),
    elide: false,
    pre: ['Novo', 'Staro', 'Verkhne', 'Nizhne', 'Sredne'],
    preGap: '',
    joins: ['-na-Mere', '-na-Sine', '-na-Ladge'],
    // modern clubs are FK or FC; the Soviet-era names (Dinamo, Spartak, Lokomotiv, Torpedo, CSKA, industry) only on old ones
    club: [
      ...rep(['FK {c}', 'FC {c}'], 4),
      '{c} FK',
      'Akademiya {c}',
      'Olimp {c}',
      'Atlant {c}',
      'Sibir {c}',
      'Ural {c}',
      'Volga {c}',
    ],
    clubMore: ['Krylia {c}', 'Fakel {c}', 'Luch {c}', 'Znamya {c}', 'Avangard {c}', 'Energiya {c}', 'Baltika {c}'],
    oldClub: [
      'Dinamo {c}',
      'Spartak {c}',
      'Lokomotiv {c}',
      'Torpedo {c}',
      'Zenit {c}',
      'CSKA {c}',
      'Trud {c}',
      'Metallurg {c}',
      'Shakhtyor {c}',
      'Khimik {c}',
      'Shinnik {c}',
      'Neftyanik {c}',
      'Zvezda {c}',
    ],
    ground: [
      'Stadion {c}',
      'Tsentralny Stadion {c}',
      '{x} Arena',
      'Stadion imeni {p}',
      'Stadion {x}',
      'Stadion Dinamo {c}',
    ],
    colours: {
      red: 'Krasnye',
      blue: 'Siniye',
      white: 'Belye',
      black: 'Chernye',
      yellow: 'Zheltye',
      green: 'Zelenye',
      orange: 'Oranzhevye',
      claret: 'Vinnye',
      sky: 'Golubye',
      navy: 'Temno-sinie',
    },
    misc: words('Volki Medvedi Orly Sokoly Kozaki Gusary Shakhtyory Metallurgi Neftyaniki Kosmonavty Zhuravli'),
    tiers: ['Vysshaya Liga', 'Pervaya Liga', 'Vtoraya Liga', 'Tretya Liga', 'Zonalnaya Liga'],
    tierSets: [['Premier Divizion', 'Pervyy Divizion', 'Vtoroy Divizion', 'Tretiy Divizion', 'Zonalny Divizion']],
    cup: 'Kubok Federatsii',
    cups: ['Kubok Natsii', 'Kubok Rossii Novy', 'Kubok Soyuza'],
    quirk: ['Novo-', 'Staro-', 'Verkhne-', 'Nizhne-'],
  },
  UKR: {
    ...LANG.slav,
    key: 'ukr',
    nations: 'UKR',
    a: words(
      `Bor Cher Dru Hlu Hor Kal Kre Lyu Mal Okh Pol Rov Sum Tern Vin Zap Zhov Mar Kov Shep Yav Bil Han Kam Pry Sta Tros
      Dub Rad Khm Nem`,
    ),
    b: words('ivka ychi ove yne ivtsi opil yska ske ska ets ychi ka ivske'),
    elide: false,
    pre: ['Nova', 'Stara', 'Verkhnia', 'Nyzhnia', 'Velyka', 'Mala'],
    preGap: ' ',
    joins: [],
    club: [
      ...rep(['FK {c}', 'FC {c}'], 4),
      '{c} FK',
      'Akademiia {c}',
      'Olimpik {c}',
      'Veres {c}',
      'Kolos {c}',
      'Prykarpattia {c}',
      'Podillia {c}',
    ],
    clubMore: [
      'Zorya {c}',
      'Karpaty {c}',
      'Chornomorets {c}',
      'Volyn {c}',
      'Polissia {c}',
      'Bukovyna {c}',
      'Skala {c}',
    ],
    oldClub: [
      'Dynamo {c}',
      'Shakhtar {c}',
      'Metalist {c}',
      'Metalurh {c}',
      'Spartak {c}',
      'Lokomotyv {c}',
      'Torpedo {c}',
      'Naftovyk {c}',
      'Hirnyk {c}',
      'Avanhard {c}',
    ],
    ground: ['Stadion {c}', 'Mis’kyi Stadion {c}', '{x} Arena', 'Stadion imeni {p}', 'Stadion {x}', 'Olimpiiskyi {c}'],
    colours: {
      red: 'Chervoni',
      blue: 'Syni',
      white: 'Bili',
      black: 'Chorni',
      yellow: 'Zhovti',
      green: 'Zeleni',
      orange: 'Pomaranchevi',
      claret: 'Vyshnevi',
      sky: 'Blakytni',
      navy: 'Temno-syni',
    },
    misc: words('Hirnyky Metalurhy Orly Vovky Kozaky Zubry Lvy Sokoly Haidamaky Charivnyky'),
    tiers: ['Vyshcha Liha', 'Persha Liha', 'Druha Liha', 'Tretia Liha', 'Oblasna Liha'],
    tierSets: [['Premier Dyvizion', 'Persha Dyvizion', 'Druha Dyvizion', 'Tretia Dyvizion', 'Oblasna Dyvizion']],
    cup: 'Kubok Federatsii',
    cups: ['Kubok Natsii', 'Kubok Nezalezhnosti', 'Kubok Soiuzu'],
    quirk: ['Nova', 'Stara', 'Verkhnia', 'Nyzhnia'],
  },
  BLR: {
    ...LANG.slav,
    key: 'blr',
    nations: 'BLR',
    a: words(
      `Bar Maz Ras Pin Lid Mol Slon Bab Zhod Svet Vil Kobr Orsh Kar Mikh Nesv Sma Hlyb Brag Dok Kas Chas Rak Dzy Pruz Lah`,
    ),
    b: words('ichy ava ovka ensk ka ilovichy shchyna ovichy yn ets'),
    elide: false,
    pre: ['Novy', 'Stary', 'Vyalikaya', 'Malaya'],
    preGap: ' ',
    joins: [],
    club: [
      ...rep(['FK {c}', 'FC {c}'], 4),
      '{c} FK',
      'Slavia {c}',
      'Isloch {c}',
      'Neman {c}',
      'Naftan {c}',
      'Belshina {c}',
    ],
    clubMore: ['Granit {c}', 'Energetik {c}', 'Dnepr {c}', 'Smena {c}', 'Vedrich {c}'],
    oldClub: [
      'Dinamo {c}',
      'Torpedo {c}',
      'Lokomotiv {c}',
      'Shakhtyor {c}',
      'Spartak {c}',
      'Traktor {c}',
      'Khimik {c}',
    ],
    ground: ['Stadyen {c}', 'Haradski Stadyen {c}', '{x} Arena', 'Stadyen {x}', 'Stadyen Dinamo {c}'],
    colours: {
      red: 'Chyrvonyya',
      blue: 'Siniya',
      white: 'Belyya',
      black: 'Chornyya',
      yellow: 'Zholtyya',
      green: 'Zyalenyya',
      orange: 'Aranzhavyya',
      claret: 'Vishnyovyya',
      sky: 'Blakitnyya',
      navy: 'Cyomna-siniya',
    },
    misc: words('Zubry Busly Vauki Miadzvedzi Arly Rybaki Konnitsa Hrenadzery'),
    tiers: ['Vysheyshaya Liga', 'Pershaya Liga', 'Druhaya Liga', 'Treciaya Liga', 'Rehyyanalnaya Liga'],
    tierSets: [['Premier Dyvizion', 'Pershy Dyvizion', 'Druhi Dyvizion', 'Treci Dyvizion', 'Rehyyanalny Dyvizion']],
    cup: 'Kubak Federatsii',
    cups: ['Kubak Natsyi', 'Kubak Svabody', 'Kubak Soyuza'],
    quirk: ['Novy', 'Stary', 'Vyalikaya', 'Malaya'],
  },
};
// Southeast Asia and South Africa: each with a town-name pattern and club habits of its own
const SEA_BASE = {
  elide: false,
  pre: [],
  preGap: '',
  joins: [],
  ground: ['{x} Stadium', '{c} Provincial Stadium', '{x} Arena', '{x} Sports Park'],
  colours: LANG.tha.colours,
  tiers: ['Premier League', 'Division 1', 'Division 2', 'Division 3', 'Regional League'],
};
NATION_L.SGP = {
  ...LANG.tha,
  ...SEA_BASE,
  a: words('Pasir Bukit Teluk Kampong Jalan Bandar Taman'),
  b: words('Lintang Tembusu Rasau Selat Jerangau Mawar Kenanga Temasek'),
  elide: false,
  club: [
    ...rep(['{c} United', '{c} Rovers', '{c} FC'], 2),
    '{c} International',
    '{c} Athletic',
    'Lion {c}',
    '{c} Warriors',
  ],
  ground: ['{x} Stadium', '{c} Sports Hub', '{x} Arena'],
  misc: words('Lions Eagles Stags Tigers Jaguars Cheetahs Swans'),
  cup: 'Cup',
  gap: ' ',
};
NATION_L.MYS = {
  ...LANG.tha,
  ...SEA_BASE,
  a: words('Kuala Kota Batu Pasir Teluk Bukit Tanjung Sungai Pulau Simpang Bandar'),
  b: words('Selasih Mutiara Jelai Rimba Damai Lenggeng Pelita Karang Segar Nilam Tebing Indah'),
  club: [...rep(['{c} FC', '{c} United'], 3), '{c} City', 'Darul {c}', 'Sri {c}', '{c} Athletic'],
  misc: words('Tigers Eagles Turtles Panthers Hornbills Rhinos Deer'),
  cup: 'Cup',
  gap: ' ',
  elide: false,
};
NATION_L.VIE = {
  ...LANG.tha,
  ...SEA_BASE,
  a: words('Hai Nam Thanh Ha Quang Binh Khanh Phu Thai Lam Bac Dong Long Vinh Tuyen Cao Son Yen'),
  b: words('Lam Truong Hung Khe Mai Thuy Cuong Phat Loc Sa Dai Tan Thinh Hien'),
  club: [...rep(['{c} FC'], 3), '{c} United', '{c} Athletic', 'Thep {c}', 'Song {c}', '{c} City'],
  misc: words('Dragons Eagles Lions Tigers Falcons Cranes'),
  cup: 'Cup',
  gap: ' ',
  elide: false,
};
NATION_L.IDN = {
  ...LANG.tha,
  ...SEA_BASE,
  a: words('Ban Sura Mala Sema Bogo Tang Kedi Pama Sola Cire Tasi Pura Jemb Lang'),
  b: words('ngan baya rang mulan pura kalan sari lembang jaya wati dongan giri'),
  club: [...rep(['Persi {c}'], 4), '{c} United', '{c} FC', 'PS {c}', '{c} Putra', 'Bhakti {c}'],
  misc: words('Tigers Crocodiles Lions Eagles Panthers Garuda'),
  cup: 'Cup',
  elide: true,
};
NATION_L.PHI = {
  ...LANG.tha,
  ...SEA_BASE,
  a: words('Bula Pam Baga Mari Bina Pasi Cabu Olon Lago Dumag Taga Tala'),
  b: words('can ngan bay lan tuan galan ngas yaan bantay guin'),
  club: [...rep(['{c} FC', '{c} United'], 3), '{c} City', 'Stallion {c}', '{c} Warriors', '{c} Eagles'],
  misc: words('Eagles Stallions Warriors Sharks Diggers Sparks'),
  cup: 'Cup',
  elide: true,
  pre: ['San', 'Santa', 'Santo'],
  preGap: ' ',
};
NATION_L.RSA = {
  ...LANG.eng,
  a: words('Kru Marab Thab Mbom Lade Ulun Sibo Rand Hout Bett Vrede Sasol Nels Pong Vol Kwa Phal'),
  b: words('burg dal stad kop fontein vlei rus berg ston ula bela doorn'),
  elide: true,
  pre: [],
  joins: [],
  club: [
    ...rep(['{c} United', '{c} City', '{c} Stars'], 2),
    '{c} Chiefs',
    '{c} Pirates',
    '{c} Swallows',
    '{c} Arrows',
    '{c} Celtic Rovers',
    '{c} FC',
  ],
  ground: ['{x} Stadium', '{c} Oval', '{x} Park', '{c} Sports Complex'],
  misc: words('Chiefs Pirates Swallows Arrows Stars Lions Rhinos Springboks'),
  colourAlt: null,
  tiers: ['Premier Soccer League', 'National First Division', 'Second Division'],
  cup: 'Cup',
  cups: ['Challenge Cup', 'National Cup'],
  quirk: ['Old', 'New', 'Upper', 'Lower'],
};
NATION_L.CIV = NATION_L.SEN; // (the two share the West African French pattern)
// every nation code the library can write names for (some are not in the game yet)
export const libraryNations = () =>
  [...new Set([...Object.values(LANG).flatMap((l) => l.nations.split(' ')), ...Object.keys(NATION_L)])].sort();
export const langOf = (nat) =>
  NATION_L[nat] || Object.values(LANG).find((l) => l.nations.split(' ').includes(nat)) || LANG.eng;

// ---------------------------------------------------------------- town names
// Stems and endings are joined with the sounds kept tidy (no clashing vowels where the language elides, no triple
// letters); some towns take a prefix ("Upper", "San", "Saint-") or a join ("-on-Sea", " del Mar"), in the way
// real place names do. Returns a town name.
export function stem(L, r) {
  let a = r.pick(L.a),
    b = r.pick(L.b);
  if (L.elide && isVowel(a.slice(-1)) && isVowel(b[0])) a = a.slice(0, -1);
  if (a.slice(-1).toLowerCase() === b[0].toLowerCase() && !isVowel(b[0])) b = b.slice(1);
  if (L.link && !isVowel(a.slice(-1)) && !isVowel(b[0])) a += L.link[Math.floor(r() * L.link.length)];
  // (gap: a language that writes its towns as two words, "Hai Lam", "Kuala Rimba")
  if (L.gap) return `${cap(a)}${L.gap}${cap(b)}`;
  return cap(a + b).replace(/(.)\1\1+/g, '$1$1');
}
export function placeName(L, r) {
  const roll = r();
  let s = stem(L, r);
  if (roll < 0.1 && L.pre.length) {
    const p = r.pick(L.pre);
    s =
      L.preDe && r() < L.preDe
        ? `${p} de ${s}`
        : `${p}${L.preGap}${L.preGap || p.endsWith('-') ? s : s.charAt(0).toLowerCase() + s.slice(1)}`;
  } else if (roll < 0.15 && L.joins.length) s += r.pick(L.joins);
  return s;
}

// ---------------------------------------------------------------- checks on a generated name
// A name must not sound like a real town or club, be hard to say, or run long.
const fold2 = (t) =>
  String(t)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
const lev = (a, b) => {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
};
const prefixLen = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};
// realTowns / realClubs: the real names to keep clear of ("Chelington" is fine, "Chelsington" is too close to Chelsea)
export function nameChecks(realTowns, realClubs) {
  const towns = [...new Set(realTowns.map(fold2))].filter((x) => x.length >= 5),
    clubs = [...new Set(realClubs.map(fold2))].filter((x) => x.length >= 6);
  return {
    closeToTown(town) {
      const t = fold2(town);
      if (t.length < 5) return false;
      return towns.some((r) => {
        if (r === t) return true;
        const pl = prefixLen(t, r);
        if (pl >= 5 && pl >= 0.7 * Math.min(t.length, r.length)) return true;
        return Math.abs(t.length - r.length) <= 1 && t[0] === r[0] && lev(t, r) <= 2;
      });
    },
    closeToClub(name) {
      const t = fold2(name);
      if (t.length < 6) return false;
      return clubs.some((r) => r === t || (Math.abs(t.length - r.length) <= 2 && t[0] === r[0] && lev(t, r) <= 2));
    },
  };
}
const MAX_CONSONANTS = { spa: 4, por: 4, bra: 4, mex: 4, arg: 4, ita: 4, fra: 4, jpn: 3, kor: 3, tha: 3 };
// Three or more consonants in a row are fine where the language has them; past its limit the name is hard to say
export const hardToSay = (text, L) => {
  const max = MAX_CONSONANTS[L.key] || 5;
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .some((w) => (w.match(/[^aeiouy]+/g) || []).some((run) => run.length > max));
};
export const tooLong = (name, max = 26) => String(name).length > max;
// Words that make a small club's town sound smaller and older ("North Litworth Wanderers")
const QUIRK = {
  eng: ['North', 'South', 'East', 'West', 'Upper', 'Lower', 'Old', 'New', 'Great', 'Little', 'Market', 'Church'],
  spa: ['Nueva', 'Villa', 'San', 'Santa', 'Alto', 'Bajo'],
  ger: ['Alt', 'Neu', 'Bad', 'Ober', 'Unter', 'Groß', 'Klein'],
  fra: ['Saint-', 'Mont-', 'Villeneuve-', 'Château-'],
  ita: ['Borgo', 'Castel', 'Monte', 'Porto', 'San'],
  por: ['Vila', 'São', 'Santa', 'Alto'],
  nld: ['Oud', 'Nieuw', 'Groot', 'Klein'],
};
export const quirkFor = (L) => L.quirk || QUIRK[L.key] || [];
// A club name is "simple" when it is the town and one short word (big clubs get those)
export const isSimpleClub = (t) => !/[0-9&]/.test(t) && t.replace('{c}', 'X').split(' ').length <= 2;
// Fictional league sponsors ("Aurum Top Division"): companies that sound as if they belong to the country, so a
// Serbian league is not sponsored by "Brightway". Each nation has its own list (SPONSORS_NAT); the rest use their
// language's; the generic list is the last resort.
export const SPONSORS = words(
  `Aurum Nordbank Kaizen Vantage Meridian Helix Orbis Solara Tandem Zenith Polaris Cobalt Argent Ironwood Lumen Quanta
  Verity Summit Halcyon Brightway Northgate Calder Redwater Evergreen Pinnacle Harbor Crestline Sable Monarch Beacon`,
);
const SPONSORS_NAT = {
  KSA: words(
    `Najd_Telecom Riyadh_Capital Red_Sea_Energy Gulf_Petrochemical Desert_Rose_Bank Sahara_Holding Tihama_Insurance
    Jeddah_Port Harmony_Digital Al_Wasl_Estates Oasis_Mutual Falcon_Aviation Nakheel_Foods Dhahran_Steel`,
  ),
  ENG: words(
    `Brightway Northgate Calder Redwater Ironbridge Thornfield Kingsley Alderwood Stonebridge Westbrook Highmark Foxmoor
    Heathmoor Millstone Whitcombe Parkhurst Marlowe Ravenscar Dunmore Elmstead Fairhaven Bluepeak Lakeshore Oakridge`,
  ),
  SCO: words(
    `Lochside Glenrock Highmark Thistlegate Braemar Clanbank Caledon Tayside Ardmore Strathmore Bannockburn Craigmuir
    Kinloch Dunmore Fraserwood Heatherlea Stonehaven Corriehill`,
  ),
  WAL: words(
    `Gwalia Cambrian Dragonbank Tywi Cardiganbay Eryri Rhosyn Brynmor Gwynfa Penmaen Celtbank Afonwen Dyfed Menai Llwyd
    Glanmor Hafren Tegfan`,
  ),
  IRL: words(
    `Shannonbank Emerald Corrib Liffeybridge Glendalough Clannad Tara Ardmore Lough Kilbride Boyne Dunmara Rathmore Eireline
    Slaney Burrenwood Carrick Mullaghmore`,
  ),
  USA: words(
    `Libertyline Heartland Frontier Pioneer Eagleview Summit Mainstreet Redwood Silverlake Starfield Americana Oakwood
    Northstar Freedom Cardinal Patriot Westgate Independence Prairie Bluegrass`,
  ),
  AUS: words(
    `Southern Outback Coolabah Wattle Murrayfield Kookaburra Banksia Harbourside Gumtree Yarraline Boomerang Coastal
    Redcentre Tasman Federation Kangaline Eucalypt Southcross`,
  ),
  ESP: words(
    `Banca_Mediterránea Solmar Ibérica Costa_Brava Gibralfaro Duero Alhambra Tramontana Iberdrola_Sur Mesetabank Laurel
    Vegasol Segura Cantábrica Sierra_Norte Guadiana Ebro Levante Atlántica Montesol`,
  ),
  ITA: words(
    `Banca_Adriatica Tirrenia Appennino Lombarda Serenissima Mediolana Vesuvio Etruria Lazio_Assicurazioni Sorrento Alpina
    Padania Laguna Toscana_Energia Aurora Valdarno Sicania Trinacria`,
  ),
  FRA: words(
    `Banque_Atlantique Provence Lorraine Aquitaine Rhône_Assurances Armorique Loire Gascogne Auvergne Camargue Saône
    Vendée Bretagne_Énergie Artois Garonne Alsacienne Normandie_Mutuelle Occitane`,
  ),
  GER: words(
    `Nordbank Rheinland Hansa_Versicherung Schwarzwald Elbe_Energie Bayerische_Mitte Mainfranken Weser Ostsee Allgäu
    Saalebank Lausitz Neckar Taunus Westfalen_Kredit Spreewald Harzer Oderland`,
  ),
  AUT: words(
    `Donau_Versicherung Alpenbank Tirolia Wiener_Mitte Steirmark Salzach Arlberg Kärnten Semmering Vorarlberg Wachau
    Burgenland_Energie Traunsee Innbank`,
  ),
  SUI: words(
    `Helvetia_Nord Rigi_Versicherung Lemanbank Gotthard Aareland Engadin Zürisee Jurabank Matterhorn_Energie Rheintal
    Titlis Lugano_Assicurazioni Säntis Bernina`,
  ),
  NED: words(
    `Rijnbank Hollandia Zuiderzee Maasland Delta_Verzekering Amstelbank IJsselstroom Brabant_Energie Utrechtse_Mutuele
    Zeeuwse Waddenbank Veluwe Noordzee Grachten Polderbank Gelderland`,
  ),
  BEL: words(
    `Scheldebank Brabantia Ardennen Vlaanderen_Verzekering Maasvallei Wallonia_Énergie Banque_Meuse Lys Kempen
    Limburgia Zenne Hainaut Flandria Dendre`,
  ),
  POR: words(
    `Banco_Lusitano Douro Atlântica Algarve_Seguros Tejo Minho Alentejana Lusa_Energia Portucale Sagres Mondego
    Lisboa_Capital Beira Ribatejo Cávado Berlengas`,
  ),
  BRA: words(
    `Banco_Tropical Amazônia Cruzeiro_do_Sul Planalto Paraná_Seguros Guanabara Itaúna_Energia Bandeirantes Carioca
    Mantiqueira Pampa Serrana Potiguar Sertão Iguaçu Atlântica_Brasil`,
  ),
  ARG: words(
    `Banco_Pampeano Patagonia Río_de_la_Plata Aconcagua Seguros_Andinos Cuyo Mesopotamia Pehuén Quilmes_Energía Tango
    Cóndor Austral Chaco Iguazú`,
  ),
  MEX: words(
    `Banco_Azteca_del_Norte Sierra_Madre Yucatán Tenochtitlán_Seguros Pacífica Mezcal_Energía Anáhuac Tlaloc Cempasúchil
    Occidente Tamaulipas Sonoran Oaxaqueña Chapala`,
  ),
  JPN: words(
    `Sakura_Bank Fujimi Asahi_Seimei Kaede Tokaido_Energy Hinode Shirakawa Mizuho_Kita Kirameki Yamato_Seiko Setouchi
    Aoba Kitakami Tsubasa Ginrei Hokuto`,
  ),
  KOR: words(
    `Hanbit Daehan_Insurance Mugunghwa Seorak Hangang_Bank Baekdu Jirisan Dongseo_Energy Cheongsan Haeoreum Namsan
    Taebaek Geumgang Hanra`,
  ),
  SGP: words(
    `Merlion_Bank Orchard Marina_Capital Straits_Insurance Temasek Raffles_Holdings Lion_Energy Changi Sentosa Kallang_Trust Tuas_Logistics Bayfront`,
  ),
  MYS: words(
    `Petrona_Bank Malaya_Insurance Tiger_Holdings Kinabalu_Energy Selat_Capital Langkawi Menara_Trust Borneo_Timber Rimba Nusa_Bank Perdana_Group Tun_Razak_Trust`,
  ),
  VIE: words(
    `Sai_Gon_Bank Hong_Ha_Insurance Mekong_Energy Dong_A_Holdings Nam_Viet_Capital Lac_Hong Thang_Long_Trust Hoang_Gia Phuong_Nam Viet_Thanh Ha_Long_Group`,
  ),
  IDN: words(
    `Bank_Nusantara Garuda_Insurance Jaya_Energy Borobudur_Holdings Sinar_Mas_Capital Merapi Pertiwi_Trust Bhinneka Cendrawasih_Group Mega_Samudra Kalimantan_Timber`,
  ),
  PHI: words(
    `Mabuhay_Bank Pinoy_Insurance Luzon_Energy Visayas_Holdings Mindanao_Capital Ayala_Trust Pilipinas_Group Tamaraw Bayanihan_Foods Maynila_Logistics`,
  ),
  RSA: words(
    `Springbok_Bank Karoo_Insurance Rand_Energy Protea_Holdings Table_Mountain_Capital Highveld Ubuntu_Trust Cape_Group Kruger_Mining Zulu_Logistics Madiba_Foods`,
  ),
  THA: words(
    `Siam_Bank Chaophraya Lanna Andaman_Insurance Isan_Energy Thaimit Phuket_Capital Mekong Rattana Chiang_Mai_Trust
    Suvarna Krungsri_Nua Sawasdee Naga`,
  ),
  TUR: words(
    `Boğaz_Bankası Anadolu_Sigorta Marmara Ege_Enerji Toros Karadeniz Selçuk Kapadokya Bosfor_Holding Akdeniz_Yatırım
    Trakya Fırat Yıldız_Kredi Ihlara`,
  ),
  GRE: words(
    `Aegean_Bank Olympiaki Ellas_Asfalistiki Kyklades Pindos Thessalia_Energy Attiki Ionion Kriti_Holding Delphi
    Peloponnisos Makedonia Nostos Aeolos`,
  ),
  POL: words(
    `Bank_Wisła Odra_Ubezpieczenia Mazowsze Tatry_Energia Pomorze Baltyk_Invest Śląsk Podhale Warta_Kredyt Mazury
    Lechia_Holding Jantar Karpaty Narew`,
  ),
  CZE: words(
    `Vltava_Banka Morava_Pojišťovna Šumava Krkonoše_Energie Labe Bohemia_Invest Haná Beskydy Slovácko Orlice Sázava
    Zlatá_Praha Podlipanská Jizera`,
  ),
  HUN: words(
    `Duna_Bank Tisza_Biztosító Balaton Mátra_Energia Alföld Pannónia_Invest Szigetköz Bükk Tokaj Zemplén Dunakanyar
    Hortobágy Sárrét Kékes`,
  ),
  DEN: words(
    `Jyske_Fonde Øresund Sjællands_Forsikring Limfjord Nordlys_Energi Fyn_Kredit Bornholm Kattegat Himmerland Skagerak
    Vestkyst Lolland Mols Dannebrog`,
  ),
  NOR: words(
    `Fjordbank Nordlys_Forsikring Vestland Telemark_Energi Trollheimen Hardanger_Kreditt Lofoten Glomma Nordkapp Jotunheim
    Skagerrak Dovre Sørlandet Romsdal`,
  ),
  SRB: words(
    `Dunavska_Banka Moravska_Osiguranje Fruška_Gora_Energo Sumadija Tara_Invest Vojvodina_Kredit Zlatibor Kopaonik
    Sava_Banka Banat Rasina Podunavlje Šar_Planina Zapadna_Morava`,
  ),
  MAR: words(
    `Banque_Atlas Souss_Assurances Rif_Énergie Médina_Holding Sahara_Invest Oum_Rbia Essaouira Tanger_Med_Capital Anfa
    Ourika Draa Saïss Tafilalet Chaouia`,
  ),
  NGA: words(
    `Niger_Bank Lagos_Trust Naija_Insurance Eko_Energy Zuma_Holdings Jos_Capital Kano_Mutual Delta_Oil_Services Sahel_Union
    Calabar_Invest Benue Cross_River_Trust Ibadan_Premier Oloibiri`,
  ),
};
const sp = (l) => l.map((x) => x.replace(/_/g, ' '));
export const sponsorsFor = (nat) => sp(SPONSORS_NAT[nat] || SPONSORS);

// The structure of the sixteen top flights added in round 16 (Egypt, Tunisia, Tanzania, Algeria, Cyprus, Croatia, Sweden,
// Romania, Ecuador, Uruguay, Colombia, Canada, the UAE, Iran, Qatar and China): each league's real structure (the clubs by
// code, their towns, colours, identity, standing and ground size). tools/newleagues.mjs turns it into the game's fictional
// clubs with the name library, the same way tools/worldgen.mjs does for the rest of the world.
const C = {
  R: '#E30613',
  B: '#0057B8',
  W: '#FFFFFF',
  K: '#000000',
  G: '#00843D',
  Y: '#FFD100',
  S: '#6CACE4',
  O: '#F26522',
  N: '#001F5B',
  P: '#6A1B9A',
  M: '#8A1538',
  L: '#7FB800',
};
// name|code|town|colour1|colour2|identity|standing|ground capacity   (identity: giant historic fallen fan selling youth oil)
const T = (s) =>
  s
    .trim()
    .split('\n')
    .map((l) => {
      const [name, code, city, a, b, idt, rep, cap] = l.trim().split('|');
      return { name, code, city, c1: C[a], c2: C[b], idt, rep: +rep, cap: +cap };
    });

export const LEAGUES = [
  {
    id: 'EG1',
    nat: 'EGY',
    real: 'Egyptian Premier League',
    sim: 'minimal',
    band: [62, 40],
    rules: { qualify: { to: 'AF', n: 2 } },
    mix: { EGY: 76, NGA: 2, GHA: 2, MAR: 3, TUN: 3, ALG: 2, BRA: 3, SRB: 2, CMR: 2, MLI: 2, SEN: 2 },
    clubs: T(`
Al Ahly|ALY|Cairo|R|W|giant|66|75000
Zamalek|ZMK|Giza|W|R|giant|62|45000
Pyramids FC|PYR|Cairo|S|W|oil|58|30000
Al Masry|MSR|Port Said|G|K|historic|50|18000
Ismaily|ISM|Ismailia|Y|B|historic|49|20000
Al Ittihad Alexandria|ITA|Alexandria|G|W|historic|47|25000
Future FC|FUT|Cairo|B|W|oil|46|30000
Zed FC|ZED|Cairo|N|Y|oil|46|12000
Ceramica Cleopatra|CER|Cairo|B|Y|oil|45|10000
Smouha|SMO|Alexandria|B|W|selling|44|13000
Modern Sport|MOD|Cairo|R|K|oil|44|14000
ENPPI|ENP|Cairo|N|W|selling|44|15000
Pharco FC|PHA|Alexandria|R|W|oil|43|10000
Petrojet|PTJ|Suez|Y|G|selling|43|18000
El Gouna|GOU|Hurghada|S|W|youth|43|8000
National Bank of Egypt|NBE|Cairo|G|W|fan|42|8000
Tala'ea El Gaish|TEG|Cairo|Y|K|historic|42|10000
Haras El Hodoud|HEH|Alexandria|B|K|fan|41|9000
`),
  },
  {
    id: 'TN1',
    nat: 'TUN',
    real: 'Tunisian Ligue Professionnelle 1',
    sim: 'minimal',
    band: [52, 38],
    rules: { qualify: { to: 'AF', n: 2 } },
    mix: { TUN: 80, ALG: 3, MAR: 2, SEN: 3, NGA: 2, CIV: 2, MLI: 2, FRA: 3, BRA: 2 },
    clubs: T(`
Espérance de Tunis|EST|Tunis|R|Y|giant|52|30000
Club Africain|CAF|Tunis|R|W|giant|50|40000
Étoile du Sahel|ETS|Sousse|R|W|historic|48|28000
CS Sfaxien|CSS|Sfax|K|W|historic|46|22000
US Monastir|USM|Monastir|B|W|fan|42|12000
Stade Tunisien|STU|Tunis|R|G|historic|41|18000
JS Kairouanaise|JSK|Kairouan|G|W|fan|40|12000
AS Marsa|ASM|La Marsa|R|W|fan|39|6000
US Ben Guerdane|UBG|Ben Guerdane|Y|R|fan|39|7000
CA Bizertin|CAB|Bizerte|G|K|historic|39|15000
AS Gabès|ASG|Gabès|B|Y|fan|38|8000
ES Métlaoui|ESM|Métlaoui|R|K|fan|38|6000
Olympique Béja|OBE|Béja|R|W|fan|38|10000
Stade Gabésien|SGB|Gabès|R|G|fan|37|8000
`),
  },
  {
    id: 'TZ1',
    nat: 'TAN',
    real: 'Tanzanian Premier League',
    sim: 'minimal',
    band: [44, 32],
    rules: { qualify: { to: 'AF', n: 1 } },
    mix: { TAN: 74, UGA: 0, NGA: 3, GHA: 3, CMR: 2, CIV: 3, MLI: 2, SEN: 2, BRA: 2, ZAM: 0 },
    clubs: T(`
Young Africans|YAN|Dar es Salaam|G|Y|giant|44|60000
Simba SC|SIM|Dar es Salaam|R|W|giant|44|60000
Azam FC|AZA|Dar es Salaam|S|W|oil|40|15000
Singida Big Stars|SBS|Singida|Y|B|oil|38|10000
Namungo FC|NAM|Lindi|N|W|fan|35|6000
Coastal Union|COA|Tanga|B|Y|historic|35|10000
Mashujaa FC|MAS|Kigoma|R|G|fan|34|5000
Kagera Sugar|KAG|Bukoba|Y|K|selling|34|8000
Tanzania Prisons|TAP|Mbeya|Y|G|fan|34|8000
Mtibwa Sugar|MTI|Morogoro|G|W|selling|34|10000
KMC FC|KMC|Dar es Salaam|S|W|fan|33|7000
Dodoma Jiji|DOJ|Dodoma|G|Y|fan|33|8000
Pamba Jiji|PAM|Mwanza|R|K|historic|33|9000
JKT Tanzania|JKT|Dar es Salaam|G|K|fan|33|6000
Tabora United|TAB|Tabora|B|R|fan|32|7000
Geita Gold|GEI|Geita|Y|B|selling|32|6000
`),
  },
  {
    id: 'DZ1',
    nat: 'ALG',
    real: 'Algerian Ligue Professionnelle 1',
    sim: 'minimal',
    band: [50, 38],
    rules: { qualify: { to: 'AF', n: 2 } },
    mix: { ALG: 82, TUN: 3, MAR: 2, SEN: 2, MLI: 2, CMR: 2, FRA: 3, NGA: 2 },
    clubs: T(`
JS Kabylie|JSK|Tizi Ouzou|Y|G|giant|50|18000
MC Alger|MCA|Algiers|R|G|giant|49|40000
CR Belouizdad|CRB|Algiers|R|W|giant|48|40000
USM Alger|USA|Algiers|R|K|historic|47|50000
ES Sétif|ESS|Sétif|K|W|historic|46|30000
JS Saoura|JSS|Béchar|G|R|selling|41|20000
Paradou AC|PAC|Algiers|W|B|youth|41|8000
MC Oran|MCO|Oran|R|W|historic|41|40000
CS Constantine|CSC|Constantine|G|K|historic|40|30000
USM Khenchela|UKH|Khenchela|G|W|fan|39|10000
NC Magra|NCM|M'Sila|G|Y|fan|38|8000
MC El Bayadh|MEB|El Bayadh|B|W|fan|38|8000
ES Ben Aknoun|ESB|Algiers|G|Y|fan|38|6000
US Biskra|USB|Biskra|G|R|fan|38|12000
Olympique Akbou|OAK|Akbou|B|W|fan|37|7000
ASO Chlef|ASO|Chlef|R|W|fan|37|20000
`),
  },
  {
    id: 'CY1',
    nat: 'CYP',
    real: 'Cypriot First Division',
    sim: 'minimal',
    band: [52, 36],
    rules: { qualify: { to: 'CC', n: 1 } },
    mix: { CYP: 40, GRE: 12, BRA: 7, SRB: 4, ENG: 3, POR: 4, ESP: 3, FRA: 3, NGA: 3, GEO: 3 },
    clubs: T(`
APOEL|APO|Nicosia|Y|B|giant|52|22000
Omonia|OMO|Nicosia|G|W|giant|51|22000
Anorthosis|ANO|Larnaca|B|W|giant|49|10000
AEK Larnaca|AEK|Larnaca|Y|K|historic|46|8000
AEL Limassol|AEL|Limassol|Y|B|historic|44|13000
Apollon Limassol|APL|Limassol|B|W|historic|44|10000
Aris Limassol|ARI|Limassol|Y|G|fan|40|8000
Pafos FC|PAF|Paphos|B|W|oil|43|8000
Ethnikos Achna|ETH|Achna|B|W|fan|38|5000
Doxa Katokopias|DOX|Katokopia|G|W|fan|36|4000
Olympiakos Nicosia|OLN|Nicosia|G|W|historic|37|6000
Nea Salamina|NEA|Famagusta|W|B|fallen|37|5500
Karmiotissa|KAR|Polemidia|B|Y|youth|36|5000
Enosis Neon Paralimni|ENP|Paralimni|B|W|fan|36|5000
`),
  },
  {
    id: 'HR1',
    nat: 'CRO',
    real: 'Croatian Football League',
    sim: 'minimal',
    band: [60, 42],
    rules: { qualify: { to: 'CC', n: 1 } },
    mix: { CRO: 62, BIH: 6, SRB: 3, SVN: 3, BRA: 5, ALB: 2, NGA: 3, GHA: 2, FRA: 2, ESP: 2, MKD: 2, MNE: 2 },
    clubs: T(`
Dinamo Zagreb|DIN|Zagreb|B|W|giant|60|35000
Hajduk Split|HAJ|Split|W|B|giant|55|34000
HNK Rijeka|RIJ|Rijeka|W|B|historic|52|8000
NK Osijek|OSI|Osijek|B|W|historic|48|13000
NK Lokomotiva|LOK|Zagreb|R|B|youth|46|5000
NK Istra 1961|IST|Pula|G|Y|selling|44|3500
NK Varaždin|VAR|Varaždin|W|B|fan|43|6000
HNK Gorica|GOR|Velika Gorica|B|W|selling|43|5000
NK Slaven Belupo|SLB|Koprivnica|R|W|fan|42|4000
HNK Šibenik|SIB|Šibenik|W|B|fan|42|8000
`),
  },
  {
    id: 'SE1',
    nat: 'SWE',
    real: 'Allsvenskan',
    sim: 'minimal',
    band: [62, 42],
    rules: { qualify: { to: 'CC', n: 1 } },
    mix: { SWE: 70, NOR: 4, DEN: 4, FIN: 3, NGA: 2, GHA: 2, BRA: 3, ENG: 2, ISL: 2, SRB: 2, GAM: 0 },
    clubs: T(`
Malmö FF|MAL|Malmö|B|W|giant|62|22500
AIK|AIK|Solna|K|Y|giant|57|50000
Djurgårdens IF|DIF|Stockholm|B|R|giant|56|30000
Hammarby IF|HAM|Stockholm|G|W|historic|55|33000
IFK Göteborg|IFK|Gothenburg|B|W|historic|53|18000
BK Häcken|HAC|Gothenburg|Y|K|selling|52|6500
IF Elfsborg|ELF|Borås|Y|K|historic|50|16000
IFK Norrköping|NOR|Norrköping|W|B|historic|50|17000
Kalmar FF|KAL|Kalmar|R|W|fan|46|12000
IK Sirius|SIR|Uppsala|B|W|youth|46|9000
Mjällby AIF|MJA|Hällevik|Y|K|fan|45|7000
IF Brommapojkarna|BRO|Stockholm|R|K|youth|44|8000
Halmstads BK|HAL|Halmstad|B|W|historic|43|15000
Degerfors IF|DEG|Degerfors|R|W|fan|41|7000
Varbergs BoIS|VBO|Varberg|G|K|fan|41|4500
GAIS|GAI|Gothenburg|G|K|fallen|42|13000
`),
  },
  {
    id: 'RO1',
    nat: 'ROU',
    real: 'Liga I',
    sim: 'minimal',
    band: [58, 40],
    rules: { qualify: { to: 'CC', n: 1 } },
    mix: { ROU: 56, SRB: 4, BRA: 5, FRA: 3, NGA: 3, ESP: 3, ITA: 2, GRE: 3, BUL: 2, MKD: 2, ALB: 2, CRO: 2 },
    clubs: T(`
FCSB|FCS|Bucharest|R|B|giant|58|55000
CFR Cluj|CFR|Cluj-Napoca|B|W|oil|56|23000
Universitatea Craiova|CRA|Craiova|B|W|giant|53|30000
Rapid București|RAP|Bucharest|B|W|giant|52|14000
Dinamo București|DIB|Bucharest|R|W|fallen|50|15000
UTA Arad|UTA|Arad|R|W|historic|47|12000
Farul Constanța|FAR|Constanța|B|W|oil|48|15000
Sepsi OSK|SEP|Sfântu Gheorghe|B|W|selling|45|8000
Petrolul Ploiești|PET|Ploiești|Y|B|historic|45|15000
Hermannstadt|HER|Sibiu|R|W|selling|43|4500
Oțelul Galați|OTE|Galați|R|W|historic|42|13000
FC Botoșani|BOT|Botoșani|B|Y|fan|42|8000
FC Voluntari|VOL|Voluntari|B|W|fan|41|2500
Unirea Slobozia|UNI|Slobozia|B|W|fan|40|5000
Csíkszereda|CSI|Miercurea Ciuc|R|W|fan|40|3000
Poli Iași|IAS|Iași|B|W|historic|41|11000
`),
  },
  {
    id: 'EC1',
    nat: 'ECU',
    real: 'Ecuadorian Serie A',
    sim: 'minimal',
    band: [58, 40],
    rules: { qualify: { to: 'CL', n: 2 } },
    mix: { ECU: 62, COL: 8, ARG: 6, URU: 4, BRA: 6, VEN: 3, PAR: 3, CHI: 2, PER: 2, ESP: 2 },
    clubs: T(`
LDU Quito|LDU|Quito|W|B|giant|58|41000
Barcelona SC|BSC|Guayaquil|Y|K|giant|57|57000
Emelec|EME|Guayaquil|B|W|giant|55|40000
Independiente del Valle|IDV|Sangolquí|K|B|youth|56|12000
Aucas|AUC|Quito|Y|R|historic|47|20000
Deportivo Cuenca|DCU|Cuenca|R|W|historic|45|16000
El Nacional|ENA|Quito|R|W|fallen|45|35000
Delfín SC|DEL|Manta|Y|B|selling|44|20000
Orense SC|ORE|Machala|Y|G|fan|42|16000
Técnico Universitario|TEU|Ambato|B|W|fan|42|18000
Macará|MAC|Ambato|B|W|historic|41|18000
Mushuc Runa|MUS|Ambato|W|B|fan|40|8000
Libertad FC|LIB|Loja|W|B|fan|39|8000
Universidad Católica del Ecuador|UCE|Quito|B|W|fan|40|40000
Cumbayá FC|CUM|Quito|R|W|youth|38|6000
Imbabura SC|IMB|Ibarra|R|W|fan|37|10000
`),
  },
  {
    id: 'UY1',
    nat: 'URU',
    real: 'Uruguayan Primera División',
    sim: 'minimal',
    band: [58, 40],
    rules: { qualify: { to: 'CL', n: 2 } },
    mix: { URU: 72, ARG: 6, BRA: 4, PAR: 3, COL: 3, CHI: 2, VEN: 2, ESP: 2, NGA: 1, ECU: 2 },
    clubs: T(`
Peñarol|PEN|Montevideo|Y|K|giant|58|40000
Nacional|NAC|Montevideo|W|B|giant|58|35000
Defensor Sporting|DEF|Montevideo|P|W|historic|47|18000
Danubio|DAN|Montevideo|W|K|youth|46|18000
Montevideo Wanderers|WAN|Montevideo|W|K|historic|44|8000
Liverpool Montevideo|LVM|Montevideo|K|B|historic|43|9000
River Plate Montevideo|RPM|Montevideo|W|R|historic|42|12000
Cerro Largo|CLA|Melo|B|W|fan|41|9000
Progreso|PRO|Montevideo|B|R|fan|40|6000
Racing Montevideo|RAC|Montevideo|W|B|historic|40|6000
Plaza Colonia|PLC|Colonia|W|B|fan|40|7000
Miramar Misiones|MIR|Montevideo|Y|B|fan|38|5000
Cerro|CER|Montevideo|B|W|historic|40|10000
Boston River|BOS|Florida|G|W|selling|39|5000
Montevideo City Torque|MCT|Montevideo|S|W|oil|42|6000
Albion FC|ALB|Montevideo|B|W|fan|38|4000
`),
  },
  {
    id: 'CO1',
    nat: 'COL',
    real: 'Categoría Primera A',
    sim: 'minimal',
    band: [60, 40],
    rules: { qualify: { to: 'CL', n: 3 } },
    mix: { COL: 72, ARG: 6, URU: 4, BRA: 4, VEN: 3, ECU: 3, PAR: 2, CHI: 2, ESP: 2, PER: 2 },
    clubs: T(`
Atlético Nacional|NCL|Medellín|G|W|giant|60|45000
Millonarios|MIL|Bogotá|B|W|giant|58|36000
América de Cali|AME|Cali|R|W|giant|54|42000
Junior|JUN|Barranquilla|R|W|giant|55|46000
Independiente Santa Fe|SAF|Bogotá|R|W|historic|52|36000
Deportivo Cali|DCA|Cali|G|W|historic|50|42000
Once Caldas|ONC|Manizales|W|K|historic|47|30000
Deportes Tolima|TOL|Ibagué|R|Y|historic|48|28000
Independiente Medellín|IMD|Medellín|R|B|historic|50|45000
Atlético Bucaramanga|BUC|Bucaramanga|Y|G|fan|44|28000
Deportivo Pasto|PAS|Pasto|Y|R|fan|42|20000
Envigado|ENV|Envigado|Y|O|youth|43|12000
Águilas Doradas|AGU|Rionegro|Y|K|selling|42|14000
Alianza FC|ALI|Valledupar|Y|G|fan|40|12000
La Equidad|EQU|Bogotá|G|W|fan|41|10000
Jaguares de Córdoba|JAG|Montería|Y|B|fan|40|12000
Deportivo Pereira|PER|Pereira|Y|R|fan|43|30000
Fortaleza CEIF|FOR|Bogotá|B|W|fan|38|8000
Llaneros FC|LLA|Villavicencio|R|W|fan|38|10000
Boyacá Chicó|BCH|Tunja|W|B|fan|39|8000
`),
  },
  {
    id: 'CA1',
    nat: 'CAN',
    real: 'Canadian Premier League',
    sim: 'minimal',
    band: [42, 32],
    rules: { qualify: { to: 'NC', n: 1 } },
    mix: { CAN: 52, ENG: 6, BRA: 5, USA: 4, FRA: 3, JAM: 3, GHA: 3, NGA: 3, SRB: 2, ESP: 3 },
    clubs: T(`
Forge FC|FOR|Hamilton|O|K|youth|42|6000
Cavalry FC|CAV|Calgary|R|K|selling|40|6000
Pacific FC|PCF|Langford|P|W|youth|36|6000
Atlético Ottawa|OTT|Ottawa|R|W|fan|37|24000
York United|YRK|Toronto|G|W|fan|35|4000
HFX Wanderers|HFX|Halifax|S|K|fan|35|6000
Valour FC|VAL|Winnipeg|O|K|fan|34|6000
Vancouver FC|VFC|Langley|G|K|fan|33|6000
`),
  },
  {
    id: 'AE1',
    nat: 'UAE',
    real: 'UAE Pro League',
    sim: 'minimal',
    band: [60, 40],
    rules: { qualify: { to: 'AC', n: 2 } },
    mix: { UAE: 38, BRA: 8, ARG: 4, SRB: 4, NGA: 3, EGY: 4, IRQ: 3, KSA: 2, ESP: 3, POR: 3, GHA: 2, MAR: 2 },
    clubs: T(`
Al Ain|AIN|Al Ain|Y|P|oil|60|25000
Shabab Al Ahli|SAH|Dubai|R|K|oil|58|12000
Sharjah|SHA|Sharjah|W|B|oil|56|11000
Al Wasl|WSL|Dubai|Y|K|historic|54|12000
Al Jazira|JAZ|Abu Dhabi|R|K|oil|53|42000
Al Wahda|WAH|Abu Dhabi|O|K|oil|52|11000
Al Nasr|NSR|Dubai|Y|B|historic|47|12000
Ajman|AJM|Ajman|O|W|fan|43|5000
Khor Fakkan|KHF|Khor Fakkan|R|W|fan|42|4000
Baniyas|BAN|Abu Dhabi|R|K|fan|44|9000
Al Dhafra|DHA|Madinat Zayed|G|R|fan|42|7000
Al Bataeh|BAT|Al Bataeh|Y|B|fan|41|4000
Ittihad Kalba|KAL|Kalba|Y|K|fan|41|6000
Al Orooba|ORO|Sharjah|B|W|fan|40|3000
`),
  },
  {
    id: 'IR1',
    nat: 'IRN',
    real: 'Persian Gulf Pro League',
    sim: 'minimal',
    band: [58, 40],
    rules: { qualify: { to: 'AC', n: 2 } },
    mix: { IRN: 82, IRQ: 2, UZB: 2, BRA: 3, SRB: 2, ARM: 0, GEO: 2, NGA: 2, ESP: 2 },
    clubs: T(`
Persepolis|PRS|Tehran|R|W|giant|58|78000
Esteghlal|EST|Tehran|B|W|giant|57|78000
Sepahan|SPA|Isfahan|Y|K|historic|54|75000
Tractor|TRC|Tabriz|R|K|giant|52|66000
Foolad|FOL|Ahvaz|R|Y|historic|48|30000
Gol Gohar|GGO|Sirjan|Y|G|oil|47|10000
Nassaji Mazandaran|NAS|Qaemshahr|Y|R|fan|42|15000
Malavan|MAL|Bandar Anzali|B|W|historic|42|10000
Zob Ahan|ZOB|Isfahan|G|W|historic|44|15000
Aluminium Arak|ALU|Arak|B|W|selling|42|15000
Paykan|PAY|Tehran|Y|K|historic|41|10000
Havadar|HAV|Tehran|B|W|fan|40|5000
Mes Rafsanjan|MES|Rafsanjan|O|K|selling|41|15000
Shams Azar|SHM|Qazvin|Y|B|fan|40|5000
Kheybar Khorramabad|KHE|Khorramabad|R|W|fan|39|10000
Chadormalu|CHA|Ardakan|O|K|selling|40|5000
`),
  },
  {
    id: 'QA1',
    nat: 'QAT',
    real: 'Qatar Stars League',
    sim: 'minimal',
    band: [58, 40],
    rules: { qualify: { to: 'AC', n: 2 } },
    mix: { QAT: 34, BRA: 6, ESP: 5, ARG: 4, EGY: 5, MAR: 4, IRQ: 3, SRB: 3, NGA: 2, SEN: 2, ALG: 3, TUN: 3 },
    clubs: T(`
Al Sadd|SAD|Doha|W|K|oil|58|15000
Al Duhail|DUH|Doha|R|W|oil|56|40000
Al Rayyan|RAY|Al Rayyan|R|K|oil|52|44000
Al Gharafa|GHA|Doha|W|K|oil|50|21000
Al Arabi|ARB|Doha|W|R|historic|48|15000
Al Wakrah|WKR|Al Wakrah|Y|K|fan|45|20000
Qatar SC|QSC|Doha|M|W|historic|44|13000
Umm Salal|UMS|Umm Salal|Y|K|fan|43|12000
Al Shamal|SHL|Madinat ash Shamal|B|W|fan|41|10000
Al Ahli Doha|AHD|Doha|G|W|historic|42|7000
Al Khor|KHR|Al Khor|B|W|fan|41|12000
Al Markhiya|MRK|Doha|R|W|fan|40|3000
`),
  },
  {
    id: 'CS1',
    nat: 'CHN',
    real: 'Chinese Super League',
    sim: 'minimal',
    band: [66, 42],
    rules: { qualify: { to: 'AC', n: 2 } },
    mix: { CHN: 68, BRA: 12, KOR: 3, JPN: 2, SRB: 3, NGA: 2, ESP: 3, ENG: 2, GHA: 2, AUS: 3 },
    clubs: T(`
Shanghai Port|SHP|Shanghai|R|K|oil|66|72000
Shandong Taishan|SHT|Jinan|O|K|giant|62|54000
Shanghai Shenhua|SHS|Shanghai|B|W|giant|60|52000
Beijing Guoan|BGA|Beijing|G|Y|giant|62|66000
Chengdu Rongcheng|CHE|Chengdu|R|W|oil|56|40000
Zhejiang FC|ZHE|Hangzhou|G|W|youth|52|50000
Tianjin Jinmen Tiger|TJT|Tianjin|B|W|fan|48|54000
Henan FC|HEN|Zhengzhou|Y|B|fan|46|29000
Wuhan Three Towns|WUH|Wuhan|R|W|oil|50|52000
Changchun Yatai|CHY|Changchun|Y|G|historic|48|38000
Meizhou Hakka|MEI|Meizhou|R|K|fan|45|20000
Qingdao West Coast|QWC|Qingdao|B|W|fan|44|18000
Cangzhou Mighty Lions|CAN|Cangzhou|B|W|fan|44|30000
Dalian Yingbo|DAL|Dalian|B|W|fallen|46|55000
Nantong Zhiyun|NAN|Nantong|B|Y|fan|42|18000
Shenzhen Peng City|SHZ|Shenzhen|R|B|fan|43|30000
`),
  },
];

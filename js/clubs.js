// Club data: every league's clubs (fictional names; identity and reputation are the game's own ratings), rivalries
// and overseas clubs. League rules, nations and everything else static live in data.js.
(function () {
  const FM = window.FM;

  // ---------- Domestic clubs (fictional names; identity and reputation are the game's own ratings) ----------
  // [name, short, city, primary, secondary, identity, rep, stadium, capacity]
  FM.D.CLUBS_D1 = [
    ['Baywick United', 'BAY', 'Baywick', '#6CABDD', '#1C2C5B', 'oil', 88, 'Farnmere Green', 53400],
    ['Clifwold Rovers', 'CLI', 'Clifwold', '#C8102E', '#00B2A9', 'giant', 88, 'Bexbrook Field', 61276],
    ['Chelington County', 'CHE', 'Chelington', '#EF0107', '#FFFFFF', 'giant', 87, 'Wokholm Field', 60704],
    ['Chelington City', 'CHC', 'Chelington', '#034694', '#FFFFFF', 'oil', 82, 'The Pickstead Stadium', 40343],
    ['Baywick Argyle', 'BAA', 'Baywick', '#DA291C', '#FFFFFF', 'fallen', 80, 'Pudchester Green', 74310],
    ['Rodstead United', 'ROD', 'Rodstead', '#241F20', '#FFFFFF', 'oil', 78, 'Beverwell Green', 52305],
    ['Quarcaster United', 'QUA', 'Chelington', '#FFFFFF', '#132257', 'historic', 78, 'The Stratdale Stadium', 62850],
    ['Everwich Athletic', 'EVE', 'Everwich', '#670E36', '#95BFE5', 'historic', 75, 'Everwich Ground', 42640],
    ['Calgate Rovers', 'CAL', 'Calgate', '#0057B8', '#FFFFFF', 'selling', 72, 'Bevercaster Road', 31876],
    ['Epington Argyle', 'EPI', 'Epington', '#DD0000', '#FFFFFF', 'fallen', 71, 'The Kirkgate Stadium', 30404],
    ['Filbury Town', 'FIL', 'Chelington', '#7A263A', '#1BB1E7', 'historic', 68, 'Chelington Ground', 62500],
    ['Bransea Swifts', 'BRA', 'Chelington', '#1B458F', '#C4122E', 'historic', 68, 'Stratcaster Park', 25486],
    ['Redton Rovers', 'RED', 'Redton', '#DA291C', '#000000', 'selling', 68, 'Cobrook Field', 11307],
    ['Tadthorpe Alexandra', 'TAD', 'Chelington', '#FFFFFF', '#000000', 'historic', 67, 'Sutcaster Road', 29589],
    ['Teton Harriers', 'TET', 'Chelington', '#E30613', '#FFFFFF', 'selling', 67, 'Sutwich Park', 17250],
    ['Clifwold City', 'CLC', 'Clifwold', '#003399', '#FFFFFF', 'fallen', 67, 'Clifwold Park', 52888],
    ['Merstead Athletic', 'MER', 'Merstead', '#FDB913', '#231F20', 'selling', 66, 'Romcaster Park', 31750],
    ['Selstow City', 'SEL', 'Selstow', '#FFFFFF', '#1D428A', 'fallen', 64, 'Lanholm Park', 37645],
    ['Carwick Colliery Athletic', 'CAR', 'Carwick', '#EB172B', '#FFFFFF', 'fallen', 62, 'Exhurst Field', 48707],
    ["Ryeworth St. Mary's", 'RYE', 'Ryeworth', '#6C1D45', '#99D6EA', 'youth', 61, 'Wrexport Park', 21944],
  ];
  FM.D.CLUBS_D2 = [
    ['Aldcaster Wednesday', 'ALD', 'Aldcaster', '#003090', '#FDBE11', 'fallen', 61, 'Aldcaster Ground', 32259],
    ['Tethaven United', 'TTH', 'Tethaven', '#D71920', '#FFFFFF', 'youth', 60, 'Lewcastle Park', 32384],
    ['Grenwold Town', 'GRT', 'Grenwold', '#3A64A3', '#FFFFFF', 'historic', 59, 'Welgate Lane', 30311],
    [
      "North Litworth St. Mary's",
      'LIT',
      'North Litworth',
      '#EE2737',
      '#FFFFFF',
      'fan',
      58,
      'North Litworth Ground',
      32050,
    ],
    ['Haspool United', 'HAS', 'Haspool', '#E11B22', '#FFFFFF', 'historic', 57, 'Wendon Lane', 34742],
    ['Everwich Rangers', 'EVR', 'Everwich', '#0000FF', '#FFFFFF', 'oil', 57, 'Herbrook Lane', 29409],
    ['Yardale Rangers', 'YAR', 'Yardale', '#122F67', '#FFFFFF', 'historic', 56, 'Wickingham Park', 26850],
    ['Tuthurst Rovers', 'TUT', 'Tuthurst', '#FFF200', '#00A650', 'youth', 56, 'Ketwick Lane', 27359],
    ['Langley United', 'LAU', 'Langley', '#6CABDD', '#FFFFFF', 'fan', 55, 'Torbridge Field', 32609],
    ['Reystow Harriers', 'REY', 'Reystow', '#FBEE23', '#ED2127', 'selling', 55, 'Wynmere Road', 22200],
    ['Chipchester Harriers', 'CHI', 'Chipchester', '#D6001C', '#FFFFFF', 'oil', 54, 'Chipchester Park', 12600],
    ['South Bexwell Corinthians', 'BEX', 'South Bexwell', '#E03A3E', '#FFFFFF', 'fallen', 54, 'Holney Lane', 30089],
    ['Redworth Alexandra', 'REA', 'Redworth', '#F18A01', '#000000', 'fan', 53, 'Stratdon Park', 25586],
    ['Stratsey Harriers', 'STH', 'Stratsey', '#FFFFFF', '#121212', 'youth', 53, 'Stratsey Ground', 21088],
    ["King's Branmere Railway", 'KIN', "King's Branmere", '#FFFFFF', '#000000', 'fallen', 53, 'Welcastle Road', 32956],
    ['North Litworth Wanderers', 'LIN', 'North Litworth', '#0E00F7', '#FFFFFF', 'fallen', 52, 'Reafield Green', 39732],
    ['Rodwood United', 'ROU', 'Rodwood', '#009EE0', '#FFFFFF', 'fallen', 52, 'Holbridge Road', 31367],
    ['Reysey City', 'REC', 'Reysey', '#E21A23', '#FFFFFF', 'youth', 52, 'Becksea Field', 27000],
    ['Torminster United', 'TOU', 'Chelington', '#1D5BA4', '#FFFFFF', 'fan', 51, 'Chelington Park', 18439],
    ['Yarney Swifts', 'YRN', 'Yarney', '#FFFFFF', '#000080', 'fan', 51, 'Yarney Park', 23404],
    ['Hatsey Rovers', 'HAT', 'Chelington', '#001D5E', '#FFFFFF', 'fan', 51, 'Redminster Lane', 20146],
    ['Caldale Olympic', 'CAO', 'Caldale', '#001489', '#FFFFFF', 'fan', 50, 'Caldale Ground', 20899],
    ['Edensey United', 'EDE', 'Chelington', '#D4021D', '#FFFFFF', 'historic', 49, 'The Farnbury Stadium', 27111],
    ['Filcombe United', 'FIU', 'Filcombe', '#FFD100', '#001D5E', 'fan', 47, 'Sudhaven Lane', 12500],
  ];
  FM.D.CLUBS_ES1 = [
    ['Deportivo Olmador', 'OLM', 'Olmador', '#FFFFFF', '#FEBE10', 'giant', 89, 'Estadio La Salamosa', 83186],
    ['Cervar CF', 'CER', 'Cervar', '#A50044', '#004D98', 'giant', 88, 'Estadio Alcaliel', 99354],
    ['Olmador CF', 'OLC', 'Olmador', '#CB3524', '#272E61', 'historic', 82, 'Estadio Zafrilla', 70460],
    ['Real Cuenero', 'CUE', 'Cuenero', '#EE2523', '#FFFFFF', 'youth', 76, 'Campo de Cuenero', 53289],
    ['Deportivo Plasares', 'PLA', 'Plasares', '#FFE667', '#005187', 'selling', 74, 'Estadio Marbedo', 23500],
    ['Atlético Liorera', 'LIO', 'Liorera', '#143C8B', '#FFFFFF', 'youth', 73, 'Ciudad Deportiva Liorera', 39313],
    ['Deportivo Alcaledo', 'ALC', 'Alcaledo', '#0BB363', '#FFFFFF', 'historic', 72, 'Estadio Olmosa', 60721],
    ['Alcaledo Balompié', 'ALB', 'Alcaledo', '#FFFFFF', '#D81E05', 'fallen', 68, 'Estadio La Hinojanes', 43883],
    ['Juventud Valdemosa', 'JUV', 'Valdemosa', '#CD2534', '#FFFFFF', 'oil', 66, 'Estadio Moraleda', 14624],
    [
      'Monte Fuentares Atlético',
      'MOF',
      'Monte Fuentares',
      '#FFFFFF',
      '#000000',
      'fallen',
      66,
      'Estadio Moralara',
      49430,
    ],
    ['Deportivo Montara', 'MOD', 'Montara', '#8AC3EE', '#FFFFFF', 'selling', 64, 'Estadio Moralal', 24870],
    ['Real Club Arroana', 'ARR', 'Arroana', '#D91A21', '#0A346F', 'fan', 64, 'Estadio Sorana', 23576],
    ['Juventud Calatares', 'JUC', 'Calatares', '#E20613', '#000000', 'fan', 62, 'Estadio Segovero', 26020],
    ['Racing Cervar', 'CRV', 'Cervar', '#007FC8', '#FFFFFF', 'fallen', 62, 'Estadio Municipal de Cervar', 40000],
    ['Atlético Osunera', 'OSU', 'Olmador', '#FFFFFF', '#E53027', 'fan', 61, 'Ciudad Deportiva Olmador', 14708],
    ['Benavera CF', 'BEN', 'Benavera', '#005999', '#FFFFFF', 'selling', 61, 'Estadio Municipal de Benavera', 16500],
    ['Juventud Villa Roblón', 'JUR', 'Villa Roblón', '#0761AF', '#FFFFFF', 'youth', 60, 'Campo de Villa Roblón', 19840],
    ['Deportivo Corvar', 'COR', 'Corvar', '#0033A0', '#FFFFFF', 'fan', 59, 'Nuevo Estadio Corvar', 30500],
    ['Racing Monte Fuentares', 'MNT', 'Monte Fuentares', '#B5123E', '#004F9F', 'fan', 59, 'Estadio Zamanes', 26354],
    ['Sorar CF', 'SOR', 'Sorar', '#FFFFFF', '#05642C', 'fan', 58, 'Campo de Sorar', 31388],
  ];

  // ---------- More leagues ----------
  FM.D.CLUBS_D3 = [
    ['New Lamwold Wednesday', 'LAM', 'Lamwold', '#0070B5', '#FFFFFF', 'fallen', 49, 'Stafcaster Road', 33280],
    ['Hydehaven North End', 'HYD', 'Hydehaven', '#F78F1E', '#002D62', 'fallen', 48, 'The Wrexwick Stadium', 12000],
    ['Amesholm United', 'AME', 'Amesholm', '#0E63AD', '#FFFFFF', 'historic', 48, 'Reawich Green', 24121],
    ['Great Bexstead Athletic', 'BXS', 'Bexstead', '#FFFFFF', '#263C7E', 'fallen', 48, 'Dermouth Park', 28723],
    ['Huckborough Corinthians', 'HUC', 'Huckborough', '#00563F', '#FFFFFF', 'fan', 46, 'Wynford Green', 17900],
    ['Sutwood Borough', 'SUT', 'Sutwood', '#004494', '#FFFFFF', 'fallen', 46, 'The Camthorpe Stadium', 24161],
    ['Worpool Works', 'WOR', 'Worpool', '#D71921', '#FFFFFF', 'youth', 45, 'Worpool Park', 23287],
    ['Wedcastle-on-Sea City', 'WED', 'Wedcastle-on-Sea', '#1D59AF', '#FFFFFF', 'selling', 45, 'Radport Road', 25138],
    ['Camshall North End', 'CAE', 'Camshall', '#0B4EA2', '#FFFFFF', 'fan', 45, 'Gainley Road', 10841],
    ['Tunhurst Town', 'TUN', 'Tunhurst', '#8E1B3A', '#FFB81C', 'fallen', 44, 'Tunhurst Ground', 25136],
    ['Shafport United', 'SHP', 'Shafport', '#F68712', '#FFFFFF', 'fan', 44, 'Highurst Field', 16616],
    ['Clifholm City', 'CLF', 'Clifholm', '#0055A4', '#FFFFFF', 'selling', 44, 'Astoncaster Park', 15314],
    ["Manshall St. Luke's", 'MAN', 'Manshall', '#D71920', '#FFFFFF', 'fallen', 43, 'Romcaster Lane', 12021],
    ['Scarhurst Harriers', 'SCA', 'Scarhurst', '#E1251B', '#FFFFFF', 'youth', 43, 'The Salcliff Stadium', 10669],
    ['Denstead City', 'DEN', 'Denstead', '#E21E26', '#FFFFFF', 'fan', 42, 'The Hasworth Stadium', 15231],
    ['Falwell Colliery Athletic', 'FAL', 'Chelington', '#C8102E', '#FFFFFF', 'fan', 42, 'Milbrook Park', 9271],
    ['Dunbridge Works', 'DUW', 'Dunbridge', '#88C4E6', '#0B1D4F', 'youth', 42, 'Sedhaven Lane', 10137],
    ['Abingwich Harriers', 'ABH', 'Abingwich', '#FEDD00', '#0033A0', 'fan', 41, 'Hunton Field', 9186],
    ['Old Cansingham Borough', 'CAI', 'Cansingham', '#D6001C', '#FFFFFF', 'fan', 40, 'Richpool Field', 8696],
    ['South Bexwell United', 'BES', 'South Bexwell', '#FFFFFF', '#000000', 'fan', 40, 'Branham Park', 15036],
    ['Dartmere Athletic', 'DAA', 'Chelington', '#0033A0', '#FFD100', 'fan', 40, 'Kesdon Field', 9215],
    ['Darcastle North End', 'DAR', 'Darcastle', '#E30613', '#FFFFFF', 'youth', 40, 'Abingwich Road', 7800],
    ['Tavstow Stanley', 'TAV', 'Tavstow', '#7A263A', '#FFFFFF', 'fan', 39, 'The Stanbrook Stadium', 7798],
    ['Howborough Works', 'HOW', 'Howborough', '#FFD100', '#000000', 'selling', 39, 'Salwell Lane', 6912],
  ];
  FM.D.CLUBS_ES2 = [
    [
      'San de Piedador Atlético',
      'SAP',
      'San de Piedador',
      '#0067B1',
      '#FFFFFF',
      'fallen',
      56,
      'Campo de San de Piedador',
      32660,
    ],
    ['Club Segovón', 'SEG', 'Segovón', '#FFE400', '#0055A5', 'fan', 56, 'Nuevo Estadio Segovón', 32400],
    ['Benavete Atlético', 'BNV', 'Benavete', '#5B2C83', '#FFFFFF', 'fallen', 56, 'Ciudad Deportiva Benavete', 27618],
    ['Unión Calatosa', 'CAU', 'Calatosa', '#0073CF', '#FFFFFF', 'fallen', 55, 'Estadio Valino', 30044],
    ['Racing Salamedo', 'SAL', 'Salamedo', '#EE1119', '#FFFFFF', 'oil', 55, 'Estadio Municipal de Salamedo', 15274],
    ['Racing Aranjero', 'ARA', 'Aranjero', '#FFFFFF', '#0A3A82', 'fallen', 54, 'Campo de Aranjero', 33608],
    ['CD Nava', 'NAV', 'Nava', '#FFFFFF', '#0B3F8C', 'youth', 54, 'Estadio Nerjero', 12454],
    ['Atlético Montino', 'MOA', 'Montino', '#C8102E', '#FFFFFF', 'selling', 54, 'Estadio Calpedo', 19336],
    ['Real Olmero', 'OLR', 'Olmero', '#E30613', '#FFFFFF', 'historic', 53, 'Estadio La Salama', 29371],
    ['Club Marbejo', 'MRB', 'Marbejo', '#FFFFFF', '#00843D', 'historic', 53, 'Campo de Marbejo', 22222],
    ['Club Pedera', 'PED', 'Pedera', '#FFE400', '#0045A7', 'fan', 53, 'Campo de Pedera', 20724],
    ['Arrasti Kirol Elkartea', 'ARK', 'Arrasti', '#004F9F', '#A6192E', 'youth', 51, 'Aldapa Zelaia', 8164],
    ['Deportivo Sorana', 'SOD', 'Sorana', '#FFFFFF', '#000000', 'oil', 51, 'Estadio Salamena', 15500],
    ['CE Serrallac', 'CES', 'Serrallac', '#0038A8', '#FEDD00', 'oil', 50, 'Estadi Camp de la Vall', 3306],
    ['Juventud Fuentena', 'JUF', 'Fuentena', '#003DA5', '#A6192E', 'youth', 49, 'Estadio Quintino', 9128],
    ['Segoval Balompié', 'SEB', 'Segoval', '#FFFFFF', '#000000', 'fan', 49, 'Estadio La Talador', 17524],
    ['Moralero Atlético', 'MOR', 'Moralero', '#FFFFFF', '#000000', 'fan', 48, 'Estadio Municipal de Moralero', 12200],
    ['Cabrena Balompié', 'CBR', 'Cabrena', '#FFFFFF', '#00843D', 'fan', 48, 'Estadio Municipal de Cabrena', 21822],
    ['UD Fuentedo', 'FUE', 'Fuentedo', '#E30613', '#000000', 'youth', 48, 'Campo de Fuentedo', 5759],
    [
      'Atlético Liorera B',
      'LIA',
      'Liorera',
      '#143C8B',
      '#FFFFFF',
      'youth',
      47,
      'Ciudad Deportiva Liorera',
      2500,
      'LIO',
    ],
    ['Racing Santa Corvana', 'SAC', 'Corvana', '#FFFFFF', '#000000', 'fan', 46, 'Nuevo Estadio Corvana', 13346],
    ['Juventud Benavilla', 'JUB', 'Benavilla', '#FFFFFF', '#000000', 'fan', 45, 'Estadio Segovón', 6500],
  ];
  FM.D.CLUBS_DE1 = [
    ['Union Dillhafen', 'DIL', 'Dillhafen', '#DC052D', '#FFFFFF', 'giant', 89, 'Sportpark Westerfeld', 75024],
    ['Teutonia Althof im Tal', 'TEU', 'Althof im Tal', '#FDE100', '#000000', 'fan', 84, 'Stadion Waldau', 81365],
    ['TSV Unter Felswald', 'UNT', 'Unter Felswald', '#E32221', '#000000', 'historic', 81, 'Thalbrück-Stadion', 30210],
    ['Viktoria Marieningen', 'VIK', 'Marieningen', '#FFFFFF', '#DD0741', 'oil', 78, 'Rotfurt-Stadion', 47069],
    ['Viktoria Dornsee', 'VID', 'Dornsee', '#000000', '#E1000F', 'fan', 74, 'Stadion am Branhafen', 58000],
    ['Viktoria Burgtal', 'VIB', 'Burgtal', '#FFFFFF', '#E32219', 'historic', 74, 'Waldstadion Burgtal', 60449],
    ['FC Bruchingen', 'BRU', 'Bruchingen', '#C00000', '#000000', 'youth', 69, 'Stadion am Thalhafen', 34700],
    ['Preußen Eberbach', 'PRE', 'Eberbach', '#65B32E', '#FFFFFF', 'selling', 66, 'Stadion Eichkirchen', 28917],
    ['FSV Bachwald', 'FSV', 'Bachwald', '#FFFFFF', '#000000', 'historic', 66, 'Kalstadt-Stadion', 54042],
    ['FC Berghorst', 'BER', 'Berghorst', '#FFFFFF', '#0A3E8C', 'fallen', 66, 'Stadion Dorntal', 57000],
    ['Fortuna Branhafen', 'FOR', 'Branhafen', '#FFFFFF', '#ED1C24', 'fallen', 64, 'Steinbach-Stadion', 50000],
    ['FC Branfurt', 'BRF', 'Branfurt', '#1D9053', '#FFFFFF', 'historic', 64, 'Hohensee-Stadion', 42100],
    [
      'Germania Unter Furtbach',
      'GER',
      'Unter Furtbach',
      '#C3141E',
      '#FFFFFF',
      'fan',
      63,
      'Waldstadion Unter Furtbach',
      33305,
    ],
    ['Sportfreunde Burgingen', 'SPB', 'Burgingen', '#EB1923', '#FFFFFF', 'fan', 62, 'Stadion am Waldingen', 22012],
    ['VfL Mühlfeld 1989', 'MUH', 'Mühlfeld', '#1C63B7', '#FFFFFF', 'selling', 62, 'Mühlfeld-Arena', 30150],
    ['Germania Bachingen', 'GEB', 'Bachingen', '#FFFFFF', '#BA3733', 'fan', 61, 'Stadion am Immsee', 30660],
    ['Berghorst 1899', 'BRG', 'Berghorst', '#624839', '#FFFFFF', 'fan', 60, 'Waldstadion Berghorst', 29546],
    ['FC Hainbach', 'HAF', 'Hainbach', '#E2001A', '#003B79', 'youth', 58, 'Stadion Rheinheim', 15000],
  ];
  FM.D.CLUBS_FR1 = [
    ['Athlétic Quimcourt', 'QUI', 'Quimcourt', '#004170', '#DA291C', 'oil', 90, 'Stade Dieueau', 47929],
    ['Stade Lunens', 'LUN', 'Lunens', '#FFFFFF', '#2FAEE0', 'giant', 82, 'Complexe Tourlac', 67394],
    ['AJ Chaange', 'AJC', 'Chaange', '#E30613', '#FFFFFF', 'oil', 78, 'Stade de la Lanières', 18523],
    ['RC Joylieu', 'JOY', 'Joylieu', '#FFFFFF', '#DA291C', 'fallen', 74, 'Complexe Damières', 59186],
    ['US Mirières', 'USM', 'Mirières', '#E01E13', '#1B2C5A', 'selling', 74, 'Complexe Lavlieu', 50186],
    ['ES Bourcourt', 'ESB', 'Bourcourt', '#CE1126', '#000000', 'oil', 70, 'Stade Municipal de Bourcourt', 36178],
    ['Stade Valange', 'VAL', 'Valange', '#E2001A', '#000000', 'youth', 70, 'Stade Grenières', 29778],
    ['Étoile de Cassens', 'ETO', 'Cassens', '#FFD100', '#E30613', 'fan', 69, 'Stade de la Belgnan', 38223],
    ['Stade Thobourg', 'THO', 'Thobourg', '#0056A6', '#FFFFFF', 'oil', 66, 'Complexe Ponon', 29230],
    ['ES Joyac', 'ESJ', 'Joyac', '#E30613', '#FFFFFF', 'selling', 62, 'Stade Municipal de Joyac', 15220],
    ['AS Lancourt', 'LAN', 'Lancourt', '#6B2C91', '#FFFFFF', 'youth', 62, 'Complexe Chabourg', 33150],
    ['Racing Luneau', 'LUR', 'Luneau', '#FCD405', '#009A44', 'historic', 61, 'Complexe Sarac', 35322],
    ['RC Quimcourt', 'QUR', 'Quimcourt', '#1B2C5A', '#FFFFFF', 'oil', 60, 'Complexe Bourange', 20000],
    ['Olympique Luncourt', 'LUO', 'Luncourt', '#F58025', '#000000', 'fan', 59, 'Stade de la Bourange', 18110],
    ['Rocbourg FC', 'ROC', 'Rocbourg', '#FFFFFF', '#0033A0', 'fan', 58, 'Stade Lunville', 18541],
    ['ES Tourens', 'EST', 'Tourens', '#1D5EAE', '#89CFF0', 'historic', 58, 'Parc des Sports de Tourens', 25178],
    ['Athlétic Vendault', 'VEA', 'Vendault', '#000000', '#FFFFFF', 'fan', 58, 'Stade Valange', 18752],
    ['Racing Club de Valac', 'VAR', 'Valac', '#8E1B3A', '#FFFFFF', 'historic', 57, 'Parc des Sports de Valac', 28786],
  ];
  FM.D.CLUBS_BR1 = [
    [
      'Racing Vila Maramirim',
      'VIL',
      'Vila Maramirim',
      '#C4122E',
      '#000000',
      'giant',
      85,
      'Estádio Municipal de Vila Maramirim',
      78838,
    ],
    ['Racing Guarama', 'GUA', 'Guarama', '#006437', '#FFFFFF', 'giant', 84, 'Estádio Catú', 43713],
    ['Guarama FC', 'GUF', 'Guarama', '#FFFFFF', '#000000', 'historic', 79, 'Estádio Novo Jacarotuba', 49205],
    ['Grêmio Guaria', 'GRE', 'Guarama', '#FFFFFF', '#E4002B', 'historic', 78, 'Arena Guarama', 66795],
    ['Vila Maramirim FC', 'VIM', 'Vila Maramirim', '#000000', '#FFFFFF', 'oil', 77, 'Complexo Tijina', 46831],
    ['Pitangaçu EC', 'PIT', 'Pitangaçu', '#000000', '#FFFFFF', 'oil', 76, 'Arena Ibimirim', 46000],
    ['União Guina', 'UNG', 'Guina', '#0D80BF', '#000000', 'historic', 75, 'Estádio Municipal de Guina', 55662],
    ['Guina EC', 'GUI', 'Guina', '#E30613', '#FFFFFF', 'historic', 75, 'Estádio Pindoba', 50128],
    ['União Pitangai', 'UNP', 'Vila Maramirim', '#7A1F3D', '#00613C', 'historic', 74, 'Estádio Nhaniba', 78838],
    ['Atlético Pitangaçu', 'PIA', 'Pitangaçu', '#0033A0', '#FFFFFF', 'fallen', 73, 'Complexo Ibiguá', 61846],
    ['Nacional Vassoguá', 'NAC', 'Vila Maramirim', '#FFFFFF', '#000000', 'fallen', 72, 'Estádio Novo Pindoma', 21880],
    ['Atlético Urucai', 'URU', 'Urucai', '#FFFFFF', '#000000', 'fallen', 71, 'Estádio Municipal de Urucai', 16068],
    ['Atlético Ubatia', 'UBA', 'Ubatia', '#004A99', '#E30613', 'oil', 70, 'Complexo Tabomirim', 47907],
    ['Jabotão EC', 'JAB', 'Jabotão', '#1F3B8E', '#E30613', 'fan', 68, 'Estádio Paramirim', 63903],
    ['Sport Clube Ipatiba', 'IPA', 'Ipatiba', '#FFFFFF', '#D1001F', 'oil', 67, 'Complexo Guara', 17022],
    ['Clube Jabotão', 'JAC', 'Jabotão', '#000000', '#FFFFFF', 'fan', 64, 'Estádio Uruciba', 63903],
    ['Jacaroba Futebol Clube', 'JAF', 'Jacaroba', '#E30613', '#000000', 'fan', 64, 'Estádio Cambiba', 32983],
    ['Ubatia EC', 'UBE', 'Ubatia', '#E30613', '#000000', 'fan', 63, 'Estádio Municipal de Ubatia', 30793],
    ['Grêmio Arapara', 'GRA', 'Arapara', '#00843D', '#FFFFFF', 'fan', 62, 'Estádio Municipal de Arapara', 19924],
    ['Racing Catama', 'CAT', 'Catama', '#FFE600', '#00843D', 'youth', 62, 'Arena Maratuba', 15000],
  ];

  // ---------- Lower divisions and B teams (batch 6): minimal simulation; a 10th field names a B team's parent ----------
  FM.D.CLUBS_D4 = [
    ['Dartstead Rangers', 'DRT', 'Dartstead', '#E2001A', '#FFFFFF', 'fan', 38, 'Dartstead Park', 5450],
    ['Cansholm Royals', 'CSH', 'Chelington', '#F79A20', '#000000', 'fan', 36, 'Winley Park', 6500],
    ['Halstead Orient', 'HAO', 'Halstead', '#FFFFFF', '#00205B', 'fan', 37, 'Halstead Park', 5045],
    ['West Reysey Stanley', 'RES', 'Reysey', '#0050A0', '#FFFFFF', 'historic', 42, 'Calbridge Road', 9832],
    ['Withorpe United', 'WIT', 'Chelington', '#FFFFFF', '#000000', 'fan', 37, 'Thirford Lane', 5000],
    ['New Burhurst Swifts', 'BUR', 'New Burhurst', '#F9A01B', '#000000', 'fan', 40, 'Hartington Lane', 8127],
    ['Bedthorpe Rovers', 'BED', 'Bedthorpe', '#E2001A', '#FFFFFF', 'fan', 37, 'Mansbrook Green', 7066],
    ['Wokham Rovers', 'WOK', 'Wokham', '#0033A0', '#FFFFFF', 'historic', 40, 'Wynmouth Park', 10504],
    ['Sutwich North End', 'SUE', 'Sutwich', '#0045A0', '#FFFFFF', 'fan', 38, 'Witpool Green', 10105],
    ['Glasham City', 'GLA', 'Glasham', '#C8102E', '#FFFFFF', 'fan', 39, 'Spaldmere Green', 6134],
    ['North Yeothorpe Alexandra', 'YTH', 'Yeothorpe', '#E2001A', '#FFFFFF', 'youth', 38, 'Folbury Park', 10153],
    ['South Lamere Rovers', 'LMR', 'South Lamere', '#E2001A', '#FFFFFF', 'fan', 38, 'Petley Park', 5327],
    ['Milcaster Athletic', 'MIA', 'Milcaster', '#0033A0', '#FFFFFF', 'historic', 39, 'Camstow Lane', 11582],
    ['AFC Evercliff', 'EVA', 'Evercliff', '#000000', '#FFFFFF', 'historic', 39, 'The Exwold Stadium', 9052],
    ['Prescaster United', 'PRU', 'Prescaster', '#FFD700', '#000000', 'fan', 35, 'Dunchester Road', 5000],
    ['Harwood United', 'HAR', 'Harwood', '#FFFFFF', '#000000', 'selling', 41, 'Wendford Park', 30500],
    ['Pickdale Harriers', 'PIC', 'Pickdale', '#F79A20', '#000000', 'fan', 36, 'Pickdale Ground', 7850],
    ['Church Epington Wanderers', 'CUR', 'Epington', '#000000', '#FFFFFF', 'historic', 41, 'Witby Road', 19841],
    ['Shirworth Athletic', 'SHR', 'Shirworth', '#0033A0', '#FFFFFF', 'fallen', 38, 'Shirworth Park', 13512],
    ['Old Yeowick Alexandra', 'YEO', 'Old Yeowick', '#E2001A', '#FFFFFF', 'oil', 40, 'Sandington Road', 5108],
    ['Hydebridge Town', 'HYT', 'Hydebridge', '#0033A0', '#F9A01B', 'fan', 38, 'Hydebridge Park', 9875],
    ['Little Tarncaster City', 'TAR', 'Tarncaster', '#E2001A', '#FFFFFF', 'fallen', 39, 'The Exsey Stadium', 15728],
    ['Folbrook Railway', 'FOL', 'Folbrook', '#FFFFFF', '#0033A0', 'fallen', 37, 'Dorington Road', 16587],
    ['Holshall Corinthians', 'HOC', 'Holshall', '#E2001A', '#FFFFFF', 'fan', 38, 'Kesney Park', 11300],
  ];
  FM.D.CLUBS_ES3 = [
    ['Deportivo Olmador B', 'OLB', 'Olmador', '#FFFFFF', '#FEBE10', 'youth', 45, 'Estadio La Salamosa', 6000, 'OLM'],
    ['Cervar CF B', 'CEB', 'Cervar', '#A50044', '#004D98', 'youth', 44, 'Estadio Alcaliel', 6000, 'CER'],
    ['Real Cuenero B', 'CUB', 'Cuenero', '#EE2523', '#FFFFFF', 'youth', 42, 'Campo de Cuenero', 3250, 'CUE'],
    ['Atlético Pozares', 'POZ', 'Pozares', '#FFFFFF', '#E2001A', 'fan', 37, 'Ciudad Deportiva Pozares', 7813],
    ['Olmador CF B', 'OLA', 'Olmador', '#CB3524', '#272E61', 'youth', 42, 'Estadio Zafrilla', 2800, 'OLC'],
    ['Deportivo Plasares B', 'PLB', 'Plasares', '#FFE667', '#005187', 'youth', 42, 'Estadio Marbedo', 5000, 'PLA'],
    ['Alcaledo Balompié B', 'ALA', 'Alcaledo', '#FFFFFF', '#D81E05', 'youth', 40, 'Estadio La Hinojanes', 7000, 'ALB'],
    ['Deportivo Montara B', 'MTA', 'Montara', '#8AC3EE', '#FFFFFF', 'youth', 40, 'Estadio Moralal', 4500, 'MOD'],
    ['Deportivo Alcaledo B', 'ALL', 'Alcaledo', '#0BB363', '#FFFFFF', 'youth', 39, 'Estadio Olmosa', 3000, 'ALC'],
    ['Unión Rondiel', 'RON', 'Rondiel', '#FFFFFF', '#0046AD', 'fallen', 46, 'Estadio Oñatena', 22824],
    [
      'Atlético Villa Mayorena',
      'MAY',
      'Villa Mayorena',
      '#000000',
      '#FFFFFF',
      'fan',
      43,
      'Estadio La Hinojares',
      15105,
    ],
    ['Deportivo Sepúlval', 'SEP', 'Sepúlval', '#003DA5', '#FFFFFF', 'fan', 41, 'Estadio La Medero', 8400],
    ['Torrilla Balompié', 'TOB', 'Torrilla', '#C8102E', '#000000', 'historic', 41, 'Ciudad Deportiva Torrilla', 14591],
    ['Juventud Fresnero', 'JVN', 'Fresnero', '#FFD700', '#003DA5', 'fan', 39, 'Estadio Rondino', 5100],
    ['Unión Navejo', 'NAU', 'Navejo', '#C8102E', '#FFFFFF', 'fallen', 42, 'Estadio La Ribón', 31179],
    ['CD Castador', 'CAC', 'Castador', '#0033A0', '#FFFFFF', 'fallen', 40, 'Nuevo Estadio Castador', 30000],
    ['Atlético Elchanes', 'ELC', 'Elchanes', '#0057B8', '#FFFFFF', 'oil', 40, 'Estadio Gandejo', 4500],
    ['Club Osuneda', 'OSC', 'Osuneda', '#E2001A', '#FFFFFF', 'fan', 38, 'Estadio La Benero', 7840],
    ['Sporting Moralete', 'MOS', 'Moralete', '#000000', '#FFFFFF', 'fan', 37, 'Estadio Municipal de Moralete', 4000],
    ['Nueva Peñino Sporting Club', 'NUE', 'Peñino', '#C8102E', '#FFFFFF', 'fan', 37, 'Estadio Lermete', 7100],
  ];
  FM.D.CLUBS_DE2 = [
    ['Eintracht Burgingen', 'EIN', 'Burgingen', '#005CA9', '#FFFFFF', 'fallen', 58, 'Elstein-Stadion', 74475],
    ['TSV Hainfeld', 'HAI', 'Hainfeld', '#004D9D', '#FFFFFF', 'fallen', 60, 'Stadion am Hagberg', 62271],
    ['VfL Kirchbrück', 'KIR', 'Kirchbrück', '#0033A0', '#FFFFFF', 'youth', 55, 'Immhafen-Stadion', 15034],
    [
      'Fortuna Neckardorf 1905',
      'FON',
      'Neckardorf',
      '#005CA9',
      '#FFFFFF',
      'historic',
      56,
      'Neckarhausen-Stadion',
      26000,
    ],
    ['FC Steinfurt', 'STE', 'Steinfurt', '#E2001A', '#FFFFFF', 'historic', 55, 'Stadion Dillhausen', 54600],
    ['Altwald SC', 'ALT', 'Altwald', '#00863D', '#000000', 'historic', 55, 'Sportpark Altheim', 49000],
    ['Schwarz-Weiß Steinstein', 'SCW', 'Steinstein', '#E2001A', '#FFFFFF', 'fallen', 54, 'Stadion am Rheinheim', 49327],
    ['TSV Immdorf', 'IMT', 'Immdorf', '#003DA5', '#000000', 'selling', 51, 'Stadion am Branau', 15000],
    ['Fortuna Hirschweiler', 'FOH', 'Hirschweiler', '#9B1B30', '#000000', 'fallen', 54, 'Kirchingen-Stadion', 50000],
    ['Immau 04', 'IMM', 'Immau', '#0033A0', '#FFFFFF', 'historic', 52, 'Sportpark Kirchausen', 34302],
    ['VfB Bruchstein', 'BRV', 'Bruchstein', '#004D9D', '#FFFFFF', 'fan', 52, 'Kalburg-Stadion', 17810],
    ['Concordia Steinau', 'COS', 'Steinau', '#00863D', '#FFFFFF', 'youth', 50, 'Steinau-Arena', 16626],
    ['FC Rotbach', 'ROF', 'Rotbach', '#0033A0', '#FFFFFF', 'fan', 50, 'Stadion Freistein', 30098],
    ['Teutonia Altheim', 'TEA', 'Altheim', '#FFD700', '#004D9D', 'historic', 50, 'Dornwald-Stadion', 23325],
    ['FSV Freital', 'FSF', 'Freital', '#00863D', '#000000', 'fan', 48, 'Freital-Arena', 14300],
    ['Eintracht Marienfurt', 'EIM', 'Marienfurt', '#000000', '#FFFFFF', 'selling', 48, 'Marienfurt-Arena', 10000],
    ['Fortuna Bachdorf', 'FOB', 'Bachdorf', '#0033A0', '#FFFFFF', 'fan', 50, 'Stadion Wiesbach', 26515],
    ['Sportfreunde Hagwald', 'SPH', 'Hagwald', '#FFD700', '#000000', 'fan', 50, 'Hagwald-Arena', 32066],
  ];
  FM.D.CLUBS_DE3 = [
    ['Viktoria Burgtal B', 'VII', 'Burgtal', '#FFFFFF', '#E32219', 'youth', 42, 'Waldstadion Burgtal', 5000, 'VIB'],
    [
      'Teutonia Althof im Tal B',
      'TTN',
      'Althof im Tal',
      '#FDE100',
      '#000000',
      'youth',
      43,
      'Stadion Waldau',
      9999,
      'TEU',
    ],
    ['VfL Mühlfeld 1989 B', 'MUB', 'Mühlfeld', '#1C63B7', '#FFFFFF', 'youth', 41, 'Mühlfeld-Arena', 6350, 'MUH'],
    ['FSV Dillhafen', 'FSD', 'Dillhafen', '#6CABDD', '#FFFFFF', 'fallen', 45, 'Stadion am Dillbach', 15000],
    ['VfB Ahrhafen 1894', 'AHR', 'Ahrhafen', '#E2001A', '#FFFFFF', 'fan', 44, 'Krondorf-Stadion', 22528],
    ['Union Kronkirchen', 'KRO', 'Kronkirchen', '#0033A0', '#FFFFFF', 'fallen', 45, 'Stadion am Hagfurt', 29000],
    ['Hansa Klein Burgberg', 'HAK', 'Burgberg', '#E2001A', '#000000', 'fan', 43, 'Sportpark Lütwald', 15295],
    ['TSV Branhafen 1888', 'BRT', 'Branhafen', '#E2001A', '#FFFFFF', 'fan', 40, 'Stadion am Kirchtal', 8343],
    ['Eintracht Elsdorf', 'EIE', 'Elsdorf', '#0033A0', '#000000', 'fan', 42, 'Sportpark Langhof', 24302],
    ['Union Hirschburg 1886', 'HIR', 'Hirschburg', '#6A0DAD', '#FFFFFF', 'fan', 42, 'Eichfeld-Stadion', 16485],
    ['Alemannia Ober Ebersee', 'ALO', 'Ebersee', '#FFD700', '#000000', 'historic', 43, 'Steinhafen-Stadion', 32960],
    ['SV Klein Ahringen', 'KLA', 'Klein Ahringen', '#000000', '#FFFFFF', 'fan', 39, 'Stadion Holzdorf', 5207],
    ['SpVgg Lindhafen 1909', 'SPV', 'Lindhafen', '#6A0DAD', '#FFFFFF', 'fan', 42, 'Lindhafen-Arena', 15741],
    ['Blau-Weiß Dillhof', 'BLA', 'Dillhof', '#E2001A', '#FFFFFF', 'historic', 44, 'Sportpark Kirchfurt', 20650],
    ['VfB Unter Holzkirchen', 'UNH', 'Holzkirchen', '#E2001A', '#FFFFFF', 'fan', 43, 'Stadion am Hohenburg', 15210],
    ['VfL Groß Branwald', 'GRB', 'Branwald', '#000000', '#FFFFFF', 'fan', 42, 'Westerheim-Stadion', 17000],
    ['TSV Haindorf', 'HND', 'Haindorf', '#005CA9', '#FFFFFF', 'fallen', 44, 'Goldwald-Stadion', 31500],
    ['Teutonia Dillhorst 1884', 'TED', 'Dillhorst', '#0033A0', '#000000', 'fan', 43, 'Sportpark Goldwald', 16003],
    ['Schwarz-Weiß Langau', 'SCR', 'Langau', '#E2001A', '#000000', 'selling', 42, 'Waldstadion Langau', 15800],
    ['Burgdorf 04', 'BUG', 'Burgdorf', '#00863D', '#FFFFFF', 'fan', 38, 'Langstadt-Stadion', 15060],
  ];
  FM.D.CLUBS_IT2 = [
    ['Audace Sassetto', 'AUS', 'Sassetto', '#E2001A', '#FFFFFF', 'selling', 58, 'Stadio Nuovo Sassara', 16917],
    ['Sporting Gubbetto', 'GUS', 'Gubbetto', '#000000', '#F18A00', 'selling', 57, 'Arena Casino', 11150],
    ['Vis Trenago', 'VIS', 'Trenago', '#005CA9', '#FFFFFF', 'youth', 57, 'Arena Frascia', 16284],
    ['Atletico Serara', 'SER', 'Serara', '#F4A6C1', '#000000', 'oil', 56, 'Stadio Civico di Serara', 36365],
    ['Polisportiva Orvola', 'POL', 'Orvola', '#1B5EA6', '#FFFFFF', 'fallen', 55, 'Stadio Leccona', 36599],
    ['Atletico Corucci', 'CRC', 'Corucci', '#FFFFFF', '#E2001A', 'fallen', 52, 'Stadio Nuovo Toria', 58270],
    [
      'Audace Valano al Monte',
      'ADC',
      'Valano al Monte',
      '#FFFFFF',
      '#000000',
      'selling',
      53,
      'Stadio Nuovo Casento',
      10336,
    ],
    ['FC Serano', 'SEF', 'Serano', '#FFD700', '#0033A0', 'fan', 51, 'Stadio Civico di Serano', 21151],
    ['US Paducci 1942', 'UPX', 'Paducci', '#FFD700', '#E2001A', 'fan', 50, 'Stadio Casino', 14650],
    ['Iuventa Piino', 'JUP', 'Piino', '#FFFFFF', '#000000', 'fan', 50, 'Arena Ravia', 23860],
    ['Audace Trenara', 'AUT', 'Trenara', '#FFD700', '#0033A0', 'fan', 48, 'Stadio Nuovo Roccello', 12800],
    ['US San Ponino', 'USS', 'Ponino', '#FFFFFF', '#E2001A', 'selling', 48, 'Stadio Comunale di Ponino', 5539],
    ['Valano Calcio', 'VAC', 'Valano', '#8B0000', '#FFFFFF', 'fan', 49, 'Arena Ferago', 21525],
    ['San Fabrara 1908', 'SFX', 'San Fabrara', '#FFD700', '#0033A0', 'fan', 46, 'Stadio Venona', 9500],
    ['Libertas Castel Orvate', 'LIB', 'Castel Orvate', '#FFFFFF', '#E2001A', 'historic', 47, 'Stadio Orvara', 32336],
    ['Atletico Fosona', 'FOA', 'Fosona', '#FFFFFF', '#E2001A', 'fan', 46, 'Arena Arezucci', 14844],
    ['Pro San Marona', 'PRS', 'San Marona', '#005CA9', '#FFFFFF', 'fan', 45, 'Stadio Civico di San Marona', 5535],
    ['Valate Calcio', 'VLT', 'Valate', '#00863D', '#FFFFFF', 'fan', 46, 'Stadio Trenago', 26308],
    [
      'ASD Borgo Ponago',
      'ASD',
      'Borgo Ponago',
      '#005CA9',
      '#FFFFFF',
      'fan',
      47,
      'Stadio Comunale di Borgo Ponago',
      20476,
    ],
    ['Audace Fosago', 'AUF', 'Fosago', '#FFD700', '#005CA9', 'selling', 51, 'Stadio Comunale di Fosago', 16227],
  ];
  FM.D.CLUBS_FR2 = [
    ['Olympique Lunmont', 'LNM', 'Lunmont', '#F58025', '#1B3A6B', 'selling', 56, 'Stade Municipal de Lunmont', 32900],
    ['SC Clerières', 'CLE', 'Clerières', '#009A44', '#FFFFFF', 'fallen', 58, 'Stade de la Maron', 41965],
    ['Racing Club de Pauières', 'PAU', 'Pauières', '#E2001A', '#FFFFFF', 'selling', 56, 'Stade de la Courlieu', 21029],
    ['FC Beauens', 'BEF', 'Beauens', '#E2001A', '#000000', 'fan', 50, 'Stade Fonlac', 18378],
    ['Athlétic Saint-Cherault', 'CHR', 'Cherault', '#FFD700', '#005CA9', 'fan', 47, 'Complexe Nanlieu', 4031],
    [
      'Stade Château-Clermont',
      'CEA',
      'Château-Clermont',
      '#E2001A',
      '#FFFFFF',
      'fan',
      47,
      'Stade Municipal de Château-Clermont',
      15660,
    ],
    ['Château-Chaon FC', 'CTE', 'Chaon', '#F58025', '#000000', 'fan', 47, 'Stade de la Lavières', 18467],
    ['Athletic Club Beau-Lanlieu', 'BEU', 'Beau-Lanlieu', '#005CA9', '#FFFFFF', 'fan', 47, 'Stade de la Beauon', 20068],
    ['FC Casslac', 'CAF', 'Casslac', '#FFFFFF', '#000000', 'fan', 48, 'Parc des Sports de Casslac', 12097],
    ['AS Dieulac', 'DIA', 'Dieulac', '#00863D', '#FFFFFF', 'fan', 46, 'Stade Nangnan', 10000],
    [
      'Athlétic Vilon-en-Vallée',
      'VIE',
      'Vilon-en-Vallée',
      '#E2001A',
      '#FFD700',
      'fan',
      46,
      'Stade de la Cherville',
      5955,
    ],
    ['Olympique Beaubourg', 'BEO', 'Beaubourg', '#E2001A', '#005CA9', 'fan', 49, 'Stade Municipal de Beaubourg', 11980],
    ['AS Sarlac', 'SRL', 'Sarlac', '#005CA9', '#FFFFFF', 'fan', 46, 'Stade Ponbourg', 4933],
    ['AJ Riblac', 'AJR', 'Riblac', '#005CA9', '#FFFFFF', 'historic', 47, 'Stade Municipal de Riblac', 16078],
    ['AS Lanange', 'LNN', 'Lanange', '#E2001A', '#FFD700', 'fallen', 47, 'Stade Municipal de Lanange', 25064],
    ['Racing Dureau', 'DUR', 'Dureau', '#FFFFFF', '#E2001A', 'fallen', 48, 'Stade Clerange', 20087],
    ['Athlétic Sarières', 'SRR', 'Sarières', '#E2001A', '#000000', 'fan', 44, 'Complexe Paulac', 9534],
    ['Union Chaens', 'CHA', 'Chaens', '#005CA9', '#FFFFFF', 'fallen', 50, 'Stade Municipal de Chaens', 21877],
  ];
  // The first eight leagues (the original game): [compId, clubs, nation]. Every league in FM.D.LEAGUES can be managed.
  FM.D.LEAGUE_CLUBS = [
    ['D1', 'CLUBS_D1', 'ENG'],
    ['D2', 'CLUBS_D2', 'ENG'],
    ['D3', 'CLUBS_D3', 'ENG'],
    ['ES1', 'CLUBS_ES1', 'ESP'],
    ['ES2', 'CLUBS_ES2', 'ESP'],
    ['DE1', 'CLUBS_DE1', 'GER'],
    ['FR1', 'CLUBS_FR1', 'FRA'],
    ['BR1', 'CLUBS_BR1', 'BRA'],
  ];
  FM.D.allClubRows = () => FM.D.LEAGUES.flatMap((l) => FM.D[l.clubs]); // every club of every league

  FM.D.RIVALS = [
    ['JAN', 'SAH', 'Ain Jubis Derby'],
    ['YAS', 'SAR', 'Yanik Derby'],
    ['JAN', 'YAS', 'Ain Jubis–Yanik Derby'],
    ['WAF', 'TAQ', 'Ain Jubis Derby'],
    ['SAA', 'DHI', 'Shaydah Derby'],
    ['IBD', 'ASL', 'Ain Tabuf–Ras Ulamaah Derby'],
    ['ZAH', 'YAS', 'Bahayma–Yanik Derby'],
    ['BAY', 'BAA', 'Baywick Derby'],
    ['CLI', 'CLC', 'Clifwold Derby'],
    ['CHE', 'QUA', 'Chelington Derby'],
    ['CHC', 'TAD', 'Chelington Derby'],
    ['ROD', 'CAR', 'Rodstead–Carwick Derby'],
    ['EVE', 'EVR', 'Everwich Derby'],
    ['EPI', 'KIN', "Epington–King's Branmere Derby"],
    ['CAL', 'BRA', 'Calgate–Chelington Derby'],
    ['FIL', 'HAT', 'Chelington Derby'],
    ['MER', 'YAR', 'Merstead–Yardale Derby'],
    ['SEL', 'AME', 'Selstow–Amesholm Derby'],
    ['TTH', 'CAO', 'Tethaven–Caldale Derby'],
    ['TET', 'TOU', 'Chelington Derby'],
    ['RYE', 'ROU', 'Ryeworth–Rodwood Derby'],
    ['LIT', 'LIN', 'North Litworth Derby'],
    ['GRT', 'TUT', 'Grenwold–Tuthurst Derby'],
    ['ALD', 'LAU', 'Aldcaster–Langley Derby'],
    ['BEX', 'BES', 'South Bexwell Derby'],
    ['STH', 'LAM', 'Stratsey–Lamwold Derby'],
    ['YRN', 'SHP', 'Yarney–Shafport Derby'],
    ['REY', 'HYD', 'Reystow–Hydehaven Derby'],
    ['BXS', 'WED', 'Bexstead–Wedcastle-on-Sea Derby'],
    ['WOR', 'MAN', 'Worpool–Manshall Derby'],
    ['HUC', 'CAI', 'Huckborough–Cansingham Derby'],
    ['CLF', 'TAV', 'Clifholm–Tavstow Derby'],
    ['OLM', 'CER', 'Olmador–Cervar Derby'],
    ['OLC', 'BEN', 'Olmador–Benavera Derby'],
    ['CUE', 'LIO', 'Cuenero–Liorera Derby'],
    ['ALC', 'ALB', 'Alcaledo Derby'],
    ['MOF', 'MNT', 'Monte Fuentares Derby'],
    ['PLA', 'SOD', 'Plasares–Sorana Derby'],
    ['MOD', 'SAP', 'Montara–San de Piedador Derby'],
    ['CRV', 'JUV', 'Cervar–Valdemosa Derby'],
    ['COR', 'OLR', 'Corvar–Olmero Derby'],
    ['OSU', 'NAV', 'Olmador–Nava Derby'],
    ['CAU', 'MOA', 'Calatosa–Montino Derby'],
    ['SEG', 'RON', 'Segovón–Rondiel Derby'],
    ['ARA', 'JUF', 'Aranjero–Fuentena Derby'],
    ['JUR', 'ARK', 'Villa Roblón–Arrasti Derby'],
    ['BNV', 'MOR', 'Benavete–Moralero Derby'],
    ['DIL', 'TEU', 'Dillhafen–Althof im Tal Derby'],
    ['UNT', 'FOR', 'Unter Felswald–Branhafen Derby'],
    ['BRF', 'BER', 'Branfurt–Berghorst Derby'],
    ['VID', 'GER', 'Dornsee–Unter Furtbach Derby'],
    ['VIB', 'BRU', 'Burgtal–Bruchingen Derby'],
    ['VIK', 'SPB', 'Marieningen–Burgingen Derby'],
    ['QUI', 'LUN', 'Quimcourt–Lunens Derby'],
    ['USM', 'ETO', 'Mirières–Cassens Derby'],
    ['ESB', 'AJC', 'Bourcourt–Chaange Derby'],
    ['VAL', 'LUR', 'Valange–Luneau Derby'],
    ['JOY', 'CLE', 'Joylieu–Clerières Derby'],
    ['THO', 'VAR', 'Thobourg–Valac Derby'],
    ['ESJ', 'LUO', 'Joyac–Luncourt Derby'],
    ['QUR', 'EST', 'Quimcourt–Tourens Derby'],
    ['VIL', 'UNP', 'Vila Maramirim Derby'],
    ['GUA', 'GUF', 'Guarama Derby'],
    ['UNG', 'GUI', 'Guina Derby'],
    ['PIT', 'PIA', 'Pitangaçu Derby'],
    ['GRE', 'URU', 'Guarama–Urucai Derby'],
    ['VIM', 'NAC', 'Vila Maramirim Derby'],
    ['UBA', 'UBE', 'Ubatia Derby'],
    ['JAB', 'JAC', 'Jabotão Derby'],
    ['USP', 'PRO', 'Pietto Derby'],
    ['BEL', 'USB', 'Belago Derby'],
    ['VIR', 'GUB', 'Gubbento Derby'],
    ['USF', 'AUD', 'Ferucci–Ferara Derby'],
    ['ORV', 'AUM', 'Orvola–Mirino Derby'],
    ['KVA', 'ZAA', 'Alkrade–Zaanhorst Derby'],
    ['VIT', 'WAA', 'Zwolwijk–Wagekerk Derby'],
    ['KLF', 'EXH', 'Kleinvoort–Hoornbrug Derby'],
    ['EXC', 'MAA', 'Dijklo–Maaswijk Derby'],
    ['ADO', 'RKH', 'Zaanhorst Derby'],
    ['POR', 'POA', 'Porteiro Derby'],
    ['GRP', 'SAN', 'Penura–Santinha Derby'],
    ['SPO', 'BUS', 'Busteda Derby'],
    ['NAD', 'GIM', 'Dorrez Derby'],
    ['QRZ', 'REG', 'Quirez Derby'],
    ['LEZ', 'DEP', 'Busteda Derby'],
    ['IND', 'NAO', 'Ortini Derby'],
    ['DOM', 'DOR', 'Domeda Derby'],
    ['PUE', 'REQ', 'Puerto Franez–Quirona Derby'],
    ['GAR', 'GAP', 'Garero del Plata Derby'],
    ['SIA', 'SIL', 'Silverfield Derby'],
    ['SUN', 'BLU', 'Sunfield–Bluehills Derby'],
    ['FOS', 'FRT', 'Fort Summiton Derby'],
    ['REN', 'GRU', 'New Redcreek–Greencreek Derby'],
    ['ASE', 'PIN', 'Aspenhaven–Pineridge Derby'],
    ['MAP', 'BEA', 'Mapleford–Bearville Derby'],
    ['GOR', 'CHM', 'Goldenville–Cherryford Derby'],
    ['LAK', 'SPR', 'Lakegrove–Springridge Derby'],
    ['MAT', 'MAC', 'Matsuhara Derby'],
    ['AKI', 'SHF', 'Akisaki–Shinsaki Derby'],
    ['HIG', 'HIS', 'Higashino Derby'],
    ['SAK', 'KIT', 'Sakurata–Kitanarisaki Derby'],
    ['JIL', 'COA', 'Jilitzin–Coatohua Derby'],
    ['TUL', 'JIU', 'Tulapan–Jilehua Derby'],
    ['JIF', 'JIC', 'Jilitzin Derby'],
    ['GAN', 'CHU', 'Gangyang–Chunseong Derby'],
    ['CHS', 'GNG', 'Chunwon–Gangjeong Derby'],
    ['NON', 'NOA', 'Nongkaeo Derby'],
    ['BAU', 'UAL', 'Badugu–Ua Derby'],
    ['SPT', 'NAJ', 'Oujali Derby'],
    ['USN', 'NAN', 'Nadar Derby'],
    ['NAM', 'TAZ', 'Midouan–Tazad Derby'],
    ['RAP', 'NKJ', 'Jasovac Derby'],
    ['ZOR', 'MLM', 'Novany–Malovac Derby'],
    ['ZFR', 'NJH', 'Benighada–Huranhur Derby'],
    ['NIL', 'FAU', 'Benighada Derby'],
    ['ITT', 'POT', 'Assta Derby'],
    ['MOE', 'MNE', 'Moneau Derby'],
    ['NAE', 'NNE', 'Naneau Derby'],
    ['TAB', 'TAC', 'Tabanga Derby'],
    ['SAM', 'SOC', 'Tabanga Derby'],
    ['THR', 'AJM', 'Thoières Derby'],
    ['THI', 'BEC', 'Thoières Derby'],
    ['XAN', 'GSX', 'Xanópoli Derby'],
    ['AOS', 'ETH', 'Seránia Derby'],
    ['PAK', 'KYP', 'Kypánia Derby'],
    ['AOB', 'KAS', 'Belany–Kamovac Derby'],
    ['HED', 'HOB', 'Hedrud–Holgård Derby'],
    ['DYF', 'GAF', 'Dyrfors–Gammelstad Derby'],
    ['GMM', 'SND', 'Gammelstad Derby'],
    ['MET', 'SPK', 'Donji Lubpol Derby'],
    ['VLD', 'HIN', 'Valdemiel–Hinojiel Derby'],
    ['VAE', 'MAD', 'Valdemiel Derby'],
    ['ARO', 'AOA', 'Arroar Derby'],
    ['ESU', 'DEO', 'Ortas Derby'],
    ['RGT', 'PUF', 'Ortas Derby'],
    ['VAB', 'VAD', 'Valal Derby'],
    ['POS', 'PZA', 'Poza Derby'],
    ['CAA', 'CRA', 'Cabral Derby'],
    ['BUA', 'IZZ', 'Wadi Majum–Jedat Derby'],
    ['JAA', 'YAQ', 'Jedat Derby'],
    ['MAJ', 'SHB', 'Majmaah Derby'],
    ['MES', 'NAS', 'Qazud Derby'],
    ['GOS', 'PSY', 'Shahr Yazvin Derby'],
    ['IHS', 'BHY', 'Bahaydah Derby'],
    ['ULI', 'GHA', 'Bahaydah Derby'],
    ['MEI', 'MED', 'Meimen Derby'],
  ];

  // Overseas clubs — "minimal simulation" tier: squads exist for scouting, no fixtures.
  FM.D.CLUBS_OVERSEAS = []; // Saint-Étienne, Montpellier and Tenerife now play in Ligue 2 and the Primera Federación

  // ---------- Alpha 1: the wider world in three simulation tiers ----------
  // full    — every match in the engine, finances, cups, transfers
  // light   — every fixture played, results from a fast statistical model with per-match player stats
  // minimal — fixtures produce scores only; squads exist for scouting and the market
  // Rows: [name, short, city, primary, secondary, identity, rep, stadium, capacity]
  FM.D.CLUBS_IT1 = [
    ['US Pietto', 'USP', 'Pietto', '#0068A8', '#000000', 'giant', 86, 'Stadio Trenezia', 75817],
    ['Virtus Gubbento', 'VIR', 'Gubbento', '#FFFFFF', '#000000', 'giant', 84, 'Stadio Nuovo Monale', 41507],
    ['AC Monte Roccate', 'MON', 'Monte Roccate', '#12A0D7', '#FFFFFF', 'historic', 83, 'Stadio Serale', 54726],
    ['Pro Pietto', 'PRO', 'Pietto', '#FB090B', '#000000', 'giant', 82, 'Stadio Nuovo Ponola', 75817],
    ['Unione Trenia al Monte', 'TRE', 'Trenia al Monte', '#1E71B8', '#000000', 'selling', 78, 'Stadio Amalana', 24950],
    ['AC Belago', 'BEL', 'Belago', '#8E1F2F', '#F0BC42', 'historic', 78, 'Stadio Civico di Belago', 70634],
    ['US Belago 1900', 'USB', 'Belago', '#87D8F7', '#FFFFFF', 'historic', 74, 'Stadio Monola', 70634],
    ['Audace Ferara', 'AUD', 'Ferara', '#A21C26', '#1A2F48', 'youth', 73, 'Stadio Nuovo Trenello', 36462],
    ['US Ferucci', 'USF', 'Ferucci', '#482E92', '#FFFFFF', 'historic', 73, 'Stadio Civico di Ferucci', 43147],
    ['Frascano Calcio 1909', 'FRA', 'Frascano', '#0E3E8C', '#FFFFFF', 'oil', 70, 'Stadio Comunale di Frascano', 13602],
    ['AC Gubbento', 'GUB', 'Gubbento', '#8A1E03', '#FFFFFF', 'historic', 66, 'Stadio Comunale di Gubbento', 28177],
    ['AC Mirara 1901', 'MIR', 'Mirara', '#FFFFFF', '#000000', 'selling', 64, 'Stadio Nuovo Amalello', 25144],
    ['Associazione Calcio Orvola', 'ORV', 'Orvola', '#A6192E', '#002E5D', 'fan', 64, 'Stadio Vilia', 36599],
    ['Pro Fabrago', 'PRF', 'Fabrago', '#FFFFFF', '#FFD100', 'fan', 62, 'Stadio Modara', 22352],
    ['Sporting Frascola 1952', 'FRS', 'Frascola', '#A6192E', '#002E5D', 'fan', 62, 'Stadio Nuovo Vilale', 16416],
    ['Virtus Orvezia 1977', 'VIO', 'Orvezia', '#00A650', '#000000', 'youth', 61, 'Arena Casara', 21584],
    ['Audace Valara', 'AUV', 'Valara', '#FFD100', '#003DA5', 'youth', 60, 'Stadio Comunale di Valara', 39211],
    ['Virtus Casucci', 'VIC', 'Casucci', '#FFD100', '#E30613', 'youth', 60, 'Arena Vilate', 31533],
    ['SSC Trenone 1902', 'TRS', 'Trenone', '#E30613', '#9A9A9A', 'fan', 58, 'Stadio Comunale di Trenone', 16003],
    ['Audace Mirino', 'AUM', 'Mirino', '#000000', '#0033A0', 'fan', 58, 'Stadio Belana', 25000],
  ];
  FM.D.CLUBS_NL1 = [
    ['KV Alkrade', 'KVA', 'Alkrade', '#FFFFFF', '#D2122E', 'giant', 81, 'De Oostburg', 55865],
    [
      'AFC Klein Oostburg',
      'KLE',
      'Klein Oostburg',
      '#ED1C24',
      '#FFFFFF',
      'historic',
      80,
      'Klein Oostburg Arena',
      35119,
    ],
    ['SC Zaanhorst', 'ZAA', 'Zaanhorst', '#FF0000', '#FFFFFF', 'fan', 79, 'De Sneekwaard', 47500],
    ['RKC Groot Bredhout', 'RKC', 'Groot Bredhout', '#DB0021', '#FFFFFF', 'selling', 72, 'Westhoven Stadion', 19478],
    ['Vitesse Zwolwijk', 'VIT', 'Zwolwijk', '#E30613', '#FFFFFF', 'historic', 68, 'De Leidijk', 30205],
    ['SC Nieuw Gronvoort', 'NIE', 'Nieuw Gronvoort', '#E30613', '#FFFFFF', 'fan', 66, 'Alkdijk Stadion', 23750],
    ['Excelsior Dijklo', 'EXC', 'Dijklo', '#E30613', '#FFD100', 'fan', 62, 'Sportpark Haarvoort', 10400],
    ['VV Groot Haarzand', 'VVG', 'Groot Haarzand', '#E30613', '#00843D', 'fan', 62, 'Bergwaard Stadion', 12500],
    ['Excelsior Hoornbrug', 'EXH', 'Hoornbrug', '#0055A4', '#FFFFFF', 'youth', 61, 'Devenbrug Stadion', 26100],
    ['FC Kleinvoort', 'KLF', 'Kleinvoort', '#008000', '#FFFFFF', 'historic', 60, 'Vlaarveen Stadion', 22525],
    ['ADO Zaanhorst', 'ADO', 'Zaanhorst', '#E4002B', '#FFFFFF', 'youth', 58, 'Nieuwlo Stadion', 11026],
    ['AFC Maaswijk', 'MAA', 'Maaswijk', '#0055A4', '#FFFFFF', 'fan', 58, 'Sportpark Bredbrug', 14000],
    ['DVC Sint Wagelo', 'DVC', 'Sint Wagelo', '#FFD100', '#00843D', 'fan', 57, 'De Hoogwijk', 12500],
    ['SC Zaanhout', 'ZAS', 'Zaanhout', '#FFD100', '#000000', 'fan', 57, 'Stadion Haarburg', 19000],
    ['AFC Wagekerk', 'WAA', 'Wagekerk', '#000000', '#FFFFFF', 'fan', 56, 'De Maaswijk', 12080],
    ['SC Laagdam aan Zee', 'LGD', 'Laagdam aan Zee', '#FF7F00', '#000000', 'youth', 55, 'Hoogzand Stadion', 7384],
    ['RKC Hoornvoort', 'RKH', 'Zaanhorst', '#E30613', '#000000', 'fan', 55, 'Zaanhorst Arena', 4500],
    ['VV Zwolstad', 'VVZ', 'Zwolstad', '#FFFFFF', '#000000', 'fan', 54, 'Zwolstad Arena', 5200],
  ];
  FM.D.CLUBS_PT1 = [
    ['Sporting Porteiro', 'POR', 'Porteiro', '#E30613', '#FFFFFF', 'giant', 83, 'Estádio Leirares', 64642],
    ['União Pombão', 'UNI', 'Pombão', '#003893', '#FFFFFF', 'giant', 82, 'Estádio Nova Amarães', 50033],
    ['Atlético Porteiro', 'POA', 'Porteiro', '#008057', '#FFFFFF', 'historic', 82, 'Arena Vendeiro', 50095],
    ['Clube Santinha', 'SAN', 'Santinha', '#E30613', '#FFFFFF', 'selling', 74, 'Estádio Nova Venda', 30286],
    ['Grémio Penura', 'GRP', 'Penura', '#FFFFFF', '#000000', 'fan', 66, 'Complexo Desportivo Penura', 30029],
    ['Sporting Alenteira', 'ALE', 'Alenteira', '#E30613', '#FFFFFF', 'fan', 60, 'Estádio Nova Ferrães', 13277],
    ['Atlético Guimouro', 'GMR', 'Guimouro', '#FFFFFF', '#003DA5', 'selling', 60, 'Estádio Mirela', 5307],
    ['Sport Clube Coveiro', 'COV', 'Coveiro', '#FFDD00', '#0038A8', 'youth', 60, 'Estádio Nova Torrares', 8000],
    ['Associação Gouvura', 'GOU', 'Gouvura', '#E30613', '#003DA5', 'fan', 58, 'Estádio Portão', 12046],
    [
      'Esporte Clube Alto Avouro',
      'ESP',
      'Alto Avouro',
      '#FFD100',
      '#0033A0',
      'fan',
      58,
      'Estádio Municipal de Alto Avouro',
      5600,
    ],
    ['Marvães Atlético Clube', 'MAR', 'Marvães', '#00843D', '#FFFFFF', 'oil', 57, 'Arena Figa', 9065],
    [
      'Sporting Campo Vendão',
      'CAM',
      'Campo Vendão',
      '#00843D',
      '#FFFFFF',
      'fan',
      57,
      'Complexo Desportivo Campo Vendão',
      6153,
    ],
    ['Toma Atlético Clube', 'TOM', 'Porteiro', '#000000', '#FFFFFF', 'fan', 57, 'Estádio Penais', 3000],
    ['Esporte Clube Pombela', 'ESO', 'Pombela', '#000000', '#FFFFFF', 'historic', 55, 'Arena Elvinha', 5132],
    ['Sporting Sesimela', 'SES', 'Sesimela', '#E30613', '#FFFFFF', 'fan', 54, 'Estádio Nova Argada', 8560],
    ['Sport Clube Leirinha', 'LEI', 'Leirinha', '#E30613', '#00843D', 'fan', 54, 'Estádio Municipal de Leirinha', 9288],
    ['Atlético Cova', 'CVA', 'Cova', '#E30613', '#FFFFFF', 'selling', 54, 'Estádio Estreiro', 7705],
    ['Leirais FC', 'LEF', 'Leirais', '#FFD100', '#00843D', 'fan', 53, 'Estádio Nova Tavirura', 5000],
  ];
  FM.D.CLUBS_AR1 = [
    ['Sportivo Busteda', 'SPO', 'Busteda', '#FFFFFF', '#E30613', 'giant', 79, 'Estadio Lavo', 85018],
    ['Atlético Busteda', 'BUS', 'Busteda', '#0033A0', '#FFD100', 'giant', 78, 'Estadio Municipal de Busteda', 54000],
    ['Nacional Dorrez', 'NAD', 'Dorrez', '#6CACE4', '#FFFFFF', 'historic', 70, 'Cancha de Dorrez', 51389],
    ['Gimnasia de Dorrez', 'GIM', 'Dorrez', '#E30613', '#FFFFFF', 'fallen', 67, 'Estadio Monumental Pellona', 48069],
    ['Independiente Ortini', 'IND', 'Ortini', '#E30613', '#FFFFFF', 'youth', 66, 'Estadio Municipal de Ortini', 30018],
    ['Club Atlético Lezo', 'LEZ', 'Busteda', '#0033A0', '#E30613', 'historic', 65, 'Estadio Monumental Rodilla', 47964],
    ['Independiente Franas', 'INF', 'Busteda', '#FFFFFF', '#0033A0', 'youth', 64, 'Estadio Herero', 49540],
    ['Atlético Domeda', 'DOM', 'Domeda', '#0033A0', '#FFFFFF', 'selling', 63, 'Estadio Garilla', 57000],
    ['Atlético Quirez', 'QRZ', 'Quirez', '#003DA5', '#FFD100', 'fan', 63, 'Estadio Municipal de Quirez', 41654],
    [
      'Puerto Franez FC',
      'PUE',
      'Puerto Franez',
      '#8A1538',
      '#FFFFFF',
      'selling',
      63,
      'Estadio Monumental Torero',
      47027,
    ],
    ['Atlético Velilla', 'VEL', 'Busteda', '#E30613', '#FFFFFF', 'youth', 62, 'Estadio Ortia', 26000],
    ['Club de Regatas Quirez', 'REG', 'Quirez', '#E30613', '#000000', 'fan', 61, 'Estadio Pellez', 42000],
    ['Defensores de Pelleda', 'DEP', 'Busteda', '#FFFFFF', '#E30613', 'fan', 60, 'Estadio Monumental Quirui', 48314],
    ['Defensores de Dorrui', 'DEF', 'Dorrui', '#FFD100', '#00843D', 'selling', 60, 'Cancha de Dorrui', 20000],
    ['Racing de Domeda', 'DOR', 'Domeda', '#6CACE4', '#FFFFFF', 'fan', 60, 'Cancha de Domeda', 30000],
    ['Nacional Ortini', 'NAO', 'Ortini', '#FFFFFF', '#1B2C5A', 'fan', 58, 'Estadio Monumental Lezini', 24544],
    [
      'Unión de Garero del Plata',
      'GAR',
      'Garero del Plata',
      '#0033A0',
      '#FFFFFF',
      'youth',
      58,
      'Estadio Municipal de Garero del Plata',
      42000,
    ],
    ['Atlético Urqini', 'URQ', 'Urqini', '#0033A0', '#E30613', 'fan', 57, 'Cancha de Urqini', 26282],
    ['Club Atlético Castón', 'CAS', 'Castón', '#E30613', '#FFFFFF', 'fan', 57, 'Estadio Escona', 22852],
    ['Defensores de Dorrona', 'DFN', 'Domeda', '#E30613', '#FFFFFF', 'fan', 57, 'Estadio Puesar', 26535],
    ['Club de Regatas Quirona', 'REQ', 'Quirona', '#00843D', '#FFFFFF', 'youth', 57, 'Cancha de Quirona', 34901],
    [
      'Atlético Garero del Plata',
      'GAP',
      'Garero del Plata',
      '#0033A0',
      '#FFFFFF',
      'fan',
      56,
      'Estadio Monumental Alverez',
      24000,
    ],
    ['Nacional Castas', 'NCN', 'Castas', '#6CACE4', '#FFFFFF', 'fan', 56, 'Cancha de Castas', 35200],
    ['Club Atlético Pellez', 'PEC', 'Pellez', '#FFFFFF', '#6B3F1F', 'fan', 56, 'Cancha de Pellez', 28530],
    ['Club Atlético Franui', 'FRC', 'Busteda', '#E30613', '#FFFFFF', 'fan', 55, 'Cancha de Busteda', 4500],
    ['Club Atlético Torilla', 'TOR', 'Torilla', '#000000', '#FFFFFF', 'fan', 55, 'Cancha de Torilla', 30000],
    [
      'Atlético Coronel Franero',
      'COF',
      'Coronel Franero',
      '#00843D',
      '#FFFFFF',
      'fan',
      54,
      'Estadio Monumental Belia',
      22000,
    ],
    ['Club Atlético Arreda', 'ARC', 'Busteda', '#000000', '#FFFFFF', 'fan', 53, 'Estadio Miro', 3000],
  ];
  FM.D.CLUBS_US1 = [
    ['Aspenview FC', 'ASP', 'Aspenview', '#F7B5CD', '#231F20', 'oil', 67, 'Aspenview Arena', 21550],
    ['Silverfield Storm', 'SIL', 'Silverfield', '#000000', '#C39E6D', 'oil', 66, 'Mesafield Field', 22000],
    ['Silverfield Athletic', 'SIA', 'Silverfield', '#FFFFFF', '#00245D', 'historic', 65, 'Summitville Field', 27000],
    ['Sunfield Lumberjacks', 'SUN', 'Sunfield', '#5D9741', '#005595', 'fan', 64, 'Sunfield Field', 37722],
    ['Goldenville Revolution', 'GOR', 'Goldenville', '#003087', '#FE5000', 'youth', 63, 'Riverwood Field', 26000],
    ['Cherryford Mustangs', 'CHM', 'Cherryford', '#FEDD00', '#000000', 'historic', 62, 'Cherryford Field', 20371],
    ['Millgrove Lumberjacks', 'MIL', 'Millgrove', '#071B2C', '#B19B69', 'youth', 62, 'Millgrove Stadium', 18500],
    ['Fort Summiton Pioneers', 'FOS', 'Fort Summiton', '#6CACE4', '#041E42', 'oil', 62, 'Cypresshills Park', 28743],
    ['Lakegrove Union Club', 'LAK', 'Lakegrove', '#80000A', '#A19060', 'fan', 61, 'Lakegrove Field', 42500],
    ['Fort Summiton Revolution', 'FRT', 'Fort Summiton', '#FFFFFF', '#BA0C2F', 'oil', 60, 'Canyonburg Field', 25000],
    ['Fortview Foundry United', 'FOF', 'Fortview', '#ECE83A', '#1F1646', 'fan', 60, 'Eagleview Field', 30000],
    ['Springridge SC', 'SPR', 'Springridge', '#633492', '#FDE192', 'fan', 60, 'Whitefalls Field', 25500],
    [
      'Eaglefield Beach United',
      'EAG',
      'Eaglefield Beach',
      '#FFFFFF',
      '#00245E',
      'youth',
      60,
      'Cypressville Field',
      22120,
    ],
    ['Bluehills City FC', 'BLU', 'Bluehills', '#00482B', '#D69A00', 'fan', 59, 'Bluehills Stadium', 25218],
    ['Hickoryridge Stallions', 'HIC', 'Hickoryridge', '#585958', '#8CD2F4', 'fan', 58, 'Aspenhaven Field', 19400],
    ['Cedarville FC', 'CED', 'Cedarville', '#1B1F23', '#6E4C9F', 'oil', 58, 'Bayfalls Field', 35000],
    ['Bearville FC', 'BEA', 'Bearville', '#B30838', '#013A81', 'youth', 58, 'Bearville Stadium', 20213],
    ['Pineridge Express', 'PIN', 'Pineridge', '#E81F3E', '#2A4076', 'youth', 58, 'Cedardale Field', 20500],
    ['Whitedale Ironworks SC', 'WHI', 'Whitedale', '#1A85C8', '#000000', 'fan', 57, 'Whitedale Arena', 38000],
    ['AC Aspenhaven', 'ASE', 'Aspenhaven', '#FF6B00', '#101820', 'fan', 57, 'Bluehills Park', 22039],
    ['Goldenburg Pioneers', 'GOP', 'Goldenburg', '#91B0D5', '#002F65', 'fan', 57, 'Goldenburg Field', 18467],
    ['Canyonhaven Rockets', 'CAN', 'Canyonhaven', '#DD004A', '#0A1E2C', 'fan', 57, 'Canyonhaven Arena', 22423],
    ['Mapleford Revolution', 'MAP', 'Mapleford', '#960A2C', '#9CC2EA', 'youth', 56, 'Walnutgrove Park', 18061],
    ['Bluewood SC', 'BLS', 'Bluewood', '#00B140', '#000000', 'fan', 56, 'Bluewood Field', 20738],
    ['Sunsprings SC', 'SUS', 'Sunsprings', '#7CCDEF', '#FF0000', 'fan', 56, 'Oakwood Park', 61500],
    ['Pinefield Surge', 'PNF', 'Pinefield', '#000000', '#EF3E42', 'fan', 56, 'Pinefield Stadium', 20000],
    ['Summitfalls Union Club', 'SUM', 'Summitfalls', '#0A2240', '#CE0E2D', 'fan', 56, 'Summitfalls Stadium', 65878],
    ['New Redcreek Athletic', 'REN', 'New Redcreek', '#B81137', '#455560', 'fan', 57, 'New Redcreek Field', 30991],
    ['Greencreek Union Club', 'GRU', 'Greencreek', '#000000', '#0033A1', 'fan', 55, 'Sungrove Stadium', 19619],
    ['Prairiedale Thunder', 'PRA', 'Prairiedale', '#0067B1', '#000000', 'fan', 55, 'Summitburg Stadium', 18000],
  ];
  FM.D.CLUBS_JP1 = [
    [
      'Nishiharukami FC',
      'NIS',
      'Nishiharukami',
      '#8B0000',
      '#FFFFFF',
      'oil',
      64,
      'Nishiharukami Sports Complex',
      30132,
    ],
    ['Kitanarisaki Blaze', 'KIT', 'Kitanarisaki', '#B8002D', '#1D2088', 'historic', 64, 'Takano Stadium', 40728],
    ['Sakurata Lumina', 'SAK', 'Sakurata', '#E60012', '#000000', 'giant', 63, 'Sakurata Athletic Stadium', 63700],
    ['Shinmoto Verde', 'SHI', 'Shinmoto', '#50318F', '#FFFFFF', 'youth', 63, 'Saimoto Park', 28520],
    ['Shinsaki Fiore', 'SHF', 'Shinsaki', '#1E90FF', '#000000', 'historic', 62, 'Shinsaki Athletic Stadium', 26827],
    ['Akisaki Rayo', 'AKI', 'Akisaki', '#0033A0', '#FFFFFF', 'historic', 61, 'Takeyama Park', 72327],
    ['FC Matsuhara', 'MAT', 'Matsuhara', '#1A3D8F', '#000000', 'historic', 60, 'Matsuhara Sports Complex', 39694],
    ['Asahama Albatros', 'ASA', 'Asahama', '#002E6E', '#C8A200', 'oil', 60, 'Asahama Sports Complex', 15489],
    ['Higashino City', 'HIG', 'Higashino', '#0033A0', '#E60012', 'fan', 60, 'Higashino Athletic Stadium', 49970],
    ['Nagakami Verde', 'NAG', 'Nagakami', '#FFF000', '#000000', 'selling', 58, 'Nagakami Athletic Stadium', 15109],
    ['Fujimori City', 'FUJ', 'Fujimori', '#D6000F', '#F9A61A', 'fan', 58, 'Inasaki Arena', 44380],
    ['Matsuhara Cometa', 'MAC', 'Matsuhara', '#EC6A9E', '#0A1F5C', 'historic', 58, 'Matsura Stadium', 24481],
    ['Kitaokaura Kingfishers', 'KIK', 'Kitaokaura', '#1C1C7C', '#AAAAAA', 'youth', 56, 'Haruura Arena', 21562],
    ['Hokuno Stella', 'HOK', 'Hokuno', '#6A1B9A', '#FFFFFF', 'fan', 56, 'Kawahara Arena', 21600],
    ['Okaura Sevens', 'OKA', 'Okaura', '#FF6600', '#003DA5', 'youth', 55, 'Narizawa Arena', 42300],
    ['Matsuzawa Stella', 'MAS', 'Matsuzawa', '#8CC63F', '#003DA5', 'youth', 55, 'Matsuzawa Sports Complex', 15380],
    ['Higashino Sport Club', 'HIS', 'Higashino', '#00843D', '#FFFFFF', 'fan', 55, 'Kawamoto Arena', 49970],
    ['Matsaki City', 'MTS', 'Matsaki', '#FF8200', '#003DA5', 'fan', 55, 'Saita Stadium', 19594],
    ['Nagano Aurora', 'NAA', 'Nagano', '#9E1B32', '#FFFFFF', 'fan', 53, 'Nagaura Arena', 15479],
    ['Akisaki Mare', 'AKM', 'Akisaki', '#00A0E9', '#FFFFFF', 'fan', 53, 'Kitashima Park', 15440],
  ];
  // Minimal tier (8 clubs): [name, short, city, primary, secondary, identity, rep]
  FM.D.CLUBS_MX1 = [
    ['Atlético Jilitzin', 'JIL', 'Jilitzin', '#FFE600', '#0A1F5C', 'giant', 70, 'Estadio Olímpico de Jilitzin'],
    ['Real Tulapan', 'TUL', 'Tulapan', '#0B2240', '#FFFFFF', 'oil', 68, 'Estadio Tampicatl'],
    ['Unión Jilehua', 'JIU', 'Jilehua', '#FDB913', '#003DA5', 'oil', 68, 'Estadio Municipal de Jilehua'],
    [
      'Club Deportivo Coatohua',
      'COA',
      'Coatohua',
      '#E30613',
      '#FFFFFF',
      'historic',
      67,
      'Estadio Olímpico de Coatohua',
    ],
    ['Jilitzin FC', 'JIF', 'Jilitzin', '#0033A0', '#FFFFFF', 'historic', 66, 'Estadio Huihua'],
    ['Lobos Yaulco', 'LOB', 'Yaulco', '#E30613', '#FFFFFF', 'fan', 64, 'Estadio Chalachitlán'],
    ['Club Deportivo Jilahua', 'JIC', 'Jilitzin', '#0B2240', '#C5A45A', 'youth', 63, 'Estadio Papanalco'],
    ['Club Deportivo Xalán', 'XAL', 'Xalán', '#FFFFFF', '#0033A0', 'selling', 63, 'Estadio Chalapa'],
    [
      'Club Deportivo Ocotipan',
      'OCO',
      'Ocotipan',
      '#00843D',
      '#FFFFFF',
      'selling',
      62,
      'Estadio Municipal de Ocotipan',
    ],
    ['Venados de Ocotec', 'VEN', 'Ocotec', '#00843D', '#FFFFFF', 'youth', 60, 'Estadio Huilco'],
    ['Club Coatohua', 'CTH', 'Coatohua', '#E30613', '#000000', 'fan', 60, 'Estadio Municipal de Coatohua'],
    ['Real Ocotipa', 'OCR', 'Ocotipa', '#E30613', '#000000', 'fan', 58, 'Estadio Tecatl'],
    ['Pachalco Atlético', 'PAC', 'Pachalco', '#E30613', '#FFFFFF', 'fan', 57, 'Estadio Papanilco'],
    ['Atlético Zapa', 'ZAP', 'Zapa', '#0033A0', '#000000', 'fan', 56, 'Estadio Chaletlán'],
    ['Club Universidad Xalicán', 'UNX', 'Xalicán', '#FFFFFF', '#0033A0', 'fan', 56, 'Estadio Ixtacán'],
    ['Unión Cuautlán', 'CUA', 'Cuautlán', '#00843D', '#E30613', 'fan', 56, 'Estadio Yauco'],
    ['Zorros de Cuerolco', 'ZOC', 'Cuerolco', '#E30613', '#003DA5', 'fan', 56, 'Estadio Tecepa'],
    ['Halcones de Tulec', 'HAL', 'Tulec', '#6A1B9A', '#FFFFFF', 'fan', 55, 'Estadio Olímpico de Tulec'],
  ];
  FM.D.CLUBS_NG1 = [
    ['Badugu United', 'BAU', 'Badugu', '#003DA5', '#FFFFFF', 'giant', 55, 'Badugu Independence Stadium'],
    ['Ua Lions', 'UAL', 'Ua', '#E30613', '#FFFFFF', 'historic', 52, 'Mauna Stadium'],
    ['Awkadan Warriors', 'AWK', 'Awkadan', '#0369A1', '#F59E0B', 'oil', 52, 'Awkadan Township Stadium'],
    ['Akorin Pillars FC', 'AKP', 'Akorin', '#15803D', '#FFFFFF', 'selling', 51, 'Oshano Stadium'],
    ['Abibo Lions', 'ABI', 'Abibo', '#FFD100', '#006400', 'historic', 51, 'Abibo Sports Complex'],
    ['New Adugu Pillars', 'ADU', 'Adugu', '#003DA5', '#FFFFFF', 'fan', 49, 'Adugu Independence Stadium'],
    ['Ikagun Lions', 'IKA', 'Ikagun', '#E30613', '#FFFFFF', 'fan', 48, 'Ikagun Township Stadium'],
    ['Awkyo United', 'AWU', 'Awkyo', '#E30613', '#FFD100', 'youth', 48, 'Ikibo Stadium'],
    ['Shooting Uorin', 'SHU', 'Uorin', '#003DA5', '#FFFFFF', 'historic', 47, 'Uorin Independence Stadium'],
    ['New Adozo City', 'ADN', 'Adozo', '#E30613', '#FFFFFF', 'historic', 47, 'Nsibo Stadium'],
    ['Owri Rangers', 'OWR', 'Owri', '#003DA5', '#FFD100', 'oil', 47, 'Oshri Arena'],
    ['Shooting Ogbgun', 'SHO', 'Ogbgun', '#00843D', '#FFD100', 'fan', 47, 'Akuna Arena'],
    ['Umure Warriors', 'UMU', 'Umure', '#003DA5', '#FFFFFF', 'fan', 47, 'Umure Independence Stadium'],
    ['Upper Ikuko Pillars FC', 'IKU', 'Ikuko', '#00843D', '#FFFFFF', 'fan', 46, 'Ikuko Independence Stadium'],
    ['Shooting Adri', 'SHA', 'Adri', '#FFD100', '#00843D', 'fan', 46, 'Adri Independence Stadium'],
    ['Akyo Rangers', 'AKY', 'Akyo', '#FFD100', '#003DA5', 'fan', 46, 'Umuko Stadium'],
    ['Ilano Stars', 'ILA', 'Ilano', '#003DA5', '#E30613', 'fan', 46, 'Ilano Sports Complex'],
    ['Awkwa Pillars FC', 'AWP', 'Awkwa', '#00843D', '#FFFFFF', 'fan', 46, 'Awkwa Independence Stadium'],
    ['Awka Wolves', 'AWW', 'Awka', '#E30613', '#00843D', 'fan', 45, 'Awka Sports Complex'],
    ['Enede City', 'ENC', 'Enede', '#FFD100', '#003DA5', 'fan', 45, 'Enede Sports Complex'],
  ];
  FM.D.CLUBS_KR1 = [
    ['Gangyang Stars', 'GAN', 'Gangyang', '#003DA5', '#FFD100', 'oil', 60, 'Gangyang Stadium'],
    ['Choyang Electric Tigers', 'CHO', 'Choyang', '#00843D', '#FFD100', 'giant', 60, 'Choyang Stadium'],
    ['Chunseong Athletic', 'CHU', 'Chunseong', '#E30613', '#000000', 'historic', 57, 'Haesan Arena'],
    ['Chunwon Shipbuilders FC', 'CHS', 'Chunwon', '#E30613', '#000000', 'historic', 57, 'Sincheon Arena'],
    ['Seoyang Silk Dragons', 'SEO', 'Seoyang', '#6A1B9A', '#00843D', 'oil', 55, 'Seoyang Civic Stadium'],
    ['Chohwa Tigers', 'CHT', 'Chohwa', '#FFD100', '#E30613', 'youth', 54, 'Chohwa Stadium'],
    ['Choseong Heavy Eagles', 'CHH', 'Choseong', '#FF7F00', '#003DA5', 'fan', 53, 'Seowon Arena'],
    ['Bujeong Garrison', 'BUJ', 'Bujeong', '#4B5320', '#C3B091', 'military', 53, 'Bujeong Barracks Stadium'],
    ['Haejin Heavy Eagles', 'HAE', 'Haejin', '#FF6600', '#000000', 'fan', 52, 'Chungju Arena'],
    ['Gyeongseong FC', 'GYE', 'Gyeongseong', '#87CEEB', '#1C2B4F', 'youth', 52, 'Wolcheon Arena'],
    ['Wolhwa United', 'WOL', 'Wolhwa', '#E30613', '#003DA5', 'fan', 52, 'Chunjeong Arena'],
    ['Gangjeong Silk Dragons', 'GNG', 'Gangjeong', '#5B2C83', '#FFFFFF', 'fan', 51, 'Gangjeong Stadium'],
  ];
  FM.D.CLUBS_TH1 = [
    ['Takchan Athletic', 'TAK', 'Takchan', '#003DA5', '#FFD100', 'oil', 56, 'Nakhonmai Arena'],
    ['Ubonam Port', 'UBO', 'Ubonam', '#0A1E5E', '#FFFFFF', 'oil', 52, 'Phrapur Sports Park'],
    ['Nongkaeo Rapids United', 'NON', 'Nongkaeo', '#E30613', '#FFFFFF', 'historic', 51, 'Khaoyai Arena'],
    ['Nongkaeo Athletic', 'NOA', 'Nongkaeo', '#FF7F00', '#003DA5', 'fan', 50, 'Sakpur Arena'],
    ['Singburi Port', 'SIN', 'Singburi', '#E30613', '#000000', 'historic', 50, 'Maenam Stadium'],
    ['Sakchan United', 'SAU', 'Sakchan', '#003DA5', '#FFFFFF', 'youth', 48, 'Ubonkaeo Arena'],
    ['Ubonsai United', 'UBU', 'Ubonsai', '#0055A4', '#FFFFFF', 'historic', 48, 'Ubonam Stadium'],
    ['Khaonong United', 'KHA', 'Khaonong', '#E30613', '#FFD100', 'youth', 47, 'Khaonong Provincial Stadium'],
    ['Khaoburi Provincial United', 'KHP', 'Khaoburi', '#FF7F00', '#000000', 'fan', 46, 'Chiangmai Sports Park'],
    ['Ubonthong City', 'UBC', 'Ubonthong', '#E30613', '#FFFFFF', 'fan', 46, 'Ubonlek Arena'],
    ['Wangmai United', 'WAN', 'Wangmai', '#FFD100', '#000000', 'fan', 46, 'Wangmai Provincial Stadium'],
    ['Phunam Athletic', 'PHU', 'Phunam', '#003DA5', '#E30613', 'oil', 46, 'Phunong Sports Park'],
    ['Saklek Port', 'SKL', 'Saklek', '#6A1B9A', '#FFFFFF', 'fan', 45, 'Khaoyai Stadium'],
    ['Muang Sakpur United', 'MUA', 'Sakpur', '#E30613', '#FFFFFF', 'fan', 45, 'Wangyai Stadium'],
    ['Takpur FC', 'TKP', 'Takpur', '#003DA5', '#FFFFFF', 'fan', 44, 'Nakhonsai Stadium'],
    ['Muang Ubonburi United', 'MUU', 'Ubonburi', '#FF7F00', '#6A1B9A', 'fan', 44, 'Banlek Arena'],
  ];
  FM.D.CLUBS_RS1 = [
    ['Rapid Jasovac', 'RAP', 'Jasovac', '#E30613', '#FFFFFF', 'giant', 64, 'Stadion Mir Jasovac'],
    ['NK Jasovac', 'NKJ', 'Jasovac', '#000000', '#FFFFFF', 'giant', 61, 'Stadion Bratina'],
    ['Zora Novany', 'ZOR', 'Novany', '#E30613', '#FFFFFF', 'historic', 57, 'Gradski Stadion Novany'],
    ['KS Drain', 'KSD', 'Drain', '#003DA5', '#FFFFFF', 'oil', 56, 'Stadion Mir Drain'],
    ['Mladost Vysany', 'MLA', 'Jasovac', '#000000', '#FFD100', 'youth', 53, 'Stadion Kosovice'],
    ['Dinamo Vysik', 'VYS', 'Vysik', '#E30613', '#FFFFFF', 'fan', 53, 'Stadion Gorina'],
    ['Partizan Mirovac', 'PAR', 'Mirovac', '#E30613', '#FFFFFF', 'fan', 52, 'Drapol Arena'],
    ['NK Kosin', 'NKK', 'Jasovac', '#003DA5', '#FFFFFF', 'historic', 51, 'Stadion Velava'],
    ['Železničar Kamovo', 'ZEK', 'Jasovac', '#1F2937', '#E5E7EB', 'youth', 50, 'Stadion Jasovac'],
    ['Mladost Malovac', 'MLM', 'Malovac', '#003DA5', '#FFFFFF', 'fan', 50, 'Stadion Plesovo'],
    ['NK Belek', 'NKB', 'Belek', '#E30613', '#003DA5', 'fan', 50, 'Stadion Mir Belek'],
    ['Železničar Petina', 'ZEP', 'Petina', '#003DA5', '#FFFFFF', 'fan', 49, 'Stadion Mir Petina'],
    ['Železničar Zelpol', 'ZEZ', 'Zelpol', '#E30613', '#FFFFFF', 'fan', 49, 'Stadion Mir Zelpol'],
    ['Radnički Malec', 'RAM', 'Malec', '#E30613', '#FFFFFF', 'fan', 48, 'Stadion Kosovac'],
    ['MFK Ostany', 'MFK', 'Ostany', '#003DA5', '#FFFFFF', 'fan', 46, 'Stadion Slaany'],
    ['AO Vysovice', 'AOV', 'Vysovice', '#00843D', '#FFFFFF', 'fan', 46, 'Gradski Stadion Vysovice'],
  ];
  FM.D.CLUBS_MA1 = [
    ['Union Sportive Oujali', 'SPT', 'Oujali', '#E30613', '#FFFFFF', 'giant', 59, 'Stade Sidoun'],
    ['Najah Oujali', 'NAJ', 'Oujali', '#00843D', '#FFFFFF', 'giant', 59, 'Stade Ifrek'],
    ['US Nadar', 'USN', 'Nadar', '#E30613', '#000000', 'historic', 57, 'Stade Municipal de Nadar'],
    ['Sporting Safira', 'SAF', 'Safira', '#FF7F00', '#000000', 'oil', 56, 'Stade Nadek'],
    ['Najah Nadar', 'NAN', 'Nadar', '#003DA5', '#FFFFFF', 'youth', 54, 'Complexe Sportif Nadar'],
    ['Union Sidoun', 'SID', 'Sidoun', '#FFD100', '#000000', 'historic', 52, 'Stade Tanouan'],
    ['SC Sidi Benet', 'SIB', 'Sidi Benet', '#E30613', '#FFD100', 'fan', 50, 'Grand Stade de Sidi Benet'],
    ['SC Tazad', 'TAZ', 'Tazad', '#003DA5', '#FFFFFF', 'youth', 50, 'Stade Berira'],
    ['Najah Midouan', 'NAM', 'Midouan', '#E30613', '#FFFFFF', 'historic', 49, 'Complexe Sportif Midouan'],
    [
      'Union Sportive Oued Safia',
      'SPI',
      'Oued Safia',
      '#003DA5',
      '#FFFFFF',
      'fan',
      48,
      'Stade Municipal de Oued Safia',
    ],
    ['Racing Sidi Oujira', 'SIO', 'Oujira', '#00843D', '#FFFFFF', 'fan', 48, 'Stade Tetat'],
    ['Sporting Nedouan', 'NED', 'Nedouan', '#00843D', '#FFFFFF', 'fan', 47, 'Grand Stade de Nedouan'],
    ['Chabab Tazine', 'CHB', 'Nadar', '#FF7F00', '#000000', 'fan', 47, 'Stade Azrouan'],
    ['Nahda Ain Ouloun', 'NAH', 'Ain Ouloun', '#E30613', '#00843D', 'fan', 47, 'Stade Oulia'],
    [
      'US Oujali-el-Kebir',
      'USO',
      'Oujali-el-Kebir',
      '#E30613',
      '#000000',
      'fan',
      46,
      'Stade Municipal de Oujali-el-Kebir',
    ],
    ['US Ain Midouan', 'USA', 'Ain Midouan', '#003DA5', '#FFFFFF', 'fan', 46, 'Grand Stade de Ain Midouan'],
  ];

  // ---------- More minimal leagues: the next European leagues by UEFA coefficient ----------
  FM.D.CLUBS_BE1 = [
    ['Koninklijke Tilkerk', 'KON', 'Tilkerk', '#0E4DA4', '#000000', 'giant', 68, 'Stade Communal de Tilkerk'],
    ['Standard Sneekvoort', 'STS', 'Sneekvoort', '#FFDD00', '#0033A0', 'selling', 64, 'Stade Laagburg'],
    ['KFC Sneekvoort', 'KFC', 'Sneekvoort', '#4B2C85', '#FFFFFF', 'giant', 65, 'Stade Communal de Sneekvoort'],
    ['Royal Wagedam', 'WAG', 'Wagedam', '#003DA5', '#FFFFFF', 'youth', 63, 'Oostbrug Stadion'],
    ['KV Zwolhout', 'KVZ', 'Zwolhout', '#003DA5', '#FFFFFF', 'historic', 61, 'Stedelijk Stadion Zwolhout'],
    ['Union Grootlo', 'GRO', 'Grootlo', '#E30613', '#FFFFFF', 'oil', 61, 'Stade Communal de Grootlo'],
    ['KRC Dijkhout', 'KRC', 'Dijkhout', '#E30613', '#FFFFFF', 'fallen', 59, 'Stade Veenhoven'],
    ['KV Tilkerk', 'KVT', 'Tilkerk', '#00843D', '#000000', 'youth', 56, 'Stedelijk Stadion Tilkerk'],
    ['KV Noordwijk', 'KVN', 'Noordwijk', '#FFDD00', '#E30613', 'fan', 56, 'Oostrade Stadion'],
    ['Royal Union Bergwaard', 'BEG', 'Bergwaard', '#FFDD00', '#003DA5', 'oil', 55, 'Stedelijk Stadion Bergwaard'],
    ['FC Nieuwijk', 'NIF', 'Nieuwijk', '#000000', '#FFFFFF', 'fan', 55, 'Stade Wagedijk'],
    ['SK Oudlo', 'OUD', 'Oudlo', '#FFFFFF', '#00843D', 'fan', 54, 'Stade Veenhorst'],
    ['FC Kleinkerk', 'KLN', 'Kleinkerk', '#FFDD00', '#003DA5', 'selling', 53, 'Oudveen Stadion'],
    ['FC Oosthorst', 'OOS', 'Oosthorst', '#E30613', '#FFFFFF', 'fan', 51, 'Kleinbeek Stadion'],
    ['RSC Tilzand', 'RSC', 'Tilzand', '#E30613', '#00843D', 'fan', 51, 'Stade Communal de Tilzand'],
    ['KV Zuidwaard', 'KZX', 'Zuidwaard', '#00843D', '#FFFFFF', 'fan', 50, 'Haarvoort Stadion'],
  ];
  FM.D.CLUBS_TR1 = [
    ['Demehir Birlik', 'DEM', 'Demehir', '#A90432', '#FDB912', 'giant', 72, 'Kızova Stadyumu'],
    ['Demehir Gençlik', 'DEG', 'Demehir', '#FFED00', '#004A9F', 'giant', 71, 'Gülbahçe Stadyumu'],
    ['Yenehir Gençlik', 'YEN', 'Demehir', '#000000', '#FFFFFF', 'giant', 67, 'Demehir Şehir Stadyumu'],
    ['Aydbahçe Atletik', 'AYD', 'Aydbahçe', '#7A1E3A', '#6CABDD', 'historic', 63, 'Demköy Stadyumu'],
    ['Aköy Birlik', 'AKO', 'Demehir', '#F47920', '#0B1F4B', 'oil', 60, 'Demdere Stadyumu'],
    ['Dembahçespor', 'DMB', 'Dembahçe', '#E30613', '#FFFFFF', 'fan', 57, 'Dembahçe Şehir Stadyumu'],
    ['Karpınar Belediyespor', 'KAR', 'Karpınar', '#FFDD00', '#E30613', 'fan', 56, 'Karpınar Şehir Stadyumu'],
    ['Gülsaray Gençlik', 'GUL', 'Demehir', '#6A1B9A', '#FFDD00', 'oil', 55, 'Demehir Cumhuriyet Stadyumu'],
    ['Kaybahçespor', 'KAY', 'Demehir', '#003DA5', '#FFFFFF', 'fan', 54, 'Tavsaray Arena'],
    ['Çansarayspor', 'CNS', 'Çansaray', '#00843D', '#003DA5', 'fan', 54, 'Çansaray Cumhuriyet Stadyumu'],
    ['Uşehir Belediyespor', 'USE', 'Uşehir', '#00843D', '#FFFFFF', 'fan', 54, 'Uşehir Cumhuriyet Stadyumu'],
    ['Bozlar SK', 'BOZ', 'Bozlar', '#E30613', '#FFFFFF', 'fan', 53, 'Bozlar Şehir Stadyumu'],
    ['Bozsaray Gücü', 'BOG', 'Bozsaray', '#F47920', '#00843D', 'fan', 53, 'Merkale Stadyumu'],
    ['Tekbahçe Birlik', 'TEK', 'Tekbahçe', '#E30613', '#000000', 'fan', 53, 'Karova Stadyumu'],
    ['Çanlar Belediyespor', 'CAB', 'Çanlar', '#FFDD00', '#E30613', 'fan', 52, 'Çanlar Cumhuriyet Stadyumu'],
    ['Bozova Birlik', 'BOB', 'Bozova', '#00843D', '#000000', 'fan', 52, 'Bozova Şehir Stadyumu'],
    ['Gülar SK', 'GLR', 'Gülar', '#E30613', '#000000', 'youth', 51, 'Orhköy Arena'],
    ['Orhbahçe SK', 'ORH', 'Demehir', '#E30613', '#000000', 'fan', 51, 'Akpınar Arena'],
  ];
  FM.D.CLUBS_CZ1 = [
    ['SK Holava', 'HOL', 'Holava', '#E30613', '#FFFFFF', 'giant', 64, 'Letní stadion Holava'],
    ['TJ Holava', 'TJH', 'Holava', '#8A1538', '#FFFFFF', 'giant', 63, 'Městský stadion Holava'],
    ['FK Nymany', 'NYM', 'Nymany', '#E30613', '#003DA5', 'historic', 61, 'Aréna Nymov'],
    ['Železárny Nymoná', 'ZEL', 'Nymoná', '#6CABDD', '#FFFFFF', 'fan', 56, 'Aréna Kostany'],
    ['Slavoj Hradoná', 'SLA', 'Hradoná', '#003DA5', '#FFFFFF', 'youth', 53, 'Městský stadion Hradoná'],
    ['Sokol Olomava', 'SOK', 'Olomava', '#FFFFFF', '#003DA5', 'youth', 53, 'Městský stadion Olomava'],
    ['FK Branany', 'BRN', 'Branany', '#000000', '#FFDD00', 'fan', 51, 'Městský stadion Branany'],
    ['FC Rychodov', 'RYC', 'Rychodov', '#003DA5', '#FFFFFF', 'selling', 51, 'Letní stadion Rychodov'],
    ['Sokol Strice', 'SOS', 'Holava', '#00843D', '#FFFFFF', 'fan', 50, 'Stadion u Trenec'],
    ['SK Zlínava', 'ZLI', 'Zlínava', '#00843D', '#000000', 'fan', 50, 'Městský stadion Zlínava'],
    ['1. FC Vsetínice', 'VSE', 'Vsetínice', '#FFDD00', '#003DA5', 'fan', 49, 'Aréna Pardov'],
    ['Sparta Vsetínany', 'SPA', 'Vsetínany', '#E30613', '#FFFFFF', 'fan', 48, 'Letní stadion Vsetínany'],
    ['Dukla Nový Hradená', 'DUK', 'Nový Hradená', '#00843D', '#FFFFFF', 'fan', 48, 'Městský stadion Nový Hradená'],
    ['1. FC Trenodov', 'TRF', 'Trenodov', '#003DA5', '#FFFFFF', 'fan', 48, 'Aréna Hradec'],
    ['1. FC Holodov', 'HLD', 'Holava', '#FFDD00', '#8A1538', 'historic', 47, 'Stadion Zlínedov'],
    ['FK Starý Hradov', 'STY', 'Starý Hradov', '#FFDD00', '#000000', 'fan', 47, 'Stadion u Kostov'],
  ];
  FM.D.CLUBS_GR1 = [
    ['GS Marópetra', 'GSM', 'Marópetra', '#E30613', '#FFFFFF', 'giant', 68, 'Stadio Trouli'],
    ['Pelos FC', 'PEL', 'Pelos', '#00843D', '#FFFFFF', 'giant', 64, 'Dimotiko Stadio Pelos'],
    ['Doxa Pelos', 'DOX', 'Pelos', '#FFDD00', '#000000', 'giant', 64, 'Ioanaki Arena'],
    ['Niki Agouli', 'NIK', 'Agouli', '#000000', '#FFFFFF', 'historic', 65, 'Serouli Arena'],
    ['AE Agouli', 'AEA', 'Agouli', '#FFDD00', '#000000', 'fan', 57, 'Dimotiko Stadio Agouli'],
    ['AO Kato Kypás', 'AOK', 'Kato Kypás', '#000000', '#FFFFFF', 'fan', 53, 'Pelos Arena'],
    ['AE Lamaki', 'AEL', 'Lamaki', '#003DA5', '#FFFFFF', 'fan', 52, 'Stadio Ioanás'],
    ['AE Ioanida', 'AEI', 'Ioanida', '#FFDD00', '#003DA5', 'fan', 51, 'Dimotiko Stadio Ioanida'],
    ['Tránia FC', 'TRA', 'Tránia', '#FFDD00', '#003DA5', 'fan', 50, 'Stadio Alexaki'],
    ['AE Thesos', 'AET', 'Thesos', '#E30613', '#003DA5', 'fan', 50, 'Nikia Arena'],
    ['Argouli FC', 'ARG', 'Argouli', '#00843D', '#FFFFFF', 'fan', 49, 'Stadio Kypaki'],
    ['Panathlitikos Ioanaki', 'PAN', 'Ioanaki', '#003DA5', '#FFFFFF', 'fan', 49, 'Stadio Kypina'],
    ['AO Chalida', 'AOC', 'Chalida', '#8A1538', '#FFFFFF', 'historic', 48, 'Dimotiko Stadio Chalida'],
    ['Apollon Kypópoli', 'APO', 'Kypópoli', '#E30613', '#FFFFFF', 'fan', 48, 'Dimotiko Stadio Kypópoli'],
  ];
  FM.D.CLUBS_NO1 = [
    ['Dyrvik IF', 'DYR', 'Dyrvik', '#FFDD00', '#000000', 'youth', 63, 'Dyrvik Idrætsanlæg'],
    ['Dyrlund IF', 'DYI', 'Dyrlund', '#E30613', '#FFFFFF', 'fan', 58, 'Holholm Stadion'],
    ['FC Broløkke', 'BRK', 'Broløkke', '#003DA5', '#FFFFFF', 'historic', 57, 'Broløkke Idrætsanlæg'],
    ['Holvang FK', 'HLV', 'Holvang', '#FFFFFF', '#000000', 'giant', 58, 'Holby Stadion'],
    ['IK Bergø', 'IKB', 'Bergø', '#003DA5', '#FFFFFF', 'historic', 58, 'Bergø Idrætsanlæg'],
    ['Kilund FK', 'KIL', 'Kilund', '#003DA5', '#FFFFFF', 'fan', 51, 'Dyrnæs Stadion'],
    ['FC Langby', 'LNG', 'Langby', '#FFFFFF', '#E30613', 'historic', 51, 'Langby Arena'],
    ['FC Havdal', 'HAV', 'Havdal', '#E30613', '#FFFFFF', 'fan', 51, 'Sydlund Stadion'],
    ['Strandlund BK', 'STN', 'Strandlund', '#003DA5', '#FFFFFF', 'fan', 49, 'Strandlund Arena'],
    ['Fremad Sønderfors', 'FRM', 'Sønderfors', '#003DA5', '#FFFFFF', 'fan', 49, 'Sønderfors Arena'],
    ['FC Fjordø', 'FJO', 'Fjordø', '#00843D', '#FFFFFF', 'fan', 48, 'Solgård Idrætspark'],
    ['Fremad Nordnyø', 'FRD', 'Nordnyø', '#003DA5', '#FFFFFF', 'fan', 48, 'Nordnyø Arena'],
    ['BK Sønderfors', 'SNX', 'Sønderfors', '#003DA5', '#E30613', 'historic', 52, 'Ringård Idrætspark'],
    ['Ringby FK', 'RIN', 'Ringby', '#E30613', '#FFFFFF', 'fan', 46, 'Ringby Arena'],
    ['Fremad Nesløkke', 'FRN', 'Nesløkke', '#003DA5', '#FFFFFF', 'fan', 48, 'Dyrø Stadion'],
    ['Gammelgård FK', 'GAM', 'Gammelgård', '#003DA5', '#FFFFFF', 'fan', 47, 'Hedfors Stadion'],
  ];
  FM.D.CLUBS_PL1 = [
    ['KS Jarosice', 'KSJ', 'Jarosice', '#003DA5', '#FFFFFF', 'giant', 60, 'Stadion Kostów'],
    ['Radeno FC', 'RAD', 'Radeno', '#E30613', '#003DA5', 'oil', 59, 'Arena Rybnówka'],
    ['KS Stary Kalice', 'KSS', 'Stary Kalice', '#FFDD00', '#E30613', 'fan', 58, 'Stadion Miejski im. Radosk'],
    ['Unia Wielki Siedlec', 'UNW', 'Wielki Siedlec', '#FFFFFF', '#00843D', 'giant', 60, 'Stadion Siedlec'],
    ['GKS Słupice', 'GKS', 'Słupice', '#003DA5', '#8A1538', 'fan', 55, 'Stadion im. Słupono'],
    ['KS Radeka', 'KSR', 'Radeka', '#FFFFFF', '#003DA5', 'historic', 54, 'Stadion im. Siedlów'],
    ['Budowlani Słupówka', 'BUD', 'Słupówka', '#E30613', '#FFFFFF', 'fan', 53, 'Stadion Ludowy Słupówka'],
    ['LKS Rybnów', 'LKS', 'Rybnów', '#E30613', '#FFFFFF', 'oil', 53, 'Stadion Kostin'],
    ['Stary Białec Sokół', 'STB', 'Stary Białec', '#FFDD00', '#00843D', 'fan', 51, 'Stadion Ludowy Stary Białec'],
    ['Ruch Luba', 'RUC', 'Luba', '#F47920', '#00843D', 'youth', 52, 'Stadion Miejski im. Brzezewo'],
    ['Zagłębie Opolice', 'ZAG', 'Opolice', '#003DA5', '#E30613', 'fan', 52, 'Arena Wielów'],
    ['Dąbroka FC', 'DAB', 'Dąbroka', '#FFDD00', '#003DA5', 'fan', 50, 'Stadion Miejski im. Radec'],
    ['Włókniarz Kalono', 'WOX', 'Kalono', '#FFDD00', '#E30613', 'fan', 50, 'Stadion im. Rybno'],
    ['Dolny Płocin Sokół', 'DOL', 'Dolny Płocin', '#00843D', '#FFFFFF', 'fan', 50, 'Stadion Chełmewo'],
    ['Zagłębie Dolny Włin', 'ZAE', 'Dolny Włin', '#00843D', '#FFFFFF', 'fallen', 50, 'Stadion Miejski im. Chełmesk'],
    ['KS Nowin', 'KSN', 'Nowin', '#FFDD00', '#003DA5', 'fan', 48, 'Stadion Jarosewo'],
    ['GKS Brzezeka', 'GKB', 'Brzezeka', '#003DA5', '#FFFFFF', 'fan', 49, 'Stadion Słupowice'],
    ['Gwardia Górny Kalosk', 'GWA', 'Górny Kalosk', '#F47920', '#000000', 'fan', 47, 'Stadion im. Kosta'],
  ];
  FM.D.CLUBS_DK1 = [
    ['Bjørnstrup IF', 'BJR', 'Bjørnstrup', '#FFFFFF', '#003DA5', 'giant', 64, 'Brovik Stadion'],
    ['Brosund BK', 'BRO', 'Brosund', '#000000', '#E30613', 'selling', 62, 'Gammeldal Idrætspark'],
    ['Strandsund FK', 'STF', 'Strandsund', '#FFDD00', '#003DA5', 'historic', 58, 'Nordsund Park'],
    ['Vestnæs Fotball', 'VES', 'Vestnæs', '#FFFFFF', '#003DA5', 'fan', 56, 'Dyrløkke Park'],
    ['Fremad Storborg', 'FRE', 'Storborg', '#E30613', '#FFFFFF', 'youth', 56, 'Østborg Stadion'],
    ['Holø Fotball', 'HFX', 'Holø', '#003DA5', '#FFFFFF', 'fan', 52, 'Østgård Idrætspark'],
    ['Nordfjordvang Fotball', 'NOR', 'Nordfjordvang', '#E30613', '#FFFFFF', 'youth', 52, 'Bergvang Stadion'],
    ['Nordsund IL', 'NOI', 'Nordsund', '#00843D', '#FFFFFF', 'fan', 51, 'Dalgård Stadion'],
    ['IK Sydstad', 'IKS', 'Sydstad', '#003DA5', '#FFFFFF', 'fallen', 51, 'Sydstad Arena'],
    ['FC Marløkke', 'MAK', 'Marløkke', '#003DA5', '#FFFFFF', 'fan', 49, 'Vestnæs Stadion'],
    ['Nordstad IF', 'NRD', 'Nordstad', '#E30613', '#FFFFFF', 'fan', 49, 'Storgård Park'],
    ['Asklund FK', 'ASK', 'Asklund', '#E30613', '#FFFFFF', 'fan', 48, 'Fjordvang Stadion'],
  ];
  FM.D.CLUBS_AT1 = [
    ['TSV Goldburg', 'GOL', 'Goldburg', '#FFFFFF', '#E30613', 'oil', 64, 'Rheinhorst-Stadion'],
    ['SV Oberweiler', 'OBE', 'Oberweiler', '#000000', '#FFFFFF', 'historic', 61, 'Oberweiler-Arena'],
    ['Schwarz-Weiß Brantal', 'SCH', 'Brantal', '#00843D', '#FFFFFF', 'giant', 58, 'Sportpark Schwarzbrück'],
    ['Concordia Brantal', 'COB', 'Brantal', '#6A1B9A', '#FFFFFF', 'historic', 56, 'Stadion Zellstadt'],
    ['Hansa Freistadt', 'HAN', 'Freistadt', '#000000', '#FFFFFF', 'fan', 56, 'Freistadt-Arena'],
    ['VfL Bachafen', 'BAC', 'Bachafen', '#000000', '#F47920', 'fan', 51, 'Bachafen-Arena'],
    ['Rheindorf 1899', 'RHE', 'Rheindorf', '#003DA5', '#FFFFFF', 'fan', 49, 'Rheindorf-Arena'],
    ['Germania Freistadt 1930', 'GEF', 'Freistadt', '#003DA5', '#FFFFFF', 'fan', 49, 'Steinsee-Stadion'],
    ['Ober Mühltal 04', 'OBM', 'Ober Mühltal', '#00843D', '#FFFFFF', 'fan', 48, 'Stadion Hagsee'],
    ['Viktoria Rheinhafen 1934', 'VKT', 'Rheinhafen', '#000000', '#FFDD00', 'fan', 48, 'Sportpark Furtkirchen'],
    ['Germania Neu Oberweiler', 'GEN', 'Oberweiler', '#E30613', '#FFFFFF', 'fallen', 47, 'Sportpark Neckarwald'],
    ['FSV Kaltal 1893', 'FSK', 'Kaltal', '#000000', '#00843D', 'fan', 47, 'Schwarzheim-Stadion'],
  ];
  FM.D.CLUBS_CH1 = [
    ['FC Holzberg', 'HOF', 'Holzberg', '#E30613', '#003DA5', 'giant', 62, 'Waldstadion Holzberg'],
    ['Borussia Bachburg', 'BOR', 'Bachburg', '#FFDD00', '#000000', 'giant', 62, 'Neckarbrück-Stadion'],
    ['Energie Kirchweiler', 'ENE', 'Kirchweiler', '#8A1538', '#FFFFFF', 'historic', 56, 'Stadion am Hainhausen'],
    ['Rot-Weiss Eichfurt', 'ROT', 'Eichfurt', '#000000', '#FFFFFF', 'oil', 56, 'Stadion Bachtal'],
    ['FSV Niederstadt', 'FSN', 'Niederstadt', '#003DA5', '#FFFFFF', 'youth', 53, 'Goldberg-Stadion'],
    ['Rot-Weiß Holzfurt', 'ROW', 'Holzfurt', '#00843D', '#FFFFFF', 'fan', 53, 'Stadion am Bachof'],
    [
      'Fortuna Hohen Waldheim',
      'FOT',
      'Hohen Waldheim',
      '#FFFFFF',
      '#003DA5',
      'historic',
      54,
      'Waldstadion Hohen Waldheim',
    ],
    ['VfB Hohen Waldheim', 'HOH', 'Hohen Waldheim', '#003DA5', '#FFFFFF', 'fallen', 51, 'Stadion Altal'],
    ['SV Holzbach', 'HOS', 'Holzbach', '#003DA5', '#FFFFFF', 'oil', 52, 'Stadion Hagburg'],
    ['Teutonia Ober Kirchberg', 'TEO', 'Ober Kirchberg', '#FFFFFF', '#E30613', 'fan', 51, 'Stadion Oberdorf'],
    ['Berghafen 04', 'BEH', 'Berghafen', '#E30613', '#FFFFFF', 'fan', 49, 'Sportpark Bruchkirchen'],
    ['Teutonia Bruchstadt 1953', 'TEB', 'Bruchstadt', '#E30613', '#FFFFFF', 'fan', 49, 'Waldstadion Bruchstadt'],
  ];
  FM.D.CLUBS_SC1 = [
    ['Strathshiels United', 'STR', 'Strathshiels', '#00843D', '#FFFFFF', 'giant', 70, 'Rosock Park'],
    ['Strathshiels Athletic', 'STA', 'Strathshiels', '#1B458F', '#FFFFFF', 'giant', 68, 'Lindee Green'],
    ['Upper Moffock Vale', 'MOU', 'Upper Moffock', '#8A1538', '#FFFFFF', 'historic', 56, 'Stranwick Green'],
    ['Langock Academical', 'LAA', 'Langock', '#E30613', '#FFFFFF', 'historic', 56, 'Langock Muir'],
    ['Inter Upper Moffock', 'MOI', 'Upper Moffock', '#00843D', '#FFFFFF', 'historic', 55, 'Nairnkirk Road'],
    ['Inter Balness', 'BAL', 'Balness', '#FFB81C', '#8A1538', 'fan', 50, 'Balness Park'],
    ['Mid Kilness Town', 'MID', 'Mid Kilness', '#F47920', '#000000', 'fan', 51, 'Mid Kilness Gardens'],
    ['Kirkie Burgh', 'KIB', 'Kirkie', '#003DA5', '#FFFFFF', 'fan', 50, 'Roside Park'],
    ['Jedland Town', 'JED', 'Jedland', '#000000', '#FFFFFF', 'fan', 50, 'Hawrie Park'],
    ['Mid Kilness Burgh', 'MIK', 'Mid Kilness', '#0B1F4B', '#FFFFFF', 'fan', 49, 'Fraserbridge Park'],
    ['Tayloch Thistle', 'TAY', 'Tayloch', '#FFDD00', '#000000', 'fan', 47, 'Jedee Brae'],
    ['Inter Kilrie-on-Forth', 'KIO', 'Kilrie-on-Forth', '#0B1F4B', '#FFFFFF', 'fan', 47, 'Kilrie-on-Forth Park'],
  ];

  FM.D.CLUBS_AU1 = [
    ['Wodoville Roar', 'WOD', 'Wodoville', '#6CABDD', '#FFFFFF', 'oil', 57, 'Cesswa Field'],
    ['Geralnup Jets', 'GEJ', 'Geralnup', '#6CACE4', '#0B1F4B', 'giant', 57, 'Geralnup Stadium'],
    ['Wodoville FC', 'WOF', 'Wodoville', '#0B1F4B', '#FFFFFF', 'giant', 55, 'Wodoville Stadium'],
    ['Geralnup Victory', 'GEV', 'Geralnup', '#E30613', '#000000', 'fan', 53, 'Narcannon Park'],
    ['Mount Bundawa Wanderers', 'MOB', 'Mount Bundawa', '#FFDD00', '#0B1F4B', 'youth', 52, 'Gymby Field'],
    [
      'Mount Bundaooka Jets',
      'MOT',
      'Mount Bundaooka',
      '#F47920',
      '#000000',
      'historic',
      51,
      'Mount Bundaooka Sportsground',
    ],
    ['Cofflea Rovers', 'CFF', 'Cofflea', '#0B1F4B', '#00A3E0', 'oil', 51, 'Cofflea Stadium'],
    ['Nowlea Rovers', 'NOW', 'Nowlea', '#E30613', '#FFFFFF', 'fan', 50, 'Nowlea Sportsground'],
    ['West Tamford Strikers', 'TAM', 'Tamford', '#FFDD00', '#000000', 'fan', 49, 'Narby Reserve'],
    ['Sporting Balnup', 'BAS', 'Balnup', '#000000', '#FFFFFF', 'selling', 48, 'Balnup Oval'],
    ['Portcannon Athletic', 'PRT', 'Portcannon', '#003DA5', '#E30613', 'fan', 48, 'Wagbin Field'],
    ['Cobnup Mariners', 'COM', 'Cobnup', '#6A1B9A', '#FFFFFF', 'fallen', 47, 'Geralcannon Park'],
  ];
  FM.D.CLUBS_HU1 = [
    ['Barahegy AC', 'BAR', 'Barahegy', '#00843D', '#FFFFFF', 'giant', 62, 'Barahegy Sportpálya'],
    ['Győrehegy SE', 'GYO', 'Győrehegy', '#00843D', '#FFFFFF', 'selling', 53, 'Győrehegy Városi Stadion'],
    ['Dunetelek FC', 'DUN', 'Dunetelek', '#00843D', '#FFFFFF', 'historic', 52, 'Dunetelek Sportpálya'],
    ['Zalalak Futball Club', 'ZAL', 'Zalalak', '#E30613', '#FFFFFF', 'historic', 53, 'Orseváros Stadion'],
    ['Sáratelek FC', 'SRT', 'Sáratelek', '#003DA5', '#FFFFFF', 'youth', 53, 'Sáró Aréna'],
    ['Győraháza AC', 'GYA', 'Győraháza', '#003DA5', '#FFFFFF', 'fan', 51, 'Győraháza Sportpálya'],
    ['Barahegy VSC', 'BAV', 'Barahegy', '#6A1B9A', '#FFFFFF', 'historic', 52, 'Nagylak Stadion'],
    ['Orseváros FC', 'ORS', 'Orseváros', '#E30613', '#FFFFFF', 'fan', 49, 'Veszafalva Stadion'],
    ['Kálád AC', 'KAL', 'Kálád', '#E30613', '#003DA5', 'fan', 48, 'Kálád Városi Stadion'],
    ['FC Zalaháza', 'ZAF', 'Barahegy', '#003DA5', '#FFFFFF', 'historic', 49, 'Fehérehegy Aréna'],
    ['Nagyorsény Atlétikai Klub', 'NGY', 'Nagyorsény', '#E30613', '#FFFFFF', 'fan', 46, 'Zalavár Stadion'],
    ['Orsavár SC', 'ORR', 'Orsavár', '#E30613', '#FFFFFF', 'fan', 46, 'Bakert Aréna'],
  ];
  FM.D.CLUBS_IE1 = [
    ['Lisbridge United', 'LIS', 'Lisbridge', '#E30613', '#FFFFFF', 'historic', 51, 'Glentown Road'],
    ['Lisbridge Wanderers', 'LIW', 'Lisbridge', '#00843D', '#FFFFFF', 'giant', 51, 'Glengarvan Road'],
    ['Inter Oranglass', 'ORA', 'Oranglass', '#E30613', '#FFFFFF', 'fan', 48, 'Monlough Park'],
    ['Corard United', 'COU', 'Lisbridge', '#E30613', '#000000', 'fan', 47, 'Lisbridge Park'],
    ['Newree Gaels', 'NEW', 'Lisbridge', '#E30613', '#FFFFFF', 'fan', 47, 'Rosglass Street'],
    ['Port Carrickree Gaels', 'POC', 'Port Carrickree', '#003DA5', '#FFFFFF', 'fan', 44, 'Limdara Road'],
    ['Athgarvan Bohs', 'ATH', 'Athgarvan', '#8A1538', '#FFFFFF', 'fan', 43, 'Athgarvan Lawn'],
    ['Sligtown Celtic', 'SLI', 'Sligtown', '#E30613', '#FFFFFF', 'fan', 43, 'Sligtown Showgrounds'],
    ['Newlough Wanderers', 'NWL', 'Newlough', '#003DA5', '#FFFFFF', 'fan', 42, 'Newlough Lawn'],
    ['Castle Kilough Bohs', 'CAK', 'Castle Kilough', '#FFFFFF', '#000000', 'fallen', 44, 'Castle Kilough Park'],
  ];
  FM.D.CLUBS_WA1 = [
    ['Talbach Cymru', 'TAL', 'Talbach', '#00843D', '#FFFFFF', 'oil', 49, 'Stadiwm Talbach'],
    ['Llangnant Athletic', 'LLA', 'Llangnant', '#FFFFFF', '#000000', 'fan', 42, 'Llangnant Park'],
    ['Lower Dolgwyn Cymru', 'DOC', 'Dolgwyn', '#FFFFFF', '#003DA5', 'fan', 41, 'Dolgfa Field'],
    ['Lower Clyngwyn Rovers', 'CLY', 'Clyngwyn', '#E30613', '#FFFFFF', 'fan', 41, 'Parc Dolgydd'],
    ['Lower Aberach Town', 'ABE', 'Aberach', '#003DA5', '#FFFFFF', 'fan', 40, 'Maes Rhosogg'],
    ['Caerwyn Hotspur', 'CAH', 'Caerwyn', '#FFDD00', '#000000', 'fan', 40, 'Maes Corsfa'],
    ['Balanant Rovers', 'BLN', 'Balanant', '#FFDD00', '#000000', 'youth', 40, 'Parc Llangwyn'],
    ['Balawyn Athletic', 'BLW', 'Balawyn', '#E30613', '#FFFFFF', 'fan', 38, 'Maes Llanwyn'],
    ['Pen Ogmant United', 'PEN', 'Ogmant', '#E30613', '#FFFFFF', 'fan', 38, 'Porthach Field'],
    ['Tenbach Welfare', 'TEN', 'Tenbach', '#E30613', '#FFFFFF', 'fan', 38, 'Rhayfa Road'],
    ['Bangorni Rovers', 'BNG', 'Bangorni', '#FFDD00', '#003DA5', 'fan', 38, 'Bangorni Park'],
    ['Bangorddu Hotspur', 'BAH', 'Bangorddu', '#FFFFFF', '#E30613', 'fan', 37, 'Fishwyn Field'],
  ];

  // Real-life abbreviations (as on the league's broadcasts) and nicknames, by the club's code (the part of its id
  // after c_). An empty abbreviation keeps the code; no nickname means there is no widely used one.
  FM.D.CLUBS_SA1 = [
    ['Al Janub', 'JAN', 'Ain Jubis', '#0057B8', '#FFFFFF', 'oil', 72, 'Ain Jubis Club Stadium', 60000],
    ['Al Sahil', 'SAH', 'Ain Jubis', '#FFD100', '#00247D', 'oil', 71, 'Dirum Arena', 25000],
    ['Al Yasmin', 'YAS', 'Yanik', '#FFD100', '#000000', 'oil', 69, 'Damis Arena', 62000],
    ['Al Sarh', 'SAR', 'Yanik', '#006C35', '#FFFFFF', 'oil', 67, 'Yanik Club Stadium', 27000],
    ['Al Fursan', 'FUR', 'Rasma', '#FFD100', '#CE1126', 'oil', 62, 'King Najaydah Sports City', 20000],
    ['Al Wafaa', 'WAF', 'Ain Jubis', '#FFFFFF', '#CE1126', 'historic', 60, 'Ain Jubis Sports City', 20000],
    ['Al Haqiqa', 'HAQ', 'Shamaah', '#006C35', '#FFFFFF', 'oil', 59, 'King Dirayma Sports City', 35000],
    ['Al Ufuq', 'UFU', 'Jubabah', '#00B2A9', '#FFFFFF', 'oil', 58, 'Prince Tabma Stadium', 20000],
    ['Al Rayyan', 'RAY', 'Ulat', '#CE1126', '#FFFFFF', 'oil', 56, 'Zulis Stadium', 15000],
    ['Al Ibda', 'IBD', 'Ain Tabuf', '#00A9E0', '#FFFFFF', 'fan', 56, 'Jubik Stadium', 20000],
    ['Al Saqr', 'SAQ', 'Khamaah', '#8A1538', '#FFFFFF', 'oil', 55, 'Haalif Stadium', 20000],
    ['Al Sanabil', 'SAA', 'Shaydah', '#FFD100', '#CE1126', 'fan', 55, 'Dira Stadium', 25000],
    ['Al Taqaddum', 'TAQ', 'Ain Jubis', '#0057B8', '#FFD100', 'oil', 54, 'Tura Stadium', 22000],
    ['Al Hadaf', 'HAD', 'Wadi Bahabah', '#CE1126', '#FFD100', 'youth', 53, 'Hofayma Arena', 15000],
    ['Al Aseel', 'ASL', 'Ras Ulamaah', '#CE1126', '#FFFFFF', 'fan', 52, 'Haira Stadium', 18000],
    ['Al Dhib', 'DHI', 'Shaydah', '#CE1126', '#FFFFFF', 'historic', 52, 'Shaydah Club Stadium', 25000],
    ['Al Riayma', 'RIA', 'Riayma', '#00A9E0', '#FFFFFF', 'fan', 50, 'Ulara Stadium', 15000],
    ['Al Nakhil', 'NAK', 'Bahabah', '#006C35', '#FFFFFF', 'fan', 50, 'Ainud Stadium', 12000],
  ];
  FM.D.CLUBS_SA2 = [
    ['Al Zaman', 'ZAM', 'Ulat', '#FFD100', '#CE1126', 'fan', 47, 'Rafan Arena', 15000],
    ['Al Tafawuq', 'TAF', 'Wadi Buruf', '#FFD100', '#CE1126', 'oil', 46, 'Wadi Buruf Sports City', 10000],
    ['Al Qamar', 'QAM', 'Haaydah', '#FFD100', '#0057B8', 'oil', 46, 'Prince Ainaydah Stadium', 20000],
    ['Al Zahra', 'ZAH', 'Bahayma', '#CE1126', '#FFFFFF', 'historic', 46, 'Ula Arena', 38000],
    ['Al Ain Tabuf Club', 'AIN', 'Ain Tabuf', '#00A9E0', '#FFFFFF', 'oil', 45, 'Ain Tabuf Club Stadium', 20000],
    ['Wadi Buruf SC', 'WAD', 'Wadi Buruf', '#006C35', '#FFFFFF', 'fan', 44, 'Wadi Buruf Club Stadium', 10000],
    ['Al Tatwir', 'TAT', 'Ain Jubik', '#006C35', '#FFD100', 'oil', 44, 'King Mahra Sports City', 15000],
    ['Al Ras Zulik', 'RAS', 'Ras Zulik', '#006C35', '#FFFFFF', 'oil', 44, 'Prince Riat Stadium', 10000],
    ['Al Shuja', 'SHJ', 'Riuf', '#CE1126', '#FFFFFF', 'historic', 44, 'Riuf Sports City', 10000],
    ['Al Karama', 'KAA', 'Ain Jubik', '#FFD100', '#CE1126', 'fan', 43, 'Prince Hofmaah Stadium', 18000],
    ['Al Tahaddi', 'TAH', 'Umm Rafaydah', '#006C35', '#FFFFFF', 'fan', 42, 'Sakat Arena', 8000],
    ['Al Wadi', 'WAI', 'Ulayma', '#CE1126', '#FFFFFF', 'fan', 42, 'King Burud Sports City', 8000],
    ['Al Mawj', 'MAW', 'Tabaydah', '#FFD100', '#006C35', 'oil', 42, 'Prince Hofum Stadium', 12000],
    ['Al Qimma', 'QIM', 'Najis', '#CE1126', '#FFFFFF', 'oil', 41, 'Najis Club Stadium', 8000],
    ['Al Nimr', 'NIM', 'Abhis', '#0057B8', '#FFFFFF', 'oil', 41, 'King Turir Sports City', 8000],
    ['Al Asad', 'AAD', 'Jubaydah', '#006C35', '#FFFFFF', 'fan', 40, 'Jubaydah Sports City', 8000],
    ['Al Nour', 'NOU', 'Yana', '#006C35', '#FFD100', 'oil', 40, 'Bahayma Arena', 6000],
    ['Al Khalid', 'KHL', 'Yanik', '#0057B8', '#CE1126', 'oil', 40, 'Majuf Arena', 10000],
  ];
  FM.D.CLUBS_SG1 = [
    ['Bandar Mawar Rovers', 'BAN', 'Bandar Mawar', '#00AEEF', '#FFFFFF', 'oil', 46, 'Pasir Lintang Arena', 6000],
    [
      'Taman Jerangau United',
      'TAJ',
      'Taman Jerangau',
      '#FFD100',
      '#E30613',
      'historic',
      44,
      'Taman Jerangau Sports Hub',
      5000,
    ],
    ['Bandar Mawar FC', 'BAM', 'Bandar Mawar', '#F26522', '#FFFFFF', 'youth', 42, 'Kampong Temasek Arena', 2700],
    ['Bandar Asau FC', 'BND', 'Bandar Asau', '#D2232A', '#006A4E', 'fan', 40, 'Teluk Lintang Stadium', 3000],
    ['Lion Teluk Jerangau', 'LTJ', 'Teluk Jerangau', '#E30613', '#000000', 'historic', 38, 'Jalan Kenanga Arena', 3900],
    ['Kampong Kenanga United', 'KAM', 'Kampong Kenanga', '#F26522', '#0033A0', 'fan', 38, 'Jalan Rasau Arena', 3500],
    [
      'Taman Rasau International',
      'TMN',
      'Taman Rasau',
      '#ED1C24',
      '#FFFFFF',
      'historic',
      37,
      'Bukit Kenanga Arena',
      2700,
    ],
    ['Teluk Selat Warriors', 'TES', 'Teluk Selat', '#1F3A93', '#FFFFFF', 'fan', 36, 'Bukit Emasek Stadium', 4000],
    ['Lion Teluk Selat', 'LTS', 'Teluk Selat', '#F26522', '#000000', 'fan', 35, 'Bandar Jerangau Stadium', 4300],
    ['Taman Lintang Rovers', 'TAA', 'Bandar Mawar', '#E30613', '#FFFFFF', 'youth', 34, 'Jalan Lintang Arena', 6000],
  ];
  FM.D.CLUBS_MY1 = [
    ['Tanjung Mutiara FC', 'TAN', 'Tanjung Mutiara', '#3FA9F5', '#FFFFFF', 'oil', 60, 'Kuala Rimba Arena', 40000],
    ['Bukit Nilam City', 'BUK', 'Bukit Nilam', '#E30613', '#FFD100', 'giant', 52, 'Kuala Pelita Arena', 25000],
    [
      'Pulau Selasih City',
      'PUL',
      'Pulau Selasih',
      '#000000',
      '#FFD100',
      'historic',
      52,
      'Pulau Selasih Provincial Stadium',
      50000,
    ],
    [
      'Simpang Karang City',
      'SIM',
      'Simpang Karang',
      '#00A651',
      '#E30613',
      'historic',
      50,
      'Teluk Damai Sports Park',
      32000,
    ],
    [
      'Simpang Pelita United',
      'SIP',
      'Simpang Pelita',
      '#7BAFD4',
      '#FFFFFF',
      'oil',
      50,
      'Simpang Pelita Provincial Stadium',
      18000,
    ],
    [
      'Teluk Jelai City',
      'TEL',
      'Teluk Jelai',
      '#0066CC',
      '#FFD100',
      'fan',
      48,
      'Teluk Jelai Provincial Stadium',
      35000,
    ],
    [
      'Teluk Pelita FC',
      'TEP',
      'Teluk Pelita',
      '#FFD100',
      '#000000',
      'historic',
      48,
      'Teluk Pelita Provincial Stadium',
      42000,
    ],
    [
      'Sungai Pelita Athletic',
      'SUP',
      'Sungai Pelita',
      '#FFD100',
      '#000000',
      'historic',
      47,
      'Kuala Mutiara Arena',
      40000,
    ],
    ['Sri Teluk Tebing', 'SRI', 'Teluk Tebing', '#FFD100', '#1E90FF', 'fan', 46, 'Pasir Nilam Sports Park', 20000],
    ['Simpang Tebing FC', 'SIT', 'Simpang Tebing', '#E30613', '#FFD100', 'fan', 45, 'Sungai Rimba Stadium', 45000],
    [
      'Pulau Tebing Athletic',
      'PUT',
      'Pulau Tebing',
      '#E30613',
      '#FFFFFF',
      'fan',
      44,
      'Pulau Tebing Provincial Stadium',
      40000,
    ],
    ['Pulau Lenggeng United', 'PUA', 'Pulau Lenggeng', '#E30613', '#FFFFFF', 'fan', 43, 'Pulau Jelai Stadium', 22000],
    [
      'Simpang Pelita Athletic',
      'SMP',
      'Simpang Pelita',
      '#1F3A93',
      '#FFFFFF',
      'selling',
      40,
      'Kuala Selasih Arena',
      18000,
    ],
    ['Pulau Indah United', 'PUI', 'Pulau Indah', '#E30613', '#FFFFFF', 'fan', 40, 'Kota Nilam Sports Park', 40000],
  ];
  FM.D.CLUBS_VN1 = [
    ['Binh Mai FC', 'BIN', 'Binh Mai', '#E30613', '#FFFFFF', 'youth', 52, 'Tuyen Cuong Arena', 22500],
    ['Thép Binh Mai', 'THE', 'Binh Mai', '#FFD100', '#1F3A93', 'oil', 50, 'Binh Mai Provincial Stadium', 22500],
    ['Bac Uong FC', 'BUF', 'Binh Mai', '#E30613', '#FFD100', 'oil', 50, 'Long Sa Stadium', 22500],
    ['Vinh Phat Athletic', 'VIN', 'Vinh Phat', '#FFFFFF', '#003DA5', 'historic', 49, 'Hai Dai Stadium', 30000],
    ['Thai Mai Athletic', 'THM', 'Thai Mai', '#FFD100', '#000000', 'historic', 48, 'Yen Khe Arena', 12000],
    ['Thai Lam FC', 'THL', 'Thai Lam', '#0A8F3C', '#FFFFFF', 'youth', 47, 'Hai Truong Arena', 12000],
    ['Ha Thuy FC', 'HTF', 'Ha Thuy', '#0066CC', '#FFFFFF', 'selling', 46, 'Thai Hien Arena', 18250],
    ['Song Vinh Truong', 'SON', 'Vinh Truong', '#E30613', '#FFFFFF', 'historic', 45, 'Bac Hien Sports Park', 28000],
    ['Thép Tuyen Lam', 'THT', 'Tuyen Lam', '#E30613', '#FFD100', 'fan', 44, 'Tuyen Lam Provincial Stadium', 14000],
    ['Lam Khe City', 'LKC', 'Lam Khe', '#FFD100', '#E30613', 'fan', 43, 'Vinh Dai Arena', 28000],
    ['Long Loc City', 'LON', 'Long Loc', '#E30613', '#FFD100', 'fan', 43, 'Thai Thinh Arena', 25000],
    ['Thép Hai Dai', 'THH', 'Hai Dai', '#F26522', '#FFFFFF', 'fan', 42, 'Hai Dai Provincial Stadium', 20000],
    ['Bac Loc United', 'BAO', 'Bac Loc', '#FFD100', '#E30613', 'fan', 41, 'Bac Loc Provincial Stadium', 20000],
    ['Song Hai Truong', 'SOH', 'Hai Truong', '#1E90FF', '#FFFFFF', 'fan', 40, 'Son Hien Arena', 20000],
  ];
  FM.D.CLUBS_ID1 = [
    [
      'Kedilembang Putra',
      'KED',
      'Kedilembang',
      '#0033A0',
      '#FFFFFF',
      'giant',
      54,
      'Kedilembang Provincial Stadium',
      38000,
    ],
    ['Langsari FC', 'LAF', 'Langsari', '#F26522', '#FFFFFF', 'giant', 54, 'Langsari Provincial Stadium', 77000],
    ['Persi Solawati', 'PER', 'Solawati', '#00A651', '#FFFFFF', 'giant', 52, 'Cirewati Sports Park', 46000],
    ['PS Pamamulan', 'PSP', 'Pamamulan', '#0033A0', '#FFFFFF', 'fan', 52, 'Pamamulan Provincial Stadium', 42000],
    ['Persi Surawati', 'PES', 'Surawati', '#E30613', '#FFFFFF', 'oil', 50, 'Surawati Provincial Stadium', 25000],
    ['Langjaya United', 'LAG', 'Langjaya', '#E30613', '#FFFFFF', 'historic', 50, 'Surapura Stadium', 15000],
    ['Suralembang FC', 'SUR', 'Suralembang', '#F26522', '#003DA5', 'oil', 49, 'Bogorang Stadium', 16000],
    [
      'Bhakti Suramulan',
      'BHS',
      'Suramulan',
      '#003DA5',
      '#FFFFFF',
      'historic',
      46,
      'Suramulan Provincial Stadium',
      21000,
    ],
    ['Bhakti Jembmulan', 'BHA', 'Jembmulan', '#E30613', '#FFFFFF', 'selling', 46, 'Semangan Sports Park', 15000],
    ['Bhakti Tasisari', 'BHT', 'Tasisari', '#5B2C83', '#FFFFFF', 'fan', 45, 'Tasisari Sports Park', 20000],
    ['Persi Langsari', 'PEI', 'Langsari', '#FFD100', '#0033A0', 'selling', 44, 'Puralembang Arena', 5000],
    ['Persi Kedigiri', 'PEK', 'Kedigiri', '#E30613', '#000000', 'historic', 44, 'Jemblembang Stadium', 20000],
    ['PS Tangpura', 'PST', 'Tangpura', '#E30613', '#FFFFFF', 'fan', 42, 'Purakalan Sports Park', 30000],
    ['Tangpura Putra', 'TAP', 'Tangpura', '#1F3A93', '#E30613', 'oil', 47, 'Tangmulan Stadium', 30000],
    ['PS Pamabaya', 'PPX', 'Langsari', '#FFD100', '#003DA5', 'oil', 43, 'Kedikalan Arena', 30000],
    ['Bhakti Pamadongan', 'BHP', 'Pamadongan', '#00A651', '#FFFFFF', 'fan', 43, 'Surawati Sports Park', 31000],
    ['PS Pamawati', 'PSA', 'Pamawati', '#F26522', '#FFFFFF', 'selling', 41, 'Solagiri Stadium', 30000],
    ['Puramulan United', 'PUR', 'Puramulan', '#FFD100', '#000000', 'fan', 41, 'Bansari Arena', 15000],
  ];
  FM.D.CLUBS_PH1 = [
    ['Binaguin FC', 'BIF', 'Binaguin', '#E30613', '#000000', 'youth', 40, 'Tagyaan Arena', 7000],
    ['Binaguin Warriors', 'BIW', 'Binaguin', '#FFFFFF', '#003DA5', 'oil', 39, 'Dumagyaan Arena', 7000],
    ['Bagyaan Warriors', 'BAG', 'Bagyaan', '#1E90FF', '#FFFFFF', 'selling', 37, 'Bagyaan Provincial Stadium', 3000],
    ['Pasyaan Eagles', 'PAS', 'Pasyaan', '#E30613', '#FFD100', 'selling', 36, 'Bagagalan Sports Park', 12000],
    ['Bagalan Warriors', 'BAW', 'Bagalan', '#FFD100', '#000000', 'fan', 36, 'Talabay Arena', 15000],
    ['Maringan FC', 'MAF', 'Maringan', '#E30613', '#003DA5', 'fan', 36, 'Talatuan Stadium', 6000],
    ['Pasyaan FC', 'PAF', 'Pasyaan', '#FFD100', '#000000', 'fan', 35, 'Mariguin Sports Park', 12000],
    ['Cabyaan United', 'CBY', 'Pasyaan', '#E30613', '#FFFFFF', 'fan', 34, 'Cabubantay Stadium', 12000],
    ['Binatuan United', 'BIU', 'Pasyaan', '#0038A8', '#CE1126', 'youth', 33, 'Pasyaan Provincial Stadium', 12000],
    ['Pamgalan United', 'PAM', 'Pasyaan', '#5B2C83', '#FFFFFF', 'fan', 33, 'Pambay Stadium', 12000],
  ];
  FM.D.CLUBS_ZA1 = [
    ['Ladefontein Works', 'LAD', 'Ladefontein', '#FFD100', '#003DA5', 'oil', 62, 'Volula Stadium', 51762],
    ['Nelstad Stars', 'NES', 'Nelstad', '#FFD100', '#000000', 'giant', 60, 'Marabela Stadium', 94736],
    ['Nelstad Chiefs', 'NEL', 'Nelstad', '#000000', '#FFFFFF', 'giant', 60, 'Sasolberg Stadium', 40000],
    ['Ladefontein United', 'LDF', 'Ladefontein', '#003DA5', '#FFFFFF', 'oil', 52, 'Pongrus Stadium', 28900],
    ['Krurus Celtic Rovers', 'KRU', 'Krurus', '#7BAFD4', '#FFFFFF', 'oil', 50, 'Vredula Stadium', 55000],
    ['Sibula Arrows', 'SBL', 'Sibula', '#800020', '#FFD100', 'youth', 50, 'Kwadal Stadium', 16000],
    ['Lower Thabstad City', 'THA', 'Thabstad', '#00A651', '#FFFFFF', 'historic', 49, 'Ulunvlei Park', 54000],
    ['Lower Thabstad FC', 'THB', 'Thabstad', '#FFD100', '#00A651', 'fan', 46, 'Thabstad Sports Complex', 12000],
    ['Ladula Stars', 'LAS', 'Thabstad', '#5B2C83', '#FFD100', 'oil', 44, 'Nelstad Park', 12000],
    ['Sasolbela United', 'SAS', 'Sasolbela', '#FFFFFF', '#003DA5', 'fan', 44, 'Randberg Stadium', 40000],
    ['New Marabkop United', 'MAB', 'Marabkop', '#FFFFFF', '#003DA5', 'fan', 43, 'Marabkop Oval', 20000],
    ["Thabrus St. Luke's", 'THS', 'Thabrus', '#FFFFFF', '#E30613', 'fan', 43, 'Thabrus Sports Complex', 41733],
    ['Vredebela Celtic Rovers', 'VRE', 'Vredebela', '#003DA5', '#FFFFFF', 'selling', 42, 'Nelsula Stadium', 48000],
    ['Thabrus FC', 'THF', 'Thabrus', '#FFFFFF', '#000000', 'fan', 41, 'Thabrus Oval', 41733],
    ['Upper Bettstad City', 'BET', 'Bettstad', '#E30613', '#FFFFFF', 'historic', 41, 'Ladula Park', 24000],
    ['Ulunbela Corinthians', 'ULU', 'Ulunbela', '#FFD100', '#003DA5', 'fan', 40, 'Ulunbela Sports Complex', 41733],
  ];
  FM.D.CLUBS_EG1 = [
    ['Al Zafer', 'ZFR', 'Benighada', '#E30613', '#FFFFFF', 'giant', 66, 'Damighada Arena', 75000],
    ['Al Najah', 'NJH', 'Huranhur', '#FFFFFF', '#E30613', 'giant', 62, 'Huranhur Sports City', 45000],
    ['Al Nile', 'NIL', 'Benighada', '#6CACE4', '#FFFFFF', 'oil', 58, 'Dameg Arena', 30000],
    ['Al Tawfiq', 'TAW', 'Manietta', '#00843D', '#000000', 'historic', 50, 'King Luxailia Sports City', 18000],
    ['Al Salam', 'SLM', 'Port Tanura', '#FFD100', '#0057B8', 'historic', 49, 'Prince Assiut Stadium', 20000],
    ['Ittihad Assta', 'ITT', 'Assta', '#00843D', '#FFFFFF', 'historic', 47, 'King Damia Sports City', 25000],
    ['Faum Sporting', 'FAU', 'Benighada', '#0057B8', '#FFFFFF', 'oil', 46, 'King Kafrsheikh Sports City', 30000],
    ['Kafriut FC', 'KAF', 'Benighada', '#001F5B', '#FFD100', 'oil', 46, 'Benighada Sports City', 12000],
    ['Damag FC', 'DAM', 'Benighada', '#0057B8', '#FFD100', 'oil', 45, 'Prince Kafrsheikh Stadium', 10000],
    ['Al Port Assta', 'POT', 'Assta', '#0057B8', '#FFFFFF', 'selling', 44, 'Ismia Stadium', 13000],
    ['Al Tahrir', 'TAI', 'Benighada', '#E30613', '#000000', 'oil', 44, 'Prince Hurghada Stadium', 14000],
    ['Al Ittihad', 'ITA', 'Benighada', '#001F5B', '#FFFFFF', 'selling', 44, 'Qeneg Arena', 15000],
    ['Sohaganhur FC', 'SOF', 'Assta', '#E30613', '#FFFFFF', 'oil', 43, 'Prince Tanailia Stadium', 10000],
    ['Beni Damiut FC', 'BEI', 'Beni Damiut', '#FFD100', '#00843D', 'selling', 43, 'Beni Damiut Club Stadium', 18000],
    ['Al Zohra', 'ZOH', 'Suhiut', '#6CACE4', '#FFFFFF', 'youth', 43, 'King Tansheikh Sports City', 8000],
    ['Ittihad Damura', 'ITD', 'Benighada', '#00843D', '#FFFFFF', 'fan', 42, 'Prince Huror Stadium', 8000],
    ['Al Hilal', 'HIL', 'Benighada', '#FFD100', '#000000', 'historic', 42, 'Prince Damsuef Stadium', 10000],
    ['Al Suesta', 'SUA', 'Assta', '#0057B8', '#000000', 'fan', 41, 'Kafria Arena', 9000],
  ];
  FM.D.CLUBS_TN1 = [
    ['AS Moneau', 'MOE', 'Moneau', '#E30613', '#FFD100', 'giant', 52, 'Complexe Grenange', 30000],
    ['FC Moneau', 'MNE', 'Moneau', '#E30613', '#FFFFFF', 'giant', 50, 'Stade de la Fonac', 40000],
    ['AS Vendlac', 'VND', 'Vendlac', '#E30613', '#FFFFFF', 'historic', 48, 'Parc des Sports de Vendlac', 28000],
    ['ES Arange', 'ESA', 'Arange', '#000000', '#FFFFFF', 'historic', 46, 'Parc des Sports de Arange', 22000],
    ['AS Beaueau', 'BEE', 'Beaueau', '#0057B8', '#FFFFFF', 'fan', 42, 'Stade Municipal de Beaueau', 12000],
    ['Olympique Sarault', 'SAO', 'Moneau', '#E30613', '#00843D', 'historic', 41, 'Stade Municipal de Moneau', 18000],
    ['US Mont-Vendbourg', 'UMV', 'Vendbourg', '#00843D', '#FFFFFF', 'fan', 40, 'Stade de la Grenlac', 12000],
    ['Stade Château-Belières', 'SCB', 'Belières', '#E30613', '#FFFFFF', 'fan', 39, 'Stade Municipal de Belières', 6000],
    [
      'Bourlac-lès-Bois FC',
      'BOU',
      'Bourlac-lès-Bois',
      '#FFD100',
      '#E30613',
      'fan',
      39,
      'Stade Municipal de Bourlac-lès-Bois',
      7000,
    ],
    ['FC Cherières', 'CHF', 'Cherières', '#00843D', '#000000', 'historic', 39, 'Stade de la Moncourt', 15000],
    ['Sporting Naneau', 'NAE', 'Naneau', '#0057B8', '#FFD100', 'fan', 38, 'Complexe Chaault', 8000],
    ['Étoile de Mont-Mirange', 'ETM', 'Mirange', '#E30613', '#000000', 'fan', 38, 'Stade Paugnan', 6000],
    ['Union Nancourt', 'NNC', 'Nancourt', '#E30613', '#FFFFFF', 'fan', 38, 'Stade Monac', 10000],
    ['Union Naneau', 'NNE', 'Naneau', '#E30613', '#00843D', 'fan', 37, 'Stade de la Dambourg', 8000],
  ];
  FM.D.CLUBS_TZ1 = [
    ['Tabanga Warriors', 'TAB', 'Tabanga', '#00843D', '#FFD100', 'giant', 44, 'Tabanga Uhuru Ground', 60000],
    ['Tabanga City', 'TAC', 'Tabanga', '#E30613', '#FFFFFF', 'giant', 44, 'Tangatuma Sports Ground', 60000],
    ['Samekili Sugar', 'SAM', 'Tabanga', '#6CACE4', '#FFFFFF', 'oil', 40, 'Tabanga National Stadium', 15000],
    ['Old Ruvuna Coastal', 'RUV', 'Ruvuna', '#FFD100', '#0057B8', 'oil', 38, 'Ruvuna National Stadium', 10000],
    ['Moroma Stanley', 'MRM', 'Moroma', '#001F5B', '#FFFFFF', 'fan', 35, 'Moroma National Stadium', 6000],
    [
      'Tabotuma Colliery Athletic',
      'TBT',
      'Tabotuma',
      '#0057B8',
      '#FFD100',
      'historic',
      35,
      'Tabotuma Uhuru Ground',
      10000,
    ],
    ['New Tabokili Jiji', 'TBK', 'Tabokili', '#E30613', '#00843D', 'fan', 34, 'Kigomba Sports Ground', 5000],
    ['Mtwawera Corinthians', 'MTW', 'Mtwawera', '#FFD100', '#000000', 'selling', 34, 'Kigomba Stadium', 8000],
    ['Old Kibondi Sugar', 'KIS', 'Kibondi', '#FFD100', '#00843D', 'fan', 34, 'Kibondi National Stadium', 8000],
    ['Kigondi City', 'KIG', 'Kigondi', '#00843D', '#FFFFFF', 'selling', 34, 'Kigondi Uhuru Ground', 10000],
    ['Songanga City', 'SOC', 'Tabanga', '#6CACE4', '#FFFFFF', 'fan', 33, 'Kibogoma Stadium', 7000],
    ['Samema Royals', 'SMM', 'Samema', '#00843D', '#FFD100', 'fan', 33, 'Tangagoma Stadium', 8000],
    ['Morotuma Sugar', 'MRT', 'Morotuma', '#E30613', '#000000', 'historic', 33, 'Morotuma Uhuru Ground', 9000],
    ['New Kibogoma United', 'KBG', 'Tabanga', '#00843D', '#000000', 'fan', 33, 'Mwantuma Stadium', 6000],
    ['Young Kigotuma', 'YOU', 'Kigotuma', '#0057B8', '#E30613', 'fan', 32, 'Kigotuma Uhuru Ground', 7000],
    ['Kibya United', 'KIU', 'Kibya', '#FFD100', '#0057B8', 'selling', 32, 'Songemba Sports Ground', 6000],
  ];
  FM.D.CLUBS_DZ1 = [
    ['RC Chaville', 'CHV', 'Chaville', '#FFD100', '#00843D', 'giant', 50, 'Complexe Vileau', 18000],
    ['AS Thoières', 'THR', 'Thoières', '#E30613', '#00843D', 'giant', 49, 'Complexe Maray', 40000],
    ['FC Thoières', 'THI', 'Thoières', '#E30613', '#FFFFFF', 'giant', 48, 'Stade Tourières', 40000],
    ['AJ Mont-Grencourt', 'AJM', 'Thoières', '#E30613', '#000000', 'historic', 47, 'Stade de la Pauières', 50000],
    ['FC Nanlac', 'NAF', 'Nanlac', '#000000', '#FFFFFF', 'historic', 46, 'Complexe Lavon', 30000],
    ['Olympique de Mirlieu', 'MIO', 'Mirlieu', '#00843D', '#E30613', 'selling', 41, 'Complexe Joybourg', 20000],
    ['Racing Beauac', 'BEC', 'Thoières', '#FFFFFF', '#0057B8', 'youth', 41, 'Parc des Sports de Thoières', 8000],
    [
      'Union Sportive Clercourt',
      'SPC',
      'Clercourt',
      '#E30613',
      '#FFFFFF',
      'historic',
      41,
      'Stade de la Vendens',
      40000,
    ],
    ['FC Monville', 'MNV', 'Monville', '#00843D', '#000000', 'historic', 40, 'Complexe Mirmont', 30000],
    ['Union Tourault', 'TRL', 'Tourault', '#00843D', '#FFFFFF', 'fan', 39, 'Parc des Sports de Tourault', 10000],
    ['Sporting Sarange', 'SAG', 'Sarange', '#00843D', '#FFD100', 'fan', 38, 'Stade Aubourg', 8000],
    [
      'Union Villeneuve-Bourgnan',
      'VLL',
      'Bourgnan',
      '#0057B8',
      '#FFFFFF',
      'fan',
      38,
      'Parc des Sports de Bourgnan',
      8000,
    ],
    ['Athlétic Fonières', 'FNR', 'Thoières', '#00843D', '#FFD100', 'fan', 38, 'Stade Montgnan', 6000],
    ['AS Château-Pauange', 'CHP', 'Pauange', '#00843D', '#E30613', 'fan', 38, 'Parc des Sports de Pauange', 12000],
    ['Stade Lanens', 'LAE', 'Lanens', '#0057B8', '#FFFFFF', 'fan', 37, 'Stade Laveau', 7000],
    ['US Château-Arcourt', 'USC', 'Arcourt', '#E30613', '#FFFFFF', 'fan', 37, 'Stade Municipal de Arcourt', 20000],
  ];
  FM.D.CLUBS_CY1 = [
    ['Xanópoli FC', 'XAN', 'Xanópoli', '#FFD100', '#0057B8', 'giant', 52, 'Stadio Trópoli', 22000],
    ['GS Xanópoli', 'GSX', 'Xanópoli', '#00843D', '#FFFFFF', 'giant', 51, 'Dimotiko Stadio Xanópoli', 22000],
    ['AO Seránia', 'AOS', 'Seránia', '#0057B8', '#FFFFFF', 'giant', 49, 'Ethniko Stadio Seránia', 10000],
    ['Ethnikos Seránia', 'ETH', 'Seránia', '#FFD100', '#000000', 'historic', 46, 'Stadio Ioanópoli', 8000],
    ['Panathlitikos Kypánia', 'PAK', 'Kypánia', '#FFD100', '#0057B8', 'historic', 44, 'Kalos Arena', 13000],
    ['Kypánia FC', 'KYP', 'Kypánia', '#0057B8', '#FFFFFF', 'historic', 44, 'Ethniko Stadio Kypánia', 10000],
    ['PAE Ioania', 'PAE', 'Ioania', '#0057B8', '#FFFFFF', 'oil', 43, 'Stadio Alexouli', 8000],
    ['Niki Mesos', 'NII', 'Kypánia', '#FFD100', '#00843D', 'fan', 40, 'Alexaki Arena', 8000],
    ['Panathlitikos Larina', 'PAL', 'Larina', '#0057B8', '#FFFFFF', 'fan', 38, 'Dimotiko Stadio Larina', 5000],
    ['Panathlitikos Trikos', 'PAT', 'Xanópoli', '#00843D', '#FFFFFF', 'historic', 37, 'Stadio Xanópetra', 6000],
    ['AO Kypia', 'AKX', 'Kypia', '#FFFFFF', '#0057B8', 'fallen', 37, 'Ethniko Stadio Kypia', 5500],
    ['GS Xania', 'GXX', 'Xania', '#00843D', '#FFFFFF', 'fan', 36, 'Stadio Lamia', 4000],
    ['AE Kavánia', 'AEK', 'Kavánia', '#0057B8', '#FFD100', 'youth', 36, 'Ethniko Stadio Kavánia', 5000],
    ['AO Marópoli', 'AOM', 'Marópoli', '#0057B8', '#FFFFFF', 'fan', 36, 'Argánia Arena', 5000],
  ];
  FM.D.CLUBS_HR1 = [
    ['AO Belany', 'AOB', 'Belany', '#0057B8', '#FFFFFF', 'giant', 60, 'Slagrad Arena', 35000],
    ['SK Kamovac', 'KAS', 'Kamovac', '#FFFFFF', '#0057B8', 'giant', 55, 'Gradski Stadion Kamovac', 34000],
    ['FC Turina', 'TUR', 'Turina', '#FFFFFF', '#0057B8', 'historic', 52, 'Stadion Mir Turina', 8000],
    ['Radnički Ostina', 'RAO', 'Ostina', '#0057B8', '#FFFFFF', 'historic', 48, 'Stadion Mir Ostina', 13000],
    ['Rudar Belany', 'RUD', 'Belany', '#E30613', '#0057B8', 'youth', 46, 'Belany Park', 5000],
    ['Partizan Plesovo', 'PAP', 'Plesovo', '#00843D', '#FFD100', 'selling', 44, 'Gradski Stadion Plesovo', 3500],
    ['MFK Petica', 'MFP', 'Petica', '#FFFFFF', '#0057B8', 'fan', 43, 'Petica Park', 6000],
    ['Rapid Rybpol', 'RAR', 'Rybpol', '#0057B8', '#FFFFFF', 'selling', 43, 'Bogice Arena', 5000],
    ['MFK Velin', 'MFV', 'Velin', '#E30613', '#FFFFFF', 'fan', 42, 'Hradin Arena', 4000],
    ['Mladost Gorek', 'MLG', 'Gorek', '#FFFFFF', '#0057B8', 'fan', 42, 'Stadion Mir Gorek', 8000],
  ];
  FM.D.CLUBS_SE1 = [
    ['FC Hedrud', 'HED', 'Hedrud', '#0057B8', '#FFFFFF', 'giant', 62, 'Hedrud Arena', 22500],
    ['Dyrfors IF', 'DYF', 'Dyrfors', '#000000', '#FFD100', 'giant', 57, 'Marborg Park', 50000],
    ['Gammelstad FK', 'GAF', 'Gammelstad', '#0057B8', '#E30613', 'giant', 56, 'Kilnæs Stadion', 30000],
    ['FC Gammelstad', 'GMM', 'Gammelstad', '#00843D', '#FFFFFF', 'historic', 55, 'Gammelstad Idrætsanlæg', 33000],
    ['Holgård Boldklub', 'HOB', 'Holgård', '#0057B8', '#FFFFFF', 'historic', 53, 'Kilvang Stadion', 18000],
    ['Fremad Holgård', 'FRH', 'Holgård', '#FFD100', '#000000', 'selling', 52, 'Nordlund Stadion', 6500],
    ['Dyrud BK', 'DYB', 'Dyrud', '#FFD100', '#000000', 'historic', 50, 'Dyrud Idrætsanlæg', 16000],
    ['IK Sønderby', 'ISN', 'Sønderby', '#FFFFFF', '#0057B8', 'historic', 50, 'Sønderby Arena', 17000],
    ['Ålstrup FK', 'ALS', 'Ålstrup', '#E30613', '#FFFFFF', 'fan', 46, 'Ålstrup Arena', 12000],
    ['Østernordstad IF', 'STO', 'Østernordstad', '#0057B8', '#FFFFFF', 'youth', 46, 'Nordgård Park', 9000],
    ['Bjørnstad IF', 'BRI', 'Bjørnstad', '#FFD100', '#000000', 'fan', 45, 'Brogård Park', 7000],
    ['FC Søndernæs', 'SND', 'Gammelstad', '#E30613', '#000000', 'youth', 44, 'Havby Stadion', 8000],
    ['Storløkke IF', 'STK', 'Storløkke', '#0057B8', '#FFFFFF', 'historic', 43, 'Storløkke Arena', 15000],
    ['Sydlund FK', 'SYD', 'Holgård', '#00843D', '#000000', 'fallen', 42, 'Nordfors Idrætspark', 13000],
    ['Storø BK', 'SBX', 'Storø', '#E30613', '#FFFFFF', 'fan', 41, 'Storø Arena', 7000],
    ['FC Dyrby', 'DYY', 'Dyrby', '#00843D', '#000000', 'fan', 41, 'Dyrby Arena', 4500],
  ];
  FM.D.CLUBS_RO1 = [
    ['Metalac Donji Lubpol', 'MET', 'Donji Lubpol', '#E30613', '#0057B8', 'giant', 58, 'Kamec Arena', 55000],
    ['FC Stari Slaovice', 'STI', 'Stari Slaovice', '#0057B8', '#FFFFFF', 'oil', 56, 'Stadion Bogec', 23000],
    ['Zenit Stari Polpol', 'ZEN', 'Stari Polpol', '#0057B8', '#FFFFFF', 'giant', 53, 'Stari Polpol Park', 30000],
    ['Spartak Donji Lubpol', 'SPD', 'Donji Lubpol', '#0057B8', '#FFFFFF', 'giant', 52, 'Stadion Jasgrad', 14000],
    ['Spartak Belgrad', 'SPK', 'Donji Lubpol', '#E30613', '#FFFFFF', 'fallen', 50, 'Stadion Kamany', 15000],
    ['FK Donji Malik', 'DNJ', 'Donji Malik', '#0057B8', '#FFFFFF', 'oil', 48, 'Stadion Ostovo', 15000],
    ['Metalac Liptovice', 'MEL', 'Liptovice', '#E30613', '#FFFFFF', 'historic', 47, 'Liptovice Park', 12000],
    ['AO Liptica', 'AOL', 'Liptica', '#0057B8', '#FFFFFF', 'selling', 45, 'Gradski Stadion Liptica', 8000],
    ['Union Dolnava', 'DOU', 'Dolnava', '#FFD100', '#0057B8', 'historic', 45, 'Dolnava Park', 15000],
    ['Union Kamgrad', 'KAU', 'Kamgrad', '#E30613', '#FFFFFF', 'selling', 43, 'Tarovice Arena', 4500],
    ['SK Bratava', 'BRS', 'Bratava', '#E30613', '#FFFFFF', 'historic', 42, 'Stadion Mir Bratava', 13000],
    ['Rapid Nova Dolnek', 'RAN', 'Nova Dolnek', '#0057B8', '#FFD100', 'fan', 42, 'Plesin Arena', 8000],
    ['KS Petek', 'KSP', 'Petek', '#0057B8', '#FFFFFF', 'fan', 41, 'Stadion Gorovac', 2500],
    ['Lokomotiv Lubovac', 'LOK', 'Lubovac', '#0057B8', '#FFFFFF', 'historic', 41, 'Lubovac Park', 11000],
    ['FC Donji Mikina', 'DOJ', 'Donji Mikina', '#0057B8', '#FFFFFF', 'fan', 40, 'Stadion Bogava', 5000],
    ['Radnički Bratek', 'RAB', 'Bratek', '#E30613', '#FFFFFF', 'fan', 40, 'Stadion Bratovac', 3000],
  ];
  FM.D.CLUBS_EC1 = [
    ['Valdemiel CF', 'VLD', 'Valdemiel', '#FFFFFF', '#0057B8', 'giant', 58, 'Estadio Municipal de Valdemiel', 41000],
    ['Real Arroar', 'ARO', 'Arroar', '#FFD100', '#000000', 'giant', 57, 'Estadio Nerjar', 57000],
    ['Club Hinojiel', 'HIN', 'Hinojiel', '#000000', '#0057B8', 'youth', 56, 'Ciudad Deportiva Hinojiel', 12000],
    ['Club Arroar', 'AOA', 'Arroar', '#0057B8', '#FFFFFF', 'giant', 55, 'Estadio Municipal de Arroar', 40000],
    ['Racing Valdemiel', 'VAE', 'Valdemiel', '#FFD100', '#E30613', 'historic', 47, 'Campo de Valdemiel', 20000],
    ['Deportivo Pozara', 'POD', 'Pozara', '#E30613', '#FFFFFF', 'historic', 45, 'Ciudad Deportiva Pozara', 16000],
    [
      'Deportivo Mayorador',
      'MAD',
      'Valdemiel',
      '#E30613',
      '#FFFFFF',
      'fallen',
      45,
      'Ciudad Deportiva Valdemiel',
      35000,
    ],
    ['Talero Balompié', 'TLR', 'Talero', '#FFD100', '#0057B8', 'selling', 44, 'Campo de Talero', 20000],
    ['UD Liorero', 'LIU', 'Liorero', '#FFD100', '#00843D', 'fan', 42, 'Nuevo Estadio Liorero', 16000],
    ['Deportivo Guadero', 'GUD', 'Guadero', '#0057B8', '#FFFFFF', 'fan', 42, 'Estadio Bailiel', 18000],
    ['Atlético Guadero', 'GDR', 'Guadero', '#0057B8', '#FFFFFF', 'historic', 41, 'Estadio La Fresnanes', 18000],
    ['Alto Aranjino Balompié', 'ATO', 'Guadero', '#FFFFFF', '#0057B8', 'fan', 40, 'Estadio Plasara', 8000],
    ['Real Aranjador', 'ARN', 'Valdemiel', '#0057B8', '#FFFFFF', 'fan', 40, 'Estadio Jarandilla', 40000],
    ['SD Liora', 'LIR', 'Liora', '#FFFFFF', '#0057B8', 'fan', 39, 'Estadio La Yestar', 8000],
    ['Sporting Santa Oñatanes', 'SNT', 'Valdemiel', '#E30613', '#FFFFFF', 'youth', 38, 'Estadio La Benedo', 6000],
    ['Real Club Roblar', 'ROB', 'Roblar', '#E30613', '#FFFFFF', 'fan', 37, 'Estadio La Olmete', 10000],
  ];
  FM.D.CLUBS_UY1 = [
    ['Estudiantes de Ortas', 'ESU', 'Ortas', '#FFD100', '#000000', 'giant', 58, 'Estadio Hereda', 40000],
    ['Defensores de Ortas', 'DEO', 'Ortas', '#FFFFFF', '#0057B8', 'giant', 58, 'Cancha de Ortas', 35000],
    [
      'Club de Regatas Cabreda',
      'RGT',
      'Ortas',
      '#6A1B9A',
      '#FFFFFF',
      'historic',
      47,
      'Estadio Municipal de Ortas',
      18000,
    ],
    ['Puesilla FC', 'PUF', 'Ortas', '#FFFFFF', '#000000', 'youth', 46, 'Estadio Rodas', 18000],
    ['Rodeda FC', 'RDD', 'Ortas', '#FFFFFF', '#000000', 'historic', 44, 'Estadio Herui', 8000],
    ['Club Deportivo Velona', 'VEC', 'Ortas', '#000000', '#0057B8', 'historic', 43, 'Estadio Mirona', 9000],
    ['Sportivo Lavar', 'SPL', 'Ortas', '#FFFFFF', '#E30613', 'historic', 42, 'Estadio Lavas', 12000],
    ['Gimnasia de Molar', 'GMN', 'Ortas', '#6CACE4', '#FFFFFF', 'oil', 42, 'Estadio Ferini', 6000],
    ['Independiente Bustini', 'INB', 'Bustini', '#0057B8', '#FFFFFF', 'fan', 41, 'Estadio Dorreda', 9000],
    ['Club Deportivo Castona', 'CST', 'Ortas', '#0057B8', '#E30613', 'fan', 40, 'Estadio Arrona', 6000],
    ['Club Atlético Sarini', 'SRN', 'Ortas', '#FFFFFF', '#0057B8', 'historic', 40, 'Estadio Monumental Pellini', 6000],
    ['Club Atlético Rodilla', 'RDL', 'Rodilla', '#FFFFFF', '#0057B8', 'fan', 40, 'Estadio Alverero', 7000],
    ['Defensores de Pellona', 'DEE', 'Ortas', '#0057B8', '#FFFFFF', 'historic', 40, 'Estadio Garini', 10000],
    ['Club Sportivo Belona', 'SIV', 'Belona', '#00843D', '#FFFFFF', 'selling', 39, 'Estadio Puesui', 5000],
    ['Estudiantes de Escón', 'ESE', 'Ortas', '#FFD100', '#0057B8', 'fan', 38, 'Estadio Alveras', 5000],
    ['Sportivo Castui', 'SVO', 'Ortas', '#0057B8', '#FFFFFF', 'fan', 38, 'Estadio Monumental Ortano', 4000],
  ];
  FM.D.CLUBS_CO1 = [
    ['Valal Balompié', 'VAB', 'Valal', '#00843D', '#FFFFFF', 'giant', 60, 'Estadio Municipal de Valal', 45000],
    ['Sporting Poza', 'POS', 'Poza', '#0057B8', '#FFFFFF', 'giant', 58, 'Estadio Marbiel', 36000],
    ['Pedares Balompié', 'PEB', 'Pedares', '#E30613', '#FFFFFF', 'giant', 55, 'Nuevo Estadio Pedares', 46000],
    ['Racing Cabral', 'CAA', 'Cabral', '#E30613', '#FFFFFF', 'giant', 54, 'Nuevo Estadio Cabral', 42000],
    ['Real Club Poza', 'PZA', 'Poza', '#E30613', '#FFFFFF', 'historic', 52, 'Estadio La Marbilla', 36000],
    ['Cabral Balompié', 'CRA', 'Cabral', '#00843D', '#FFFFFF', 'historic', 50, 'Estadio La Cabrosa', 42000],
    ['Deportivo Valal', 'VAD', 'Valal', '#E30613', '#0057B8', 'historic', 50, 'Nuevo Estadio Valal', 45000],
    ['Racing Marbares', 'MAE', 'Marbares', '#E30613', '#FFD100', 'historic', 48, 'Nuevo Estadio Marbares', 28000],
    [
      'Gandón del Mar CF',
      'GND',
      'Gandón del Mar',
      '#FFFFFF',
      '#000000',
      'historic',
      47,
      'Nuevo Estadio Gandón del Mar',
      30000,
    ],
    ['SD Orihilla', 'ORI', 'Orihilla', '#FFD100', '#00843D', 'fan', 44, 'Campo de Orihilla', 28000],
    [
      'Real Club Villa Fuentar',
      'FNT',
      'Villa Fuentar',
      '#FFD100',
      '#F26522',
      'youth',
      43,
      'Estadio La Jarandino',
      12000,
    ],
    ['UD Tarifador', 'TAU', 'Tarifador', '#FFD100', '#E30613', 'fan', 43, 'Nuevo Estadio Tarifador', 30000],
    ['Unión Bailara', 'BAI', 'Bailara', '#FFD100', '#E30613', 'fan', 42, 'Estadio Osunana', 20000],
    ['Deportivo Cervera', 'CEV', 'Cervera', '#FFD100', '#000000', 'selling', 42, 'Estadio Zafra', 14000],
    ['Real Club Nueva Montilla', 'NUM', 'Poza', '#00843D', '#FFFFFF', 'fan', 41, 'Estadio Cuenador', 10000],
    ['Unión Elchena', 'ELU', 'Elchena', '#FFD100', '#00843D', 'fan', 40, 'Estadio La Torranes', 12000],
    ['Sporting Lucal', 'LUC', 'Lucal', '#FFD100', '#0057B8', 'fan', 40, 'Estadio Municipal de Lucal', 12000],
    ['Unión Nueva Tarifino', 'NUT', 'Tarifino', '#FFFFFF', '#0057B8', 'fan', 39, 'Estadio Tordedo', 8000],
    ['Real Unión Cuenejo', 'CNJ', 'Poza', '#0057B8', '#FFFFFF', 'fan', 38, 'Nuevo Estadio Poza', 8000],
    [
      'Deportivo Bajo Almazero',
      'BAJ',
      'Almazero',
      '#E30613',
      '#FFFFFF',
      'fan',
      38,
      'Estadio Municipal de Almazero',
      10000,
    ],
  ];
  FM.D.CLUBS_CA1 = [
    ['Barborough Hotspur', 'BRB', 'Barborough', '#F26522', '#000000', 'youth', 42, 'Tamouth Lane', 6000],
    ['Grenworth North End', 'GRN', 'Grenworth', '#E30613', '#000000', 'selling', 40, 'Witbury Green', 6000],
    ['AFC Horstead', 'HOR', 'Horstead', '#E30613', '#FFFFFF', 'fan', 37, 'Hunworth Park', 24000],
    ['Upper Bournshall County', 'BON', 'Bournshall', '#6A1B9A', '#FFFFFF', 'youth', 36, 'Plywood Lane', 6000],
    ['Tivmere City', 'TIV', 'Tivmere', '#00843D', '#FFFFFF', 'fan', 35, 'Tivmere Park', 4000],
    ['Cobport Dynamo', 'COD', 'Cobport', '#6CACE4', '#000000', 'fan', 35, 'Sedbridge Road', 6000],
    ['Clifwich City', 'CLW', 'Clifwich', '#F26522', '#000000', 'fan', 34, 'The Chelingham Stadium', 6000],
    ['Hayhaven Wanderers', 'HAY', 'Hayhaven', '#00843D', '#000000', 'fan', 33, 'The Warthorpe Stadium', 6000],
  ];
  FM.D.CLUBS_AE1 = [
    ['Al Burj', 'BUA', 'Wadi Majum', '#FFD100', '#6A1B9A', 'oil', 60, 'Yanan Stadium', 25000],
    ['Al Izz', 'IZZ', 'Jedat', '#E30613', '#000000', 'oil', 58, 'Sakum Arena', 12000],
    ['Al Majmaah', 'MAJ', 'Majmaah', '#FFFFFF', '#0057B8', 'oil', 56, 'Majmaah Club Stadium', 11000],
    ['Al Jabal', 'JAA', 'Jedat', '#FFD100', '#000000', 'historic', 54, 'Jedat Club Stadium', 12000],
    ['Al Watan', 'WAT', 'Jedir', '#E30613', '#000000', 'oil', 53, 'Bura Stadium', 42000],
    ['Al Jedir Club', 'JEA', 'Jedir', '#F26522', '#000000', 'oil', 52, 'King Ulik Sports City', 11000],
    ['Al Yaqin', 'YAQ', 'Jedat', '#FFD100', '#0057B8', 'historic', 47, 'Burmaah Stadium', 12000],
    ['Al Dhahab', 'DHA', 'Jedir', '#E30613', '#000000', 'fan', 44, 'Jedir Sports City', 9000],
    ['Al Sharq', 'SHQ', 'Sakabah', '#F26522', '#FFFFFF', 'fan', 43, 'Prince Majir Stadium', 5000],
    ['Al Rimal', 'RIM', 'Mahan', '#E30613', '#FFFFFF', 'fan', 42, 'Mahan Club Stadium', 4000],
    ['Al Hurriya', 'HUR', 'Turud', '#00843D', '#E30613', 'fan', 42, 'Turud Sports City', 7000],
    ['Al Nawras', 'NAW', 'Taiman', '#FFD100', '#0057B8', 'fan', 41, 'Jubum Arena', 4000],
    ['Al Falah', 'FAA', 'Rafum', '#FFD100', '#000000', 'fan', 41, 'Rafum Club Stadium', 6000],
    ['Al Sahab', 'SHB', 'Majmaah', '#0057B8', '#FFFFFF', 'fan', 40, 'Turan Arena', 3000],
  ];
  FM.D.CLUBS_IR1 = [
    ['Mes Qazud', 'MES', 'Qazud', '#E30613', '#FFFFFF', 'giant', 58, 'Hamvin Stadium', 78000],
    ['Nassaji Qazud', 'NAS', 'Qazud', '#0057B8', '#FFFFFF', 'giant', 57, 'Reyfahan Stadium', 78000],
    ['Gol Shahr Yazvin', 'GOS', 'Shahr Yazvin', '#FFD100', '#000000', 'historic', 54, 'Mashud Stadium', 75000],
    ['Fajr Orumabad', 'FAJ', 'Orumabad', '#E30613', '#000000', 'giant', 52, 'Orumabad Takhti Stadium', 66000],
    ['Paykan Hamfahan', 'PAY', 'Hamfahan', '#E30613', '#FFD100', 'historic', 48, 'Azadi Hamfahan Stadium', 30000],
    ['Zob Bandar Reyfahan', 'ZOB', 'Reyfahan', '#FFD100', '#00843D', 'oil', 47, 'Bushkan Stadium', 10000],
    ['Pas Shahr Yazvin', 'PSY', 'Shahr Yazvin', '#00843D', '#FFFFFF', 'historic', 44, 'Tabkan Sports Complex', 15000],
    ['Nassaji Zanabad', 'NSS', 'Zanabad', '#FFD100', '#E30613', 'fan', 42, 'Shavin Sports Complex', 15000],
    ['Naft Shahr Shatan', 'NFT', 'Shahr Shatan', '#0057B8', '#FFFFFF', 'historic', 42, 'Birman Sports Complex', 10000],
    [
      'Gol Bandar Eshabad',
      'GOB',
      'Bandar Eshabad',
      '#0057B8',
      '#FFFFFF',
      'selling',
      42,
      'Bandar Eshabad Takhti Stadium',
      15000,
    ],
    ['Paykan Semriz', 'PYK', 'Qazud', '#FFD100', '#000000', 'historic', 41, 'Ilambad Stadium', 10000],
    ['Sepahan Yazkan', 'SEY', 'Yazkan', '#F26522', '#000000', 'selling', 41, 'Mashjan Stadium', 15000],
    ['Mohammedan Bandar Ilaman', 'MOH', 'Qazud', '#0057B8', '#FFFFFF', 'fan', 40, 'Mashbad Stadium', 5000],
    [
      'Bargh Bandar Qazriz',
      'BAB',
      'Bandar Qazriz',
      '#FFD100',
      '#0057B8',
      'fan',
      40,
      'Bandar Qazriz Takhti Stadium',
      5000,
    ],
    ['Shahin Dasht Sirdan', 'SHD', 'Dasht Sirdan', '#F26522', '#000000', 'selling', 40, 'Hamtan Sports Complex', 5000],
    ['Fajr Bandar Bushshahr', 'FAB', 'Bushshahr', '#E30613', '#FFFFFF', 'fan', 39, 'Azadi Bushshahr Stadium', 10000],
  ];
  FM.D.CLUBS_QA1 = [
    ['Al Ihsan', 'IHS', 'Bahaydah', '#FFFFFF', '#000000', 'oil', 58, 'Jedum Arena', 15000],
    ['Bahaydah SC', 'BHY', 'Bahaydah', '#E30613', '#FFFFFF', 'oil', 56, 'King Rafayma Sports City', 40000],
    ['Al Umm Sakabah', 'UMM', 'Umm Sakabah', '#E30613', '#000000', 'oil', 52, 'Umm Sakabah Sports City', 44000],
    ['Al Ulir', 'ULI', 'Bahaydah', '#FFFFFF', '#000000', 'oil', 50, 'Zulaydah Arena', 21000],
    ['Al Gharb', 'GHA', 'Bahaydah', '#FFFFFF', '#E30613', 'historic', 48, 'Prince Zulabah Stadium', 15000],
    ['Riyma SC', 'RIY', 'Riyma', '#FFD100', '#000000', 'fan', 45, 'Prince Ulir Stadium', 20000],
    ['Al Dira', 'DIR', 'Bahaydah', '#8A1538', '#FFFFFF', 'historic', 44, 'Bahaydah Club Stadium', 13000],
    ['Ain Mahabah SC', 'AIM', 'Ain Mahabah', '#FFD100', '#000000', 'fan', 43, 'Ain Mahabah Sports City', 12000],
    ['Al Bura Club', 'ABC', 'Bahaydah', '#00843D', '#FFFFFF', 'historic', 42, 'Khaydah Arena', 7000],
    ['Al Buruf Club', 'BUU', 'Buruf', '#0057B8', '#FFFFFF', 'fan', 41, 'Buruf Sports City', 10000],
    ['Al Abhayma Club', 'ABA', 'Abhayma', '#0057B8', '#FFFFFF', 'fan', 41, 'King Jubum Sports City', 12000],
    ['Al Shamal', 'SHM', 'Bahaydah', '#E30613', '#FFFFFF', 'fan', 40, 'Prince Taimabah Stadium', 3000],
  ];
  FM.D.CLUBS_CS1 = [
    ['Meimen Sports', 'MEI', 'Meimen', '#E30613', '#000000', 'oil', 66, 'Qingmen Sports Center', 72000],
    ['Jinyuan United', 'JIN', 'Jinyuan', '#F26522', '#000000', 'giant', 62, 'Jinyuan Olympic Stadium', 54000],
    ['Dongang FC', 'DON', 'Dongang', '#00843D', '#FFD100', 'giant', 62, 'Hayuan Stadium', 66000],
    ['Meimen Dragons', 'MED', 'Meimen', '#0057B8', '#FFFFFF', 'giant', 60, 'Jincheng Sports Center', 52000],
    ['Kaizhou FC', 'KAI', 'Kaizhou', '#E30613', '#FFFFFF', 'oil', 56, 'Kaizhou Gymnasium Stadium', 40000],
    ['Hengping Dragons', 'HEN', 'Hengping', '#00843D', '#FFFFFF', 'youth', 52, 'Hengping Olympic Stadium', 50000],
    ['Beyuan City', 'BEY', 'Beyuan', '#E30613', '#FFFFFF', 'oil', 50, 'Tiantai Sports Center', 52000],
    ['Baoshan City', 'BSH', 'Baoshan', '#0057B8', '#FFFFFF', 'fan', 48, 'Baoshan Gymnasium Stadium', 54000],
    ['Wujiang Athletic', 'WUJ', 'Wujiang', '#FFD100', '#00843D', 'historic', 48, 'Hanmen Stadium', 38000],
    ['Longping Port', 'LOP', 'Longping', '#FFD100', '#0057B8', 'fan', 46, 'Kaicheng Sports Center', 29000],
    ['Meyang United', 'MEY', 'Meyang', '#0057B8', '#FFFFFF', 'fallen', 46, 'Shenyang Stadium', 55000],
    ['Baolin FC', 'BAF', 'Baolin', '#E30613', '#000000', 'fan', 45, 'Hayang Sports Center', 20000],
    ['Shenping Port', 'SHE', 'Shenping', '#0057B8', '#FFFFFF', 'fan', 44, 'Shenshan Stadium', 18000],
    ['Changlin Taishan', 'CHN', 'Changlin', '#0057B8', '#FFFFFF', 'fan', 44, 'Changlin Olympic Stadium', 30000],
    ['Xyang Port', 'XYA', 'Xyang', '#E30613', '#0057B8', 'fan', 43, 'Xyang Olympic Stadium', 30000],
    ['Changhai Dragons', 'CHD', 'Changhai', '#0057B8', '#FFD100', 'fan', 42, 'Xitai Stadium', 18000],
  ];
  FM.D.CLUB_INFO = Object.fromEntries(
    `BAY|BAY|Cats|1893
CLI|CLI|Canaries|1865
CHE|CHE|Scarlets|1897
CHC|CHC|Blades|1969
BAA|BAA|Shrimpers|1897
ROD|ROD|Owls|1950
QUA|QUA|Rockets|1894
EVE|EVE|Wine Reds|1897
CAL|CAL|Cobblers|1938
EPI|EPI|Crimsons|1884
FIL|FIL|Clarets|1882
BRA|BRA|Blues|1865
RED|RED|Eagles|1948
TAD|TAD|Lilywhites|1879
TET|TET|Pioneers|1966
CLC|CLC|Saints|1884
MER|MER|Yellows|1948
SEL|SEL|Seagulls|1876
CAR|CAR|Miners|1907
RYE|RYE|Harriers|1912
ALD|ALD|Blues|1881
TTH|TTH|Red Devils|1983
GRT|GRT|Royals|1879
LIT|LIT|Crimsons|1955
HAS|HAS|Reds|1878
EVR|EVR|Terriers|1956
YAR|YAR|Navy|1871
TUT|TUT|Hornets|1979
LAU|LAU|Mariners|1947
REY|REY|Terriers|1986
CHI|CHI|Crimsons|1966
BEX|BEX|Bees|1867
REA|REA|Foxes|1909
STH|STH|Whites|1956
KIN|KIN|Railwaymen|1869
LIN|LIN|Foxes|1904
ROU|ROU|Bluebirds|1888
REC|REC|Magpies|1956
TOU|TOU|Panthers|1875
YRN|YRN|Dragons|1931
HAT|HAT|Smiths|1881
CAO|CAO|Weavers|1951
EDE|EDE|Ironmen|1888
FIU|FIU|Smiths|1920
LAM|LAM|Blues|1906
HYD|HYD|Kings|1890
AME|AME|Bluebirds|1891
BXS|BXS|Lilywhites|1904
HUC|HUC|Robins|1917
SUT|SUT|Bluebirds|1866
WOR|WOR|Workmen|1932
WED|WED|Brewers|1956
CAE|CAE|Yeomen|1937
TUN|TUN|Thistles|1904
SHP|SHP|Drovers|1903
CLF|CLF|Bluebirds|1978
MAN|MAN|Reds|1905
SCA|SCA|Crimsons|1942
DEN|DEN|Reds|1889
FAL|FAL|Reds|1883
DUW|DUW|Cats|1904
ABH|ABH|Rockets|1890
CAI|CAI|Red Devils|1894
BES|BES|Rams|1900
DAA|DAA|Ironmen|1918
DAR|DAR|Tinners|1906
TAV|TAV|Maroons|1909
HOW|HOW|Workmen|1946
DRT|DRT|Crimsons|1924
CSH|CSH|Warriors|1950
HAO|HAO|Blades|1933
RES|RES|Spartans|1866
WIT|WIT|Magpies|1887
BUR|BUR|Kestrels|1945
BED|BED|Red Devils|1946
WOK|WOK|Blues|1886
SUE|SUE|Foresters|1880
GLA|GLA|Red Devils|1916
YTH|YTH|Seahawks|1890
LMR|LMR|Reds|1921
MIA|MIA|Blue Army|1901
EVA|EVA|Pilgrims|1862
PRU|PRU|Bees|1895
HAR|HAR|Lilywhites|1896
PIC|PIC|Oranges|1902
CUR|CUR|Rams|1901
SHR|SHR|Royals|1901
YEO|YEO|Crimsons|1910
HYT|HYT|Bees|1901
TAR|TAR|Red Devils|1867
FOL|FOL|Magpies|1889
HOC|HOC|Reds|1914
OLM|OLM|Blancos|1878
CER|CER|Rojos|1890
OLC|OLC|Rojos|1893
CUE|CUE|Rojos|1932
PLA|PLA|Cóndores|1915
LIO|LIO|Azules|1949
ALC|ALC|Verdes|1863
ALB|ALB|Gladiadores|1906
JUV|JUV|Osos|1938
MOF|MOF|Gladiadores|1883
MOD|MOD|Celestes|1925
ARR|ARR|Rojos|1890
JUC|JUC|Rojos|1894
CRV|CRV|Azules|1872
OSU|OSU|Cruzados|1936
BEN|BEN|Azules|1904
JUR|JUR|Azules|1913
COR|COR|Venados|1937
MNT|MNT|Rojos|1908
SOR|SOR|Blancos|1933
SAP|SAP|Azules|1889
SEG|SEG|Águilas|1889
BNV|BNV|Granates|1902
CAU|CAU|Azules|1873
SAL|SAL|Rojos|1940
ARA|ARA|Jaguares|1887
NAV|NAV|Cóndores|1904
MOA|MOA|Rojos|1974
OLR|OLR|Rojos|1888
MRB|MRB|Blancos|1898
PED|PED|Leñadores|1916
ARK|ARK|Urdinak|1921
SOD|SOD|Blancos|1887
CES|CES|Els Blaus|1904
JUF|JUF|Titanes|1968
SEB|SEB|Blancos|1948
MOR|MOR|Cóndores|1912
CBR|CBR|Blancos|1936
FUE|FUE|Rojos|1936
LIA|LIA||1989
SAC|SAC|Blancos|1933
JUB|JUB|Blancos|1918
OLB|OLB||1911
CEB|CEB||1929
CUB|CUB||1979
POZ|POZ|Pastores|1913
OLA|OLA||1931
PLB|PLB||1959
ALA|ALA||1940
MTA|MTA||1989
ALL|ALL||1921
RON|RON|Titanes|1900
MAY|MAY|Negros|1897
SEP|SEP|Cóndores|1932
TOB|TOB|Alacranes|1885
JVN|JVN|Zorros|1931
NAU|NAU|Cruzados|1882
CAC|CAC|Azules|1884
ELC|ELC|Azules|1943
OSC|OSC|Rojos|1939
MOS|MOS|Negros|1876
NUE|NUE|Rojos|1947
DIL|DIL|Pioniere|1881
TEU|TEU|Falken|1951
UNT|UNT|Bären|1866
VIK|VIK|Weißen|1914
VID|VID|Fischer|1909
VIB|VIB|Gladiatoren|1873
BRU|BRU|Roten|1921
PRE|PRE|Grünen|1915
FSV|FSV|Weißen|1873
BER|BER|Wikinger|1876
FOR|FOR|Weißen|1895
BRF|BRF|Grünen|1874
GER|GER|Roten|1879
SPB|SPB|Roten|1916
MUH|MUH|Blauen|1989
GEB|GEB|Gladiatoren|1886
BRG|BRG|Weinroten|1936
HAF|HAF|Roten|1944
EIN|EIN|Fischer|1882
HAI|HAI|Löwen|1882
KIR|KIR|Fischer|1897
FON|FON|Blauen|1905
STE|STE|Roten|1880
ALT|ALT|Grünen|1867
SCW|SCW|Roten|1890
IMT|IMT|Raben|1917
FOH|FOH|Rothirsche|1888
IMM|IMM|Blauen|1900
BRV|BRV|Blauen|1942
COS|COS|Stahlwerker|1926
ROF|ROF|Raben|1918
TEA|TEA|Gelben|1881
FSF|FSF|Hirsche|1923
EIM|EIM|Schwarzen|1922
FOB|FOB|Blauen|1902
SPH|SPH|Gladiatoren|1879
VII|VII||1903
TTN|TTN||1983
MUB|MUB||2008
FSD|FSD|Himmelblauen|1892
AHR|AHR|Roten|1894
KRO|KRO|Kumpel|1893
HAK|HAK|Roten|1889
BRT|BRT|Roten|1888
EIE|EIE|Blauen|1930
HIR|HIR|Weinroten|1886
ALO|ALO|Gelben|1899
KLA|KLA|Schwarzen|1908
SPV|SPV|Adler|1909
BLA|BLA|Hirsche|1892
UNH|UNH|Roten|1922
GRB|GRB|Schwarzen|1883
HND|HND|Blauen|1871
TED|TED|Ritter|1884
SCR|SCR|Roten|1897
BUG|BUG|Grünen|1930
QUI|QUI|Marines|1963
LUN|LUN|Blancs|1898
AJC|AJC|Lions|1969
JOY|JOY|Blancs|1904
USM|USM|Gladiateurs|1899
ESB|ESB|Renards|1935
VAL|VAL|Rouges|1924
ETO|ETO|Jaunes|1936
THO|THO|Bleus|1908
ESJ|ESJ|Dragons|1980
LAN|LAN|Aigles|1900
LUR|LUR|Jaunes|1892
QUR|QUR|Dragons|1910
LUO|LUO|Chevaliers|1939
ROC|ROC|Comètes|1945
EST|EST|Lions|1873
VEA|VEA|Noirs|1902
VAR|VAR|Grenats|1896
LNM|LNM|Oranges|1913
CLE|CLE|Verts|1880
PAU|PAU|Pêcheurs|1948
BEF|BEF|Rouges|1921
CHR|CHR|Renards|1894
CEA|CEA|Gladiateurs|1912
CTE|CTE|Oranges|1954
BEU|BEU|Forgerons|1908
CAF|CAF|Blancs|1930
DIA|DIA|Verts|1908
VIE|VIE|Rouges|1942
BEO|BEO|Loups|1888
SRL|SRL|Bleus|1920
AJR|AJR|Cigognes|1878
LNN|LNN|Cerfs|1883
DUR|DUR|Blancs|1907
SRR|SRR|Rouges|1952
CHA|CHA|Loups|1880
VIL|VIL|Rubro-Negros|1880
GUA|GUA|Verdões|1899
GUF|GUF|Ursos|1887
GRE|GRE|Alvinegros|1885
VIM|VIM|Pretos|1982
PIT|PIT|Pretos|1983
UNG|UNG|Azuis|1899
GUI|GUI|Corsários|1904
UNP|UNP|Leões|1895
PIA|PIA|Tucanos|1906
NAC|NAC|Alvinegros|1905
URU|URU|Alvinegros|1912
UBA|UBA|Azuis|1951
JAB|JAB|Azuis|1957
IPA|IPA|Bandeirantes|1970
JAC|JAC|Gaviões|1949
JAF|JAF|Tucanos|1955
UBE|UBE|Gladiadores|1943
GRA|GRA|Verdões|1893
CAT|CAT|Amarelos|1945
USP|USP|Azzurri|1891
VIR|VIR|Bianchi|1865
MON|MON|Celesti|1870
PRO|PRO|Orsi|1891
TRE|TRE|Cavalieri|1976
BEL|BEL|Granata|1897
USB|USB|Celesti|1900
AUD|AUD|Rossi|1906
USF|USF|Gladiatori|1903
FRA|FRA|Azzurri|1909
GUB|GUB|Granata|1894
MIR|MIR|Bianchi|1901
ORV|ORV|Gabbiani|1915
PRF|PRF|Tori|1892
FRS|FRS|Rossi|1952
VIO|VIO|Verdi|1977
AUV|AUV|Gialli|1952
VIC|VIC|Gabbiani|1927
TRS|TRS|Rossi|1902
AUM|AUM|Neri|1916
AUS|AUS|Rossi|1910
GUS|GUS|Neri|1903
VIS|VIS|Cervi|1907
SER|SER|Bianchi|1926
POL|POL|Cavalieri|1873
CRC|CRC|Volpi|1895
ADC|ADC|Bianchi|1939
SEF|SEF|Pionieri|1877
UPX|UPX|Pionieri|1942
JUP|JUP|Bianchi|1931
AUT|AUT|Comete|1899
USS|USS|Tori|1919
VAC|VAC|Cavalieri|1939
SFX|SFX|Gialli|1893
LIB|LIB|Bianchi|1888
FOA|FOA|Bianchi|1932
PRS|PRS|Azzurri|1906
VLT|VLT|Verdi|1884
ASD|ASD|Pescatori|1881
AUF|AUF|Orsi|1970
POR|POR|Rubro-Negros|1900
UNI|UNI|Onças|1863
POA|POA|Ursos|1893
SAN|SAN|Mineiros|1940
GRP|GRP|Brancos|1955
ALE|ALE|Rubro-Negros|1927
GMR|GMR|Dragões|1934
COV|COV|Amarelos|1913
GOU|GOU|Rubro-Negros|1897
ESP|ESP|Amarelos|1937
MAR|MAR|Verdes|1961
CAM|CAM|Verdes|1889
TOM|TOM|Pescadores|1898
ESO|ESO|Pretos|1864
SES|SES|Dragões|1885
LEI|LEI|Rubro-Negros|1949
CVA|CVA|Rubro-Negros|1912
LEF|LEF|Onças|1881
KVA|KVA|Witten|1891
KLE|KLE|Gladiatoren|1862
ZAA|ZAA|Stieren|1910
RKC|RKC|Rooien|1982
VIT|VIT|Vissers|1899
NIE|NIE|Rooien|1948
EXC|EXC|Rooien|1933
VVG|VVG|Rooien|1880
EXH|EXH|Blauwen|1911
KLF|KLF|Zeemeeuwen|1902
ADO|ADO|Rooien|1912
MAA|MAA|Wolven|1947
DVC|DVC|Geelen|1908
ZAS|ZAS|Ruiters|1920
WAA|WAA|Zwarten|1891
LGD|LGD|Oranjes|1930
RKH|RKH|Vikingen|1878
VVZ|VVZ|Witten|1922
SPO|SPO|Albos|1882
BUS|BUS|Azules|1892
NAD|NAD|Celestes|1922
GIM|GIM|Rojos|1884
IND|IND|Ñandúes|1947
LEZ|LEZ|Pescadores|1912
INF|INF|Pampas|1953
DOM|DOM|Toros|1955
QRZ|QRZ|Azules|1928
PUE|PUE|Toros|1956
VEL|VEL|Matadores|1957
REG|REG|Osos|1911
DEP|DEP|Cóndores|1965
DEF|DEF|Amarillos|1978
DOR|DOR|Leones|1917
NAO|NAO|Leones|1944
GAR|GAR|Azules|1944
URQ|URQ|Azules|1972
CAS|CAS|Halcones|1910
DFN|DFN|Rojos|1971
REQ|REQ|Verdes|1925
GAP|GAP|Cóndores|1907
NCN|NCN|Celestes|1903
PEC|PEC|Albos|1943
FRC|FRC|Rojos|1912
TOR|TOR|Negros|1923
COF|COF|Verdes|1949
ARC|ARC|Ñandúes|1938
ASP|ASP|Whites|1993
SIL|SIL|Fire|1938
SIA|SIA|Dragons|1929
SUN|SUN|Voyagers|1942
GOR|GOR|Comets|1935
CHM|CHM|Yellows|1907
MIL|MIL|Lumberjacks|1921
FOS|FOS|Lightning|1961
LAK|LAK|Maroons|1952
FRT|FRT|Pioneers|1963
FOF|FOF|Yellows|1977
SPR|SPR|Rockets|1938
EAG|EAG|Whites|1973
BLU|BLU|Rockets|1914
HIC|HIC|Maroons|1941
CED|CED|Blacks|1975
BEA|BEA|Reds|1985
PIN|PIN|Reds|1927
WHI|WHI|Ironmen|1979
ASE|ASE|Oranges|1920
GOP|GOP|Dragons|1948
CAN|CAN|Reds|1928
MAP|MAP|Maroons|2001
BLS|BLS|Greens|1979
SUS|SUS|Sky Blues|1960
PNF|PNF|Blacks|1920
SUM|SUM|Navy|1961
REN|REN|Storm|1968
GRU|GRU|Blacks|1989
PRA|PRA|Blues|1968
NIS|NIS|Warriors|1932
KIT|KIT|Albatros|1908
SAK|SAK|Reds|1937
SHI|SHI|Navy|1933
SHF|SHF|Phoenixes|1925
AKI|AKI|Blues|1919
MAT|MAT|Blues|1904
ASA|ASA|Navy|1952
HIG|HIG|Blues|1985
NAG|NAG|Yellows|1956
FUJ|FUJ|Knights|1917
MAC|MAC|Oranges|1909
KIK|KIK|Navy|2006
HOK|HOK|Crimsons|1958
OKA|OKA|Oranges|1965
MAS|MAS|Yellows|1958
HIS|HIS|Greens|1912
MTS|MTS|Oranges|1924
NAA|NAA|Reds|1926
AKM|AKM|Hawks|1926
JIL|JIL|Guerreros|1892
TUL|TUL|Azulones|1904
JIU|JIU|Corsarios|1921
COA|COA|Pescadores|1882
JIF|JIF|Azules|1898
LOB|LOB|Rojos|1923
JIC|JIC|Azulones|1971
XAL|XAL|Zorros|1943
OCO|OCO|Verdes|1968
VEN|VEN|Mineros|1928
CTH|CTH|Rojos|1931
OCR|OCR|Águilas|1957
PAC|PAC|Rojos|1958
ZAP|ZAP|Azules|1939
UNX|UNX|Pumas|1904
CUA|CUA|Charros|1959
ZOC|ZOC|Rojos|1910
HAL|HAL|Panteras|1954
GAN|GAN|Knights|2004
CHO|CHO|Greens|1921
CHU|CHU|Reds|1904
CHS|CHS|Shipwrights|1938
SEO|SEO|Silkmen|1963
CHT|CHT|Hawks|1988
CHH|CHH|Sharks|1989
BUJ|BUJ|The Garrison|1973
HAE|HAE|Oranges|1944
GYE|GYE|Cranes|1991
WOL|WOL|Dolphins|1984
GNG|GNG|Silkmen|1970
TAK|TAK|Panthers|2004
UBO|UBO|Navy|1999
NON|NON|Reds|1929
NOA|NOA|Rockets|1952
SIN|SIN|Tigers|1913
SAU|SAU|Blues|1973
UBU|UBU|Blues|1925
KHA|KHA|Reds|1952
KHP|KHP|Knights|1978
UBC|UBC|Reds|1946
WAN|WAN|Knights|1926
PHU|PHU|Blues|2003
SKL|SKL|Crimsons|1961
MUA|MUA|Reds|1984
TKP|TKP|Blues|1958
MUU|MUU|Oranges|1949
BAU|BAU|Blues|1909
UAL|UAL|Reds|1905
AWK|AWK|Blues|1956
AKP|AKP|Greens|1965
ABI|ABI|Lions|1907
ADU|ADU|Elephants|1911
IKA|IKA|Reds|1927
AWU|AWU|Eagles|2005
SHU|SHU|Blues|1905
ADN|ADN|Elephants|1939
OWR|OWR|Blues|1947
SHO|SHO|Greens|1919
UMU|UMU|Elephants|1925
IKU|IKU|Greens|1964
SHA|SHA|Yellows|1985
AKY|AKY|Yellows|1916
ILA|ILA|Blues|1960
AWP|AWP|Greens|1981
AWW|AWW|Reds|1975
ENC|ENC|Yellows|1968
SPT|SPT|Rouges|1902
NAJ|NAJ|Atlas|1907
USN|USN|Atlas|1901
SAF|SAF|Lions|1927
NAN|NAN|Bleus|2008
SID|SID|Jaunes|1909
SIB|SIB|Rouges|1945
TAZ|TAZ|Atlas|2006
NAM|NAM|Rouges|1923
SPI|SPI|Bleus|1983
SIO|SIO|Verts|1954
NED|NED|Verts|1916
CHB|CHB|Léopards|1989
NAH|NAH|Rouges|1974
USO|USO|Gazelles|1964
USA|USA|Lions|1973
RAP|RAP|Crveni|1923
NKJ|NKJ|Crni|1935
ZOR|ZOR|Orlovi|1903
KSD|KSD|Baroni|1919
MLA|MLA|Pivari|1989
VYS|VYS|Lisice|1948
PAR|PAR|Sokolovi|1934
NKK|NKK|Plavi|1924
ZEK|ZEK|Lisice|1994
MLM|MLM|Orlovi|1973
NKB|NKB|Crveni|1949
ZEP|ZEP|Zmajevi|1943
ZEZ|ZEZ|Crveni|1985
RAM|RAM|Crveni|1961
MFK|MFK|Baroni|1955
AOV|AOV|Komete|1968
KON|KON|Blauwen|1891
STS|STS|Kikkers|1952
KFC|KFC|Ruiters|1870
WAG|WAG|Blauwen|1885
KVZ|KVZ|Blauwen|1865
GRO|GRO|Rooien|1888
KRC|KRC|Rooien|1872
KVT|KVT|Wolven|1950
KVN|KVN|Geelen|1939
BEG|BEG|Geelen|1943
NIF|NIF|Zwarten|1913
OUD|OUD|Witten|1892
KLN|KLN|Geelen|1889
OOS|OOS|Rooien|1942
RSC|RSC|Rooien|1882
KZX|KZX|Groenen|1912
DEM|DEM|Kırmızılar|1923
DEG|DEG|Sarılar|1906
YEN|YEN|Siyahlar|1899
AYD|AYD|Bordolar|1930
AKO|AKO|Turuncular|1960
DMB|DMB|Kırmızılar|1920
KAR|KAR|Sarılar|1988
GUL|GUL|Bordolar|1946
KAY|KAY|Mavililer|1950
CNS|CNS|Yeşiller|1948
USE|USE|Yeşiller|1914
BOZ|BOZ|Kırmızılar|1964
BOG|BOG|Turuncular|1932
TEK|TEK|Kırmızılar|1965
CAB|CAB|Sarılar|1971
BOB|BOB|Yeşiller|1959
GLR|GLR|Kartallar|1931
ORH|ORH|Şahinler|1936
HOL|HOL|Červení|1929
TJH|TJH|Vínoví|1908
NYM|NYM|Komety|1920
ZEL|ZEL|Nebesky modří|1983
SLA|SLA|Medvědi|1923
SOK|SOK|Průkopníci|1963
BRN|BRN|Havrani|1953
RYC|RYC|Modří|1949
SOS|SOS|Býci|1938
ZLI|ZLI|Zelení|1940
VSE|VSE|Komety|1965
SPA|SPA|Červení|1915
DUK|DUK|Rytíři|1957
TRF|TRF|Modří|1935
HLD|HLD|Medvědi|1932
STY|STY|Žlutí|1975
GSM|GSM|Nautikoí|1912
PEL|PEL|Prásinoi|1925
DOX|DOX|Korákia|1908
NIK|NIK|Titánes|1930
AEA|AEA|Kítrinoi|1942
AOK|AOK|Lárioi|1981
AEL|AEL|Nautikoí|1979
AEI|AEI|Kítrinoi|1918
TRA|TRA|Kometes|1940
AET|AET|Kókkinoi|1911
ARG|ARG|Prásinoi|1945
PAN|PAN|Galázioi|1925
AOC|AOC|Kókkino Krasí|1921
APO|APO|Kometes|1976
DYR|DYR|Vikinger|1972
DYI|DYI|De Røde|1902
BRK|BRK|De Blå|1884
HLV|HLV|De Hvide|1900
IKB|IKB|Ørne|1871
KIL|KIL|De Blå|1891
LNG|LNG|De Hvide|1877
HAV|HAV|De Røde|1900
STN|STN|De Blå|1880
FRM|FRM|Rever|1895
FJO|FJO|Ulve|1910
FRD|FRD|De Blå|1892
SNX|SNX|De Blå|1880
RIN|RIN|Pionerer|1898
FRN|FRN|Vikinger|1897
GAM|GAM|De Blå|1908
KSJ|KSJ|Niebiescy|1900
RAD|RAD|Pionierzy|1939
KSS|KSS|Wilki|1980
UNW|UNW|Pionierzy|1919
GKS|GKS|Niebiescy|1962
KSR|KSR|Biali|1901
BUD|BUD|Czerwoni|1916
LKS|LKS|Gladiatorzy|1995
STB|STB|Żółci|1928
RUC|RUC|Pomarańczowi|1982
ZAG|ZAG|Niebiescy|1971
DAB|DAB|Żółci|1939
WOX|WOX|Górnicy|1915
DOL|DOL|Zieloni|1981
ZAE|ZAE|Kosynierzy|1940
KSN|KSN|Żółci|1967
GKB|GKB|Niebiescy|1955
GWA|GWA|Pomarańczowi|1937
BJR|BJR|De Hvide|1890
BRO|BRO|De Sorte|1967
STF|STF|Vikinger|1869
VES|VES|Bjørner|1902
FRE|FRE|De Røde|1927
HFX|HFX|De Blå|1876
NOR|NOR|De Røde|1927
NOI|NOI|De Grønne|1953
IKS|IKS|Pionerer|1900
MAK|MAK|De Blå|1877
NRD|NRD|De Røde|1915
ASK|ASK|De Røde|1899
GOL|GOL|Weißen|1938
OBE|OBE|Schwarzen|1872
SCH|SCH|Füchse|1900
COB|COB|Weinroten|1875
HAN|HAN|Schwarzen|1894
BAC|BAC|Schwarzen|1930
RHE|RHE|Kumpel|1903
GEF|GEF|Blauen|1930
OBM|OBM|Falken|1931
VKT|VKT|Schwarzen|1934
GEN|GEN|Raben|1866
FSK|FSK|Pioniere|1893
HOF|HOF|Löwen|1886
BOR|BOR|Gelben|1872
ENE|ENE|Weinroten|1903
ROT|ROT|Schwarzen|1961
FSN|FSN|Rothirsche|1982
ROW|ROW|Grünen|1904
FOT|FOT|Weißen|1876
HOH|HOH|Pioniere|1900
HOS|HOS|Gladiatoren|1927
TEO|TEO|Weißen|1914
BEH|BEH|Roten|1877
TEB|TEB|Stahlwerker|1953
STR|STR|Greens|1864
STA|STA|Fishermen|1890
MOU|MOU|Clansmen|1870
LAA|LAA|Reds|1864
MOI|MOI|Greens|1873
BAL|BAL|Yellows|1877
MID|MID|Oranges|1898
KIB|KIB|Blues|1901
JED|JED|Fishermen|1902
MIK|MIK|Navy|1918
TAY|TAY|Pipers|1920
KIO|KIO|Navy|1919
WOD|WOD|Miners|1958
GEJ|GEJ|Sky Blues|1934
WOF|WOF|Navy|1918
GEV|GEV|Reds|1945
MOB|MOB|Magpies|1932
MOT|MOT|Koalas|1901
CFF|CFF|Navy|1972
NOW|NOW|Reds|1942
TAM|TAM|Emus|1978
BAS|BAS|Crocs|1988
PRT|PRT|Blues|1954
COM|COM|Maroons|1924
BAR|BAR|Zöldek|1932
GYO|GYO|Úttörők|1944
DUN|DUN|Zöldek|1926
ZAL|ZAL|Sólymok|1910
SRT|SRT|Kékek|1966
GYA|GYA|Kékek|1973
BAV|BAV|Bordók|1910
ORS|ORS|Bányászok|1951
KAL|KAL|Vörösök|1933
ZAF|ZAF|Gladiátorok|1919
NGY|NGY|Vörösök|1931
ORR|ORR|Vörösök|1979
LIS|LIS|Harps|1881
LIW|LIW|Greens|1884
ORA|ORA|Reds|1950
COU|COU|Clansmen|1941
NEW|NEW|Reds|1929
POC|POC|Hurlers|1946
ATH|ATH|Gaels|1939
SLI|SLI|Corsairs|1883
NWL|NWL|Blues|1891
CAK|CAK|Rebels|1898
TAL|TAL|Choristers|1931
LLA|LLA|Ravens|1900
DOC|DOC|Whites|1930
CLY|CLY|Quarrymen|1886
ABE|ABE|Choristers|1878
CAH|CAH|Yellows|1947
BLN|BLN|Yellows|1902
BLW|BLW|Reds|1952
PEN|PEN|Choristers|1926
TEN|TEN|Choristers|1916
BNG|BNG|Harpers|1892
BAH|BAH|Drovers|1911
JAN|JAN|Horsemen|1946
SAH|SAH|Yellows|1973
YAS|YAS|Yellows|2001
SAR|SAR|Greens|1962
FUR|FUR|Horsemen|1962
WAF|WAF|Tigers|1905
HAQ|HAQ|Gazelles|1935
UFU|UFU|Lions|1921
RAY|RAY|Reds|1939
IBD|IBD|Sky Blues|1989
SAQ|SAQ|Knights|1919
SAA|SAA|Yellows|1936
TAQ|TAQ|Sandstorm|1971
HAD|HAD|Reds|1985
ASL|ASL|Reds|1928
DHI|DHI|Reds|1898
RIA|RIA|Falcons|1946
NAK|NAK|Tigers|1982
ZAM|ZAM|Yellows|1970
TAF|TAF|Yellows|1916
QAM|QAM|Horsemen|1942
ZAH|ZAH|Tigers|1936
AIN|AIN|Eagles|1966
WAD|WAD|Eagles|1986
TAT|TAT|Greens|1967
RAS|RAS|Greens|1997
SHJ|SHJ|Reds|1912
KAA|KAA|Hawks|1941
TAH|TAH|Greens|1980
WAI|WAI|Reds|1920
MAW|MAW|Yellows|1983
QIM|QIM|Horsemen|1930
NIM|NIM|Gazelles|1972
AAD|AAD|Greens|1948
NOU|NOU|Greens|1967
KHL|KHL|Blues|1999
BAN|BAN|Sky Blues|1976
TAJ|TAJ|Yellows|1928
BAM|BAM|Oranges|2008
BND|BND|Reds|1989
LTJ|LTJ|Reds|1928
KAM|KAM|Oranges|1977
TMN|TMN|Reds|1918
TES|TES|Eagles|1920
LTS|LTS|Stags|1977
TAA|TAA|Reds|1952
TAN|TAN|Sky Blues|1950
BUK|BUK|Deer|1933
PUL|PUL|Blacks|1940
SIM|SIM|Panthers|1927
SIP|SIP|Sky Blues|1986
TEL|TEL|Turtles|1943
TEP|TEP|Deer|1922
SUP|SUP|Yellows|1906
SRI|SRI|Yellows|1941
SIT|SIT|Deer|1979
PUT|PUT|Reds|1948
PUA|PUA|Reds|1958
SMP|SMP|Blues|2008
PUI|PUI|Deer|1988
BIN|BIN|Falcons|1979
THE|THE|Yellows|1967
BUF|BUF|Tigers|1988
VIN|VIN|Whites|1930
THM|THM|Yellows|1913
THL|THL|Falcons|1928
HTF|HTF|Blues|1956
SON|SON|Reds|1904
THT|THT|Reds|1949
LKC|LKC|Yellows|1933
LON|LON|Dragons|1978
THH|THH|Dragons|1913
BAO|BAO|Yellows|1934
SOH|SOH|Dragons|1937
KED|KED|Blues|1930
LAF|LAF|Oranges|1919
PER|PER|Greens|1899
PSP|PSP|Blues|1955
PES|PES|Tigers|1956
LAG|LAG|Reds|1937
SUR|SUR|Oranges|1925
BHS|BHS|Eagles|1931
BHA|BHA|Eagles|1980
BHT|BHT|Crimsons|1932
PEI|PEI|Crocodiles|1954
PEK|PEK|Tigers|1912
PST|PST|Tigers|1972
TAP|TAP|Blues|1934
PPX|PPX|Eagles|1943
BHP|BHP|Greens|1970
PSA|PSA|Panthers|1961
PUR|PUR|Yellows|1990
BIF|BIF|Warriors|2008
BIW|BIW|Whites|1982
BAG|BAG|Sky Blues|1927
PAS|PAS|Reds|2008
BAW|BAW|Yellows|1934
MAF|MAF|Eagles|1952
PAF|PAF|Yellows|1942
CBY|CBY|Sharks|1953
BIU|BIU|Sparks|1931
PAM|PAM|Crimsons|1922
LAD|LAD|Workmen|1950
NES|NES|Yellows|1903
NEL|NEL|Blacks|1939
LDF|LDF|Blues|1942
KRU|KRU|Swallows|1969
SBL|SBL|Swallows|1958
THA|THA|Greens|1920
THB|THB|Yellows|1921
LAS|LAS|Maroons|1968
SAS|SAS|Whites|1957
MAB|MAB|Whites|1927
THS|THS|Whites|1971
VRE|VRE|Blues|1963
THF|THF|Swallows|1930
BET|BET|Reds|1914
ULU|ULU|Lions|1980
ZFR|ZFR|Sandstorm|1922
NJH|NJH|Whites|1935
NIL|NIL|Horsemen|1917
TAW|TAW|Greens|1939
SLM|SLM|Foxes|1938
ITT|ITT|Horsemen|1914
FAU|FAU|Gazelles|1971
KAF|KAF|Camels|1961
DAM|DAM|Blues|1986
POT|POT|Lions|2008
TAI|TAI|Reds|1965
ITA|ITA|Navy|1981
SOF|SOF|Reds|1994
BEI|BEI|Yellows|1936
ZOH|ZOH|Sandstorm|2003
ITD|ITD|Greens|1971
HIL|HIL|Sandstorm|1934
SUA|SUA|Blues|1960
MOE|MOE|Rouges|1928
MNE|MNE|Brasseurs|1927
VND|VND|Mouettes|1921
ESA|ESA|Noirs|1909
BEE|BEE|Bleus|1987
SAO|SAO|Faucons|1939
UMV|UMV|Verts|1967
SCB|SCB|Aigles|1972
BOU|BOU|Ours|1945
CHF|CHF|Verts|1902
NAE|NAE|Pêcheurs|1967
ETM|ETM|Comètes|1949
NNC|NNC|Rouges|1937
NNE|NNE|Rouges|1988
TAB|TAB|Cheetahs|1932
TAC|TAC|Reds|1897
SAM|SAM|Sky Blues|1923
RUV|RUV|Yellows|1995
MRM|MRM|Navy|1974
TBT|TBT|Blues|1937
TBK|TBK|Warriors|1923
MTW|MTW|Yellows|1970
KIS|KIS|Elephants|1961
KIG|KIG|Eagles|1935
SOC|SOC|Elephants|1986
SMM|SMM|Simbas|1913
MRT|MRT|Reds|1898
KBG|KBG|Eagles|1917
YOU|YOU|Blues|1964
KIU|KIU|Stars|1961
CHV|CHV|Jaunes|1901
THR|THR|Rouges|1932
THI|THI|Renards|1938
AJM|AJM|Cerfs|1899
NAF|NAF|Corbeaux|1928
MIO|MIO|Pêcheurs|1928
BEC|BEC|Mineurs|1968
SPC|SPC|Rouges|1926
MNV|MNV|Verts|1927
TRL|TRL|Verts|1959
SAG|SAG|Mineurs|1961
VLL|VLL|Cerfs|1915
FNR|FNR|Ours|1943
CHP|CHP|Verts|1958
LAE|LAE|Bleus|1951
USC|USC|Rouges|1928
XAN|XAN|Kítrinoi|1934
GSX|GSX|Ierakes|1915
AOS|AOS|Taýroi|1916
ETH|ETH|Kítrinoi|1926
PAK|PAK|Arkoúdes|1929
KYP|KYP|Galázioi|1925
NII|NII|Kítrinoi|1925
PAE|PAE|Galázioi|1973
PAL|PAL|Léontes|1968
GXX|GXX|Prásinoi|1934
PAT|PAT|Prásinoi|1917
AKX|AKX|Psarádes|1942
AEK|AEK|Spartiátes|1985
AOM|AOM|Ippótes|1945
AOB|AOB|Plavi|1899
KAS|KAS|Pivari|1926
TUR|TUR|Beli|1912
RAO|RAO|Lavovi|1922
RUD|RUD|Crveni|2008
PAP|PAP|Zeleni|1985
MFP|MFP|Lisice|1968
RAR|RAR|Sokolovi|2008
MFV|MFV|Bikovi|1938
MLG|MLG|Beli|1972
HED|HED|Bjørner|1866
DYF|DYF|Bjørne|1900
GAF|GAF|De Blå|1867
GMM|GMM|Rever|1893
HOB|HOB|De Blå|1881
FRH|FRH|De Gule|1927
DYB|DYB|Elge|1879
ISN|ISN|De Hvide|1875
ALS|ALS|Fiskere|1876
STO|STO|De Blå|1966
BRI|BRI|De Gule|1911
SND|SND|De Røde|1923
STK|STK|De Blå|1887
SBX|SBX|De Røde|1909
DYY|DYY|De Grønne|1903
SYD|SYD|Rever|1903
MET|MET|Bikovi|1919
STI|STI|Medvedi|1990
ZEN|ZEN|Plavi|1929
SPD|SPD|Plavi|1934
SPK|SPK|Lavovi|1927
MEL|MEL|Crveni|1922
DNJ|DNJ|Lavovi|1966
AOL|AOL|Bikovi|1930
DOU|DOU|Lavovi|1921
KAU|KAU|Crveni|1928
BRS|BRS|Orlovi|1909
RAN|RAN|Plavi|1952
KSP|KSP|Plavi|1911
DOJ|DOJ|Baroni|1942
RAB|RAB|Ribari|1966
LOK|LOK|Plavi|1939
VLD|VLD|Blancos|1926
ARO|ARO|Rayos|1925
AOA|AOA|Lobos|1922
HIN|HIN|Negros|1950
VAE|VAE|Amarillos|1932
POD|POD|Lobos|1898
MAD|MAD|Rojos|1942
TLR|TLR|Águilas|2005
LIU|LIU|Amarillos|1913
GUD|GUD|Cóndores|1982
GDR|GDR|Azules|1913
ATO|ATO|Blancos|1931
LIR|LIR|Blancos|1941
ARN|ARN|Azules|1938
SNT|SNT|Leñadores|1925
ROB|ROB|Halcones|1967
ESU|ESU|Amarillos|1894
DEO|DEO|Albos|1921
RGT|RGT|Arrieros|1909
PUF|PUF|Leones|1999
RDD|RDD|Matadores|1921
VEC|VEC|Negros|1890
SPL|SPL|Gladiadores|1893
INB|INB|Azules|1945
CST|CST|Azules|1905
SRN|SRN|Cruzados|1889
RDL|RDL|Albos|1917
ESE|ESE|Gladiadores|1948
DEE|DEE|Rayos|1922
SIV|SIV|Verdes|1968
GMN|GMN|Matadores|1900
SVO|SVO|Halcones|1922
VAB|VAB|Verdes|1917
POS|POS|Toros|1921
CAA|CAA|Rojos|1900
PEB|PEB|Rojos|1916
PZA|PZA|Rojos|1894
CRA|CRA|Verdes|1911
GND|GND|Blancos|1908
MAE|MAE|Gladiadores|1896
VAD|VAD|Rojos|1922
ORI|ORI|Toros|1933
BAI|BAI|Amarillos|1900
FNT|FNT|Halcones|1904
CEV|CEV|Amarillos|1903
ELU|ELU|Titanes|1962
NUM|NUM|Cóndores|1950
LUC|LUC|Amarillos|1966
TAU|TAU|Jaguares|1961
CNJ|CNJ|Leñadores|1954
BAJ|BAJ|Rojos|1917
NUT|NUT|Mineros|1894
BRB|BRB|Oranges|1973
GRN|GRN|Saints|1931
BON|BON|Maroons|1969
HOR|HOR|Posh|1957
TIV|TIV|Falcons|1922
COD|COD|Skyhawks|1978
CLW|CLW|Flames|1942
HAY|HAY|Badgers|1974
BUA|BUA|Lions|1940
IZZ|IZZ|Reds|1989
MAJ|MAJ|Whites|1989
JAA|JAA|Hawks|1939
WAT|WAT|Hawks|1986
JEA|JEA|Oranges|1957
YAQ|YAQ|Tigers|1907
SHQ|SHQ|Oranges|1948
RIM|RIM|Sandstorm|1935
DHA|DHA|Gazelles|1954
HUR|HUR|Greens|1978
NAW|NAW|Yellows|1922
FAA|FAA|Yellows|1945
SHB|SHB|Lions|1975
MES|MES|Tigers|1911
NAS|NAS|Camels|1915
GOS|GOS|Gazelles|1929
FAJ|FAJ|Reds|1934
PAY|PAY|Reds|1932
ZOB|ZOB|Yellows|1999
NSS|NSS|Yellows|1915
NFT|NFT|Eagles|1914
PSY|PSY|Falcons|1916
GOB|GOB|Blues|2007
PYK|PYK|Sandstorm|1903
MOH|MOH|Blues|1939
SEY|SEY|Lions|2008
BAB|BAB|Yellows|1941
FAB|FAB|Lions|1985
SHD|SHD|Oranges|1956
IHS|IHS|Tigers|1988
BHY|BHY|Reds|1997
UMM|UMM|Reds|1977
ULI|ULI|Whites|1954
GHA|GHA|Hawks|1899
RIY|RIY|Yellows|1944
DIR|DIR|Maroons|1926
AIM|AIM|Yellows|1930
BUU|BUU|Gazelles|1926
ABC|ABC|Greens|1909
ABA|ABA|Blues|1928
SHM|SHM|Lions|1932
MEI|MEI|Cranes|1977
JIN|JIN|Stars|1898
MED|MED|Blues|1938
DON|DON|Eagles|1899
KAI|KAI|Reds|1976
HEN|HEN|Greens|1960
BSH|BSH|Blues|1915
LOP|LOP|Yellows|1966
BEY|BEY|Reds|1981
WUJ|WUJ|Yellows|1932
BAF|BAF|Eagles|1914
SHE|SHE|Pandas|1983
CHN|CHN|Pandas|1925
MEY|MEY|Cranes|1926
CHD|CHD|Blues|1978
XYA|XYA|Reds|1928`
      .split('\n')
      .map((l) => l.split('|'))
      .map(([code, abbr, nick, founded]) => [code, [abbr, nick, founded ? +founded : null]]),
  );

  FM.D.RIVALS.push(
    ['BAN', 'TAJ', 'Kalir–Bisris Derby'],
    ['BUK', 'TAN', 'Tanjungsera–Sungaiar Derby'],
    ['BIN', 'THE', 'Quangiang Derby'],
    ['BUF', 'THE', 'Quangiang Derby'],
    ['LAF', 'KED', 'Purkasar–Tangukasar Derby'],
    ['PER', 'PSP', 'Cirenang–Gianri Derby'],
    ['NES', 'NEL', 'Nelstad Derby'],
    ['LAD', 'NES', 'Ladefontein–Nelstad Derby'],
    ['BIF', 'BIW', 'Tacailao Derby'],
    ['THA', 'THB', 'Thabstad Derby'],
    ['KON', 'KVT', 'Tilkerk Derby'],
    ['KFC', 'KRC', 'Sneekvoort–Dijkhout Derby'],
    ['DEM', 'DEG', 'Demehir Derby'],
    ['YEN', 'AYD', 'Demehir–Aydbahçe Derby'],
    ['HOL', 'TJH', 'Holava Derby'],
    ['GSM', 'PEL', 'Marópetra–Pelos Derby'],
    ['NIK', 'AEA', 'Agouli Derby'],
    ['HLV', 'IKB', 'Holvang–Bergø Derby'],
    ['SNX', 'FRM', 'Sønderfors Derby'],
    ['UNW', 'KSJ', 'Wielki Siedlec–Jarosice Derby'],
    ['BUD', 'LKS', 'Słupówka–Rybnów Derby'],
    ['BJR', 'STF', 'Bjørnstrup–Strandsund Derby'],
    ['SCH', 'COB', 'Brantal Derby'],
    ['OBE', 'GEN', 'Oberweiler Derby'],
    ['HOF', 'FOT', 'Holzberg–Hohen Waldheim Derby'],
    ['HOH', 'BOR', 'Hohen Waldheim–Bachburg Derby'],
    ['STR', 'STA', 'Strathshiels Derby'],
    ['MOU', 'MOI', 'Upper Moffock Derby'],
    ['MID', 'MIK', 'Mid Kilness Derby'],
    ['WOD', 'WOF', 'Wodoville Derby'],
    ['GEJ', 'GEV', 'Geralnup Derby'],
    ['GEJ', 'WOF', 'Geralnup–Wodoville Derby'],
    ['BAR', 'BAV', 'Barahegy Derby'],
    ['BAR', 'ZAF', 'Barahegy Derby'],
    ['LIS', 'COU', 'Lisbridge Derby'],
    ['LIW', 'NEW', 'Lisbridge Derby'],
    ['ORA', 'LIW', 'Oranglass–Lisbridge Derby'],
    ['TAL', 'LLA', 'Talbach–Llangnant Derby'],
    ['DOC', 'BAH', 'Dolgwyn–Bangorddu Derby'],
  );
})();

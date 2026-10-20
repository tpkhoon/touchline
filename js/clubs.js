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
    ['Redworth Athletic', 'REA', 'Redworth', '#F18A01', '#000000', 'fan', 53, 'Stratdon Park', 25586],
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
    ['New Lamwold United', 'LAM', 'Lamwold', '#0070B5', '#FFFFFF', 'fallen', 49, 'Stafcaster Road', 33280],
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
    ['North Yeothorpe Albion', 'YTH', 'Yeothorpe', '#E2001A', '#FFFFFF', 'youth', 38, 'Folbury Park', 10153],
    ['South Lamere Rovers', 'LMR', 'South Lamere', '#E2001A', '#FFFFFF', 'fan', 38, 'Petley Park', 5327],
    ['Milcaster Athletic', 'MIA', 'Milcaster', '#0033A0', '#FFFFFF', 'historic', 39, 'Camstow Lane', 11582],
    ['AFC Evercliff', 'EVA', 'Evercliff', '#000000', '#FFFFFF', 'historic', 39, 'The Exwold Stadium', 9052],
    ['Prescaster United', 'PRU', 'Prescaster', '#FFD700', '#000000', 'fan', 35, 'Dunchester Road', 5000],
    ['Harwood United', 'HAR', 'Harwood', '#FFFFFF', '#000000', 'selling', 41, 'Wendford Park', 30500],
    ['Pickdale Harriers', 'PIC', 'Pickdale', '#F79A20', '#000000', 'fan', 36, 'Pickdale Ground', 7850],
    ['Church Epington Wanderers', 'CUR', 'Epington', '#000000', '#FFFFFF', 'historic', 41, 'Witby Road', 19841],
    ['Shirworth Athletic', 'SHR', 'Shirworth', '#0033A0', '#FFFFFF', 'fallen', 38, 'Shirworth Park', 13512],
    ['Old Yeowick City', 'YEO', 'Old Yeowick', '#E2001A', '#FFFFFF', 'oil', 40, 'Sandington Road', 5108],
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
    ['JAN', 'SAH', 'Jahib Derby'],
    ['YAS', 'SAR', 'Khasya Derby'],
    ['JAN', 'YAS', 'Jahib–Khasya Derby'],
    ['WAF', 'TAQ', 'Jahib Derby'],
    ['SAA', 'DHI', 'Hidar Derby'],
    ['IBD', 'ASL', 'Rifiyah–Tafiyah Derby'],
    ['ZAH', 'YAS', 'Jawiq–Khasya Derby'],
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
    ['ZFR', 'NJH', 'Idkan–Luxan Derby'],
    ['NIL', 'FAU', 'Idkan Derby'],
    ['ITT', 'POT', 'Mahut Derby'],
    ['MOE', 'MNE', 'Kasouane Derby'],
    ['NAE', 'NNE', 'Mahoune Derby'],
    ['TAB', 'TAC', 'Tabanga Derby'],
    ['SAM', 'SOC', 'Tabanga Derby'],
    ['THR', 'AJM', 'Hassida Derby'],
    ['THI', 'BEC', 'Hassida Derby'],
    ['XAN', 'GSX', 'Xanópoli Derby'],
    ['AOS', 'ETH', 'Seránia Derby'],
    ['PAK', 'KYP', 'Kypánia Derby'],
    ['AOB', 'KAS', 'Belany–Kamovac Derby'],
    ['HED', 'HOB', 'Norvik–Västad Derby'],
    ['DYF', 'GAF', 'Sigköping–Linholm Derby'],
    ['GMM', 'SND', 'Linholm Derby'],
    ['MET', 'SPK', 'Vatău Derby'],
    ['VLD', 'HIN', 'Valdemiel–Hinojiel Derby'],
    ['VAE', 'MAD', 'Valdemiel Derby'],
    ['ARO', 'AOA', 'Arroar Derby'],
    ['ESU', 'DEO', 'Ortas Derby'],
    ['RGT', 'PUF', 'Ortas Derby'],
    ['VAB', 'VAD', 'Valal Derby'],
    ['POS', 'PZA', 'Poza Derby'],
    ['CAA', 'CRA', 'Cabral Derby'],
    ['BUA', 'IZZ', 'Ain Jahiq–Bahan Derby'],
    ['JAA', 'YAQ', 'Bahan Derby'],
    ['MAJ', 'SHB', 'Basra Derby'],
    ['MES', 'NAS', 'Qazud Derby'],
    ['GOS', 'PSY', 'Shahr Yazvin Derby'],
    ['IHS', 'BHY', 'Muhib Derby'],
    ['ULI', 'GHA', 'Muhib Derby'],
    ['MEI', 'MED', 'Ningbin Derby'],
    ['BAK', 'BEK', 'Banlek Derby'],
    ['PUB', 'PUC', 'Purapura Derby'],
    ['BOA', 'BHB', 'Bogodongan Derby'],
    ['MAH', 'MAL', 'Mankot Derby'],
    ['PIE', 'PIO', 'Piedero Derby'],
    ['FUB', 'FUL', 'Fuental Derby'],
    ['CAP', 'CAQ', 'Calatana Derby'],
    ['LAV', 'LAH', 'Lavona Derby'],
    ['DAL', 'LOU', 'Dalgou Derby'],
    ['WAR', 'WAB', 'Wara Derby'],
    ['ACE', 'KAD', 'Kaogou Derby'],
    ['SPE', 'DCK', 'Daklack Derby'],
    ['YAA', 'ACY', 'Yamssou Derby'],
    ['MSO', 'MAX', 'Mansso Derby'],
    ['ZIA', 'ZIZ', 'Zigbia Derby'],
    ['NOC', 'NAL', 'Nouveau Katmbé Derby'],
    ['OUS', 'OUO', 'Ousso Derby'],
    ['NOO', 'NOD', 'Nouveau Ouya Derby'],
    ['MAZ', 'MLB', 'Manbala Derby'],
    ['MBE', 'MRE', 'Mbuguéré Derby'],
    ['VIF', 'VIG', 'Vilães de Cima Derby'],
    ['GDD', 'AMC', 'Lagela Derby'],
    ['POE', 'POO', 'Portouro de Cima Derby'],
    ['VIJ', 'OSS', 'Ovarães Derby'],
    ['NAP', 'COC', 'Covães Derby'],
    ['PRY', 'PRB', 'Pryske Derby'],
    ['BUC', 'POG', 'Kovets Derby'],
    ['KAG', 'KAH', 'Kamyne Derby'],
    ['SLE', 'PAH', 'Velika Tolica Derby'],
    ['SGA', 'ZEC', 'Zelava Derby'],
    ['DOD', 'DOE', 'Dolnina Derby'],
    ['DOF', 'DID', 'Donji Novek Derby'],
    ['ZET', 'MEC', 'Lezaj Derby'],
    ['VEB', 'DIV', 'Velava Derby'],
    ['HVA', 'HRH', 'Hradava Derby'],
    ['SLK', 'KRD', 'Dimovtsi Derby'],
    ['SCE', 'MEB', 'Targrad Derby'],
    ['DIB', 'BEJ', 'Kyets Derby'],
    ['NEA', 'NEB', 'Hämjärvi Derby'],
    ['SOE', 'SOG', 'Ytri Þordalur Derby'],
    ['SYA', 'SYE', 'Hellanes Derby'],
    ['TSK', 'TSI', 'Dzani Derby'],
    ['BNE', 'HAP', 'Nesia Derby'],
    ['MBI', 'MNA', 'Nesona Derby'],
    ['REH', 'BEM', 'Rehovona Derby'],
    ['ARZ', 'TRU', 'Arzbor Derby'],
    ['NAQ', 'SSK', 'Slonensk Derby'],
    ['GAI', 'GAE', 'Gainbridge Derby'],
    ['YES', 'YEB', 'Yestana Derby'],
    ['COE', 'COG', 'Cordares Derby'],
    ['MNB', 'MMA', 'Marbana Derby'],
    ['COH', 'ALM', 'Cordeda Derby'],
    ['OLE', 'OLN', 'Olmón Derby'],
    ['REE', 'REF', 'Spanish Winwood Derby'],
    ['WOB', 'WCK', 'Linford Derby'],
    ['SEE', 'SEH', 'Segovete Derby'],
    ['LIE', 'LDA', 'Lioreda Derby'],
    ['POK', 'POM', 'Pozal Derby'],
    ['YEC', 'YRO', 'Yestero Derby'],
    ['QUS', 'QES', 'Quintares Derby'],
    ['YAN', 'YAI', 'Yangi Andchik Derby'],
    ['GRF', 'CRE', 'Paley Derby'],
    ['HEX', 'HTH', 'Rotstown Derby'],
    ['ALR', 'AAL', 'Zarayn Derby'],
    ['ALX', 'ALY', 'Sohiyah Derby'],
    ['SIG', 'SIE', 'Raplru Derby'],
    ['ALC26', 'ALD27', 'Jēkpils Derby'],
    ['SIH', 'SLC', 'Rūjene Derby'],
    ['ALE28', 'AAA', 'Igniai Derby'],
    ['HAG', 'HVB', 'Paneviai Derby'],
    ['WIB', 'RUS', 'Masashen Derby'],
    ['BUY', 'BUE', 'Qubvan Derby'],
    ['FAR', 'NHA', 'Temozen Derby'],
    ['MIC', 'RUB', 'Crești Derby'],
    ['ZEH', 'STM', 'Ștefești Derby'],
    ['PLE', 'SLG', 'Ferër Derby'],
    ['ALG30', 'JUA', 'Ajlib Derby'],
    ['ALL34', 'AJE', 'Liwar Derby'],
    ['ALQ38', 'RIS', 'Faliyah Derby'],
    ['RAG', 'ALS40', 'Wadi Jawayr Derby'],
    ['ALT41', 'ALU42', 'Mafayr Derby'],
    ['HOE', 'HOM', 'Shah Attogarh Derby'],
    ['VIP', 'VIQ', 'Daskapind Derby'],
    ['AUR', 'AAM', 'Mardpind Derby'],
    ['NAX', 'NEJ', 'Dinahat Derby'],
    ['BUN', 'BOP', 'Isola Derby'],
    ['BUM', 'BUP', 'Monla Derby'],
    ['WEA', 'WEL', 'Mpila Derby'],
    ['SHG', 'SHN', 'Masdura Derby'],
    ['HOG', 'HOJ', 'Marnyoka Derby'],
    ['CAY', 'CAZ', 'Oyaka Derby'],
    ['FOC', 'LEW', 'Wakuma Derby'],
    ['BRH', 'BRJ', 'Bugabi Derby'],
    ['MAK33', 'WAY', 'Asella Derby'],
    ['WEN', 'WEY', 'Jimama Derby'],
    ['BAH31', 'BAJ32', 'Banbala Derby'],
    ['DAF', 'DAG', 'Dalré Derby'],
    ['PON', 'POP', 'Porto Covares Derby'],
    ['OVA', 'DES', 'Ovarais Derby'],
    ['BEW', 'BEZ', 'Benavador Derby'],
    ['HAM', 'HAW', 'Caluco Derby'],
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
    ['Al Jahib', 'JAN', 'Jahib', '#0057B8', '#FFFFFF', 'oil', 72, 'Jahib Stadium', 60000],
    ['Al Mawj', 'SAH', 'Jahib', '#FFD100', '#00247D', 'oil', 71, 'Ibrayn Arena', 25000],
    ['Al Nawras', 'YAS', 'Khasya', '#FFD100', '#000000', 'oil', 69, 'Prince Dahan Stadium', 62000],
    ['Al Salam', 'SAR', 'Khasya', '#006C35', '#FFFFFF', 'oil', 67, 'Khasya Sports City', 27000],
    ['Al Qamar', 'FUR', 'Wadi Mafya', '#FFD100', '#CE1126', 'oil', 62, 'Wadi Mafya Sports City', 20000],
    ['Al Hawiq', 'WAF', 'Jahib', '#FFFFFF', '#CE1126', 'historic', 60, 'Prince Saayr Stadium', 20000],
    ['Al Sharq', 'HAQ', 'Ramar', '#006C35', '#FFFFFF', 'oil', 59, 'Ramar Sports City', 35000],
    ['Al Ain Quriq', 'UFU', 'Ain Quriq', '#00B2A9', '#FFFFFF', 'oil', 58, 'Madiyah Arena', 20000],
    ['Al Aseel', 'RAY', 'Sitib', '#CE1126', '#FFFFFF', 'oil', 56, 'Sitya Stadium', 15000],
    ['Al Fursan', 'IBD', 'Rifiyah', '#00A9E0', '#FFFFFF', 'fan', 56, 'Dahayr Stadium', 20000],
    ['Al Samib', 'SAQ', 'Samib', '#8A1538', '#FFFFFF', 'oil', 55, 'Prince Irbayr Stadium', 20000],
    ['Hidar SC', 'SAA', 'Hidar', '#FFD100', '#CE1126', 'fan', 55, 'Hidar Sports City', 25000],
    ['Al Madan SC', 'TAQ', 'Jahib', '#0057B8', '#FFD100', 'oil', 54, 'Bahiyah Stadium', 22000],
    ['Al Jawib', 'HAD', 'Jawib', '#CE1126', '#FFD100', 'youth', 53, 'Jawayn Arena', 15000],
    ['Al Ufuq', 'ASL', 'Tafiyah', '#CE1126', '#FFFFFF', 'fan', 52, 'Tafiyah Stadium', 18000],
    ['Shabab Hidar', 'DHI', 'Hidar', '#CE1126', '#FFFFFF', 'historic', 52, 'Madra Stadium', 25000],
    ['Keriq Club', 'RIA', 'Keriq', '#00A9E0', '#FFFFFF', 'fan', 50, 'Prince Zalib Stadium', 15000],
    ['Wadi Madan SC', 'NAK', 'Wadi Madan', '#006C35', '#FFFFFF', 'fan', 50, 'Muhayr Stadium', 12000],
  ];
  FM.D.CLUBS_SA2 = [
    ['Sitib SC', 'ZAM', 'Sitib', '#FFD100', '#CE1126', 'fan', 47, 'Shinar Arena', 15000],
    ['Wadi Liwib SC', 'TAF', 'Wadi Liwib', '#FFD100', '#CE1126', 'oil', 46, 'Khasayn Stadium', 10000],
    ['Sitya SC', 'QAM', 'Sitya', '#FFD100', '#0057B8', 'oil', 46, 'Prince Nakan Stadium', 20000],
    ['Jawiq Club', 'ZAH', 'Jawiq', '#CE1126', '#FFFFFF', 'historic', 46, 'Prince Fariq Stadium', 38000],
    ['Rifiyah Club', 'AIN', 'Rifiyah', '#00A9E0', '#FFFFFF', 'oil', 45, 'Prince Bara Stadium', 20000],
    ['Wadi Liwib Club', 'WAD', 'Wadi Liwib', '#006C35', '#FFFFFF', 'fan', 44, 'Zarayn Arena', 10000],
    ['Sahayr SC', 'TAT', 'Sahayr', '#006C35', '#FFD100', 'oil', 44, 'Sahayr Sports City', 15000],
    ['Al Izz', 'RAS', 'Zalayn', '#006C35', '#FFFFFF', 'oil', 44, 'Zalayn Stadium', 10000],
    ['Shabab Shinib', 'SHJ', 'Shinib', '#CE1126', '#FFFFFF', 'historic', 44, 'Prince Rifah Stadium', 10000],
    ['Al Wadi Sahayr', 'KAA', 'Sahayr', '#FFD100', '#CE1126', 'fan', 43, 'Prince Sahan Stadium', 18000],
    ['Shabab Wadi Jahah', 'TAH', 'Jahah', '#006C35', '#FFFFFF', 'fan', 42, 'Prince Madar Stadium', 8000],
    ['Ain Khasiq Club', 'WAI', 'Ain Khasiq', '#CE1126', '#FFFFFF', 'fan', 42, 'Prince Rifra Stadium', 8000],
    ['Shabab Tafar', 'MAW', 'Tafar', '#FFD100', '#006C35', 'oil', 42, 'Tafar Stadium', 12000],
    ['Al Sahil', 'QIM', 'Sahra', '#CE1126', '#FFFFFF', 'oil', 41, 'Zariyah Arena', 8000],
    ['Baqayn SC', 'NIM', 'Baqayn', '#0057B8', '#FFFFFF', 'oil', 41, 'Baqayn Sports City', 8000],
    ['Rusya Club', 'AAD', 'Rusya', '#006C35', '#FFFFFF', 'fan', 40, 'Rusya Stadium', 8000],
    ['Al Wadi Hawayr SC', 'NOU', 'Hawayr', '#006C35', '#FFD100', 'oil', 40, 'Hawayr Sports City', 6000],
    ['Wadi Rusra SC', 'KHL', 'Khasya', '#0057B8', '#CE1126', 'oil', 40, 'Tafar Arena', 10000],
  ];
  FM.D.CLUBS_SG1 = [
    ['Telim FC', 'BAN', 'Telim', '#00AEEF', '#FFFFFF', 'oil', 46, 'Telim Sports Hub', 6000],
    ['Temgap City', 'TAJ', 'Temgap', '#FFD100', '#E30613', 'historic', 44, 'Temgap Sports Hub', 5000],
    ['Telim Athletic', 'BAM', 'Telim', '#F26522', '#FFFFFF', 'youth', 42, 'Sinei Hub', 2700],
    ['Baylang Police', 'BND', 'Baylang', '#D2232A', '#006A4E', 'fan', 40, 'Serlim Hub', 3000],
    ['Tensa Rovers', 'LTJ', 'Tensa', '#E30613', '#000000', 'historic', 38, 'Serei Stadium', 3900],
    ['Bayong Rovers', 'KAM', 'Bayong', '#F26522', '#0033A0', 'fan', 38, 'Bayong Sports Hub', 3500],
    ['Lorlang United', 'TMN', 'Lorlang', '#ED1C24', '#FFFFFF', 'historic', 37, 'Kamlang Hub', 2700],
    ['Pulgap Police', 'TES', 'Pulgap', '#1F3A93', '#FFFFFF', 'fan', 36, 'Marlang Stadium', 4000],
    ['Pulgap Athletic', 'LTS', 'Pulgap', '#F26522', '#000000', 'fan', 35, 'Hourang Hub', 4300],
    ['Tionglang Rovers', 'TAA', 'Telim', '#E30613', '#FFFFFF', 'youth', 34, 'Kamong Hub', 6000],
  ];
  FM.D.CLUBS_MY1 = [
    ['Sri Nilam Utama', 'TAN', 'Nilam Utama', '#3FA9F5', '#FFFFFF', 'oil', 60, 'Stadium Majlis Nilam Utama', 40000],
    ['PDRM Pelita Baru', 'BUK', 'Pelita Baru', '#E30613', '#FFD100', 'giant', 52, 'Stadium Seri Indah', 25000],
    [
      'UiTM Delima Sari',
      'PUL',
      'Delima Sari',
      '#000000',
      '#FFD100',
      'historic',
      52,
      'Stadium Majlis Delima Sari',
      50000,
    ],
    ['Seri Sari City', 'SIM', 'Seri Sari', '#00A651', '#E30613', 'historic', 50, 'Stadium Damai Utama', 32000],
    [
      'Pulau Seri Baru United',
      'SIP',
      'Pulau Seri Baru',
      '#7BAFD4',
      '#FFFFFF',
      'oil',
      50,
      'Stadium Bandaraya Pulau Seri Baru',
      18000,
    ],
    ['Laut Baru United', 'TEL', 'Laut Baru', '#0066CC', '#FFD100', 'fan', 48, 'Stadium Majlis Laut Baru', 35000],
    ['Damai Mas Utara', 'TEP', 'Damai Mas', '#FFD100', '#000000', 'historic', 48, 'Damai Utama Arena', 42000],
    ['UiTM Karang Jaya', 'SUP', 'Karang Jaya', '#FFD100', '#000000', 'historic', 47, 'Stadium Karang Jaya', 40000],
    ['Seri Jaya FC', 'SRI', 'Seri Jaya', '#FFD100', '#1E90FF', 'fan', 46, 'Stadium Seri Jaya', 20000],
    ['Karang Baru FA', 'SIT', 'Karang Baru', '#E30613', '#FFD100', 'fan', 45, 'Stadium Jaya Utama', 45000],
    ['Mutiara Jaya Selatan', 'PUT', 'Mutiara Jaya', '#E30613', '#FFFFFF', 'fan', 44, 'Rimba Baru Arena', 40000],
    ['UiTM Pelita Sari', 'PUA', 'Pelita Sari', '#E30613', '#FFFFFF', 'fan', 43, 'Stadium Pelita Sari', 22000],
    [
      'Pulau Seri Baru Selatan',
      'SMP',
      'Pulau Seri Baru',
      '#1F3A93',
      '#FFFFFF',
      'selling',
      40,
      'Stadium Selasih Indah',
      18000,
    ],
    ['Permata Mas Selatan', 'PUI', 'Permata Mas', '#E30613', '#FFFFFF', 'fan', 40, 'Stadium Teratai Jaya', 40000],
  ];
  FM.D.CLUBS_VN1 = [
    ['Thep Ninh Nai', 'BIN', 'Ninh Nai', '#E30613', '#FFFFFF', 'youth', 52, 'San Ninh Nai', 22500],
    ['Ninh Nai FC', 'THE', 'Ninh Nai', '#FFD100', '#1F3A93', 'oil', 50, 'Thanh Lai Stadium', 22500],
    ['Cang Ninh Quan', 'BUF', 'Ninh Nai', '#E30613', '#FFD100', 'oil', 50, 'San Quang Nai', 22500],
    ['Sai Cao Giang', 'VIN', 'Cao Giang', '#FFFFFF', '#003DA5', 'historic', 49, 'Cao Giang Stadium', 30000],
    ['Cong An Kon Lac', 'THM', 'Kon Lac', '#FFD100', '#000000', 'historic', 48, 'Thai Son Stadium', 12000],
    ['Cong An Dong Son', 'THL', 'Dong Son', '#0A8F3C', '#FFFFFF', 'youth', 47, 'San Dong Son', 12000],
    ['Cang Nam Bien', 'HTF', 'Nam Bien', '#0066CC', '#FFFFFF', 'selling', 46, 'Bac Nai Stadium', 18250],
    ['Hoang Anh Long Phong', 'SON', 'Long Phong', '#E30613', '#FFFFFF', 'historic', 45, 'Quang An Stadium', 28000],
    ['Than Kon Duong', 'THT', 'Kon Duong', '#E30613', '#FFD100', 'fan', 44, 'Yen Hoa Stadium', 14000],
    ['CLB Hai Bien', 'LKC', 'Hai Bien', '#FFD100', '#E30613', 'fan', 43, 'San Hai Bien', 28000],
    ['Sai Long Son', 'LON', 'Long Son', '#E30613', '#FFD100', 'fan', 43, 'Long Son Stadium', 25000],
    ['Sai Tuy Phong', 'THH', 'Tuy Phong', '#F26522', '#FFFFFF', 'fan', 42, 'Cao Lac Stadium', 20000],
    ['CLB Vinh Phong', 'BAO', 'Vinh Phong', '#FFD100', '#E30613', 'fan', 41, 'Vinh Phong Stadium', 20000],
    ['Kon Tinh FC', 'SOH', 'Kon Tinh', '#1E90FF', '#FFFFFF', 'fan', 40, 'San Thanh Tinh', 20000],
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
    ['Al Idkan SC', 'ZFR', 'Idkan', '#E30613', '#FFFFFF', 'giant', 66, 'Idkan Military Academy Stadium', 75000],
    ['Al Sahel', 'NJH', 'Luxan', '#FFFFFF', '#E30613', 'giant', 62, 'Luxan Military Academy Stadium', 45000],
    ['Al Delta', 'NIL', 'Idkan', '#6CACE4', '#FFFFFF', 'oil', 58, 'Qenag Arena', 30000],
    ['Kafr Assia Club', 'TAW', 'Kafr Assia', '#00843D', '#000000', 'historic', 50, 'Idkya Stadium', 18000],
    ['Al Tawfiq', 'SLM', 'Dakor', '#FFD100', '#0057B8', 'historic', 49, 'Dakor Stadium', 20000],
    ['Petro Abu Mahut', 'ITT', 'Mahut', '#00843D', '#FFFFFF', 'historic', 47, 'Benat Stadium', 25000],
    ['Al Luxag', 'FAU', 'Idkan', '#0057B8', '#FFFFFF', 'oil', 46, 'Manat Arena', 30000],
    ['Al Zafer', 'KAF', 'Idkan', '#001F5B', '#FFD100', 'oil', 46, 'Idkan Sports City', 12000],
    ['Al Qenan SC', 'DAM', 'Idkan', '#0057B8', '#FFD100', 'oil', 45, 'Marat Arena', 10000],
    ['Mahut SC', 'POT', 'Mahut', '#0057B8', '#FFFFFF', 'selling', 44, 'Mahut Sports City', 13000],
    ['Abu Aswia Club', 'TAI', 'Idkan', '#E30613', '#000000', 'oil', 44, 'Idkan Stadium', 14000],
    ['Suag Club', 'ITA', 'Idkan', '#001F5B', '#FFFFFF', 'selling', 44, 'Sidoura Arena', 15000],
    ['Beni Sohag Club', 'SOF', 'Mahut', '#E30613', '#FFFFFF', 'oil', 43, 'Mahut Stadium', 10000],
    ['Petro Maror', 'BEI', 'Maror', '#FFD100', '#00843D', 'selling', 43, 'Maror Stadium', 18000],
    ['Beni Aswor SC', 'ZOH', 'Aswor', '#6CACE4', '#FFFFFF', 'youth', 43, 'Sohan Stadium', 8000],
    ['Al Nil', 'ITD', 'Idkan', '#00843D', '#FFFFFF', 'fan', 42, 'Sidat Arena', 8000],
    ['Al Kafr Dakya SC', 'HIL', 'Idkan', '#FFD100', '#000000', 'historic', 42, 'Ismoura Stadium', 10000],
    ['Petro Beni Qenat', 'SUA', 'Mahut', '#0057B8', '#000000', 'fan', 41, 'Mahut Military Academy Stadium', 9000],
  ];
  FM.D.CLUBS_TN1 = [
    ['AS Kasouane', 'MOE', 'Kasouane', '#E30613', '#FFD100', 'giant', 52, 'Stade de Kasouane', 30000],
    ['ES Kasouane', 'MNE', 'Kasouane', '#E30613', '#FFFFFF', 'giant', 50, 'Stade Kaine', 40000],
    ['CS Gafine', 'VND', 'Gafine', '#E30613', '#FFFFFF', 'historic', 48, 'Complexe Sportif Gafine', 28000],
    ['US Gaboune', 'ESA', 'Gaboune', '#000000', '#FFFFFF', 'historic', 46, 'Stade Tebsse', 22000],
    ['JS Tabia', 'BEE', 'Tabia', '#0057B8', '#FFFFFF', 'fan', 42, 'Stade Kelès', 12000],
    ['US Radsse', 'SAO', 'Kasouane', '#E30613', '#00843D', 'historic', 41, 'Stade Soar', 18000],
    ['EO Ben Tatar', 'UMV', 'Tatar', '#00843D', '#FFFFFF', 'fan', 40, 'Stade de Tatar', 12000],
    ['US Hamsse', 'SCB', 'Hamsse', '#E30613', '#FFFFFF', 'fan', 39, 'Stade Kelouane', 6000],
    ['EO Tebsse', 'BOU', 'Tebsse', '#FFD100', '#E30613', 'fan', 39, 'Stade de Tebsse', 7000],
    ['JS Radouane', 'CHF', 'Radouane', '#00843D', '#000000', 'historic', 39, 'Stade Mahoune', 15000],
    ['AS Ben Mahoune', 'NAE', 'Mahoune', '#0057B8', '#FFD100', 'fan', 38, 'Stade Gabsa', 8000],
    ['Stade Ben Gafouane', 'ETM', 'Gafouane', '#E30613', '#000000', 'fan', 38, 'Stade Tatès', 6000],
    ['CS Kelia', 'NNC', 'Kelia', '#E30613', '#FFFFFF', 'fan', 38, 'Stade Municipal de Kelia', 10000],
    ['JS Mahoune', 'NNE', 'Mahoune', '#E30613', '#00843D', 'fan', 37, 'Stade Silar', 8000],
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
    ['USM Tebouk', 'CHV', 'Tebouk', '#FFD100', '#00843D', 'giant', 50, 'Stade Municipal de Tebouk', 18000],
    ['ES Hassida', 'THR', 'Hassida', '#E30613', '#00843D', 'giant', 49, 'Stade de Hassida', 40000],
    ['ASO Hassida', 'THI', 'Hassida', '#E30613', '#FFFFFF', 'giant', 48, 'Complexe Sportif Hassida', 40000],
    ['RC Namiya', 'AJM', 'Hassida', '#E30613', '#000000', 'historic', 47, 'Stade Berala', 50000],
    ['AS Bordj Khouda', 'NAF', 'Bordj Khouda', '#000000', '#FFFFFF', 'historic', 46, 'Stade Relouda', 30000],
    ['ASO Hassouda', 'MIO', 'Hassouda', '#00843D', '#E30613', 'selling', 41, 'Stade Mosina', 20000],
    ['USM Boouk', 'BEC', 'Hassida', '#FFFFFF', '#0057B8', 'youth', 41, 'Stade Municipal de Hassida', 8000],
    ['MO Bordj Boiya', 'SPC', 'Boiya', '#E30613', '#FFFFFF', 'historic', 41, 'Complexe Sportif Boiya', 40000],
    ['MC Timida', 'MNV', 'Timida', '#00843D', '#000000', 'historic', 40, 'Stade Cherouda', 30000],
    ['Berali FC', 'TRL', 'Berali', '#00843D', '#FFFFFF', 'fan', 39, 'Stade Tebala', 10000],
    ['IR Tebina', 'SAG', 'Tebina', '#00843D', '#FFD100', 'fan', 38, 'Stade Djina', 8000],
    ['MO Oued Hassali', 'VLL', 'Hassali', '#0057B8', '#FFFFFF', 'fan', 38, 'Complexe Sportif Hassali', 8000],
    ['RC Bejali', 'FNR', 'Hassida', '#00843D', '#FFD100', 'fan', 38, 'Stade Tebiya', 6000],
    ['JS Tlemali', 'CHP', 'Tlemali', '#00843D', '#E30613', 'fan', 38, 'Stade de Tlemali', 12000],
    ['MO Sidi Boida', 'LAE', 'Boida', '#0057B8', '#FFFFFF', 'fan', 37, 'Complexe Sportif Boida', 7000],
    ['MC Beni Relali', 'USC', 'Relali', '#E30613', '#FFFFFF', 'fan', 37, 'Stade Berouda', 20000],
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
    ['Norvik FK', 'HED', 'Norvik', '#0057B8', '#FFFFFF', 'giant', 62, 'Ekholm Arena', 22500],
    ['GIF Sigköping', 'DYF', 'Sigköping', '#000000', '#FFD100', 'giant', 57, 'Norfors IP', 50000],
    ['Vasalund Linholm', 'GAF', 'Linholm', '#0057B8', '#E30613', 'giant', 56, 'Kalforsvallen', 30000],
    ['IFK Linholm', 'GMM', 'Linholm', '#00843D', '#FFFFFF', 'historic', 55, 'Sundsköping Arena', 33000],
    ['IFK Västad', 'HOB', 'Västad', '#0057B8', '#FFFFFF', 'historic', 53, 'Halfors IP', 18000],
    ['Västad IF', 'FRH', 'Västad', '#FFD100', '#000000', 'selling', 52, 'Karlköpingvallen', 6500],
    ['GIF Karlfors', 'DYB', 'Karlfors', '#FFD100', '#000000', 'historic', 50, 'Karlfors Idrottspark', 16000],
    ['Falfors FF', 'ISN', 'Falfors', '#FFFFFF', '#0057B8', 'historic', 50, 'Falfors Idrottspark', 17000],
    ['Brage Borholm', 'ALS', 'Borholm', '#E30613', '#FFFFFF', 'fan', 46, 'Ronövallen', 12000],
    ['Gävfors FF', 'STO', 'Gävfors', '#0057B8', '#FFFFFF', 'youth', 46, 'Gävö Arena', 9000],
    ['IFK Östra Sighamn', 'BRI', 'Sighamn', '#FFD100', '#000000', 'fan', 45, 'Lidnäs IP', 7000],
    ['IF Signäs', 'SND', 'Linholm', '#E30613', '#000000', 'youth', 44, 'Vövallen', 8000],
    ['IK Tranfors', 'STK', 'Tranfors', '#0057B8', '#FFFFFF', 'historic', 43, 'Skelstadvallen', 15000],
    ['Linsund FF', 'SYD', 'Västad', '#00843D', '#000000', 'fallen', 42, 'Linby Arena', 13000],
    ['Nya Skelvik BK', 'SBX', 'Nya Skelvik', '#E30613', '#FFFFFF', 'fan', 41, 'Nya Skelvik Stadion', 7000],
    ['IF Nynköping', 'DYY', 'Nynköping', '#00843D', '#000000', 'fan', 41, 'Skelfors Arena', 4500],
  ];
  FM.D.CLUBS_RO1 = [
    ['Victoria Vatău', 'MET', 'Vatău', '#E30613', '#0057B8', 'giant', 58, 'Stadionul Romești', 55000],
    ['AFC Albești', 'STI', 'Albești', '#0057B8', '#FFFFFF', 'oil', 56, 'Stadionul Orășenesc Albești', 23000],
    ['FC Peteni', 'ZEN', 'Peteni', '#0057B8', '#FFFFFF', 'giant', 53, 'Stadionul Conița', 30000],
    ['CS Vatău', 'SPD', 'Vatău', '#0057B8', '#FFFFFF', 'giant', 52, 'Stadionul Hunești', 14000],
    ['Olimpia Orești', 'SPK', 'Vatău', '#E30613', '#FFFFFF', 'fallen', 50, 'Arena Vatița', 15000],
    ['ACS Mangești', 'DNJ', 'Mangești', '#0057B8', '#FFFFFF', 'oil', 48, 'Complexul Sportiv Mangești', 15000],
    ['AFC Dreni', 'MEL', 'Dreni', '#E30613', '#FFFFFF', 'historic', 47, 'Stadionul Crești', 12000],
    ['Metalul Zalova', 'AOL', 'Zalova', '#0057B8', '#FFFFFF', 'selling', 45, 'Complexul Sportiv Zalova', 8000],
    ['Metalul Hunești', 'DOU', 'Hunești', '#FFD100', '#0057B8', 'historic', 45, 'Arena Romești', 15000],
    ['Gloria Brița', 'KAU', 'Brița', '#E30613', '#FFFFFF', 'selling', 43, 'Complexul Sportiv Brița', 4500],
    ['Metalul Tulova', 'BRS', 'Tulova', '#E30613', '#FFFFFF', 'historic', 42, 'Stadionul Orășenesc Tulova', 13000],
    ['ACS Zalești', 'RAN', 'Zalești', '#0057B8', '#FFD100', 'fan', 42, 'Arena Huneni', 8000],
    ['CS Mare Slatești', 'KSP', 'Slatești', '#0057B8', '#FFFFFF', 'fan', 41, 'Stadionul Orășenesc Slatești', 2500],
    ['Electroputere Zaliu', 'LOK', 'Zaliu', '#0057B8', '#FFFFFF', 'historic', 41, 'Complexul Sportiv Zaliu', 11000],
    ['Progresul Mic Conești', 'DOJ', 'Conești', '#0057B8', '#FFFFFF', 'fan', 40, 'Arena Fagău', 5000],
    ['Metalul Galiu', 'RAB', 'Galiu', '#E30613', '#FFFFFF', 'fan', 40, 'Complexul Sportiv Galiu', 3000],
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
    ['Kamford FC', 'BRB', 'Kamford', '#F26522', '#000000', 'youth', 42, 'Portmont Centre', 6000],
    ['FC Hamhaven', 'GRN', 'Hamhaven', '#E30613', '#000000', 'selling', 40, 'Hamhaven Place', 6000],
    ['Kamton Rovers', 'HOR', 'Kamton', '#E30613', '#FFFFFF', 'fan', 37, 'Kamton Place', 24000],
    ['Chefield Foothills', 'BON', 'Chefield', '#6A1B9A', '#FFFFFF', 'youth', 36, 'Wesford Centre', 6000],
    ['Galmont FC', 'TIV', 'Galmont', '#00843D', '#FFFFFF', 'fan', 35, 'Belford Park', 4000],
    ['Galey United', 'COD', 'Galey', '#6CACE4', '#000000', 'fan', 35, 'Wesford Field', 6000],
    ['Sasley United', 'CLW', 'Sasley', '#F26522', '#000000', 'fan', 34, 'Truwick Field', 6000],
    ['Atlético Dunwick', 'HAY', 'Dunwick', '#00843D', '#000000', 'fan', 33, 'Dunwick Stadium', 6000],
  ];
  FM.D.CLUBS_AE1 = [
    ['Al Ain Jahiq', 'BUA', 'Ain Jahiq', '#FFD100', '#6A1B9A', 'oil', 60, 'Khasah Arena', 25000],
    ['Bahan SC', 'IZZ', 'Bahan', '#E30613', '#000000', 'oil', 58, 'Prince Khasiq Stadium', 12000],
    ['Al Yasmin', 'MAJ', 'Basra', '#FFFFFF', '#0057B8', 'oil', 56, 'Sahan Arena', 11000],
    ['Bahan Club', 'JAA', 'Bahan', '#FFD100', '#000000', 'historic', 54, 'Busan Stadium', 12000],
    ['Sahib Club', 'WAT', 'Sahib', '#E30613', '#000000', 'oil', 53, 'Qurib Arena', 42000],
    ['Al Sahib SC', 'JEA', 'Sahib', '#F26522', '#000000', 'oil', 52, 'Sahib Sports City', 11000],
    ['Sahiyah SC', 'YAQ', 'Bahan', '#FFD100', '#0057B8', 'historic', 47, 'Ajlayr Stadium', 12000],
    ['Al Burj', 'DHA', 'Sahib', '#E30613', '#000000', 'fan', 44, 'Sahib Stadium', 9000],
    ['Al Shuja', 'SHQ', 'Sohayr', '#F26522', '#FFFFFF', 'fan', 43, 'Falar Stadium', 5000],
    ['Kutiq SC', 'RIM', 'Kutiq', '#E30613', '#FFFFFF', 'fan', 42, 'Kutiq Stadium', 4000],
    ['Al Karayr SC', 'HUR', 'Karayr', '#00843D', '#E30613', 'fan', 42, 'Prince Ramiyah Stadium', 7000],
    ['Busiyah Club', 'NAW', 'Busiyah', '#FFD100', '#0057B8', 'fan', 41, 'Liwiyah Stadium', 4000],
    ['Shabab Bahayr', 'FAA', 'Bahayr', '#FFD100', '#000000', 'fan', 41, 'Bahayr Stadium', 6000],
    ['Shabab Basra', 'SHB', 'Basra', '#0057B8', '#FFFFFF', 'fan', 40, 'Saman Arena', 3000],
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
    ['Muhib SC', 'IHS', 'Muhib', '#FFFFFF', '#000000', 'oil', 58, 'Prince Jeriq Stadium', 15000],
    ['Al Muhib', 'BHY', 'Muhib', '#E30613', '#FFFFFF', 'oil', 56, 'Muhib Sports City', 40000],
    ['Wadi Ibrayn SC', 'UMM', 'Wadi Ibrayn', '#E30613', '#000000', 'oil', 52, 'Nakiq Stadium', 44000],
    ['Sohan SC', 'ULI', 'Muhib', '#FFFFFF', '#000000', 'oil', 50, 'Prince Nizra Stadium', 21000],
    ['Shabab Zarayr', 'GHA', 'Muhib', '#FFFFFF', '#E30613', 'historic', 48, 'Sohayr Arena', 15000],
    ['Sahiq Club', 'RIY', 'Sahiq', '#FFD100', '#000000', 'fan', 45, 'Diwiyah Stadium', 20000],
    ['Shabab Wadi Khasayr', 'DIR', 'Muhib', '#8A1538', '#FFFFFF', 'historic', 44, 'Prince Barib Stadium', 13000],
    ['Zalar Club', 'AIM', 'Zalar', '#FFD100', '#000000', 'fan', 43, 'Zalar Sports City', 12000],
    ['Diwayr Club', 'ABC', 'Muhib', '#00843D', '#FFFFFF', 'historic', 42, 'Muhib Stadium', 7000],
    ['Shabab Ain Hidra', 'BUU', 'Hidra', '#0057B8', '#FFFFFF', 'fan', 41, 'Kutayr Arena', 10000],
    ['Al Aqah SC', 'ABA', 'Aqah', '#0057B8', '#FFFFFF', 'fan', 41, 'Jahiq Arena', 12000],
    ['Al Busya', 'SHM', 'Muhib', '#E30613', '#FFFFFF', 'fan', 40, 'Barar Stadium', 3000],
  ];
  FM.D.CLUBS_CS1 = [
    ['Ningbin United', 'MEI', 'Ningbin', '#E30613', '#000000', 'oil', 66, 'Huacheng Arena', 72000],
    ['Pingzhou Steel', 'JIN', 'Pingzhou', '#F26522', '#000000', 'giant', 62, 'Qingmen Stadium', 54000],
    ['Anzhou FC', 'DON', 'Anzhou', '#00843D', '#FFD100', 'giant', 62, 'Weibin Stadium', 66000],
    ['Ningbin Dragons', 'MED', 'Ningbin', '#0057B8', '#FFFFFF', 'giant', 60, 'Ningbin Olympic Stadium', 52000],
    ['Dongshan Lions', 'KAI', 'Dongshan', '#E30613', '#FFFFFF', 'oil', 56, 'Dongshan Olympic Stadium', 40000],
    ['Meyang Cranes', 'HEN', 'Meyang', '#00843D', '#FFFFFF', 'youth', 52, 'Pingcheng Arena', 50000],
    ['Baoshan Sports', 'BEY', 'Baoshan', '#E30613', '#FFFFFF', 'oil', 50, 'Xinchuan Arena', 52000],
    ['Ruyang City', 'BSH', 'Ruyang', '#0057B8', '#FFFFFF', 'fan', 48, 'Linyuan Stadium', 54000],
    ['Linbin Heavy Industries', 'WUJ', 'Linbin', '#FFD100', '#00843D', 'historic', 48, 'Huazhou Arena', 38000],
    ['Changbin United', 'LOP', 'Changbin', '#FFD100', '#0057B8', 'fan', 46, 'Changbin Sports Centre', 29000],
    ['Yunzhou United', 'MEY', 'Yunzhou', '#0057B8', '#FFFFFF', 'fallen', 46, 'Huazhou Stadium', 55000],
    ['Changmen FC', 'BAF', 'Changmen', '#E30613', '#000000', 'fan', 45, 'Changmen Olympic Stadium', 20000],
    ['Kayang United', 'SHE', 'Kayang', '#0057B8', '#FFFFFF', 'fan', 44, 'Kayang Olympic Stadium', 18000],
    ['Hayang Cranes', 'CHN', 'Hayang', '#0057B8', '#FFFFFF', 'fan', 44, 'Taichuan Arena', 30000],
    ['Yuncheng Evergreen', 'XYA', 'Yuncheng', '#E30613', '#0057B8', 'fan', 43, 'Aning Stadium', 30000],
    ['Dongyang Steel', 'CHD', 'Dongyang', '#0057B8', '#FFD100', 'fan', 42, 'Dongyang Sports Centre', 18000],
  ];
  FM.D.CLUBS_JP2 = [
    ['Higashifujita United', 'HIA', 'Higashifujita', '#F26522', '#FFFFFF', 'historic', 52, 'Fujita Park', 20000],
    ['Kitahara Kingfishers', 'KIA', 'Kitahara', '#6CACE4', '#FFFFFF', 'historic', 51, 'Kitahara Sports Complex', 15000],
    ['Sakurasaki Sport Club', 'SAB', 'Sakurasaki', '#F26522', '#001F5B', 'fallen', 50, 'Nishiura Arena', 15500],
    ['Kawamori Stella', 'KAW', 'Kawamori', '#FFD100', '#00843D', 'fallen', 50, 'Kawamori Sports Complex', 19000],
    ['Akano Blaze', 'AKA', 'Akano', '#FFD100', '#000000', 'historic', 50, 'Akano Athletic Stadium', 19000],
    ['Akakami Rayo', 'AKB', 'Akakami', '#001F5B', '#FFFFFF', 'fan', 47, 'Saiura Stadium', 20000],
    ['Inahara FC', 'INA', 'Inahara', '#0057B8', '#E30613', 'fan', 47, 'Takamori Stadium', 17000],
    ['Taketa FC', 'TAG', 'Taketa', '#0057B8', '#F26522', 'oil', 47, 'Higashihama Stadium', 20000],
    ['Takesaki Athletic', 'TAE', 'Takesaki', '#0057B8', '#001F5B', 'fan', 46, 'Takesaki Sports Complex', 20000],
    ['Kawashima FC', 'KAB', 'Kawashima', '#E30613', '#FFFFFF', 'fan', 46, 'Hokukami Park', 20000],
    ['FC Inasaki Riverside', 'INI', 'Inasaki', '#0057B8', '#FFFFFF', 'fan', 46, 'Kurohama Arena', 40000],
    ['Sakurano Falcons', 'SAD', 'Sakurano', '#E30613', '#000000', 'fan', 45, 'Nagagawa Stadium', 32000],
    ['Akihama Riverside', 'AMA', 'Akihama', '#0057B8', '#E30613', 'fan', 45, 'Akihama Sports Complex', 12000],
    ['Asakami United', 'ASB', 'Asakami', '#E30613', '#FFFFFF', 'fan', 45, 'Saizawa Stadium', 15000],
    ['Fujihama FC', 'FUA', 'Fujihama', '#0057B8', '#FFD100', 'fan', 45, 'Fujihama Sports Complex', 18000],
    ['Kurozawa City', 'KUR', 'Kurozawa', '#E30613', '#000000', 'fan', 44, 'Kurozawa Athletic Stadium', 10000],
    ['Nishihama Athletic', 'NIA', 'Nishihama', '#6A1B9A', '#FFFFFF', 'youth', 44, 'Nishimoto Stadium', 5000],
    ['Yamano Bluewave', 'YAM', 'Yamano', '#FFD100', '#0057B8', 'fan', 44, 'Yamata Arena', 25000],
    ['Higashigawa Kingfishers', 'HIB', 'Higashigawa', '#0057B8', '#E30613', 'fan', 44, 'Akamoto Stadium', 28000],
    ['Okasaki Lumina', 'OKB', 'Okasaki', '#F26522', '#FFFFFF', 'fan', 43, 'Nishimori Park', 21000],
  ];
  FM.D.CLUBS_KR2 = [
    ['Chunju Silk Dragons', 'CHG', 'Chunju', '#0057B8', '#FFFFFF', 'historic', 50, 'Chunju Civic Stadium', 43000],
    ['Jeonri United', 'JEO', 'Jeonri', '#0057B8', '#000000', 'historic', 48, 'Jeonri Civic Stadium', 20000],
    ['Pyeongyang Heavy Eagles', 'PYE', 'Pyeongyang', '#E30613', '#FFFFFF', 'historic', 48, 'Pyeongyang Stadium', 53000],
    ['Wolseong Copper Phoenix', 'WOA', 'Wolseong', '#6A1B9A', '#00843D', 'fan', 47, 'Wolseong Stadium', 40000],
    ['Wolyang Petroleum FC', 'WOG', 'Wolyang', '#E30613', '#FFFFFF', 'oil', 47, 'Singu Arena', 15000],
    ['Munwon Tigers', 'MUN', 'Munwon', '#000000', '#FFD100', 'historic', 46, 'Namjin Sports Complex', 16000],
    ['Boju Silk Dragons', 'BOJ', 'Boju', '#6A1B9A', '#FFFFFF', 'selling', 45, 'Dongdong Arena', 16000],
    ['FC Jinju', 'JIA', 'Jinju', '#FFD100', '#000000', 'historic', 45, 'Jinju Civic Stadium', 13000],
    ['Banri FC', 'BAD', 'Banri', '#E30613', '#FFFFFF', 'fan', 44, 'Daedong Arena', 27000],
    ['Gyeongjeong FC', 'GYB', 'Gyeongjeong', '#00843D', '#FFFFFF', 'fan', 43, 'Banri Sports Complex', 6000],
    ['Namhwa Electric Tigers', 'NAB', 'Namhwa', '#E30613', '#000000', 'fan', 43, 'Namhwa Civic Stadium', 35000],
    ['Dongdong Heavy Eagles', 'DOA', 'Dongdong', '#0057B8', '#FFFFFF', 'fan', 43, 'Munju Sports Complex', 20000],
    ['Singu United', 'SIC', 'Singu', '#00843D', '#FFFFFF', 'fan', 42, 'Singu Civic Stadium', 35000],
    ['Chungjin Stars', 'CHJ', 'Chungjin', '#6CACE4', '#FFFFFF', 'fan', 42, 'Chungjin Stadium', 26000],
    ['Buju Silk Dragons', 'BUB', 'Buju', '#E30613', '#FFFFFF', 'fan', 42, 'Buju Civic Stadium', 3000],
  ];
  FM.D.CLUBS_TH2 = [
    ['Muang Ubonkaeo United', 'MUC', 'Ubonkaeo', '#F26522', '#FFFFFF', 'historic', 44, 'Maekaeo Stadium', 25000],
    ['Ratsai United', 'RAT', 'Ratsai', '#0057B8', '#FFFFFF', 'fan', 42, 'Maelek Sports Park', 8000],
    ['Paknam City', 'PAA', 'Paknam', '#E30613', '#000000', 'fan', 41, 'Kaothong Arena', 7000],
    ['Thapur FC', 'THC', 'Thapur', '#FFD100', '#FFFFFF', 'fan', 40, 'Kaonong Stadium', 6000],
    ['Banlek Provincial United', 'BAK', 'Banlek', '#00843D', '#FFFFFF', 'youth', 40, 'Lamburi Arena', 5000],
    ['Singsai United', 'SII', 'Singsai', '#F26522', '#FFFFFF', 'oil', 40, 'Bangsai Stadium', 7500],
    ['Pakpur Athletic', 'PAB', 'Pakpur', '#00843D', '#FFFFFF', 'fan', 40, 'Sakburi Sports Park', 5000],
    ['Maera United', 'MAG', 'Maera', '#E30613', '#FFD100', 'fan', 40, 'Phrara Arena', 7000],
    ['Pakmai Athletic', 'PAI', 'Pakmai', '#E30613', '#001F5B', 'fan', 40, 'Saksai Sports Park', 25000],
    ['FC Kaopur', 'KAO', 'Kaopur', '#E30613', '#FFFFFF', 'fan', 39, 'Wanglek Sports Park', 7000],
    ['Nongmai United', 'NOB', 'Nongmai', '#00843D', '#FFD100', 'fan', 39, 'Nongmai Provincial Stadium', 6000],
    ['Banra City', 'BAE', 'Banra', '#0057B8', '#FFD100', 'selling', 39, 'Banburi Stadium', 10000],
    ['FC Banlek', 'BEK', 'Banlek', '#0057B8', '#FFD100', 'selling', 38, 'Banlek Provincial Stadium', 5000],
    ['Ubonpur Rapids United', 'UBB', 'Ubonpur', '#FFD100', '#0057B8', 'fan', 38, 'Ubonpur Provincial Stadium', 5000],
    ['Phramai Athletic', 'PHR', 'Phramai', '#0057B8', '#E30613', 'fan', 38, 'Taksai Stadium', 6000],
    ['FC Takburi', 'TAS', 'Takburi', '#E30613', '#FFFFFF', 'youth', 37, 'Takburi Provincial Stadium', 5000],
  ];
  FM.D.CLUBS_ID2 = [
    ['Persi Tangmulan', 'PEA', 'Tangmulan', '#00843D', '#000000', 'fan', 43, 'Tangmulan Provincial Stadium', 25000],
    ['Persi Bogowati', 'PEE', 'Bogowati', '#FFD100', '#000000', 'historic', 43, 'Pamakalan Sports Park', 36000],
    ['Persi Bogorang', 'PSI', 'Bogorang', '#E30613', '#FFFFFF', 'historic', 43, 'Malakalan Stadium', 20000],
    ['PS Tasidongan', 'PSS', 'Tasidongan', '#0057B8', '#FFFFFF', 'fan', 42, 'Tasijaya Sports Park', 20000],
    ['Purapura Putra', 'PUB', 'Purapura', '#00843D', '#FFFFFF', 'historic', 42, 'Purapura Provincial Stadium', 20000],
    ['PS Solasari', 'PPS', 'Solasari', '#E30613', '#FFFFFF', 'historic', 42, 'Langkalan Sports Park', 30000],
    ['Kedipura Putra', 'KEA', 'Kedipura', '#0057B8', '#FFD100', 'fan', 40, 'Cirengan Arena', 10000],
    ['Solabaya FC', 'SOL', 'Solabaya', '#6A1B9A', '#FFFFFF', 'fan', 40, 'Solangan Sports Park', 15000],
    ['Bogodongan FC', 'BOA', 'Bogodongan', '#E30613', '#FFFFFF', 'fan', 40, 'Bogodongan Provincial Stadium', 20000],
    ['Kedidongan United', 'KEN', 'Kedidongan', '#F26522', '#FFFFFF', 'fan', 39, 'Kedidongan Provincial Stadium', 15000],
    ['Surajaya FC', 'SUB', 'Surajaya', '#FFD100', '#E30613', 'fan', 39, 'Purarang Stadium', 15000],
    ['Purangan FC', 'PUN', 'Purangan', '#E30613', '#000000', 'fan', 38, 'Purangan Provincial Stadium', 10000],
    ['Persi Pamarang', 'PEP', 'Pamarang', '#00843D', '#FFFFFF', 'fan', 38, 'Langngan Arena', 10000],
    ['Persi Bogogiri', 'PEF', 'Bogogiri', '#00843D', '#FFD100', 'fan', 38, 'Tasilembang Stadium', 20000],
    ['PS Cirelembang', 'PSC', 'Cirelembang', '#E30613', '#000000', 'fan', 38, 'Tangsari Sports Park', 20000],
    ['PS Maladongan', 'PSM', 'Maladongan', '#E30613', '#FFD100', 'oil', 38, 'Kedisari Stadium', 10000],
    ['Pamalembang United', 'PAD', 'Pamalembang', '#FFD100', '#00843D', 'fan', 37, 'Malangan Arena', 10000],
    ['Purapura FC', 'PUC', 'Purapura', '#E30613', '#FFFFFF', 'selling', 37, 'Malawati Sports Park', 10000],
    ['Bhakti Bogodongan', 'BHB', 'Bogodongan', '#00843D', '#FFD100', 'selling', 37, 'Semamulan Sports Park', 10000],
    ['Bhakti Solangan', 'BHI', 'Solangan', '#F26522', '#FFFFFF', 'fan', 37, 'Jembdongan Arena', 15000],
  ];
  FM.D.CLUBS_VN2 = [
    ['Sai Nam Phong', 'THD', 'Nam Phong', '#E30613', '#FFFFFF', 'fan', 41, 'San Nam Phong', 22000],
    ['CLB Da Dinh', 'THP', 'Da Dinh', '#F26522', '#FFFFFF', 'fan', 41, 'Ha Quan Stadium', 15000],
    ['Than Bac Quan', 'CAD', 'Bac Quan', '#FFD100', '#00843D', 'fan', 39, 'San Binh An', 10000],
    ['CLB Vinh An', 'KHB', 'Vinh An', '#E30613', '#000000', 'fan', 39, 'San Tuy Nai', 19000],
    ['Sai Tuy Duong', 'TEC', 'Tuy Duong', '#FFD100', '#6A1B9A', 'fan', 39, 'San Tuy Duong', 25000],
    ['Than Long Son', 'BAP', 'Long Son', '#0057B8', '#FFFFFF', 'fan', 38, 'San Long Phong', 10000],
    ['Thep Lam Son', 'BAQ', 'Lam Son', '#E30613', '#FFD100', 'youth', 38, 'Lam Son Stadium', 20000],
    ['Sai Long Lac', 'THG', 'Long Lac', '#E30613', '#FFFFFF', 'fan', 38, 'Long Lac Stadium', 20000],
    ['Thep Da Phong', 'SOA', 'Da Phong', '#E30613', '#FFD100', 'fan', 38, 'Da Phong Stadium', 20000],
    ['Thai Son FC', 'BIA', 'Thai Son', '#00843D', '#FFFFFF', 'fan', 37, 'San Phu Giang', 10000],
    ['Xi Mang Dong Giang', 'LAB', 'Dong Giang', '#0057B8', '#FFFFFF', 'fan', 37, 'San Dong Giang', 10000],
    ['Thep Dong Nang', 'DOG', 'Dong Nang', '#FFD100', '#E30613', 'fan', 37, 'San Dong Nang', 10000],
  ];
  FM.D.CLUBS_IN1 = [
    ['Mankot Rangers', 'MAH', 'Mankot', '#00843D', '#8A1538', 'giant', 50, 'Indopur Sports Park', 68000],
    ['Gwalkheda City', 'GWB', 'Gwalkheda', '#6CACE4', '#FFFFFF', 'oil', 48, 'Gwalkheda Municipal Stadium', 18000],
    ['Mankot United', 'MAL', 'Mankot', '#E30613', '#FFD100', 'giant', 47, 'Mankot Sports Complex', 68000],
    ['Solbad FC', 'SOB', 'Solbad', '#FFD100', '#0057B8', 'giant', 47, 'Gwalwala Arena', 40000],
    [
      'Meerpuram Wanderers',
      'MEE',
      'Meerpuram',
      '#0057B8',
      '#FFFFFF',
      'selling',
      47,
      'Meerpuram Municipal Stadium',
      25000,
    ],
    ['FC Kalkot', 'KAC', 'Kalkot', '#F26522', '#0057B8', 'historic', 46, 'Kalkot Municipal Stadium', 19000],
    ['Ahmwala United', 'AHM', 'Ahmwala', '#6A1B9A', '#FFFFFF', 'selling', 45, 'Ganganj Sports Park', 15000],
    ['Kolpally United', 'KOL', 'Kolpally', '#0057B8', '#FFFFFF', 'fan', 45, 'Ujjhalli Sports Park', 40000],
    ['Madpally Town', 'MAM', 'Madpally', '#E30613', '#FFFFFF', 'oil', 44, 'Madpally Sports Complex', 24000],
    ['Ujjgarh Wanderers', 'UJH', 'Ujjgarh', '#FFD100', '#000000', 'selling', 44, 'Ambkot Sports Park', 30000],
    ['Ujjkheda Athletic', 'UJJ', 'Ujjkheda', '#E30613', '#000000', 'fan', 43, 'Belwala Sports Park', 35000],
    ['Sporting Ambhalli', 'AMB', 'Ambhalli', '#E30613', '#FFFFFF', 'fan', 42, 'Dhaner Sports Park', 20000],
    ['FC Surnagar', 'SAE', 'Mankot', '#000000', '#FFFFFF', 'historic', 42, 'Ambad Sports Park', 23000],
    ['Vadwala Athletic', 'VAA', 'Vadwala', '#FFFFFF', '#001F5B', 'fan', 40, 'Vadwala Municipal Stadium', 20000],
  ];
  FM.D.CLUBS_CL1 = [
    ['Real Club Piedero', 'PIE', 'Piedero', '#FFFFFF', '#000000', 'giant', 53, 'Campo de Piedero', 47000],
    ['Racing Piedero', 'PIO', 'Piedero', '#0057B8', '#E30613', 'giant', 52, 'Estadio Municipal de Piedero', 48000],
    ['Real Club Olmal', 'OLD', 'Piedero', '#FFFFFF', '#0057B8', 'giant', 51, 'Estadio La Navosa', 20000],
    ['Sporting Elchara', 'ELA', 'Elchara', '#F26522', '#FFFFFF', 'historic', 47, 'Estadio Zamosa', 12000],
    ['Atlético Castino', 'CAG', 'Castino', '#FFD100', '#0057B8', 'historic', 45, 'Estadio Fragares', 18000],
    ['Ribero Atlético', 'RIB', 'Ribero', '#000000', '#6CACE4', 'selling', 44, 'Nuevo Estadio Ribero', 10000],
    ['Juventud Sepúlvedo', 'SEA', 'Piedero', '#E30613', '#00843D', 'historic', 44, 'Estadio Aranjosa', 20000],
    ['Unión Gandejo', 'GAA', 'Piedero', '#E30613', '#FFFFFF', 'historic', 44, 'Nuevo Estadio Piedero', 20000],
    ['Racing Alto Tarifiel', 'ALF', 'Tarifiel', '#6CACE4', '#FFFFFF', 'fan', 44, 'Estadio La Elchedo', 13000],
    ['Real Plasero', 'PLC', 'Piedero', '#00843D', '#FFFFFF', 'historic', 43, 'Ciudad Deportiva Piedero', 12000],
    ['Arroiel CF', 'ARB', 'Arroiel', '#F26522', '#FFFFFF', 'fan', 43, 'Estadio Municipal de Arroiel', 12000],
    ['Mayorero Atlético', 'MAQ', 'Mayorero', '#FFD100', '#000000', 'fan', 43, 'Estadio La Villedo', 18000],
    ['Juventud Segovena', 'SEC', 'Segovena', '#E30613', '#FFFFFF', 'fan', 42, 'Estadio Municipal de Segovena', 18000],
    [
      'UD Campo de Guadara',
      'CAJ',
      'Campo de Guadara',
      '#6CACE4',
      '#FFFFFF',
      'fan',
      41,
      'Estadio Municipal de Campo de Guadara',
      10000,
    ],
    ['Santa Rondal CF', 'ROA', 'Rondal', '#E30613', '#000000', 'fan', 41, 'Ciudad Deportiva Rondal', 12000],
    ['Aranjino Balompié', 'ARD', 'Aranjino', '#E30613', '#FFD100', 'fan', 40, 'Ciudad Deportiva Aranjino', 7000],
  ];
  FM.D.CLUBS_PE1 = [
    ['Estudiantes de Fuental', 'FUB', 'Fuental', '#FFD100', '#E30613', 'giant', 51, 'Campo de Fuental', 80000],
    ['Real Fuental', 'FUL', 'Fuental', '#0057B8', '#FFFFFF', 'giant', 50, 'Estadio Municipal de Fuental', 35000],
    ['SD Orihena', 'SDD', 'Fuental', '#6CACE4', '#FFFFFF', 'giant', 48, 'Estadio La Gandón', 11000],
    ['Sporting Fuentilla', 'FUC', 'Fuentilla', '#E30613', '#000000', 'historic', 46, 'Estadio La Calpón', 40000],
    ['Unión Calatana', 'CAP', 'Calatana', '#E30613', '#FFFFFF', 'historic', 44, 'Nuevo Estadio Calatana', 40000],
    ['Valdador CF', 'VAF', 'Valdador', '#6CACE4', '#FFFFFF', 'historic', 43, 'Estadio Municipal de Valdador', 13000],
    ['Atlético Calatana', 'CAQ', 'Calatana', '#E30613', '#000000', 'fan', 43, 'Campo de Calatana', 40000],
    ['Racing Pediel', 'PEG', 'Pediel', '#E30613', '#FFFFFF', 'fan', 42, 'Ciudad Deportiva Pediel', 20000],
    [
      'Atlético Villa Fresnete',
      'FRB',
      'Calatana',
      '#E30613',
      '#FFFFFF',
      'fan',
      42,
      'Estadio Municipal de Calatana',
      40000,
    ],
    ['Real Club Alto Zafrilla', 'ALG', 'Zafrilla', '#0057B8', '#FFFFFF', 'fan', 41, 'Campo de Zafrilla', 12000],
    ['Unión Lucana', 'LUA', 'Lucana', '#FFD100', '#0057B8', 'fan', 41, 'Estadio Tordera', 15000],
    [
      'San Tarifana Balompié',
      'TAX',
      'Tarifana',
      '#E30613',
      '#FFFFFF',
      'fan',
      40,
      'Estadio Municipal de Tarifana',
      20000,
    ],
    ['Juventud Tordara', 'TOA', 'Tordara', '#0057B8', '#FFFFFF', 'fan', 40, 'Ciudad Deportiva Tordara', 10000],
    ['Gandero CF', 'GAO', 'Gandero', '#E30613', '#FFFFFF', 'historic', 40, 'Estadio Palomara', 18000],
    ['Club Villa Benavanes', 'BEB', 'Villa Benavanes', '#E30613', '#FFFFFF', 'fan', 39, 'Estadio La Jarandiel', 5000],
    ['Las Medera Atlético', 'LAC', 'Las Medera', '#FFD100', '#00843D', 'fan', 39, 'Estadio La Zamino', 9000],
    ['Unión Pozete', 'POB', 'Pozete', '#FFFFFF', '#0057B8', 'youth', 38, 'Campo de Pozete', 6000],
    ['Villejo CF', 'VIA', 'Calatana', '#E30613', '#FFFFFF', 'youth', 37, 'Estadio Cabrana', 8000],
  ];
  FM.D.CLUBS_PY1 = [
    ['Lavona FC', 'LAV', 'Lavona', '#FFFFFF', '#000000', 'giant', 51, 'Estadio Garona', 40000],
    ['Club Atlético Lavona', 'LAH', 'Lavona', '#0057B8', '#E30613', 'giant', 51, 'Estadio Municipal de Lavona', 45000],
    ['Sportivo Arrano', 'ARE', 'Lavona', '#000000', '#FFFFFF', 'historic', 48, 'Cancha de Lavona', 10000],
    ['Unión de Urqilla', 'URA', 'Lavona', '#FFD100', '#000000', 'historic', 46, 'Estadio Urqini', 8000],
    ['Independiente Castilla', 'CLA', 'Lavona', '#FFFFFF', '#E30613', 'historic', 45, 'Estadio Escar', 10000],
    ['Racing de Escar', 'ESC', 'Escar', '#FFD100', '#0057B8', 'fan', 43, 'Cancha de Escar', 25000],
    ['Estudiantes de Urqui', 'URI', 'Urqui', '#0057B8', '#FFFFFF', 'fan', 42, 'Cancha de Urqui', 10000],
    ['Defensores de Herez', 'HER', 'Herez', '#0057B8', '#E30613', 'fan', 40, 'Estadio Monumental Belas', 5000],
    ['Club Deportivo Franón', 'FRF', 'Franón', '#E30613', '#FFFFFF', 'fan', 40, 'Cancha de Franón', 7000],
    ['Club Deportivo Torez', 'TOZ', 'Lavona', '#6CACE4', '#FFFFFF', 'fan', 40, 'Estadio Saria', 6000],
    ['Club Deportivo Sarona', 'SAJ', 'Lavona', '#E30613', '#000000', 'fan', 39, 'Estadio Dorrar', 8000],
    ['Club de Regatas Alveria', 'REB', 'Lavona', '#E30613', '#FFFFFF', 'fan', 39, 'Estadio Toreda', 6000],
  ];
  FM.D.CLUBS_SN1 = [
    ['Union Dalgou', 'DAL', 'Dalgou', '#00843D', '#FFFFFF', 'historic', 46, 'Stade Sanlack', 10000],
    ['Union Loudougou', 'LOU', 'Dalgou', '#FFFFFF', '#0057B8', 'youth', 45, 'Stade Sedack', 3000],
    ['US Dalgou', 'DAU', 'Dalgou', '#00843D', '#FFD100', 'historic', 44, 'Stade Sedlack', 10000],
    ['Olympique de Yamra', 'OLY', 'Yamra', '#FFFFFF', '#00843D', 'fan', 41, 'Stade de la Paix Yamra', 5000],
    ['Sporting Manoro', 'MAU', 'Manoro', '#0057B8', '#FFFFFF', 'fan', 41, 'Complexe Sportif Manoro', 5000],
    [
      'Sporting Bouinchor',
      'BOC',
      'Bouinchor',
      '#00843D',
      '#E30613',
      'historic',
      41,
      'Stade Municipal de Bouinchor',
      8000,
    ],
    ['Académie Sedlack', 'ACA', 'Sedlack', '#FFD100', '#00843D', 'fan', 40, 'Complexe Sportif Sedlack', 10000],
    ['US Tamback', 'TAA24', 'Dalgou', '#0057B8', '#E30613', 'youth', 40, 'Stade Sanma', 3000],
    ['Daké FC', 'DAK', 'Dalgou', '#0057B8', '#FFFFFF', 'selling', 40, 'Stade Municipal de Dalgou', 5000],
    ['US Zigra', 'ZIG', 'Zigra', '#E30613', '#FFFFFF', 'fan', 39, 'Stade de la Paix Zigra', 8000],
    ['AS Zigar Mimosas', 'ZIR', 'Zigar', '#0057B8', '#FFFFFF', 'fan', 39, 'Stade de la Paix Zigar', 8000],
    ['Étoile de Manouo', 'MAO', 'Manouo', '#00843D', '#FFD100', 'fan', 39, 'Complexe Sportif Manouo', 8000],
  ];
  FM.D.CLUBS_GH1 = [
    ['Suho United', 'SUH', 'Suho', '#E30613', '#FFFFFF', 'giant', 47, 'Suho Park', 40000],
    ['Wara Hearts of Oak', 'WAR', 'Wara', '#E30613', '#0057B8', 'giant', 47, 'Wara Cultural Stadium', 40000],
    ['Sekam United', 'SEK', 'Sekam', '#FFD100', '#000000', 'selling', 42, 'Sekam Sports Stadium', 10000],
    ['Akra Porcupines', 'AKR', 'Akra', '#FFD100', '#00843D', 'fan', 41, 'Akra Sports Stadium', 7000],
    ['Adadi Hearts of Oak', 'ADA', 'Adadi', '#E30613', '#FFFFFF', 'selling', 41, 'Dunmale Arena', 5000],
    ['Anofu Gold Stars', 'ANO', 'Anofu', '#FFD100', '#00843D', 'fan', 40, 'Anofu Cultural Stadium', 5000],
    ['Upper Takam United', 'TAB25', 'Takam', '#00843D', '#FFFFFF', 'oil', 40, 'Takam Park', 5000],
    ['Sumu Stars', 'SUC', 'Sumu', '#0057B8', '#FFFFFF', 'fan', 40, 'Badi Arena', 5000],
    ['Real Wara', 'WAB', 'Wara', '#0057B8', '#00843D', 'fan', 40, 'Bamasi Stadium', 10000],
    ['New Yenadi Heroes', 'YEA', 'Yenadi', '#FFD100', '#000000', 'selling', 39, 'Base Arena', 5000],
    ['Real Effondi', 'EFF', 'Effondi', '#00843D', '#E30613', 'fan', 38, 'Effondi Park', 3000],
    ['Koho Stars', 'KOH', 'Koho', '#E30613', '#000000', 'fan', 38, 'Koho Cultural Stadium', 3000],
    ['Upper Komale Stars', 'KOM', 'Komale', '#E30613', '#000000', 'fan', 38, 'Komale Cultural Stadium', 5000],
    ['Hokam Great United', 'HOA', 'Wara', '#0057B8', '#FFFFFF', 'fan', 37, 'Takase Arena', 3000],
  ];
  FM.D.CLUBS_CI1 = [
    ['Académie Kaogou', 'ACE', 'Kaogou', '#FFD100', '#000000', 'giant', 46, 'Stade de la Paix Kaogou', 35000],
    ['Kaogou FC', 'KAD', 'Kaogou', '#00843D', '#E30613', 'giant', 43, 'Complexe Sportif Kaogou', 35000],
    ['Union Sportive de Daklack', 'SPE', 'Daklack', '#E30613', '#FFFFFF', 'fan', 40, 'Complexe Sportif Daklack', 10000],
    ['Stade de Loussou', 'LOL', 'Kaogou', '#E30613', '#FFFFFF', 'fan', 40, 'Stade Bouès', 5000],
    ['Académie Fatack', 'AIE', 'Kaogou', '#0057B8', '#E30613', 'historic', 40, 'Stade Kaoma', 5000],
    ['AS Daklack Mimosas', 'DCK', 'Daklack', '#0057B8', '#FFFFFF', 'fan', 39, 'Stade de la Paix Daklack', 8000],
    ['US Boulack', 'BOK', 'Boulack', '#E30613', '#00843D', 'fan', 39, 'Stade Dakra', 8000],
    ['Racing Yamssou', 'YAA', 'Yamssou', '#00843D', '#FFFFFF', 'fan', 39, 'Stade Bakack', 10000],
    ['US Yamouo', 'YAO', 'Yamouo', '#0057B8', '#FFFFFF', 'fan', 39, 'Complexe Sportif Yamouo', 6000],
    ['ASC Thima', 'ASC', 'Kaogou', '#00843D', '#FFD100', 'fan', 38, 'Stade Sanoro', 5000],
    ['Daloro FC', 'DAO', 'Daloro', '#E30613', '#00843D', 'fan', 38, 'Stade Tambra', 5000],
    ['Académie Yamssou', 'ACY', 'Yamssou', '#E30613', '#FFD100', 'fan', 38, 'Stade de la Paix Yamssou', 8000],
  ];
  FM.D.CLUBS_CM1 = [
    ['Sasbala FC', 'SAT', 'Sasbala', '#00843D', '#FFFFFF', 'giant', 45, 'Stade Municipal de Sasbala', 20000],
    ['Étoile de Mansso', 'MSO', 'Mansso', '#E30613', '#00843D', 'historic', 44, 'Stade Nzéguéré', 30000],
    ['FC Nzékassa', 'NZE', 'Nzékassa', '#E30613', '#FFFFFF', 'historic', 42, 'Stade Municipal de Nzékassa', 30000],
    ['Matré Académie', 'MAV', 'Matré', '#0057B8', '#FFFFFF', 'fan', 41, 'Stade Yamngo', 10000],
    [
      'Union Grand Gaoré',
      'GRC',
      'Grand Gaoré',
      '#FFFFFF',
      '#0057B8',
      'fan',
      39,
      'Stade Municipal de Grand Gaoré',
      5000,
    ],
    ['SC Dalbala', 'DAC', 'Dalbala', '#E30613', '#FFFFFF', 'fan', 39, 'Complexe Sportif de Dalbala', 5000],
    ['Sikguéré Académie', 'SIK', 'Sikguéré', '#00843D', '#E30613', 'fan', 39, 'Stade Kougou', 7000],
    ['Union Gudala', 'GUC', 'Gudala', '#00843D', '#FFFFFF', 'fan', 38, 'Complexe Sportif de Gudala', 5000],
    ['Racing Koumbé', 'KOU', 'Koumbé', '#0057B8', '#FFFFFF', 'fan', 38, 'Complexe Sportif de Koumbé', 10000],
    ['US Touloum', 'TOC', 'Touloum', '#000000', '#FFD100', 'fan', 38, 'Stade Bandala', 8000],
    ['FC Bokdougou', 'BOD', 'Bokdougou', '#0057B8', '#FFFFFF', 'fan', 37, 'Complexe Sportif de Bokdougou', 5000],
    ['Union Mansso', 'MAX', 'Mansso', '#0057B8', '#FFFFFF', 'youth', 37, 'Stade Municipal de Mansso', 3000],
  ];
  FM.D.CLUBS_CD1 = [
    ['Étoile de Zigbia', 'ZIA', 'Zigbia', '#000000', '#FFFFFF', 'giant', 48, 'Stade Labkro', 18000],
    ['US Nouveau Katmbé', 'NOC', 'Nouveau Katmbé', '#00843D', '#000000', 'giant', 45, 'Stade Zigdougou', 80000],
    ['Étoile de Nouveau Katmbé', 'NAL', 'Nouveau Katmbé', '#00843D', '#FFFFFF', 'historic', 43, 'Stade Gukassa', 80000],
    ['AS Zigbia', 'ZIZ', 'Zigbia', '#E30613', '#FFFFFF', 'historic', 41, 'Complexe Sportif de Zigbia', 18000],
    ['FC Petit Mbuguéré', 'PET', 'Petit Mbuguéré', '#FFD100', '#0057B8', 'fan', 39, 'Stade Fouré', 5000],
    ['SC Boudian', 'BOE', 'Zigbia', '#00843D', '#FFFFFF', 'youth', 39, 'Stade Yopgou', 5000],
    ['SC Diogou', 'DIO', 'Diogou', '#0057B8', '#FFD100', 'fan', 39, 'Stade Tamya', 10000],
    ['AS Bobala', 'BOF', 'Zigbia', '#0057B8', '#FFFFFF', 'fan', 38, 'Stade Yamdian', 5000],
    ['Yopsso FC', 'YOP', 'Zigbia', '#E30613', '#FFFFFF', 'fan', 38, 'Stade Municipal de Zigbia', 5000],
    ['FC Kismbo', 'KIC', 'Kismbo', '#E30613', '#000000', 'fan', 37, 'Stade Municipal de Kismbo', 8000],
    ['Zigmbo FC', 'ZIO', 'Zigmbo', '#00843D', '#FFD100', 'fan', 37, 'Stade Manbala', 8000],
    ['Racing Labgou', 'LAJ', 'Labgou', '#0057B8', '#FFFFFF', 'fan', 37, 'Stade Municipal de Labgou', 8000],
  ];
  FM.D.CLUBS_ML1 = [
    ['Racing Ousso', 'OUS', 'Ousso', '#FFFFFF', '#E30613', 'giant', 43, 'Stade Bokmbé', 35000],
    ['Ousso Académie', 'OUO', 'Ousso', '#00843D', '#FFFFFF', 'giant', 42, 'Complexe Sportif de Ousso', 35000],
    ['FC Tamdian', 'TAC26', 'Ousso', '#E30613', '#FFFFFF', 'giant', 42, 'Stade Kisbia', 35000],
    ['Kayré Académie', 'KAE', 'Ousso', '#0057B8', '#FFFFFF', 'youth', 40, 'Stade Matsso', 5000],
    ['AS Sésso', 'SED', 'Sésso', '#FFD100', '#00843D', 'fan', 38, 'Complexe Sportif de Sésso', 5000],
    ['Racing Kandougou', 'KAN', 'Kandougou', '#00843D', '#FFD100', 'fan', 38, 'Stade Municipal de Kandougou', 5000],
    ['Mbudougou Académie', 'MBU', 'Ousso', '#0057B8', '#FFFFFF', 'fan', 37, 'Stade Gumbo', 5000],
    ['US Sasso', 'SAV', 'Ousso', '#000000', '#FFFFFF', 'fan', 37, 'Stade Mankassa', 5000],
    ['Banguéré FC', 'BAT', 'Banguéré', '#0057B8', '#00843D', 'fan', 37, 'Complexe Sportif de Banguéré', 5000],
    ['Racing Dakdougou', 'DOB', 'Ousso', '#FFD100', '#0057B8', 'fan', 37, 'Stade Gugou', 5000],
    ['AS Yamsso', 'YSO', 'Yamsso', '#E30613', '#FFFFFF', 'fan', 37, 'Stade Labia', 5000],
    [
      'FC Petit Zigngo',
      'PIB',
      'Petit Zigngo',
      '#00843D',
      '#FFFFFF',
      'fan',
      36,
      'Complexe Sportif de Petit Zigngo',
      5000,
    ],
  ];
  FM.D.CLUBS_BF1 = [
    [
      'US Nouveau Ouya',
      'NOO',
      'Nouveau Ouya',
      '#00843D',
      '#FFFFFF',
      'historic',
      42,
      'Complexe Sportif de Nouveau Ouya',
      25000,
    ],
    ['Union Nouveau Ouya', 'NOD', 'Nouveau Ouya', '#E30613', '#FFFFFF', 'giant', 42, 'Stade Kouko', 30000],
    ['US Nzédougou', 'NZU', 'Nouveau Ouya', '#00843D', '#FFD100', 'fan', 40, 'Stade Touré', 5000],
    ['FC Manbala', 'MAZ', 'Manbala', '#E30613', '#00843D', 'historic', 40, 'Stade Labtou', 10000],
    ['AS Korsso', 'KOR', 'Nouveau Ouya', '#0057B8', '#FFFFFF', 'fan', 39, 'Stade Abmbé', 10000],
    ['AS Toudala', 'TOD', 'Nouveau Ouya', '#0057B8', '#FFD100', 'selling', 38, 'Stade Kouloum', 5000],
    ['Manbala Académie', 'MLB', 'Manbala', '#FFD100', '#00843D', 'fan', 38, 'Complexe Sportif de Manbala', 5000],
    ['US Kiskro', 'KID', 'Nouveau Ouya', '#00843D', '#FFFFFF', 'fan', 38, 'Stade Yopguéré', 10000],
    ['AS Matkassa', 'MSA', 'Nouveau Ouya', '#E30613', '#000000', 'fan', 37, 'Stade Bobndé', 5000],
    ['Labdian Académie', 'LAL', 'Nouveau Ouya', '#0057B8', '#FFFFFF', 'selling', 37, 'Stade Yopbala', 5000],
    [
      'Dioguéré Académie',
      'DIE',
      'Nouveau Ouya',
      '#6A1B9A',
      '#FFFFFF',
      'fan',
      36,
      'Stade Municipal de Nouveau Ouya',
      5000,
    ],
    ['FC Bouya', 'BYA', 'Nouveau Ouya', '#FFFFFF', '#000000', 'fan', 36, 'Stade Ouko', 5000],
  ];
  FM.D.CLUBS_GN1 = [
    ['FC Mbuguéré', 'MBE', 'Mbuguéré', '#E30613', '#FFFFFF', 'giant', 41, 'Complexe Sportif de Mbuguéré', 20000],
    ['AS Mbuguéré', 'MRE', 'Mbuguéré', '#E30613', '#FFFFFF', 'giant', 40, 'Stade Bamdala', 20000],
    ['Union Bokmbé', 'BOH', 'Mbuguéré', '#FFFFFF', '#0057B8', 'historic', 39, 'Stade Kanguéré', 20000],
    ['Étoile de Nzéloum', 'NZM', 'Mbuguéré', '#0057B8', '#FFFFFF', 'fan', 37, 'Stade Yopmbo', 5000],
    ['Tamndé FC', 'TAD27', 'Tamndé', '#FFD100', '#00843D', 'fan', 37, 'Stade Municipal de Tamndé', 5000],
    ['Étoile de Tamloum', 'TUM', 'Tamloum', '#E30613', '#00843D', 'fan', 36, 'Complexe Sportif de Tamloum', 10000],
    ['FC Bamkassa', 'BAX', 'Mbuguéré', '#0057B8', '#FFD100', 'fan', 36, 'Stade Koubala', 5000],
    ['Racing Toubia', 'TIA', 'Toubia', '#FFD100', '#000000', 'fan', 36, 'Complexe Sportif de Toubia', 5000],
    ['Mopndé Académie', 'MOP', 'Mbuguéré', '#00843D', '#FFFFFF', 'fan', 35, 'Stade Dakloum', 5000],
    ['FC Zigndé', 'ZIE', 'Mbuguéré', '#E30613', '#FFD100', 'fan', 35, 'Stade Mopmbo', 5000],
    ['AS Bamtou', 'BAZ', 'Bamtou', '#00843D', '#FFD100', 'fan', 35, 'Stade Nzékro', 5000],
    ['Racing Matko', 'MKO', 'Mbuguéré', '#E30613', '#0057B8', 'fan', 34, 'Stade Sinko', 5000],
  ];
  FM.D.CLUBS_CV1 = [
    [
      'Atlético Vilães de Cima',
      'VIF',
      'Vilães de Cima',
      '#00843D',
      '#FFFFFF',
      'giant',
      39,
      'Estádio Municipal de Vilães de Cima',
      8000,
    ],
    ['GD Vila Lagela', 'GDD', 'Lagela', '#0057B8', '#FFFFFF', 'historic', 38, 'Estádio Nova Gaiães', 5000],
    ['Sport Clube Amarura', 'AMC', 'Lagela', '#0057B8', '#FFFFFF', 'historic', 38, 'Estádio Gouvouro', 5000],
    ['Esporte Clube Lagela', 'LAP', 'Lagela', '#E30613', '#FFFFFF', 'fan', 37, 'Estádio Nova Santouro', 5000],
    ['Sporting Vilães de Cima', 'VIG', 'Vilães de Cima', '#000000', '#FFFFFF', 'fan', 36, 'Estádio Nova Mira', 8000],
    ['Vilouro FC', 'VIH', 'Vilães de Cima', '#0057B8', '#000000', 'fan', 36, 'Arena Alcobouro', 8000],
    [
      'União Portouro de Cima',
      'POE',
      'Portouro de Cima',
      '#0057B8',
      '#FFFFFF',
      'fan',
      35,
      'Estádio Nova Portela',
      3000,
    ],
    [
      'Portouro de Cima FC',
      'POO',
      'Portouro de Cima',
      '#00843D',
      '#FFFFFF',
      'fan',
      35,
      'Complexo Desportivo Portouro de Cima',
      3000,
    ],
    ['Valeneiro FC', 'VAG', 'Vilães de Cima', '#E30613', '#FFFFFF', 'fan', 35, 'Arena Lamal', 8000],
    ['SC Braganela', 'BRC', 'Braganela', '#0057B8', '#FFD100', 'fan', 34, 'Estádio Nova Lagão', 3000],
  ];
  FM.D.CLUBS_AO1 = [
    ['União Vila Ovarães', 'VIJ', 'Ovarães', '#00843D', '#FFD100', 'giant', 43, 'Estádio Nova Moncorela', 20000],
    [
      'Os Belenenses de Ovarães',
      'OSS',
      'Ovarães',
      '#E30613',
      '#000000',
      'giant',
      43,
      'Complexo Desportivo Ovarães',
      20000,
    ],
    ['Associação Santa Mireira', 'MIB', 'Mireira', '#E30613', '#FFFFFF', 'selling', 40, 'Estádio Penães', 8000],
    ['Racing Santa Avares', 'AVA', 'Ovarães', '#0057B8', '#FFFFFF', 'selling', 40, 'Estádio Nova Estreira', 10000],
    ['Alvorura EC', 'ALV', 'Alvorura', '#FFD100', '#00843D', 'oil', 39, 'Complexo Desportivo Alvorura', 10000],
    ['Esporte Clube Avela', 'AVE', 'Ovarães', '#FFD100', '#000000', 'fan', 38, 'Estádio Municipal de Ovarães', 10000],
    ['Académico Monchela', 'ACO', 'Monchela', '#FFFFFF', '#E30613', 'historic', 38, 'Estádio Nova Sesimeira', 10000],
    ['GD Lousa', 'GGD', 'Lousa', '#0057B8', '#FFFFFF', 'fan', 37, 'Estádio Estrares', 8000],
    ['Sporting Clube de Ferrouro', 'FER', 'Ferrouro', '#0057B8', '#00843D', 'fan', 37, 'Estádio Castal', 10000],
    ['Naval Covães', 'NAP', 'Covães', '#0057B8', '#FFFFFF', 'fan', 37, 'Estádio Pombada', 8000],
    ['Sporting Portares', 'POF', 'Portares', '#E30613', '#FFFFFF', 'fan', 36, 'Estádio Municipal de Portares', 5000],
    ['União Covães', 'COC', 'Covães', '#FFD100', '#00843D', 'fan', 36, 'Estádio Vilais', 5000],
  ];
  FM.D.CLUBS_UA1 = [
    ['FC Pryske', 'PRY', 'Pryske', '#F26522', '#000000', 'giant', 60, 'Stadion imeni Maryska', 35000],
    ['Bukovyna Kovets', 'BUC', 'Kovets', '#FFFFFF', '#0057B8', 'giant', 58, 'Olimpiiskyi Kovets', 70000],
    ['FC Stara Ternopil', 'STC', 'Ternopil', '#000000', '#FFFFFF', 'historic', 47, 'Olimpiiskyi Ternopil', 12000],
    ['Kolos Rovyska', 'KOA', 'Rovyska', '#E30613', '#FFFFFF', 'selling', 46, 'Stadion Rovyska', 25000],
    ['FK Kreyska', 'KRE', 'Kreyska', '#00843D', '#FFFFFF', 'historic', 44, 'Stadion Kreyska', 24000],
    ['Akademiia Yavets', 'AKC', 'Yavets', '#FFD100', '#0057B8', 'selling', 43, 'Stadion Yavets', 5000],
    ['FK Hanyska', 'HAA', 'Hanyska', '#FFD100', '#0057B8', 'fan', 43, 'Olimpiiskyi Hanyska', 7000],
    ['FK Kamyne', 'KAG', 'Kamyne', '#E30613', '#000000', 'fan', 42, 'Kalopil Arena', 8000],
    ['FK Pryske', 'PRB', 'Pryske', '#FFD100', '#E30613', 'historic', 42, 'Stadion imeni Maropil', 40000],
    ['Chornomorets Kalets', 'CHK', 'Kalets', '#0057B8', '#FFFFFF', 'historic', 42, 'Nemopil Arena', 34000],
    ['FC Kamyne', 'KAH', 'Kamyne', '#00843D', '#FFFFFF', 'historic', 42, 'Stadion Pryove', 28000],
    ['Podillia Nova Rovivske', 'POH', 'Nova Rovivske', '#FFFFFF', '#0057B8', 'oil', 41, 'Radyne Arena', 5000],
    ['FC Nyzhnia Ternka', 'NYZ', 'Nyzhnia Ternka', '#E30613', '#FFFFFF', 'fan', 40, 'Stadion Cherychi', 5000],
    ['Podillia Kovets', 'POG', 'Kovets', '#FFD100', '#0057B8', 'fan', 40, 'Stadion imeni Marove', 5000],
    ['Chornomorets Sumets', 'CHL', 'Sumets', '#00843D', '#FFFFFF', 'fan', 40, 'Stadion Sumets', 6000],
    ['Avanhard Stara Kovychi', 'AVD', 'Kamyne', '#00843D', '#FFFFFF', 'fan', 39, 'Stadion Lyuivka', 28000],
  ];
  FM.D.CLUBS_SK1 = [
    ['TJ Popany', 'ZEA', 'Popany', '#6CACE4', '#FFFFFF', 'giant', 48, 'Mestský štadión Popany', 22000],
    ['TJ Gelany', 'MLT', 'Gelany', '#E30613', '#000000', 'historic', 44, 'Podbice Aréna', 19000],
    ['TJ Sobany', 'RUA', 'Sobany', '#FFD100', '#0057B8', 'selling', 44, 'Dubice Aréna', 13000],
    [
      'Spartak Dolné Čadovce',
      'MST',
      'Dolné Čadovce',
      '#E30613',
      '#FFFFFF',
      'historic',
      43,
      'Mestský štadión Dolné Čadovce',
      11000,
    ],
    ['MFK Senovce', 'KRA', 'Senovce', '#FFFFFF', '#E30613', 'historic', 42, 'Trenice Aréna', 5000],
    ['MFK Valice', 'SLB', 'Valice', '#E30613', '#00843D', 'fan', 40, 'Mestský štadión Valice', 4000],
    ['Jednota Nové Dubany', 'DIN', 'Dubany', '#E30613', '#FFFFFF', 'historic', 40, 'Mestský štadión Dubany', 5000],
    ['Iskra Bánice', 'MTU', 'Bánice', '#0057B8', '#FFD100', 'historic', 40, 'Štadión pod Senany', 12000],
    ['Hutník Zvany', 'RAA', 'Zvany', '#E30613', '#FFFFFF', 'historic', 40, 'Štadión pod Hnovce', 6000],
    ['Iskra Čadovce', 'ZEB', 'Čadovce', '#FFD100', '#0057B8', 'fan', 39, 'Lipovce Aréna', 4000],
    ['Lokomotíva Ružovce', 'ZER', 'Ružovce', '#0057B8', '#FFFFFF', 'fan', 38, 'Štadión pod Gelovce', 5000],
    ['Strojár Nové Čadice', 'MEA', 'Čadice', '#FFD100', '#E30613', 'fan', 38, 'Štadión pod Dubovce', 3000],
  ];
  FM.D.CLUBS_SI1 = [
    ['Dinamo Velika Tolica', 'SLE', 'Velika Tolica', '#00843D', '#FFFFFF', 'giant', 47, 'Radica Arena', 16000],
    ['NK Ajdina', 'PEH', 'Ajdina', '#FFFFFF', '#E30613', 'giant', 47, 'Stadion Lenava', 12000],
    ['NK Brica', 'PAG', 'Brica', '#FFD100', '#0057B8', 'historic', 44, 'Športni park Brica', 13000],
    ['NK Stara Sezava', 'NOV', 'Sezava', '#0057B8', '#FFFFFF', 'fan', 41, 'Mestni stadion Sezava', 4000],
    ['Železničar Stara Lenina', 'NOE', 'Lenina', '#000000', '#FFFFFF', 'fan', 41, 'Mestni stadion Lenina', 4000],
    ['Rudar Domava', 'LIP', 'Domava', '#FFD100', '#0057B8', 'selling', 41, 'Kamina Arena', 3000],
    [
      'Korotan Velika Tolica',
      'PAH',
      'Velika Tolica',
      '#F26522',
      '#000000',
      'youth',
      39,
      'Športni park Velika Tolica',
      2000,
    ],
    ['Partizan Škofava', 'LOA', 'Škofava', '#E30613', '#0057B8', 'fan', 39, 'Stadion Idrava', 3000],
    ['Sava Spodnja Trba', 'SLO', 'Spodnja Trba', '#FFFFFF', '#00843D', 'fan', 38, 'Športni park Spodnja Trba', 2000],
    ['ND Zgornja Celina', 'HRA', 'Zgornja Celina', '#E30613', '#FFFFFF', 'fan', 37, 'Črnba Arena', 2000],
  ];
  FM.D.CLUBS_BA1 = [
    ['Sloga Zelava', 'SGA', 'Zelava', '#E30613', '#0057B8', 'giant', 44, 'Kamice Arena', 9000],
    ['FK Dolnina', 'DOD', 'Dolnina', '#0057B8', '#FFFFFF', 'giant', 43, 'Stadion Bogice', 34000],
    ['Lokomotiva Dolnina', 'DOE', 'Dolnina', '#0057B8', '#FFFFFF', 'giant', 43, 'Zagin Arena', 13000],
    ['Lokomotiva Zelovo', 'ZEO', 'Zelovo', '#E30613', '#0057B8', 'historic', 42, 'Stadion Kamovice', 9000],
    ['SK Zelava', 'ZEC', 'Zelava', '#E30613', '#FFFFFF', 'historic', 41, 'Mikica Arena', 7000],
    ['Lokomotiva Donji Novek', 'DOF', 'Donji Novek', '#0057B8', '#FFFFFF', 'fan', 39, 'Stadion Tarpol', 7000],
    ['Union Zagik', 'ZAB', 'Zagik', '#0057B8', '#FFFFFF', 'fan', 39, 'Stadion Kamek', 5000],
    ['KS Malpol', 'MAA24', 'Malpol', '#E30613', '#FFFFFF', 'fan', 38, 'Gradski Stadion Malpol', 4000],
    ['Lokomotiv Mali Tarin', 'LOV', 'Mali Tarin', '#E30613', '#0057B8', 'fan', 37, 'Stadion Mir Mali Tarin', 3000],
    ['Dinamo Donji Novek', 'DID', 'Donji Novek', '#00843D', '#FFFFFF', 'fan', 37, 'Donji Novek Park', 10000],
    ['Torpedo Velovo', 'TOE', 'Velovo', '#E30613', '#0057B8', 'fan', 36, 'Gradski Stadion Velovo', 3000],
    ['Dinamo Belica', 'DMO', 'Belica', '#FFD100', '#0057B8', 'fan', 36, 'Belica Park', 3000],
  ];
  FM.D.CLUBS_AL1 = [
    ['KF Lezaj', 'ZET', 'Lezaj', '#FFFFFF', '#0057B8', 'giant', 42, 'Kompleksi Sportiv Lezaj', 9000],
    ['Lokomotiva Mal Lezaj', 'MEC', 'Lezaj', '#E30613', '#FFFFFF', 'giant', 41, 'Stadiumi Qytetit Lezaj', 9000],
    ['Partizani Mal Mitec', 'ZAR', 'Lezaj', '#0057B8', '#FFFFFF', 'historic', 40, 'Stadiumi Kamec', 9000],
    ['Partizani Fiani', 'MAB25', 'Fiani', '#E30613', '#0057B8', 'historic', 40, 'Stadiumi Qytetit Fiani', 16000],
    ['Shqiponja Vlec', 'HRY', 'Vlec', '#E30613', '#000000', 'selling', 40, 'Kompleksi Sportiv Vlec', 10000],
    ['Shqiponja Kavec', 'MIY', 'Kavec', '#FFD100', '#000000', 'oil', 40, 'Kompleksi Sportiv Kavec', 3000],
    ['Minatori Priza', 'DIH', 'Priza', '#0057B8', '#FFD100', 'historic', 39, 'Stadiumi Bulec', 12000],
    ['Drita Vlica', 'MLS', 'Vlica', '#FFFFFF', '#0057B8', 'fan', 38, 'Vlani Arena', 5000],
    ['KF Gra', 'RYB', 'Gra', '#00843D', '#FFFFFF', 'fan', 38, 'Stadiumi Qytetit Gra', 5000],
    ['Partizani Fushë Kukovë', 'ZED', 'Kukovë', '#00843D', '#E30613', 'fan', 37, 'Stadiumi Qytetit Kukovë', 3000],
  ];
  FM.D.CLUBS_MK1 = [
    ['NK Velava', 'VEB', 'Velava', '#E30613', '#000000', 'giant', 42, 'Gradski Stadion Velava', 32000],
    ['SK Slavgrad', 'SLD', 'Slavgrad', '#0057B8', '#FFFFFF', 'historic', 41, 'Stadion Radice', 15000],
    ['Dinamo Velava', 'DIV', 'Velava', '#E30613', '#FFFFFF', 'historic', 39, 'Stadion Slaina', 10000],
    ['Zora Velany', 'VEY', 'Velany', '#E30613', '#FFFFFF', 'fan', 38, 'Stadion Borek', 5000],
    ['Zenit Police', 'ZIT', 'Police', '#E30613', '#FFFFFF', 'historic', 38, 'Stadion Mir Police', 8000],
    ['Spartak Mikgrad', 'SPF', 'Mikgrad', '#E30613', '#FFFFFF', 'fan', 37, 'Stadion Mir Mikgrad', 3000],
    ['FK Hradava', 'HVA', 'Hradava', '#0057B8', '#FFFFFF', 'youth', 37, 'Hradava Park', 3000],
    ['Železničar Polgrad', 'ZEE', 'Velava', '#00843D', '#FFFFFF', 'fan', 36, 'Malice Arena', 5000],
    ['FC Hradava', 'HRH', 'Hradava', '#FFD100', '#0057B8', 'fan', 36, 'Gradski Stadion Hradava', 4000],
    ['Lokomotiv Lubica', 'LIV', 'Lubica', '#00843D', '#FFFFFF', 'fan', 35, 'Stadion Mir Lubica', 4000],
  ];
  FM.D.CLUBS_ME1 = [
    ['Metalac Mirgrad', 'MAC26', 'Mirgrad', '#0057B8', '#FFFFFF', 'giant', 40, 'Polina Arena', 10000],
    ['Slavia Mali Petec', 'MAI', 'Mali Petec', '#E30613', '#FFFFFF', 'historic', 40, 'Stadion Gorica', 5000],
    ['Rapid Turovac', 'RAC', 'Turovac', '#0057B8', '#FFFFFF', 'fan', 38, 'Stadion Bratice', 5000],
    ['Železničar Dolngrad', 'ZEF', 'Dolngrad', '#0057B8', '#FFFFFF', 'fan', 37, 'Gradski Stadion Dolngrad', 5000],
    ['SK Novi Jasany', 'NVI', 'Novi Jasany', '#0057B8', '#FFFFFF', 'fan', 37, 'Novi Jasany Park', 3000],
    ['Mladost Stari Plesgrad', 'MLP', 'Stari Plesgrad', '#E30613', '#FFD100', 'fan', 36, 'Stadion Turany', 3000],
    ['FC Novica', 'NOF', 'Novica', '#E30613', '#0057B8', 'fan', 36, 'Gradski Stadion Novica', 3000],
    ['FK Draovo', 'DRA', 'Draovo', '#0057B8', '#FFFFFF', 'fan', 36, 'Stadion Polovice', 3000],
    ['AO Ostovice', 'OST', 'Ostovice', '#E30613', '#000000', 'fan', 35, 'Ostovice Park', 3000],
    ['KS Novpol', 'NOL', 'Novpol', '#0057B8', '#FFFFFF', 'fan', 35, 'Novpol Park', 3000],
  ];
  FM.D.CLUBS_BG1 = [
    ['Minyor Malko Hasitsa', 'HRC', 'Malko Hasitsa', '#00843D', '#FFFFFF', 'giant', 48, 'Slets Arena', 12000],
    ['Minyor Dolna Dimovtsi', 'SLK', 'Dimovtsi', '#E30613', '#FFFFFF', 'giant', 45, 'Vrets Arena', 22000],
    ['Minyor Stara Dimovtsi', 'KRD', 'Dimovtsi', '#0057B8', '#FFFFFF', 'giant', 45, 'Stadion Petevo', 25000],
    ['Metalurg Gorna Targrad', 'SCE', 'Targrad', '#000000', '#FFFFFF', 'historic', 42, 'Stadion Targrad', 12000],
    ['PFK Targrad', 'MEB', 'Targrad', '#000000', '#FFD100', 'historic', 42, 'Gradski stadion Targrad', 20000],
    ['Hebar Kyets', 'DIB', 'Kyets', '#000000', '#FFFFFF', 'historic', 41, 'Stadion Kyets', 13000],
    ['Septemvri Svevo', 'DIZ', 'Dimovtsi', '#FFFFFF', '#000000', 'historic', 40, 'Stadion Dobets', 25000],
    ['Dinamo Monitsa', 'MEH', 'Monitsa', '#00843D', '#FFFFFF', 'historic', 40, 'Stadion Sligrad', 12000],
    ['Spartak Smovtsi', 'ZLA', 'Dimovtsi', '#E30613', '#000000', 'fan', 40, 'Burets Arena', 5000],
    ['Balkan Tutgrad', 'MLD', 'Tutgrad', '#00843D', '#FFD100', 'fan', 39, 'Stadion Tutgrad', 7000],
    ['Minyor Gorna Tutets', 'POJ', 'Tutets', '#00843D', '#000000', 'fan', 37, 'Gradski stadion Tutets', 6000],
    ['FK Pazovtsi', 'LUB', 'Pazovtsi', '#E30613', '#FFFFFF', 'fan', 37, 'Gradski stadion Pazovtsi', 5000],
    ['FC Pazino', 'SLZ', 'Pazino', '#E30613', '#FFFFFF', 'fan', 37, 'Rusovtsi Arena', 5000],
    ['FK Kyets', 'BEJ', 'Kyets', '#0057B8', '#FFFFFF', 'fan', 36, 'Slovo Arena', 5000],
  ];
  FM.D.CLUBS_FI1 = [
    ['Uusi Alakuosaari FC', 'ASF', 'Alakuosaari', '#0057B8', '#FFFFFF', 'giant', 47, 'Mikla Urheilupuisto', 10000],
    ['Sisu Rovanen', 'STD', 'Rovanen', '#FFD100', '#000000', 'historic', 43, 'Hämkka Stadion', 5000],
    ['Pyry Hämjärvi', 'NEA', 'Hämjärvi', '#0057B8', '#000000', 'fan', 41, 'Hämjärvi Stadion', 9000],
    ['Pyry Joejoki', 'ASM', 'Joejoki', '#00843D', '#FFD100', 'historic', 41, 'Joejoki Stadion', 16000],
    ['Tarmo Ylä Laasaari', 'FRG', 'Laasaari', '#FFFFFF', '#0057B8', 'fan', 40, 'Laasaari Stadion', 6000],
    ['Savlahti JK', 'STG', 'Savlahti', '#E30613', '#FFFFFF', 'fan', 39, 'Savlahti Stadion', 15000],
    ['FC Mikka', 'LAQ', 'Mikka', '#FFD100', '#00843D', 'fan', 38, 'Lapsalmi Areena', 5000],
    ['FF Ylä Pieniraalahti', 'MAD27', 'Pieniraalahti', '#00843D', '#FFFFFF', 'fan', 38, 'Pieniraalahti Stadion', 4000],
    ['FC Kersalmi', 'STJ', 'Kersalmi', '#0057B8', '#FFFFFF', 'fan', 38, 'Lielahti Areena', 6000],
    ['Tarmo Kajsaari', 'VED', 'Kajsaari', '#00843D', '#FFFFFF', 'historic', 38, 'Kajsaari Stadion', 3000],
    ['IFK Hämjärvi', 'NEB', 'Hämjärvi', '#0057B8', '#FFFFFF', 'historic', 38, 'Imasalmi Stadion', 9000],
    ['Seisalmi FC', 'DYA', 'Seisalmi', '#0057B8', '#FFFFFF', 'fan', 37, 'Kokjoki Urheilupuisto', 5000],
  ];
  FM.D.CLUBS_IS1 = [
    ['Hamar Ytri Þordalur', 'SOE', 'Ytri Þordalur', '#00843D', '#FFFFFF', 'giant', 44, 'Þorvíkvöllur', 5000],
    ['Hamar Hellanes', 'SYA', 'Hellanes', '#E30613', '#000000', 'historic', 43, 'Hafnesvöllur', 5000],
    ['Höttur Hellanes', 'SYE', 'Hellanes', '#E30613', '#FFFFFF', 'giant', 43, 'Ólafsvogurvöllur', 3000],
    ['Höttur Sigluhöfn', 'HOD', 'Hellanes', '#FFFFFF', '#000000', 'giant', 42, 'Íþróttavöllur Hellanes', 3000],
    ['ÍF Grindadalur', 'HEA', 'Grindadalur', '#0057B8', '#FFFFFF', 'fan', 41, 'Borgvíkvöllur', 2000],
    ['UMF Seyfjörður', 'VBY', 'Seyfjörður', '#FFFFFF', '#000000', 'historic', 41, 'Borgeyrivöllur', 6000],
    ['Stykkholt IF', 'LIL', 'Stykkholt', '#FFD100', '#000000', 'historic', 39, 'Grindaholtvöllur', 5000],
    ['Víðir Innri Stykkdalur', 'NND', 'Stykkdalur', '#FFD100', '#0057B8', 'fan', 39, 'Íþróttavöllur Stykkdalur', 3000],
    ['Þróttur Sigluvík', 'HEK', 'Hellanes', '#0057B8', '#FFFFFF', 'historic', 38, 'Hellafossvöllur', 3000],
    [
      'Þróttur Ytri Þordalur',
      'SOG',
      'Ytri Þordalur',
      '#E30613',
      '#FFFFFF',
      'fan',
      37,
      'Íþróttavöllur Ytri Þordalur',
      2000,
    ],
    ['Hamar Siglufoss', 'NEC', 'Siglufoss', '#0057B8', '#FFFFFF', 'fan', 37, 'Húsvogurvöllur', 4000],
    ['Bolfjörður FC', 'ALH', 'Bolfjörður', '#FFFFFF', '#0057B8', 'fan', 37, 'Íþróttavöllur Bolfjörður', 3000],
  ];
  FM.D.CLUBS_GE1 = [
    ['Guria Dzani', 'TSK', 'Dzani', '#0057B8', '#FFFFFF', 'giant', 44, 'Dzani Stadioni', 54000],
    ['Dinamo Tskalani', 'SAW', 'Tskalani', '#0057B8', '#FFFFFF', 'fan', 41, 'Boleli Stadioni', 20000],
    ['Guria Merari', 'MTB', 'Merari', '#E30613', '#FFFFFF', 'fan', 40, 'Merisi Sporti', 5000],
    ['Mziuri Jvarisi', 'OCH', 'Jvarisi', '#0057B8', '#FFFFFF', 'historic', 40, 'Jvarisi Stadioni', 14000],
    ['Iberia Dzani', 'TSI', 'Dzani', '#0057B8', '#FFFFFF', 'oil', 40, 'Arena Dzani', 5000],
    ['Imereti Keruli', 'OCA', 'Keruli', '#FFD100', '#00843D', 'fan', 38, 'Sameli Stadioni', 3000],
    ['Torpedo Khonuli', 'WIA', 'Dzani', '#E30613', '#FFFFFF', 'fan', 38, 'Laneli Sporti', 3000],
    ['Samgurali Kereli', 'MTI', 'Kereli', '#E30613', '#FFFFFF', 'fan', 37, 'Tskalisi Stadioni', 3000],
    ['Merani Dzebi', 'OCI', 'Dzebi', '#00843D', '#FFFFFF', 'fan', 37, 'Arena Dzebi', 3000],
    ['Lokomotivi Lanisi', 'OZI', 'Lanisi', '#E30613', '#FFFFFF', 'fan', 36, 'Zeseli Stadioni', 3000],
  ];
  FM.D.CLUBS_IL1 = [
    ['Bnei Nesia', 'BNE', 'Nesia', '#FFD100', '#0057B8', 'giant', 51, 'Rishot Stadium', 30000],
    ['Maccabi Nesona FC', 'MBI', 'Nesona', '#00843D', '#FFFFFF', 'giant', 50, 'Batia Arena', 30000],
    ['Maccabi Eilon', 'MAE28', 'Eilon', '#E30613', '#FFFFFF', 'giant', 48, 'Eilon Municipal Stadium', 16000],
    ['FC Rehovona', 'REH', 'Rehovona', '#FFD100', '#000000', 'giant', 46, 'Hadia Stadium', 31000],
    ['Hapoel Nesia', 'HAP', 'Nesia', '#E30613', '#FFFFFF', 'historic', 44, 'Sports Park Nesia', 29000],
    ['Beitar Rehovona', 'BEM', 'Rehovona', '#E30613', '#FFFFFF', 'historic', 41, 'Sports Park Rehovona', 31000],
    [
      'Hapoel Nesayim United',
      'HAB',
      'Nesayim',
      '#FFD100',
      '#000000',
      'historic',
      41,
      'Nesayim Municipal Stadium',
      13000,
    ],
    ['FC Eilim', 'EIL', 'Eilim', '#E30613', '#FFFFFF', 'fan', 40, 'Sports Park Eilim', 5000],
    ['Maccabi Nesona', 'MNA', 'Nesona', '#E30613', '#FFFFFF', 'historic', 39, 'Ashut Arena', 14000],
    ['FC Rehovar', 'RER', 'Rehovar', '#E30613', '#FFFFFF', 'fan', 39, 'Rehovar Municipal Stadium', 7000],
    ['Maccabi Yavayim', 'MAF29', 'Yavayim', '#E30613', '#FFFFFF', 'fan', 38, 'Yavayim Municipal Stadium', 5000],
    ['Hapoel Aradim', 'HEL', 'Aradim', '#0057B8', '#FFFFFF', 'fan', 38, 'Sports Park Aradim', 5000],
    ['Maccabi Beerut', 'MAG30', 'Beerut', '#E30613', '#FFFFFF', 'fan', 37, 'Beerut Municipal Stadium', 5000],
    ['Hapoel Petahona', 'HPE', 'Petahona', '#E30613', '#FFFFFF', 'fan', 36, 'Petahona Municipal Stadium', 5000],
  ];
  FM.D.CLUBS_RU1 = [
    ['Zvezda Tomburg', 'ZVE', 'Tomburg', '#6CACE4', '#0057B8', 'giant', 60, 'Tsentralny Stadion Tomburg', 67000],
    ['FC Arzbor', 'ARZ', 'Arzbor', '#E30613', '#FFFFFF', 'giant', 56, 'Stadion Arzbor', 45000],
    ['Trud Arzbor', 'TRU', 'Arzbor', '#E30613', '#0057B8', 'giant', 55, 'Brysk Arena', 30000],
    ['Zenit Vladov', 'ZEV', 'Arzbor', '#E30613', '#00843D', 'giant', 52, 'Peskensk Arena', 27000],
    ['Znamya Perensk', 'ZNA', 'Perensk', '#00843D', '#000000', 'oil', 52, 'Stadion Dinamo Perensk', 35000],
    ['Krylia Kinburg', 'KRY', 'Arzbor', '#0057B8', '#FFFFFF', 'historic', 50, 'Stadion Lipov', 26000],
    ['FK Lipinsk', 'LIK', 'Lipinsk', '#E30613', '#00843D', 'historic', 46, 'Orlsk Arena', 45000],
    ['FC Nizhne-Svetensk', 'NIZ', 'Svetensk', '#00843D', '#FFFFFF', 'oil', 45, 'Stadion Zvonka', 30000],
    ['Shakhtyor Nizhne-Tulov', 'SHC', 'Tulov', '#FFD100', '#0057B8', 'historic', 45, 'Tsentralny Stadion Tulov', 45000],
    ['Avangard Nizhne-Smolovo', 'ARF', 'Smolovo', '#6CACE4', '#FFFFFF', 'historic', 42, 'Stadion Smolovo', 44000],
    ['Zenit Verkhne-Belinsk', 'ZEG', 'Belinsk', '#F26522', '#0057B8', 'fan', 42, 'Tsentralny Stadion Belinsk', 35000],
    ['FC Kingrad', 'KIE', 'Kingrad', '#0057B8', '#FFFFFF', 'oil', 42, 'Stadion Dinamo Kingrad', 47000],
    ['Verkhne-Zvongrad FK', 'VER', 'Zvongrad', '#00843D', '#FFFFFF', 'fan', 40, 'Sortov Arena', 45000],
    ['FC Lipgorsk', 'LSK', 'Lipgorsk', '#0057B8', '#FFFFFF', 'fan', 40, 'Stadion Dinamo Lipgorsk', 8000],
    ['Olimp Kolburg', 'OLI', 'Kolburg', '#E30613', '#00843D', 'fan', 39, 'Stadion Dinamo Kolburg', 32000],
    ['Volga Murka', 'VOL', 'Murka', '#E30613', '#FFFFFF', 'fan', 38, 'Tsentralny Stadion Murka', 18000],
  ];
  FM.D.CLUBS_BY1 = [
    ['Spartak Baryn', 'SPG', 'Baryn', '#FFD100', '#0057B8', 'giant', 46, 'Stadyen Lahensk', 13000],
    [
      'Naftan Malaya Slonensk',
      'NAQ',
      'Slonensk',
      '#0057B8',
      '#FFFFFF',
      'giant',
      44,
      'Haradski Stadyen Slonensk',
      22000,
    ],
    ['Granit Zhodshchyna', 'GRD', 'Zhodshchyna', '#FFD100', '#0057B8', 'selling', 42, 'Lahyn Arena', 4000],
    ['FK Orshovichy', 'ORB', 'Orshovichy', '#0057B8', '#FFFFFF', 'historic', 41, 'Bragichy Arena', 10000],
    ['FC Kasilovichy', 'KAJ', 'Kasilovichy', '#0057B8', '#FFFFFF', 'historic', 40, 'Stadyen Dinamo Kasilovichy', 8000],
    ['Naftan Novy Pruzets', 'NAR', 'Novy Pruzets', '#00843D', '#FFFFFF', 'fan', 38, 'Lidichy Arena', 5000],
    ['Spartak Pinka', 'SAX', 'Pinka', '#0057B8', '#FFFFFF', 'fan', 38, 'Stadyen Pinka', 6000],
    [
      'Vedrich Zhodilovichy',
      'VEE',
      'Zhodilovichy',
      '#E30613',
      '#0057B8',
      'fan',
      38,
      'Stadyen Dinamo Zhodilovichy',
      14000,
    ],
    ['FC Slonensk', 'SSK', 'Slonensk', '#E30613', '#FFFFFF', 'fan', 38, 'Stadyen Slonensk', 3000],
    ['Spartak Bragshchyna', 'SPJ', 'Bragshchyna', '#0057B8', '#FFFFFF', 'fan', 37, 'Svetovichy Arena', 3000],
    [
      'Torpedo Malaya Nesvka',
      'TOO',
      'Malaya Nesvka',
      '#0057B8',
      '#FFFFFF',
      'fan',
      37,
      'Stadyen Dinamo Malaya Nesvka',
      8000,
    ],
    ['Traktor Rasilovichy', 'TRB', 'Rasilovichy', '#FFD100', '#0057B8', 'fan', 36, 'Stadyen Rasilovichy', 5000],
  ];
  FM.D.CLUBS_NI1 = [
    ['East Gainbridge City', 'GAI', 'Gainbridge', '#0057B8', '#FFFFFF', 'giant', 42, 'Helford Lane', 18000],
    ['Gainbridge Athletic', 'GAE', 'Gainbridge', '#00843D', '#E30613', 'giant', 41, 'Gainbridge Ground', 6000],
    ['Old Claydale Corinthians', 'CLB', 'Gainbridge', '#E30613', '#FFFFFF', 'historic', 40, 'Bournwick Road', 3000],
    ['Bridhurst Bohemians', 'BRD', 'Gainbridge', '#E30613', '#000000', 'historic', 40, 'Morcombe Park', 3000],
    ['Ledwold United', 'LED', 'Ledwold', '#E30613', '#FFFFFF', 'selling', 40, 'Huckworth Lane', 3000],
    ['Church Folham Stanley', 'CHQ', 'Folham', '#0057B8', '#FFFFFF', 'historic', 38, 'Torthorpe Lane', 6000],
    ['Granminster Town', 'GRR', 'Granminster', '#0057B8', '#FFFFFF', 'fan', 38, 'The Clifpool Stadium', 4000],
    ['Elmbury United', 'ELM', 'Elmbury', '#E30613', '#FFFFFF', 'historic', 37, 'Farncliff Road', 3000],
    ['Buxstead Athletic', 'BUX', 'Buxstead', '#E30613', '#0057B8', 'fan', 36, 'Marley Park', 2000],
    ['Little Todbury Borough', 'LIC', 'Todbury', '#FFD100', '#000000', 'fan', 36, 'Chalbrook Green', 2000],
    ['Helwich City', 'HEH', 'Helwich', '#6CACE4', '#FFFFFF', 'fan', 36, 'Wokford Park', 3000],
    ['Thirstow Rangers', 'THJ', 'Thirstow', '#E30613', '#FFFFFF', 'fan', 35, 'Thirstow Ground', 2000],
  ];
  FM.D.CLUBS_VE1 = [
    ['Deportivo Yestana', 'YES', 'Yestana', '#E30613', '#FFFFFF', 'giant', 46, 'Estadio Calatana', 30000],
    ['Racing Alto de Ganda', 'ALJ', 'Alto de Ganda', '#FFD100', '#000000', 'giant', 45, 'Estadio La Pedares', 38000],
    ['Nueva Castedo CF', 'NUA', 'Castedo', '#FFD100', '#000000', 'historic', 42, 'Estadio Almazera', 51000],
    ['SD Corvino', 'SDA', 'Corvino', '#E30613', '#FFFFFF', 'fan', 42, 'Estadio Municipal de Corvino', 20000],
    ['Club Salamal', 'SAY', 'Salamal', '#E30613', '#FFFFFF', 'historic', 41, 'Nuevo Estadio Salamal', 35000],
    ['Racing Liorena', 'LID', 'Liorena', '#0057B8', '#FFFFFF', 'fan', 40, 'Nuevo Estadio Liorena', 15000],
    ['Valdares Balompié', 'VAS', 'Valdares', '#00843D', '#FFFFFF', 'fan', 40, 'Campo de Valdares', 8000],
    ['Moraledo Balompié', 'MOC', 'Moraledo', '#E30613', '#FFFFFF', 'historic', 40, 'Estadio Mayoral', 42000],
    ['Yestana Atlético', 'YEB', 'Yestana', '#0057B8', '#FFFFFF', 'fan', 39, 'Estadio La Jarandeda', 10000],
    ['Juventud Albiel', 'ALK', 'Albiel', '#E30613', '#FFFFFF', 'historic', 39, 'Estadio Municipal de Albiel', 15000],
    ['Club Elchosa', 'ELB', 'Elchosa', '#0057B8', '#FFD100', 'fan', 38, 'Estadio La Piedena', 8000],
    ['UD Zafrero', 'ZAC', 'Yestana', '#E30613', '#FFFFFF', 'youth', 37, 'Estadio La Gandares', 5000],
    ['UD Bajo Elcheda', 'BAA24', 'Elcheda', '#00843D', '#FFFFFF', 'fan', 37, 'Estadio La Liora', 12000],
    ['Unión Bajo Aranjador', 'BAB25', 'Aranjador', '#E30613', '#FFFFFF', 'fan', 36, 'Estadio La Torrero', 40000],
  ];
  FM.D.CLUBS_BO1 = [
    ['Real Cordares', 'COE', 'Cordares', '#6CACE4', '#FFFFFF', 'giant', 44, 'Estadio Quintanes', 45000],
    ['Villa Cordares Atlético', 'COG', 'Cordares', '#FFD100', '#000000', 'giant', 43, 'Nuevo Estadio Cordares', 42000],
    ['Marbana CF', 'MNB', 'Marbana', '#E30613', '#FFFFFF', 'giant', 41, 'Estadio Cordeda', 32000],
    ['Deportivo Cordeda', 'COH', 'Cordeda', '#00843D', '#FFFFFF', 'historic', 41, 'Nuevo Estadio Cordeda', 38000],
    [
      'Juventud Alto Cordeda',
      'ALM',
      'Cordeda',
      '#6CACE4',
      '#FFFFFF',
      'historic',
      40,
      'Estadio Municipal de Cordeda',
      38000,
    ],
    ['Atlético Bajo Lucero', 'BJO', 'Lucero', '#E30613', '#FFFFFF', 'fan', 40, 'Ciudad Deportiva Lucero', 22000],
    ['Elchilla Balompié', 'ELD', 'Elchilla', '#FFFFFF', '#0057B8', 'youth', 38, 'Estadio Sora', 10000],
    ['Deportivo Marbana', 'MMA', 'Marbana', '#0057B8', '#FFD100', 'historic', 38, 'Estadio Sorera', 32000],
    ['Club Bajo Cordete', 'BAC26', 'Cordete', '#FFD100', '#0057B8', 'fan', 37, 'Estadio La Calatana', 10000],
    ['Sporting Piedares', 'PID', 'Piedares', '#E30613', '#FFFFFF', 'fan', 37, 'Estadio Escalal', 32000],
    ['San Fuentanes CF', 'FUD', 'San Fuentanes', '#FFD100', '#000000', 'fan', 37, 'Campo de San Fuentanes', 30000],
    ['Juventud Alto Cordana', 'ATA', 'Cordana', '#0057B8', '#FFFFFF', 'fan', 36, 'Estadio Fragete', 5000],
  ];
  FM.D.CLUBS_CR1 = [
    ['Atlético Olmón', 'OLE', 'Olmón', '#6A1B9A', '#FFFFFF', 'giant', 45, 'Ciudad Deportiva Olmón', 23000],
    ['Unión Alto Marbosa', 'ALN', 'Marbosa', '#E30613', '#000000', 'giant', 45, 'Estadio La Villara', 18000],
    ['Nerjana Balompié', 'NER', 'Nerjana', '#FFD100', '#E30613', 'giant', 43, 'Estadio Municipal de Nerjana', 9000],
    ['Racing Nueva Cordejo', 'NUB', 'Cordejo', '#0057B8', '#FFFFFF', 'historic', 40, 'Nuevo Estadio Cordejo', 17000],
    ['Deportivo Osunal del Mar', 'OSA', 'Osunal del Mar', '#0057B8', '#FFFFFF', 'fan', 38, 'Estadio Cabriel', 5000],
    ['Club Quintero', 'QUB', 'Quintero', '#FFFFFF', '#0057B8', 'fan', 38, 'Estadio Municipal de Quintero', 5000],
    [
      'Monte Tarifete Atlético',
      'MOG',
      'Monte Tarifete',
      '#FFD100',
      '#0057B8',
      'fan',
      37,
      'Estadio Municipal de Monte Tarifete',
      4000,
    ],
    ['Deportivo Olmón', 'OLN', 'Olmón', '#0057B8', '#FFFFFF', 'fan', 37, 'Campo de Olmón', 5000],
    ['Club Bajo Palomanes', 'BAD27', 'Olmón', '#0057B8', '#FFFFFF', 'fan', 37, 'Estadio Elchilla', 4000],
    ['Nerjete CF', 'NEE', 'Nerjete', '#FFD100', '#0057B8', 'fan', 37, 'Estadio Municipal de Nerjete', 4000],
    ['Juventud Valdemar', 'VAH', 'Valdemar', '#E30613', '#FFFFFF', 'fan', 36, 'Ciudad Deportiva Valdemar', 6000],
    ['Atlético Bailana', 'BAE28', 'Bailana', '#FFD100', '#0057B8', 'fan', 36, 'Estadio La Valdete', 5000],
  ];
  FM.D.CLUBS_JM1 = [
    ['Mount Richwood Select', 'STL', 'Richwood', '#E30613', '#FFFFFF', 'giant', 41, 'Richwood Park', 9000],
    ['Spanish Winwood Select', 'REE', 'Spanish Winwood', '#E30613', '#FFFFFF', 'historic', 40, 'Dunham Gardens', 5000],
    ['Old Morley Select', 'FEN', 'Morley', '#00843D', '#FFFFFF', 'youth', 40, 'Morley Park', 3000],
    [
      'Spanish Winwood Pen',
      'REF',
      'Spanish Winwood',
      '#000000',
      '#FFFFFF',
      'historic',
      39,
      'Spanish Winwood Sports Complex',
      5000,
    ],
    ['Spaldale Harbour', 'YAB', 'Spanish Winwood', '#00843D', '#FFFFFF', 'historic', 38, 'Morwood Stadium', 7000],
    ['Linford All Stars', 'WOB', 'Linford', '#0057B8', '#FFFFFF', 'fan', 37, 'Linford Park', 3000],
    ['Fulwood United', 'WOC', 'Fulwood', '#FFD100', '#0057B8', 'fan', 37, 'Fulwood Sports Complex', 3000],
    ['Morbay Boys Town', 'CAV', 'Spanish Winwood', '#00843D', '#FFFFFF', 'fan', 37, 'Spanish Winwood Park', 5000],
    ['Clavale Pen', 'HAC', 'Spanish Winwood', '#0057B8', '#FFFFFF', 'fan', 36, 'Fulbay Oval', 3000],
    ['Pemton Rangers', 'EXW', 'Spanish Winwood', '#0057B8', '#FFFFFF', 'fan', 36, 'Norhall Stadium', 5000],
    ['Linford United', 'WCK', 'Linford', '#E30613', '#00843D', 'fan', 35, 'Hamford Oval', 3000],
    ['New Hambay FC', 'SAZ', 'Hambay', '#E30613', '#FFFFFF', 'fan', 35, 'Hambay Park', 3000],
  ];
  FM.D.CLUBS_HN1 = [
    ['Real Club Segovete', 'SEE', 'Segovete', '#FFFFFF', '#0057B8', 'giant', 44, 'Estadio Cordador', 35000],
    ['Juventud Segovete', 'SEH', 'Segovete', '#0057B8', '#FFFFFF', 'giant', 43, 'Estadio La Valdena', 35000],
    [
      'Juventud Santa Lioreda',
      'LIE',
      'Lioreda',
      '#FFD100',
      '#0057B8',
      'giant',
      42,
      'Estadio Municipal de Lioreda',
      37000,
    ],
    ['Deportivo Lioreda', 'LDA', 'Lioreda', '#00843D', '#FFFFFF', 'historic', 41, 'Ciudad Deportiva Lioreda', 22000],
    ['Atlético Pozal', 'POK', 'Pozal', '#0057B8', '#FFFFFF', 'historic', 39, 'Estadio Fragero', 17000],
    ['Palomino CF', 'PAJ', 'Palomino', '#E30613', '#FFFFFF', 'fan', 37, 'Nuevo Estadio Palomino', 10000],
    ['Pozal Balompié', 'POM', 'Pozal', '#E30613', '#FFFFFF', 'fan', 37, 'Campo de Pozal', 17000],
    ['Unión Villal', 'VIV', 'Villal', '#0057B8', '#FFFFFF', 'fan', 36, 'Estadio Municipal de Villal', 8000],
    ['Racing Club Castero', 'CAW', 'Castero', '#FFD100', '#0057B8', 'fan', 36, 'Campo de Castero', 8000],
    ['Racing Bajo Pozedo', 'BPO', 'Segovete', '#FFD100', '#0057B8', 'youth', 36, 'Estadio Ribete', 5000],
    ['Deportivo Plasedo', 'PLD', 'Plasedo', '#E30613', '#FFFFFF', 'fan', 36, 'Campo de Plasedo', 7000],
    ['Villa Ribares CF', 'RIC', 'Ribares', '#00843D', '#FFFFFF', 'fan', 36, 'Nuevo Estadio Ribares', 8000],
  ];
  FM.D.CLUBS_PA1 = [
    ['Deportivo Villa Yestero', 'YEC', 'Yestero', '#FFFFFF', '#000000', 'historic', 42, 'Estadio Corvador', 8000],
    ['Juventud Yestero', 'YRO', 'Yestero', '#E30613', '#FFFFFF', 'historic', 40, 'Estadio Corveda', 5000],
    ['UD Villa Almazón', 'ALP', 'Almazón', '#E30613', '#0057B8', 'fan', 39, 'Nuevo Estadio Almazón', 5000],
    ['Racing Villa Alcalal', 'ALQ', 'Alcalal', '#00843D', '#FFFFFF', 'historic', 39, 'Estadio Piedador', 10000],
    ['Racing Santa Valdena', 'VAJ', 'Yestero', '#00843D', '#FFFFFF', 'youth', 38, 'Nuevo Estadio Yestero', 5000],
    ['Racing Calpares', 'CAX', 'Yestero', '#0057B8', '#FFFFFF', 'fan', 38, 'Estadio Municipal de Yestero', 5000],
    ['Quintares Atlético', 'QUS', 'Quintares', '#E30613', '#FFFFFF', 'fan', 38, 'Estadio Bailete', 7000],
    ['Real Club San Talejo', 'TAE28', 'Yestero', '#0057B8', '#FFFFFF', 'oil', 38, 'Estadio Alcalara', 3000],
    ['CD Quintares', 'QES', 'Quintares', '#0057B8', '#E30613', 'fan', 37, 'Estadio Orihejo', 5000],
    ['Real San Arroal', 'ARH', 'Arroal', '#00843D', '#FFFFFF', 'fan', 36, 'Estadio La Liorino', 4000],
    ['Real Club Luciel', 'LUD', 'Luciel', '#FFD100', '#0057B8', 'fan', 36, 'Campo de Luciel', 5000],
    ['Atlético Gandilla', 'GAB', 'Gandilla', '#0057B8', '#FFD100', 'fan', 36, 'Estadio La Valdemedo', 5000],
  ];
  FM.D.CLUBS_UZ1 = [
    ['Yangi Andchik City', 'YAN', 'Yangi Andchik', '#0057B8', '#FFFFFF', 'giant', 47, 'Olimpiya Yangi Andchik', 35000],
    ['Yangi Andchik FK', 'YAI', 'Yangi Andchik', '#6CACE4', '#FFFFFF', 'oil', 45, 'Kokiz Stadium', 34000],
    ['Eski Tashbad City', 'ESK', 'Eski Tashbad', '#00843D', '#FFFFFF', 'selling', 44, 'Olimpiya Eski Tashbad', 15000],
    ['Jizbad FK', 'JIZ', 'Yangi Andchik', '#E30613', '#00843D', 'historic', 42, 'Yangi Andchik Markaziy Stadium', 8000],
    ['Sport Club Angqand', 'ANG', 'Angqand', '#0057B8', '#FFFFFF', 'selling', 42, 'Jizabad Arena', 12000],
    ['Olmok City', 'OLK', 'Olmok', '#00843D', '#FFFFFF', 'fan', 41, 'Khivqand Stadium', 22000],
    ['Neftchi Yangi Angqand', 'NEF', 'Yangi Angqand', '#0057B8', '#FFFFFF', 'historic', 40, 'Maranch Stadium', 20000],
    ['Neftchi Bekush', 'NEI', 'Bekush', '#0057B8', '#FFFFFF', 'fan', 40, 'Angush Stadium', 20000],
    ['Neftchi Chirchik', 'NHI', 'Chirchik', '#E30613', '#FFFFFF', 'fan', 39, 'Olimpiya Chirchik', 10000],
    ['Sport Club Andbad', 'AND', 'Andbad', '#E30613', '#0057B8', 'fan', 38, 'Olimpiya Andbad', 10000],
    ['Teranch FK', 'TER', 'Teranch', '#FFD100', '#000000', 'fan', 38, 'Nukqand Arena', 8000],
    ['Khivanch United', 'KHI', 'Khivanch', '#E30613', '#FFFFFF', 'fan', 38, 'Angiz Stadium', 10000],
  ];
  FM.D.CLUBS_NZ1 = [
    ['Paley United', 'GRF', 'Paley', '#001F5B', '#FFFFFF', 'giant', 40, 'Leville Oval', 3000],
    ['Rotstown Technical', 'HEX', 'Rotstown', '#FFD100', '#000000', 'youth', 38, 'Palville Park', 3000],
    ['Paley Suburbs', 'CRE', 'Paley', '#6CACE4', '#FFFFFF', 'youth', 38, 'Waiville Domain', 3000],
    ['Foxburn Technical', 'FIA', 'Paley', '#E30613', '#FFFFFF', 'fan', 37, 'Paley Park', 3000],
    ['Whangley Wanderers', 'LYM', 'Paley', '#0057B8', '#FFFFFF', 'fan', 36, 'Waihaven Domain', 3000],
    ['Palburn United', 'ROS', 'Palburn', '#E30613', '#000000', 'fan', 36, 'Rotburn Park', 3000],
    ['Invfield Marist', 'ELR', 'Invfield', '#E30613', '#000000', 'fan', 36, 'Levfield Domain', 3000],
    ['Taustown Football Club', 'SUD', 'Paley', '#0057B8', '#FFFFFF', 'fan', 35, 'Paley Stadium', 3000],
    ['Tauburn United', 'GAT', 'Tauburn', '#00843D', '#FFFFFF', 'fan', 35, 'Masley Park', 3000],
    ['Rotstown City', 'HTH', 'Rotstown', '#0057B8', '#FFFFFF', 'fan', 35, 'Timfield Domain', 3000],
  ];
  FM.D.CLUBS_IQ1 = [
    ['Zarayn Club', 'ALR', 'Zarayn', '#FFFFFF', '#E30613', 'giant', 47, 'Jawar Stadium', 20000],
    ['Al Ward', 'AAL', 'Zarayn', '#FFFFFF', '#0057B8', 'giant', 46, 'Prince Barayn Stadium', 35000],
    ['Al Dhiyah', 'ALW', 'Zarayn', '#FFFFFF', '#0057B8', 'giant', 46, 'Kutan Stadium', 35000],
    ['Ain Muhan SC', 'AGH', 'Zarayn', '#E30613', '#FFFFFF', 'giant', 44, 'Falah Stadium', 20000],
    ['Umm Ibrayr SC', 'AWA', 'Ibrayr', '#E30613', '#FFFFFF', 'fan', 42, 'Prince Rusar Stadium', 20000],
    ['Al Ghazal', 'ALU', 'Nizayn', '#FFD100', '#0057B8', 'fan', 42, 'Ajlya Arena', 25000],
    ['Al Majd', 'ALX', 'Sohiyah', '#00843D', '#FFFFFF', 'fan', 41, 'Aqan Arena', 15000],
    ['Sohiyah SC', 'ALY', 'Sohiyah', '#FFFFFF', '#0057B8', 'fan', 40, 'Liwah Arena', 15000],
    ['Al Shams', 'ARJ', 'Zarayn', '#00843D', '#FFFFFF', 'fan', 40, 'Zarayn Sports City', 10000],
    ['Al Wadi Hilar', 'ALZ', 'Wadi Hilar', '#0057B8', '#FFD100', 'historic', 40, 'Musayn Stadium', 65000],
    ['Al Umm Diwayr', 'ALA24', 'Zarayn', '#E30613', '#FFFFFF', 'selling', 40, 'Muhiyah Stadium', 5000],
    ['Dahar SC', 'ULA', 'Dahar', '#E30613', '#FFFFFF', 'fan', 39, 'Kariq Arena', 10000],
    ['Al Qurah', 'ZUL', 'Qurah', '#E30613', '#FFFFFF', 'fan', 39, 'Qurah Stadium', 15000],
    ['Al Khasiyah SC', 'ALB25', 'Khasiyah', '#00843D', '#FFFFFF', 'fan', 38, 'Prince Dhiq Stadium', 15000],
  ];
  FM.D.CLUBS_EE1 = [
    ['Norma Raplru', 'SIG', 'Raplru', '#00843D', '#FFFFFF', 'giant', 41, 'Türivere Spordikeskus', 3000],
    ['Norma Vana Raplru', 'SIE', 'Raplru', '#0057B8', '#FFFFFF', 'giant', 40, 'Elvasaare staadion', 2000],
    ['Meteoor Elvaküla', 'KUA', 'Raplru', '#0057B8', '#FFFFFF', 'selling', 39, 'Tarvere Spordikeskus', 1000],
    ['FCI Sindmäe', 'TUK', 'Sindmäe', '#E30613', '#FFFFFF', 'fan', 38, 'Sindmäe Kesk staadion', 2000],
    ['SK Kundaküla', 'ANY', 'Kundaküla', '#E30613', '#000000', 'fan', 37, 'Tapamäe staadion', 2000],
    ['Dünamo Türisaare', 'VAK', 'Türisaare', '#E30613', '#FFFFFF', 'fan', 37, 'Türisaare Arena', 2000],
    ['Kalev Vana Põlvmäe', 'JAU', 'Põlvmäe', '#0057B8', '#FFFFFF', 'fan', 36, 'Põlvmäe Kesk staadion', 1000],
    ['JK Rõusaare', 'RAK', 'Raplru', '#0057B8', '#FFFFFF', 'historic', 36, 'Raplru Arena', 2000],
    ['Norma Põlvküla', 'PLU', 'Põlvküla', '#00843D', '#FFFFFF', 'fan', 35, 'Põlvsaare Spordikeskus', 1000],
    ['Tempo Raplmäe', 'ANA', 'Raplmäe', '#0057B8', '#E30613', 'fan', 35, 'Raplmäe Kesk staadion', 1000],
  ];
  FM.D.CLUBS_LV1 = [
    ['Vārpa Vec Jēkpils', 'ALC26', 'Jēkpils', '#0057B8', '#FFFFFF', 'giant', 40, 'Jēkpils Arēna', 10000],
    ['Vārpa Jēkpils', 'ALD27', 'Jēkpils', '#E30613', '#FFFFFF', 'selling', 40, 'Valpils Sporta Komplekss', 5000],
    ['Elektrons Aizene', 'SIF', 'Aizene', '#E30613', '#FFFFFF', 'fan', 38, 'Pilsētas stadions Aizene', 3000],
    ['Gauja Dobiņi', 'LIF', 'Dobiņi', '#E30613', '#FFFFFF', 'historic', 37, 'Alūava Sporta Komplekss', 5000],
    ['Dinamo Salene', 'NAT', 'Jēkpils', '#FFD100', '#0057B8', 'fan', 36, 'Liepieši Sporta Komplekss', 2000],
    ['Spartaks Rūjene', 'SIH', 'Rūjene', '#0057B8', '#FFFFFF', 'fan', 36, 'Pilsētas stadions Rūjene', 4000],
    ['SK Rūjene', 'SLC', 'Rūjene', '#00843D', '#FFFFFF', 'fan', 36, 'Madene Sporta Komplekss', 2000],
    ['Zibens Daieši', 'RAE', 'Daieši', '#6A1B9A', '#FFFFFF', 'youth', 36, 'Pilsētas stadions Daieši', 1000],
    ['Dinamo Jēkene', 'VEF', 'Jēkpils', '#0057B8', '#FFFFFF', 'youth', 35, 'Cēsieši stadions', 2000],
    ['FK Dobieši', 'SPM', 'Dobieši', '#E30613', '#FFFFFF', 'fan', 35, 'Pretene stadions', 1000],
  ];
  FM.D.CLUBS_LT1 = [
    ['Granitas Igniai', 'ALE28', 'Igniai', '#00843D', '#FFFFFF', 'giant', 40, 'Igniai Arena', 5000],
    ['FK Paneviai', 'HAG', 'Paneviai', '#00843D', '#FFFFFF', 'giant', 40, 'Miesto stadionas Paneviai', 9000],
    ['Spartakas Kėdliai', 'REZ', 'Kėdliai', '#E30613', '#FFFFFF', 'fan', 38, 'Miesto stadionas Kėdliai', 5000],
    ['Granitas Panevėnai', 'TUA', 'Panevėnai', '#0057B8', '#FFFFFF', 'fan', 38, 'Panevava stadionas', 6000],
    ['Seno Igniai FK', 'AAA', 'Igniai', '#E30613', '#000000', 'selling', 37, 'Kretiai Sporto Centras', 2000],
    ['Aušra Seno Paneviai', 'HVB', 'Paneviai', '#FFD100', '#0057B8', 'oil', 37, 'Paneviai Arena', 2000],
    ['Kovas Seno Mažliai', 'HAU', 'Mažliai', '#0057B8', '#FFFFFF', 'fan', 36, 'Mažliai Arena', 2000],
    ['Granitas Šiliai', 'KUB', 'Šiliai', '#E30613', '#FFFFFF', 'fan', 35, 'Šiliai Arena', 2000],
    ['Dinamo Rokėnai', 'JEL', 'Rokėnai', '#00843D', '#E30613', 'fan', 35, 'Šilinai Sporto Centras', 2000],
    ['Utiai FK', 'ALF29', 'Paneviai', '#00843D', '#FFFFFF', 'youth', 34, 'Kretai stadionas', 1000],
  ];
  FM.D.CLUBS_AM1 = [
    ['Lori Masashen', 'WIB', 'Masashen', '#E30613', '#FFFFFF', 'oil', 42, 'Masashen Hanrapetakan Stadion', 14000],
    ['Gandzak Masashen', 'RUS', 'Masashen', '#E30613', '#FFFFFF', 'giant', 41, 'Goravan Stadion', 14000],
    ['FC Gavavan', 'WIK', 'Gavavan', '#FFD100', '#0057B8', 'selling', 40, 'Hrazni Arena', 5000],
    ['Spartak Gavashen', 'OCB', 'Masashen', '#FFD100', '#00843D', 'fan', 38, 'Talut Stadion', 5000],
    ['Gorashen FC', 'GOA', 'Masashen', '#E30613', '#000000', 'fan', 38, 'Armashen Stadion', 6000],
    ['Lokomotiv Stepavan', 'WTB', 'Stepavan', '#0057B8', '#FFFFFF', 'historic', 37, 'Masavan Stadion', 5000],
    ['Lori Nor Talni', 'LOC', 'Masashen', '#0057B8', '#FFFFFF', 'historic', 36, 'Karmir Masashen', 5000],
    ['Urartu Hrazashen', 'OZE', 'Masashen', '#0057B8', '#FFFFFF', 'youth', 36, 'Gorar Arena', 3000],
    ['Ararat Nor Charut', 'SAA24', 'Charut', '#FFD100', '#0057B8', 'fan', 35, 'Charut Hanrapetakan Stadion', 3000],
    ['FC Artashen', 'KUT', 'Artashen', '#0057B8', '#FFFFFF', 'fan', 35, 'Talavan Arena', 3000],
  ];
  FM.D.CLUBS_AZ1 = [
    ['Lokomotiv Yeni Cəlçay', 'ESD', 'Cəlçay', '#000000', '#FFFFFF', 'giant', 44, 'Tovkənd Stadionu', 31000],
    ['FK Qubvan', 'BUY', 'Qubvan', '#0057B8', '#FFFFFF', 'historic', 41, 'Salkənd Arena', 10000],
    ['Şahdağ Qubvan', 'BUE', 'Qubvan', '#E30613', '#FFFFFF', 'oil', 40, 'Xaçbulaq Stadionu', 3000],
    ['FK Gənbulaq', 'DUA', 'Gənbulaq', '#E30613', '#0057B8', 'selling', 39, 'Bilvan Stadionu', 2000],
    ['Yuxarı Ağdabad FK', 'DEA', 'Ağdabad', '#E30613', '#FFFFFF', 'oil', 39, 'Lənabad Arena', 3000],
    ['FK Qəblar', 'BOL', 'Qəblar', '#FFD100', '#0057B8', 'fan', 38, 'Mərkəzi Stadion Qəblar', 2000],
    ['PFK Ağdçay', 'ESR', 'Ağdçay', '#E30613', '#000000', 'fan', 37, 'Ağdçay Şəhər Stadionu', 3000],
    ['Turan Kiçik Tovan', 'YED', 'Kiçik Tovan', '#0057B8', '#FFFFFF', 'historic', 37, 'Gənabad Stadionu', 13000],
    ['Göyçay Yuxarı Bildağ', 'KUC', 'Bildağ', '#00843D', '#FFFFFF', 'fan', 35, 'Bildağ Şəhər Stadionu', 3000],
    ['PFK Zərlar', 'SUL', 'Zərlar', '#0057B8', '#FFFFFF', 'fan', 35, 'Şəkdağ Stadionu', 3000],
  ];
  FM.D.CLUBS_KZ1 = [
    ['Zhas Temozen', 'FAR', 'Temozen', '#FFD100', '#0057B8', 'oil', 47, 'Zhanagash Arena', 30000],
    ['FK Eski Kerozen', 'FAD', 'Kerozen', '#FFD100', '#000000', 'giant', 45, 'Zhansai Stadiony', 23000],
    ['Spartak Kokbulak', 'NEG', 'Kokbulak', '#FFD100', '#0057B8', 'fan', 40, 'Kyzylozen Stadiony', 8000],
    ['Munaishy Kersai', 'BIK', 'Kersai', '#0057B8', '#FFFFFF', 'historic', 40, 'Karagash Arena', 13000],
    ['Zhetysu Shubulak', 'BEP', 'Shubulak', '#00843D', '#FFFFFF', 'fan', 38, 'Karagash Stadiony', 20000],
    ['Spartak Eski Ushtobe', 'YAC', 'Eski Ushtobe', '#FFD100', '#000000', 'historic', 38, 'Solsai Stadiony', 19000],
    ['Yesil Solkuduk', 'NEH', 'Solkuduk', '#FFD100', '#0057B8', 'fan', 37, 'Zheztobe Stadiony', 7000],
    ['Ulytau Ayagbulak', 'NUK', 'Ayagbulak', '#FFD100', '#0057B8', 'fan', 37, 'Shutau Stadiony', 4000],
    ['FK Bayzhal', 'TAF29', 'Bayzhal', '#00843D', '#FFFFFF', 'fan', 36, 'Qalalyq Stadion Bayzhal', 5000],
    ['Zhetysu Ushagash', 'CHW', 'Ushagash', '#0057B8', '#FFFFFF', 'fan', 36, 'Ayagsai Arena', 9000],
    ['Batys Karakent', 'QAR', 'Karakent', '#00843D', '#FFFFFF', 'fan', 35, 'Karakent Ortalyk Stadiony', 4000],
    ['Batys Temozen', 'NHA', 'Temozen', '#E30613', '#FFFFFF', 'fan', 35, 'Talkent Arena', 3000],
  ];
  FM.D.CLUBS_MD1 = [
    ['FC Ceova', 'JAS', 'Ceova', '#FFD100', '#000000', 'oil', 42, 'Stadionul Ștefova', 13000],
    ['Speranța Mare Crești', 'MIC', 'Crești', '#00843D', '#FFD100', 'historic', 38, 'Complexul Sportiv Crești', 10000],
    ['Spartak Nou Cahuleni', 'MAH31', 'Cahuleni', '#00843D', '#FFFFFF', 'fan', 38, 'Stadionul Dubova', 3000],
    ['Dacia Balova', 'PAQ', 'Balova', '#E30613', '#0057B8', 'selling', 37, 'Stadionul Orășenesc Balova', 3000],
    ['Lokomotiv Crești', 'RUB', 'Crești', '#0057B8', '#FFFFFF', 'fan', 36, 'Arena Tirești', 2000],
    ['Speranța Nou Ștefești', 'ZEH', 'Ștefești', '#E30613', '#000000', 'historic', 36, 'Stadionul Căești', 5000],
    ['Ungeni FC', 'TOF', 'Ungeni', '#00843D', '#FFFFFF', 'fan', 35, 'Arena Ungova', 2000],
    ['Sportul Tirești', 'BRE', 'Tirești', '#0057B8', '#FFFFFF', 'fan', 34, 'Complexul Sportiv Tirești', 2000],
    ['Lokomotiv Ștefești', 'STM', 'Ștefești', '#0057B8', '#FFFFFF', 'fan', 34, 'Stadionul Orășenesc Ștefești', 5000],
    ['Sportul Ceeni', 'TAG30', 'Ceeni', '#00843D', '#FFD100', 'fan', 33, 'Stadionul Hînești', 2000],
  ];
  FM.D.CLUBS_XK1 = [
    ['Dinamo Ferër', 'PLE', 'Ferër', '#E30613', '#FFFFFF', 'fan', 39, 'Stadiumi Qytetit Ferër', 8000],
    ['Shqiponja Lezec', 'KRB', 'Lezec', '#E30613', '#FFFFFF', 'selling', 39, 'Stadiumi Kamovë', 5000],
    ['Besa Lushaj', 'DIC', 'Lushaj', '#E30613', '#FFFFFF', 'giant', 38, 'Kompleksi Sportiv Lushaj', 13000],
    ['Naftëtari Prizica', 'DIF', 'Prizica', '#FFD100', '#0057B8', 'fan', 37, 'Stadiumi Qytetit Prizica', 3000],
    ['SK Petani', 'SLF', 'Petani', '#FFD100', '#00843D', 'fan', 36, 'Kompleksi Sportiv Petani', 3000],
    ['Ylli Mal Ferër', 'SLG', 'Ferër', '#0057B8', '#FFFFFF', 'fan', 36, 'Stadiumi Bulica', 3000],
    ['Naftëtari Mal Gjiër', 'RUR', 'Gjiër', '#0057B8', '#FFFFFF', 'historic', 36, 'Stadiumi Leza', 8000],
    [
      'Kodra Grica FK',
      'PAV',
      'Kodra Grica',
      '#FFD100',
      '#0057B8',
      'selling',
      36,
      'Kompleksi Sportiv Kodra Grica',
      3000,
    ],
    ['KF Polush', 'BOM', 'Polush', '#E30613', '#000000', 'fan', 35, 'Stadiumi Qytetit Polush', 3000],
    ['Drita Pejël', 'DOH', 'Pejël', '#0057B8', '#FFFFFF', 'fan', 34, 'Stadiumi Qytetit Pejël', 3000],
  ];
  FM.D.CLUBS_LU1 = [
    ['SV Burgsee', 'BUH', 'Burgsee', '#E30613', '#FFFFFF', 'giant', 39, 'Neckarfurt-Stadion', 2000],
    ['Energie Grünberg', 'ENA', 'Grünberg', '#E30613', '#FFFFFF', 'fan', 38, 'Hohental-Stadion', 7000],
    ['Alemannia Bergingen', 'AIA', 'Bergingen', '#0057B8', '#FFFFFF', 'fan', 37, 'Stadion am Immbach', 3000],
    ['FSV Kirchfurt', 'KIF', 'Kirchfurt', '#0057B8', '#FFFFFF', 'historic', 36, 'Sportpark Hohental', 3000],
    ['TuS Neckarau', 'TUS', 'Neckarau', '#E30613', '#0057B8', 'fan', 36, 'Mühlstein-Stadion', 3000],
    ['Hansa Holzhof', 'HAH', 'Holzhof', '#FFFFFF', '#000000', 'historic', 36, 'Sportpark Greifbach', 7000],
    ['Union Heidfeld', 'HEI', 'Heidfeld', '#FFD100', '#0057B8', 'fan', 35, 'Sportpark Burgstein', 2000],
    ['SV Bad Hagau 1931', 'BAF29', 'Bad Hagau', '#E30613', '#FFFFFF', 'fan', 35, 'Greifhafen-Stadion', 2000],
    ['TSV Furthorst', 'FUF', 'Furthorst', '#0057B8', '#FFFFFF', 'fan', 34, 'Waldstadion Furthorst', 2000],
    ['Greifhorst 1899', 'GRG', 'Greifhorst', '#E30613', '#FFFFFF', 'fan', 34, 'Stadion am Holzsee', 2000],
  ];
  FM.D.CLUBS_JO1 = [
    ['Ajlib Club', 'ALG30', 'Ajlib', '#0057B8', '#FFFFFF', 'giant', 42, 'Ajlib Stadium', 13000],
    ['Al Ajlib SC', 'JUA', 'Ajlib', '#00843D', '#FFFFFF', 'giant', 42, 'Rifra Arena', 17000],
    ['Muhayr SC', 'ABB', 'Muhayr', '#E30613', '#FFFFFF', 'giant', 40, 'Prince Aqiyah Stadium', 12000],
    ['Al Umm Fariyah', 'RAF', 'Umm Fariyah', '#0057B8', '#FFFFFF', 'fan', 38, 'Umm Fariyah Sports City', 5000],
    ['Madah Club', 'AUA', 'Ajlib', '#E30613', '#FFFFFF', 'fan', 37, 'Rifan Stadium', 8000],
    ['Al Rusib SC', 'AAI', 'Ajlib', '#0057B8', '#FFFFFF', 'fan', 37, 'Prince Ibrib Stadium', 5000],
    ['Al Nizayr SC', 'ALH31', 'Nizayr', '#FFD100', '#0057B8', 'fan', 36, 'Nizayr Sports City', 5000],
    ['Wadi Saan Club', 'ASH', 'Saan', '#00843D', '#FFFFFF', 'fan', 35, 'Tafayr Arena', 5000],
    ['Ibrah SC', 'ASG', 'Ibrah', '#E30613', '#FFFFFF', 'fan', 35, 'Ibrah Stadium', 5000],
    ['Wadi Salra SC', 'ALJ32', 'Wadi Salra', '#00843D', '#FFFFFF', 'fan', 34, 'Prince Sitiq Stadium', 5000],
  ];
  FM.D.CLUBS_OM1 = [
    ['Shabab Aqiyah', 'BIS', 'Aqiyah', '#00843D', '#FFFFFF', 'selling', 39, 'Fariyah Stadium', 14000],
    ['Al Jawayr', 'ALK33', 'Jawayr', '#E30613', '#FFFFFF', 'giant', 39, 'Aqar Stadium', 8000],
    ['Al Liwar', 'ALL34', 'Liwar', '#E30613', '#FFFFFF', 'giant', 38, 'Diwiyah Arena', 15000],
    ['Bahayn Club', 'ALM35', 'Bahayn', '#00843D', '#FFFFFF', 'fan', 37, 'Bahayn Sports City', 10000],
    ['Salya Club', 'ALN36', 'Salya', '#0057B8', '#FFFFFF', 'fan', 36, 'Nizya Stadium', 8000],
    ['Wadi Mafra Club', 'ARL', 'Wadi Mafra', '#E30613', '#0057B8', 'fan', 35, 'Prince Nizya Stadium', 8000],
    ['Shabab Ain Farayr', 'BUL', 'Ain Farayr', '#0057B8', '#FFFFFF', 'fan', 35, 'Ain Farayr Sports City', 8000],
    ['Al Ajlar SC', 'UMA', 'Ajlar', '#FFD100', '#0057B8', 'fan', 35, 'Hidiyah Arena', 10000],
    ['Wadi Liwar SC', 'AJE', 'Liwar', '#E30613', '#000000', 'fan', 34, 'Prince Ibra Stadium', 5000],
    ['Al Fajr', 'AWB', 'Quriq', '#00843D', '#FFD100', 'fan', 33, 'Quriq Sports City', 5000],
  ];
  FM.D.CLUBS_BH1 = [
    ['Ain Zalah Club', 'ALP37', 'Zalah', '#E30613', '#FFFFFF', 'giant', 39, 'Jawah Stadium', 15000],
    ['Faliyah Club', 'ALQ38', 'Faliyah', '#FFD100', '#0057B8', 'giant', 38, 'Salayn Arena', 20000],
    ['Al Wadi Jawayr', 'RAG', 'Wadi Jawayr', '#E30613', '#FFFFFF', 'fan', 37, 'Aqiq Stadium', 10000],
    ['Al Faliyah', 'RIS', 'Faliyah', '#0057B8', '#FFFFFF', 'fan', 36, 'Faliyah Stadium', 9000],
    ['Shabab Saya', 'RAH', 'Saya', '#E30613', '#0057B8', 'fan', 35, 'Mafiyah Stadium', 5000],
    ['Al Umm Nakayn SC', 'ALR39', 'Nakayn', '#00843D', '#FFFFFF', 'fan', 35, 'Madiq Stadium', 8000],
    ['Wadi Jawayr SC', 'ALS40', 'Wadi Jawayr', '#0057B8', '#FFFFFF', 'fan', 35, 'Wadi Jawayr Sports City', 5000],
    ['Al Hilya SC', 'ATB', 'Wadi Jawayr', '#E30613', '#FFFFFF', 'fan', 34, 'Mafya Stadium', 5000],
    ['Shabab Ibrayn', 'QAS', 'Ibrayn', '#0057B8', '#FFFFFF', 'fan', 34, 'Ibrayn Stadium', 5000],
    ['Hilan Club', 'ATU', 'Hilan', '#E30613', '#000000', 'fan', 33, 'Prince Irban Stadium', 5000],
  ];
  FM.D.CLUBS_KW1 = [
    ['Ain Mafayr SC', 'ALT41', 'Mafayr', '#FFFFFF', '#0057B8', 'giant', 42, 'Mafayr Sports City', 18000],
    ['Mafayr Club', 'ALU42', 'Mafayr', '#FFD100', '#000000', 'giant', 42, 'Mafayr Stadium', 18000],
    ['Diwya Club', 'AAB', 'Mafayr', '#00843D', '#FFFFFF', 'giant', 40, 'Basayn Stadium', 18000],
    ['Falah SC', 'RAJ', 'Mafayr', '#FFD100', '#0057B8', 'fan', 38, 'Prince Dhayr Stadium', 12000],
    ['Umm Rusah SC', 'ALV43', 'Rusah', '#0057B8', '#FFFFFF', 'fan', 38, 'Jahayn Stadium', 10000],
    ['Umm Falan Club', 'ALW44', 'Falan', '#E30613', '#FFFFFF', 'fan', 36, 'Falan Sports City', 10000],
    ['Al Ajliq SC', 'RAL', 'Ajliq', '#00843D', '#FFFFFF', 'fan', 35, 'Ajliq Stadium', 8000],
    ['Al Sitayn', 'WAC', 'Sitayn', '#0057B8', '#FFFFFF', 'fan', 35, 'Prince Diwan Stadium', 5000],
    ['Al Qurya', 'AYA', 'Qurya', '#0057B8', '#FFD100', 'fan', 35, 'Qurya Stadium', 5000],
    ['Al Kerayr', 'JEB', 'Kerayr', '#E30613', '#FFFFFF', 'selling', 34, 'Prince Rusayr Stadium', 5000],
  ];
  FM.D.CLUBS_PK1 = [
    ['Shah Attogarh Muslim', 'HOE', 'Shah Attogarh', '#00843D', '#FFFFFF', 'selling', 35, 'Jhepura Arena', 10000],
    ['Baloch Daskapind', 'VIP', 'Daskapind', '#0057B8', '#FFFFFF', 'selling', 35, 'Daskapind Football Ground', 10000],
    [
      'Shah Attogarh United',
      'HOM',
      'Shah Attogarh',
      '#00843D',
      '#FFFFFF',
      'oil',
      35,
      'Shah Attogarh Sports Complex',
      10000,
    ],
    [
      'Shah Tandali United',
      'DAD',
      'Shah Tandali',
      '#0057B8',
      '#FFFFFF',
      'oil',
      34,
      'Shah Tandali Sports Complex',
      8000,
    ],
    ['Mardpind Gymkhana', 'AUR', 'Mardpind', '#E30613', '#FFFFFF', 'fan', 33, 'Mardpind Football Ground', 8000],
    ['Mardpind FC', 'AAM', 'Mardpind', '#001F5B', '#FFFFFF', 'oil', 33, 'Jhali Stadium', 8000],
    ['Mian Mardgarh United', 'KOB', 'Mardpind', '#0057B8', '#FFFFFF', 'selling', 33, 'Bahpur Stadium', 5000],
    ['Shah Sialpind Gymkhana', 'BEQ', 'Sialpind', '#00843D', '#FFFFFF', 'fan', 32, 'Sialpind Sports Complex', 8000],
    ['Daskapind FC', 'VIQ', 'Daskapind', '#0057B8', '#FFD100', 'selling', 32, 'Gujrpur Ground', 5000],
    ['Afghan Khuzpind', 'BHC', 'Khuzpind', '#E30613', '#FFFFFF', 'fan', 31, 'Khuzpind Sports Complex', 5000],
  ];
  FM.D.CLUBS_BD1 = [
    ['Uttar Dinahat Union', 'NAX', 'Dinahat', '#0057B8', '#FFFFFF', 'oil', 38, 'Brahpur Stadium', 36000],
    ['Dinahat United', 'NEJ', 'Dinahat', '#6CACE4', '#FFFFFF', 'giant', 37, 'Dinahat Stadium', 36000],
    ['Uttar Pabari FC', 'VAM', 'Dinahat', '#000000', '#FFFFFF', 'giant', 37, 'Changanj Krira Complex', 36000],
    ['Notun Pabgaon Kings', 'SAB25', 'Dinahat', '#E30613', '#FFFFFF', 'historic', 35, 'Noapara Krira Complex', 36000],
    ['Boganj United', 'CHX', 'Dinahat', '#E30613', '#0057B8', 'fan', 34, 'Dhatola Stadium', 10000],
    ['Sylhat Mohammedan', 'KOC', 'Sylhat', '#6CACE4', '#FFFFFF', 'fan', 34, 'Habpara Stadium', 20000],
    ['Purba Sylnagar City', 'MOJ', 'Dinahat', '#6CACE4', '#FFFFFF', 'youth', 33, 'Dinahat Sports Ground', 5000],
    ['Siragtola FC', 'JOD', 'Dinahat', '#E30613', '#FFFFFF', 'fan', 33, 'Feniganj Krira Complex', 8000],
    ['Brothers Chanpara', 'GUR', 'Dinahat', '#00843D', '#FFFFFF', 'fan', 33, 'Sylganj Krira Complex', 5000],
    ['Noapara KS', 'BHD', 'Dinahat', '#FFD100', '#0057B8', 'fan', 32, 'Coxnagar Stadium', 5000],
  ];
  FM.D.CLUBS_ZM1 = [
    ['Isola Blades', 'BUN', 'Isola', '#00843D', '#FFFFFF', 'selling', 41, 'Isola Stadium', 10000],
    ['Monla Warriors', 'BUM', 'Monla', '#E30613', '#FFFFFF', 'historic', 40, 'Mpila Stadium', 10000],
    ['Monla Dynamos', 'BUP', 'Monla', '#E30613', '#FFFFFF', 'giant', 40, 'Monla Stadium', 12000],
    ['Mpila Mine United', 'WEA', 'Mpila', '#E30613', '#FFFFFF', 'oil', 38, 'Maznga Stadium', 5000],
    ['Mpila Copper Stars', 'WEL', 'Mpila', '#00843D', '#FFFFFF', 'selling', 38, 'Mpila Independence Stadium', 10000],
    ['Chimla Dynamos', 'WAH', 'Mpila', '#00843D', '#FFFFFF', 'oil', 37, 'Seruka Ground', 5000],
    ['Isola Mine United', 'BOP', 'Isola', '#00843D', '#FFFFFF', 'fan', 36, 'Mazula Ground', 5000],
    ['Mwula Copper Stars', 'WIN', 'Mwula', '#E30613', '#FFFFFF', 'historic', 36, 'Mwula Independence Stadium', 10000],
    ['Port Monola Mine United', 'RYA', 'Mpila', '#0057B8', '#FFFFFF', 'fan', 36, 'Chimama Ground', 5000],
    ['Mwula Warriors', 'WIF', 'Mwula', '#0057B8', '#FFFFFF', 'fan', 35, 'Luata Stadium', 5000],
  ];
  FM.D.CLUBS_ZW1 = [
    ['Lower Masdura City', 'SHG', 'Masdura', '#0057B8', '#FFFFFF', 'giant', 40, 'Masdura Stadium', 60000],
    ['Marnyoka Rhinos', 'HOG', 'Marnyoka', '#FFFFFF', '#000000', 'giant', 39, 'Marnyoka Stadium', 20000],
    ['Masdura Highlanders', 'SHN', 'Masdura', '#00843D', '#FFFFFF', 'giant', 39, 'Masdura Sports Club', 60000],
    ['Plunde Sugar', 'CHY', 'Plunde', '#FFFFFF', '#0057B8', 'selling', 38, 'Nyandura Stadium', 10000],
    ['Port Zvingwa Highlanders', 'DAE', 'Zvingwa', '#FFD100', '#00843D', 'oil', 37, 'Tsangwa Ground', 5000],
    ['Mount Marnyoka Stars', 'HOJ', 'Marnyoka', '#FFD100', '#E30613', 'selling', 36, 'Marnyoka Sports Club', 5000],
    ['Binru FC', 'SEJ', 'Masdura', '#E30613', '#FFFFFF', 'fan', 35, 'Zvinga Ground', 5000],
    ['Lower Hwande Chiefs', 'LAR', 'Hwande', '#0057B8', '#FFFFFF', 'fan', 34, 'Hwande Sports Club', 5000],
    ['Tsanvingo Warriors', 'DRE', 'Tsanvingo', '#00843D', '#FFFFFF', 'fan', 34, 'Tsanvingo Sports Club', 5000],
    ['Rusvingo Bullets', 'SHH', 'Masdura', '#000000', '#FFFFFF', 'oil', 34, 'Zvare Stadium', 5000],
  ];
  FM.D.CLUBS_KE1 = [
    ['AFC Oyaka', 'CAY', 'Oyaka', '#00843D', '#E30613', 'giant', 40, 'Mbalumba Stadium', 30000],
    ['Oyaka Posta', 'CAZ', 'Oyaka', '#0057B8', '#FFFFFF', 'giant', 39, 'Oyaka Showground', 30000],
    ['Nyamoro Posta', 'SPN', 'Oyaka', '#FFD100', '#000000', 'selling', 38, 'Oyaka Municipal Stadium', 5000],
    ['Lake Burindi Bandari', 'BEV', 'Oyaka', '#0057B8', '#FFFFFF', 'oil', 37, 'Katese Grounds', 5000],
    ['Nanere Youth', 'LIG', 'Nanere', '#00843D', '#FFD100', 'fan', 36, 'Nanere Municipal Stadium', 5000],
    ['Nyamaka Rangers', 'NOG', 'Nyamaka', '#0057B8', '#FFFFFF', 'fan', 36, 'Nyamaka Showground', 10000],
    ['Gatongo Rangers', 'WOE', 'Oyaka', '#0057B8', '#FFD100', 'fan', 36, 'Mbalere Grounds', 5000],
    ['Kisere Sugar', 'SCC', 'Oyaka', '#E30613', '#FFFFFF', 'selling', 35, 'Samini Grounds', 5000],
    ['Mbalindi Homeboyz', 'DUB', 'Oyaka', '#0057B8', '#FFD100', 'youth', 35, 'Samumba Grounds', 8000],
    ['Port Rukongo FC', 'FAM', 'Rukongo', '#0057B8', '#FFFFFF', 'oil', 35, 'Rukongo Municipal Stadium', 5000],
  ];
  FM.D.CLUBS_UG1 = [
    ['Busenge FC', 'HAJ', 'Busenge', '#0057B8', '#FFFFFF', 'selling', 38, 'Busenge Sports Ground', 5000],
    ['Wakuma Vipers', 'FOC', 'Wakuma', '#FFD100', '#0057B8', 'giant', 38, 'Lugale Grounds', 35000],
    ['Lower Nakema Vipers', 'LEW', 'Wakuma', '#0057B8', '#FFFFFF', 'giant', 37, 'Ssabi Stadium', 35000],
    ['Upper Wakuma Police', 'MAJ32', 'Wakuma', '#E30613', '#FFFFFF', 'historic', 36, 'Kamongo Stadium', 10000],
    ['Wakabi FC', 'WAE', 'Wakuma', '#FFD100', '#0057B8', 'selling', 36, 'Nsoma Stadium', 5000],
    ['SC Ssale', 'FLI', 'Wakuma', '#E30613', '#FFFFFF', 'fan', 34, 'Kamale Stadium', 5000],
    ['Bugabi City', 'BRH', 'Bugabi', '#E30613', '#FFFFFF', 'fan', 34, 'Masira Stadium', 5000],
    ['Kamenge Police', 'SAC26', 'Kamenge', '#E30613', '#000000', 'oil', 34, 'Kamenge Sports Ground', 5000],
    ['Muboma Rangers', 'PAW', 'Wakuma', '#0057B8', '#FFFFFF', 'oil', 34, 'Wakuma Sports Ground', 5000],
    ['Bugabi Heroes', 'BRJ', 'Bugabi', '#00843D', '#FFFFFF', 'oil', 33, 'Bugabi Sports Ground', 5000],
  ];
  FM.D.CLUBS_ET1 = [
    ['Asella Mariam', 'MAK33', 'Asella', '#FFD100', '#00843D', 'giant', 38, 'Asella Stadium', 30000],
    ['Upper Asella Mariam', 'WAY', 'Asella', '#E30613', '#FFFFFF', 'selling', 36, 'Shini Stadium', 30000],
    ['Lekela Mariam', 'BPE', 'Lekela', '#FFD100', '#0057B8', 'historic', 36, 'Hawar Stadium', 10000],
    ['Mekale Police', 'MAL34', 'Mekale', '#0057B8', '#FFFFFF', 'fan', 35, 'Mekale Stadium', 10000],
    ['Nekema United', 'WEF', 'Nekema', '#00843D', '#FFD100', 'fan', 34, 'Nekema Sports Complex', 10000],
    ['Adale Hawariat', 'CHZ', 'Adale', '#FFD100', '#00843D', 'fan', 34, 'Adale Stadium', 8000],
    ['Lekella Stars', 'DEB', 'Lekella', '#E30613', '#FFFFFF', 'fan', 34, 'Lekella Stadium', 10000],
    ['Upper Jimama Dicha', 'WEN', 'Jimama', '#0057B8', '#FFD100', 'fan', 33, 'Shassa Grounds', 8000],
    ['Ethio Jimama', 'WEY', 'Jimama', '#E30613', '#FFFFFF', 'fan', 33, 'Jimama Sports Complex', 8000],
    ['Akella Dicha', 'BAG30', 'Asella', '#0057B8', '#FFFFFF', 'oil', 33, 'Jimini Grounds', 5000],
  ];
  FM.D.CLUBS_TG1 = [
    ['SC Banbala', 'BAH31', 'Banbala', '#0057B8', '#FFFFFF', 'fan', 36, 'Stade Sasré', 10000],
    ['SC Dalré', 'DAF', 'Dalré', '#00843D', '#FFFFFF', 'selling', 36, 'Complexe Sportif de Dalré', 5000],
    ['Racing Dalré', 'DAG', 'Dalré', '#0057B8', '#FFFFFF', 'selling', 35, 'Stade Municipal de Dalré', 5000],
    ['Bobko Académie', 'BOQ', 'Bobko', '#E30613', '#FFFFFF', 'historic', 35, 'Stade Yoploum', 5000],
    ['FC Kaydougou', 'KAK', 'Kaydougou', '#0057B8', '#FFFFFF', 'fan', 34, 'Complexe Sportif de Kaydougou', 3000],
    ['US Yopmbo', 'YOA', 'Dalré', '#0057B8', '#FFFFFF', 'selling', 34, 'Stade Saskro', 3000],
    ['US Banbala', 'BAJ32', 'Banbala', '#E30613', '#00843D', 'fan', 33, 'Stade Katko', 5000],
    ['AS Nouveau Séko', 'NOH', 'Nouveau Séko', '#E30613', '#FFFFFF', 'fan', 33, 'Stade Bobdala', 5000],
    ['Union Dioguéré', 'DIG', 'Dalré', '#0057B8', '#FFD100', 'fan', 33, 'Stade Ouya', 3000],
    ['US Dalngo', 'DAH', 'Dalngo', '#00843D', '#FFFFFF', 'fan', 32, 'Stade Dioloum', 3000],
  ];
  FM.D.CLUBS_MZ1 = [
    [
      'União Porto Covares',
      'PON',
      'Porto Covares',
      '#00843D',
      '#FFFFFF',
      'giant',
      38,
      'Complexo Desportivo Porto Covares',
      10000,
    ],
    ['Porto Covares FC', 'POP', 'Porto Covares', '#FFD100', '#0057B8', 'historic', 37, 'Estádio Gouvares', 5000],
    ['Sport Clube Paivela', 'PAX', 'Paivela', '#000000', '#FFFFFF', 'oil', 36, 'Estádio Pombais', 5000],
    ['Portinha FC', 'POQ', 'Porto Covares', '#0057B8', '#FFFFFF', 'fan', 36, 'Estádio Matosares', 5000],
    ['Sport Clube Ovarais', 'OVA', 'Ovarais', '#00843D', '#FFFFFF', 'historic', 36, 'Estádio Paivinha', 10000],
    ['Sporting Vilouro', 'VIU', 'Vilouro', '#FFD100', '#00843D', 'fan', 35, 'Estádio Municipal de Vilouro', 5000],
    [
      'Tomela Futebol Clube',
      'TOH',
      'Porto Covares',
      '#0057B8',
      '#FFFFFF',
      'historic',
      35,
      'Estádio Municipal de Porto Covares',
      5000,
    ],
    ['Académico Ava', 'ACB', 'Porto Covares', '#E30613', '#FFFFFF', 'historic', 35, 'Estádio Amarães', 5000],
    [
      'Clube Desportivo Ovarais',
      'DES',
      'Ovarais',
      '#0057B8',
      '#FFFFFF',
      'fan',
      34,
      'Estádio Municipal de Ovarais',
      5000,
    ],
    ['Esporte Clube Tomares', 'TOG', 'Tomares', '#00843D', '#FFFFFF', 'fan', 34, 'Estádio Avão', 5000],
  ];
  FM.D.CLUBS_GT1 = [
    ['Atlético Benavador', 'BEW', 'Benavador', '#FFFFFF', '#00843D', 'giant', 43, 'Ciudad Deportiva Benavador', 30000],
    ['Benavador Balompié', 'BEZ', 'Benavador', '#E30613', '#FFFFFF', 'giant', 42, 'Nuevo Estadio Benavador', 25000],
    ['Juventud Roblero', 'ROE', 'Roblero', '#0057B8', '#FFFFFF', 'fan', 38, 'Estadio La Oriheda', 10000],
    ['Cordara Atlético', 'COJ', 'Cordara', '#E30613', '#FFFFFF', 'historic', 38, 'Nuevo Estadio Cordara', 12000],
    ['Deportivo Bajo Roblón', 'BAK33', 'Roblón', '#E30613', '#FFFFFF', 'fan', 36, 'Estadio Municipal de Roblón', 8000],
    ['Racing Club Calposa', 'CAA24', 'Calposa', '#E30613', '#FFFFFF', 'fan', 36, 'Nuevo Estadio Calposa', 5000],
    ['UD Villa Palomanes', 'PAZ', 'Palomanes', '#E30613', '#FFFFFF', 'fan', 35, 'Estadio Benal', 5000],
    ['UD Salamino', 'SAD27', 'Salamino', '#E30613', '#FFFFFF', 'fan', 35, 'Estadio La Rondero', 5000],
    ['Real Hinojosa', 'HID', 'Benavador', '#0057B8', '#FFFFFF', 'historic', 35, 'Estadio Municipal de Benavador', 8000],
    ['Atlético Oñata', 'ONA', 'Oñata', '#0057B8', '#FFFFFF', 'fan', 34, 'Campo de Oñata', 5000],
    ['Estudiantes de Fuentares', 'FUG', 'Fuentares', '#00843D', '#FFFFFF', 'fan', 34, 'Estadio Cordedo', 8000],
    ['SD Peñador', 'SDB', 'Peñador', '#E30613', '#FFFFFF', 'fan', 34, 'Estadio Zafredo', 5000],
  ];
  FM.D.CLUBS_SV1 = [
    ['UD Villa Cervilla', 'CEC', 'Cervilla', '#FFFFFF', '#E30613', 'giant', 40, 'Nuevo Estadio Cervilla', 20000],
    ['Atlético Palomón', 'POU', 'Palomón', '#E30613', '#FFFFFF', 'giant', 39, 'Nuevo Estadio Palomón', 13000],
    [
      'Lucino del Mar Atlético',
      'LUE',
      'Lucino del Mar',
      '#E30613',
      '#000000',
      'giant',
      38,
      'Nuevo Estadio Lucino del Mar',
      13000,
    ],
    ['Alto Lermal CF', 'ALX45', 'Lermal', '#FFD100', '#0057B8', 'fan', 36, 'Estadio Tarifón', 7000],
    ['Oñatara CF', 'ORC', 'Oñatara', '#FFFFFF', '#0057B8', 'fan', 36, 'Ciudad Deportiva Oñatara', 5000],
    [
      'Cerro de Sorilla Balompié',
      'CEO',
      'Cerro de Sorilla',
      '#0057B8',
      '#FFFFFF',
      'fan',
      36,
      'Estadio La Quintador',
      5000,
    ],
    ['Calata Balompié', 'CTA', 'Calata', '#E30613', '#FFFFFF', 'historic', 36, 'Campo de Calata', 8000],
    [
      'Atlético San Lermena',
      'LER',
      'San Lermena',
      '#E30613',
      '#FFFFFF',
      'fan',
      35,
      'Estadio Municipal de San Lermena',
      5000,
    ],
    ['Sporting Fragena', 'FRJ', 'Fragena', '#0057B8', '#FFFFFF', 'fan', 34, 'Ciudad Deportiva Fragena', 5000],
    ['Atlético Escalero', 'ESF', 'Escalero', '#E30613', '#FFFFFF', 'fan', 34, 'Ciudad Deportiva Escalero', 5000],
    ['Moralara CF', 'MOK', 'Moralara', '#0057B8', '#FFFFFF', 'fan', 34, 'Ciudad Deportiva Moralara', 5000],
    ['Peñar Balompié', 'PEJ', 'Peñar', '#FFD100', '#0057B8', 'fan', 33, 'Ciudad Deportiva Peñar', 5000],
  ];
  FM.D.CLUBS_TT1 = [
    ['Lopaya Sports Club', 'WIL', 'Lopaya', '#E30613', '#FFFFFF', 'oil', 38, 'Debinda Stadium', 6000],
    [
      'Lower Gasique Sports Club',
      'DAV',
      'Gasique',
      '#E30613',
      '#000000',
      'selling',
      38,
      'Penuco Recreation Ground',
      5000,
    ],
    ['Caluco United', 'HAM', 'Caluco', '#0057B8', '#FFFFFF', 'oil', 36, 'Debana Stadium', 5000],
    ['Plana Connection', 'CHA24', 'Plana', '#E30613', '#FFFFFF', 'fan', 36, 'Riaro Savannah', 5000],
    ['Riaro FC', 'MEF', 'Riaro', '#0057B8', '#FFFFFF', 'fan', 36, 'Riaro Park', 10000],
    ['Riinda Stars', 'CHB25', 'Riinda', '#E30613', '#FFFFFF', 'selling', 36, 'Riinda Park', 10000],
    ['Club Penaro', 'PAA24', 'Penaro', '#0057B8', '#FFFFFF', 'fan', 35, 'Guaango Stadium', 3000],
    ['Sipacas United', 'TIB', 'Sipacas', '#0057B8', '#FFD100', 'fan', 34, 'Tacora Stadium', 3000],
    ['FC Caluco', 'HAW', 'Caluco', '#0057B8', '#FFFFFF', 'oil', 34, 'Caluco Sporting Complex', 3000],
    ['Tunango Rangers', 'HEB', 'Tunango', '#E30613', '#FFFFFF', 'fan', 33, 'Pluna Recreation Ground', 3000],
  ];
  FM.D.CLUB_INFO = Object.fromEntries(
    `BAY|BAY|Cats|1893
CLI|CLI|Steelmen|1865
CHE|CHE|Gunners of the Shire|1897
CHC|CHC|Blades|1969
BAA|BAA|Shrimpers|1897
ROD|ROD|Owls|1950
QUA|QUA|Rockets|1894
EVE|EVE|Wine Reds|1897
CAL|CAL|Cobblers|1938
EPI|EPI|Crimsons|1884
FIL|FIL|Falcons|1882
BRA|BRA|Blues|1865
RED|RED|Eagles|1948
TAD|TAD|Bears|1879
TET|TET|Pioneers|1966
CLC|CLC|Saints|1884
MER|MER|Yellows|1948
SEL|SEL|Buzzards|1876
CAR|CAR|Miners|1907
RYE|RYE|Harriers|1912
ALD|ALD|Cutlers|1881
TTH|TTH|Red Devils|1983
GRT|GRT|Blues|1879
LIT|LIT|Crimsons|1955
HAS|HAS|Reds|1878
EVR|EVR|Terriers|1956
YAR|YAR|Lamplighters|1871
TUT|TUT|Hornets|1979
LAU|LAU|Seagulls|1947
REY|REY|Terriers|1986
CHI|CHI|Chargers|1966
BEX|BEX|Reds|1867
REA|REA|Foxes|1909
STH|STH|Whites|1956
KIN|KIN|Railwaymen|1869
LIN|LIN|Shipbuilders|1904
ROU|ROU|Stoats|1888
REC|REC|Magpies|1956
TOU|TOU|Panthers|1875
YRN|YRN|Dragons|1931
HAT|HAT|Smiths|1881
CAO|CAO|Weavers|1951
EDE|EDE|Ironmen|1888
FIU|FIU|Smiths|1920
LAM|LAM|Wasps|1906
HYD|HYD|Kings|1890
AME|AME|Bluebirds|1891
BXS|BXS|Druids|1904
HUC|HUC|Imps|1917
SUT|SUT|Lighthouses|1866
WOR|WOR|Workmen|1932
WED|WED|Brewers|1956
CAE|CMS|Yeomen|1937
TUN|TUN|Thistles|1904
SHP|SHP|Drovers|1903
CLF|CLF|Salmon|1978
MAN|MNS|Vikings|1905
SCA|SCA|Comets|1942
DEN|DEN|Grecians|1889
FAL|FAC|Miners|1883
DUW|DUW|Cats|1904
ABH|ABH|Rockets|1890
CAI|CAI|Bulldogs|1894
BES|BXW|Rams|1900
DAA|DAA|Ironmen|1918
DAR|DAR|Tinners|1906
TAV|TAV|Pike|1909
HOW|HOW|Workmen|1946
DRT|DRT|Windmills|1924
CSH|CSH|Warriors|1950
HAO|HAO|Blades|1933
RES|RES|Spartans|1866
WIT|WIT|Minstrels|1887
BUR|BRH|Kestrels|1945
BED|BED|Red Devils|1946
WOK|WOK|Blues|1886
SUE|SUE|Foresters|1880
GLA|GLA|Red Devils|1916
YTH|YTH|Seahawks|1890
LMR|LMR|Pitmen|1921
MIA|MIA|Blue Army|1901
EVA|EVA|Pilgrims|1862
PRU|PRU|Bees|1895
HAR|HAR|Lions|1896
PIC|PIC|Gulls|1902
CUR|CUR|Rams|1901
SHR|SRW|Norsemen|1901
YEO|YEO|Ospreys|1910
HYT|HYT|Crusaders|1901
TAR|TRN|Red Devils|1867
FOL|FOL|Railwaymen|1889
HOC|HOC|Reds|1914
OLM|OLM|Marineros|1878
CER|CER|Mineros|1890
OLC|OLC|Rojos|1893
CUE|CUE|Mulas|1932
PLA|PLA|Amarillos|1915
LIO|LIO|Azules|1949
ALC|ALC|Verdes|1863
ALB|ALB|Gladiadores|1906
JUV|JUV|Osos|1938
MOF|MOF|Gladiadores|1883
MOD|MOD|Arrieros|1925
ARR|ARR|Toreros|1890
JUC|JUC|Rojos|1894
CRV|CRV|Charros|1872
OSU|OSU|Cruzados|1936
BEN|BEN|Caudillos|1904
JUR|JUR|Alfareros|1913
COR|COR|Venados|1937
MNT|MNT|Gauchos|1908
SOR|SOR|Alcarraza|1933
SAP|SAP|Rayos|1889
SEG|SEG|Águilas|1889
BNV|BNV|Granates|1902
CAU|CAU|Panteras|1873
SAL|SAR|Halcones|1940
ARA|ARA|Jaguares|1887
NAV|NAV|Campesinos|1904
MOA|MOA|Rojos|1974
OLR|OLR|Rojos|1888
MRB|MRB|Linces|1898
PED|PDR|Leñadores|1916
ARK|ARK|Urdinak|1921
SOD|SRN|Potros|1887
CES|CES|Els Blaus|1904
JUF|JUF|Titanes|1968
SEB|SEB|Blancos|1948
MOR|MOR|Búhos|1912
CBR|CAE|Blancos|1936
FUE|FUU|Rojos|1936
LIA|LRR||1989
SAC|SNT|Cuervos|1933
JUB|JUB|Blancos|1918
OLB|OLB||1911
CEB|CEB||1929
CUB|CUB||1979
POZ|PZR|Pastores|1913
OLA|OMA||1931
PLB|PLS||1959
ALA|AAL||1940
MTA|MTA||1989
ALL|AED||1921
RON|RON|Titanes|1900
MAY|MYR|Segadores|1897
SEP|SEP|Lagartos|1932
TOB|TOB|Alacranes|1885
JVN|JUD|Zorros|1931
NAU|NAU|Cruzados|1882
CAC|CST|Guerreros|1884
ELC|ELA|Faroleros|1943
OSC|OSC|Cóndores|1939
MOS|MLE|Delfines|1876
NUE|NUP|Cementeros|1947
DIL|DIL|Pioniere|1881
TEU|TEU|Falken|1951
UNT|UNT|Bären|1866
VIK|VIK|Dragoner|1914
VID|VID|Schwarzen|1909
VIB|VIB|Weißen|1873
BRU|BRU|Roten|1921
PRE|PRE|Grünen|1915
FSV|FSV|Husaren|1873
BER|BER|Wikinger|1876
FOR|FOR|Füchse|1895
BRF|BRF|Grünen|1874
GER|GER|Bergleute|1879
SPB|SPB|Fuhrleute|1916
MUH|MUH|Schwarzbären|1989
GEB|GEB|Weißen|1886
BRG|BRG|Weinroten|1936
HAF|HAF|Schanzer|1944
EIN|EIN|Fischer|1882
HAI|HAI|Löwen|1882
KIR|KIR|Kicker|1897
FON|FON|Weber|1905
STE|STE|Roten|1880
ALT|ALT|Lokomotiven|1867
SCW|SCW|Stahlarbeiter|1890
IMT|IMT|Raben|1917
FOH|FOH|Rothirsche|1888
IMM|IMM|Stiere|1900
BRV|BRV|Blauen|1942
COS|COS|Stahlwerker|1926
ROF|ROF|Raben|1918
TEA|TEA|Gelben|1881
FSF|FSF|Hirsche|1923
EIM|EIM|Brauer|1922
FOB|FOB|Wildschweine|1902
SPH|SPH|Gladiatoren|1879
VII|VTO||1903
TTN|TTN||1983
MUB|MUV||2008
FSD|FSD|Köhler|1892
AHR|AHR|Lotsen|1894
KRO|KRO|Kumpel|1893
HAK|HAK|Roten|1889
BRT|BRT|Tuchmacher|1888
EIE|EIE|Blauen|1930
HIR|HIR|Seeadler|1886
ALO|ALN|Gelben|1899
KLA|KLA|Schwäne|1908
SPV|SPG|Adler|1909
BLA|BLA|Hirsche|1892
UNH|UNH|Eisenmänner|1922
GRB|GRB|Schwarzen|1883
HND|HND|Hüttenknappen|1871
TED|TED|Ritter|1884
SCR|SCR|Kreuzritter|1897
BUG|BUO|Kormorane|1930
QUI|QUI|Tisserands|1963
LUN|LUN|Lynx|1898
AJC|AJC|Lions|1969
JOY|JOY|Mouettes|1904
USM|USM|Gladiateurs|1899
ESB|ESB|Renards|1935
VAL|VAL|Rouges|1924
ETO|ETO|Taureaux|1936
THO|THO|Bleus|1908
ESJ|ESJ|Dragons|1980
LAN|LAN|Aigles|1900
LUR|LUR|Bûcherons|1892
QUR|QUR|Dragons|1910
LUO|LUO|Chevaliers|1939
ROC|ROC|Comètes|1945
EST|EST|Lions|1873
VEA|VEA|Noirs|1902
VAR|VAR|Grenats|1896
LNM|LNM|Pionniers|1913
CLE|CLE|Verts|1880
PAU|PAU|Pêcheurs|1948
BEF|BEF|Marins|1921
CHR|CHR|Renards|1894
CEA|CEA|Gladiateurs|1912
CTE|CTE|Sangliers|1954
BEU|BEU|Forgerons|1908
CAF|CAF|Sentinelles|1930
DIA|DIA|Canonniers|1908
VIE|VIE|Mineurs|1942
BEO|BEO|Loups|1888
SRL|SRL|Faucons|1920
AJR|AJR|Cigognes|1878
LNN|LNN|Cerfs|1883
DUR|DUR|Blancs|1907
SRR|SRR|Rouges|1952
CHA|CHA|Loups|1880
VIL|VIL|Jaguatiricas|1880
GUA|GUA|Verdões|1899
GUF|GUF|Ursos|1887
GRE|GRE|Touros|1885
VIM|VIM|Capivaras|1982
PIT|PIT|Colibris|1983
UNG|UNG|Tamanduás|1899
GUI|GUI|Corsários|1904
UNP|UNP|Leões|1895
PIA|PIA|Tucanos|1906
NAC|NAC|Azulões|1905
URU|URU|Vaqueiros|1912
UBA|UBA|Azuis|1951
JAB|JAB|Raposas|1957
IPA|IPA|Bandeirantes|1970
JAC|JAC|Gaviões|1949
JAF|JAF|Tucanos|1955
UBE|UBE|Gladiadores|1943
GRA|GRA|Verdões|1893
CAT|CAT|Corvos|1945
USP|USP|Muli|1891
VIR|VIR|Tessitori|1865
MON|MON|Crociati|1870
PRO|PRO|Orsi|1891
TRE|TRE|Bersaglieri|1976
BEL|BEL|Granata|1897
USB|USB|Celesti|1900
AUD|AUD|Vignaioli|1906
USF|USF|Gladiatori|1903
FRA|FRA|Gufi|1909
GUB|GUB|Camosci|1894
MIR|MIR|Birrai|1901
ORV|ORV|Gabbiani|1915
PRF|PRF|Tori|1892
FRS|FRS|Rossi|1952
VIO|VIO|Verdi|1977
AUV|AUV|Cavalieri|1952
VIC|VIC|Gabbiani|1927
TRS|TRS|Lupi|1902
AUM|AUM|Neri|1916
AUS|AUS|Rondinelle|1910
GUS|GUS|Delfini|1903
VIS|VIS|Cervi|1907
SER|SER|Bianchi|1926
POL|POL|Ducali|1873
CRC|CRC|Volpi|1895
ADC|ADC|Leoni|1939
SEF|SEF|Pionieri|1877
UPX|UPX|Pionieri|1942
JUP|IUV|Cinghiali|1931
AUT|AUT|Comete|1899
USS|USS|Tori|1919
VAC|VLN|Cigni|1939
SFX|SFX|Draghi|1893
LIB|LIB|Bianchi|1888
FOA|FOA|Marinai|1932
PRS|PRS|Diavoli|1906
VLT|VLT|Minatori|1884
ASD|ASD|Pescatori|1881
AUF|AUF|Orsi|1970
POR|POR|Cruzados|1900
UNI|UNI|Onças|1863
POA|POA|Ursos|1893
SAN|SAN|Mineiros|1940
GRP|GRP|Brancos|1955
ALE|ALE|Rubro-Negros|1927
GMR|GMR|Dragões|1934
COV|COV|Amarelos|1913
GOU|GOU|Panteras|1897
ESP|ESP|Lampiões|1937
MAR|MAR|Bravos|1961
CAM|CAM|Veados|1889
TOM|TOM|Pescadores|1898
ESO|ESR|Lavradores|1864
SES|SES|Dragões|1885
LEI|LEI|Rubro-Negros|1949
CVA|CVA|Rubro-Negros|1912
LEF|LEF|Onças|1881
KVA|KVA|Brouwers|1891
KLE|KLE|Gladiatoren|1862
ZAA|ZAA|Stieren|1910
RKC|RKC|Molenaars|1982
VIT|VIT|Vissers|1899
NIE|NIE|Rooien|1948
EXC|EXC|Havenmannen|1933
VVG|VVG|Reuzen|1880
EXH|EXH|Blauwen|1911
KLF|KLF|Zeemeeuwen|1902
ADO|ADO|Zeelieden|1912
MAA|MAA|Wolven|1947
DVC|DVC|Arenden|1908
ZAS|ZAS|Ruiters|1920
WAA|WAA|Mijnwerkers|1891
LGD|LGD|Beren|1930
RKH|RKH|Vikingen|1878
VVZ|VVZ|Pioniers|1922
SPO|SPO|Estancieros|1882
BUS|BUS|Hornero|1892
NAD|NAD|Celestes|1922
GIM|GIM|Cruzados|1884
IND|IND|Ñandúes|1947
LEZ|LEZ|Pescadores|1912
INF|INF|Pampas|1953
DOM|DOM|Toros|1955
QRZ|QRZ|Águilas|1928
PUE|PUE|Toros|1956
VEL|VEL|Matadores|1957
REG|REG|Osos|1911
DEP|DEP|Cóndores|1965
DEF|DEF|Cerveceros|1978
DOR|DOR|Leones|1917
NAO|NAO|Leones|1944
GAR|GAR|Mineros|1944
URQ|URQ|Pumas|1972
CAS|CAS|Halcones|1910
DFN|DFN|Zorros|1971
REQ|REQ|Pioneros|1925
GAP|GAP|Cóndores|1907
NCN|NCN|Arrieros|1903
PEC|PEC|Panteras|1943
FRC|FRC|Ferroviarios|1912
TOR|TOR|Negros|1923
COF|COF|Gallos|1949
ARC|ARE|Ñandúes|1938
ASP|ASP|Beacons|1993
SIL|SIL|Fire|1938
SIA|SIA|Dragons|1929
SUN|SUN|Voyagers|1942
GOR|GOR|Comets|1935
CHM|CHM|Yellows|1907
MIL|MIL|Lumberjacks|1921
FOS|FOS|Lightning|1961
LAK|LAK|Stallions|1952
FRT|FRT|Pioneers|1963
FOF|FOF|Ospreys|1977
SPR|SPR|Rockets|1938
EAG|EAG|Whites|1973
BLU|BLU|Rockets|1914
HIC|HIC|Eagles|1941
CED|CED|Blacks|1975
BEA|BEA|Fishermen|1985
PIN|PIE|Reds|1927
WHI|WHI|Ironmen|1979
ASE|ASE|Oranges|1920
GOP|GOP|Dragons|1948
CAN|CAN|Gunners of the Shire|1928
MAP|MAP|Maroons|2001
BLS|BLS|Greens|1979
SUS|SUS|Sparrows|1960
PNF|PNF|Whalers|1920
SUM|SUM|Windmills|1961
REN|REN|Storm|1968
GRU|GRU|Brewers|1989
PRA|PRA|Wrens|1968
NIS|NIS|Warriors|1932
KIT|KIT|Albatros|1908
SAK|SAK|Reds|1937
SHI|SHI|Kingfishers|1933
SHF|SHF|Phoenixes|1925
AKI|AKI|Blues|1919
MAT|MAT|Blues|1904
ASA|ASA|Lanterns|1952
HIG|HIG|Samurai|1985
NAG|NAG|Aurora|1956
FUJ|FUJ|Knights|1917
MAC|MAC|Oranges|1909
KIK|KIK|Navy|2006
HOK|HOK|Dragons|1958
OKA|OKA|Oranges|1965
MAS|MAS|Yellows|1958
HIS|HIS|Greens|1912
MTS|MTS|Vento|1924
NAA|NAA|Bears|1926
AKM|AKM|Hawks|1926
JIL|JIL|Guerreros|1892
TUL|TUL|Azulones|1904
JIU|JIU|Corsarios|1921
COA|COA|Pescadores|1882
JIF|JIF|Azules|1898
LOB|LOB|Rojos|1923
JIC|JIC|Toros|1971
XAL|XAL|Zorros|1943
OCO|OCO|Verdes|1968
VEN|VEN|Mineros|1928
CTH|CTH|Rojos|1931
OCR|OCR|Águilas|1957
PAC|PAC|Cementeros|1958
ZAP|ZAP|Alacranes|1939
UNX|UNX|Pumas|1904
CUA|CUA|Charros|1959
ZOC|ZOC|Rojos|1910
HAL|HAL|Panteras|1954
GAN|GAN|Knights|2004
CHO|CHO|Greens|1921
CHU|CHU|Magpies|1904
CHS|CHS|Shipwrights|1938
SEO|SEO|Silkmen|1963
CHT|CHT|Hawks|1988
CHH|CHH|Warriors|1989
BUJ|BUJ|The Garrison|1973
HAE|HAE|Whales|1944
GYE|GYE|Cranes|1991
WOL|WOL|Dolphins|1984
GNG|GNG|Silkmen|1970
TAK|TAK|Panthers|2004
UBO|UBO|Navy|1999
NON|NON|Elephants|1929
NOA|NOA|Rockets|1952
SIN|SIN|Tigers|1913
SAU|SAU|Lotus|1973
UBU|UBU|Rockets|1925
KHA|KHA|Reds|1952
KHP|KHP|Garudas|1978
UBC|UBC|Knights|1946
WAN|WAN|Ravens|1926
PHU|PHU|Comets|2003
SKL|SKL|Cobras|1961
MUA|MNG|Naga|1984
TKP|TKP|Kings|1958
MUU|MUU|Eagles|1949
BAU|BAU|Warriors|1909
UAL|UAL|Reds|1905
AWK|AWK|Blues|1956
AKP|AKP|Trout|1965
ABI|ABI|Lions|1907
ADU|ADU|Cutlers|1911
IKA|IKA|Potters|1927
AWU|AWU|Eagles|2005
SHU|SHU|Ospreys|1905
ADN|ADN|Owls|1939
OWR|OWR|Blues|1947
SHO|SHO|Colliers|1919
UMU|UMU|Blues|1925
IKU|IKU|Vikings|1964
SHA|SHN|Yellows|1985
AKY|AKY|Wolves|1916
ILA|ILA|Pike|1960
AWP|AWP|Greens|1981
AWW|AWW|Reds|1975
ENC|ENC|Yellows|1968
SPT|SPT|Loups|1902
NAJ|NAJ|Ours|1907
USN|USN|Comètes|1901
SAF|SAF|Lions|1927
NAN|NAN|Bleus|2008
SID|SID|Écureuils|1909
SIB|SIB|Mousquetaires|1945
TAZ|TAZ|Marins|2006
NAM|NAM|Cigognes|1923
SPI|SPV|Meuniers|1983
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
ZEZ|ZEZ|Vukovi|1985
RAM|RAM|Crveni|1961
MFK|MFK|Baroni|1955
AOV|AOV|Komete|1968
KON|KON|Brouwers|1891
STS|STS|Kikkers|1952
KFC|KFC|Ruiters|1870
WAG|WAG|Rijders|1885
KVZ|KVZ|Beren|1865
GRO|GRO|Herten|1888
KRC|KRC|Zeemeeuwen|1872
KVT|KVT|Wolven|1950
KVN|KVN|Geelen|1939
BEG|BEG|Geelen|1943
NIF|NIF|Zwarten|1913
OUD|OUD|Witten|1892
KLN|KLN|Geelen|1889
OOS|OOS|Pioniers|1942
RSC|RSC|Rooien|1882
KZX|KZX|Groenen|1912
DEM|DEM|Akbabalar|1923
DEG|DEG|Kargalar|1906
YEN|YEN|Aslanlar|1899
AYD|AYD|Fırtına|1930
AKO|AKO|Ayılar|1960
DMB|DMB|Kaplanlar|1920
KAR|KAR|Kuyruklu Yıldızlar|1988
GUL|GUL|Bordolar|1946
KAY|KAY|Boğalar|1950
CNS|CNS|Martılar|1948
USE|USE|Yeşiller|1914
BOZ|BOZ|Yeniçeriler|1964
BOG|BOG|Turuncular|1932
TEK|TEK|Kurtlar|1965
CAB|CNL|Sarılar|1971
BOB|BOB|Atmacalar|1959
GLR|GLR|Kartallar|1931
ORH|ORH|Şahinler|1936
HOL|HOL|Červení|1929
TJH|TJH|Draci|1908
NYM|NYM|Komety|1920
ZEL|ZEL|Jeleni|1983
SLA|SLA|Medvědi|1923
SOK|SOK|Průkopníci|1963
BRN|BRN|Havrani|1953
RYC|RYC|Horníci|1949
SOS|SOS|Býci|1938
ZLI|ZLI|Tuři|1940
VSE|VSE|Komety|1965
SPA|SPA|Racci|1915
DUK|DUK|Rytíři|1957
TRF|TRF|Modří|1935
HLD|HLD|Medvědi|1932
STY|STY|Gladiátoři|1975
GSM|GSM|Nautikoí|1912
PEL|PEL|Psarádes|1925
DOX|DOX|Korákia|1908
NIK|NIK|Titánes|1930
AEA|AEA|Gladiátores|1942
AOK|AOK|Lárioi|1981
AEL|AEL|Nautikoí|1979
AEI|AEI|Delfínia|1918
TRA|TRA|Kometes|1940
AET|AET|Kókkinoi|1911
ARG|ARG|Prásinoi|1945
PAN|PAN|Ypsilánti|1925
AOC|AOC|Kókkino Krasí|1921
APO|APO|Kometes|1976
DYR|DYR|Vikinger|1972
DYI|DYI|Smedene|1902
BRK|BRK|Måkene|1884
HLV|HLV|De Hvide|1900
IKB|IKB|Ørne|1871
KIL|KIL|Ørnene|1891
LNG|LNG|De Hvide|1877
HAV|HAV|Svaner|1900
STN|STN|De Blå|1880
FRM|FRM|Rever|1895
FJO|FJO|Ulve|1910
FRD|FRD|Hjortene|1892
SNX|SNX|Gladiatorene|1880
RIN|RIN|Pionerer|1898
FRN|FRN|Vikinger|1897
GAM|GAM|De Blå|1908
KSJ|KSJ|Rybacy|1900
RAD|RAD|Pionierzy|1939
KSS|KSS|Wilki|1980
UNW|UNW|Pionierzy|1919
GKS|GKS|Piwosze|1962
KSR|KSR|Kowale|1901
BUD|BUD|Czerwoni|1916
LKS|LKS|Gladiatorzy|1995
STB|STB|Komety|1928
RUC|RUC|Lwy|1982
ZAG|ZAG|Niebiescy|1971
DAB|DAB|Niedźwiedzie|1939
WOX|WOX|Górnicy|1915
DOL|DOL|Zieloni|1981
ZAE|ZAE|Kosynierzy|1940
KSN|KSN|Husaria|1967
GKB|GKB|Flisacy|1955
GWA|GWG|Pomarańczowi|1937
BJR|BJR|De Hvide|1890
BRO|BRO|De Sorte|1967
STF|STF|Vikinger|1869
VES|VES|Bjørner|1902
FRE|FRE|De Røde|1927
HFX|HFX|Ulvene|1876
NOR|NOF|De Røde|1927
NOI|NOI|De Grønne|1953
IKS|IKS|Pionerer|1900
MAK|MAK|De Blå|1877
NRD|NRD|Hvalene|1915
ASK|ASK|De Røde|1899
GOL|GOL|Weißen|1938
OBE|OBE|Köhler|1872
SCH|SCH|Füchse|1900
COB|COB|Weinroten|1875
HAN|HAN|Schwarzen|1894
BAC|BCH|Schwarzen|1930
RHE|RHE|Kumpel|1903
GEF|GEF|Löwen|1930
OBM|OBM|Falken|1931
VKT|VKT|Seeadler|1934
GEN|GEN|Raben|1866
FSK|FSK|Pioniere|1893
HOF|HOF|Löwen|1886
BOR|BOR|Husaren|1872
ENE|ENE|Hüttenknappen|1903
ROT|ROT|Schwarzen|1961
FSN|FSN|Rothirsche|1982
ROW|ROW|Grünen|1904
FOT|FOT|Seeadler|1876
HOH|HOH|Pioniere|1900
HOS|HOS|Gladiatoren|1927
TEO|TEO|Weißen|1914
BEH|BEH|Salzsieder|1877
TEB|TEB|Stahlwerker|1953
STR|STR|Robins|1864
STA|STA|Fishermen|1890
MOU|MOU|Clansmen|1870
LAA|LAA|Reds|1864
MOI|MOI|Millers|1873
BAL|BAL|Yellows|1877
MID|MID|Ospreys|1898
KIB|KIB|Dockers|1901
JED|JED|Fishermen|1902
MIK|MIK|Navy|1918
TAY|TAY|Pipers|1920
KIO|KIO|Archers|1919
WOD|WOD|Miners|1958
GEJ|GEJ|Robins|1934
WOF|WOF|Wolves|1918
GEV|GEV|Reds|1945
MOB|MOB|Magpies|1932
MOT|MOT|Koalas|1901
CFF|CFF|Sparrows|1972
NOW|NOW|Stags|1942
TAM|TAM|Emus|1978
BAS|BAS|Crocs|1988
PRT|PRT|Blues|1954
COM|COM|Vikings|1924
BAR|BAR|Halászok|1932
GYO|GYO|Úttörők|1944
DUN|DUN|Hollók|1926
ZAL|ZAL|Sólymok|1910
SRT|SRT|Kékek|1966
GYA|GYA|Medvék|1973
BAV|BAV|Bordók|1910
ORS|ORS|Bányászok|1951
KAL|KAL|Rókák|1933
ZAF|ZAF|Gladiátorok|1919
NGY|NGY|Sirályok|1931
ORR|ORR|Vörösök|1979
LIS|LIS|Harps|1881
LIW|LIW|Pitmen|1884
ORA|ORA|Brewers|1950
COU|COU|Clansmen|1941
NEW|NEW|Buzzards|1929
POC|POC|Hurlers|1946
ATH|ATH|Gaels|1939
SLI|SLI|Corsairs|1883
NWL|NWL|Blues|1891
CAK|CAK|Rebels|1898
TAL|TAL|Stags|1931
LLA|LLA|Ravens|1900
DOC|DOC|Potters|1930
CLY|CLY|Quarrymen|1886
ABE|ABE|Brewers|1878
CAH|CAH|Colliers|1947
BLN|BLN|Dragons|1902
BLW|BLW|Whalers|1952
PEN|PEO|Miners|1926
TEN|TEN|Reds|1916
BNG|BNG|Harpers|1892
BAH|BGO|Drovers|1911
JAN|JAH|Horsemen|1946
SAH|MAW|Caravans|1973
YAS|NAW|Dunes|2001
SAR|SAL|Greens|1962
FUR|QAM|Divers|1962
WAF|HAW|Whites|1905
HAQ|SHA|Greens|1935
UFU|AIQ|Palms|1921
RAY|ASL|Gazelles|1939
IBD|FUR|Sky Blues|1989
SAQ|SAM|Maroons|1919
SAA|HID|Sultans|1936
TAQ|MAD|Pearls|1971
HAD|JAW|Foxes|1985
ASL|UFU|Reds|1928
DHI|SHH|Knights|1898
RIA|KER|Stallions|1946
NAK|WAM|Dhows|1982
ZAM|SIT|Desert Foxes|1970
TAF|WAL|Yellows|1916
QAM|SIS|Yellows|1942
ZAH|JWQ|Reds|1936
AIN|RIF|Sandstorm|1966
WAD|WAI|Camels|1986
TAT|SAY|Greens|1967
RAS|IZZ|Greens|1997
SHJ|SHS|Reds|1912
KAA|WAS|Hawks|1941
TAH|SAB|Greens|1980
WAI|AIK|Oryx|1920
MAW|SHB|Nomads|1983
QIM|SHL|Tigers|1930
NIM|BAQ|Falcons|1972
AAD|RUS|Eagles|1948
NOU|WDI|Desert Foxes|1967
KHL|WRS|Lions|1999
BAN|TEL|Sky Blues|1976
TAJ|TEM|Yellows|1928
BAM|TLM|Oranges|2008
BND|BYL|Sailors|1989
LTJ|TER|Reds|1928
KAM|BYN|Oranges|1977
TMN|LRL|Tigers|1918
TES|PUP|Blues|1920
LTS|PUA|Lions|1977
TAA|TIO|Dragons|1952
TAN|SRI|Biru Langit|1950
BUK|PDP|Crocodiles|1933
PUL|UIT|Helang|1940
SIM|SEI|Buaya|1927
SIP|PUL|Biru Langit|1986
TEL|LAB|Biru|1943
TEP|DAM|Elephants|1922
SUP|UIK|Kuning|1906
SRI|SEJ|Kuning|1941
SIT|KAB|Harimau|1979
PUT|MUT|Eagles|1948
PUA|UIP|Kancil|1958
SMP|PUS|Rockets|2008
PUI|PRM|Merah|1988
BIN|THE|Reds|1979
THE|NNH|Yellows|1967
BUF|CNG|Tigers|1988
VIN|SAI|Rockets|1930
THM|COG|Kings|1913
THL|CAD|Eagles|1928
HTF|CAG|Crocodiles|1956
SON|HOA|Naga|1904
THT|THK|Reds|1949
LKC|CLB|Yellows|1933
LON|SLS|Buffaloes|1978
THH|SAT|Hornbills|1913
BAO|CLV|Phoenix|1934
SOH|KOT|Warriors|1937
KED|KED|Warriors|1930
LAF|LAF|Oranges|1919
PER|PER|Hornbills|1899
PSP|PSP|Tigers|1955
PES|PES|Buffaloes|1956
LAG|LAG|Rockets|1937
SUR|SUR|Sharks|1925
BHS|BHS|Tigers|1931
BHA|BHA|Reds|1980
BHT|BHT|Kings|1932
PEI|PEI|Crocodiles|1954
PEK|PEK|Reds|1912
PST|PST|Rockets|1972
TAP|TAN|Dragons|1934
PPX|PPX|Yellows|1943
BHP|BHP|Greens|1970
PSA|PSM|Eagles|1961
PUR|PUU|Yellows|1990
BIF|BIN|Warriors|2008
BIW|BIW|Whites|1982
BAG|BAG|Elephants|1927
PAS|PSY|Reds|2008
BAW|BAW|Dragons|1934
MAF|MAG|Eagles|1952
PAF|PYA|Yellows|1942
CBY|CBY|Sharks|1953
BIU|BIU|Sparks|1931
PAM|PMG|Crimsons|1922
LAD|LAD|Workmen|1950
NES|NES|Hornets|1903
NEL|NEL|Dockers|1939
LDF|LDF|Pitmen|1942
KRU|KRU|Merlins|1969
SBL|SBL|Herons|1958
THA|THA|Greens|1920
THB|THL|Brewers|1921
LAS|LAS|Falcons|1968
SAS|SSL|Whites|1957
MAB|MRA|Whites|1927
THS|THS|Arrows|1971
VRE|VRE|Colliers|1963
THF|THF|Whites|1930
BET|BET|Weavers|1914
ULU|ULU|Lions|1980
ZFR|IDK|Lions|1922
NJH|SAH|Nomads|1935
NIL|DEL|Sky Blues|1917
TAW|KAF|Oryx|1939
SLM|TAW|Knights|1938
ITT|PEA|Camels|1914
FAU|LUX|Palms|1971
KAF|ZFR|Tigers|1961
DAM|QEN|Sultans|1986
POT|MAH|Sandstorm|2008
TAI|ABU|Reds|1965
ITA|SUA|Sandstorm|1981
SOF|BES|Foxes|1994
BEI|PEM|Lions|1936
ZOH|BEI|Divers|2003
ITD|NIL|Dunes|1971
HIL|KAD|Stallions|1934
SUA|PTR|Tigers|1960
MOE|KAS|Chacals|1928
MNE|ESK|Rouges|1927
VND|GAF|Rouges|1921
ESA|USG|Aigles|1909
BEE|JST|Lions|1987
SAO|USR|Fennecs|1939
UMV|EOB|Faucons|1967
SCB|USH|Chacals|1972
BOU|EOT|Gazelles|1945
CHF|JSR|Palmiers|1902
NAE|BEM|Faucons|1967
ETM|SBG|Marins|1949
NNC|KEL|Gazelles|1937
NNE|JSM|Rouges|1988
TAB|TBN|Cheetahs|1932
TAC|TAB|Reds|1897
SAM|SMK|Sky Blues|1923
RUV|RUV|Yellows|1995
MRM|MRM|Buzzards|1974
TBT|TAC|Miners|1937
TBK|TAJ|Warriors|1923
MTW|MTW|Yellows|1970
KIS|KBN|Elephants|1961
KIG|KIG|Eagles|1935
SOC|SON|Elephants|1986
SMM|SMM|Simbas|1913
MRT|MRT|Reds|1898
KBG|KBG|Eagles|1917
YOU|YOU|Blues|1964
KIU|KIU|Stars|1961
CHV|UST|Dromadaires|1901
THR|ESH|Rouges|1932
THI|ASO|Chacals|1938
AJM|NAR|Fennecs|1899
NAF|BOK|Fennecs|1928
MIO|ASH|Sahariens|1928
BEC|UBX|Blancs|1968
SPC|MBB|Gazelles|1926
MNV|MCT|Aigles|1927
TRL|BRL|Lions|1959
SAG|IRT|Lions|1961
VLL|MOO|Bleus|1915
FNR|BEJ|Verts|1943
CHP|JTX|Faucons|1958
LAE|MSB|Gazelles|1951
USC|MCB|Rouges|1928
XAN|XAN|Drákontes|1934
GSX|GSX|Ierakes|1915
AOS|AOS|Taýroi|1916
ETH|ETH|Lárioi|1926
PAK|PAK|Arkoúdes|1929
KYP|KYP|Nautikoí|1925
NII|NIM|Kítrinoi|1925
PAE|PAE|Titánes|1973
PAL|PNT|Léontes|1968
GXX|GXX|Gladiátores|1934
PAT|PAH|Kaloyéroi|1917
AKX|AKX|Psarádes|1942
AEK|AEK|Spartiátes|1985
AOM|AOM|Ippótes|1945
AOB|AOB|Plavi|1899
KAS|KAM|Pivari|1926
TUR|TUR|Beli|1912
RAO|RAO|Lavovi|1922
RUD|RUD|Hajduci|2008
PAP|PAP|Ribari|1985
MFP|MFP|Lisice|1968
RAR|RAR|Sokolovi|2008
MFV|MFV|Bikovi|1938
MLG|MLG|Galebovi|1972
HED|NOR|Renarna|1866
DYF|GIF|Sjömännen|1900
GAF|VAS|Lejonen|1867
GMM|IFK|Älgarna|1893
HOB|IFV|Sälarna|1881
FRH|VAI|Vikingarna|1927
DYB|GIK|Smederna|1879
ISN|FAL|Vita|1875
ALS|BRB|Hammarna|1876
STO|GAV|Vargarna|1966
BRI|IFO|Björnarna|1911
SND|SIG|Fiskarna|1923
STK|IKT|Blå|1887
SBX|NYA|Röda|1909
DYY|NYN|Gruvarbetarna|1903
SYD|LIF|Gröna|1903
MET|VIV|Minerii|1919
STI|ALA|Lupii|1990
ZEN|PET|Albaștrii|1929
SPD|VAT|Leii|1934
SPK|OLI|Zimbrii|1927
MEL|DRE|Pescarii|1922
DNJ|ACS|Pescarii|1966
AOL|MEZ|Șoimii|1930
DOU|MET|Vulturii|1921
KAU|GLO|Zimbrii|1928
BRS|MTL|Lupii|1909
RAN|ACZ|Albaștrii|1952
KSP|MRE|Minerii|1911
DOJ|PRG|Șoimii|1942
RAB|MEA|Leii|1966
LOK|ELE|Albaștrii|1939
VLD|VAC|Alcarraza|1926
ARO|ARO|Rayos|1925
AOA|ARC|Lobos|1922
HIN|HIN|Negros|1950
VAE|VLD|Búhos|1932
POD|POD|Lobos|1898
MAD|MAY|Potros|1942
TLR|TLR|Águilas|2005
LIU|LIU|Vaqueros|1913
GUD|GUD|Cóndores|1982
GDR|GDR|Delfines|1913
ATO|ATO|Blancos|1931
LIR|LIA|Jaguares|1941
ARN|ARN|Azules|1938
SNT|SSO|Leñadores|1925
ROB|ROB|Halcones|1967
ESU|ESO|Potros|1894
DEO|DEO|Pampas|1921
RGT|RGT|Arrieros|1909
PUF|PUF|Leones|1999
RDD|RDD|Matadores|1921
VEC|VEC|Ñandúes|1890
SPL|SPL|Gladiadores|1893
INB|INB|Azules|1945
CST|CTO|Delfines|1905
SRN|SNI|Cruzados|1889
RDL|RDL|Tamberos|1917
ESE|ESE|Gladiadores|1948
DEE|DEE|Rayos|1922
SIV|STI|Lobos|1968
GMN|GMN|Matadores|1900
SVO|SPC|Halcones|1922
VAB|VAB|Panteras|1917
POS|POZ|Toros|1921
CAA|CAB|Rojos|1900
PEB|PED|Rojos|1916
PZA|PZA|Pastores|1894
CRA|CBR|Verdes|1911
GND|GND|Blancos|1908
MAE|MAB|Gladiadores|1896
VAD|VAD|Mulas|1922
ORI|ORL|Toros|1933
BAI|BAI|Arrieros|1900
FNT|FNT|Halcones|1904
CEV|CEV|Delfines|1903
ELU|ELU|Titanes|1962
NUM|NUM|Cóndores|1950
LUC|LUS|Alcarraza|1966
TAU|TAR|Jaguares|1961
CNJ|CNJ|Leñadores|1954
BAJ|BJO|Tejedores|1917
NUT|NUT|Mineros|1894
BRB|KMF|Voyageurs|1973
GRN|HMH|Reds|1931
BON|CHL|Moose|1969
HOR|KMT|Reds|1957
TIV|GLM|Greens|1922
COD|GLY|Maples|1978
CLW|SLE|Grizzlies|1942
HAY|DUA|Maples|1974
BUA|AIN|Gazelles|1940
IZZ|BAH|Knights|1989
MAJ|YAS|Stallions|1989
JAA|BAC|Pearls|1939
WAT|SAC|Reds|1986
JEA|SAA|Camels|1957
YAQ|SHY|Eagles|1907
SHQ|SHJ|Oranges|1948
RIM|KUT|Nomads|1935
DHA|BUR|Horsemen|1954
HUR|KAA|Lions|1978
NAW|BUC|Falcons|1922
FAA|SBX|Camels|1945
SHB|SHR|Horsemen|1975
MES|MES|Tigers|1911
NAS|NAS|Camels|1915
GOS|GOS|Gazelles|1929
FAJ|FAJ|Horsemen|1934
PAY|PAY|Sultans|1932
ZOB|ZOB|Yellows|1999
NSS|NSS|Foxes|1915
NFT|NFT|Eagles|1914
PSY|PAS|Falcons|1916
GOB|GOB|Knights|2007
PYK|PYK|Sandstorm|1903
MOH|MOH|Blues|1939
SEY|SEY|Lions|2008
BAB|BAB|Yellows|1941
FAB|FAB|Lions|1985
SHD|SHD|Hawks|1956
IHS|MUS|Whites|1988
BHY|MUA|Reds|1997
UMM|WAD|Reds|1977
ULI|SOH|Horsemen|1954
GHA|SHZ|Sandstorm|1899
RIY|SHQ|Lions|1944
DIR|SHW|Caravans|1926
AIM|ZAC|Yellows|1930
BUU|SBA|Hawks|1926
ABC|DIW|Palms|1909
ABA|AQA|Pearls|1928
SHM|BUA|Lions|1932
MEI|NIN|Reds|1977
JIN|PIN|Cranes|1898
MED|NID|Blues|1938
DON|ANZ|Greens|1899
KAI|DON|Sharks|1976
HEN|MEY|Pines|1960
BSH|RUY|Phoenix|1915
LOP|CHG|Cranes|1966
BEY|BAO|Magpies|1981
WUJ|LIH|Whales|1932
BAF|CHF|Tigers|1914
SHE|KAU|Lions|1983
CHN|HAY|Eagles|1925
MEY|YUN|Dragons|1926
CHD|DOS|Steelmen|1978
XYA|YUE|Eagles|1928
HIA|HIU|Falcons|1900
KIA|KTH|Falcons|1921
SAB|SAS|Oranges|1934
KAW|KAW|Deer|1900
AKA|AKA|Wolves|1902
AKB|AKR|Knights|1977
INA|INA|Stags|1940
TAE|TAA|Blues|1988
TAG|TAF|Whales|1973
KAB|KWS|Sharks|1975
SAD|SKR|Pioneers|1982
INI|INR|Lancers|1946
AMA|AKH|Blues|1979
ASB|ASU|Foxes|1969
FUA|FUF|Ravens|1918
KUR|KUR|Reds|1912
NIA|NIA|Cranes|1975
YAM|YAM|Typhoons|1990
HIB|HIK|Comets|1916
OKB|OKL|Oranges|1969
CHG|CHN|Bulls|1926
JEO|JEO|Sharks|1925
BOJ|BOJ|Rockets|2008
PYE|PYE|Reds|1932
WOA|WOC|Eagles|1951
GYB|GYF|Dragons|1916
BAD|BAN|Comets|1950
NAB|NAE|Foxes|1918
SIC|SIU|Lancers|1977
DOA|DOH|Tigers|1948
CHJ|CHJ|Pioneers|1943
BUB|BUU|Reds|1948
MUN|MUN|Blacks|1923
JIA|JIN|Stags|1917
WOG|WOP|Bears|1964
MUC|MUG|Buffaloes|1914
RAT|RAU|Crocodiles|1927
PAA|PKN|Pioneers|1936
THC|THP|Yellows|1944
BAK|BAP|Hornbills|2008
KAO|KPR|Ravens|1916
NOB|NNG|Greens|1974
SII|SNG|Oranges|1996
PAB|PKP|Lions|1975
MAG|MUX|Dragons|1940
PAI|PAA|Warriors|1987
BEK|BAF|Blues|1955
BAE|BNR|Foxes|1966
UBB|UBR|Stags|1954
PHR|PHR|Sharks|1925
TAS|TKB|Reds|1982
PEA|PTX|Naga|1927
PEE|PSI|Lotus|1914
PSS|PSA|Blues|1944
PSI|PEB|Garuda|1918
KEA|KEP|Dragons|1929
SOL|SOF|Naga|1921
BOA|BOF|Garudas|1962
KEN|KEU|Garuda|1924
PUB|PUR|Greens|1930
PPS|PSS|Crocodiles|1929
PUN|PRN|Buffaloes|1930
SUB|SRJ|Eagles|1917
PEP|PEP|Greens|1974
PEF|PBX|Lions|1965
PSC|PSC|Elephants|1935
PAD|PML|Panthers|1915
PUC|PRP|Panthers|2000
BHB|BHB|Sharks|1954
PSM|PMX|Hornbills|1971
BHI|BHK|Elephants|1930
THD|SNP|Cranes|1949
THP|CLD|Oranges|1942
CAD|THB|Sharks|1970
KHB|CLN|Cranes|1916
BAP|THN|Blues|1952
BAQ|TLS|Phoenix|1989
TEC|STD|Lotus|1954
THG|SLL|Garudas|1956
BIA|THI|Dragons|1957
SOA|TEP|Reds|1968
LAB|XIM|Elephants|1971
DOG|THD|Yellows|1958
MAH|MNK|Leopards|1929
MAL|MAU|Eagles|1934
GWB|GWA|Bulls|1945
SOB|SOL|Lotus|1905
MEE|MEE|Blues|1925
KAC|KLK|Gladiators|1904
AHM|AHM|Maroons|2008
KOL|KOU|Rhinos|1931
MAM|MDP|Lions|1927
UJJ|UJA|Panthers|1955
UJH|UJJ|Elephants|1958
AMB|AMB|Monsoon|1936
SAE|SUF|Blacks|1898
VAA|VDW|Whites|1928
PIE|PIR|Marineros|1916
PIO|PID|Alfareros|1915
OLD|OLA|Tiburones|1909
ELA|ELC|Alacranes|1907
RIB|RIB|Halcones|1904
SEA|JUS|Leñadores|1898
PLC|PLR|Segadores|1914
CAG|CAA|Zorros|1921
GAA|GAU|Cruzados|1894
ALF|ALO|Celestes|1932
ARB|ARI|Búhos|1916
CAJ|CMP|Celestes|1967
MAQ|MAO|Cuervos|1927
ROA|SRC|Rojos|1967
SEC|JUN|Mineros|1939
ARD|ARB|Marineros|1951
FUB|ESF|Rayos|1927
FUL|FUE|Cuervos|1906
SDD|ORI|Tejedores|1917
FUC|FUS|Zorros|1917
CAP|CLT|Linces|1905
VAF|VAA|Celestes|1903
CAQ|CLA|Águilas|1916
TAX|SAE|Cóndores|1932
PEG|PDL|Rojos|1934
FRB|FES|Gladiadores|1929
ALG|ALZ|Corsarios|1974
LUA|LUC|Amarillos|1977
BEB|BEC|Titanes|1929
LAC|MED|Cóndores|1974
TOA|JUT|Toreros|1944
POB|POU|Gauchos|2007
VIA|VLL|Corsarios|1952
GAO|GAC|Alacranes|1934
LAV|LVN|Pescadores|1937
LAH|LAV|Cóndores|1906
ARE|SPI|Hornero|1910
CLA|INC|Corsarios|1905
URA|URI|Amarillos|1912
URI|ESU|Marineros|1950
ESC|ESC|Zorros|1949
HER|DEH|Azules|1978
FRF|FRO|Toros|1929
TOZ|TOC|Celestes|1973
SAJ|SAO|Lobos|1987
REB|RET|Leones|1940
DAL|DAL|Panthères|1932
DAU|USD|Lynx|1923
LOU|LOU|Lions|1924
OLY|YAO|Blancs|1989
MAU|MNR|Sentinelles|1964
ACA|ACD|Crocodiles|1967
BOC|BOU|Gazelles|1930
ZIG|UZX|Comètes|1953
ZIR|ZIM|Bûcherons|1952
TAA24|UTX|Éléphants|1972
MAO|ETL|Mimosas|1948
DAK|DAK|Forgerons|2002
SUH|SUH|Trout|1920
WAR|WAH|Reds|1934
SEK|SEK|Yellows|1964
AKR|APX|Yellows|1941
ADA|ADA|Leopards|1953
ANO|ANO|Miners|1939
TAB25|TAU|Greens|1970
SUC|SUU|Blues|1932
WAB|WRA|Rams|1913
EFF|EFF|Porcupines|1958
KOH|KOH|Lamplighters|1983
KOM|KOM|Reds|1916
HOA|HOG|Elephants|1988
YEA|YEH|Buffaloes|1975
ACE|ACA|Comètes|1899
KAD|KAO|Verts|1937
SPE|SPE|Canonniers|1984
LOL|LOS|Rouges|1926
DCK|DKL|Panthères|1960
BOK|USU|Panthères|1925
YAA|YMS|Mimosas|1955
AIE|ACF|Écureuils|1913
YAO|USY|Crocodiles|1929
ASC|ASC|Buffles|1913
DAO|DAF|Corbeaux|1990
ACY|ACY|Rouges|1934
SAT|SSB|Hyènes|1900
MSO|ETM|Rouges|1908
NZE|NZE|Rouges|1903
MAV|MTR|Faucons|1951
GRC|GRG|Blancs|1915
DAC|DAS|Rouges|1937
GUC|GUU|Éléphants|1986
SIK|SIK|Verts|1956
KOU|KMB|Bleus|1925
TOC|USL|Noirs|1977
BOD|BKD|Bleus|1952
MAX|MSS|Aigles|1946
ZIA|ETZ|Chacals|1928
NOC|UNK|Hippopotames|1930
NAL|ETN|Buffles|1936
ZIZ|ZIG|Rouges|1900
PET|PTT|Antilopes|1944
BOE|BOS|Éléphants|1984
BOF|BOA|Aigles|1953
DIO|DIO|Buffles|1961
YOP|YOP|Antilopes|1955
KIC|KIS|Panthères|1949
ZIO|ZIF|Gazelles|1989
LAJ|LAR|Hyènes|1940
OUS|OUS|Crocodiles|1937
OUO|OUA|Léopards|1936
TAC26|TMD|Rouges|1915
KAE|KYR|Rhinocéros|1934
SED|SEA|Lions|1919
KAN|KND|Verts|1944
MBU|MBD|Antilopes|1951
SAV|USX|Faucons|1969
BAT|BAE|Éléphants|1989
DOB|DKD|Jaunes|1984
YSO|YSS|Faucons|1984
PIB|PEZ|Aigles|1947
NOO|UNO|Faucons|1937
NOD|NOU|Léopards|1939
NZU|USZ|Aigles|1954
MAZ|MNB|Léopards|1910
KOR|KOR|Hippopotames|1923
TOD|TOA|Bleus|1920
MLB|MAX|Jaunes|1918
MSA|MTK|Panthères|1923
KID|USK|Verts|1966
LAL|LBD|Éléphants|1997
DIE|DGR|Pythons|1912
BYA|BOY|Baobabs|1924
MBE|MBU|Hyènes|1920
MRE|MBG|Rouges|1900
BOH|BKM|Hippopotames|1920
NZM|ETI|Rhinocéros|1950
TUM|ETT|Panthères|1938
TAD27|TMN|Chacals|1985
BAX|BAM|Faucons|1929
TIA|TOI|Pythons|1965
MOP|MOP|Buffles|1921
ZIE|ZGN|Léopards|1953
BAZ|BMT|Éléphants|1979
MKO|MKO|Rouges|1944
VIF|VLS|Verdes|1937
GDD|GDV|Cabras|1904
LAP|ESL|Onças|1928
AMC|AMA|Pastores|1932
VIG|VIA|Oleiros|1979
POE|UIA|Cruzados|1985
VIH|VIF|Cegonhas|1964
POO|PDC|Raposas|1932
VAG|VAF|Rubro-Negros|1935
BRC|BRS|Azuis|1983
VIJ|UNV|Lavradores|1916
OSS|OSB|Águias|1912
MIB|ASM|Marinheiros|1979
AVA|RSA|Corsários|1958
ALV|ALV|Amarelos|1986
AVE|ESA|Tubarões|1949
ACO|ACM|Corvos|1899
GGD|GDL|Faroleiros|1941
FER|FRR|Cabras|1941
NAP|NVL|Mineiros|1939
POF|POS|Corvos|1946
COC|UNC|Amarelos|1934
PRY|PRY|Lvy|1897
BUC|BUK|Zubry|1913
KOA|KOL|Metalurhy|1963
STC|STT|Chorni|1922
KRE|KRE|Sokoly|1902
AKC|AKD|Haidamaky|1976
HAA|HNY|Orly|1929
KAG|KAN|Sokoly|1951
PRB|PRK|Zhovti|1913
CHK|CHK|Syni|1938
KAH|KMY|Charivnyky|1934
NYZ|NYZ|Vovky|1927
POG|POK|Hirnyky|1935
POH|PON|Lvy|1975
AVD|AVS|Vovky|1962
CHL|CRN|Kozaky|1969
ZEA|TJP|Levy|1908
MLT|TJG|Červení|1914
RUA|TJS|Žltí|2008
KRA|MFS|Sokoly|1935
MST|SPD|Sokoly|1910
SLB|MVX|Červení|1983
DIN|JEN|Červení|1926
ZEB|ISC|Medvede|1959
ZER|LOO|Baníci|1918
MEA|STO|Orly|1937
MTU|ISK|Rytieri|1935
RAA|HUT|Železiari|1939
SLE|VET|Jeleni|1928
PEH|NKA|Železarji|1938
PAG|NBX|Rudarji|1919
NOV|NKS|Modri|1911
PAH|KOV|Orli|1928
NOE|ZLZ|Ribiči|1947
LIP|RDR|Medvedi|1955
SLO|SVA|Volkovi|1960
LOA|PAI|Rdeči|1926
HRA|NDZ|Sokoli|1989
SGA|SLO|Bikovi|1935
ZEO|LOZ|Sokolovi|1902
DOD|DOF|Bikovi|1919
DOE|LOD|Plavi|1928
ZEC|ZES|Vrane|1917
DOF|LKM|Rakete|1944
ZAB|ZAU|Rudari|1987
MAA24|KSM|Crveni|1972
LOV|LOT|Pivari|1961
TOE|TOV|Orlovi|1945
DMO|BLC|Pioniri|1945
DID|DNJ|Zeleni|1945
ZET|KFL|Të Bardhët|1897
MEC|LOM|Kalorësit|1901
ZAR|PAM|Skifterët|1933
MAB25|PAT|Shqiponjat|1906
HRY|SHV|Të Kuqit|1939
DIH|MIP|Të Kaltrit|1904
MIY|SQI|Skifterët|1943
MLS|DRI|Dhelprat|1916
RYB|KFG|Të Gjelbrit|1920
ZED|PTI|Të Gjelbrit|1961
VEB|NKV|Sokolovi|1938
SLD|SLV|Medvedi|1926
VEY|ZOV|Pioniri|1913
DIV|VED|Crveni|1899
SPF|SMX|Crveni|1943
HVA|HRA|Jeleni|1966
ZIT|ZNT|Rakete|1914
ZEE|ZEE|Zeleni|1945
HRH|HRF|Žuti|1928
LIV|LOV|Vitezovi|1984
MAC26|MEM|Vitezovi|1923
MAI|SAV|Baroni|1908
RAC|RPD|Bikovi|1932
ZEF|ZED|Pivari|1913
NVI|NOJ|Topionice|1939
MLP|MLS|Lavovi|1927
NOF|NVC|Zmajevi|1938
OST|AOO|Crveni|1955
NOL|KNX|Plavi|1926
DRA|DRA|Plavi|1934
HRC|MIN|Lavovete|1899
SLK|MNY|Metalurzite|1931
KRD|MIS|Metalurzite|1934
SCE|MEG|Chernite|1924
MEB|PFK|Sokolite|1933
DIB|HEB|Orlite|1921
DIZ|SET|Lavovete|1914
MEH|MOS|Orlite|1899
ZLA|SPS|Chervenite|1951
MLD|BAT|Vulcite|1960
POJ|MIG|Sokolite|1946
BEJ|KYE|Minyorite|1936
LUB|PZV|Minyorite|1974
SLZ|PAZ|Vulcite|1958
ASF|UUS|Rautamiehet|1920
STD|SIR|Keltaiset|1926
NEA|PYR|Siniset|1979
ASM|PYJ|Vihreät|1902
FRG|TRM|Karhut|1965
STG|SAJ|Punaiset|1972
LAQ|MIF|Ahmat|1910
MAD27|FFY|Sudet|1925
STJ|KEF|Kalastajat|1980
DYA|SEM|Siniset|1986
VED|TAO|Hirvet|1909
NEB|IFH|Metsurit|1925
SYA|HAH|Rauðir|1907
SOE|HAM|Grænir|1919
SYE|HOT|Birnir|1924
HOD|HTT|Hvítir|1930
HEA|GRI|Hafernir|1980
VBY|UMF|Hvítir|1897
LIL|STK|Úlfar|1923
NND|VII|Sjómenn|1990
HEK|ROS|Selir|1934
SOG|ROY|Rauðir|1986
NEC|HMR|Úlfar|1931
ALH|BOL|Ernir|1943
TSK|GUR|Lomebi|1911
SAW|TSK|Tsxenebi|1927
MTB|GUM|Mgelebi|1945
OCH|MZI|Arcivebi|1913
TSI|IBE|Lomebi|1980
OCA|IME|Yvitlebi|1970
WIA|TOK|Tsxenebi|1925
MTI|SMG|Mgelebi|1937
OCI|MEN|Arcivebi|1952
OZI|LOL|Tsitlebi|1961
BNE|BNE|Jackals|1926
MBI|MAN|Lions|1900
MAE28|MAE|Camels|1920
REH|REH|Yellows|1900
HAP|HAP|Reds|1899
BEM|BTR|Gazelles|1899
EIL|EIL|Knights|1943
HAB|HPL|Falcons|1909
MAF29|MAI|Tigers|1911
MNA|MCC|Hawks|1901
HEL|HAA|Hawks|1977
MAG30|MCA|Knights|1912
RER|REF|Reds|1989
HPE|HPO|Sabras|1929
ZVE|ZVE|Orly|1913
ARZ|ARZ|Krasnye|1928
TRU|TRU|Neftyaniki|1922
ZEV|ZEN|Kosmonavty|1938
KRY|KRY|Orly|1911
ZNA|ZNA|Shakhtyory|1991
LIK|LIP|Kazaki|1923
NIZ|NIZ|Sokoly|1927
SHC|SHK|Zubry|1901
ARF|AVA|Zheleznodorozhniki|1912
ZEG|ZEV|Zhuravli|1918
VER|VER|Zelenye|1950
LSK|LPG|Kozaki|1983
OLI|OLP|Gusary|1960
KIE|KIF|Kosmonavty|1942
VOL|VOL|Neftyaniki|1972
SPG|SPK|Zholtyya|1918
NAQ|NAF|Siniya|1916
GRD|GRZ|Zholtyya|1983
ORB|ORF|Siniya|1904
KAJ|KSL|Hrenadzery|1905
NAR|NAT|Rybaki|1933
SAX|SPP|Arly|1933
SPJ|SPF|Siniya|1969
VEE|VEZ|Konnitsa|1910
TOO|TRP|Vauki|1970
SSK|SLF|Zubry|1948
TRB|TRR|Miadzvedzi|1986
GAI|GAI|Royals|1918
GAE|GAA|Crusaders|1901
CLB|CLL|Sparrows|1918
BRD|BRI|Comets|1902
LED|LED|Dockers|2008
CHQ|CCH|Seahawks|1902
GRR|GRM|Royals|1947
ELM|ELM|Dragons|1901
BUX|BUX|Spartans|1981
LIC|TOD|Ironmen|1989
HEH|HEL|Skyhawks|1926
THJ|THR|Scarlets|1970
YES|YES|Rojos|1906
ALJ|ALG|Corsarios|1940
NUA|NUE|Halcones|1913
SAY|SLM|Águilas|1915
SDA|COI|Leñadores|1918
YEB|YEA|Venados|1930
LID|LIR|Gauchos|1926
VAS|VAE|Verdes|1929
MOC|MRL|Zorros|1925
ALK|JUU|Búhos|1900
ELB|ELH|Alcarraza|1936
ZAC|ZAO|Leones|1953
BAA24|BAK|Cruzados|1933
BAB25|BAX|Rojos|1935
COE|CRD|Rayos|1911
COG|COD|Lobos|1909
MNB|MBA|Cóndores|1923
COH|COE|Marineros|1907
ALM|JUA|Pastores|1906
BJO|BAJ|Osos|1916
ELD|ELB|Blancos|1951
BAC26|CBC|Leones|1942
MMA|MNA|Corsarios|1937
PID|PDA|Pastores|1986
FUD|SFC|Segadores|1936
ATA|JNT|Lagartos|1911
OLE|OLO|Toros|1931
ALN|ALM|Zorros|1922
NER|NER|Amarillos|1934
NUB|NUC|Azules|1908
OSA|OSM|Azules|1980
QUB|QUC|Pumas|1948
MOG|MOE|Águilas|1947
OLN|OLD|Tiburones|1938
BAD27|CBP|Tigres|1943
NEE|NRJ|Panteras|1952
VAH|JTU|Rojos|1926
BAE28|BIL|Halcones|1917
REE|SPW|Crocs|1908
STL|MRS|Lions|1929
FEN|MOL|Parrots|1992
REF|SPN|Streamertails|1928
YAB|SLD|Greens|1940
WOB|LNF|Hummingbirds|1924
HAC|CAV|Mongooses|1985
WOC|FUL|Lions|1923
CAV|MOY|Crocs|1958
EXW|PMT|Stingrays|1944
WCK|LFO|Reds|1982
SAZ|HMB|Reds|1985
SEE|SGV|Titanes|1926
SEH|JVN|Azules|1900
LIE|JUE|Amarillos|1910
LDA|LID|Verdes|1925
POK|PZL|Halcones|1917
PAJ|PAO|Gladiadores|1915
POM|POB|Pastores|1975
VIV|VIU|Rayos|1973
CAW|CRO|Amarillos|1973
BPO|RBP|Cóndores|2008
PLD|PLD|Zorros|1958
RIC|RIV|Lagartos|1958
YEC|YED|Potros|1938
YRO|JUY|Jaguares|1932
ALP|ALU|Rojos|1932
ALQ|ALR|Guerreros|1921
VAJ|RSV|Toros|1952
CAX|CLP|Mulas|1952
QUS|QNT|Rojos|1915
TAE28|RCS|Leñadores|1928
ARH|SAG|Tiburones|1979
QES|QUN|Alacranes|1932
LUD|LCL|Amarillos|1982
GAB|GDI|Pastores|1916
YAN|YAN|Tigers|1900
YAI|YAA|Leopards|1951
ESK|EKI|Falcons|1927
JIZ|JIZ|Reds|1924
ANG|ANG|Lions|1987
OLK|OLK|Leopards|1989
NEF|NEY|Camels|1913
NEI|NEF|Eagles|1943
NHI|NEC|Tigers|1988
AND|AND|Bulls|1917
TER|TEF|Eagles|1982
KHI|KHI|Wolves|1942
GRF|PAL|Navy|1933
HEX|RTS|Penguins|1957
CRE|PLY|Sky Blues|1979
FIA|FOX|Weka|1939
LYM|WHA|Blues|1936
ROS|PLB|Kiwis|1966
SUD|TST|Kauri|1913
ELR|INV|Stags|1937
GAT|TBR|Penguins|1919
HTH|ROO|Mariners|1924
ALR|ZAR|Dunes|1908
AAL|WRD|Gazelles|1931
ALW|DHI|Knights|1905
AGH|AIM|Reds|1919
AWA|UMM|Gazelles|1913
ALU|GHA|Caravans|1964
ALX|MAJ|Knights|1947
ALY|SOI|Camels|1961
ARJ|SHM|Lions|1914
ULA|DAH|Sandstorm|1920
ALZ|AWH|Blues|1929
ZUL|QRH|Reds|1984
ALA24|UMD|Hawks|1922
ALB25|KHS|Greens|1970
SIG|NRM|Rohelised|1932
SIE|NOV|Metsamehed|1921
KUA|MEO|Sinised|1976
TUK|FCI|Punased|1925
ANY|KUN|Punased|1919
VAK|DUT|Karud|1950
JAU|KAV|Kaluriid|1931
PLU|NOP|Rohelised|1940
ANA|TMP|Kotkad|1930
RAK|JKR|Hundid|1924
ALC26|VAV|Zvejnieki|1936
ALD27|VAJ|Lāči|1991
SIF|ELK|Alņi|1921
NAT|SLN|Ērgļi|1983
LIF|GAJ|Vanagi|1918
SIH|SKS|Zilie|1914
SLC|RUJ|Jūrnieki|1961
VEF|JEK|Vilki|1959
SPM|DOB|Gulbji|1984
RAE|ZIB|Bordo|1941
ALE28|GRN|Ereliai|1929
HAG|PAF|Žalieji|1927
REZ|SKA|Lokiai|1913
TUA|GRS|Vilkai|1915
AAA|SEN|Raudonieji|2008
HAU|KOS|Mėlynieji|1980
HVB|ASR|Šernai|1986
KUB|GNI|Gandrai|1923
JEL|ROK|Vilkai|1917
ALF29|UTI|Žirgai|1949
WIB|LOR|Artsivner|1975
RUS|GAD|Dashtner|1904
WIK|GVV|Sarer|2008
OCB|SGX|Aryutsner|1914
GOA|GOF|Aryutsner|1975
WTB|LOI|Dashtner|1926
LOC|LON|Gaylner|1937
OZE|URA|Sarer|2008
SAA24|ART|Artsivner|1939
KUT|ARF|Gaylner|1974
ESD|LOK|Qartallar|1911
BUY|QUB|Aslanlar|1899
BUE|SAQ|Neftçilər|2001
DUA|GNX|Qırmızılar|1969
BOL|QBX|Canavarlar|1947
DEA|YUX|Pələnglər|1945
ESR|PFA|Atlılar|1978
YED|TUK|Şahinlər|1909
KUC|GOY|Şahinlər|1939
SUL|PFZ|Canavarlar|1935
FAR|ZHA|Shakhterlar|1970
FAD|ESI|Burkitter|1907
NEG|SKX|Arystandar|1960
BIK|MUK|Zholbarystar|1938
BEP|ZHE|Kulandar|1949
NEH|YSL|Zholbarystar|1977
NUK|ULY|Burkitter|1941
YAC|SEU|Sarylar|1903
TAF29|BYZ|Munaishylar|1981
CHW|ZHU|Kaskyrlar|1925
QAR|BTY|Munaishylar|1934
NHA|BYS|Kyzyldar|1926
JAS|CEO|Șoimii|2000
MIC|SPM|Lupii|1913
MAH31|SNC|Pescarii|1940
PAQ|DAC|Minerii|2006
RUB|LOC|Vulturii|1975
TOF|UNF|Verzii|1968
ZEH|SRA|Minerii|1920
BRE|SPU|Zimbrii|1957
STM|LKO|Șoimii|1986
TAG30|SUL|Leii|1937
PLE|FER|Ujqërit|1927
KRB|SIP|Kalorësit|2008
DIC|BSA|Kalorësit|1908
DIF|NAP|Minatorët|1926
SLF|PTN|Të Verdhët|1974
SLG|YLL|Shqiponjat|1961
BOM|KFP|Luanët|1920
RUR|NAI|Shqiponjat|1913
PAV|KOD|Dhelprat|1937
DOH|DRP|Skifterët|1924
BUH|BUG|Adler|1910
ENA|ENG|Dragoner|1914
AIA|ALI|Blauen|1925
KIF|FKX|Adler|1929
HEI|HEI|Rothirsche|1979
TUS|TUS|Wikinger|1982
HAH|HNS|Stiere|1918
BAF29|SBH|Gladiatoren|1931
FUF|FUT|Blauen|1960
GRG|GRF|Kumpel|1927
ALG30|AJL|Sandstorm|1919
JUA|AJA|Camels|1929
ABB|MHY|Caravans|1915
RAF|UMA|Divers|1915
AUA|MDH|Reds|1961
AAI|RUA|Tigers|1980
ALH31|NZY|Falcons|1987
ASH|WSC|Knights|1973
ASG|IBR|Eagles|1974
ALJ32|WSS|Gazelles|1946
BIS|SAX|Tigers|1984
ALK33|JAA|Divers|1900
ALL34|LWR|Reds|1901
ALM35|BHY|Greens|1925
ALN36|SLY|Hawks|1955
ARL|WMC|Palms|1914
BUL|SHC|Falcons|1966
UMA|AAR|Yellows|1945
AJE|WLS|Knights|1958
AWB|FJR|Greens|1924
ALP37|AIZ|Oryx|1922
ALQ38|FLY|Sandstorm|1934
RAG|WAJ|Knights|1946
RIS|FAA|Hawks|1963
RAH|SSX|Falcons|1982
ALR39|UMN|Desert Foxes|1962
ALS40|WJS|Blues|1971
ATB|HIL|Horsemen|1918
QAS|SIX|Blues|1980
ATU|HLN|Tigers|1961
ALT41|AMS|Knights|1919
ALU42|MAF|Palms|1899
AAB|DIC|Greens|1932
RAJ|FAS|Camels|1953
ALV43|UMR|Blues|1987
ALW44|UFC|Reds|1937
RAL|AJI|Sandstorm|1970
WAC|SIY|Camels|1933
AYA|QRY|Stallions|1923
JEB|KEA|Reds|1986
HOE|SHG|Ibex|1978
VIP|BLO|Snow Leopards|1993
HOM|SHE|Greens|1972
DAD|STU|Lions|1977
AUR|MND|Reds|1951
AAM|MRD|Shaheens|1939
KOB|MIM|Markhors|1966
BEQ|SSG|Markhors|1930
BHC|AFG|Cheetahs|1988
VIQ|DSK|Shaheens|1968
NAX|UTT|Kings|1995
NEJ|DIN|Titans|1901
VAM|UTP|Elephants|1930
SAB25|NOT|Kingfishers|1926
MOJ|PRB|Elephants|1934
CHX|BGN|Reds|1945
KOC|SYL|Sky Blues|1949
JOD|SIF|Dolphins|1941
GUR|BRC|Cobras|1912
BHD|NOK|Leopards|1969
BUN|ISO|Lions|1984
BUM|MOW|Eagles|1928
BUP|MNL|Hippos|1930
WEA|MPM|Buffaloes|1964
WEL|MPI|Buffaloes|1942
BOP|ISM|Hippos|1976
WAH|CHD|Pythons|1932
WIN|MWU|Lions|1936
RYA|POM|Arrows|1924
WIF|MWW|Warriors|1937
SHG|MAL|Crocs|1910
HOG|MRN|Whites|1901
SHN|MSD|Elephants|1926
CHY|PLU|Whites|1983
DAE|POT|Yellows|1927
HOJ|MOM|Yellows|1924
SEJ|BIF|Rhinos|1964
LAR|HWA|Lions|1980
DRE|TSA|Chiefs|1971
SHH|RUB|Hippos|1972
CAY|OYA|Tembo|1913
CAZ|OYP|Duma|1928
SPN|NYP|Yellows|1940
BEV|LAE|Nyati|2002
LIG|NAY|Greens|1913
NOG|NYR|Chui|1982
WOE|GAT|Simba|1966
SCC|KIE|Mamba|1927
DUB|MBH|Twiga|1927
FAM|POG|Blues|1952
HAJ|BUF|Leopards|2002
FOC|WAK|Yellows|1928
MAJ32|WAP|Hornbills|1904
LEW|NAK|Cranes|1920
WAE|WAF|Pythons|2008
FLI|SSA|Hippos|1984
BRH|BGB|Reds|1912
SAC26|KAP|Kobs|1941
PAW|MUB|Buffaloes|1920
BRJ|BUH|Greens|1940
MAK33|ALL|Yellows|1905
WAY|UAM|Zebras|1930
BPE|LEK|Lions|1930
MAL34|MEK|Walyas|1974
WEF|NEK|Geladas|1980
CHZ|ADH|Yellows|1942
DEB|LES|Falcons|1944
WEN|JIM|Leopards|1944
WEY|ETJ|Reds|1982
BAG30|AKE|Hyenas|1968
BAH31|BNB|Bleus|1990
DAF|DLR|Faucons|2008
DAG|DAE|Hippopotames|1954
BOQ|BBK|Aigles|1929
KAK|KYD|Pythons|1956
YOA|UYX|Éléphants|1984
BAJ32|USC|Rouges|1933
NOH|NOS|Buffles|1919
DIG|DIU|Léopards|1963
DAH|UDX|Verts|1920
PON|UNA|Verdes|1940
POP|PTO|Amarelos|1907
PAX|PVL|Pretos|1958
POQ|POF|Azuis|1934
OVA|OVA|Corsários|1934
VIU|VLR|Amarelos|1915
DES|DES|Pioneiros|1964
TOG|EPO|Verdes|1981
TOH|TOF|Tubarões|1935
ACB|ACE|Pescadores|1939
BEW|BEV|Titanes|1935
BEZ|BEB|Segadores|1903
ROE|JVE|Azules|1933
COJ|CDA|Rojos|1907
BAK33|DBR|Rojos|1952
CAA24|CAP|Mulas|1948
PAZ|PLO|Gladiadores|1954
ONA|ONT|Caudillos|1955
SAD27|SMI|Rojos|1967
FUG|ESD|Gladiadores|1926
HID|HNJ|Jaguares|1934
SDB|PND|Marineros|1978
CEC|CEU|Blancos|1904
POU|PLM|Jaguares|1902
LUE|LUM|Gladiadores|1936
ALX45|ALF|Mineros|1975
ORC|ONA|Tiburones|1987
CEO|CRR|Jaguares|1953
LER|SAW|Pastores|1932
FRJ|FRG|Leñadores|1941
CTA|CTA|Rojos|1930
ESF|ECA|Zorros|1982
MOK|MOC|Azules|1975
PEJ|PNA|Caudillos|1964
WIL|LOP|Panthers|1986
DAV|GAL|Reds|1944
HAM|CLU|Blues|1963
CHA24|PLC|Cocricos|1941
MEF|RIA|Blues|1946
CHB25|RII|Ocelots|2008
PAA24|PNR|Steelmen|1948
TIB|SIC|Scarlet Ibis|1977
HEB|TNN|Reds|1966
HAW|CUC|Hummingbirds|1922`
      .split('\n')
      .map((l) => l.split('|'))
      .map(([code, abbr, nick, founded]) => [code, [abbr, nick, founded ? +founded : null]]),
  );

  FM.D.RIVALS.push(
    ['BAN', 'TAJ', 'Telim–Temgap Derby'],
    ['BUK', 'TAN', 'Pelita Baru–Nilam Utama Derby'],
    ['BIN', 'THE', 'Ninh Nai Derby'],
    ['BUF', 'THE', 'Ninh Nai Derby'],
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

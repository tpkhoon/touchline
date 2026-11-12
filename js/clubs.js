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
    ['Aberwyn Borough', 'LIT', 'Aberwyn', '#EE2737', '#FFFFFF', 'fan', 58, 'Stadiwm Aberwyn', 32050],
    ['Haspool United', 'HAS', 'Haspool', '#E11B22', '#FFFFFF', 'historic', 57, 'Wendon Lane', 34742],
    ['Everwich Rangers', 'EVR', 'Everwich', '#0000FF', '#FFFFFF', 'oil', 57, 'Herbrook Lane', 29409],
    ['Yardale Rangers', 'YAR', 'Yardale', '#122F67', '#FFFFFF', 'historic', 56, 'Wickingham Park', 26850],
    ['Tuthurst Rovers', 'TUT', 'Tuthurst', '#FFF200', '#00A650', 'youth', 56, 'Ketwick Lane', 27359],
    ['Langley United', 'LAU', 'Langley', '#6CABDD', '#FFFFFF', 'fan', 55, 'Torbridge Field', 32609],
    ['Reystow Harriers', 'REY', 'Reystow', '#FBEE23', '#ED2127', 'selling', 55, 'Wynmere Road', 22200],
    ['Neatgwyn Wanderers', 'CHI', 'Neatgwyn', '#D6001C', '#FFFFFF', 'oil', 54, 'Neatgwyn Park', 12600],
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
    ['Arrasti Kirol Elkartea', 'ARK', 'Arrasti', '#004F9F', '#A6192E', 'youth', 57, 'Aldapa Zelaia', 8164],
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
    ['Rhydydd Rovers', 'CAE', 'Rhydydd', '#0B4EA2', '#FFFFFF', 'fan', 45, 'Rhydydd Ground', 10841],
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
    ['Atlético Albal', 'MRB', 'Albal', '#FFFFFF', '#00843D', 'historic', 53, 'Estadio Municipal de Albal', 22222],
    ['Club Pedera', 'PED', 'Pedera', '#FFE400', '#0045A7', 'fan', 53, 'Campo de Pedera', 20724],
    ['Sorar CF', 'SOR', 'Sorar', '#FFFFFF', '#05642C', 'fan', 58, 'Campo de Sorar', 31388],
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
    ['AS Cassbourg', 'ESB', 'Cassbourg', '#CE1126', '#000000', 'oil', 70, 'Stade de la Vilault', 36178],
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
    ['Moldy City', 'MIA', 'Moldy', '#0033A0', '#FFFFFF', 'historic', 39, 'Machogg Road', 11582],
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
    ['Unión Rondiel', 'RON', 'Rondiel', '#FFFFFF', '#0046AD', 'fallen', 46, 'Estadio Oñatena', 22824],
    ['Deportivo Olmador B', 'OLB', 'Olmador', '#FFFFFF', '#FEBE10', 'youth', 45, 'Estadio La Salamosa', 6000, 'OLM'],
    ['Cervar CF B', 'CEB', 'Cervar', '#A50044', '#004D98', 'youth', 44, 'Estadio Alcaliel', 6000, 'CER'],
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
    ['Real Cuenero B', 'CUB', 'Cuenero', '#EE2523', '#FFFFFF', 'youth', 42, 'Campo de Cuenero', 3250, 'CUE'],
    ['Olmador CF B', 'OLA', 'Olmador', '#CB3524', '#272E61', 'youth', 42, 'Estadio Zafrilla', 2800, 'OLC'],
    ['Deportivo Plasares B', 'PLB', 'Plasares', '#FFE667', '#005187', 'youth', 42, 'Estadio Marbedo', 5000, 'PLA'],
    ['Unión Navejo', 'NAU', 'Navejo', '#C8102E', '#FFFFFF', 'fallen', 42, 'Estadio La Ribón', 31179],
    ['Deportivo Sepúlval', 'SEP', 'Sepúlval', '#003DA5', '#FFFFFF', 'fan', 41, 'Estadio La Medero', 8400],
    ['Torrilla Balompié', 'TOB', 'Torrilla', '#C8102E', '#000000', 'historic', 41, 'Ciudad Deportiva Torrilla', 14591],
    ['Alcaledo Balompié B', 'ALA', 'Alcaledo', '#FFFFFF', '#D81E05', 'youth', 40, 'Estadio La Hinojanes', 7000, 'ALB'],
    ['Deportivo Montara B', 'MTA', 'Montara', '#8AC3EE', '#FFFFFF', 'youth', 40, 'Estadio Moralal', 4500, 'MOD'],
    ['CD Castador', 'CAC', 'Castador', '#0033A0', '#FFFFFF', 'fallen', 40, 'Nuevo Estadio Castador', 30000],
    ['Atlético Elchanes', 'ELC', 'Elchanes', '#0057B8', '#FFFFFF', 'oil', 40, 'Estadio Gandejo', 4500],
    ['Deportivo Alcaledo B', 'ALL', 'Alcaledo', '#0BB363', '#FFFFFF', 'youth', 39, 'Estadio Olmosa', 3000, 'ALC'],
    ['Juventud Fresnero', 'JVN', 'Fresnero', '#FFD700', '#003DA5', 'fan', 39, 'Estadio Rondino', 5100],
    ['Club Osuneda', 'OSC', 'Osuneda', '#E2001A', '#FFFFFF', 'fan', 38, 'Estadio La Benero', 7840],
    ['Atlético Pozares', 'POZ', 'Pozares', '#FFFFFF', '#E2001A', 'fan', 37, 'Ciudad Deportiva Pozares', 7813],
    ['Sporting Moralete', 'MOS', 'Moralete', '#000000', '#FFFFFF', 'fan', 37, 'Estadio Municipal de Moralete', 4000],
    ['Nueva Peñino Sporting Club', 'NUE', 'Peñino', '#C8102E', '#FFFFFF', 'fan', 37, 'Estadio Lermete', 7100],
    ['Real Poziel', 'RPP', 'Poziel', '#FFD100', '#0057B8', 'fan', 36, 'Poziel Stadium', 4500],
    ['Atlético Quintana', 'ATQ', 'Quintana', '#000000', '#FFD100', 'fan', 36, 'Quintana Stadium', 3000],
    ['Racing Úbedanes', 'RUL', 'Úbedanes', '#00843D', '#FFFFFF', 'fan', 36, 'Campo de La Cabrino', 7000],
    ['Unión Luceda', 'UNL', 'Luceda', '#00843D', '#0057B8', 'selling', 36, 'Estadio La Marbares', 5100],
    ['Unión Valdón', 'UNV', 'Valdón', '#000000', '#FFD100', 'selling', 36, 'Valdón Stadium', 3000],
    ['Club Pozeda', 'CPA', 'Pozeda', '#0057B8', '#FFD100', 'selling', 36, 'Pozeda Stadium', 2800],
    ['Moraliel Balompié', 'MBL', 'Moraliel', '#FFD100', '#FFFFFF', 'fan', 36, 'Campo de Torrar', 4500],
    ['Atlético Zamino', 'ATZ', 'Zamino', '#FFD100', '#00843D', 'fan', 36, 'Zamino Stadium', 5100],
    ['Juventud Pedejo', 'JPP', 'Pedejo', '#0057B8', '#000000', 'fan', 36, 'Estadio La Almaziel', 6000],
    ['Racing Elchana', 'REU', 'Elchana', '#0057B8', '#000000', 'fan', 36, 'Ciudad Deportiva Elchana', 2800],
    [
      'Juventud Calatero de Abajo',
      'JCD',
      'Calatero de Abajo',
      '#FFD100',
      '#FFFFFF',
      'fan',
      36,
      'Calatero de Abajo Stadium',
      4000,
    ],
    [
      'Atlético Gandejo del Valle',
      'ATF',
      'Gandejo del Valle',
      '#FFD100',
      '#00843D',
      'fan',
      36,
      'Campo de Tarifanes',
      5100,
    ],
    [
      'CD Peñal de Arriba',
      'CPB',
      'Peñal de Arriba',
      '#0057B8',
      '#E30613',
      'selling',
      36,
      'Peñal de Arriba Stadium',
      5000,
    ],
    ['Deportivo Rondón', 'DRN', 'Rondón', '#00843D', '#000000', 'fan', 36, 'Rondón Stadium', 3000],
    ['UD Albosa', 'UAA', 'Albosa', '#FFD100', '#E30613', 'selling', 36, 'Albosa Stadium', 6000],
    ['Fragero CF', 'FCC', 'Fragero', '#0057B8', '#FFFFFF', 'fan', 36, 'Estadio Benilla', 5100],
    ['Unión Campo Almazón', 'UNK', 'Campo Almazón', '#000000', '#00843D', 'fan', 36, 'Estadio La Gandena', 4500],
    ['Real Roblino', 'RRR', 'Roblino', '#0057B8', '#000000', 'fan', 36, 'Roblino Stadium', 6000],
    ['Atlético Arroosa', 'ATJ', 'Arroosa', '#0057B8', '#FFFFFF', 'fan', 36, 'Campo de Escalal', 5000],
    ['Real Lucosa', 'RLC', 'Lucosa', '#FFD100', '#0057B8', 'fan', 36, 'Lucosa Stadium', 4500],
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
    ['Atlético General Toria', 'ATG', 'General Toria', '#000000', '#FFFFFF', 'fan', 53, 'Estadio Busteda', 20000],
    ['Independiente Toro', 'ITE', 'Toro', '#0057B8', '#FFFFFF', 'fan', 53, 'Estadio Monumental Escui', 28530],
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
    ['East Belton United', 'LAK', 'East Belton', '#80000A', '#A19060', 'fan', 61, 'Granton Park', 42500],
    ['Fort Summiton Revolution', 'FRT', 'Fort Summiton', '#FFFFFF', '#BA0C2F', 'oil', 60, 'Canyonburg Field', 25000],
    ['Fortview Foundry United', 'FOF', 'Fortview', '#ECE83A', '#1F1646', 'fan', 60, 'Eagleview Field', 30000],
    ['Springridge SC', 'SPR', 'Springridge', '#633492', '#FDE192', 'fan', 60, 'Whitefalls Field', 25500],
    ['Hamfield Northern', 'EAG', 'Hamfield', '#FFFFFF', '#00245E', 'youth', 60, 'Hamfield Stadium', 22120],
    ['Bluehills City FC', 'BLU', 'Bluehills', '#00482B', '#D69A00', 'fan', 59, 'Bluehills Stadium', 25218],
    ['Hickoryridge Stallions', 'HIC', 'Hickoryridge', '#585958', '#8CD2F4', 'fan', 58, 'Aspenhaven Field', 19400],
    ['Cedarville FC', 'CED', 'Cedarville', '#1B1F23', '#6E4C9F', 'oil', 58, 'Bayfalls Field', 35000],
    ['Bearville FC', 'BEA', 'Bearville', '#B30838', '#013A81', 'youth', 58, 'Bearville Stadium', 20213],
    ['Pineridge Express', 'PIN', 'Pineridge', '#E81F3E', '#2A4076', 'youth', 58, 'Cedardale Field', 20500],
    ['Granbridge Northern', 'WHI', 'Granbridge', '#1A85C8', '#000000', 'fan', 57, 'Lakfield Centre', 38000],
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
    ['KFC Sneekvoort', 'KFC', 'Sneekvoort', '#4B2C85', '#FFFFFF', 'giant', 65, 'Stade Communal de Sneekvoort'],
    ['Standard Sneekvoort', 'STS', 'Sneekvoort', '#FFDD00', '#0033A0', 'selling', 64, 'Stade Laagburg'],
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
    [
      'Royal Union Sint Veenhorst',
      'RUQ',
      'Sint Veenhorst',
      '#E30613',
      '#000000',
      'fan',
      50,
      'Sint Veenhorst Stadium',
      undefined,
    ],
    ['KV Groot Dijkerk', 'KGD', 'Groot Dijkerk', '#0057B8', '#00843D', 'fan', 50, 'Groot Dijkerk Stadium', undefined],
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
    ['Otabay United', 'MOB', 'Otabay', '#FFDD00', '#0B1F4B', 'youth', 52, 'Otabay Stadium'],
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
    ['Blenfield Rovers', 'NOW', 'Blenfield', '#E30613', '#FFFFFF', 'fan', 50, 'Blenfield Stadium'],
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
    ['Castle Rodwell United', 'COU', 'Castle Rodwell', '#E30613', '#000000', 'fan', 47, 'Pensea Green'],
    ['Newree Gaels', 'NEW', 'Lisbridge', '#E30613', '#FFFFFF', 'fan', 47, 'Rosglass Street'],
    ['Port Carrickree Gaels', 'POC', 'Port Carrickree', '#003DA5', '#FFFFFF', 'fan', 44, 'Limdara Road'],
    ['Athgarvan Bohs', 'ATH', 'Athgarvan', '#8A1538', '#FFFFFF', 'fan', 43, 'Athgarvan Lawn'],
    ['Sligtown Celtic', 'SLI', 'Sligtown', '#E30613', '#FFFFFF', 'fan', 43, 'Sligtown Showgrounds'],
    ['Newlough Wanderers', 'NWL', 'Newlough', '#003DA5', '#FFFFFF', 'fan', 42, 'Newlough Lawn'],
    ['Castle Kilough Bohs', 'CAK', 'Castle Kilough', '#FFFFFF', '#000000', 'fallen', 44, 'Castle Kilough Park'],
  ];
  FM.D.CLUBS_WA1 = [
    ['Oxstead Borough', 'TAL', 'Oxstead', '#00843D', '#FFFFFF', 'oil', 49, 'Oxstead Ground'],
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
    ['Shintoygawa Cometa', 'KAM', 'Shintoygawa', '#F26522', '#0033A0', 'fan', 38, 'Haruyama Arena', 3500],
    ['Lorlang United', 'TMN', 'Lorlang', '#ED1C24', '#FFFFFF', 'historic', 37, 'Kamlang Hub', 2700],
    ['Pulgap Police', 'TES', 'Pulgap', '#1F3A93', '#FFFFFF', 'fan', 36, 'Marlang Stadium', 4000],
    ['Pulgap Athletic', 'LTS', 'Pulgap', '#F26522', '#000000', 'fan', 35, 'Hourang Hub', 4300],
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
    ['Delima Jaya Athletic', 'SIT', 'Delima Jaya', '#E30613', '#FFD100', 'fan', 45, 'Bayu Sari Arena', 45000],
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
    ['Al Nour', 'ANN', 'Luxat', '#0057B8', '#000000', 'fan', 40, 'Luxat Stadium', 18000],
    ['Al Zahra', 'AZZ', 'Minat', '#E30613', '#0057B8', 'fan', 40, 'Benta Arena', 14000],
    ['Al Mahag', 'AMM', 'Mahag', '#FFD100', '#E30613', 'fan', 40, 'Aswan Arena', 10000],
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
    ['EO Zarsa', 'EZZ', 'Zarsa', '#FFFFFF', '#0057B8', 'fan', 38, 'Zarsa Stadium', 6000],
    ['EO Monine', 'EMM', 'Monine', '#000000', '#E30613', 'fan', 38, 'Stade de Radine', 6000],
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
    ['Namju Athletic', 'NAA1', 'Namju', '#0057B8', '#000000', 'fan', 41, 'Seosan Civic Stadium', 6000],
    ['Gangseong Citizen', 'GCC', 'Gangseong', '#000000', '#FFD100', 'fan', 41, 'Daeri Sports Complex', 16000],
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
    ['Phukaeo Athletic', 'PAA25', 'Phukaeo', '#0057B8', '#FFFFFF', 'fan', 36, 'Phukaeo Stadium', 7000],
    ['Muang Banpur United', 'MBH', 'Banpur', '#FFD100', '#00843D', 'fan', 36, 'Maesai Sports Park', 5000],
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
    ['Stade de Korouo', 'SDK', 'Korouo', '#0057B8', '#00843D', 'fan', 38, 'Stade de la Paix Sedké', 3000],
    ['Stade de Thira', 'SDT', 'Thira', '#E30613', '#0057B8', 'fan', 37, 'Thira Stadium', 8000],
    ['Union Kora', 'UKA', 'Kora', '#FFFFFF', '#00843D', 'selling', 36, 'Stade Louoro', 5000],
    ['Académie Manès', 'AMG', 'Manès', '#E30613', '#00843D', 'fan', 34, 'Manès Stadium', 3000],
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
    ['Kukam Lions', 'KLL', 'Kukam', '#000000', '#FFD100', 'fan', 35, 'Berora Sports Stadium', 5000],
    ['Real Dunkam', 'RDA', 'Dunkam', '#FFD100', '#E30613', 'selling', 35, 'Sekora Sports Stadium', 3000],
    ['Dunumu FC', 'DFF', 'Dunumu', '#0057B8', '#000000', 'fan', 35, 'Dunumu Stadium', 5000],
    ['Adho United', 'AUU', 'Adho', '#FFD100', '#0057B8', 'fan', 35, 'Homale Park', 5000],
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
    ['Académie Dakack', 'AMH', 'Dakack', '#000000', '#E30613', 'fan', 35, 'Dakack Stadium', 8000],
    ['Racing Loura', 'RLB', 'Loura', '#0057B8', '#00843D', 'selling', 34, 'Stade Yamdougou', 5000],
    ['Stade de Sedma', 'SDS', 'Sedma', '#000000', '#FFFFFF', 'fan', 34, 'Sedma Stadium', 8000],
    ['AS Tambès Mimosas', 'ATS', 'Tambès', '#00843D', '#000000', 'fan', 34, 'Stade Dabssou', 5000],
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
    ['FC Bobngo', 'FBA', 'Bobngo', '#000000', '#00843D', 'fan', 35, 'Bobngo Stadium', 7000],
    ['US Nzéngo', 'UNN', 'Nzéngo', '#0057B8', '#E30613', 'fan', 35, 'Nzéngo Stadium', 8000],
    ['Dalko Académie', 'DAA1', 'Dalko', '#000000', '#E30613', 'fan', 34, 'Complexe Sportif de Sastou', 5000],
    ['US Bokro', 'UBF', 'Bokro', '#00843D', '#FFFFFF', 'fan', 34, 'Bokro Stadium', 8000],
    ['Nzéko Académie', 'NKA', 'Nzéko', '#FFD100', '#00843D', 'selling', 33, 'Stade Municipal de Sasgou', 3000],
    ['Étoile de Kinmbé', 'ETD', 'Kinmbé', '#FFFFFF', '#0057B8', 'fan', 33, 'Stade Labdougou', 8000],
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
    ['Bandala FC', 'BFF', 'Bandala', '#E30613', '#0057B8', 'selling', 36, 'Bandala Stadium', 8000],
    ['Racing Lubngo', 'RLA', 'Lubngo', '#000000', '#FFFFFF', 'selling', 34, 'Complexe Sportif de Sasko', 5000],
    ['AS Sikngo', 'ASS', 'Sikngo', '#E30613', '#000000', 'fan', 34, 'Stade Dalré', 8000],
    ['US Kaymbo', 'UKK', 'Kaymbo', '#0057B8', '#FFFFFF', 'selling', 34, 'Stade Tamtou', 8000],
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
    ['US Mbudougou', 'UMC', 'Mbudougou', '#00843D', '#FFFFFF', 'fan', 33, 'Stade Municipal de Fouya', 5000],
    ['AS Gaokro', 'AGA', 'Gaokro', '#FFFFFF', '#00843D', 'fan', 33, 'Stade Lubdougou', 5000],
    ['Toumbé Académie', 'TAA25', 'Toumbé', '#00843D', '#E30613', 'fan', 33, 'Stade Kordougou', 5000],
    ['Étoile de Matmbé', 'ETA', 'Matmbé', '#000000', '#FFD100', 'selling', 33, 'Stade Sasmbé', 5000],
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
    ['Nouveau Banmbo FC', 'NBF', 'Nouveau Banmbo', '#FFD100', '#00843D', 'fan', 33, 'Stade Dalmbé', 5000],
    ['US Mbudala', 'UMD', 'Mbudala', '#00843D', '#FFD100', 'fan', 32, 'Mbudala Stadium', 5000],
    ['FC Matko', 'FMM', 'Matko', '#0057B8', '#FFD100', 'selling', 32, 'Matko Stadium', 5000],
    ['FC Fousso', 'FFF', 'Fousso', '#FFD100', '#E30613', 'fan', 32, 'Complexe Sportif de Labndé', 5000],
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
    ['Union Petit Gaombo', 'UPG', 'Petit Gaombo', '#E30613', '#FFFFFF', 'fan', 32, 'Complexe Sportif de Gaoré', 5000],
    ['Boksso FC', 'BFA', 'Boksso', '#E30613', '#FFFFFF', 'fan', 32, 'Boksso Stadium', 5000],
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
    ['Naval Amarura', 'NAB1', 'Amarura', '#000000', '#FFD100', 'fan', 33, 'Estádio Moncorada', 5000],
    ['Os Belenenses de Paivura', 'OBD', 'Paivura', '#00843D', '#E30613', 'fan', 33, 'Paivura Stadium', 5000],
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
    ['Estrão EC', 'EOE', 'Estrão', '#000000', '#FFD100', 'fan', 34, 'Estrão Stadium', 8000],
    ['Sporting Ferrais', 'SFF', 'Ferrais', '#FFFFFF', '#0057B8', 'selling', 34, 'Ferrais Stadium', 10000],
    ['Atlético Clube Ovareiro', 'ATE', 'Ovareiro', '#000000', '#E30613', 'fan', 33, 'Ovareiro Stadium', 5000],
    ['GD Alcobura', 'GAK', 'Alcobura', '#00843D', '#E30613', 'fan', 33, 'Alcobura Stadium', 10000],
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
    ['MFK Liptovice', 'MLL', 'Liptovice', '#FFD100', '#FFFFFF', 'fan', 32, 'Stadion Mir Velec', 5000],
    ['Slavia Nova Slaovo', 'SNS', 'Nova Slaovo', '#FFD100', '#00843D', 'fan', 32, 'Nova Slaovo Stadium', 4000],
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
    ['Rodopa Lovgrad', 'RLL', 'Lovgrad', '#0057B8', '#00843D', 'fan', 35, 'Lovgrad Stadium', 7000],
    ['Chavdar Blovo', 'CBF', 'Blovo', '#000000', '#0057B8', 'selling', 34, 'Blovo Stadium', 5000],
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
    ['FK Pinava', 'FPP', 'Pinava', '#000000', '#0057B8', 'fan', 34, 'Pinava Stadium', 5000],
    ['Dnepr Zhodensk', 'DZZ', 'Zhodensk', '#FFD100', '#E30613', 'fan', 34, 'Stadyen Dzyshchyna', 4000],
    ['FC Babensk', 'FBB', 'Babensk', '#000000', '#0057B8', 'fan', 33, 'Chasilovichy Arena', 5000],
    ['Isloch Dzyets', 'IDD', 'Dzyets', '#0057B8', '#000000', 'fan', 33, 'Dzyets Stadium', 3000],
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
    ['Castejo Balompié', 'CBE', 'Castejo', '#0057B8', '#000000', 'fan', 35, 'Estadio Santa Benavares', 30000],
    ['Unión Fragino', 'UNF', 'Fragino', '#0057B8', '#E30613', 'fan', 33, 'Fragino Stadium', 10000],
    ['UD Salamero', 'USJ', 'Salamero', '#00843D', '#FFD100', 'fan', 33, 'Salamero Stadium', 32000],
    [
      'Club Valdemanes del Valle',
      'CVD',
      'Valdemanes del Valle',
      '#FFD100',
      '#000000',
      'fan',
      33,
      'Valdemanes del Valle Stadium',
      22000,
    ],
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
    ['Lindale Boys Town', 'LBT', 'Lindale', '#FFFFFF', '#FFD100', 'fan', 34, 'Lindale Stadium', 5000],
    ['Oraley Lions', 'OLT', 'Oraley', '#E30613', '#FFD100', 'selling', 31, 'Oraley Stadium', 3000],
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
    ['FK Olmara', 'FOM', 'Olmara', '#000000', '#E30613', 'selling', 36, 'Olmara Stadium', 8000],
    ['FK Qarbad', 'FQQ', 'Qarbad', '#FFFFFF', '#0057B8', 'fan', 35, 'Kokgan Stadium', 10000],
    ['Qarok FK', 'QFF', 'Qarok', '#FFD100', '#E30613', 'fan', 34, 'Qarok Stadium', 10000],
    ['Sport Club Eski Bekez', 'SCG', 'Eski Bekez', '#FFFFFF', '#0057B8', 'fan', 34, 'Eski Bekez Stadium', 10000],
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
    ['Al Zarib SC', 'AZS', 'Zarib', '#00843D', '#FFFFFF', 'fan', 36, 'Zarib Stadium', 15000],
    ['Al Nahda', 'ANH', 'Khasah', '#0057B8', '#FFD100', 'fan', 35, 'Khasah Stadium', 15000],
    ['Dahiq SC', 'DSS', 'Dahiq', '#0057B8', '#FFFFFF', 'fan', 35, 'Prince Jerya Stadium', 10000],
    ['Shabab Mafan', 'SMC', 'Mafan', '#FFFFFF', '#FFD100', 'fan', 35, 'Barya Stadium', 10000],
    ['Shabab Bahah', 'SBG', 'Bahah', '#00843D', '#FFFFFF', 'fan', 34, 'Prince Hawib Stadium', 15000],
    ['Al Watan', 'AWF', 'Kerar', '#0057B8', '#000000', 'fan', 34, 'Aqara Stadium', 15000],
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
    ['Altai Shozen', 'ASU', 'Shozen', '#E30613', '#FFFFFF', 'fan', 33, 'Shozen Stadium', 8000],
    ['Zhetysu Solozen', 'ZSS', 'Solozen', '#FFD100', '#000000', 'fan', 33, 'Baykol Ortalyk Stadiony', 3000],
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
    ['Eintracht Hohenbrück', 'EHC', 'Hohenbrück', '#00843D', '#0057B8', 'fan', 33, 'Hohenbrück Stadium', 2000],
    ['Germania Rotfeld', 'GRA1', 'Rotfeld', '#000000', '#0057B8', 'selling', 32, 'Rotfeld Stadium', 2000],
    ['FC Greifau', 'FGG', 'Greifau', '#FFD100', '#00843D', 'fan', 32, 'Holzhorst-Arena', 2000],
    ['SpVgg Steinheim', 'SSB', 'Steinheim', '#0057B8', '#FFD100', 'fan', 32, 'Rotberg-Stadion', 2000],
    ['FSV Oberbrück', 'FOP', 'Oberbrück', '#0057B8', '#E30613', 'fan', 31, 'Zellweiler am Berg-Stadion', 2000],
    ['SV Lüthof an der Au', 'SLT', 'Lüthof an der Au', '#000000', '#E30613', 'fan', 29, 'Hirschtal-Stadion', 2000],
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
    ['Shabab Musya', 'SMB', 'Musya', '#FFD100', '#00843D', 'fan', 31, 'Musya Stadium', 5000],
    ['Wadi Aqar Club', 'WAU', 'Wadi Aqar', '#FFFFFF', '#E30613', 'fan', 31, 'Rusiyah Stadium', 5000],
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
    ['Al Nimr', 'ANJ', 'Dhan', '#FFD100', '#FFFFFF', 'selling', 32, 'Dhan Stadium', 8000],
    ['Baqiq SC', 'BSS', 'Baqiq', '#0057B8', '#00843D', 'selling', 31, 'Baqiq Stadium', 8000],
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
    ['Shabab Sitayr', 'SSS', 'Sitayr', '#0057B8', '#00843D', 'selling', 31, 'Sitayr Stadium', 5000],
    ['Al Wafaa', 'AWG', 'Farib', '#FFFFFF', '#E30613', 'fan', 30, 'Dahiyah Stadium', 5000],
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
    ['Kohpur Gymkhana', 'KGG', 'Kohpur', '#FFD100', '#0057B8', 'fan', 30, 'Khuzwal Ground', 5000],
    ['Sukot Railways', 'SRG', 'Sukot', '#00843D', '#0057B8', 'fan', 28, 'Chak Mulpind Arena', 5000],
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
    ['Chola Warriors', 'CWW', 'Chola', '#FFFFFF', '#00843D', 'fan', 33, 'Monuka Ground', 5000],
    ['Isuka Dynamos', 'IDA', 'Isuka', '#FFD100', '#00843D', 'fan', 32, 'Isuka Stadium', 5000],
    ['Kasata Copper Stars', 'KCS', 'Kasata', '#FFFFFF', '#0057B8', 'fan', 32, 'Kasata Stadium', 5000],
    ['Serola Rangers', 'SRH', 'Serola', '#0057B8', '#FFD100', 'fan', 31, 'Kafila Ground', 5000],
    ['Mazola Buffaloes', 'MBJ', 'Mazola', '#E30613', '#00843D', 'fan', 31, 'Nchola Ground', 5000],
    ['Luawe Copper Stars', 'LCS', 'Luawe', '#0057B8', '#E30613', 'fan', 31, 'Mumla Stadium', 5000],
    ['Kabama Stars', 'KSB', 'Kabama', '#00843D', '#000000', 'fan', 31, 'Kabama Stadium', 10000],
    ['Port Kafata Warriors', 'PKW', 'Port Kafata', '#FFD100', '#E30613', 'selling', 31, 'Port Kafata Stadium', 5000],
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
    ['Chitvingo FC', 'CFA', 'Chitvingo', '#000000', '#00843D', 'fan', 33, 'Mount Hwadura Sports Club', 5000],
    ['Chiru FC', 'CFB', 'Chiru', '#E30613', '#00843D', 'fan', 33, 'Chende Ground', 5000],
    ['Muzkwe Highlanders', 'MHH', 'Muzkwe', '#FFFFFF', '#000000', 'fan', 31, 'Mount Plunga Sports Club', 5000],
    ['Nyandura FC', 'NFF', 'Nyandura', '#0057B8', '#FFFFFF', 'fan', 30, 'Bingwe Ground', 5000],
    ['Chekwe Platinum', 'CPP', 'Chekwe', '#000000', '#00843D', 'selling', 30, 'Chekwe Stadium', 5000],
    ['Hwanga Diamonds', 'HDD', 'Hwanga', '#E30613', '#000000', 'fan', 30, 'Hwanga Stadium', 5000],
    ['Mutvingo Highlanders', 'MHB', 'Mutvingo', '#E30613', '#00843D', 'selling', 30, 'Mutvingo Stadium', 5000],
    ['Binru Stars', 'BSB', 'Binru', '#FFD100', '#E30613', 'fan', 30, 'Rusnyoka Stadium', 5000],
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
    ['Loduni Rangers', 'LRR', 'Loduni', '#000000', '#00843D', 'selling', 33, 'Loduni Stadium', 5000],
    ['Oyali Youth', 'OYY', 'Oyali', '#00843D', '#E30613', 'selling', 32, 'Rukumba Stadium', 5000],
    ['Nyamese Sugar', 'NSC', 'Nyamese', '#00843D', '#0057B8', 'fan', 32, 'Nyamese Stadium', 5000],
    ['Kibongo Youth', 'KYY', 'Kibongo', '#0057B8', '#FFD100', 'fan', 31, 'Kibongo Stadium', 5000],
    ['Koraka Rangers', 'KRS', 'Koraka', '#FFFFFF', '#00843D', 'fan', 30, 'Koraka Stadium', 5000],
    ['Mwali Bandari', 'MBK', 'Mwali', '#FFFFFF', '#0057B8', 'selling', 30, 'Maluni Showground', 5000],
    ['AFC Mbaluni', 'AMF', 'Mbaluni', '#FFD100', '#000000', 'selling', 30, 'Mbaluni Stadium', 5000],
    ['Nakongo Sugar', 'NSB', 'Nakongo', '#E30613', '#0057B8', 'fan', 30, 'Lake Mbalere Grounds', 5000],
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
    ['Entenge Vipers', 'EVV', 'Entenge', '#00843D', '#FFD100', 'fan', 31, 'Entenge Stadium', 5000],
    ['Nsema Heroes', 'NHH', 'Nsema', '#E30613', '#FFFFFF', 'fan', 30, 'Bugana Mini Stadium', 5000],
    ['Masana Express', 'MEA1', 'Masana', '#0057B8', '#00843D', 'fan', 30, 'Masana Stadium', 5000],
    ['SC Kamira', 'SKC', 'Kamira', '#00843D', '#E30613', 'fan', 29, 'Bugira Grounds', 5000],
    ['Busulu Vipers', 'BVV', 'Busulu', '#0057B8', '#FFFFFF', 'fan', 29, 'Busulu Stadium', 5000],
    ['Bugoma Rangers', 'BRA1', 'Bugoma', '#00843D', '#FFFFFF', 'fan', 29, 'Bugoma Stadium', 5000],
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
    ['Harora Mariam', 'HMM', 'Harora', '#FFD100', '#E30613', 'fan', 31, 'Asora Grounds', 10000],
    ['Harassa Kenema', 'HKK', 'Harassa', '#FFD100', '#FFFFFF', 'fan', 31, 'Asete Sports Complex', 8000],
    ['Dirella Hawariat', 'DHB', 'Dirella', '#E30613', '#FFD100', 'fan', 31, 'Dirella Stadium', 8000],
    ['Akassa Giorgis', 'AGG', 'Akassa', '#0057B8', '#000000', 'fan', 30, 'Akassa Stadium', 5000],
    ['Shella Bunna', 'SBH', 'Shella', '#0057B8', '#FFD100', 'fan', 30, 'Sodama Stadium', 10000],
    ['Lekini Hawariat', 'LHH', 'Lekini', '#FFFFFF', '#000000', 'fan', 29, 'Kebri Lekar Stadium', 8000],
    ['Dejassa Hawariat', 'DHH', 'Dejassa', '#0057B8', '#000000', 'fan', 29, 'Dejassa Stadium', 10000],
    ['Dirama Mariam', 'DMM', 'Dirama', '#FFD100', '#FFFFFF', 'fan', 29, 'Dirama Stadium', 10000],
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
    ['Racing Bobmbé', 'RBB', 'Bobmbé', '#FFFFFF', '#000000', 'fan', 31, 'Bobmbé Stadium', 3000],
    ['FC Labsso', 'FLL', 'Labsso', '#0057B8', '#E30613', 'selling', 29, 'Complexe Sportif de Siksso', 5000],
    ['US Sinmbé', 'USK', 'Sinmbé', '#E30613', '#FFD100', 'fan', 29, 'Sinmbé Stadium', 3000],
    ['FC Sinré', 'FSS', 'Sinré', '#0057B8', '#000000', 'fan', 29, 'Stade Municipal de Bokndé', 5000],
    ['FC Bokgou', 'FBC', 'Bokgou', '#0057B8', '#FFFFFF', 'fan', 29, 'Stade Boudala', 5000],
    ['Mbumbé FC', 'MFF', 'Mbumbé', '#00843D', '#FFD100', 'selling', 29, 'Complexe Sportif de Bouré', 5000],
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
    ['Sporting Castal', 'SCJ', 'Castal', '#E30613', '#000000', 'fan', 33, 'Estádio Nova Ferra', 5000],
    [
      'Clube Ribeira de Torra',
      'CRD',
      'Ribeira de Torra',
      '#FFD100',
      '#FFFFFF',
      'selling',
      31,
      'Ribeira de Torra Stadium',
      5000,
    ],
    ['Barcães Futebol Clube', 'BEA25', 'Barcães', '#000000', '#E30613', 'fan', 31, 'Arena Valenouro', 5000],
    ['Figal Futebol Clube', 'FFC', 'Figal', '#E30613', '#FFFFFF', 'fan', 31, 'Estádio Gouva', 5000],
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
    ['FC Monaya', 'FMA', 'Monaya', '#0057B8', '#FFD100', 'selling', 29, 'Monaya Stadium', 5000],
    ['Monacas United', 'MUK', 'Monacas', '#FFFFFF', '#FFD100', 'fan', 29, 'Lopique Stadium', 3000],
  ];
  FM.D.CLUBS_NL2 = [
    ['Jong KV Alkrade', 'KVJ', 'Alkrade', '#FFFFFF', '#D2122E', 'youth', 46, 'De Oostburg', 12000, 'KVA'],
    [
      'Jong Klein Oostburg',
      'KLJ',
      'Klein Oostburg',
      '#ED1C24',
      '#FFFFFF',
      'youth',
      45,
      'Klein Oostburg Arena',
      12000,
      'KLE',
    ],
    ['Jong Zaanhorst', 'JZA', 'Zaanhorst', '#FF0000', '#FFFFFF', 'youth', 44, 'De Sneekwaard', 12000, 'ZAA'],
    ['SC Oostwold', 'OOA', 'Oostwold', '#001F5B', '#F26522', 'fan', 54, 'Sportpark Oostwold', 24500],
    ['VV Zuidmeer', 'ZUI', 'Zuidmeer', '#E30613', '#FFFFFF', 'fallen', 53, 'Sportpark Zuidmeer', 25500],
    [
      'VV Nieuw Brakhaven',
      'NIB',
      'Nieuw Brakhaven',
      '#000000',
      '#F26522',
      'youth',
      53,
      'Sportpark Nieuw Brakhaven',
      21000,
    ],
    ['VV Kerkdrecht', 'KER', 'Kerkdrecht', '#6CACE4', '#FFD100', 'fan', 52, 'Sportpark Kerkdrecht', 14500],
    ['HVV Waterhoek', 'WAJ', 'Waterhoek', '#FFD100', '#0057B8', 'fan', 51, 'Sportpark Waterhoek', 25500],
    ['VV Veldmark', 'VEG', 'Veldmark', '#E30613', '#0057B8', 'youth', 50, 'Sportpark Veldmark', 17500],
    [
      'RKC Groot Lindeveen',
      'GRH',
      'Groot Lindeveen',
      '#001F5B',
      '#00843D',
      'fan',
      50,
      'Sportpark Groot Lindeveen',
      17000,
    ],
    ['RKC Rijnwoude', 'RIJ', 'Rijnwoude', '#F26522', '#FFD100', 'fan', 49, 'Sportpark Rijnwoude', 7500],
    ['VV Heuvelbrug', 'HEU', 'Heuvelbrug', '#001F5B', '#000000', 'fan', 48, 'Sportpark Heuvelbrug', 8000],
    ['RKC Marsdijk', 'MBA', 'Marsdijk', '#000000', '#0057B8', 'fan', 48, 'Sportpark Marsdijk', 13500],
    [
      'Jong Groot Bredhout',
      'RKJ',
      'Groot Bredhout',
      '#DB0021',
      '#FFFFFF',
      'youth',
      43,
      'Westhoven Stadion',
      12000,
      'RKC',
    ],
    ['AFC Tolhuizen', 'TOL', 'Tolhuizen', '#F26522', '#0057B8', 'youth', 47, 'Sportpark Tolhuizen', 16000],
    ['VV Aaldenveer', 'AAC', 'Aaldenveer', '#FFD100', '#F26522', 'historic', 46, 'Sportpark Aaldenveer', 22000],
    ['AFC Bergsluis', 'BBA', 'Bergsluis', '#001F5B', '#FFD100', 'fan', 46, 'Sportpark Bergsluis', 23500],
    ['HVV Wijkerhout', 'WIJ', 'Wijkerhout', '#F26522', '#00843D', 'fan', 45, 'Sportpark Wijkerhout', 5000],
    ['AFC Duinstad', 'DUI', 'Duinstad', '#0057B8', '#6A1B9A', 'historic', 44, 'Sportpark Duinstad', 20500],
    ['VV Elsbroek', 'ELS', 'Elsbroek', '#0057B8', '#001F5B', 'selling', 43, 'Sportpark Elsbroek', 8500],
  ];
  FM.D.CLUBS_PT2 = [
    ['Sporting Porteiro B', 'SPA1', 'Porteiro', '#E30613', '#FFFFFF', 'youth', 50, 'Estádio Leirares', 12000, 'POR'],
    ['União Pombão B', 'UNJ', 'Pombão', '#003893', '#FFFFFF', 'youth', 49, 'Estádio Nova Amarães', 12000, 'UNI'],
    [
      'SC Vila Serrana',
      'VIW',
      'Vila Serrana',
      '#E30613',
      '#6CACE4',
      'fan',
      55,
      'Estádio Municipal de Vila Serrana',
      18500,
    ],
    ['FC Rio Alvo', 'RIO', 'Rio Alvo', '#6A1B9A', '#000000', 'youth', 54, 'Estádio Municipal de Rio Alvo', 21500],
    [
      'CD Santa Ourela',
      'SBA',
      'Santa Ourela',
      '#F26522',
      '#FFFFFF',
      'fan',
      54,
      'Estádio Municipal de Santa Ourela',
      23000,
    ],
    [
      'AD Monte Fresco',
      'MOM',
      'Monte Fresco',
      '#FFD100',
      '#0057B8',
      'youth',
      53,
      'Estádio Municipal de Monte Fresco',
      11000,
    ],
    [
      'UD Costa do Sul',
      'COK',
      'Costa do Sul',
      '#001F5B',
      '#6CACE4',
      'fallen',
      52,
      'Estádio Municipal de Costa do Sul',
      14000,
    ],
    [
      'UD Praia Nova',
      'PRC',
      'Praia Nova',
      '#F26522',
      '#000000',
      'fallen',
      51,
      'Estádio Municipal de Praia Nova',
      23000,
    ],
    [
      'CD Vale Escuro',
      'VAN',
      'Vale Escuro',
      '#001F5B',
      '#E30613',
      'fan',
      51,
      'Estádio Municipal de Vale Escuro',
      12500,
    ],
    ['CD Torre Alta', 'TOJ', 'Torre Alta', '#001F5B', '#FFD100', 'fallen', 50, 'Estádio Municipal de Torre Alta', 5500],
    [
      'GD Ribeira Seca',
      'RID',
      'Ribeira Seca',
      '#F26522',
      '#FFFFFF',
      'fan',
      49,
      'Estádio Municipal de Ribeira Seca',
      4500,
    ],
    [
      'AD Campo Verde',
      'CBA',
      'Campo Verde',
      '#E30613',
      '#F26522',
      'fan',
      49,
      'Estádio Municipal de Campo Verde',
      14000,
    ],
    ['CD Arraial', 'ARM', 'Arraial', '#0057B8', '#FFFFFF', 'historic', 48, 'Estádio Municipal de Arraial', 9000],
    [
      'UD Barca do Norte',
      'BBB',
      'Barca do Norte',
      '#6A1B9A',
      '#6CACE4',
      'selling',
      47,
      'Estádio Municipal de Barca do Norte',
      17000,
    ],
    ['GD Lagoa Clara', 'LAT', 'Lagoa Clara', '#0057B8', '#FFFFFF', 'fan', 47, 'Estádio Municipal de Lagoa Clara', 5500],
    [
      'UD Pinhal Velho',
      'PIF',
      'Pinhal Velho',
      '#FFD100',
      '#0057B8',
      'fan',
      46,
      'Estádio Municipal de Pinhal Velho',
      4500,
    ],
    [
      'CD São Tomé do Mar',
      'SBB',
      'São Tomé do Mar',
      '#00843D',
      '#FFD100',
      'selling',
      45,
      'Estádio Municipal de São Tomé do Mar',
      7500,
    ],
    [
      'SC Quinta Real',
      'QUC',
      'Quinta Real',
      '#6A1B9A',
      '#00843D',
      'selling',
      44,
      'Estádio Municipal de Quinta Real',
      16000,
    ],
  ];
  FM.D.CLUBS_BR2 = [
    ['AA Boa Esperança', 'BOS', 'Boa Esperança', '#00843D', '#FFFFFF', 'selling', 64, 'Estádio Boa Esperança', 13000],
    [
      'SE Rio Claro Novo',
      'RIE',
      'Rio Claro Novo',
      '#0057B8',
      '#001F5B',
      'selling',
      63,
      'Estádio Rio Claro Novo',
      17000,
    ],
    ['AD Porto Azul', 'POV', 'Porto Azul', '#6CACE4', '#FFFFFF', 'youth', 63, 'Estádio Porto Azul', 24500],
    ['AD Serra Dourada', 'SEM', 'Serra Dourada', '#001F5B', '#FFFFFF', 'historic', 62, 'Estádio Serra Dourada', 8000],
    [
      'CA Campo Largo do Sul',
      'CBB',
      'Campo Largo do Sul',
      '#6A1B9A',
      '#00843D',
      'youth',
      61,
      'Estádio Campo Largo do Sul',
      24500,
    ],
    ['EC Santa Aurora', 'SBC', 'Santa Aurora', '#FFD100', '#6CACE4', 'fan', 60, 'Estádio Santa Aurora', 6500],
    [
      'CA Vila Nova do Norte',
      'VIX',
      'Vila Nova do Norte',
      '#001F5B',
      '#6CACE4',
      'fan',
      60,
      'Estádio Vila Nova do Norte',
      8000,
    ],
    [
      'CA São Luís do Vale',
      'SBD',
      'São Luís do Vale',
      '#0057B8',
      '#FFD100',
      'fan',
      59,
      'Estádio São Luís do Vale',
      25500,
    ],
    [
      'CA Cachoeira Alta',
      'CBC',
      'Cachoeira Alta',
      '#000000',
      '#FFD100',
      'historic',
      58,
      'Estádio Cachoeira Alta',
      23000,
    ],
    ['AD Ponta Verde', 'POW', 'Ponta Verde', '#000000', '#0057B8', 'fan', 57, 'Estádio Ponta Verde', 14500],
    ['SE Trindade Nova', 'TRI', 'Trindade Nova', '#6A1B9A', '#E30613', 'fan', 57, 'Estádio Trindade Nova', 24500],
    ['EC Mata Atlântica', 'MBB', 'Mata Atlântica', '#F26522', '#001F5B', 'youth', 56, 'Estádio Mata Atlântica', 11500],
    [
      'União Barra Funda Nova',
      'BBC',
      'Barra Funda Nova',
      '#FFD100',
      '#001F5B',
      'fan',
      55,
      'Estádio Barra Funda Nova',
      9000,
    ],
    ['CA Itaquara', 'ITB', 'Itaquara', '#001F5B', '#0057B8', 'youth', 54, 'Estádio Itaquara', 4000],
    ['SE Caiçara', 'CBD', 'Caiçara', '#FFD100', '#0057B8', 'fallen', 54, 'Estádio Caiçara', 16500],
    ['AA Jacarandá', 'JAD', 'Jacarandá', '#E30613', '#F26522', 'selling', 53, 'Estádio Jacarandá', 23500],
    ['CA Palmeiral', 'PBA', 'Palmeiral', '#F26522', '#FFFFFF', 'fan', 52, 'Estádio Palmeiral', 23000],
    ['SE Morro Branco', 'MOQ', 'Morro Branco', '#6CACE4', '#FFFFFF', 'historic', 51, 'Estádio Morro Branco', 6500],
    ['AD Pedra Azul', 'PEM', 'Pedra Azul', '#6A1B9A', '#001F5B', 'fan', 51, 'Estádio Pedra Azul', 14500],
    ['União Serrinha Nova', 'SEN', 'Serrinha Nova', '#000000', '#6A1B9A', 'youth', 50, 'Estádio Serrinha Nova', 10000],
  ];
  FM.D.CLUBS_TR2 = [
    ['Akçaova Spor', 'AKD', 'Akçaova', '#FFD100', '#E30613', 'fallen', 54, 'Akçaova Stadyumu', 7000],
    [
      'Karadeniz Limanı Gençlik',
      'KAP',
      'Karadeniz Limanı',
      '#6A1B9A',
      '#00843D',
      'historic',
      53,
      'Karadeniz Limanı Stadyumu',
      12500,
    ],
    ['Yeşilvadi Spor', 'YEE', 'Yeşilvadi', '#001F5B', '#6CACE4', 'fan', 53, 'Yeşilvadi Stadyumu', 4000],
    ['Taşköprü Yeni Gençlik', 'TBA', 'Taşköprü Yeni', '#000000', '#6CACE4', 'fan', 52, 'Taşköprü Yeni Stadyumu', 4500],
    ['Gümüşkent Spor', 'GUM', 'Gümüşkent', '#00843D', '#6CACE4', 'historic', 51, 'Gümüşkent Stadyumu', 13000],
    ['Ormanlı Belediye', 'ORM', 'Ormanlı', '#E30613', '#FFFFFF', 'fan', 50, 'Ormanlı Stadyumu', 12000],
    ['Bozdağspor', 'BOT', 'Bozdağ', '#001F5B', '#000000', 'fan', 50, 'Bozdağ Stadyumu', 25500],
    ['Çınarlıspor', 'CNA', 'Çınarlı', '#FFD100', '#FFFFFF', 'fan', 49, 'Çınarlı Stadyumu', 23500],
    ['Denizköy Belediye', 'DEC', 'Denizköy', '#00843D', '#6CACE4', 'historic', 48, 'Denizköy Stadyumu', 19500],
    ['Kızılırmak Gençlik', 'KZL', 'Kızılırmak', '#E30613', '#F26522', 'youth', 48, 'Kızılırmak Stadyumu', 14500],
    ['Sarıtepe Belediye', 'SBE', 'Sarıtepe', '#E30613', '#FFFFFF', 'fan', 47, 'Sarıtepe Stadyumu', 17500],
    ['Aydınlar Belediye', 'AYB', 'Aydınlar', '#001F5B', '#E30613', 'fallen', 46, 'Aydınlar Stadyumu', 6000],
    ['Esenova Belediye', 'ESG', 'Esenova', '#000000', '#F26522', 'fan', 46, 'Esenova Stadyumu', 13000],
    ['Kayalar Spor', 'KAQ', 'Kayalar', '#6A1B9A', '#0057B8', 'historic', 45, 'Kayalar Stadyumu', 25500],
    ['Mavişehir Gençlik', 'MBC', 'Mavişehir', '#FFD100', '#FFFFFF', 'fan', 44, 'Mavişehir Stadyumu', 25500],
    ['Ulukentspor', 'ULB', 'Ulukent', '#000000', '#E30613', 'selling', 43, 'Ulukent Stadyumu', 9000],
    ['Doğanpınar Belediye', 'DOK', 'Doğanpınar', '#E30613', '#0057B8', 'fan', 43, 'Doğanpınar Stadyumu', 6500],
    ['Yıldızlı Gençlik', 'YLD', 'Yıldızlı', '#FFD100', '#000000', 'fan', 42, 'Yıldızlı Stadyumu', 10000],
    ['Kaykalespor', 'KKB', 'Kaykale', '#0057B8', '#000000', 'fan', 42, 'Akale Cumhuriyet Stadyumu', 12000],
    ['Alidere Atletik', 'AAG', 'Alidere', '#FFFFFF', '#00843D', 'fan', 42, 'Alidere Stadium', 6000],
  ];
  FM.D.CLUBS_PL2 = [
    ['MKS Nowy Borek', 'NOJ', 'Nowy Borek', '#6A1B9A', '#00843D', 'fan', 50, 'Stadion Miejski Nowy Borek', 23500],
    ['MKS Wola Zielona', 'WOH', 'Wola Zielona', '#0057B8', '#6A1B9A', 'fan', 49, 'Stadion Miejski Wola Zielona', 8000],
    ['KS Lipniki', 'LIH', 'Lipniki', '#E30613', '#001F5B', 'selling', 49, 'Stadion Miejski Lipniki', 6000],
    ['KS Brzozów Mały', 'BRZ', 'Brzozów Mały', '#0057B8', '#6A1B9A', 'fan', 48, 'Stadion Miejski Brzozów Mały', 23000],
    ['MKS Stary Gród', 'STP', 'Stary Gród', '#6CACE4', '#FFD100', 'fan', 48, 'Stadion Miejski Stary Gród', 23500],
    [
      'LKS Dąbrowa Leśna',
      'DAJ',
      'Dąbrowa Leśna',
      '#F26522',
      '#00843D',
      'fan',
      47,
      'Stadion Miejski Dąbrowa Leśna',
      17500,
    ],
    ['GKS Kamionka', 'KAT', 'Kamionka', '#E30613', '#00843D', 'fan', 46, 'Stadion Miejski Kamionka', 21000],
    ['GKS Zalesie', 'ZAD', 'Zalesie', '#6A1B9A', '#00843D', 'fan', 46, 'Stadion Miejski Zalesie', 21500],
    ['GKS Jaworzyna', 'JAW', 'Jaworzyna', '#E30613', '#0057B8', 'selling', 45, 'Stadion Miejski Jaworzyna', 16000],
    ['LKS Mokra Wieś', 'MOV', 'Mokra Wieś', '#6A1B9A', '#0057B8', 'selling', 45, 'Stadion Miejski Mokra Wieś', 15000],
    ['KS Piaski', 'PIG', 'Piaski', '#000000', '#FFFFFF', 'fan', 44, 'Stadion Miejski Piaski', 10500],
    ['LKS Sosnowa', 'SOJ', 'Sosnowa', '#E30613', '#0057B8', 'fan', 44, 'Stadion Miejski Sosnowa', 22500],
    ['KS Ostrów Nowy', 'OSB', 'Ostrów Nowy', '#F26522', '#000000', 'fan', 43, 'Stadion Miejski Ostrów Nowy', 17000],
    ['KS Czarna Góra', 'CZA', 'Czarna Góra', '#0057B8', '#E30613', 'fan', 42, 'Stadion Miejski Czarna Góra', 25500],
    [
      'KS Wiązowna Duża',
      'WIC',
      'Wiązowna Duża',
      '#000000',
      '#6CACE4',
      'historic',
      42,
      'Stadion Miejski Wiązowna Duża',
      12000,
    ],
    ['KS Ruda Nowa', 'RUE', 'Ruda Nowa', '#001F5B', '#000000', 'historic', 41, 'Stadion Miejski Ruda Nowa', 16500],
    ['LKS Kalinów', 'KAV', 'Kalinów', '#00843D', '#6CACE4', 'fan', 41, 'Stadion Miejski Kalinów', 12000],
    ['MKS Rzeczna', 'RZE', 'Rzeczna', '#001F5B', '#E30613', 'selling', 40, 'Stadion Miejski Rzeczna', 13500],
  ];
  FM.D.CLUBS_NO2 = [
    ['IL Fjellvik', 'FJE', 'Fjellvik', '#F26522', '#FFD100', 'selling', 50, 'Fjellvik Stadion', 17500],
    ['FK Nordhamn', 'NOK', 'Nordhamn', '#F26522', '#FFFFFF', 'fan', 49, 'Nordhamn Stadion', 26000],
    ['SK Skogli', 'SKO', 'Skogli', '#0057B8', '#FFFFFF', 'fan', 49, 'Skogli Stadion', 7500],
    ['IF Havnes', 'HAX', 'Havnes', '#F26522', '#FFD100', 'historic', 48, 'Havnes Stadion', 19500],
    ['FK Breidal', 'BRL', 'Breidal', '#000000', '#001F5B', 'fan', 47, 'Breidal Stadion', 12000],
    ['FK Vestfoss', 'VEH', 'Vestfoss', '#000000', '#6A1B9A', 'historic', 47, 'Vestfoss Stadion', 22500],
    ['FK Solberg', 'SOM', 'Solberg', '#E30613', '#FFFFFF', 'fan', 46, 'Solberg Stadion', 17000],
    ['FK Granvik', 'GRJ', 'Granvik', '#6CACE4', '#00843D', 'fan', 45, 'Granvik Stadion', 19500],
    ['BK Lysefjord', 'LYS', 'Lysefjord', '#6CACE4', '#F26522', 'youth', 45, 'Lysefjord Stadion', 12500],
    ['BK Storeby', 'STQ', 'Storeby', '#0057B8', '#6A1B9A', 'historic', 44, 'Storeby Stadion', 15500],
    ['IL Elvedal', 'ELV', 'Elvedal', '#001F5B', '#FFFFFF', 'selling', 43, 'Elvedal Stadion', 26000],
    ['IF Austmark', 'AUB', 'Austmark', '#0057B8', '#00843D', 'fan', 43, 'Austmark Stadion', 17000],
    ['SK Bergsund', 'BBD', 'Bergsund', '#001F5B', '#00843D', 'fan', 42, 'Bergsund Stadion', 20500],
    ['BK Kvitsand', 'KVI', 'Kvitsand', '#6CACE4', '#E30613', 'fan', 41, 'Kvitsand Stadion', 25000],
    ['IL Hovdal', 'HOV', 'Hovdal', '#000000', '#6A1B9A', 'youth', 41, 'Hovdal Stadion', 21000],
    ['BK Tindeby', 'TIN', 'Tindeby', '#000000', '#6CACE4', 'historic', 40, 'Tindeby Stadion', 24000],
  ];
  FM.D.CLUBS_SE2 = [
    ['BK Björkvik', 'BJA', 'Björkvik', '#6CACE4', '#6A1B9A', 'fallen', 50, 'Björkvik Arena', 12000],
    ['BK Norrtorp', 'NOM', 'Norrtorp', '#00843D', '#FFD100', 'fallen', 49, 'Norrtorp Arena', 21500],
    ['BK Sjöholm', 'SJO', 'Sjöholm', '#FFD100', '#FFFFFF', 'historic', 49, 'Sjöholm Arena', 9000],
    ['BK Älvdalen Nya', 'ABD', 'Älvdalen Nya', '#00843D', '#0057B8', 'fan', 48, 'Älvdalen Nya Arena', 16000],
    ['SK Skogsby', 'SKA', 'Skogsby', '#E30613', '#FFD100', 'fan', 47, 'Skogsby Arena', 22000],
    ['BK Lindberga', 'LIJ', 'Lindberga', '#0057B8', '#001F5B', 'historic', 46, 'Lindberga Arena', 6000],
    ['FF Hällaryd', 'HAZ', 'Hällaryd', '#E30613', '#6CACE4', 'fan', 46, 'Hällaryd Arena', 12500],
    ['FF Strandvik', 'STT', 'Strandvik', '#001F5B', '#00843D', 'historic', 45, 'Strandvik Arena', 17500],
    ['SK Östermo', 'OSD', 'Östermo', '#6A1B9A', '#E30613', 'fan', 44, 'Östermo Arena', 9000],
    ['SK Ekudden', 'EKU', 'Ekudden', '#6A1B9A', '#E30613', 'fan', 43, 'Ekudden Arena', 16000],
    ['FF Falkberg', 'FAC', 'Falkberg', '#00843D', '#001F5B', 'historic', 43, 'Falkberg Arena', 19000],
    ['FF Tallhed', 'TBB', 'Tallhed', '#FFD100', '#FFFFFF', 'fan', 42, 'Tallhed Arena', 11500],
    ['IFK Vikeby', 'VIY', 'Vikeby', '#0057B8', '#FFFFFF', 'fan', 41, 'Vikeby Arena', 24500],
    ['FF Granhult', 'GRK', 'Granhult', '#000000', '#E30613', 'historic', 40, 'Granhult Arena', 24500],
    ['SK Ängelsta', 'ANB', 'Ängelsta', '#6A1B9A', '#FFD100', 'fan', 40, 'Ängelsta Arena', 8000],
    ['SK Rödby', 'ROG', 'Rödby', '#001F5B', '#0057B8', 'historic', 39, 'Rödby Arena', 9500],
  ];
  FM.D.CLUBS_DZ2 = [
    ['CR Berouk', 'CRR', 'Berouk', '#0057B8', '#FFD100', 'fan', 44, 'Stade de Berouk', 17500],
    ['USM Bejouk', 'USD', 'Bejouk', '#6A1B9A', '#FFFFFF', 'fan', 43, 'Stade Namiya', 15500],
    ['Masouk FC', 'MAM35', 'Masouk', '#FFFFFF', '#6A1B9A', 'fan', 42, 'Complexe Sportif Masouk', 13000],
    ['MC Milara', 'MCC', 'Milara', '#00843D', '#FFD100', 'historic', 41, 'Stade Cherène', 13000],
    ['RC Tlemouda', 'TLE', 'Tlemouda', '#FFD100', '#6A1B9A', 'youth', 40, 'Stade Timara', 13500],
    ['MO Beni Aflène', 'MOO', 'Aflène', '#0057B8', '#6A1B9A', 'fan', 39, 'Stade Gharouda', 16000],
    ['AS Beni Skikala', 'BEA24', 'Beni Skikala', '#6A1B9A', '#FFFFFF', 'selling', 38, 'Stade Mosida', 14000],
    ['MO Ain Namiya', 'MMO', 'Namiya', '#FFD100', '#6A1B9A', 'fan', 38, 'Stade Municipal de Namiya', 15500],
    ['CR Beni Gharala', 'CCR', 'Gharala', '#001F5B', '#6CACE4', 'fan', 37, 'Stade Municipal de Gharala', 15500],
    ['CA Hassiya', 'CAB25', 'Hassiya', '#E30613', '#6CACE4', 'selling', 36, 'Complexe Sportif Hassiya', 12500],
    ['AS Mosara', 'MOW', 'Mosara', '#0057B8', '#6CACE4', 'fan', 35, 'Complexe Sportif Mosara', 11000],
    ['MO Relane', 'MOX', 'Relane', '#000000', '#FFFFFF', 'fan', 34, 'Stade Municipal de Relane', 14000],
    ['JS Masina', 'JSS', 'Masina', '#E30613', '#6A1B9A', 'youth', 34, 'Complexe Sportif Masina', 14000],
    ['MC Timène', 'MMC', 'Timène', '#001F5B', '#FFD100', 'fallen', 33, 'Stade Sedouda', 10500],
    ['ES Gharouk', 'GHB', 'Gharouk', '#FFD100', '#0057B8', 'fallen', 32, 'Stade Tlemina', 9500],
    ['RC Timina', 'TIM', 'Timina', '#0057B8', '#001F5B', 'fallen', 32, 'Complexe Sportif Timina', 10500],
  ];
  FM.D.CLUBS_AR2 = [
    ['Club Deportivo Franez', 'FRK', 'Franez', '#0057B8', '#001F5B', 'fan', 58, 'Estadio Quirano', 21500],
    ['Club Atlético Doctor Sarez', 'DOJ32', 'Doctor Sarez', '#000000', '#6CACE4', 'fan', 58, 'Estadio Urqo', 22000],
    ['Nacional Lavón', 'NAY', 'Lavón', '#E30613', '#00843D', 'fan', 57, 'Cancha de Lavón', 21500],
    ['Racing de Molini', 'MOY', 'Molini', '#FFD100', '#6CACE4', 'selling', 57, 'Estadio Garero', 20000],
    ['Defensores de Velero', 'VEJ32', 'Velero', '#000000', '#6CACE4', 'fan', 57, 'Estadio Municipal de Velero', 23500],
    ['Independiente Domas', 'DOL34', 'Domas', '#FFFFFF', '#0057B8', 'fallen', 57, 'Estadio Alverilla', 21500],
    ['Club Deportivo Cabrez', 'CAC26', 'Cabrez', '#FFFFFF', '#FFD100', 'fan', 56, 'Estadio Busto', 19500],
    ['Gimnasia de Cabrui', 'CAD27', 'Cabrui', '#000000', '#001F5B', 'fan', 55, 'Estadio Municipal de Cabrui', 21000],
    ['Sportivo Molui', 'MOZ', 'Molui', '#FFD100', '#0057B8', 'fan', 55, 'Cancha de Molui', 20000],
    ['Unión de Quirón', 'QUG', 'Quirón', '#0057B8', '#6CACE4', 'fan', 55, 'Estadio Municipal de Quirón', 20000],
    ['Club de Regatas Domini', 'REJ', 'Domini', '#6CACE4', '#000000', 'fan', 54, 'Cancha de Domini', 22000],
    ['Dorrilla FC', 'DOP', 'Dorrilla', '#0057B8', '#FFFFFF', 'historic', 54, 'Estadio Castar', 22500],
    [
      'Club Deportivo Lezilla',
      'LEJ',
      'Lezilla',
      '#E30613',
      '#001F5B',
      'fallen',
      54,
      'Estadio Monumental Escero',
      19500,
    ],
    ['Atlético Domano', 'DOQ', 'Domano', '#E30613', '#6A1B9A', 'fan', 53, 'Cancha de Domano', 20500],
    ['Defensores de Quirano', 'QUD', 'Quirano', '#E30613', '#FFFFFF', 'fallen', 53, 'Cancha de Quirano', 22000],
    ['Defensores de Domia', 'DOK33', 'Domia', '#0057B8', '#001F5B', 'fan', 53, 'Estadio Monumental Alveria', 21500],
    ['Racing de Pelleda del Sur', 'PEQ', 'Pelleda del Sur', '#6A1B9A', '#E30613', 'fan', 52, 'Estadio Sarar', 18500],
    ['Club de Regatas Arrar', 'REV', 'Arrar', '#000000', '#0057B8', 'historic', 52, 'Estadio Monumental Herini', 21000],
    ['Independiente Pellui', 'PEW44', 'Pellui', '#FFFFFF', '#6CACE4', 'fan', 52, 'Cancha de Pellui', 18500],
    ['Sportivo Franas', 'FRL', 'Franas', '#FFFFFF', '#000000', 'fan', 51, 'Cancha de Franas', 20500],
    ['Independiente Pellano', 'PEU42', 'Pellano', '#FFFFFF', '#FFD100', 'youth', 51, 'Estadio Fereda', 18000],
    ['Club Deportivo Mirez', 'MIE', 'Mirez', '#001F5B', '#000000', 'selling', 50, 'Estadio Ferar', 19000],
    [
      'Atlético Coronel Herar',
      'COL',
      'Coronel Herar',
      '#6CACE4',
      '#00843D',
      'historic',
      50,
      'Cancha de Coronel Herar',
      18500,
    ],
    ['Defensores de Domero', 'DOH31', 'Domero', '#6A1B9A', '#FFD100', 'youth', 50, 'Estadio Monumental Velona', 18000],
    [
      'Atlético Ortia del Plata',
      'ORU',
      'Ortia del Plata',
      '#00843D',
      '#E30613',
      'fan',
      50,
      'Cancha de Ortia del Plata',
      19500,
    ],
    ['Club Deportivo Arras', 'ARP', 'Arras', '#FFD100', '#00843D', 'historic', 49, 'Estadio Rodilla', 17000],
    ['Club Atlético Urqo', 'URB', 'Urqo', '#FFFFFF', '#00843D', 'fan', 49, 'Estadio Frano', 18000],
    [
      'Gimnasia de Toras del Sur',
      'TOD27',
      'Toras del Sur',
      '#FFD100',
      '#001F5B',
      'fan',
      49,
      'Cancha de Toras del Sur',
      18000,
    ],
    ['Club de Regatas Mirón', 'REW', 'Mirón', '#000000', '#001F5B', 'fan', 49, 'Estadio Sarero', 16000],
    [
      'Club de Regatas Lavas',
      'RAQ38',
      'Lavas',
      '#FFFFFF',
      '#001F5B',
      'fallen',
      49,
      'Estadio Municipal de Lavas',
      19500,
    ],
    ['Nacional Mirui', 'NAC50', 'Mirui', '#FFFFFF', '#6CACE4', 'historic', 48, 'Estadio Domui', 20000],
    [
      'Atlético Coronel Escón',
      'CEQ',
      'Coronel Escón',
      '#001F5B',
      '#00843D',
      'historic',
      48,
      'Cancha de Coronel Escón',
      20000,
    ],
    ['Defensores de Pellón', 'PEV43', 'Pellón', '#001F5B', '#00843D', 'selling', 48, 'Estadio Fero', 20000],
    ['Estudiantes de Bustia', 'BUQ', 'Bustia', '#6A1B9A', '#000000', 'fan', 47, 'Estadio Castón', 15500],
    [
      'Independiente Rodano',
      'ROH',
      'Rodano',
      '#FFD100',
      '#FFFFFF',
      'historic',
      47,
      'Estadio Municipal de Rodano',
      16000,
    ],
    ['Gimnasia de Rodez', 'ROL34', 'Rodez', '#6A1B9A', '#FFFFFF', 'fan', 47, 'Estadio Monumental Pellero', 18500],
  ];
  FM.D.CLUBS_AT2 = [
    ['Fortuna Grüningen', 'GRL', 'Grüningen', '#0057B8', '#E30613', 'fallen', 50, 'Waldstadion Grüningen', 20500],
    ['Teutonia Westerdorf', 'WES', 'Westerdorf', '#E30613', '#FFFFFF', 'fan', 50, 'Stadion am Heidsee', 18500],
    ['FSV Neu Immhafen', 'NEU', 'Immhafen', '#E30613', '#00843D', 'fan', 49, 'Westerhorst-Stadion', 18000],
    ['VfB Unter Immbach', 'UNA', 'Immbach', '#E30613', '#00843D', 'historic', 49, 'Stadion Thalfeld', 20500],
    ['Rot-Weiß Heidtal', 'ROJ', 'Heidtal', '#6A1B9A', '#00843D', 'youth', 48, 'Heidtal-Arena', 17500],
    [
      'Concordia Kalfurt am See',
      'CON',
      'Kalfurt am See',
      '#E30613',
      '#00843D',
      'selling',
      47,
      'Waldstadion Kalfurt am See',
      19500,
    ],
    ['VfL Heidau', 'HEC', 'Heidau', '#001F5B', '#000000', 'selling', 46, 'Dillhorst-Stadion', 17500],
    ['Concordia Kalberg', 'COP', 'Kalberg', '#6A1B9A', '#FFD100', 'historic', 46, 'Sportpark Marienfurt', 17000],
    ['FSV Bruchweiler', 'BRM', 'Bruchweiler', '#00843D', '#6CACE4', 'selling', 46, 'Kalheim-Stadion', 19000],
    ['TuS Oberkirchen', 'TUB', 'Oberkirchen', '#0057B8', '#FFFFFF', 'selling', 44, 'Stadion am Grünweiler', 14500],
    ['Union Steinkirchen', 'STU', 'Steinkirchen', '#6CACE4', '#FFD100', 'fan', 43, 'Bachtal-Stadion', 16500],
    ['Fortuna Heidwald', 'HEE', 'Heidwald', '#FFFFFF', '#000000', 'fan', 43, 'Grünfeld-Stadion', 16000],
    ['FC Neu Lütkirchen', 'NEK', 'Lütkirchen', '#FFFFFF', '#E30613', 'youth', 42, 'Stadion Wieshafen', 17000],
    ['SC Branau 1901', 'BRP', 'Branau', '#6A1B9A', '#000000', 'selling', 42, 'Sportpark Gründorf', 15500],
    ['VfL Unter Branhausen', 'UNR', 'Branhausen', '#E30613', '#FFD100', 'fan', 41, 'Stadion am Wiesberg', 14500],
    ['FC Waldstadt', 'WAL', 'Waldstadt', '#00843D', '#000000', 'fan', 40, 'Waldstadion Waldstadt', 13000],
  ];
  FM.D.CLUBS_BY2 = [
    ['Khimik Rasovichy', 'KHC', 'Rasovichy', '#000000', '#E30613', 'fallen', 38, 'Haradski Stadyen Rasovichy', 12500],
    [
      'Slavia Novy Chashchyna',
      'NOP',
      'Novy Chashchyna',
      '#0057B8',
      '#00843D',
      'fan',
      38,
      'Stadyen Novy Chashchyna',
      14000,
    ],
    ['FC Nesvava', 'NEM', 'Nesvava', '#E30613', '#6CACE4', 'fallen', 37, 'Stadyen Dinamo Nesvava', 15000],
    ['Shakhtyor Vilava', 'SHK', 'Vilava', '#FFD100', '#E30613', 'fan', 35, 'Stadyen Molshchyna', 14000],
    ['Khimik Dokovichy', 'KHK', 'Dokovichy', '#000000', '#FFFFFF', 'historic', 35, 'Stadyen Dinamo Dokovichy', 10500],
    ['Neman Kasovka', 'NEN', 'Kasovka', '#FFD100', '#001F5B', 'fan', 34, 'Stadyen Hlybovichy', 10500],
    ['Naftan Molovka', 'NAZ', 'Molovka', '#6CACE4', '#E30613', 'selling', 34, 'Stadyen Molovka', 10000],
    [
      'FK Vyalikaya Dokilovichy',
      'VYA',
      'Dokilovichy',
      '#FFFFFF',
      '#0057B8',
      'youth',
      33,
      'Haradski Stadyen Dokilovichy',
      11500,
    ],
    ['FC Chasyn', 'CHC26', 'Chasyn', '#0057B8', '#E30613', 'historic', 32, 'Haradski Stadyen Chasyn', 13000],
    ['Spartak Babka', 'SPP', 'Babka', '#FFFFFF', '#00843D', 'youth', 32, 'Stadyen Dinamo Babka', 9000],
    ['Energetik Hlybensk', 'ENB', 'Hlybensk', '#001F5B', '#FFD100', 'historic', 31, 'Stadyen Hlybensk', 10500],
    ['Vedrich Hlybets', 'VEJ', 'Hlybets', '#6A1B9A', '#000000', 'historic', 30, 'Haradski Stadyen Hlybets', 8500],
    ['Naftan Doka', 'NAA24', 'Doka', '#6A1B9A', '#6CACE4', 'historic', 28, 'Stadyen Doka', 9500],
    ['Spartak Chasichy', 'SPQ', 'Chasichy', '#001F5B', '#6A1B9A', 'selling', 28, 'Lahovka Arena', 9500],
    ['FK Chashchyna', 'CNB', 'Chashchyna', '#001F5B', '#0057B8', 'historic', 27, 'Haradski Stadyen Chashchyna', 9000],
    ['Svetka FK', 'SVE', 'Svetka', '#E30613', '#FFD100', 'youth', 26, 'Stadyen Svetka', 6000],
  ];
  FM.D.CLUBS_BE2 = [
    ['KV Veenlo', 'VEK', 'Veenlo', '#FFD100', '#001F5B', 'historic', 55, 'Stade Sneekhoven', 22000],
    ['Royal Union Hoornlo', 'ROY', 'Hoornlo', '#0057B8', '#000000', 'fallen', 54, 'Stade Communal de Hoornlo', 22500],
    ['Koninklijke Wagezand', 'KOD', 'Wagezand', '#FFD100', '#6CACE4', 'fan', 54, 'Veenwaard Stadion', 21500],
    ['Sporting Zuidzand', 'ZUA', 'Zuidzand', '#000000', '#00843D', 'selling', 53, 'Stade Communal de Zuidzand', 19000],
    ['SK Bergvoort', 'BEB25', 'Bergvoort', '#00843D', '#001F5B', 'fallen', 52, 'Stedelijk Stadion Bergvoort', 18000],
    ['Standard Grootstad', 'STV', 'Grootstad', '#0057B8', '#6CACE4', 'youth', 51, 'Stedelijk Stadion Grootstad', 21500],
    [
      'Standard Kleinstad',
      'STW',
      'Kleinstad',
      '#6CACE4',
      '#00843D',
      'youth',
      51,
      'Gemeentelijk Stadion Kleinstad',
      21500,
    ],
    ['Sporting Devenhorst', 'DEV', 'Devenhorst', '#E30613', '#000000', 'historic', 49, 'Stade Westrade', 17500],
    ['KAA Alkhoven', 'KAX', 'Alkhoven', '#000000', '#E30613', 'youth', 49, 'Stade Kleinbeek', 18500],
    ['KSC Laaghorst', 'KSC', 'Laaghorst', '#FFD100', '#00843D', 'fallen', 49, 'Stade Oostveen', 17000],
    [
      'Excelsior Vlaarkerk',
      'EXA',
      'Vlaarkerk',
      '#6CACE4',
      '#001F5B',
      'historic',
      48,
      'Stade Communal de Vlaarkerk',
      19500,
    ],
    [
      'Excelsior Laaghoven',
      'EXR',
      'Laaghoven',
      '#FFFFFF',
      '#E30613',
      'historic',
      47,
      'Gemeentelijk Stadion Laaghoven',
      16500,
    ],
    ['KRC Devenbrug', 'KRF', 'Devenbrug', '#00843D', '#0057B8', 'historic', 47, 'Hooghout Stadion', 18500],
    ['Sporting Zuidlo', 'ZUO', 'Zuidlo', '#6CACE4', '#FFD100', 'fallen', 45, 'Stade Haarwijk', 18500],
    ['Royal Wagehoven', 'ROL', 'Wagehoven', '#E30613', '#0057B8', 'fan', 44, 'Stedelijk Stadion Wagehoven', 16500],
    ['Union Nieuw Leidvoort', 'NIC', 'Leidvoort', '#FFFFFF', '#E30613', 'fallen', 44, 'Stade Oudrade', 14500],
  ];
  FM.D.CLUBS_BG2 = [
    ['FK Dobets', 'DOS', 'Dobets', '#FFD100', '#6A1B9A', 'historic', 39, 'Gradski stadion Dobets', 12500],
    ['Dinamo Svitsa', 'DIJ', 'Svitsa', '#000000', '#00843D', 'fan', 38, 'Stadion Svitsa', 12500],
    ['Minyor Shovo', 'MIN', 'Shovo', '#00843D', '#6CACE4', 'fan', 38, 'Stadion Pazovtsi', 11500],
    ['Dinamo Sevgrad', 'DIK', 'Sevgrad', '#E30613', '#6A1B9A', 'historic', 37, 'Stadion Sevgrad', 14000],
    ['Spartak Dolna Lovovo', 'SAE28', 'Lovovo', '#000000', '#FFD100', 'selling', 36, 'Gradski stadion Lovovo', 15000],
    ['Yantra Razgrad', 'YAD', 'Razgrad', '#000000', '#FFD100', 'historic', 35, 'Stadion Razgrad', 10500],
    ['Dinamo Dolna Vrovo', 'DMA', 'Vrovo', '#FFFFFF', '#001F5B', 'fan', 35, 'Razgrad Arena', 11000],
    ['Septemvri Nova Slika', 'SEQ', 'Slika', '#00843D', '#6A1B9A', 'fan', 34, 'Gradski stadion Slika', 11000],
    ['Minyor Blino', 'MIF', 'Blino', '#FFFFFF', '#FFD100', 'selling', 34, 'Stadion Blino', 10500],
    ['FC Viditsa', 'VIZ', 'Viditsa', '#6CACE4', '#FFD100', 'historic', 33, 'Stadion Mongrad', 13000],
    ['Minyor Vrevo', 'MIV', 'Vrevo', '#FFFFFF', '#6A1B9A', 'youth', 33, 'Silovtsi Arena', 9500],
    ['Balkan Veliko Petovtsi', 'BAL34', 'Veliko Petovtsi', '#000000', '#FFD100', 'fan', 32, 'Kyovtsi Arena', 12500],
    ['Dinamo Sligrad', 'DIS', 'Sligrad', '#001F5B', '#E30613', 'historic', 31, 'Stadion Kyovo', 10000],
    ['Lokomotiv Tutovtsi', 'LOD', 'Tutovtsi', '#00843D', '#000000', 'historic', 31, 'Stadion Varino', 11000],
    ['Metalurg Stara Pazets', 'MEG', 'Pazets', '#000000', '#6CACE4', 'selling', 30, 'Stadion Petgrad', 10500],
    ['Spartak Svevo', 'SPS', 'Svevo', '#FFFFFF', '#E30613', 'selling', 29, 'Stadion Svevo', 11000],
    ['Lokomotiv Gabka', 'LOE', 'Gabka', '#000000', '#6A1B9A', 'fan', 28, 'Gradski stadion Gabka', 10000],
    ['Septemvri Hasitsa', 'SEI', 'Hasitsa', '#0057B8', '#00843D', 'fallen', 28, 'Stadion Hasitsa', 11500],
  ];
  FM.D.CLUBS_CL2 = [
    ['UD Cuenanes', 'CUC', 'Cuenanes', '#E30613', '#6CACE4', 'historic', 46, 'Estadio Tarifena', 19000],
    ['Quintosa CF', 'QUE', 'Quintosa', '#E30613', '#000000', 'historic', 45, 'Estadio Municipal de Quintosa', 19000],
    ['CD Lermejo', 'LEA', 'Lermejo', '#00843D', '#FFD100', 'fallen', 44, 'Estadio Beneda', 14500],
    ['Racing San Guadara', 'GUE', 'Guadara', '#00843D', '#0057B8', 'historic', 44, 'Estadio La Jarandete', 16000],
    ['Atlético Cabrilla', 'CLD', 'Cabrilla', '#00843D', '#000000', 'fan', 43, 'Nuevo Estadio Cabrilla', 15500],
    ['Atlético San Quintilla', 'QLA', 'San Quintilla', '#000000', '#FFD100', 'selling', 42, 'Estadio Valera', 17000],
    ['Atlético Valdemanes', 'VAQ', 'Valdemanes', '#001F5B', '#FFFFFF', 'selling', 42, 'Estadio Soredo', 15000],
    ['Calatón CF', 'CAE28', 'Calatón', '#0057B8', '#000000', 'fan', 40, 'Estadio Municipal de Calatón', 14000],
    [
      'Deportivo San Palomar',
      'PAB25',
      'San Palomar',
      '#000000',
      '#6A1B9A',
      'selling',
      40,
      'Nuevo Estadio San Palomar',
      15500,
    ],
    ['Unión Liorilla', 'LIM', 'Liorilla', '#6A1B9A', '#000000', 'youth', 39, 'Estadio Municipal de Liorilla', 13500],
    ['Juventud Rondeda', 'ROK', 'Rondeda', '#6A1B9A', '#0057B8', 'fan', 38, 'Estadio Municipal de Rondeda', 15000],
    ['Atlético Peñeda', 'PEU', 'Peñeda', '#E30613', '#6CACE4', 'fan', 37, 'Estadio Fragino', 13000],
    ['UD Albara', 'ALY46', 'Albara', '#001F5B', '#000000', 'fan', 37, 'Estadio La Lucilla', 12000],
    ['Racing Club Nueva Quintara', 'NUC', 'Nueva Quintara', '#6A1B9A', '#FFFFFF', 'fan', 37, 'Estadio Úbedino', 13500],
    ['UD Fuentino', 'FUH', 'Fuentino', '#6A1B9A', '#FFD100', 'fallen', 35, 'Estadio Segovosa', 10500],
    ['Real Club Olmedo', 'OLF', 'Olmedo', '#00843D', '#001F5B', 'historic', 35, 'Estadio La Piedero', 14000],
  ];
  FM.D.CLUBS_CS2 = [
    ['Ningzhou Cranes', 'NIN', 'Ningzhou', '#0057B8', '#6A1B9A', 'fan', 47, 'Ningzhou Sports Centre', 16000],
    ['Shantang FC', 'SHL', 'Shantang', '#FFD100', '#6CACE4', 'fan', 47, 'Shantang Sports Centre', 15500],
    ['Huamen United', 'HUA', 'Huamen', '#00843D', '#E30613', 'fallen', 45, 'Taang Arena', 17500],
    ['Fang FC', 'FAN', 'Fang', '#FFD100', '#000000', 'fan', 45, 'Fang Olympic Stadium', 18500],
    ['Ningcheng Evergreen', 'NIG', 'Ningcheng', '#6A1B9A', '#0057B8', 'fallen', 44, 'Ningcheng Sports Centre', 16000],
    ['Baotang FC', 'BAM35', 'Baotang', '#FFD100', '#000000', 'historic', 43, 'Gubin Arena', 18000],
    ['Xinyang Steel', 'XIN', 'Xinyang', '#000000', '#FFFFFF', 'selling', 43, 'Xinyang Sports Centre', 15500],
    ['Gyang United', 'GYC', 'Gyang', '#FFFFFF', '#E30613', 'selling', 41, 'Pingshan Arena', 13000],
    ['Meibin Heavy Industries', 'MEJ', 'Meibin', '#6A1B9A', '#000000', 'fan', 41, 'Meibin Olympic Stadium', 13500],
    ['Longang Evergreen', 'LOF', 'Longang', '#001F5B', '#FFFFFF', 'historic', 41, 'Longang Sports Centre', 16500],
    ['Taining United', 'TAH31', 'Taining', '#6A1B9A', '#00843D', 'fan', 40, 'Taigang Stadium', 15000],
    ['Meicheng United', 'MEK', 'Meicheng', '#000000', '#6A1B9A', 'fan', 39, 'Weyang Stadium', 16000],
    ['Yunmen Evergreen', 'YUN', 'Yunmen', '#6CACE4', '#6A1B9A', 'historic', 39, 'Ruicheng Arena', 12000],
    ['Dongang Heavy Industries', 'DOT', 'Dongang', '#00843D', '#001F5B', 'youth', 38, 'Dongang Sports Centre', 13500],
    ['Ruizhou Sports', 'RUI', 'Ruizhou', '#000000', '#FFD100', 'fan', 37, 'Xincheng Stadium', 10500],
    ['Xinshan Heavy Industries', 'XAA', 'Xinshan', '#E30613', '#00843D', 'fan', 36, 'Kaishan Stadium', 13500],
  ];
  FM.D.CLUBS_CO2 = [
    ['Real Fresnejo', 'FRP', 'Fresnejo', '#000000', '#001F5B', 'fan', 45, 'Estadio Ganda', 18500],
    [
      'Atlético San Valdemares',
      'VAT',
      'Valdemares',
      '#FFD100',
      '#00843D',
      'fan',
      44,
      'Ciudad Deportiva Valdemares',
      15500,
    ],
    ['Unión Jarandero', 'JAR', 'Jarandero', '#E30613', '#6CACE4', 'fan', 44, 'Estadio Elchena', 17500],
    ['Real Club Cuenera', 'CUD', 'Cuenera', '#E30613', '#6CACE4', 'selling', 43, 'Estadio Sorosa', 14500],
    ['Deportivo Ribanes', 'RIF', 'Ribanes', '#E30613', '#FFD100', 'historic', 42, 'Estadio Albino', 13000],
    ['Juventud Lucilla', 'LUF', 'Lucilla', '#0057B8', '#6CACE4', 'fan', 41, 'Ciudad Deportiva Lucilla', 14000],
    [
      'Deportivo Santa Valara',
      'VAU',
      'Santa Valara',
      '#001F5B',
      '#FFD100',
      'historic',
      40,
      'Estadio Municipal de Santa Valara',
      14000,
    ],
    ['Unión Palomar', 'PAC26', 'Palomar', '#0057B8', '#FFD100', 'fallen', 40, 'Campo de Palomar', 12500],
    ['Real Club Bajo Castera', 'BAN36', 'Castera', '#FFD100', '#000000', 'historic', 39, 'Estadio Segovanes', 13500],
    [
      'Racing Valdemilla',
      'VLA',
      'Valdemilla',
      '#E30613',
      '#00843D',
      'historic',
      38,
      'Estadio Municipal de Valdemilla',
      14000,
    ],
    ['Alto Jarandara Balompié', 'ALZ47', 'Jarandara', '#E30613', '#0057B8', 'youth', 38, 'Campo de Jarandara', 13500],
    ['Quintar CF', 'QUF', 'Quintar', '#0057B8', '#FFD100', 'youth', 37, 'Estadio Castedo', 11000],
    ['Sporting Santa Sepúlvón', 'SET', 'Sepúlvón', '#6CACE4', '#E30613', 'fallen', 36, 'Estadio La Valón', 13000],
    ['Real Unión Nerjeda', 'NEP', 'Nerjeda', '#000000', '#0057B8', 'fallen', 35, 'Campo de Nerjeda', 10500],
    ['Osunejo CF', 'OSE', 'Osunejo', '#00843D', '#6A1B9A', 'historic', 35, 'Nuevo Estadio Osunejo', 10000],
    ['Racing Quintiel', 'QUL', 'Quintiel', '#001F5B', '#6CACE4', 'fan', 33, 'Estadio Benaviel', 13500],
  ];
  FM.D.CLUBS_HR2 = [
    ['Liptica Sokol', 'LIQ', 'Liptica', '#FFD100', '#E30613', 'youth', 47, 'Stadion Radovac', 19000],
    ['Partizan Jasava', 'PAD27', 'Jasava', '#6CACE4', '#6A1B9A', 'fan', 45, 'Kraina Arena', 16500],
    ['NK Hradice', 'HRB', 'Hradice', '#0057B8', '#001F5B', 'fan', 44, 'Gradski Stadion Hradice', 18000],
    ['Torpedo Petik', 'TOK', 'Petik', '#00843D', '#000000', 'youth', 44, 'Stadion Mir Petik', 15000],
    ['Metalac Kosovice', 'MEM', 'Kosovice', '#FFD100', '#0057B8', 'historic', 43, 'Gradski Stadion Kosovice', 14500],
    ['Union Rybec', 'RYD', 'Rybec', '#E30613', '#001F5B', 'fan', 42, 'Dolnava Arena', 14500],
    ['Železničar Lubgrad', 'ZEJ', 'Lubgrad', '#001F5B', '#FFD100', 'youth', 40, 'Kosin Arena', 14000],
    ['Belovac Sokol', 'BEC26', 'Belovac', '#FFD100', '#001F5B', 'selling', 38, 'Belovac Park', 13500],
    ['Mladost Lubovo', 'MLC', 'Lubovo', '#FFFFFF', '#6A1B9A', 'historic', 37, 'Stadion Mir Lubovo', 14000],
    ['MFK Slaik', 'SLH', 'Slaik', '#FFD100', '#00843D', 'historic', 37, 'Kosovac Arena', 15500],
  ];
  FM.D.CLUBS_CY2 = [
    ['GS Thesánia', 'THK', 'Thesánia', '#6A1B9A', '#0057B8', 'historic', 41, 'Stadio Nikia', 16500],
    ['Apollon Trouli', 'TRO', 'Trouli', '#E30613', '#FFD100', 'historic', 40, 'Stadio Kypos', 14500],
    ['AO Ioanópetra', 'IOA', 'Ioanópetra', '#FFFFFF', '#6CACE4', 'selling', 39, 'Dimotiko Stadio Ioanópetra', 16000],
    ['Doxa Argópetra', 'ARQ', 'Argópetra', '#FFFFFF', '#6CACE4', 'fan', 39, 'Ethniko Stadio Argópetra', 14000],
    ['Panathlitikos Xanaki', 'XAI', 'Xanaki', '#6A1B9A', '#FFD100', 'fan', 38, 'Stadio Larouli', 11500],
    ['Panathlitikos Xanina', 'XAB', 'Xanina', '#6CACE4', '#6A1B9A', 'historic', 37, 'Ethniko Stadio Xanina', 15000],
    ['AO Trópoli', 'TRC', 'Trópoli', '#FFFFFF', '#00843D', 'historic', 36, 'Argikos Arena', 15000],
    ['PAE Lamina', 'LAW', 'Lamina', '#FFD100', '#000000', 'fallen', 36, 'Dimotiko Stadio Lamina', 14000],
    ['AE Trikos', 'TRD', 'Trikos', '#00843D', '#FFD100', 'youth', 35, 'Stadio Marouli', 10000],
    ['Niki Pelaki', 'PEV', 'Pelaki', '#E30613', '#00843D', 'selling', 34, 'Ethniko Stadio Pelaki', 11000],
    ['Niki Naxida', 'NAB25', 'Naxida', '#000000', '#FFD100', 'fan', 34, 'Ethniko Stadio Naxida', 14000],
    ['PAE Kypópetra', 'KYA', 'Kypópetra', '#00843D', '#0057B8', 'fallen', 33, 'Dimotiko Stadio Kypópetra', 9000],
    ['GS Palaiá Koria', 'PAE28', 'Palaiá Koria', '#00843D', '#000000', 'historic', 33, 'Stadio Pelouli', 9500],
    ['GS Kalánia', 'KAZ', 'Kalánia', '#0057B8', '#000000', 'selling', 32, 'Stadio Argia', 8500],
    ['Panathlitikos Laros', 'LAX', 'Laros', '#E30613', '#000000', 'fan', 31, 'Ethniko Stadio Laros', 11000],
    ['Doxa Agikos', 'AGI', 'Agikos', '#001F5B', '#FFFFFF', 'fan', 30, 'Kavás Arena', 9000],
  ];
  FM.D.CLUBS_CZ2 = [
    ['Spartak Olomov', 'SPU', 'Olomov', '#0057B8', '#00843D', 'fan', 50, 'Letní stadion Olomov', 19000],
    ['FC Mladín', 'MLN', 'Mladín', '#000000', '#6CACE4', 'fan', 50, 'Letní stadion Mladín', 18500],
    ['Viktoria Prostice', 'PRD', 'Prostice', '#FFFFFF', '#000000', 'historic', 50, 'Stadion u Douboná', 17000],
    ['TJ Sedice', 'SEU', 'Sedice', '#FFD100', '#00843D', 'fallen', 49, 'Letní stadion Sedice', 16500],
    ['Slavoj Olomená', 'OLO', 'Olomená', '#0057B8', '#001F5B', 'fallen', 48, 'Stadion u Strany', 15500],
    ['SK Olomín', 'OLG', 'Olomín', '#E30613', '#6A1B9A', 'selling', 47, 'Aréna Pelhená', 17000],
    ['TJ Branice', 'BRQ', 'Branice', '#6A1B9A', '#0057B8', 'fan', 47, 'Stadion Sedice', 19500],
    ['Sokol Hradov', 'HRV', 'Hradov', '#6A1B9A', '#FFD100', 'fan', 46, 'Stadion Pelhená', 18000],
    ['Sokol Pardov', 'PAF29', 'Pardov', '#00843D', '#FFD100', 'fan', 45, 'Městský stadion Pardov', 19000],
    ['Sparta Vsetíná', 'VSA', 'Vsetíná', '#0057B8', '#00843D', 'youth', 44, 'Stadion u Bohov', 18000],
    ['FK Lysoná', 'LYA', 'Lysoná', '#6A1B9A', '#6CACE4', 'selling', 44, 'Stadion Jabená', 14500],
    ['FK Nymava', 'NYA', 'Nymava', '#000000', '#FFD100', 'fan', 43, 'Stadion u Karany', 15500],
    ['FK Doubedov', 'DOV', 'Doubedov', '#6A1B9A', '#FFD100', 'historic', 42, 'Letní stadion Doubedov', 15500],
    ['1. FC Prostoná', 'PRG', 'Prostoná', '#6CACE4', '#000000', 'selling', 42, 'Aréna Vsetínany', 17500],
    ['Sokol Prostov', 'PRV', 'Prostov', '#000000', '#FFD100', 'fan', 40, 'Letní stadion Prostov', 14500],
    ['Spartak Pardice', 'SPW', 'Pardice', '#000000', '#001F5B', 'fan', 40, 'Stadion Trenov', 12000],
  ];
  FM.D.CLUBS_DK2 = [
    ['Brorud IL', 'BRR', 'Brorud', '#00843D', '#6CACE4', 'youth', 53, 'Åløkke Stadion', 20500],
    ['FC Ringsund', 'RIG', 'Ringsund', '#000000', '#E30613', 'selling', 52, 'Frerud Stadion', 19500],
    ['Havrud Fotball', 'HAA24', 'Havrud', '#6CACE4', '#000000', 'youth', 52, 'Askdal Park', 18500],
    ['Langø Boldklub', 'LAY', 'Langø', '#FFD100', '#001F5B', 'selling', 50, 'Langø Idrætsanlæg', 19500],
    ['Marlund IL', 'MAN36', 'Marlund', '#E30613', '#000000', 'historic', 50, 'Vestgård Park', 21500],
    ['FC Nylund', 'NYL', 'Nylund', '#0057B8', '#E30613', 'fallen', 49, 'Kilsund Park', 16500],
    ['Kiløkke IF', 'KIH', 'Kiløkke', '#001F5B', '#E30613', 'historic', 47, 'Storløkke Stadion', 18000],
    ['BK Havsund', 'HAB25', 'Havsund', '#0057B8', '#6A1B9A', 'fan', 47, 'Ålgård Idrætspark', 20000],
    ['Nynæs BK', 'NYN', 'Nynæs', '#6A1B9A', '#001F5B', 'historic', 45, 'Langløkke Stadion', 15000],
    ['Kilrud IF', 'KIJ', 'Kilrud', '#6CACE4', '#000000', 'historic', 45, 'Dalvang Stadion', 14500],
    ['Vestby FK', 'VEM', 'Vestby', '#000000', '#E30613', 'historic', 42, 'Stordal Stadion', 14500],
    ['BK Bjørngård', 'BJB', 'Bjørngård', '#6A1B9A', '#001F5B', 'historic', 42, 'Bjørngård Arena', 16500],
  ];
  FM.D.CLUBS_EC2 = [
    ['Orihejo Balompié', 'ORD', 'Orihejo', '#000000', '#0057B8', 'fallen', 46, 'Nuevo Estadio Orihejo', 16500],
    ['Racing Club Lucador', 'LUG', 'Lucador', '#0057B8', '#6CACE4', 'historic', 43, 'Estadio Calatedo', 17500],
    ['Pedino CF', 'PEW', 'Pedino', '#E30613', '#00843D', 'fan', 42, 'Estadio Plaseda', 17500],
    ['Frageda Atlético', 'FDA', 'Frageda', '#6A1B9A', '#FFD100', 'historic', 42, 'Estadio La Navador', 13500],
    ['Sporting Cabrador', 'CAF29', 'Cabrador', '#0057B8', '#FFFFFF', 'fan', 40, 'Estadio Municipal de Cabrador', 16500],
    ['Deportivo Bajo Piedino', 'BJC', 'Piedino', '#6CACE4', '#FFFFFF', 'fallen', 39, 'Estadio Cervara', 15500],
    ['Racing Arroera', 'ARS', 'Arroera', '#6A1B9A', '#E30613', 'selling', 38, 'Estadio Elchara', 14000],
    [
      'Atlético Santa Plasanes',
      'PLF',
      'Plasanes',
      '#001F5B',
      '#FFD100',
      'fan',
      37,
      'Estadio Municipal de Plasanes',
      12500,
    ],
    ['Real Club Escalador', 'ESH', 'Escalador', '#FFD100', '#6A1B9A', 'fan', 36, 'Estadio La Alcalanes', 13500],
    ['UD Torre Gandino', 'TON', 'Torre Gandino', '#00843D', '#FFD100', 'fallen', 35, 'Campo de Torre Gandino', 14500],
  ];
  FM.D.CLUBS_EG2 = [
    ['Al Nasr', 'ALA48', 'Talta', '#FFD100', '#6A1B9A', 'fan', 45, 'Talta Stadium', 17500],
    ['Al Najah', 'AAE', 'Manor', '#FFFFFF', '#E30613', 'youth', 44, 'Manor Sports City', 17500],
    ['Al Amal', 'ALB49', 'Nag Ismor', '#FFD100', '#001F5B', 'selling', 44, 'Nag Ismor Stadium', 15000],
    ['Al Hilal', 'ALC50', 'Benor', '#FFFFFF', '#0057B8', 'historic', 43, 'Mahiyah Stadium', 14000],
    ['Petro Kafr Assya', 'PEX', 'Kafr Assya', '#6A1B9A', '#000000', 'youth', 43, 'Kafr Assya Stadium', 15000],
    ['Al Zahra', 'ALD51', 'Sueta', '#00843D', '#0057B8', 'selling', 42, 'Sueta Stadium', 13500],
    ['Dakat Club', 'DAN', 'Dakat', '#00843D', '#E30613', 'fan', 42, 'Dakat Sports City', 15500],
    ['Al Wahda', 'ALE52', 'Zagta', '#E30613', '#0057B8', 'fan', 41, 'Zagta Sports City', 13000],
    ['Al Qenoura', 'ALF53', 'Qenoura', '#6CACE4', '#FFD100', 'selling', 41, 'Faut Stadium', 16000],
    ['Al Nahda', 'ALG54', 'Suut', '#6CACE4', '#E30613', 'fallen', 40, 'Suut Stadium', 16500],
    ['Al Nour', 'ANC', 'Minan', '#001F5B', '#FFD100', 'historic', 40, 'Maror Arena', 17000],
    ['Kafr Sidag Club', 'KAA24', 'Kafr Sidag', '#0057B8', '#000000', 'historic', 39, 'Ismta Stadium', 15000],
    ['Kafr Manor Club', 'KAB25', 'Kafr Manor', '#FFFFFF', '#000000', 'selling', 39, 'Idkia Arena', 16000],
    ['Minut SC', 'MIT', 'Minut', '#000000', '#00843D', 'fan', 38, 'Minut Stadium', 15500],
    ['Al Beni Luxoura SC', 'ABF', 'Luxoura', '#FFD100', '#001F5B', 'fan', 37, 'Luxoura Sports City', 13500],
    ['Talor Club', 'TAJ32', 'Talor', '#001F5B', '#0057B8', 'historic', 36, 'Talor Military Academy Stadium', 11000],
    ['Petro Dakut', 'PEO', 'Dakut', '#FFFFFF', '#00843D', 'fan', 35, 'Minat Arena', 12500],
    ['Kafr Minor SC', 'KFR', 'Kafr Minor', '#FFFFFF', '#0057B8', 'selling', 35, 'Aswut Arena', 11000],
    ['Al Ittihad', 'ALI', 'Abu Talag', '#6A1B9A', '#FFFFFF', 'fan', 35, 'Abu Talag Stadium', 11500],
    ['Maran SC', 'MAP37', 'Maran', '#E30613', '#001F5B', 'historic', 33, 'Maran Military Academy Stadium', 12500],
  ];
  FM.D.CLUBS_FI2 = [
    ['Vanha Siivaara FC', 'VAV', 'Siivaara', '#6CACE4', '#0057B8', 'fan', 39, 'Kauniemi Urheilupuisto', 16000],
    ['Liekka Pallo', 'LIX', 'Liekka', '#FFD100', '#000000', 'fan', 38, 'Kernen Stadion', 13000],
    ['FC Seikka', 'SEV', 'Seikka', '#FFD100', '#001F5B', 'fan', 37, 'Kuojoki Urheilupuisto', 15000],
    ['Pienikotkka JK', 'PIH', 'Pienikotkka', '#FFD100', '#E30613', 'fan', 35, 'Kerniemi Urheilupuisto', 11000],
    ['Tarmo Imalahti', 'TAK33', 'Imalahti', '#6A1B9A', '#E30613', 'youth', 35, 'Piesaari Urheilupuisto', 11000],
    ['FC Ouslahti', 'OUA', 'Ouslahti', '#FFD100', '#FFFFFF', 'fan', 32, 'Ouslahti Stadion', 12000],
    ['FC Ousvaara', 'OUB', 'Ousvaara', '#6CACE4', '#00843D', 'fallen', 32, 'Kuovaara Areena', 12500],
    ['Pyry Kajkylä', 'PYR', 'Kajkylä', '#00843D', '#001F5B', 'fan', 31, 'Karsaari Areena', 11000],
    ['Vanhavirlahti FC', 'VAI', 'Vanhavirlahti', '#000000', '#6A1B9A', 'fan', 29, 'Lapla Urheilupuisto', 8500],
    ['Sisu Savkoski', 'SIS', 'Savkoski', '#E30613', '#6CACE4', 'fan', 27, 'Virsaari Urheilupuisto', 11000],
  ];
  FM.D.CLUBS_GH2 = [
    ['Takase Porcupines', 'TAL34', 'Takase', '#FFD100', '#00843D', 'youth', 41, 'Takase Sports Stadium', 16000],
    ['Real Old Sekase', 'SEW', 'Sekase', '#6CACE4', '#000000', 'selling', 39, 'Yenmasi Arena', 12500],
    ['New Kase Heroes', 'KAC26', 'Kase', '#0057B8', '#E30613', 'historic', 39, 'Kase Sports Stadium', 12500],
    ['Dunora Heroes', 'DUC', 'Dunora', '#6A1B9A', '#001F5B', 'fan', 37, 'Sekondi Stadium', 15000],
    ['Akofu Porcupines', 'AKE', 'Akofu', '#0057B8', '#FFFFFF', 'historic', 37, 'Akofu Sports Stadium', 15000],
    ['Bolondi Heroes', 'BOV', 'Bolondi', '#E30613', '#000000', 'fan', 37, 'Bolondi Park', 12000],
    ['Lower Nkora Stars', 'NKO', 'Nkora', '#6CACE4', '#00843D', 'fan', 36, 'Kukam Arena', 11000],
    ['Dunho Porcupines', 'DUO', 'Dunho', '#0057B8', '#E30613', 'fallen', 36, 'Dunho Cultural Stadium', 15000],
    ['Real Kadi', 'KAD27', 'Kadi', '#6A1B9A', '#E30613', 'historic', 33, 'Kadi Park', 11000],
    ['Old Temasi Stars', 'TEM', 'Temasi', '#001F5B', '#FFFFFF', 'fan', 33, 'Base Stadium', 12000],
    ['Real Old Dunondi', 'DUD', 'Dunondi', '#001F5B', '#FFD100', 'youth', 32, 'Adondi Arena', 12500],
    ['Dunmasi Mighty United', 'DSI', 'Dunmasi', '#6CACE4', '#001F5B', 'selling', 32, 'Dunmasi Sports Stadium', 13000],
    ['Nkomale Stars', 'NKE', 'Nkomale', '#FFD100', '#E30613', 'historic', 32, 'Yenumu Stadium', 9500],
    ['Takra Hearts of Oak', 'TAM35', 'Takra', '#FFFFFF', '#6CACE4', 'selling', 31, 'Takra Park', 9000],
    ['Boladi Lions', 'BOI', 'Boladi', '#00843D', '#6A1B9A', 'historic', 30, 'Boladi Park', 10500],
    ['Union Kumu', 'KUM', 'Kumu', '#FFD100', '#00843D', 'historic', 29, 'Kumu Park', 10500],
  ];
  FM.D.CLUBS_GR2 = [
    ['AE Patópetra', 'PAG30', 'Patópetra', '#FFFFFF', '#0057B8', 'fan', 53, 'Mesia Arena', 18500],
    ['PAE Naxópoli', 'NAI', 'Naxópoli', '#6A1B9A', '#FFD100', 'historic', 52, 'Stadio Agos', 19500],
    ['AO Kavikos', 'KAE28', 'Kavikos', '#001F5B', '#0057B8', 'fan', 51, 'Ethniko Stadio Kavikos', 18500],
    ['Trina FC', 'TRG', 'Trina', '#6A1B9A', '#E30613', 'historic', 49, 'Dimotiko Stadio Trina', 19500],
    ['AO Mesás', 'MEN', 'Mesás', '#001F5B', '#FFFFFF', 'historic', 48, 'Patánia Arena', 19500],
    ['Maros FC', 'MAQ38', 'Maros', '#6A1B9A', '#E30613', 'fan', 47, 'Stadio Larópoli', 20000],
    ['AO Thesikos', 'THN', 'Thesikos', '#6CACE4', '#E30613', 'youth', 46, 'Ethniko Stadio Thesikos', 16500],
    ['Apollon Agópetra', 'AGO', 'Agópetra', '#FFD100', '#FFFFFF', 'selling', 45, 'Ethniko Stadio Agópetra', 19000],
    [
      'Kato Alexida FC',
      'KAF29',
      'Kato Alexida',
      '#FFFFFF',
      '#001F5B',
      'historic',
      43,
      'Dimotiko Stadio Kato Alexida',
      17000,
    ],
    [
      'Apollon Ágios Lamópoli',
      'AGS',
      'Ágios Lamópoli',
      '#FFD100',
      '#00843D',
      'selling',
      42,
      'Dimotiko Stadio Ágios Lamópoli',
      15000,
    ],
  ];
  FM.D.CLUBS_HU2 = [
    ['Veszeszeg VSC', 'VEP', 'Veszeszeg', '#00843D', '#FFFFFF', 'fan', 49, 'Dabeháza Aréna', 19500],
    ['Barekert Futball Club', 'BAP37', 'Barekert', '#00843D', '#6A1B9A', 'fallen', 49, 'Orsahegy Stadion', 16000],
    [
      'Gyönetelek Futball Club',
      'GYD',
      'Gyönetelek',
      '#6CACE4',
      '#001F5B',
      'selling',
      49,
      'Gyönetelek Városi Stadion',
      19500,
    ],
    ['Győró SC', 'GRM', 'Győró', '#6CACE4', '#E30613', 'historic', 49, 'Fehéraszeg Stadion', 20500],
    ['Veszelak TE', 'VEQ', 'Veszelak', '#000000', '#FFFFFF', 'selling', 47, 'Gyöneszeg Stadion', 19500],
    ['Kálefalva SC', 'KVB', 'Kálefalva', '#6CACE4', '#001F5B', 'fallen', 46, 'Kálefalva Városi Stadion', 16500],
    ['Veszafalva VSC', 'VET', 'Veszafalva', '#6CACE4', '#FFD100', 'selling', 46, 'Veszafalva Városi Stadion', 15000],
    ['FC Hajdehegy', 'HAC26', 'Hajdehegy', '#E30613', '#000000', 'fan', 45, 'Hajdehegy Sportpálya', 17000],
    ['Tiszaháza FC', 'TIS', 'Tiszaháza', '#0057B8', '#6A1B9A', 'fan', 44, 'Nagény Aréna', 15000],
    ['Nagykert FC', 'NAC26', 'Nagykert', '#00843D', '#FFD100', 'historic', 43, 'Nagykert Sportpálya', 14000],
    ['Felsőorsekert FC', 'FEL', 'Felsőorsekert', '#000000', '#0057B8', 'fan', 43, 'Rácekert Stadion', 16000],
    ['FC Orsény', 'ORE', 'Orsény', '#000000', '#FFFFFF', 'historic', 41, 'Barény Aréna', 13000],
    ['Gyönehegy SE', 'GYY', 'Gyönehegy', '#FFFFFF', '#000000', 'fallen', 41, 'Pászád Aréna', 16500],
    ['Kálaháza Sport Egylet', 'KZA', 'Kálaháza', '#00843D', '#001F5B', 'selling', 41, 'Nagyháza Stadion', 15500],
    ['Rácafalva Sport Egylet', 'RAQ', 'Rácafalva', '#6CACE4', '#0057B8', 'selling', 40, 'Fehérafalva Stadion', 17000],
    ['Rácehegy SC', 'RAU', 'Rácehegy', '#6CACE4', '#E30613', 'selling', 39, 'Rácehegy Sportpálya', 13000],
  ];
  FM.D.CLUBS_IN2 = [
    ['FC Aursaran', 'AUC', 'Aursaran', '#FFFFFF', '#FFD100', 'selling', 42, 'Aursaran Sports Complex', 13500],
    ['FC Patpally', 'PAH31', 'Patpally', '#000000', '#6CACE4', 'fan', 42, 'Patpally Municipal Stadium', 14500],
    ['Bandhar Wanderers', 'BAQ38', 'Bandhar', '#00843D', '#E30613', 'selling', 41, 'Naghalli Sports Park', 13500],
    ['Hubgarh FC', 'HUB', 'Hubgarh', '#6CACE4', '#E30613', 'fan', 40, 'Satwala Sports Park', 15000],
    ['Lucganj City', 'LUJ', 'Lucganj', '#001F5B', '#0057B8', 'fallen', 39, 'Lucganj Sports Complex', 14500],
    ['Old Aurgaon FC', 'AUN', 'Old Aurgaon', '#E30613', '#6CACE4', 'historic', 38, 'Old Aurgaon Sports Complex', 12500],
    ['Meerpet United', 'MEP', 'Meerpet', '#E30613', '#001F5B', 'selling', 37, 'Silpally Stadium', 13000],
    [
      'Port Silgarh United',
      'POX',
      'Port Silgarh',
      '#FFD100',
      '#001F5B',
      'fallen',
      35,
      'Port Silgarh Municipal Stadium',
      13500,
    ],
    ['Nagkheda United', 'NAD27', 'Nagkheda', '#FFFFFF', '#0057B8', 'selling', 35, 'Nagkheda Municipal Stadium', 14000],
    ['Sporting Indowala', 'INC', 'Indowala', '#0057B8', '#00843D', 'historic', 34, 'Patnbad Arena', 14000],
    ['FC Kolgaon', 'KOE', 'Kolgaon', '#FFFFFF', '#FFD100', 'fallen', 33, 'Ajmsaran Stadium', 10000],
    ['Sporting Banabad', 'BAR39', 'Banabad', '#000000', '#E30613', 'historic', 32, 'Banabad Sports Complex', 11500],
  ];
  FM.D.CLUBS_IR2 = [
    ['Shahrdari Shahr Rasdar', 'SHS', 'Rasdar', '#E30613', '#6A1B9A', 'fan', 45, 'Azadi Rasdar Stadium', 16500],
    ['Havadar Orumfahan', 'HAD27', 'Orumfahan', '#E30613', '#001F5B', 'historic', 44, 'Azadi Orumfahan Stadium', 17500],
    ['Sanat Tabtan', 'SAF29', 'Tabtan', '#6A1B9A', '#00843D', 'fan', 44, 'Azadi Tabtan Stadium', 16500],
    ['Havadar Ahvfahan', 'HAE28', 'Ahvfahan', '#001F5B', '#FFD100', 'youth', 43, 'Azadi Ahvfahan Stadium', 17500],
    ['Esteghlal Biriz', 'ESL', 'Biriz', '#FFD100', '#001F5B', 'fallen', 42, 'Biriz Takhti Stadium', 14500],
    ['Sanat Rasvin', 'SAG30', 'Rasvin', '#FFFFFF', '#6CACE4', 'youth', 42, 'Azadi Rasvin Stadium', 15500],
    ['Mes Sirjan', 'MSI', 'Sirjan', '#00843D', '#0057B8', 'fan', 41, 'Azadi Sirjan Stadium', 16500],
    ['Pas Qazfahan', 'PAJ32', 'Qazfahan', '#6A1B9A', '#00843D', 'fan', 40, 'Mashraz Sports Complex', 12500],
    ['Shahin Mashabad', 'SHT', 'Mashabad', '#001F5B', '#000000', 'fallen', 39, 'Azadi Mashabad Stadium', 13500],
    ['Naft Bandar Birshahr', 'NAE28', 'Birshahr', '#001F5B', '#6CACE4', 'fan', 39, 'Birshahr Takhti Stadium', 14000],
    ['Esteghlal Mashshahr', 'ESM', 'Mashshahr', '#001F5B', '#6CACE4', 'youth', 39, 'Orumraz Sports Complex', 16500],
    ['Sanat Yazfahan', 'SAH31', 'Yazfahan', '#E30613', '#000000', 'youth', 37, 'Qazaz Stadium', 13000],
    ['Sanat Qazaz', 'SAJ32', 'Qazaz', '#00843D', '#001F5B', 'youth', 37, 'Azadi Qazaz Stadium', 12500],
    [
      'Mohammedan Dasht Reydan',
      'MOA24',
      'Dasht Reydan',
      '#00843D',
      '#FFFFFF',
      'fan',
      37,
      'Azadi Dasht Reydan Stadium',
      12500,
    ],
    ['Sanat Shahr Kermud', 'SAK33', 'Kermud', '#FFD100', '#000000', 'fan', 36, 'Azadi Kermud Stadium', 11500],
    ['Sepahan Bushriz', 'SEX', 'Bushriz', '#00843D', '#FFFFFF', 'fan', 35, 'Mashshahr Stadium', 11000],
    ['Paykan Orumijan', 'PAO', 'Orumijan', '#000000', '#E30613', 'fan', 35, 'Azadi Orumijan Stadium', 13500],
    ['Pas Bushjan', 'PAK33', 'Bushjan', '#6CACE4', '#6A1B9A', 'selling', 34, 'Azadi Bushjan Stadium', 9500],
  ];
  FM.D.CLUBS_IE2 = [
    ['Trambridge Rovers', 'TRH', 'Trambridge', '#6CACE4', '#00843D', 'historic', 46, 'Trambridge Lawn', 15000],
    ['Balglass Wanderers', 'BAS40', 'Balglass', '#001F5B', '#0057B8', 'historic', 45, 'Ballydrum Road', 17500],
    ['Newmullen Rovers', 'NEQ', 'Newmullen', '#6CACE4', '#00843D', 'historic', 44, 'Orangar Road', 16000],
    ['Lower Tubmore City', 'TUC', 'Lower Tubmore', '#6A1B9A', '#E30613', 'fallen', 42, 'Lower Tubmore Park', 15500],
    [
      'Port Glendara City',
      'POY',
      'Port Glendara',
      '#0057B8',
      '#000000',
      'selling',
      42,
      'Port Glendara Showgrounds',
      15000,
    ],
    [
      'Wickmullen Shamrocks',
      'WID',
      'Wickmullen',
      '#6CACE4',
      '#000000',
      'historic',
      40,
      'Wickmullen Showgrounds',
      16500,
    ],
    ['Malree Shamrocks', 'MAR39', 'Malree', '#0057B8', '#E30613', 'youth', 38, 'Malree Oval', 13500],
    ['Upper Casard Shamrocks', 'CAG30', 'Casard', '#FFD100', '#FFFFFF', 'fan', 37, 'Casard Park', 12000],
    ['Enndrum Town', 'ENN', 'Enndrum', '#000000', '#0057B8', 'youth', 36, 'Clonree Road', 12500],
    ['Port Mullmullen City', 'PRH', 'Port Mullmullen', '#E30613', '#FFFFFF', 'historic', 35, 'Dromkenny Street', 10000],
  ];
  FM.D.CLUBS_IL2 = [
    ['Hapoel Ashya', 'HAF29', 'Ashya', '#0057B8', '#00843D', 'youth', 42, 'Ganayim Stadium', 15000],
    ['Hapoel Kiryat Kiron', 'HAG30', 'Kiryat Kiron', '#6A1B9A', '#0057B8', 'fan', 40, 'Petahat Arena', 16500],
    ['Maccabi Dimon', 'MAS40', 'Dimon', '#FFFFFF', '#000000', 'selling', 40, 'Sderia Arena', 16000],
    [
      'FC Kiryat Kirot',
      'KIM',
      'Kiryat Kirot',
      '#E30613',
      '#00843D',
      'fallen',
      39,
      'Kiryat Kirot Municipal Stadium',
      13500,
    ],
    ['Hapoel Kirel', 'HEF', 'Kirel', '#6CACE4', '#001F5B', 'selling', 39, 'Yavon Arena', 16500],
    ['Maccabi Netanat', 'MAT41', 'Netanat', '#0057B8', '#000000', 'selling', 37, 'Netanel Arena', 13000],
    ['Ironi Tirel', 'IRO', 'Tirel', '#0057B8', '#FFFFFF', 'selling', 36, 'Tirel Municipal Stadium', 14500],
    ['Hapoel Modot United', 'HAH31', 'Modot', '#FFD100', '#6CACE4', 'fan', 36, 'Modot Municipal Stadium', 13500],
    ['Hapoel Orim', 'HAJ32', 'Orim', '#FFFFFF', '#0057B8', 'fan', 36, 'Rishot Arena', 11500],
    ['Bnei Ashel', 'BNA', 'Ashel', '#001F5B', '#000000', 'fan', 35, 'Rehovit Stadium', 13000],
    ['Bnei Kfarar', 'BNI', 'Kfarar', '#6A1B9A', '#FFD100', 'historic', 33, 'Hadon Arena', 10500],
    ['Maccabi Ashot', 'MAU42', 'Ashot', '#00843D', '#E30613', 'fan', 33, 'Kiria Stadium', 12500],
    ['Maccabi Tirya', 'MBD', 'Tirya', '#00843D', '#FFD100', 'fallen', 32, 'Tirya Municipal Stadium', 10000],
    ['Hapoel Telat United', 'HAK33', 'Telat', '#001F5B', '#6CACE4', 'fan', 31, 'Zichayim Arena', 11000],
    ['Beitar Telot', 'BED27', 'Telot', '#001F5B', '#0057B8', 'fan', 30, 'Sports Park Telot', 11500],
    ['Bnei Kfarel', 'BNK', 'Kfarel', '#E30613', '#00843D', 'fan', 30, 'Batya Arena', 9000],
  ];
  FM.D.CLUBS_KE2 = [
    ['Port Kisuni United', 'POA24', 'Kisuni', '#E30613', '#0057B8', 'fan', 35, 'Kisuni Sports Ground', 13500],
    ['Katali Bandari', 'KAG30', 'Katali', '#E30613', '#6CACE4', 'fan', 34, 'Katali Showground', 10500],
    ['Nanongo Posta', 'NAF29', 'Nanongo', '#0057B8', '#FFFFFF', 'historic', 34, 'Nanongo Sports Ground', 9500],
    ['Burongo Posta', 'BUT', 'Burongo', '#FFD100', '#6A1B9A', 'fan', 34, 'Wanali Grounds', 10000],
    ['Lake Kibaka Prisons', 'LAZ', 'Kibaka', '#00843D', '#0057B8', 'selling', 32, 'Kibaka Showground', 8500],
    ['Lake Kisese Stars', 'LAA24', 'Lake Kisese', '#6A1B9A', '#FFD100', 'fan', 32, 'Lake Kisese Sports Ground', 11500],
    ['Mount Masindi Prisons', 'MOB25', 'Masindi', '#00843D', '#001F5B', 'historic', 32, 'Nakali Stadium', 11500],
    ['AFC Mount Kibali', 'MOC26', 'Kibali', '#E30613', '#0057B8', 'historic', 31, 'Kibali Grounds', 11000],
    ['Port Mwese United', 'POB25', 'Port Mwese', '#E30613', '#000000', 'historic', 30, 'Port Mwese Showground', 11500],
    ['Mwumba Heroes', 'MWU', 'Mwumba', '#00843D', '#001F5B', 'fan', 30, 'Katini Grounds', 9500],
    ['Lower Makali Prisons', 'MAV43', 'Makali', '#000000', '#001F5B', 'fan', 29, 'Makali Municipal Stadium', 8500],
    ['Upper Masese Homeboyz', 'MAW44', 'Masese', '#FFFFFF', '#FFD100', 'historic', 29, 'Masese Sports Ground', 11500],
    ['AFC Loduni', 'LOG', 'Loduni', '#6CACE4', '#FFD100', 'fan', 29, 'Loduni Showground', 9000],
    ['Rukuni Posta', 'RUK', 'Rukuni', '#E30613', '#000000', 'fan', 28, 'Rukuni Showground', 8500],
    ['Mbalongo United', 'MBF', 'Mbalongo', '#FFD100', '#00843D', 'fan', 27, 'Mbalongo Sports Ground', 10000],
    ['Kiboro Allstars', 'KIP', 'Kiboro', '#6CACE4', '#FFD100', 'historic', 26, 'Malere Grounds', 9000],
    ['Mount Korumba Stars', 'MNC', 'Mount Korumba', '#001F5B', '#E30613', 'youth', 26, 'Mutini Stadium', 7500],
    ['Samali Allstars', 'SAL34', 'Samali', '#E30613', '#001F5B', 'fan', 25, 'Samali Municipal Stadium', 8500],
    ['Makere FC', 'MRA', 'Makere', '#FFD100', '#00843D', 'fan', 24, 'Samoro Grounds', 5500],
    ['Lake Gatia Posta', 'LKE', 'Lake Gatia', '#E30613', '#FFFFFF', 'fan', 24, 'Oyumba Grounds', 6500],
  ];
  FM.D.CLUBS_MY2 = [
    ['Pelita Mas Harimau', 'PEY', 'Pelita Mas', '#6CACE4', '#001F5B', 'youth', 46, 'Stadium Pelita Mas', 16000],
    ['Permata Sari United', 'PEZ', 'Permata Sari', '#E30613', '#6CACE4', 'historic', 45, 'Stadium Indah Mas', 16000],
    ['FC Permata Jaya', 'PTA', 'Permata Jaya', '#FFD100', '#001F5B', 'selling', 43, 'Stadium Permata Jaya', 17000],
    ['PDRM Rimba Mas', 'PDR', 'Rimba Mas', '#6A1B9A', '#000000', 'fan', 43, 'Stadium Bandaraya Rimba Mas', 17000],
    ['FC Bayu Mas', 'BAT41', 'Bayu Mas', '#00843D', '#0057B8', 'historic', 42, 'Stadium Bayu Mas', 14000],
    ['FC Indah Jaya', 'INH', 'Indah Jaya', '#FFFFFF', '#E30613', 'historic', 41, 'Stadium Mutiara Baru', 15000],
    ['Selasih Utama City', 'SEZ', 'Selasih Utama', '#6A1B9A', '#001F5B', 'fan', 40, 'Cempaka Utama Arena', 14500],
    [
      'Permata Utama FC',
      'PEA24',
      'Permata Utama',
      '#6A1B9A',
      '#000000',
      'selling',
      39,
      'Stadium Bandaraya Permata Utama',
      13000,
    ],
    ['Sri Seri Mas', 'SRA', 'Seri Mas', '#FFD100', '#000000', 'historic', 38, 'Stadium Seri Mas', 15000],
    [
      'Damai Sari United',
      'DAP',
      'Damai Sari',
      '#001F5B',
      '#0057B8',
      'historic',
      37,
      'Stadium Bandaraya Damai Sari',
      13000,
    ],
    ['Pelita Jaya FA', 'PEB25', 'Pelita Jaya', '#FFFFFF', '#0057B8', 'fan', 37, 'Stadium Majlis Pelita Jaya', 14000],
    ['Melati Sari Utara', 'MEQ', 'Melati Sari', '#6A1B9A', '#0057B8', 'historic', 35, 'Stadium Melati Baru', 14000],
    ['Seri Utama Selatan', 'SEA24', 'Seri Utama', '#6A1B9A', '#FFD100', 'fan', 34, 'Stadium Cempaka Indah', 13000],
    ['Seri Baru FC', 'SBF', 'Seri Baru', '#E30613', '#6A1B9A', 'fan', 34, 'Stadium Bandaraya Seri Baru', 10000],
  ];
  FM.D.CLUBS_MX2 = [
    ['Universidad de Tecetzin', 'UNB', 'Tecetzin', '#000000', '#6CACE4', 'youth', 59, 'Estadio Mixelán', 23500],
    [
      'Universidad de Cuauchitlán',
      'UND',
      'Cuauchitlán',
      '#00843D',
      '#FFD100',
      'selling',
      59,
      'Estadio La Jilopan',
      23500,
    ],
    ['Club Papanatlán', 'PAL34', 'Papanatlán', '#0057B8', '#001F5B', 'fan', 58, 'Estadio Ahutlán', 23500],
    ['Club Deportivo Coatepec', 'COQ', 'Coatepec', '#FFFFFF', '#6CACE4', 'fan', 58, 'Estadio Chaletzin', 23000],
    ['Yauco Atlético', 'YAU', 'Yauco', '#001F5B', '#FFD100', 'fan', 57, 'Estadio Olímpico de Yauco', 22500],
    [
      'Club Deportivo Zacatl',
      'ZAJ',
      'Zacatl',
      '#00843D',
      '#001F5B',
      'selling',
      57,
      'Estadio Olímpico de Zacatl',
      22500,
    ],
    ['Deportivo Coatichitlán', 'CAH31', 'Coatichitlán', '#FFD100', '#001F5B', 'historic', 55, 'Estadio Cuerepa', 22000],
    ['Toros de Ocotahua', 'TOS', 'Ocotahua', '#6CACE4', '#001F5B', 'fan', 55, 'Estadio Olímpico de Ocotahua', 22500],
    [
      'Halcones de Cuautzin',
      'HAL34',
      'Cuautzin',
      '#00843D',
      '#6A1B9A',
      'fallen',
      54,
      'Estadio Municipal de Cuautzin',
      20000,
    ],
    ['Ocotopa FC', 'OCC', 'Ocotopa', '#FFD100', '#6CACE4', 'fan', 54, 'Estadio Municipal de Ocotopa', 19500],
    ['Azucareros de Xaletepec', 'AZU', 'Xaletepec', '#FFFFFF', '#000000', 'fan', 53, 'Estadio Huitepec', 22500],
    ['Lobos Tampec', 'LOH', 'Tampec', '#6A1B9A', '#FFFFFF', 'selling', 51, 'Estadio Cuaupa', 19500],
    ['Club Deportivo Uruchitlán', 'URC', 'Uruchitlán', '#000000', '#0057B8', 'youth', 51, 'Estadio Xalopa', 21500],
    ['Urupan FC', 'URN', 'Urupan', '#001F5B', '#FFD100', 'historic', 51, 'Estadio Municipal de Urupan', 18500],
    ['Venados de Ocotepa', 'VEU', 'Ocotepa', '#00843D', '#6A1B9A', 'fallen', 50, 'Estadio Ahutepec', 18000],
    ['Club Yaucatl', 'YAL', 'Yaucatl', '#FFFFFF', '#00843D', 'selling', 49, 'Estadio Tampec', 18500],
  ];
  FM.D.CLUBS_MA2 = [
    ['US Mekali', 'MEU', 'Mekali', '#000000', '#6A1B9A', 'fan', 51, 'Stade Municipal de Mekali', 18500],
    ['Olympique Oular', 'OLH', 'Oular', '#FFD100', '#E30613', 'fan', 50, 'Stade Mekia', 18000],
    ['Union Sportive Ain Mekek', 'SPX', 'Mekek', '#000000', '#6A1B9A', 'fallen', 49, 'Grand Stade de Mekek', 16000],
    ['Chabab Ben Tifad', 'CHD27', 'Tifad', '#0057B8', '#FFFFFF', 'historic', 49, 'Stade Benane', 17500],
    ['US Ain Midat', 'AIB', 'Midat', '#00843D', '#FFFFFF', 'fallen', 48, 'Grand Stade de Midat', 19000],
    ['SC Oued Tetine', 'OUE', 'Oued Tetine', '#00843D', '#6A1B9A', 'youth', 48, 'Grand Stade de Oued Tetine', 16000],
    ['Chabab Ain Tetat', 'CHE28', 'Ain Tetat', '#FFFFFF', '#6A1B9A', 'fan', 47, 'Grand Stade de Ain Tetat', 19000],
    ['US Oujek', 'OUJ', 'Oujek', '#FFFFFF', '#6A1B9A', 'youth', 47, 'Stade Mekoun', 16000],
    [
      'US Sidi Safane',
      'SIJ',
      'Sidi Safane',
      '#FFD100',
      '#000000',
      'selling',
      45,
      'Stade Municipal de Sidi Safane',
      17500,
    ],
    ['Union Khaat', 'KHD', 'Khaat', '#6CACE4', '#00843D', 'fallen', 44, 'Stade Tifia', 15000],
    ['SC Beria', 'BEE28', 'Beria', '#6CACE4', '#000000', 'selling', 44, 'Complexe Sportif Beria', 18500],
    ['Union Sportive Ifrane', 'SPY', 'Ifrane', '#FFD100', '#FFFFFF', 'fallen', 44, 'Grand Stade de Ifrane', 17500],
    ['Olympique Oujali el Jadida', 'OLJ', 'Oujali el Jadida', '#E30613', '#FFFFFF', 'youth', 43, 'Stade Tifoun', 14500],
    ['Olympique Oujat', 'OOU', 'Oujat', '#0057B8', '#6CACE4', 'fan', 42, 'Stade Municipal de Oujat', 17000],
    ['Chabab Sidi Khaouan', 'CHF29', 'Khaouan', '#000000', '#001F5B', 'fallen', 40, 'Stade Oulali', 16500],
    ['Union Sportive Ifrira', 'SIQ', 'Ifrira', '#00843D', '#6A1B9A', 'selling', 39, 'Grand Stade de Ifrira', 11500],
  ];
  FM.D.CLUBS_NG2 = [
    ['Ogbadan Lions', 'OGB', 'Ogbadan', '#001F5B', '#6A1B9A', 'fan', 50, 'Onderri Arena', 17000],
    ['Osha Pillars FC', 'OSH', 'Osha', '#00843D', '#E30613', 'historic', 50, 'Osha Independence Stadium', 20500],
    ['Shooting Maozo', 'SHV', 'Maozo', '#E30613', '#FFFFFF', 'fan', 49, 'Maozo Independence Stadium', 18500],
    ['Umuna United', 'UMB', 'Umuna', '#FFD100', '#000000', 'fallen', 49, 'Kanerri Stadium', 20500],
    ['Owa Warriors', 'OWA', 'Owa', '#FFFFFF', '#6CACE4', 'historic', 47, 'Ondede Stadium', 17000],
    ['Awkure Rovers', 'AWC', 'Awkure', '#E30613', '#0057B8', 'fallen', 46, 'Awkure Township Stadium', 18500],
    ['Old Oworin Pillars', 'OWO', 'Oworin', '#6A1B9A', '#001F5B', 'youth', 46, 'Abgun Arena', 15500],
    ['Iluko Giants', 'ILU', 'Iluko', '#6CACE4', '#0057B8', 'fan', 46, 'Maorin Stadium', 15500],
    ['Shooting New Nserri', 'SNG', 'Nserri', '#FFFFFF', '#6CACE4', 'fan', 46, 'Nserri Township Stadium', 14500],
    ['Badwa United', 'BAU42', 'Badwa', '#E30613', '#FFFFFF', 'fan', 45, 'Badara Stadium', 15500],
    ['Kadibo Stars', 'KAH31', 'Kadibo', '#FFD100', '#000000', 'fan', 45, 'Kadibo Sports Complex', 18500],
    ['Owano Pillars FC', 'ONO', 'Owano', '#E30613', '#00843D', 'fan', 44, 'Badibo Arena', 16000],
    ['Owibo Wolves', 'OWI', 'Owibo', '#6A1B9A', '#E30613', 'fan', 43, 'Owibo Township Stadium', 17000],
    ['Union Mairi', 'MRI', 'Mairi', '#FFD100', '#0057B8', 'historic', 42, 'Awkibo Arena', 14000],
    ['Sagara Giants', 'SAM35', 'Sagara', '#6A1B9A', '#FFD100', 'historic', 42, 'Ikure Stadium', 13000],
    [
      'Lower Akegun Heartland',
      'AKF',
      'Akegun',
      '#FFD100',
      '#00843D',
      'historic',
      42,
      'Akegun Independence Stadium',
      15000,
    ],
    ['Old Saguko Eagles', 'SAN36', 'Saguko', '#FFD100', '#FFFFFF', 'fan', 40, 'Josozo Stadium', 15000],
    ['Nsano United', 'NSA', 'Nsano', '#E30613', '#6A1B9A', 'fan', 40, 'Nsano Independence Stadium', 15000],
    ['New Ilozo Eagles', 'ILO', 'Ilozo', '#6A1B9A', '#001F5B', 'fan', 39, 'Ilozo Sports Complex', 12500],
    ['Union Edede', 'EDA', 'Edede', '#FFD100', '#FFFFFF', 'selling', 38, 'Edede Independence Stadium', 12500],
  ];
  FM.D.CLUBS_NI2 = [
    ['Harthorpe United', 'HAM35', 'Harthorpe', '#FFD100', '#001F5B', 'fan', 36, 'Malby Park', 13000],
    ['Old Fenwich Ironworks', 'FEA', 'Fenwich', '#0057B8', '#FFD100', 'fallen', 35, 'Fenwich Ground', 14500],
    ['Watborough Villa', 'WAK', 'Watborough', '#000000', '#0057B8', 'youth', 35, 'Branholm Green', 14000],
    ['Flitsey Athletic', 'FLA', 'Flitsey', '#E30613', '#000000', 'youth', 32, 'The Asholm Stadium', 8500],
    ['Great Melchester Foundry', 'GRQ', 'Melchester', '#0057B8', '#FFD100', 'fan', 32, 'The Norford Stadium', 12000],
    ['Merwold Foundry', 'MEV', 'Merwold', '#00843D', '#FFFFFF', 'youth', 31, 'Oakley Green', 13000],
    ["Reaby St. Mary's", 'REK', 'Reaby', '#6A1B9A', '#00843D', 'fan', 29, 'Yeofield Field', 8500],
    ['Lower Kesley Hotspur', 'KES', 'Kesley', '#0057B8', '#FFD100', 'fan', 29, 'Bromchester Lane', 7500],
    ['Oxham Works', 'OXH', 'Oxham', '#6A1B9A', '#6CACE4', 'fan', 28, 'Oxham Park', 9500],
    ['Upper Oakthorpe Town', 'OAK', 'Oakthorpe', '#E30613', '#00843D', 'fan', 27, 'Chalhaven Green', 9500],
    ['Whitford & Hallam', 'WHA', 'Whitford', '#FFFFFF', '#0057B8', 'fan', 26, 'Torbrook Green', 10000],
    ['Epmouth Albion', 'EPM', 'Epmouth', '#0057B8', '#000000', 'historic', 25, 'Densea Lane', 5500],
  ];
  FM.D.CLUBS_PY2 = [
    ['Club Atlético Villa Molez', 'MOD27', 'Villa Molez', '#FFFFFF', '#001F5B', 'fallen', 42, 'Estadio Pueseda', 16500],
    ['Franini FC', 'FRI', 'Franini', '#FFD100', '#00843D', 'selling', 42, 'Estadio Lezero', 13500],
    ['Feria FC', 'FEB', 'Feria', '#E30613', '#FFFFFF', 'fallen', 42, 'Estadio Monumental Belui', 13000],
    ['Nacional Alverano', 'NAG30', 'Alverano', '#FFD100', '#0057B8', 'fallen', 41, 'Estadio Urqeda', 14500],
    ['Atlético Pelleda', 'PDA', 'Pelleda', '#00843D', '#0057B8', 'fan', 41, 'Estadio Mirez', 15500],
    ['Club Sportivo Lavini', 'LAB25', 'Lavini', '#6A1B9A', '#FFD100', 'selling', 39, 'Cancha de Lavini', 12000],
    ['Nacional Torini', 'NTO', 'Torini', '#0057B8', '#000000', 'fan', 39, 'Cancha de Torini', 14500],
    ['Club de Regatas Ferilla', 'REL', 'Ferilla', '#6CACE4', '#000000', 'fan', 38, 'Cancha de Ferilla', 13000],
    ['Atlético Herón', 'HEG', 'Herón', '#6CACE4', '#E30613', 'fan', 37, 'Estadio Puesano', 15000],
    ['Castui FC', 'CUI', 'Castui', '#0057B8', '#001F5B', 'historic', 36, 'Cancha de Castui', 11000],
    ['Club Sportivo Arrona', 'ANE', 'Arrona', '#6A1B9A', '#6CACE4', 'fan', 36, 'Estadio Sarilla', 12500],
    ['Atlético Orto', 'ORT', 'Orto', '#FFD100', '#000000', 'fan', 35, 'Cancha de Orto', 14000],
    [
      'Club Atlético Unión Quirar',
      'QAA',
      'Quirar',
      '#FFD100',
      '#6CACE4',
      'historic',
      35,
      'Estadio Monumental Quiria',
      14500,
    ],
    [
      'Racing de Ferón del Sur',
      'FOD',
      'Ferón del Sur',
      '#E30613',
      '#001F5B',
      'fan',
      34,
      'Estadio Municipal de Ferón del Sur',
      12500,
    ],
    ['Gimnasia de Hereda', 'HEJ', 'Hereda', '#FFD100', '#6CACE4', 'selling', 33, 'Estadio Monumental Heras', 11000],
    ['Club de Regatas Ortilla', 'RAV', 'Ortilla', '#6A1B9A', '#6CACE4', 'fallen', 33, 'Estadio Alverez', 12000],
  ];
  FM.D.CLUBS_PE2 = [
    ['Oñatador Balompié', 'ONB', 'Oñatador', '#00843D', '#FFFFFF', 'historic', 44, 'Campo de Oñatador', 17500],
    ['CD Alto Bailete', 'ALH55', 'Bailete', '#6CACE4', '#E30613', 'youth', 43, 'Nuevo Estadio Bailete', 15500],
    ['Real Club Villa Montera', 'MOE28', 'Montera', '#6A1B9A', '#000000', 'fan', 42, 'Estadio La Sora', 15000],
    ['Villón CF', 'VIA24', 'Villón', '#000000', '#001F5B', 'youth', 41, 'Nuevo Estadio Villón', 15500],
    ['Unión Cerro Gandanes', 'CEE', 'Cerro Gandanes', '#6CACE4', '#6A1B9A', 'youth', 40, 'Estadio Fragón', 13000],
    ['Santa Moralilla Balompié', 'MOF29', 'Moralilla', '#001F5B', '#6A1B9A', 'fan', 39, 'Estadio La Lucera', 14500],
    ['Real Valedo', 'VAO', 'Valedo', '#FFFFFF', '#6A1B9A', 'fan', 38, 'Estadio La Segovino', 15000],
    ['Real Fresnón', 'FRQ', 'Fresnón', '#0057B8', '#6A1B9A', 'fallen', 38, 'Estadio La Osunejo', 11500],
    ['Juventud Liorana', 'LIY', 'Liorana', '#001F5B', '#FFFFFF', 'selling', 37, 'Estadio Bailino', 11500],
    ['Atlético Lermanes', 'LES', 'Lermanes', '#000000', '#FFFFFF', 'fallen', 36, 'Campo de Lermanes', 12500],
    ['Atlético Nueva Fresna', 'NUD', 'Fresna', '#001F5B', '#FFD100', 'fan', 36, 'Estadio Municipal de Fresna', 12000],
    ['Atlético Albar', 'ALJ56', 'Albar', '#0057B8', '#6CACE4', 'fan', 36, 'Estadio La Calatedo', 14500],
    ['Juventud Bailares', 'BAV43', 'Bailares', '#FFD100', '#E30613', 'selling', 34, 'Estadio Cabrera', 14000],
    ['Deportivo Cuenana', 'CUF', 'Cuenana', '#00843D', '#6A1B9A', 'fan', 33, 'Estadio La Medares', 11000],
    ['Sporting Fragana', 'FNA', 'Fragana', '#00843D', '#E30613', 'youth', 33, 'Ciudad Deportiva Fragana', 14000],
    ['Olmera CF', 'OLL', 'Olmera', '#E30613', '#6CACE4', 'youth', 32, 'Estadio La Benavete', 9500],
  ];
  FM.D.CLUBS_QA2 = [
    ['Al Saqr', 'ALK57', 'Salra', '#000000', '#0057B8', 'fan', 45, 'Salra Sports City', 17500],
    ['Al Bahr', 'ABG', 'Irbya', '#6A1B9A', '#001F5B', 'fan', 43, 'Prince Ramah Stadium', 16000],
    ['Al Sahab', 'ASJ', 'Muhayn', '#6A1B9A', '#000000', 'fan', 42, 'Muhayn Stadium', 13500],
    ['Wadi Musra Club', 'WAM', 'Wadi Musra', '#000000', '#FFD100', 'selling', 40, 'Prince Nakra Stadium', 14000],
    ['Al Wahat', 'AWD', 'Khasayn', '#00843D', '#001F5B', 'fan', 38, 'Dhar Arena', 13500],
    ['Rifiq SC', 'RIH', 'Rifiq', '#6CACE4', '#0057B8', 'historic', 37, 'Prince Nizar Stadium', 15500],
    ['Musayn SC', 'MUS', 'Musayn', '#6CACE4', '#000000', 'fan', 35, 'Jerar Stadium', 11000],
    ['Al Falah', 'ALL58', 'Shinayn', '#000000', '#001F5B', 'historic', 34, 'Prince Falar Stadium', 13500],
  ];
  FM.D.CLUBS_RO2 = [
    ['Petrolul Fagești', 'PUD', 'Fagești', '#6A1B9A', '#00843D', 'fan', 46, 'Arena Zalău', 19500],
    ['Dinamo Driu', 'DIM', 'Driu', '#000000', '#00843D', 'fallen', 44, 'Stadionul Orășenesc Driu', 18000],
    ['AFC Mare Drița', 'MAX45', 'Drița', '#FFFFFF', '#000000', 'fan', 44, 'Complexul Sportiv Drița', 17500],
    ['Gloria Camiu', 'GLO', 'Camiu', '#000000', '#6A1B9A', 'selling', 44, 'Arena Oreni', 14000],
    ['Progresul Mare Timița', 'PRL', 'Timița', '#6A1B9A', '#00843D', 'youth', 43, 'Stadionul Orășenesc Timița', 13500],
    ['Victoria Mare Hunești', 'MAY46', 'Mare Hunești', '#00843D', '#6CACE4', 'selling', 42, 'Stadionul Tulești', 17500],
    ['FC Nou Breni', 'NOQ', 'Breni', '#E30613', '#FFFFFF', 'fallen', 42, 'Complexul Sportiv Breni', 13500],
    ['Electroputere Miova', 'ELE', 'Miova', '#FFFFFF', '#E30613', 'fallen', 41, 'Complexul Sportiv Miova', 12500],
    ['Victoria Nou Coneni', 'NOS', 'Coneni', '#FFD100', '#FFFFFF', 'historic', 41, 'Stadionul Timiu', 13000],
    ['Gloria Argești', 'GLB', 'Argești', '#6A1B9A', '#FFD100', 'historic', 41, 'Complexul Sportiv Argești', 14500],
    ['Bacești FC', 'BAW44', 'Bacești', '#FFD100', '#0057B8', 'fan', 40, 'Stadionul Zalești', 12500],
    ['AFC Drana', 'DRB', 'Drana', '#001F5B', '#FFD100', 'fan', 39, 'Stadionul Orășenesc Drana', 14000],
    ['Progresul Miești', 'PRM', 'Miești', '#FFFFFF', '#00843D', 'fan', 39, 'Stadionul Orești', 14000],
    ['ACS Brești', 'ACS', 'Brești', '#001F5B', '#FFFFFF', 'selling', 39, 'Stadionul Vatău', 15000],
    ['Rapid Satești', 'RAW', 'Satești', '#6CACE4', '#FFFFFF', 'selling', 38, 'Arena Crești', 12000],
    ['ACS Romești', 'ACR', 'Romești', '#00843D', '#0057B8', 'historic', 37, 'Stadionul Orășenesc Romești', 15500],
    ['Rapid Timău', 'RAX', 'Timău', '#000000', '#6A1B9A', 'youth', 37, 'Stadionul Tulova', 11500],
    ['AFC Vatești', 'VAW', 'Vatești', '#000000', '#FFD100', 'selling', 36, 'Complexul Sportiv Vatești', 11500],
    ['Olimpia Mieni', 'OLP', 'Mieni', '#001F5B', '#FFFFFF', 'youth', 36, 'Arena Brești', 10500],
    ['AFC Zaleni', 'ZAK', 'Zaleni', '#E30613', '#6A1B9A', 'selling', 36, 'Complexul Sportiv Zaleni', 12500],
    ['Viitorul Pitița', 'VIB25', 'Pitița', '#000000', '#001F5B', 'fallen', 35, 'Stadionul Orășenesc Pitița', 11000],
    ['Dinamo Mare Criu', 'DIP', 'Criu', '#FFFFFF', '#6A1B9A', 'fan', 33, 'Stadionul Petești', 13000],
  ];
  FM.D.CLUBS_RU2 = [
    ['FK Kalburg', 'KAJ32', 'Kalburg', '#0057B8', '#001F5B', 'fan', 47, 'Stadion imeni Orlovo', 20000],
    ['FC Nizhne-Tomino', 'NID', 'Tomino', '#FFFFFF', '#E30613', 'fallen', 47, 'Tsentralny Stadion Tomino', 17000],
    ['FC Staro-Orlsk', 'STX', 'Orlsk', '#00843D', '#FFD100', 'fan', 45, 'Stadion Orlsk', 14500],
    ['FK Novotulovsk', 'NOT', 'Novotulovsk', '#FFFFFF', '#6A1B9A', 'historic', 45, 'Stadion Novotulovsk', 14500],
    ['Krylia Murovsk', 'KRG', 'Murovsk', '#0057B8', '#6A1B9A', 'youth', 44, 'Tsentralny Stadion Murovsk', 14000],
    [
      'Avangard Murbor-na-Mere',
      'AVB',
      'Murbor-na-Mere',
      '#FFD100',
      '#0057B8',
      'selling',
      44,
      'Stadion imeni Perka',
      17500,
    ],
    ['Avangard Lugovsk', 'AVC', 'Lugovsk', '#0057B8', '#FFD100', 'historic', 43, 'Stadion Dinamo Lugovsk', 13500],
    ['Khimik Kemensk', 'KIQ', 'Kemensk', '#FFFFFF', '#000000', 'historic', 42, 'Stadion imeni Tulovo', 17500],
    ['Sibir Podka', 'SIR', 'Podka', '#001F5B', '#6A1B9A', 'fan', 42, 'Stadion Dinamo Podka', 15500],
    ['Neftyanik Ryazensk', 'NET', 'Ryazensk', '#00843D', '#6A1B9A', 'selling', 41, 'Stadion Ryazensk', 14000],
    ['Trud Nizhne-Sortovo', 'TRJ', 'Sortovo', '#0057B8', '#000000', 'youth', 40, 'Stadion Dinamo Sortovo', 14500],
    ['Zenit Kinbor', 'ZEM', 'Kinbor', '#6CACE4', '#6A1B9A', 'fan', 40, 'Stadion Tomburg', 12500],
    ['FK Sarino', 'SAP37', 'Sarino', '#6A1B9A', '#FFFFFF', 'fan', 39, 'Stadion Dinamo Sarino', 13500],
    ['Spartak Ustgorsk', 'SPZ', 'Ustgorsk', '#E30613', '#6A1B9A', 'historic', 38, 'Stadion imeni Lipensk', 11500],
    ['Neftyanik Sortka', 'NEV', 'Sortka', '#6A1B9A', '#0057B8', 'youth', 37, 'Stadion Sortka', 12500],
    ['Avangard Lugovo', 'ART', 'Lugovo', '#001F5B', '#E30613', 'youth', 37, 'Lugorsk Arena', 13000],
    ['Trud Lugsk', 'TRK', 'Lugsk', '#001F5B', '#FFFFFF', 'fan', 36, 'Stadion Dinamo Lugsk', 15000],
    ['Novo-Tulensk FK', 'NVO', 'Tulensk', '#FFD100', '#6A1B9A', 'historic', 35, 'Stadion Dinamo Tulensk', 14000],
  ];
  FM.D.CLUBS_SC2 = [
    ['Dalbridge Hearts Athletic', 'DAQ', 'Dalbridge', '#FFFFFF', '#E30613', 'historic', 51, 'Selkock Road', 21500],
    ['Peebrie Academical', 'PEC26', 'Peebrie', '#001F5B', '#00843D', 'historic', 50, 'Peebrie Muir', 20000],
    ['Dunshiels Wanderers', 'DUS', 'Dunshiels', '#6A1B9A', '#FFD100', 'historic', 48, 'Craigshiels Green', 17500],
    ['Kinie Burgh', 'KIV', 'Kinie', '#6CACE4', '#E30613', 'fallen', 47, 'Cumbray Green', 16000],
    ['Hawick Hearts Athletic', 'HAN36', 'Hawick', '#000000', '#6CACE4', 'fallen', 46, 'Moffland Park', 19000],
    ['Moffbridge Burgh', 'MOG30', 'Moffbridge', '#00843D', '#FFD100', 'fan', 44, 'Moffbridge Muir', 17000],
    ['Glenmore Rovers', 'GLE', 'Glenmore', '#0057B8', '#FFD100', 'youth', 44, 'Dunbridge Road', 16500],
    ['Moffdee Victoria', 'MOH31', 'Moffdee', '#FFFFFF', '#6A1B9A', 'fan', 43, 'Balkirk Brae', 16500],
    ['Inter Aberdee', 'INT', 'Aberdee', '#0057B8', '#FFFFFF', 'selling', 41, 'Aberdee Gardens', 16500],
    ['Easter Tullishiels Town', 'EAS', 'Tullishiels', '#6A1B9A', '#0057B8', 'fan', 41, 'Rosloch Road', 16500],
  ];
  FM.D.CLUBS_RS2 = [
    [
      'Torpedo Gornji Hradice',
      'TOP',
      'Gornji Hradice',
      '#FFD100',
      '#0057B8',
      'youth',
      51,
      'Stadion Mir Gornji Hradice',
      21000,
    ],
    ['FC Ostin', 'OSF', 'Ostin', '#FFD100', '#00843D', 'fallen', 51, 'Kraany Arena', 20500],
    ['Rudar Vysin', 'RUF', 'Vysin', '#6A1B9A', '#FFD100', 'historic', 49, 'Stadion Mirice', 18000],
    ['Lokomotiva Dolnica', 'DOW', 'Dolnica', '#0057B8', '#00843D', 'historic', 49, 'Stadion Mir Dolnica', 18000],
    ['Sloga Gorovo', 'SLJ', 'Gorovo', '#000000', '#FFD100', 'historic', 48, 'Stadion Polin', 17000],
    [
      'Partizan Gornji Kamovo',
      'PAM35',
      'Gornji Kamovo',
      '#000000',
      '#E30613',
      'fallen',
      47,
      'Stadion Mir Gornji Kamovo',
      17000,
    ],
    ['Spartak Velovac', 'SPA24', 'Velovac', '#001F5B', '#000000', 'fan', 47, 'Stadion Kamovac', 16000],
    ['FC Kamice', 'KAK33', 'Kamice', '#6CACE4', '#00843D', 'youth', 45, 'Kamice Park', 17000],
    ['FC Liptik', 'LIZ', 'Liptik', '#6A1B9A', '#00843D', 'historic', 45, 'Stadion Belik', 15500],
    ['SK Borpol', 'BOW', 'Borpol', '#0057B8', '#E30613', 'fallen', 45, 'Gradski Stadion Borpol', 14500],
    ['Rapid Polik', 'RIK', 'Polik', '#001F5B', '#FFD100', 'youth', 43, 'Polik Park', 16000],
    ['Union Hradpol', 'HRL', 'Hradpol', '#FFFFFF', '#E30613', 'fan', 43, 'Gradski Stadion Hradpol', 16000],
    ['Dinamo Mirek', 'DMI', 'Mirek', '#FFD100', '#0057B8', 'historic', 42, 'Mirovo Arena', 18000],
    ['FK Novava', 'NOX', 'Novava', '#FFFFFF', '#0057B8', 'fallen', 42, 'Stadion Mir Novava', 15500],
    ['MFK Zelec', 'ZEQ', 'Zelec', '#0057B8', '#FFD100', 'fan', 41, 'Stadion Mir Zelec', 14500],
    [
      'Spartak Stara Drain',
      'SST',
      'Stara Drain',
      '#00843D',
      '#6CACE4',
      'fallen',
      41,
      'Gradski Stadion Stara Drain',
      14500,
    ],
  ];
  FM.D.CLUBS_SK2 = [
    ['Slovan Valovce', 'VAX', 'Valovce', '#000000', '#E30613', 'historic', 42, 'Futbalový štadión Valovce', 14500],
    ['FK Zvovce', 'ZVO', 'Zvovce', '#00843D', '#000000', 'fan', 40, 'Mestský štadión Zvovce', 14500],
    ['Jednota Barovce', 'JEC', 'Barovce', '#6A1B9A', '#FFD100', 'fan', 40, 'Štadión pod Price', 12500],
    ['Spartak Rimovce', 'SPB25', 'Rimovce', '#6CACE4', '#001F5B', 'fan', 38, 'Futbalový štadión Rimovce', 12500],
    ['FK Piany', 'PIJ', 'Piany', '#6A1B9A', '#0057B8', 'youth', 38, 'Štadión pod Brezovce', 12500],
    ['Slovan Brezany', 'BRY', 'Brezany', '#FFFFFF', '#0057B8', 'historic', 38, 'Štadión pod Popany', 13500],
    ['TJ Stará Dubice', 'SRB', 'Dubice', '#0057B8', '#FFD100', 'fallen', 36, 'Krovce Aréna', 11500],
    ['ŠK Lipany', 'SKK', 'Lipany', '#001F5B', '#6A1B9A', 'historic', 36, 'Futbalový štadión Lipany', 15000],
    ['MFK Horné Zvice', 'HON', 'Zvice', '#FFD100', '#6A1B9A', 'fallen', 36, 'Futbalový štadión Zvice', 14500],
    ['Dukla Gelovce', 'DUE', 'Gelovce', '#001F5B', '#FFD100', 'historic', 34, 'Dubovce Aréna', 10000],
    ['Tatran Nové Spišovce', 'TAN36', 'Spišovce', '#FFFFFF', '#6A1B9A', 'fan', 34, 'Štadión Spišany', 12000],
    ['MFK Stará Senice', 'STZ', 'Stará Senice', '#000000', '#6CACE4', 'fan', 33, 'Mestský štadión Stará Senice', 11000],
    ['Krany FK', 'KRH', 'Krany', '#001F5B', '#00843D', 'fan', 32, 'Mestský štadión Krany', 9000],
    ['Strojár Trenany', 'STA24', 'Trenany', '#6A1B9A', '#001F5B', 'fan', 32, 'Štadión pod Kežany', 9000],
    ['Spartak Prany', 'SPC26', 'Prany', '#FFD100', '#FFFFFF', 'historic', 31, 'Mestský štadión Prany', 8500],
    ['FK Sobice', 'SOP', 'Sobice', '#6A1B9A', '#001F5B', 'fallen', 30, 'Štadión Gelice', 11000],
  ];
  FM.D.CLUBS_SI2 = [
    ['Rudar Bovava', 'RUG', 'Bovava', '#FFFFFF', '#001F5B', 'fan', 41, 'Športni park Bovava', 14500],
    ['Dinamo Škofica', 'DSK', 'Škofica', '#6CACE4', '#000000', 'fan', 40, 'Mestni stadion Škofica', 15000],
    ['Rudar Celba', 'RAZ', 'Celba', '#6CACE4', '#001F5B', 'fan', 38, 'Stadion Kosina', 11500],
    ['Partizan Ribina', 'PRI', 'Ribina', '#000000', '#00843D', 'fan', 37, 'Trbava Arena', 12000],
    ['NK Ajdica', 'AJD', 'Ajdica', '#000000', '#FFFFFF', 'fan', 37, 'Športni park Ajdica', 11000],
    ['NK Nova Hrava', 'NVA', 'Hrava', '#000000', '#FFD100', 'fan', 37, 'Mestni stadion Hrava', 15000],
    ['Sava Ptava', 'SAQ38', 'Ptava', '#001F5B', '#6A1B9A', 'selling', 35, 'Mestni stadion Ptava', 10000],
    ['Rudar Nova Idrica', 'RUN', 'Idrica', '#0057B8', '#001F5B', 'fan', 35, 'Stadion pod Tolica', 11500],
    ['Bor Litica', 'BLI', 'Litica', '#6A1B9A', '#001F5B', 'youth', 35, 'Športni park Litica', 13500],
    ['Rudar Sezba', 'RUH', 'Sezba', '#00843D', '#E30613', 'youth', 34, 'Stadion Litina', 13000],
    ['Svoboda Litava', 'SVA', 'Litava', '#6CACE4', '#E30613', 'historic', 33, 'Športni park Litava', 10000],
    ['Dinamo Nova Slovba', 'DNO', 'Nova Slovba', '#6CACE4', '#001F5B', 'historic', 32, 'Stadion Žalica', 13500],
    [
      'Sava Nova Škofava',
      'SAR39',
      'Nova Škofava',
      '#FFFFFF',
      '#6A1B9A',
      'youth',
      31,
      'Športni park Nova Škofava',
      12500,
    ],
    ['Bor Žalica', 'BOX', 'Žalica', '#00843D', '#E30613', 'fallen', 31, 'Mestni stadion Žalica', 12500],
    ['ND Zgornja Kosina', 'NDD', 'Kosina', '#6CACE4', '#E30613', 'fan', 29, 'Mestni stadion Kosina', 11000],
    ['NK Ljutba', 'LJU', 'Ljutba', '#0057B8', '#6A1B9A', 'fallen', 29, 'Stadion Lenica', 10000],
  ];
  FM.D.CLUBS_ZA2 = [
    ['Marabela Swallows', 'MSW', 'Marabela', '#0057B8', '#001F5B', 'historic', 46, 'Marabela Sports Complex', 18000],
    ['Phalston Arrows', 'PHA', 'Phalston', '#FFFFFF', '#FFD100', 'fan', 44, 'Phalston Oval', 15000],
    ['Nelsberg United', 'NEX', 'Nelsberg', '#6A1B9A', '#001F5B', 'fallen', 43, 'Ulunstad Stadium', 14500],
    ['Upper Pongston & District', 'POC26', 'Pongston', '#FFD100', '#00843D', 'fan', 42, 'Pongston Oval', 15000],
    ['Houtula & Hallam', 'HOU', 'Houtula', '#000000', '#0057B8', 'fan', 42, 'Houtula Oval', 15000],
    ['Houtburg City', 'HOP', 'Houtburg', '#6A1B9A', '#E30613', 'fan', 41, 'Volrus Stadium', 14500],
    ['Marabdal Trinity', 'MAZ47', 'Marabdal', '#00843D', '#FFFFFF', 'fan', 41, 'Sasolkop Stadium', 15000],
    ['Ladeburg City', 'LAC26', 'Ladeburg', '#6CACE4', '#FFD100', 'fan', 41, 'Maraberg Park', 16500],
    ['Volfontein Chiefs', 'VOA', 'Volfontein', '#E30613', '#FFD100', 'historic', 40, 'Kwavlei Park', 13500],
    ['AFC Krubela', 'KRJ', 'Krubela', '#0057B8', '#000000', 'selling', 39, 'Kwadal Park', 12000],
    ['Kwakop Stars', 'KWA', 'Kwakop', '#6A1B9A', '#00843D', 'fan', 37, 'Ulunrus Park', 11000],
    ['Thabkop Swallows', 'THQ', 'Thabkop', '#0057B8', '#E30613', 'historic', 37, 'Thabkop Sports Complex', 15000],
    ['Ulunrus Foundry', 'ULC', 'Ulunrus', '#000000', '#6CACE4', 'fan', 36, 'Ulunrus Sports Complex', 13000],
    ['Upper Nelsula Vale', 'NEY', 'Nelsula', '#FFD100', '#001F5B', 'historic', 35, 'Phalula Park', 13000],
    ['Ladekop Stars', 'LAD27', 'Ladekop', '#6A1B9A', '#6CACE4', 'fan', 35, 'Ulunkop Park', 14500],
    ['Ulunfontein Stars', 'ULN', 'Ulunfontein', '#6CACE4', '#E30613', 'fan', 33, 'Ulunfontein Oval', 9000],
  ];
  FM.D.CLUBS_CH2 = [
    ['SV Dillfurt', 'DIQ', 'Dillfurt', '#00843D', '#001F5B', 'fan', 53, 'Stadion am Eichberg', 18000],
    ['VfL Westertal', 'WEB', 'Westertal', '#FFD100', '#6A1B9A', 'historic', 52, 'Westertal-Arena', 22000],
    ['Teutonia Felstal', 'FAE', 'Felstal', '#00843D', '#FFD100', 'historic', 51, 'Rheinsee-Stadion', 18000],
    ['SpVgg Bergburg 1936', 'BEF29', 'Bergburg', '#00843D', '#6A1B9A', 'historic', 49, 'Elshof-Stadion', 17500],
    ['Groß Heidstadt 1899', 'GRS', 'Heidstadt', '#0057B8', '#6A1B9A', 'historic', 48, 'Zellkirchen-Stadion', 17500],
    ['SpVgg Felsweiler', 'FEF', 'Felsweiler', '#E30613', '#000000', 'fallen', 47, 'Stadion Dillstadt', 19500],
    ['TSV Felsau', 'FEU', 'Felsau', '#000000', '#0057B8', 'selling', 45, 'Stadion am Immhausen', 17000],
    ['VfB Hirschdorf', 'HIE', 'Hirschdorf', '#001F5B', '#FFFFFF', 'fallen', 45, 'Stadion am Bachausen', 19000],
    [
      'Sportfreunde Freikirchen',
      'FRR',
      'Freikirchen',
      '#E30613',
      '#FFFFFF',
      'fan',
      43,
      'Waldstadion Freikirchen',
      18000,
    ],
    ['FC Langstein 1887', 'LIA24', 'Langstein', '#FFD100', '#0057B8', 'fan', 42, 'Lütingen-Stadion', 13000],
  ];
  FM.D.CLUBS_TZ2 = [
    ['Bukobuta Stars', 'BUV', 'Bukobuta', '#001F5B', '#000000', 'fan', 37, 'Morowera Sports Ground', 11000],
    ['Darmba United', 'DAS', 'Darmba', '#001F5B', '#E30613', 'fallen', 36, 'Arushmba Sports Ground', 12000],
    ['Singituma FC', 'SIU', 'Singituma', '#E30613', '#6A1B9A', 'fan', 36, 'Singituma Uhuru Ground', 11500],
    ['Arushwera Stars', 'ARU', 'Arushwera', '#001F5B', '#FFD100', 'historic', 35, 'Iringsa Sports Ground', 14000],
    ['FC Songena', 'SOQ', 'Songena', '#E30613', '#0057B8', 'historic', 35, 'Songena Uhuru Ground', 10000],
    ['Kibogoma Royals', 'KIW', 'Kibogoma', '#000000', '#E30613', 'fan', 34, 'Kibogoma Uhuru Ground', 9500],
    ['Tangatuma Works', 'TAP37', 'Tangatuma', '#00843D', '#0057B8', 'historic', 32, 'Kibokili Stadium', 12000],
    ['Kibota Dynamo', 'KTA', 'Kibota', '#0057B8', '#FFFFFF', 'historic', 32, 'Songekili Stadium', 13000],
    ['Kiboga FC', 'KGA', 'Kiboga', '#001F5B', '#000000', 'fan', 31, 'Kiboga Uhuru Ground', 9000],
    ['Old Mbeyta Dynamo', 'MBG', 'Mbeyta', '#6CACE4', '#FFFFFF', 'fan', 30, 'Dodya Stadium', 12000],
    ['Young Mwanza', 'YOB', 'Mwanza', '#000000', '#0057B8', 'fan', 30, 'Mwanza National Stadium', 9500],
    ['New Tabowera Sporting', 'TAQ38', 'Tabowera', '#E30613', '#0057B8', 'youth', 29, 'Tabowera Uhuru Ground', 8500],
    ['Tangya Warriors', 'TYA', 'Tangya', '#00843D', '#001F5B', 'youth', 29, 'Tangya Uhuru Ground', 9500],
    ['Arushza Bohemians', 'AZA', 'Arushza', '#6A1B9A', '#0057B8', 'selling', 28, 'Arushza National Stadium', 11500],
    ['Arushta United', 'ATC', 'Arushta', '#000000', '#6A1B9A', 'historic', 27, 'Arushta National Stadium', 7500],
    ['Kibowera City', 'KIX', 'Kibowera', '#000000', '#FFD100', 'youth', 27, 'Kibowera National Stadium', 8000],
  ];
  FM.D.CLUBS_TN2 = [
    ['ES Keloune', 'KEL', 'Keloune', '#E30613', '#6A1B9A', 'historic', 43, 'Stade Municipal de Keloune', 15000],
    ['Kelar FC', 'KEB', 'Kelar', '#000000', '#6CACE4', 'fan', 42, 'Complexe Sportif Kelar', 17000],
    ['JS Monoune', 'JJS', 'Monoune', '#FFD100', '#FFFFFF', 'selling', 42, 'Stade Municipal de Monoune', 16000],
    ['US Siline', 'SIW', 'Siline', '#E30613', '#001F5B', 'selling', 40, 'Stade de Siline', 15000],
    ['AS Kaès', 'KAL34', 'Kaès', '#6A1B9A', '#0057B8', 'fan', 39, 'Stade Gaboune', 13500],
    ['Étoile de Bejès', 'BEG30', 'Bejès', '#00843D', '#6CACE4', 'selling', 39, 'Complexe Sportif Bejès', 14000],
    ['Stade Tabouane', 'TAR39', 'Tabouane', '#6A1B9A', '#FFD100', 'fan', 38, 'Stade Hamouane', 14000],
    ['ES Nabsa', 'NAH31', 'Nabsa', '#6A1B9A', '#FFFFFF', 'fallen', 38, 'Complexe Sportif Nabsa', 12000],
    ['AS Kasia', 'KAM35', 'Kasia', '#00843D', '#FFFFFF', 'fan', 36, 'Complexe Sportif Kasia', 13000],
    ['EO Ain Mahsa', 'EOO', 'Mahsa', '#FFFFFF', '#6CACE4', 'fan', 35, 'Stade Kasa', 13000],
    ['Étoile de Sidi Kelar', 'SIX', 'Sidi Kelar', '#E30613', '#001F5B', 'fan', 35, 'Stade Silouane', 12500],
    ['Olympique Naboune', 'OLQ', 'Naboune', '#6A1B9A', '#6CACE4', 'fan', 33, 'Stade Siline', 10000],
    ['JS Monsa', 'JSM', 'Monsa', '#0057B8', '#000000', 'fan', 33, 'Stade Municipal de Monsa', 10000],
    ['JS Oued Zarès', 'JSO', 'Oued Zarès', '#000000', '#0057B8', 'fan', 32, 'Stade Bejar', 9500],
  ];
  FM.D.CLUBS_UA2 = [
    ['Veres Verkhnia Lyuivtsi', 'VEV', 'Lyuivtsi', '#6A1B9A', '#0057B8', 'fan', 47, 'Mis’kyi Stadion Lyuivtsi', 17000],
    ['FC Kreychi', 'KRK', 'Kreychi', '#FFFFFF', '#6A1B9A', 'historic', 46, 'Stadion imeni Zhovske', 17500],
    ['Shakhtar Nova Kovychi', 'SHW', 'Kovychi', '#FFD100', '#FFFFFF', 'historic', 46, 'Stadion Kovychi', 19500],
    ['FC Sumske', 'SUF', 'Sumske', '#0057B8', '#6A1B9A', 'selling', 45, 'Stadion imeni Okhyne', 17500],
    ['FK Malska', 'MKA', 'Malska', '#000000', '#FFD100', 'selling', 45, 'Stadion Malska', 17500],
    ['Naftovyk Nyzhnia Rovets', 'NAJ32', 'Rovets', '#000000', '#FFFFFF', 'fan', 43, 'Staivtsi Arena', 16000],
    ['Shakhtar Lyuove', 'SHX', 'Lyuove', '#00843D', '#6A1B9A', 'fallen', 43, 'Olimpiiskyi Lyuove', 16000],
    ['Torpedo Khmivske', 'TDO', 'Khmivske', '#001F5B', '#E30613', 'fan', 42, 'Bilets Arena', 17000],
    ['Podillia Khmivka', 'POD27', 'Khmivka', '#00843D', '#E30613', 'fan', 42, 'Stadion Nemyne', 13500],
    ['Lokomotyv Yavivske', 'LYV', 'Yavivske', '#0057B8', '#000000', 'historic', 40, 'Hanyne Arena', 12500],
    ['Chornomorets Druychi', 'CHG30', 'Druychi', '#001F5B', '#6CACE4', 'fan', 39, 'Mis’kyi Stadion Druychi', 12500],
    ['FK Stara Ternets', 'STB25', 'Ternets', '#6A1B9A', '#E30613', 'fan', 38, 'Olimpiiskyi Ternets', 11500],
    ['Veres Okhychi', 'VEO', 'Okhychi', '#6CACE4', '#00843D', 'historic', 37, 'Stadion Horychi', 14500],
    ['Akademiia Nyzhnia Zapivtsi', 'AKG', 'Zapivtsi', '#000000', '#6CACE4', 'fan', 37, 'Olimpiiskyi Zapivtsi', 12000],
    [
      'Dynamo Nyzhnia Kalopil',
      'NYB',
      'Nyzhnia Kalopil',
      '#6CACE4',
      '#00843D',
      'fan',
      37,
      'Stadion imeni Yavivtsi',
      11500,
    ],
    ['Avanhard Verkhnia Trosychi', 'AVV', 'Trosychi', '#FFD100', '#0057B8', 'youth', 37, 'Polychi Arena', 15000],
  ];
  FM.D.CLUBS_AE2 = [
    ['Al Wafaa', 'ALM59', 'Bahra', '#FFD100', '#6CACE4', 'selling', 45, 'Bahra Stadium', 18500],
    ['Hiliq Club', 'HIF', 'Hiliq', '#FFFFFF', '#000000', 'selling', 44, 'Hiliq Sports City', 18500],
    ['Jerayr SC', 'JER', 'Jerayr', '#E30613', '#FFD100', 'youth', 44, 'Jerayr Sports City', 15000],
    ['Ain Karah SC', 'AIK', 'Ain Karah', '#6CACE4', '#E30613', 'historic', 43, 'Prince Zaliyah Stadium', 17000],
    ['Al Asad', 'AAS', 'Quriyah', '#6A1B9A', '#FFFFFF', 'historic', 42, 'Sohayn Stadium', 13500],
    ['Al Watan', 'ALN60', 'Jahiyah', '#FFFFFF', '#E30613', 'youth', 41, 'Salib Stadium', 12500],
    ['Al Aqayn SC', 'AAQ', 'Aqayn', '#000000', '#001F5B', 'fallen', 40, 'Aqayn Sports City', 15000],
    ['Al Jabal', 'ALP61', 'Jeran', '#0057B8', '#FFFFFF', 'youth', 39, 'Jeran Sports City', 15500],
    ['Al Nimr', 'ANI', 'Musiq', '#6A1B9A', '#E30613', 'fan', 39, 'Musiq Stadium', 13500],
    ['Muhar SC', 'MUD', 'Muhar', '#00843D', '#001F5B', 'fan', 38, 'Samiq Arena', 14500],
    ['Salayr Club', 'SAS40', 'Salayr', '#001F5B', '#00843D', 'fan', 38, 'Prince Samayr Stadium', 15000],
    ['Salah Club', 'SAT41', 'Salah', '#001F5B', '#6CACE4', 'historic', 37, 'Salah Stadium', 12000],
    ['Al Wadi Irbar SC', 'ALQ62', 'Irbar', '#00843D', '#000000', 'fan', 36, 'Diwan Arena', 12000],
    ['Karan Club', 'KAN36', 'Karan', '#E30613', '#001F5B', 'fallen', 36, 'Prince Hidayr Stadium', 15000],
    ['Al Rayyan', 'ALR63', 'Zaliyah', '#0057B8', '#FFFFFF', 'fan', 34, 'Madiyah Stadium', 10500],
    ['Al Ain Faliq SC', 'AAF', 'Ain Faliq', '#000000', '#6CACE4', 'historic', 33, 'Aqayr Arena', 11000],
  ];
  FM.D.CLUBS_US2 = [
    ['Redbluff Heat', 'REM', 'Redbluff', '#0057B8', '#6A1B9A', 'fan', 60, 'Redbluff Field', 22000],
    [
      'Walnutview Park Blaze',
      'WAW',
      'Walnutview Park',
      '#001F5B',
      '#FFFFFF',
      'historic',
      60,
      'Walnutview Park Field',
      22000,
    ],
    ['Cherrycreek Union Club', 'CHH31', 'Cherrycreek', '#6CACE4', '#00843D', 'fallen', 59, 'Cherrycreek Arena', 20500],
    ['Whiteford FC', 'WHD', 'Whiteford', '#FFD100', '#6CACE4', 'fan', 59, 'Whiteford Arena', 22500],
    ['AC Springview', 'SPD27', 'Springview', '#001F5B', '#00843D', 'historic', 58, 'Rockport Stadium', 21500],
    ['Maplecreek City FC', 'MAA48', 'Maplecreek', '#FFD100', '#0057B8', 'fallen', 58, 'Redford Field', 24000],
    ['Mesadale Lumberjacks', 'MLE', 'Mesadale', '#E30613', '#6CACE4', 'selling', 57, 'Portwood Field', 22000],
    ['Prairiecreek Stallions', 'PRK', 'Prairiecreek', '#6A1B9A', '#0057B8', 'fallen', 57, 'Bluehills Field', 21500],
    ['Rocksprings Lumberjacks', 'ROM', 'Rocksprings', '#000000', '#FFFFFF', 'fan', 56, 'Silverhills Stadium', 22000],
    ['Bearview Union Club', 'BEH31', 'Bearview', '#6A1B9A', '#E30613', 'fan', 55, 'Bearview Arena', 23500],
    ['Whiteville FC', 'WHE', 'Whiteville', '#0057B8', '#00843D', 'historic', 55, 'Whiteville Field', 21000],
    ['Cypressport Revolution', 'CYP', 'Cypressport', '#0057B8', '#6CACE4', 'fan', 55, 'Mapleville Field', 21500],
    ['El Aspenhills Fire', 'ELL', 'El Aspenhills', '#6CACE4', '#00843D', 'fan', 54, 'Prairiegrove Field', 18500],
    ['Real Cherryton', 'CHJ32', 'Cherryton', '#000000', '#FFD100', 'fan', 53, 'Cherryton Stadium', 20500],
    ['Port Riverfalls SC', 'POE28', 'Port Riverfalls', '#6A1B9A', '#000000', 'fan', 53, 'Port Riverfalls Arena', 21500],
    ['Sunhills City FC', 'SUG', 'Sunhills', '#6CACE4', '#6A1B9A', 'selling', 53, 'Sunhills Stadium', 22000],
    ['Cedarhaven Express', 'CEF', 'Cedarhaven', '#00843D', '#6CACE4', 'fallen', 53, 'Cedarhaven Stadium', 19500],
    [
      'Willowsprings City FC',
      'WIE',
      'Willowsprings',
      '#00843D',
      '#0057B8',
      'historic',
      53,
      'Willowsprings Stadium',
      18500,
    ],
    [
      'Port Bluehaven FC',
      'POF29',
      'Port Bluehaven',
      '#6A1B9A',
      '#000000',
      'youth',
      51,
      'Port Bluehaven Stadium',
      17000,
    ],
    ['Elkcreek Foundry United', 'ELK', 'Elkcreek', '#000000', '#6CACE4', 'youth', 51, 'Beargrove Field', 20500],
    ['Rockfield Fire', 'RLD', 'Rockfield', '#0057B8', '#6CACE4', 'fan', 51, 'Rockfield Field', 20000],
    ['Lakeview Union Club', 'LAE28', 'Lakeview', '#000000', '#6A1B9A', 'historic', 50, 'Bearbluff Stadium', 17500],
    ['Cherryfalls Revolution', 'CLS', 'Cherryfalls', '#000000', '#FFFFFF', 'selling', 49, 'Riverhills Field', 19000],
    ['Fortcreek Rapids', 'FOE', 'Fortcreek', '#FFD100', '#001F5B', 'historic', 49, 'Fortcreek Stadium', 21000],
  ];
  FM.D.CLUBS_UY2 = [
    [
      'Racing de Presidente Domia',
      'PRJ',
      'Presidente Domia',
      '#00843D',
      '#E30613',
      'historic',
      45,
      'Estadio Ortez',
      18500,
    ],
    ['Nacional Urqeda', 'NAK33', 'Urqeda', '#6CACE4', '#00843D', 'historic', 44, 'Cancha de Urqeda', 17000],
    ['Club Deportivo Miras', 'MIS', 'Miras', '#001F5B', '#E30613', 'fan', 44, 'Estadio Municipal de Miras', 14500],
    ['Urqez FC', 'URZ', 'Urqez', '#6CACE4', '#6A1B9A', 'historic', 43, 'Estadio Laveda', 15500],
    [
      'Club Sportivo Sarona',
      'SNA',
      'Sarona',
      '#E30613',
      '#0057B8',
      'historic',
      41,
      'Estadio Municipal de Sarona',
      13500,
    ],
    ['Atlético Presidente Arrui', 'PTE', 'Presidente Arrui', '#FFFFFF', '#6CACE4', 'fan', 40, 'Estadio Franini', 16500],
    ['Nacional Dorrona', 'NAL34', 'Dorrona', '#FFFFFF', '#E30613', 'fallen', 40, 'Estadio Municipal de Dorrona', 12500],
    ['Club Atlético Unión Lezui', 'LEB', 'Lezui', '#6A1B9A', '#000000', 'fallen', 39, 'Cancha de Lezui', 15500],
    ['Independiente Domón', 'DOY', 'Domón', '#6CACE4', '#FFFFFF', 'historic', 39, 'Estadio Arrero', 15000],
    ['Racing de Bustón', 'BUW', 'Bustón', '#E30613', '#6A1B9A', 'fan', 38, 'Estadio Monumental Cabrui', 13000],
    ['Nacional Arrero', 'NAM35', 'Arrero', '#E30613', '#6A1B9A', 'selling', 37, 'Estadio Rodo', 13000],
    ['Estudiantes de Lavo', 'LAO', 'Lavo', '#FFD100', '#000000', 'fan', 35, 'Estadio Monumental Belini', 10500],
    ['Defensores de Ortero', 'ORO', 'Ortero', '#6A1B9A', '#00843D', 'historic', 34, 'Estadio Lezón', 12500],
    ['Club Atlético Miro', 'MIG', 'Miro', '#00843D', '#001F5B', 'youth', 34, 'Estadio Monumental Arras', 9500],
  ];
  FM.D.CLUBS_UZ2 = [
    ['Chirush United', 'CHK33', 'Chirush', '#FFFFFF', '#6A1B9A', 'fan', 39, 'Chirush Markaziy Stadium', 13000],
    ['Tashbad United', 'TAS40', 'Tashbad', '#000000', '#6A1B9A', 'youth', 37, 'Kokez Arena', 13500],
    ['Bekchik United', 'BEJ32', 'Bekchik', '#0057B8', '#000000', 'fan', 37, 'Bekchik Markaziy Stadium', 14000],
    ['FK Gulkent', 'GUG', 'Gulkent', '#FFD100', '#00843D', 'fan', 36, 'Gulkent Markaziy Stadium', 11500],
    ['Nukbad FK', 'NUF', 'Nukbad', '#6CACE4', '#00843D', 'fallen', 35, 'Olimpiya Nukbad', 12500],
    ['Andkent United', 'ANF', 'Andkent', '#FFFFFF', '#000000', 'historic', 35, 'Andkent Markaziy Stadium', 13500],
    ['Namiz City', 'NAN36', 'Namiz', '#00843D', '#FFD100', 'selling', 34, 'Namiz Markaziy Stadium', 10000],
    ['Sport Club Shakhez', 'SHZ', 'Shakhez', '#E30613', '#00843D', 'youth', 33, 'Shakhez Markaziy Stadium', 11500],
    ['Khivchik FK', 'KHF', 'Khivchik', '#E30613', '#0057B8', 'fan', 32, 'Tashabad Arena', 11500],
    ['Neftchi Nukqand', 'NEZ', 'Nukqand', '#6A1B9A', '#000000', 'historic', 32, 'Andchik Stadium', 10500],
    ['FK Bekara', 'BEK33', 'Bekara', '#000000', '#E30613', 'historic', 31, 'Bekara Markaziy Stadium', 11000],
    ['Khiviz City', 'KHZ', 'Khiviz', '#FFD100', '#001F5B', 'fan', 30, 'Nukchik Arena', 10500],
    ['Marara FK', 'MRC', 'Marara', '#FFFFFF', '#E30613', 'youth', 29, 'Marara Markaziy Stadium', 10000],
    [
      'FK Eski Olmabad',
      'ESN',
      'Eski Olmabad',
      '#6CACE4',
      '#000000',
      'historic',
      27,
      'Eski Olmabad Markaziy Stadium',
      11000,
    ],
  ];
  FM.D.CLUBS_AR3 = [
    ['Racing de Rodia', 'ROP', 'Rodia', '#FFD100', '#E30613', 'youth', 42, 'Estadio Municipal de Rodia', 15500],
    ['Nacional Quiras', 'NAP37', 'Quiras', '#6A1B9A', '#E30613', 'fan', 42, 'Estadio Cabrano', 16000],
    ['Club Atlético Unión Belia', 'BIB', 'Belia', '#FFFFFF', '#FFD100', 'fan', 42, 'Cancha de Belia', 13500],
    ['Atlético Molas', 'MOJ32', 'Molas', '#6CACE4', '#0057B8', 'fan', 41, 'Estadio Urqón', 15000],
    ['Arreda FC', 'ADB', 'Arreda', '#6CACE4', '#E30613', 'fan', 41, 'Estadio Municipal de Arreda', 13000],
    ['Club Atlético Unión Garona', 'GAC', 'Garona', '#00843D', '#FFD100', 'fallen', 40, 'Cancha de Garona', 15500],
    ['Racing de Velo', 'VEW', 'Velo', '#000000', '#E30613', 'fan', 39, 'Cancha de Velo', 14000],
    ['Racing de Castona', 'CAJ32', 'Castona', '#6A1B9A', '#FFD100', 'fallen', 38, 'Estadio Alvero', 11000],
    [
      'Club Deportivo Sarilla',
      'SSA',
      'Sarilla',
      '#00843D',
      '#000000',
      'fan',
      38,
      'Estadio Municipal de Sarilla',
      13500,
    ],
    ['Independiente Lavez', 'LAF29', 'Lavez', '#FFD100', '#0057B8', 'fan', 37, 'Estadio Molar', 11500],
    ['Unión de Cabria', 'CIA', 'Cabria', '#FFD100', '#00843D', 'youth', 37, 'Estadio Municipal de Cabria', 12500],
    [
      'Club Atlético Santa Puesui',
      'PUG',
      'Santa Puesui',
      '#6CACE4',
      '#000000',
      'youth',
      36,
      'Estadio Municipal de Santa Puesui',
      11500,
    ],
    ['Independiente Garón', 'GAD', 'Garón', '#0057B8', '#E30613', 'fan', 36, 'Estadio Escez', 15000],
    [
      'Club de Regatas Alverar',
      'RAA24',
      'Alverar',
      '#000000',
      '#6A1B9A',
      'historic',
      35,
      'Estadio Municipal de Alverar',
      12000,
    ],
    ['Club Atlético Puesona', 'PUH', 'Puesona', '#FFD100', '#FFFFFF', 'fan', 34, 'Estadio Municipal de Puesona', 9500],
    [
      'Atlético Coronel Pellero',
      'COT',
      'Coronel Pellero',
      '#000000',
      '#6A1B9A',
      'youth',
      34,
      'Estadio Monumental Lavero',
      11500,
    ],
    ['Gimnasia de Herona', 'HNA', 'Herona', '#6A1B9A', '#FFFFFF', 'historic', 33, 'Estadio Escui', 9500],
    [
      'General Bustilla FC',
      'GEA',
      'General Bustilla',
      '#6CACE4',
      '#FFD100',
      'selling',
      32,
      'Estadio Municipal de General Bustilla',
      9500,
    ],
  ];
  FM.D.CLUBS_AT3 = [
    ['Fortuna Klein Rotdorf 1913', 'KLB', 'Rotdorf', '#00843D', '#6A1B9A', 'fan', 43, 'Rotbach-Stadion', 15000],
    ['Fortuna Oberdorf', 'OBA', 'Oberdorf', '#6A1B9A', '#6CACE4', 'youth', 43, 'Waldstadion Oberdorf', 17000],
    ['Fortuna Immweiler', 'IMR', 'Immweiler', '#6CACE4', '#000000', 'fallen', 42, 'Immweiler-Arena', 15000],
    ['TSV Neckarfurt', 'NEL34', 'Neckarfurt', '#00843D', '#6A1B9A', 'selling', 42, 'Neckarfurt-Arena', 15000],
    [
      'VfB Unter Immweiler',
      'UEA',
      'Unter Immweiler',
      '#FFD100',
      '#6CACE4',
      'fallen',
      42,
      'Unter Immweiler-Arena',
      16000,
    ],
    ['Viktoria Mühlbrück 1911', 'MUQ', 'Mühlbrück', '#E30613', '#6A1B9A', 'fallen', 42, 'Sportpark Greifbrück', 14000],
    ['Hansa Lindau', 'HSB', 'Lindau', '#FFFFFF', '#00843D', 'fan', 42, 'Stadion am Hainstein', 17500],
    ['Concordia Furtbach', 'COW', 'Furtbach', '#000000', '#00843D', 'selling', 41, 'Stadion am Rheinhorst', 13500],
    [
      'Hertha Goldorf im Tal',
      'HEA24',
      'Goldorf im Tal',
      '#00843D',
      '#FFFFFF',
      'historic',
      41,
      'Sportpark Marienburg',
      15000,
    ],
    ['Greiftal SC', 'GRH31', 'Greiftal', '#0057B8', '#6CACE4', 'fan', 41, 'Stadion am Burgau', 16000],
    [
      'Energie Bad Bachstein',
      'EBB',
      'Bad Bachstein',
      '#FFFFFF',
      '#6CACE4',
      'historic',
      41,
      'Sportpark Wiestadt',
      15500,
    ],
    ['Fortuna Rotburg', 'ROQ', 'Rotburg', '#FFD100', '#00843D', 'historic', 40, 'Felstal-Stadion', 15500],
    ['VfB Klein Dillau', 'KLC', 'Dillau', '#00843D', '#E30613', 'fallen', 40, 'Stadion am Lindau', 13000],
    ['SV Steinwald', 'STH31', 'Steinwald', '#00843D', '#0057B8', 'fan', 40, 'Langsee-Stadion', 15500],
    [
      'Viktoria Bad Zellstein',
      'BAQ62',
      'Bad Zellstein',
      '#FFFFFF',
      '#001F5B',
      'historic',
      40,
      'Bad Zellstein-Arena',
      15000,
    ],
    ['Energie Bruchdorf', 'ENH', 'Bruchdorf', '#000000', '#0057B8', 'fan', 40, 'Stadion am Greifingen', 15500],
    ['SV Oberstadt', 'OBT', 'Oberstadt', '#0057B8', '#6A1B9A', 'fan', 40, 'Stadion am Heidkirchen', 13000],
    ['TSV Ober Altstein', 'OBJ', 'Altstein', '#000000', '#FFD100', 'historic', 40, 'Langhof-Stadion', 16500],
    ['SV Grünfeld 1948', 'GRJ32', 'Grünfeld', '#6CACE4', '#E30613', 'fan', 40, 'Stadion Ahrtal', 13000],
    ['FC Hohenau', 'HOQ', 'Hohenau', '#6CACE4', '#00843D', 'youth', 39, 'Stadion am Marienbach', 15500],
    [
      'TSV Unter Schwarzweiler',
      'UER',
      'Schwarzweiler',
      '#0057B8',
      '#E30613',
      'fan',
      39,
      'Waldstadion Schwarzweiler',
      12500,
    ],
    ['SV Bad Kronhafen', 'BAP61', 'Kronhafen', '#FFD100', '#E30613', 'fan', 38, 'Kronhafen-Arena', 11500],
    ['VfL Holzstadt 1902', 'HOJ32', 'Holzstadt', '#001F5B', '#FFFFFF', 'youth', 38, 'Burgfurt-Stadion', 14000],
    ['FC Bruchau 1902', 'BRM35', 'Bruchau', '#0057B8', '#6A1B9A', 'historic', 38, 'Sportpark Dornweiler', 13500],
    ['Arminia Neu Waldingen', 'AIF', 'Waldingen', '#FFFFFF', '#000000', 'fan', 38, 'Steinstein-Stadion', 13500],
    ['Union Rotfurt 1931', 'RRT', 'Rotfurt', '#6A1B9A', '#FFFFFF', 'fallen', 37, 'Waldstadion Rotfurt', 11500],
    [
      'FSV Klein Grüningen',
      'KLM',
      'Klein Grüningen',
      '#0057B8',
      '#000000',
      'selling',
      37,
      'Stadion am Goldhafen',
      15500,
    ],
    ['FC Neu Neckarfeld', 'NEK33', 'Neckarfeld', '#FFD100', '#FFFFFF', 'fan', 37, 'Stadion Heidsee', 15000],
    ['Concordia Lütbach', 'COK33', 'Lütbach', '#FFFFFF', '#E30613', 'fallen', 37, 'Dillhausen-Stadion', 14500],
    ['Fortuna Furthof', 'FUK', 'Furthof', '#6CACE4', '#6A1B9A', 'fallen', 36, 'Sportpark Mühlingen', 12500],
    ['SV Hohen Wiesburg', 'HOT', 'Hohen Wiesburg', '#00843D', '#000000', 'fan', 36, 'Hohen Wiesburg-Arena', 14500],
    ['Hansa Niedertal', 'HAP37', 'Niedertal', '#0057B8', '#6CACE4', 'youth', 36, 'Sportpark Zellheim', 13500],
    [
      'FSV Hohen Steinbach',
      'HOH31',
      'Hohen Steinbach',
      '#001F5B',
      '#6A1B9A',
      'fan',
      36,
      'Waldstadion Hohen Steinbach',
      13000,
    ],
    ['Teutonia Holzheim', 'HOK33', 'Holzheim', '#E30613', '#001F5B', 'fan', 36, 'Holzheim-Arena', 13000],
    ['FC Langwald', 'LAY46', 'Langwald', '#FFD100', '#6CACE4', 'historic', 36, 'Langwald-Arena', 13500],
    ['Eintracht Neu Obertal', 'NEO', 'Obertal', '#FFD100', '#6CACE4', 'historic', 36, 'Hirschburg-Stadion', 13500],
    ['FSV Goldkirchen', 'GOC', 'Goldkirchen', '#000000', '#001F5B', 'historic', 35, 'Zellhafen-Stadion', 12000],
    [
      'Concordia Unter Westertal',
      'COX',
      'Unter Westertal',
      '#0057B8',
      '#E30613',
      'youth',
      35,
      'Stadion am Zellfurt',
      14000,
    ],
    ['Germania Steinhorst 1883', 'STJ32', 'Steinhorst', '#0057B8', '#001F5B', 'fan', 35, 'Greifwald-Stadion', 14000],
    [
      'Blau-Weiß Ober Altfeld',
      'BLB',
      'Ober Altfeld',
      '#00843D',
      '#E30613',
      'selling',
      34,
      'Waldstadion Ober Altfeld',
      11500,
    ],
    ['Hansa Bad Goldberg', 'HAC50', 'Goldberg', '#000000', '#6CACE4', 'fan', 34, 'Mühlau-Stadion', 12500],
    ['SV Lütingen', 'LUT', 'Lütingen', '#00843D', '#6A1B9A', 'historic', 33, 'Sportpark Kalbach', 13500],
    ['FSV Ober Felshafen', 'OBH', 'Ober Felshafen', '#FFD100', '#0057B8', 'fan', 33, 'Stadion Oberhafen', 13500],
    ['Heidheim 1899', 'HEB25', 'Heidheim', '#FFFFFF', '#6A1B9A', 'historic', 33, 'Stadion Heidhof', 12000],
    ['Bad Mühlsee SC', 'BAR63', 'Mühlsee', '#6CACE4', '#FFD100', 'fan', 33, 'Stadion Felshausen', 10000],
    ['Hirschof 04', 'HIW', 'Hirschof', '#FFD100', '#E30613', 'youth', 33, 'Waldwald-Stadion', 12000],
    ['Schwarzstein SC', 'SCK', 'Schwarzstein', '#6A1B9A', '#6CACE4', 'youth', 32, 'Hainwald-Stadion', 9000],
    ['FC Hirscheim 1907', 'HIM', 'Hirscheim', '#000000', '#FFFFFF', 'historic', 31, 'Stadion am Waldburg', 12500],
  ];
  FM.D.CLUBS_BE3 = [
    ['KV Oud Maasbrug', 'OUC', 'Maasbrug', '#FFFFFF', '#FFD100', 'fallen', 43, 'Stedelijk Stadion Maasbrug', 16500],
    ['Sporting Hoogbeek', 'HOX', 'Hoogbeek', '#6A1B9A', '#FFFFFF', 'fallen', 43, 'Stade Communal de Hoogbeek', 16000],
    [
      'KSC Nieuw Leidveen',
      'KSA',
      'Nieuw Leidveen',
      '#0057B8',
      '#6CACE4',
      'fan',
      42,
      'Stade Communal de Nieuw Leidveen',
      15500,
    ],
    ['KSC Kleinzand', 'KSK', 'Kleinzand', '#6CACE4', '#001F5B', 'historic', 42, 'Stade Wagewaard', 14000],
    [
      'Koninklijke Leidhout',
      'KOF',
      'Leidhout',
      '#FFFFFF',
      '#FFD100',
      'historic',
      40,
      'Stedelijk Stadion Leidhout',
      16000,
    ],
    ['KRC Hoornhoven', 'KRL', 'Hoornhoven', '#E30613', '#001F5B', 'historic', 40, 'Hoogbeek Stadion', 12000],
    ['Racing Sneekwijk', 'SNE', 'Sneekwijk', '#FFFFFF', '#0057B8', 'fallen', 39, 'Oostdam Stadion', 12500],
    [
      'Excelsior Klein Grootdam',
      'EOR',
      'Grootdam',
      '#00843D',
      '#FFD100',
      'youth',
      38,
      'Stade Communal de Grootdam',
      16000,
    ],
    ['Racing Haardijk', 'HAQ38', 'Haardijk', '#6CACE4', '#000000', 'fan', 37, 'Stedelijk Stadion Haardijk', 12500],
    [
      'Koninklijke Tilvoort',
      'KKE',
      'Tilvoort',
      '#FFD100',
      '#6A1B9A',
      'fallen',
      36,
      'Stedelijk Stadion Tilvoort',
      11500,
    ],
    [
      'Koninklijke Oostdam',
      'KOO',
      'Oostdam',
      '#FFFFFF',
      '#6CACE4',
      'historic',
      35,
      'Gemeentelijk Stadion Oostdam',
      14500,
    ],
    [
      'Koninklijke Zuidvoort',
      'KOZ',
      'Zuidvoort',
      '#001F5B',
      '#6CACE4',
      'historic',
      35,
      'Gemeentelijk Stadion Zuidvoort',
      10500,
    ],
    ['KAA Bredwijk', 'KAP37', 'Bredwijk', '#FFFFFF', '#FFD100', 'fan', 34, 'Stedelijk Stadion Bredwijk', 11500],
    ['Standard Alkveen', 'SRD', 'Alkveen', '#FFFFFF', '#0057B8', 'historic', 34, 'Westlo Stadion', 13000],
    ['KFC Oosthout', 'KFA', 'Oosthout', '#6CACE4', '#E30613', 'selling', 33, 'Stade Tilburg', 10500],
    ['SK Nieuwdam', 'NIH', 'Nieuwdam', '#FFD100', '#00843D', 'fan', 32, 'Stade Communal de Nieuwdam', 9500],
  ];
  FM.D.CLUBS_BR3 = [
    ['Esporte Clube Capú', 'CAK33', 'Capú', '#0057B8', '#FFFFFF', 'fallen', 55, 'Estádio Itão', 21500],
    ['Sport Club Capipe', 'CAL34', 'Capipe', '#0057B8', '#000000', 'youth', 54, 'Estádio Pindoguá', 19500],
    ['Nacional Marape', 'NMA', 'Marape', '#6A1B9A', '#FFD100', 'fan', 53, 'Estádio Municipal de Marape', 20000],
    ['Esporte Clube Guama', 'GMA', 'Guama', '#6A1B9A', '#00843D', 'fallen', 53, 'Estádio Jacaraguá', 20500],
    [
      'Associação Atlética Tabope',
      'TPE',
      'Tabope',
      '#6CACE4',
      '#001F5B',
      'selling',
      52,
      'Estádio Municipal de Tabope',
      20000,
    ],
    ['Jabotamirim EC', 'JAE', 'Jabotamirim', '#E30613', '#0057B8', 'fan', 52, 'Arena Aracatuba', 19500],
    ['Vassaçu do Sul EC', 'VAY', 'Vassaçu do Sul', '#6CACE4', '#FFD100', 'fallen', 51, 'Estádio Jacaraba', 21000],
    [
      'Sport Club Tabara da Serra',
      'TAT41',
      'Tabara da Serra',
      '#00843D',
      '#6CACE4',
      'selling',
      51,
      'Estádio Municipal de Tabara da Serra',
      21500,
    ],
    ['Sport Club Itiba', 'ITI', 'Itiba', '#FFFFFF', '#FFD100', 'fan', 51, 'Estádio Municipal de Itiba', 21000],
    ['Clube de Regatas Parama', 'REP', 'Parama', '#00843D', '#6A1B9A', 'historic', 49, 'Estádio Arapipe', 18000],
    ['Sport Clube Parara', 'PPA', 'Parara', '#6A1B9A', '#0057B8', 'youth', 49, 'Estádio Novo Jacarina', 19500],
    ['Sport Clube Jabotara', 'JAG', 'Jabotara', '#00843D', '#E30613', 'fallen', 49, 'Estádio Ubatuba', 19000],
    ['União Ibiguá', 'IBI', 'Ibiguá', '#0057B8', '#6CACE4', 'historic', 48, 'Estádio Novo Tijai', 20500],
    ['Sport Club Itão', 'ITC', 'Itão', '#6CACE4', '#FFFFFF', 'fan', 47, 'Estádio Marina', 18500],
    [
      'Esporte Clube Jabotoma',
      'JMA',
      'Jabotoma',
      '#FFFFFF',
      '#0057B8',
      'youth',
      47,
      'Estádio Municipal de Jabotoma',
      16500,
    ],
    ['Atlético Itajópolis', 'ITS', 'Itajópolis', '#00843D', '#6CACE4', 'youth', 47, 'Estádio Pindão', 19000],
    ['Atlético Aracatoma', 'AMD', 'Aracatoma', '#6CACE4', '#E30613', 'youth', 46, 'Arena Tijú', 18500],
    ['Sociedade Esportiva Tabai', 'TTA', 'Tabai', '#00843D', '#6A1B9A', 'fan', 44, 'Estádio Nhanaba', 14000],
    [
      'São Jabotina EC',
      'SAU42',
      'São Jabotina',
      '#0057B8',
      '#FFD100',
      'fan',
      44,
      'Estádio Municipal de São Jabotina',
      18000,
    ],
    [
      'Urucoguá Futebol Clube',
      'URD',
      'Urucoguá',
      '#001F5B',
      '#6A1B9A',
      'selling',
      43,
      'Estádio Municipal de Urucoguá',
      13500,
    ],
  ];
  FM.D.CLUBS_CL3 = [
    ['Almaza Balompié', 'ALS64', 'Almaza', '#00843D', '#001F5B', 'fan', 44, 'Estadio La Sorilla', 18500],
    ['Fuentera CF', 'FUM', 'Fuentera', '#6CACE4', '#000000', 'selling', 43, 'Ciudad Deportiva Fuentera', 15000],
    ['Juventud Lermara', 'LEC', 'Lermara', '#FFD100', '#FFFFFF', 'selling', 41, 'Estadio Quintena', 13000],
    ['Real Unión Pedanes', 'PED27', 'Pedanes', '#001F5B', '#0057B8', 'fan', 41, 'Nuevo Estadio Pedanes', 14500],
    ['Sporting Alto Cuenejo', 'ATD', 'Cuenejo', '#E30613', '#FFD100', 'historic', 40, 'Estadio Benón', 13500],
    ['Deportivo Pozón', 'POG30', 'Pozón', '#FFD100', '#000000', 'fan', 39, 'Estadio Plasanes', 13000],
    ['Real Unión Tarifero', 'TAO', 'Tarifero', '#6CACE4', '#001F5B', 'fan', 38, 'Estadio Municipal de Tarifero', 15500],
    ['Deportivo Pededa', 'PEE28', 'Pededa', '#00843D', '#E30613', 'fan', 37, 'Campo de Pededa', 14500],
    [
      'Bajo Roblera Balompié',
      'BAX45',
      'Roblera',
      '#FFD100',
      '#00843D',
      'selling',
      36,
      'Estadio Municipal de Roblera',
      13000,
    ],
    ['Atlético Morala', 'MOK33', 'Morala', '#00843D', '#6A1B9A', 'historic', 35, 'Campo de Morala', 13000],
    ['Unión Villino', 'VIC26', 'Villino', '#6A1B9A', '#6CACE4', 'historic', 34, 'Ciudad Deportiva Villino', 14000],
    ['UD Marbete', 'MTE', 'Marbete', '#0057B8', '#E30613', 'fan', 34, 'Estadio Municipal de Marbete', 10000],
    ['CD Villete', 'VID27', 'Villete', '#6A1B9A', '#E30613', 'fallen', 33, 'Nuevo Estadio Villete', 11500],
    ['Roblanes CF', 'ROR', 'Roblanes', '#FFFFFF', '#6A1B9A', 'fan', 33, 'Estadio Alcaledo', 9000],
  ];
  FM.D.CLUBS_CS3 = [
    ['Kaichuan Lions', 'KLI', 'Kaichuan', '#E30613', '#6CACE4', 'historic', 43, 'Ningzhou Arena', 14000],
    ['Longshan Sports', 'LOS', 'Longshan', '#FFFFFF', '#FFD100', 'fan', 43, 'Pingning Stadium', 17000],
    ['Huazhou United', 'HUU', 'Huazhou', '#001F5B', '#00843D', 'historic', 42, 'Linhai Arena', 15000],
    ['Changzhou United', 'CHL34', 'Changzhou', '#001F5B', '#0057B8', 'fan', 40, 'Taihai Stadium', 13500],
    ['Xingang Tigers', 'XIG', 'Xingang', '#FFD100', '#6CACE4', 'fallen', 39, 'Dongcheng Arena', 15500],
    ['Ningyang Steel', 'NNG', 'Ningyang', '#FFFFFF', '#FFD100', 'historic', 38, 'Ningyang Sports Centre', 14500],
    ['Shanmen Lions', 'SLL', 'Shanmen', '#6CACE4', '#000000', 'fan', 36, 'Shanmen Sports Centre', 10000],
    ['Changang City', 'CHM35', 'Changang', '#0057B8', '#001F5B', 'fan', 36, 'Tayang Stadium', 12000],
    ['Ruimen Phoenix', 'RET', 'Ruimen', '#FFFFFF', '#001F5B', 'fan', 36, 'Ancheng Stadium', 15000],
    ['Ruitang FC', 'RUJ', 'Ruitang', '#0057B8', '#E30613', 'fan', 34, 'Anhai Stadium', 10500],
    ['Yuntang FC', 'YUG', 'Yuntang', '#000000', '#6CACE4', 'fan', 33, 'Ruyang Stadium', 11500],
    ['Anmen FC', 'ANM', 'Anmen', '#6A1B9A', '#E30613', 'youth', 32, 'Ruyuan Stadium', 13000],
  ];
  FM.D.CLUBS_CZ3 = [
    ['Dukla Bohany', 'DUF', 'Bohany', '#001F5B', '#FFD100', 'fan', 43, 'Stadion u Mladany', 16500],
    ['Dukla Jabená', 'DLA', 'Jabená', '#6CACE4', '#FFFFFF', 'selling', 42, 'Městský stadion Jabená', 15000],
    ['Spartak Nový Doubice', 'SPE28', 'Nový Doubice', '#000000', '#00843D', 'fan', 42, 'Stadion Lysice', 15000],
    ['Železárny Starý Lysov', 'ZEB25', 'Starý Lysov', '#E30613', '#0057B8', 'historic', 42, 'Stadion Mladice', 17000],
    ['Strov Slovan', 'STC26', 'Strov', '#FFFFFF', '#FFD100', 'fan', 41, 'Stadion u Mladov', 13000],
    ['TJ Olomice', 'OCE', 'Olomice', '#FFFFFF', '#000000', 'youth', 41, 'Aréna Prostoná', 15000],
    ['SK Karodov', 'KAA48', 'Karodov', '#FFD100', '#0057B8', 'youth', 41, 'Aréna Pardín', 13500],
    ['Spartak Rokín', 'SRO', 'Rokín', '#00843D', '#0057B8', 'fallen', 39, 'Stadion u Straná', 16000],
    ['1. FC Doubice', 'DOG30', 'Doubice', '#FFFFFF', '#6CACE4', 'selling', 39, 'Letní stadion Doubice', 16000],
    ['Spartak Holice', 'SPF29', 'Holice', '#001F5B', '#00843D', 'historic', 38, 'Aréna Doubava', 13500],
    ['FC Vysodov', 'VYB', 'Vysodov', '#6CACE4', '#6A1B9A', 'historic', 38, 'Letní stadion Vysodov', 12500],
    ['SK Jabice', 'JAM', 'Jabice', '#6CACE4', '#FFFFFF', 'youth', 38, 'Letní stadion Jabice', 15000],
    ['Železárny Trenava', 'ZEA24', 'Trenava', '#FFD100', '#000000', 'fan', 38, 'Městský stadion Trenava', 11500],
    ['1. FC Holená', 'HOM35', 'Holená', '#000000', '#00843D', 'selling', 38, 'Městský stadion Holená', 13000],
    ['Železárny Liboná', 'ZEY', 'Liboná', '#FFFFFF', '#6CACE4', 'historic', 37, 'Městský stadion Liboná', 15000],
    ['Dynamo Prostodov', 'POH31', 'Prostodov', '#FFFFFF', '#FFD100', 'fan', 37, 'Stadion u Vysedov', 15500],
    ['Sokol Jabín', 'JAL', 'Jabín', '#6A1B9A', '#6CACE4', 'fan', 37, 'Aréna Mladov', 11000],
    ['Dukla Lysice', 'DUP', 'Lysice', '#6CACE4', '#000000', 'fan', 37, 'Stadion Strany', 11500],
    ['1. FC Horní Rokov', 'HNI', 'Horní Rokov', '#E30613', '#6A1B9A', 'historic', 36, 'Stadion Rychodov', 12000],
    ['FC Dolní Prostice', 'DOI', 'Dolní Prostice', '#0057B8', '#00843D', 'historic', 35, 'Stadion u Strava', 14000],
    ['FC Holec', 'HOL34', 'Holec', '#6CACE4', '#FFD100', 'fan', 35, 'Aréna Zlínodov', 14000],
    [
      'Spartak Horní Hradov',
      'SPT41',
      'Horní Hradov',
      '#FFD100',
      '#00843D',
      'fan',
      35,
      'Městský stadion Horní Hradov',
      14000,
    ],
    ['FC Strín', 'STK33', 'Strín', '#FFD100', '#6A1B9A', 'youth', 35, 'Aréna Hradice', 11500],
    ['Dynamo Rokyná', 'ROJ32', 'Rokyná', '#6A1B9A', '#0057B8', 'youth', 35, 'Městský stadion Rokyná', 14500],
    ['FC Trenedov', 'TRP', 'Trenedov', '#FFD100', '#6A1B9A', 'fan', 35, 'Stadion Bohodov', 12500],
    ['Sparta Rokydov', 'ROV', 'Rokydov', '#E30613', '#000000', 'historic', 34, 'Letní stadion Rokydov', 12500],
    ['Sokol Kostená', 'KOS', 'Kostená', '#000000', '#FFD100', 'selling', 34, 'Letní stadion Kostená', 9500],
    ['1. FC Rychoná', 'RYF', 'Rychoná', '#001F5B', '#0057B8', 'historic', 34, 'Stadion u Holany', 11000],
    ['Slavoj Bohov', 'BOL34', 'Bohov', '#00843D', '#000000', 'historic', 34, 'Letní stadion Bohov', 10500],
    ['1. FC Pelhov', 'PEF29', 'Pelhov', '#FFD100', '#6CACE4', 'selling', 33, 'Stadion u Mladec', 11000],
    ['Horní Trenov Slovan', 'HOI', 'Horní Trenov', '#E30613', '#001F5B', 'historic', 33, 'Aréna Jabená', 12000],
    ['Dukla Strice', 'DST', 'Strice', '#FFFFFF', '#FFD100', 'youth', 32, 'Stadion Vsetínov', 9000],
  ];
  FM.D.CLUBS_DK3 = [
    ['FC Langfors', 'LAG30', 'Langfors', '#FFD100', '#00843D', 'fan', 44, 'Langfors Idrætsanlæg', 15000],
    ['Dalby IL', 'DAY', 'Dalby', '#FFD100', '#001F5B', 'fan', 42, 'Holborg Idrætspark', 13000],
    ['Solnæs IF', 'SOT', 'Solnæs', '#FFD100', '#E30613', 'fan', 40, 'Havik Stadion', 13000],
    ['IK Lillevang', 'LIB25', 'Lillevang', '#000000', '#00843D', 'historic', 40, 'Strandø Idrætspark', 16000],
    ['FC Strandø', 'SNB', 'Strandø', '#FFD100', '#6CACE4', 'youth', 39, 'Holdal Stadion', 16000],
    ['Hedvik IL', 'HEM', 'Hedvik', '#00843D', '#001F5B', 'fallen', 39, 'Vestrud Stadion', 13500],
    ['IK Langnæs', 'LNS', 'Langnæs', '#FFFFFF', '#6CACE4', 'historic', 37, 'Dyrvang Idrætspark', 13000],
    ['Nordvik Fotball', 'NOY', 'Nordvik', '#6A1B9A', '#FFD100', 'historic', 36, 'Strandvang Idrætspark', 13000],
    ['Strandstad IF', 'SAV43', 'Strandstad', '#001F5B', '#FFFFFF', 'selling', 35, 'Dalund Idrætspark', 14000],
    [
      'Vesterfjordsund Boldklub',
      'VNA',
      'Vesterfjordsund',
      '#001F5B',
      '#E30613',
      'fan',
      34,
      'Vesterfjordsund Idrætsanlæg',
      12000,
    ],
    ['Holøkke FK', 'HOY', 'Holøkke', '#000000', '#FFFFFF', 'selling', 32, 'Dalnæs Park', 10500],
    ['FC Østerbrorud', 'SUJ', 'Østerbrorud', '#001F5B', '#E30613', 'historic', 31, 'Østerbrorud Arena', 11000],
  ];
  FM.D.CLUBS_FR3 = [
    ['Étoile de Blancourt', 'BLT', 'Blancourt', '#FFD100', '#0057B8', 'fallen', 49, 'Stade Thomont', 17000],
    ['Stade Château-Courens', 'CAM35', 'Courens', '#000000', '#6A1B9A', 'historic', 49, 'Complexe Fonange', 19000],
    ['ES Aubgnan', 'AUE', 'Aubgnan', '#00843D', '#0057B8', 'youth', 48, 'Stade de la Arières', 17000],
    ['Stade Beauac', 'BEL34', 'Beauac', '#001F5B', '#FFD100', 'fan', 47, 'Stade Dieulac', 17000],
    ['Étoile Durcourt', 'DUG', 'Durcourt', '#6CACE4', '#FFD100', 'youth', 47, 'Stade Paueau', 16500],
    ['US Beauange', 'BEM35', 'Beauange', '#6CACE4', '#000000', 'fan', 46, 'Stade de la Dieubourg', 19500],
    ['Racing Bourange', 'BOY', 'Bourange', '#6A1B9A', '#00843D', 'fan', 45, 'Stade Municipal de Bourange', 18500],
    ['Sporting Blanbourg', 'BLG', 'Blanbourg', '#001F5B', '#000000', 'fallen', 44, 'Stade Nanens', 15500],
    ['Union Pauville', 'PAN36', 'Pauville', '#6CACE4', '#E30613', 'fallen', 43, 'Parc des Sports de Pauville', 17000],
    [
      'ES Sainte-Vilange',
      'SAI',
      'Sainte-Vilange',
      '#001F5B',
      '#6A1B9A',
      'fallen',
      43,
      'Parc des Sports de Sainte-Vilange',
      16000,
    ],
    ['AS Sainte-Beauay', 'SAW44', 'Sainte-Beauay', '#001F5B', '#000000', 'historic', 42, 'Stade Joyac', 16500],
    ['ES Valault', 'VLB', 'Valault', '#FFD100', '#001F5B', 'youth', 41, 'Complexe Fonault', 12500],
    ['US Rocon', 'ROX', 'Rocon', '#00843D', '#6A1B9A', 'fan', 40, 'Stade Beleau', 17000],
    ['AS Cassange', 'CGE', 'Cassange', '#6A1B9A', '#0057B8', 'selling', 39, 'Complexe Valières', 14000],
    ['AJ Mirens', 'MNS', 'Mirens', '#FFD100', '#001F5B', 'fallen', 38, 'Stade Monmont', 14500],
    ['AS Belange', 'BGE', 'Belange', '#6A1B9A', '#000000', 'historic', 38, 'Stade Bourault', 14000],
  ];
  FM.D.CLUBS_GR3 = [
    ['Seria FC', 'SIY', 'Seria', '#FFD100', '#001F5B', 'historic', 44, 'Ethniko Stadio Seria', 17500],
    ['AE Kavópetra', 'KKA', 'Kavópetra', '#FFD100', '#001F5B', 'selling', 43, 'Dimotiko Stadio Kavópetra', 15000],
    ['AE Pelouli', 'PLI', 'Pelouli', '#6CACE4', '#0057B8', 'fan', 42, 'Dimotiko Stadio Pelouli', 16000],
    ['Ethnikos Pirás', 'PIR', 'Pirás', '#001F5B', '#6CACE4', 'fallen', 41, 'Stadio Maros', 14000],
    ['Pirouli FC', 'PII', 'Pirouli', '#FFD100', '#00843D', 'historic', 40, 'Stadio Lamás', 13500],
    ['Niki Kavaki', 'KKI', 'Kavaki', '#001F5B', '#000000', 'historic', 39, 'Stadio Kavos', 13500],
    ['PAE Maránia', 'MIH', 'Maránia', '#6A1B9A', '#001F5B', 'historic', 38, 'Stadio Piros', 13000],
    ['AO Pataki', 'PAP37', 'Pataki', '#FFD100', '#6CACE4', 'fan', 36, 'Stadio Alexikos', 14000],
    ['Ethnikos Lamos', 'LAH31', 'Lamos', '#6A1B9A', '#E30613', 'historic', 36, 'Ethniko Stadio Lamos', 13500],
    ['Mesikos FC', 'MEW', 'Mesikos', '#000000', '#6CACE4', 'youth', 36, 'Dimotiko Stadio Mesikos', 12500],
    ['AO Chalaki', 'CKI', 'Chalaki', '#6A1B9A', '#000000', 'fan', 34, 'Dimotiko Stadio Chalaki', 13000],
    ['GS Nikaki', 'NIJ', 'Nikaki', '#FFFFFF', '#6A1B9A', 'fan', 34, 'Ethniko Stadio Nikaki', 9500],
    ['AO Argás', 'ARV', 'Argás', '#00843D', '#E30613', 'youth', 33, 'Stadio Argouli', 11000],
    ['Doxa Thesouli', 'THU', 'Thesouli', '#FFFFFF', '#E30613', 'fallen', 32, 'Stadio Argópetra', 9500],
  ];
  FM.D.CLUBS_HU3 = [
    ['Mezefalva FC', 'MEZ', 'Mezefalva', '#6CACE4', '#000000', 'historic', 43, 'Dabád Stadion', 14000],
    ['Lőrehegy FC', 'LOY', 'Lőrehegy', '#6CACE4', '#00843D', 'fallen', 43, 'Orsafalva Stadion', 13500],
    ['Bakény VSC', 'BAY46', 'Bakény', '#E30613', '#FFFFFF', 'selling', 42, 'Bakény Sportpálya', 14000],
    ['Rácó SC', 'RAB25', 'Rácó', '#001F5B', '#00843D', 'historic', 42, 'Ráceszeg Stadion', 15000],
    ['Kálak SE', 'KAY46', 'Kálak', '#FFFFFF', '#001F5B', 'fallen', 42, 'Lőrahegy Stadion', 13500],
    ['Fehéralak AC', 'FEH', 'Fehéralak', '#001F5B', '#E30613', 'fallen', 41, 'Fehéralak Városi Stadion', 15000],
    ['Pászád AC', 'PAQ38', 'Pászád', '#000000', '#00843D', 'youth', 40, 'Pászád Városi Stadion', 16500],
    ['FC Kisveszeg', 'KIY', 'Kisveszeg', '#FFFFFF', '#6A1B9A', 'fan', 40, 'Gyönó Aréna', 15000],
    ['Baró SC', 'BAU66', 'Baró', '#E30613', '#0057B8', 'historic', 40, 'Gyönehegy Stadion', 15000],
    ['Fehéreszeg SC', 'FEG', 'Fehéreszeg', '#001F5B', '#6A1B9A', 'fallen', 39, 'Kálény Stadion', 15500],
    ['Hajdeváros VSC', 'HAD51', 'Hajdeváros', '#001F5B', '#000000', 'selling', 39, 'Hajdalak Aréna', 12000],
    ['Orsó Futball Club', 'ORN', 'Orsó', '#001F5B', '#E30613', 'historic', 39, 'Zalakert Stadion', 14000],
    ['Kisvád AC', 'KIF29', 'Kisvád', '#000000', '#6A1B9A', 'youth', 39, 'Kisvád Városi Stadion', 12000],
    ['Hajdakert Futball Club', 'HAF53', 'Hajdakert', '#E30613', '#001F5B', 'historic', 39, 'Zalény Stadion', 11500],
    ['Egyetértés Bakert', 'BAT65', 'Bakert', '#FFD100', '#FFFFFF', 'historic', 39, 'Bakert Sportpálya', 12000],
    ['Mezetelek Futball Club', 'MEF29', 'Mezetelek', '#FFD100', '#E30613', 'fan', 39, 'Mezetelek Sportpálya', 13000],
    ['Orselak FC', 'ORP', 'Orselak', '#6CACE4', '#00843D', 'historic', 39, 'Orselak Sportpálya', 15000],
    ['Egyetértés Pászény', 'PNY', 'Pászény', '#FFFFFF', '#0057B8', 'selling', 38, 'Tiszaváros Stadion', 12500],
    ['Egyetértés Kisvó', 'KIZ', 'Kisvó', '#001F5B', '#00843D', 'historic', 38, 'Veszakert Stadion', 14000],
    ['Kisvaszeg SC', 'KIE28', 'Kisvaszeg', '#000000', '#E30613', 'historic', 38, 'Kisvaszeg Sportpálya', 13500],
    ['Dunád FC', 'DUM', 'Dunád', '#6CACE4', '#001F5B', 'selling', 38, 'Mezakert Stadion', 13500],
    ['Egyetértés Veszetelek', 'VEG30', 'Veszetelek', '#E30613', '#FFD100', 'fan', 37, 'Lőrefalva Aréna', 13000],
    ['Bakefalva FC', 'BAS64', 'Bakefalva', '#001F5B', '#E30613', 'fan', 37, 'Kálavár Stadion', 13500],
    ['Lőratelek SE', 'LOA24', 'Lőratelek', '#001F5B', '#E30613', 'fan', 37, 'Lőratelek Városi Stadion', 13500],
    ['Egyetértés Győreváros', 'GYS', 'Győreváros', '#000000', '#001F5B', 'fan', 37, 'Nagád Aréna', 11000],
    ['Lőraszeg SE', 'LOB25', 'Lőraszeg', '#FFFFFF', '#6A1B9A', 'historic', 37, 'Dabevár Stadion', 11500],
    ['Szarvaháza Sport Egylet', 'SZA', 'Szarvaháza', '#00843D', '#FFFFFF', 'fan', 36, 'Rácelak Stadion', 13500],
    ['Dabaváros SE', 'DAT', 'Dabaváros', '#6CACE4', '#FFFFFF', 'fan', 36, 'Dabaváros Városi Stadion', 14000],
    ['Szarvár Futball Club', 'SZB', 'Szarvár', '#E30613', '#000000', 'selling', 36, 'Bakád Stadion', 11000],
    ['Mezakert Sport Egylet', 'MEE28', 'Mezakert', '#6A1B9A', '#6CACE4', 'fan', 36, 'Mezakert Városi Stadion', 12500],
    ['Pászafalva SC', 'PAG54', 'Pászafalva', '#E30613', '#000000', 'fan', 35, 'Pászafalva Sportpálya', 10500],
    ['Rácatelek FC', 'RAC26', 'Rácatelek', '#0057B8', '#000000', 'fan', 34, 'Rácatelek Városi Stadion', 13500],
    ['Szarveháza SE', 'SZS', 'Szarveháza', '#6A1B9A', '#0057B8', 'historic', 34, 'Csajeháza Stadion', 12000],
    ['Rácelak Sport Egylet', 'RAN36', 'Rácelak', '#6CACE4', '#0057B8', 'selling', 34, 'Rácelak Városi Stadion', 13000],
    ['Egyetértés Bakalak', 'BBG', 'Bakalak', '#00843D', '#FFD100', 'youth', 34, 'Dabetelek Stadion', 10500],
    ['FC Újkáleháza', 'UJK', 'Újkáleháza', '#FFFFFF', '#001F5B', 'fallen', 34, 'Veszád Stadion', 11000],
    ['Dabó FC', 'DAW', 'Dabó', '#000000', '#FFFFFF', 'historic', 33, 'Kálak Stadion', 11500],
    ['Győrakert AC', 'GYF', 'Győrakert', '#FFD100', '#FFFFFF', 'historic', 33, 'Dabeváros Aréna', 10500],
    ['Egyetértés Hajdó', 'HAE52', 'Hajdó', '#000000', '#E30613', 'fallen', 33, 'Fehéreváros Stadion', 10500],
    ['Dunalak TE', 'DUL', 'Dunalak', '#000000', '#6CACE4', 'fallen', 33, 'Veszahegy Stadion', 12500],
    ['Lőrevár SC', 'LAZ47', 'Lőrevár', '#FFFFFF', '#6A1B9A', 'fallen', 33, 'Lőrevár Sportpálya', 10500],
    ['Veszény SE', 'VEH31', 'Veszény', '#FFD100', '#00843D', 'fallen', 33, 'Veszény Sportpálya', 13500],
    ['Dabahegy TE', 'DAG30', 'Dabahegy', '#00843D', '#FFFFFF', 'fan', 33, 'Győró Stadion', 12500],
    ['Lőralak SC', 'LAA48', 'Lőralak', '#6A1B9A', '#001F5B', 'historic', 33, 'Bakaváros Stadion', 9500],
    ['Nagygyönaváros SE', 'NAQ38', 'Nagygyönaváros', '#0057B8', '#FFD100', 'fan', 32, 'Hajdafalva Aréna', 11000],
    ['Hajdelak Futball Club', 'HAR39', 'Hajdelak', '#0057B8', '#001F5B', 'historic', 32, 'Dunaháza Stadion', 12500],
    ['Egyetértés Dabefalva', 'DAF29', 'Dabefalva', '#0057B8', '#6A1B9A', 'youth', 32, 'Dabefalva Sportpálya', 9000],
    ['FC Gyönény', 'GYG', 'Gyönény', '#FFD100', '#FFFFFF', 'fan', 32, 'Zalalak Aréna', 12500],
  ];
  FM.D.CLUBS_ID3 = [
    ['Persi Cirebaya', 'PSB', 'Cirebaya', '#E30613', '#6A1B9A', 'fan', 40, 'Tasirang Stadium', 16500],
    ['PS Tangkalan', 'PSD', 'Tangkalan', '#001F5B', '#0057B8', 'fan', 38, 'Bogorang Sports Park', 11500],
    ['Bhakti Kedijaya', 'BHE', 'Kedijaya', '#0057B8', '#6CACE4', 'historic', 38, 'Purawati Arena', 14000],
    ['Bhakti Tangiri', 'BHF', 'Tangiri', '#FFD100', '#00843D', 'selling', 36, 'Purawati Stadium', 15000],
    ['Bhakti Pamangan', 'BTI', 'Pamangan', '#E30613', '#001F5B', 'selling', 36, 'Kedipura Stadium', 15000],
    ['Persi Semakalan', 'PSE', 'Semakalan', '#000000', '#FFFFFF', 'historic', 35, 'Cirerang Arena', 13000],
    ['Banjaya Putra', 'BYB', 'Banjaya', '#000000', '#FFFFFF', 'fan', 35, 'Banjaya Provincial Stadium', 12500],
    ['Persi Jembdongan', 'PJE', 'Jembdongan', '#001F5B', '#00843D', 'fan', 34, 'Bangiri Stadium', 14500],
    [
      'Persi Bogolembang',
      'PEG30',
      'Bogolembang',
      '#6CACE4',
      '#0057B8',
      'fan',
      34,
      'Bogolembang Provincial Stadium',
      12500,
    ],
    ['Persi Pamagiri', 'PEH31', 'Pamagiri', '#E30613', '#6A1B9A', 'fan', 33, 'Pamagiri Provincial Stadium', 13500],
    ['Ciresari United', 'CIR', 'Ciresari', '#0057B8', '#00843D', 'fan', 32, 'Langbaya Arena', 10500],
    ['PS Solalembang', 'PPB', 'Solalembang', '#0057B8', '#E30613', 'fallen', 31, 'Malasari Sports Park', 12500],
    [
      'Persi Semalembang',
      'PEJ32',
      'Semalembang',
      '#6CACE4',
      '#001F5B',
      'selling',
      30,
      'Semalembang Provincial Stadium',
      10000,
    ],
    ['Persi Tasikalan', 'PEK33', 'Tasikalan', '#E30613', '#000000', 'selling', 30, 'Purasari Stadium', 11500],
    ['Langpura Putra', 'LAJ32', 'Langpura', '#6CACE4', '#00843D', 'fan', 29, 'Purarang Arena', 9000],
    ['Semagiri FC', 'SEB25', 'Semagiri', '#00843D', '#000000', 'fan', 28, 'Solabaya Arena', 8000],
  ];
  FM.D.CLUBS_IR3 = [
    ['Foolad Rasman', 'FOO', 'Rasman', '#FFFFFF', '#6A1B9A', 'fan', 43, 'Azadi Rasman Stadium', 14000],
    ['Sanat Bandar Ardakan', 'SAX45', 'Ardakan', '#FFD100', '#0057B8', 'fan', 42, 'Qaztan Stadium', 16000],
    ['Naft Yazjan', 'NFA', 'Yazjan', '#FFFFFF', '#E30613', 'historic', 41, 'Yazjan Takhti Stadium', 13000],
    ['Sanat Hamshahr', 'SAY46', 'Hamshahr', '#00843D', '#001F5B', 'historic', 41, 'Hamshahr Takhti Stadium', 16500],
    ['Sanat Ilamfahan', 'SAZ47', 'Ilamfahan', '#000000', '#6CACE4', 'fan', 40, 'Ilamfahan Takhti Stadium', 15000],
    ['Sanat Kermabad', 'SKE', 'Kermabad', '#6CACE4', '#FFFFFF', 'fallen', 39, 'Gorijan Stadium', 16000],
    ['Sirtan FC', 'SIZ', 'Sirtan', '#6CACE4', '#001F5B', 'historic', 38, 'Azadi Sirtan Stadium', 14500],
    ['Foolad Ardabad', 'FOG', 'Ardabad', '#6A1B9A', '#0057B8', 'fan', 37, 'Kermraz Stadium', 13500],
    ['Esteghlal Sirud', 'EAL', 'Sirud', '#FFFFFF', '#FFD100', 'historic', 36, 'Ahvabad Sports Complex', 13000],
    ['Gol Zandan', 'GOZ', 'Zandan', '#6A1B9A', '#0057B8', 'fan', 35, 'Azadi Zandan Stadium', 13000],
    ['Sepahan Bushabad', 'SBU', 'Bushabad', '#FFFFFF', '#0057B8', 'youth', 35, 'Azadi Bushabad Stadium', 12500],
    ['Zob Shavin', 'ZOA', 'Shavin', '#001F5B', '#FFD100', 'selling', 34, 'Azadi Shavin Stadium', 12500],
    ['Pas Orumriz', 'PAR39', 'Orumriz', '#FFFFFF', '#000000', 'fallen', 33, 'Azadi Orumriz Stadium', 12500],
    ['Fajr Ahvijan', 'FAF', 'Ahvijan', '#6CACE4', '#E30613', 'fan', 33, 'Ahvijan Takhti Stadium', 9500],
  ];
  FM.D.CLUBS_IT3 = [
    ['Audace Ponello', 'POJ32', 'Ponello', '#FFFFFF', '#00843D', 'selling', 50, 'Stadio Santezia', 19000],
    ['Atletico Borale', 'BOA24', 'Borale', '#6A1B9A', '#FFFFFF', 'historic', 50, 'Stadio Modone', 18000],
    ['Pro Ponia', 'POR39', 'Ponia', '#FFD100', '#000000', 'historic', 50, 'Stadio Nuovo Venucci', 20000],
    ['AC Lanucci', 'LAS40', 'Lanucci', '#00843D', '#6CACE4', 'fan', 50, 'Stadio Civico di Lanucci', 17000],
    ['US Ravucci', 'RAM35', 'Ravucci', '#00843D', '#FFFFFF', 'fan', 50, 'Stadio Nuovo Corento', 20000],
    ['Atletico Monago', 'MGO', 'Monago', '#00843D', '#001F5B', 'selling', 49, 'Stadio Roccone', 16000],
    ['Atletico Albone 1914', 'ALK81', 'Albone', '#00843D', '#FFD100', 'historic', 49, 'Arena Pescara', 19000],
    ['AC Porto Miretto', 'POS40', 'Miretto', '#6A1B9A', '#FFD100', 'fan', 49, 'Stadio Ravia', 20000],
    ['Audace San Boria', 'BOJ32', 'Boria', '#6A1B9A', '#FFD100', 'historic', 49, 'Stadio Civico di Boria', 19000],
    ['San Gubbona 1908', 'GUH', 'Gubbona', '#6CACE4', '#001F5B', 'fan', 48, 'Stadio Nuovo Moducci', 16500],
    ['Iuventa Ravia di Sotto', 'IUC', 'Ravia di Sotto', '#00843D', '#FFD100', 'fan', 48, 'Stadio Nuovo Leccago', 19000],
    ['Fabrano 1908', 'FAG', 'Fabrano', '#6A1B9A', '#E30613', 'selling', 47, 'Arena Ferento', 16000],
    ['Vis Fosale', 'VIE28', 'Fosale', '#E30613', '#6CACE4', 'fan', 47, 'Arena Galona', 17000],
    ['US Borgo Gubbola', 'BOH31', 'Gubbola', '#FFD100', '#E30613', 'youth', 47, 'Stadio Comunale di Gubbola', 15500],
    ['AC Frascino', 'FRY', 'Frascino', '#000000', '#6CACE4', 'fan', 47, 'Stadio Belago', 16500],
    [
      'Virtus Monte Amalento',
      'MOQ38',
      'Monte Amalento',
      '#FFFFFF',
      '#6CACE4',
      'historic',
      47,
      'Stadio Civico di Monte Amalento',
      16000,
    ],
    ['Robur Arezino', 'ROG30', 'Arezino', '#6A1B9A', '#000000', 'historic', 47, 'Stadio Venana', 16000],
    ['Porto Galara Calcio', 'PTB', 'Porto Galara', '#0057B8', '#001F5B', 'youth', 47, 'Arena Modara', 16000],
    ['Unione Padetto', 'PTO', 'Padetto', '#001F5B', '#E30613', 'fan', 46, 'Stadio Cestate', 16000],
    ['Unione Borello', 'BOO', 'Borello', '#000000', '#FFFFFF', 'historic', 46, 'Stadio Galetto', 16000],
    ['Pro Amalano 1895', 'AMJ', 'Amalano', '#6A1B9A', '#6CACE4', 'fan', 46, 'Stadio Civico di Amalano', 19000],
    ['Sporting Fabria', 'FAP', 'Fabria', '#6A1B9A', '#0057B8', 'selling', 46, 'Stadio Fabrano', 19500],
    ['Iuventa Modia', 'IUB', 'Modia', '#FFFFFF', '#00843D', 'historic', 46, 'Stadio Nuovo Sassia', 15000],
    ['Pro Gubbano', 'GUO', 'Gubbano', '#001F5B', '#000000', 'historic', 45, 'Stadio Valona', 16500],
    ['Audace Roccale', 'ROZ', 'Roccale', '#6A1B9A', '#0057B8', 'fan', 45, 'Stadio Comunale di Roccale', 18000],
    ['Unione Torone', 'TOA24', 'Torone', '#6A1B9A', '#6CACE4', 'historic', 45, 'Arena Belana', 17500],
    ['Unione Casola di Sotto', 'CAB49', 'Casola di Sotto', '#6CACE4', '#00843D', 'youth', 45, 'Arena Valia', 17000],
    ['Iuventa Casate', 'IUV', 'Casate', '#FFFFFF', '#FFD100', 'fan', 44, 'Stadio Nuovo Ferana', 19000],
    ['Audace Castel Cestello', 'CAA48', 'Castel Cestello', '#000000', '#0057B8', 'youth', 44, 'Stadio Roccetto', 14500],
    ['FC Modone 1925', 'MOL', 'Modone', '#FFD100', '#6CACE4', 'fan', 44, 'Arena Lanezia', 14500],
    ['Audace Marino', 'MAK57', 'Marino', '#6CACE4', '#E30613', 'fallen', 44, 'Stadio Valate', 14500],
    ['Unione Ponara', 'POT41', 'Ponara', '#000000', '#6A1B9A', 'fan', 44, 'Stadio Comunale di Ponara', 18000],
    ['Virtus Belone', 'BEW44', 'Belone', '#FFD100', '#FFFFFF', 'fan', 44, 'Stadio Sassago', 15000],
    ['US Serino', 'SEC26', 'Serino', '#001F5B', '#6CACE4', 'fan', 43, 'Stadio Nuovo Venento', 17000],
    ['Audace Borara', 'BOB25', 'Borara', '#FFD100', '#6A1B9A', 'fallen', 43, 'Stadio Cestara', 14000],
    ['FC Serana 1918', 'SED27', 'Serana', '#001F5B', '#6CACE4', 'selling', 43, 'Stadio Civico di Serana', 17000],
    ['SS Orvucci', 'SSC', 'Orvucci', '#6CACE4', '#6A1B9A', 'selling', 43, 'Stadio Ferale', 16000],
    ['AC Padago 1920', 'PAD51', 'Padago', '#FFFFFF', '#E30613', 'fan', 43, 'Stadio Civico di Padago', 15000],
    ['Vis Monetto', 'VIN36', 'Monetto', '#FFFFFF', '#6CACE4', 'historic', 43, 'Stadio Ponola', 13500],
    ['Unione Ferone', 'FEE', 'Ferone', '#001F5B', '#FFD100', 'fan', 43, 'Stadio Belezia', 17500],
    ['Atletico Corino', 'COG30', 'Corino', '#0057B8', '#00843D', 'fan', 43, 'Stadio Pescia', 18000],
    ['Piezia Calcio', 'PIM', 'Piezia', '#E30613', '#00843D', 'fan', 43, 'Stadio Nuovo Belano', 14500],
    ['US Venola', 'VEF29', 'Venola', '#6CACE4', '#6A1B9A', 'fan', 42, 'Stadio Civico di Venola', 14500],
    ['Fidelis Arezago', 'FID', 'Arezago', '#001F5B', '#6A1B9A', 'fan', 42, 'Stadio Roccucci', 16500],
    ['Audace Belento', 'BEX45', 'Belento', '#FFD100', '#001F5B', 'fan', 42, 'Stadio Sassale', 15500],
    [
      'Robur Villa Galone',
      'RGA',
      'Villa Galone',
      '#E30613',
      '#FFD100',
      'historic',
      41,
      'Stadio Comunale di Villa Galone',
      14000,
    ],
    ['ASD Gubbara', 'GRV', 'Gubbara', '#FFFFFF', '#0057B8', 'selling', 41, 'Stadio Nuovo Ferento', 14500],
    ['Virtus Santa Vilana', 'VIF29', 'Santa Vilana', '#001F5B', '#6CACE4', 'historic', 41, 'Stadio Marago', 14500],
    ['AC Pescale', 'PEQ38', 'Pescale', '#000000', '#0057B8', 'fan', 41, 'Stadio Civico di Pescale', 13500],
    ['Lanano Calcio', 'LAT41', 'Lanano', '#E30613', '#00843D', 'historic', 41, 'Stadio Monezia', 15000],
    ['Sporting Porto Casone', 'POU42', 'Casone', '#6CACE4', '#FFFFFF', 'selling', 41, 'Stadio Leccale', 17000],
    ['Polisportiva Santago', 'POK33', 'Santago', '#6A1B9A', '#E30613', 'fan', 40, 'Stadio Fosello', 12000],
    [
      'FC Castel Casello',
      'CEL',
      'Castel Casello',
      '#00843D',
      '#001F5B',
      'fan',
      40,
      'Stadio Civico di Castel Casello',
      13500,
    ],
    [
      'AC Belona sul Mare 1912',
      'BEV43',
      'Belona sul Mare',
      '#6CACE4',
      '#FFD100',
      'historic',
      40,
      'Stadio Modana',
      12500,
    ],
    ['Fosino Calcio 1907', 'FOQ', 'Fosino', '#6CACE4', '#FFD100', 'fallen', 40, 'Stadio Nuovo Modara', 16000],
    ['Virtus Leccone', 'LEG', 'Leccone', '#00843D', '#001F5B', 'historic', 40, 'Stadio Belino', 13000],
    ['Sporting Ponana', 'PNA', 'Ponana', '#0057B8', '#001F5B', 'youth', 40, 'Stadio Lania', 13500],
    [
      'Sporting Gubbino 1937',
      'GUP',
      'Gubbino',
      '#0057B8',
      '#E30613',
      'historic',
      40,
      'Stadio Comunale di Gubbino',
      16000,
    ],
    ['US Corona', 'CCO', 'Corona', '#FFFFFF', '#E30613', 'fan', 39, 'Stadio Nuovo Fabrento', 14000],
    ['Audace Padento', 'PAC50', 'Padento', '#6CACE4', '#FFD100', 'fan', 39, 'Stadio Comunale di Padento', 16000],
  ];
  FM.D.CLUBS_JP3 = [
    ['Narimoto Verdant', 'NAR39', 'Narimoto', '#00843D', '#6CACE4', 'selling', 48, 'Narimoto Sports Complex', 18500],
    ['Matszawa Athletic', 'MWA', 'Matszawa', '#E30613', '#6A1B9A', 'fallen', 47, 'Matszawa Sports Complex', 19500],
    ['Shingawa Verdant', 'SWA', 'Shingawa', '#FFFFFF', '#00843D', 'historic', 46, 'Akazawa Arena', 16500],
    ['Fujigawa Albatros', 'FUN', 'Fujigawa', '#0057B8', '#FFFFFF', 'fan', 46, 'Nishimoto Arena', 15500],
    ['Takayama Fiore', 'TMA', 'Takayama', '#0057B8', '#6CACE4', 'fan', 46, 'Takayama Sports Complex', 15500],
    ['Harusaki Athletic', 'HAS40', 'Harusaki', '#E30613', '#000000', 'selling', 44, 'Harusaki Athletic Stadium', 16000],
    ['Saishima Bluewave', 'SMA', 'Saishima', '#6A1B9A', '#6CACE4', 'historic', 44, 'Saishima Athletic Stadium', 17500],
    ['FC Takeyama Riverside', 'TAU42', 'Takeyama', '#FFD100', '#E30613', 'fan', 44, 'Takeyama Sports Complex', 18000],
    ['Kurohara Mare', 'KUD', 'Kurohara', '#0057B8', '#00843D', 'selling', 43, 'Saimori Stadium', 15500],
    ['Asasaki Riverside', 'ASI', 'Asasaki', '#6A1B9A', '#0057B8', 'selling', 43, 'Akihara Stadium', 16000],
    ['Kurokami FC', 'KUI', 'Kurokami', '#000000', '#0057B8', 'historic', 43, 'Inazawa Stadium', 18000],
    ['FC Narita', 'NTA', 'Narita', '#FFFFFF', '#FFD100', 'fan', 42, 'Narita Sports Complex', 14000],
    ['Toyno United', 'TOY', 'Toyno', '#6CACE4', '#FFD100', 'fan', 41, 'Sakurashima Arena', 12500],
    ['Yamahara Vento', 'YAE', 'Yamahara', '#001F5B', '#E30613', 'youth', 40, 'Yamahara Sports Complex', 15500],
    ['Saihara Sport Club', 'SAA48', 'Saihara', '#E30613', '#FFFFFF', 'fallen', 40, 'Saihara Sports Complex', 13000],
    ['Asaura Kingfishers', 'ASN', 'Asaura', '#0057B8', '#000000', 'fan', 39, 'Nagagawa Arena', 16000],
    [
      'FC Matsmoto Riverside',
      'MAB49',
      'Matsmoto',
      '#000000',
      '#E30613',
      'historic',
      39,
      'Matsmoto Athletic Stadium',
      14500,
    ],
    ['Fujizawa Blaze', 'FWA', 'Fujizawa', '#FFFFFF', '#6A1B9A', 'selling', 38, 'Fujizawa Athletic Stadium', 15000],
    ['Yamahama Fiore', 'YAF', 'Yamahama', '#0057B8', '#6CACE4', 'youth', 38, 'Kitagawa Park', 14000],
    ['Saisaki Riverside', 'SKI', 'Saisaki', '#6CACE4', '#FFD100', 'selling', 38, 'Saisaki Sports Complex', 12000],
  ];
  FM.D.CLUBS_MX3 = [
    [
      'Atlético Santa Zapa',
      'ZAN',
      'Santa Zapa',
      '#00843D',
      '#E30613',
      'historic',
      42,
      'Estadio Municipal de Santa Zapa',
      17000,
    ],
    ['Deportivo Pachetzin', 'PAS40', 'Pachetzin', '#FFFFFF', '#6CACE4', 'historic', 42, 'Estadio Ocotoco', 15500],
    [
      'Mineros de Tlaxelco',
      'MTL',
      'Tlaxelco',
      '#6A1B9A',
      '#000000',
      'fallen',
      41,
      'Estadio Olímpico de Tlaxelco',
      13500,
    ],
    ['Club Tecotlán', 'TEE', 'Tecotlán', '#FFFFFF', '#00843D', 'fan', 40, 'Estadio Olímpico de Tecotlán', 15000],
    ['Halcones de Tecihua', 'HES', 'Tecihua', '#E30613', '#00843D', 'fan', 39, 'Estadio Olímpico de Tecihua', 12500],
    [
      'Club Tampichitlán',
      'TAV43',
      'Tampichitlán',
      '#000000',
      '#FFD100',
      'fan',
      39,
      'Estadio Municipal de Tampichitlán',
      13500,
    ],
    ['Club Coatachitlán', 'COY', 'Coatachitlán', '#6A1B9A', '#6CACE4', 'youth', 38, 'Estadio La Cuaupa', 14000],
    ['Tepocán FC', 'TEF', 'Tepocán', '#0057B8', '#6CACE4', 'fan', 37, 'Estadio Olímpico de Tepocán', 12500],
    ['Lobos Zapelco', 'LOZ', 'Zapelco', '#FFFFFF', '#FFD100', 'fallen', 36, 'Estadio Olímpico de Zapelco', 13000],
    ['Unión Jilopan', 'JIB', 'Jilopan', '#6CACE4', '#E30613', 'fan', 35, 'Estadio Municipal de Jilopan', 12500],
    ['Atlético Zapec', 'ZAZ', 'Zapec', '#6A1B9A', '#0057B8', 'historic', 34, 'Estadio Municipal de Zapec', 10000],
    ['Mineros de Teotlán', 'MIJ', 'Teotlán', '#E30613', '#6A1B9A', 'fan', 33, 'Estadio Municipal de Teotlán', 13000],
    ['Club Tecalco', 'TEG', 'Tecalco', '#6A1B9A', '#FFFFFF', 'selling', 33, 'Estadio Tepotlán', 10500],
    ['Deportivo Tecec', 'TEH', 'Tecec', '#0057B8', '#001F5B', 'selling', 32, 'Estadio Olímpico de Tecec', 10500],
  ];
  FM.D.CLUBS_NL3 = [
    ['Fortuna Zuidwijk', 'ZUK', 'Zuidwijk', '#FFD100', '#FFFFFF', 'selling', 48, 'De Bergveen', 20000],
    ['Sportclub Hoogwijk', 'SPG30', 'Hoogwijk', '#6CACE4', '#FFD100', 'selling', 47, 'Hoogwijk Arena', 15500],
    ['FC Oudwaard', 'ORF', 'Oudwaard', '#6A1B9A', '#FFD100', 'fan', 46, 'De Oudstad', 17000],
    ['Fortuna Veenbeek', 'VEX', 'Veenbeek', '#FFD100', '#FFFFFF', 'youth', 44, 'Haarbrug Stadion', 14500],
    [
      'RKC Sint Grootvoort',
      'SIA24',
      'Sint Grootvoort',
      '#6A1B9A',
      '#6CACE4',
      'historic',
      44,
      'Sint Grootvoort Arena',
      17500,
    ],
    ['AFC Hoogvoort', 'HOZ', 'Hoogvoort', '#E30613', '#00843D', 'fan', 44, 'Gronbeek Stadion', 16500],
    ['Sportclub Westvoort', 'SUK', 'Westvoort', '#0057B8', '#E30613', 'selling', 43, 'Nieuwdam Stadion', 15000],
    ['Victoria Vlaarade', 'VLE', 'Vlaarade', '#0057B8', '#000000', 'youth', 42, 'Vlaarade Arena', 16000],
    ['AFC Nieuwvoort', 'NIT', 'Nieuwvoort', '#001F5B', '#6CACE4', 'fallen', 42, 'Nieuwvoort Arena', 16000],
    ['RKC Haarbrug', 'HAT41', 'Haarbrug', '#0057B8', '#6CACE4', 'fallen', 42, 'Haarbrug Arena', 16500],
    ['DVC Sneeklo', 'DVA', 'Sneeklo', '#FFD100', '#FFFFFF', 'fan', 40, 'Sportpark Wagerade', 12500],
    ['Vitesse Veendam', 'VIG30', 'Veendam', '#E30613', '#6A1B9A', 'fan', 40, 'Zwolhorst Stadion', 15500],
    [
      'Fortuna Oud Vlaarwaard',
      'OUV',
      'Oud Vlaarwaard',
      '#000000',
      '#E30613',
      'youth',
      39,
      'Sportpark Hoornbrug',
      13500,
    ],
    ['Vitesse Grootbrug', 'VIH31', 'Grootbrug', '#6A1B9A', '#FFFFFF', 'fallen', 39, 'Zaanrade Stadion', 13000],
    ['RKC Nieuwbrug', 'NUG', 'Nieuwbrug', '#000000', '#001F5B', 'fan', 38, 'Sportpark Gronhorst', 14500],
    ['Racing Nieuw Noordijk', 'NIW', 'Noordijk', '#6CACE4', '#000000', 'historic', 37, 'Oudkerk Stadion', 10500],
    ['Bergdam Boys', 'BEN36', 'Bergdam', '#000000', '#E30613', 'fan', 37, 'Bergdam Arena', 13000],
    ['Racing Nieuw Zwolhorst', 'NUW', 'Zwolhorst', '#FFD100', '#6CACE4', 'historic', 36, 'Sportpark Oudhout', 13500],
  ];
  FM.D.CLUBS_NI3 = [
    ['Gilstead Victoria', 'GIL', 'Gilstead', '#0057B8', '#FFFFFF', 'fan', 43, 'Gilstead Park', 13500],
    [
      'Church Rodbridge Vale',
      'CHN36',
      'Church Rodbridge',
      '#FFFFFF',
      '#0057B8',
      'historic',
      42,
      'Buckborough Park',
      14000,
    ],
    ['Scarwold Railway', 'SCD', 'Scarwold', '#FFFFFF', '#FFD100', 'selling', 41, 'Evercaster Green', 16000],
    ['Old Melwick Albion', 'MCK', 'Old Melwick', '#6CACE4', '#00843D', 'fallen', 40, 'Clifington Road', 15000],
    ['North Milport Rovers', 'MIM', 'Milport', '#E30613', '#000000', 'youth', 39, 'Linwick Park', 15000],
    ['Cheldon Villa', 'CHP37', 'Cheldon', '#FFFFFF', '#000000', 'fallen', 37, 'Hartwood Park', 14000],
    ['Wynhurst Railway', 'WYN', 'Wynhurst', '#6CACE4', '#FFD100', 'historic', 36, 'Wynhurst Ground', 10500],
    ['Todhaven Town', 'TOQ', 'Todhaven', '#000000', '#FFD100', 'historic', 35, 'Todhaven Ground', 10500],
    ['Lower Horwich Rovers', 'HCH', 'Horwich', '#00843D', '#000000', 'selling', 35, 'The Lewcaster Stadium', 11500],
    ['Athletic Club Helmouth', 'HEP', 'Helmouth', '#000000', '#001F5B', 'fan', 34, 'Helmouth Park', 9500],
    ['Ludham Railway', 'LUH', 'Ludham', '#001F5B', '#6A1B9A', 'selling', 34, 'Clifcliff Park', 13000],
    ['AFC Hatfield', 'HLA', 'Hatfield', '#000000', '#6A1B9A', 'fan', 31, 'Chalmere Road', 12500],
  ];
  FM.D.CLUBS_NO3 = [
    ['Vestermarborg BK', 'VRG', 'Vestermarborg', '#E30613', '#000000', 'youth', 45, 'Hedrud Idrætspark', 17500],
    ['Brovang FK', 'BRW', 'Brovang', '#000000', '#6CACE4', 'fan', 44, 'Lillerud Stadion', 17000],
    ['Østernordsund IF', 'SNC', 'Østernordsund', '#FFFFFF', '#6CACE4', 'selling', 44, 'Nordlund Stadion', 17500],
    ['Dalstad IF', 'DAX', 'Dalstad', '#001F5B', '#E30613', 'youth', 43, 'Dalstad Idrætsanlæg', 14500],
    ['Brolund IF', 'BRX', 'Brolund', '#001F5B', '#FFFFFF', 'fan', 42, 'Brolund Arena', 16000],
    ['Østerlangfors BK', 'SRS', 'Østerlangfors', '#00843D', '#001F5B', 'fan', 42, 'Østerlangfors Idrætsanlæg', 14500],
    ['IK Skovfors', 'SKF', 'Skovfors', '#E30613', '#001F5B', 'youth', 42, 'Skovfors Idrætsanlæg', 14000],
    ['FC Marø', 'MAM59', 'Marø', '#FFD100', '#0057B8', 'fan', 42, 'Bergstrup Stadion', 17000],
    ['Lilleløkke IF', 'LII', 'Lilleløkke', '#00843D', '#0057B8', 'fallen', 41, 'Bjørndal Stadion', 14500],
    ['Nyborg IL', 'NYE', 'Nyborg', '#FFD100', '#00843D', 'selling', 41, 'Dalstrup Idrætspark', 16000],
    ['Hedstrup IL', 'HEQ', 'Hedstrup', '#0057B8', '#FFFFFF', 'fan', 40, 'Hedstrup Arena', 12500],
    ['Dyrvang FK', 'DYC', 'Dyrvang', '#0057B8', '#E30613', 'historic', 40, 'Dyrvang Idrætsanlæg', 16000],
    ['FC Asknæs', 'ASV', 'Asknæs', '#E30613', '#6A1B9A', 'selling', 40, 'Asknæs Arena', 16000],
    ['FC Kilnæs', 'KIG30', 'Kilnæs', '#FFFFFF', '#E30613', 'historic', 40, 'Asknæs Stadion', 13000],
    ['Bergvang IF', 'BNB', 'Bergvang', '#0057B8', '#001F5B', 'historic', 39, 'Askrud Stadion', 12000],
    ['Gammeløkke Boldklub', 'GAX', 'Gammeløkke', '#00843D', '#6CACE4', 'selling', 39, 'Marby Stadion', 12000],
    ['FC Lillelund', 'LIJ32', 'Lillelund', '#6A1B9A', '#00843D', 'historic', 39, 'Lillelund Arena', 13000],
    ['Bergholm IF', 'BLM', 'Bergholm', '#6A1B9A', '#000000', 'fan', 38, 'Nordstad Stadion', 12000],
    ['Ringvik Boldklub', 'RIL', 'Ringvik', '#6A1B9A', '#000000', 'fan', 38, 'Broø Stadion', 11500],
    ['IK Bergvik', 'BEZ47', 'Bergvik', '#000000', '#FFFFFF', 'youth', 38, 'Bergvik Arena', 13000],
    ['Langsund Fotball', 'LNB', 'Langsund', '#0057B8', '#00843D', 'historic', 37, 'Marstrup Park', 13000],
    ['Langholm IF', 'LLM', 'Langholm', '#6CACE4', '#0057B8', 'fan', 36, 'Fjordrud Stadion', 15000],
    ['Fremad Gammelvang', 'GAY', 'Gammelvang', '#6A1B9A', '#000000', 'fan', 36, 'Langdal Idrætspark', 11500],
    ['Daldal BK', 'DBK', 'Daldal', '#FFD100', '#FFFFFF', 'fan', 35, 'Dalgård Park', 13500],
    ['Langlund Fotball', 'LND', 'Langlund', '#000000', '#E30613', 'fan', 34, 'Langlund Idrætsanlæg', 12500],
    ['BK Dalholm', 'DLM', 'Dalholm', '#000000', '#001F5B', 'fan', 34, 'Langby Stadion', 12000],
    ['BK Fjordgård', 'FJA', 'Fjordgård', '#6A1B9A', '#000000', 'historic', 34, 'Skovløkke Idrætspark', 10500],
    ['Vestfors BK', 'VRC', 'Vestfors', '#FFD100', '#00843D', 'fan', 34, 'Vestfors Idrætsanlæg', 14000],
  ];
  FM.D.CLUBS_PL3 = [
    ['Górnik Czara', 'GOD', 'Czara', '#001F5B', '#6A1B9A', 'historic', 46, 'Stadion Mławin', 18000],
    ['Stal Tarnówka', 'TKA', 'Tarnówka', '#001F5B', '#0057B8', 'youth', 44, 'Stadion im. Rybnówka', 17000],
    ['KS Gniin', 'GNI', 'Gniin', '#FFD100', '#000000', 'youth', 44, 'Stadion Kostewo', 18000],
    [
      'Gwardia Górny Piłowice',
      'GWC',
      'Górny Piłowice',
      '#6A1B9A',
      '#001F5B',
      'fan',
      43,
      'Stadion Ludowy Górny Piłowice',
      16500,
    ],
    ['Górnik Wła', 'GOK', 'Wła', '#6CACE4', '#FFFFFF', 'fan', 43, 'Arena Ostrówka', 14500],
    ['Budowlani Siedlewo', 'BUZ', 'Siedlewo', '#6CACE4', '#6A1B9A', 'fan', 42, 'Arena Opolin', 13500],
    ['GKS Jarosec', 'JAH', 'Jarosec', '#0057B8', '#E30613', 'historic', 42, 'Stadion Ludowy Jarosec', 15000],
    ['MKS Dolny Płocowice', 'DOZ', 'Dolny Płocowice', '#6CACE4', '#6A1B9A', 'fallen', 40, 'Arena Brzezoka', 13000],
    ['KS Jarosin', 'JAJ', 'Jarosin', '#00843D', '#FFFFFF', 'fallen', 39, 'Stadion Miejski im. Brodnice', 13000],
    ['Włókniarz Chełmeno', 'WOJ', 'Chełmeno', '#00843D', '#001F5B', 'selling', 39, 'Stadion Miejski im. Białów', 16000],
    ['Nowice Sokół', 'NOZ', 'Nowice', '#001F5B', '#00843D', 'fan', 39, 'Arena Słupa', 13000],
    ['Stal Wielów', 'WIG', 'Wielów', '#6A1B9A', '#00843D', 'fan', 39, 'Arena Wielec', 12500],
    ['Stal Nowy Włów', 'NOA24', 'Nowy Włów', '#000000', '#0057B8', 'fan', 37, 'Stadion im. Gorzów', 13000],
    ['KS Kostin', 'KOK', 'Kostin', '#00843D', '#000000', 'fan', 36, 'Stadion Ludowy Kostin', 12500],
    ['GKS Kalów', 'KAQ38', 'Kalów', '#E30613', '#FFD100', 'fan', 35, 'Arena Czareka', 14000],
    ['Budowlani Ostreka', 'BUI', 'Ostreka', '#6A1B9A', '#001F5B', 'youth', 35, 'Stadion Miejski im. Lubeka', 10000],
    ['KS Brzezesk', 'BRA24', 'Brzezesk', '#6A1B9A', '#E30613', 'fan', 34, 'Stadion Ludowy Brzezesk', 12000],
    ['Polonia Brzezewo', 'BWO', 'Brzezewo', '#FFD100', '#6CACE4', 'youth', 33, 'Stadion im. Kostów', 12000],
  ];
  FM.D.CLUBS_PT3 = [
    ['Associação Santa Alcobela', 'ALW92', 'Alcobela', '#6A1B9A', '#001F5B', 'fan', 48, 'Estádio Moncorela', 16500],
    ['Atlético Cartada', 'CDA', 'Cartada', '#000000', '#6A1B9A', 'fan', 47, 'Estádio Torrares', 16000],
    ['Atlético Vila Lamela', 'VIJ32', 'Vila Lamela', '#6A1B9A', '#6CACE4', 'fan', 47, 'Arena Serteira', 19000],
    [
      'Sporting Paivães do Mar',
      'PDO',
      'Paivães do Mar',
      '#000000',
      '#00843D',
      'fan',
      46,
      'Estádio Nova Pombela',
      17500,
    ],
    ['Clube Braganais', 'BRN36', 'Braganais', '#6A1B9A', '#001F5B', 'fan', 46, 'Arena Alvorura', 15000],
    ['Atlético Vila Amarais', 'VAZ', 'Amarais', '#6A1B9A', '#00843D', 'fan', 45, 'Estádio Municipal de Amarais', 18000],
    ['União Avares', 'AVG', 'Avares', '#E30613', '#00843D', 'fallen', 45, 'Estádio Nova Penal', 17500],
    [
      'Atlético Serra Portela',
      'SEE28',
      'Serra Portela',
      '#00843D',
      '#6A1B9A',
      'youth',
      44,
      'Estádio Nova Castares',
      14500,
    ],
    ['São Tomal Atlético Clube', 'SAM59', 'Tomal', '#00843D', '#000000', 'fan', 44, 'Complexo Desportivo Tomal', 14000],
    [
      'Os Belenenses de Barcela',
      'OSX',
      'Barcela',
      '#000000',
      '#00843D',
      'fan',
      44,
      'Estádio Municipal de Barcela',
      16000,
    ],
    ['GD Cartela', 'GDA', 'Cartela', '#0057B8', '#000000', 'youth', 43, 'Estádio Nova Vendinha', 15500],
    ['Clube Vila Lagães', 'VIP37', 'Lagães', '#FFD100', '#6A1B9A', 'historic', 43, 'Complexo Desportivo Lagães', 14000],
    ['Vendela Futebol Clube', 'VEZ', 'Vendela', '#00843D', '#0057B8', 'fan', 42, 'Estádio Nazaral', 14000],
    ['Sport Clube Estrela', 'ESQ', 'Estrela', '#E30613', '#0057B8', 'historic', 41, 'Estádio Leiral', 13000],
    ['Sport Clube Elveira', 'ELW', 'Elveira', '#001F5B', '#FFD100', 'fan', 41, 'Estádio Nova Leirinha', 17000],
    ['Atlético Vila Penal', 'VIQ38', 'Penal', '#6A1B9A', '#FFD100', 'youth', 41, 'Arena Amarares', 14000],
    ['Sport Clube Avão', 'AVO', 'Avão', '#0057B8', '#E30613', 'selling', 40, 'Complexo Desportivo Avão', 14000],
    [
      'Sporting Lousão da Serra',
      'LOJ',
      'Lousão da Serra',
      '#6CACE4',
      '#001F5B',
      'fallen',
      40,
      'Estádio Alentouro',
      15500,
    ],
    ['Atlético Alto Toma', 'ALV91', 'Toma', '#6CACE4', '#FFD100', 'youth', 40, 'Estádio Cartouro', 12500],
    ['Gouvela Futebol Clube', 'GOQ', 'Gouvela', '#E30613', '#FFFFFF', 'fan', 40, 'Complexo Desportivo Gouvela', 15000],
    ['Esporte Clube Gaiura', 'GAA24', 'Gaiura', '#001F5B', '#FFD100', 'fan', 39, 'Estádio Municipal de Gaiura', 15500],
    ['Académico Argeira', 'ACC', 'Argeira', '#000000', '#001F5B', 'fan', 38, 'Estádio Covouro', 12000],
    [
      'Atlético Alto Olivães',
      'AOD',
      'Olivães',
      '#000000',
      '#6CACE4',
      'fallen',
      38,
      'Estádio Municipal de Olivães',
      15500,
    ],
    ['Tavira Atlético Clube', 'TAW44', 'Tavira', '#00843D', '#000000', 'youth', 36, 'Estádio Alentinha', 15000],
  ];
  FM.D.CLUBS_RO3 = [
    ['Progresul Hunana', 'PRN', 'Hunana', '#001F5B', '#6CACE4', 'historic', 43, 'Arena Hunești', 17500],
    ['Rapid Mare Droău', 'RAD27', 'Droău', '#000000', '#00843D', 'fallen', 42, 'Arena Slatana', 16000],
    ['Electroputere Focana', 'ERE', 'Focana', '#6A1B9A', '#000000', 'historic', 40, 'Stadionul Timești', 14500],
    ['Unirea Romova', 'UNC', 'Romova', '#001F5B', '#00843D', 'historic', 40, 'Stadionul Bacița', 12500],
    ['Minerul Miiu', 'MUL', 'Miiu', '#FFD100', '#001F5B', 'fallen', 37, 'Arena Cameni', 12000],
    ['CS Hunova', 'CSS', 'Hunova', '#6A1B9A', '#001F5B', 'fan', 36, 'Stadionul Pitița', 11000],
    ['Conana FC', 'CFC', 'Conana', '#0057B8', '#000000', 'fan', 35, 'Complexul Sportiv Conana', 10000],
    ['Mare Albău FC', 'MAC50', 'Albău', '#000000', '#001F5B', 'fan', 35, 'Arena Petiu', 10000],
    ['Dinamo Pitești', 'DIT', 'Pitești', '#FFD100', '#E30613', 'fallen', 34, 'Arena Criu', 14000],
    ['Metalul Focești', 'MFO', 'Focești', '#00843D', '#FFFFFF', 'fan', 32, 'Stadionul Satova', 12500],
  ];
  FM.D.CLUBS_RU3 = [
    ['Dinamo Vladovo', 'DIU', 'Vladovo', '#0057B8', '#001F5B', 'fan', 43, 'Stadion Vladovo', 15500],
    ['Krylia Kolov', 'KRM', 'Kolov', '#FFD100', '#0057B8', 'youth', 43, 'Stadion Kolov', 13500],
    [
      'FK Svetbor-na-Sine',
      'SVR',
      'Svetbor-na-Sine',
      '#6CACE4',
      '#E30613',
      'historic',
      42,
      'Tsentralny Stadion Svetbor-na-Sine',
      17500,
    ],
    ['FK Yargrad', 'YAG', 'Yargrad', '#E30613', '#FFFFFF', 'selling', 40, 'Ustgrad Arena', 12500],
    ['Baltika Peskensk', 'BKA', 'Peskensk', '#FFD100', '#FFFFFF', 'fan', 40, 'Orlov Arena', 14000],
    ['FC Nizhne-Kursov', 'NNA', 'Kursov', '#FFFFFF', '#FFD100', 'fan', 40, 'Stadion Dinamo Kursov', 12500],
    ['Spartak Chelgrad', 'SPH31', 'Chelgrad', '#6A1B9A', '#6CACE4', 'youth', 39, 'Stadion Dinamo Chelgrad', 12000],
    ['Akademiya Kinovsk', 'AYC', 'Kinovsk', '#E30613', '#0057B8', 'fan', 38, 'Stadion Kinovsk', 14000],
    ['Akademiya Yelka', 'AKH', 'Yelka', '#6CACE4', '#E30613', 'selling', 38, 'Stadion Tulburg', 12500],
    [
      'FK Verkhne-Staroirka',
      'VNE',
      'Staroirka',
      '#FFFFFF',
      '#6A1B9A',
      'historic',
      37,
      'Tsentralny Stadion Staroirka',
      13000,
    ],
    ['Energiya Nizhne-Yarino', 'END', 'Yarino', '#6CACE4', '#001F5B', 'historic', 36, 'Kursbor Arena', 13000],
    [
      'Krylia Nizhneorlovo',
      'KRN',
      'Nizhneorlovo',
      '#000000',
      '#E30613',
      'selling',
      36,
      'Stadion Dinamo Nizhneorlovo',
      15000,
    ],
    ['CSKA Novo-Arzevo', 'CSK', 'Arzevo', '#0057B8', '#000000', 'fan', 35, 'Stadion Arzevo', 11000],
    ['Baltika Zvonevo', 'BAZ47', 'Zvonevo', '#001F5B', '#FFD100', 'selling', 35, 'Stadion Zvonevo', 13000],
    ['FK Smolinsk', 'SMO', 'Smolinsk', '#00843D', '#0057B8', 'youth', 35, 'Murbor Arena', 10000],
    ['FC Bryevo-na-Mere', 'BVO', 'Bryevo-na-Mere', '#FFD100', '#6A1B9A', 'fan', 34, 'Stadion Bryevo-na-Mere', 11500],
    ['Energiya Zarburg', 'EYA', 'Zarburg', '#E30613', '#6CACE4', 'selling', 32, 'Tulburg Arena', 10500],
    ['Zenit Khabgrad', 'ZES', 'Khabgrad', '#FFFFFF', '#00843D', 'fan', 31, 'Tsentralny Stadion Khabgrad', 8500],
  ];
  FM.D.CLUBS_SA3 = [
    ['Rifya Club', 'RIP', 'Rifya', '#E30613', '#FFD100', 'fallen', 43, 'Rifya Stadium', 17500],
    ['Al Wadi Faliq', 'ALT65', 'Wadi Faliq', '#E30613', '#0057B8', 'fan', 43, 'Wadi Faliq Sports City', 14500],
    ['Kutah Club', 'KUE', 'Kutah', '#6CACE4', '#FFFFFF', 'fan', 43, 'Prince Khasar Stadium', 13500],
    ['Al Wadi Musah SC', 'ALU66', 'Musah', '#001F5B', '#00843D', 'youth', 42, 'Nakiyah Stadium', 17000],
    ['Barayn Club', 'BYN', 'Barayn', '#000000', '#6CACE4', 'historic', 41, 'Ramiyah Arena', 17000],
    ['Al Hawayn', 'AHA', 'Hawayn', '#001F5B', '#6CACE4', 'selling', 40, 'Hawayn Stadium', 15500],
    ['Ain Aqiq Club', 'AIC', 'Aqiq', '#6CACE4', '#001F5B', 'historic', 40, 'Zarya Stadium', 13000],
    ['Al Ramiq', 'ALV67', 'Ramiq', '#000000', '#00843D', 'historic', 40, 'Ramiq Stadium', 17000],
    ['Al Madra SC', 'ALW68', 'Madra', '#000000', '#001F5B', 'historic', 39, 'Bahiq Arena', 16000],
    ['Tafayr Club', 'TAX45', 'Tafayr', '#FFD100', '#001F5B', 'fan', 39, 'Khasan Stadium', 14500],
    ['Barah Club', 'BAA48', 'Barah', '#001F5B', '#000000', 'historic', 37, 'Nizib Arena', 12000],
    ['Al Ain Ibrya', 'ALX69', 'Ibrya', '#00843D', '#FFD100', 'historic', 37, 'Shinayr Arena', 11000],
    ['Shiniyah SC', 'SHY', 'Shiniyah', '#E30613', '#000000', 'youth', 37, 'Shiniyah Stadium', 13000],
    ['Ain Shinan SC', 'AIS', 'Ain Shinan', '#6CACE4', '#FFFFFF', 'selling', 36, 'Prince Nakar Stadium', 14500],
    ['Al Khasayr', 'ALY70', 'Khasayr', '#FFD100', '#001F5B', 'fan', 34, 'Qura Stadium', 10500],
    ['Shabab Madan', 'SHA24', 'Madan', '#6CACE4', '#FFFFFF', 'fan', 33, 'Madan Stadium', 9500],
  ];
  FM.D.CLUBS_SC3 = [
    ['Cumbside Academical', 'CUM', 'Cumbside', '#FFFFFF', '#6CACE4', 'fan', 43, 'Pitmore Road', 15500],
    ['Mid Peebton Town', 'MIP', 'Peebton', '#6A1B9A', '#E30613', 'historic', 41, 'Langwick Green', 13000],
    ['Jedie Athletic', 'JEE', 'Jedie', '#FFD100', '#FFFFFF', 'fallen', 41, 'Jedie Muir', 16500],
    ['Innesock Rovers', 'INN', 'Innesock', '#000000', '#0057B8', 'fallen', 40, 'Falrie Park', 13500],
    ['Galkirk Burgh', 'GAL', 'Galkirk', '#6A1B9A', '#E30613', 'historic', 39, 'Galkirk Muir', 14500],
    ['Torryrie Burgh', 'TIE', 'Torryrie', '#0057B8', '#6A1B9A', 'fan', 38, 'Lockmouth Road', 11500],
    ['Upper Rosrie Victoria', 'ROA24', 'Rosrie', '#FFD100', '#00843D', 'youth', 35, 'Rosrie Park', 10000],
    ['Tulliton City', 'TUD', 'Tulliton', '#E30613', '#6A1B9A', 'historic', 35, 'Jedwick Green', 14500],
    ['Bannockside Victoria', 'BAB49', 'Bannockside', '#6A1B9A', '#E30613', 'historic', 34, 'Auchdee Green', 12500],
    ['Upper Kinkirk Town', 'KIA24', 'Upper Kinkirk', '#6CACE4', '#FFFFFF', 'historic', 31, 'Upper Kinkirk Muir', 10500],
  ];
  FM.D.CLUBS_ZA3 = [
    ['Ulunberg United', 'ULG', 'Ulunberg', '#000000', '#FFD100', 'fan', 43, 'Ulunberg Sports Complex', 15500],
    ['Old Vredeston FC', 'VRA', 'Vredeston', '#E30613', '#000000', 'selling', 43, 'Kwadoorn Stadium', 15000],
    ['Ulunula City', 'ULD', 'Ulunula', '#001F5B', '#FFFFFF', 'historic', 42, 'Volula Park', 13500],
    ['Upper Sasoldoorn City', 'SRC', 'Sasoldoorn', '#000000', '#E30613', 'fallen', 40, 'Mbomkop Stadium', 13000],
    ['Pongfontein Swallows', 'PIK', 'Pongfontein', '#E30613', '#FFFFFF', 'fallen', 40, 'Thabula Park', 17000],
    ['Volrus City', 'VOS', 'Volrus', '#001F5B', '#E30613', 'fan', 40, 'Volrus Sports Complex', 14500],
    ['Vredeberg Arrows', 'VRB', 'Vredeberg', '#FFD100', '#E30613', 'youth', 39, 'Vredeberg Oval', 13500],
    ['Kwafontein City', 'KWN', 'Kwafontein', '#00843D', '#6CACE4', 'selling', 38, 'Kwafontein Sports Complex', 13000],
    ['Upper Phalstad Swallows', 'PHD', 'Phalstad', '#6A1B9A', '#FFD100', 'fan', 37, 'Kwula Park', 15000],
    ['Volston Chiefs', 'VON', 'Volston', '#000000', '#E30613', 'historic', 37, 'Thabdoorn Stadium', 13500],
    ['Randstad City', 'RAE28', 'Randstad', '#00843D', '#0057B8', 'youth', 36, 'Thaberg Stadium', 11500],
    ['Vredestad Arrows', 'VRD', 'Vredestad', '#FFFFFF', '#E30613', 'fan', 34, 'Bettdoorn Stadium', 11000],
    ['Maraburg City', 'MAD51', 'Maraburg', '#E30613', '#FFD100', 'fallen', 34, 'Maraburg Sports Complex', 11500],
    ['Nelston Trinity', 'NEA24', 'Nelston', '#E30613', '#000000', 'selling', 34, 'Vrededal Stadium', 12500],
    ['Upper Sibodal United', 'SIB25', 'Sibodal', '#0057B8', '#00843D', 'fallen', 33, 'Sibodal Sports Complex', 12000],
    ['Lower Kwastad City', 'KWD', 'Kwastad', '#FFD100', '#0057B8', 'fallen', 33, 'Kwastad Sports Complex', 9000],
  ];
  FM.D.CLUBS_KR3 = [
    ['Munhwa Electric Tigers', 'MUE', 'Munhwa', '#00843D', '#001F5B', 'historic', 46, 'Gimwon Sports Complex', 15000],
    ['Sinwon Stars', 'SIC26', 'Sinwon', '#FFFFFF', '#6A1B9A', 'historic', 45, 'Sinwon Stadium', 14500],
    ['FC Buseong', 'BUA24', 'Buseong', '#FFD100', '#6CACE4', 'historic', 44, 'Mungu Arena', 17500],
    ['Jinwon Chemical Dolphins', 'JID', 'Jinwon', '#6CACE4', '#001F5B', 'historic', 44, 'Jinju Arena', 15000],
    ['Bowon Citizen', 'BOC26', 'Bowon', '#0057B8', '#6A1B9A', 'fan', 42, 'Bowon Stadium', 15000],
    ['Daejeong United', 'DAZ', 'Daejeong', '#00843D', '#001F5B', 'fan', 42, 'Daejeong Stadium', 14000],
    ['Chori Electric Tigers', 'CRI', 'Chori', '#0057B8', '#6CACE4', 'selling', 41, 'Daewon Sports Complex', 17500],
    ['Pyeongri Dolphins', 'PYA', 'Pyeongri', '#0057B8', '#6CACE4', 'fan', 41, 'Chungcheon Arena', 12500],
    ['Daegu Chemical Dolphins', 'DAA24', 'Daegu', '#000000', '#FFD100', 'selling', 40, 'Sinwon Sports Complex', 16000],
    ['Jeonjeong Athletic', 'JEF', 'Jeonjeong', '#FFFFFF', '#001F5B', 'fan', 39, 'Chungjeong Arena', 12500],
    ['Pyeongjin Motors FC', 'PYN', 'Pyeongjin', '#FFD100', '#6A1B9A', 'historic', 39, 'Pyeongjin Stadium', 15500],
    ['Jinjin Copper Phoenix', 'JIE', 'Jinjin', '#6A1B9A', '#FFD100', 'fan', 37, 'Gyeongcheon Arena', 10500],
    ['Gimri Electric Tigers', 'GIA', 'Gimri', '#0057B8', '#E30613', 'fallen', 37, 'Wolseong Sports Complex', 15500],
    ['Dongjin Dolphins', 'DDO', 'Dongjin', '#001F5B', '#E30613', 'youth', 36, 'Bojeong Arena', 15000],
    ['Haedong FC', 'HNG', 'Haedong', '#0057B8', '#E30613', 'selling', 35, 'Haedong Civic Stadium', 12000],
    ['Seosan Steel Mariners', 'SEF29', 'Seosan', '#001F5B', '#FFD100', 'fan', 35, 'Choju Arena', 14500],
  ];
  FM.D.CLUBS_SE3 = [
    ['Hudfors IF', 'HUD', 'Hudfors', '#FFFFFF', '#E30613', 'historic', 44, 'Hudfors Stadion', 16500],
    ['Vö FF', 'VOO', 'Vö', '#FFFFFF', '#6CACE4', 'selling', 43, 'Sundsby Arena', 18000],
    ['Sleipner Örnholm', 'SLN', 'Örnholm', '#6A1B9A', '#6CACE4', 'historic', 43, 'Örnholm Idrottspark', 13500],
    ['Sundsköping FF', 'SUY', 'Sundsköping', '#6CACE4', '#001F5B', 'selling', 43, 'Sundsköping Idrottspark', 17500],
    [
      'IK Gamla Solberg',
      'GAZ',
      'Gamla Solberg',
      '#6CACE4',
      '#00843D',
      'historic',
      43,
      'Gamla Solberg Idrottspark',
      18000,
    ],
    ['Skelstad Boll', 'SKD', 'Skelstad', '#E30613', '#6CACE4', 'fan', 42, 'Solhamn Arena', 17000],
    ['Södra Solköping Boll', 'SOY', 'Solköping', '#001F5B', '#FFFFFF', 'selling', 42, 'Nynbyvallen', 16000],
    ['Ronby BK', 'ROK33', 'Ronby', '#FFFFFF', '#6CACE4', 'fan', 42, 'Norberg Arena', 16500],
    ['Vasalund Kalö', 'VAA24', 'Kalö', '#00843D', '#E30613', 'youth', 41, 'Kalö Idrottspark', 15000],
    ['IF Södra Linsund', 'SOU', 'Södra Linsund', '#000000', '#001F5B', 'fan', 41, 'Sundsnäs IP', 16500],
    ['Norra Vetholm FF', 'NOL34', 'Norra Vetholm', '#000000', '#FFD100', 'fan', 41, 'Norra Vetholm Idrottspark', 15000],
    ['IFK Sundsnäs', 'IFA', 'Sundsnäs', '#001F5B', '#0057B8', 'youth', 41, 'Skelstad Arena', 13000],
    ['Mohamn FF', 'MMN', 'Mohamn', '#6CACE4', '#00843D', 'youth', 40, 'Ulrvikvallen', 13500],
    ['Brage Nynberg', 'BRB25', 'Nynberg', '#6A1B9A', '#6CACE4', 'fallen', 40, 'Nynberg Stadion', 16500],
    ['IK Örnby', 'ORQ', 'Örnby', '#00843D', '#FFFFFF', 'youth', 40, 'Örnby Stadion', 13000],
    ['GIF Västra Ulrby', 'GIF', 'Ulrby', '#6CACE4', '#FFFFFF', 'historic', 39, 'Solsund IP', 15500],
    ['Norra Väberg FF', 'NOK33', 'Väberg', '#00843D', '#000000', 'historic', 38, 'Linvik IP', 16000],
    ['IF Kalby', 'KAB49', 'Kalby', '#001F5B', '#6A1B9A', 'fan', 38, 'Väsund Arena', 12500],
    ['Sleipner Tranköping', 'SLR', 'Tranköping', '#FFFFFF', '#6A1B9A', 'youth', 37, 'Ronby Arena', 12500],
    ['IF Östra Gävö', 'OSW', 'Gävö', '#FFD100', '#001F5B', 'fan', 37, 'Borby Arena', 14500],
    ['Brage Västra Norköping', 'BRC26', 'Norköping', '#0057B8', '#FFFFFF', 'fan', 36, 'Väsköping Arena', 15000],
    ['Brage Södra Örnhamn', 'BRD27', 'Södra Örnhamn', '#001F5B', '#FFFFFF', 'fan', 36, 'Solnäs IP', 14000],
    ['Vasalund Vänäs', 'VAE28', 'Vänäs', '#6CACE4', '#E30613', 'fan', 36, 'Väholmvallen', 14500],
    ['IF Norra Nornäs', 'NRA', 'Nornäs', '#E30613', '#0057B8', 'fan', 36, 'Nornäs Stadion', 13500],
    ['Sleipner Norhamn', 'SLP', 'Norhamn', '#0057B8', '#000000', 'selling', 35, 'Bornäs Arena', 12000],
    ['Hudberg IF', 'HUE', 'Hudberg', '#0057B8', '#FFFFFF', 'fan', 35, 'Norholm IP', 12000],
    ['IFK Kalvik', 'IKC', 'Kalvik', '#0057B8', '#6A1B9A', 'selling', 35, 'Kalvik Idrottspark', 14000],
    ['IF Norstad', 'NOB25', 'Norstad', '#000000', '#E30613', 'fan', 34, 'Hudfors IP', 12500],
    ['Borstad Boll', 'BOM35', 'Borstad', '#FFFFFF', '#FFD100', 'fan', 34, 'Borstad Idrottspark', 12500],
    ['Nynfors BK', 'NYS', 'Nynfors', '#0057B8', '#FFFFFF', 'youth', 33, 'Söhamn Arena', 13000],
    ['Sleipner Skelnäs', 'SLS', 'Skelnäs', '#001F5B', '#00843D', 'fan', 33, 'Skelnäs Stadion', 13500],
    ['Brage Nya Falstad', 'BNY', 'Falstad', '#6CACE4', '#6A1B9A', 'historic', 32, 'Borholmvallen', 11500],
  ];
  FM.D.CLUBS_CH3 = [
    ['FC Alt Eberbrück', 'ALZ71', 'Eberbrück', '#FFFFFF', '#00843D', 'youth', 43, 'Immau-Stadion', 17500],
    ['Blau-Weiß Waldbach', 'BLC', 'Waldbach', '#6CACE4', '#FFD100', 'fan', 43, 'Waldbach-Arena', 18000],
    ['VfL Elshafen', 'ELF', 'Elshafen', '#000000', '#FFFFFF', 'fan', 42, 'Waldstadion Elshafen', 14000],
    ['Viktoria Branhof', 'BRE28', 'Branhof', '#00843D', '#6CACE4', 'selling', 42, 'Waldstadion Branhof', 13500],
    ['Westerhorst 04', 'WET', 'Westerhorst', '#0057B8', '#6A1B9A', 'historic', 41, 'Elsingen-Stadion', 12500],
    ['Arminia Holzbrück', 'ARW', 'Holzbrück', '#0057B8', '#001F5B', 'historic', 40, 'Holzbrück-Arena', 17000],
    ['Alt Steinstadt 1899', 'AST', 'Steinstadt', '#E30613', '#6A1B9A', 'selling', 39, 'Stadion Heidheim', 14500],
    ['Schwarz-Weiß Freisee', 'SCF', 'Freisee', '#E30613', '#00843D', 'historic', 39, 'Stadion Thalhorst', 15000],
    ['Teutonia Groß Kirchberg', 'GRW', 'Kirchberg', '#000000', '#FFD100', 'fan', 38, 'Sportpark Greifheim', 15500],
    ['TSV Niederhausen', 'NNI', 'Niederhausen', '#0057B8', '#000000', 'fallen', 36, 'Waldstadion Niederhausen', 14000],
    ['Klein Waldstein SC 1927', 'KLW', 'Waldstein', '#00843D', '#E30613', 'fan', 36, 'Schwarzhausen-Stadion', 13500],
    ['SV Alt Westerstadt', 'AWE', 'Alt Westerstadt', '#FFD100', '#6CACE4', 'historic', 36, 'Sportpark Goldhof', 11000],
    ['FC Kirchkirchen 1932', 'KEC', 'Kirchkirchen', '#FFD100', '#6A1B9A', 'fan', 35, 'Waldstadion Kirchkirchen', 14500],
    ['Bruchfurt 1899', 'BRF29', 'Bruchfurt', '#000000', '#001F5B', 'fan', 35, 'Stadion am Langhafen', 14500],
    [
      'Eintracht Bad Greifstein',
      'BAC50',
      'Greifstein',
      '#FFD100',
      '#00843D',
      'youth',
      34,
      'Stadion am Neckaringen',
      12500,
    ],
    ['Eintracht Goldfurt', 'GOT', 'Goldfurt', '#FFFFFF', '#00843D', 'historic', 34, 'Goldfurt-Arena', 11500],
    ['Hohental 1899', 'HHO', 'Hohental', '#FFFFFF', '#E30613', 'fan', 33, 'Sportpark Haghorst', 10000],
    ['Rot-Weiss Neckarbach', 'ROB25', 'Neckarbach', '#6A1B9A', '#001F5B', 'fallen', 33, 'Stadion am Felsau', 10500],
  ];
  FM.D.CLUBS_TH3 = [
    ['Ratyai City', 'RAF29', 'Ratyai', '#0057B8', '#000000', 'fan', 41, 'Bangthong Arena', 14000],
    ['Wangpur Rapids United', 'WAP', 'Wangpur', '#6A1B9A', '#000000', 'historic', 40, 'Wangra Arena', 12500],
    ['Taknam FC', 'TFC', 'Taknam', '#FFD100', '#6CACE4', 'selling', 39, 'Phusai Arena', 16500],
    ['Phunong United', 'PHB', 'Phunong', '#6CACE4', '#000000', 'fan', 37, 'Khaora Sports Park', 13000],
    ['Thayai Athletic', 'THV', 'Thayai', '#E30613', '#6A1B9A', 'fallen', 37, 'Thakaeo Stadium', 11500],
    [
      'Sakmai Rapids United',
      'SAB49',
      'Sakmai',
      '#6A1B9A',
      '#FFFFFF',
      'selling',
      36,
      'Sakmai Provincial Stadium',
      13000,
    ],
    ['Phraburi FC', 'PHC', 'Phraburi', '#001F5B', '#00843D', 'historic', 35, 'Lamkaeo Stadium', 12000],
    ['Chiangpur United', 'CHQ38', 'Chiangpur', '#000000', '#00843D', 'fallen', 34, 'Nonglek Sports Park', 9500],
    ['Maethong United', 'MNG', 'Maethong', '#000000', '#E30613', 'selling', 34, 'Maethong Provincial Stadium', 10500],
    ['Muang Pakra United', 'MUF', 'Pakra', '#FFD100', '#6A1B9A', 'fan', 33, 'Srinong Stadium', 13000],
    ['Saksai United', 'SAC50', 'Saksai', '#E30613', '#FFFFFF', 'fan', 31, 'Bangkaeo Stadium', 9000],
    ['Muang Nongsai United', 'MUG', 'Nongsai', '#0057B8', '#000000', 'selling', 30, 'Nakhonkaeo Stadium', 8000],
  ];
  FM.D.CLUBS_TR3 = [
    ['Kaykale Belediyespor', 'KAR39', 'Kaykale', '#00843D', '#FFD100', 'fan', 47, 'Kaykale Şehir Stadyumu', 19500],
    ['İncsaraygücü', 'INE', 'İncsaray', '#FFFFFF', '#FFD100', 'fan', 47, 'Kızköy Arena', 19500],
    ['Kızehir İdman Yurdu', 'KZE', 'Kızehir', '#001F5B', '#0057B8', 'youth', 45, 'Kızehir Şehir Stadyumu', 14500],
    ['Yeni Bayköyspor', 'BBE', 'Bayköy', '#001F5B', '#E30613', 'historic', 45, 'Karalar Arena', 17000],
    ['Çanehir SK', 'CAN36', 'Çanehir', '#FFFFFF', '#001F5B', 'fan', 44, 'Çanehir Cumhuriyet Stadyumu', 17000],
    ['Kızlar Gücü', 'KZB', 'Kızlar', '#000000', '#FFD100', 'selling', 43, 'Gülar Stadyumu', 15000],
    [
      'Küçük Sultandere Birlik',
      'KUF',
      'Küçük Sultandere',
      '#FFFFFF',
      '#6A1B9A',
      'youth',
      42,
      'Kaypınar Stadyumu',
      13500,
    ],
    ['Karalar İdman Yurdu', 'KAS40', 'Karalar', '#000000', '#0057B8', 'fallen', 42, 'Özköy Stadyumu', 16000],
    ['Orhtepe Gençlik', 'ORG', 'Orhtepe', '#FFFFFF', '#FFD100', 'fallen', 42, 'Özehir Stadyumu', 14500],
    ['Boztepegücü', 'BCU', 'Boztepe', '#6CACE4', '#001F5B', 'selling', 41, 'Boztepe Şehir Stadyumu', 16500],
    ['Uşapınar FK', 'USG', 'Uşapınar', '#FFFFFF', '#001F5B', 'historic', 41, 'Durova Stadyumu', 16500],
    ['Küçük Bayderespor', 'KUK', 'Küçük Baydere', '#E30613', '#001F5B', 'fan', 40, 'Uşakale Arena', 17000],
    [
      'Eski Dursarayspor',
      'ESI',
      'Eski Dursaray',
      '#E30613',
      '#FFFFFF',
      'historic',
      40,
      'Eski Dursaray Şehir Stadyumu',
      13000,
    ],
    ['Çamehir Gençlik', 'CAP37', 'Çamehir', '#001F5B', '#FFFFFF', 'historic', 38, 'Sarlar Stadyumu', 15500],
    ['Eski Durpınarspor', 'EKI', 'Eski Durpınar', '#FFD100', '#FFFFFF', 'selling', 38, 'Gönehir Stadyumu', 15500],
    ['Eskehirspor', 'ESS', 'Eskehir', '#6CACE4', '#6A1B9A', 'fan', 38, 'Boztepe Stadyumu', 14500],
    ['Tekehir Gençlik', 'TEJ', 'Tekehir', '#000000', '#0057B8', 'historic', 37, 'Tekehir Şehir Stadyumu', 14000],
    ['Çamköyspor', 'CCA', 'Çamköy', '#E30613', '#6A1B9A', 'fan', 36, 'Çamköy Cumhuriyet Stadyumu', 10500],
  ];
  FM.D.CLUBS_UA3 = [
    ['FK Rovivske', 'ROC26', 'Rovivske', '#E30613', '#6A1B9A', 'historic', 43, 'Stadion Vinske', 17000],
    ['Zorya Druka', 'ZOD', 'Druka', '#E30613', '#000000', 'youth', 42, 'Polivske Arena', 17000],
    ['Hirnyk Nova Druivske', 'HIK', 'Druivske', '#6A1B9A', '#FFD100', 'historic', 41, 'Stadion Druivske', 12500],
    ['Veres Shepopil', 'VSH', 'Shepopil', '#0057B8', '#001F5B', 'selling', 40, 'Mis’kyi Stadion Shepopil', 16000],
    ['Lokomotyv Rovove', 'LOR', 'Rovove', '#E30613', '#0057B8', 'youth', 40, 'Stadion Rovove', 16000],
    ['Kolos Okhske', 'KOG', 'Okhske', '#000000', '#6A1B9A', 'historic', 38, 'Stadion imeni Vinivtsi', 16000],
    ['FC Polka', 'POL34', 'Polka', '#6CACE4', '#001F5B', 'fan', 37, 'Stadion Polka', 11000],
    ['Polissia Polska', 'POM35', 'Polska', '#6CACE4', '#0057B8', 'fan', 37, 'Stadion Polska', 15000],
    ['FK Nova Borets', 'NOC26', 'Nova Borets', '#6CACE4', '#FFD100', 'historic', 35, 'Horove Arena', 10000],
    ['Spartak Zhovska', 'SPJ32', 'Zhovska', '#001F5B', '#0057B8', 'youth', 34, 'Mis’kyi Stadion Zhovska', 9500],
    ['Hirnyk Kovivtsi', 'HYK', 'Kovivtsi', '#00843D', '#6A1B9A', 'selling', 33, 'Stadion Sumyska', 9500],
    ['Kolos Radopil', 'KOJ', 'Radopil', '#0057B8', '#FFD100', 'historic', 32, 'Stadion Hluyne', 11000],
  ];
  FM.D.CLUBS_US3 = [
    ['Real Millville', 'MIQ', 'Millville', '#6CACE4', '#000000', 'fan', 42, 'Millville Field', 16000],
    ['Oakview Union Club', 'OAW', 'Oakview', '#0057B8', '#FFD100', 'selling', 42, 'Oakview Stadium', 13500],
    ['Mapledale Express', 'MEX', 'Mapledale', '#0057B8', '#001F5B', 'fan', 42, 'Mapledale Field', 17000],
    [
      'Santa Riveridge Blaze',
      'RIV',
      'Santa Riveridge',
      '#00843D',
      '#FFD100',
      'youth',
      41,
      'Santa Riveridge Arena',
      17000,
    ],
    [
      'Santa Millville City FC',
      'MIU',
      'Santa Millville',
      '#000000',
      '#FFD100',
      'historic',
      40,
      'Hickoryhills Field',
      14500,
    ],
    ['Lakeburg FC', 'LAK33', 'Lakeburg', '#6CACE4', '#000000', 'fallen', 39, 'Rockfalls Field', 15000],
    ['El Greenridge Union Club', 'EEL', 'El Greenridge', '#E30613', '#001F5B', 'fan', 39, 'Bayview Park', 15000],
    ['Cedarbluff Union Club', 'CEG', 'Cedarbluff', '#6CACE4', '#FFFFFF', 'youth', 39, 'Canyoncreek Field', 12000],
    ['Sunburg Brewers', 'SUQ', 'Sunburg', '#000000', '#FFFFFF', 'fan', 37, 'Summitville Stadium', 11000],
    ['Millfalls Rapids', 'MLF', 'Millfalls', '#E30613', '#0057B8', 'youth', 36, 'Millfalls Arena', 11000],
    ['New Springton Mustangs', 'SPK33', 'Springton', '#0057B8', '#001F5B', 'youth', 36, 'Goldenford Field', 11500],
    ['Bluesprings Rockets', 'BLD', 'Bluesprings', '#0057B8', '#6A1B9A', 'fan', 35, 'Redview Field', 13500],
    ['Riverford Revolution', 'RRD', 'Riverford', '#6A1B9A', '#0057B8', 'fallen', 35, 'Riverford Stadium', 13000],
    [
      'Goldensprings Athletic',
      'GOE',
      'Goldensprings',
      '#6A1B9A',
      '#FFFFFF',
      'selling',
      34,
      'Goldensprings Arena',
      10500,
    ],
    ['Cypresston Ironworks SC', 'CYN', 'Cypresston', '#0057B8', '#001F5B', 'fan', 33, 'Goldendale Park', 9500],
    ['AC Sunwood', 'SUU', 'Sunwood', '#6A1B9A', '#00843D', 'fan', 32, 'Sunwood Field', 9000],
  ];
  FM.D.CLUBS_VN3 = [
    ['CLB Bac Giang', 'CLG', 'Bac Giang', '#E30613', '#FFD100', 'fan', 38, 'San Ninh Duong', 16000],
    ['Sai Lang Tinh', 'SAD51', 'Lang Tinh', '#000000', '#00843D', 'historic', 38, 'San Lang Tinh', 16000],
    ['Dong A Gia Dinh', 'DOA24', 'Gia Dinh', '#6CACE4', '#001F5B', 'historic', 36, 'San Thanh Lai', 15000],
    ['Thep Khanh Tinh', 'THW', 'Khanh Tinh', '#FFD100', '#FFFFFF', 'youth', 36, 'San Khanh Tinh', 12000],
    ['Hoang Anh Quang Nang', 'HOA24', 'Quang Nang', '#001F5B', '#E30613', 'fan', 35, 'San Quang Lac', 11000],
    ['Tuy Son United', 'TUY', 'Tuy Son', '#FFFFFF', '#00843D', 'fan', 34, 'Khanh Dinh Stadium', 12500],
    ['Thep Thai Phong', 'THX', 'Thai Phong', '#6A1B9A', '#0057B8', 'selling', 32, 'Tuy Tinh Stadium', 11000],
    ['Sai Dong An', 'SDO', 'Dong An', '#0057B8', '#6A1B9A', 'fan', 32, 'San Dong An', 10500],
    ['CLB Long Dinh', 'CLL', 'Long Dinh', '#0057B8', '#FFD100', 'fan', 30, 'San Nam Duong', 8000],
    ['Dong A Lam Quan', 'DNG', 'Lam Quan', '#001F5B', '#00843D', 'youth', 30, 'San Cao Giang', 9000],
    ['Cong An Quang Tinh', 'COZ', 'Quang Tinh', '#6A1B9A', '#E30613', 'fan', 29, 'Quang Tinh Stadium', 9500],
    ['Yen An United', 'YEF', 'Yen An', '#6A1B9A', '#FFD100', 'youth', 29, 'Gia Tinh Stadium', 12000],
  ];
  FM.D.CLUBS_AR4 = [
    ['Nacional Coronel Quiria', 'NCO', 'Coronel Quiria', '#FFFFFF', '#6A1B9A', 'fallen', 44, 'Estadio Bustano', 18000],
    ['Sportivo Lavano', 'LNO', 'Lavano', '#6CACE4', '#6A1B9A', 'fan', 42, 'Estadio Monumental Domar', 15500],
    ['Defensores de Santa Lavez', 'LLB', 'Santa Lavez', '#0057B8', '#6CACE4', 'fan', 41, 'Estadio Garo', 14500],
    ['Club Atlético Unión Ferano', 'FEO', 'Ferano', '#6CACE4', '#E30613', 'fan', 40, 'Estadio Torano', 15500],
    ['Independiente Lezano', 'LEO', 'Lezano', '#6A1B9A', '#000000', 'fan', 40, 'Estadio Monumental Velano', 16000],
    ['Independiente Garero', 'GAG', 'Garero', '#0057B8', '#6A1B9A', 'fan', 39, 'Estadio Municipal de Garero', 15500],
    ['Estudiantes de Velas', 'VVE', 'Velas', '#001F5B', '#00843D', 'fan', 39, 'Cancha de Velas', 12500],
    ['Atlético Escas', 'ESV', 'Escas', '#001F5B', '#FFD100', 'fan', 38, 'Cancha de Escas', 13000],
    ['Club Sportivo Urqar', 'URR', 'Urqar', '#000000', '#6A1B9A', 'fallen', 38, 'Cancha de Urqar', 12000],
    ['Club Atlético Belón', 'BOD27', 'Belón', '#6A1B9A', '#6CACE4', 'fan', 37, 'Cancha de Belón', 12500],
    [
      'General Bustez FC',
      'GEL',
      'General Bustez',
      '#6A1B9A',
      '#001F5B',
      'fan',
      36,
      'Estadio Municipal de General Bustez',
      14000,
    ],
    ['Nacional Lavar', 'NLA', 'Lavar', '#6CACE4', '#00843D', 'fallen', 35, 'Estadio Monumental Rodona', 14000],
    ['Atlético Franui', 'FUI', 'Franui', '#FFFFFF', '#6A1B9A', 'selling', 34, 'Cancha de Franui', 10000],
    [
      'Atlético Doctor Dorria',
      'DOB25',
      'Doctor Dorria',
      '#000000',
      '#6CACE4',
      'fan',
      34,
      'Cancha de Doctor Dorria',
      13500,
    ],
    ['Gimnasia de Dorrón', 'DOC26', 'Dorrón', '#00843D', '#FFFFFF', 'historic', 33, 'Estadio Belona', 11000],
    ['Villa Lavia FC', 'LAL34', 'Villa Lavia', '#0057B8', '#E30613', 'fallen', 33, 'Estadio Alverini', 11000],
  ];
  FM.D.CLUBS_AT4 = [
    ['SV Bruchberg', 'BRG30', 'Bruchberg', '#6A1B9A', '#000000', 'historic', 43, 'Waldstadion Bruchberg', 14500],
    ['Teutonia Heidbach', 'HHE', 'Heidbach', '#6A1B9A', '#FFFFFF', 'youth', 42, 'Heidbach-Arena', 13000],
    ['SV Altdorf 1907', 'ARX', 'Altdorf', '#6CACE4', '#E30613', 'fan', 42, 'Altdorf-Arena', 16500],
    ['TSV Eichwald', 'EIC', 'Eichwald', '#FFFFFF', '#E30613', 'selling', 41, 'Stadion Althausen', 13000],
    ['Viktoria Krondorf', 'KRP', 'Krondorf', '#FFFFFF', '#0057B8', 'fan', 40, 'Steinweiler-Stadion', 16500],
    ['Sportfreunde Neu Hagtal', 'NEB25', 'Neu Hagtal', '#FFD100', '#00843D', 'selling', 39, 'Stadion Furtfurt', 15000],
    ['Preußen Westerau', 'PRP', 'Westerau', '#FFFFFF', '#FFD100', 'fan', 38, 'Westerau-Arena', 12500],
    ['Eintracht Eichbach', 'EIH', 'Eichbach', '#00843D', '#FFFFFF', 'youth', 38, 'Stadion am Neckarhof', 13000],
    ['FC Kronheim', 'KRQ', 'Kronheim', '#FFFFFF', '#0057B8', 'historic', 37, 'Stadion am Rotau', 12000],
    ['Teutonia Burgburg', 'BUB25', 'Burgburg', '#6A1B9A', '#6CACE4', 'selling', 37, 'Stadion am Hirschbach', 14500],
    ['Borussia Klein Lindstadt', 'BOE28', 'Lindstadt', '#001F5B', '#FFD100', 'historic', 36, 'Lindstadt-Arena', 10500],
    ['Union Unter Dornhafen', 'UDO', 'Dornhafen', '#6CACE4', '#FFFFFF', 'historic', 36, 'Hainbrück-Stadion', 11000],
    ['Eintracht Haghafen', 'HET', 'Haghafen', '#001F5B', '#00843D', 'fan', 34, 'Waldstadion Haghafen', 10500],
    ['SV Eberingen', 'EBE', 'Eberingen', '#E30613', '#0057B8', 'fallen', 33, 'Waldstadion Eberingen', 10500],
    ['TSV Lütberg im Tal', 'LUK', 'Lütberg im Tal', '#00843D', '#000000', 'youth', 33, 'Lindau-Stadion', 9500],
    ['Eintracht Unter Bruchof', 'UNE', 'Bruchof', '#E30613', '#FFFFFF', 'youth', 33, 'Stadion Neckardorf', 11500],
  ];
  FM.D.CLUBS_BE4 = [
    ['KRC Klein Laagbeek', 'KKL', 'Laagbeek', '#6A1B9A', '#E30613', 'fan', 43, 'Hoogbrug Stadion', 15500],
    ['Union Oud Sneekdijk', 'OSN', 'Sneekdijk', '#FFD100', '#6A1B9A', 'fan', 42, 'Nieuwrade Stadion', 14000],
    [
      'FC Klein Wagewijk',
      'KLD',
      'Wagewijk',
      '#6A1B9A',
      '#6CACE4',
      'selling',
      41,
      'Gemeentelijk Stadion Wagewijk',
      16500,
    ],
    ['KV Zaanbeek', 'ZAQ', 'Zaanbeek', '#6CACE4', '#E30613', 'historic', 41, 'Stade Maasvoort', 15500],
    [
      'Racing Oud Hoornwaard',
      'OUH',
      'Hoornwaard',
      '#00843D',
      '#FFD100',
      'youth',
      40,
      'Stade Communal de Hoornwaard',
      16500,
    ],
    ['Royal Bergkerk', 'RBE', 'Bergkerk', '#0057B8', '#6CACE4', 'fallen', 39, 'Stedelijk Stadion Bergkerk', 13000],
    ['Racing Bredam', 'BRH31', 'Bredam', '#FFFFFF', '#E30613', 'fan', 39, 'Stade Communal de Bredam', 13500],
    ['KAA Nieuw Tilwaard', 'KNI', 'Tilwaard', '#E30613', '#FFD100', 'fan', 38, 'Stedelijk Stadion Tilwaard', 13000],
    ['KV Kleinveen', 'KLK', 'Kleinveen', '#000000', '#6A1B9A', 'historic', 37, 'Gemeentelijk Stadion Kleinveen', 15000],
    ['KRC Oudlo aan Zee', 'KOP', 'Oudlo aan Zee', '#001F5B', '#E30613', 'selling', 37, 'Sneekzand Stadion', 13000],
    ['Koninklijke Noordburg', 'KNO', 'Noordburg', '#0057B8', '#00843D', 'historic', 36, 'Stade Vlaarbrug', 15000],
    ['KFC Laaghout', 'KFL', 'Laaghout', '#001F5B', '#E30613', 'fan', 35, 'Gemeentelijk Stadion Laaghout', 10500],
    [
      'FC Nieuw Grootrade',
      'NGR',
      'Nieuw Grootrade',
      '#001F5B',
      '#00843D',
      'fan',
      35,
      'Stade Communal de Nieuw Grootrade',
      13000,
    ],
    ['Union Wagewaard', 'WAQ', 'Wagewaard', '#001F5B', '#FFFFFF', 'historic', 33, 'Zuidlo Stadion', 11500],
    ['FC Hoogbrug', 'HUG', 'Hoogbrug', '#6A1B9A', '#0057B8', 'selling', 32, 'Hoornkerk Stadion', 10500],
    [
      'Excelsior Groot Dijkhoven',
      'EXG',
      'Groot Dijkhoven',
      '#000000',
      '#FFFFFF',
      'youth',
      32,
      'Noordbrug Stadion',
      9000,
    ],
  ];
  FM.D.CLUBS_BR4 = [
    ['União Itapiba', 'IBA', 'Itapiba', '#00843D', '#FFFFFF', 'fan', 43, 'Complexo Santão', 16500],
    ['Nacional Mogima', 'NMO', 'Mogima', '#0057B8', '#6CACE4', 'historic', 42, 'Complexo Ibia', 14000],
    ['Clube Atlético Guariba', 'GBA', 'Guariba', '#001F5B', '#6A1B9A', 'youth', 42, 'Estádio Novo Tabara', 13000],
    ['Esporte Clube Itajoba', 'IIT', 'Itajoba', '#FFFFFF', '#E30613', 'historic', 41, 'Complexo Pirama', 17500],
    ['Nacional Ipatama', 'NIP', 'Ipatama', '#FFFFFF', '#FFD100', 'historic', 40, 'Estádio Municipal de Ipatama', 14000],
    ['Ipara FC', 'IPB', 'Ipara', '#FFFFFF', '#FFD100', 'historic', 40, 'Estádio Municipal de Ipara', 13000],
    ['Grêmio Capima', 'CMA', 'Capima', '#FFD100', '#6CACE4', 'fan', 40, 'Arena Capão', 16500],
    ['Racing Uruceguá', 'UUA', 'Uruceguá', '#FFD100', '#6A1B9A', 'fan', 39, 'Complexo Santiba', 16000],
    ['Carimirim FC', 'CIM', 'Carimirim', '#6A1B9A', '#E30613', 'youth', 38, 'Estádio Tijuguá', 12000],
    ['Cambú Futebol Clube', 'CBU', 'Cambú', '#000000', '#6CACE4', 'fan', 37, 'Complexo Tabope', 12500],
    ['Sport Clube Arapú', 'APU', 'Arapú', '#001F5B', '#FFD100', 'fan', 37, 'Estádio Novo Nhanope', 14500],
    ['Sport Clube Capina', 'CAQ38', 'Capina', '#E30613', '#FFD100', 'youth', 37, 'Estádio Pirú', 15000],
    ['Sport Club Capimirim', 'CAR39', 'Capimirim', '#00843D', '#6A1B9A', 'youth', 36, 'Estádio Novo Ubatão', 15000],
    ['União Cambama', 'CAS40', 'Cambama', '#0057B8', '#6CACE4', 'historic', 35, 'Estádio Municipal de Cambama', 13000],
    ['Clube Guiba', 'GUJ', 'Guiba', '#FFD100', '#E30613', 'fallen', 35, 'Estádio Tijão', 10500],
    ['Sport Club Ipatia', 'IIA', 'Ipatia', '#000000', '#6A1B9A', 'fan', 34, 'Estádio Novo Pindina', 11000],
    ['Sport Clube Ipatai', 'IPI', 'Ipatai', '#FFFFFF', '#00843D', 'selling', 34, 'Estádio Vassina', 13500],
    ['Sport Clube Cariguá', 'CAT41', 'Cariguá', '#000000', '#E30613', 'fallen', 33, 'Estádio Guaçu', 9500],
    ['Atlético Catamirim', 'CAU42', 'Catamirim', '#FFD100', '#0057B8', 'fan', 33, 'Complexo Itia', 10500],
    ['Nacional Itapópolis', 'NAS40', 'Itapópolis', '#0057B8', '#6A1B9A', 'fan', 33, 'Estádio Tabotuba', 9000],
  ];
  FM.D.CLUBS_CL4 = [
    ['Meda Balompié', 'MEA24', 'Meda', '#0057B8', '#E30613', 'youth', 43, 'Estadio Municipal de Meda', 16500],
    ['Oñatilla Balompié', 'ONC', 'Oñatilla', '#6CACE4', '#E30613', 'fallen', 42, 'Nuevo Estadio Oñatilla', 14500],
    ['Racing Alto Alcalete', 'ALA72', 'Alcalete', '#FFFFFF', '#6A1B9A', 'selling', 41, 'Estadio Escalena', 15500],
    ['Sporting Pozero', 'PPO', 'Pozero', '#00843D', '#6CACE4', 'fan', 41, 'Estadio Municipal de Pozero', 16500],
    ['Sepúlvar CF', 'SEG30', 'Sepúlvar', '#E30613', '#6CACE4', 'historic', 40, 'Ciudad Deportiva Sepúlvar', 12500],
    ['Talar CF', 'TAY46', 'Talar', '#6A1B9A', '#FFFFFF', 'fan', 39, 'Campo de Talar', 11500],
    ['Roblara CF', 'RRA', 'Roblara', '#E30613', '#6A1B9A', 'fan', 38, 'Estadio Valdemar', 12500],
    ['Cordedo Balompié', 'COO', 'Cordedo', '#0057B8', '#FFD100', 'fallen', 38, 'Ciudad Deportiva Cordedo', 12000],
    ['Atlético Benanes', 'BEP37', 'Benanes', '#E30613', '#0057B8', 'historic', 38, 'Estadio Sorador', 15500],
    ['UD Oriha', 'ORJ', 'Oriha', '#00843D', '#6A1B9A', 'fan', 37, 'Nuevo Estadio Oriha', 15000],
    ['Sporting Bajo Corvejo', 'BCO', 'Corvejo', '#6CACE4', '#0057B8', 'fan', 36, 'Estadio La Calatejo', 11500],
    ['Juventud Osunón', 'OON', 'Osunón', '#6A1B9A', '#000000', 'fan', 35, 'Ciudad Deportiva Osunón', 14500],
    ['SD Rondera', 'SDC', 'Rondera', '#6CACE4', '#00843D', 'fan', 34, 'Campo de Rondera', 13500],
    ['Juventud Las Valdemera', 'LVA', 'Las Valdemera', '#6CACE4', '#00843D', 'fan', 33, 'Estadio Jarandete', 12500],
    ['UD Bajo Úbeda', 'BAD51', 'Úbeda', '#FFD100', '#0057B8', 'historic', 32, 'Campo de Úbeda', 10000],
    ['Real San Nerjanes', 'NEC26', 'San Nerjanes', '#6A1B9A', '#FFD100', 'fallen', 32, 'Campo de San Nerjanes', 8500],
  ];
  FM.D.CLUBS_CS4 = [
    ['Qingyuan City', 'QIN', 'Qingyuan', '#E30613', '#FFD100', 'fan', 43, 'Qingyuan Sports Centre', 15500],
    ['Pingyang Phoenix', 'PIL', 'Pingyang', '#000000', '#6A1B9A', 'youth', 43, 'Xintang Stadium', 16000],
    ['Weicheng Lions', 'WEI', 'Weicheng', '#FFFFFF', '#00843D', 'fan', 40, 'Fyuan Stadium', 14000],
    ['Fuzhou FC', 'FUZ', 'Fuzhou', '#E30613', '#00843D', 'fan', 40, 'Fuzhou Sports Centre', 17000],
    ['Longchuan Cranes', 'LOM', 'Longchuan', '#6CACE4', '#FFD100', 'historic', 39, 'Longchuan Olympic Stadium', 16000],
    ['Shaning City', 'SHB25', 'Shaning', '#6A1B9A', '#FFFFFF', 'historic', 38, 'Shaning Olympic Stadium', 13000],
    ['Longyuan United', 'LUL', 'Longyuan', '#FFFFFF', '#0057B8', 'selling', 37, 'Shantang Stadium', 11000],
    ['Shanbin Sports', 'SHC26', 'Shanbin', '#001F5B', '#E30613', 'youth', 35, 'Shanbin Olympic Stadium', 12000],
    ['Longtang United', 'LOQ', 'Longtang', '#000000', '#E30613', 'historic', 35, 'Longtang Sports Centre', 10500],
    ['Bayuan City', 'BCI', 'Bayuan', '#FFD100', '#000000', 'youth', 34, 'Kayuan Arena', 13500],
    ['Qingzhou Tigers', 'QIU', 'Qingzhou', '#FFD100', '#00843D', 'fallen', 33, 'Angang Arena', 13000],
    ['Fubin Sports', 'FUP', 'Fubin', '#00843D', '#FFFFFF', 'fan', 32, 'Fubin Sports Centre', 11000],
  ];
  FM.D.CLUBS_CZ4 = [
    ['Slavoj Vsetínov', 'VSV', 'Vsetínov', '#001F5B', '#6A1B9A', 'selling', 43, 'Letní stadion Vsetínov', 15500],
    ['Viktoria Velký Jabice', 'VEA24', 'Velký Jabice', '#000000', '#6CACE4', 'selling', 42, 'Aréna Sedany', 16000],
    ['FC Kostava', 'KOQ', 'Kostava', '#FFD100', '#6A1B9A', 'fallen', 42, 'Letní stadion Kostava', 16500],
    ['Slavoj Trenice', 'TCE', 'Trenice', '#001F5B', '#0057B8', 'fallen', 41, 'Městský stadion Trenice', 16000],
    ['FK Karany', 'KNY', 'Karany', '#E30613', '#FFD100', 'fan', 40, 'Stadion u Nymice', 16000],
    ['Dynamo Prostedov', 'PRQ', 'Prostedov', '#FFFFFF', '#E30613', 'historic', 40, 'Aréna Vsetínedov', 17000],
    ['Holín Slovan', 'HIH', 'Holín', '#FFFFFF', '#0057B8', 'selling', 38, 'Aréna Mladená', 14500],
    ['Dynamo Karice', 'KCE', 'Karice', '#000000', '#E30613', 'fan', 38, 'Městský stadion Karice', 14500],
    ['Doubany Slovan', 'DNY', 'Doubany', '#E30613', '#FFFFFF', 'fallen', 37, 'Městský stadion Doubany', 14000],
    ['Spartak Dolní Rokava', 'SPL34', 'Dolní Rokava', '#00843D', '#6CACE4', 'fan', 36, 'Stadion u Vsetíná', 15000],
    ['FK Pardín', 'PAT41', 'Pardín', '#E30613', '#6CACE4', 'youth', 36, 'Aréna Sedice', 10500],
    ['Sokol Sedená', 'SSE', 'Sedená', '#FFFFFF', '#E30613', 'youth', 35, 'Stadion u Rychodov', 10000],
    ['Branín Slovan', 'BIC', 'Branín', '#00843D', '#FFFFFF', 'youth', 33, 'Letní stadion Branín', 10500],
    ['Dynamo Vysov', 'VYV', 'Vysov', '#00843D', '#FFFFFF', 'fallen', 33, 'Stadion Kostec', 13000],
    ['Sparta Vsetínodov', 'VOV', 'Vsetínodov', '#E30613', '#6CACE4', 'fallen', 33, 'Stadion u Branov', 13000],
    ['Viktoria Holoná', 'HOB25', 'Holoná', '#00843D', '#6CACE4', 'fan', 32, 'Letní stadion Holoná', 9500],
  ];
  FM.D.CLUBS_DK4 = [
    ['IK Lillevik', 'LLI', 'Lillevik', '#0057B8', '#00843D', 'historic', 43, 'Lillevik Idrætsanlæg', 17000],
    ['Havgård IF', 'HRD', 'Havgård', '#6CACE4', '#000000', 'selling', 42, 'Hedlund Stadion', 15000],
    ['FC Askstad', 'ASQ', 'Askstad', '#0057B8', '#E30613', 'selling', 41, 'Skovgård Stadion', 14500],
    ['Holund IF', 'HOC26', 'Holund', '#000000', '#6CACE4', 'youth', 41, 'Holund Idrætsanlæg', 16000],
    ['FC Bergstad', 'BEQ38', 'Bergstad', '#6A1B9A', '#E30613', 'youth', 38, 'Bergstad Arena', 12000],
    ['Holvik BK', 'HOD27', 'Holvik', '#000000', '#0057B8', 'historic', 38, 'Havø Idrætspark', 16000],
    ['Frevang Boldklub', 'FRU', 'Frevang', '#0057B8', '#FFD100', 'fallen', 37, 'Frelund Idrætspark', 11000],
    ['FC Vesterfjordgård', 'VEB25', 'Vesterfjordgård', '#6CACE4', '#001F5B', 'selling', 37, 'Dalund Stadion', 15000],
    ['Fremad Ringfors', 'RIQ', 'Ringfors', '#00843D', '#6A1B9A', 'historic', 35, 'Ringfors Idrætsanlæg', 11000],
    ['BK Hedholm', 'HEV', 'Hedholm', '#000000', '#001F5B', 'fan', 33, 'Bergnæs Stadion', 12000],
    ['Storholm IF', 'STD27', 'Storholm', '#6CACE4', '#0057B8', 'fan', 33, 'Bergborg Stadion', 10500],
    ['Sydø FK', 'SYB', 'Sydø', '#000000', '#E30613', 'youth', 31, 'Solvik Park', 8500],
  ];
  FM.D.CLUBS_FR4 = [
    ['Olympique de Joygnan', 'OLS', 'Joygnan', '#0057B8', '#E30613', 'youth', 43, 'Stade de la Vilbourg', 15000],
    ['US Chereau', 'CHV43', 'Chereau', '#6A1B9A', '#0057B8', 'selling', 43, 'Stade de la Courbourg', 13500],
    ['Racing Saint-Chamont', 'CNT', 'Chamont', '#FFD100', '#6A1B9A', 'fan', 42, 'Stade Municipal de Chamont', 13500],
    ['AJ Marange', 'MGE', 'Marange', '#0057B8', '#001F5B', 'fan', 41, 'Stade de la Belieu', 12500],
    ['Racing Rocault', 'RLT', 'Rocault', '#FFD100', '#E30613', 'youth', 41, 'Stade Municipal de Rocault', 13000],
    ['FC Nanac', 'NAZ47', 'Nanac', '#FFD100', '#6CACE4', 'selling', 41, 'Complexe Marmont', 13000],
    [
      'Athlétic Sainte-Lavay',
      'SAK57',
      'Sainte-Lavay',
      '#FFD100',
      '#0057B8',
      'fallen',
      41,
      'Stade de la Nanville',
      13500,
    ],
    ['SC Touray', 'TOT', 'Touray', '#0057B8', '#6A1B9A', 'fan', 40, 'Stade Montcourt', 16500],
    [
      'SC Château-Dieuières',
      'CHT41',
      'Dieuières',
      '#FFD100',
      '#000000',
      'fan',
      40,
      'Stade Municipal de Dieuières',
      12000,
    ],
    ['Racing Pauault', 'PAF53', 'Pauault', '#001F5B', '#E30613', 'youth', 40, 'Stade Ribay', 15500],
    ['Stade Mont-Paucourt', 'MOL34', 'Paucourt', '#001F5B', '#6CACE4', 'fan', 39, 'Stade Nanlac', 15000],
    ['ES Château-Tourmont', 'CTO', 'Tourmont', '#6CACE4', '#6A1B9A', 'fallen', 39, 'Stade Tourières', 15500],
    ['Étoile Aron', 'ARC26', 'Aron', '#E30613', '#00843D', 'fan', 39, 'Stade de la Vilville', 15000],
    ['FC Mont-Blanville', 'MOR39', 'Blanville', '#0057B8', '#00843D', 'fan', 39, 'Stade Municipal de Blanville', 13000],
    ['Stade Tholieu', 'THB25', 'Tholieu', '#FFD100', '#FFFFFF', 'historic', 39, 'Stade Municipal de Tholieu', 16000],
    ['AS Ponières', 'POW44', 'Ponières', '#00843D', '#0057B8', 'fan', 39, 'Stade de la Fonens', 14000],
    ['SC Lanlieu', 'LAM35', 'Lanlieu', '#001F5B', '#000000', 'historic', 38, 'Stade de la Arault', 16000],
    ['FC Saint-Ponbourg', 'POV43', 'Ponbourg', '#6CACE4', '#001F5B', 'fallen', 38, 'Stade de la Grenac', 13500],
    ['FC Grengnan', 'GRF29', 'Grengnan', '#6CACE4', '#000000', 'fan', 38, 'Stade Nanault', 15000],
    ['FC Sainte-Pauault', 'SAJ56', 'Sainte-Pauault', '#FFD100', '#001F5B', 'fan', 38, 'Stade Chamont', 15000],
    ['Laville FC', 'LAV43', 'Laville', '#6A1B9A', '#000000', 'fallen', 38, 'Parc des Sports de Laville', 14000],
    ['Sporting Club de Montay', 'MOS40', 'Montay', '#00843D', '#0057B8', 'fallen', 38, 'Complexe Nanmont', 12000],
    ['Racing Beau-Luneau', 'BER39', 'Beau-Luneau', '#E30613', '#6CACE4', 'fan', 37, 'Stade Monbourg', 15000],
    ['AS Nangnan', 'NNF', 'Nangnan', '#FFFFFF', '#FFD100', 'historic', 37, 'Stade Municipal de Nangnan', 15500],
    ['FC Cassières', 'CEJ', 'Cassières', '#001F5B', '#000000', 'fan', 37, 'Stade Thoville', 12000],
    ['Union Sainte-Tourens', 'STM', 'Sainte-Tourens', '#E30613', '#000000', 'youth', 37, 'Complexe Damlieu', 13500],
    [
      'Racing Saint-Lavlieu',
      'LEU',
      'Lavlieu',
      '#FFFFFF',
      '#000000',
      'historic',
      36,
      'Stade Municipal de Lavlieu',
      11500,
    ],
    ['RC Mirmont', 'MIW', 'Mirmont', '#00843D', '#6A1B9A', 'youth', 36, 'Stade Municipal de Mirmont', 14500],
    ['Racing Paubourg', 'PAE52', 'Paubourg', '#00843D', '#0057B8', 'fan', 36, 'Stade Beaucourt', 14500],
    ['Racing Mirgnan', 'MIB25', 'Mirgnan', '#FFD100', '#6A1B9A', 'historic', 36, 'Stade Valac', 12500],
    ['US Langnan', 'LAW44', 'Langnan', '#0057B8', '#001F5B', 'fan', 36, 'Stade Vilay', 13500],
    ['Sporting Vendac', 'VAB25', 'Vendac', '#6CACE4', '#001F5B', 'historic', 35, 'Stade Pauay', 10000],
    ['US Maron', 'MAE52', 'Maron', '#6CACE4', '#6A1B9A', 'historic', 35, 'Stade Tourac', 14000],
    ['FC Damcourt', 'DAE28', 'Damcourt', '#0057B8', '#001F5B', 'selling', 35, 'Stade de la Tourville', 11000],
    ['Athlétic Lanac', 'LAU42', 'Lanac', '#6A1B9A', '#6CACE4', 'selling', 35, 'Stade Thoon', 11000],
    ['US Saint-Chaay', 'CHW44', 'Chaay', '#FFD100', '#0057B8', 'youth', 35, 'Parc des Sports de Chaay', 10000],
    ['Stade Tourgnan', 'TOB25', 'Tourgnan', '#E30613', '#0057B8', 'fan', 35, 'Parc des Sports de Tourgnan', 10000],
    ['Union Sportive Chalieu', 'SPR39', 'Chalieu', '#FFFFFF', '#6A1B9A', 'historic', 34, 'Complexe Joycourt', 11500],
    ['Olympique Arange', 'OLU', 'Arange', '#000000', '#00843D', 'historic', 34, 'Stade Marbourg', 11000],
    ['Racing Thoault', 'THA24', 'Thoault', '#FFFFFF', '#6CACE4', 'historic', 34, 'Complexe Dieuay', 13500],
    ['FC Joycourt', 'JOA', 'Joycourt', '#6A1B9A', '#6CACE4', 'selling', 34, 'Stade Municipal de Joycourt', 14000],
    ['Union Aubières', 'AUH', 'Aubières', '#6CACE4', '#FFD100', 'youth', 34, 'Stade Municipal de Aubières', 14000],
    ['RC Dameau', 'DDA', 'Dameau', '#0057B8', '#6CACE4', 'fan', 33, 'Stade Sarville', 13000],
    ['US Pont-Dieuville', 'PNT', 'Pont-Dieuville', '#E30613', '#6CACE4', 'fan', 33, 'Stade Casslac', 10500],
    [
      'Union Sportive Dambourg',
      'SPS40',
      'Dambourg',
      '#6CACE4',
      '#6A1B9A',
      'fan',
      33,
      'Stade Municipal de Dambourg',
      13500,
    ],
    [
      'Étoile de Sarlieu-lès-Bois',
      'SAL58',
      'Sarlieu-lès-Bois',
      '#00843D',
      '#6CACE4',
      'fan',
      33,
      'Stade Courville',
      11500,
    ],
    [
      'AS Villeneuve-Joyville',
      'VIK33',
      'Joyville',
      '#0057B8',
      '#001F5B',
      'historic',
      32,
      'Stade Municipal de Joyville',
      13500,
    ],
    ['Étoile de Château-Vilgnan', 'CHU42', 'Vilgnan', '#E30613', '#6CACE4', 'historic', 32, 'Stade Rocgnan', 10500],
  ];
  FM.D.CLUBS_DE4 = [
    ['FSV Bergsee', 'BBF', 'Bergsee', '#6CACE4', '#FFFFFF', 'historic', 44, 'Langberg-Stadion', 16500],
    ['SV Hagheim', 'HAU42', 'Hagheim', '#E30613', '#00843D', 'fallen', 43, 'Holzhausen-Stadion', 18500],
    ['TSV Lindstein', 'LIF29', 'Lindstein', '#000000', '#FFFFFF', 'selling', 43, 'Lindstein-Arena', 14000],
    ['Viktoria Hohenberg', 'HOE28', 'Hohenberg', '#FFD100', '#FFFFFF', 'historic', 43, 'Stadion am Bachkirchen', 15500],
    [
      'Fortuna Klein Greifheim',
      'KID27',
      'Klein Greifheim',
      '#000000',
      '#6A1B9A',
      'historic',
      43,
      'Waldstadion Klein Greifheim',
      17500,
    ],
    ['TSV Krontal', 'KRZ', 'Krontal', '#00843D', '#6A1B9A', 'selling', 43, 'Stadion am Rheinbach', 15000],
    ['Energie Groß Ebertal', 'ENG', 'Ebertal', '#6A1B9A', '#000000', 'fallen', 43, 'Dorntal-Stadion', 15000],
    [
      'Preußen Klein Marienheim',
      'PKL',
      'Klein Marienheim',
      '#0057B8',
      '#6A1B9A',
      'fallen',
      42,
      'Stadion Eichfeld',
      13500,
    ],
    ['FC Ober Furtberg', 'OBC', 'Furtberg', '#E30613', '#FFFFFF', 'fan', 42, 'Waldstadion Furtberg', 17000],
    ['Hertha Elsingen', 'HEZ', 'Elsingen', '#6A1B9A', '#000000', 'youth', 42, 'Elsingen-Arena', 15500],
    [
      'SV Bad Schwarzkirchen',
      'BAL58',
      'Schwarzkirchen',
      '#6A1B9A',
      '#000000',
      'youth',
      42,
      'Waldstadion Schwarzkirchen',
      17000,
    ],
    ['Eintracht Dillwald', 'DIH31', 'Dillwald', '#001F5B', '#00843D', 'fan', 42, 'Zellweiler-Stadion', 15000],
    ['Eintracht Hohendorf', 'HOF29', 'Hohendorf', '#000000', '#FFFFFF', 'youth', 42, 'Stadion am Haghof', 13500],
    ['Schwarzhausen 1899', 'SCN', 'Schwarzhausen', '#FFD100', '#001F5B', 'selling', 41, 'Sportpark Branbrück', 14000],
    ['Energie Wieswald', 'EIA', 'Wieswald', '#FFD100', '#6A1B9A', 'fan', 41, 'Dornstadt-Stadion', 13500],
    ['SC Wiesingen 1901', 'WIM', 'Wiesingen', '#FFFFFF', '#0057B8', 'fan', 41, 'Stadion am Greifhorst', 14500],
    ['Viktoria Neu Niederbrück', 'NEF29', 'Niederbrück', '#6CACE4', '#6A1B9A', 'fan', 41, 'Stadion Lütkirchen', 15500],
    ['Eintracht Dillburg 1886', 'DIG30', 'Dillburg', '#FFD100', '#000000', 'youth', 41, 'Waldstadion Dillburg', 14500],
    ['Union Ober Mühlstadt', 'OBG', 'Mühlstadt', '#E30613', '#6A1B9A', 'historic', 41, 'Oberwald-Stadion', 17000],
    ['TSV Rheinburg', 'RHG', 'Rheinburg', '#E30613', '#FFD100', 'fan', 41, 'Stadion am Bachwald', 17500],
    ['FC Thaldorf', 'THC26', 'Thaldorf', '#FFD100', '#00843D', 'fan', 41, 'Bachberg-Stadion', 13500],
    [
      'Concordia Neu Dillkirchen',
      'CNE',
      'Dillkirchen',
      '#00843D',
      '#6CACE4',
      'historic',
      41,
      'Dillkirchen-Arena',
      15000,
    ],
    ['TSV Ober Altingen', 'OBR', 'Ober Altingen', '#FFD100', '#6A1B9A', 'fan', 40, 'Waldstadion Ober Altingen', 13500],
    ['TSV Hagkirchen 1903', 'HAB49', 'Hagkirchen', '#FFD100', '#001F5B', 'fallen', 40, 'Stadion am Kroningen', 15000],
    ['Viktoria Bad Branbrück', 'BAM59', 'Branbrück', '#FFD100', '#E30613', 'fan', 40, 'Zellhausen-Stadion', 15000],
    ['SV Unter Langtal', 'UNS', 'Langtal', '#E30613', '#00843D', 'fallen', 40, 'Stadion Mühldorf', 12000],
    ['FSV Felswald', 'FED', 'Felswald', '#FFD100', '#0057B8', 'fan', 39, 'Stadion am Niedersee', 12500],
    ['SpVgg Furtkirchen', 'FUQ', 'Furtkirchen', '#001F5B', '#FFD100', 'fan', 39, 'Sportpark Ahrfurt', 13500],
    ['FC Neckarhof', 'NEE28', 'Neckarhof', '#00843D', '#001F5B', 'fallen', 39, 'Langingen-Stadion', 14000],
    ['VfB Eichstadt 1917', 'EID', 'Eichstadt', '#6A1B9A', '#6CACE4', 'historic', 39, 'Bergstadt-Stadion', 12500],
    ['Neckartal 04', 'NEG30', 'Neckartal', '#6CACE4', '#001F5B', 'fan', 39, 'Stadion Dornburg', 11500],
    ['Borussia Kronstadt', 'BOK33', 'Kronstadt', '#00843D', '#FFD100', 'historic', 39, 'Stadion Kalau', 14000],
    ['Sportfreunde Steinfeld', 'SLQ', 'Steinfeld', '#FFD100', '#6A1B9A', 'fallen', 38, 'Greifkirchen-Stadion', 15000],
    ['FSV Dornhof', 'DOE28', 'Dornhof', '#6A1B9A', '#E30613', 'fan', 38, 'Freiheim-Stadion', 13000],
    ['Preußen Eberdorf', 'PRX', 'Eberdorf', '#6CACE4', '#FFFFFF', 'historic', 38, 'Stadion am Schwarzbrück', 14000],
    ['SV Unter Ahrtal 1928', 'UNQ', 'Ahrtal', '#000000', '#6A1B9A', 'selling', 38, 'Stadion am Langhorst', 13500],
    [
      'Alemannia Neu Grünhorst',
      'ALN84',
      'Neu Grünhorst',
      '#000000',
      '#00843D',
      'selling',
      38,
      'Sportpark Elshorst',
      12000,
    ],
    ['Teutonia Klein Dorndorf', 'KLH', 'Dorndorf', '#0057B8', '#FFFFFF', 'selling', 38, 'Stadion am Steinhorst', 11500],
    ['Westerkirchen 04', 'WEE', 'Westerkirchen', '#E30613', '#001F5B', 'fan', 38, 'Waldstadion Westerkirchen', 14000],
    ['FC Neu Greifweiler', 'NEJ32', 'Greifweiler', '#00843D', '#001F5B', 'fan', 38, 'Stadion Kronhausen', 15500],
    ['TSV Alt Hainfurt 1926', 'ALB73', 'Hainfurt', '#001F5B', '#FFD100', 'historic', 37, 'Hagdorf-Stadion', 11500],
    ['Eintracht Elsbrück 1912', 'ECK', 'Elsbrück', '#001F5B', '#FFFFFF', 'fan', 37, 'Elsbrück-Arena', 14500],
    ['Fortuna Ober Langbach', 'OBF', 'Langbach', '#6A1B9A', '#00843D', 'fan', 37, 'Eichweiler-Stadion', 14000],
    ['Fortuna Furtal 1892', 'FUT', 'Furtal', '#E30613', '#00843D', 'selling', 37, 'Furtal-Arena', 14000],
    ['TSV Eberhafen 1915', 'EBN', 'Eberhafen', '#0057B8', '#000000', 'youth', 37, 'Stadion Greiftal', 11000],
    ['Immberg 04', 'IMB', 'Immberg', '#E30613', '#000000', 'fan', 37, 'Freidorf-Stadion', 14500],
    ['FC Eberweiler', 'EBR', 'Eberweiler', '#6A1B9A', '#FFD100', 'fan', 37, 'Waldstadion Eberweiler', 10500],
    ['Altsee 04', 'AEE', 'Altsee', '#6A1B9A', '#001F5B', 'youth', 37, 'Neckarhof-Stadion', 15500],
    ['VfB Burgweiler', 'BUF29', 'Burgweiler', '#6A1B9A', '#FFD100', 'fan', 37, 'Mühldorf-Stadion', 13000],
    ['Altkirchen 04', 'ALQ86', 'Altkirchen', '#001F5B', '#000000', 'fan', 37, 'Dornsee-Stadion', 13000],
    ['Concordia Mühlbach', 'CIB', 'Mühlbach', '#FFFFFF', '#6A1B9A', 'fan', 37, 'Mühlbach-Arena', 11000],
    ['Germania Rothof', 'ROD27', 'Rothof', '#FFD100', '#000000', 'fan', 36, 'Lindberg-Stadion', 14500],
    ['VfL Hagtal', 'HAA48', 'Hagtal', '#0057B8', '#FFD100', 'historic', 36, 'Waldstadion Hagtal', 12500],
    [
      'Viktoria Klein Wieshorst',
      'KLG',
      'Klein Wieshorst',
      '#001F5B',
      '#FFFFFF',
      'fan',
      36,
      'Waldstadion Klein Wieshorst',
      14500,
    ],
    ['FC Niederstein', 'NIR', 'Niederstein', '#E30613', '#0057B8', 'youth', 36, 'Waldstadion Niederstein', 14500],
    ['Sportfreunde Neu Immbrück', 'NEH31', 'Immbrück', '#FFFFFF', '#0057B8', 'historic', 36, 'Stadion Rotstein', 14500],
    ['Energie Lindhof', 'EIF', 'Lindhof', '#6A1B9A', '#00843D', 'historic', 36, 'Waldstadion Lindhof', 13500],
    ['SpVgg Alt Bruchsee', 'ABR', 'Bruchsee', '#FFD100', '#E30613', 'historic', 36, 'Zellburg-Stadion', 12500],
    ['Eintracht Kronberg 1877', 'KRW', 'Kronberg', '#FFFFFF', '#6A1B9A', 'selling', 36, 'Kronberg-Arena', 10500],
    ['Concordia Kronhorst', 'COJ32', 'Kronhorst', '#FFD100', '#0057B8', 'historic', 36, 'Sportpark Mühlstadt', 12000],
    ['FC Rheinstein 1946', 'RHB', 'Rheinstein', '#6A1B9A', '#00843D', 'historic', 36, 'Sportpark Kirchberg', 12000],
    ['SV Groß Greifstadt 1918', 'GRG30', 'Greifstadt', '#00843D', '#E30613', 'youth', 36, 'Stadion am Branwald', 12000],
    ['Arminia Bad Goldberg', 'ARE28', 'Bad Goldberg', '#FFD100', '#001F5B', 'fan', 36, 'Bad Goldberg-Arena', 13000],
    [
      'Unter Ahrkirchen 1899',
      'UAH',
      'Unter Ahrkirchen',
      '#000000',
      '#6CACE4',
      'fan',
      35,
      'Unter Ahrkirchen-Arena',
      14500,
    ],
    ['Preußen Ober Dillstadt', 'PRR', 'Ober Dillstadt', '#FFFFFF', '#0057B8', 'fan', 35, 'Ober Dillstadt-Arena', 14000],
    ['FC Alt Heidberg 1932', 'ALM83', 'Heidberg', '#FFD100', '#6CACE4', 'fan', 35, 'Immwald-Stadion', 14500],
    ['Ober Furtstadt 1899', 'OEA', 'Furtstadt', '#FFFFFF', '#FFD100', 'fan', 35, 'Furtstadt-Arena', 13500],
    ['SpVgg Lindsee', 'LIG30', 'Lindsee', '#E30613', '#001F5B', 'selling', 35, 'Sportpark Hainberg', 10500],
    ['Arminia Immingen', 'ARD27', 'Immingen', '#FFFFFF', '#000000', 'fan', 35, 'Immingen-Arena', 11000],
    ['SV Westerberg', 'WEG', 'Westerberg', '#E30613', '#6CACE4', 'fallen', 35, 'Stadion am Waldbach', 10500],
    ['Sportfreunde Grünwald 1918', 'GRX', 'Grünwald', '#6CACE4', '#FFD100', 'historic', 34, 'Stadion Furthorst', 13500],
    ['FC Hagweiler', 'HAZ47', 'Hagweiler', '#001F5B', '#FFD100', 'fan', 34, 'Waldstadion Hagweiler', 9500],
    ['FC Mühlberg', 'MUP', 'Mühlberg', '#FFD100', '#000000', 'youth', 34, 'Mühlberg-Arena', 13000],
    [
      'Concordia Hagstadt am Berg',
      'COH31',
      'Hagstadt am Berg',
      '#000000',
      '#001F5B',
      'fan',
      34,
      'Sportpark Hirschweiler',
      13000,
    ],
    [
      'Blau-Weiß Neckaringen',
      'BLF',
      'Neckaringen',
      '#6A1B9A',
      '#000000',
      'historic',
      34,
      'Waldstadion Neckaringen',
      14000,
    ],
    ['Fortuna Goldau', 'GOH', 'Goldau', '#0057B8', '#E30613', 'historic', 34, 'Sportpark Rheinwald', 14000],
    ['Energie Ahringen', 'ENF', 'Ahringen', '#6CACE4', '#001F5B', 'fan', 34, 'Stadion am Rheinweiler', 13000],
    ['FSV Alt Goldingen 1919', 'ALP85', 'Goldingen', '#FFD100', '#000000', 'historic', 34, 'Waldheim-Stadion', 12000],
    ['SV Kronbrück', 'KRX', 'Kronbrück', '#0057B8', '#000000', 'fan', 34, 'Stadion Oberau', 10500],
    ['SV Ober Schwarzdorf', 'OER', 'Schwarzdorf', '#FFFFFF', '#001F5B', 'fallen', 33, 'Stadion am Eichsee', 9000],
    ['Viktoria Immfurt', 'IMA', 'Immfurt', '#6A1B9A', '#FFD100', 'fan', 33, 'Burghafen-Stadion', 9000],
    ['SV Hirschorst', 'HIU', 'Hirschorst', '#6A1B9A', '#00843D', 'fallen', 33, 'Waldstadion Hirschorst', 9000],
    ['Viktoria Altbrück 1951', 'ALL82', 'Altbrück', '#FFFFFF', '#6A1B9A', 'historic', 33, 'Sportpark Dillburg', 13500],
    ['TSV Goldstein', 'GON', 'Goldstein', '#000000', '#0057B8', 'fallen', 33, 'Goldstein-Arena', 12000],
    ['Fortuna Eberhof 1910', 'EBA', 'Eberhof', '#6A1B9A', '#000000', 'fan', 33, 'Stadion am Goldhorst', 11000],
    ['Borussia Groß Wieshafen', 'BIE', 'Wieshafen', '#E30613', '#0057B8', 'fan', 33, 'Sportpark Mühlhafen', 9500],
    [
      'Preußen Hohen Kirchfeld',
      'PRZ',
      'Hohen Kirchfeld',
      '#FFD100',
      '#6CACE4',
      'youth',
      33,
      'Stadion am Hohenkirchen',
      12000,
    ],
    ['Fortuna Kirchorst', 'KST', 'Kirchorst', '#000000', '#001F5B', 'historic', 32, 'Kirchorst-Arena', 9500],
    ['TSV Felstadt', 'FEJ', 'Felstadt', '#0057B8', '#00843D', 'fan', 32, 'Waldstadion Felstadt', 9500],
    ['Borussia Kirchburg', 'BKI', 'Kirchburg', '#E30613', '#FFFFFF', 'fan', 32, 'Hirschingen-Stadion', 11500],
  ];
  FM.D.CLUBS_ID4 = [
    ['Bhakti Jembjaya', 'BHJ', 'Jembjaya', '#000000', '#FFFFFF', 'historic', 43, 'Solalembang Arena', 18000],
    ['Bhakti Kedikalan', 'BHK', 'Kedikalan', '#FFD100', '#6A1B9A', 'selling', 41, 'Bogokalan Sports Park', 17500],
    ['Bhakti Malamulan', 'BHM', 'Malamulan', '#FFFFFF', '#001F5B', 'fallen', 41, 'Malamulan Provincial Stadium', 14500],
    ['PS Purajaya', 'PSF', 'Purajaya', '#E30613', '#0057B8', 'youth', 40, 'Purajaya Provincial Stadium', 16000],
    ['Bhakti Kedingan', 'BKE', 'Kedingan', '#000000', '#FFD100', 'fan', 39, 'Kedingan Provincial Stadium', 14500],
    [
      'Ciremulan United',
      'CIN',
      'Ciremulan',
      '#6A1B9A',
      '#001F5B',
      'historic',
      38,
      'Ciremulan Provincial Stadium',
      15000,
    ],
    ['PS Cirerang', 'PSG', 'Cirerang', '#6CACE4', '#FFD100', 'fallen', 37, 'Cirerang Provincial Stadium', 14500],
    ['Jembpura United', 'JEM', 'Jembpura', '#6A1B9A', '#FFFFFF', 'historic', 37, 'Jembpura Provincial Stadium', 11000],
    ['Suradongan United', 'SUV', 'Suradongan', '#000000', '#E30613', 'historic', 36, 'Ciresari Sports Park', 15000],
    ['PS Kediwati', 'PSK', 'Kediwati', '#6A1B9A', '#FFD100', 'fan', 34, 'Surarang Stadium', 11500],
    ['Pamakalan FC', 'PAU42', 'Pamakalan', '#001F5B', '#E30613', 'selling', 32, 'Solamulan Sports Park', 11500],
    ['PS Bansari', 'PSH', 'Bansari', '#FFD100', '#001F5B', 'historic', 32, 'Banwati Arena', 9500],
  ];
  FM.D.CLUBS_IR4 = [
    ['Fajr Qomraz', 'FAH', 'Qomraz', '#6CACE4', '#00843D', 'historic', 43, 'Yazraz Sports Complex', 14500],
    ['Shahin Mashraz', 'SHD27', 'Mashraz', '#00843D', '#0057B8', 'fan', 41, 'Mashraz Takhti Stadium', 17000],
    ['Foolad Hamkan', 'FAK', 'Hamkan', '#6A1B9A', '#00843D', 'selling', 41, 'Ilamdar Stadium', 16500],
    ['Kermvin FC', 'KEF', 'Kermvin', '#FFD100', '#6CACE4', 'fan', 40, 'Azadi Kermvin Stadium', 16000],
    ['Nassaji Bandar Reybad', 'NJI', 'Bandar Reybad', '#00843D', '#FFD100', 'fallen', 39, 'Shatan Stadium', 13500],
    ['Bandar Shaman FC', 'BSA', 'Bandar Shaman', '#E30613', '#FFD100', 'youth', 38, 'Birbad Stadium', 13000],
    ['Esteghlal Semshahr', 'ESW', 'Semshahr', '#001F5B', '#6A1B9A', 'fallen', 37, 'Semshahr Takhti Stadium', 10500],
    ['Foolad Ahvabad', 'FOJ', 'Ahvabad', '#00843D', '#E30613', 'historic', 36, 'Azadi Ahvabad Stadium', 13000],
    ['Naft Tabad', 'NAT41', 'Tabad', '#0057B8', '#00843D', 'historic', 34, 'Qomdan Stadium', 13500],
    ['Mes Zantan', 'MZA', 'Zantan', '#0057B8', '#6A1B9A', 'fallen', 34, 'Zantan Takhti Stadium', 9500],
    ['Fajr Bandar Tabdar', 'FJR', 'Tabdar', '#00843D', '#6A1B9A', 'fan', 33, 'Tabdar Takhti Stadium', 9500],
    ['Bargh Rasraz', 'BGH', 'Rasraz', '#FFFFFF', '#001F5B', 'historic', 32, 'Goriz Stadium', 12500],
  ];
  FM.D.CLUBS_IT4 = [
    ['SSC Modento', 'MOM35', 'Modento', '#6A1B9A', '#6CACE4', 'fan', 43, 'Stadio Civico di Modento', 17500],
    ['Iuventa Monte Cestara', 'IUA', 'Cestara', '#6A1B9A', '#6CACE4', 'youth', 43, 'Stadio Amalello', 18500],
    ['Virtus Corento', 'COA24', 'Corento', '#6A1B9A', '#001F5B', 'historic', 42, 'Stadio Nuovo Padia', 16500],
    ['Pro Porto Fabrucci', 'PON36', 'Fabrucci', '#FFD100', '#001F5B', 'fallen', 41, 'Arena Torana', 14500],
    ['Unione Ferana', 'FEC', 'Ferana', '#FFFFFF', '#6A1B9A', 'fan', 41, 'Stadio Comunale di Ferana', 15500],
    ['Sporting Padara', 'PAV43', 'Padara', '#000000', '#6A1B9A', 'fan', 39, 'Stadio Comunale di Padara', 16000],
    ['AC Castel Maretto', 'CAV43', 'Maretto', '#6A1B9A', '#6CACE4', 'historic', 39, 'Stadio Ponate', 12000],
    ['Audace Amalino', 'AMO', 'Amalino', '#FFD100', '#6A1B9A', 'fan', 38, 'Stadio Nuovo Orvia', 13000],
    ['AC Ravale 1895', 'RAG30', 'Ravale', '#6CACE4', '#FFD100', 'selling', 38, 'Stadio Nuovo Casara', 12000],
    ['Audace Albia', 'ALC74', 'Albia', '#6A1B9A', '#001F5B', 'youth', 37, 'Arena Leccento', 14000],
    ['US Ravento 1949', 'RTO', 'Ravento', '#FFFFFF', '#001F5B', 'historic', 36, 'Stadio Arezello', 15000],
    ['Pro Arezana al Monte 1936', 'ARY', 'Arezana al Monte', '#0057B8', '#FFD100', 'fan', 36, 'Stadio Roccino', 11000],
    ['AC Porto Galago 1920', 'POP37', 'Galago', '#FFD100', '#00843D', 'fan', 35, 'Arena Frascino', 12500],
    ['US Porto Sassia', 'PSJ', 'Sassia', '#6CACE4', '#0057B8', 'selling', 35, 'Stadio Gubbara', 11000],
    ['AC Roccia 1953', 'RRO', 'Roccia', '#FFFFFF', '#0057B8', 'youth', 34, 'Stadio Ferino', 13000],
    ['Corola Calcio 1900', 'COB25', 'Corola', '#000000', '#001F5B', 'historic', 34, 'Stadio Nuovo Valento', 11500],
    [
      'Castel Trenento Calcio',
      'CTR',
      'Castel Trenento',
      '#6A1B9A',
      '#001F5B',
      'fallen',
      33,
      'Stadio Civico di Castel Trenento',
      9500,
    ],
    ['Vis Fosia', 'VIL34', 'Fosia', '#E30613', '#FFD100', 'historic', 33, 'Arena Casago', 10000],
  ];
  FM.D.CLUBS_JP4 = [
    ['Shinsakuramoto City', 'SCI', 'Shinsakuramoto', '#001F5B', '#00843D', 'historic', 43, 'Kitano Park', 16500],
    ['Kitamori Sol', 'KII', 'Kitamori', '#000000', '#6A1B9A', 'fallen', 43, 'Takayama Park', 15500],
    ['Toyura Lumina', 'TOV', 'Toyura', '#0057B8', '#6A1B9A', 'historic', 41, 'Toyura Athletic Stadium', 16500],
    ['Takahama Kingfishers', 'TKI', 'Takahama', '#000000', '#E30613', 'fan', 41, 'Asano Stadium', 14000],
    ['FC Ogakami', 'OGA', 'Ogakami', '#00843D', '#001F5B', 'selling', 40, 'Toyno Arena', 15000],
    ['Ogahama Verde', 'OMA', 'Ogahama', '#001F5B', '#00843D', 'fan', 40, 'Shinzawa Arena', 13500],
    ['Toyyama Kingfishers', 'TOW', 'Toyyama', '#0057B8', '#FFFFFF', 'fan', 39, 'Toykami Stadium', 15000],
    ['FC Ogasaki', 'OGI', 'Ogasaki', '#00843D', '#FFD100', 'selling', 38, 'Nagahama Stadium', 14500],
    ['Takamori Falcons', 'TFA', 'Takamori', '#0057B8', '#6CACE4', 'fan', 38, 'Okamoto Park', 11500],
    ['Hokuura United', 'HUN', 'Hokuura', '#FFFFFF', '#000000', 'youth', 37, 'Inagawa Park', 14500],
    ['Takemori Phoenix', 'TAZ47', 'Takemori', '#FFFFFF', '#0057B8', 'selling', 36, 'Asasaki Stadium', 13000],
    ['Takahara Nova', 'TNO', 'Takahara', '#E30613', '#0057B8', 'fallen', 35, 'Inayama Arena', 12000],
    ['Akashima Riverside', 'AKJ', 'Akashima', '#0057B8', '#6CACE4', 'youth', 34, 'Inano Park', 13000],
    ['Okazawa Phoenix', 'OKC', 'Okazawa', '#FFD100', '#6CACE4', 'fan', 33, 'Takata Stadium', 11500],
    ['Kawagawa Vortex', 'KVO', 'Kawagawa', '#0057B8', '#6CACE4', 'historic', 33, 'Minamisaki Park', 9000],
    ['Matsno Nova', 'MNO', 'Matsno', '#000000', '#001F5B', 'fallen', 33, 'Matsno Athletic Stadium', 9000],
  ];
  FM.D.CLUBS_MX4 = [
    [
      'Halcones de Chalitepec',
      'HAV43',
      'Chalitepec',
      '#FFD100',
      '#001F5B',
      'fan',
      43,
      'Estadio Olímpico de Chalitepec',
      15500,
    ],
    ['Zorros de Mixotzin', 'ZOS', 'Mixotzin', '#6CACE4', '#00843D', 'historic', 43, 'Estadio Pachitzin', 15000],
    ['Cooperativa Ocotochitlán', 'CVB', 'Ocotochitlán', '#000000', '#E30613', 'fan', 41, 'Estadio La Tulec', 14000],
    [
      'Atlético Ciudad Papanohua',
      'CIU',
      'Ciudad Papanohua',
      '#001F5B',
      '#FFD100',
      'historic',
      41,
      'Estadio Yauhua',
      13000,
    ],
    [
      'Petroleros de Pachepa',
      'PEL34',
      'Pachepa',
      '#00843D',
      '#000000',
      'fallen',
      40,
      'Estadio Municipal de Pachepa',
      14500,
    ],
    ['Club Deportivo Tampan', 'TAA48', 'Tampan', '#FFFFFF', '#001F5B', 'fallen', 39, 'Estadio Tulipan', 13500],
    ['Real Villa Tepoco', 'TCO', 'Villa Tepoco', '#E30613', '#6A1B9A', 'youth', 37, 'Estadio Tlaxelán', 11000],
    ['Huilco Atlético', 'HUI', 'Huilco', '#6A1B9A', '#FFD100', 'fan', 37, 'Estadio La Ahec', 15500],
    [
      'Santos Zapotlán',
      'SOV',
      'Zapotlán',
      '#FFFFFF',
      '#001F5B',
      'historic',
      36,
      'Estadio Municipal de Zapotlán',
      13000,
    ],
    ['Real Puerto Chalehua', 'PUO', 'Puerto Chalehua', '#6A1B9A', '#001F5B', 'fan', 35, 'Estadio Chalepan', 12000],
    [
      'Halcones de Nueva Cuaulco',
      'HNU',
      'Nueva Cuaulco',
      '#6CACE4',
      '#000000',
      'youth',
      35,
      'Estadio La Ahupan',
      11500,
    ],
    ['Deportivo Tulaco', 'TUO', 'Tulaco', '#6A1B9A', '#0057B8', 'selling', 34, 'Estadio Pachaco', 9500],
    ['Cementeros de Papanalco', 'CEM', 'Papanalco', '#00843D', '#0057B8', 'fan', 33, 'Estadio La Tepocán', 14000],
    ['Atlético Ixtahua', 'IXT', 'Ixtahua', '#6CACE4', '#E30613', 'fan', 32, 'Estadio Olímpico de Ixtahua', 8500],
  ];
  FM.D.CLUBS_NL4 = [
    ['FC Bredkerk', 'BRJ32', 'Bredkerk', '#001F5B', '#6A1B9A', 'fan', 42, 'Stadion Zwolbrug', 14500],
    ['AFC Alkwijk', 'AJK', 'Alkwijk', '#FFFFFF', '#E30613', 'fan', 42, 'Sportpark Oostdam', 16500],
    ['Sparta Leidam', 'LEE', 'Leidam', '#E30613', '#6CACE4', 'fan', 41, 'De Vlaarbrug', 14500],
    ['SC Klein Sneekveen', 'KLS', 'Sneekveen', '#E30613', '#6CACE4', 'historic', 41, 'Tilrade Stadion', 14000],
    ['Fortuna Oud Oudhoven', 'OUF', 'Oudhoven', '#FFD100', '#6A1B9A', 'historic', 41, 'De Hoogzand', 16000],
    ['DVC Dijkdijk', 'DVD', 'Dijkdijk', '#6CACE4', '#000000', 'fan', 40, 'Sportpark Bredhoven', 13000],
    ['AFC Nieuwrade', 'NDE', 'Nieuwrade', '#6A1B9A', '#000000', 'fan', 39, 'De Haarzand', 11500],
    ['AFC Dijkbeek', 'DIW', 'Dijkbeek', '#FFD100', '#6A1B9A', 'historic', 38, 'Dijkbeek Arena', 13000],
    ['Go Ahead Wagedijk', 'GOO', 'Wagedijk', '#000000', '#FFD100', 'fan', 38, 'Maaslo Stadion', 14000],
    ['SC Maaswaard', 'MRD', 'Maaswaard', '#000000', '#6CACE4', 'selling', 38, 'Sportpark Nieuwvoort', 15000],
    ['Oostkerk Boys', 'OOB', 'Oostkerk', '#00843D', '#FFD100', 'historic', 36, 'Weststad Stadion', 14500],
    ['DVC Noordhout', 'DVN', 'Noordhout', '#6CACE4', '#0057B8', 'selling', 36, 'Sportpark Berghoven', 14000],
    ['Racing Dijkerk', 'DIX', 'Dijkerk', '#000000', '#FFFFFF', 'fan', 36, 'Stadion Sneekhoven', 11000],
    ['Fortuna Oudkerk', 'OUK', 'Oudkerk', '#000000', '#E30613', 'selling', 34, 'Stadion Nieuwhorst', 12500],
    ['SC Bergzand', 'BNC', 'Bergzand', '#0057B8', '#FFFFFF', 'fan', 34, 'Stadion Maasvoort', 13000],
    ['Sneekbeek Boys', 'SNK', 'Sneekbeek', '#00843D', '#FFFFFF', 'youth', 33, 'Bredrade Stadion', 9000],
    ['Concordia Oudbeek', 'COC26', 'Oudbeek', '#E30613', '#000000', 'fan', 33, 'Sportpark Hoornwijk', 13500],
    ['Victoria Groot Vlaarhorst', 'GRY', 'Vlaarhorst', '#6CACE4', '#001F5B', 'fallen', 33, 'Veenveen Stadion', 11500],
  ];
  FM.D.CLUBS_NO4 = [
    ['Freborg BK', 'FRV', 'Freborg', '#00843D', '#0057B8', 'youth', 43, 'Dalby Idrætspark', 18000],
    ['Fremad Askløkke', 'ASR', 'Askløkke', '#E30613', '#FFD100', 'selling', 43, 'Askløkke Idrætsanlæg', 18000],
    ['FC Bjørnvang', 'BJG', 'Bjørnvang', '#E30613', '#6A1B9A', 'youth', 42, 'Bjørnvang Arena', 15000],
    ['FC Nordøstrud', 'NUH', 'Nordøstrud', '#001F5B', '#FFD100', 'fan', 40, 'Nesvik Park', 14000],
    ['Nyø IF', 'NYY', 'Nyø', '#001F5B', '#6A1B9A', 'selling', 40, 'Sydstrup Park', 12000],
    ['Strandvang FK', 'STE28', 'Strandvang', '#00843D', '#E30613', 'historic', 39, 'Askdal Stadion', 13500],
    ['BK Skovholm', 'SKB', 'Skovholm', '#00843D', '#FFD100', 'fan', 39, 'Nesløkke Park', 14000],
    ['Nordlund FK', 'NNB', 'Nordlund', '#000000', '#FFD100', 'fan', 37, 'Fjordstad Stadion', 14000],
    ['Bergstrup IL', 'BES40', 'Bergstrup', '#FFD100', '#FFFFFF', 'fan', 36, 'Gammelstad Park', 11500],
    ['Ringvang Fotball', 'RIR', 'Ringvang', '#FFFFFF', '#6CACE4', 'historic', 36, 'Stornæs Stadion', 10500],
    ['BK Gammelø', 'GAH', 'Gammelø', '#6CACE4', '#E30613', 'selling', 34, 'Gammelø Idrætsanlæg', 9500],
    ['BK Hedvang', 'HEW', 'Hedvang', '#6CACE4', '#FFD100', 'selling', 33, 'Skovborg Park', 13000],
    ['Strandal FK', 'STF29', 'Strandal', '#FFFFFF', '#0057B8', 'fan', 33, 'Dyrfors Park', 12500],
    ['FC Nydal', 'NYD', 'Nydal', '#000000', '#6CACE4', 'historic', 32, 'Nydal Arena', 10500],
  ];
  FM.D.CLUBS_PL4 = [
    ['MKS Rybnówka', 'RYG', 'Rybnówka', '#00843D', '#000000', 'historic', 43, 'Stadion Miejski im. Gorzów', 14000],
    ['Stal Brodnin', 'BBR', 'Brodnin', '#0057B8', '#E30613', 'historic', 43, 'Stadion Ludowy Brodnin', 15500],
    ['Nowówka Sokół', 'NOJ32', 'Nowówka', '#001F5B', '#0057B8', 'historic', 43, 'Arena Jarosoka', 15000],
    ['Zagłębie Brodno', 'ZAA24', 'Brodno', '#001F5B', '#000000', 'youth', 43, 'Stadion Ludowy Brodno', 13500],
    ['Tarnoka FC', 'TAF53', 'Tarnoka', '#00843D', '#0057B8', 'fan', 43, 'Arena Chełmowice', 17000],
    ['GKS Tarnowice', 'TAG54', 'Tarnowice', '#FFFFFF', '#6CACE4', 'fan', 43, 'Arena Radowice', 17000],
    ['Stal Rybnec', 'RYH', 'Rybnec', '#E30613', '#6A1B9A', 'fan', 43, 'Stadion Ludowy Rybnec', 18500],
    ['Włókniarz Dąbrec', 'WOZ', 'Dąbrec', '#6CACE4', '#000000', 'historic', 42, 'Stadion Miejski im. Czareka', 17500],
    ['Górnik Radono', 'GIC', 'Radono', '#E30613', '#6A1B9A', 'fan', 42, 'Stadion Czarówka', 16500],
    [
      'Stal Wielki Dąbrowice',
      'WKI',
      'Wielki Dąbrowice',
      '#001F5B',
      '#6A1B9A',
      'historic',
      42,
      'Stadion im. Włowice',
      16500,
    ],
    ['MKS Lubowice', 'LUW', 'Lubowice', '#6CACE4', '#E30613', 'historic', 42, 'Stadion Kalów', 16500],
    ['Czarowice FC', 'CZB', 'Czarowice', '#6CACE4', '#00843D', 'fan', 41, 'Stadion Włosk', 16500],
    ['Znicz Płocesk', 'POX45', 'Płocesk', '#E30613', '#FFD100', 'selling', 41, 'Stadion im. Siedleka', 15000],
    ['Budowlani Jaroseka', 'BUJ32', 'Jaroseka', '#FFD100', '#00843D', 'fan', 41, 'Stadion Jarosice', 14000],
    ['MKS Płoców', 'POY46', 'Płoców', '#001F5B', '#6CACE4', 'selling', 41, 'Stadion im. Chełmów', 16500],
    ['Białoka Sokół', 'BID', 'Białoka', '#FFD100', '#FFFFFF', 'historic', 40, 'Stadion Gorzów', 16500],
    ['MKS Nowosk', 'NOD27', 'Nowosk', '#6CACE4', '#FFD100', 'historic', 40, 'Stadion im. Zamice', 16000],
    ['Górnik Chełmów', 'GIK', 'Chełmów', '#6A1B9A', '#FFD100', 'historic', 40, 'Stadion Gniice', 14500],
    ['Zagłębie Mławec', 'ZAT', 'Mławec', '#00843D', '#6A1B9A', 'youth', 40, 'Stadion Gniów', 14500],
    ['Stal Białówka', 'BKB', 'Białówka', '#6A1B9A', '#00843D', 'fan', 40, 'Stadion im. Płocesk', 13500],
    ['KS Lubec', 'LUV', 'Lubec', '#E30613', '#FFD100', 'fan', 40, 'Stadion Miejski im. Ostrewo', 14000],
    ['Stal Rada', 'RAP37', 'Rada', '#FFD100', '#6CACE4', 'fan', 39, 'Stadion im. Słupice', 16000],
    ['Górnik Białów', 'GOM', 'Białów', '#0057B8', '#001F5B', 'fan', 39, 'Stadion Miejski im. Dąbrów', 13000],
    ['Kostów FC', 'KOB25', 'Kostów', '#FFD100', '#0057B8', 'fan', 39, 'Stadion Miejski im. Dąbrówka', 13000],
    ['Unia Piłów', 'PIQ', 'Piłów', '#0057B8', '#000000', 'historic', 39, 'Stadion Słupice', 15500],
    ['Unia Piłin', 'PIS', 'Piłin', '#FFFFFF', '#E30613', 'fallen', 39, 'Stadion Miejski im. Siedlec', 15500],
    ['Budowlani Stary Włec', 'BUL34', 'Stary Włec', '#FFD100', '#00843D', 'selling', 39, 'Arena Gorzice', 14000],
    ['Kalesk FC', 'KAZ47', 'Kalesk', '#FFD100', '#6CACE4', 'historic', 39, 'Stadion Rybnów', 13500],
    ['GKS Rybna', 'RNA', 'Rybna', '#E30613', '#001F5B', 'historic', 38, 'Stadion Ludowy Rybna', 15000],
    ['Górnik Chełma', 'GOF', 'Chełma', '#001F5B', '#FFD100', 'fan', 38, 'Stadion Ludowy Chełma', 15500],
    ['Czareno Sokół', 'CZO', 'Czareno', '#FFFFFF', '#0057B8', 'historic', 38, 'Stadion im. Włów', 13500],
    ['Gwardia Kalewo', 'GID', 'Kalewo', '#FFFFFF', '#00843D', 'fallen', 38, 'Arena Czarów', 14000],
    ['MKS Jarosoka', 'JKA', 'Jarosoka', '#00843D', '#6A1B9A', 'historic', 37, 'Stadion im. Słupa', 14500],
    [
      'Budowlani Mławewo',
      'BUC26',
      'Mławewo',
      '#00843D',
      '#E30613',
      'historic',
      37,
      'Stadion Miejski im. Brzezec',
      14000,
    ],
    ['Budowlani Włoka', 'BUH31', 'Włoka', '#001F5B', '#0057B8', 'youth', 37, 'Stadion Dąbrice', 11000],
    ['Włókniarz Słuposk', 'WOP', 'Słuposk', '#E30613', '#FFD100', 'fan', 37, 'Stadion im. Radin', 12000],
    ['Polonia Opolewo', 'OPO', 'Opolewo', '#00843D', '#001F5B', 'selling', 37, 'Stadion im. Brzezowice', 14500],
    ['Włókniarz Włów', 'WRA', 'Włów', '#FFD100', '#001F5B', 'fan', 37, 'Stadion im. Płocono', 14500],
    ['KS Czarów', 'CZW', 'Czarów', '#E30613', '#00843D', 'fallen', 37, 'Stadion Tarnewo', 15000],
    ['Włókniarz Gorza', 'WOQ', 'Gorza', '#FFD100', '#FFFFFF', 'fan', 37, 'Stadion Miejski im. Ostrowice', 11000],
    [
      'Gwardia Nowy Białice',
      'GWD',
      'Nowy Białice',
      '#00843D',
      '#6A1B9A',
      'historic',
      37,
      'Stadion Miejski im. Rybna',
      12000,
    ],
    ['Ruch Ostrice', 'OSG', 'Ostrice', '#FFD100', '#0057B8', 'fallen', 36, 'Stadion Ludowy Ostrice', 12000],
    ['Budowlani Czarec', 'BNH', 'Czarec', '#FFD100', '#000000', 'fallen', 36, 'Arena Piłowice', 14500],
    [
      'Wielki Mławowice FC',
      'WII',
      'Wielki Mławowice',
      '#001F5B',
      '#00843D',
      'fan',
      36,
      'Stadion Miejski im. Siedlin',
      12000,
    ],
    ['Włosk Sokół', 'WOS', 'Włosk', '#FFD100', '#6CACE4', 'fan', 36, 'Arena Białin', 11500],
    ['Budowlani Nowy Radono', 'BNO', 'Nowy Radono', '#FFD100', '#6A1B9A', 'fan', 35, 'Stadion im. Lubec', 14500],
    ['Znicz Kostec', 'KOT', 'Kostec', '#FFFFFF', '#6A1B9A', 'youth', 35, 'Stadion Miejski im. Siedlewo', 14000],
    [
      'Budowlani Dąbrosk',
      'BUG30',
      'Dąbrosk',
      '#E30613',
      '#6A1B9A',
      'selling',
      35,
      'Stadion Miejski im. Siedloka',
      10000,
    ],
    ['Ruch Zamice', 'ZAY', 'Zamice', '#00843D', '#001F5B', 'fan', 35, 'Stadion Tarnec', 11000],
    ['Górnik Mławosk', 'GOJ', 'Mławosk', '#6A1B9A', '#000000', 'fallen', 35, 'Stadion im. Słupoka', 11500],
    ['Ruch Włowice', 'WOW', 'Włowice', '#E30613', '#000000', 'fan', 35, 'Stadion Radów', 12000],
    ['Włókniarz Opolec', 'WRZ', 'Opolec', '#000000', '#001F5B', 'fan', 34, 'Stadion im. Nowosk', 10500],
    ['Znicz Siedlec', 'SIG30', 'Siedlec', '#6A1B9A', '#FFFFFF', 'fallen', 34, 'Stadion Miejski im. Piłin', 12500],
    ['Znicz Ostrowice', 'OSQ', 'Ostrowice', '#FFD100', '#6A1B9A', 'fan', 34, 'Arena Lubów', 10500],
    ['GKS Jarosewo', 'JAK', 'Jarosewo', '#FFFFFF', '#001F5B', 'historic', 34, 'Stadion Ludowy Jarosewo', 12500],
    ['Ruch Ostrono', 'OSV', 'Ostrono', '#001F5B', '#000000', 'fan', 34, 'Stadion im. Czareno', 13500],
    [
      'Polonia Dolny Białosk',
      'DOF29',
      'Dolny Białosk',
      '#0057B8',
      '#6CACE4',
      'fallen',
      34,
      'Stadion Ludowy Dolny Białosk',
      9500,
    ],
    ['Włókniarz Tarnec', 'WOT', 'Tarnec', '#FFFFFF', '#6CACE4', 'historic', 34, 'Stadion im. Mławowice', 14000],
    ['Włókniarz Tarneka', 'WTA', 'Tarneka', '#FFD100', '#001F5B', 'selling', 34, 'Stadion im. Tarnówka', 13000],
    ['MKS Brodna', 'BNF', 'Brodna', '#FFD100', '#000000', 'fallen', 33, 'Stadion Słupewo', 10500],
    ['MKS Tarna', 'TNA', 'Tarna', '#00843D', '#6CACE4', 'fan', 33, 'Stadion Białowice', 12000],
    ['KS Ostrówka', 'OSP', 'Ostrówka', '#FFD100', '#6CACE4', 'historic', 33, 'Stadion Kalosk', 11500],
    ['KS Siedlów', 'SIH31', 'Siedlów', '#6CACE4', '#FFD100', 'fan', 33, 'Arena Gorzów', 12500],
    ['Włókniarz Gorzin', 'WON', 'Gorzin', '#6CACE4', '#E30613', 'historic', 33, 'Arena Dąbresk', 11000],
    ['KS Lubin', 'LUU', 'Lubin', '#000000', '#FFD100', 'fallen', 33, 'Arena Dąbrice', 9000],
    ['Ruch Kostice', 'KOA24', 'Kostice', '#6A1B9A', '#000000', 'youth', 33, 'Stadion Miejski im. Tarno', 10500],
    ['Białec FC', 'BIG', 'Białec', '#000000', '#00843D', 'historic', 33, 'Stadion Ludowy Białec', 11000],
    ['Ostreno FC', 'ONF', 'Ostreno', '#000000', '#001F5B', 'historic', 33, 'Stadion Ludowy Ostreno', 12000],
    ['Budowlani Kalosk', 'BUK33', 'Kalosk', '#FFD100', '#00843D', 'fan', 33, 'Stadion Lubów', 13000],
    ['Włókniarz Piłewo', 'WOU', 'Piłewo', '#E30613', '#FFD100', 'historic', 33, 'Stadion Ludowy Piłewo', 11000],
    ['Gorzowice FC', 'GOG', 'Gorzowice', '#FFFFFF', '#6CACE4', 'historic', 32, 'Stadion Ludowy Gorzowice', 10500],
    ['MKS Tarnice', 'TAE52', 'Tarnice', '#001F5B', '#000000', 'historic', 32, 'Stadion im. Lubówka', 11500],
  ];
  FM.D.CLUBS_PT4 = [
    [
      'Sporting Tavirela do Vale',
      'TLA',
      'Tavirela do Vale',
      '#000000',
      '#FFD100',
      'historic',
      43,
      'Estádio Alcobouro',
      14500,
    ],
    ['SC Ferrais', 'FES', 'Ferrais', '#00843D', '#0057B8', 'historic', 42, 'Complexo Desportivo Ferrais', 17000],
    ['Santa Mirinha FC', 'MHA', 'Mirinha', '#6CACE4', '#FFD100', 'youth', 41, 'Estádio Gaiinha', 14500],
    ['Racing Nazarão', 'NAU42', 'Nazarão', '#6A1B9A', '#001F5B', 'historic', 40, 'Estádio Paiveiro', 16000],
    ['Atlético Vila Vilais', 'VIM35', 'Vilais', '#000000', '#6CACE4', 'historic', 40, 'Estádio Ovarinha', 14000],
    ['União Vendouro', 'VRO', 'Vendouro', '#E30613', '#FFD100', 'historic', 39, 'Complexo Desportivo Vendouro', 13500],
    ['Atlético Moncorada', 'MDA', 'Moncorada', '#6CACE4', '#001F5B', 'fan', 37, 'Arena Ferrinha', 12000],
    ['GD Matosães', 'GGA', 'Matosães', '#00843D', '#6A1B9A', 'fallen', 37, 'Estádio Municipal de Matosães', 11000],
    ['Desportivo Moncorela', 'DED', 'Moncorela', '#FFD100', '#FFFFFF', 'selling', 36, 'Estádio Penela', 12000],
    ['Associação Elva', 'ELG', 'Elva', '#E30613', '#6CACE4', 'historic', 35, 'Estádio Alentela', 14500],
    ['Sporting São de Figura', 'SAE52', 'São de Figura', '#0057B8', '#FFD100', 'fan', 34, 'Estádio Estrada', 11500],
    ['Esporte Clube Braganura', 'BRK33', 'Braganura', '#0057B8', '#6A1B9A', 'fallen', 34, 'Arena Leirouro', 10000],
    ['Santa Castares EC', 'CEH', 'Castares', '#6CACE4', '#6A1B9A', 'fan', 32, 'Estádio Aveiro', 10000],
    ['Sporting Moncorão', 'MON36', 'Moncorão', '#FFD100', '#E30613', 'fan', 31, 'Arena Lamela', 11000],
  ];
  FM.D.CLUBS_RO4 = [
    ['Rapid Buzești', 'RAH31', 'Buzești', '#E30613', '#FFFFFF', 'historic', 43, 'Complexul Sportiv Buzești', 18000],
    ['Electroputere Craău', 'ELH', 'Craău', '#6A1B9A', '#FFD100', 'selling', 42, 'Complexul Sportiv Craău', 16000],
    ['AFC Tulești', 'TUI', 'Tulești', '#E30613', '#001F5B', 'fan', 41, 'Arena Mangiu', 13000],
    ['Progresul Petău', 'PPE', 'Petău', '#00843D', '#6A1B9A', 'fan', 41, 'Complexul Sportiv Petău', 16500],
    ['Olimpia Zalița', 'OIA', 'Zalița', '#00843D', '#0057B8', 'fan', 40, 'Arena Petana', 16000],
    ['Victoria Drova', 'DRO', 'Drova', '#00843D', '#6CACE4', 'youth', 38, 'Stadionul Drești', 13000],
    ['Gloria Focova', 'GIB', 'Focova', '#FFFFFF', '#6A1B9A', 'fan', 38, 'Stadionul Ploana', 16000],
    [
      'Sportul Nou Galana',
      'SPM35',
      'Nou Galana',
      '#00843D',
      '#0057B8',
      'fan',
      37,
      'Stadionul Orășenesc Nou Galana',
      11000,
    ],
    ['Progresul Satița', 'PRW', 'Satița', '#FFD100', '#000000', 'historic', 37, 'Stadionul Buzova', 11000],
    ['AFC Albova', 'ALD75', 'Albova', '#6CACE4', '#00843D', 'fan', 36, 'Arena Ploana', 11500],
    ['ACS Ploești', 'ACP', 'Ploești', '#0057B8', '#00843D', 'fan', 34, 'Arena Conova', 11000],
    ['CS Mare Fagești', 'CCS', 'Mare Fagești', '#FFFFFF', '#FFD100', 'fan', 33, 'Stadionul Slatiu', 12500],
    ['Electroputere Galova', 'ELJ', 'Galova', '#6CACE4', '#001F5B', 'youth', 33, 'Stadionul Orășenesc Galova', 10500],
    ['FC Petești', 'PTI', 'Petești', '#FFD100', '#6CACE4', 'historic', 32, 'Complexul Sportiv Petești', 11500],
  ];
  FM.D.CLUBS_RU4 = [
    [
      'FK Vladino-na-Ladge',
      'VLO',
      'Vladino-na-Ladge',
      '#E30613',
      '#FFD100',
      'historic',
      43,
      'Tsentralny Stadion Vladino-na-Ladge',
      17000,
    ],
    ['Trud Perbor', 'TUE', 'Perbor', '#00843D', '#001F5B', 'fan', 42, 'Stadion Dinamo Perbor', 14000],
    ['Torpedo Kemgorsk', 'TKE', 'Kemgorsk', '#00843D', '#6A1B9A', 'youth', 41, 'Stadion Dinamo Kemgorsk', 17000],
    ['FK Tverka', 'TVE', 'Tverka', '#00843D', '#6A1B9A', 'fallen', 39, 'Tsentralny Stadion Tverka', 14000],
    ['FC Podgorsk', 'POQ38', 'Podgorsk', '#E30613', '#001F5B', 'fan', 39, 'Stadion Khabov', 16000],
    [
      'Avangard Verkhne-Peskgorsk',
      'AVF',
      'Peskgorsk',
      '#000000',
      '#6A1B9A',
      'fallen',
      37,
      'Stadion Dinamo Peskgorsk',
      11000,
    ],
    ['FC Pergrad', 'PEM35', 'Pergrad', '#E30613', '#001F5B', 'fallen', 37, 'Kursgorsk Arena', 12500],
    ['Zvezda Lugka', 'ZVA', 'Lugka', '#0057B8', '#001F5B', 'fan', 36, 'Stadion Dinamo Lugka', 13000],
    ['Ural Novo-Yelino', 'URL', 'Yelino', '#FFFFFF', '#0057B8', 'fan', 35, 'Stadion imeni Murinsk', 13500],
    ['Trud Chelovo', 'TRM', 'Chelovo', '#000000', '#00843D', 'historic', 34, 'Dmitov Arena', 11000],
    ['Verkhne-Podovsk FK', 'VEC26', 'Podovsk', '#001F5B', '#0057B8', 'fallen', 33, 'Stadion imeni Arzka', 13000],
    [
      'Lokomotiv Srednekursovo',
      'LIC26',
      'Srednekursovo',
      '#FFD100',
      '#6CACE4',
      'fan',
      33,
      'Stadion imeni Vladsk',
      12000,
    ],
  ];
  FM.D.CLUBS_SA4 = [
    ['Shabab Ain Dahah', 'SHE28', 'Dahah', '#6CACE4', '#E30613', 'fan', 44, 'Zariyah Stadium', 14000],
    ['Kerya SC', 'KEE', 'Kerya', '#FFD100', '#FFFFFF', 'fan', 42, 'Falan Stadium', 15000],
    ['Shabab Ain Bahiq', 'SHF29', 'Ain Bahiq', '#00843D', '#FFFFFF', 'selling', 41, 'Karya Stadium', 14500],
    ['Al Irbra SC', 'AIR', 'Irbra', '#FFFFFF', '#E30613', 'fallen', 40, 'Jahan Arena', 12500],
    ['Al Kerayn', 'ALE76', 'Kerayn', '#FFFFFF', '#FFD100', 'fallen', 38, 'Kerayn Sports City', 14500],
    ['Shabab Khasah', 'SHG30', 'Khasah', '#001F5B', '#FFD100', 'historic', 37, 'Kariyah Stadium', 11500],
    ['Wadi Liwayn SC', 'WAS', 'Liwayn', '#00843D', '#000000', 'fan', 35, 'Dhiyah Stadium', 14500],
    ['Al Ajlayn SC', 'AAJ', 'Ajlayn', '#FFD100', '#E30613', 'historic', 34, 'Muhar Arena', 13500],
    ['Muhan SC', 'MSC', 'Muhan', '#6A1B9A', '#00843D', 'fan', 34, 'Prince Mafiyah Stadium', 12500],
    ['Al Liwiq SC', 'ALF77', 'Liwiq', '#001F5B', '#0057B8', 'selling', 32, 'Rusib Arena', 10000],
  ];
  FM.D.CLUBS_SC4 = [
    ['Mid Moffton Wanderers', 'MIX', 'Mid Moffton', '#6A1B9A', '#E30613', 'fan', 43, 'Mid Moffton Park', 16000],
    ['Kirkwick Town', 'KCK', 'Kirkwick', '#0057B8', '#FFFFFF', 'fan', 41, 'Kirkwick Muir', 12500],
    ['Kirkrie Burgh', 'KIB25', 'Kirkrie', '#6CACE4', '#E30613', 'fan', 40, 'Kirkrie Gardens', 12500],
    ['Aberness City', 'ABS', 'Aberness', '#001F5B', '#00843D', 'selling', 40, 'Kirkock Park', 12500],
    ['Wester Galmore Vale', 'WER', 'Galmore', '#6CACE4', '#E30613', 'fallen', 38, 'Inneston Green', 16000],
    ['Upper Jedside City', 'JDE', 'Upper Jedside', '#000000', '#6CACE4', 'youth', 37, 'Monton Road', 14500],
    ['Mid Balbridge Rovers', 'MIZ', 'Mid Balbridge', '#6CACE4', '#00843D', 'selling', 36, 'Torryrie Road', 12500],
    ['Nairnbridge Burgh', 'NAV43', 'Nairnbridge', '#00843D', '#FFD100', 'youth', 35, 'Nairnbridge Park', 14500],
    ['Calton Burgh', 'CAW44', 'Calton', '#000000', '#6A1B9A', 'historic', 33, 'Calton Gardens', 13000],
    ['Kelmore Albion', 'KEG', 'Kelmore', '#0057B8', '#FFFFFF', 'fan', 32, 'Dunshiels Road', 11000],
  ];
  FM.D.CLUBS_ZA4 = [
    ['Phalula Swallows', 'PHS', 'Phalula', '#E30613', '#6CACE4', 'historic', 43, 'Ladeberg Park', 17500],
    ['Upper Ladestad City', 'LAN36', 'Ladestad', '#000000', '#00843D', 'fan', 42, 'Ladestad Oval', 15000],
    ['Lower Volvlei North End', 'VOI', 'Volvlei', '#6CACE4', '#001F5B', 'fan', 41, 'Kwavlei Stadium', 16500],
    ['Phalrus Celtic Rovers', 'PUS', 'Phalrus', '#6A1B9A', '#FFD100', 'fan', 40, 'Phaldoorn Stadium', 14000],
    ['Nelsburg FC', 'NRG', 'Nelsburg', '#FFFFFF', '#00843D', 'youth', 39, 'Nelsburg Oval', 15500],
    ['Lower Krukop Corinthians', 'KRR', 'Krukop', '#00843D', '#FFD100', 'fan', 39, 'Phalfontein Stadium', 16000],
    ['Randrus Vale', 'RVA', 'Randrus', '#00843D', '#FFFFFF', 'fallen', 39, 'Siboston Park', 15500],
    ['Old Bettdal FC', 'BET41', 'Bettdal', '#000000', '#E30613', 'historic', 37, 'Vredevlei Stadium', 15000],
    ['Phalberg Corinthians', 'PHG', 'Phalberg', '#E30613', '#FFD100', 'fan', 36, 'Kwakop Stadium', 10000],
    ['Kruvlei Bohemians', 'KRI', 'Kruvlei', '#00843D', '#FFFFFF', 'historic', 35, 'Kruvlei Oval', 14500],
    ['New Randula Olympic', 'RAJ32', 'Randula', '#6A1B9A', '#000000', 'selling', 35, 'Randula Sports Complex', 13500],
    ['Vredekop Swallows', 'VRP', 'Vredekop', '#001F5B', '#00843D', 'fan', 34, 'Vredekop Oval', 11000],
    ['Sibokop City', 'SID27', 'Sibokop', '#00843D', '#6CACE4', 'historic', 33, 'Phalston Stadium', 11000],
    ['Vredeburg Swallows', 'VRS', 'Vredeburg', '#0057B8', '#FFFFFF', 'selling', 32, 'Vredeburg Oval', 13500],
  ];
  FM.D.CLUBS_KR4 = [
    ['Chungdong United', 'CNG', 'Chungdong', '#6CACE4', '#0057B8', 'historic', 43, 'Chungdong Stadium', 15000],
    ['Banhwa Silk Dragons', 'BWA', 'Banhwa', '#FFFFFF', '#6CACE4', 'fallen', 42, 'Banhwa Civic Stadium', 17000],
    ['FC Chunjin', 'CHR39', 'Chunjin', '#E30613', '#00843D', 'fan', 41, 'Chunjin Civic Stadium', 13000],
    ['Chungwon Steel Mariners', 'CSA', 'Chungwon', '#001F5B', '#FFFFFF', 'youth', 40, 'Chungwon Civic Stadium', 13500],
    ['Bojeong Steel Mariners', 'BOF29', 'Bojeong', '#00843D', '#6CACE4', 'fan', 40, 'Bojeong Civic Stadium', 15500],
    ['Gimjin Dolphins', 'GIN', 'Gimjin', '#FFD100', '#E30613', 'fan', 39, 'Gimjin Stadium', 15500],
    ['Chungseong FC', 'CHS40', 'Chungseong', '#FFFFFF', '#0057B8', 'fan', 39, 'Chungseong Civic Stadium', 14500],
    ['Haecheon United', 'HAW44', 'Haecheon', '#FFD100', '#6CACE4', 'fan', 38, 'Haecheon Civic Stadium', 13000],
    [
      'Pyeongjeong Heavy Eagles',
      'PYG',
      'Pyeongjeong',
      '#6CACE4',
      '#E30613',
      'fan',
      37,
      'Chocheon Sports Complex',
      13000,
    ],
    ['Chundong Tigers', 'CTI', 'Chundong', '#000000', '#E30613', 'fan', 37, 'Chundong Civic Stadium', 11500],
    ['Daeyang Motors FC', 'DAB25', 'Daeyang', '#00843D', '#0057B8', 'fan', 35, 'Haesan Sports Complex', 12000],
    [
      'Wolcheon Chemical Dolphins',
      'WOM',
      'Wolcheon',
      '#6CACE4',
      '#FFD100',
      'fallen',
      35,
      'Wolcheon Civic Stadium',
      11500,
    ],
    ['Bugu United', 'BUD27', 'Bugu', '#FFFFFF', '#000000', 'fan', 34, 'Buju Arena', 12000],
    [
      'Boseong Copper Phoenix',
      'BOG30',
      'Boseong',
      '#00843D',
      '#6A1B9A',
      'historic',
      34,
      'Chunseong Sports Complex',
      9500,
    ],
    ['Banseong FC', 'BAE52', 'Banseong', '#FFFFFF', '#6A1B9A', 'fan', 32, 'Banseong Stadium', 11500],
    ['Haewon FC', 'HAX45', 'Haewon', '#6A1B9A', '#6CACE4', 'fan', 32, 'Gangsan Arena', 11000],
  ];
  FM.D.CLUBS_ES4 = [
    ['Racing Zamena', 'ZAU', 'Zamena', '#0057B8', '#E30613', 'historic', 41, 'Estadio Medana', 14500],
    ['Atlético Tarifedo', 'TAB49', 'Tarifedo', '#0057B8', '#6CACE4', 'fan', 41, 'Estadio La Albedo', 13000],
    ['SD Robleda', 'SDR', 'Robleda', '#FFD100', '#001F5B', 'fallen', 41, 'Estadio Liorino', 13000],
    ['CD Santa Torrero', 'TOC26', 'Torrero', '#E30613', '#0057B8', 'fan', 41, 'Ciudad Deportiva Torrero', 14500],
    ['Atlético Benilla', 'BEU42', 'Benilla', '#FFFFFF', '#6CACE4', 'selling', 40, 'Ciudad Deportiva Benilla', 14000],
    ['Lerma Sporting Club', 'LEH', 'Lerma', '#000000', '#0057B8', 'fallen', 40, 'Estadio Benino', 16500],
    ['CD Cabrar', 'CAE52', 'Cabrar', '#000000', '#FFD100', 'selling', 40, 'Estadio Liorilla', 12000],
    ['Bailanes CF', 'BCF', 'Bailanes', '#E30613', '#000000', 'fan', 39, 'Ciudad Deportiva Bailanes', 16000],
    ['Atlético Cordar', 'COD27', 'Cordar', '#6A1B9A', '#FFFFFF', 'fallen', 39, 'Nuevo Estadio Cordar', 15500],
    ['Estudiantes de Ganda', 'GAS', 'Ganda', '#FFFFFF', '#00843D', 'historic', 39, 'Estadio Valdemares', 14000],
    ['Real Club Nueva Valdana', 'NUN', 'Valdana', '#E30613', '#6A1B9A', 'fallen', 39, 'Estadio Fragejo', 15000],
    ['Unión Gandador', 'GAU', 'Gandador', '#00843D', '#FFD100', 'fan', 39, 'Estadio Guadosa', 12000],
    ['Atlético Sepúlvera', 'SEJ32', 'Sepúlvera', '#00843D', '#001F5B', 'fallen', 39, 'Campo de Sepúlvera', 15500],
    ['Atlético Cerro Paloma', 'CEN', 'Cerro Paloma', '#00843D', '#000000', 'historic', 39, 'Estadio Villana', 12500],
    ['Real Club Escalilla', 'ESY', 'Escalilla', '#00843D', '#FFFFFF', 'historic', 39, 'Estadio Pedilla', 14000],
    ['Navino CF', 'NAB49', 'Navino', '#6A1B9A', '#0057B8', 'fallen', 39, 'Estadio Roblete', 11500],
    ['Deportivo Alto Elchino', 'AEB', 'Elchino', '#E30613', '#000000', 'fan', 39, 'Campo de Elchino', 12500],
    ['Racing Santa Cuenino', 'CUG', 'Cuenino', '#00843D', '#6A1B9A', 'fan', 39, 'Estadio La Cabrilla', 12000],
    ['Club Nueva Piedejo', 'NUL', 'Piedejo', '#0057B8', '#6A1B9A', 'fallen', 38, 'Campo de Piedejo', 13500],
    ['Unión Bailosa', 'BAN60', 'Bailosa', '#6CACE4', '#FFFFFF', 'youth', 38, 'Estadio La Nerjejo', 14000],
    ['Sporting Calatero', 'CAC50', 'Calatero', '#0057B8', '#00843D', 'selling', 38, 'Estadio La Palomeda', 11500],
    ['Atlético Fuentosa', 'FUU', 'Fuentosa', '#6A1B9A', '#001F5B', 'historic', 38, 'Estadio Gandeda', 14000],
    ['Atlético Orihino', 'ORL', 'Orihino', '#0057B8', '#00843D', 'fallen', 38, 'Ciudad Deportiva Orihino', 14500],
    [
      'Aranjete Balompié',
      'ARF29',
      'Aranjete',
      '#6CACE4',
      '#000000',
      'historic',
      38,
      'Ciudad Deportiva Aranjete',
      14000,
    ],
    ['Unión Almazedo', 'ALU90', 'Almazedo', '#000000', '#0057B8', 'fan', 38, 'Estadio La Valiel', 14000],
    ['Unión Olmana', 'OLW', 'Olmana', '#FFFFFF', '#001F5B', 'selling', 38, 'Estadio Liorador', 16000],
    [
      'Atlético El Lucosa',
      'ELT',
      'El Lucosa',
      '#001F5B',
      '#6A1B9A',
      'fan',
      38,
      'Estadio Municipal de El Lucosa',
      13000,
    ],
    ['Atlético Úbedete', 'UBD', 'Úbedete', '#001F5B', '#FFFFFF', 'youth', 37, 'Nuevo Estadio Úbedete', 12500],
    ['Racing Gandena', 'GAJ', 'Gandena', '#00843D', '#6A1B9A', 'youth', 37, 'Estadio La Arroeda', 11500],
    [
      'Santa de Ribeda Balompié',
      'RIC',
      'Santa de Ribeda',
      '#0057B8',
      '#000000',
      'fan',
      37,
      'Ciudad Deportiva Santa de Ribeda',
      11500,
    ],
    [
      'Real Osunal del Valle',
      'OSM',
      'Osunal del Valle',
      '#000000',
      '#6CACE4',
      'historic',
      37,
      'Nuevo Estadio Osunal del Valle',
      14000,
    ],
    ['Deportivo Cabrino', 'CAD51', 'Cabrino', '#0057B8', '#001F5B', 'fallen', 37, 'Estadio La Calpar', 15500],
    ['Atlético Yestete', 'YEG', 'Yestete', '#000000', '#0057B8', 'youth', 37, 'Estadio Municipal de Yestete', 11000],
    ['Real Club Villa Cervena', 'CEP', 'Cervena', '#0057B8', '#FFD100', 'historic', 37, 'Estadio Úbedana', 15000],
    [
      'San Yestar Atlético',
      'YER',
      'San Yestar',
      '#001F5B',
      '#0057B8',
      'selling',
      37,
      'Estadio Municipal de San Yestar',
      14500,
    ],
    ['Unión San Hinojejo', 'HIO', 'San Hinojejo', '#001F5B', '#000000', 'historic', 37, 'Estadio Almazar', 12500],
    ['Unión Hinojador', 'HOG30', 'Hinojador', '#E30613', '#0057B8', 'historic', 37, 'Estadio Elchino', 13000],
    ['Santa Hinojar CF', 'HIJ', 'Hinojar', '#FFD100', '#E30613', 'historic', 36, 'Estadio La Corvara', 13500],
    ['UD Fresnena', 'FFR', 'Fresnena', '#FFD100', '#0057B8', 'fan', 36, 'Nuevo Estadio Fresnena', 14000],
    ['Navero Sporting Club', 'NAA48', 'Navero', '#00843D', '#000000', 'historic', 36, 'Campo de Navero', 15000],
    [
      'Monte Fresnara Atlético',
      'MOT41',
      'Monte Fresnara',
      '#6CACE4',
      '#0057B8',
      'historic',
      36,
      'Estadio Bailana',
      14500,
    ],
    ['Hinojino Sporting Club', 'HIV', 'Hinojino', '#E30613', '#000000', 'fallen', 36, 'Estadio Montete', 14000],
    [
      'Real Unión Nueva Bailedo',
      'NVB',
      'Nueva Bailedo',
      '#001F5B',
      '#00843D',
      'fallen',
      36,
      'Ciudad Deportiva Nueva Bailedo',
      14000,
    ],
    ['Lioriel CF', 'LIH31', 'Lioriel', '#000000', '#E30613', 'selling', 36, 'Estadio Guadares', 12500],
    [
      'SD Talal de Arriba',
      'SDF',
      'Talal de Arriba',
      '#0057B8',
      '#001F5B',
      'fallen',
      36,
      'Nuevo Estadio Talal de Arriba',
      11500,
    ],
    [
      'Real Villa Guadero',
      'GUT',
      'Villa Guadero',
      '#00843D',
      '#001F5B',
      'historic',
      36,
      'Ciudad Deportiva Villa Guadero',
      12000,
    ],
    [
      'Las Quintiel Sporting Club',
      'LAX45',
      'Las Quintiel',
      '#E30613',
      '#FFD100',
      'fan',
      36,
      'Estadio Municipal de Las Quintiel',
      10500,
    ],
    [
      'Juventud El Almazares',
      'ELN',
      'El Almazares',
      '#0057B8',
      '#6CACE4',
      'fallen',
      35,
      'Estadio Municipal de El Almazares',
      12000,
    ],
    ['Racing Aranjar', 'AAR', 'Aranjar', '#0057B8', '#FFFFFF', 'fan', 35, 'Estadio Nerjador', 12000],
    ['CD Peñilla', 'PES40', 'Peñilla', '#001F5B', '#FFD100', 'youth', 35, 'Estadio Bailanes', 13500],
    ['Atlético Santa Roblero', 'ROO', 'Santa Roblero', '#FFD100', '#6A1B9A', 'fallen', 35, 'Estadio Guadero', 11000],
    ['Sporting Cabranes', 'CAF53', 'Cabranes', '#0057B8', '#000000', 'fan', 35, 'Estadio Yestador', 10000],
    ['Sporting Almazanes', 'AES', 'Almazanes', '#6A1B9A', '#FFFFFF', 'fallen', 34, 'Ciudad Deportiva Almazanes', 12000],
    [
      'Racing Club Alto Úbedador',
      'ALR87',
      'Alto Úbedador',
      '#E30613',
      '#00843D',
      'fan',
      34,
      'Campo de Alto Úbedador',
      13500,
    ],
    ['SD Torrón', 'SDE', 'Torrón', '#000000', '#0057B8', 'selling', 34, 'Estadio La Castosa', 12000],
    ['Real Sepúlvanes', 'SEH31', 'Sepúlvanes', '#000000', '#FFFFFF', 'fan', 34, 'Ciudad Deportiva Sepúlvanes', 12000],
    ['Pedara CF', 'PER39', 'Pedara', '#6A1B9A', '#000000', 'fallen', 34, 'Ciudad Deportiva Pedara', 13000],
    ['Racing Club Zamón', 'ZAW', 'Zamón', '#FFFFFF', '#6A1B9A', 'youth', 34, 'Campo de Zamón', 12000],
    ['Deportivo Talal', 'TAG30', 'Talal', '#FFD100', '#E30613', 'historic', 34, 'Estadio Olmares', 13500],
    ['SD Yestena', 'SDY', 'Yestena', '#001F5B', '#000000', 'fan', 34, 'Campo de Yestena', 10500],
    ['Racing Club Osunador', 'OSR', 'Osunador', '#FFFFFF', '#6CACE4', 'fallen', 33, 'Ciudad Deportiva Osunador', 10000],
    ['Real Club Pededo', 'PEN36', 'Pededo', '#0057B8', '#001F5B', 'fallen', 33, 'Ciudad Deportiva Pededo', 12500],
    [
      'Racing Mayoredo',
      'MAL58',
      'Mayoredo',
      '#6A1B9A',
      '#0057B8',
      'selling',
      33,
      'Estadio Municipal de Mayoredo',
      13500,
    ],
    ['Unión Lucena', 'LUS', 'Lucena', '#00843D', '#FFD100', 'historic', 33, 'Estadio Nava', 10000],
    ['Deportivo Valiel', 'VAD27', 'Valiel', '#E30613', '#000000', 'fan', 33, 'Estadio La Sorero', 10500],
    ['Racing Club Aranjejo', 'AJO', 'Aranjejo', '#FFFFFF', '#001F5B', 'youth', 33, 'Campo de Aranjejo', 10500],
    ['UD Albador', 'ALT89', 'Albador', '#6A1B9A', '#E30613', 'historic', 33, 'Estadio La Alcala', 12000],
    ['Estudiantes de Corvena', 'CNC', 'Corvena', '#FFD100', '#6A1B9A', 'fan', 33, 'Nuevo Estadio Corvena', 13500],
    ['Racing Guadedo', 'GUQ', 'Guadedo', '#000000', '#6CACE4', 'fan', 33, 'Campo de Guadedo', 10000],
    ['Atlético Gandal', 'GAW', 'Gandal', '#0057B8', '#6CACE4', 'fan', 33, 'Campo de Gandal', 13000],
    ['Juventud Aranjara', 'ARA24', 'Aranjara', '#0057B8', '#000000', 'fallen', 32, 'Nuevo Estadio Aranjara', 11000],
    ['Albilla Sporting Club', 'ALS88', 'Albilla', '#E30613', '#00843D', 'youth', 32, 'Campo de Albilla', 13000],
    ['SD Sorero', 'SSD', 'Sorero', '#000000', '#0057B8', 'historic', 32, 'Ciudad Deportiva Sorero', 8500],
    ['Unión Santa Lermiel', 'LEL', 'Lermiel', '#FFD100', '#00843D', 'historic', 32, 'Estadio Orihero', 8500],
    ['Club Almazana', 'ANK', 'Almazana', '#6CACE4', '#00843D', 'fan', 32, 'Campo de Almazana', 11000],
    ['Real Pedón', 'PEP37', 'Pedón', '#001F5B', '#FFD100', 'historic', 31, 'Estadio La Calateda', 8500],
    ['CD Villara', 'VVI', 'Villara', '#0057B8', '#000000', 'youth', 31, 'Ciudad Deportiva Villara', 10000],
    ['Atlético Fresnedo', 'FRZ', 'Fresnedo', '#6CACE4', '#00843D', 'fan', 31, 'Ciudad Deportiva Fresnedo', 13000],
    [
      'Cervanes Sporting Club',
      'CEK',
      'Cervanes',
      '#FFD100',
      '#6CACE4',
      'fallen',
      31,
      'Estadio Municipal de Cervanes',
      12000,
    ],
    ['Real Club Arroena', 'ARG30', 'Arroena', '#00843D', '#0057B8', 'fan', 31, 'Nuevo Estadio Arroena', 11500],
    ['Unión Zafrares', 'ZAX', 'Zafrares', '#0057B8', '#FFD100', 'selling', 31, 'Campo de Zafrares', 9000],
    [
      'Alto Roblejo Sporting Club',
      'ATK',
      'Roblejo',
      '#001F5B',
      '#6CACE4',
      'historic',
      31,
      'Ciudad Deportiva Roblejo',
      8500,
    ],
    ['Sporting Elchar', 'ELQ', 'Elchar', '#E30613', '#00843D', 'fan', 31, 'Estadio Mayorares', 8500],
    ['Sporting Benavar', 'BEY46', 'Benavar', '#E30613', '#001F5B', 'youth', 31, 'Estadio Municipal de Benavar', 12000],
    ['Real Peñero', 'PET41', 'Peñero', '#00843D', '#E30613', 'selling', 31, 'Nuevo Estadio Peñero', 8000],
    ['CD Villa Oñatete', 'ONE', 'Oñatete', '#0057B8', '#FFD100', 'fan', 30, 'Estadio Gandero', 9000],
    ['Juventud Orihero', 'ORK', 'Orihero', '#FFFFFF', '#001F5B', 'fan', 30, 'Nuevo Estadio Orihero', 7500],
    ['CD Rondares', 'ROH31', 'Rondares', '#6CACE4', '#00843D', 'fan', 30, 'Nuevo Estadio Rondares', 10000],
    ['Piediel Atlético', 'PIP', 'Piediel', '#000000', '#001F5B', 'fan', 30, 'Estadio Municipal de Piediel', 8500],
    ['Real Olmares', 'OLV', 'Olmares', '#E30613', '#000000', 'historic', 30, 'Campo de Olmares', 10000],
  ];
  FM.D.CLUBS_SE4 = [
    ['GIF Nynäs', 'GNY', 'Nynäs', '#6A1B9A', '#FFD100', 'historic', 43, 'Sigfors IP', 17500],
    ['Vasalund Östra Sigberg', 'VAC26', 'Sigberg', '#6CACE4', '#0057B8', 'youth', 42, 'Falhamn Arena', 13000],
    ['IFK Norby', 'IFK', 'Norby', '#00843D', '#6CACE4', 'selling', 41, 'Norby Stadion', 15000],
    ['Gävstad FF', 'GAV', 'Gävstad', '#E30613', '#FFFFFF', 'historic', 41, 'Lidsundvallen', 12500],
    ['FC Moby', 'MOP37', 'Moby', '#E30613', '#FFD100', 'youth', 40, 'Gävik Arena', 13500],
    ['Vasalund Norberg', 'VNO', 'Norberg', '#E30613', '#6A1B9A', 'historic', 39, 'Norberg Idrottspark', 15500],
    ['FC Ulrholm', 'ULR', 'Ulrholm', '#00843D', '#6A1B9A', 'fan', 38, 'Halby IP', 14500],
    ['Nya Ronberg FK', 'NYC', 'Nya Ronberg', '#001F5B', '#6CACE4', 'fan', 38, 'Lidberg IP', 12500],
    ['IFK Sigvik', 'IFS', 'Sigvik', '#FFFFFF', '#6CACE4', 'historic', 37, 'Väsnäs Arena', 12500],
    ['Tranhamn FF', 'TRN', 'Tranhamn', '#0057B8', '#FFD100', 'selling', 36, 'Skelby Arena', 15000],
    ['Sundsund FF', 'SUW', 'Sundsund', '#FFD100', '#000000', 'historic', 35, 'Skelvikvallen', 13500],
    ['IFK Tranholm', 'IFT', 'Tranholm', '#FFFFFF', '#E30613', 'selling', 33, 'Mostadvallen', 9500],
    ['Lidsund IF', 'LID27', 'Lidsund', '#6A1B9A', '#001F5B', 'fan', 32, 'Sigö IP', 12500],
    ['Vasalund Örnfors', 'VOR', 'Örnfors', '#6A1B9A', '#FFD100', 'fallen', 32, 'Örnfors Stadion', 10000],
  ];
  FM.D.CLUBS_CH4 = [
    ['Thalingen SC', 'THY', 'Thalingen', '#00843D', '#001F5B', 'selling', 42, 'Dillhof-Stadion', 16500],
    ['Fortuna Hirschtal', 'HIP', 'Hirschtal', '#E30613', '#001F5B', 'fallen', 42, 'Hirschtal-Arena', 14000],
    ['FSV Dornfurt 1945', 'DOD27', 'Dornfurt', '#00843D', '#E30613', 'fan', 41, 'Altingen-Stadion', 15000],
    ['Teutonia Marienfeld', 'MLH', 'Marienfeld', '#0057B8', '#00843D', 'youth', 41, 'Schwarzbrück-Stadion', 16000],
    ['Eintracht Steinbrück', 'STG30', 'Steinbrück', '#FFFFFF', '#6CACE4', 'youth', 39, 'Steinbrück-Arena', 16000],
    [
      'Eintracht Ober Westeringen',
      'OBW',
      'Westeringen',
      '#000000',
      '#001F5B',
      'fan',
      39,
      'Waldstadion Westeringen',
      12000,
    ],
    ['Rot-Weiss Bachorst', 'RWE', 'Bachorst', '#00843D', '#000000', 'historic', 38, 'Stadion am Greifurt', 13500],
    ['Hansa Bachsee', 'HSA', 'Bachsee', '#0057B8', '#6CACE4', 'fallen', 38, 'Stadion am Westerdorf', 15500],
    ['Eintracht Bad Steinwald', 'BST', 'Bad Steinwald', '#000000', '#FFFFFF', 'selling', 36, 'Lütsee-Stadion', 13500],
    ['TSV Burgbrück 1894', 'BCK', 'Burgbrück', '#6CACE4', '#6A1B9A', 'fan', 36, 'Stadion Heidfeld', 14500],
    ['Borussia Klein Mühltal', 'BKL', 'Mühltal', '#0057B8', '#6A1B9A', 'fallen', 36, 'Waldstadion Mühltal', 11500],
    ['Eintracht Rotal', 'ROE28', 'Rotal', '#6A1B9A', '#FFFFFF', 'fan', 35, 'Langau-Stadion', 14500],
    ['Rot-Weiß Dornbrück', 'ROF29', 'Dornbrück', '#0057B8', '#FFD100', 'historic', 34, 'Dornbrück-Arena', 12000],
    ['FSV Eichstein', 'EIB', 'Eichstein', '#FFFFFF', '#000000', 'historic', 34, 'Eichstein-Arena', 14000],
    ['VfL Greifingen', 'GRZ', 'Greifingen', '#E30613', '#001F5B', 'historic', 33, 'Stadion Kalhafen', 13500],
    ['Fortuna Bad Mariental 1949', 'BAF53', 'Mariental', '#E30613', '#6A1B9A', 'fallen', 32, 'Mariental-Arena', 12500],
  ];
  FM.D.CLUBS_TH4 = [
    ['Banam United', 'BAG54', 'Banam', '#FFFFFF', '#0057B8', 'fallen', 43, 'Phrapur Arena', 16500],
    ['Kaochan Athletic', 'KAT41', 'Kaochan', '#000000', '#6CACE4', 'fallen', 42, 'Takburi Sports Park', 13500],
    ['Takyai City', 'TCI', 'Takyai', '#E30613', '#0057B8', 'fan', 41, 'Khaosai Arena', 13000],
    ['Takthong Port', 'TAC50', 'Takthong', '#001F5B', '#E30613', 'fallen', 39, 'Chiangthong Sports Park', 12500],
    ['Sriyai Athletic', 'SRE', 'Sriyai', '#6A1B9A', '#FFD100', 'fan', 38, 'Phralek Sports Park', 14500],
    ['Nakhonthong Port', 'NAW44', 'Nakhonthong', '#0057B8', '#FFFFFF', 'fan', 36, 'Nakhonlek Sports Park', 11500],
    ['Ratpur Rapids United', 'RAK33', 'Ratpur', '#00843D', '#6A1B9A', 'fallen', 36, 'Kaonam Arena', 13500],
    ['Muang Singkaeo United', 'MUJ', 'Singkaeo', '#0057B8', '#000000', 'fan', 35, 'Srira Sports Park', 13500],
    ['Muang Sakra United', 'MSB', 'Sakra', '#00843D', '#FFFFFF', 'historic', 33, 'Maenong Arena', 13000],
    ['Maeburi Port', 'MPO', 'Maeburi', '#001F5B', '#000000', 'fan', 31, 'Wangmai Sports Park', 10500],
  ];
  FM.D.CLUBS_TR4 = [
    ['Tavsaray Gençlik', 'TAD51', 'Tavsaray', '#6CACE4', '#00843D', 'fan', 43, 'Tavsaray Şehir Stadyumu', 13500],
    ['Akbahçegücü', 'AKK', 'Akbahçe', '#000000', '#E30613', 'fan', 43, 'Akbahçe Cumhuriyet Stadyumu', 15000],
    ['Yeni İnclarspor', 'INR', 'İnclar', '#FFD100', '#6A1B9A', 'selling', 42, 'Alova Stadyumu', 15000],
    ['Demlar Gençlik', 'DEH', 'Demlar', '#6A1B9A', '#FFFFFF', 'fan', 42, 'Demlar Şehir Stadyumu', 17000],
    ['Sultanovagücü', 'SUX', 'Sultanova', '#E30613', '#00843D', 'historic', 41, 'Karaköy Stadyumu', 14500],
    [
      'Büyük Yalargücü',
      'BUE28',
      'Büyük Yalar',
      '#E30613',
      '#6CACE4',
      'selling',
      40,
      'Büyük Yalar Cumhuriyet Stadyumu',
      15000,
    ],
    ['Kızköy Birlik', 'KZK', 'Kızköy', '#0057B8', '#001F5B', 'historic', 39, 'Kızköy Cumhuriyet Stadyumu', 15000],
    ['Esktepe Birlik', 'EPE', 'Esktepe', '#001F5B', '#0057B8', 'youth', 39, 'Esktepe Cumhuriyet Stadyumu', 16000],
    ['Kızova Belediyespor', 'KZO', 'Kızova', '#001F5B', '#000000', 'fan', 38, 'Dursaray Stadyumu', 14000],
    ['Demova Atletik', 'DEJ', 'Demova', '#FFFFFF', '#0057B8', 'fan', 38, 'Demova Cumhuriyet Stadyumu', 12000],
    ['Eski Bozköy Gücü', 'ESX', 'Eski Bozköy', '#FFD100', '#00843D', 'fan', 36, 'Aksaray Stadyumu', 14000],
    ['Karköy SK', 'KOY', 'Karköy', '#000000', '#6A1B9A', 'historic', 36, 'Karköy Şehir Stadyumu', 15000],
    ['Uşakale SK', 'USH', 'Uşakale', '#E30613', '#00843D', 'youth', 35, 'Çamkale Arena', 12500],
    [
      'Yeni Sultanpınarspor',
      'SOW',
      'Sultanpınar',
      '#FFD100',
      '#6A1B9A',
      'historic',
      34,
      'Sultanpınar Cumhuriyet Stadyumu',
      12500,
    ],
    ['Uşabahçe Belediyespor', 'UCE', 'Uşabahçe', '#001F5B', '#00843D', 'fan', 34, 'Uşabahçe Şehir Stadyumu', 10500],
    ['Kızkalespor', 'KZR', 'Kızkale', '#FFD100', '#0057B8', 'youth', 33, 'Gönkale Arena', 9500],
    ['Çanova Gücü', 'CAX45', 'Çanova', '#6A1B9A', '#000000', 'selling', 33, 'Çanova Cumhuriyet Stadyumu', 9500],
    [
      'Büyük Dempınar Gençlik',
      'BDE',
      'Büyük Dempınar',
      '#00843D',
      '#000000',
      'youth',
      32,
      'Büyük Dempınar Şehir Stadyumu',
      9500,
    ],
  ];
  FM.D.CLUBS_US4 = [
    ['Prairieridge Fire', 'PGE', 'Prairieridge', '#001F5B', '#E30613', 'historic', 43, 'Aspenport Field', 15000],
    ['Greengrove Brewers', 'GVE', 'Greengrove', '#00843D', '#6CACE4', 'fallen', 43, 'Oakview Field', 15000],
    ['Mount Mapleville Stallions', 'MMB', 'Mapleville', '#FFD100', '#FFFFFF', 'fan', 41, 'Summitgrove Field', 14000],
    ['Blueview Revolution', 'BLE', 'Blueview', '#00843D', '#FFFFFF', 'historic', 40, 'Blueview Stadium', 12500],
    ['FC Porthills', 'PLS', 'Porthills', '#6A1B9A', '#0057B8', 'fan', 39, 'Bayford Field', 15500],
    ['Willowcreek Stallions', 'WIH', 'Willowcreek', '#6CACE4', '#00843D', 'fan', 39, 'Springbluff Field', 16000],
    ['Greensprings United', 'GRA24', 'Greensprings', '#FFFFFF', '#E30613', 'selling', 38, 'Walnutgrove Field', 14500],
    ['FC Fortburg', 'FOK', 'Fortburg', '#0057B8', '#001F5B', 'fan', 37, 'Fortburg Field', 11000],
    ['Harborview Rapids', 'HEY', 'Harborview', '#FFFFFF', '#E30613', 'youth', 37, 'Cypressgrove Field', 15500],
    ['New Cypressview Blaze', 'CYW', 'Cypressview', '#00843D', '#6CACE4', 'historic', 35, 'Cypressview Field', 13000],
    [
      'East Riverburg Fury',
      'RRG',
      'East Riverburg',
      '#000000',
      '#6CACE4',
      'fallen',
      34,
      'East Riverburg Stadium',
      13000,
    ],
    [
      'Silverport Beach Rapids',
      'SRF',
      'Silverport Beach',
      '#6A1B9A',
      '#000000',
      'fan',
      34,
      'Silverport Beach Field',
      14000,
    ],
    ['Inter Canyonburg', 'IER', 'Canyonburg', '#E30613', '#6A1B9A', 'fan', 33, 'Canyonburg Arena', 11000],
    ['AC Rockgrove', 'RVE', 'Rockgrove', '#6CACE4', '#001F5B', 'fan', 32, 'Rockgrove Stadium', 11500],
  ];
  FM.D.CLUBS_VN4 = [
    ['Lang Phong FC', 'LNA', 'Lang Phong', '#0057B8', '#000000', 'selling', 43, 'San Thai Bien', 17500],
    ['Ha Lac United', 'HHA', 'Ha Lac', '#0057B8', '#FFFFFF', 'historic', 41, 'San Ha Lac', 16000],
    ['Cong An Ha Hoa', 'COE28', 'Ha Hoa', '#E30613', '#6A1B9A', 'fallen', 39, 'Nam Bien Stadium', 12500],
    ['Xi Mang Kon Nang', 'XII', 'Kon Nang', '#6A1B9A', '#FFD100', 'fan', 37, 'Bac Bien Stadium', 12500],
    ['Tuy Bien FC', 'TBI', 'Tuy Bien', '#000000', '#FFD100', 'fan', 37, 'San Tuy Bien', 11500],
    ['Thai Duong FC', 'THZ', 'Thai Duong', '#E30613', '#000000', 'fallen', 35, 'San Long Nang', 10500],
    ['Sai Cao Lac', 'SAF53', 'Cao Lac', '#00843D', '#FFD100', 'historic', 34, 'San Cao Lac', 12500],
    ['Cang Hai Lai', 'CAY46', 'Hai Lai', '#E30613', '#FFFFFF', 'historic', 32, 'Lam Duong Stadium', 10500],
  ];
  FM.D.CLUBS_OC1 = [
    ['Timburn Football Club', 'TIC', 'Timburn', '#0057B8', '#FFD100', 'fan', 36, 'Timburn Park', 8000],
    ['New Langport United', 'NBG', 'New Langport', '#E30613', '#001F5B', 'fan', 34, 'Riport Park', 7500],
    ['South Thirwich Town', 'SOX', 'South Thirwich', '#00843D', '#6CACE4', 'fan', 31, 'South Thirwich Ground', 7000],
    ['Lymewood Hotspur', 'LYB', 'Lymewood', '#FFD100', '#000000', 'fan', 30, 'Lymewood Park', 6500],
    ['Market Scarport Rovers', 'MCG', 'Scarport', '#001F5B', '#6A1B9A', 'fan', 30, 'Fenington Green', 6500],
    ['East Redborough Villa', 'EAB', 'Redborough', '#6CACE4', '#0057B8', 'fan', 29, 'Amesmouth Park', 6500],
    ['Glasea Athletic', 'GLG', 'Glasea', '#000000', '#E30613', 'fan', 28, 'Glasea Ground', 6000],
    ['Tamby Rovers', 'TBD', 'Tamby', '#6A1B9A', '#00843D', 'fan', 33, 'Tamby Sportsground', 7500],
  ];
  FM.D.CLUBS_AL2 = [
    ['KF Mitush', 'KFF', 'Mitush', '#0057B8', '#FFD100', 'fan', 38, 'Stadiumi Beraj', 14500],
    ['Naftëtari Krush', 'NAX45', 'Krush', '#6A1B9A', '#FFFFFF', 'fan', 37, 'Kompleksi Sportiv Krush', 12500],
    ['Lokomotiva Kamec', 'KAU42', 'Kamec', '#FFFFFF', '#6A1B9A', 'fan', 36, 'Kompleksi Sportiv Kamec', 10500],
    ['Bashkimi Shkush', 'BAH55', 'Shkush', '#00843D', '#FFD100', 'historic', 35, 'Stadiumi Mitaj', 10500],
    ['KF Fushël', 'KKF', 'Fushël', '#FFD100', '#6A1B9A', 'youth', 34, 'Stadiumi Qytetit Fushël', 11000],
    [
      'Kodra Lushica FK',
      'KOV',
      'Kodra Lushica',
      '#0057B8',
      '#6A1B9A',
      'fan',
      33,
      'Stadiumi Qytetit Kodra Lushica',
      13500,
    ],
    ['Lokomotiva Mal Malër', 'MAF53', 'Malër', '#6A1B9A', '#FFFFFF', 'selling', 32, 'Stadiumi Ferovë', 11500],
    ['Partizani Mal Fia', 'PAW44', 'Fia', '#FFD100', '#6A1B9A', 'fan', 32, 'Kompleksi Sportiv Fia', 13000],
    ['Shqiponja Grush', 'SHH31', 'Grush', '#001F5B', '#6CACE4', 'fan', 31, 'Kompleksi Sportiv Grush', 13000],
    ['Partizani Mitaj', 'PAX45', 'Mitaj', '#E30613', '#6CACE4', 'selling', 30, 'Durec Arena', 10000],
    ['KF Mal Ferël', 'KFM', 'Ferël', '#0057B8', '#6CACE4', 'fan', 29, 'Korër Arena', 8500],
    ['Dinamo Berani', 'DIY', 'Berani', '#000000', '#FFFFFF', 'fan', 28, 'Stadiumi Pogovë', 11500],
    ['Bashkimi Pola', 'BAJ56', 'Pola', '#E30613', '#6A1B9A', 'youth', 28, 'Kompleksi Sportiv Pola', 11000],
    ['Minatori Pogovë', 'MIA24', 'Pogovë', '#001F5B', '#FFD100', 'fallen', 27, 'Elbec Arena', 8000],
    ['Partizani Lezovë', 'PNI', 'Lezovë', '#FFD100', '#0057B8', 'fallen', 26, 'Krush Arena', 7000],
    ['Bashkimi Gja', 'BMI', 'Gja', '#0057B8', '#001F5B', 'fallen', 26, 'Kompleksi Sportiv Gja', 7500],
  ];
  FM.D.CLUBS_BO2 = [
    ['Real Club Hinojares', 'HIQ', 'Hinojares', '#0057B8', '#001F5B', 'fan', 38, 'Campo de Hinojares', 12500],
    ['Club Villa Gandosa', 'GAQ', 'Villa Gandosa', '#E30613', '#00843D', 'fan', 37, 'Estadio Ribiel', 12500],
    [
      'Unión Las Palomal',
      'LAP37',
      'Las Palomal',
      '#FFD100',
      '#6CACE4',
      'selling',
      37,
      'Nuevo Estadio Las Palomal',
      11000,
    ],
    ['Sporting Alto Benava', 'ALG78', 'Benava', '#FFFFFF', '#FFD100', 'fan', 36, 'Estadio Cervana', 10500],
    [
      'Racing Las Orihedo',
      'LAQ38',
      'Las Orihedo',
      '#000000',
      '#001F5B',
      'fan',
      35,
      'Estadio Municipal de Las Orihedo',
      12000,
    ],
    ['Sporting Úbededa', 'UBG', 'Úbededa', '#FFD100', '#0057B8', 'fan', 35, 'Campo de Úbededa', 11000],
    ['Real Marbara', 'MAG54', 'Marbara', '#6CACE4', '#000000', 'fan', 33, 'Estadio La Palomero', 12500],
    [
      'Deportivo Castar de Abajo',
      'CAZ47',
      'Castar de Abajo',
      '#0057B8',
      '#FFFFFF',
      'historic',
      33,
      'Estadio La Aranja',
      13000,
    ],
    ['Real Villa Arroejo', 'ARB25', 'Villa Arroejo', '#E30613', '#6A1B9A', 'fan', 33, 'Estadio La Elchiel', 11500],
    ['Atlético Nueva Cuenara', 'NUJ', 'Cuenara', '#E30613', '#FFFFFF', 'fallen', 32, 'Estadio La Sorón', 12500],
    ['Estudiantes de Oñatana', 'OND', 'Oñatana', '#6A1B9A', '#E30613', 'fan', 31, 'Nuevo Estadio Oñatana', 9000],
    ['Unión Guadejo', 'GUK', 'Guadejo', '#FFFFFF', '#000000', 'fan', 30, 'Estadio Salamino', 11000],
    ['Sporting Fresnilla', 'FRW', 'Fresnilla', '#001F5B', '#000000', 'selling', 29, 'Estadio La Gandero', 10000],
    ['Atlético Hinojosa', 'HIT', 'Hinojosa', '#6CACE4', '#00843D', 'historic', 28, 'Campo de Hinojosa', 9000],
    [
      'Real Club Salamana',
      'SAG54',
      'Salamana',
      '#FFD100',
      '#00843D',
      'historic',
      28,
      'Estadio Municipal de Salamana',
      7500,
    ],
    ['Racing Villa Osunero', 'OSJ', 'Villa Osunero', '#FFFFFF', '#00843D', 'fan', 28, 'Campo de Villa Osunero', 8500],
  ];
  FM.D.CLUBS_EE2 = [
    ['Norma Alaraplvere', 'NOE28', 'Alaraplvere', '#6A1B9A', '#000000', 'fan', 36, 'Elvasaare Spordikeskus', 10500],
    ['Lootus Elvamäe', 'LOO', 'Elvamäe', '#FFD100', '#FFFFFF', 'historic', 35, 'Tapala staadion', 10500],
    ['FC Musküla', 'MUM', 'Musküla', '#0057B8', '#E30613', 'fallen', 33, 'Musküla Kesk staadion', 13000],
    ['Norma Kundala', 'NOF29', 'Kundala', '#E30613', '#FFFFFF', 'fan', 32, 'Põlvru staadion', 10500],
    ['FC Haapküla', 'HAY46', 'Haapküla', '#E30613', '#00843D', 'fan', 31, 'Haapküla Kesk staadion', 10000],
    ['Dünamo Vana Antsaare', 'DUH', 'Antsaare', '#E30613', '#00843D', 'historic', 30, 'Rakru staadion', 12000],
    ['Merkuur Pairu', 'MEB25', 'Pairu', '#E30613', '#00843D', 'selling', 28, 'Raplsaare staadion', 11000],
    ['Norma Vana Tapaküla', 'NMB', 'Tapaküla', '#6A1B9A', '#00843D', 'youth', 28, 'Tapaküla Arena', 8500],
    [
      'Lootus Ülekundasaare',
      'LOT',
      'Ülekundasaare',
      '#001F5B',
      '#000000',
      'selling',
      26,
      'Ülekundasaare Kesk staadion',
      8500,
    ],
    ['Dünamo Lõuküla', 'DUJ', 'Lõuküla', '#6A1B9A', '#FFD100', 'historic', 25, 'Lõuküla Kesk staadion', 7500],
  ];
  FM.D.CLUBS_GE2 = [
    ['Sheli FC', 'SHJ32', 'Sheli', '#00843D', '#6CACE4', 'selling', 39, 'Shuli Sporti', 16000],
    ['FC Lanebi', 'LAR39', 'Lanebi', '#0057B8', '#FFFFFF', 'selling', 37, 'Lanebi Stadioni', 11500],
    ['Sioni Cheli', 'SIE28', 'Cheli', '#6CACE4', '#FFD100', 'fan', 35, 'Cheli Stadioni', 13000],
    ['Guria Merisi', 'GUN', 'Merisi', '#FFFFFF', '#000000', 'fan', 34, 'Tskaleli Sporti', 12000],
    ['Mziuri Ochuli', 'MZI', 'Ochuli', '#FFFFFF', '#E30613', 'youth', 33, 'Arena Ochuli', 13000],
    ['Dila Meruli', 'DIA24', 'Meruli', '#6A1B9A', '#000000', 'selling', 32, 'Arena Meruli', 11000],
    ['Lokomotivi Jvarari', 'LOW', 'Jvarari', '#00843D', '#000000', 'fan', 30, 'Arena Jvarari', 8500],
    ['Torpedo Tsineti', 'TOE', 'Tsineti', '#E30613', '#FFD100', 'fan', 30, 'Lanuri Sporti', 9500],
    ['Sioni Baneti', 'SIF29', 'Baneti', '#000000', '#E30613', 'fallen', 28, 'Samari Stadioni', 8000],
    ['Dinamo Dzeli', 'DIB25', 'Dzeli', '#0057B8', '#00843D', 'fan', 27, 'Dzeli Stadioni', 9500],
  ];
  FM.D.CLUBS_XK2 = [
    ['Partizani Fushë Polër', 'PAY46', 'Polër', '#E30613', '#6CACE4', 'fallen', 35, 'Kompleksi Sportiv Polër', 14000],
    ['Shqiponja Elbani', 'SHK33', 'Elbani', '#FFD100', '#E30613', 'fan', 33, 'Stadiumi Qytetit Elbani', 13000],
    ['Lokomotiva Fushë Gjani', 'FUS', 'Gjani', '#000000', '#FFFFFF', 'historic', 33, 'Bulër Arena', 9500],
    ['Lokomotiva Mal Bulush', 'MAH55', 'Bulush', '#FFD100', '#001F5B', 'fan', 32, 'Stadiumi Kukush', 9500],
    ['Flamuri Elbush', 'FLB', 'Elbush', '#6CACE4', '#E30613', 'selling', 32, 'Stadiumi Qytetit Elbush', 9000],
    ['Luftëtari Pejush', 'LUM', 'Pejush', '#FFFFFF', '#0057B8', 'youth', 31, 'Kompleksi Sportiv Pejush', 10500],
    ['KF Durec', 'KFD', 'Durec', '#0057B8', '#E30613', 'historic', 30, 'Kompleksi Sportiv Durec', 12000],
    ['KF Shkica', 'KFS', 'Shkica', '#FFFFFF', '#00843D', 'youth', 29, 'Kompleksi Sportiv Shkica', 8000],
    ['Drita Prizël', 'DRI', 'Prizël', '#001F5B', '#FFD100', 'historic', 28, 'Stadiumi Sara', 9000],
    ['FK Mal Lushovë', 'MLU', 'Lushovë', '#6A1B9A', '#000000', 'historic', 28, 'Kavër Arena', 7500],
    ['Shqiponja Korec', 'SJA', 'Korec', '#6A1B9A', '#6CACE4', 'historic', 26, 'Stadiumi Pejër', 8500],
    ['Ylli Kamël', 'YLL', 'Kamël', '#001F5B', '#6A1B9A', 'selling', 25, 'Stadiumi Qytetit Kamël', 8500],
    ['Shqiponja Grec', 'SHL34', 'Grec', '#001F5B', '#0057B8', 'historic', 25, 'Stadiumi Korica', 8000],
    ['KF Libaj', 'KFB', 'Libaj', '#E30613', '#FFD100', 'youth', 23, 'Kompleksi Sportiv Libaj', 4500],
  ];
  FM.D.CLUBS_LV2 = [
    ['JFC Kuliņi', 'JFC', 'Kuliņi', '#FFD100', '#001F5B', 'historic', 35, 'Alūava stadions', 13000],
    ['Auseklis Lej Dobēni', 'AUG', 'Dobēni', '#0057B8', '#000000', 'fallen', 34, 'Daieši stadions', 13500],
    ['Auseklis Cēspils', 'AID', 'Cēspils', '#FFD100', '#6CACE4', 'fan', 34, 'Sigiņi Sporta Komplekss', 12500],
    ['Vārpa Jelgava', 'VAP', 'Jelgava', '#000000', '#00843D', 'selling', 32, 'Pilsētas stadions Jelgava', 9500],
    ['Elektrons Augš Ērgieši', 'ELP', 'Ērgieši', '#00843D', '#001F5B', 'fallen', 32, 'Aizene stadions', 9000],
    ['Daugava Talspils', 'DAC26', 'Talspils', '#0057B8', '#6CACE4', 'youth', 30, 'Venēni Sporta Komplekss', 12000],
    ['Daugava Augšdobava', 'DAD27', 'Augšdobava', '#6CACE4', '#00843D', 'youth', 30, 'Tukava Sporta Komplekss', 12000],
    ['Spartaks Alūava', 'SPN36', 'Alūava', '#E30613', '#000000', 'historic', 28, 'Rēzava Sporta Komplekss', 8000],
    ['Dinamo Vec Limene', 'DMO', 'Limene', '#000000', '#E30613', 'youth', 28, 'Alūene Sporta Komplekss', 9000],
    ['Dinamo Smilieši', 'DIC26', 'Smilieši', '#FFD100', '#00843D', 'fallen', 28, 'Pilsētas stadions Smilieši', 7500],
    ['Spartaks Lejrēzieši', 'SPP37', 'Lejrēzieši', '#6CACE4', '#001F5B', 'historic', 27, 'Valēni stadions', 10500],
    ['Dinamo Gulieši', 'DID27', 'Gulieši', '#FFFFFF', '#E30613', 'historic', 26, 'Pilsētas stadions Gulieši', 7000],
    ['FK Vec Limieši', 'VED27', 'Limieši', '#00843D', '#0057B8', 'historic', 25, 'Rūjene stadions', 8500],
    ['Dinamo Venpils', 'DIE28', 'Venpils', '#6CACE4', '#FFD100', 'fallen', 23, 'Pilsētas stadions Venpils', 8500],
  ];
  FM.D.CLUBS_LT2 = [
    ['Kovas Ukminai', 'KOW', 'Ukminai', '#E30613', '#0057B8', 'fan', 34, 'Ukminai Arena', 12000],
    ['Banga Šiainai', 'BAK57', 'Šiainai', '#FFFFFF', '#E30613', 'fallen', 34, 'Igninai Sporto Centras', 10000],
    [
      'Spartakas Naujomažinai',
      'SAH55',
      'Naujomažinai',
      '#FFD100',
      '#6A1B9A',
      'historic',
      33,
      'Miesto stadionas Naujomažinai',
      9500,
    ],
    ['FK Birūnai', 'BIR', 'Birūnai', '#000000', '#00843D', 'fan', 32, 'Birūnai Arena', 10000],
    ['FC Žemgariai', 'ZEU', 'Žemgariai', '#00843D', '#6CACE4', 'fan', 31, 'Maruva stadionas', 8500],
    ['Granitas Mariūnai', 'GRB25', 'Mariūnai', '#E30613', '#6A1B9A', 'historic', 30, 'Plunava Sporto Centras', 10500],
    [
      'FK Naujouteūnai',
      'NAY46',
      'Naujouteūnai',
      '#000000',
      '#FFD100',
      'selling',
      28,
      'Miesto stadionas Naujouteūnai',
      11000,
    ],
    ['Kovas Telūnai', 'KOX', 'Telūnai', '#000000', '#FFD100', 'historic', 28, 'Miesto stadionas Telūnai', 7000],
    ['Dinamo Alytinai', 'DIF29', 'Alytinai', '#00843D', '#6A1B9A', 'fan', 26, 'Alytinai Arena', 7500],
    ['Kovas Pasiai', 'KAV43', 'Pasiai', '#FFFFFF', '#001F5B', 'fan', 26, 'Miesto stadionas Pasiai', 6500],
    ['FK Palai', 'PAZ47', 'Palai', '#6CACE4', '#FFD100', 'historic', 25, 'Miesto stadionas Palai', 9000],
    ['Granitas Jonai', 'GRC26', 'Jonai', '#FFFFFF', '#FFD100', 'selling', 25, 'Paneviai Sporto Centras', 6500],
  ];
  FM.D.CLUBS_LU2 = [
    ['Concordia Groß Kalkirchen', 'COF29', 'Kalkirchen', '#FFFFFF', '#6A1B9A', 'youth', 34, 'Kalkirchen-Arena', 10000],
    ['VfL Unter Goldorf', 'UNM', 'Goldorf', '#000000', '#FFD100', 'fan', 33, 'Stadion Ahrberg', 13000],
    ['Oberhafen 1899', 'OBB', 'Oberhafen', '#001F5B', '#E30613', 'historic', 33, 'Sportpark Thalstein', 11000],
    ['Westerfurt 1899', 'WEC', 'Westerfurt', '#00843D', '#000000', 'historic', 32, 'Stadion am Bransee', 11500],
    ['SV Lindberg', 'LIE28', 'Lindberg', '#000000', '#6CACE4', 'selling', 31, 'Sportpark Bruchtal', 10500],
    ['SV Freihafen', 'FRX', 'Freihafen', '#FFFFFF', '#E30613', 'selling', 30, 'Stadion Felsheim', 11500],
    ['Alemannia Mühlhorst', 'ALH79', 'Mühlhorst', '#000000', '#6A1B9A', 'fan', 29, 'Sportpark Steinstadt', 10000],
    ['Union Grünhafen', 'GRD27', 'Grünhafen', '#0057B8', '#00843D', 'fallen', 29, 'Sportpark Furthausen', 12000],
    ['TSV Kirchau 1956', 'KIC26', 'Kirchau', '#E30613', '#6CACE4', 'historic', 28, 'Stadion Wiesau', 11000],
    ['TSV Groß Eichausen', 'GRE28', 'Eichausen', '#E30613', '#000000', 'historic', 28, 'Stadion am Niederstadt', 11500],
    ['SV Rheinfeld', 'RHA', 'Rheinfeld', '#00843D', '#FFD100', 'fallen', 26, 'Rheinfeld-Arena', 6500],
    ['Alemannia Altberg', 'ALJ80', 'Altberg', '#00843D', '#0057B8', 'historic', 26, 'Waldstadion Altberg', 8000],
    ['Eintracht Neu Dornstein', 'NED27', 'Dornstein', '#00843D', '#000000', 'fan', 25, 'Waldstadion Dornstein', 7000],
    ['Viktoria Bruchbrück', 'BRL34', 'Bruchbrück', '#000000', '#FFD100', 'selling', 24, 'Stadion am Marienburg', 9000],
    ['FC Niedersee', 'NIQ', 'Niedersee', '#001F5B', '#FFFFFF', 'selling', 24, 'Sportpark Burgburg', 7000],
    ['Eintracht Lütberg', 'LUP', 'Lütberg', '#0057B8', '#000000', 'fan', 22, 'Bruchsee-Stadion', 6000],
  ];
  FM.D.CLUBS_ME2 = [
    ['Lokomotiv Kosica', 'LOX', 'Kosica', '#000000', '#6A1B9A', 'selling', 36, 'Gradski Stadion Kosica', 13500],
    ['Partizan Stari Belica', 'PAA48', 'Stari Belica', '#6A1B9A', '#000000', 'youth', 34, 'Stadion Hradovac', 11000],
    ['MFK Nova Slaovice', 'NOG30', 'Nova Slaovice', '#6A1B9A', '#0057B8', 'fan', 34, 'Stadion Lubpol', 13000],
    ['NK Ostek', 'OSK', 'Ostek', '#E30613', '#6CACE4', 'fan', 32, 'Stadion Belpol', 11000],
    ['Železničar Malek', 'ZEW', 'Malek', '#001F5B', '#000000', 'fan', 32, 'Stadion Mir Malek', 9500],
    ['Železničar Kamany', 'ZEX', 'Kamany', '#6A1B9A', '#FFFFFF', 'fan', 31, 'Stadion Slavava', 10500],
    ['Partizan Ostec', 'PAB49', 'Ostec', '#6A1B9A', '#FFD100', 'fallen', 30, 'Stadion Ostica', 8000],
    ['SK Ostice', 'OSL', 'Ostice', '#00843D', '#001F5B', 'historic', 29, 'Malina Arena', 11500],
    ['Dinamo Lubik', 'DLU', 'Lubik', '#0057B8', '#6A1B9A', 'fan', 28, 'Gradski Stadion Lubik', 7500],
    ['Spartak Plesovac', 'SPQ38', 'Plesovac', '#FFD100', '#6CACE4', 'fan', 27, 'Stadion Turek', 6500],
    ['Metalac Hradek', 'MEC26', 'Hradek', '#00843D', '#E30613', 'fallen', 26, 'Gradski Stadion Hradek', 9000],
    ['NK Turgrad', 'TUF', 'Turgrad', '#FFD100', '#000000', 'fan', 26, 'Novpol Arena', 10000],
  ];
  FM.D.CLUBS_MK2 = [
    ['SK Ostovo', 'OSO', 'Ostovo', '#6A1B9A', '#0057B8', 'fallen', 37, 'Stadion Mir Ostovo', 13000],
    ['Zora Tarin', 'TAA', 'Tarin', '#FFD100', '#000000', 'historic', 36, 'Tarin Park', 14500],
    ['Radnički Rybina', 'RAL34', 'Rybina', '#000000', '#FFFFFF', 'selling', 36, 'Rybina Park', 12500],
    ['Zora Kraina', 'KRT', 'Kraina', '#FFFFFF', '#E30613', 'selling', 34, 'Mirik Arena', 10000],
    ['FC Kamica', 'KAW44', 'Kamica', '#6A1B9A', '#000000', 'fan', 34, 'Stadion Dolnica', 10000],
    ['Zora Lubany', 'LUQ', 'Lubany', '#001F5B', '#FFFFFF', 'historic', 34, 'Belany Arena', 13500],
    ['Metalac Novi Tarec', 'MED27', 'Novi Tarec', '#6A1B9A', '#00843D', 'fan', 33, 'Velany Arena', 12000],
    ['SK Novi Radik', 'NOH31', 'Novi Radik', '#000000', '#6A1B9A', 'fan', 32, 'Liptica Arena', 12500],
    ['Dinamo Nova Borovice', 'DNA', 'Nova Borovice', '#6CACE4', '#6A1B9A', 'historic', 32, 'Stadion Mikin', 9000],
    ['Union Malica', 'MAJ56', 'Malica', '#00843D', '#001F5B', 'youth', 31, 'Stadion Kamice', 10500],
    [
      'SK Veliki Velovice',
      'VEE28',
      'Veliki Velovice',
      '#000000',
      '#FFD100',
      'fan',
      30,
      'Gradski Stadion Veliki Velovice',
      7500,
    ],
    ['Železničar Liptek', 'ZAV', 'Liptek', '#E30613', '#00843D', 'fan', 29, 'Stadion Kamica', 10500],
    ['FK Kraice', 'KRV', 'Kraice', '#000000', '#001F5B', 'fan', 28, 'Stadion Mir Kraice', 11000],
    ['Torpedo Bratin', 'TOX', 'Bratin', '#FFD100', '#00843D', 'fan', 27, 'Stadion Vysava', 8000],
    ['AO Turin', 'TUG', 'Turin', '#E30613', '#6CACE4', 'fan', 27, 'Stadion Plesina', 9500],
    ['FK Kamin', 'KAX45', 'Kamin', '#E30613', '#6CACE4', 'selling', 26, 'Stadion Slavina', 7000],
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
LIT|ABE|Reds|1899
HAS|HAS|Reds|1878
EVR|EVR|Terriers|1956
YAR|YAR|Lamplighters|1871
TUT|TUT|Hornets|1979
LAU|LAU|Seagulls|1947
REY|REY|Terriers|1986
CHI|NEA|Druids|1934
BEX|BEX|Reds|1867
REA|REA|Foxes|1909
STH|STH|Whites|1956
KIN|KIN|Railwaymen|1869
LIN|LIT|Shipbuilders|1904
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
CAE|RHY|Blues|1931
TUN|TUN|Thistles|1904
SHP|SHP|Drovers|1903
CLF|CLF|Salmon|1978
MAN|MNS|Vikings|1905
SCA|SCA|Comets|1942
DEN|DEC|Grecians|1889
FAL|FAC|Miners|1883
DUW|DNB|Cats|1904
ABH|ABH|Rockets|1890
CAI|CSI|Bulldogs|1894
BES|BXW|Rams|1900
DAA|DAA|Ironmen|1918
DAR|DAR|Tinners|1906
TAV|TVS|Pike|1909
HOW|HOW|Workmen|1946
DRT|DRT|Windmills|1924
CSH|CSH|Warriors|1950
HAO|HST|Blades|1933
RES|RYS|Spartans|1866
WIT|WIT|Minstrels|1887
BUR|BUH|Kestrels|1945
BED|BDT|Red Devils|1946
WOK|WKH|Blues|1886
SUE|SUE|Foresters|1880
GLA|GLC|Red Devils|1916
YTH|YTH|Seahawks|1890
LMR|LMR|Pitmen|1921
MIA|MLD|Valleymen|1863
EVA|EVA|Pilgrims|1862
PRU|PCA|Bees|1895
HAR|HAU|Lions|1896
PIC|PIH|Gulls|1902
CUR|CEW|Rams|1901
SHR|SRW|Norsemen|1901
YEO|YEO|Ospreys|1910
HYT|HYT|Crusaders|1901
TAR|TAT|Red Devils|1867
FOL|FLB|Railwaymen|1889
HOC|HLS|Reds|1914
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
MRB|ALL|Blancos|1862
PED|PDR|Leñadores|1916
ARK|ARK|Urdinak|1921
SOD|SRN|Potros|1887
CES|CES|Els Blaus|1904
JUF|JUF|Titanes|1968
SEB|SEB|Blancos|1948
MOR|MOR|Búhos|1912
CBR|CRE|Blancos|1936
FUE|FUU|Rojos|1936
LIA|LRR||1989
SAC|SAV|Cuervos|1933
JUB|JUB|Blancos|1918
OLB|OLB||1911
CEB|CEB||1929
CUB|CUB||1979
POZ|POE|Pastores|1913
OLA|OMA||1931
PLB|PLD||1959
ALA|AED||1940
MTA|MON||1989
ALL|ALC||1921
RON|RON|Titanes|1900
MAY|MYR|Segadores|1897
SEP|SEU|Lagartos|1932
TOB|TOB|Alacranes|1885
JVN|JVE|Zorros|1931
NAU|NVJ|Cruzados|1882
CAC|CTA|Guerreros|1884
ELC|ELA|Faroleros|1943
OSC|OSC|Cóndores|1939
MOS|MOQ|Delfines|1876
NUE|NUA|Cementeros|1947
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
COS|CNC|Stahlwerker|1926
ROF|RTB|Raben|1918
TEA|TEA|Gelben|1881
FSF|FSF|Hirsche|1923
EIM|EIM|Brauer|1922
FOB|FOB|Wildschweine|1902
SPH|SPH|Gladiatoren|1879
VII|VIZ||1903
TTN|TNI||1983
MUB|MUV||2008
FSD|FSD|Köhler|1892
AHR|AHR|Lotsen|1894
KRO|KRO|Kumpel|1893
HAK|HAK|Roten|1889
BRT|BRT|Tuchmacher|1888
EIE|EIE|Blauen|1930
HIR|HRS|Seeadler|1886
ALO|ALN|Gelben|1899
KLA|KEI|Schwäne|1908
SPV|SVG|Adler|1909
BLA|BLA|Hirsche|1892
UNH|UNH|Eisenmänner|1922
GRB|VGB|Schwarzen|1883
HND|HND|Hüttenknappen|1871
TED|TED|Ritter|1884
SCR|SCR|Kreuzritter|1897
BUG|BGD|Kormorane|1930
QUI|QUI|Tisserands|1963
LUN|LUN|Lynx|1898
AJC|AJC|Lions|1969
JOY|JOY|Mouettes|1904
USM|USM|Gladiateurs|1899
ESB|CAS|Corbeaux|1964
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
CHR|CHL|Renards|1894
CEA|SCC|Gladiateurs|1912
CTE|CEA|Sangliers|1954
BEU|ACB|Forgerons|1908
CAF|CAF|Sentinelles|1930
DIA|DIA|Canonniers|1908
VIE|VIE|Mineurs|1942
BEO|BEO|Loups|1888
SRL|SRL|Faucons|1920
AJR|AJR|Cigognes|1878
LNN|LNN|Cerfs|1883
DUR|DUR|Blancs|1907
SRR|SRR|Rouges|1952
CHA|CAE|Loups|1880
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
SER|SEA|Bianchi|1926
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
PRS|PSM|Diavoli|1906
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
CAM|CAV|Veados|1889
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
CAS|CST|Halcones|1910
DFN|DFN|Zorros|1971
REQ|REQ|Pioneros|1925
GAP|GAP|Cóndores|1907
NCN|NCN|Arrieros|1903
PEC|PEC|Panteras|1943
FRC|FRN|Ferroviarios|1912
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
LAK|BEE|Maples|1940
FRT|FRT|Pioneers|1963
FOF|FOF|Ospreys|1977
SPR|SPR|Rockets|1938
EAG|HAM|Whites|1936
BLU|BLU|Rockets|1914
HIC|HIC|Eagles|1941
CED|CED|Blacks|1975
BEA|BEA|Fishermen|1985
PIN|PIE|Reds|1927
WHI|GRN|Maples|1913
ASE|ASE|Oranges|1920
GOP|GOP|Dragons|1948
CAN|CAN|Gunners of the Shire|1928
MAP|MPL|Maroons|2001
BLS|BLS|Greens|1979
SUS|SUS|Sparrows|1960
PNF|PNF|Whalers|1920
SUM|SUM|Windmills|1961
REN|REN|Storm|1968
GRU|GRU|Brewers|1989
PRA|PRT|Wrens|1968
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
CHU|CHA|Magpies|1904
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
SIN|SIP|Tigers|1913
SAU|SAU|Lotus|1973
UBU|UBU|Rockets|1925
KHA|KHA|Reds|1952
KHP|KHP|Garudas|1978
UBC|UBC|Knights|1946
WAN|WAN|Ravens|1926
PHU|PHU|Comets|2003
SKL|SLE|Cobras|1961
MUA|MUG|Naga|1984
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
SHO|SHG|Colliers|1919
UMU|UMW|Blues|1925
IKU|IKU|Vikings|1964
SHA|SOO|Yellows|1985
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
NAM|NJH|Cigognes|1923
SPI|SPE|Meuniers|1983
SIO|SIO|Verts|1954
NED|NED|Verts|1916
CHB|CTX|Léopards|1989
NAH|NAH|Rouges|1974
USO|UOE|Gazelles|1964
USA|UAM|Lions|1973
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
OOS|OOF|Pioniers|1942
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
SPA|SVX|Racci|1915
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
HAV|HVD|Svaner|1900
STN|STN|De Blå|1880
FRM|FRM|Rever|1895
FJO|FJO|Ulve|1910
FRD|FEM|Hjortene|1892
SNX|SNX|Gladiatorene|1880
RIN|RIF|Pionerer|1898
FRN|FRD|Vikinger|1897
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
NRD|NOD|Hvalene|1915
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
GEN|GRM|Raben|1866
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
MOB|OTA|Stags|1938
MOT|MOB|Koalas|1901
CFF|CFF|Sparrows|1972
NOW|BLE|Penguins|1920
TAM|TAM|Emus|1978
BAS|BAS|Crocs|1988
PRT|POC|Blues|1954
COM|COM|Vikings|1924
BAR|BAR|Halászok|1932
GYO|GYO|Úttörők|1944
DUN|DUN|Hollók|1926
ZAL|ZAL|Sólymok|1910
SRT|SRT|Kékek|1966
GYA|GYA|Medvék|1973
BAV|BAV|Bordók|1910
ORS|ORS|Bányászok|1951
KAL|KLD|Rókák|1933
ZAF|ZAF|Gladiátorok|1919
NGY|NGY|Sirályok|1931
ORR|ORR|Vörösök|1979
LIS|LIS|Harps|1881
LIW|LIW|Pitmen|1884
ORA|ORA|Brewers|1950
COU|CTL|Grecians|1960
NEW|NEW|Buzzards|1929
POC|PCG|Hurlers|1946
ATH|ATH|Gaels|1939
SLI|SLI|Corsairs|1883
NWL|NWL|Blues|1891
CAK|CAK|Rebels|1898
TAL|OXS|Emeralds|1885
LLA|LLA|Ravens|1900
DOC|DLG|Potters|1930
CLY|CLY|Quarrymen|1886
ABE|ABL|Brewers|1878
CAH|CAH|Colliers|1947
BLN|BAT|Dragons|1902
BLW|BWY|Whalers|1952
PEN|POU|Miners|1926
TEN|TEN|Reds|1916
BNG|BGO|Harpers|1892
BAH|BDD|Drovers|1911
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
TAF|WAI|Yellows|1916
QAM|SIS|Yellows|1942
ZAH|JWQ|Reds|1936
AIN|RIC|Sandstorm|1966
WAD|WDI|Camels|1986
TAT|SAY|Greens|1967
RAS|IZZ|Greens|1997
SHJ|SSX|Reds|1912
KAA|WAS|Hawks|1941
TAH|SWJ|Greens|1980
WAI|AIH|Oryx|1920
MAW|STX|Nomads|1983
QIM|SAH|Tigers|1930
NIM|BAQ|Falcons|1972
AAD|RUS|Eagles|1948
NOU|AWH|Desert Foxes|1967
KHL|WRS|Lions|1999
BAN|TEL|Sky Blues|1976
TAJ|TEM|Yellows|1928
BAM|TLM|Oranges|2008
BND|BYL|Sailors|1989
LTJ|TER|Reds|1928
KAM|SOY|Oranges|1988
TMN|LOL|Tigers|1918
TES|PLG|Blues|1920
LTS|PUG|Lions|1977
TAN|SRI|Biru Langit|1950
BUK|PDP|Crocodiles|1933
PUL|UIT|Helang|1940
SIM|SEI|Buaya|1927
SIP|PUL|Biru Langit|1986
TEL|LAT|Biru|1943
TEP|DAM|Elephants|1922
SUP|UIK|Kuning|1906
SRI|SEJ|Kuning|1941
SIT|DEJ|Helang|1939
PUT|MUJ|Eagles|1948
PUA|UIP|Kancil|1958
SMP|PUS|Rockets|2008
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
THH|STP|Hornbills|1913
BAO|CLV|Phoenix|1934
SOH|KOT|Warriors|1937
KED|KED|Warriors|1930
LAF|LAF|Oranges|1919
PER|PER|Hornbills|1899
PSP|PSP|Tigers|1955
PES|PRS|Buffaloes|1956
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
PSA|PSW|Eagles|1961
PUR|PUU|Yellows|1990
BIF|BIN|Warriors|2008
BIW|BIW|Whites|1982
BAG|BGY|Elephants|1927
PAS|PYA|Reds|2008
BAW|BGL|Dragons|1934
MAF|MAG|Eagles|1952
PAF|PFX|Yellows|1942
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
VRE|VRC|Colliers|1963
THF|THB|Whites|1930
BET|BET|Weavers|1914
ULU|ULB|Lions|1980
ZFR|IDK|Lions|1922
NJH|SAH|Nomads|1935
NIL|DEL|Sky Blues|1917
TAW|KAF|Oryx|1939
SLM|TAW|Knights|1938
ITT|PTR|Camels|1914
FAU|LUX|Palms|1971
KAF|ZFR|Tigers|1961
DAM|QEN|Sultans|1986
POT|MAH|Sandstorm|2008
TAI|ABU|Reds|1965
ITA|SUA|Sandstorm|1981
SOF|BSC|Foxes|1994
BEI|PMX|Lions|1936
ZOH|BNI|Divers|2003
ITD|ANX|Dunes|1971
HIL|KFR|Stallions|1934
SUA|PBQ|Tigers|1960
MOE|KAS|Chacals|1928
MNE|ESK|Rouges|1927
VND|GAF|Rouges|1921
ESA|USG|Aigles|1909
BEE|JST|Lions|1987
SAO|URX|Fennecs|1939
UMV|EOB|Faucons|1967
SCB|UHX|Chacals|1972
BOU|EOT|Gazelles|1945
CHF|JSR|Palmiers|1902
NAE|BEM|Faucons|1967
ETM|SBG|Marins|1949
NNC|KEC|Gazelles|1937
NNE|JMX|Rouges|1988
TAB|TBN|Cheetahs|1932
TAC|TAC|Reds|1897
SAM|SMK|Sky Blues|1923
RUV|RUV|Yellows|1995
MRM|MRO|Buzzards|1974
TBT|TBT|Miners|1937
TBK|TKI|Warriors|1923
MTW|MTW|Yellows|1970
KIS|KBN|Elephants|1961
KIG|KIG|Eagles|1935
SOC|SGA|Elephants|1986
SMM|SMM|Simbas|1913
MRT|MRT|Reds|1898
KBG|KBO|Eagles|1917
YOU|YOU|Blues|1964
KIU|KIU|Stars|1961
CHV|UST|Dromadaires|1901
THR|ESH|Rouges|1932
THI|ASO|Chacals|1938
AJM|NMY|Fennecs|1899
NAF|BOK|Fennecs|1928
MIO|ASH|Sahariens|1928
BEC|USK|Blancs|1968
SPC|MBB|Gazelles|1926
MNV|MCT|Aigles|1927
TRL|BFX|Lions|1959
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
PAE|PIX|Titánes|1973
PAL|PNT|Léontes|1968
GXX|GXX|Gladiátores|1934
PAT|PTH|Kaloyéroi|1917
AKX|AOY|Psarádes|1942
AEK|AEV|Spartiátes|1985
AOM|AOA|Ippótes|1945
AOB|AOB|Plavi|1899
KAS|KAM|Pivari|1926
TUR|TUR|Beli|1912
RAO|RAO|Lavovi|1922
RUD|RUB|Hajduci|2008
PAP|PAT|Ribari|1985
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
DYY|NYI|Gruvarbetarna|1903
SYD|LNS|Gröna|1903
MET|VIV|Minerii|1919
STI|ALA|Lupii|1990
ZEN|PET|Albaștrii|1929
SPD|VAT|Leii|1934
SPK|OLI|Zimbrii|1927
MEL|DRE|Pescarii|1922
DNJ|ACS|Pescarii|1966
AOL|MEZ|Șoimii|1930
DOU|MET|Vulturii|1921
KAU|GLB|Zimbrii|1928
BRS|MTL|Lupii|1909
RAN|ACZ|Albaștrii|1952
KSP|CMS|Minerii|1911
DOJ|PGR|Șoimii|1942
RAB|MEA|Leii|1966
LOK|ELZ|Albaștrii|1939
VLD|VAC|Alcarraza|1926
ARO|ARO|Rayos|1925
AOA|ARC|Lobos|1922
HIN|HIN|Negros|1950
VAE|VLD|Búhos|1932
POD|POD|Lobos|1898
MAD|MAY|Potros|1942
TLR|TAL|Águilas|2005
LIU|LIU|Vaqueros|1913
GUD|GUD|Cóndores|1982
GDR|GUE|Delfines|1913
ATO|ALJ|Blancos|1931
LIR|LIA|Jaguares|1941
ARN|ARN|Azules|1938
SNT|SAN|Leñadores|1925
ROB|ROA|Halcones|1967
ESU|ESO|Potros|1894
DEO|DEO|Pampas|1921
RGT|RES|Arrieros|1909
PUF|PUF|Leones|1999
RDD|RDD|Matadores|1921
VEC|VEC|Ñandúes|1890
SPL|SLX|Gladiadores|1893
INB|INB|Azules|1945
CST|CNA|Delfines|1905
SRN|SNI|Cruzados|1889
RDL|RDL|Tamberos|1917
ESE|EDI|Gladiadores|1948
DEE|DNS|Rayos|1922
SIV|CSB|Lobos|1968
GMN|GMN|Matadores|1900
SVO|SPO|Halcones|1922
VAB|VAB|Panteras|1917
POS|POZ|Toros|1921
CAA|CBR|Rojos|1900
PEB|PED|Rojos|1916
PZA|PZA|Pastores|1894
CRA|CRA|Verdes|1911
GND|GND|Blancos|1908
MAE|MRB|Gladiadores|1896
VAD|VAD|Mulas|1922
ORI|ORL|Toros|1933
BAI|BAI|Arrieros|1900
FNT|FUT|Halcones|1904
CEV|CEV|Delfines|1903
ELU|ELU|Titanes|1962
NUM|NUM|Cóndores|1950
LUC|LUS|Alcarraza|1966
TAU|TAU|Jaguares|1961
CNJ|CUJ|Leñadores|1954
BAJ|DBA|Tejedores|1917
NUT|NUT|Mineros|1894
BRB|KMF|Voyageurs|1973
GRN|HMH|Reds|1931
BON|CEF|Moose|1969
HOR|KMT|Reds|1957
TIV|GLM|Greens|1922
COD|GLY|Maples|1978
CLW|SAS|Grizzlies|1942
HAY|DUA|Maples|1974
BUA|AIN|Gazelles|1940
IZZ|BAH|Knights|1989
MAJ|YAS|Stallions|1989
JAA|BAC|Pearls|1939
WAT|SAC|Reds|1986
JEA|SHB|Camels|1957
YAQ|SHY|Eagles|1907
SHQ|SHJ|Oranges|1948
RIM|KUS|Nomads|1935
DHA|BUR|Horsemen|1954
HUR|KRA|Lions|1978
NAW|BUC|Falcons|1922
FAA|SHM|Camels|1945
SHB|SHA|Horsemen|1975
MES|MES|Tigers|1911
NAS|NAS|Camels|1915
GOS|GOS|Gazelles|1929
FAJ|FAJ|Horsemen|1934
PAY|PAY|Sultans|1932
ZOB|ZOB|Yellows|1999
NSS|NSS|Foxes|1915
NFT|NAT|Eagles|1914
PSY|PSY|Falcons|1916
GOB|GOB|Knights|2007
PYK|PYK|Sandstorm|1903
MOH|MHM|Blues|1939
SEY|SEY|Lions|2008
BAB|BAB|Yellows|1941
FAB|FJR|Lions|1985
SHD|SDS|Hawks|1956
IHS|MUS|Whites|1988
BHY|MUA|Reds|1997
UMM|WAD|Reds|1977
ULI|SOH|Horsemen|1954
GHA|SHZ|Sandstorm|1899
RIY|SHQ|Lions|1944
DIR|SHW|Caravans|1926
AIM|ZLR|Yellows|1930
BUU|SHE|Hawks|1926
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
WUJ|LIN|Whales|1932
BAF|CHF|Tigers|1914
SHE|KAU|Lions|1983
CHN|HYN|Eagles|1925
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
INI|INS|Lancers|1946
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
GYB|GYN|Dragons|1916
BAD|BNR|Comets|1950
NAB|NAE|Foxes|1918
SIC|SIU|Lancers|1977
DOA|DOH|Tigers|1948
CHJ|CHJ|Pioneers|1943
BUB|BUU|Reds|1948
MUN|MUT|Blacks|1923
JIA|JIN|Stags|1917
WOG|WOP|Bears|1964
MUC|MUB|Buffaloes|1914
RAT|RAU|Crocodiles|1927
PAA|PKN|Pioneers|1936
THC|THP|Yellows|1944
BAK|BAE|Hornbills|2008
KAO|KPR|Ravens|1916
NOB|NOG|Greens|1974
SII|SII|Oranges|1996
PAB|PKP|Lions|1975
MAG|MUX|Dragons|1940
PAI|PKM|Warriors|1987
BEK|BAX|Blues|1955
BAE|BCX|Foxes|1966
UBB|UBR|Stags|1954
PHR|PHR|Sharks|1925
TAS|TKB|Reds|1982
PEA|PTX|Naga|1927
PEE|PSI|Lotus|1914
PSS|PSA|Blues|1944
PSI|PEB|Garuda|1918
KEA|KEP|Dragons|1929
SOL|SLB|Naga|1921
BOA|BOF|Garudas|1962
KEN|KEU|Garuda|1924
PUB|PUR|Greens|1930
PPS|PSS|Crocodiles|1929
PUN|PUA|Buffaloes|1930
SUB|SRJ|Eagles|1917
PEP|PEG|Greens|1974
PEF|PBX|Lions|1965
PSC|PSR|Elephants|1935
PAD|PML|Panthers|1915
PUC|PUP|Panthers|2000
BHB|BHB|Sharks|1954
PSM|PSL|Hornbills|1971
BHI|BTI|Elephants|1930
THD|SNP|Cranes|1949
THP|CLD|Oranges|1942
CAD|THN|Sharks|1970
KHB|CLN|Cranes|1916
BAP|TLS|Blues|1952
BAQ|THM|Phoenix|1989
TEC|SAI|Lotus|1954
THG|SAI|Garudas|1956
BIA|TSF|Dragons|1957
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
SAE|SUG|Blacks|1898
VAA|VDW|Whites|1928
PIE|PIR|Marineros|1916
PIO|PID|Alfareros|1915
OLD|OLA|Tiburones|1909
ELA|ELC|Alacranes|1907
RIB|RIB|Halcones|1904
SEA|JUS|Leñadores|1898
PLC|PLR|Segadores|1914
CAG|CAI|Zorros|1921
GAA|GAU|Cruzados|1894
ALF|ATO|Celestes|1932
ARB|ARL|Búhos|1916
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
TAX|SAN|Cóndores|1932
PEG|PDL|Rojos|1934
FRB|FES|Gladiadores|1929
ALG|RCA|Corsarios|1974
LUA|LUU|Amarillos|1977
BEB|BVA|Titanes|1929
LAC|MDE|Cóndores|1974
TOA|JUU|Toreros|1944
POB|PZT|Gauchos|2007
VIA|VIJ|Corsarios|1952
GAO|GAE|Alacranes|1934
LAV|LVN|Pescadores|1937
LAH|LAV|Cóndores|1906
ARE|STI|Hornero|1910
CLA|INI|Corsarios|1905
URA|URI|Amarillos|1912
URI|ESD|Marineros|1950
ESC|ECA|Zorros|1949
HER|DEH|Azules|1978
FRF|FRO|Toros|1929
TOZ|TOC|Celestes|1973
SAJ|SRO|Lobos|1987
REB|RGA|Leones|1940
DAL|DAU|Panthères|1932
DAU|USD|Lynx|1923
LOU|LOU|Lions|1924
OLY|YAO|Blancs|1989
MAU|MNR|Sentinelles|1964
ACA|ACD|Crocodiles|1967
BOC|BNC|Gazelles|1930
ZIG|UZX|Comètes|1953
ZIR|ZIM|Bûcherons|1952
TAA24|UTX|Éléphants|1972
MAO|ETI|Mimosas|1948
DAK|DAF|Forgerons|2002
SUH|SUH|Trout|1920
WAR|WAH|Reds|1934
SEK|SEK|Yellows|1964
AKR|AKU|Yellows|1941
ADA|ADH|Leopards|1953
ANO|ANO|Miners|1939
TAB25|TKM|Greens|1970
SUC|SUU|Blues|1932
WAB|WRA|Rams|1913
EFF|EFF|Porcupines|1958
KOH|KOH|Lamplighters|1983
KOM|KOM|Reds|1916
HOA|HOG|Elephants|1988
YEA|YEH|Buffaloes|1975
ACE|ACA|Comètes|1899
KAD|KAO|Verts|1937
SPE|SPY|Canonniers|1984
LOL|LSS|Rouges|1926
DCK|DKL|Panthères|1960
BOK|USQ|Panthères|1925
YAA|YMS|Mimosas|1955
AIE|ACF|Écureuils|1913
YAO|USY|Crocodiles|1929
ASC|ASC|Buffles|1913
DAO|DLR|Corbeaux|1990
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
TOC|USW|Noirs|1977
BOD|BKD|Bleus|1952
MAX|MSS|Aigles|1946
ZIA|ETZ|Chacals|1928
NOC|UNK|Hippopotames|1930
NAL|ETN|Buffles|1936
ZIZ|ZIG|Rouges|1900
PET|PTT|Antilopes|1944
BOE|BDN|Éléphants|1984
BOF|BBL|Aigles|1953
DIO|DIO|Buffles|1961
YOP|YOP|Antilopes|1955
KIC|KIM|Panthères|1949
ZIO|ZIF|Gazelles|1989
LAJ|LAR|Hyènes|1940
OUS|OUS|Crocodiles|1937
OUO|OUA|Léopards|1936
TAC26|TMD|Rouges|1915
KAE|KYR|Rhinocéros|1934
SED|SSS|Lions|1919
KAN|KND|Verts|1944
MBU|MBO|Antilopes|1951
SAV|USX|Faucons|1969
BAT|BGU|Éléphants|1989
DOB|DKD|Jaunes|1984
YSO|YSS|Faucons|1984
PIB|PEZ|Aigles|1947
NOO|USU|Faucons|1937
NOD|NOO|Léopards|1939
NZU|USZ|Aigles|1954
MAZ|MNB|Léopards|1910
KOR|KOR|Hippopotames|1923
TOD|TDL|Bleus|1920
MLB|MAX|Jaunes|1918
MSA|MTK|Panthères|1923
KID|UKX|Verts|1966
LAL|LBD|Éléphants|1997
DIE|DGR|Pythons|1912
BYA|BOY|Baobabs|1924
MBE|MBU|Hyènes|1920
MRE|MBG|Rouges|1900
BOH|BKM|Hippopotames|1920
NZM|EOI|Rhinocéros|1950
TUM|ETT|Panthères|1938
TAD27|TMN|Chacals|1985
BAX|BMK|Faucons|1929
TIA|TBI|Pythons|1965
MOP|MPN|Buffles|1921
ZIE|ZGN|Léopards|1953
BAZ|BMT|Éléphants|1979
MKO|MKO|Rouges|1944
VIF|VLS|Verdes|1937
GDD|GDV|Cabras|1904
LAP|ETE|Onças|1928
AMC|AMR|Pastores|1932
VIG|VIQ|Oleiros|1979
POE|UPD|Cruzados|1985
VIH|VOU|Cegonhas|1964
POO|PDC|Raposas|1932
VAG|VAF|Rubro-Negros|1935
BRC|BRM|Azuis|1983
VIJ|UAO|Lavradores|1916
OSS|OBD|Águias|1912
MIB|ASM|Marinheiros|1979
AVA|RSA|Corsários|1958
ALV|AVO|Amarelos|1986
AVE|ERT|Tubarões|1949
ACO|ACI|Corvos|1899
GGD|GLX|Faroleiros|1941
FER|FEO|Cabras|1941
NAP|NVL|Mineiros|1939
POF|PTA|Corvos|1946
COC|UNF|Amarelos|1934
PRY|PRY|Lvy|1897
BUC|BUK|Zubry|1913
KOA|KOL|Metalurhy|1963
STC|STT|Chorni|1922
KRE|KRF|Sokoly|1902
AKC|AKD|Haidamaky|1976
HAA|HNY|Orly|1929
KAG|KAN|Sokoly|1951
PRB|PRK|Zhovti|1913
CHK|CHK|Syni|1938
KAH|KMY|Charivnyky|1934
NYZ|NYZ|Vovky|1927
POG|PDI|Hirnyky|1935
POH|POI|Lvy|1975
AVD|AVH|Vovky|1962
CHL|CNO|Kozaky|1969
ZEA|TJP|Levy|1908
MLT|TJG|Červení|1914
RUA|TSX|Žltí|2008
KRA|MFS|Sokoly|1935
MST|SPD|Sokoly|1910
SLB|MVX|Červení|1983
DIN|JEN|Červení|1926
ZEB|ISC|Medvede|1959
ZER|LOA|Baníci|1918
MEA|SOJ|Orly|1937
MTU|ISK|Rytieri|1935
RAA|HUT|Železiari|1939
SLE|VET|Jeleni|1928
PEH|NKA|Železarji|1938
PAG|NBX|Rudarji|1919
NOV|NKS|Modri|1911
PAH|KOV|Orli|1928
NOE|ZLZ|Ribiči|1947
LIP|RUA|Medvedi|1955
SLO|SVA|Volkovi|1960
LOA|PTI|Rdeči|1926
HRA|NDZ|Sokoli|1989
SGA|SLZ|Bikovi|1935
ZEO|LOZ|Sokolovi|1902
DOD|DLN|Bikovi|1919
DOE|LOD|Plavi|1928
ZEC|ZLV|Vrane|1917
DOF|LOI|Rakete|1944
ZAB|ZAU|Rudari|1987
MAA24|KSM|Crveni|1972
LOV|LMO|Pivari|1961
DID|DNJ|Zeleni|1945
ZET|KFL|Të Bardhët|1897
MEC|LOO|Kalorësit|1901
ZAR|PAM|Skifterët|1933
MAB25|PAZ|Shqiponjat|1906
HRY|SON|Të Kuqit|1939
DIH|MIA|Të Kaltrit|1904
MIY|SQI|Skifterët|1943
MLS|DRV|Dhelprat|1916
RYB|KFG|Të Gjelbrit|1920
ZED|PNI|Të Gjelbrit|1961
VEB|NKV|Sokolovi|1938
SLD|SLR|Medvedi|1926
VEY|ZOV|Pioniri|1913
DIV|VED|Crveni|1899
SPF|SPA|Crveni|1943
HVA|HRF|Jeleni|1966
ZIT|ZEI|Rakete|1914
ZEE|ZEC|Zeleni|1945
HRH|HRV|Žuti|1928
LIV|LLX|Vitezovi|1984
MAC26|MEM|Vitezovi|1923
MAI|SVI|Baroni|1908
RAC|RTX|Bikovi|1932
ZEF|ZED|Pivari|1913
NVI|NOJ|Topionice|1939
MLP|MLT|Lavovi|1927
NOF|NVC|Zmajevi|1938
OST|AOX|Crveni|1955
NOL|KSA|Plavi|1926
DRA|DRF|Plavi|1934
HRC|MIN|Lavovete|1899
SLK|MNY|Metalurzite|1931
KRD|MIS|Metalurzite|1934
SCE|MEG|Chernite|1924
MEB|PFK|Sokolite|1933
DIB|HEB|Orlite|1921
DIZ|SEE|Lavovete|1914
MEH|MNI|Orlite|1899
ZLA|SPQ|Chervenite|1951
MLD|BLK|Vulcite|1960
POJ|MIG|Sokolite|1946
BEJ|KYE|Minyorite|1936
LUB|PZV|Minyorite|1974
SLZ|PZI|Vulcite|1958
ASF|UUS|Rautamiehet|1920
STD|SIR|Keltaiset|1926
NEA|PYR|Siniset|1979
ASM|PYJ|Vihreät|1902
FRG|TRM|Karhut|1965
STG|SVL|Punaiset|1972
LAQ|MIF|Ahmat|1910
MAD27|FFY|Sudet|1925
STJ|KRS|Kalastajat|1980
DYA|SSA|Siniset|1986
VED|TMO|Hirvet|1909
NEB|IFH|Metsurit|1925
SYA|HMR|Rauðir|1907
SOE|HAY|Grænir|1919
SYE|HOT|Birnir|1924
HOD|HTT|Hvítir|1930
HEA|GRI|Hafernir|1980
VBY|UMF|Hvítir|1897
LIL|SYK|Úlfar|1923
NND|VIG|Sjómenn|1990
HEK|RTT|Selir|1934
SOG|ROY|Rauðir|1986
NEC|HMA|Úlfar|1931
ALH|BOL|Ernir|1943
TSK|GUR|Lomebi|1911
SAW|TSK|Tsxenebi|1927
MTB|GIA|Mgelebi|1945
OCH|MZI|Arcivebi|1913
TSI|IBE|Lomebi|1980
OCA|IME|Yvitlebi|1970
WIA|TOD|Tsxenebi|1925
MTI|SMG|Mgelebi|1937
OCI|MEN|Arcivebi|1952
OZI|LVI|Tsitlebi|1961
BNE|BNE|Jackals|1926
MBI|MAN|Lions|1900
MAE28|MAE|Camels|1920
REH|REF|Yellows|1900
HAP|HAP|Reds|1899
BEM|BTR|Gazelles|1899
EIL|EIL|Knights|1943
HAB|HPO|Falcons|1909
MAF29|MBI|Tigers|1911
MNA|MCA|Hawks|1901
HEL|HAX|Hawks|1977
MAG30|MBX|Knights|1912
RER|RHV|Reds|1989
HPE|HPX|Sabras|1929
ZVE|ZVE|Orly|1913
ARZ|ARZ|Krasnye|1928
TRU|TRU|Neftyaniki|1922
ZEV|ZEN|Kosmonavty|1938
KRY|KRY|Orly|1911
ZNA|ZNA|Shakhtyory|1991
LIK|LIF|Kazaki|1923
NIZ|NZH|Sokoly|1927
SHC|SHR|Zubry|1901
ARF|AVN|Zheleznodorozhniki|1912
ZEG|ZEV|Zhuravli|1918
VER|VRK|Zelenye|1950
LSK|LPG|Kozaki|1983
OLI|OLP|Gusary|1960
KIE|KIF|Kosmonavty|1942
VOL|VOM|Neftyaniki|1972
SPG|SBX|Zholtyya|1918
NAQ|NAF|Siniya|1916
GRD|GRZ|Zholtyya|1983
ORB|ORO|Siniya|1904
KAJ|KAC|Hrenadzery|1905
NAR|NTA|Rybaki|1933
SAX|SPA|Arly|1933
SPJ|SPA|Siniya|1969
VEE|VDR|Konnitsa|1910
TOO|TPE|Vauki|1970
SSK|SLF|Zubry|1948
TRB|TRK|Miadzvedzi|1986
GAI|GAI|Royals|1918
GAE|GAA|Crusaders|1901
CLB|CLL|Sparrows|1918
BRD|BRH|Comets|1902
LED|LED|Dockers|2008
CHQ|CFS|Seahawks|1902
GRR|GNM|Royals|1947
ELM|ELR|Dragons|1901
BUX|BUX|Spartans|1981
LIC|TDB|Ironmen|1989
HEH|HEC|Skyhawks|1926
THJ|THT|Scarlets|1970
YES|YED|Rojos|1906
ALJ|ALG|Corsarios|1940
NUA|NUE|Halcones|1913
SAY|SLM|Águilas|1915
SDA|CVI|Leñadores|1918
YEB|YEA|Venados|1930
LID|LIR|Gauchos|1926
VAS|VDA|Verdes|1929
MOC|MRL|Zorros|1925
ALK|JUD|Búhos|1900
ELB|ELH|Alcarraza|1936
ZAC|ZAO|Leones|1953
BAA24|BAJ|Cruzados|1933
BAB25|BAJ|Rojos|1935
COE|CRD|Rayos|1911
COG|CDA|Lobos|1909
MNB|MBA|Cóndores|1923
COH|CDE|Marineros|1907
ALM|JUA|Pastores|1906
BJO|BAJ|Osos|1916
ELD|ELB|Blancos|1951
BAC26|CBC|Leones|1942
MMA|MNA|Corsarios|1937
PID|PIO|Pastores|1986
FUD|SFC|Segadores|1936
ATA|JUO|Lagartos|1911
OLE|OLN|Toros|1931
ALN|ALM|Zorros|1922
NER|NEB|Amarillos|1934
NUB|NUC|Azules|1908
OSA|OSM|Azules|1980
QUB|QNT|Pumas|1948
MOG|MOK|Águilas|1947
OLN|OLD|Tiburones|1938
BAD27|CBP|Tigres|1943
NEE|NRJ|Panteras|1952
VAH|JVX|Rojos|1926
BAE28|BAI|Halcones|1917
REE|SWS|Crocs|1908
STL|MOH|Lions|1929
FEN|MOE|Parrots|1992
REF|SWP|Streamertails|1928
YAB|SPA|Greens|1940
WOB|LNF|Hummingbirds|1924
HAC|CPX|Mongooses|1985
WOC|FUL|Lions|1923
CAV|MBT|Crocs|1958
EXW|PMT|Stingrays|1944
WCK|LFO|Reds|1982
SAZ|HMB|Reds|1985
SEE|SGV|Titanes|1926
SEH|JVN|Azules|1900
LIE|JUE|Amarillos|1910
LDA|LRD|Verdes|1925
POK|PZL|Halcones|1917
PAJ|PLO|Gladiadores|1915
POM|POJ|Pastores|1975
VIV|VIW|Rayos|1973
CAW|RCC|Amarillos|1973
BPO|RBP|Cóndores|2008
YEC|YST|Potros|1938
YRO|JUY|Jaguares|1932
ALP|AAZ|Rojos|1932
ALQ|AAL|Guerreros|1921
VAJ|RSV|Toros|1952
CAX|CLP|Mulas|1952
QUS|QUN|Rojos|1915
TAE28|RCS|Leñadores|1928
ARH|SAN|Tiburones|1979
QES|QUT|Alacranes|1932
LUD|LCL|Amarillos|1982
GAB|GDI|Pastores|1916
YAN|YAN|Tigers|1900
YAI|YAA|Leopards|1951
ESK|EKI|Falcons|1927
JIZ|JIZ|Reds|1924
ANG|ANG|Lions|1987
OLK|OLK|Leopards|1989
NEF|NEY|Camels|1913
NEI|NET|Eagles|1943
NHI|NEH|Tigers|1988
AND|AND|Bulls|1917
TER|TNC|Eagles|1982
KHI|KHV|Wolves|1942
GRF|PLY|Navy|1933
HEX|RTS|Penguins|1957
CRE|PLE|Sky Blues|1979
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
ARJ|SMS|Lions|1914
ULA|DAH|Sandstorm|1920
ALZ|WAB|Blues|1929
ZUL|QRH|Reds|1984
ALA24|UMD|Hawks|1922
ALB25|KHS|Greens|1970
SIG|NRM|Rohelised|1932
SIE|NOM|Metsamehed|1921
KUA|MTE|Sinised|1976
TUK|FCI|Punased|1925
ANY|KUN|Punased|1919
VAK|DUT|Karud|1950
JAU|KLV|Kaluriid|1931
PLU|NOP|Rohelised|1940
ANA|TRX|Kotkad|1930
RAK|JKR|Hundid|1924
ALC26|VAV|Zvejnieki|1936
ALD27|VAJ|Lāči|1991
SIF|ELT|Alņi|1921
NAT|SAL|Ērgļi|1983
LIF|GAJ|Vanagi|1918
SIH|SPA|Zilie|1914
SLC|RUJ|Jūrnieki|1961
VEF|JEK|Vilki|1959
SPM|DBS|Gulbji|1984
RAE|ZIB|Bordo|1941
ALE28|GNI|Ereliai|1929
HAG|PNV|Žalieji|1927
REZ|SPA|Lokiai|1913
TUA|GTA|Vilkai|1915
AAA|SEQ|Raudonieji|2008
HAU|KVS|Mėlynieji|1980
HVB|AUG|Šernai|1986
KUB|GRJ|Gandrai|1923
JEL|ROK|Vilkai|1917
ALF29|UTI|Žirgai|1949
WIB|LOM|Artsivner|1975
RUS|GAD|Dashtner|1904
WIK|GVV|Sarer|2008
OCB|SGX|Aryutsner|1914
GOA|GOH|Aryutsner|1975
WTB|LTI|Dashtner|1926
LOC|LRI|Gaylner|1937
OZE|URA|Sarer|2008
SAA24|ANC|Artsivner|1939
KUT|ARH|Gaylner|1974
ESD|LOY|Qartallar|1911
BUY|QUB|Aslanlar|1899
BUE|SDA|Neftçilər|2001
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
YAC|SPA|Sarylar|1903
TAF29|BYZ|Munaishylar|1981
CHW|ZHU|Kaskyrlar|1925
QAR|BTY|Munaishylar|1934
NHA|BYS|Kyzyldar|1926
JAS|CEO|Șoimii|2000
MIC|SPE|Lupii|1913
MAH31|SPA|Pescarii|1940
PAQ|DCI|Minerii|2006
RUB|LIV|Vulturii|1975
TOF|UNN|Verzii|1968
ZEH|SNS|Minerii|1920
BRE|SPO|Zimbrii|1957
PLE|FED|Ujqërit|1927
KRB|SNJ|Kalorësit|2008
DIC|BSA|Kalorësit|1908
DIF|NAP|Minatorët|1926
SLF|PTN|Të Verdhët|1974
SLG|YLL|Shqiponjat|1961
BOM|KFP|Luanët|1920
RUR|NRI|Shqiponjat|1913
PAV|KOD|Dhelprat|1937
DOH|DRP|Skifterët|1924
BUH|BUG|Adler|1910
ENA|ENI|Dragoner|1914
AIA|AAN|Blauen|1925
KIF|FKX|Adler|1929
HEI|HEU|Rothirsche|1979
TUS|TNX|Wikinger|1982
HAH|HHX|Stiere|1918
BAF29|SBH|Gladiatoren|1931
FUF|FUH|Blauen|1960
GRG|GEI|Kumpel|1927
ALG30|AJL|Sandstorm|1919
JUA|AJA|Camels|1929
ABB|MHY|Caravans|1915
RAF|UMA|Divers|1915
AUA|MDH|Reds|1961
AAI|RSB|Tigers|1980
ALH31|NZY|Falcons|1987
ASH|WSC|Knights|1973
ASG|IBR|Eagles|1974
ALJ32|WSS|Gazelles|1946
BIS|SHA|Tigers|1984
ALK33|JWY|Divers|1900
ALL34|LWR|Reds|1901
ALM35|BHY|Greens|1925
ALN36|SAL|Hawks|1955
ARL|WAC|Palms|1914
BUL|SHA|Falcons|1966
UMA|AJS|Yellows|1945
AJE|WAW|Knights|1958
AWB|FAR|Greens|1924
ALP37|AIZ|Oryx|1922
ALQ38|FLY|Sandstorm|1934
RAG|WAJ|Knights|1946
RIS|FAA|Hawks|1963
RAH|SHA|Falcons|1982
ALR39|UMN|Desert Foxes|1962
ALS40|WJS|Blues|1971
ATB|HLY|Horsemen|1918
QAS|SHA|Blues|1980
ATU|HLA|Tigers|1961
ALT41|AMS|Knights|1919
ALU42|MFY|Palms|1899
AAB|DIC|Greens|1932
RAJ|FLH|Camels|1953
ALV43|UMR|Blues|1987
ALW44|UFC|Reds|1937
RAL|AJI|Sandstorm|1970
WAC|SYN|Camels|1933
AYA|QRY|Stallions|1923
JEB|KEY|Reds|1986
HOE|SHA|Ibex|1978
VIP|BLC|Snow Leopards|1993
HOM|SHA|Greens|1972
DAD|SHA|Lions|1977
AUR|MND|Reds|1951
AAM|MRD|Shaheens|1939
KOB|MMU|Markhors|1966
BEQ|SSG|Markhors|1930
BHC|AFG|Cheetahs|1988
VIQ|DSK|Shaheens|1968
NAX|UTT|Kings|1995
NEJ|DIN|Titans|1901
VAM|UTP|Elephants|1930
SAB25|NOT|Kingfishers|1926
MOJ|PUB|Elephants|1934
CHX|BGN|Reds|1945
KOC|SYL|Sky Blues|1949
JOD|SRG|Dolphins|1941
GUR|BTH|Cobras|1912
BHD|NPR|Leopards|1969
BUN|ISO|Lions|1984
BUM|MOW|Eagles|1928
BUP|MNL|Hippos|1930
WEA|MPM|Buffaloes|1964
WEL|MPI|Buffaloes|1942
BOP|ISM|Hippos|1976
WAH|CIM|Pythons|1932
WIN|MWU|Lions|1936
RYA|PMM|Arrows|1924
WIF|MWW|Warriors|1937
SHG|MSD|Crocs|1910
HOG|MRN|Whites|1901
SHN|MDU|Elephants|1926
CHY|PLU|Whites|1983
DAE|PZH|Yellows|1927
HOJ|MMS|Yellows|1924
SEJ|BIF|Rhinos|1964
LAR|HWA|Lions|1980
DRE|TSA|Chiefs|1971
SHH|RUG|Hippos|1972
CAY|OYA|Tembo|1913
CAZ|OYP|Duma|1928
SPN|NYP|Yellows|1940
BEV|LKE|Nyati|2002
LIG|NNR|Greens|1913
NOG|NRX|Chui|1982
WOE|GAT|Simba|1966
SCC|KSX|Mamba|1927
DUB|MBH|Twiga|1927
FAM|POQ|Blues|1952
HAJ|BSN|Leopards|2002
FOC|WAK|Yellows|1928
MAJ32|WAP|Hornbills|1904
LEW|NAK|Cranes|1920
WAE|WKB|Pythons|2008
FLI|SSE|Hippos|1984
BRH|BGB|Reds|1912
SAC26|KMN|Kobs|1941
PAW|MBM|Buffaloes|1920
BRJ|BBI|Greens|1940
MAK33|ASI|Yellows|1905
WAY|ASJ|Zebras|1930
BPE|LEK|Lions|1930
MAL34|MEP|Walyas|1974
WEF|NKM|Geladas|1980
CHZ|ADL|Yellows|1942
DEB|LKL|Falcons|1944
WEN|JIM|Leopards|1944
WEY|ETJ|Reds|1982
BAG30|ADX|Hyenas|1968
BAH31|BNB|Bleus|1990
DAF|SDX|Faucons|2008
DAG|RDX|Hippopotames|1954
BOQ|BBK|Aigles|1929
KAK|KYD|Pythons|1956
YOA|UYX|Éléphants|1984
BAJ32|USX|Rouges|1933
NOH|NOE|Buffles|1919
DIG|DIU|Léopards|1963
DAH|UDX|Verts|1920
PON|UPC|Verdes|1940
POP|PCF|Amarelos|1907
PAX|PVE|Pretos|1958
POQ|PNH|Azuis|1934
OVA|OVA|Corsários|1934
VIU|VUR|Amarelos|1915
DES|DEI|Pioneiros|1964
TOG|ESQ|Verdes|1981
TOH|TOF|Tubarões|1935
ACB|ACC|Pescadores|1939
BEW|BEV|Titanes|1935
BEZ|BEB|Segadores|1903
ROE|JNT|Azules|1933
COJ|CAX|Rojos|1907
BAK33|DBR|Rojos|1952
CAA24|CPO|Mulas|1948
PAZ|PNE|Gladiadores|1954
ONA|ONT|Caudillos|1955
SAD27|SMI|Rojos|1967
FUG|EES|Gladiadores|1926
HID|HNO|Jaguares|1934
SDB|PEY|Marineros|1978
CEC|CEU|Blancos|1904
POU|PAO|Jaguares|1902
LUE|LUM|Gladiadores|1936
ALX45|ALQ|Mineros|1975
ORC|ONC|Tiburones|1987
CEO|CRR|Jaguares|1953
LER|SAN|Pastores|1932
FRJ|FRP|Leñadores|1941
CTA|CAJ|Rojos|1930
ESF|EER|Zorros|1982
MOK|MCX|Azules|1975
PEJ|PEN|Caudillos|1964
WIL|LOP|Panthers|1986
DAV|GSQ|Reds|1944
HAM|CLU|Blues|1963
CHA24|PLC|Cocricos|1941
MEF|RIA|Blues|1946
CHB25|RII|Ocelots|2008
PAA24|PEH|Steelmen|1948
TIB|SIJ|Scarlet Ibis|1977
HEB|TUG|Reds|1966
HAW|CUC|Hummingbirds|1922
OOA|OOS|Lions|1958
ZUI|VZX|Hawks|1932
NIB|VVN|Bulls|1923
KER|VVK|Rangers|1949
WAJ|HVV|Wolves|1926
VEG|VVV|Miners|1896
GRH|RKG|Falcons|1915
RIJ|RKR|Hornets|1940
HEU|VVH|Stags|1963
MBA|RKM|Foxes|1890
TOL|TOL|Cobras|1960
AAC|VVA|Eagles|1928
BBA|BEI|Bears|1912
WIJ|HVW|Rams|1956
DUI|DUI|Pioneers|1916
ELS|VVE|Rovers|1945
VIW|VIA|Rovers|1919
RIO|RIO|Sailors|1945
SBA|SNT|Knights|1966
MOM|ADM|Lions|1969
COK|COS|Hawks|1954
PRC|PRN|Bulls|1912
VAN|ESU|Rangers|1903
TOJ|TOA|Wolves|1934
RID|GDR|Miners|1959
CBA|ACV|Falcons|1902
ARM|ARI|Hornets|1919
BBB|BAN|Stags|1930
LAT|GDL|Foxes|1942
PIF|PIV|Cobras|1918
SBB|SAB|Eagles|1937
QUC|QUS|Bears|1913
BOS|AAB|Bears|1961
RIE|SER|Rams|1959
POV|ADP|Pioneers|1929
SEM|ADS|Rovers|1908
CBB|CAM|Sailors|1902
SBC|SAA|Knights|1928
VIX|VIN|Lions|1891
SBD|SAO|Hawks|1929
CBC|CAA|Bulls|1954
POW|APV|Rangers|1915
TRI|SET|Wolves|1957
MBB|MTA|Miners|1932
BBC|UNB|Falcons|1892
ITB|ITA|Hornets|1960
CBD|SEC|Stags|1959
JAD|AAJ|Foxes|1960
PBA|PAL|Cobras|1959
MOQ|SEM|Eagles|1905
PEM|APA|Bears|1952
SEN|UNS|Rams|1967
AKD|AKC|Foxes|1922
KAP|KAL|Cobras|1892
YEE|YES|Eagles|1891
TBA|TAS|Bears|1928
GUM|GUM|Rams|1930
ORM|ORM|Pioneers|1944
BOT|BZD|Rovers|1959
CNA|CNX|Sailors|1924
DEC|DEB|Knights|1950
KZL|KZL|Lions|1928
SBE|SAE|Hawks|1916
AYB|AYN|Bulls|1933
ESG|ESN|Rangers|1922
KAQ|KYL|Wolves|1921
MBC|MAV|Miners|1901
ULB|ULU|Falcons|1928
DOK|DOG|Hornets|1899
YLD|YLX|Stags|1966
NOJ|MKS|Falcons|1964
WOH|MKW|Hornets|1905
LIH|KSL|Stags|1934
BRZ|KSB|Foxes|1947
STP|MSG|Cobras|1957
DAJ|LKD|Eagles|1960
KAT|GKK|Bears|1947
ZAD|GKZ|Rams|1919
JAW|GKJ|Pioneers|1946
MOV|LKM|Rovers|1941
PIG|KSP|Sailors|1955
SOJ|LSX|Knights|1935
OSB|KSO|Lions|1952
CZA|KCG|Hawks|1963
WIC|KSW|Bulls|1922
RUE|KRN|Rangers|1895
KAV|LKK|Wolves|1918
RZE|MRX|Miners|1946
FJE|ILF|Rangers|1925
NOK|NRD|Wolves|1918
SKO|SKO|Miners|1897
HAX|HVN|Falcons|1966
BRL|BRE|Hornets|1905
VEH|VEF|Stags|1895
SOM|SOF|Foxes|1936
GRJ|GRF|Cobras|1914
LYS|LYS|Eagles|1941
STQ|SRE|Bears|1954
ELV|ILE|Rams|1913
AUB|AUI|Pioneers|1937
BBD|BED|Rovers|1902
KVI|KVI|Sailors|1925
HOV|ILH|Knights|1944
TIN|TIN|Lions|1942
BJA|BJO|Lions|1967
NOM|NOB|Hawks|1932
SJO|SJO|Bulls|1940
ABD|ALV|Rangers|1906
SKA|SKS|Wolves|1933
LIJ|LND|Miners|1911
HAZ|FFH|Falcons|1924
STT|FFS|Hornets|1909
OSD|OSS|Stags|1937
EKU|EKU|Foxes|1967
FAC|FFF|Cobras|1952
TBB|FFT|Eagles|1939
VIY|IVX|Bears|1932
GRK|FFG|Rams|1967
ANB|ANS|Pioneers|1966
ROG|RDB|Rovers|1910
CRR|CRB|Aigles|1959
USD|USJ|Sahariens|1948
MAM35|MSK|Blancs|1917
MCC|MCM|Verts|1949
TLE|TLE|Dromadaires|1983
MOO|MOG|Bleus|1983
BEA24|ABS|Grenats|1978
MMO|MOJ|Fennecs|1986
CAB25|HSS|Aigles|1982
CCR|CRG|Fennecs|1914
MOW|MSR|Bleus|1960
MOX|MOX|Aigles|1985
JSS|JSA|Rouges|1948
MMC|MTX|Marine|1933
GHB|EGX|Aigles|1965
TIM|TIR|Sahariens|1931
FRK|FRC|Pioneros|1951
NAY|NAL|Rojos|1910
MOY|MOL|Cruzados|1910
CAC26|CAB|Rayos|1932
CAD27|GIC|Osos|1956
MOZ|SPM|Amarillos|1973
REJ|RGT|Celestes|1935
DOP|DOF|Cruzados|1917
DOQ|DOA|Toros|1959
QUD|DEQ|Pumas|1946
PEQ|PES|Granates|1942
MIE|MIC|Azulones|1948
FRL|SPF|Albos|1970
COL|COH|Ñandúes|1950
ARP|AAS|Amarillos|1950
URB|URO|Cruzados|1970
BUQ|ESB|Granates|1946
ROH|INR|Amarillos|1970
GRL|FOG|Blauen|1928
WES|TEW|Roten|1883
NEU|FNI|Roten|1918
UNA|UNE|Roten|1893
CON|COO|Brauer|1934
ROJ|RWH|Brauer|1920
HEC|HEI|Dunkelblauen|1920
COP|COI|Weinroten|1882
BRM|FSB|Bären|1954
TUB|TUS|Rothirsche|1912
STU|STU|Himmelblauen|1904
HEE|FOU|Weißen|1897
NEK|FNL|Bergleute|1911
BRP|BNA|Weinroten|1891
WAL|WLD|Grünen|1878
UNR|UTE|Roten|1924
KHC|KHR|Chornyya|1945
NOP|SNC|Siniya|1930
NEM|NSV|Chyrvonyya|1963
SHK|SKH|Zholtyya|1948
KHK|KHD|Vauki|1935
NEN|NEM|Zholtyya|1972
NAZ|NMX|Blakitnyya|1938
VYA|VYA|Belyya|1925
CHC26|CSY|Siniya|1925
SPP|SPA|Belyya|1911
ENB|ENH|Cyomna-siniya|1941
VEJ|VEI|Vishnyovyya|1961
NAA24|NAF|Vishnyovyya|1934
SPQ|SPA|Cyomna-siniya|1951
CNB|CYN|Hrenadzery|1934
SVE|SVF|Chyrvonyya|1983
VEK|KVV|Geelen|1899
ROY|HOO|Blauwen|1880
KOD|KOW|Geelen|1920
ZUA|ZUI|Bijen|1913
BEB25|BES|Valken|1901
STV|STG|Blauwen|1950
STW|STK|Zwanen|1942
DEV|DES|Zwanen|1931
KAX|KAA|Zwarten|1897
KSC|KSC|Geelen|1933
EXA|EXV|Hemelsblauwen|1917
EXR|EXL|Zeemeeuwen|1917
KRF|KRD|Groenen|1940
ZUO|ZUS|Hemelsblauwen|1952
ROL|WGH|Pioniers|1948
NIC|NIL|Raven|1913
DOS|DOB|Zhaltite|1914
DIJ|SVD|Minyorite|1970
MIN|MIY|Sokolite|1927
DIK|DSX|Chervenite|1948
SAE28|SDL|Chernite|1965
YAD|YNT|Chernite|1981
SEQ|SMV|Orlite|1921
DMA|DOV|Belite|1982
VIZ|VDT|Nebesnosinite|1967
MIF|MYO|Metalurzite|1930
MIV|MIV|Lavovete|1936
BAL34|BKA|Sokolite|1934
DIS|SLW|Tamnosinite|1985
LOD|LTX|Minyorite|1945
MEG|MSP|Chernite|1916
SPS|SPA|Belite|1973
LOE|LGX|Orlite|1972
SEI|SVR|Sinite|1953
CUC|CUU|Rojos|1941
QUE|QUC|Corsarios|1896
LEA|LER|Verdes|1925
GUE|RSG|Verdes|1937
CLD|CRI|Verdes|1972
QLA|ASQ|Negros|1916
VAQ|VAE|Toros|1953
CAE28|CTO|Azules|1949
PAB25|DSP|Negros|1910
LIM|LRL|Granates|1971
ROK|JTU|Mineros|1952
PEU|PND|Rojos|1907
ALY46|ABA|Azulones|1967
NUC|NUQ|Granates|1918
FUH|FUI|Granates|1954
OLF|OLE|Verdes|1907
NIN|NIC|Blues|1974
SHL|SHN|Lions|1970
HUA|HUA|Eagles|1931
FAN|FAN|Tigers|1970
BAM35|BTN|Yellows|1976
NIG|NNG|Maroons|1951
XIN|XIN|Steelmen|1956
GYC|GYU|Whites|1972
MEJ|MEI|Falcons|1938
LOF|LOE|Navy|1978
TAH31|TNN|Maroons|1964
MEK|MEU|Blacks|1975
YUN|YNM|Dragons|1949
DOT|DNG|Greens|1913
RUI|RUI|Blacks|1960
XAA|XIH|Eagles|1918
FRP|FRR|Negros|1912
VAT|ASV|Amarillos|1920
JAR|JAR|Rojos|1962
CUD|CUR|Rojos|1932
RIF|RID|Halcones|1965
LUF|JUT|Azules|1939
VAU|DSV|Azulones|1949
PAC26|PLM|Azules|1952
BAN36|RCB|Amarillos|1919
VLA|VAM|Cóndores|1899
ALZ47|AJB|Titanes|1957
QUF|QTA|Azules|1915
SET|SAN|Celestes|1956
NEP|NEJ|Leñadores|1968
OSE|OSN|Verdes|1959
QUL|QUE|Azulones|1970
LIQ|LIP|Bikovi|1985
PAD27|PAJ|Pioniri|1913
HRB|NKH|Rakete|1920
TOK|TOP|Zeleni|1930
MEM|MEK|Žuti|1941
RYD|RYB|Bikovi|1927
ZEJ|ZEE|Tamnoplavi|1924
BEC26|BLV|Žuti|1984
MLC|MLO|Sokolovi|1913
SLH|MFL|Žuti|1925
THK|GST|Kókkino Krasí|1926
TRO|APT|Kókkinoi|1941
IOA|AOI|Áspri|1977
ARQ|DXA|Arkoúdes|1966
XAI|PNA|Kometes|1930
XAB|PHL|Ouránioi|1968
TRC|ATX|Titánes|1921
TRD|AER|Prásinoi|1976
LAW|PLX|Psarádes|1933
PEV|NIP|Kókkinoi|1941
NAB25|NKI|Mávroi|1983
KYA|PKX|Arkoúdes|1921
PAE28|GSP|Spartiátes|1972
KAZ|GSK|Korákia|1973
AGI|DAX|Léontes|1967
LAX|PIK|Kókkinoi|1911
SPU|SPK|Medvědi|1960
MLN|MLF|Kováři|1917
PRD|VIP|Bílí|1927
SEU|TJS|Žlutí|1917
OLO|SLO|Modří|1983
OLG|OLO|Býci|1913
HRV|SKL|Vínoví|1937
BRQ|TJB|Vínoví|1985
PAF29|SOP|Horníci|1950
VSA|SPS|Modří|1971
LYA|LYF|Vínoví|1971
NYA|NYF|Černí|1964
DOV|DOU|Vlci|1960
PRG|POS|Nebesky modří|1986
PRV|SPX|Rytíři|1952
SPW|SPP|Lvi|1922
BRR|BRI|Hjorter|1896
RIG|RIN|Falke|1928
HAA24|HAV|De Lyseblå|1921
LAY|LAB|Rever|1903
MAN36|MAI|De Røde|1899
NYL|NYL|De Blå|1919
KIH|KKI|Soldater|1904
HAB25|HAB|De Blå|1896
NYN|NYN|De Mørkerøde|1902
KIJ|KLR|Ulve|1904
VEM|VST|De Sorte|1952
BJB|BBR|De Mørkerøde|1943
ORD|ORB|Negros|1979
LUG|LUC|Águilas|1919
PEW|PDN|Tiburones|1940
FDA|FRG|Tiburones|1976
CAF29|CDO|Azules|1922
BJC|DBP|Celestes|1942
ARS|AOE|Granates|1975
PLF|SAN|Azulones|1954
ESH|EAD|Cruzados|1930
TON|UTG|Verdes|1986
ALA48|NSR|Yellows|1914
AAE|NJA|Whites|1974
ALB49|AMA|Camels|1960
ALC50|HIA|Tigers|1914
PEX|PEO|Maroons|1961
ALD51|ZAH|Greens|1946
DAN|DAK|Gazelles|1965
ALE52|WHD|Reds|1913
ALF53|QEA|Sky Blues|1969
ALG54|NHD|Sky Blues|1978
ANC|NOL|Navy|1958
KAA24|KAJ|Sandstorm|1926
KAB25|KAH|Gazelles|1961
MIT|MIU|Lions|1926
ABF|BEP|Yellows|1948
TAJ32|TLO|Navy|1944
PEO|PDX|Whites|1950
KFR|KMS|Whites|1923
ALI|ITT|Lions|1939
MAP37|MAR|Eagles|1970
VAV|VAN|Taivaansiniset|1967
LIX|LIK|Keltaiset|1948
SEV|SKK|Keltaiset|1962
PIH|PIJ|Ahmat|1948
TAK33|TIX|Viininpunaiset|1913
OUA|OSL|Sudet|1970
OUB|OUV|Taivaansiniset|1985
PYR|PYY|Vihreät|1951
VAI|VNH|Mustat|1947
SIS|SSU|Punaiset|1974
TAL34|TAP|Elephants|1910
SEW|SKA|Eagles|1979
KAC26|KSE|Blues|1916
DUC|DUH|Leopards|1978
AKE|AKF|Eagles|1934
BOV|BOH|Reds|1962
NKO|NKO|Sky Blues|1983
DUO|DUP|Elephants|1926
KAD27|KDI|Buffaloes|1978
TEM|TES|Navy|1989
DUD|DNN|Navy|1977
DSI|DUM|Sky Blues|1967
NKE|NKL|Elephants|1969
TAM35|TKR|Whites|1938
BOI|BLD|Porcupines|1946
KUM|KUU|Hearts|1952
PAG30|AEP|Áspri|1916
NAI|PAE|Gladiátores|1958
KAE28|AKX|Ierakes|1960
TRG|TRI|Spartiátes|1911
MEN|AOM|Mple|1987
MAQ38|MAF|Kókkino Krasí|1985
THN|AOT|Ouránioi|1915
AGO|APL|Kítrinoi|1975
KAF29|KAT|Delfínia|1989
AGS|APN|Kítrinoi|1948
VEP|VEV|Sasok|1984
BAP37|BAF|Zöldek|1989
GYD|GYF|Égszínkékek|1979
GRM|GYS|Égszínkékek|1979
VEQ|VSZ|Feketék|1935
KVB|KAE|Halászok|1912
VET|VEZ|Égszínkékek|1925
HAC26|HAJ|Vörösök|1933
TIS|TIS|Kékek|1942
NAC26|NAY|Úttörők|1978
FEL|FEF|Feketék|1920
ORE|ORF|Lovagok|1915
GYY|GYH|Fehérek|1937
KZA|KLH|Gladiátorok|1927
RAQ|RAE|Égszínkékek|1969
RAU|RAS|Égszínkékek|1942
AUC|AUN|Whites|1923
PAH31|PAF|Blacks|1921
BAQ38|BND|Mariners|1969
HUB|HUB|Sky Blues|1923
LUJ|LCG|Navy|1960
AUN|AUO|Reds|1937
MEP|MRP|Peacocks|1947
POX|POV|Yellows|1936
NAD27|NGK|Whites|1928
INC|INW|Blues|1956
KOE|KLG|Warriors|1955
BAR39|BBA|Blacks|1947
SHS|SHS|Reds|1934
HAD27|HAO|Reds|1940
SAF29|SNA|Eagles|1990
HAE28|HAA|Navy|1941
ESL|ESL|Lions|1950
SAG30|SAN|Sandstorm|1981
MSI|MSX|Eagles|1961
PAJ32|PAQ|Maroons|1962
SHT|SHA|Sandstorm|1955
NAE28|NAB|Lions|1946
ESM|ESM|Navy|1985
SAH31|SYX|Reds|1923
SAJ32|SQX|Greens|1957
MOA24|MMM|Greens|1982
SAK33|SAN|Camels|1961
SEX|SEZ|Greens|1957
PAO|PKA|Camels|1927
PAK33|PAW|Gazelles|1949
TRH|TRR|Sky Blues|1919
BAS40|BAW|Tricolours|1950
NEQ|NER|Sky Blues|1925
TUC|TUB|Clansmen|1922
POY|PGC|Blues|1926
WID|WIC|Hurlers|1876
MAR39|MLR|Blues|1952
CAG30|CSR|Clansmen|1896
ENN|END|Blacks|1880
PRH|PMC|Reds|1937
HAF29|HPL|Blues|1938
HAG30|HOE|Crimsons|1975
MAS40|MCC|Knights|1978
KIM|KIY|Tigers|1926
HEF|HEL|Sky Blues|1982
MAT41|MNX|Blues|1924
IRO|IRO|Blues|1952
HAH31|HMU|Yellows|1943
HAJ32|HOX|Falcons|1952
BNA|BNS|Navy|1974
BNI|BNK|Crimsons|1921
MBD|MAC|Tigers|1956
MAU42|MAC|Greens|1983
HAK33|HTU|Navy|1974
BED27|BIT|Eagles|1941
BNK|BNP|Lions|1951
POA24|PKU|Reds|1920
KAG30|KTL|Reds|1950
NAF29|NNN|Kifaru|1917
BUT|BUZ|Yellows|1961
LAZ|LKP|Greens|1971
LAA24|LAJ|Maroons|1930
MOB25|MMP|Greens|1965
MOC26|AMK|Reds|1943
POB25|PMU|Reds|1949
MAV43|LMP|Blacks|1957
MWU|MWH|Duma|1933
MAW44|MSE|Whites|1938
LOG|LDU|Simba|1982
RUK|RUU|Twiga|1928
KIP|KBR|Sky Blues|1929
MBF|MBN|Yellows|1938
MNC|MOU|Navy|1931
SAL34|SML|Nyati|1982
MRA|MFX|Yellows|1962
LKE|LAQ|Nyati|1969
PEY|PEM|Badak|1925
PEZ|PRM|Merah|1987
PTA|PEJ|Kuning|1927
PDR|PDM|Marun|1917
BAT41|BAM|Hijau|1953
INH|INJ|Rusa|1930
SEZ|SEH|Kancil|1928
PEA24|PMA|Gajah|1942
SRA|SRS|Harimau|1923
DAP|DMA|Gajah|1918
PEB25|PLI|Putih|1918
MEQ|MTI|Marun|1936
SEA24|SER|Marun|1914
SBF|SBF|Enggang|1912
UNB|UNV|Negros|1939
UND|UNC|Verdes|1939
PAL34|PAP|Azules|1905
COQ|CTP|Blancos|1929
YAU|YAU|Alacranes|1930
ZAJ|ZAC|Verdes|1930
CAH31|COD|Amarillos|1957
TOS|TOO|Pioneros|1905
HAL34|HAC|Gallos|1898
OCC|OCF|Amarillos|1894
AZU|AZU|Blancos|1937
LOH|LOT|Guindas|1916
URC|URC|Negros|1941
URN|URF|Azulones|1959
VEU|VEO|Verdes|1939
YAL|YAC|Pioneros|1909
MEU|UMX|Faucons|1960
OLH|OUL|Jaunes|1928
SPX|SPI|Noirs|1915
AIB|USA|Verts|1955
CHD27|CHB|Bleus|1963
OUE|OUE|Lions|1963
CHE28|CBA|Gazelles|1969
OUJ|USO|Faucons|1925
SIJ|USI|Jaunes|1981
KHD|KHU|Ciel et Blancs|1919
BEE28|BIA|Ciel et Blancs|1983
SPY|SIV|Cèdres|1955
OLJ|OUJ|Rouges|1955
OOU|OUO|Bleus|1940
CHF29|CSK|Noirs|1943
SIQ|SPO|Verts|1921
OGB|OGB|Lions|1968
OSH|OSH|Greens|1967
SHV|SHO|Reds|1932
UMB|UMU|Yellows|1966
OWA|OWA|Chiefs|1977
AWC|AWR|Reds|1986
OWO|OWO|Maroons|1969
ILU|ILU|Sky Blues|1982
SNG|SOT|Whites|1927
BAU42|BDW|Reds|1953
KAH31|KAD|Porcupines|1919
ONO|OWP|Reds|1939
OWI|OWI|Chiefs|1917
MRI|MRI|Chiefs|1971
SAM35|SGR|Porcupines|1968
AKF|AKE|Warriors|1945
SAN36|SGK|Yellows|1967
NSA|NSA|Chiefs|1929
ILO|ILO|Maroons|1913
EDA|EDU|Wolves|1951
HAM35|HRT|Kings|1953
FEA|FEN|Ironmen|1933
WAK|WAV|Dark Horses|1959
FLA|FLI|Kings|1924
GRQ|MLC|Owls|1930
MEV|MRW|Greens|1957
REK|RBY|Burgundies|1961
KES|KEE|Blue Army|1961
OXH|OXH|Workmen|1953
OAK|OAU|Crimsons|1957
WHA|WHH|Grecians|1936
EPM|EPM|Bluebirds|1976
MOD27|MOC|Albos|1960
FRI|FRF|Amarillos|1966
FEB|FEI|Rojos|1982
NAG30|NNA|Titanes|1974
PDA|PLL|Verdes|1931
LAB25|SPZ|Granates|1943
NTO|NTX|Azules|1972
REL|RTA|Celestes|1950
HEG|HEA|Celestes|1987
CUI|CTU|Azules|1970
ORT|ORC|Amarillos|1952
ANE|SPO|Zorros|1930
QAA|QRR|Amarillos|1967
FOD|RDF|Rojos|1956
HEJ|GIH|Amarillos|1913
RAV|REO|Toros|1931
ONB|ONA|Verdes|1975
ALH55|ALI|Cóndores|1979
MOE28|MOT|Alacranes|1937
VIA24|VLL|Negros|1932
CEE|CEG|Celestes|1971
MOF29|SMB|Halcones|1924
VAO|VLE|Blancos|1924
FRQ|FNO|Azules|1949
LES|LEA|Negros|1928
LIY|JLX|Azulones|1941
NUD|NUF|Azulones|1931
ALJ56|AAR|Azules|1950
BAV43|JBX|Amarillos|1947
CUF|CUD|Rayos|1949
FNA|FGA|Verdes|1990
OLL|OME|Corsarios|1929
ALK57|SAQ|Blacks|1918
ABG|BHR|Tigers|1916
ASJ|ASX|Lions|1935
WAM|WMC|Blacks|1946
AWD|WHT|Camels|1922
RIH|RIS|Foxes|1928
MUS|MSY|Eagles|1977
ALL58|AFX|Blacks|1978
PUD|PEF|Grena|1946
DIM|DRI|Negrii|1953
MAX45|MRE|Albii|1927
PRL|PRU|Șoimii|1976
GLO|GLO|Negrii|1931
MAY46|VCT|Minerii|1927
NOQ|NOU|Vulturii|1913
ELE|ELM|Albii|1971
NOS|VNC|Leii|1966
BAW44|BCS|Vulturii|1950
GLB|GLA|Grena|1948
DRB|DRA|Bleumarin|1948
PRM|PRB|Albii|1972
ACS|ABX|Zimbrii|1949
RAW|RPI|Vulturii|1970
ACR|ACR|Verzii|1937
RAX|RAF|Negrii|1945
VAW|VTI|Negrii|1914
OLP|OIM|Vulturii|1910
ZAK|ZLN|Leii|1945
VIB25|VTR|Negrii|1969
DIP|MAR|Albii|1943
KAJ32|KLB|Siniye|1914
NID|NIZ|Belye|1983
STX|STO|Medvedi|1939
NOT|NOV|Sokoly|1973
KRG|KRM|Siniye|1971
AVB|AVM|Zheltye|1937
AVC|AVL|Orly|1949
KIQ|KHI|Zhuravli|1979
SIR|SBR|Medvedi|1976
NET|NEF|Kosmonavty|1982
TRJ|TRD|Sokoly|1979
ZEM|ZNT|Golubye|1936
SAP37|SNO|Vinnye|1980
SPZ|SUX|Kosmonavty|1961
NEV|NEI|Shakhtyory|1916
ART|AVG|Temno-sinie|1964
TRK|TRL|Temno-sinie|1915
NVO|NVO|Kozaki|1910
DAQ|DAL|Whites|1938
PEC26|PEA|Navy|1910
DUS|DUW|Maroons|1896
KIV|KII|Sky Blues|1896
HAN36|HAH|Clansmen|1895
MOG30|MFF|Highlanders|1915
GLE|GLE|Blues|1908
MOH31|MOV|Whites|1948
INT|ABR|Thistles|1893
EAS|EAS|Foresters|1945
TOP|TOG|Žuti|1915
OSF|OST|Žuti|1954
RUF|RUD|Vukovi|1976
SLJ|SLG|Crni|1945
DOW|LOK|Baroni|1929
PAM35|PAG|Crni|1961
SPA24|SPL|Orlovi|1942
KAK33|KMC|Svetloplavi|1974
LIZ|LPT|Bordo|1953
BOW|BOS|Plavi|1919
RIK|RPD|Komete|1948
HRL|HRA|Beli|1980
DMI|MRK|Žuti|1974
NOX|NVV|Beli|1980
ZEQ|MFZ|Gavranovi|1938
SST|SSD|Zeleni|1957
VAX|SLN|Levy|1971
ZVO|ZVO|Vlci|1927
JEC|JEB|Bordoví|1969
SPB25|SPA|Svetlomodrí|1930
PIJ|PNY|Bordoví|1948
BRY|SOV|Rytieri|1913
SRB|TSD|Modrí|1970
SKK|LPN|Tmavomodrí|1921
HON|MFH|Žltí|1985
DUE|DUG|Tmavomodrí|1960
TAN36|TTR|Levy|1915
STZ|MFT|Rytieri|1968
KRH|KRG|Tmavomodrí|1987
STA24|STR|Železiari|1959
SPC26|SPA|Žltí|1925
SOP|SBI|Bordoví|1946
RUG|RDR|Beli|1923
DSK|SKD|Svetlomodri|1912
RAZ|RUR|Svetlomodri|1972
PRI|PIZ|Črni|1958
AJD|NKD|Črni|1958
NVA|NKN|Črni|1943
SAQ38|SAV|Temnomodri|1916
RUN|RUN|Modri|1946
BLI|BLX|Jeleni|1964
RUH|RDA|Zeleni|1943
SVA|SVB|Jeleni|1978
DNO|NOQ|Svetlomodri|1939
SAR39|SAV|Beli|1924
BOX|BZX|Zeleni|1968
NDD|NZK|Svetlomodri|1959
LJU|NKU|Modri|1941
MSW|MAB|Blues|1914
PHA|PHA|Stars|1942
NEX|NEU|Pirates|1969
POC26|PNG|Yellows|1951
HOU|HOU|Blacks|1981
HOP|HOC|Lions|1963
MAZ47|MBD|Lions|1957
LAC26|LAC|Chiefs|1924
VOA|VOC|Reds|1985
KRJ|KRB|Pirates|1939
KWA|KWK|Maroons|1934
THQ|TBK|Lions|1973
ULC|ULF|Foundrymen|1928
NEY|NSU|Swallows|1949
LAD27|LDK|Arrows|1960
ULN|ULS|Sky Blues|1984
DIQ|DIS|Grünen|1950
WEB|WES|Gelben|1938
FAE|TEF|Grünen|1947
BEF29|SPV|Grünen|1936
GRS|GRH|Blauen|1935
FEF|SPG|Schwarzbären|1917
FEU|FEL|Schwarzen|1920
HIE|HIR|Dunkelblauen|1933
FRR|SPU|Roten|1931
LIA24|LAE|Gelben|1887
BUV|BKB|Eagles|1940
DAS|DRM|Navy|1939
SIU|SIM|Reds|1915
ARU|ARU|Navy|1970
SOQ|SOG|Reds|1939
KIW|KBG|Elephants|1925
TAP37|TNG|Greens|1934
KGA|KOG|Navy|1925
KTA|KID|Eagles|1944
MBG|MYT|Sky Blues|1970
YOB|YOM|Blacks|1960
TAQ38|TBW|Reds|1920
TYA|TGY|Cheetahs|1951
AZA|AHZ|Lions|1924
ATC|AHT|Buffaloes|1971
KIX|KBW|Blacks|1963
KEL|EKX|Fennecs|1951
KEB|KEL|Noirs|1916
JJS|JSM|Jaunes|1974
SIW|USL|Rouges|1911
KAL34|KAG|Grenats|1910
BEG30|ETL|Fennecs|1959
TAR39|TBO|Grenats|1970
NAH31|ENX|Palmiers|1910
KAM35|KSI|Verts|1920
EOO|EOA|Blancs|1979
SIX|ETS|Rouges|1925
OLQ|NBN|Grenats|1960
JSM|JSO|Gazelles|1978
JSO|JOZ|Noirs|1935
VEV|VER|Lvy|1965
KRK|KRE|Bili|1937
SHW|SHK|Zhovti|1986
SUF|SUF|Syni|1952
MKA|MAL|Chorni|1954
NAJ32|NFT|Chorni|1915
SHX|SHL|Zeleni|1948
TDO|TOK|Temno-syni|1923
POD27|POK|Zeleni|1960
LYV|LKO|Syni|1987
CHG30|CET|Temno-syni|1979
STB25|FST|Vyshnevi|1978
VEO|VOX|Charivnyky|1980
AKG|AKN|Chorni|1918
NYB|NYK|Blakytni|1979
AVV|AVD|Zhovti|1966
ALM59|WAF|Yellows|1923
HIF|HIL|Lions|1923
JER|JER|Reds|1974
AIK|AIK|Horsemen|1974
AAS|AAD|Hawks|1934
ALN60|WAT|Sandstorm|1972
AAQ|AQY|Blacks|1973
ALP61|JAA|Falcons|1985
ANI|NMR|Maroons|1978
MUD|MHR|Eagles|1920
SAS40|SLY|Navy|1942
SAT41|SLH|Navy|1945
ALQ62|AWI|Greens|1966
KAN36|KAP|Reds|1973
ALR63|RAY|Horsemen|1936
AAF|AIF|Camels|1948
REM|REH|Bison|1985
CHH31|CHU|Sky Blues|1939
WAW|WAL|Navy|1974
SPD27|SPA|Navy|1983
WHD|WHI|Crush|1949
MAA48|MAP|Stallions|1917
ROM|ROL|Lumberjacks|1938
MLE|MEL|Lumberjacks|1911
PRK|PRA|Maroons|1920
BEH31|BEU|Lightning|1986
WHE|WHF|Blues|1924
CYP|CYP|Blues|1982
ELL|ASF|Sky Blues|1921
CHJ32|CHR|Blacks|1958
POE28|POT|Maroons|1982
SUG|SUC|Comets|1923
CEF|CEE|Greens|1918
WIE|WIL|Greens|1936
POF29|POB|Maroons|1957
ELK|ELK|Foundrymen|1965
RLD|ROF|Blues|1935
CLS|CHY|Dragons|1934
LAE28|LAK|Blacks|1951
FOE|FOC|Rockets|1925
PRJ|PRD|Verdes|1970
NAK33|NAU|Celestes|1972
MIS|MRS|Gauchos|1924
URZ|URE|Celestes|1931
SNA|CSS|Rojos|1968
PTE|PRI|Pumas|1934
NAL34|NDX|Pioneros|1939
LEB|LEU|Lobos|1973
DOY|IDE|Celestes|1941
BUW|BST|Leones|1900
NAM35|NAX|Gladiadores|1903
LAO|EAN|Amarillos|1905
ORO|DSO|Granates|1918
MIG|MIO|Verdes|1934
CHK33|CIR|Lions|1928
TAS40|TSH|Camels|1951
BEJ32|BKC|Blues|1938
GUG|GLK|Yellows|1915
NUF|NUK|Leopards|1931
ANF|ANU|Bulls|1967
NAN36|NMZ|Greens|1931
SHZ|SCS|Eagles|1965
KHF|KHF|Reds|1946
NEZ|NTC|Crimsons|1950
BEK33|BKR|Blacks|1923
KHZ|KHC|Yellows|1969
MRC|MRR|Whites|1944
ESN|ESW|Sky Blues|1947
ROP|ROR|Amarillos|1935
NAP37|NAQ|Granates|1917
BIB|BLI|Titanes|1967
MOJ32|MLS|Celestes|1932
ADB|ARF|Rayos|1912
GAC|GAO|Verdes|1908
CAJ32|RDC|Zorros|1935
VEW|RDV|Negros|1967
SSA|SLL|Verdes|1965
LAF29|IEP|Amarillos|1894
CIA|UDC|Amarillos|1906
PUG|SAN|Celestes|1930
GAD|IPE|Azules|1960
PUH|PUO|Osos|1895
RAA24|REV|Toros|1923
COT|COP|Arrieros|1903
HNA|GII|Granates|1960
GEA|GEA|Celestes|1938
KLB|FTU|Grünen|1913
OBA|FUN|Weinroten|1938
COW|CCO|Schwarzen|1951
ROQ|FRX|Gelben|1936
KLC|KLI|Pioniere|1921
HOQ|HHN|Himmelblauen|1900
UER|UER|Blauen|1940
RRT|RTF|Wölfe|1931
FUK|FOM|Bären|1923
HOT|HHE|Grünen|1909
HAP37|HNX|Blauen|1912
GOC|FSG|Schwarzen|1903
COX|COU|Blauen|1891
BLB|BWO|Ritter|1904
LUT|LUT|Seeadler|1952
HIM|HIF|Schwarzen|1907
OUC|KVO|Brouwers|1954
HOX|HGB|Bordeauxen|1914
KSA|KNL|Blauwen|1924
KSK|KSK|Hemelsblauwen|1917
KOF|KNN|Witten|1906
KRL|KRH|Rooien|1955
SNE|SNE|Witten|1934
EOR|EXK|Groenen|1935
KKE|KOK|Geelen|1931
HAQ38|HRD|Spechten|1879
KOO|KOJ|Witten|1948
KOZ|KOZ|Donkerblauwen|1908
KAP37|KBX|Witten|1915
SRD|STZ|Witten|1910
KFA|KFO|Wolven|1916
NIH|NWD|Geelen|1900
CAK33|ESC|Azuis|1907
CAL34|CAP|Azuis|1900
NMA|NAM|Grenás|1937
GMA|ESG|Tucanos|1963
TPE|ATL|Pioneiros|1912
JAE|JAE|Rubro-Negros|1947
VAY|VSS|Celestes|1972
TAT41|TAB|Verdões|1899
ITI|ITI|Alvinegros|1941
REP|REP|Verdões|1949
PPA|PAS|Grenás|1931
JAG|JAS|Falcões|1966
IBI|UNA|Corsários|1913
ITC|ITS|Tubarões|1950
JMA|ESE|Alvinegros|1901
ITS|ITJ|Verdões|1899
AMD|ART|Jaguares|1899
TTA|SOC|Verdões|1902
SAU42|SAJ|Azuis|1935
URD|URG|Azuis-Marinho|1919
ALS64|ALZ|Mineros|1928
FUM|FNT|Celestes|1934
LEC|JUL|Amarillos|1919
PED27|PDA|Azulones|1923
POG30|PZN|Rayos|1957
ATD|ALU|Rojos|1959
TAO|TAE|Corsarios|1937
PEE28|PDD|Verdes|1901
MOK33|MOZ|Halcones|1947
BAX45|BAJ|Amarillos|1915
VIC26|VNO|Granates|1957
MTE|MBE|Azules|1931
VID27|CVX|Toros|1937
ROR|RLA|Leones|1925
KLI|KAI|Reds|1921
LOS|LON|Whites|1972
HUU|HUU|Tigers|1942
CHL34|CHZ|Falcons|1970
XIG|XIT|Yellows|1958
NNG|NIG|Steelmen|1928
SLL|SNM|Sky Blues|1990
CHM35|CGA|Pandas|1988
RET|RUP|Whites|1958
RUJ|RUF|Eagles|1948
YUG|YUF|Blacks|1971
ANM|ANM|Lions|1911
DUF|DUB|Námořníci|1978
DLA|DUJ|Nebesky modří|1918
STC26|STV|Kováři|1983
SPE28|SPN|Lišky|1967
OCE|TJO|Bílí|1914
SRO|SPA|Rybáři|1952
SPF29|SPA|Průkopníci|1966
VYB|VYF|Průkopníci|1988
ZEY|ZEA|Bílí|1917
POH31|PDO|Rybáři|1959
DOI|DOP|Vlci|1922
ROV|SPA|Červení|1990
KOS|SOB|Husité|1948
RYF|RYF|Rytíři|1956
PEF29|PLH|Lišky|1940
DST|DUS|Průkopníci|1989
LAG30|LAO|Bjørner|1899
DAY|DLB|Kometer|1950
SOT|SSI|Måker|1933
SNB|FSX|De Gule|1935
LIB25|ILX|De Sorte|1896
HEM|HDV|Fiskere|1906
LNS|ILS|De Hvide|1889
NOY|NOK|De Mørkerøde|1921
VNA|VEJ|Bjørner|1898
SAV43|SST|Ravner|1933
HOY|HKF|De Sorte|1944
SUJ|SRU|Gladiatorer|1909
BLT|ETB|Faucons|1906
CAM35|CTE|Brasseurs|1883
BEL34|BEC|Lynx|1914
AUE|ESA|Verts|1950
DUG|ETD|Ciel et Blancs|1903
BEM35|UBX|Loups|1943
BOY|BON|Grenats|1886
BLG|BLN|Chevaliers|1904
PAN36|PVL|Faucons|1953
SAI|ESS|Marines|1904
SAW44|ASB|Marines|1925
VLB|ESV|Renards|1918
ROX|USH|Verts|1923
CGE|CSA|Grenats|1913
MNS|AMX|Comètes|1940
BGE|BNG|Grenats|1947
SIY|SED|Kítrinoi|1919
KKA|AEK|Kítrinoi|1983
PLI|APX|Ouránioi|1912
PIR|ETP|Kometes|1963
PII|PIF|Kítrinoi|1960
KKI|NII|Mple|1912
MIH|PAH|Kókkino Krasí|1936
PAP37|AOP|Psarádes|1987
LAH31|ETK|Kókkino Krasí|1913
MEW|MSI|Mávroi|1990
CKI|AOH|Alepoúdes|1965
ARV|AOR|Prásinoi|1990
NIJ|GSN|Áspri|1981
THU|DOT|Psarádes|1948
MEZ|MEF|Medvék|1953
BAY46|BAK|Vörösök|1937
RAB25|RAC|Oroszlánok|1945
PAQ38|PSZ|Oroszlánok|1976
FEH|FEH|Sötétkékek|1917
KIY|KSV|Fehérek|1987
FEG|FHR|Oroszlánok|1940
PNY|EGP|Fehérek|1962
KIZ|EGK|Gladiátorok|1918
SZA|SZA|Medvék|1974
DAT|DBV|Úttörők|1936
RAC26|RCT|Huszárok|1990
SZS|SZS|Sasok|1964
DAW|DAO|Feketék|1955
NAQ38|NYG|Bikák|1972
HAR39|HDE|Bányászok|1950
PSB|PCX|Reds|1944
PSD|PSN|Eagles|1914
BHE|BKT|Eagles|1934
BHF|BTX|Eagles|1966
BTI|BPX|Reds|1943
PSE|PEQ|Panthers|1945
BYB|BNJ|Garuda|1982
PJE|PJX|Tigers|1987
PEG30|PEX|Sky Blues|1934
PEH31|PER|Reds|1920
CIR|CRS|Blues|1932
PPB|PSO|Blues|1950
PEJ32|PER|Sky Blues|1980
PEK33|PER|Reds|1982
SEB25|SGI|Panthers|1953
LAJ32|LPU|Panthers|1976
FOO|FOO|Whites|1967
SAX45|SAX|Yellows|1973
NFA|NYX|Tigers|1930
SAY46|SHX|Greens|1935
SAZ47|SIX|Knights|1961
SKE|SAN|Sky Blues|1941
SIZ|SIF|Sky Blues|1959
FOG|FLA|Maroons|1923
EAL|EGH|Whites|1947
GOZ|GOZ|Horsemen|1974
SBU|SEW|Whites|1931
ZOA|ZOS|Navy|1940
PAR39|POX|Whites|1953
FAF|FAX|Sky Blues|1937
POJ32|AUP|Bianchi|1924
MGO|MNG|Marinai|1944
BOA24|BOA|Cavalieri|1950
GUH|SAG|Celesti|1906
FAG|FAB|Granata|1913
VIE28|VIF|Rossi|1907
PTO|PAD|Blu|1880
BOO|BOU|Falchi|1901
GUO|PRG|Blu|1910
ROZ|AUR|Granata|1939
IUV|IUC|Bianchi|1921
SEC26|USX|Blu|1931
BOB25|AUB|Gabbiani|1929
SED27|SEN|Blu|1918
RGA|ROG|Volpi|1928
GRV|ASG|Bianchi|1893
VIF29|VUS|Blu|1907
POK33|PLS|Granata|1942
CEL|CEL|Verdi|1908
CCO|UCX|Pionieri|1934
NAR39|NAR|Greens|1988
MWA|MAZ|Reds|1960
SWA|SHV|Whites|1927
FUN|FUA|Blues|1920
TMA|TKY|Blues|1960
HAS40|HAR|Reds|1973
SMA|SSH|Crimsons|1981
TAU42|TAR|Yellows|1912
KUD|KUM|Blues|1953
ASI|ASR|Crimsons|1964
KUI|KUF|Blacks|1933
NTA|NRT|Whites|1915
YAE|YAV|Vento|1961
TOY|TOY|Hawks|1920
SAA48|SIH|Reds|1940
ASN|AAU|Blues|1927
MAB49|MAM|Blacks|1977
FWA|FUB|Lancers|1985
YAF|YMH|Blues|1912
SKI|SSK|Sky Blues|1988
ZAN|SAZ|Verdes|1959
PAS40|PCH|Tuzos|1937
MTL|MIT|Mineros|1945
TEE|TEC|Blancos|1894
HES|HCO|Rojos|1913
TAV43|TAH|Osos|1900
COY|CTC|Venados|1920
TEF|TPO|Azules|1952
LOZ|LBS|Toros|1970
JIB|JLP|Celestes|1950
ZAZ|ZPC|Guindas|1894
MIJ|MNE|Mineros|1930
TEG|TCL|Zorros|1955
TEH|TCC|Azules|1911
ZUK|FOZ|Geelen|1949
SPG30|SPC|Bijen|1889
ORF|OUF|Bordeauxen|1952
VEX|FOV|Geelen|1925
SIA24|RKS|Brouwers|1926
HOZ|HGV|Rooien|1943
SUK|SPW|Blauwen|1909
VLE|VII|Blauwen|1938
NIT|NWV|Herten|1954
HAT41|RHX|Blauwen|1890
DVA|DVS|Gladiatoren|1900
VIG30|VTS|Rooien|1881
OUV|FOL|Zwarten|1928
NUG|RKN|Zwarten|1938
VIH31|VTE|Zwanen|1902
NIW|NIU|Hemelsblauwen|1931
BEN36|BBX|Raven|1919
NUW|NIW|Bijen|1915
GIL|GIL|Blues|1955
SCD|SCO|Knights|1917
CHN36|CCH|Whites|1932
MCK|MEO|Knights|1922
MIM|MLP|Bees|1989
CHP37|CHV|Magpies|1958
WYN|WYN|Railwaymen|1965
TOQ|TOT|Dark Horses|1974
HCH|HRW|Emeralds|1914
HEP|HLM|Dark Horses|1980
LUH|LUD|Railwaymen|1981
HLA|HTF|Blackcats|1940
VRG|VEB|De Røde|1927
BRW|BOV|De Sorte|1934
DAX|DAI|De Mørkeblå|1918
BRX|BRL|Elge|1899
SRS|SNG|De Grønne|1884
LII|LIL|De Grønne|1888
HEQ|HED|De Blå|1934
BNB|BGV|De Blå|1927
BLM|BGH|De Mørkerøde|1885
RIL|RNG|Ravner|1926
LLM|LAI|De Lyseblå|1942
DBK|DLD|Løver|1914
LND|LGL|De Sorte|1891
DLM|DLH|De Sorte|1929
GOD|GOC|Lisy|1986
TKA|STL|Granatowi|1947
GNI|KSG|Żółci|1958
GWC|GWR|Bordowi|1938
BUZ|BUO|Błękitni|1969
GOK|GOW|Błękitni|1981
JAH|GJX|Niebiescy|1946
DOZ|MKD|Rycerze|1946
JAJ|KJX|Rycerze|1972
WOJ|WKX|Zieloni|1964
NOZ|NWC|Granatowi|1940
WIG|SWX|Bordowi|1923
NOA24|STM|Czarni|1964
KOK|KKX|Rybacy|1921
KAQ38|GKX|Rycerze|1969
BUI|BOX|Bordowi|1987
BRA24|KSZ|Bordowi|1923
BWO|POW|Żółci|1975
CDA|CRT|Pretos|1911
VIJ32|VLA|Tigres|1951
PDO|PAI|Pioneiros|1894
VAZ|AVA|Grenás|1900
SEE28|SEP|Verdes|1944
GDA|GDC|Azuis|1893
VEZ|VND|Verdes|1882
ESQ|ETR|Rubro-Negros|1924
AVO|AVS|Dragões|1944
LOJ|LOS|Celestes|1892
ACC|ACE|Lobos|1884
TAW44|TVR|Verdes|1901
PRN|PRH|Zimbrii|1972
RAD27|RAI|Negrii|1927
ERE|ELF|Grena|1970
UNC|UIR|Minerii|1929
MUL|MIE|Minerii|1970
CSS|HUN|Grena|1941
CFC|CNN|Lupii|1975
MAC50|MAQ|Negrii|1967
DIT|PTS|Minerii|1929
MFO|MLU|Minerii|1966
DIU|VLO|Siniye|1960
KRM|KRL|Zheltye|1952
SVR|SVE|Golubye|1990
YAG|YAF|Krasnye|1977
BKA|BAP|Medvedi|1940
NNA|NIH|Kozaki|1971
SPH31|SCX|Vinnye|1942
AYC|AKK|Zhuravli|1965
AKH|ADE|Zhuravli|1952
VNE|VEK|Belye|1967
END|ENN|Golubye|1936
KRN|KNX|Chernye|1938
CSK|CSN|Siniye|1948
BAZ47|BLT|Temno-sinie|1940
SMO|SMO|Metallurgi|1990
BVO|BYE|Zheltye|1990
EYA|ENZ|Krasnye|1948
ZES|ZIT|Gusary|1942
RIP|RFY|Lions|1924
ALT65|AWF|Reds|1949
KUE|KUT|Sky Blues|1933
BYN|BRY|Blacks|1961
ALU66|AWM|Navy|1968
AHA|HWY|Navy|1922
AIC|AIA|Foxes|1939
ALV67|RMQ|Blacks|1980
ALW68|MDR|Blacks|1978
TAX45|TFY|Tigers|1920
BAA48|BAR|Navy|1981
ALX69|AII|Greens|1940
SHY|SIY|Horsemen|1965
AIS|AIS|Sky Blues|1989
ALY70|KHY|Yellows|1976
SHA24|SHA|Sky Blues|1962
CUM|CMB|Whites|1899
MIP|MIP|Maroons|1891
JEE|JEA|Yellows|1949
INN|INO|Blacks|1883
GAL|GAL|Foresters|1901
TIE|TOI|Lairds|1898
ROA24|RSR|Yellows|1933
TUD|TUC|Reds|1893
BAB49|BNO|Maroons|1888
KIA24|KNK|Sky Blues|1912
ULG|ULN|Blacks|1911
VRA|VRE|Reds|1922
ULD|ULC|Navy|1918
SRC|SLD|Blacks|1989
PIK|POF|Reds|1915
VOS|VLR|Lions|1951
VRB|VRA|Yellows|1929
PHD|PHT|Chiefs|1918
KWN|KWA|Greens|1974
VON|VOS|Rhinos|1965
RAE28|RDS|Greens|1949
VRD|VDE|Pirates|1919
MAD51|MUR|Pirates|1946
NEA24|NEO|Reds|1919
SIB25|SBD|Blues|1957
KWD|KWL|Yellows|1984
MUE|MUN|Hawks|1929
SIC26|SNW|Whites|1967
BUA24|BUF|Ravens|1953
JID|JNW|Sky Blues|1975
BOC26|BOW|Rockets|1980
DAZ|DAE|Greens|1918
CRI|CHI|Blues|1977
PYA|PYD|Ravens|1932
DAA24|DAC|Stags|1933
JEF|JNJ|Lancers|1913
PYN|PYM|Yellows|1972
JIE|JIJ|Crimsons|1916
GIA|GIE|Blues|1983
DDO|DOD|Navy|1944
HNG|HDN|Blues|1910
SEF29|SSN|Steelmen|1911
HUD|HUD|Vita|1877
VOO|VOF|Vita|1883
SLN|SLP|Vinröda|1903
SKD|SKE|Sjömännen|1934
VAA24|VAK|Gröna|1939
SOU|SOA|Örnarna|1921
MMN|MHA|Älgarna|1913
BRB25|BAG|Vinröda|1907
GIF|GIV|Örnarna|1954
SLR|SLK|Lejonen|1913
BRC26|BVN|Blå|1915
BRD27|BGE|Mörkblå|1893
SLP|SLC|Älgarna|1939
NOB25|NRS|Sjömännen|1911
NYS|NYO|Blå|1877
BNY|BNF|Ljusblå|1906
ALZ71|FAE|Bergleute|1952
BLC|BLW|Kicker|1889
ELF|ELS|Schwarzen|1929
BRE28|VTO|Grünen|1950
WET|WST|Blauen|1913
ARW|ARM|Blauen|1910
AST|ALF|Roten|1890
SCF|SRZ|Fischer|1952
GRW|TEG|Schwarzen|1913
NNI|NIT|Ritter|1881
KLW|KLL|Gladiatoren|1927
KEC|KIC|Hirsche|1932
AWE|ALX|Ritter|1910
BRF29|BHF|Pioniere|1914
BAC50|EAC|Gelben|1899
GOT|EIG|Stahlwerker|1888
HHO|HEN|Weißen|1890
ROB25|RWN|Kumpel|1878
RAF29|RTY|Tigers|1959
WAP|WNG|Crimsons|1957
TFC|TKN|Foxes|1957
PHB|PHN|Sky Blues|1928
THV|THY|Crocodiles|1989
SAB49|SKM|Crimsons|1929
PHC|PHF|Navy|1918
CHQ38|CHP|Blacks|1953
MNG|MTH|Blacks|1912
MUF|MPU|Yellows|1930
SAC50|SAK|Rockets|1945
MUG|MNU|Dragons|1978
KAR39|KAB|Martılar|1985
INE|INC|Beyazlar|1980
KZE|KZI|Lacivertler|1970
BBE|YEB|Şahinler|1975
CAN36|CNH|Beyazlar|1986
KZB|KZG|Şahinler|1931
KUF|KUC|Martılar|1984
KAS40|KLA|Siyahlar|1966
ORG|ORG|Beyazlar|1923
BCU|BZT|Gökler|1975
USG|UAP|Beyazlar|1939
KUK|KUB|Atmacalar|1927
ESI|EDX|Kırmızılar|1950
CAP37|CMH|Balıkçılar|1981
EKI|EDN|Sarılar|1961
ESS|EKE|Gökler|1920
TEJ|TEE|Siyahlar|1961
CCA|CMK|Kırmızılar|1969
ROC26|ROV|Metalurhy|1989
ZOD|ZOD|Chervoni|1978
HIK|HRN|Charivnyky|1985
VSH|VRS|Syni|1987
LOR|LOV|Chervoni|1927
KOG|KOO|Lvy|1965
POL34|PLK|Zubry|1920
POM35|POP|Blakytni|1916
NOC26|NVA|Blakytni|1936
SPJ32|SPA|Temno-syni|1986
HYK|HIY|Zeleni|1974
KOJ|KLO|Hirnyky|1913
MIQ|MLL|Sky Blues|1969
OAW|OAK|Blues|1920
MEX|MLE|Blues|1953
RIV|SRB|Greens|1969
MIU|SMC|Pioneers|1910
LAK33|LKB|Sky Blues|1958
EEL|GRR|Reds|1928
CEG|CDR|Sky Blues|1936
SUQ|SUB|Eagles|1965
MLF|MFA|Reds|1938
SPK33|SGT|Pioneers|1963
BLD|BLP|Blues|1923
RRD|RIV|Stallions|1927
GOE|GLD|Bison|1953
CYN|CYI|Ironmen|1939
SUU|SUW|Maroons|1911
CLG|CBG|Reds|1981
SAD51|SAI|Blacks|1965
DOA24|DAG|Sky Blues|1910
THW|THH|Yellows|1924
HOA24|HNG|Elephants|1926
TUY|TSU|Cranes|1923
THX|TTP|Tigers|1910
SDO|SAI|Blues|1953
CLL|CLO|Buffaloes|1987
DNG|DOQ|Phoenix|1961
COZ|COQ|Buffaloes|1971
YEF|YEU|Eagles|1966
NCO|NCI|Pumas|1907
LNO|SVO|Celestes|1900
LLB|DFE|Matadores|1923
FEO|FEC|Gladiadores|1944
LEO|INL|Titanes|1949
GAG|ING|Corsarios|1943
VVE|EUD|Azulones|1941
ESV|AEX|Azulones|1943
URR|CSU|Negros|1953
BOD27|BEQ|Halcones|1958
GEL|GNR|Leones|1893
NLA|NLX|Celestes|1965
FUI|FNU|Titanes|1957
DOB25|DCT|Gauchos|1925
DOC26|GIS|Verdes|1907
LAL34|VLF|Azules|1949
HHE|TEH|Weinroten|1901
BRG30|BRS|Falken|1906
ARX|ALS|Kumpel|1907
EIC|EIC|Gladiatoren|1891
KRP|VKX|Weißen|1951
NEB25|SFR|Gelben|1876
PRP|PEW|Weißen|1949
KRQ|KNH|Weißen|1888
EIH|EIT|Seeadler|1901
BUB25|TTO|Weinroten|1896
BOE28|BSS|Dunkelblauen|1903
UDO|UUD|Himmelblauen|1894
HET|ECH|Wölfe|1911
EBE|EBS|Roten|1897
LUK|LUI|Grünen|1924
UNE|EIU|Löwen|1885
KKL|KRK|Bordeauxen|1919
OSN|UOS|Geelen|1924
KLD|KLW|Kikkers|1890
ZAQ|KVB|Hemelsblauwen|1887
OUH|OUH|Groenen|1935
RBE|BEK|Blauwen|1899
BRH31|BRR|Beren|1947
KLK|KVK|Zwarten|1909
KNI|KNT|Ruiters|1939
KOP|KOA|Donkerblauwen|1878
KFL|KFA|Donkerblauwen|1898
KNO|KOI|Kasteelheren|1947
NGR|NUW|Donkerblauwen|1913
WAQ|WAU|Donkerblauwen|1901
HUG|HBR|Stieren|1892
EXG|EXG|Zwarten|1920
IBA|UIA|Bandeirantes|1927
NMO|NIO|Azuis|1907
GBA|GUC|Azuis-Marinho|1896
IIT|EPO|Lobos|1945
NIP|NIX|Alvinegros|1915
IPB|IPF|Leões|1905
CMA|GRC|Amarelos|1915
UUA|URR|Águias|1907
CIM|CRM|Grenás|1915
CBU|CBU|Águias|1903
APU|ARP|Gladiadores|1895
CAQ38|CPN|Rubro-Negros|1942
CAR39|CPM|Verdões|1952
CAS40|UNM|Leões|1925
IIA|IPS|Pretos|1953
GUJ|GIB|Leões|1918
CAT41|CIG|Pretos|1954
IPI|IPT|Alvinegros|1919
CAU42|CTM|Águias|1915
NAS40|NAC|Lobos|1965
MEA24|MED|Azules|1935
ONC|ONB|Marineros|1963
ALA72|RAA|Blancos|1953
PPO|PZR|Verdes|1971
SEG30|SEV|Rojos|1918
TAY46|TLR|Tiburones|1894
RRA|RBL|Rojos|1898
COO|CBX|Leñadores|1895
BEP37|BNN|Rojos|1903
ORJ|ORU|Pastores|1898
BCO|SBC|Celestes|1909
OON|JOX|Mineros|1920
SDC|ROE|Celestes|1906
LVA|JLV|Leñadores|1919
BAD51|BAJ|Zorros|1959
NEC26|RSN|Granates|1925
QIN|QIN|Reds|1970
PIL|PIP|Blacks|1942
WEI|WEI|Whites|1941
FUZ|FUZ|Tigers|1922
LOM|LOC|Sky Blues|1956
SHB25|SHA|Maroons|1979
LUL|LOG|Phoenix|1976
SHC26|SNB|Eagles|1968
LOQ|LGT|Blacks|1973
BCI|BYN|Eagles|1962
QIU|QIT|Yellows|1915
FUP|FBN|Pandas|1987
VSV|SLV|Námořníci|1982
VEA24|VRI|Černí|1958
KOQ|KOS|Medvědi|1980
TCE|SLT|Lvi|1939
KNY|KNY|Rytíři|1922
PRQ|PRV|Bílí|1966
HIH|HON|Bílí|1926
KCE|KRI|Husité|1960
DNY|DBN|Červení|1938
SPL34|SPA|Zelení|1937
PAT41|PAV|Vlci|1955
SSE|SOE|Bílí|1971
BIC|BRP|Kováři|1961
VYV|VYD|Zelení|1962
VOV|SPA|Červení|1963
HOB25|VHX|Zelení|1970
LLI|IKL|De Blå|1927
HRD|HVG|De Lyseblå|1893
ASQ|AST|Løver|1878
HOC26|HOI|De Sorte|1891
BEQ38|BGS|De Mørkerøde|1949
HOD27|HOB|De Sorte|1932
FRU|FRV|Bryggere|1936
VEB25|VEE|De Lyseblå|1888
RIQ|FRH|Hjorter|1919
HEV|HDH|De Sorte|1920
STD27|SRH|De Lyseblå|1927
SYB|SYD|Løver|1904
OLS|JOO|Chevaliers|1917
CNT|CMO|Jaunes|1875
MGE|AJM|Bleus|1888
TOT|TOS|Bleus|1905
RLT|RCL|Jaunes|1887
MOL34|MOP|Marines|1900
CTO|ECT|Cigognes|1891
BER39|BEW|Rouges|1929
LAM35|LNL|Brasseurs|1948
LEU|LAL|Blancs|1893
MIW|MRM|Corbeaux|1898
VAB25|VEP|Mouettes|1924
MAE52|USX|Ciel et Blancs|1877
DDA|DME|Bleus|1947
PNT|USX|Rouges|1905
VIK33|VNE|Bleus|1899
BBF|FBX|Himmelblauen|1934
HAU42|HGH|Roten|1944
PKL|PEU|Schwarzbären|1915
SCN|SCZ|Gelben|1937
EIA|ENW|Gelben|1903
OBR|OBA|Gelben|1887
FED|FFX|Gelben|1886
FUQ|SGG|Dunkelblauen|1926
SLQ|SDE|Gelben|1875
ALB73|ALP|Schmiede|1926
ECK|EIR|Dunkelblauen|1912
ROD27|GEM|Gelben|1928
UAH|UNJ|Schwarzen|1934
PRR|PRJ|Weißen|1919
GRX|SPO|Himmelblauen|1918
OER|OBC|Weißen|1893
KST|FOW|Schwarzen|1876
IMA|VIX|Adler|1876
BHJ|BHJ|Lions|1939
BHK|BHK|Yellows|1959
BHM|BHM|Whites|1956
PSF|PSU|Reds|1928
BKE|BHI|Blacks|1932
CIN|CIE|Crimsons|1916
PSG|PSE|Sky Blues|1914
JEM|JEM|Panthers|1963
SUV|SRD|Blacks|1970
PSK|PSK|Tigers|1913
PAU42|PMK|Navy|1939
PSH|PSD|Yellows|1987
FAH|FAQ|Knights|1971
SHD27|SMX|Greens|1914
FAK|FLD|Knights|1974
KEF|KEF|Yellows|1934
NJI|NJI|Tigers|1937
BSA|BDA|Reds|1967
FOJ|FAD|Camels|1944
ESW|EEG|Navy|1955
NAT41|NAF|Blues|1940
MZA|MZX|Blues|1969
FJR|FBT|Falcons|1926
BGH|BRX|Whites|1986
MOM35|MOS|Granata|1941
IUA|IVN|Falchi|1920
COA24|VTU|Comete|1917
PON36|PPF|Gialli|1946
FEC|FEU|Marinai|1918
PAV43|PAB|Neri|1879
CAV43|ACM|Granata|1884
AMO|AAX|Gialli|1888
RAG30|RAV|Minatori|1895
ALC74|AUL|Orsi|1923
RTO|USX|Bianchi|1949
ARY|PRZ|Azzurri|1936
POP37|APG|Marinai|1920
PSJ|UPS|Celesti|1942
RRO|RCI|Orsi|1953
COB25|CRL|Neri|1900
CTR|CAW|Granata|1933
VIL34|VFX|Pionieri|1899
SCI|SHC|Wolves|1935
KII|KIS|Rockets|1924
TOV|TYR|Tigers|1945
TKI|TKH|Blacks|1927
OGA|OGA|Greens|1938
OMA|OGV|Navy|1911
TOW|TYY|Blues|1942
OGI|OGF|Warriors|1913
TFA|TKA|Vento|1929
HUN|HKR|Whites|1947
TAZ47|TKE|Whites|1974
TNO|TAJ|Aurora|1919
AKJ|AKS|Warriors|1977
OKC|OKP|Yellows|1926
KVO|KWG|Cranes|1947
MNO|MSN|Blacks|1983
HAV43|HLC|Amarillos|1910
ZOS|ZOM|Celestes|1938
CVB|CPR|Negros|1940
CIU|CIU|Azulones|1918
PEL34|PEP|Petroleros|1927
TAA48|TMP|Blancos|1955
TCO|TPC|Zorros|1908
HUI|HUI|Guindas|1907
SOV|SZX|Blancos|1955
PUO|PUC|Tuzos|1931
HNU|HNE|Zorros|1900
TUO|TUD|Guindas|1942
CEM|CEM|Cementeros|1896
IXT|IXT|Celestes|1902
BRJ32|BRD|Donkerblauwen|1888
AJK|ALK|Witten|1888
LEE|SPJ|Rooien|1876
KLS|KLS|Ruiters|1943
OUF|FOD|Geelen|1893
DVD|DVD|Kasteelheren|1903
NDE|NWR|Bordeauxen|1895
DIW|DIJ|Brouwers|1953
GOO|GOA|Zwarten|1930
MRD|MSW|Zwarten|1921
OOB|OOB|Zwanen|1939
DVN|DVN|Brouwers|1930
DIX|DIR|Zwanen|1892
OUK|FOQ|Arenden|1935
BNC|BEZ|Wolven|1916
SNK|SNK|Groenen|1891
COC26|COX|Bijen|1951
GRY|VGV|Hemelsblauwen|1893
FRV|FRB|De Grønne|1948
ASR|FMA|De Røde|1954
BJG|FBR|De Røde|1930
NUH|NOS|Svaner|1926
NYY|NYC|Bjørner|1953
STE28|SDV|Elge|1900
SKB|SKB|De Grønne|1920
NNB|NDL|Fiskere|1905
BES40|BUP|De Gule|1899
RIR|RIG|Bjørne|1941
GAH|GAB|De Lyseblå|1916
HEW|HEV|De Lyseblå|1888
STF29|STR|De Hvide|1893
NYD|NYD|Soldater|1883
RYG|MKR|Zieloni|1980
BBR|STC|Rybacy|1928
WOZ|WOK|Błękitni|1960
BID|BIO|Sokoły|1918
NOD27|MKN|Błękitni|1916
GIK|GOI|Piwosze|1961
ZAT|ZEM|Mewy|1972
RNA|GKR|Komety|1927
GOF|GCM|Granatowi|1966
JKA|MKJ|Zieloni|1918
BUC26|BUN|Zieloni|1989
OSG|RUO|Żółci|1977
BNO|BUE|Lwy|1935
KOT|ZNK|Kosynierzy|1974
BNF|MKB|Żółci|1951
WRZ|WOO|Sokoły|1962
TNA|MKT|Zieloni|1934
GOG|GOO|Biali|1917
TLA|TAV|Pretos|1955
FES|FEA|Pioneiros|1916
MHA|SMF|Celestes|1904
NAU42|NZR|Grenás|1933
VIM35|AVV|Pretos|1915
VRO|UVX|Rubro-Negros|1938
MDA|MNC|Celestes|1880
GGA|GDM|Gladiadores|1949
DED|DET|Amarelos|1916
ELG|ELO|Rubro-Negros|1886
SAE52|SAO|Gladiadores|1946
BRK33|ECB|Azuis|1881
CEH|SAN|Lobos|1929
MON36|MCO|Gladiadores|1914
RAH31|RAB|Șoimii|1919
ELH|ELE|Minerii|1948
TUI|TUA|Pescarii|1949
PPE|PRL|Vulturii|1937
OIA|OLZ|Verzii|1911
DRO|VDX|Vulturii|1957
GIB|GLF|Albii|1918
SPM35|SPO|Verzii|1922
PRW|PSX|Galbenii|1913
ALD75|ABO|Azurii|1956
ACP|ACP|Albaștrii|1986
CCS|CMF|Albii|1959
ELJ|ELG|Azurii|1986
PTI|PTE|Galbenii|1953
VLO|VLI|Krasnye|1987
TUE|TRP|Zelenye|1935
TKE|TOE|Gusary|1985
TVE|TVE|Zelenye|1972
POQ38|PDG|Krasnye|1959
AVF|AVR|Chernye|1973
PEM35|FPX|Volki|1940
ZVA|ZVL|Siniye|1954
URL|URN|Belye|1927
TRM|TRC|Chernye|1914
VEC26|VEH|Temno-sinie|1916
LIC26|LOF|Zhuravli|1972
SHE28|SBA|Sky Blues|1969
KEE|KES|Eagles|1970
SHF29|SHD|Camels|1968
AIR|IRB|Foxes|1928
ALE76|KEA|Whites|1912
SHG30|SHA|Tigers|1989
WAS|WLS|Eagles|1968
AAJ|AJY|Knights|1972
MSC|MHN|Maroons|1913
ALF77|LWQ|Knights|1922
MIX|MIM|Maroons|1946
KCK|KIW|Blues|1920
KIB25|KIE|Sky Blues|1902
ABS|ABC|Fishermen|1893
WER|WEG|Sky Blues|1880
JDE|JEU|Blacks|1907
MIZ|MIB|Highlanders|1951
NAV43|NRN|Greens|1902
CAW44|CAQ|Blacks|1908
KEG|KLM|Blues|1936
PHS|PHS|Reds|1981
LAN36|LDS|Blacks|1943
VOI|VOL|Lions|1980
PUS|PHC|Stars|1978
NRG|NLS|Pirates|1938
KRR|KRP|Greens|1933
RVA|RAN|Lions|1986
BET41|BTT|Chiefs|1913
PHG|PHB|Reds|1990
KRI|KRV|Greens|1931
RAJ32|RAL|Maroons|1978
VRP|VRD|Navy|1922
SID27|SIQ|Greens|1982
VRS|VRB|Blues|1927
CNG|CHD|Sky Blues|1971
BWA|BNH|Whites|1923
CHR39|CNJ|Comets|1980
CSA|CHW|Steelmen|1987
BOF29|BJN|Steelmen|1914
GIN|GID|Yellows|1948
CHS40|CGS|Whites|1957
HAW44|HCH|Rockets|1968
PYG|PYH|Sky Blues|1938
CTI|CND|Bears|1913
DAB25|DYN|Greens|1938
BUD27|BUQ|Whites|1939
WOM|WLC|Sky Blues|1916
BOG30|BOC|Greens|1979
BAE52|BSE|Whites|1952
HAX45|HWN|Crimsons|1954
ZAU|ZAM|Azules|1891
TAB49|TAI|Azules|1927
BEU42|BNL|Blancos|1950
BCF|BIL|Rojos|1885
COD27|ACX|Granates|1940
UBD|UBD|Águilas|1954
GAJ|GDE|Verdes|1931
HIJ|SAN|Amarillos|1953
FFR|FRU|Gladiadores|1911
ELN|JUM|Azules|1935
AAR|ANJ|Marineros|1925
AES|AZA|Cóndores|1884
OSR|OSR|Blancos|1904
ARA24|JAX|Venados|1902
PEN36|PDE|Azules|1941
PEP37|PED|Azulones|1922
VVI|VIY|Rayos|1914
ONE|ONE|Azules|1908
GNY|GIN|Vinröda|1917
VAC26|VAO|Ljusblå|1883
IFK|IFN|Gröna|1918
GAV|GVS|Röda|1935
MOP37|MBY|Örnarna|1954
VNO|VSL|Röda|1925
ULR|ULR|Gröna|1944
NYC|NYR|Mörkblå|1951
IFS|IFI|Vita|1889
TRN|TRH|Älgarna|1888
SUW|SUD|Vikingarna|1911
IFT|IFT|Vita|1887
LID27|LII|Vinröda|1947
VOR|VLU|Vinröda|1891
THY|THI|Kumpel|1901
HIP|FNA|Fischer|1908
DOD27|FDX|Grünen|1945
MLH|TTN|Blauen|1918
STG30|EIS|Weißen|1923
OBW|EIO|Falken|1947
RWE|RWB|Adler|1908
HSA|HSA|Blauen|1899
BST|EIB|Schwarzen|1894
BCK|BUT|Himmelblauen|1894
BKL|BSI|Ritter|1908
ROE28|ERA|Weinroten|1954
ROF29|RWD|Blauen|1949
EIB|FSE|Brauer|1883
GRZ|GRV|Roten|1900
BAF53|FBM|Roten|1949
KAT41|KCH|Blacks|1923
BAG54|BNM|Whites|1928
TCI|TYA|Stags|1979
TAC50|TKT|Rockets|1927
SRE|SRY|Crimsons|1975
NAW44|NHO|Blues|1979
RAK33|RTP|Greens|1968
MUJ|MSU|Blues|1964
MSB|MUC|Panthers|1986
MPO|MBR|Cobras|1986
TAD51|TAG|Gökler|1963
AKK|AKB|Kurtlar|1972
INR|YEI|Sarılar|1942
DEH|DML|Kaplanlar|1945
SUX|SUL|Kırmızılar|1912
KZK|KZB|Mavililer|1984
BUE28|BUY|Kırmızılar|1981
KZO|KZO|Lacivertler|1927
EPE|EKT|Lacivertler|1938
DEJ|DEA|Beyazlar|1916
ESX|EBG|Atmacalar|1934
KOY|KKO|Akbabalar|1974
USH|UAK|Kırmızılar|1928
SOW|YNI|Sarılar|1910
KZR|KZK|Akbabalar|1912
UCE|UAB|Tilkiler|1952
CAX45|CNV|Bordolar|1974
BDE|BYK|Yeşiller|1953
PGE|PRR|Navy|1980
GVE|GRB|Wolves|1921
MMB|MOM|Yellows|1950
BLE|BLR|Greens|1961
PLS|POH|Maroons|1940
WIH|WIS|Thunder|1923
GRA24|GEE|Whites|1980
FOK|FTB|Dragons|1962
HEY|HRB|Dragons|1921
CYW|CYB|Greens|1944
RRG|RVR|Blacks|1948
IER|CNY|Reds|1956
SRF|SIE|Voyagers|1989
RVE|RCK|Sky Blues|1985
LNA|LAP|Blues|1977
HHA|HLU|Buffaloes|1930
COE28|COJ|Reds|1928
XII|XMK|Maroons|1916
TBI|TUY|Blacks|1946
THZ|TDF|Reds|1914
SAF53|SCL|Elephants|1940
CAY46|CAZ|Reds|1973
TIC|TIM|Blues|1930
NBG|LGP|Comets|1965
SOX|THW|Seahawks|1948
LYB|LYM|Royals|1926
MCG|MKE|Tykes|1955
EAB|REE|Sky Blues|1969
GLG|GLS|Tykes|1915
TBD|TBY|Maroons|1928
ATE|OVR|Hawks|1907
EOE|EAO|Wolves|1938
GAK|GAX|Tigers|1938
SFF|FAI|Hawks|1969
ATG|GEN|Stars|1953
ITE|INT|Rovers|1959
SSS|SHA|Falcons|1956
AWG|WFA|Falcons|1977
FBB|BBE|Eagles|1974
FPP|PVA|Falcons|1924
IDD|ISL|Rovers|1908
DZZ|DNE|Tigers|1905
RUQ|SIN|Rovers|1930
KGD|KVG|Rangers|1954
UNF|FGI|Lions|1920
USJ|SME|Hawks|1908
CVD|VEM|Eagles|1927
CBE|CEJ|Lions|1984
RLL|RDP|Lions|1935
CBF|CVD|Lions|1972
UMD|USX|Rovers|1932
FMM|MAT|Stars|1929
NBF|NVE|Rovers|1975
FFF|FSS|Rovers|1980
NKA|NZA|Wolves|1975
DAA1|DLK|Rovers|1942
ETD|EDK|Tigers|1912
UBF|USX|Falcons|1961
FBA|BBN|Stars|1918
UNN|USX|Stars|1977
NAB1|NAV|Wolves|1936
OBD|OSE|Stars|1918
RLA|LUB|Bulls|1914
ASS|SKN|Falcons|1908
BFF|BAN|Tigers|1924
UKK|USX|Panthers|1982
ANN|NUR|Hawks|1982
AZZ|ZHR|Bulls|1966
AMM|MHG|Bulls|1918
LHH|LEH|Eagles|1975
AGG|AKG|Rangers|1954
DHH|DJS|Wolves|1941
HMM|HRR|Wolves|1911
HKK|HKX|Falcons|1982
SBH|SHE|Stars|1975
DHB|DIH|Rangers|1902
DMM|DMX|Panthers|1988
KLL|KUK|Wolves|1927
RDA|DNK|Falcons|1943
DFF|DNM|Eagles|1933
AUU|AHO|Warriors|1956
UPG|UPG|Stars|1957
BFA|BKS|Rovers|1943
SBG|SHA|Tigers|1916
AWF|WTN|Falcons|1971
AZS|ZRB|Warriors|1961
ANH|NDA|Wolves|1960
DSS|DHQ|Wolves|1982
SMC|SHA|Hawks|1958
RLB|LRA|Bulls|1919
SDS|SDM|Falcons|1934
ATS|TMB|Wolves|1915
AMH|AIE|Wolves|1969
LBT|LDA|Eagles|1978
OLT|ORY|Stars|1954
SMB|SHA|Falcons|1969
WAU|WAQ|Wolves|1950
ASU|ATA|Bulls|1984
ZSS|ZHS|Warriors|1977
OYY|OYY|Panthers|1961
KYY|KNG|Rangers|1985
NSC|NYS|Wolves|1905
KRS|KKA|Panthers|1989
MBK|MWA|Tigers|1972
AMF|MBL|Warriors|1939
NSB|NGO|Rovers|1946
LRR|LDN|Stars|1958
GRA1|GMA|Falcons|1900
FGG|GFA|Falcons|1939
FOP|FSC|Falcons|1946
SLT|LTH|Tigers|1974
EHC|EHT|Stars|1967
SSB|SPV|Panthers|1984
UMC|USX|Stars|1966
AGA|AGX|Falcons|1916
TAA25|TUM|Panthers|1972
ETA|EDM|Rovers|1985
CRD|RIT|Rovers|1964
SCJ|CAY|Stars|1913
BEA25|BCA|Lions|1912
FFC|FIG|Stars|1905
MLL|MLX|Panthers|1968
SNS|SLU|Lions|1902
ANJ|NIR|Rovers|1909
BSS|BQQ|Lions|1976
SRG|SUK|Panthers|1946
KGG|KOP|Stars|1943
UKA|KOB|Rovers|1904
SDK|KUO|Lions|1923
SDT|THR|Bulls|1932
AMG|ACN|Rovers|1971
NAA1|NMJ|Eagles|1980
GCC|GAC|Stars|1984
PAA25|PHK|Wolves|1928
MBH|MUP|Falcons|1919
FLL|LSO|Falcons|1933
USK|USX|Wolves|1905
FSS|SNR|Falcons|1913
FBC|BKG|Eagles|1928
RBB|BBM|Panthers|1934
MFF|MBF|Warriors|1926
FMA|MYA|Hawks|1952
MUK|MON|Lions|1959
EZZ|EOZ|Falcons|1911
EMM|EOM|Eagles|1941
KKB|KYK|Rangers|1953
AAG|ALR|Warriors|1951
SKC|KMR|Warriors|1981
BVV|BSL|Bulls|1950
BRA1|BGM|Stars|1909
NHH|NSE|Panthers|1983
MEA1|MSA|Warriors|1970
EVV|ENV|Hawks|1927
QFF|QAF|Bulls|1904
SCG|SCE|Warriors|1947
FOM|OLF|Falcons|1951
FQQ|QAR|Lions|1945
CWW|CWX|Rovers|1967
SRH|SER|Bulls|1932
IDA|ISU|Wolves|1902
MBJ|MZL|Lions|1964
KCS|KST|Eagles|1905
LCS|LUW|Lions|1926
KSB|KBM|Wolves|1968
PKW|PKW|Falcons|1902
MHH|MUZ|Falcons|1904
NFF|NYU|Warriors|1955
CPP|CEK|Wolves|1979
HDD|HWD|Stars|1948
CFA|CIT|Bulls|1950
CFB|CRU|Rovers|1912
MHB|MTV|Tigers|1943
BSB|BIS|Falcons|1981
KVJ|JON||1995
KLJ|JOK||1997
JZA|ZAB||1996
RKJ|RKB||1999
SPA1|POY||1999
UNJ|UPB||2001
RPP|RPX|Hawks|1907
ATQ|QAN|Wolves|1938
RUL|UBN|Tigers|1938
UNL|LCD|Hawks|1969
UNV|VAU|Stars|1953
CPA|PZD|Rovers|1959
MBL|MLI|Falcons|1956
ATZ|ZMN|Falcons|1977
JPP|JUP|Eagles|1974
REU|ELN|Falcons|1924
JCD|JCD|Rovers|1908
ATF|GJO|Tigers|1905
CPB|PNL|Rovers|1930
DRN|RND|Rangers|1954
UAA|UAX|Lions|1920
FCC|FGE|Hawks|1908
UNK|UCA|Eagles|1927
RRR|ROI|Lions|1984
ATJ|AOO|Lions|1935
RLC|LCS|Lions|1972
KFF|KFM|Shqiponjat|1984
NAX45|NTE|Luanët|1969
KAU42|LVA|Shqiponjat|1916
BAH55|BSH|Dhelprat|1927
KKF|KFF|Shqiponjat|1967
KOV|KDR|Skifterët|1981
MAF53|LMM|Bordoit|1954
PAW44|PMF|Të Verdhët|1982
PAX45|PAR|Të Kuqit|1977
SHH31|SHQ|Minatorët|1980
KFM|KFE|Të Kaltrit|1949
DIY|DBX|Të Zinjtë|1920
BAJ56|BKI|Të Kuqit|1954
MIA24|MII|Detarët|1957
PNI|PAR|Të Verdhët|1970
BMI|BIM|Minatorët|1978
HIQ|HNJ|Lobos|1924
GAQ|GDO|Rojos|1961
LAP37|ULP|Amarillos|1947
ALG78|ALW|Pastores|1953
LAQ38|ORD|Rayos|1948
UBG|UBS|Amarillos|1946
MAG54|RMX|Toros|1986
CAZ47|DCD|Tiburones|1939
ARB25|AEJ|Rojos|1942
NUJ|NEV|Rojos|1990
OND|EDO|Venados|1949
FRW|FRL|Azulones|1986
GUK|GDJ|Blancos|1984
HIT|HOJ|Celestes|1948
SAG54|SMA|Amarillos|1925
OSJ|OUN|Blancos|1938
NOE28|NMA|Viinapunased|1966
LOO|LTS|Kaluriid|1959
MUM|MUL|Sinised|1957
NOF29|NKX|Punased|1957
HAY46|HPK|Punased|1965
DUH|DUV|Punased|1919
MEB25|MKU|Punased|1976
NMB|NVT|Viinapunased|1922
LOT|LTU|Mereväesinised|1937
DUJ|DUO|Viinapunased|1949
SHJ32|SHE|Mtsvaneebi|1921
LAR39|LNB|Mgelebi|1988
SIE28|SIC|Tsisperebi|1968
GUN|GMX|Tetrebi|1943
MZI|MZO|Tetrebi|1918
DIA24|DLA|Ghvinisferebi|1946
LOW|LOJ|Mtsvaneebi|1927
TOE|TDO|Tsxenebi|1965
SIF29|SIW|Tsxenebi|1954
DIB25|DZE|Tsxenebi|1982
PAY46|PFP|Të Kuqit|1933
SHK33|SJA|Të Verdhët|1982
FUS|LFG|Të Zinjtë|1925
MAH55|LMB|Të Verdhët|1980
FLB|FLE|Dhelprat|1939
LUM|LUF|Ujqërit|1949
KFD|KFD|Kalorësit|1947
KFS|KFS|Të Bardhët|1946
DRI|DIT|Detarët|1922
MLU|FML|Bordoit|1986
SJA|SHQ|Minatorët|1914
YLL|YLK|Minatorët|1950
SHL34|SHQ|Detarët|1933
KFB|KFI|Kalorësit|1956
JFC|JFC|Lāči|1933
AUG|AKL|Gulbji|1942
AID|AUK|Dzeltenie|1914
VAP|VRP|Melnie|1913
ELP|EEK|Zaļie|1964
DAC26|DAV|Zilie|1920
DAD27|DGV|Debeszilie|1941
SPN36|SPA|Vilki|1984
DMO|DVL|Zvejnieki|1976
DIC26|SMD|Ērgļi|1932
SPP37|SPA|Debeszilie|1971
DID27|GLI|Baltie|1969
VED27|FVL|Zaļie|1962
DIE28|VNP|Debeszilie|1946
KOW|KUX|Raudonieji|1922
BAK57|BGA|Baltieji|1972
SAH55|SPA|Geltonieji|1961
BIR|BIR|Juodieji|1975
ZEU|ZEF|Žalieji|1947
GRB25|GRK|Raudonieji|1949
NAY46|NJT|Briedžiai|1916
KOX|KTX|Šernai|1937
DIF29|AYT|Žvejai|1961
KAV43|KPX|Baltieji|1963
PAZ47|PAL|Žydrieji|1941
GRC26|GRQ|Baltieji|1970
COF29|CGK|Weißen|1974
UNM|VUG|Wikinger|1966
OBB|OBH|Ritter|1978
WEC|WER|Kicker|1911
LIE28|LIG|Schwarzbären|1921
FRX|FIH|Fischer|1925
ALH79|ANN|Schwarzen|1950
GRD27|GUN|Kicker|1972
KIC26|KIH|Kicker|1956
GRE28|TGE|Stahlwerker|1911
RHA|RHS|Grünen|1937
ALJ80|ALE|Bären|1915
NED27|EIF|Bergleute|1914
BRL34|VBX|Schwarzen|1952
NIQ|NDE|Dunkelblauen|1979
LUP|ELX|Löwen|1930
LOX|LKX|Orlovi|1972
PAA48|PSB|Bordo|1966
NOG30|MFN|Bordo|1931
OSK|NOX|Sokolovi|1967
ZEW|ZER|Tamnoplavi|1965
ZEX|ZLE|Bordo|1920
PAB49|PAR|Bordo|1942
OSL|OSI|Zeleni|1971
DLU|LBK|Gladijatori|1915
SPQ38|SPA|Pivari|1987
MEC26|MEH|Lisice|1910
TUF|NKT|Žuti|1946
TAA|ZOT|Gladijatori|1969
OSO|OTO|Gavranovi|1967
RAL34|RDN|Vrane|1941
KRT|ZOK|Beli|1941
KAW44|KMI|Rakete|1968
LUQ|ZOL|Tamnoplavi|1929
MED27|MEC|Bordo|1984
NOH31|NVI|Bikovi|1967
DNA|NOH|Svetloplavi|1936
MAJ56|MAL|Pivari|1979
VEE28|VLK|Crni|1954
ZAV|ZZN|Crveni|1971
KRV|KCE|Medvedi|1988
TOX|TBX|Žuti|1936
TUG|AOU|Galebovi|1940
KAX45|KAQ|Crveni|1951
AMJ|PAX|Granata|1895
BEV43|BLO|Fabbri|1912
BOH31|UBG|Gialli|1896
FOQ|FSI|Pionieri|1907
ALK81|ALO|Verdi|1914
POR39|PRP|Gabbiani|1934
SSC|SSO|Celesti|1939
CAA48|AUC|Neri|1954
TOA24|TRN|Granata|1950
FAP|FAS|Granata|1915
MOL|MDN|Gialli|1925
POS40|POM|Granata|1884
PAC50|AAC|Celesti|1926
IUB|IUM|Bianchi|1904
PAD51|PAA|Cavalieri|1920
PEQ38|PSC|Cavalieri|1952
CAB49|CSL|Celesti|1899
MAK57|AUE|Celesti|1906
FRY|FRI|Neri|1880
LAS40|LNC|Verdi|1891
MOQ38|VRT|Bianchi|1937
LAT41|LNA|Rossi|1913
POT41|PON|Neri|1906
ROG30|ROB|Cavalieri|1881
VIN36|VMX|Pionieri|1899
POU42|PTO|Celesti|1930
FEE|FER|Blu|1891
IUC|IUR|Verdi|1880
RAM35|USR|Verdi|1925
LEG|VLX|Verdi|1897
VEF29|USV|Gladiatori|1896
FID|FID|Blu|1904
PTB|POG|Gladiatori|1952
BOJ32|AUA|Cavalieri|1926
COG30|CRN|Pionieri|1904
PIM|PIC|Marinai|1911
PNA|PNN|Azzurri|1910
BEW44|VIU|Gialli|1947
BEX45|ADA|Gialli|1934
GUP|GBB|Azzurri|1937
CHT41|SCD|Dragons|1939
PAE52|PBR|Verts|1944
SPR39|SPO|Mouettes|1902
NAZ47|NNC|Jaunes|1925
CHU42|ETC|Rouges|1883
POV43|PNB|Ciel et Blancs|1888
GRF29|GGN|Ciel et Blancs|1898
DAE28|DMC|Pionniers|1884
LAU42|LAH|Grenats|1889
SAJ56|FSP|Jaunes|1948
OLU|AGE|Noirs|1946
CHV43|USC|Mineurs|1889
LAV43|LVL|Brasseurs|1954
THA24|TLT|Pionniers|1898
NNF|NGN|Blancs|1926
SAK57|SAI|Jaunes|1935
MIB25|MRG|Faucons|1932
CHW44|USX|Jaunes|1938
ARC26|ETA|Rouges|1921
JOA|JOF|Grenats|1904
CEJ|FCX|Marines|1947
MOR39|FMB|Cerfs|1936
STM|SAI|Lions|1890
AUH|AUU|Ciel et Blancs|1934
LAW44|ULX|Bleus|1881
SPS40|SPO|Pionniers|1920
PAF53|PLT|Marines|1931
THB25|THU|Jaunes|1914
MOS40|MOY|Renards|1917
POW44|PNR|Pionniers|1876
TOB25|TRG|Rouges|1946
SAL58|EDS|Verts|1883
HAZ47|HGW|Stahlwerker|1895
OBC|OBF|Roten|1949
DOE28|FSO|Rothirsche|1953
HAA48|HGT|Raben|1897
HEZ|HER|Weinroten|1924
BAL58|SBS|Weinroten|1895
PRX|PRC|Himmelblauen|1921
MUP|MUF|Löwen|1938
HIU|HIT|Stahlwerker|1886
LIF29|LID|Schwarzen|1942
KLG|VKW|Dunkelblauen|1948
OBF|FOJ|Weinroten|1926
FUT|FOE|Roten|1892
WIM|WIE|Weißen|1930
NEE28|NCK|Bären|1938
COH31|COT|Schwarzen|1910
UNQ|UND|Raben|1928
BLF|BWN|Wikinger|1950
ALL82|VAX|Weißen|1951
HOE28|VIH|Gelben|1884
ALM83|FAH|Gelben|1932
OEA|OFX|Weißen|1887
NIR|NDR|Roten|1933
NEF29|VNN|Schwarzbären|1878
GOH|FOP|Bären|1908
DIG30|ENT|Gelben|1886
LIG30|SPV|Roten|1915
ENF|ENA|Himmelblauen|1925
EID|EIV|Weinroten|1917
NEG30|NEK|Himmelblauen|1941
GON|GOT|Stahlwerker|1933
NEH31|SPO|Weißen|1891
ALN84|AEM|Schwarzen|1929
OBG|OBR|Roten|1931
EBA|FEX|Löwen|1910
EBN|EBT|Blauen|1915
HAB49|HGK|Gelben|1903
EIF|ENL|Weinroten|1949
FEJ|FET|Blauen|1913
IMB|IMB|Roten|1913
ALP85|FSA|Gelben|1919
BAM59|VBB|Adler|1939
KLH|TEI|Blauen|1947
WEE|WET|Roten|1895
BIE|BGW|Roten|1884
ARD27|AIX|Weißen|1888
ABR|SPV|Gelben|1892
KRW|EIK|Füchse|1877
NEJ32|NEG|Pioniere|1926
COJ32|CKX|Wölfe|1921
RHB|RHF|Weinroten|1946
RHG|RHT|Roten|1909
GRG30|GRD|Grünen|1918
EBR|EBE|Weinroten|1888
AEE|ATS|Bergleute|1901
BOK33|BOI|Grünen|1933
BUF29|BUV|Weinroten|1951
THC26|THF|Gelben|1887
BKI|BOD|Rothirsche|1877
ALQ86|ATK|Wikinger|1953
ARE28|ANI|Gelben|1928
DIH31|EID|Dunkelblauen|1909
WEG|WEE|Roten|1928
UNS|UNL|Roten|1914
HOF29|EIH|Bergleute|1899
KID27|FOK|Gladiatoren|1922
CIB|CIA|Weißen|1921
KRX|KRR|Rothirsche|1893
CNE|CDI|Grünen|1917
PRZ|PRQ|Gelben|1899
KRZ|KRT|Grünen|1903
ENG|ENG|Seeadler|1942
FRZ|FNE|Celestes|1935
NAA48|NVR|Cóndores|1895
MAL58|MDO|Toros|1912
RIC|SAN|Gladiadores|1911
NUL|NUP|Azules|1895
ALR87|ALY|Rojos|1905
SDE|TOH|Marineros|1922
LUS|LCN|Verdes|1886
VAD27|DVX|Corsarios|1885
CEK|CSC|Amarillos|1931
ALS88|AIL|Venados|1906
MOT41|MOX|Celestes|1935
ORK|JUI|Blancos|1933
OSM|OSV|Negros|1878
BAN60|BAZ|Rayos|1886
SEH31|RSX|Negros|1938
CAC50|CRO|Tiburones|1901
AJO|AJE|Blancos|1935
GAS|ETU|Blancos|1896
ROH31|RRE|Celestes|1928
LEH|LES|Gladiadores|1955
SSD|SOM|Negros|1934
NUN|NUV|Rojos|1922
GAU|GDA|Verdes|1898
ALT89|ALB|Cóndores|1928
FUU|FUO|Granates|1903
SEJ32|SRA|Gladiadores|1944
ORL|ORN|Azules|1935
CAD51|CIN|Azules|1912
PER39|PEV|Jaguares|1907
ARF29|ARJ|Celestes|1909
CEN|CEP|Leñadores|1924
ALU90|AZE|Venados|1876
PES40|PIL|Azulones|1885
CNC|EDC|Amarillos|1916
SDR|ROS|Mineros|1947
HIV|HIJ|Marineros|1910
ESY|EAL|Osos|1910
LEL|SAN|Amarillos|1931
ZAW|ZAN|Mineros|1934
ARG30|AEN|Verdes|1895
TAG30|TLA|Titanes|1896
NAB49|NVN|Granates|1914
NVB|NUB|Azulones|1917
YEG|YET|Negros|1912
CAE52|CCX|Negros|1953
ROO|SAN|Leones|1902
ZAX|ZRA|Azules|1883
CEP|CEN|Halcones|1911
ATK|ALT|Azulones|1934
YER|SYA|Azulones|1893
GUQ|GDD|Cóndores|1897
SDY|YEE|Azulones|1881
ANK|ANA|Rayos|1955
LIH31|LIC|Negros|1953
AEB|ALH|Osos|1940
CAF53|CNE|Azules|1931
CUG|SAN|Leones|1909
TOC26|SAN|Rojos|1945
SDF|TLL|Azules|1923
ELQ|EHA|Leñadores|1935
PIP|PII|Negros|1933
OLV|OLS|Venados|1929
HIO|SAN|Azulones|1930
GUT|GUO|Verdes|1925
OLW|OLU|Blancos|1897
BEY46|BEY|Rojos|1898
ELT|LUA|Rayos|1890
LAX45|QUL|Rojos|1906
PET41|PEN|Verdes|1937
HOG30|HIO|Rojos|1896
GAW|GAG|Gladiadores|1909
IMR|FOI|Himmelblauen|1882
BAP61|SBK|Pioniere|1904
OBH|FSR|Gelben|1893
KLM|FKG|Schmiede|1884
HAC50|HBG|Schwarzen|1889
HOH31|FSH|Dunkelblauen|1879
STH31|SWA|Grünen|1895
HOJ32|HOV|Dunkelblauen|1902
BAQ62|VBZ|Weißen|1877
NEK33|NEN|Gelben|1954
HOK33|TON|Roten|1918
NEL34|NEC|Grünen|1881
ENH|ENR|Schwarzen|1896
HEA24|HEG|Brauer|1917
UEA|UNR|Gelben|1948
LAY46|LAW|Gelben|1926
STJ32|GES|Gladiatoren|1883
HEB25|HEH|Weißen|1918
GRH31|GRS|Blauen|1930
MUQ|VOR|Schmiede|1911
BRM35|BRJ|Pioniere|1902
OBT|OBS|Blauen|1882
BAR63|BMS|Seeadler|1947
OBJ|OER|Schwarzen|1926
NEO|EIA|Seeadler|1902
HSB|HNS|Weißen|1955
HIW|HIH|Gelben|1916
EBB|ENB|Ritter|1943
SCK|SCT|Weinroten|1914
COK33|COL|Wikinger|1877
AIF|AMI|Weißen|1920
GRJ32|GRL|Himmelblauen|1948
VEG30|EGV|Üstökösök|1939
BAS64|BKF|Gladiátorok|1968
HAD51|HAD|Sötétkékek|1970
SZB|SZF|Vörösök|1924
RAN36|RAK|Égszínkékek|1957
GYF|GYR|Sárgák|1932
HAE52|EGE|Feketék|1942
KIE28|KIV|Feketék|1968
DUL|DNL|Oroszlánok|1981
DAF29|EGD|Kékek|1914
ORN|OSO|Farkasok|1951
MEE28|MZK|Bordók|1921
LOY|LOR|Hollók|1986
KIF29|KIA|Sasok|1965
PAG54|PLV|Úttörők|1974
HAF53|HJD|Vörösök|1973
LAZ47|LRV|Fehérek|1962
BAT65|EGY|Sárgák|1944
MEF29|MZT|Sárgák|1950
LOA24|LRT|Huszárok|1959
VEH31|VEY|Bányászok|1954
BBG|EGB|Zöldek|1911
DUM|DUF|Égszínkékek|1986
ORP|ORE|Lovagok|1911
UJK|UJK|Sörfőzők|1968
DAG30|DAT|Zöldek|1913
LAA48|LOH|Bordók|1923
KAY46|KAK|Huszárok|1983
BAU66|BSX|Sörfőzők|1973
GYG|GYY|Sárgák|1942
GYS|EGG|Farkasok|1936
LOB25|LRS|Gladiátorok|1938
BUG30|BWL|Czerwoni|1955
BUH31|BUI|Orły|1951
SIG30|ZNS|Kruki|1943
CZB|CZA|Komety|1939
ZAY|RUZ|Mewy|1944
OSP|KOX|Żółci|1965
SIH31|KSF|Orły|1934
WON|WIX|Kruki|1943
LUU|KSU|Czarni|1944
POX45|ZNI|Orły|1938
NOJ32|NOW|Kosynierzy|1927
OSQ|ZNO|Rycerze|1989
WOP|WOS|Czerwoni|1925
OPO|PLN|Zieloni|1935
BNH|BDO|Żubry|1954
GOJ|GOM|Lisy|1935
KOA24|RUK|Mewy|1948
WRA|WOW|Husaria|1916
JAK|GKA|Biali|1969
TAE52|MKA|Granatowi|1980
BKB|SBO|Bordowi|1949
OSV|RCH|Granatowi|1986
LUV|KLX|Czerwoni|1988
ZAA24|ZEB|Granatowi|1945
RAP37|STJ|Komety|1961
CZO|CZS|Rycerze|1943
WOW|RUW|Czerwoni|1914
BIG|BIE|Czarni|1978
BUJ32|BUW|Górnicy|1927
GOM|GOK|Niebiescy|1946
TAF53|TAO|Zieloni|1947
ONF|OSF|Czarni|1969
KOB25|KOF|Żółci|1927
CZW|KCX|Czerwoni|1929
WII|WIM|Granatowi|1966
WOQ|WOG|Żółci|1983
GIC|GON|Czerwoni|1971
POY46|MKP|Rycerze|1912
WKI|STW|Pionierzy|1948
PIQ|UPO|Niebiescy|1970
TAG54|GKT|Biali|1930
DOF29|PDB|Niebiescy|1920
PIS|UPI|Biali|1962
WOT|WOT|Biali|1967
WOS|WSX|Żółci|1989
BUK33|BKX|Żółci|1979
WTA|WNX|Żółci|1938
GWD|GWN|Rycerze|1955
RYH|SRX|Czerwoni|1924
BUL34|BUL|Górnicy|1974
GID|GWK|Górnicy|1918
KAZ47|KFX|Kruki|1939
LUW|MKL|Rybacy|1932
WOU|WAX|Kruki|1938
HOL34|HLE|Nebesky modří|1950
SPT41|SPA|Medvědi|1930
BOL34|SLJ|Medvědi|1967
JAL|SJX|Býci|1941
JAM|JBC|Nebesky modří|1949
KAA48|KAV|Žlutí|1926
ZEA24|ZET|Sokoli|1931
STK33|STQ|Žlutí|1979
HOM35|HLN|Černí|1968
DUP|DUL|Nebesky modří|1971
HOI|HNI|Býci|1979
DOG30|DBC|Bílí|1953
ROJ32|RKY|Vínoví|1922
ZEB25|ZES|Gladiátoři|1976
TRP|TRO|Žlutí|1912
HNI|HOR|Kováři|1980
DYC|DYF|Gladiatorer|1903
GAX|GAK|De Grønne|1936
SKF|ISX|De Røde|1954
GAY|FGX|De Mørkerøde|1943
ASV|ASN|De Røde|1925
BEZ47|IBX|De Sorte|1921
LNB|LGS|De Blå|1902
KIG30|FKS|De Hvide|1913
SNC|STD|De Hvide|1881
MAM59|FMX|Pionerer|1947
NYE|NYB|De Gule|1896
FJA|FJB|De Mørkerøde|1924
VRC|VTF|Bjørne|1916
LIJ32|LLL|De Mørkerøde|1946
HUE|HDB|Blå|1924
VAE28|VSA|Ljusblå|1943
SLS|SLQ|Mörkblå|1930
OSW|OSG|Gula|1924
NOK33|NRA|Gröna|1941
KAB49|KBY|Mörkblå|1901
SUY|SND|Björnarna|1948
NOL34|NRR|Vikingarna|1912
SOY|SDR|Lejonen|1903
GAZ|IKG|Ljusblå|1904
ORQ|IKO|Gröna|1893
NRA|NOC|Vargarna|1943
IFA|IFS|Mörkblå|1906
BOM35|BOT|Vikingarna|1895
ROK33|RNB|Vita|1928
IKC|IKX|Blå|1909
VIP37|CVL|Amarelos|1939
ALV91|AAT|Celestes|1922
GAA24|EOR|Azuis-Marinho|1921
SAM59|SAW|Verdes|1949
ELW|ELV|Azuis-Marinho|1926
AVG|UNO|Rubro-Negros|1876
ALW92|SAT|Cavaleiros|1923
BRN36|BRC|Grenás|1882
AOD|AAO|Pretos|1878
VIQ38|AVP|Grenás|1949
GOQ|GOF|Rubro-Negros|1915
OSX|OSB|Falcões|1914
TOD27|GIT|Tigres|1973
DOH31|DEN|Granates|1920
NAC50|NAI|Albos|1932
DOJ32|DOC|Negros|1949
PEU42|INN|Albos|1971
VEJ32|DEV|Negros|1906
DOK33|DEE|Azules|1932
CEQ|COE|Pampas|1916
REV|RET|Toros|1971
PEV43|DER|Pampas|1901
ORU|ORT|Verdes|1963
QUG|QUU|Azules|1930
PEW44|INP|Leones|1929
ROL34|GIR|Zorros|1902
LEJ|LEC|Rojos|1894
REW|REM|Negros|1917
RAQ38|REL|Albos|1908
DOL34|INE|Zorros|1946`
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
    ['LIW', 'NEW', 'Lisbridge Derby'],
    ['ORA', 'LIW', 'Oranglass–Lisbridge Derby'],
    ['DOC', 'BAH', 'Dolgwyn–Bangorddu Derby'],
  );
})();

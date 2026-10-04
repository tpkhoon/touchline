// Club data: every league's clubs (real names; identity and reputation are the game's own ratings), rivalries
// and overseas clubs. League rules, nations and everything else static live in data.js.
(function () {
  const FM = window.FM;

  // ---------- Domestic clubs (real names; identity and reputation are the game's own ratings) ----------
  // [name, short, city, primary, secondary, identity, rep, stadium, capacity]
  FM.D.CLUBS_D1 = [
    ['Baywick Town', 'MCI', 'Baywick', '#6CABDD', '#1C2C5B', 'oil', 88, 'Farnmere Green', 53400],
    ['Clifwold Rovers', 'LIV', 'Clifwold', '#C8102E', '#00B2A9', 'giant', 88, 'Bexbrook Field', 61276],
    ['Chelington Borough', 'ARS', 'Chelington', '#EF0107', '#FFFFFF', 'giant', 87, 'Wokholm Field', 60704],
    ['Chelington City', 'CHE', 'Chelington', '#034694', '#FFFFFF', 'oil', 82, 'The Pickstead Stadium', 40343],
    ['Baywick Alexandra', 'MUN', 'Baywick', '#DA291C', '#FFFFFF', 'fallen', 80, 'Pudchester Green', 74310],
    ['Rodstead United', 'NEW', 'Rodstead', '#241F20', '#FFFFFF', 'oil', 78, 'Beverwell Green', 52305],
    ['Quarcaster United', 'TOT', 'Chelington', '#FFFFFF', '#132257', 'historic', 78, 'The Stratdale Stadium', 62850],
    ['Everwich Rovers', 'AVL', 'Everwich', '#670E36', '#95BFE5', 'historic', 75, 'Everwich Ground', 42640],
    ['Calgate Albion', 'BHA', 'Calgate', '#0057B8', '#FFFFFF', 'selling', 72, 'Bevercaster Road', 31876],
    ['Epington Alexandra', 'NFO', 'Epington', '#DD0000', '#FFFFFF', 'fallen', 71, 'The Kirkgate Stadium', 30404],
    ['Filbury Town', 'WHU', 'Chelington', '#7A263A', '#1BB1E7', 'historic', 68, 'Chelington Ground', 62500],
    ['Bransea Rangers', 'CRY', 'Chelington', '#1B458F', '#C4122E', 'historic', 68, 'Stratcaster Park', 25486],
    ['Redton Rovers', 'BOU', 'Redton', '#DA291C', '#000000', 'selling', 68, 'Cobrook Field', 11307],
    ['Tadthorpe Alexandra', 'FUL', 'Chelington', '#FFFFFF', '#000000', 'historic', 67, 'Sutcaster Road', 29589],
    ['Teton Harriers', 'BRE', 'Chelington', '#E30613', '#FFFFFF', 'selling', 67, 'Sutwich Park', 17250],
    ['Clifwold City', 'EVE', 'Clifwold', '#003399', '#FFFFFF', 'fallen', 67, 'Clifwold Park', 52888],
    ['Merstead Athletic', 'WOL', 'Merstead', '#FDB913', '#231F20', 'selling', 66, 'Romcaster Park', 31750],
    ['Selstow City', 'LEE', 'Selstow', '#FFFFFF', '#1D428A', 'fallen', 64, 'Lanholm Park', 37645],
    ['Carwick Victoria', 'SUN', 'Carwick', '#EB172B', '#FFFFFF', 'fallen', 62, 'Exhurst Field', 48707],
    ['Ryeworth Orient', 'BUR', 'Ryeworth', '#6C1D45', '#99D6EA', 'youth', 61, 'Wrexport Park', 21944],
  ];
  FM.D.CLUBS_D2 = [
    ['Aldcaster Wednesday', 'LEI', 'Aldcaster', '#003090', '#FDBE11', 'fallen', 61, 'Aldcaster Ground', 32259],
    ['Tethaven United', 'SOU', 'Tethaven', '#D71920', '#FFFFFF', 'youth', 60, 'Lewcastle Park', 32384],
    ['Grenwold Town', 'IPS', 'Grenwold', '#3A64A3', '#FFFFFF', 'historic', 59, 'Welgate Lane', 30311],
    ['North Litworth Villa', 'SHU', 'North Litworth', '#EE2737', '#FFFFFF', 'fan', 58, 'North Litworth Ground', 32050],
    ['Haspool United', 'MID', 'Haspool', '#E11B22', '#FFFFFF', 'historic', 57, 'Wendon Lane', 34742],
    ['Everwich Rangers', 'BIR', 'Everwich', '#0000FF', '#FFFFFF', 'oil', 57, 'Herbrook Lane', 29409],
    ['Yardale Rangers', 'WBA', 'Yardale', '#122F67', '#FFFFFF', 'historic', 56, 'Wickingham Park', 26850],
    ['Tuthurst Rovers', 'NCI', 'Tuthurst', '#FFF200', '#00A650', 'youth', 56, 'Ketwick Lane', 27359],
    ['Langley United', 'COV', 'Langley', '#6CABDD', '#FFFFFF', 'fan', 55, 'Torbridge Field', 32609],
    ['Reystow Harriers', 'WAT', 'Reystow', '#FBEE23', '#ED2127', 'selling', 55, 'Wynmere Road', 22200],
    ['Chipchester Harriers', 'WRX', 'Chipchester', '#D6001C', '#FFFFFF', 'oil', 54, 'Chipchester Park', 12600],
    ['South Bexwell Harriers', 'STK', 'South Bexwell', '#E03A3E', '#FFFFFF', 'fallen', 54, 'Holney Lane', 30089],
    ['Redworth Alexandra', 'HUL', 'Redworth', '#F18A01', '#000000', 'fan', 53, 'Stratdon Park', 25586],
    [
      'Market Darchester Harriers',
      'SWA',
      'Market Darchester',
      '#FFFFFF',
      '#121212',
      'youth',
      53,
      'Market Darchester Ground',
      21088,
    ],
    ['Wilshall Victoria', 'DER', 'Wilshall', '#FFFFFF', '#000000', 'fallen', 53, 'Welcastle Road', 32956],
    ['North Litworth Wanderers', 'SHW', 'North Litworth', '#0E00F7', '#FFFFFF', 'fallen', 52, 'Reafield Green', 39732],
    ['Rodwood United', 'BLB', 'Rodwood', '#009EE0', '#FFFFFF', 'fallen', 52, 'Holbridge Road', 31367],
    ['Reysey City', 'BRC', 'Reysey', '#E21A23', '#FFFFFF', 'youth', 52, 'Becksea Field', 27000],
    ['Torminster United', 'QPR', 'Chelington', '#1D5BA4', '#FFFFFF', 'fan', 51, 'Chelington Park', 18439],
    ['Yarney Victoria', 'PNE', 'Yarney', '#FFFFFF', '#000080', 'fan', 51, 'Yarney Park', 23404],
    ['Hatsey Rovers', 'MIL', 'Chelington', '#001D5E', '#FFFFFF', 'fan', 51, 'Redminster Lane', 20146],
    ['Caldale Town', 'POM', 'Caldale', '#001489', '#FFFFFF', 'fan', 50, 'Caldale Ground', 20899],
    ['Edensey United', 'CHA', 'Chelington', '#D4021D', '#FFFFFF', 'historic', 49, 'The Farnbury Stadium', 27111],
    ['Filcombe United', 'OXF', 'Filcombe', '#FFD100', '#001D5E', 'fan', 47, 'Sudhaven Lane', 12500],
  ];
  FM.D.CLUBS_ES1 = [
    ['Atlético Olmador', 'RMA', 'Olmador', '#FFFFFF', '#FEBE10', 'giant', 89, 'Estadio La Salamosa', 83186],
    ['Cervar CF', 'FCB', 'Cervar', '#A50044', '#004D98', 'giant', 88, 'Estadio Alcaliel', 99354],
    ['Juventud Olmador', 'ATM', 'Olmador', '#CB3524', '#272E61', 'historic', 82, 'Estadio Zafrilla', 70460],
    ['Cuenero Balompié', 'ATH', 'Cuenero', '#EE2523', '#FFFFFF', 'youth', 76, 'Campo de Cuenero', 53289],
    ['Deportivo Plasares', 'VIL', 'Plasares', '#FFE667', '#005187', 'selling', 74, 'Estadio Marbedo', 23500],
    ['Atlético Liorera', 'RSO', 'Liorera', '#143C8B', '#FFFFFF', 'youth', 73, 'Ciudad Deportiva Liorera', 39313],
    ['Deportivo Alcaledo', 'BET', 'Alcaledo', '#0BB363', '#FFFFFF', 'historic', 72, 'Estadio Olmosa', 60721],
    ['Alcaledo Balompié', 'SEV', 'Alcaledo', '#FFFFFF', '#D81E05', 'fallen', 68, 'Estadio La Hinojanes', 43883],
    ['Juventud Valdemosa', 'GIR', 'Valdemosa', '#CD2534', '#FFFFFF', 'oil', 66, 'Estadio Moraleda', 14624],
    [
      'Monte Fuentares Atlético',
      'VAL',
      'Monte Fuentares',
      '#FFFFFF',
      '#000000',
      'fallen',
      66,
      'Estadio Moralara',
      49430,
    ],
    ['Deportivo Montara', 'CEL', 'Montara', '#8AC3EE', '#FFFFFF', 'selling', 64, 'Estadio Moralal', 24870],
    ['Real Club Arroana', 'OSA', 'Arroana', '#D91A21', '#0A346F', 'fan', 64, 'Estadio Sorana', 23576],
    ['Juventud Peñara', 'MLL', 'Peñara', '#E20613', '#000000', 'fan', 62, 'Estadio Segovero', 26020],
    ['Racing Cervar', 'RCD', 'Cervar', '#007FC8', '#FFFFFF', 'fallen', 62, 'Estadio Municipal de Cervar', 40000],
    ['Atlético Salamara', 'RAY', 'Olmador', '#FFFFFF', '#E53027', 'fan', 61, 'Ciudad Deportiva Olmador', 14708],
    ['Benavera CF', 'GET', 'Benavera', '#005999', '#FFFFFF', 'selling', 61, 'Estadio Municipal de Benavera', 16500],
    ['Juventud Villa Roblón', 'ALA', 'Villa Roblón', '#0761AF', '#FFFFFF', 'youth', 60, 'Campo de Villa Roblón', 19840],
    ['Deportivo Corvar', 'OVI', 'Corvar', '#0033A0', '#FFFFFF', 'fan', 59, 'Nuevo Estadio Corvar', 30500],
    [
      'Monte Fuentares Sporting Club',
      'LEV',
      'Monte Fuentares',
      '#B5123E',
      '#004F9F',
      'fan',
      59,
      'Estadio La Cordana',
      26354,
    ],
    ['Salamador CF', 'ELC', 'Salamador', '#FFFFFF', '#05642C', 'fan', 58, 'Campo de Salamador', 31388],
  ];

  // ---------- More leagues ----------
  FM.D.CLUBS_D3 = [
    ['Lamwold Wednesday', 'CAR', 'Lamwold', '#0070B5', '#FFFFFF', 'fallen', 49, 'Stafcaster Road', 33280],
    ['Hydehaven Rangers', 'LUT', 'Hydehaven', '#F78F1E', '#002D62', 'fallen', 48, 'The Wrexwick Stadium', 12000],
    ['Amesholm United', 'HUD', 'Amesholm', '#0E63AD', '#FFFFFF', 'historic', 48, 'Reawich Green', 24121],
    ['Bexstead Athletic', 'BWA', 'Bexstead', '#FFFFFF', '#263C7E', 'fallen', 48, 'Dermouth Park', 28723],
    ['Huckborough City', 'PLY', 'Huckborough', '#00563F', '#FFFFFF', 'fan', 46, 'Wynford Green', 17900],
    ['Sutwood Borough', 'REA', 'Sutwood', '#004494', '#FFFFFF', 'fallen', 46, 'The Camthorpe Stadium', 24161],
    ['Worpool Wanderers', 'BNS', 'Worpool', '#D71921', '#FFFFFF', 'youth', 45, 'Worpool Park', 23287],
    ['Wedcastle-on-Sea City', 'WIG', 'Wedcastle-on-Sea', '#1D59AF', '#FFFFFF', 'selling', 45, 'Radport Road', 25138],
    ['Camshall Argyle', 'STO', 'Camshall', '#0B4EA2', '#FFFFFF', 'fan', 45, 'Gainley Road', 10841],
    ['Tunhurst Town', 'BFD', 'Tunhurst', '#8E1B3A', '#FFB81C', 'fallen', 44, 'Tunhurst Ground', 25136],
    ['Shafport United', 'BLP', 'Shafport', '#F68712', '#FFFFFF', 'fan', 44, 'Highurst Field', 16616],
    ['Clifholm City', 'PBO', 'Clifholm', '#0055A4', '#FFFFFF', 'selling', 44, 'Astoncaster Park', 15314],
    ['Manshall Town', 'ROT', 'Manshall', '#D71920', '#FFFFFF', 'fallen', 43, 'Romcaster Lane', 12021],
    ['Scarhurst Harriers', 'LIN', 'Scarhurst', '#E1251B', '#FFFFFF', 'youth', 43, 'The Salcliff Stadium', 10669],
    ['Denstead City', 'DON', 'Denstead', '#E21E26', '#FFFFFF', 'fan', 42, 'The Hasworth Stadium', 15231],
    ['Falwell County', 'LEY', 'Chelington', '#C8102E', '#FFFFFF', 'fan', 42, 'Milbrook Park', 9271],
    ['Dunbridge Alexandra', 'WYC', 'Dunbridge', '#88C4E6', '#0B1D4F', 'youth', 42, 'Sedhaven Lane', 10137],
    ['Abingwich Harriers', 'MNS', 'Abingwich', '#FEDD00', '#0033A0', 'fan', 41, 'Hunton Field', 9186],
    [
      'Ledford-on-the-Hill Borough',
      'EXE',
      'Ledford-on-the-Hill',
      '#D6001C',
      '#FFFFFF',
      'fan',
      40,
      'Richpool Field',
      8696,
    ],
    ['South Bexwell United', 'PVA', 'South Bexwell', '#FFFFFF', '#000000', 'fan', 40, 'Branham Park', 15036],
    ['Dartmere Athletic', 'WIM', 'Chelington', '#0033A0', '#FFD100', 'fan', 40, 'Kesdon Field', 9215],
    ['Darcastle Rovers', 'STV', 'Darcastle', '#E30613', '#FFFFFF', 'youth', 40, 'Abingwich Road', 7800],
    ['Tavstow County', 'NTN', 'Tavstow', '#7A263A', '#FFFFFF', 'fan', 39, 'The Stanbrook Stadium', 7798],
    ['Howborough Rangers', 'BRT', 'Howborough', '#FFD100', '#000000', 'selling', 39, 'Salwell Lane', 6912],
  ];
  FM.D.CLUBS_ES2 = [
    [
      'San de Piedador Atlético',
      'DEP',
      'San de Piedador',
      '#0067B1',
      '#FFFFFF',
      'fallen',
      56,
      'Campo de San de Piedador',
      32660,
    ],
    ['Club Segovón', 'LPA', 'Segovón', '#FFE400', '#0055A5', 'fan', 56, 'Nuevo Estadio Segovón', 32400],
    ['Benavete Atlético', 'VLD', 'Benavete', '#5B2C83', '#FFFFFF', 'fallen', 56, 'Ciudad Deportiva Benavete', 27618],
    ['Unión Liorón', 'MAL', 'Liorón', '#0073CF', '#FFFFFF', 'fallen', 55, 'Estadio Valino', 30044],
    ['Racing Salamedo', 'ALM', 'Salamedo', '#EE1119', '#FFFFFF', 'oil', 55, 'Estadio Municipal de Salamedo', 15274],
    [
      'La de Aranjero Sporting Club',
      'ZAR',
      'La de Aranjero',
      '#FFFFFF',
      '#0A3A82',
      'fallen',
      54,
      'Campo de La de Aranjero',
      33608,
    ],
    ['CD Nava', 'LEG', 'Nava', '#FFFFFF', '#0B3F8C', 'youth', 54, 'Estadio Nerjero', 12454],
    ['Atlético Montino', 'GRA', 'Montino', '#C8102E', '#FFFFFF', 'selling', 54, 'Estadio Calpedo', 19336],
    ['Real Olmero', 'SPG', 'Olmero', '#E30613', '#FFFFFF', 'historic', 53, 'Estadio La Salama', 29371],
    ['Club Marbejo', 'RSA', 'Marbejo', '#FFFFFF', '#00843D', 'historic', 53, 'Campo de Marbejo', 22222],
    ['Club Pedera', 'CAD', 'Pedera', '#FFE400', '#0045A7', 'fan', 53, 'Campo de Pedera', 20724],
    ['Deportivo Valdero', 'EIB', 'Valdero', '#004F9F', '#A6192E', 'youth', 51, 'Estadio Aranjino', 8164],
    ['Deportivo Montón', 'CAS', 'Montón', '#FFFFFF', '#000000', 'oil', 51, 'Estadio Salamena', 15500],
    ['Torrero CF', 'AND', 'Torrero', '#0038A8', '#FEDD00', 'oil', 50, 'Nuevo Estadio Torrero', 3306],
    ['Juventud Fuentena', 'HUE', 'Fuentena', '#003DA5', '#A6192E', 'youth', 49, 'Estadio Quintino', 9128],
    ['Segoval Balompié', 'ALB', 'Segoval', '#FFFFFF', '#000000', 'fan', 49, 'Estadio La Talador', 17524],
    ['Moralero Atlético', 'BGS', 'Moralero', '#FFFFFF', '#000000', 'fan', 48, 'Estadio Municipal de Moralero', 12200],
    ['CD Cabrena', 'CCF', 'Cabrena', '#FFFFFF', '#00843D', 'fan', 48, 'Estadio Municipal de Cabrena', 21822],
    ['UD Fuentedo', 'MIR', 'Fuentedo', '#E30613', '#000000', 'youth', 48, 'Campo de Fuentedo', 5759],
    [
      'Atlético Liorera B',
      'RSS',
      'Liorera',
      '#143C8B',
      '#FFFFFF',
      'youth',
      47,
      'Ciudad Deportiva Liorera',
      2500,
      'RSO',
    ],
    ['Racing Corvana', 'CYD', 'Corvana', '#FFFFFF', '#000000', 'fan', 46, 'Nuevo Estadio Corvana', 13346],
    ['Juventud Benavilla', 'CEU', 'Benavilla', '#FFFFFF', '#000000', 'fan', 45, 'Estadio Segovón', 6500],
  ];
  FM.D.CLUBS_DE1 = [
    ['Viktoria Dillhafen', 'BAY', 'Dillhafen', '#DC052D', '#FFFFFF', 'giant', 89, 'Sportpark Westerfeld', 75024],
    ['Teutonia Althof im Tal', 'BVB', 'Althof im Tal', '#FDE100', '#000000', 'fan', 84, 'Stadion Waldau', 81365],
    [
      'TSV Unter Felswald',
      'B04',
      'Unter Felswald',
      '#E32221',
      '#000000',
      'historic',
      81,
      'Unter Felswald-Arena',
      30210,
    ],
    ['Teutonia Marieningen', 'RBL', 'Marieningen', '#FFFFFF', '#DD0741', 'oil', 78, 'Rotfurt-Stadion', 47069],
    ['Teutonia Dornsee', 'SGE', 'Dornsee', '#000000', '#E1000F', 'fan', 74, 'Stadion am Branhafen', 58000],
    [
      'Teutonia Niederhafen am Berg',
      'VFB',
      'Niederhafen am Berg',
      '#FFFFFF',
      '#E32219',
      'historic',
      74,
      'Waldstadion Niederhafen am Berg',
      60449,
    ],
    ['FC Bruchingen', 'SCF', 'Bruchingen', '#C00000', '#000000', 'youth', 69, 'Stadion am Thalhafen', 34700],
    ['Teutonia Eberbach', 'WOB', 'Eberbach', '#65B32E', '#FFFFFF', 'selling', 66, 'Stadion Eichkirchen', 28917],
    ['FSV Bachwald', 'BMG', 'Bachwald', '#FFFFFF', '#000000', 'historic', 66, 'Kalstadt-Stadion', 54042],
    ['FC Berghorst', 'HSV', 'Berghorst', '#FFFFFF', '#0A3E8C', 'fallen', 66, 'Stadion Dorntal', 57000],
    ['VfB Branhafen', 'KOE', 'Branhafen', '#FFFFFF', '#ED1C24', 'fallen', 64, 'Steinbach-Stadion', 50000],
    ['FC Branfurt', 'SVW', 'Branfurt', '#1D9053', '#FFFFFF', 'historic', 64, 'Hohensee-Stadion', 42100],
    [
      'FC Unter Furtbach',
      'M05',
      'Unter Furtbach',
      '#C3141E',
      '#FFFFFF',
      'fan',
      63,
      'Waldstadion Unter Furtbach',
      33305,
    ],
    [
      'Sportfreunde Waldingen am Berg',
      'FCU',
      'Waldingen am Berg',
      '#EB1923',
      '#FFFFFF',
      'fan',
      62,
      'Stadion am Waldingen',
      22012,
    ],
    ['VfL Mühlfeld', 'TSG', 'Mühlfeld', '#1C63B7', '#FFFFFF', 'selling', 62, 'Mühlfeld-Arena', 30150],
    ['Germania Bachingen', 'AUG', 'Bachingen', '#FFFFFF', '#BA3733', 'fan', 61, 'Stadion am Immsee', 30660],
    ['Sportfreunde Berghorst', 'STP', 'Berghorst', '#624839', '#FFFFFF', 'fan', 60, 'Marienbach-Stadion', 29546],
    ['FC Hainbach', 'HDH', 'Hainbach', '#E2001A', '#003B79', 'youth', 58, 'Stadion Rheinheim', 15000],
  ];
  FM.D.CLUBS_FR1 = [
    ['ES Quimcourt', 'PSG', 'Quimcourt', '#004170', '#DA291C', 'oil', 90, 'Stade Dieueau', 47929],
    ['AJ Rocac', 'OMA', 'Rocac', '#FFFFFF', '#2FAEE0', 'giant', 82, 'Parc des Sports de Rocac', 67394],
    ['SC Chaange', 'ASM', 'Chaange', '#E30613', '#FFFFFF', 'oil', 78, 'Stade de la Lanières', 18523],
    ['AJ Joylieu', 'OLY', 'Joylieu', '#FFFFFF', '#DA291C', 'fallen', 74, 'Complexe Damières', 59186],
    ['US Mirières', 'LIL', 'Mirières', '#E01E13', '#1B2C5A', 'selling', 74, 'Complexe Lavlieu', 50186],
    ['Étoile de Bourcourt', 'NIC', 'Bourcourt', '#CE1126', '#000000', 'oil', 70, 'Stade Municipal de Bourcourt', 36178],
    ['Valange FC', 'REN', 'Valange', '#E2001A', '#000000', 'youth', 70, 'Stade Grenières', 29778],
    ['Étoile de Cassens', 'RCL', 'Cassens', '#FFD100', '#E30613', 'fan', 69, 'Stade de la Belgnan', 38223],
    ['Stade Thobourg', 'RCS', 'Thobourg', '#0056A6', '#FFFFFF', 'oil', 66, 'Complexe Ponon', 29230],
    ['ES Joyac', 'SBR', 'Joyac', '#E30613', '#FFFFFF', 'selling', 62, 'Stade Municipal de Joyac', 15220],
    ['AS Lancourt', 'TFC', 'Lancourt', '#6B2C91', '#FFFFFF', 'youth', 62, 'Complexe Chabourg', 33150],
    ['Racing Luneau', 'NAN', 'Luneau', '#FCD405', '#009A44', 'historic', 61, 'Complexe Sarac', 35322],
    ['RC Quimcourt', 'PFC', 'Quimcourt', '#1B2C5A', '#FFFFFF', 'oil', 60, 'Complexe Bourange', 20000],
    ['Luncourt FC', 'LOR', 'Luncourt', '#F58025', '#000000', 'fan', 59, 'Stade de la Bourange', 18110],
    ['Rocbourg FC', 'AUX', 'Rocbourg', '#FFFFFF', '#0033A0', 'fan', 58, 'Stade Lunville', 18541],
    ['ES Tourens', 'HAC', 'Tourens', '#1D5EAE', '#89CFF0', 'historic', 58, 'Parc des Sports de Tourens', 25178],
    ['Athlétic Vendault', 'ANG', 'Vendault', '#000000', '#FFFFFF', 'fan', 58, 'Stade Valange', 18752],
    ['Athlétic Valac', 'FCM', 'Valac', '#8E1B3A', '#FFFFFF', 'historic', 57, 'Parc des Sports de Valac', 28786],
  ];
  FM.D.CLUBS_BR1 = [
    [
      'Sociedade Esportiva Ibipe',
      'FLA',
      'Ibipe',
      '#C4122E',
      '#000000',
      'giant',
      85,
      'Estádio Municipal de Ibipe',
      78838,
    ],
    ['Racing Guarama', 'PAL', 'Guarama', '#006437', '#FFFFFF', 'giant', 84, 'Estádio Catú', 43713],
    ['Sport Clube Guarama', 'COR', 'Guarama', '#FFFFFF', '#000000', 'historic', 79, 'Estádio Novo Jacarotuba', 49205],
    ['Guaria FC', 'SAO', 'Guarama', '#FFFFFF', '#E4002B', 'historic', 78, 'Arena Guarama', 66795],
    ['Atlético Ibipe', 'BOT', 'Ibipe', '#000000', '#FFFFFF', 'oil', 77, 'Complexo Tijina', 46831],
    ['Pitangaçu EC', 'CAM', 'Pitangaçu', '#000000', '#FFFFFF', 'oil', 76, 'Arena Ibimirim', 46000],
    ['União Guina', 'GRE', 'Guina', '#0D80BF', '#000000', 'historic', 75, 'Estádio Municipal de Guina', 55662],
    ['Atlético Guina', 'SCI', 'Guina', '#E30613', '#FFFFFF', 'historic', 75, 'Estádio Pindoba', 50128],
    ['Clube Maraba', 'FLU', 'Ibipe', '#7A1F3D', '#00613C', 'historic', 74, 'Estádio Nhaniba', 78838],
    ['Sport Clube Pitangaçu', 'CRU', 'Pitangaçu', '#0033A0', '#FFFFFF', 'fallen', 73, 'Complexo Ibiguá', 61846],
    ['Associação Atlética Vassoguá', 'VAS', 'Ibipe', '#FFFFFF', '#000000', 'fallen', 72, 'Estádio Novo Pindoma', 21880],
    ['Sport Clube Urucai', 'SAN', 'Urucai', '#FFFFFF', '#000000', 'fallen', 71, 'Estádio Municipal de Urucai', 16068],
    ['Atlético Ubatia', 'BAH', 'Ubatia', '#004A99', '#E30613', 'oil', 70, 'Complexo Tabomirim', 47907],
    ['Atlético Jabotão', 'FTZ', 'Jabotão', '#1F3B8E', '#E30613', 'fan', 68, 'Estádio Paramirim', 63903],
    ['Esporte Clube Ipatiba', 'RBB', 'Ipatiba', '#FFFFFF', '#D1001F', 'oil', 67, 'Arena Pitangú', 17022],
    ['Grêmio Jabotão', 'CEA', 'Jabotão', '#000000', '#FFFFFF', 'fan', 64, 'Arena Pirão', 63903],
    ['União Jacaroba', 'SPT', 'Jacaroba', '#E30613', '#000000', 'fan', 64, 'Estádio Cambiba', 32983],
    ['Ubatia EC', 'VIT', 'Ubatia', '#E30613', '#000000', 'fan', 63, 'Estádio Municipal de Ubatia', 30793],
    ['Clube Arapara', 'JVD', 'Arapara', '#00843D', '#FFFFFF', 'fan', 62, 'Estádio Municipal de Arapara', 19924],
    ['Grêmio Catama', 'MSL', 'Catama', '#FFE600', '#00843D', 'youth', 62, 'Arena Maratuba', 15000],
  ];

  // ---------- Lower divisions and B teams (batch 6): minimal simulation; a 10th field names a B team's parent ----------
  FM.D.CLUBS_D4 = [
    ['Dartstead Rangers', 'ACS', 'Dartstead', '#E2001A', '#FFFFFF', 'fan', 38, 'Dartstead Park', 5450],
    ['Cansholm Town', 'BNT', 'Chelington', '#F79A20', '#000000', 'fan', 36, 'Winley Park', 6500],
    ['Halstead Orient', 'BRW', 'Halstead', '#FFFFFF', '#00205B', 'fan', 37, 'Halstead Park', 5045],
    ['Reysey United', 'BRR', 'Reysey', '#0050A0', '#FFFFFF', 'historic', 42, 'Calbridge Road', 9832],
    ['Withorpe United', 'BRO', 'Chelington', '#FFFFFF', '#000000', 'fan', 37, 'Thirford Lane', 5000],
    ['New Burhurst City', 'CAMU', 'New Burhurst', '#F9A01B', '#000000', 'fan', 40, 'Hartington Lane', 8127],
    ['Bedthorpe Rovers', 'CHT', 'Bedthorpe', '#E2001A', '#FFFFFF', 'fan', 37, 'Mansbrook Green', 7066],
    ['Wokham Rovers', 'CHF', 'Wokham', '#0033A0', '#FFFFFF', 'historic', 40, 'Wynmouth Park', 10504],
    ['Saint Buxcastle United', 'COL', 'Saint Buxcastle', '#0045A0', '#FFFFFF', 'fan', 38, 'Witpool Green', 10105],
    ['Glasham City', 'CRAW', 'Glasham', '#C8102E', '#FFFFFF', 'fan', 39, 'Spaldmere Green', 6134],
    ['Reaney Alexandra', 'CREW', 'Reaney', '#E2001A', '#FFFFFF', 'youth', 38, 'Folbury Park', 10153],
    ['South Lamere Rovers', 'FLE', 'South Lamere', '#E2001A', '#FFFFFF', 'fan', 38, 'Petley Park', 5327],
    ['Sawsea Athletic', 'GILL', 'Sawsea', '#0033A0', '#FFFFFF', 'historic', 39, 'Camstow Lane', 11582],
    ['Evercliff Town', 'GRI', 'Evercliff', '#000000', '#FFFFFF', 'historic', 39, 'The Exwold Stadium', 9052],
    ['Prescaster United', 'HARR', 'Prescaster', '#FFD700', '#000000', 'fan', 35, 'Dunchester Road', 5000],
    ['Harwood United', 'MKD', 'Harwood', '#FFFFFF', '#000000', 'selling', 41, 'Wendford Park', 30500],
    ['Pickdale Harriers', 'NWP', 'Pickdale', '#F79A20', '#000000', 'fan', 36, 'Pickdale Ground', 7850],
    ['Epington Wanderers', 'NCO', 'Epington', '#000000', '#FFFFFF', 'historic', 41, 'Witby Road', 19841],
    ['Shirworth Athletic', 'OLD', 'Shirworth', '#0033A0', '#FFFFFF', 'fallen', 38, 'Shirworth Park', 13512],
    ['Old Yeowick Alexandra', 'SAL', 'Old Yeowick', '#E2001A', '#FFFFFF', 'oil', 40, 'Sandington Road', 5108],
    ['Hydebridge Town', 'SHR', 'Hydebridge', '#0033A0', '#F9A01B', 'fan', 38, 'Hydebridge Park', 9875],
    ['Burdon City', 'SWI', 'Burdon', '#E2001A', '#FFFFFF', 'fallen', 39, 'The Exsey Stadium', 15728],
    ['Folbrook Villa', 'TRA', 'Folbrook', '#FFFFFF', '#0033A0', 'fallen', 37, 'Dorington Road', 16587],
    ['Holshall Athletic', 'WAL', 'Holshall', '#E2001A', '#FFFFFF', 'fan', 38, 'Kesney Park', 11300],
  ];
  FM.D.CLUBS_ES3 = [
    ['Atlético Olmador B', 'RMC', 'Olmador', '#FFFFFF', '#FEBE10', 'youth', 45, 'Estadio La Salamosa', 6000, 'RMA'],
    ['Cervar CF B', 'BAT', 'Cervar', '#A50044', '#004D98', 'youth', 44, 'Estadio Alcaliel', 6000, 'FCB'],
    ['Cuenero Balompié B', 'BIA', 'Cuenero', '#EE2523', '#FFFFFF', 'youth', 42, 'Campo de Cuenero', 3250, 'ATH'],
    ['Atlético Pozares', 'ZAM', 'Pozares', '#FFFFFF', '#E2001A', 'fan', 37, 'Ciudad Deportiva Pozares', 7813],
    ['Juventud Olmador B', 'ATB', 'Olmador', '#CB3524', '#272E61', 'youth', 42, 'Estadio Zafrilla', 2800, 'ATM'],
    ['Deportivo Plasares B', 'VIB', 'Plasares', '#FFE667', '#005187', 'youth', 42, 'Estadio Marbedo', 5000, 'VIL'],
    ['Alcaledo Balompié B', 'SEB', 'Alcaledo', '#FFFFFF', '#D81E05', 'youth', 40, 'Estadio La Hinojanes', 7000, 'SEV'],
    ['Deportivo Montara B', 'CEB', 'Montara', '#8AC3EE', '#FFFFFF', 'youth', 40, 'Estadio Moralal', 4500, 'CEL'],
    ['Deportivo Alcaledo B', 'BEB', 'Alcaledo', '#0BB363', '#FFFFFF', 'youth', 39, 'Estadio Olmosa', 3000, 'BET'],
    ['Unión Rondiel', 'TEN', 'Rondiel', '#FFFFFF', '#0046AD', 'fallen', 46, 'Estadio Oñatena', 22824],
    [
      'Deportivo Villa Mayorena',
      'CTG',
      'Villa Mayorena',
      '#000000',
      '#FFFFFF',
      'fan',
      43,
      'Estadio La Hinojares',
      15105,
    ],
    ['Deportivo Sepúlval', 'PON', 'Sepúlval', '#003DA5', '#FFFFFF', 'fan', 41, 'Estadio La Medero', 8400],
    ['Baila Balompié', 'NAS', 'Baila', '#C8102E', '#000000', 'historic', 41, 'Ciudad Deportiva Baila', 14591],
    ['Fresnero CF', 'ALC', 'Fresnero', '#FFD700', '#003DA5', 'fan', 39, 'Estadio Rondino', 5100],
    ['Unión Alcala', 'MUR', 'Alcala', '#C8102E', '#FFFFFF', 'fallen', 42, 'Estadio La Ribón', 31179],
    ['CD Castador', 'HERC', 'Castador', '#0033A0', '#FFFFFF', 'fallen', 40, 'Nuevo Estadio Castador', 30000],
    ['Atlético Cervara', 'IBI', 'Cervara', '#0057B8', '#FFFFFF', 'oil', 40, 'Estadio Gandejo', 4500],
    ['Club Castedo', 'CDLU', 'Castedo', '#E2001A', '#FFFFFF', 'fan', 38, 'Estadio La Benero', 7840],
    ['Sporting Moralete', 'UNS', 'Moralete', '#000000', '#FFFFFF', 'fan', 37, 'Estadio Municipal de Moralete', 4000],
    ['Peñino Sporting Club', 'ALG', 'Peñino', '#C8102E', '#FFFFFF', 'fan', 37, 'Estadio Lermete', 7100],
  ];
  FM.D.CLUBS_DE2 = [
    [
      'Eintracht Waldingen am Berg',
      'BSC',
      'Waldingen am Berg',
      '#005CA9',
      '#FFFFFF',
      'fallen',
      58,
      'Elstein-Stadion',
      74475,
    ],
    ['TSV Hainfeld', 'S04', 'Hainfeld', '#004D9D', '#FFFFFF', 'fallen', 60, 'Stadion am Hagberg', 62271],
    ['VfL Kirchbrück', 'KSV', 'Kirchbrück', '#0033A0', '#FFFFFF', 'youth', 55, 'Immhafen-Stadion', 15034],
    ['Fortuna Neckardorf', 'VFLB', 'Neckardorf', '#005CA9', '#FFFFFF', 'historic', 56, 'Neckarhausen-Stadion', 26000],
    ['FC Steinfurt', 'F95', 'Steinfurt', '#E2001A', '#FFFFFF', 'historic', 55, 'Stadion Dillhausen', 54600],
    ['Altwald SC', 'H96', 'Altwald', '#00863D', '#000000', 'historic', 55, 'Sportpark Altheim', 49000],
    ['TSV Steinstein', 'FCKL', 'Steinstein', '#E2001A', '#FFFFFF', 'fallen', 54, 'Stadion am Rheinheim', 49327],
    ['TSV Immdorf', 'SCPA', 'Immdorf', '#003DA5', '#000000', 'selling', 51, 'Stadion am Branau', 15000],
    ['Fortuna Hirschweiler', 'FCNB', 'Hirschweiler', '#9B1B30', '#000000', 'fallen', 54, 'Kirchingen-Stadion', 50000],
    ['Immau 04', 'KSC', 'Immau', '#0033A0', '#FFFFFF', 'historic', 52, 'Sportpark Kirchausen', 34302],
    ['VfB Bruchstein', 'D98', 'Bruchstein', '#004D9D', '#FFFFFF', 'fan', 52, 'Kalburg-Stadion', 17810],
    ['SV Steinau', 'SGF', 'Steinau', '#00863D', '#FFFFFF', 'youth', 50, 'Steinau-Arena', 16626],
    ['FC Rotbach', 'FCMA', 'Rotbach', '#0033A0', '#FFFFFF', 'fan', 50, 'Stadion Freistein', 30098],
    ['Teutonia Altheim', 'EBS', 'Altheim', '#FFD700', '#004D9D', 'historic', 50, 'Dornwald-Stadion', 23325],
    ['FSV Freital', 'PRM', 'Freital', '#00863D', '#000000', 'fan', 48, 'Freital-Arena', 14300],
    ['Teutonia Marienfurt', 'SVE', 'Marienfurt', '#000000', '#FFFFFF', 'selling', 48, 'Marienfurt-Arena', 10000],
    ['Fortuna Bachdorf', 'DSC', 'Bachdorf', '#0033A0', '#FFFFFF', 'fan', 50, 'Stadion Wiesbach', 26515],
    ['Sportfreunde Hagwald', 'SGD', 'Hagwald', '#FFD700', '#000000', 'fan', 50, 'Hagwald-Arena', 32066],
  ];
  FM.D.CLUBS_DE3 = [
    [
      'Teutonia Niederhafen am Berg B',
      'VFS',
      'Niederhafen am Berg',
      '#FFFFFF',
      '#E32219',
      'youth',
      42,
      'Waldstadion Niederhafen am Berg',
      5000,
      'VFB',
    ],
    [
      'Teutonia Althof im Tal B',
      'BVZ',
      'Althof im Tal',
      '#FDE100',
      '#000000',
      'youth',
      43,
      'Stadion Waldau',
      9999,
      'BVB',
    ],
    ['VfL Mühlfeld B', 'TSZ', 'Mühlfeld', '#1C63B7', '#FFFFFF', 'youth', 41, 'Mühlfeld-Arena', 6350, 'TSG'],
    ['FSV Dillhafen', 'M60', 'Dillhafen', '#6CABDD', '#FFFFFF', 'fallen', 45, 'Stadion am Dillbach', 15000],
    ['VfB Ahrhafen', 'FCE', 'Ahrhafen', '#E2001A', '#FFFFFF', 'fan', 44, 'Krondorf-Stadion', 22528],
    ['Union Kronkirchen', 'FCH', 'Kronkirchen', '#0033A0', '#FFFFFF', 'fallen', 45, 'Stadion am Hagfurt', 29000],
    ['Teutonia Burgberg', 'SVWW', 'Burgberg', '#E2001A', '#000000', 'fan', 43, 'Sportpark Lütwald', 15295],
    ['TSV Branhafen', 'VKO', 'Branhafen', '#E2001A', '#FFFFFF', 'fan', 40, 'Stadion am Kirchtal', 8343],
    ['TSV Elsdorf', 'SVM', 'Elsdorf', '#0033A0', '#000000', 'fan', 42, 'Sportpark Langhof', 24302],
    ['Union Hirschburg', 'AUE', 'Hirschburg', '#6A0DAD', '#FFFFFF', 'fan', 42, 'Eichfeld-Stadion', 16485],
    ['Union Ebersee', 'AAC', 'Ebersee', '#FFD700', '#000000', 'historic', 43, 'Steinhafen-Stadion', 32960],
    ['SV Klein Ahringen', 'SCV', 'Klein Ahringen', '#000000', '#FFFFFF', 'fan', 39, 'Stadion Holzdorf', 5207],
    ['SpVgg Lindhafen', 'OSN', 'Lindhafen', '#6A0DAD', '#FFFFFF', 'fan', 42, 'Lindhafen-Arena', 15741],
    ['Sportfreunde Dillhof', 'RWE', 'Dillhof', '#E2001A', '#FFFFFF', 'historic', 44, 'Sportpark Kirchfurt', 20650],
    ['VfB Holzkirchen', 'JAH', 'Holzkirchen', '#E2001A', '#FFFFFF', 'fan', 43, 'Stadion am Hohenburg', 15210],
    ['VfL Branwald', 'ULM', 'Branwald', '#000000', '#FFFFFF', 'fan', 42, 'Westerheim-Stadion', 17000],
    ['TSV Haindorf', 'MSV', 'Haindorf', '#005CA9', '#FFFFFF', 'fallen', 44, 'Goldwald-Stadion', 31500],
    ['Teutonia Dillhorst', 'FCS', 'Dillhorst', '#0033A0', '#000000', 'fan', 43, 'Sportpark Goldwald', 16003],
    ['Germania Langau', 'FCI', 'Langau', '#E2001A', '#000000', 'selling', 42, 'Waldstadion Langau', 15800],
    ['Burgdorf 04', 'S05', 'Burgdorf', '#00863D', '#FFFFFF', 'fan', 38, 'Langstadt-Stadion', 15060],
  ];
  FM.D.CLUBS_IT2 = [
    ['FC Sassetto', 'MNZ', 'Sassetto', '#E2001A', '#FFFFFF', 'selling', 58, 'Stadio Nuovo Sassara', 16917],
    ['Sporting Gubbetto', 'VEN', 'Gubbetto', '#000000', '#F18A00', 'selling', 57, 'Arena Casino', 11150],
    ['Torano 1908', 'EMP', 'Torano', '#005CA9', '#FFFFFF', 'youth', 57, 'Arena Frascia', 16284],
    ['Audace Serara', 'PAL2', 'Serara', '#F4A6C1', '#000000', 'oil', 56, 'Stadio Civico di Serara', 36365],
    ['AC Orvola', 'SAM', 'Orvola', '#1B5EA6', '#FFFFFF', 'fallen', 55, 'Stadio Leccona', 36599],
    ['Atletico Pescate', 'BARI', 'Pescate', '#FFFFFF', '#E2001A', 'fallen', 52, 'Stadio Nuovo Toria', 58270],
    [
      'Audace Valano al Monte',
      'SPE',
      'Valano al Monte',
      '#FFFFFF',
      '#000000',
      'selling',
      53,
      'Stadio Nuovo Casento',
      10336,
    ],
    ['FC Serano', 'MOD', 'Serano', '#FFD700', '#0033A0', 'fan', 51, 'Stadio Civico di Serano', 21151],
    ['US Paducci', 'CTZ', 'Paducci', '#FFD700', '#E2001A', 'fan', 50, 'Stadio Casino', 14650],
    ['Pro Piino', 'CES', 'Piino', '#FFFFFF', '#000000', 'fan', 50, 'Arena Ravia', 23860],
    ['Audace Trenara', 'JST', 'Trenara', '#FFD700', '#0033A0', 'fan', 48, 'Stadio Nuovo Roccello', 12800],
    ['US Ponino', 'SUD2', 'Ponino', '#FFFFFF', '#E2001A', 'selling', 48, 'Stadio Comunale di Ponino', 5539],
    ['Valano Calcio', 'REG', 'Valano', '#8B0000', '#FFFFFF', 'fan', 49, 'Arena Ferago', 21525],
    ['San Fabrara 1908', 'CAR2', 'San Fabrara', '#FFD700', '#0033A0', 'fan', 46, 'Stadio Venona', 9500],
    ['AC Castel Orvate', 'PAD', 'Castel Orvate', '#FFFFFF', '#E2001A', 'historic', 47, 'Stadio Orvara', 32336],
    ['Fosona Calcio', 'MAN', 'Fosona', '#FFFFFF', '#E2001A', 'fan', 46, 'Arena Arezucci', 14844],
    ['Sporting Corara', 'ENT', 'Corara', '#005CA9', '#FFFFFF', 'fan', 45, 'Stadio Civico di Corara', 5535],
    ['Valate Calcio', 'AVE', 'Valate', '#00863D', '#FFFFFF', 'fan', 46, 'Stadio Trenago', 26308],
    [
      'ASD Borgo Ponago',
      'PES',
      'Borgo Ponago',
      '#005CA9',
      '#FFFFFF',
      'fan',
      47,
      'Stadio Comunale di Borgo Ponago',
      20476,
    ],
    ['Audace Fosago', 'FRO', 'Fosago', '#FFD700', '#005CA9', 'selling', 51, 'Stadio Comunale di Fosago', 16227],
  ];
  FM.D.CLUBS_FR2 = [
    ['AJ Lunmont', 'MHS', 'Lunmont', '#F58025', '#1B3A6B', 'selling', 56, 'Stade Municipal de Lunmont', 32900],
    ['SC Clerières', 'STE', 'Clerières', '#009A44', '#FFFFFF', 'fallen', 58, 'Stade de la Maron', 41965],
    ['Racing Pauières', 'SDR', 'Pauières', '#E2001A', '#FFFFFF', 'selling', 56, 'Stade de la Courlieu', 21029],
    ['FC Beau-Beauens', 'EAG', 'Beau-Beauens', '#E2001A', '#000000', 'fan', 50, 'Stade Fonlac', 18378],
    ['Athlétic Cherault', 'PAU', 'Cherault', '#FFD700', '#005CA9', 'fan', 47, 'Complexe Nanlieu', 4031],
    [
      'Stade Château-Clermont',
      'ANN',
      'Château-Clermont',
      '#E2001A',
      '#FFFFFF',
      'fan',
      47,
      'Stade Municipal de Château-Clermont',
      15660,
    ],
    ['Chaon FC', 'LAV', 'Chaon', '#F58025', '#000000', 'fan', 47, 'Stade de la Lavières', 18467],
    ['Athlétic Beau-Lanlieu', 'GRE2', 'Beau-Lanlieu', '#005CA9', '#FFFFFF', 'fan', 47, 'Stade de la Beauon', 20068],
    ['AS Casslac', 'AMI', 'Casslac', '#FFFFFF', '#000000', 'fan', 48, 'Parc des Sports de Casslac', 12097],
    ['Union Dieulac', 'RSF', 'Dieulac', '#00863D', '#FFFFFF', 'fan', 46, 'Stade Nangnan', 10000],
    ['Athlétic Nanville', 'ROD', 'Nanville', '#E2001A', '#FFD700', 'fan', 46, 'Stade de la Cherville', 5955],
    ['US Ponange', 'CF63', 'Ponange', '#E2001A', '#005CA9', 'fan', 49, 'Stade Municipal de Ponange', 11980],
    ['AS Mirac', 'USL', 'Mirac', '#005CA9', '#FFFFFF', 'fan', 46, 'Stade Ponbourg', 4933],
    ['AJ Riblac', 'SCBA', 'Riblac', '#005CA9', '#FFFFFF', 'historic', 47, 'Stade Municipal de Riblac', 16078],
    ['AS Lanange', 'LMF', 'Lanange', '#E2001A', '#FFD700', 'fallen', 47, 'Stade Municipal de Lanange', 25064],
    ['Racing Sainte-Cassville', 'ASN', 'Sainte-Cassville', '#FFFFFF', '#E2001A', 'fallen', 48, 'Stade Clerange', 20087],
    ['Athlétic Sarières', 'USB', 'Sarières', '#E2001A', '#000000', 'fan', 44, 'Complexe Paulac', 9534],
    ['Union Chaens', 'ETA', 'Chaens', '#005CA9', '#FFFFFF', 'fallen', 50, 'Stade Municipal de Chaens', 21877],
  ];
  // League list: [compId, clubs, nation] — the world builder reads this
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
  FM.D.allClubRows = () => FM.D.LEAGUE_CLUBS.flatMap(([, k]) => FM.D[k]);

  FM.D.RIVALS = [
    ['MCI', 'MUN', 'Baywick Derby'],
    ['LIV', 'EVE', 'Clifwold Derby'],
    ['ARS', 'TOT', 'Chelington Derby'],
    ['CHE', 'FUL', 'Chelington Derby'],
    ['NEW', 'SUN', 'Rodstead–Carwick Derby'],
    ['AVL', 'BIR', 'Everwich Derby'],
    ['NFO', 'DER', 'Epington–Wilshall Derby'],
    ['BHA', 'CRY', 'Calgate–Chelington Derby'],
    ['WHU', 'MIL', 'Chelington Derby'],
    ['WOL', 'WBA', 'Merstead–Yardale Derby'],
    ['LEE', 'HUD', 'Selstow–Amesholm Derby'],
    ['SOU', 'POM', 'Tethaven–Caldale Derby'],
    ['BRE', 'QPR', 'Chelington Derby'],
    ['BUR', 'BLB', 'Ryeworth–Rodwood Derby'],
    ['SHU', 'SHW', 'North Litworth Derby'],
    ['IPS', 'NCI', 'Grenwold–Tuthurst Derby'],
    ['LEI', 'COV', 'Aldcaster–Langley Derby'],
    ['STK', 'PVA', 'South Bexwell Derby'],
    ['SWA', 'CAR', 'Market Darchester–Lamwold Derby'],
    ['PNE', 'BLP', 'Yarney–Shafport Derby'],
    ['WAT', 'LUT', 'Reystow–Hydehaven Derby'],
    ['BWA', 'WIG', 'Bexstead–Wedcastle-on-Sea Derby'],
    ['BNS', 'ROT', 'Worpool–Manshall Derby'],
    ['PLY', 'EXE', 'Huckborough–Ledford-on-the-Hill Derby'],
    ['PBO', 'NTN', 'Clifholm–Tavstow Derby'],
    ['RMA', 'FCB', 'Olmador–Cervar Derby'],
    ['ATM', 'GET', 'Olmador–Benavera Derby'],
    ['ATH', 'RSO', 'Cuenero–Liorera Derby'],
    ['BET', 'SEV', 'Alcaledo Derby'],
    ['VAL', 'LEV', 'Monte Fuentares Derby'],
    ['VIL', 'CAS', 'Plasares–Montón Derby'],
    ['CEL', 'DEP', 'Montara–San de Piedador Derby'],
    ['RCD', 'GIR', 'Cervar–Valdemosa Derby'],
    ['OVI', 'SPG', 'Corvar–Olmero Derby'],
    ['RAY', 'LEG', 'Olmador–Nava Derby'],
    ['MAL', 'GRA', 'Liorón–Montino Derby'],
    ['LPA', 'TEN', 'Segovón–Rondiel Derby'],
    ['ZAR', 'HUE', 'La de Aranjero–Fuentena Derby'],
    ['ALA', 'EIB', 'Villa Roblón–Valdero Derby'],
    ['VLD', 'BGS', 'Benavete–Moralero Derby'],
    ['BAY', 'BVB', 'Dillhafen–Althof im Tal Derby'],
    ['B04', 'KOE', 'Unter Felswald–Branhafen Derby'],
    ['SVW', 'HSV', 'Branfurt–Berghorst Derby'],
    ['SGE', 'M05', 'Dornsee–Unter Furtbach Derby'],
    ['VFB', 'SCF', 'Niederhafen am Berg–Bruchingen Derby'],
    ['RBL', 'FCU', 'Marieningen–Waldingen am Berg Derby'],
    ['PSG', 'OMA', 'Quimcourt–Rocac Derby'],
    ['LIL', 'RCL', 'Mirières–Cassens Derby'],
    ['NIC', 'ASM', 'Bourcourt–Chaange Derby'],
    ['REN', 'NAN', 'Valange–Luneau Derby'],
    ['OLY', 'STE', 'Joylieu–Clerières Derby'],
    ['RCS', 'FCM', 'Thobourg–Valac Derby'],
    ['SBR', 'LOR', 'Joyac–Luncourt Derby'],
    ['PFC', 'HAC', 'Quimcourt–Tourens Derby'],
    ['FLA', 'FLU', 'Ibipe Derby'],
    ['PAL', 'COR', 'Guarama Derby'],
    ['GRE', 'SCI', 'Guina Derby'],
    ['CAM', 'CRU', 'Pitangaçu Derby'],
    ['SAO', 'SAN', 'Guarama–Urucai Derby'],
    ['BOT', 'VAS', 'Ibipe Derby'],
    ['BAH', 'VIT', 'Ubatia Derby'],
    ['FTZ', 'CEA', 'Jabotão Derby'],
    ['INT', 'ACM', 'Pietto Derby'],
    ['ROM', 'LAZ', 'Belago Derby'],
    ['JUV', 'TOR', 'Gubbento Derby'],
    ['FIO', 'BOL', 'Porto Santano–Corale Derby'],
    ['GEN', 'PIS', 'Orvola–Mirino Derby'],
    ['AJA', 'FEY', 'Alkrade–Zaanhorst Derby'],
    ['TWE', 'HER', 'Zwolwijk–Wagekerk Derby'],
    ['GRO', 'HEE', 'Kleinvoort–Hoornbrug Derby'],
    ['GAE', 'PEC', 'Dijklo–Maaswijk Derby'],
    ['SPR', 'EXC', 'Zaanhorst Derby'],
    ['BEN', 'SCP', 'Porteiro Derby'],
    ['VSC', 'SCB', 'Penura–Santinha Derby'],
    ['RIV', 'BOC', 'Arrano Derby'],
    ['RAC', 'IND', 'Dorrez Derby'],
    ['ROS', 'NOB', 'Quirez Derby'],
    ['SLO', 'HUR', 'Arrano Derby'],
    ['ELP', 'GLP', 'Velero Derby'],
    ['TAL', 'BEL', 'Domeda Derby'],
    ['LAN', 'BAN', 'Domas–Quirona Derby'],
    ['GOD', 'IRI', 'Garero del Plata Derby'],
    ['LAG', 'LAF', 'Pickborough Derby'],
    ['SEA', 'PTI', 'Nanton–Holsey Derby'],
    ['NYC', 'NYR', 'North Warchester Derby'],
    ['TRT', 'MTL', 'North Hatsey–Olwich Derby'],
    ['HOU', 'DAL', 'Wiscliff–Cranstow Derby'],
    ['RAP', 'RSL', 'Excombe–Granton Derby'],
    ['CIN', 'CLB', 'Merbury–Ripcombe Derby'],
    ['ATL', 'ORL', 'Bexingham–Astoney Derby'],
    ['GAM', 'CER', 'Matsta Derby'],
    ['YFM', 'KAW', 'Akisaki–Saigawa Derby'],
    ['FCT', 'TVE', 'Higashino Derby'],
    ['URA', 'KAS', 'Sakurata–Kitanarisaki Derby'],
    ['AME', 'CHV', 'Jilitzin–Coatohua Derby'],
    ['MTY', 'TGR', 'Tulapan–Jilehua Derby'],
    ['CAZ', 'PUM', 'Jilitzin Derby'],
    ['ULS', 'POH', 'Gangyang–Bohwa Derby'],
    ['SEO', 'ANY', 'Chunwon–Gangjeong Derby'],
    ['BKU', 'PRT', 'Nongkaeo Derby'],
    ['ENY', 'RAN', 'Wexby–Kilwick Derby'],
    ['WAC', 'RCA', 'Nanlieu Derby'],
    ['FAR', 'FUS', 'Dieumont Derby'],
    ['MAT', 'IRT', 'Mirens–Tourlac Derby'],
    ['CZV', 'FKP', 'Jasovac Derby'],
    ['VOJ', 'SPS', 'Novany–Slaava Derby'],
  ];

  // Overseas clubs — "minimal simulation" tier: squads exist for scouting, no fixtures.
  FM.D.CLUBS_OVERSEAS = []; // Saint-Étienne, Montpellier and Tenerife now play in Ligue 2 and the Primera Federación

  // ---------- Alpha 1: the wider world in three simulation tiers ----------
  // full    — every match in the engine, finances, cups, transfers
  // light   — every fixture played, results from a fast statistical model with per-match player stats
  // minimal — fixtures produce scores only; squads exist for scouting and the market
  // Rows: [name, short, city, primary, secondary, identity, rep, stadium, capacity]
  FM.D.CLUBS_IT1 = [
    ['US Pietto', 'INT', 'Pietto', '#0068A8', '#000000', 'giant', 86, 'Stadio Trenezia', 75817],
    ['Virtus Gubbento', 'JUV', 'Gubbento', '#FFFFFF', '#000000', 'giant', 84, 'Stadio Nuovo Monale', 41507],
    ['AC Marara', 'NAP', 'Marara', '#12A0D7', '#FFFFFF', 'historic', 83, 'Stadio Serale', 54726],
    ['Pro Pietto', 'ACM', 'Pietto', '#FB090B', '#000000', 'giant', 82, 'Stadio Nuovo Ponola', 75817],
    ['Unione Trenia al Monte', 'ATA', 'Trenia al Monte', '#1E71B8', '#000000', 'selling', 78, 'Stadio Amalana', 24950],
    ['US Belago', 'ROM', 'Belago', '#8E1F2F', '#F0BC42', 'historic', 78, 'Stadio Civico di Belago', 70634],
    ['Atletico Belago', 'LAZ', 'Belago', '#87D8F7', '#FFFFFF', 'historic', 74, 'Stadio Monate', 70634],
    ['Audace Corale', 'BOL', 'Corale', '#A21C26', '#1A2F48', 'youth', 73, 'Stadio Nuovo Trenello', 36462],
    [
      'Unione Porto Santano',
      'FIO',
      'Porto Santano',
      '#482E92',
      '#FFFFFF',
      'historic',
      73,
      'Stadio Civico di Porto Santano',
      43147,
    ],
    ['Vilezia Calcio', 'COM', 'Vilezia', '#0E3E8C', '#FFFFFF', 'oil', 70, 'Stadio Comunale di Vilezia', 13602],
    ['AC Gubbento', 'TOR', 'Gubbento', '#8A1E03', '#FFFFFF', 'historic', 66, 'Stadio Comunale di Gubbento', 28177],
    ['AC Mirara', 'UDI', 'Mirara', '#FFFFFF', '#000000', 'selling', 64, 'Stadio Nuovo Amalello', 25144],
    ['Atletico Orvola', 'GEN', 'Orvola', '#A6192E', '#002E5D', 'fan', 64, 'Stadio Vilia', 36599],
    ['Pro Fabrago', 'PAR', 'Fabrago', '#FFFFFF', '#FFD100', 'fan', 62, 'Stadio Modara', 22352],
    ['Sporting Frascola', 'CAG', 'Frascola', '#A6192E', '#002E5D', 'fan', 62, 'Stadio Nuovo Vilale', 16416],
    ['Virtus Orvezia', 'SAS', 'Orvezia', '#00A650', '#000000', 'youth', 61, 'Arena Casara', 21584],
    ['Audace Casia', 'VER', 'Casia', '#FFD100', '#003DA5', 'youth', 60, 'Stadio Comunale di Casia', 39211],
    ['Virtus Piate', 'LEC', 'Piate', '#FFD100', '#E30613', 'youth', 60, 'Arena Vilate', 31533],
    ['SSC Trenone', 'CRE', 'Trenone', '#E30613', '#9A9A9A', 'fan', 58, 'Stadio Comunale di Trenone', 16003],
    ['Audace Mirino', 'PIS', 'Mirino', '#000000', '#0033A0', 'fan', 58, 'Stadio Belana', 25000],
  ];
  FM.D.CLUBS_NL1 = [
    ['KV Alkrade', 'AJA', 'Alkrade', '#FFFFFF', '#D2122E', 'giant', 81, 'De Oostburg', 55865],
    [
      'AFC Klein Oostburg',
      'PSV',
      'Klein Oostburg',
      '#ED1C24',
      '#FFFFFF',
      'historic',
      80,
      'Klein Oostburg Arena',
      35119,
    ],
    ['SC Zaanhorst', 'FEY', 'Zaanhorst', '#FF0000', '#FFFFFF', 'fan', 79, 'De Sneekwaard', 47500],
    ['RKC Groot Bredhout', 'AZA', 'Groot Bredhout', '#DB0021', '#FFFFFF', 'selling', 72, 'Westhoven Stadion', 19478],
    ['Victoria Zwolwijk', 'TWE', 'Zwolwijk', '#E30613', '#FFFFFF', 'historic', 68, 'De Leidijk', 30205],
    ['SC Westbrug', 'UTR', 'Westbrug', '#E30613', '#FFFFFF', 'fan', 66, 'Alkdijk Stadion', 23750],
    ['SC Dijklo', 'GAE', 'Dijklo', '#E30613', '#FFD100', 'fan', 62, 'Sportpark Haarvoort', 10400],
    ['VV Groot Haarzand', 'NEC', 'Groot Haarzand', '#E30613', '#00843D', 'fan', 62, 'Bergwaard Stadion', 12500],
    ['Victoria Hoornbrug', 'HEE', 'Hoornbrug', '#0055A4', '#FFFFFF', 'youth', 61, 'Devenbrug Stadion', 26100],
    ['FC Kleinvoort', 'GRO', 'Kleinvoort', '#008000', '#FFFFFF', 'historic', 60, 'Vlaarveen Stadion', 22525],
    ['KV Zaanhorst', 'SPR', 'Zaanhorst', '#E4002B', '#FFFFFF', 'youth', 58, 'Nieuwlo Stadion', 11026],
    ['AFC Maaswijk', 'PEC', 'Maaswijk', '#0055A4', '#FFFFFF', 'fan', 58, 'Sportpark Bredbrug', 14000],
    ['VV Sint Wagelo', 'FSI', 'Sint Wagelo', '#FFD100', '#00843D', 'fan', 57, 'De Hoogwijk', 12500],
    ['SC Zaanhout', 'NAC', 'Zaanhout', '#FFD100', '#000000', 'fan', 57, 'Stadion Haarburg', 19000],
    ['AFC Wagekerk', 'HER', 'Wagekerk', '#000000', '#FFFFFF', 'fan', 56, 'De Maaswijk', 12080],
    ['SC Laagdam aan Zee', 'VOL', 'Laagdam aan Zee', '#FF7F00', '#000000', 'youth', 55, 'Hoogzand Stadion', 7384],
    ['AFC Hoornvoort', 'EXC', 'Zaanhorst', '#E30613', '#000000', 'fan', 55, 'Zaanhorst Arena', 4500],
    ['VV Zwolstad', 'TEL', 'Zwolstad', '#FFFFFF', '#000000', 'fan', 54, 'Zwolstad Arena', 5200],
  ];
  FM.D.CLUBS_PT1 = [
    ['Atlético Porteiro', 'BEN', 'Porteiro', '#E30613', '#FFFFFF', 'giant', 83, 'Estádio Leirares', 64642],
    ['Sport Clube Pombão', 'FCP', 'Pombão', '#003893', '#FFFFFF', 'giant', 82, 'Estádio Nova Amarães', 50033],
    ['Sporting Porteiro', 'SCP', 'Porteiro', '#008057', '#FFFFFF', 'historic', 82, 'Arena Vendeiro', 50095],
    ['Associação Santinha', 'SCB', 'Santinha', '#E30613', '#FFFFFF', 'selling', 74, 'Estádio Nova Venda', 30286],
    ['Grémio Penura', 'VSC', 'Penura', '#FFFFFF', '#000000', 'fan', 66, 'Complexo Desportivo Penura', 30029],
    ['Sporting Moncha', 'SCL', 'Moncha', '#E30613', '#FFFFFF', 'fan', 60, 'Estádio Nova Ferrães', 13277],
    ['Atlético Guimouro', 'FAM', 'Guimouro', '#FFFFFF', '#003DA5', 'selling', 60, 'Estádio Mirela', 5307],
    ['Sport Clube Coveiro', 'EST', 'Coveiro', '#FFDD00', '#0038A8', 'youth', 60, 'Estádio Nova Torrares', 8000],
    ['Associação Santouro', 'GIL', 'Santouro', '#E30613', '#003DA5', 'fan', 58, 'Estádio Portão', 12046],
    [
      'Esporte Clube Alto Avouro',
      'ARO',
      'Alto Avouro',
      '#FFD100',
      '#0033A0',
      'fan',
      58,
      'Estádio Municipal de Alto Avouro',
      5600,
    ],
    ['Lamal Atlético Clube', 'RAV', 'Lamal', '#00843D', '#FFFFFF', 'oil', 57, 'Arena Figa', 9065],
    [
      'Sporting Portares da Serra',
      'MOR',
      'Portares da Serra',
      '#00843D',
      '#FFFFFF',
      'fan',
      57,
      'Complexo Desportivo Portares da Serra',
      6153,
    ],
    ['Toma Atlético Clube', 'CPI', 'Porteiro', '#000000', '#FFFFFF', 'fan', 57, 'Estádio Penais', 3000],
    ['Esporte Clube Pombela', 'CDN', 'Pombela', '#000000', '#FFFFFF', 'historic', 55, 'Arena Elvinha', 5132],
    ['Sporting Sesimela', 'AVS', 'Sesimela', '#E30613', '#FFFFFF', 'fan', 54, 'Estádio Nova Argada', 8560],
    ['Sport Clube Leirinha', 'EAM', 'Leirinha', '#E30613', '#00843D', 'fan', 54, 'Estádio Municipal de Leirinha', 9288],
    ['Atlético Cova', 'ALV', 'Cova', '#E30613', '#FFFFFF', 'selling', 54, 'Estádio Estreiro', 7705],
    ['Leirais FC', 'TON', 'Leirais', '#FFD100', '#00843D', 'fan', 53, 'Estádio Nova Tavirura', 5000],
  ];
  FM.D.CLUBS_AR1 = [
    ['Gimnasia de Arrano', 'RIV', 'Arrano', '#FFFFFF', '#E30613', 'giant', 79, 'Estadio Lavo', 85018],
    ['Defensores de Arrano', 'BOC', 'Arrano', '#0033A0', '#FFD100', 'giant', 78, 'Estadio Municipal de Arrano', 54000],
    ['Independiente Dorrez', 'RAC', 'Dorrez', '#6CACE4', '#FFFFFF', 'historic', 70, 'Cancha de Dorrez', 51389],
    [
      'Club Social y Deportivo Dorrez',
      'IND',
      'Dorrez',
      '#E30613',
      '#FFFFFF',
      'fallen',
      67,
      'Estadio Monumental Pellona',
      48069,
    ],
    ['Unión de Velero', 'ELP', 'Velero', '#E30613', '#FFFFFF', 'youth', 66, 'Estadio Municipal de Velero', 30018],
    [
      'Club Social y Deportivo Lezo',
      'SLO',
      'Arrano',
      '#0033A0',
      '#E30613',
      'historic',
      65,
      'Estadio Monumental Urqón',
      47964,
    ],
    ['Defensores de Franas', 'VEL', 'Arrano', '#FFFFFF', '#0033A0', 'youth', 64, 'Estadio Herero', 49540],
    ['Atlético Domeda', 'TAL', 'Domeda', '#0033A0', '#FFFFFF', 'selling', 63, 'Estadio Garilla', 57000],
    ['Atlético Quirez', 'ROS', 'Quirez', '#003DA5', '#FFD100', 'fan', 63, 'Estadio Municipal de Quirez', 41654],
    ['Club Atlético Domas', 'LAN', 'Domas', '#8A1538', '#FFFFFF', 'selling', 63, 'Estadio Molas', 47027],
    ['Velilla FC', 'ARJ', 'Arrano', '#E30613', '#FFFFFF', 'youth', 62, 'Estadio Ortia', 26000],
    ['Racing de Quirez', 'NOB', 'Quirez', '#E30613', '#000000', 'fan', 61, 'Estadio Pellez', 42000],
    ['Defensores de Pelleda', 'HUR', 'Arrano', '#FFFFFF', '#E30613', 'fan', 60, 'Estadio Monumental Quirui', 48314],
    ['Estudiantes de Dorrui', 'DYJ', 'Dorrui', '#FFD100', '#00843D', 'selling', 60, 'Cancha de Dorrui', 20000],
    ['Estudiantes de Domeda', 'BEL', 'Domeda', '#6CACE4', '#FFFFFF', 'fan', 60, 'Cancha de Domeda', 30000],
    ['Independiente Velero', 'GLP', 'Velero', '#FFFFFF', '#1B2C5A', 'fan', 58, 'Estadio Monumental Lezini', 24544],
    [
      'Gimnasia de Garero del Plata',
      'GOD',
      'Garero del Plata',
      '#0033A0',
      '#FFFFFF',
      'youth',
      58,
      'Estadio Municipal de Garero del Plata',
      42000,
    ],
    ['Atlético Urqini', 'TIG', 'Urqini', '#0033A0', '#E30613', 'fan', 57, 'Cancha de Urqini', 26282],
    ['Atlético Velas', 'UNI', 'Velas', '#E30613', '#FFFFFF', 'fan', 57, 'Estadio Cabras', 22852],
    ['Racing de Dorrona', 'INS', 'Domeda', '#E30613', '#FFFFFF', 'fan', 57, 'Estadio Puesar', 26535],
    ['Unión de Quirona', 'BAN', 'Quirona', '#00843D', '#FFFFFF', 'youth', 57, 'Cancha de Quirona', 34901],
    ['Racing de Garero del Plata', 'IRI', 'Garero del Plata', '#0033A0', '#FFFFFF', 'fan', 56, 'Estadio Herini', 24000],
    ['Defensores de Castas', 'ATU', 'Castas', '#6CACE4', '#FFFFFF', 'fan', 56, 'Cancha de Castas', 35200],
    ['Atlético Bustona', 'PLA', 'Bustona', '#FFFFFF', '#6B3F1F', 'fan', 56, 'Cancha de Bustona', 28530],
    ['Franui FC', 'BAR', 'Arrano', '#E30613', '#FFFFFF', 'fan', 55, 'Cancha de Arrano', 4500],
    ['Club Atlético Ortini', 'CCD', 'Ortini', '#000000', '#FFFFFF', 'fan', 55, 'Cancha de Ortini', 30000],
    [
      'Club Social y Deportivo Coronel Franero',
      'SAR',
      'Coronel Franero',
      '#00843D',
      '#FFFFFF',
      'fan',
      54,
      'Estadio Municipal de Coronel Franero',
      22000,
    ],
    ['Cabrona FC', 'RIE', 'Arrano', '#000000', '#FFFFFF', 'fan', 53, 'Estadio Miro', 3000],
  ];
  FM.D.CLUBS_US1 = [
    ['Wisthorpe City', 'MIA', 'Wisthorpe', '#F7B5CD', '#231F20', 'oil', 67, 'The Rosingham Stadium', 21550],
    ['Pickborough Victoria', 'LAF', 'Pickborough', '#000000', '#C39E6D', 'oil', 66, 'Exby Park', 22000],
    ['Pickborough Albion', 'LAG', 'Pickborough', '#FFFFFF', '#00245D', 'historic', 65, 'Yarport Green', 27000],
    ['Nanton Wanderers', 'SEA', 'Nanton', '#5D9741', '#005595', 'fan', 64, 'Ameshurst Park', 37722],
    ['Merbury Harriers', 'CIN', 'Merbury', '#003087', '#FE5000', 'youth', 63, 'Clevebrook Lane', 26000],
    ['Ripcombe Wednesday', 'CLB', 'Ripcombe', '#FEDD00', '#000000', 'historic', 62, 'Chalfield Park', 20371],
    ['Petington Rangers', 'PHI', 'Petington', '#071B2C', '#B19B69', 'youth', 62, 'Petington Park', 18500],
    ['North Warchester Harriers', 'NYC', 'North Warchester', '#6CACE4', '#041E42', 'oil', 62, 'Woksey Lane', 28743],
    ['Bexingham City', 'ATL', 'Bexingham', '#80000A', '#A19060', 'fan', 61, 'Bedcliff Park', 42500],
    ['North Warchester City', 'NYR', 'North Warchester', '#FFFFFF', '#BA0C2F', 'oil', 60, 'Tamsey Park', 25000],
    ['Blackmere Albion', 'NSH', 'Blackmere', '#ECE83A', '#1F1646', 'fan', 60, 'Farnwood Green', 30000],
    ['Astoney City', 'ORL', 'Astoney', '#633492', '#FDE192', 'fan', 60, 'Ingate Road', 25500],
    ['Hadham-under-Wood Town', 'VAN', 'Hadham-under-Wood', '#FFFFFF', '#00245E', 'youth', 60, 'Wrexton Lane', 22120],
    ['Holsey Rovers', 'PTI', 'Holsey', '#00482B', '#D69A00', 'fan', 59, 'Holsey Park', 25218],
    ['Sedsea Villa', 'MIN', 'Sedsea', '#585958', '#8CD2F4', 'fan', 58, 'Ashbury Green', 19400],
    ['Dorton Town', 'SDG', 'Dorton', '#1B1F23', '#6E4C9F', 'oil', 58, 'Marsey Green', 35000],
    ['Granton United', 'RSL', 'Granton', '#B30838', '#013A81', 'youth', 58, 'Granton Park', 20213],
    ['Athletic Club Cranstow', 'DAL', 'Cranstow', '#E81F3E', '#2A4076', 'youth', 58, 'Thirhaven Green', 20500],
    ['Hunminster Rangers', 'CLT', 'Hunminster', '#1A85C8', '#000000', 'fan', 57, 'The Olgate Stadium', 38000],
    ['Wiscliff Athletic', 'HOU', 'Wiscliff', '#FF6B00', '#101820', 'fan', 57, 'Wiscliff Ground', 22039],
    ['Lymestead Wednesday', 'SKC', 'Lymestead', '#91B0D5', '#002F65', 'fan', 57, 'Glasney Field', 18467],
    ['Tadhaven Villa', 'STL', 'Tadhaven', '#DD004A', '#0A1E2C', 'fan', 57, 'The Beckcombe Stadium', 22423],
    ['Excombe County', 'RAP', 'Excombe', '#960A2C', '#9CC2EA', 'youth', 56, 'Excombe Ground', 18061],
    ['Howbrook City', 'AUS', 'Howbrook', '#00B140', '#000000', 'fan', 56, 'Filport Field', 20738],
    ['Nanhurst United', 'CHI', 'Nanhurst', '#7CCDEF', '#FF0000', 'fan', 56, 'Calbrook Lane', 61500],
    ['Crewford Argyle', 'DCU', 'Crewford', '#000000', '#EF3E42', 'fan', 56, 'Crewford Park', 20000],
    ['Tutborough Town', 'NER', 'Tutborough', '#0A2240', '#CE0E2D', 'fan', 56, 'Tutborough Park', 65878],
    ['North Hatsey Albion', 'TRT', 'North Hatsey', '#B81137', '#455560', 'fan', 57, 'Yeoworth Park', 30991],
    ['Olwich Town', 'MTL', 'Olwich', '#000000', '#0033A1', 'fan', 55, 'Blackdon Park', 19619],
    ['Stafminster County', 'SJE', 'Stafminster', '#0067B1', '#000000', 'fan', 55, 'Hunpool Park', 18000],
  ];
  FM.D.CLUBS_JP1 = [
    [
      'Nishiharukami United',
      'VIS',
      'Nishiharukami',
      '#8B0000',
      '#FFFFFF',
      'oil',
      64,
      'Nishiharukami Sports Complex',
      30132,
    ],
    ['Kitanarisaki United', 'KAS', 'Kitanarisaki', '#B8002D', '#1D2088', 'historic', 64, 'Takano Stadium', 40728],
    ['Sakurata Verde', 'URA', 'Sakurata', '#E60012', '#000000', 'giant', 63, 'Sakurata Athletic Stadium', 63700],
    ['Shinmoto United', 'SFH', 'Shinmoto', '#50318F', '#FFFFFF', 'youth', 63, 'Saimoto Park', 28520],
    ['Saigawa Sevens', 'KAW', 'Saigawa', '#1E90FF', '#000000', 'historic', 62, 'Saigawa Athletic Stadium', 26827],
    ['Akisaki Blaze', 'YFM', 'Akisaki', '#0033A0', '#FFFFFF', 'historic', 61, 'Takeyama Park', 72327],
    ['Matsta FC', 'GAM', 'Matsta', '#1A3D8F', '#000000', 'historic', 60, 'Matsta Sports Complex', 39694],
    ['Asahama Athletic', 'MAC', 'Asahama', '#002E6E', '#C8A200', 'oil', 60, 'Asahama Sports Complex', 15489],
    ['Higashino Athletic', 'FCT', 'Higashino', '#0033A0', '#E60012', 'fan', 60, 'Higashino Athletic Stadium', 49970],
    ['Nagakami United', 'KSW', 'Nagakami', '#FFF000', '#000000', 'selling', 58, 'Nagakami Athletic Stadium', 15109],
    ['Fujimori FC', 'NAG', 'Fujimori', '#D6000F', '#F9A61A', 'fan', 58, 'Inasaki Arena', 44380],
    ['Matsta Sevens', 'CER', 'Matsta', '#EC6A9E', '#0A1F5C', 'historic', 58, 'Matsura Stadium', 24481],
    ['Kitaokaura City', 'AVI', 'Kitaokaura', '#1C1C7C', '#AAAAAA', 'youth', 56, 'Haruura Arena', 21562],
    ['FC Hokuno', 'KYO', 'Hokuno', '#6A1B9A', '#FFFFFF', 'fan', 56, 'Kawahara Arena', 21600],
    ['Okaura United', 'NII', 'Okaura', '#FF6600', '#003DA5', 'youth', 55, 'Narizawa Arena', 42300],
    ['FC Matszawa', 'SBM', 'Matszawa', '#8CC63F', '#003DA5', 'youth', 55, 'Matszawa Sports Complex', 15380],
    ['Higashino United', 'TVE', 'Higashino', '#00843D', '#FFFFFF', 'fan', 55, 'Kawamoto Arena', 49970],
    ['Matsaki FC', 'SHI', 'Matsaki', '#FF8200', '#003DA5', 'fan', 55, 'Saita Stadium', 19594],
    ['Nagano City', 'OKA', 'Nagano', '#9E1B32', '#FFFFFF', 'fan', 53, 'Nagaura Arena', 15479],
    ['Akisaki Phoenix', 'YFC', 'Akisaki', '#00A0E9', '#FFFFFF', 'fan', 53, 'Kitashima Park', 15440],
  ];
  // Minimal tier (8 clubs): [name, short, city, primary, secondary, identity, rep]
  FM.D.CLUBS_MX1 = [
    ['Atlético Jilitzin', 'AME', 'Jilitzin', '#FFE600', '#0A1F5C', 'giant', 70, 'Estadio Olímpico de Jilitzin'],
    ['Tulapan FC', 'MTY', 'Tulapan', '#0B2240', '#FFFFFF', 'oil', 68, 'Estadio Tampicatl'],
    ['Club Jilehua', 'TGR', 'Jilehua', '#FDB913', '#003DA5', 'oil', 68, 'Estadio Municipal de Jilehua'],
    ['Halcones de Coatohua', 'CHV', 'Coatohua', '#E30613', '#FFFFFF', 'historic', 67, 'Estadio Olímpico de Coatohua'],
    ['Real Jilitzin', 'CAZ', 'Jilitzin', '#0033A0', '#FFFFFF', 'historic', 66, 'Estadio Coatechitlán'],
    ['Halcones de Yaulco', 'TOL', 'Yaulco', '#E30613', '#FFFFFF', 'fan', 64, 'Estadio Chalachitlán'],
    ['Unión Jilahua', 'PUM', 'Jilitzin', '#0B2240', '#C5A45A', 'youth', 63, 'Estadio Papanalco'],
    ['Atlético Xalán', 'PAC', 'Xalán', '#FFFFFF', '#0033A0', 'selling', 63, 'Estadio Chalapa'],
    ['Halcones de Ocotipan', 'LEO', 'Ocotipan', '#00843D', '#FFFFFF', 'selling', 62, 'Estadio Municipal de Ocotipan'],
    ['Santos Puerto de Tulohua', 'SLA', 'Puerto de Tulohua', '#00843D', '#FFFFFF', 'youth', 60, 'Estadio Huilco'],
    ['Atlético Coatohua', 'ATS', 'Coatohua', '#E30613', '#000000', 'fan', 60, 'Estadio Municipal de Coatohua'],
    ['Deportivo Ocotipa', 'TIJ', 'Ocotipa', '#E30613', '#000000', 'fan', 58, 'Estadio Tecatl'],
    ['Atlético Ixtec', 'NCX', 'Ixtec', '#E30613', '#FFFFFF', 'fan', 57, 'Estadio Papanilco'],
    ['Club Zapa', 'QRO', 'Zapa', '#0033A0', '#000000', 'fan', 56, 'Estadio Chaletlán'],
    ['Unión Xalicán', 'PUE', 'Xalicán', '#FFFFFF', '#0033A0', 'fan', 56, 'Estadio Ixtacán'],
    ['Club Cuautlán', 'JUA', 'Cuautlán', '#00843D', '#E30613', 'fan', 56, 'Estadio Yauco'],
    ['Atlético Pachua', 'ASL', 'Pachua', '#E30613', '#003DA5', 'fan', 56, 'Estadio La Teolco'],
    ['Tulec FC', 'MAZ', 'Tulec', '#6A1B9A', '#FFFFFF', 'fan', 55, 'Estadio Olímpico de Tulec'],
  ];
  FM.D.CLUBS_NG1 = [
    ['Wexby City', 'ENY', 'Wexby', '#003DA5', '#FFFFFF', 'giant', 55, 'Reyborough Park'],
    ['Kilwick Borough', 'RAN', 'Kilwick', '#E30613', '#FFFFFF', 'historic', 52, 'Kilwick Park'],
    ['Pickham Wanderers', 'RVU', 'Pickham', '#0369A1', '#F59E0B', 'oil', 52, 'Darport Lane'],
    ['Stambrook Town', 'REM', 'Stambrook', '#15803D', '#FFFFFF', 'selling', 51, 'Stambrook Park'],
    ['Castle Bromney County', 'KPI', 'Castle Bromney', '#FFD100', '#006400', 'historic', 51, 'The Gainholm Stadium'],
    ['Kirkstead Wanderers', 'SSC', 'Kirkstead', '#003DA5', '#FFFFFF', 'fan', 49, 'Horbrook Park'],
    ['Swangate County', 'LOB', 'Swangate', '#E30613', '#FFFFFF', 'fan', 48, 'Walingham Lane'],
    ['Fenwold United', 'PLU', 'Fenwold', '#E30613', '#FFD100', 'youth', 48, 'Fenwold Park'],
    ['Little Hydedale Wednesday', 'BDI', 'Little Hydedale', '#003DA5', '#FFFFFF', 'historic', 47, 'Wokby Green'],
    ['Roswich Athletic', 'HRT', 'Roswich', '#E30613', '#FFFFFF', 'historic', 47, 'Radsea Road'],
    ['Chipcombe-le-Moors Athletic', 'IKC', 'Chipcombe-le-Moors', '#003DA5', '#FFD100', 'oil', 47, 'Dargate Park'],
    ['Nansey Wednesday', 'ABW', 'Nansey', '#00843D', '#FFD100', 'fan', 47, 'Sutwood Field'],
    ['Hunchester Albion', 'AKW', 'Hunchester', '#003DA5', '#FFFFFF', 'fan', 47, 'Bridfield Park'],
    ['Hatpool Argyle', 'KWU', 'Hatpool', '#00843D', '#FFFFFF', 'fan', 46, 'Tivhaven Park'],
    ['Sudwood Alexandra', 'NSU', 'Sudwood', '#FFD100', '#00843D', 'fan', 46, 'Elmwick Green'],
    ['Stocliff Athletic', 'NIT', 'Stocliff', '#FFD100', '#003DA5', 'fan', 46, 'Stocliff Park'],
    ['Epbury City', 'BYU', 'Epbury', '#003DA5', '#E30613', 'fan', 46, 'Epbury Ground'],
    ['Pudwich United', 'EKW', 'Pudwich', '#00843D', '#FFFFFF', 'fan', 46, 'Cobton Park'],
    ['Plyfield Victoria', 'KTU', 'Plyfield', '#E30613', '#00843D', 'fan', 45, 'The Clevegate Stadium'],
    ['Kirkborough Rovers', 'SUS', 'Kirkborough', '#FFD100', '#003DA5', 'fan', 45, 'The Bradton Stadium'],
  ];
  FM.D.CLUBS_KR1 = [
    ['Gangyang Citizen', 'ULS', 'Gangyang', '#003DA5', '#FFD100', 'oil', 60, 'Gangyang Stadium'],
    ['Choyang Athletic', 'JBH', 'Choyang', '#00843D', '#FFD100', 'giant', 60, 'Choyang Stadium'],
    ['Bohwa United', 'POH', 'Bohwa', '#E30613', '#000000', 'historic', 57, 'Haesan Arena'],
    ['FC Chunwon', 'SEO', 'Chunwon', '#E30613', '#000000', 'historic', 57, 'Sincheon Arena'],
    ['Seoyang Stars', 'DJN', 'Seoyang', '#6A1B9A', '#00843D', 'oil', 55, 'Seoyang Civic Stadium'],
    ['Chohwa Citizen', 'GWA', 'Chohwa', '#FFD100', '#E30613', 'youth', 54, 'Chohwa Stadium'],
    ['Choseong Stars', 'GAN', 'Choseong', '#FF7F00', '#003DA5', 'fan', 53, 'Seowon Arena'],
    ['Bujeong Tigers', 'GIM', 'Bujeong', '#E30613', '#003DA5', 'fan', 53, 'Bujeong Stadium'],
    ['Haejin Stars', 'JEJ', 'Haejin', '#FF6600', '#000000', 'fan', 52, 'Chungju Arena'],
    ['Gyeongcheon FC', 'DGU', 'Gyeongcheon', '#87CEEB', '#1C2B4F', 'youth', 52, 'Wolcheon Arena'],
    ['Wolhwa FC', 'SUW', 'Wolhwa', '#E30613', '#003DA5', 'fan', 52, 'Chunjeong Arena'],
    ['Gangjeong Stars', 'ANY', 'Gangjeong', '#5B2C83', '#FFFFFF', 'fan', 51, 'Gangjeong Stadium'],
  ];
  FM.D.CLUBS_TH1 = [
    ['Takchan Rangers', 'BRU', 'Takchan', '#003DA5', '#FFD100', 'oil', 56, 'Nakhonmai Arena'],
    ['Ubonam FC', 'BGP', 'Ubonam', '#0A1E5E', '#FFFFFF', 'oil', 52, 'Phrapur Sports Park'],
    ['Nongkaeo Athletic', 'BKU', 'Nongkaeo', '#E30613', '#FFFFFF', 'historic', 51, 'Khaoyai Arena'],
    ['Nongkaeo Mariners', 'PRT', 'Nongkaeo', '#FF7F00', '#003DA5', 'fan', 50, 'Sakpur Arena'],
    ['Wangchan Athletic', 'MTU', 'Wangchan', '#E30613', '#000000', 'historic', 50, 'Maenam Stadium'],
    ['Sakchan City', 'CRA', 'Sakchan', '#003DA5', '#FFFFFF', 'youth', 48, 'Ubonkaeo Arena'],
    ['Ubonsai City', 'CHB', 'Ubonsai', '#0055A4', '#FFFFFF', 'historic', 48, 'Ubonam Stadium'],
    ['Khaonong City', 'RAT', 'Khaonong', '#E30613', '#FFD100', 'youth', 47, 'Khaonong Provincial Stadium'],
    ['Khaoburi Rangers', 'UTH', 'Khaoburi', '#FF7F00', '#000000', 'fan', 46, 'Chiangmai Sports Park'],
    ['Ubonthong City', 'PRA', 'Ubonthong', '#E30613', '#FFFFFF', 'fan', 46, 'Ubonlek Arena'],
    ['Wangmai City', 'SKT', 'Wangmai', '#FFD100', '#000000', 'fan', 46, 'Wangmai Provincial Stadium'],
    ['Phunam Rangers', 'KBP', 'Phunam', '#003DA5', '#E30613', 'oil', 46, 'Phunong Sports Park'],
    ['Saklek FC', 'LPW', 'Saklek', '#6A1B9A', '#FFFFFF', 'fan', 45, 'Khaoyai Stadium'],
    ['Muang Nakhonsai', 'AYU', 'Nakhonsai', '#E30613', '#FFFFFF', 'fan', 45, 'Wangyai Stadium'],
    ['Paksai Mariners', 'RYG', 'Paksai', '#003DA5', '#FFFFFF', 'fan', 44, 'Nakhonsai Stadium'],
    ['Ubonburi United', 'NRS', 'Ubonburi', '#FF7F00', '#6A1B9A', 'fan', 44, 'Phuburi Arena'],
  ];
  FM.D.CLUBS_RS1 = [
    ['Union Jasovac', 'CZV', 'Jasovac', '#E30613', '#FFFFFF', 'giant', 64, 'Stadion Mir Jasovac'],
    ['NK Jasovac', 'FKP', 'Jasovac', '#000000', '#FFFFFF', 'giant', 61, 'Stadion Bratina'],
    ['Zora Novany', 'VOJ', 'Novany', '#E30613', '#FFFFFF', 'historic', 57, 'Gradski Stadion Novany'],
    ['KS Tarina', 'TSC', 'Tarina', '#003DA5', '#FFFFFF', 'oil', 56, 'Stadion Mir Tarina'],
    ['MFK Vysany', 'CUK', 'Jasovac', '#000000', '#FFD100', 'youth', 53, 'Stadion Kosovice'],
    ['Union Slavek', 'RAD', 'Slavek', '#E30613', '#FFFFFF', 'fan', 53, 'Stadion Gorina'],
    ['SK Lubik', 'NPZ', 'Lubik', '#E30613', '#FFFFFF', 'fan', 52, 'Drapol Arena'],
    ['NK Gorik', 'OFK', 'Jasovac', '#003DA5', '#FFFFFF', 'historic', 51, 'Stadion Velava'],
    ['Union Kamovo', 'IMT', 'Jasovac', '#1F2937', '#E5E7EB', 'youth', 50, 'Stadion Jasovac'],
    ['FK Slaava', 'SPS', 'Slaava', '#003DA5', '#FFFFFF', 'fan', 50, 'Stadion Plesovo'],
    ['NK Belek', 'RNI', 'Belek', '#E30613', '#003DA5', 'fan', 50, 'Stadion Mir Belek'],
    ['Union Petina', 'ZEL', 'Petina', '#003DA5', '#FFFFFF', 'fan', 49, 'Stadion Mir Petina'],
    ['FC Zelpol', 'NKR', 'Zelpol', '#E30613', '#FFFFFF', 'fan', 49, 'Stadion Mir Zelpol'],
    ['Lokomotiva Vysice', 'MLU', 'Vysice', '#E30613', '#FFFFFF', 'fan', 48, 'Stadion Kosovac'],
    ['MFK Borava', 'JUB', 'Borava', '#003DA5', '#FFFFFF', 'fan', 46, 'Stadion Slaany'],
    ['AO Vysovice', 'TEK', 'Vysovice', '#00843D', '#FFFFFF', 'fan', 46, 'Gradski Stadion Vysovice'],
  ];
  FM.D.CLUBS_MA1 = [
    ['AS Nanlieu', 'WAC', 'Nanlieu', '#E30613', '#FFFFFF', 'giant', 59, 'Stade de la Rocourt'],
    ['SC Nanlieu', 'RCA', 'Nanlieu', '#00843D', '#FFFFFF', 'giant', 59, 'Stade de la Cherac'],
    ['FC Dieumont', 'FAR', 'Dieumont', '#E30613', '#000000', 'historic', 57, 'Parc des Sports de Dieumont'],
    ['Beauac FC', 'RSB', 'Beauac', '#FF7F00', '#000000', 'oil', 56, 'Stade Cassault'],
    ['SC Dieumont', 'FUS', 'Dieumont', '#003DA5', '#FFFFFF', 'youth', 54, 'Stade Montières'],
    ['US Durac', 'MAS', 'Durac', '#FFD100', '#000000', 'historic', 52, 'Stade Montay'],
    ['Racing Saint-Aublieu', 'HAG', 'Saint-Aublieu', '#E30613', '#FFD100', 'fan', 50, 'Complexe Armont'],
    ['Racing Tourlac', 'IRT', 'Tourlac', '#003DA5', '#FFFFFF', 'youth', 50, 'Stade Municipal de Tourlac'],
    ['SC Mirens', 'MAT', 'Mirens', '#E30613', '#FFFFFF', 'historic', 49, 'Parc des Sports de Mirens'],
    ['AS Pont-Clerault', 'OCS', 'Pont-Clerault', '#003DA5', '#FFFFFF', 'fan', 48, 'Stade Municipal de Pont-Clerault'],
    ['AJ Monens', 'DHJ', 'Monens', '#00843D', '#FFFFFF', 'fan', 48, 'Stade de la Damay'],
    ['SC Lanay', 'RSZ', 'Lanay', '#00843D', '#FFFFFF', 'fan', 47, 'Complexe Dieuault'],
    ['US Rocon', 'UTS', 'Dieumont', '#FF7F00', '#000000', 'fan', 47, 'Stade Vendens'],
    ['ES Saint-Lunac', 'COD', 'Saint-Lunac', '#E30613', '#00843D', 'fan', 47, 'Stade de la Clerange'],
    [
      'FC Monbourg-sur-Aure',
      'SCC',
      'Monbourg-sur-Aure',
      '#E30613',
      '#000000',
      'fan',
      46,
      'Parc des Sports de Monbourg-sur-Aure',
    ],
    ['FC Mirlac', 'JSS', 'Mirlac', '#003DA5', '#FFFFFF', 'fan', 46, 'Complexe Valon'],
  ];

  // ---------- More minimal leagues: the next European leagues by UEFA coefficient ----------
  FM.D.CLUBS_BE1 = [
    ['Sparta Tilkerk', 'CLB2', 'Tilkerk', '#0E4DA4', '#000000', 'giant', 68, 'Stadion Noordveen'],
    ['AFC Sneekvoort', 'USG', 'Sneekvoort', '#FFDD00', '#0033A0', 'selling', 64, 'Sportpark Laagburg'],
    ['Racing Sneekvoort', 'AND2', 'Sneekvoort', '#4B2C85', '#FFFFFF', 'giant', 65, 'Sneekvoort Arena'],
    ['AFC Wagedam', 'GNK', 'Wagedam', '#003DA5', '#FFFFFF', 'youth', 63, 'De Oostbrug'],
    ['SC Zwolhout', 'GNT', 'Zwolhout', '#003DA5', '#FFFFFF', 'historic', 61, 'Haarade Stadion'],
    ['Grootlo Boys', 'ANT', 'Grootlo', '#E30613', '#FFFFFF', 'oil', 61, 'Grootlo Arena'],
    ['SC Dijkhout', 'STL2', 'Dijkhout', '#E30613', '#FFFFFF', 'fallen', 59, 'Sportpark Veenhoven'],
    ['FC Tilkerk', 'CER2', 'Tilkerk', '#00843D', '#000000', 'youth', 56, 'Maasvoort Stadion'],
    ['FC Noordwijk', 'KVM', 'Noordwijk', '#FFDD00', '#E30613', 'fan', 56, 'Noordwijk Arena'],
    ['Racing Bergwaard', 'WES', 'Bergwaard', '#FFDD00', '#003DA5', 'oil', 55, 'Dijklo Stadion'],
    ['RKC Nieuwijk', 'CHL', 'Nieuwijk', '#000000', '#FFFFFF', 'fan', 55, 'Sportpark Wagedijk'],
    ['Eendracht Oudlo', 'OHL', 'Oudlo', '#FFFFFF', '#00843D', 'fan', 54, 'Sportpark Veenhorst'],
    ['VV Kleinkerk', 'STV2', 'Kleinkerk', '#FFDD00', '#003DA5', 'selling', 53, 'Kleinkerk Arena'],
    ['RKC Oosthorst', 'DEN2', 'Oosthorst', '#E30613', '#FFFFFF', 'fan', 51, 'De Kleinbeek'],
    ['KV Tilzand', 'ZWA', 'Tilzand', '#E30613', '#00843D', 'fan', 51, 'Tilzand Arena'],
    ['FC Zuidwaard', 'RAAL', 'Zuidwaard', '#00843D', '#FFFFFF', 'fan', 50, 'De Haarvoort'],
  ];
  FM.D.CLUBS_TR1 = [
    ['Demehir Birlik', 'GAL', 'Demehir', '#A90432', '#FDB912', 'giant', 72, 'Kızova Stadyumu'],
    ['Demehir Gençlik', 'FEN', 'Demehir', '#FFED00', '#004A9F', 'giant', 71, 'Gülbahçe Stadyumu'],
    ['Yenehir Gençlik', 'BJK', 'Demehir', '#000000', '#FFFFFF', 'giant', 67, 'Demehir Şehir Stadyumu'],
    ['Aydbahçe Atletik', 'TS', 'Aydbahçe', '#7A1E3A', '#6CABDD', 'historic', 63, 'Demköy Stadyumu'],
    ['Aköy Birlik', 'IBFK', 'Demehir', '#F47920', '#0B1F4B', 'oil', 60, 'Demdere Stadyumu'],
    ['Dembahçespor', 'SAM2', 'Dembahçe', '#E30613', '#FFFFFF', 'fan', 57, 'Dembahçe Şehir Stadyumu'],
    ['Karpınar Belediyespor', 'GOZ', 'Karpınar', '#FFDD00', '#E30613', 'fan', 56, 'Karpınar Şehir Stadyumu'],
    ['Gülsaray Gençlik', 'EYP', 'Demehir', '#6A1B9A', '#FFDD00', 'oil', 55, 'Demehir Cumhuriyet Stadyumu'],
    ['Kaybahçespor', 'KAS2', 'Demehir', '#003DA5', '#FFFFFF', 'fan', 54, 'Tavsaray Arena'],
    ['Çansarayspor', 'RIZ', 'Çansaray', '#00843D', '#003DA5', 'fan', 54, 'Çansaray Cumhuriyet Stadyumu'],
    ['Uşehir Belediyespor', 'KON', 'Uşehir', '#00843D', '#FFFFFF', 'fan', 54, 'Uşehir Cumhuriyet Stadyumu'],
    ['Bozlar SK', 'ANT2', 'Bozlar', '#E30613', '#FFFFFF', 'fan', 53, 'Bozlar Şehir Stadyumu'],
    ['Bozsaray Gücü', 'ALY', 'Bozsaray', '#F47920', '#00843D', 'fan', 53, 'Merkale Stadyumu'],
    ['Tekbahçe Birlik', 'GAZ', 'Tekbahçe', '#E30613', '#000000', 'fan', 53, 'Karova Stadyumu'],
    ['Çanlar Belediyespor', 'KAY', 'Çanlar', '#FFDD00', '#E30613', 'fan', 52, 'Çanlar Cumhuriyet Stadyumu'],
    ['Bozova Birlik', 'KOC', 'Bozova', '#00843D', '#000000', 'fan', 52, 'Bozova Şehir Stadyumu'],
    ['Gülar SK', 'GEN2', 'Gülar', '#E30613', '#000000', 'youth', 51, 'Orhköy Arena'],
    ['Orhbahçe SK', 'FKG', 'Demehir', '#E30613', '#000000', 'fan', 51, 'Akpınar Arena'],
  ];
  FM.D.CLUBS_CZ1 = [
    ['SK Holava', 'SLA2', 'Holava', '#E30613', '#FFFFFF', 'giant', 64, 'Letní stadion Holava'],
    ['TJ Holava', 'SPA', 'Holava', '#8A1538', '#FFFFFF', 'giant', 63, 'Městský stadion Holava'],
    ['FK Nymany', 'PLZ', 'Nymany', '#E30613', '#003DA5', 'historic', 61, 'Aréna Nymov'],
    ['SK Nymoná', 'BAN2', 'Nymoná', '#6CABDD', '#FFFFFF', 'fan', 56, 'Aréna Kostany'],
    ['Slavoj Mladov', 'SIG', 'Mladov', '#003DA5', '#FFFFFF', 'youth', 53, 'Městský stadion Mladov'],
    ['Sokol Olomava', 'LIB2', 'Olomava', '#FFFFFF', '#003DA5', 'youth', 53, 'Městský stadion Olomava'],
    ['FK Branany', 'HKR', 'Branany', '#000000', '#FFDD00', 'fan', 51, 'Městský stadion Branany'],
    ['FC Rychodov', 'MBO', 'Rychodov', '#003DA5', '#FFFFFF', 'selling', 51, 'Letní stadion Rychodov'],
    ['Sokol Liboná', 'BOH', 'Holava', '#00843D', '#FFFFFF', 'fan', 50, 'Stadion u Trenec'],
    ['SK Zlínava', 'JAB', 'Zlínava', '#00843D', '#000000', 'fan', 50, 'Městský stadion Zlínava'],
    ['1. FC Vsetínice', 'TEP', 'Vsetínice', '#FFDD00', '#003DA5', 'fan', 49, 'Aréna Pardov'],
    ['Dynamo Vsetínany', 'PAR2', 'Vsetínany', '#E30613', '#FFFFFF', 'fan', 48, 'Letní stadion Vsetínany'],
    ['Dynamo Nový Hradená', 'KAR', 'Nový Hradená', '#00843D', '#FFFFFF', 'fan', 48, 'Městský stadion Nový Hradená'],
    ['1. FC Trenodov', 'SLO2', 'Trenodov', '#003DA5', '#FFFFFF', 'fan', 48, 'Aréna Hradec'],
    ['1. FC Holodov', 'DUK', 'Holava', '#FFDD00', '#8A1538', 'historic', 47, 'Stadion Zlínedov'],
    ['FK Starý Hradov', 'ZLN', 'Starý Hradov', '#FFDD00', '#000000', 'fan', 47, 'Stadion u Kostov'],
  ];
  FM.D.CLUBS_GR1 = [
    ['GS Marópetra', 'OLY2', 'Marópetra', '#E30613', '#FFFFFF', 'giant', 68, 'Stadio Trouli'],
    ['Lamida FC', 'PAO', 'Lamida', '#00843D', '#FFFFFF', 'giant', 64, 'Dimotiko Stadio Lamida'],
    ['Doxa Lamida', 'AEK', 'Lamida', '#FFDD00', '#000000', 'giant', 64, 'Ioanaki Arena'],
    ['Niki Pirás', 'PAOK', 'Pirás', '#000000', '#FFFFFF', 'historic', 65, 'Serouli Arena'],
    ['AE Pirás', 'ARI', 'Pirás', '#FFDD00', '#000000', 'fan', 57, 'Dimotiko Stadio Pirás'],
    ['AO Kato Kypás', 'OFI', 'Kato Kypás', '#000000', '#FFFFFF', 'fan', 53, 'Pelos Arena'],
    ['AE Lamaki', 'ATR', 'Lamaki', '#003DA5', '#FFFFFF', 'fan', 52, 'Stadio Ioanás'],
    ['AE Ioanida', 'AST', 'Ioanida', '#FFDD00', '#003DA5', 'fan', 51, 'Dimotiko Stadio Ioanida'],
    ['Tránia FC', 'PNT', 'Tránia', '#FFDD00', '#003DA5', 'fan', 50, 'Stadio Alexaki'],
    ['AE Thesos', 'VOL2', 'Thesos', '#E30613', '#003DA5', 'fan', 50, 'Nikia Arena'],
    ['Argouli FC', 'LEV2', 'Argouli', '#00843D', '#FFFFFF', 'fan', 49, 'Stadio Kypaki'],
    ['Panathlitikos Ioanaki', 'KIF', 'Ioanaki', '#003DA5', '#FFFFFF', 'fan', 49, 'Stadio Kypina'],
    ['AE Chalida', 'AEL', 'Chalida', '#8A1538', '#FFFFFF', 'historic', 48, 'Dimotiko Stadio Chalida'],
    ['Apollon Kypópoli', 'PSR', 'Kypópoli', '#E30613', '#FFFFFF', 'fan', 48, 'Dimotiko Stadio Kypópoli'],
  ];
  FM.D.CLUBS_NO1 = [
    ['Dyrvik IF', 'BOD', 'Dyrvik', '#FFDD00', '#000000', 'youth', 63, 'Dyrvik Idrætsanlæg'],
    ['Dyrlund IF', 'BRA2', 'Dyrlund', '#E30613', '#FFFFFF', 'fan', 58, 'Holholm Stadion'],
    ['FC Broløkke', 'VIK', 'Broløkke', '#003DA5', '#FFFFFF', 'historic', 57, 'Broløkke Idrætsanlæg'],
    ['Lillesund FK', 'RBK', 'Lillesund', '#FFFFFF', '#000000', 'giant', 58, 'Holby Stadion'],
    ['IK Bergø', 'MOL', 'Bergø', '#003DA5', '#FFFFFF', 'historic', 58, 'Bergø Idrætsanlæg'],
    ['Kilund FK', 'S08', 'Kilund', '#003DA5', '#FFFFFF', 'fan', 51, 'Dyrnæs Stadion'],
    ['FC Langby', 'FFK', 'Langby', '#FFFFFF', '#E30613', 'historic', 51, 'Langby Arena'],
    ['FC Havdal', 'TIL', 'Havdal', '#E30613', '#FFFFFF', 'fan', 51, 'Sydlund Stadion'],
    ['Strandlund BK', 'SAF2', 'Strandlund', '#003DA5', '#FFFFFF', 'fan', 49, 'Strandlund Arena'],
    ['Fremad Sønderfors', 'KFU', 'Sønderfors', '#003DA5', '#FFFFFF', 'fan', 49, 'Sønderfors Arena'],
    ['FC Fjordø', 'HAM', 'Fjordø', '#00843D', '#FFFFFF', 'fan', 48, 'Solgård Idrætspark'],
    ['Fremad Nordnyø', 'KBK', 'Nordnyø', '#003DA5', '#FFFFFF', 'fan', 48, 'Nordnyø Arena'],
    ['BK Sønderfors', 'VIF', 'Sønderfors', '#003DA5', '#E30613', 'historic', 52, 'Ringård Idrætspark'],
    ['Ringby FK', 'BRY', 'Ringby', '#E30613', '#FFFFFF', 'fan', 46, 'Ringby Arena'],
    ['Fremad Nesløkke', 'SIF', 'Nesløkke', '#003DA5', '#FFFFFF', 'fan', 48, 'Dyrø Stadion'],
    ['Gammelgård FK', 'FKH', 'Gammelgård', '#003DA5', '#FFFFFF', 'fan', 47, 'Hedfors Stadion'],
  ];
  FM.D.CLUBS_PL1 = [
    ['KS Jarosice', 'LPO', 'Jarosice', '#003DA5', '#FFFFFF', 'giant', 60, 'Stadion Kostów'],
    ['Radeno FC', 'RAK', 'Radeno', '#E30613', '#003DA5', 'oil', 59, 'Arena Rybnówka'],
    ['KS Stary Kalice', 'JAG', 'Stary Kalice', '#FFDD00', '#E30613', 'fan', 58, 'Stadion Miejski im. Radosk'],
    ['Unia Wielki Siedlec', 'LEG2', 'Wielki Siedlec', '#FFFFFF', '#00843D', 'giant', 60, 'Stadion Siedlec'],
    ['GKS Słupice', 'POG', 'Słupice', '#003DA5', '#8A1538', 'fan', 55, 'Stadion im. Słupono'],
    ['KS Radeka', 'GOR', 'Radeka', '#FFFFFF', '#003DA5', 'historic', 54, 'Stadion im. Siedlów'],
    ['Zagłębie Słupówka', 'CRA2', 'Słupówka', '#E30613', '#FFFFFF', 'fan', 53, 'Stadion Ludowy Słupówka'],
    ['LKS Rybnów', 'WID', 'Rybnów', '#E30613', '#FFFFFF', 'oil', 53, 'Stadion Kostin'],
    ['Stary Białec Sokół', 'GKS', 'Stary Białec', '#FFDD00', '#00843D', 'fan', 51, 'Stadion Ludowy Stary Białec'],
    ['Ruch Luba', 'ZAG', 'Luba', '#F47920', '#00843D', 'youth', 52, 'Stadion Miejski im. Brzezewo'],
    ['Zagłębie Opolice', 'PIA', 'Opolice', '#003DA5', '#E30613', 'fan', 52, 'Arena Wielów'],
    ['Dąbroka FC', 'MOT', 'Dąbroka', '#FFDD00', '#003DA5', 'fan', 50, 'Stadion Miejski im. Radec'],
    ['Górnik Kalono', 'KOR', 'Kalono', '#FFDD00', '#E30613', 'fan', 50, 'Stadion im. Rybno'],
    ['Dolny Płocin Sokół', 'RAD2', 'Dolny Płocin', '#00843D', '#FFFFFF', 'fan', 50, 'Stadion Chełmewo'],
    ['Zagłębie Dolny Włin', 'LGD', 'Dolny Włin', '#00843D', '#FFFFFF', 'fallen', 50, 'Stadion Miejski im. Chełmesk'],
    ['KS Nowin', 'ARK', 'Nowin', '#FFDD00', '#003DA5', 'fan', 48, 'Stadion Jarosewo'],
    ['GKS Brzezeka', 'WPL', 'Brzezeka', '#003DA5', '#FFFFFF', 'fan', 49, 'Stadion Słupowice'],
    ['LKS Górny Kalosk', 'TER', 'Górny Kalosk', '#F47920', '#000000', 'fan', 47, 'Stadion im. Kosta'],
  ];
  FM.D.CLUBS_DK1 = [
    ['Bjørnstrup IF', 'FCK', 'Bjørnstrup', '#FFFFFF', '#003DA5', 'giant', 64, 'Brovik Stadion'],
    ['Brosund BK', 'FCM2', 'Brosund', '#000000', '#E30613', 'selling', 62, 'Gammeldal Idrætspark'],
    ['Sønderby FK', 'BIF', 'Sønderby', '#FFDD00', '#003DA5', 'historic', 58, 'Nordsund Park'],
    ['Vestnæs Fotball', 'AGF', 'Vestnæs', '#FFFFFF', '#003DA5', 'fan', 56, 'Dyrløkke Park'],
    ['Fremad Bergnæs', 'FCN', 'Bergnæs', '#E30613', '#FFFFFF', 'youth', 56, 'Østborg Stadion'],
    ['Holø Fotball', 'RFC', 'Holø', '#003DA5', '#FFFFFF', 'fan', 52, 'Østgård Idrætspark'],
    ['Nordfjordvang Fotball', 'SIL', 'Nordfjordvang', '#E30613', '#FFFFFF', 'youth', 52, 'Bergvang Stadion'],
    ['Nordsund IL', 'VFF', 'Nordsund', '#00843D', '#FFFFFF', 'fan', 51, 'Dalgård Stadion'],
    ['IK Sydstad', 'OB', 'Sydstad', '#003DA5', '#FFFFFF', 'fallen', 51, 'Sydstad Arena'],
    ['FC Marløkke', 'SJF', 'Marløkke', '#003DA5', '#FFFFFF', 'fan', 49, 'Vestnæs Stadion'],
    ['Sydby IF', 'VBK', 'Sydby', '#E30613', '#FFFFFF', 'fan', 49, 'Storgård Park'],
    ['Asklund FK', 'FCF', 'Asklund', '#E30613', '#FFFFFF', 'fan', 48, 'Fjordvang Stadion'],
  ];
  FM.D.CLUBS_AT1 = [
    ['TSV Goldburg', 'RBS', 'Goldburg', '#FFFFFF', '#E30613', 'oil', 64, 'Rheinhorst-Stadion'],
    ['SpVgg Oberweiler', 'STU', 'Oberweiler', '#000000', '#FFFFFF', 'historic', 61, 'Oberweiler-Arena'],
    ['Germania Brantal', 'RAP2', 'Brantal', '#00843D', '#FFFFFF', 'giant', 58, 'Sportpark Schwarzbrück'],
    ['SV Brantal', 'FAK', 'Brantal', '#6A1B9A', '#FFFFFF', 'historic', 56, 'Stadion Zellstadt'],
    ['Viktoria Freistadt', 'LASK', 'Freistadt', '#000000', '#FFFFFF', 'fan', 56, 'Freistadt-Arena'],
    ['VfL Bachafen', 'WAC2', 'Bachafen', '#000000', '#F47920', 'fan', 51, 'Bachafen-Arena'],
    ['Rheindorf 1899', 'HAR', 'Rheindorf', '#003DA5', '#FFFFFF', 'fan', 49, 'Rheindorf-Arena'],
    ['Germania Freistadt', 'BWL', 'Freistadt', '#003DA5', '#FFFFFF', 'fan', 49, 'Steinsee-Stadion'],
    ['Ober Mühltal 04', 'WSG', 'Ober Mühltal', '#00843D', '#FFFFFF', 'fan', 48, 'Stadion Hagsee'],
    ['Viktoria Rheinhafen', 'ALT', 'Rheinhafen', '#000000', '#FFDD00', 'fan', 48, 'Sportpark Furtkirchen'],
    ['Sportfreunde Oberweiler', 'GAK', 'Oberweiler', '#E30613', '#FFFFFF', 'fallen', 47, 'Hainingen-Stadion'],
    ['FSV Kaltal', 'RIE2', 'Kaltal', '#000000', '#00843D', 'fan', 47, 'Schwarzheim-Stadion'],
  ];
  FM.D.CLUBS_CH1 = [
    [
      'FC Unter Neckarhafen',
      'BAS',
      'Unter Neckarhafen',
      '#E30613',
      '#003DA5',
      'giant',
      62,
      'Waldstadion Unter Neckarhafen',
    ],
    ['Bachburg 04', 'YB', 'Bachburg', '#FFDD00', '#000000', 'giant', 62, 'Neckarbrück-Stadion'],
    ['Kirchweiler SC', 'SER', 'Kirchweiler', '#8A1538', '#FFFFFF', 'historic', 56, 'Stadion am Hainhausen'],
    ['VfB Eichfurt', 'LUG', 'Eichfurt', '#000000', '#FFFFFF', 'oil', 56, 'Stadion Bachtal'],
    ['FSV Niederstadt', 'LUZ', 'Niederstadt', '#003DA5', '#FFFFFF', 'youth', 53, 'Goldberg-Stadion'],
    ['VfL Holzfurt', 'STG', 'Holzfurt', '#00843D', '#FFFFFF', 'fan', 53, 'Stadion am Bachof'],
    ['SV Hohen Waldheim', 'FCZ', 'Hohen Waldheim', '#FFFFFF', '#003DA5', 'historic', 54, 'Waldstadion Hohen Waldheim'],
    ['VfB Hohen Waldheim', 'GCZ', 'Hohen Waldheim', '#003DA5', '#FFFFFF', 'fallen', 51, 'Stadion Altal'],
    ['SV Kirchweiler an der Au', 'LS', 'Kirchweiler an der Au', '#003DA5', '#FFFFFF', 'oil', 52, 'Stadion Hagburg'],
    ['Teutonia Ober Kirchberg', 'SIO', 'Ober Kirchberg', '#FFFFFF', '#E30613', 'fan', 51, 'Stadion Oberdorf'],
    ['Berghafen 04', 'WIN', 'Berghafen', '#E30613', '#FFFFFF', 'fan', 49, 'Sportpark Bruchkirchen'],
    ['Teutonia Bruchstadt', 'THU', 'Bruchstadt', '#E30613', '#FFFFFF', 'fan', 49, 'Waldstadion Bruchstadt'],
  ];
  FM.D.CLUBS_SC1 = [
    ['Oakingham City', 'CEL2', 'Oakingham', '#00843D', '#FFFFFF', 'giant', 70, 'Wexbridge Road'],
    ['Oakingham Borough', 'RAN2', 'Oakingham', '#1B458F', '#FFFFFF', 'giant', 68, 'Cansdon Park'],
    ['South Tuncombe Victoria', 'HEA', 'South Tuncombe', '#8A1538', '#FFFFFF', 'historic', 56, 'The Wrexmere Stadium'],
    ['Daldon-on-Wold Orient', 'ABE', 'Daldon-on-Wold', '#E30613', '#FFFFFF', 'historic', 56, 'Carport Field'],
    ['South Tuncombe Town', 'HIB', 'South Tuncombe', '#00843D', '#FFFFFF', 'historic', 55, 'Quarwell Park'],
    ['Bexton United', 'MOT2', 'Bexton', '#FFB81C', '#8A1538', 'fan', 50, 'Falsey Road'],
    ['Church Haton United', 'DUN2', 'Church Haton', '#F47920', '#000000', 'fan', 51, 'Wedsea Lane'],
    ['Ingworth City', 'KIL', 'Ingworth', '#003DA5', '#FFFFFF', 'fan', 50, 'Wesney Lane'],
    ['Stoshall United', 'SMI', 'Stoshall', '#000000', '#FFFFFF', 'fan', 50, 'Shepwood Lane'],
    ['Athletic Club Church Haton', 'DND', 'Church Haton', '#0B1F4B', '#FFFFFF', 'fan', 49, 'Rotholm Road'],
    ['Calgate-by-the-Sea Rangers', 'LIV2', 'Calgate-by-the-Sea', '#FFDD00', '#000000', 'fan', 47, 'Stowmouth Park'],
    ['Herminster-under-Wood Villa', 'FAL', 'Herminster-under-Wood', '#0B1F4B', '#FFFFFF', 'fan', 47, 'Bedington Road'],
  ];

  FM.D.CLUBS_AU1 = [
    ['Pudmere Wanderers', 'MCY', 'Pudmere', '#6CABDD', '#FFFFFF', 'oil', 57, 'Thornwell Park'],
    ['Croyby Argyle', 'SYD', 'Croyby', '#6CACE4', '#0B1F4B', 'giant', 57, 'Croyby Ground'],
    ['Pudmere Town', 'MVC', 'Pudmere', '#0B1F4B', '#FFFFFF', 'giant', 55, 'Pudmere Ground'],
    ['Croyby Victoria', 'WSW', 'Croyby', '#E30613', '#000000', 'fan', 53, 'Ingshall Road'],
    ['West Ashgate Athletic', 'CCM', 'West Ashgate', '#FFDD00', '#0B1F4B', 'youth', 52, 'Wedbridge Green'],
    ['East Abinghurst Orient', 'BRQ', 'East Abinghurst', '#F47920', '#000000', 'historic', 51, 'Hayington Field'],
    ['Tutcombe Borough', 'AUC', 'Tutcombe', '#0B1F4B', '#00A3E0', 'oil', 51, 'The Sopham Stadium'],
    ['Lanwold Athletic', 'ADU', 'Lanwold', '#E30613', '#FFFFFF', 'fan', 50, 'Shephurst Field'],
    ['Sandcastle Albion', 'WPX', 'Sandcastle', '#FFDD00', '#000000', 'fan', 49, 'Claygate Park'],
    ['Rosby Borough', 'MAF', 'Rosby', '#000000', '#FFFFFF', 'selling', 48, 'Rosby Park'],
    ['Sudsey Albion', 'NJE', 'Sudsey', '#003DA5', '#E30613', 'fan', 48, 'Ledby Park'],
    ['Cansby Alexandra', 'PGL', 'Cansby', '#6A1B9A', '#FFFFFF', 'fallen', 47, 'Clifshall Lane'],
  ];
  FM.D.CLUBS_HU1 = [
    ['Barahegy AC', 'FTC', 'Barahegy', '#00843D', '#FFFFFF', 'giant', 62, 'Barahegy Sportpálya'],
    ['Győrehegy SE', 'PAK', 'Győrehegy', '#00843D', '#FFFFFF', 'selling', 53, 'Győrehegy Városi Stadion'],
    ['Dunetelek FC', 'ETO', 'Dunetelek', '#00843D', '#FFFFFF', 'historic', 52, 'Dunetelek Sportpálya'],
    ['Zalalak Futball Club', 'DVS', 'Zalalak', '#E30613', '#FFFFFF', 'historic', 53, 'Orseváros Stadion'],
    ['Sáratelek FC', 'PUS', 'Sáratelek', '#003DA5', '#FFFFFF', 'youth', 53, 'Sáró Aréna'],
    ['Győraháza AC', 'ZTE', 'Győraháza', '#003DA5', '#FFFFFF', 'fan', 51, 'Győraháza Sportpálya'],
    ['Barahegy VSC', 'UJP', 'Barahegy', '#6A1B9A', '#FFFFFF', 'historic', 52, 'Nagylak Stadion'],
    ['Orseváros FC', 'DIO', 'Orseváros', '#E30613', '#FFFFFF', 'fan', 49, 'Veszafalva Stadion'],
    ['Kálád AC', 'KIS', 'Kálád', '#E30613', '#003DA5', 'fan', 48, 'Kálád Városi Stadion'],
    ['FC Zalaháza', 'MTK', 'Barahegy', '#003DA5', '#FFFFFF', 'historic', 49, 'Fehérehegy Aréna'],
    ['Nagyorsény Atlétikai Klub', 'NYI', 'Nagyorsény', '#E30613', '#FFFFFF', 'fan', 46, 'Zalavár Stadion'],
    ['Orsavár SC', 'KTE', 'Orsavár', '#E30613', '#FFFFFF', 'fan', 46, 'Bakert Aréna'],
  ];
  FM.D.CLUBS_IE1 = [
    ['Gloswell United', 'SHL', 'Gloswell', '#E30613', '#FFFFFF', 'historic', 51, 'The Exworth Stadium'],
    ['Gloswell Victoria', 'SRO', 'Gloswell', '#00843D', '#FFFFFF', 'giant', 51, 'The Elmdale Stadium'],
    ['Warsey Borough', 'DRY', 'Warsey', '#E30613', '#FFFFFF', 'fan', 48, 'Hincombe Lane'],
    ['Clevebury United', 'BHI', 'Gloswell', '#E30613', '#000000', 'fan', 47, 'Gloswell Park'],
    ['Kirkton Argyle', 'SPAT', 'Gloswell', '#E30613', '#FFFFFF', 'fan', 47, 'Lymeshall Field'],
    ['Old Buckcastle Rovers', 'DRO', 'Old Buckcastle', '#003DA5', '#FFFFFF', 'fan', 44, 'The Thiringham Stadium'],
    ['Castle Stratbridge City', 'GAU', 'Castle Stratbridge', '#8A1538', '#FFFFFF', 'fan', 43, 'Eport Green'],
    ['Melby County', 'SLR', 'Melby', '#E30613', '#FFFFFF', 'fan', 43, 'Melby Ground'],
    ['Keswood Orient', 'WFI', 'Keswood', '#003DA5', '#FFFFFF', 'fan', 42, 'Reythorpe Green'],
    ['Church Falwood Orient', 'DDK', 'Church Falwood', '#FFFFFF', '#000000', 'fallen', 44, 'Church Falwood Park'],
  ];
  FM.D.CLUBS_WA1 = [
    ['Ingcombe City', 'TNS', 'Ingcombe', '#00843D', '#FFFFFF', 'oil', 49, 'The Abingney Stadium'],
    ['Helcastle Rangers', 'BAL', 'Helcastle', '#FFFFFF', '#000000', 'fan', 42, 'Helcastle Park'],
    ['Spaldbridge Wednesday', 'CQN', 'Spaldbridge', '#FFFFFF', '#003DA5', 'fan', 41, 'Stamwick Field'],
    ['Clevebridge Rovers', 'PEN', 'Clevebridge', '#E30613', '#FFFFFF', 'fan', 41, 'Spaldwick Road'],
    ['Aldpool City', 'HAV', 'Aldpool', '#003DA5', '#FFFFFF', 'fan', 40, 'Midwold Green'],
    ['Tavbrook Rovers', 'BTU', 'Tavbrook', '#FFDD00', '#000000', 'fan', 40, 'Cranwick Green'],
    ['Bevercastle Athletic', 'CMU', 'Bevercastle', '#FFDD00', '#000000', 'youth', 40, 'Hasham Road'],
    ['Bedford Rangers', 'LLA', 'Bedford', '#E30613', '#FFFFFF', 'fan', 38, 'Halford Green'],
    ['Harwich Athletic', 'CAE', 'Harwich', '#E30613', '#FFFFFF', 'fan', 38, 'Marpool Park'],
    ['Wilpool Rovers', 'NEW2', 'Wilpool', '#E30613', '#FFFFFF', 'fan', 38, 'Wilpool Ground'],
    ['Blackworth Albion', 'COL2', 'Blackworth', '#FFDD00', '#003DA5', 'fan', 38, 'Radcastle Road'],
    ['Bradcaster Wanderers', 'FLI', 'Bradcaster', '#FFFFFF', '#E30613', 'fan', 37, 'Fenham Park'],
  ];

  // Real-life abbreviations (as on the league's broadcasts) and nicknames, by the club's code (the part of its id
  // after c_). An empty abbreviation keeps the code; no nickname means there is no widely used one.
  FM.D.CLUB_INFO = Object.fromEntries(
    `MCI|BAY|Ironmen|1893
LIV|CLI|Spartans|1865
ARS|CHE|Reds|1897
CHE|CHN|Blues|1969
MUN|BAK|Reds|1897
NEW|ROD|Blacks|1950
TOT|CON|Foresters|1894
AVL|EVE|Maroons|1897
BHA|CAL|Blues|1938
NFO|EPI|Reds|1884
WHU|CHEL|Maroons|1882
CRY|CHE2|Herons|1865
BOU|RED|Drovers|1948
FUL|CHE3|Whites|1879
BRE|CHE4|Rams|1966
EVE|CLD|Chargers|1884
WOL|MER|Yellows|1948
LEE|SEL|Miners|1876
SUN|CAR|Reds|1907
BUR|RYE|Foresters|1912
LEI|ALD|Rams|1881
SOU|TET|Reds|1983
IPS|GRE|Blues|1879
SHU|NOR|Reds|1955
MID|HAS|Miners|1878
BIR|EVH|Blues|1956
WBA|YAR|Navy|1871
NCI|TUT|Yellows|1979
COV|LAN|Falcons|1947
WAT|REY|Falcons|1986
WRX|CHI|Reds|1966
STK|SOU|Reds|1867
HUL|REH|Herons|1909
SWA|MAR|Whites|1956
DER|WIL|Whites|1869
SHW|NOH|Foresters|1904
BLB|RODW|Blues|1888
BRC|REYS|Reds|1956
QPR|CHE5|Lions|1875
PNE|YAY|Chargers|1931
MIL|CHE6|Navy|1881
POM|CAE|Navy|1951
CHA|CHE7|Foresters|1888
OXF|FIL|Ironmen|1920
CAR|LAM|Mariners|1906
LUT|HYD|Spartans|1890
HUD|AME|Blues|1891
BWA|BEX|Whites|1904
PLY|HUC|Mariners|1917
REA|SUT|Blues|1866
BNS|WOR|Lions|1932
WIG|WED|Blues|1956
STO|CAM|Blues|1937
BFD|TUN|Spartans|1904
BLP|SHA|Oranges|1903
PBO|CLM|Blues|1978
ROT|MAN|Otters|1905
LIN|SCA|Reds|1942
DON|DEN|Rams|1889
LEY|CHE8|Spartans|1883
WYC|DUN|Sky Blues|1904
MNS|ABI|Chargers|1890
EXE|LED|Reds|1894
PVA|SOL|Falcons|1900
WIM|CHE9|Foresters|1918
STV|DAR|Drovers|1906
NTN|TAV|Maroons|1909
BRT|HOW|Yellows|1946
ACS|DAD|Reds|1924
BNT|CHE10|Oranges|1950
BRW|HAL|Chargers|1933
BRR|REY2|Blues|1866
BRO|CHE11|Rams|1887
CAMU|NEW|Falcons|1945
CHT|BED|Reds|1946
CHF|WOK|Lions|1886
COL|SAI|Ironmen|1880
CRAW|GLA|Reds|1916
CREW|REA|Spartans|1890
FLE|SOE|Eagles|1921
GILL|SAW|Blues|1901
GRI|EVF|Falcons|1862
HARR|PRE|Otters|1895
MKD|HAR|Whites|1896
NWP|PIC|Oranges|1902
NCO|EPN|Blacks|1901
OLD|SHI|Blues|1901
SAL|OLD|Reds|1910
SHR|HYE|Blues|1901
SWI|BUR|Reds|1867
TRA|FOL|Whites|1889
WAL|HOL|Miners|1914
RMA|OLM|Blancos|1878
FCB|CER|Rojos|1890
ATM|OLR|Rojos|1893
ATH|CUE|Rojos|1932
VIL|PLA|Jaguares|1915
RSO|LIO|Azules|1949
BET|ALC|Verdes|1863
SEV|ALO|Alacranes|1906
GIR|VAL|Gladiadores|1938
VAL|MON|Tiburones|1883
CEL|MOA|Celestes|1925
OSA|ARR|Rojos|1890
MLL|PEÑ|Rojos|1894
RCD|CERV|Azules|1872
RAY|OOR|Mineros|1936
GET|BEN|Azules|1904
ALA|VIL|Azules|1913
OVI|COR|Cóndores|1937
LEV|MOS|Rojos|1908
ELC|SAL|Blancos|1933
DEP|SAN|Azules|1889
LPA|SEG|Leones|1889
VLD|BEE|Granates|1902
MAL|LIN|Azules|1873
ALM|SAO|Rojos|1940
ZAR|LAD|Halcones|1887
LEG|NAV|Halcones|1904
GRA|MOO|Rojos|1974
SPG|OLO|Rojos|1888
RSA|MAO|Blancos|1898
CAD|PED|Marineros|1916
EIB|VAO|Azules|1956
CAS|MÓN|Blancos|1887
AND|TOR|Azules|1896
HUE|FUE|Venados|1968
ALB|SEGO|Blancos|1948
BGS|MOR|Halcones|1912
CCF|CAB|Blancos|1936
MIR|FUO|Rojos|1936
RSS|LIOB||1989
CYD|COA|Blancos|1933
CEU|BEA|Blancos|1918
RMC|OLMB||1911
BAT|CERB||1929
BIA|CUEB||1979
ZAM|POZ|Marineros|1913
ATB|OLRB||1931
VIB|PLAB||1959
SEB|ALOB||1940
CEB|MOAB||1989
BEB|ALCB||1921
TEN|RON|Venados|1900
CTG|VIA|Negros|1897
PON|SEP|Jaguares|1932
NAS|BAI|Tiburones|1885
ALC|FRE|Jaguares|1931
MUR|ALA|Mineros|1882
HERC|CAS|Azules|1884
IBI|CEA|Azules|1943
CDLU|CAO|Rojos|1939
UNS|MOE|Negros|1876
ALG|PEO|Rojos|1947
BAY|DIL|Bergleute|1881
BVB|ALT|Wölfe|1951
B04|UNT|Wölfe|1866
RBL|MEN|Weißen|1914
SGE|DOR|Bären|1909
VFB|NIE|Bergleute|1873
SCF|BRU|Roten|1921
WOB|EBE|Grünen|1915
BMG|BAC|Weißen|1873
HSV|BER|Pioniere|1876
KOE|BRA|Weißen|1895
SVW|BRT|Grünen|1874
M05|UNH|Roten|1879
FCU|WAL|Roten|1916
TSG|MÜH|Blauen|1989
AUG|BAN|Bergleute|1886
STP|BET|Weinroten|1936
HDH|HAI|Roten|1944
BSC|WAG|Falken|1882
S04|HAD|Löwen|1882
KSV|KIR|Bären|1897
VFLB|NEC|Blauen|1905
F95|STE|Roten|1880
H96|ALTW|Grünen|1867
FCKL|STN|Roten|1890
SCPA|IMM|Hirsche|1917
FCNB|HIR|Pioniere|1888
KSC|IMU|Blauen|1900
D98|BRN|Blauen|1942
SGF|STU|Fischer|1926
FCMA|ROT|Hirsche|1918
EBS|ALM|Gelben|1881
PRM|FRL|Füchse|1923
SVE|MAT|Schwarzen|1922
DSC|BAF|Blauen|1902
SGD|HAG|Bergleute|1879
VFS|NIEB||1903
BVZ|ALTB||1983
TSZ|MÜHB||2008
M60|DIN|Himmelblauen|1892
FCE|AHR|Roten|1894
FCH|KRO|Schmiede|1893
SVWW|BUG|Roten|1889
VKO|BRAN|Roten|1888
SVM|ELS|Blauen|1930
AUE|HIG|Weinroten|1886
AAC|EEE|Gelben|1899
SCV|KLE|Schwarzen|1908
OSN|LEN|Löwen|1909
RWE|DIF|Füchse|1892
JAH|HON|Roten|1922
ULM|BRD|Schwarzen|1883
MSV|HAF|Blauen|1871
FCS|DIT|Bären|1884
FCI|LAU|Roten|1897
S05|BUF|Grünen|1930
PSG|QUI|Marines|1963
OMA|ROC|Blancs|1898
ASM|CHA|Lions|1969
OLY|JOY|Blancs|1904
LIL|MIR|Mineurs|1899
NIC|BOU|Pionniers|1935
REN|VAE|Rouges|1924
RCL|CNS|Jaunes|1936
RCS|THO|Bleus|1908
SBR|JOC|Cerfs|1980
TFC|LAT|Lions|1900
NAN|LUN|Jaunes|1892
PFC|QUT|Cerfs|1910
LOR|LUT|Forgerons|1939
AUX|ROG|Pionniers|1945
HAC|TOU|Lions|1873
ANG|VEN|Noirs|1902
FCM|VAC|Grenats|1896
MHS|LNT|Oranges|1913
STE|CLE|Verts|1880
SDR|PAU|Dragons|1948
EAG|BES|Rouges|1921
PAU|CHT|Pionniers|1894
ANN|CHÂ|Mineurs|1912
LAV|CHAO|Oranges|1954
GRE2|BEU|Lynx|1908
AMI|CAC|Blancs|1930
RSF|DIE|Verts|1908
ROD|NAN|Rouges|1942
CF63|PON|Aigles|1888
USL|MIC|Bleus|1920
SCBA|RIB|Faucons|1878
LMF|LAE|Loups|1883
ASN|SAE|Blancs|1907
USB|SAR|Rouges|1952
ETA|CHS|Aigles|1880
FLA|IBI|Rubro-Negros|1880
PAL|GUA|Verdões|1899
COR|GMA|Galos|1887
SAO|GUAR|Alvinegros|1885
BOT|IBE|Pretos|1982
CAM|PIT|Pretos|1983
GRE|GUI|Azuis|1899
SCI|GNA|Onças|1904
FLU|IPE|Leões|1895
CRU|PIU|Gaviões|1906
VAS|IBIP|Alvinegros|1905
SAN|URU|Alvinegros|1912
BAH|UBA|Azuis|1951
FTZ|JAB|Azuis|1957
RBB|IPA|Tucanos|1970
CEA|JAO|Tubarões|1949
SPT|JAC|Gaviões|1955
VIT|UIA|Gaviões|1943
JVD|ARA|Verdões|1893
MSL|CAT|Amarelos|1945
INT|PIE|Azzurri|1891
JUV|GUB|Bianchi|1865
NAP|MAA|Celesti|1870
ACM|PIO|Cervi|1891
ATA|TRE|Falchi|1976
ROM|BEL|Granata|1897
LAZ|BEO|Celesti|1900
BOL|COE|Rossi|1906
FIO|POR|Cavalieri|1903
COM|VILE|Azzurri|1909
TOR|GUO|Granata|1894
UDI|MIA|Bianchi|1901
GEN|ORV|Minatori|1915
PAR|FAB|Lupi|1892
CAG|FRA|Rossi|1952
SAS|ORA|Verdi|1977
VER|CAA|Gialli|1952
LEC|PIA|Minatori|1927
CRE|TNE|Rossi|1902
PIS|MIO|Neri|1916
MNZ|SAS|Rossi|1910
VEN|GTO|Neri|1903
EMP|TOO|Tori|1907
PAL2|SER|Bianchi|1926
SAM|OLA|Fabbri|1873
BARI|PES|Pionieri|1895
SPE|VTE|Bianchi|1939
MOD|SEO|Cavalieri|1877
CTZ|PAD|Cervi|1942
CES|PII|Bianchi|1931
JST|TRA|Pionieri|1899
SUD2|POO|Lupi|1919
REG|VNO|Falchi|1939
CAR2|SAA|Gialli|1893
PAD|CTE|Bianchi|1888
MAN|FOS|Bianchi|1932
ENT|CRA|Azzurri|1906
AVE|VALA|Verdi|1884
PES|BOR|Marinai|1881
FRO|FOO|Fabbri|1970
BEN|PRO|Rubro-Negros|1900
FCP|POM|Falcões|1863
SCP|PORT|Marinheiros|1893
SCB|SANT|Tigres|1940
VSC|PEN|Brancos|1955
SCL|MHA|Rubro-Negros|1927
FAM|GRO|Mineiros|1934
EST|COV|Amarelos|1913
GIL|SRO|Rubro-Negros|1897
ARO|ARO|Amarelos|1937
RAV|LAL|Verdes|1961
MOR|POA|Verdes|1889
CPI|POR2|Corvos|1898
CDN|POMB|Pretos|1864
AVS|SES|Mineiros|1885
EAM|LEI|Rubro-Negros|1949
ALV|CVA|Rubro-Negros|1912
TON|LES|Tubarões|1881
AJA|ALK|Witten|1891
PSV|KLG|Zwanen|1862
FEY|ZAA|Wolven|1910
AZA|GRT|Rooien|1982
TWE|ZWO|Kikkers|1899
UTR|WES|Rooien|1948
GAE|DIJ|Rooien|1933
NEC|GRD|Rooien|1880
HEE|HOO|Blauwen|1911
GRO|KLT|Zwanen|1902
SPR|ZAT|Rooien|1912
PEC|MAK|Arenden|1947
FSI|SIN|Geelen|1908
NAC|ZUT|Valken|1920
HER|WAK|Zwarten|1891
VOL|LAA|Oranjes|1930
EXC|ZST|Bijen|1878
TEL|ZWD|Witten|1922
RIV|ANO|Albos|1882
BOC|ARRA|Azules|1892
RAC|DOZ|Celestes|1922
IND|DEZ|Rojos|1884
ELP|VEL|Matadores|1947
SLO|ARR2|Cóndores|1912
VEL|ARR3|Pumas|1953
TAL|DOM|Lobos|1955
ROS|QUZ|Azules|1928
LAN|DOS|Halcones|1956
ARJ|ARR4|Toros|1957
NOB|QEZ|Pampas|1911
HUR|ARR5|Halcones|1965
DYJ|DOI|Amarillos|1978
BEL|DOA|Leones|1917
GLP|VEO|Leones|1944
GOD|GAR|Azules|1944
TIG|URQ|Azules|1972
UNI|VES|Gauchos|1910
INS|DDA|Rojos|1971
BAN|QUA|Verdes|1925
IRI|GAA|Halcones|1907
ATU|CAST|Celestes|1903
PLA|BUS|Albos|1943
BAR|ARR6|Rojos|1912
CCD|ORT|Negros|1923
SAR|COO|Verdes|1949
RIE|ARR7|Matadores|1938
MIA|WIS|Whites|1993
LAF|PIH|Falcons|1938
LAG|PGH|Foresters|1929
SEA|NON|Ironmen|1942
CIN|MEY|Miners|1935
CLB|RIP|Yellows|1907
PHI|PET|Drovers|1921
NYC|NER|Herons|1961
ATL|BEM|Maroons|1952
NYR|NORT|Stags|1963
NSH|BLA|Yellows|1977
ORL|AST|Herons|1938
VAN|HOD|Whites|1973
PTI|HOY|Mariners|1914
MIN|SED|Maroons|1941
SDG|DON|Blacks|1975
RSL|GRA|Reds|1985
DAL|CRW|Reds|1927
CLT|HUN|Spartans|1979
HOU|WIF|Oranges|1920
SKC|LYM|Foresters|1948
STL|TAD|Reds|1928
RAP|EXC|Maroons|2001
AUS|HOK|Greens|1979
CHI|NAT|Sky Blues|1960
DCU|CRE|Blacks|1920
NER|TUH|Navy|1961
TRT|NOY|Badgers|1968
MTL|OLW|Blacks|1989
SJE|STA|Blues|1968
VIS|NIS|Phoenixes|1932
KAS|KIT|Cranes|1908
URA|SAK|Reds|1937
SFH|SHO|Navy|1933
KAW|SWA|Dragons|1925
YFM|AKI|Blues|1919
GAM|MTA|Blues|1904
MAC|ASA|Navy|1952
FCT|HIO|Blues|1985
KSW|NAG|Yellows|1956
NAG|FUJ|Samurai|1917
CER|MATS|Oranges|1909
AVI|KIA|Navy|2006
KYO|HNO|Crimsons|1958
NII|OKA|Oranges|1965
SBM|MWA|Yellows|1958
TVE|HIGA|Greens|1912
SHI|MAI|Oranges|1924
OKA|NAO|Reds|1926
YFC|AKIS|Tigers|1926
AME|JIL|Tuzos|1892
MTY|TUL|Azulones|1904
TGR|JIA|Jaguares|1921
CHV|CUA|Jaguares|1882
CAZ|JIN|Azules|1898
TOL|YAU|Rojos|1923
PUM|JILI|Azulones|1971
PAC|XAL|Mineros|1943
LEO|OCO|Verdes|1968
SLA|PUE|Tigres|1928
ATS|COAT|Rojos|1931
TIJ|OCA|Leones|1957
NCX|IXT|Rojos|1958
QRO|ZAP|Azules|1939
PUE|XAN|Tuzos|1904
JUA|CUN|Venados|1959
ASL|PAC|Rojos|1910
MAZ|TUC|Toros|1954
ULS|GAN|Bears|2004
JBH|CHO|Greens|1921
POH|BOH|Reds|1904
SEO|CHU|Dolphins|1938
DJN|SNG|Crimsons|1963
GWA|CWA|Eagles|1988
GAN|CHG|Dolphins|1989
GIM|BUJ|Reds|1973
JEJ|HAE|Oranges|1944
DGU|GYE|Wolves|1991
SUW|WOL|Dragons|1984
ANY|GAG|Crimsons|1970
BRU|TAK|Dragons|2004
BGP|UBO|Navy|1999
BKU|NOO|Reds|1929
PRT|NEO|Lions|1952
MTU|WAN|Elephants|1913
CRA|SAKC|Blues|1973
CHB|UBI|Blues|1925
RAT|KHA|Reds|1952
UTH|KHI|Lions|1978
PRA|UBG|Reds|1946
SKT|WAI|Hornbills|1926
KBP|PHU|Blues|2003
LPW|SEK|Crimsons|1961
AYU|NAK|Reds|1984
RYG|PAK|Blues|1958
NRS|URI|Oranges|1949
ENY|WEX|Blues|1909
RAN|KIL|Reds|1905
RVU|PIM|Blues|1956
REM|STK|Greens|1965
KPI|CAY|Eagles|1907
SSC|KID|Kestrels|1911
LOB|SWE|Reds|1927
PLU|FEN|Stags|2005
BDI|LIT|Blues|1905
HRT|ROS|Kestrels|1939
IKC|CRS|Blues|1947
ABW|NAY|Greens|1919
AKW|HUR|Otters|1925
KWU|HAT|Greens|1964
NSU|SUD|Yellows|1985
NIT|STO|Yellows|1916
BYU|EPB|Blues|1960
EKW|PUD|Greens|1981
KTU|PLY|Reds|1975
SUS|KIH|Yellows|1968
WAC|NAU|Rouges|1902
RCA|NEU|Loups|1907
FAR|DNT|Loups|1901
RSB|BEC|Aigles|1927
FUS|DIEU|Bleus|2008
MAS|DUR|Jaunes|1909
HAG|SAU|Rouges|1945
IRT|TOC|Loups|2006
MAT|MIS|Rouges|1923
OCS|POT|Bleus|1983
DHJ|MNS|Verts|1954
RSZ|LAY|Verts|1916
UTS|DIE2|Mineurs|1989
COD|SAC|Rouges|1974
SCC|MRE|Cigognes|1964
JSS|MAC|Lions|1973
CZV|JAS|Crveni|1923
FKP|JASO|Crni|1935
VOJ|NOV|Orlovi|1903
TSC|TAR|Medvedi|1919
CUK|JAS2|Bikovi|1989
RAD|SLA|Baroni|1948
NPZ|LUB|Vukovi|1934
OFK|JAS3|Plavi|1924
IMT|JAS4|Baroni|1994
SPS|SVA|Orlovi|1973
RNI|BEK|Crveni|1949
ZEL|PEA|Lavovi|1943
NKR|ZEL|Crveni|1985
MLU|VYS|Crveni|1961
JUB|BOA|Medvedi|1955
TEK|VYE|Baroni|1968
CLB2|TIL|Blauwen|1891
USG|SNE|Valken|1952
AND2|SNT|Spechten|1870
GNK|WAM|Blauwen|1885
GNT|ZWT|Blauwen|1865
ANT|GLO|Rooien|1888
STL2|DUT|Rooien|1872
CER2|TIK|Arenden|1950
KVM|NOK|Geelen|1939
WES|BERG|Geelen|1943
CHL|NIK|Zwarten|1913
OHL|OUD|Witten|1892
STV2|KLK|Geelen|1889
DEN2|OOS|Rooien|1942
ZWA|TID|Rooien|1882
RAAL|ZUI|Groenen|1912
GAL|DEM|Kırmızılar|1923
FEN|DER|Sarılar|1906
BJK|DIR|Siyahlar|1899
TS|AYD|Bordolar|1930
IBFK|DEME|Turuncular|1960
SAM2|DEE|Kırmızılar|1920
GOZ|KAR|Sarılar|1988
EYP|DEM2|Bordolar|1946
KAS2|DEM3|Mavililer|1950
RIZ|ÇAN|Yeşiller|1948
KON|UEH|Yeşiller|1914
ANT2|BOZ|Kırmızılar|1964
ALY|BOY|Turuncular|1932
GAZ|TEK|Kırmızılar|1965
KAY|ÇAR|Sarılar|1971
KOC|BVA|Yeşiller|1959
GEN2|GÜL|Aslanlar|1931
FKG|DEM4|Kartallar|1936
SLA2|HOA|Červení|1929
SPA|HVA|Vínoví|1908
PLZ|NYM|Býci|1920
BAN2|NYÁ|Nebesky modří|1983
SIG|MLA|Vlci|1923
LIB2|OVA|Rytíři|1963
HKR|BRY|Husité|1953
MBO|RYC|Modří|1949
BOH|HOLA|Medvědi|1938
JAB|ZLÍ|Zelení|1940
TEP|VSE|Býci|1965
PAR2|VSY|Červení|1915
KAR|NOÁ|Kováři|1957
SLO2|TRV|Modří|1935
DUK|HOL2|Kováři|1932
ZLN|STV|Žlutí|1975
OLY2|MRA|Ierakes|1912
PAO|LDA|Prásinoi|1925
AEK|LAMI|Nautikoí|1908
PAOK|PIR|Delfínia|1930
ARI|PIS|Kítrinoi|1942
OFI|KAT|Nautikoí|1981
ATR|LAI|Ierakes|1979
AST|IOA|Kítrinoi|1918
PNT|TRÁ|Titánes|1940
VOL2|THE|Kókkinoi|1911
LEV2|ARG|Prásinoi|1945
KIF|IOI|Galázioi|1925
AEL|CDA|Kókkino Krasí|1921
PSR|KYP|Titánes|1976
BOD|DYR|Bjørne|1972
BRA2|DYD|De Røde|1902
VIK|BRO|De Blå|1884
RBK|LIL|De Hvide|1900
MOL|BEØ|Løver|1871
S08|KND|De Blå|1891
FFK|LBY|De Hvide|1877
TIL|HAV|De Røde|1900
SAF2|STR|De Blå|1880
KFU|SØN|Falke|1895
HAM|FJO|Ørne|1910
KBK|NOØ|De Blå|1892
VIF|SØS|De Blå|1880
BRY|RIN|Svaner|1898
SIF|NES|Bjørne|1897
FKH|GAM|De Blå|1908
LPO|JAR|Niebiescy|1900
RAK|RAD|Husaria|1939
JAG|SCE|Orły|1980
LEG2|WIE|Husaria|1919
POG|SUP|Niebiescy|1962
GOR|RAA|Biali|1901
CRA2|SUA|Czerwoni|1916
WID|RYB|Niedźwiedzie|1995
GKS|STC|Żółci|1928
ZAG|LUA|Pomarańczowi|1982
PIA|OPO|Niebiescy|1971
MOT|DBR|Żółci|1939
KOR|KAL|Sokoły|1915
RAD2|DOL|Zieloni|1981
LGD|DOLN|Żubry|1940
ARK|NOW|Żółci|1967
WPL|BRZ|Niebiescy|1955
TER|GÓR|Pomarańczowi|1937
FCK|BJØ|De Hvide|1890
FCM2|BND|De Sorte|1967
BIF|SØY|Bjørne|1869
AGF|VÆS|Rever|1902
FCN|BÆS|De Røde|1927
RFC|HOØ|De Blå|1876
SIL|NOG|De Røde|1927
VFF|NOD|De Grønne|1953
OB|SYD|Svaner|1900
SJF|MAE|De Blå|1877
VBK|SYY|De Røde|1915
FCF|ASK|De Røde|1899
RBS|GOL|Weißen|1938
STU|OBE|Schwarzen|1872
RAP2|BRL|Adler|1900
FAK|BAL|Weinroten|1875
LASK|FRT|Schwarzen|1894
WAC2|BACH|Schwarzen|1930
HAR|RHE|Schmiede|1903
BWL|FDT|Blauen|1930
WSG|OBL|Wölfe|1931
ALT|RHN|Schwarzen|1934
GAK|OBR|Hirsche|1866
RIE2|KALT|Bären|1893
BAS|UNN|Löwen|1886
YB|BAG|Gelben|1872
SER|KER|Weinroten|1903
LUG|EIC|Schwarzen|1961
LUZ|NIT|Pioniere|1982
STG|HOT|Grünen|1904
FCZ|HOH|Weißen|1876
GCZ|HOM|Ritter|1900
LS|KIU|Bergleute|1927
SIO|OBG|Weißen|1914
WIN|BER2|Roten|1877
THU|BDT|Fischer|1953
CEL2|OAK|Greens|1864
RAN2|OAM|Ironmen|1890
HEA|SBE|Rams|1870
ABE|DAL|Reds|1864
HIB|SOUT|Greens|1873
MOT2|BON|Yellows|1877
DUN2|CHUR|Oranges|1898
KIL|ING|Blues|1901
SMI|STL|Drovers|1902
DND|CHU2|Navy|1918
LIV2|CALG|Stags|1920
FAL|HER|Navy|1919
MCY|PUDM|Falcons|1958
SYD|CRO|Sky Blues|1934
MVC|PUD2|Navy|1918
WSW|CRY|Reds|1945
CCM|WEE|Miners|1932
BRQ|EAS|Eagles|1901
AUC|TUE|Navy|1972
ADU|LLD|Reds|1942
WPX|SLE|Drovers|1978
MAF|ROY|Foresters|1988
NJE|SUY|Blues|1954
PGL|CAN|Maroons|1924
FTC|BAR|Zöldek|1932
PAK|GYR|Huszárok|1944
ETO|DUK|Zöldek|1926
DVS|ZAL|Sasok|1910
PUS|SÁR|Kékek|1966
ZTE|GYA|Kékek|1973
UJP|BGY|Bordók|1910
DIO|ORS|Sólymok|1951
KIS|KÁL|Vörösök|1933
MTK|BARA|Medvék|1919
NYI|NNY|Vörösök|1931
KTE|ORR|Vörösök|1979
SHL|GLL|Otters|1881
SRO|GLOS|Greens|1884
DRY|WAR|Reds|1950
BHI|GLO2|Badgers|1941
SPAT|GLO3|Reds|1929
DRO|OLE|Chargers|1946
GAU|CGE|Otters|1939
SLR|MEL|Drovers|1883
WFI|KES|Blues|1891
DDK|CHD|Lions|1898
TNS|INE|Chargers|1931
BAL|HEL|Ironmen|1900
CQN|SPA|Whites|1930
PEN|CLEV|Mariners|1886
HAV|ALL|Chargers|1878
BTU|TOK|Yellows|1947
CMU|BEV|Yellows|1902
LLA|BEDF|Reds|1952
CAE|HAH|Foresters|1926
NEW2|WILP|Chargers|1916
COL2|BLH|Badgers|1892
FLI|BRR|Ironmen|1911`
      .split('\n')
      .map((l) => l.split('|'))
      .map(([code, abbr, nick, founded]) => [code, [abbr, nick, founded ? +founded : null]]),
  );

  FM.D.RIVALS.push(
    ['CLB2', 'CER2', 'Tilkerk Derby'],
    ['AND2', 'STL2', 'Sneekvoort–Dijkhout Derby'],
    ['GAL', 'FEN', 'Demehir Derby'],
    ['BJK', 'TS', 'Demehir–Aydbahçe Derby'],
    ['SLA2', 'SPA', 'Holava Derby'],
    ['OLY2', 'PAO', 'Marópetra–Lamida Derby'],
    ['PAOK', 'ARI', 'Pirás Derby'],
    ['RBK', 'MOL', 'Lillesund–Bergø Derby'],
    ['VIF', 'KFU', 'Sønderfors Derby'],
    ['LEG2', 'LPO', 'Wielki Siedlec–Jarosice Derby'],
    ['CRA2', 'WID', 'Słupówka–Rybnów Derby'],
    ['FCK', 'BIF', 'Bjørnstrup–Sønderby Derby'],
    ['RAP2', 'FAK', 'Brantal Derby'],
    ['STU', 'GAK', 'Oberweiler Derby'],
    ['BAS', 'FCZ', 'Unter Neckarhafen–Hohen Waldheim Derby'],
    ['GCZ', 'YB', 'Hohen Waldheim–Bachburg Derby'],
    ['CEL2', 'RAN2', 'Oakingham Derby'],
    ['HEA', 'HIB', 'South Tuncombe Derby'],
    ['DUN2', 'DND', 'Church Haton Derby'],
    ['MCY', 'MVC', 'Pudmere Derby'],
    ['SYD', 'WSW', 'Croyby Derby'],
    ['SYD', 'MVC', 'Croyby–Pudmere Derby'],
    ['FTC', 'UJP', 'Barahegy Derby'],
    ['FTC', 'MTK', 'Barahegy Derby'],
    ['SHL', 'BHI', 'Gloswell Derby'],
    ['SRO', 'SPAT', 'Gloswell Derby'],
    ['DRY', 'SRO', 'Warsey–Gloswell Derby'],
    ['TNS', 'BAL', 'Ingcombe–Helcastle Derby'],
    ['CQN', 'FLI', 'Spaldbridge–Bradcaster Derby'],
  );
})();

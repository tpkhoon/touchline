// More names, part three: a deeper pass on the cultures behind the nations that have leagues (and so most of the world's
// players), where the pools were thinnest. Same method as js/names-more.js.
(function () {
  const FM = window.FM,
    D = FM.D;
  const split = (s) =>
    s
      .trim()
      .split(/\s+/)
      .map((x) => x.replace(/_/g, ' '));
  const more = (culture, fn, ln) => {
    const p = D.NAME_POOLS[culture];
    if (!p) return;
    p.fn.push(...split(fn));
    p.ln.push(...split(ln));
  };

  more(
    'japanese',
    `Hideki Hikaru Hiroshi Hisashi Isamu Ikki Jiro Joji Junpei Kaoru Katsuya Kazuma Kazuya Keisuke Kengo Kenji Kenichi Kento
    Kiyoshi Koji Kouki Kouhei Kunihiro Manabu Masaki Masaru Masayuki Michio Mitsuru Nao Naoya Nobuhiro Osamu Raiki Ren Rikuto
    Ryosuke Ryunosuke Ryuji Seiji Shigeru Shingo Shinnosuke Shintaro Shohei Shu Shun Shunsuke Sosuke Sota Soma Susumu Taiga
    Taichi Taiki Taisei Taishi Takahiro Takayuki Takeshi Takuya Tamotsu Tetsuya Toshiki Toru Toshio Tsuyoshi Wataru Yasuhiro
    Yasuo Yoshihiro Yoshio Yosuke Yudai Yugo Yuji Yuki Yukio Yusei Yuya Yuzuru Aoi Asahi Atsushi Daigo Eiji Fumiya Gaku Gen
    Haruto Hinata Hyuga Ibuki Jin Kairi Kazuhiro Kyo Mahiro Minato Mizuki Nagisa Raito Rinto Rui Sakuya Seiya Souta Subaru`,
    `Aizawa Akiyama Amano Ando Aoyama Arakawa Asano Chiba Eguchi Fukui Fukushima Furukawa Fujimoto Fujiwara Gonda Hagiwara
    Hara Harada Hashimoto Hirose Hirata Hoshino Ichikawa Ikeda Ishii Ishihara Iwata Iwamoto Kamiya Kanda Kato Kawai Kawakami
    Kawamura Kawasaki Kimoto Kinoshita Kishi Kitamura Koga Koike Komatsu Konishi Koyama Kurata Kuroda Kusunoki Maruyama
    Masuda Matsui Matsuoka Miura Miyamoto Miyake Mizuno Morita Morimoto Motoki Murata Nagano Nagata Nakajima Nakata Nakayama
    Narita Nishikawa Nomura Obata Ochiai Ogata Okabe Okamoto Okubo Omori Onishi Ozawa Sakai Sakurai Sano Sawada Shibata
    Shimada Shinohara Soma Sugawara Sugimoto Takagi Takano Takeuchi Tamura Tanabe Taniguchi Terada Toyoda Tsuchiya Uchida
    Ueno Umeda Usui Wakabayashi Yagi Yamane Yamazaki Yano Yasuda Yokota Yonezawa Yoshimura Yoshioka Yuasa Aihara Baba
    Fujisawa Hayakawa Higuchi Hosokawa Ichinose Kajiwara Kuwahara Mizoguchi Nitta Ohashi Sekine Takenaka Tsukamoto`,
  );
  more(
    'korean',
    `Beom-seok Byung-ho Chan-woo Dae-ho Dong-gook Dong-min Eun-seong Geon-woo Gi-seong Gwang-hyun Hae-sung Han-gyeol Ho-jin
    Hwan-hee Hyeon-seok Hyun-soo In-beom Jae-sung Jeong-min Ji-ho Ji-hoon Ji-won Jin-ho Jong-hyun Joon-young Ju-ho Jun-ho
    Jung-woo Kwang-ho Kyung-min Min-gyu Min-seok Myeong-ho Sang-hyeok Se-jong Seok-jin Seong-hun Seung-hyun Seung-woo
    Su-bin Sun-woo Tae-ho Tae-yang Woo-yeong Yeong-ho Yun-seo Chang-min Dae-hyun Do-hyun Gun-hee Hyuk-jin Jae-min Jun-seok`,
    `Bang Bok Byun Chae Choe Chung Do Gong Ha Hwang Hyeon Ju Jin Ma Min Myung Na Nam Noh Ok Pyo Ryu Sim Tak Wang Won
    Woo Yeo Yu Yun Gu Gwon Jeong Kwak Maeng Paik Seol Seong Shim Sung Yim`,
  );
  more(
    'thai',
    `Adisak Akkarapol Anucha Apirak Arthit Boonlert Chaiyaporn Chatchai Chitchai Decha Ekkachai Itthipol Jakkrit Kamol
    Kiatisak Mongkol Narit Natthaphong Nattapon Nirut Paitoon Panya Peerapat Piyapong Pongsak Prakit Prasert Prayuth
    Rangsan Saksit Sarayut Sittichok Somkid Somsak Suphachai Surasak Suriya Tanaboon Teerapong Thawatchai Thirasak
    Tinnakorn Wanchalerm Wasan Weerasak Worawut Yutthana`,
    `Boonsong Buakaew Chaisuwan Chanthawong Charoensuk Chuenchom Dechawat Intharat Jantarasri Jirasak Kaewjai Kanchana
    Kongthong Lertwanich Maneerat Namwong Nilkamhaeng Panyarachun Phetcharat Phongsawat Pinyo Ruangrit Saetang
    Sangthong Sirikul Sombat Sukhum Sutthirak Tangsiri Thaiyanont Vongsanga Wattana Wongsakul Yimyam`,
  );
  more(
    'polish',
    `Aleksander Andrzej Antoni Arkadiusz Bartłomiej Bogdan Bolesław Cezary Czesław Dariusz Edward Eryk Franciszek Gabriel
    Henryk Ignacy Jacek Janusz Jerzy Józef Julian Kajetan Kazimierz Konrad Kornel Leszek Lech Ludwik Maksymilian
    Mariusz Michał Mieczysław Mirosław Natan Olgierd Roman Ryszard Stefan Teodor Tymon Waldemar Wiktor Witold
    Władysław Zenon Zygmunt Szczepan Tadeusz Tymoteusz`,
    `Adamski Andrzejewski Baranowski Bielecki Błaszczyk Bogusz Brzozowski Bukowski Chojnacki Cybulski Czaja Czerwiński
    Dziedzic Dziuba Filipek Gołąb Grabowski Gruszka Janik Jaworski Kasprzak Kędzierski Kołodziej Konieczny Kopeć
    Kosiński Kowalewski Kozieł Kruk Kurek Laskowski Lis Maciejewski Markowski Marciniak Mielczarek Michalak
    Milczarek Misiak Mroczek Nawrocki Olejniczny Olszewski Orłowski Osiński Pająk Pastuszka Perkowski Piątek
    Podolski Pruszyński Przybył Radziwiłł Rogalski Rosiak Ryba Sadowski Skowron Sowa Stachowiak Sobolewski
    Stasiak Strzelecki Szulc Świątek Tkaczyk Tylman Wawrzyniak Wróbel Zakrzewski Zielonka Żuk Żurek`,
  );
  more(
    'turkish',
    `Abdullah Adem Alper Ayhan Aykut Bahadır Batuhan Bekir Berkay Bilal Bülent Cüneyt Çağlar Emirhan Engin Fırat Gökay
    Hakan Haluk Hamza Harun Kadir Kenan Koray Levent Mahir Metin Muhammet Necati Nihat Oğuz Osman Rıza Sedat Semih
    Sinan Şener Tolga Tuncay Umut Ümit Vedat Yıldıray Zafer`,
    `Akbulut Akgül Akkaya Alkan Altun Arslan Aslan Atay Avcı Balcı Bayrak Bozkurt Cengiz Coşkun Çakır Çiftçi Deniz
    Dinç Duman Ekinci Erçetin Eroğlu Gedik Genç Gökçe Günay Güngör Gürbüz Hançer Kalkan Karabulut Karadeniz Kocabaş
    Kurtuluş Metin Oral Öncü Özer Özgür Özkaya Sezer Sönmez Tuna Tunç Turan Uysal Uzun Yaman Yazıcı Yeşil Yurt`,
  );
  more(
    'czech',
    `Alois Bohumil Bohuslav Čestmír Drahomír Emil Evžen Ferdinand František Hynek Ivo Jáchym Jaromír Ladislav Libor
    Lubomír Luděk Miroslav Oldřich Otakar Radim Rostislav Svatopluk Šimon Tadeáš Viktor Vilém Vratislav Zbyněk`,
    `Adámek Bartoň Bednář Burian Čapek Dušek Hájek Hladík Holub Hora Janda Jirásek Kadlec Kalous Klíma Kovář Kratochvíl
    Křížek Mach Musil Němec Pešek Petráš Pospíšil Šebesta Šustr Štěpánek Tichý Toman Vlček Vondra Zelenka Žák`,
  );
  more(
    'hungarian',
    `Aladár Álmos Andor Antal Bertalan Csongor Dezső Előd Endre Ernő Géza Gyula Imre Jenő Kálmán Lajos Mátyás Mihály
    Olivér Pál Rezső Sebestyén Vilmos Zsigmond`,
    `Antal Bakos Balogh Bodnár Csákány Dobos Erdős Farkas Gulyás Hegedűs Jakab Katona Kerekes Kozma Lengyel Magyar
    Mátyás Nemes Oláh Pásztor Sipos Somogyi Szalai Szücs Török Vadász Vass Zsolnai`,
  );
  more(
    'greek',
    `Aristidis Athanasios Charis Christodoulos Dionysis Evangelos Fotis Georgios Giorgakis Iakovos Ilias Kleanthis Leonidas
    Lefteris Marios Menelaos Nektarios Orestis Periklis Pantelis Rafail Savvas Tasos Thodoris Vasilios Yannis Zacharias`,
    `Alevizos Bakirtzis Chatzis Diamantis Economou Fountas Galanis Gerakis Kaloudis Karagounis Katsouranis Kolokotronis
    Lagos Mavros Mitsotakis Nomikos Oikonomou Pantelidis Pappas Ragkousis Siopis Tsimikas Vasiliou Xenakis Zervas`,
  );
  more(
    'southslav',
    `Aco Aleksandar Anto Blagoje Branko Božidar Danilo Draško Duško Emir Gojko Ilija Jasmin Kristijan Ljubomir Mario
    Mile Mladen Novak Nenad Ognjen Pavle Rade Sinisa Slaven Slobodan Stipe Tihomir Veljko Vlatko Zvonimir Žarko
    Armin Dino Edin Haris Kenan Sead Senad Zlatko`,
    `Aleksić Andrić Antić Arsić Babić Bajić Bašić Bošković Bukvić Cerović Čavić Ćirić Delić Dimitrijević Dragović
    Đukić Gavrilović Grujić Hadžić Horvat Ivanović Janković Jelić Jokić Kostić Krstić Lukić Majstorović
    Mandić Mihajlović Mijatović Milić Milovanović Mladenović Nedić Obradović Ostojić Pantić Pejić Pešić
    Rakić Rašić Samardžić Spasojević Stefanović Šarić Terzić Tomić Trifunović Ugrinić Vasiljević Veselinović
    Vojvodić Vukašinović Zeljković`,
  );
  more(
    'nigerian',
    `Abiodun Adewale Ademola Ayodele Babatunde Chidozie Chinonso Chisom Dayo Dele Efe Emmanuel Gbenga Ifeanyi Ike
    Jide Kayode Kunle Lekan Musa Nduka Ngozi Obafemi Olumide Onyeka Segun Sola Tunde Uzoma Wale Yemi`,
    `Adebisi Adegoke Adeniyi Aigbogun Ajibola Akande Akpan Amadi Anyanwu Babangida Balogun Bamidele Ezeh Ibekwe
    Ikpeazu Iwuala Kalu Madu Nnadi Nwosu Nwachukwu Obasi Odunsi Ogbonna Ojo Okoro Oladipo Olowokandi Oyelaran
    Taiwo Udeh Umeh`,
  );
  more(
    'maghrebi',
    `Abderrahmane Adel Amine Anis Aymane Badr Brahim Chakib Driss Fouad Hassan Hatim Idriss Imad Jalal Kamel Larbi
    Lotfi Mounir Mustapha Nordine Omar Rabie Said Slimane Soufiane Tarek Wissam Yassine Zakariae`,
    `Abbassi Aït_Ben_Idder Amellal Aouar Bakkali Belkacem Benatia Benhaddou Bouchama Boukhari Cherkaoui Daoudi
    El_Fassi El_Ouazzani Ghazi Hamouda Harrak Kabbaj Lamrani Maazouz Mekki Naciri Ouali Rami Slimani Tahiri
    Zaidi Ziyech`,
  );
  more(
    'mexican',
    `Alfredo Andrés Ángel Aurelio Axel Bruno Carlos Cuauhtémoc Diego Emmanuel Ernesto Fabián Gael Gustavo Heriberto
    Humberto Jaime Javier Joaquín Leonardo Lorenzo Marcelo Mauricio Miguel Néstor Pablo Rafael Ramón Raúl Rogelio
    Salvador Teodoro Ulises`,
    `Amezcua Aranda Arellano Bañuelos Barajas Camarena Carbajal Cisneros Cuevas Echeverría Elizondo Garduño Godínez
    Grajeda Haro Lomelí Macías Madrigal Naranjo Ocampo Olvera Preciado Quezada Rentería Saldaña Tijerina Uribe
    Valadez Zamora Zúñiga`,
  );
  more(
    'portuguese',
    `Abel Adriano Aldo Alexsandro Amadeu Bernardino Cândido Cristiano Edmilson Elias Emanuel Fernando Fred Genildo
    Hernani Isaque Jair Jonatan Josué Juliano Kaká Lázaro Luan Marcelino Natan Otávio Patrick Paulinho Renan
    Roberto Rogério Samuel Tales Ulisses Wellington Willian`,
    `Albuquerque Alcântara Amorim Arantes Assis Bezerra Bittencourt Cavalcanti Cordeiro Dantas Domingues Falcão
    Fagundes Figueira Furtado Garcia Godinho Granja Jesus Lins Lima Loureiro Magalhães Maia Mattos Menezes Moraes
    Neto Novaes Peixoto Quintela Rangel Rebelo Salgado Sampaio Seixas Sobral Tavares Toledo Veloso Zanetti`,
  );
  more(
    'italian',
    `Achille Adriano Alfredo Amedeo Angelo Armando Aurelio Biagio Camillo Carmine Cesare Ciro Corrado Dario Donato
    Elio Ennio Ettore Fausto Flavio Gaetano Gennaro Gino Ignazio Lino Livio Mauro Nando Orazio Osvaldo Pasquale
    Remo Renzo Rocco Rosario Sergio Tiziano Ugo Valentino`,
    `Accardi Aiello Bonfiglio Bruni Cappelli Cardillo Cesaro Cocco Corradi D'Amico De_Rosa Di_Stefano Di_Marco Fiorini
    Gaudio Grimaldi Ianni Lanza Liguori Lo_Presti Magnani Marrone Mazzoni Melis Napolitano Orsini Pellegrino Porcu
    Ricci Sabatini Salvi Santini Savino Sorrentino Spina Tedesco Urso Vinci Zanotti`,
  );
  more(
    'dutch',
    `Adriaan Anton Berend Boudewijn Cornelis Daniël Dolf Evert Folkert Gijs Hidde Jaap Joris Kees Leo Marnix
    Menno Nick Pim Remco Sebas Siem Stef Teun Wim Yoeri`,
    `Arends Bosch Bouwman Brink Dam De_Jager De_Jonge De_Wolf Dubbeldam Hermans Hofman Kamphuis Klaassen
    Koning Kramer Lammers Molenaar Oosterhuis Pijnenburg Roelofs Rutten Sanders Stoffels Terpstra Veenstra
    Verheul Vonk Wolters`,
  );
  more(
    'nordic',
    `Alf Arvid Bent Bo Dag Finn Frode Gunnar Halvor Hans Ivar Jørgen Karl Knut Leif Mats Nils Per Rolf Sigurd
    Steen Sune Svend Tor Trond Ulf Vidar`,
    `Aagaard Ahlgren Alm Bengtsson Björk Bøgh Dahlberg Ekström Engström Fredriksen Gjerde Halvorsen Hellström
    Isaksen Jørgensen Kjær Lindgren Mathiesen Nordin Normann Overgaard Palm Ravn Skog Strömberg Torp Winther`,
  );
  more(
    'german',
    `Achim Armin Arne Berthold Björn Christoph Detlef Dirk Egon Elmar Fritz Gerhard Günter Hagen Harald Heiko Horst
    Ingo Jörg Konrad Kurt Lutz Mario Norbert Rainer Reinhard Rolf Siegfried Thorsten Uwe Volker Willi`,
    `Adler Baier Berndt Bergmann Böhm Breuer Brinkmann Dahl Dreher Eberhardt Fiedler Gebhardt Hagedorn Heilmann
    Hellwig Holzer Jansen Kluge Kramer Lenz Merkel Nowak Pfister Reuter Rohde Sandmann Siebert Thiel Wendt`,
  );
  more(
    'french',
    `Alain Alban Anatole Armand Aurélien Bruno Christian Claude Denis Didier Emmanuel Fabrice Gérard Gilbert
    Hervé Jacques Jean-Marc Laurent Marius Patrice Raphaël Serge Sylvestre Tanguy Timothée Yvan`,
    `Allard Auger Boulanger Bouchard Brunet Chauvin Delmotte Deschamps Dubois Faure Fournier Gaudin Hoarau
    Jacquet Lacombe Langlois Lebon Maurice Normand Olivier Pasquier Rémy Sauvage Tardieu Vallet Verdier`,
  );
  more(
    'spanish',
    `Abel Aitor Amador Anselmo Baltasar Celso Dámaso Eladio Emilio Evaristo Fabián Gaspar Hilario Isidro Jacinto
    Leandro Leopoldo Lisandro Manolo Nazario Olegario Plácido Quique Rufino Sancho Telmo Ubaldo`,
    `Albarrán Aldea Bolaños Burgos Caballero Calderón Cuéllar Echeverría Escudero Garrote Gil Hidalgo Izquierdo
    Lasa Leiva Mata Mesa Miralles Orozco Oviedo Paz Quesada Rey Sáez Tapia Urbano Valle Zubiri`,
  );
  more(
    'scottish',
    `Aidan Alasdair Bryce Callum Dallas Eilidh Ewan Fenwick Hamish Ian Jock Keir Lyle Malcolm Rob Struan Tam`,
    `Anstruther Auld Bannerman Cargill Dewar Fairbairn Glass Heron Imrie Kidd Laing Mathieson Nisbet Orr Pirie
    Reekie Strachan Tulloch Younie`,
  );
  more(
    'irish',
    `Barry Cian Eddie Fergal Gearóid Jarlath Kevin Liam Micheál Noel Oran Phelim Ronan Shane Teddy`,
    `Banahan Brogan Buckley Cassidy Cleary Corcoran Dempsey Egan Foley Gilmore Heffernan Kavanagh Lyons Mulligan
    Nolan Phelan Quigley Reilly Sheehan`,
  );
  more(
    'welsh',
    `Alun Aneurin Berwyn Cadfan Dewi Efan Gareth Hefin Ifan Maldwyn Meirion Rhydian Siôn Steffan`,
    `Bebb Cadwalader Dafis Eynon Gwilliam Hafod Ieuan Mabon Pennant Pryce Rhydderch Tegid`,
  );
  more(
    'english',
    `Aiden Alfie Arthur Bobby Brooklyn Callum Cooper Cyrus Elijah Eli Frankie Hamza Harley Jenson Jayden Jonny Keiran
    Kobbie Lennon Marley Mohammed Noah Otis Raphael Rio Ronnie Rowan Sidney Stanley Tommy Zane Ashton Bailey
    Chester Dominic Ernest Hector Irving Keegan Lyle Noel Orson Percy Ralph Sidney Stirling Wilfred`,
    `Ainsworth Allsop Anstey Ayres Bagshaw Bardsley Beaumont Birtwistle Bolton Brockhurst Chadwick Cheetham
    Clegg Cockcroft Dobson Eccles Farrimond Gilmore Greenwood Halliwell Hargreaves Heywood Hollins Isherwood
    Kenyon Lomax Mellor Noble Openshaw Peake Quayle Rawlinson Shackleton Standish Sykes Tattersall Unsworth
    Varley Whitworth Winstanley Yarwood Bickerstaff Cuthbert Elwood Garland Hartley Lister Maddison Nuttall`,
  );
  more(
    'romanian',
    `Aurel Cornel Costin Dorel Eugen Gheorghe Iulian Lucian Mircea Nelu Petre Sebastian Teodor Vasile Viorel`,
    `Anghel Bălan Badea Chiriac Ciobanu Dragomir Enache Filip Gavrilă Iacob Lupu Manea Neacșu Olteanu Păun
    Rădulescu Stanescu Tudor Voicu`,
  );
  more(
    'eastslavic',
    `Anton Boris Denis Fedir Gleb Grigory Leonid Maxim Nazar Oleksiy Petro Rodion Semen Timur Trofim Valery Vasyl Yevhen`,
    `Antonov Bilyk Chernenko Danylenko Drozdov Fomin Grishin Hryhorenko Isaev Klymenko Kotov Lazarenko Mironov
    Nesterov Panasenko Rudenko Shevchenko Tarasenko Voronin Yakovlev Zhuravlev`,
  );
  more(
    'ghanaian',
    `Abdul-Rahman Adjei Alhassan Bernard Ebenezer Francis Gideon Inusah Joseph Kojo Kwaku Mubarak Nii Raphael Seidu Yaw`,
    `Addo Ankrah Armah Asare Badu Baffoe Danso Dwamena Forson Gyamfi Kwarteng Larbi Nyarko Opoku Pobee Takyi Wiredu`,
  );
  more(
    'senegalese',
    `Assane Babacar Bamba Demba Habib Mbaye Modou Oumar Samba Souleymane Tidiane`,
    `Barry Camara Faye Gomis Keita Mendy Ndao Ndong Samb Sy Thioune`,
  );
  more(
    'ivorian',
    `Alain Bakary Emmanuel Franck Gervais Ismaël Lacina Mamadou Salomon Sekou Tiémoko`,
    `Aké Bamba Cissé Dosso Gnagne Konan Koffi N'Guessan Soro Yéo Zadi`,
  );
  more(
    'centralafrican',
    `Aimé Barthélemy Cédric Clément Dieudonné Ghislain Hervé Landry Parfait Rodrigue Serge`,
    `Ebongue Ekambi Fouda Kamdem Mbarga Mbida Mboma Njie Tchoumi Tchouameni`,
  );
  more(
    'southafrican',
    `Bheki Bongani Dumisani Itumeleng Kagiso Lebohang Lungisani Mandla Neo Percy Sipho Thabo Themba Tshepo Zola`,
    `Dlamini Khumalo Maseko Mokoena Molefe Mthembu Naidoo Ndlovu Nkosi Radebe Sithole Tshabalala Zulu`,
  );
  D.widenNames();
})();

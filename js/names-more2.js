// More names, part two (outside Europe, and the cultures behind the Americas, Africa and Asia). Same method as
// js/names-more.js: add to the culture pools, then widen every nation's own pool again.
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
    'latin',
    `Agustín Alan Alexis Ariel Axel Bautista Benjamín Brian Camilo Cristian Damián Darío Diego Emiliano Emanuel Enzo Esteban
    Facundo Federico Franco Gabriel Germán Gonzalo Guido Ignacio Joaquín Juan Julián Lautaro Leandro Lucas Mariano Martín
    Mateo Maximiliano Nahuel Nicolás Pablo Rodrigo Santiago Sebastián Tomás Valentín Yamil Andrés Carlos Cristóbal David
    Duván Éder Fabián Felipe Harold Jhon Jorge Luis Miguel Oscar Radamel Santiago Stiven Wilmer Yerry`,
    `Acosta Aguirre Arce Barrios Benítez Bustos Cabrera Cáceres Cardozo Castillo Córdoba Correa Díaz Domínguez Duarte
    Escobar Figueroa Franco Gallardo Giménez Godoy Gómez González Ibarra Insúa Juárez Lencina Lucero Maldonado Medina
    Mendoza Montenegro Navarro Núñez Ojeda Olivera Ortiz Palacios Paredes Pereyra Quiroga Ramírez Ríos Rojas
    Romero Rosales Ruiz Salazar Sánchez Sosa Suárez Torres Vargas Vega Vera Villalba Vázquez Yáñez Zárate
    Arboleda Cuadrado Cuesta Hurtado Mosquera Murillo Obando Ospina Palomino Quintero Restrepo Rentería Valencia`,
  );
  more(
    'uruguayan',
    `Agustín Bruno Cristian Diego Emiliano Federico Gastón Gonzalo Jonathan Joaquín Maximiliano Nahitan Nicolás Rodrigo
    Santiago Sebastián`,
    `Acuña Bentancur Cabrera Callejas Cáceres Coates Cortés Da_Silva Díaz Etcheverry Fernández Gamarra Godín Lemos
    Maidana Méndez Núñez Pereira Pérez Rodríguez Silva Sosa Suárez Techera Varela Viña`,
  );
  more(
    'mexican',
    `Adrián Alan Aldo Alexis Brian César Cristian Édgar Eduardo Emilio Érick Fernando Gerardo Hirving Iván Jesús
    Joel Jonathan Jorge Josué Julián Kevin Luis Marco Nicolás Omar Orbelín Oswaldo Rodolfo Santiago Uriel Víctor Yahir`,
    `Aguilar Alvarado Ávila Barrera Bautista Carrillo Castañeda Cervantes Chávez Contreras Cortés Domínguez Escamilla
    Esparza Espinoza Fierro Flores Franco Galván Gallegos Gómez Guerrero Gutiérrez Hernández Ibarra Jiménez Juárez
    Lugo Maldonado Márquez Mendoza Montes Nava Orozco Pacheco Palacios Pineda Quintero Rangel Rivera Robles Rosales
    Salas Sandoval Solís Tapia Trejo Valdez Valenzuela Velázquez Zavala`,
  );
  more(
    'chinese',
    `Bo Chao Cheng Feng Gang Guang Hao Hong Jian Jie Jun Kai Lei Long Ming Peng Qiang Rui Shan Tao Wei Xin Yang Yu Zhi`,
    `Bai Cui Dai Ding Fan Fang Fu Gu Hou Jin Kong Lai Lu Mao Meng Mo Ni Ou Qian Qin Ren Shao Shen Tan Wan
    Xia Xiong Yan Yin Zhong Zou`,
  );
  more(
    'japanese',
    `Akira Daichi Daiki Daisuke Eita Genki Haruki Hayato Hibiki Hiroki Hiroto Itsuki Jun Junya Kaito Kazuki Keita Kenta
    Kosuke Kota Kyosuke Makoto Masato Naoki Noboru Reo Riku Ryo Ryota Satoshi Shinji Shota Sora Takashi Takumi Tatsuya
    Tomoki Tsubasa Yoshiki Yuki Yuma Yusuke Yuto`,
    `Abe Aoki Arai Baba Doi Endo Fujii Fujita Fukuda Goto Hamada Hasegawa Hayashi Hirano Honda Ikeda Imai Inoue Ishida
    Ishikawa Ito Iwasaki Kaneko Kikuchi Kimura Kobayashi Kondo Kubo Maeda Matsuda Matsumoto Miyazaki Mori Murakami Nagai
    Nakagawa Nakamura Nakano Nishida Nishimura Noguchi Ogawa Okada Ono Ota Saito Sakamoto Sasaki Sato Shimizu Sugiyama
    Suzuki Takahashi Takeda Tanaka Tomita Ueda Wada Watanabe Yamada Yamaguchi Yamamoto Yamashita Yoshida Yoshikawa`,
  );
  more(
    'korean',
    `Dong-hyun Do-yoon Hyun-woo Jae-hyun Jae-won Jin-woo Joon-ho Ju-won Jun-seo Kang-in Ki-hoon Min-jae Min-ho Myung-jin
    Sang-woo Seung-ho Sung-min Tae-hee Woo-jin Yong-jun Young-jae`,
    `Ahn Bae Baek Cha Cho Choi Han Heo Hong Hwang Im Jang Jeon Jeong Ji Jo Jung Kang Kim Ko Kwon Lee Moon Nam
    No Oh Park Seo Shin Son Song Yang Yoo Yoon`,
  );
  more(
    'thai',
    `Anan Apichart Chaiwat Chanathip Kritsada Narong Pakorn Pichai Prasit Rattana Somchai Sunan Surachat Teerasil
    Thanawat Warut Weerachai Yodsak`,
    `Boonmee Chaiyasit Chantara Charoenphol Jaidee Kaewmanee Khamsuk Methasit Phromsri Rattanakorn Saelim Sriprasert
    Suksawat Thongchai Tongsri Wongsa Yodthong`,
  );
  more(
    'nigerian',
    `Abdul Adebayo Ahmed Chidi Chinedu Chukwuemeka Chukwudi Daniel Emeka Ebuka Femi Godwin Ibrahim Ikechukwu Isaac Kelechi
    Kingsley Nnamdi Obinna Olamide Olusegun Samuel Sunday Tochukwu Uche Victor Yusuf`,
    `Abubakar Adeleke Adeyemi Afolabi Ajayi Akinola Aliyu Bello Chukwu Dada Ekong Eze Idowu Ige Mohammed Nwankwo
    Obi Odion Ogunleye Okafor Okeke Okonkwo Olawale Onuoha Osagie Salami Usman Yakubu`,
  );
  more(
    'ghanaian',
    `Abdul Afriyie Atta Daniel Emmanuel Gyasi Isaac Kwabena Kwadwo Kwame Kwasi Kofi Nana Prince Richmond Samuel
    Thomas Yaw`,
    `Acheampong Adjei Agyemang Amoah Ampofo Antwi Appiah Asamoah Boateng Darko Frimpong Gyan Kuffour Mensah Nketiah
    Osei Owusu Quaye Sarpong Tetteh Yeboah`,
  );
  more(
    'senegalese',
    `Abdoulaye Alassane Amadou Boubacar Cheikh Famara Ibrahima Idrissa Lamine Mamadou Moussa Ousmane Pape Saliou`,
    `Badji Ba Cissé Diagne Diallo Diatta Dieng Diop Fall Gueye Kouyaté Mbaye Ndiaye Niang Sagna Sarr Seck Sène Sow Thiam`,
  );
  more(
    'ivorian',
    `Aboubakar Adama Armand Cheick Ibrahim Jean-Philippe Karim Kouadio Max-Alain Seko Serge Wilfried Yaya`,
    `Bamba Bailly Coulibaly Diomandé Doumbia Gradel Kessié Kouassi Kouyaté N'Dri Ouattara Sangaré Touré Traoré Yao Zaha`,
  );
  more(
    'maghrebi',
    `Abdelkader Achraf Adam Aymen Ayoub Bilal Brahim Djamel Fayçal Hamza Hicham Ilyes Karim Mehdi Mohamed Nabil Nassim
    Rachid Riyad Samir Sofiane Walid Yacine Youssef Zakaria Zinedine`,
    `Alaoui Amrani Belhadj Benali Benjelloun Benzema Boudjemaa Bouzid Cherki Chraibi El_Amrani El_Idrissi Fassi
    Haddad Hakimi Hamdi Idrissi Kadri Khalid Lahlou Mahrez Mansouri Messaoudi Mrabet Naceri Saidi Tazi Zerrouki`,
  );
  more(
    'centralafrican',
    `Albert Alain Bertrand Christian Didier Eric Fabrice Gael Guy Jean Joel Jordan Kevin Marcel Patrick Pierre`,
    `Bolasie Bokila Ekoko Kabongo Kalala Kambala Lukaku Makiadi Mbemba Mputu Mwamba Nkoulou Onana Tshibola Wissa`,
  );
  more(
    'caribbean',
    `Andre Anthony Chris Damion Dwight Errol Jermain Kemar Kyle Leon Marlon Michail Nathaniel Omar Raheem Shaun
    Tristan Wes Winston`,
    `Alexander Barnes Bryan Campbell Clarke Edwards Gayle Gordon Henry Lewis Marshall McKenzie Morgan Palmer Powell
    Richards Samuels Thompson Walcott Williams`,
  );
  more(
    'africanamerican',
    `Aaron Brandon Carlos Darius Deandre Derrick Elijah Isaiah Jalen Jamal Jaylen Malik Marcus Terrell Tyrone Zion`,
    `Banks Boyd Carter Coleman Dixon Freeman Gaines Grant Harris Hill Jenkins Johnson Jones Mosley Murray Perry
    Robinson Simmons Thomas Washington Webb`,
  );
  more(
    'southasian',
    `Aarav Amit Arjun Dev Harpreet Ishaan Jaspreet Karan Kunal Manpreet Nikhil Rahul Rohan Sandeep Sanjay Vikram`,
    `Ahmed Ali Bhatti Chaudhry Das Gill Hussain Iqbal Kapoor Khan Malik Mehta Patel Rahman Sandhu Sharma Singh
    Siddiqui Verma`,
  );
  more(
    'pacific',
    `Aisake Isaia Jonah Losi Manu Mikaele Sione Tevita Viliame`,
    `Faleolo Fonoti Lealiifano Moala Penitani Savea Taufa Tuilagi Vaea Vaka`,
  );
  more(
    'mashriq',
    `Abdullah Ahmed Ali Fahad Hassan Hussein Khalid Majed Mohammed Mustafa Omar Saleh Tariq Yasser Youssef`,
    `Al_Abed Al_Ahmad Al_Dawsari Al_Ghamdi Al_Harbi Al_Qahtani Aziz Farouk Haddad Hamdan Hassan Khoury Mansour Nasser
    Saad Salem`,
  );
  more(
    'persian',
    `Amir Ali Ehsan Hamed Hossein Mehdi Milad Mohsen Omid Reza Saeed Sardar`,
    `Ahmadi Azmoun Beiranvand Ebrahimi Ghafouri Hosseini Jahanbakhsh Karimi Mohammadi Rezaei Taremi Zare`,
  );
  more(
    'albanian',
    `Arben Besnik Dritan Erion Fatjon Genc Ilir Kujtim Lorik Orges Shkelzen`,
    `Berisha Basha Bardhi Gashi Hoxha Krasniqi Lleshi Marku Prifti Shehu Zeka`,
  );
  more(
    'hebrew',
    `Amit Avi Eran Itay Moshe Noam Omer Roei Shai Yossi`,
    `Ben_David Cohen Dahan Friedman Gabay Hazan Levi Mizrahi Peretz Shapira`,
  );
  D.widenNames();
})();

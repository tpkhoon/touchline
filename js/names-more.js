// More names, part one (Europe). Adds to the culture pools in js/names.js and js/nations.js, then widens every nation's
// own pool again (the pools drop duplicates, so a name in two lists counts once). "de_Jong" is one surname with a space.
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
    'english',
    `Alexander Freddie Theo Oscar Logan Mason Finley Reuben Elliot Tyler Dylan Ryan Aaron Adam Ben Cameron Cole Declan Ethan
    Fletcher Gareth Harvey Ian Jake Kieran Leon Liam Marcus Nathan Owen Patrick Quinn Rhys Sean Toby Vincent Wesley Zachary
    Bradley Carl Dean Elliott Frank Glenn Hugo Isaac Joel Kyle Lloyd Mitchell Neil Paul Reece Scott Terry Troy Warren Alan
    Barry Colin Derek Graham Keith Malcolm Martin Nigel Philip Raymond Roy Stephen Trevor Gary Darren Lee Craig Wayne Mark
    Andrew Michael Robert David Peter Simon Jamie Josh Luke Matthew Max Nicholas Ross Shane Stuart Tom Tommy Will Billy
    Danny Jimmy Johnny Joey Ollie Sam Sonny Jude Ellis Rory Kai Jesse Leighton Brandon Brody Carter Callan Dexter Evan Felix
    Gabriel Harrison Jasper Kian Louie Miles Nico Preston Reggie Spencer Tristan Ashley Blake Clayton Drew Grant Hayden`,
    `Abbott Ackroyd Adams Aldridge Allen Archer Armstrong Ashton Atkinson Austin Bailey Baker Ball Banks Barber Barker Barnes
    Barrett Bates Baxter Bell Bennett Berry Birch Black Blake Bond Booth Bowen Boyle Bradley Brennan Bridges Briggs Brooks
    Burke Burns Burton Butler Byrne Cain Carr Carter Chambers Chapman Charles Cole Collins Cook Cooper Cox Craig Crawford
    Cross Cunningham Curtis Dale Daniels Davidson Dawson Day Dean Dixon Doyle Duncan Dunn Edwards Elliott Ellis Farmer
    Ferguson Fisher Fletcher Ford Foster Fowler Fox Francis Franklin Freeman Gardner Gibson Gilbert Giles Glover Goodwin
    Gordon Graham Grant Gray Griffiths Hale Hamilton Hammond Hancock Hardy Harper Harris Harrison Hart Harvey Hawkins
    Hayes Henderson Henry Hicks Hill Hobbs Holland Holmes Hope Howard Howe Hudson Hunt Hunter Hussain Ingram Jarvis Jenkins
    Jordan Kelly Kemp Kennedy Khan King Knight Lamb Lane Lawrence Lawson Lee Lewis Little Lloyd Long Lowe Lucas Marsh
    Marshall Martin Mason Matthews May Miller Mills Mitchell Moore Morgan Morris Morrison Murphy Murray Newman Nicholls
    Nolan Norris Norton Oliver Osborne Owen Palmer Parker Parsons Patel Payne Pearce Pearson Perry Phillips Pickering
    Porter Powell Price Pritchard Ramsey Reed Reid Reynolds Rhodes Rice Richards Riley Rogers Rose Russell Saunders Shaw
    Simpson Skinner Slater Spencer Stanley Steele Stephens Stevens Stone Sutton Sullivan Tate Tucker Vaughan Wade Wallace
    Ward Warner Watkins Watson Webb Webster Wells West Weston Whitehead Wilkinson Willis Woods Yates Young Appleby Ashworth
    Bamford Bickerton Cartwright Dewhurst Entwistle Fairclough Garside Greenhalgh Haworth Holroyd Ironside Kershaw
    Lonsdale Metcalfe Oldroyd Pennington Ratcliffe Sagar Thwaite Whittaker`,
  );
  more(
    'scottish',
    `Alistair Archie Bruce Calum Colin Dougal Eoin Fergus Finlay Gregor Innes Jamie Kenneth Lewis Magnus Niall Ruaridh Rory
    Scott Struan Tavish Torquil Uisdean Wallace Alexander Andrew Blair Brodie Cormac Dylan Findlay Gavin Hector Logan Murdo
    Neil Ranald Ronan Stewart Tormod Willie`,
    `Abercrombie Adair Aitken Baird Barclay Beaton Bell Black Boyd Brodie Bruce Cairns Calder Carmichael Crichton Dalgleish
    Douglas Drummond Duff Dunbar Elliot Erskine Farquhar Forbes Forsyth Galbraith Gillespie Glen Gray Guthrie Haig Hay
    Innes Irvine Jardine Kerr Kincaid Lamont Lindsay Lockhart Logan MacArthur MacDougall MacGillivray MacIntyre MacKay
    MacLean MacMillan MacNeil MacPherson Maitland Menzies Moncrieff Montgomery Moffat Munro Napier Nicol Ogilvie Paterson
    Rae Ramsay Rennie Rutherford Scrimgeour Seton Shearer Skene Sutherland Urquhart Wallace Wemyss Wishart Younger`,
  );
  more(
    'welsh',
    `Aled Bryn Cai Carwyn Dafydd Dylan Emyr Gethin Gruffydd Gwilym Hywel Idris Ioan Iolo Llew Llywelyn Morgan Osian Owain
    Rhodri Rhys Sion Taliesin Trystan Tudur Wyn Ynyr Ceri Deiniol Elis Garan Geraint`,
    `Bevan Bowen Cadwallader Davies Edwards Evans Gethin Griffiths Gwynne Hopkins Howells Humphreys Jenkins Jones Llewellyn
    Lloyd Maddocks Meredith Morgan Owen Parry Phillips Powell Price Pritchard Prosser Pugh Rees Rhys Roberts Thomas Vaughan
    Watkins Williams Yeo Probert Bellis Cadogan Gough Harries Lewis Mathias Mostyn Probyn Tudor`,
  );
  more(
    'irish',
    `Aidan Brendan Cathal Ciaran Colm Conor Cormac Darragh Declan Diarmuid Donal Eamon Eoghan Fintan Fionn Kieran Lorcan
    Niall Oisin Padraig Rory Ruairi Seamus Senan Tadhg Tiernan Turlough Brian Cian Dara Dermot Eoin Gerard Liam Odhran`,
    `Brennan Byrne Callaghan Carroll Clancy Coffey Colgan Connolly Cullen Daly Delaney Devlin Doherty Donnelly Doran
    Dunne Fagan Farrell Feeney Fitzgerald Flanagan Flood Gallagher Geraghty Gilligan Hegarty Hennessy Hickey Hogan Keane
    Keogh Kinsella Lalor Lenihan Madden Maguire Mahon McAuliffe McCarthy McCormack McGrath McHugh McLoughlin Moloney
    Mulcahy Mullan Nagle Neville Noonan O'Brien Rafferty Rooney Scanlon Slattery Tierney Tobin Whelan`,
  );
  more(
    'french',
    `Adrien Alexis Antoine Arnaud Baptiste Benoît Bastien Cédric Clément Corentin Damien Dorian Dylan Étienne Florent
    Gaëtan Guillaume Hugo Jérémy Julien Kévin Lilian Loïc Maxime Mathieu Morgan Nolan Olivier Pierre Quentin Rémi Romain
    Sébastien Théo Thibault Tristan Valentin Xavier Yann Yoann Anthony Axel Bryan Christophe Damian Franck Gilles
    Jonathan Ludovic Mickaël Nicolas Sylvain Thomas Vincent`,
    `Aubert Bertrand Blanc Bonnet Bouvier Brun Caron Carpentier Chevalier Colin Collet Cordier Dufour Dumas Duval Fabre
    Fontaine Garnier Gauthier Giraud Gomez Guillot Henry Hubert Jacob Lambert Laurent Lecomte Leclerc Lefebvre Lemaire
    Lemoine Leroy Lopez Marchand Marechal Marie Masson Mercier Meyer Moreau Morel Muller Noel Perrin Petit Philippe
    Picard Poirier Renard Renaud Rey Riviere Rolland Roussel Roux Schmitt Vidal Weber Barbier Bourgeois Charpentier
    Clement Da_Silva Delmas Dupuis Fernandez Gaillard Gerard Hamon Lacroix Lebrun Leblanc Maillard Millet Navarro Pelletier
    Perrot Rousseau Texier Tessier Vasseur Weiss`,
  );
  more(
    'spanish',
    `Adrián Aitor Alberto Álvaro Andrés Ángel Aritz Borja Carlos Cristian Dani Diego Eduardo Enrique Fernando Gonzalo
    Guillermo Héctor Hugo Iago Ignacio Iker Iván Jaime Javier Jesús Jon Jorge Josu Julen Lucas Manuel Marcos Mario
    Martín Mikel Nacho Nicolás Óscar Pablo Pedro Rafael Raúl Rubén Rodrigo Sergio Unai Víctor Xabier Yeray Alejandro
    Aleix Arnau Bernat Ferran Gerard Jordi Marc Oriol Pau Pol Roger Sergi`,
    `Aguilar Alonso Álvarez Arias Barrios Bermúdez Blanco Bravo Cabello Calvo Camacho Campos Cano Carmona Castro Crespo
    Cruz Delgado Domínguez Durán Escobar Esteban Fernández Ferrer Flores Gallego García Garrido Giménez Gómez
    Gutiérrez Guerrero Herrera Ibáñez Iglesias Jiménez Lorenzo Marín Márquez Marta Mendoza Molina Montero Morales
    Moreno Muñoz Navarro Nieto Ortega Ortiz Pardo Pascual Peña Pérez Prieto Ramírez Ramos Reyes Rivas Rodríguez Román
    Romero Rubio Ruiz Salazar Sánchez Santana Santiago Serrano Soler Soto Suárez Torres Vázquez Vega Vicente Villanueva
    Zapata Aranda Arroyo Beltrán Bustos Cordero Cuesta Ferrero Fuentes Gallardo Lozano Mena Olmos Palacios Sanz Segura`,
  );
  more(
    'portuguese',
    `André Bernardo Bruno Carlos Cláudio Daniel Diogo Duarte Eduardo Fábio Filipe Francisco Gonçalo Guilherme Hélder
    Henrique Hugo Ivo João Joaquim Jorge José Leandro Luís Manuel Marco Mário Miguel Nélson Nuno Paulo Pedro Rafael
    Ricardo Rodrigo Rúben Rui Sérgio Simão Tiago Tomás Vasco Vítor Wilson Alexandre Anderson Caio Danilo Everton
    Felipe Gabriel Gustavo Igor Jonas Leonardo Lucas Matheus Murilo Rafinha Thiago Vinícius Wallace Yuri`,
    `Abreu Almeida Alves Amaral Andrade Antunes Araújo Azevedo Baptista Barbosa Barros Batista Borges Branco Cabral
    Campos Cardoso Carneiro Carvalho Castro Coelho Correia Costa Cunha Dias Duarte Esteves Faria Fernandes Ferraz
    Ferreira Fonseca Freitas Gomes Gonçalves Guedes Henriques Lopes Machado Marques Martins Mendes Miranda Monteiro
    Moreira Morais Moura Nascimento Neves Nogueira Nunes Oliveira Pacheco Pereira Pinheiro Pinto Ramos Reis Ribeiro
    Rocha Rodrigues Santos Silva Simões Soares Sousa Tavares Teixeira Valente Vaz Vieira Xavier Aguiar Bastos Benedito
    Brito Camargo Damasceno Guimarães Lacerda Macedo Medeiros Paiva Siqueira Tavora Trindade Vasconcelos`,
  );
  more(
    'italian',
    `Alberto Alessandro Alessio Andrea Antonio Bruno Carlo Claudio Cristian Daniele Davide Diego Domenico Edoardo Emanuele
    Enrico Fabio Federico Filippo Francesco Gabriele Gianluca Giacomo Giorgio Giovanni Giulio Giuseppe Gregorio Ivan Leonardo
    Lorenzo Luca Luigi Manuel Marco Mario Mattia Matteo Michele Nicola Nicolò Paolo Pietro Raffaele Riccardo Roberto
    Salvatore Samuele Sandro Simone Stefano Tommaso Umberto Valerio Vincenzo Vittorio`,
    `Abate Agostini Albanese Amato Barbieri Basile Battaglia Bellini Benedetti Bernardi Bianchi Bruno Caputo Carbone
    Cattaneo Colombo Conte Coppola Costa D'Angelo De_Luca De_Simone Del_Vecchio Donati Esposito Fabbri Farina Fedele
    Ferrara Ferrari Ferraro Fontana Galli Gallo Gentile Giordano Giuliani Grassi Greco Guerra Leone Lombardi Longo
    Maggio Mancini Marchetti Marino Martini Messina Monti Morelli Moretti Neri Orlando Pagano Palumbo Parisi Pellegrini
    Piras Poli Riva Rizzo Romano Rossi Russo Sala Santoro Sanna Serra Silvestri Testa Valentini Vitale Vitali Zanetti
    Zito Bonetti Caruso Cattani Ciccone Cirillo Dellera Fiore Gabrielli Iacono Lazzari Lupo Mazza Pace Rinaldi`,
  );
  more(
    'german',
    `Alexander Andreas Benedikt Bastian Christian Clemens Dennis Dominik Fabian Felix Florian Frederik Jan Jannik Jonas
    Julian Kai Kevin Lars Leon Lukas Manuel Marcel Marius Mathias Maximilian Moritz Niklas Nico Oliver Patrick Philipp
    Robin Sebastian Simon Stefan Sven Tim Tobias Tom Valentin Yannick Anton Axel Bernd Dieter Emil Gerd Holger Jürgen
    Klaus Lennart Linus Malte Matti Nils Ole Rafael Stephan Torben Tristan Ulrich Wolfgang`,
    `Albrecht Altmann Arnold Bauer Baumann Beck Becker Berger Brandt Braun Busch Dietrich Ebert Engel Fischer Franke
    Friedrich Fuchs Funk Graf Günther Haas Hahn Hartmann Heinrich Herrmann Hofmann Hoffmann Horn Jäger Jung Kaiser
    Keller Klein Koch König Kraus Krause Krüger Kühn Kunz Lang Lange Lehmann Lorenz Ludwig Maier Marx Meier Mayer
    Möller Neumann Otto Pohl Reinhardt Richter Roth Sauer Schäfer Scholz Schreiber Schröder Schubert Schulte Schulz
    Schwarz Seidel Simon Sommer Stein Thomas Vogel Vogt Wagner Walter Weber Weiß Werner Winkler Wolf Wolff Ziegler
    Zimmermann Ackermann Brenner Dörr Eichhorn Gärtner Hauser Kessler Lindner Mohr Nagel Pfeiffer Rauch Scherer Voigt`,
  );
  more(
    'dutch',
    `Aart Bas Bart Bram Casper Cees Daan Dennis Dirk Erik Floris Frans Gerrit Guus Hans Hendrik Jasper Jelle Jeroen Joost
    Jurriën Kevin Koen Lars Luuk Martijn Mees Niels Pieter Rick Rutger Sander Sjoerd Stijn Thijs Tim Tom Wesley Wouter
    Xavi Yannick Bastiaan Ruud Marco Mitchell Ricardo Quincy Jermaine Virgil Frenkie Matthijs`,
    `Aalbers Bakker Bos Bosman Brouwer Claassen Dekker De_Boer De_Graaf De_Groot De_Haan De_Ridder De_Vries De_Wit
    Dijkstra Dijkman Evers Gerritsen Hendriks Hoekstra Huisman Jacobs Janssen Jonker Kok Koster Kuiper Maas Meijer
    Mulder Peeters Postma Prins Scholten Schouten Smit Smits Thijssen Timmermans Veldhuis Verhoeven Verbeek
    Vermeulen Visser Vos Willems Zwart Van_Dijk Van_Leeuwen Van_der_Meer Van_der_Heijden Van_den_Berg Van_Wijk
    Van_Essen Van_Gaal`,
  );
  more(
    'nordic',
    `Anders Anton Axel Bjørn Christian Emil Erik Filip Gustav Henrik Hugo Jakob Jens Johan Jonas Kasper Kristian Lars
    Lasse Magnus Mathias Mikkel Nikolaj Oskar Rasmus Simon Sondre Sven Thomas Tobias Viktor Aksel Eirik Fredrik
    Håkon Ivar Joakim Kjetil Ludvig Marius Ola Odd Sigurd Torbjørn Ulrik`,
    `Andersen Berg Bergström Bjørnsen Christensen Dahl Eklund Eriksen Falk Gustafsson Hansen Hedlund Holm Jakobsen
    Jensen Johansen Johansson Karlsson Knudsen Kristiansen Larsen Lindberg Lindqvist Lund Madsen Magnusson Mortensen
    Nielsen Nilsson Nyberg Olsen Olsson Pedersen Persson Petersen Poulsen Rasmussen Sandberg Sjöberg Skov Sørensen
    Strand Svensson Thorsen Vestergaard Wikström Ødegaard Aasen Brekke Haugen Moen Rønning Solberg Strøm Tveit
    Bakke Dybvik Engen Fjeld Grimstad Hovland Iversen Kleven Lie Myhre Nygård`,
  );
  more(
    'polish',
    `Adam Adrian Aleksander Andrzej Artur Bartosz Błażej Damian Dawid Dominik Emil Filip Grzegorz Hubert Igor Jakub
    Jan Jarosław Kacper Kamil Karol Krystian Krzysztof Łukasz Maciej Marcin Marek Mateusz Michał Mikołaj Norbert Oskar
    Patryk Paweł Piotr Przemysław Radosław Rafał Robert Sebastian Sławomir Stanisław Szymon Tomasz Wojciech Zbigniew`,
    `Adamczyk Baran Borkowski Brzeziński Chmielewski Cieślak Czarnecki Dąbrowski Duda Dudek Gajewski Głowacki Górski
    Jabłoński Jakubowski Jankowski Jasiński Kaczmarek Kalinowski Kamiński Kowalczyk Kowalski Kozłowski Krajewski
    Krawczyk Król Kubiak Kucharski Lewandowski Majewski Makowski Malinowski Michalski Mazur Nowak Nowicki Ostrowski
    Pawłowski Pietrzak Piotrowski Przybylski Rutkowski Sadowski Sawicki Sikora Sobczak Stępień Szczepański Szewczyk
    Szymański Tomaszewski Urbański Walczak Wasilewski Wieczorek Wilk Wiśniewski Witkowski Wojciechowski Woźniak
    Zając Zalewski Zawadzki Zieliński`,
  );
  more(
    'czech',
    `Adam Aleš Antonín Daniel David Dominik Filip Jakub Jan Jaroslav Jindřich Jiří Josef Karel Kryštof Lukáš Marek
    Martin Matěj Michal Miloslav Ondřej Patrik Pavel Petr Radek Roman Stanislav Štěpán Tomáš Václav Vít Vladimír
    Vojtěch Zdeněk`,
    `Beneš Blažek Bartoš Čermák Černý Doležal Dvořák Fiala Havlík Horák Hrubý Jelínek Kolář Kopecký Král Krejčí
    Kučera Malý Marek Mareš Navrátil Novák Novotný Pokorný Polák Procházka Růžička Říha Šimek Sedláček Soukup
    Staněk Svoboda Špaček Urban Vacek Vaněk Veselý Zeman`,
  );
  more(
    'hungarian',
    `Ádám Attila Balázs Bence Dániel Dávid Dominik Gábor Gergely Gergő István János Kristóf László Máté Márk Martin
    Miklós Norbert Péter Richárd Sándor Szabolcs Tamás Zoltán Zsolt Barnabás Csaba Ferenc Levente Milán Olivér Roland`,
    `Árpád Balázs Balog Bálint Bíró Boros Csonka Fazekas Fehér Fekete Gál Hajdu Halász Horváth Illés Juhász Kiss Kocsis
    Kovács Lakatos László Lukács Mészáros Molnár Nagy Németh Oláh Orbán Pál Papp Pintér Rácz Sándor Simon Szabó
    Szántó Szilágyi Takács Tóth Varga Veres Vincze Virág`,
  );
  more(
    'southslav',
    `Aleksa Andrej Bojan Boris Damir Darko Dejan Dragan Dušan Filip Goran Igor Ivan Ivica Jovan Josip Luka Marko Mateo
    Milan Miloš Mirko Nemanja Nikola Petar Predrag Radoslav Saša Srđan Stefan Tomislav Uroš Vedran Vladimir Vuk
    Zoran Željko Zlatan`,
    `Babić Bogdanović Božić Cvetković Ćosić Đorđević Dragić Filipović Ilić Jovanović Jurić Knežević Kovačević
    Kovač Lazić Marić Marinković Marković Matić Milanović Milošević Mitrović Nikolić Novak Pavlović Perić
    Petrović Popović Radić Radovanović Ristić Savić Simić Stanković Stojanović Šimić Tadić Todorović
    Vasić Vidić Vuković Zdravković Živković`,
  );
  more(
    'greek',
    `Alexandros Anastasios Andreas Angelos Antonis Charalampos Christos Dimitrios Efstathios Giannis Giorgos Ioannis
    Kostas Lazaros Manolis Michalis Nikolaos Panagiotis Pavlos Petros Sokratis Spyros Stavros Thanasis Theodoros Vasilis
    Vangelis Yiannis Zisis`,
    `Alexiou Anagnostou Andreou Antoniou Apostolou Dimitriou Georgiou Giannakopoulos Ioannou Karagiannis Karras
    Kyriakou Lazaridis Makris Manolas Michailidis Nikolaidis Panagiotou Papadakis Papadopoulos Papageorgiou
    Papanikolaou Pappas Samaras Stavropoulos Theodorou Vlachos Zafeiris`,
  );
  more(
    'turkish',
    `Ahmet Ali Arda Barış Berk Burak Can Cem Cenk Deniz Doğan Emre Enes Erdem Eren Ersin Fatih Furkan Gökhan Güven
    Halil Hasan Hüseyin İbrahim İsmail Kaan Kemal Kerem Mehmet Mert Mustafa Murat Okan Onur Orhan Ozan Ömer
    Selim Serkan Tarık Taner Uğur Volkan Yasin Yiğit Yusuf`,
    `Acar Akın Aksoy Aydın Bulut Çelik Çetin Demir Doğan Durmaz Erdoğan Erdem Gül Güler Güneş Işık Kaplan Karaca
    Kaya Kılıç Koç Korkmaz Kurt Özdemir Özkan Öztürk Polat Sarı Şahin Şen Şimşek Tekin Türk Uçar Yalçın
    Yavuz Yıldırım Yıldız Yılmaz Yüksel`,
  );
  more(
    'romanian',
    `Adrian Alexandru Andrei Bogdan Cătălin Constantin Cristian Dan Daniel Dorin Dragoș Florin Gabriel George Ion Ionuț
    Laurențiu Liviu Marian Mihai Nicolae Octavian Paul Radu Răzvan Sorin Ștefan Valentin Vlad`,
    `Barbu Constantin Dinu Dobre Dumitru Gheorghe Ionescu Marin Matei Moldovan Munteanu Neagu Nistor Pavel Popa
    Popescu Radu Rusu Sandu Stan Stanciu Stoica Toma Țurcanu Vasile Zamfir`,
  );
  more(
    'eastslavic',
    `Aleksandr Aleksey Anatoliy Andriy Artem Bohdan Denys Dmitry Evgeny Igor Ilya Ivan Kirill Maksym Mikhail Nikita
    Oleg Oleksandr Pavel Roman Ruslan Sergey Stanislav Taras Vadym Viktor Vitaliy Vladyslav Yaroslav Yuriy Zakhar`,
    `Bondarenko Boyko Fedorov Gavrilov Ivanov Karpenko Kovalenko Kovalchuk Kravchenko Kuznetsov Lysenko Melnyk
    Morozov Novikov Orlov Pavlenko Petrov Popov Romanenko Savchenko Sidorov Smirnov Sokolov Tkachenko Volkov
    Zaitsev Zinchenko`,
  );
  more(
    'finnish',
    `Aleksi Eero Eetu Jari Jere Joonas Juho Jukka Kalle Lauri Matti Mikko Niko Olli Pekka Petri Risto Samuli Sami
    Teemu Tuomas Ville`,
    `Heikkinen Hakala Hämäläinen Järvinen Kinnunen Koskinen Korhonen Laine Lehtonen Lindholm Mäkinen Nieminen
    Salonen Saarinen Virtanen`,
  );
  D.widenNames();
})();

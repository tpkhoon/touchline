# Naming rules

How the fictional world's clubs, grounds, nicknames and leagues are named, and why. Realistic names follow patterns that
come from how clubs were actually founded; once you know the patterns you can mix and match them. The library is
`tools/namelib.mjs`, the generator `tools/worldgen.mjs`, and `tools/namegen.mjs` (the dashboard's **Names** tab) shows
what the library makes for any nation. A world is generated with `node tools/worldgen.mjs --seed 1 --out
data/fictional-world.json` and put into the game with `node tools/realworld.mjs apply data/fictional-world.json`.

## Contents

- [A quick method](#a-quick-method)
- [Name components by region](#name-components-by-region)
- [Choosing a naming type](#choosing-a-naming-type)
- [Believable place names](#believable-place-names)
- [Supporting details](#supporting-details)
- [Rules to keep it believable](#rules-to-keep-it-believable)
- [Common mistakes](#common-mistakes)
- [How the game applies these rules](#how-the-game-applies-these-rules)

## A quick method

1. Choose the country and the decade of founding.
2. Choose a name type (place, industry, church, merger, university, community).
3. Combine a plausible place name with a fitting suffix or prefix.
4. Add a nickname, colours and a stadium to match.

Example: a club from a Welsh mining valley, founded in 1893 by colliery workers, could be Pen-y-Cwm Colliery Athletic,
nicknamed "The Miners", wearing black and amber, playing at "The Pithead Ground".

## Name components by region

### England and the British Isles

- Place + suffix: Town, City, United, Athletic, Rovers, Wanderers, Albion, Argyle, County, Rangers, Orient, Vale,
  Alexandra.
- "United" often means a merger of two clubs. "Athletic" and "Rovers" are Victorian-era sports-club words. "Albion" and
  "Argyle" are older, quirkier survivors.
- Founding-origin names: Wednesday (the day a cricket club met), Thistle, Hotspur, Villa (a chapel).
- Examples: Calderbridge Town, Marlow Vale, Haverton Rovers, St. Aldric's Athletic.

### Germany

- Eintracht, Borussia, Fortuna, Union, Hansa, Rot-Weiss, Schwarz-Weiss, Viktoria, plus the place and often an
  abbreviation such as SV, FC, TSV, VfL, SC, SpVgg.
- Examples: SV Halberstein, VfL Neubrandt, Fortuna Wesselburg, TSV Eichhausen.

### Spain and Portugal

- Real (royal), Sporting, Deportivo, Atlético, Racing, Club Deportivo, Unión Deportiva, with CF or SD prefixes.
- Examples: Deportivo Alcarra, Real Unión Sabinal, Sporting Vilanova.

### Italy

- Calcio clubs: Associazione Calcio (AC), Unione Sportiva (US), Società Sportiva (SS), Football Club, often with Latin
  or noble-sounding words such as Virtus, Audace, Pro, Juventus.
- Examples: US Castelvalle, Virtus Ravenzano, AC Monteluce.

### France, the Netherlands and Belgium

- France: Olympique, Stade, Racing, Athletic Club, Sporting Club + city (Stade Aubrac, Olympique de Valmont).
- Netherlands: Sportclub, Voetbalvereniging, Football Club + Vitesse, Excelsior, Sparta, Fortuna (Latin ideal names).
- Belgium: Royal, Koninklijke, Racing, Standard, Union.

### Eastern Europe

- Dinamo, Lokomotiv, Spartak, Torpedo, Zenit, Rapid, Slavia, Partizan, Metalist, Shakhtar.
- Many come from factories, rail workers, mining, the military or police. Soviet-era "sports society" names are very
  recognisable, so they do not go on a modern-founded club.

### Russia, Belarus and Ukraine

Each has a library of its own, apart from the Balkan one: Latin transliterations of Russian, Ukrainian and Belarusian,
and the names the Soviet years left behind.

- **Modern clubs** are plain: FK or FC + the town (the town ending in -sk, -ov, -ovo, -grad in Russia; -ivka, -opil,
  -ychi in Ukraine; -ichy, -ovichy, -shchyna in Belarus).
- **Soviet-era names** belong only to clubs old enough to have been founded then: the sports societies (Dinamo,
  Spartak, Lokomotiv, Torpedo, CSKA, Zenit, Trud) and the industry names (Metallurg, Shakhtyor, Khimik, Shinnik,
  Neftyanik; in Ukraine Dynamo, Shakhtar, Metalist, Metalurh, Naftovyk, Hirnyk, Avanhard).
- **Region and landmark names:** Russia Krylia, Fakel, Luch, Baltika, Volga, Ural, Sibir; Ukraine Zorya, Karpaty,
  Chornomorets, Volyn, Polissia, Bukovyna, Kolos; Belarus Neman, Naftan, Belshina, Isloch, Dnepr, Granit.
- **Spelling follows the country:** Dinamo and Lokomotiv in Russia and Belarus, Dynamo and Lokomotyv in Ukraine; each
  country's marker words are rejected in the others.
- **Nicknames and colours** come from each language (Volki, Orly, Kozaki; Hirnyky, Haidamaky; Zubry, Busly), and each has
  its own division and cup names.

### South America

- Club Atlético, Sport Club, Esporte Clube, Clube de Regatas, Independiente, Racing, Unión, Defensores, Nacional.
- Sometimes named for a founder, a neighbourhood or a rowing club, plus a city (Sport Club Corinthians style).

### USA and Canada

Most clubs are franchises with no promotion or relegation. Names are marketing choices.

- Pattern: city + FC / SC / United / City, often with a plural nickname (Timbers, Sounders, Whitecaps).
- Borrowed European style: Real, Sporting, Inter, Atlético.
- Canada: regional and industry names, such as Forge (steel) and Cavalry.
- Lower tiers: often fan-owned or community-founded, with plain place names.
- History: early-1900s company teams (steel and shipyard clubs) and ethnic clubs (Ukrainian, Greek, German) that
  predate the franchise era.
- Examples: Santa Fe Mesa FC, Dakota Prairie SC, Birmingham Foundry United, Cascade Lumberjacks.

### Mexico and Central America

- Mexico: Club + name, usually with a fan nickname. Origins vary: companies (Cruz Azul came from a cement cooperative),
  universities (Pumas UNAM, Tigres UANL), and regional animals or trades.
- Costa Rica, Honduras, Guatemala: Deportivo, Liga Deportiva, Club Sport, Olimpia, Real, plus a neighbourhood or river.
- Examples: Club Deportivo Valle Seco ("Los Zorros"), Atlético Sierra Dorada, Liga Deportiva Cartaginesa, Real Olimpia
  del Norte.

### Japan

The J.League requires clubs to name a hometown and drop corporate sponsor names from the club name.

- Pattern: place + nickname, where the nickname is foreign-language (Italian, Spanish, Latin, English) but refers to
  something local. Sanfrecce is "three" plus "arrow"; Cerezo is "cherry tree"; Antlers come from a local shrine's deer.
- Origins: many began as corporate works teams (car makers, banks, rail companies), so the history shows even when the
  name does not.
- Examples: Sakura Kōgen Albatros, Tsukimi Falcons FC, Nagara Riverside.

### South Korea and China

- Korea: corporate ownership is visible. Pattern: city + company + nickname (Pohang Steelers come from the steel
  company).
- China: names track the sponsor and change often when the owner changes. Pattern: province or city + company, with a
  short nickname.
- Examples: Seoseong Dynamics FC, Gyeongsan Steel Mariners, Jiangnan Silk Dragons, Qinghai Kunlun Steel.

### Southeast Asia

- Thailand: United is extremely common, often combined with a province or a company (Buriram United, Port FC).
- Indonesia: the Per- or PS prefix (from Persatuan, "association") + city. Fans have strong nicknames.
- Malaysia: state-based names.
- Singapore: a mix of Rovers, International, United and corporate-flavoured names.
- Vietnam: company and local-province names (Becamex Binh Duong).
- Examples: Nakhon Rapids United, PS Bumi Kencana, Tanjong Reef International, Perak Heritage FC.

### India and South Asia

- Historic Kolkata clubs: old, with names that sound colonial or heritage-based (Mohun Bagan, East Bengal, Mohammedan
  Sporting) and passionate derbies.
- Franchise era: city + FC, often with an owner brand.
- Goan and company clubs: Dempo, Salgaocar, Churchill Brothers show the company-founded pattern.
- Examples: Howrah Athletic Club, Pune Peshwas FC, Salt Lake Sporting.

### Middle East and North Africa

- Arab world: Al- ("the") + a concept: Al Hilal (crescent), Al Nassr (victory), Al Ittihad (union), Al Wahda (unity),
  Al Shabab (youth), Al Ahli (the national). Pick a meaning that fits the club's identity.
- Iran: Persian words, not Arabic: Esteghlal (independence), Persepolis, Foolad (steel), Tractor.
- Turkey: neighbourhood + spor (Trabzonspor), or a district name (Galatasaray, Beşiktaş).
- Israel: Maccabi, Hapoel, Beitar come from sports movements.
- Examples: Al Sahel, Al Buraq SC, Kerman Copper, Bursa Kale SK.

### Sub-Saharan Africa

- Southern Africa: nicknames and English words, such as Pirates, Chiefs, Sundowns, Wanderers. Kaizer Chiefs is named
  after its founder, inspired by the Atlanta Chiefs.
- West Africa: animals and local-language words (Asante Kotoko for the porcupine; Hearts of Oak), or French-colonial
  structure (ASEC Mimosas, Stade d'Abidjan).
- Central Africa: TP Mazembe ("Tout Puissant"), and Vita Club.
- East Africa: Gor Mahia (a Luo folk figure), AFC Leopards, and a mix of corporate and government ties (KCCA, KCB).
- North Africa: French influence (Espérance Sportive, Étoile Sportive, Association Sportive) plus Arabic names (Wydad,
  Raja).
- Examples: Kumasi Golden Lions, Karoo Rangers, Mombasa Dhow Stars, Union Sportive de Bamako.

### Oceania

- Australia: the modern A-League uses city + a one-word nickname (Victory, Roar, Jets, Mariners). Older state-league
  clubs were founded by migrant communities (Greek, Croatian, Italian), so names like Hellas, Knights, Olympic appear
  there.
- New Zealand: city + United / City / Phoenix.
- Examples: Hobart Kestrels, Riverina Hellas, Auckland Kauri FC.

## Choosing a naming type

Real clubs fall into a few categories, so pick one deliberately:

- **Plain place name:** Brighton, Wolverhampton. Short and common.
- **Place + sports word:** Aston Villa, Derby County.
- **Founded by a company or industry:** Arsenal (Royal Arsenal), West Ham (Thames Ironworks), PSV (Philips).
- **Founded by a church or school:** Everton, Southampton St. Mary's.
- **Merger names:** Birmingham-Frankfurt style compounds, or Sheffield & Hallamshire.
- **Nicknames baked into the name:** Rovers, Wanderers, Hotspur, Bohemians.

## Believable place names

- Take real place-name endings for the region: -ham, -ton, -bury, -ford, -mouth, -field (England); -heim, -dorf,
  -burg, -stadt (Germany); -ville, -sur-, -les- (France); -grad, -ov, -sk (Slavic); -ia, -ano, -etto (Italy).
- Invent a plausible stem and attach a real suffix, such as Aldwick, Penmere, Oberhollen.
- Check that it is not a real club or town by accident.
- Avoid famous-sounding names unless you want a parody, since real clubs already own Royal, Imperial, Grand.

## Supporting details

A name feels real when the rest matches:

- **Nickname:** The Foxes, The Magpies, Los Merengues, usually from the kit or mascot.
- **Colours** that suit the origin (red for industry, blue for harbour towns, black and white for mining).
- **Founding year,** which should line up with the naming style (Victorian "Athletic", 1920s "Sporting", 1960s corporate
  sponsors).
- **Stadium name,** often an old street, farm or founder (Bramall Lane, Carrow Road).
- **Crest:** a coat of arms for a city, an animal, or a local landmark.

## Rules to keep it believable

1. **Match the language.** Persian in Iran, Turkish in Turkey, Italian-style nicknames in Japan. Do not put Al- on a
   Turkish club.
2. **Match the ownership model.** Franchise leagues (US, India) use brand-style names; community and works clubs use
   older, plainer ones.
3. **Think through the founders.** A worker-founded club, a university club and a diaspora club each get different names
   and colours.
4. **Respect culture.** Avoid casually using sacred terms, and avoid caricature naming for Indigenous groups.
5. **Do not repeat suffixes.** Vary them, the way real leagues do.

## Common mistakes

- Overusing "FC" and "United" on everything.
- Combining parts from different cultures, like "Real Hamburg" or "Dinamo Cardiff".
- Names that read like fantasy, such as Dragonheart FC, unless it is deliberately comedic.
- Picking one suffix style for the whole world, which makes it feel generated.

## How the game applies these rules

| Rule | What the generator does |
| --- | --- |
| Region patterns | Every nation has its own club patterns, grounds, nicknames and division and cup names; nations that share a language but not a landscape (Scotland, Wales, Ireland, the USA, Australia, Nigeria, Ghana, Senegal, Ivory Coast, Morocco, Belgium, Thailand) have libraries of their own |
| Founding origins | English works, colliery, railway, foundry and church patterns; Mexican university, cooperative, trade and animal names (Cementeros, Mineros, Venados); Japanese place + foreign-word names; Korean city + company + nickname; American foundry and lumber names; Australian migrant-club names (Hellas, Olympic, Knights); West African and Moroccan French structure with local words |
| Soviet-era names only on old clubs | Lokomotiv, Spartak, Torpedo, Dukla, Gwardia and the like are only given to clubs with a historic, giant, fallen or fan identity; Russia, Ukraine and Belarus have libraries of their own for this, apart from the Balkan one |
| No mixed cultures | A marker word (Real, Olympique, Eintracht, Dinamo, Al, Royal ...) is rejected in a nation whose language does not use it (`crossCulture` in `tools/namelib.mjs`) |
| No fantasy names | Words such as Dragonheart or Shadowfang are rejected in club names (`isFantasy`) |
| No single suffix style | No pattern may pass about a fifth of a nation's clubs ("Town" and "United" cannot take over a league) |
| Nicknames follow the name | A Colliery club are the Miners, an Ironworks side the Ironmen (`nameNick`) |
| Gulf and Arab clubs | A library of its own (Saudi Arabia, Qatar, the UAE, Iraq): Al + a concept (Al Fajr, Al Saqr, Al Wahat), with the town for the rest; the marker word Al is rejected in other nations |
| Basque and Catalan clubs | The two Spanish second-division clubs with a signing policy are named in their own languages: a Basque club (Arrasti Kirol Elkartea, the Urdinak) and a Catalan one (CE Serrallac, Els Blaus), with a ground to match; their players, and their club legends, draw on the Basque and Catalan name pools (about 80 first names and 70 surnames each) |
| Believable places | Town names follow each language's building blocks and are checked against real towns and clubs, rude words, hard consonant runs and length |
| Quirkier towns for smaller clubs | Small clubs sometimes get a prefix such as "North" or "Upper"; big clubs get short plain names |

The dashboard's Names tab also lists the nations the library can name but the game does not have yet (Russia, Ukraine, Belarus and others, marked "library only"); player names need a nation in the game. It flags any generated club name that mixes cultures or reads like fantasy, next to the existing
checks (rude, hard to say, too long, close to a real town or club).

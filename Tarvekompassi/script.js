function naytaSivu(id) {
  const sivut = document.querySelectorAll('.sivu');

  // Poista näkyvyys kaikilta sivuilta
  sivut.forEach(s => s.classList.remove('in'));

  // Näytä valittu sivu
  const sivu = document.getElementById(id);
  sivu.classList.add('in');

  // Siirrä näkymä sivun alkuun
  window.scrollTo({ top: 0, behavior: 'auto' });
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  // Käynnistä pieni viiveellä animaatio uudelle sivulle
  requestAnimationFrame(() => {
    sivu.classList.add('in');
  });
}
/*function naytaSivu(id){
  document.querySelectorAll('.sivu').forEach(s=>s.classList.remove('aktiivinen'));
  document.getElementById(id).classList.add('aktiivinen');


function naytaSivu(id) {
  const sivut = document.querySelectorAll('.sivu');

  // 1) Piilota kaikki sivut (poista .in, lisää .hidden)
  sivut.forEach(s => {
    s.classList.remove('in');
    s.classList.add('hidden');
  });

  // 2) Näytä haluttu sivu "ennen-asennossa"
  const sivu = document.getElementById(id);
  sivu.classList.remove('hidden');   // tulee näkyviin, mutta vielä opacity:0; translateY(24px)

  // 3) Scrollaa heti ylös (sekä body että html varmuuden vuoksi)
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  // 4) Käynnistä animaatio seuraavalla piirtokierroksella
  requestAnimationFrame(() => {
    sivu.classList.add('in');       // nyt transition animoi opacityn ja translateY:n
  });
}*/


// --- Lomakekysymykset ---
const kysymykset = [
  { id: "T1", teksti: "Elämäni tuntuu merkitykselliseltä" },
  { id: "T2", teksti: "Tunnen iloa ja hyvää mieltä arjessani" },
  { id: "T3", teksti: "Elämässäni on rakkautta" },
  { id: "T4", teksti: "Saan kosketusta haluamallani tavalla" },
  { id: "T5", teksti: "Tunnen innostusta ja inspiraatiota" },
  { id: "T6", teksti: "Minulla on mahdollisuus seikkailuihin ja uusiin kokemuksiin" },

  { id: "I1", teksti: "Minut hyväksytään sellaisena kuin olen" },
  { id: "I2", teksti: "Voin osallistua ja vaikuttaa minulle tärkeisiin asioihin" },
  { id: "I3", teksti: "Tunnen yhteenkuuluvuutta muiden kanssa" },
  { id: "I4", teksti: "Elämässäni on tilaa luovuudelle ja uusille ideoille" },
  { id: "I5", teksti: "Voin toimia ja tehdä valintoja omien tarpeideni mukaan" },
  { id: "I6", teksti: "Suhtaudun tulevaisuuteen toiveikkaasti" },

  { id: "V1", teksti: "Tulen kuulluksi ja ymmärretyksi ihmissuhteissani" },
  { id: "V2", teksti: "Voin luottaa läheisteni tukeen" },
  { id: "V3", teksti: "Tunnen myötätuntoa itseäni ja muita kohtaan" },
  { id: "V4", teksti: "Arjessani on asioita, joista voin olla kiitollinen" },
  { id: "V5", teksti: "Tunnen oloni arvostetuksi ihmissuhteissani" },
  { id: "V6", teksti: "Voin ilmaista itseäni vapaasti muiden seurassa" },

  { id: "M1",  teksti: "Tunnen arkeni turvalliseksi." },
  { id: "M2",  teksti: "Pystyn asettamaan hyvinvointiani tukevia rajoja" },
  { id: "M3",  teksti: "Päivissäni on selkeä rakenne ja ennakoitavuus" },
  { id: "M4",  teksti: "Arjessani on mahdollisuuksia rauhoittumiseen ja palautumiseen" },
  { id: "M5",  teksti: "Koen tasapainoa arkirutiinien ja vaihtelun välillä" },
  { id: "M6",  teksti: "Perustarpeeni (uni, ravinto, lepo) täyttyvät hyvin" },
  
];

const lomake = document.getElementById("lomake");
kysymykset.forEach((k,i)=>{
  const r=document.createElement('div');r.className='row';
  r.innerHTML=`<label>${i+1}. ${k.teksti}</label>
  <select id="${k.id}">
  <option value="" disabled selected>${k.teksti}</option>
  <option value="" disabled selected> </option>
  <option value="1">Ei pidä lainkaan paikkaansa</option>
  <option value="2">Pitää vähän paikkaansa</option>
  <option value="3">Pitää osittain paikkaansa</option>
  <option value="4">Pitää melko hyvin paikkaansa</option>
  <option value="5">Pitää täysin paikkaansa</option></select>`;
  lomake.appendChild(r);
});
document.querySelectorAll('#lomake select').forEach(sel=>{
  sel.addEventListener('change',()=>{
    document.getElementById('btnTulokset').disabled=!kysymykset.every(k=>document.getElementById(k.id).value!=="");
  });
});

// --- Laskenta + MAA-heikennys ---
function laskeTulokset(){
  let raw={T:0,I:0,V:0,M:0};
  kysymykset.forEach(k=>{
    const v=Number(document.getElementById(k.id).value)||0;
    raw[k.id[0]]+=v;
  });
  let T=raw.T,I=raw.I,V=raw.V,M=raw.M;
  const heikennys = {
    M1:{T:-0.05,I:-0.1,V:-0.25}, M2:{T:-0.05,I:-0.1,V:-0.2},
    M3:{T:-0.1,I:-0.2,V:-0.05},  M4:{T:-0.2,I:-0.05,V:-0.1},
    M5:{T:-0.1,I:-0.15,V:-0.05}, M6:{T:-0.25,I:-0.05,V:-0.1}
  };
  for(let k=1;k<=6;k++){
    const v = Number(document.getElementById("M"+k).value) || 0;
    if(v<=2){
      const p=heikennys["M"+k];
      T*=1+p.T; I*=1+p.I; V*=1+p.V;
    }
  }
  return {T,I,V,M};
}

// --- Tulosten näyttö ---
function naytaTulokset(){
  const {T,I,V,M}=laskeTulokset();
  const arr=[
    {nimi:"TULI",arvo:T},
    {nimi:"ILMA",arvo:I},
    {nimi:"VESI",arvo:V},
    {nimi:"MAA",arvo:M}
  ].sort((a,b)=>a.arvo-b.arvo);

  const heikoin=arr[0], tokHeikoin=arr[1], tokVahvin=arr[2], vahvin=arr[3];

  // Päivitä tekstit
  document.getElementById('lblN').textContent=heikoin.nimi;
  document.getElementById('lblE').textContent=tokHeikoin.nimi;
  document.getElementById('lblW').textContent=tokVahvin.nimi;
  document.getElementById('lblS').textContent=vahvin.nimi;

  // Laske kallistus
  const diff=Math.abs(tokHeikoin.arvo-heikoin.arvo);
  let tilt=0;
  if(diff===0) tilt=45;
  else if(diff<=2) tilt=45*((5-diff)/10);
  else tilt=0;

  document.getElementById('dial').setAttribute('transform',`rotate(${tilt},100,100)`);

  // --- Sanalliset kuvaukset osa-alueittain ---
const kuvaukset = {
  TULI: {
    low: "Elämän kipinä on hiipunut. Saatat kokea, että arki tuntuu harmaalta ja inspiraatio on kadoksissa. Yhteys iloon, intoon tai rakkauteen saattaa olla heikentynyt ja mieli voi kaivata suuntaa tai merkitystä. Tuli vahvistuu, kun annat itsellesi luvan innostua ja tavoitella asioita, jotka saavat sydämesi sykkimään. Aloita pienistä teoista. Tee jotakin, mikä herättää uteliaisuutesi, liikuttaa kehoasi tai saa sinut hymyilemään.",
    mid: "Sisäinen liekkisi palaa tasaisesti. Sinulla on kyky toimia ja tavoitella  sinulle tärkeitä asioita, mutta toisinaan arjen velvoitteet tai suorittaminen voivat himmentää elinvoimaa. Innostus syttyy uudelleen, kun pysähdyt kysymään, mikä juuri nyt tuo sinulle iloa ja merkitystä. Pidä huolta siitä, että elämässäsi on tilaa sekä toiminnalle että palautumiselle.",
    high: "Olet täynnä elinvoimaa, intoa ja luomisenergiaa. Kykenet seuraamaan sydämesi suuntaa ja tuomaan merkityksellisyyttä sekä omaan että muiden elämään. Sinussa on lämmintä karismaa ja kyky innostaa muita. Muista kuitenkin, että tuli tarvitsee tuekseen lepoa, maadoittumista ja yhteyttä tunteisiin. Näin liekkisi pysyy kestävänä ja kantaa myös vaikeampien aikojen yli."
  },
  ILMA: {
    low: "Koet ehkä, että tilaa olla oma itsesi on rajallisesti. Saatat pidätellä mielipiteitäsi tai kokea, ettei oma äänesi tule kuulluksi. Toisinaan voi olla vaikea nähdä vaihtoehtoja tai löytää uutta näkökulmaa, kun mieli tuntuu lukkiutuneelta. Ilmaa voi lisätä sallimalla erilaisuutta ja näkökulmien vaihtoa ilman tarvetta puolustautua tai vastustaa. Kysy itseltäsi: missä ja kenen kanssa voisin hengittää vapaammin ja tulla näkyväksi sellaisena kuin olen?",
    mid: "Elämässäsi on tilaa omille ajatuksille ja vaikutusmahdollisuuksille, mutta ajoittain arki tai pelko muiden reaktioista voi kaventaa ilmaisua. Tunnistat kuitenkin kykysi vaikuttaa ja halusi osallistua. Harjoittele tuomaan esiin se, mikä on sinulle merkityksellistä ja sano ääneen ajatuksia, jotka ansaitsevat tulla kuulluiksi.",
    high: "Olet luova, itsenäinen ja näkemyksellinen. Ajattelusi on joustavaa ja oivaltavaa, ja osaat ilmaista itseäsi vapaasti eri tilanteissa. Tunnet kuuluvasi yhteisöihin, joissa äänesi tulee kuulluksi ja arvostetuksi. Muista kuitenkin, että todellinen vuorovaikutus on vastavuoroista, sillä  joskus suurin viisaus löytyy kuuntelemisen taidosta."
  },
  VESI: {
    low: "Yhteyden kokemus on hauras. Saatat jäädä yksin tunteidesi kanssa tai kokea, ettei sinua täysin nähdä, kuulla tai ymmärretä. Myötätunto itseä kohtaan voi jäädä heikoksi ja kiitollisuuden tunne saattaa kadota arjen kiireen alle. Kun veden elementti on vähissä, ihminen usein alkaa kontrolloimaan tunteitaan tai etääntymään muista. Veden lisääminen alkaa hyväksynnästä ja sallimisesta: anna itsellesi lupa tuntea. Luo arkeen hetkiä, joissa pysähdyt hengittämään, kirjoittamaan tai vain olemaan. Yhteys vahvistuu, kun uskallat näyttää omat tarpeesi ja pyytää apua silloin, kun et jaksa yksin.",
    mid: "Ihmissuhteesi tuovat tukea, lämpöä ja merkityksellisyyttä. Osaat olla läsnä tunteillesi ja toisten kokemuksille, vaikka toisinaan yhteys voi hetkellisesti horjua. Ehkä vetäydyt, kun kaipaisit lohtua, tai kuuntelet muita enemmän kuin itseäsi. Tällaiset hetkelliset epätasapainot kuuluvat inhimillisyyteen. Harjoittele tasapainoa antamisen ja vastaanottamisen välillä. Kun pidät huolta omasta sisäisestä tilastasi, voit kohdata toisen aidosti ja myötätuntoisesti ilman, että kadotat yhteyttä itseesi.",
    high: "Olet syvästi yhteydessä itseesi ja muihin. Tunnet empatiaa, lämpöä ja kykyä myötäelää toisen todellisuutta. Luotat ihmissuhteisiisi ja osaat ilmaista tunteitasi avoimesti ja rakentavasti. Tämä on vahva emotionaalinen resurssi, joka kannattelee sekä sinua että ympärilläsi olevia. Huolehdi kuitenkin omista rajoistasi ja palautumisestasi, sillä myös myötätunto tarvitsee selkeät rajat ja riittävästi lepoa, jotta se voi säilyä elinvoimaisena."
  },
  MAA: {
    low: "Arjen perusta on nyt hauras. Saatat kokea turvattomuutta, levottomuutta tai vaikeutta ylläpitää rutiineja, jotka tukevat hyvinvointiasi. Rajojen asettaminen voi tuntua uuvuttavalta tai päivien rytmi vaihdella liikaa, jolloin keho ja mieli eivät ehdi palautua. Kun perusta horjuu, ihminen usein yrittää selvitä liiallisella sinnikkyydellä, vaikka todellinen tuki syntyy levosta ja huolenpidosta. Nyt olisi tärkeää pysähtyä rakentamaan pieniä, konkreettisia tukipilareita arkeen: lepo, ravinto, rytmi ja rajat luovat turvaa, josta kaikki muu kasvu kumpuaa.",
    mid: "Arkesi on melko vakaata ja perustarpeesi täyttyvät pääosin hyvin. Joskus kuitenkin stressi, ylikuormitus tai toisten tarpeet voivat mennä oman hyvinvointisi edelle. Huolehdi siitä, että palautumiselle jää riittävästi tilaa ja että rajasi pysyvät joustavina mutta tunnistettavina. Säännöllinen pysähtyminen, luontoyhteys ja kehollinen kuuntelu vahvistavat yhteyttä maahan ja lisäävät turvallisuuden tunnetta.",
    high: "Olet rakentanut elämällesi tukevan ja kestävän perustan. Arki on rytmittynyt, rajoja kunnioitetaan ja perustarpeesi saavat tulla nähdyiksi. Turvallisuuden tunne kannattelee sinua myös muutoksissa. Muista kuitenkin, että liiallinen kontrolli tai täydellisyyden tavoittelu voi jäykistää maata liikaa. Elävä maa tarvitsee myös vettä ja ilmaa, eli ravinteita, pysyäkseen hedelmällisenä ja elinvoimaisena."
  }
};

// --- Näytä tulokset ---
const tuloslista = document.getElementById("tuloslista");
tuloslista.innerHTML = "";

arr.forEach(o => {
  const div = document.createElement("div");
  div.className = "tulos";
  
  // määritä taso ja teksti
  const taso = o.arvo <= 14 ? "low" : (o.arvo <= 21 ? "mid" : "high");
  const tasonNimi = taso === "low" ? "Matala" : (taso === "mid" ? "Keskitaso" : "Korkea");
  const kuvaus = kuvaukset[o.nimi][taso];

  div.innerHTML = `
    <strong>${o.nimi}</strong><br>
    <span>${o.arvo.toFixed(1)} <span class="badge ${taso}">${tasonNimi}</span></span><br>
    <small>${kuvaus}</small>
  `;
  
  tuloslista.appendChild(div);
});

  naytaSivu('sivu2');
}

// --- Yhteenveto ---
function naytaYhteenveto() {
  const { T, I, V, M } = laskeTulokset();
  const arr = [
    { nimi: "TULI", arvo: T },
    { nimi: "ILMA", arvo: I },
    { nimi: "VESI", arvo: V },
    { nimi: "MAA", arvo: M }
  ].sort((a,b) => a.arvo - b.arvo);

  const yhteenveto = document.getElementById("yhteenveto");
  const heikoin = arr[0];
  const vahvin = arr[arr.length - 1];
  const min = heikoin.arvo;
  const max = vahvin.arvo;

  // Tarkista onko kaikki osa-alueet tasapainossa
  const tasapainossa = (max - min) <= 2 && arr.every(o => o.arvo >= 15);

  // --- Tekstipankki heikko elementti ---
  const yhteenvetoHeikko = {
    TULI: "- kun sisäinen voimasi on hiipunut<br><br>Kun tuli on matalin elementtisi, sisäinen kipinä on hiipunut. Elämä voi tuntua velvollisuuksien täyttämältä, ja ilo tai merkityksellisyys ovat jääneet taka-alalle. Ehkä olet antanut paljon muille, mutta unohtanut ruokkia omaa liekkiäsi. Tämä voi näkyä uupumuksena, turhautumisena tai kokemuksena, että mikään ei tunnu oikein miltään.<br><br><br>Mikä voisi auttaa?<br><br>Tuli syttyy tekemällä asioita, jotka herättävät eloa ja iloa. Innostus, leikki, kosketus, musiikki, liike tai luonto voivat toimia polttoaineena elinvoimalle. Tuli tarvitsee sekä rohkeutta että hoivaa, yhtä paljon toimintaa kuin lepoa. Sisäinen liekkisi ei ole kadonnut; se odottaa, että annat sille tilaa ja happea. Salli itsesi innostua uudelleen, vaikka pienestäkin asiasta.<br><brReflektio- ja työskentelykysymykset<br><br>Mikä saa minut aidosti innostumaan ja syttymään eloon?<br><br>Mitä olen jättänyt tekemättä, koska olen pelännyt epäonnistumista tai avostelua?<br><br> Miten voisin tuoda tänään pienen annoksen iloa arkeeni?<br><br> Harjoitus<br><br>Kipinäharjoitus:<br>Valitse tänään yksi asia, joka herättää sinussa pienenkin elon tunteen: musiikki, liike, luonto, keskustelu tai luova hetki. Tee se ilman suorituspainetta. Huomaa, mitä tunteissasi ja kehossasi tapahtuu, kun annat kipinän syttyä.<br><br>",
    ILMA: "- kun vapaus on kadoksissa<br><br>Kun ilma on matalin elementtisi, saatat kokea, että itseilmaisusi on heikentynyt tai että sinulla ei ole tilaa vaikuttaa. Luovuus ja toiveikkuus voivat tuntua etäisiltä, ja mieli voi jäädä pyörimään tuttujen ajatusten kehään. Tämä voi kaventaa näkökulmia ja herättää kokemuksen siitä, ettei elämässä ole valinnan mahdollisuuksia tai vapautta. <br><br>Mikä voisi auttaa? <br><br>Ilma tarvitsee liikettä ja vaihtelua. Uusi näkökulma, avoin keskustelu tai pieni luova teko voivat tuoda keveyttä mieleen. Anna itsellesi lupa kysyä, ihmetellä ja kokeilla uutta. Vapaus ei synny virheettömyydestä, vaan hyväksynnästä ja uskalluksesta olla keskeneräinen. On täysin sallittua vaihtaa mielipidettä, epäonnistua ja aloittaa alusta. <br><br>Reflektio- ja työskentelykysymykset<br><br>Missä kohdassa kaipaan enemmän tilaa olla oma itseni? <br><br>Mitä sanoja tai ajatuksia olen pidätellyt liian kauan? <br><br>Mikä pieni teko tänään voisi tuoda lisää vapautta tai vaihtelua elämääni? <br><br>Harjoitus<br><br>Vapaa kirjoittaminen: <br>Kirjoita 5 minuutin ajan ilman taukoja aiheesta: “Jos voisin sanoa ääneen kaiken, mitä sisälläni on...”. Älä sensuroi. Kun olet valmis, lue teksti rauhassa ja huomaa, mitä ajatuksesi yrittävät kertoa sinulle. Kiitä itseäsi siitä, että annoit sisäiselle äänellesi tilaa. <br><br>",
    VESI: "- kun yhteys on heikko<br><br>Kun veden elementti on matala, yhteys tunteisiin tai muihin ihmisiin voi tuntua etäiseltä. Saatat pärjätä liikaa omin voimin, vähätellä omia tarpeitasi tai pelätä, että jos avaudut, tulet hylätyksi tai väärinymmärretyksi. Tämä voi johtaa tunne-elämän kaventumiseen ja kokemukseen yksinäisyydestä myös muiden seurassa. <br><br>Mikä voisi auttaa? <br><br>Yhteyden rakentaminen alkaa sisältäpäin. Kun uskallat olla rehellinen tunteillesi, annat myös muille mahdollisuuden tulla lähemmäksi. Pienet hetket myötätuntoa itseä, muita ja elämää kohtaan, voivat palauttaa heikentyneen yhteyden. Tunteiden ei tarvitse tulla hallituksi vaan kohdatuiksi ja hyväksytyiksi. Vesi löytää aina tiensä, kun sille antaa luvan virrata. <br><br>Reflektio- ja työskentelykysymykset<br><br>Milloin viimeksi tulin aidosti kuulluksi ja nähdyksi? <br><br>Mitä tunteita olen viime aikoina vältellyt ja miksi? <br><br>Millä konkreettisella teolla voisin tänään kohdella itseäni lempeämmin? <br><br>Harjoitus<br><br>Myötätuntokirje itselle: <br>Kirjoita itsellesi kirje kuin kirjoittaisit läheiselle, joka tarvitsee lohtua ja myötätuntoa. Kirjoita ne sanat, joita toivoisit jonkun sanovan sinulle. Lue kirje ääneen ja huomaa, miltä kehossasi ja mielessäsi tuntuu. <br><br>",
    MAA: "- kun perusturva on matala<br><br>Kun maa on heikoin elementtisi, elämä voi tuntua epävakaalta tai vaikeasti hallittavalta. Turvallisuuden tunne, rytmi ja lepo ovat nyt keskiössä. Saatat olla elänyt pitkään suorittaen, muiden tarpeiden varassa tai jatkuvassa valppaudessa, jolloin keho ei ole saanut riittävästi lepoa ja palautumista. Kun yhteys maahan heikkenee, myös kehon ja mielen välinen yhteys voi hämärtyä. <br><br>Mikä voisi auttaa? <br><br>Palaa perusasioihin. Luo kehoon ja arkeen turvaa askel kerrallaan . Säännöllinen uni, ravitseva ruoka, lempeä liikunta ja lepo ovat nyt tärkeimpiä. Turva ei synny täydellisestä hallinnasta vaan siitä, että annat kehollesi luvan levätä ja luot ympäristöösi ennakoitavuutta. Turvallisuus on se maa, jolle sisäinen kasvu voi juurtua ja rakentua kestävästi. <br><br>Reflektio- ja työskentelykysymykset<br><br>Mitkä kolme asiaa arjessani saavat minut tuntemaan oloni turvalliseksi? <br><br>Miten voisin vahvistaa lepoa ja palautumista arjessani? <br><br>Miten voisin lisätä yhteyttä kehooni ja luoda keholle kokemuksen turvasta? <br><br>Harjoitus<br><br>Maadoittumisen minuutti: <br>Seiso paljain jaloin lattialla tai ulkona maassa. Hengitä syvään ja tunne paino jalkapohjissa. Sano mielessäsi: “Olen tässä. Olen turvassa.” Huomaa, miten kehosi ja hengityksesi vähitellen rauhoittuvat. <br><br>",
  };
     // --- Tekstipankki (tasapainoisempi tilanne) ---
  const yhteenvetoKeskitaso = {
    TULI: "Tuli-elementti on edelleen heikoin, mutta tasapainossa muiden kanssa. Tämä kertoo hyvästä elinvoimasta ja sisäisestä motivaatiosta. Pidä huolta palautumisesta, jotta energia pysyy yllä.",
    ILMA: "Ilma-elementti on kevyesti heikoin, mutta kokonaisuus on tasapainoinen. Viestintä ja ideointi toimivat, ja pystyt ilmaisemaan itseäsi vapaasti – hienoa!",
    VESI: "Vesi-elementti on hieman muita matalampi, mutta tunneyhteys on silti vahva. Jatka yhteyden ja myötätunnon ylläpitämistä, se on voimavarasi.",
    MAA: "Maa-elementti on hieman muita matalampi, mutta kokonaisuus on hallinnassa. Hyvät rutiinit ja turvantunne tukevat jaksamista – jatka samaan malliin."
  };
    // --- Teksti tasapainoiselle tilanteelle ---
  const yhteenvetoTasapaino ="KUN KAIKKI NELJÄ ELEMENTTIÄ OVAT TASAPAINOSSA<br><br>Kun maa, vesi, ilma ja tuli ovat tasapainossa, elämä tuntuu virtaavalta ja eheältä. Tunnet turvaa maassa, yhteyttä vedessä, vapautta ilmassa ja merkitystä tulessa. Tällöin toimit omassa rytmissäsi, et kiirehdi etkä pysähdy liikaa, vaan liikut luonnollisesti elämän mukana. Tasapaino ei tarkoita täydellisyyttä vaan kykyä palautua ja säilyttää yhteys itseesi myös muutoksen keskellä. <br><br>Ohjenuora<br><br>Nauti tästä hetkestä. Tasapaino kertoo, että olet yhteydessä itseesi ja toisiin monella tasolla: kehomieleen, tunteisiin ja toisiin ihmisiin. Jatka vaalimalla näitä yhteyksiä pienillä arjen teoilla, jotka pitävät sinut yhteydessä itseen, toisiin ja ympäröivään maailmaan.  <br><br>Reflektio- ja työskentelykysymykset<br><br>Mikä on mahdollistanut tasapainon tunteen elämässäni? <br><br>Mikä elementeistä vahvistuu minussa luonnostaan ja mikä kaipaa tukea eri elämänvaiheissa? <br><br>Voinko säilyttää tasapainon kokemuksen, vaikka ympärilläni olisi epävakautta tai huolia? <br><br>Harjoitus: <br><br>Neljä elementtiä päivän tarkistus: <br><br><br>Pysähdy illalla hetkeksi ja kysy itseltäsi: <br>– Sainko tänään turvaa (maa)? <br>– Tunsinko yhteyttä ja myötätuntoa (vesi)? <br>– Löytyikö tilaa ajatuksille ja vapaudelle (ilma)? <br>– Tunsinko elinvoimaa ja merkityksellisyyttä (tuli)? <br><br><br>Huomaa, mikä elementti jäi vähälle ja päätä antaa sille huomiota seuraavana päivänä. Pienikin tietoinen teko ylläpitää sisäistä tasapainoa ja yhteyttä itseesi. <br><br>"
  ;

// --- Näytettävän tekstin valinta ---
  let teksti;
  if (tasapainossa) {
    teksti = yhteenvetoTasapaino;
  } else if (heikoin.arvo < 15) {
    teksti = yhteenvetoHeikko[heikoin.nimi];
  } else {
    teksti = yhteenvetoKeskitaso[heikoin.nimi];
  }

  // --- Tulostus ---
  yhteenveto.innerHTML = `
    <div class="tuloskentta">
      <strong>Heikoin elementti: ${heikoin.nimi}</strong><br><br>
      ${teksti.replace(/\n/g, "<br>")}
    </div>`;

  naytaSivu('sivu3');
}
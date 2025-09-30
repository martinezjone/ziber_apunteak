# Web Hacking-erako sarrera

## Walking An Application

Ikusiko dugu web aplikazio bat eskuz nola aztertu segurtasun arazoak aurkitzeko, nabigatzailearen tresna integratuak soilik erabiliz. Gehienetan, segurtasun tresna automatizatuek eta scriptek ahultasun potentzial eta informazio erabilgarri asko galduko dituzte.

Hona hemen gela osoan zehar erabiliko dituzun nabigatzailearen tresna integratuen laburpen labur bat:

- **Iturria ikusi (View Source)**: Nabigatzailea erabili webgune baten giza irakurgarria den iturburu-kodea ikusteko.
- **Ikuskatzailea (Inspector)**: Orrialdeko elementuak nola aztertu eta aldaketak nola egin ikasi, normalean blokeatutako edukia ikusteko.
- **Araztailea (Debugger)**: Orrialde baten JavaScript-aren fluxua aztertu eta kontrolatu.
- **Sarea (Network)**: Orrialde batek egiten dituen sare-eskaera guztiak ikusi.

## Exploring The Website

Penetrazio probatzaile gisa, zure rola webgune edo web aplikazio bat aztertzean da ahulak izan daitezkeen ezaugarriak aurkitzea eta horiek ustiatzen saiatzea ahulak diren ala ez ebaluatzeko. Ezaugarri hauek normalean webgunearen erabiltzailearekin elkarrekintzaren bat eskatzen duten zatiak izaten dira. Webgunearen zati interaktiboak aurkitzea hain erraza izan daiteke login formulario bat ikustea bezain erraza, edota webgunearen JavaScript-a eskuz aztertzea bezain konplexua.
Hasteko leku bikaina da nabigatzailearekin webgunea esploratzea eta orrialde/area/ezaugarri indibidualak ohar hartzea, bakoitzaren laburpen batekin.
Acme IT Support webgunearen azterketa adibide bat honelakoa izango litzateke:


## Orriaren iturburua ikustea

Webgune bat bisitatzen dugunean, gure nabigatzaileak eskaera bat egiten dio zerbitzariari, eta horrek **kode bat** itzultzen du: hau da page source edo **orrialdearen iturburua**. Kode horrek adierazten dio nabigatzaileari zer eduki erakutsi, nola aurkeztu eta nola jokatu behar duen.
Iturburuko kodean **HTML, CSS eta JavaScript** izaten dira:

    - **HTML** edukia eta egitura adierazteko.
    - **CSS** itxura definitzeko (koloreak, letra-tamaina…).
    - **JavaScript** funtzionaltasun interaktiboak gehitzeko.


Orrialdearen iturburua begiratzea oso erabilgarria izan daiteke webgune bati buruzko **informazio gehiago** jasotzeko, batez ere segurtasunari buruzko ikuspuntutik.


### Nola ikusten dut orriaren iturburua?

Page source-a ikusteko modu hauek daude:

    - Webgune baten gainean saguaren eskuin botoiaz klik eginda, "Ikusi orriaren iturburua" (edo antzeko) aukera agertzen da.
    - Nabigatzaileko URLa honela alda daiteke:
 view-source:https://www.adibidea.com
    - Nabigatzailearen menuan, "Developer tools" edo "Tresna gehiago" izeneko ataletan ere aurki daiteke aukera hau.


### Ikus dezagun jatorrizko orrialderen bat?

Page source-a ikusita, hainbat elementu interesgarri aurki ditzakegu:

    - Iruzkinak (<!-- ... -->): programatzaileek kodean uzten dituzten oharrak dira. Ez dira orrian agertzen, baina pistak eman ditzakete (adib. orri bat behin-behinekoa dela esatea).
    - Estekak (<a href="...">): orriko beste atal edo orrialdeetara eramaten gaituzten loturak dira. Batzuetan, ezkutuko estekak ere aurki daitezke.
    - Kanpoko fitxategiak (CSS, JS, irudiak...): HTMLn bidez lotuta egoten dira. Batzuetan, direktorio osoa ikusgai egoten da konfigurazio akatsengatik.
    - Frameworkaren aipamenak: Webgunea framework batekin egina badago, kodean bere izena eta bertsioa ager daitezke. Bertsio zaharra bada, segurtasun arriskuak egon daitezke.

## Garatzaile Tresnak (Developers Tools)

### 1. Inspektorea

Web-orrian une horretan agertzen denaren “argazki bizia” erakusten du.
Orriko iturburu-kodea (HTML) beti ez da berdina, CSS edo JavaScript-ek alda dezakeelako. Inspektoreak benetan zer ikusten ari garen erakusten digu.
Elementuak zuzenean alda ditzakezu: testua, koloreak, tamainak… horrela, akatsak errazago aurkitzen eta konpontzen dira.


### 2. Debugger
Orriko JavaScript kodeari pausoz pauso jarraitzeko balioko digu.

“Breakpoint”-ak jartzen dira, hau da, kodea geldi dadin nahi dugun puntuan.
Horri esker, aldagaiak eta funtzio-deien emaitzak une berean ikus ditzakegu, eta ulertu zergatik gertatzen diren akatsak.

Garatzaileen tresnetako panel hau JavaScript arazteko pentsatuta dago, eta berriro ere ezaugarri bikaina da zerbait zergatik ez dabilen funtzionatzen landu nahi duten web garatzaileentzat. Baina sartze-probatzaile gisa, JavaScript kodean sakontzeko aukera ematen digu. Firefox eta Safari nabigatzaileetan ezaugarri honek Debugger du izena, baina Google Chrome nabigatzailean Sources du izena.

Laburbilduz, breakpointak menderatzeak bezero-kodearen exekuzioa erabat kontrolatzen du:

- Irakurketa: barne aldagaiak eta funtzio “pribatuak” ikusten dituzu.
- Aldaketa: balio berriak injektatzen dituzu edo funtzionalitateak mozten dituzten kodearen adarrak saihesten dituzu.
- Birbidaltzea: harrapaketak eta irteerako eskaerak aldatzea.

Hori guztia, segurtasun-ikuskaritzei, pentestei edo arazketa sinpleari aplikatuta, logika-ahultasunak aurkitzeko, sarbide-kontrolak ez egiteko edo garatzaileak zuzenean azaldu nahi izan ez zituen datu sentikorrak aurkitzeko aukera ematen du.


### 3. Network
Garatzailearen tresnen sare-fitxa web orri batek egiten duen kanpoko eskaera bakoitzaren jarraipena egiteko erabil daiteke. Sarea fitxan klik egin eta gero orria freskatzen baduzu, orria eskatzen ari den fitxategi guztiak ikusiko dituzu.


## Edukien Aurkikuntza

### Zer da edukien aurkikuntza?
Lehenik eta behin, galdetu behar dugu, web aplikazioen segurtasunaren testuinguruan, zer da edukia? Edukia gauza asko izan daiteke, fitxategi bat, bideoa, irudia, segurtasun-kopia, webgunearen eginbidea. Edukien aurkikuntzaz hitz egiten dugunean, ez gara webgune batean ikus ditzakegun gauza nabariez ari; berehala aurkezten ez zaizkigun eta beti sarbide publikora bideratuta ez zeuden gauzez ari gara.

Eduki hori izan liteke, adibidez, langileen erabilerarako orriak edo atariak, webgunearen bertsio zaharragoak, babeskopia-fitxategiak, konfigurazio-fitxategiak, administrazio-panelak, etab.
Edukiak ezagutzeko hiru modu nagusi daude landuko dugun webgune batean: Eskuz, automatizatua eta OSINT (Open-Source Intelligence).

### Robots.txt
`robots.txt` fitxategia bilatzaileei zein orri diren eta bilatzaileen emaitzetan erakusteko baimenik ez duten edo bilatzaile zehatzei webgunea guztiz arakatzea debekatzen dien dokumentua da. Ohikoa izan daiteke web gune jakin batzuk mugatzea bilatzaileen emaitzetan ez bistaratzeko. Orrialde hauek administrazio atariak edo webgunearen bezeroentzako fitxategiak izan daitezke.
Fitxategi honek webguneko kokapenen zerrenda handia ematen digu, jabeek sartze-probatzaile gisa aurkitzerik nahi ez dutena.


### Favicon
Favicon nabigatzaileko helbide-barran edo fitxan agertzen den ikono txiki bat da, webgune bat markatzeko erabiltzen dena.

Batzuetan, webgune bat eraikitzeko markoak erabiltzen direnean, instalazioaren parte den favicon bat soberan geratzen da, eta webgunearen garatzaileak hau pertsonalizatutako beste batekin ordezkatzen ez badu, horrek pista bat eman diezaguke erabiltzen ari den markoari buruz. OWASPek esparru-ikono komunen datu-base bat ostatatzen du, helburuen favicon-arekin <a href="https://wiki.owasp.org/index.php/OWASP_favicon_database">OWASP_favicon_database</a>. Alderatzeko erabil dezakezuna. Behin esparru-pila ezagututa, kanpoko baliabideak erabil ditzakegu hari buruz gehiago jakiteko.
Eguneratuago dago beste webgune hau: <a href="https://owasp.org/www-community/favicons_database">OWASP_favicon_database</a> 

### Sitemap.xml
`robots.txt` fitxategiak ez bezala, bilaketa-motorreko arakatzaileek ikus dezaketena murrizten baitu, `sitemap.xml` fitxategiak webgunearen jabeak bilatzaile batean zerrendatzea nahi duen fitxategi bakoitzaren zerrenda ematen du. 
Horiek, batzuetan, nabigatzeko zailxeagoak diren webguneko eremuak izan ditzakete, edo baita uneko guneak jada erabiltzen ez dituen baina eszenen atzean lanean jarraitzen duten web orri zahar batzuk zerrendatzea ere.


## HTTP Goiburuak

Web-zerbitzariari eskaerak egiten dizkiogunean, zerbitzariak hainbat HTTP goiburu itzultzen ditu. Goiburu horiek, batzuetan, informazio erabilgarria izan dezakete, hala nola webzerbitzariaren softwarea eta, agian, erabiltzen ari den programazio-/script-lengoaia. 

Beheko adibidean, webzerbitzaria NGINX 1.18.0 bertsioa da eta PHP 7.4.3 bertsioa exekutatzen du. Informazio hori erabiliz, erabiltzen ari diren softwarearen bertsio ahulak aurki genitzake.

Saiatu beheko <a href="https://www.hostinger.com/es/tutoriales/comando-curl">curl komandoa</a> web zerbitzariaren aurka exekutatzen, non -v kommutadoreak verbose modua gaitzen duen, goiburuak aterako dituena (zerbait interesgarria egon daiteke! ).

### Framework Stack

Webgune baten markoa ezarri ondoren, bai aurreko favicon adibidearekin edo orriaren iturburuan pistak bilatuz, hala nola iruzkinak, copyright oharrak edo kredituak, ondoren webgunearen framework-a aurki dezakezu. 
Hortik aurrera, softwareari eta beste informazio batzuei buruz gehiago ikasi ahal izango dugu, agian aurkitu dezakegun eduki gehiagora eramanez.


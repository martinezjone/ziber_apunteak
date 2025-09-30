# 1.2 Webaren funtzionamenduaren oinarriak

## Sarrera

Webguneen funtzionamendua ulertzea ezinbestekoa da zibersegurtasunaren ikuspegitik. Atal honetan, webguneek nola funtzionatzen duten azalduko dugu, haien osagai nagusiak eta haien arteko komunikazioa.

## Webgune batek nola funtzionatzen duen

### DNS (Domain Name System)

Webgune bat funtzionatzeko hainbat osagai eta prozesu automatizatu elkarlanean aritzen dira. Lehenik, DNS sistema erabiltzen da domeinu bat (adib. google.com) IP helbide batera itzultzeko. Domeinuek hierarkia bat jarraitzen dute (azpidomeinuak, bigarren mailako domeinuak, TLD-ak), eta DNS erregistro ezberdinak (A, AAAA, CNAME, MX, TXT…) informazio mota desberdinak eskaintzen dituzte.

![DNS](images/dns1.png)

**DNS eskaera bat egiterakoan**, lehenik cachea begiratzen da; ondoren, ISParen DNS zerbitzaria, erro zerbitzariak, TLD zerbitzariak eta autoritatezko zerbitzariak aktibatzen dira IP helbidea lortu arte. Eskaeraren erantzunak TTL (Time To Live) du, cachean zenbat denboraz gorde behar den zehazteko.

![DNS](images/dns2.png)

```
    1. Urratsa: Zure Ordenagailua
    Lehenik bere cache lokalean begiratzen du.  Baliteke duela gutxi webgune hori bisitatu izana eta IP helbidea oroitzea.
    Emaitza:
    ✅ Aurkitzen badu: Zuzenean konektatzen da
    ❌ Ez badu aurkitzen: Hurrengo urratsera pasatzen da


    2. Urratsa: Rekurtsiboko DNS Zerbitzaria
    Zure Internet hornitzaileak (ISP) ematen duen zerbitzaria (edo zuk aukeratutako bat).
    Berak ere bere cache lokalean begiratzen du.
    Adibidez, Google, Facebook, Twitter bezalako webgune ospetsuak maiz bilatu ohi dira, beraz seguruenik hemen aurkituko ditu.
    Emaitza:
    ✅ Aurkitzen badu: Itzultzen dio zure ordenagailuari
    ❌ Ez badu aurkitzen: Interneten erro-zerbitzarietara joaten da


    3. Urratsa: Erro-zerbitzariak (Root DNS)
    Interneten "bizkarrezurra" dira hauek . TLD (.com, .org, .es...) begiratzen dute eta egokiko TLD zerbitzarira bidaltzen zaituzte.
    Gure adibidean: www.tryhackme.com-en .com ikusten dute eta .com TLD zerbitzarira bidaltzen zaituzte.

    4. Urratsa: TLD Zerbitzaria
    Domeinuaren autoritatezko zerbitzaria non dagoen esaten du.
    Adibidez, tryhackme.com domeinuaren autoritatezko zerbitzariak dira:
    kip.ns.cloudflare.com
    uma.ns.cloudflare.com

    Bi egoten dira, bat hondatzen bada, bestea erabiltzeko (babeskopia).

    5. Urratsa: Autoritatezko DNS Zerbitzaria
    Domeinu horren DNS erregistro guztiak gordetzen dituen zerbitzaria.
    Zer egiten du?
    Behar den IP helbidea bilatzen du (A erregistroa)
    Itzultzen du Rekurtsiboko DNS zerbitzarira
    Rekurtsibokoak bere cache-an gordetzen du etorkizuneko eskaeretarako
    Azkenean zure ordenagailuari bidaltzen dio
```

### HTTP xehetasunez

IP helbidea lortuta, HTTP edo HTTPS bidezko eskaera egiten da zerbitzarira. 

Web zerbitzariekin komunikatzeko eta webguneetako datuak transmititzeko arau multzoa da. 

Mota askotako datuak trasmititu ditzake: 

- HTML (webgunearen edukia)
- Irudiak (JPG, PNG, GIF...)
- Bideoak (MP4, AVI...)
- Bestelako fitxategiak (PDF, dokumentuak...)


HTTPS bertsioa segurua da eta komunikazioa zifratzen du. 

HTTP eskaerek goiburuak daramatzate (Host, User-Agent, Cookie...), eta zerbitzariak HTTP erantzuna itzultzen du: egoera kode batekin (200, 404, 500...) eta eduki batekin (HTML, JSON, irudiak...).


**URL** egitura honek hainbat atal ditu: protokoloa, erabiltzailea, ostalaria, ataka, bidea, parametroak eta fragmentua. Eskaeraren arabera, zerbitzariak baliabide jakin bat itzultzen du.


  Adibide hau hartzen badugu: <http://user:password@tryhackme.com:80/view-room?id=1#task3>

  ![URL](images/url1.png)

  - **Scheme (Eskema)**: http zatia da erabili beharreko protokoloa adierazten duena. HTTP, HTTPS edo FTP izan daiteke adibidez.
  - **User (Erabiltzailea)**: user:password zatia da sarbidea behar duten zerbitzuetarako erabiltzaile-izena eta pasahitza. Gaur egun ez da asko erabiltzen ez delako segurua.
  - **Host (Ostalaria)**: tryhackme.com zatia da zerbitzariaren domeinu-izena edo IP helbidea. google.com edo 192.168.1.1 bezalako zerbait izan daiteke.
  - **Port (Ataka)**: 80 zatia da zerbitzariaren ataka zenbakia. HTTP-rentzat 80 da lehenetsita, eta HTTPS-rentzat 443. Edozein zenbaki izan daiteke 1etik 65535era.
  - **Path (Bidea)**: /view-room zatia da nahi dugun fitxategiaren edo orriaren kokapena. /blog edo /images/photo.jpg bezalako zerbait izan daiteke.
  - **Query String (Kontsulta katea)**: ?id=1 zatia da informazio gehigarria bidaltzeko. /blog?id=1&category=tech adibidez.
  - **Fragment (Zatia)**: #task3 zatia da orriaren zati zehatz batera joateko. Orri luze batean sekzioa jakin batera salto egiteko erabiltzen da.

####HTTP Metodoak

HTTP metodoak bezeroari bere asmoa adierazteko modu bat dira HTTP eskaera bat egiterakoan. HTTP metodo asko daude, baina ohikoenak azalduko ditugu, nahiz eta gehienetan GET eta POST metodoekin lan egingo duzun.

- **GET Eskaera**
Web zerbitzari batetik informazioa lortzeko erabiltzen da. Adibidez, web orri bat ikusteko edo datu batzuk eskuratzeko.

- **POST Eskaera**
Web zerbitzarira datuak bidaltzeko eta, litekeena da, erregistro berriak sortzeko erabiltzen da. Formulario bat betetzean, adibidez.

- **PUT Eskaera**
Web zerbitzarira datuak bidaltzeko eta dagoeneko badagoen informazioa eguneratzeko erabiltzen da.

- **DELETE Eskaera**
Web zerbitzaritik informazioa edo erregistroak ezabatzeko erabiltzen da.

####HTTP Egoera Kodeak

HTTP egoera kodeak zerbitzariak eskaeraren erantzun egoera adierazten ditu. 

Egoera kode hauek 5 talde ezberdinetan banatu daitezke:

- **100-199 - Informazio Erantzuna**

  Hauek bezeroari jakinarazteko bidaltzen dira bere eskeararen lehen zatia onartu dela eta gainerakoa bidaltzen jarraitu behar duela. Kode hauek ez dira jada oso ohikoak.

- **200-299 - Arrakasta**

  Kode talde hau bezeroari bere eskaera ondo burutu dela jakinarazteko erabiltzen da.

- **300-399 - Birbideraketa**

  Bezeroaren eskaera beste baliabide batera birbideratzeko erabiltzen dira. Hau beste web orri batera edo osorik beste webgune batera izan daiteke.

- **400-499 - Bezeroaren Erroreak**

  Bezeroari bere eskaeran errore bat egon dela jakinarazteko erabiltzen da.

- **500-599 - Zerbitzariaren Erroreak**

  Zerbitzariaren aldean gertatzen diren erroreentza gordetzen da eta normalean zerbitzariak eskaera kudeatzean arazo handia duela adierazten du.

####Goiburuak
Goiburuak web zerbitzarira eskaerak egiterakoan bidali ditzakezun datu gehigarri txikiak dira. Nahiz eta HTTP eskaera bat egiteko goiburu beharrezkoak ez diren, zaila izango da webgune bat behar bezala ikustea haiek gabe.

**Ohiko Eskaera Goiburuak**

Hauek bezeroak (normalean zure nabigatzaileak) zerbitzarira bidaltzen dituen goiburuak dira.

  - **Host**: Web zerbitzari batzuek webgune bat baino gehiago ostatatzen dituzte, beraz host goiburua emanez zein nahi duzun esan diezaiokezu, bestela zerbitzariaren webgune lehenetsia jasoko duzu.
  - **User-Agent**: Zure nabigatzailearen softwarea eta bertsio zenbakia da. Web zerbitzariari zure nabigatzailearen softwarea jakinarazteak webgunea zure nabigatzailearentzat behar bezala formateatzen laguntzen dio, eta HTML, JavaScript eta CSS elementu batzuk nabigatzaile jakin batzuetan bakarrik daude eskuragarri.
  - **Content-Length**: Formulario batean bezala web zerbitzarira datuak bidaltzerakoan, eduki luzerak web zerbitzariari web eskaeran zenbat datu espero dituen esaten dio. Modu honetan zerbitzariak ziurtatu dezake ez duela daturik galdu.
  - **Accept-Encoding**: Web zerbitzariari nabigatzaileak zein konpresio metodo onartzen dituen esaten dio, datuak txikiago egin ahal izateko internetez bidaltzerakoan.
  - **Cookie**: Zure informazioa gogoratzeko zerbitzarira bidaltzen diren datuak (informazio gehiagorako ikusi cookie-en ataza).

**Ohiko Erantzun Goiburuak**

Hauek eskaera baten ondoren zerbitzariak bezeroari itzultzen dizkion goiburuak dira.

  - **Set-Cookie**: Gorde beharreko informazioa, eskaera bakoitzean web zerbitzarira itzultzen dena (informazio gehiagorako ikusi cookie-en ataza).
  - **Cache-Control**: Zenbat denboran gorde behar den erantzunaren edukia nabigatzailearen cache-an berriz eskatu aurretik.
  - **Content-Type**: Bezeroari zer datu mota itzultzen ari den esaten dio: HTML, CSS, JavaScript, irudiak, PDF, bideoa, etab. Content-type goiburua erabiliz nabigatzaileak dakite nola prozesatu datuak.
  - **Content-Encoding**: Zer metodo erabili den datuak konprimitzeko internetez bidaltzerakoan txikiago egiteko.

Praktikan, goiburu hauek ikusezinak dira zure nabigatzailearentzat, baina funtsezko informazioa ematen diote zerbitzariari nola kudeatu eskaera. 

Adibidez, User-Agent goiburuagatik webgune bat ezberdin ikus daiteke mugikor batean eta ordenagailu batean.



####Cookie-ak
Cookieak zure ordenagailuan gordetzen diren datu txiki bat besterik ez dira. Cookieak gorde egiten dira web zerbitzari batetik "Set-Cookie" goiburua jasotzen duzunean. Ondoren egingo dituzun eskaera guztietan, cookie datuak itzuli egingo dizkiozu web zerbitzariari.
HTTP estaturik gabea delako (ez ditu zure aurreko eskaerak gogoratzen), cookieak web zerbitzariari zu nor zaren gogorarazteko erabil daitezke, webgunearentzako ezarpen pertsonal batzuk gordetzeko edo webgune hartan lehenago egon zaren jakiteko.


###Nola funtzionatzen dute webguneek?

Webgune batera joaten zarenean, zure nabigatzaileak (Safari edo Google Chrome bezala) web zerbitzari batera eskaera bat egiten du bisitatzen ari zaren orriaren informazioa eskatuz. Zerbitzariak zure nabigatzaileak orria erakusteko erabiliko dituen datuak bidaltzen ditu erantzunez. Web zerbitzari bat munduko beste nonbait dagoen ordenagailu dedikatu bat besterik ez da, zure eskaerak kudeatzen dituena.

![Nola funtzionatzen dute webguneek?](images/nola_funtzionatu.png)


**Frontend vs Backend**: Frontend-a bezeroaren nabigatzailean ikusten den zatia da (HTML, CSS, JS), eta Backend-a zerbitzarian exekutatzen dena (PHP, Node.js...). Edukia estatikoa edo dinamikoa izan daiteke, eta zerbitzariak Virtual Host bidez hainbat webgune kudea ditzake.

Zure nabigatzaileak web zerbitzari batera eskaera bat egitean beste prozesu asko daude inplikatuta, baina oraingoz ulertu behar duzuna da zerbitzari batera eskaera bat egiten duzula, eta honek zure nabigatzaileak informazioa erakusteko erabiliko dituen datuak bidaltzen dizkizula erantzunez.

HTML, CSS eta JavaScript dira web orrien oinarrizko teknologiak. HTML egiturarako, CSS itxurarako eta JavaScript interaktibitatearako erabiltzen dira. Elementuek atributuak dituzte (id, class, src...), eta erabiltzailearen sarrera baliatzen badute, arriskutsuak izan daitezke baldin eta ez badira behar bezala iragazten.

Datu sentikorraren esposizioa askotan gertatzen da frontend kodean (komentarioetan, JavaScript fitxategietan...) pasahitz, token edo esteka pribatuak uzten direnean. **HTML injekzioa** bezalako ahultasunak sor daitezke erabiltzailearen sarrera iragazten ez denean eta zuzenean orrian bistaratzen denean.

Nabigatzailearen garatzaile tresnak (Developer Tools) erabilgarriak dira eskaerak, cookie-ak, kodea eta segurtasunaren ikuspegitik informazioa aztertzeko. Inspector, Network, Debugger... panelak eskura ditugu.

###Beste osagai garrantzitsu batzuk:

**CDN-ak**

CDN bat baliabide bikaina izan daiteke webgune okupatu baten trafikoa murrizteko. Zure webguneko fitxategi estatikoak ostatu ditzakezu, JavaScript, CSS, irudiak, bideoak bezala, eta munduan zehar dauden milaka zerbitzarietan ostatu. Erabiltzaile batek ostatutako fitxategietako bat eskatzen duenean, CDN-ak zein den gertuena dagoen zerbitzaria fisikoki kokatuta kalkulatzen du eta eskaera horra bidaltzen du munduko beste aldearen ordez.

**Karga banatzaileak**

Webgune baten trafikoa handia bihurtzen hasten denean edo eskuragarritasun altua behar duen aplikazio bat exekutatzen denean, web zerbitzari bakar bat agian ez da nahikoa izango. 

Karga banatzaile bat duen webgune bat eskatzen duzunean, karga banatzaileak zure eskaera jasoko du lehenik eta ondoren atzean dauden zerbitzari anitzetan batera bidaliko du. 

Karga banatzaileak algoritmo ezberdinak erabiltzen ditu zein zerbitzari egokien den eskaera kudeatzeko erabakitzeko. 


**WAF-ak (Web Application Firewall)**

Eskaera gaiztoak detektatu eta blokeatzeko.

**Datu-baseak**

WAF bat zure web eskeararen eta web zerbitzariaren artean kokatzen da; bere helburu nagusia web zerbitzaria hacking edo zerbitzua ukatzeko erasoetatik babestea da. 

![WAF](images/firewall1.png)

## Hurrengo urratsak

- [Web ahultasun arrunten ikuspegi orokorra](owasp_top10.md)
- [Atzera itzuli hasierara](../index.md)

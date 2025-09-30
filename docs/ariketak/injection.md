# Injection

Datu ez-fidagarriak interprete bati bidaltzen zaizkionean gertatzen dira injekzioak, komando edo kontsulta baten parte gisa. Kategoria hau OWASP Top 10 2021eko hirugarren postuan dago.

Injekzio-erasoen arriskua web-aplikazioen segurtasunerako mehatxu nagusienetako bat da. Eraso mota honetan, erasotzaileak datu maltzurrak txertatzen ditu aplikazio batek interpretatzen dituen kontsulta edo komando baten barruan. Erasotzailearen helburua ez da bakarrik datuak sartzea, baizik eta aplikazioaren portaera kontrolatzea, datu-baseko informazioa lapurtzeko edo sistema osoa kaltetzeko.

Funtsean, garatzaile batek erabiltzailearen sarrera "datu" gisa tratatu beharrean, "kode" gisa tratatzen duenean gertatzen da.

## Injekzio mota

### SQL Injekzioa

Hau da eraso-motarik hedatuena eta larriena. Gehienetan, SQL kontsultak sortzeko kate-manipulazioa erabiltzean gertatzen da.

**Kode Ahula (Vulnerable Code):**

```php
    // Erabiltzailearen sarrera eskuratu
    $username = $_POST['username'];

    // Kode ahula: sarrera zuzenean kontsultan sartzen da
    $sql_query = "SELECT * FROM users WHERE username = '" . $username . "'";

    // Exekutatu kontsulta
    $result = $pdo->query($sql_query);
```

**Erasoaren Eszenatokia:**

    Erasotzaileak sarrera hau sartzen du: ' OR 1=1 --

    Garatzailearen kodea kontsulta honetan bilakatzen da:
    SELECT * FROM users WHERE username = '' OR 1=1 --';

    Kontsultaren bigarren zatia (OR 1=1) beti TRUE denez, datu-baseak pasahitza balioztatu gabe onartzen du. Gainera, -- karaktereak gainerako kontsulta (kasu honetan ';') komentario gisa tratatzen du.

**Prebentsioa:**

Adibide hauetan, ahultasuna erabiltzailearen sarrera zuzenean SQL kontsultaren testuan kateatzean zegoen. Hori da errotik saihestu behar dena.

Garatzaileek egin behar duten gauzarik garrantzitsuena kontsulta parametrizatuak (edo Prepared Statements) erabiltzea da, horretarako PDOren funtzionalitate nagusiak prepare() eta execute() metodoak dira. 

```php
    // 1. Kontsulta prestatu, oraingoan izeneko markatzaile bat erabiliz
    $sql_query = "SELECT * FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql_query);

    // 2. Balioa lotu parametroari
    // :username markatzailea $username aldagaiari lotzen da
    $stmt->bindParam(':username', $username);

    // 3. Exekutatu kontsulta, parametrorik gabe
    $stmt->execute();

    // Oharra: $username aldagaia exekuzioan lotzen da
``` 
### OS Injekzioa

Eraso honetan, garatzaileak erabiltzailearen sarrera zuzenean bidaltzen dio zerbitzariaren shell-ari, shell_exec, system edo exec bezalako funtzioak erabiliz.

**Kode Ahula (Vulnerable Code):**

```php
    // Erabiltzaileak igotako fitxategiaren izena eskuratu
    $file_name = $_GET['file_name'];

    // Kode ahula: 'convert' komandoari erabiltzailearen sarrera zuzenean pasatuz
    exec("convert " . $file_name . " -resize 200x200 thumb_".$file_name);
```

**Erasoaren Eszenatokia:**

    Garatzaileak pentsatzen du erabiltzaileak argazkia.jpg bezalako fitxategi-izen bat sartuko duela. Baina erasotzaile batek erabili dezake:

    Sarrera maltzurra: ; rm -rf /

    Exekutatuko litzatekeen komandoa: convert ; rm -rf / -resize 200x200 thumb_

    Ondorioa: convert komandoaren ondoren, sistemak rm -rf / komandoa exekutatuko luke, eta zerbitzarian kalte handiak eragingo lituzke.

**Prebentsioa:**
Honen aurkako irtenbide segurua da ez erabiltzea exec bezalako funtzioak, baizik eta irudiak prozesatzeko liburutegi espezializatuak erabiltzea, hala nola PHPko GD edo Imagick, edo Python-eko Pillow. Horiek, kodearen bidez prozesatzen dute irudia, eta ez dute shell-ik erabiltzen, seguruagoa bihurtuz.

Garatzaile baten ikuspegitik, OS Injekzioa ekiditeko arau nagusia oso sinplea da: ez exekutatu inoiz shell komandorik erabiltzailearen sarrerarekin. Hori egitea beti da arriskutsua.


### NoSQL Injekzioa
Injekzio mota hau NoSQL datu-baseak (adibidez, MongoDB) erabiltzen dituzten aplikazioetan gertatzen da. SQL Injekzioaren antzekoa da, baina erasotzaileak kontsulten egitura manipulatzen du JSON edo JavaScript objektuetan oinarritutako sintaxia erabiliz.

**Kode Ahula (Vulnerable Code):**

```javascript
    // Erabiltzaileak bidalitako logineko datuak
    const { username, password } = req.body;

    // Kode ahula: bilaketa-objektua zuzenean erabiltzailearen sarrerarekin eraikitzen da
    db.collection('users').findOne({ username: username, password: password }, (err, user) => {
    // ... login logika
    });
```

**Erasoaren Eszenatokia:**

Erasotzaileak sarrera hau bidaltzen du:

```javascript
    username: 'admin'
    password: { "$ne": null } ( hau da, password ez da nulua)
```

Garatzailearen kodeak kontsulta honetan bilakatzen du:

```javascript
    db.collection('users').findOne({ username: 'admin', password: { "$ne": null } }, ...);
```

Ondorioa: password eremua beti true denez, erasotzaileak pasahitza jakin gabe admin erabiltzailearekin saioa hastea lortzen du.

**Prebentsioa:**
Erabili liburutegiak: NoSQL liburutegiak daude injekzioak ekiditen laguntzen dutenak, adibidez, MongoDB-n, sarrerak garbitu ditzakezu kontsultak sortu aurretik.

Saihestu kate-konkatenazioak: Biderik onena ez da inoiz kontsulta-objektuak testuz eraikitzea.

### XML Injekzioa

Eraso honek XML datuak prozesatzen dituzten aplikazioei eragiten die. Erasotzaileak kode maltzurra txertatzen du XML fitxategi batean, XML-a aztertzen duen motorra manipulatzeko, batez ere XXE (XML External Entity) entitateen bidez.

**Kode Ahula (Vulnerable Code):**

```java
    // Erabiltzailearen sarrerarekin XML dokumentua prozesatu
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = factory.newDocumentBuilder();
    Document doc = builder.parse(new File(request.getParameter("xml_file")));
```
**Erasoaren Eszenatokia:**

Erasotzaileak XML fitxategi honen edukia bidaltzen du:

```xml
    <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
    <foo>&xxe;</foo>
```
Ondorioa: XML irakurgailuak file:///etc/passwd fitxategia irekiko du, eta sistemaren erabiltzaileen informazio sentikorra erakutsiko du. Hau datu-filtrazio larria da.

**Prebentzioa:**

- Desgaitu entitateak: 

    Baimenik gabe kanpoko entitateak kargatzea desgaitzea da metodo eraginkorrena. Liburutegi moderno gehienek XXEren prebentzioa lehenespenez aktibatzen dute.

- Erabili liburutegi seguruak: 

    Ziurtatu XML prozesatzeko liburutegi bertsio eguneratuak erabiltzen dituzula, segurtasun-akats ezagunak konpondu dituztenak.


### LDAP Injekzioa
LDAP injekzioak LDAP zerbitzariak (adibidez, Active Directory) dituzten aplikazioei eragiten die. Erasotzaileak LDAP-aren sintaxi bereziak erabiliz (adibidez, *, (, |), aplikazioaren autentifikazio- edo bilaketa-kontsulta manipulatzen du.

LDAP zerbitzaria (Lightweight Directory Access Protocol) sareko direktorio-zerbitzu bat da, datuak antolatzeko eta eskuratzeko diseinatuta dagoena.

**Kode Ahula (Vulnerable Code):**

```java
    // Erabiltzailearen sarrera eskuratu
    String username = request.getParameter("username");

    // Kode ahula: sarrera zuzenean LDAP kontsultan gehitzen da
    String filter = "(&(uid=" + username + ")(userPassword=*))";
    DirContext ctx = new InitialDirContext();
    ctx.search("ou=users,dc=example,dc=com", filter, searchControls);
```

**Erasoaren Eszenatokia:**

- Erasotzaileak sarrera hau sartzen du: *)

- Garatzailearen kodeak kontsulta honetan bilakatzen du: (&(uid=*) (userPassword=*))

- Ondorioa: Kontsulta honek pasahitza kontuan hartu gabe edozein erabiltzailerekin bat egiten du, eta horri esker erasotzaileak edozein kontutan saioa has dezake.

**Prebentzioa:**

- Sarrera baliozkotzea eta ihes-sekuentziak: Ziurtatu sarrerak karaktere baimenduak soilik dituela (adibidez, alfanumerikoak). Edozein karaktere berezi (), (, |) ihes-sekuentzia batekin ordezkatu behar da, interpretatu ez dadin.


## Defense in Depth (Defentsa Sakonean)

"Defentsa sakonean" zibersegurtasun-printzipio bat da, eta ez du konfiantza guztia segurtasun-geruza bakar batean jartzen. Horren ordez, sistema edo aplikazio bat babesteko hainbat geruza (edo defentsa) erabiltzea proposatzen du. Horrela, erasotzaile batek defentsa bat gainditzen badu ere, beste bat topatuko du.

Printzipio honen helburua da inork ezin duela segurtasun-geruza bat %100ean fidagarria dela ziurtatu, eta, beraz, geruza gehigarriak jartzen dira, badaezpada.

** Adibidez: **

    1. Geruza: Sarrera-balidazio ahula edo ezabatua
    
    Batzuetan, garatzaileek balidazio sinple bat soilik erabiltzen dute, adibidez, erabiltzailearen izena 10 karakterekoa dela egiaztatzea. Honek ez ditu karaktere arriskutsuak gelditzen, hala nola komillak edo koma eta puntu. Horrela, eraso bat gertatzeko aukera oso handia da, lehenengo geruza hau ahula baita.

    2. Geruza: Kontsulta Parametrizatuak (Soluzio Indartsuena)
    
    Kontsulta parametrizatuek datuak eta kodea guztiz bereizten dituzte. Beraz, nahiz eta erasotzaile batek datu arriskutsuak sartu, datu-baseak datu soil gisa tratatzen ditu, eta ez du haien kodea exekutatzen. Hau da gure defentsa-lerro nagusia eta sendoena, eta beti aplikatu behar da.

    3. Geruza: Pribilegio Minimoak (Kaltea Murriztea)

    Demagun erasotzaileak lehenengo bi geruzak gainditzea lortu duela. Segurtasun-neurri gehigarririk gabe, datu-base osoa suntsitu edo lapurtu lezake. Baina gure aplikazioak datu-basearekin konektatzeko erabiltzen duen erabiltzaileak pribilegio minimoak baditu, adibidez, bakarrik datuak irakurtzeko baimena badu, DROP TABLE bezalako komando bat exekutatzeko saiakerak porrot egingo du. Geruza honek erasoaren ondorioak mugatzen ditu.



## Erronkak

### 1. erronka: Login Bender
Log in with Bender's user account.

### 2. erronka: Login Jim
Log in with Jim's user account.

### 3. erronka: Database Schema
Exfiltrate the entire DB schema definition via SQL Injection

### 4. erronka: DOM XSS
Perform a DOM XSS attack with: ` <iframe src="javascript:alert(`xss`)">`

### 5. erronka: Christmas Special
Order the Christmas special offer of 2014.

### 6. erronka: Ephemeral Accountant
Log in with the (non-existing) accountant acc0unt4nt@juice-sh.op without ever registering that user.


## Estekak
- [OWASP Injection](https://owasp.org/Top10/A03_2021-Injection/)
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

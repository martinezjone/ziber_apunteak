# 3.2 Autentifikazio eta Saioen Segurtasuna

## Pasahitzen Kudeaketa Segurua

### Zergatik ez da nahikoa pasahitzak zuzenean gordetzea?

- **Segurtasun arriskua**: Datuak lapurtuz gero, erabiltzaileen pasahitzak eskuragarri egongo lirateke
- **Pasahitz errepikapena**: Erabiltzaileek pasahitz berbera erabiltzen dute hainbat zerbitzutan
- **Pribatutasuna**: Legezko erabiltzaileek ere ezingo lituzkete pasahitzak ikusi (erabat) — hori printzipio bat da.

### Nola gorde pasahitzak (PHP)

PHP-n bcrypt edo Argon2 erabiltzeko [password_hash()](https://www.php.net/manual/es/function.password-hash.php) eta [password_verify()](https://www.php.net/manual/es/function.password-verify.php) funtzioak erabiltzen dira; PHPk automatikoki gatza (salt) kudeatzen du, beraz ez da gatza (salt) hori eskuz sortu behar.

Modu lehenetsian PHP-k bcrypt erabiltzen du, baina Argon2 erabili daiteke ere zure zerbitzariak horretarako prest egotekotan.

#### Sortu eta gorde pasahitza (erregistratzean)

```php
    $password = $_POST['password']; // beti balidatu/egiaztatu lehenago

    // PASSWORD_DEFAULT erabil dezakezu (gaur egungo bertsioan bcrypt-en bidez egiten da)
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Gorde $hash datu-basera (PDO erabiliz)
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash) VALUES (:email, :hash)");
    $stmt->execute([':email' => $_POST['email'], ':hash' => $hash]);
```

```php
    // Argon2 erabiltzeko adibidea. Ahak izatekotan Argon2Id erabiltzea gomendatzen da.
    $hash = password_hash($password, PASSWORD_ARGON2ID);
```
	
#### Egiaztatu pasahitza sartzean


```php
    // login.php
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
    // Arrakastaz egiaztatu
        // Saioa hasi, etab.
    } else {
        // Ez da pasahitza berdina
    }
```

**password_needs_rehash() funtzioaren erabilera**

```php
    // login.php - Adibide honetan, erabiltzaileak login egiten duen bakoitzean konfirmatuko du ia erabiltzen duen hash "obsoleto" dagoen, eta egotekotan berriro hasheatuko luke.
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
    // Arrakastaz egiaztatu
    // Bertsio berritzailea behar bada berriro-hash egin:
        if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $upd = $pdo->prepare("UPDATE users SET password_hash = :hash WHERE id = :id");
            $upd->execute([':hash' => $newHash, ':id' => $user['id']]);
        }
        // Saioa hasi, etab.
    } else {
         // Ez da pasahitza berdina
    }
```

### Pasahitz politika eta bestelako neurriak

- Gutxienez 8+ karaktere (hobeto 12+), baina fokusatu passphrases-ean eta kontuan izanda erraztasuna erabiltzailearen esperientzian.
- Erabil ezazu password strength meter frontend-era baina ez itxi onartu indarrez: informatu bakarrik.
- Konta-itzali politikak (lockout) edo tasa-mugak (rate limiting) sartu saiakerak gehiegi badira.
- Beti erabili TLS/HTTPS.

- Ez erabili md5() eta sha1(). Ez dira seguruak, eta hiztegi/rainbow tableekin apurtzeko oso errazak dira.
- Ez gorde pasahitzik testu lauan.
- Ez asmatu zure hash/enkriptazio sistema propioa.

## Saioen Kudeaketa Segurua

### Cookie Seguruak Konfiguratzea

Ezarri cookie-aren parametro seguruak session_set_cookie_params() erabiliz session_start() aurretik.

```php
    $cookieParams = [
        'lifetime' => 60*60*24, // 1 egun (egokitu behar dena)
        'path'     => '/',
        'domain'   => '.zure-domeinua.eus',
        'secure'   => true,      // HTTPS behar du
        'httponly' => true,      // JSk ezin du irakurri
        'samesite' => 'Lax'      // edo 'Strict' behar izanez gero
    ];
    session_set_cookie_params($cookieParams);
    session_start();
```

**session_regenerate_id() **
`session_regenerate_id()` funtzioa  deitu behar da une kritikoetan, adibidez:

- Erabiltzailea autentifikatu bezain laster (saioa hasi).
- Erabiltzailearen pribilegioak aldatzen direnean (adibidez, baimenak igotzean edo eremu sentikorretara sartzean).
- Saioan informazio sentikorra gordetzen denean.

```php
    session_start();
    session_regenerate_id(true); // genera un nuevo ID y elimina el antiguo
```

### Saioa itxi (logout) modu seguruan

```php
    // logout.php
    session_start();
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    session_destroy();
```

**Adibide osoa:** [Erregistro eta login adibidea](https://docs.google.com/document/d/1j83cl_MlJhWtYmZ23zq5j8KSEYi5__Vn4wWyj5mY6LM/edit?usp=sharing)

## CSRF babesa (PHP) — oinarrizko tokena

Sortu CSRF token bat formulario bakoitzerako eta egiaztatu zerbitzarian. Token honi esker, zerbitzariak ziurtatu dezake formularioa zure webgunetik etorri dela, eta ez beste webgune batetik, CSRF erasoei aurre eginez

Token hauk bakarrik erabiliko ditugu gure formularioek metodo POST, PUT edo DELETE dutenean.

```php
    // PHP saioaren barruan, token bat sortu eta saioan gorde:

    // session_start() beti lehenengo lerroan!
    session_start();

    function csrf_token() {
        if (empty($_SESSION['csrf_token'])) {
            // 32 byte ausazko token sortu, hex-formatuan
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }


    // Formulari bakoitzean sartu token hau hidden input batekin:

    <form action="submit.php" method="post">
        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(csrf_token()); ?>">
        
        <label for="name">Izena:</label>
        <input type="text" name="name" id="name">
        
        <button type="submit">Bidali</button>
    </form>



    // Zerbitzarian tokena egiaztatu. submit.php fitxategian, eskaera jasotzean:

    session_start();

    // POSTeko tokena egiaztatu
    if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        http_response_code(400);
        exit('CSRF token okerra edo falta da.');
    }

    // Tokena zuzena bada, jarraitu datuak prozesatzen
    $name = $_POST['name'];
    echo "Formularioa ondo bidali da: $name";
```
# 3.1 Injekzioen aurkako defentsak

## Backend-erako defentsak



## Frontend-erako defentsak

### 1. A01:2021 - Broken Access Control (Sarbide Kontrol Apurtua)

Baimendutako ez diren erabiltzaileei funtzioak edo datuak atzitzea ahalbidetzen du. Bezeroan, elementuak ezkutatzea ez da nahikoa, kodea manipulagarria baita.

#### Ezegonkorra: 
Botoi bat ezkutatzea nahikoa dela pentsatzea.

```javascript
if (!user.isAdmin) {
  document.getElementById("deleteBtn").style.display = "none";
}
```

#### Segurua: 
Backend-ek beti balidatu behar du baimena.

```javascript
if (!user.isAdmin) {
  document.getElementById("deleteBtn").remove();
}
```

#### Aholkuak:
- Ez fidatu bezero aldeko balioztapenetan; egiaztatu backend-ean tokenak erabiliz (adib., JWT).
- Erabili gutxieneko pribilegioaren printzipioa.
- Inplementatu RBAC (Roleen Bidezko Sarbide Kontrola) zerbitzarian.

---

### 2. A02:2021 - Cryptographic Failures (Kriptografia Hutsegiteak)

Datu sentikorren esposizioa kriptografia ahularen bidez. JS-n, saihestu secretak bezeroan gordetzea edo HTTPS gabe transmititzea.

#### Ezegonkorra: 
Pasahitzak edo tokenak `localStorage`-n gordetzea.

```javascript
localStorage.setItem("password", "123456");
```

#### Segurua: 
Inoiz ez gorde pasahitzak. Token aldi baterako hobeak `sessionStorage`-n.

```javascript
sessionStorage.setItem("password", 123456);
```

Beste modu bat...

```javascript
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b =>
    b.toString(16).padStart(2, '0')).join('');
}
```

#### Aholkuak:
- Erabili HTTPS beti.
- Gorde tokenak HttpOnly cookie-etan, ez localStorage-n.
- Erabili Web Crypto API behar kriptografikoentzat.

---

### 3. A03:2021 - Injection (XSS, HTML Injection) (Injekzioa)

Kode gaiztoko injekzioa, hala nola XSS, sanitizatu gabeko input-en bidez.

#### Ezegonkorra: 
Input-ak zuzenean innerHTML-n sartzea.

```javascript
const userInput = document.getElementById('input').value;
document.getElementById('output').innerHTML = userInput;
```

#### Segurua: 
Sanitizatu edukia DOMPurify erabiliz.

```javascript
import DOMPurify from 'dompurify';
const userInput = document.getElementById('input').value;
const sanitized = DOMPurify.sanitize(userInput);
document.getElementById('output').textContent = sanitized;
```

#### Aholkuak:
- Erabili textContent edo createTextNode innerHTML-ren ordez.
- Sanitizatu DOMPurify erabiliz.
- Inplementatu Content Security Policy (CSP).

---

### 4. A04:2021 - Insecure Design (Diseinu Ezegonkorra)

Hasieratik mehatxuak kontuan hartzen ez dituzten diseinuak.

#### Ezegonkorra: 
Logika kritikoa frontend-ean.

```javascript
let precio = 100;
if (userInput === "BLACKFRIDAY") {
  precio = 1;
}
```

#### Segurua: 
Kalkulua beti backend-ean.

```javascript
fetch("/api/check-discount", {
  method: "POST",
  body: JSON.stringify({ coupon: userInput })
})
```

#### Aholkuak:
- Erabili threat modeling (adib., STRIDE).
- Balidatu input-ak Zod bezalako liburutegiekin.
- Diseinatu "secure by default" printzipioarekin.

---

### 5. A05:2021 - Security Misconfiguration (Segurtasun Konfigurazio Okerra)

Konfigurazio ezegunekorrak.

#### Ezegonkorra: 
Liburutegi zaharrak erabiltzea edo barne erroreak erakustea.

```javascript
console.error("Error: conexión a base de datos fallida en localhost:3306");
```

#### Segurua: 
Liburutegi eguneratuak eta mezu generikoak erabiltzea.

```javascript
console.error("Ha ocurrido un error, inténtelo más tarde.");
```

Beste adibide bat:

#### Ezegonkorra:

```javascript
fetch('https://api.example.com/data');
```

#### Segurua:

```javascript
fetch('https://api.example.com/data', {
  mode: 'cors',
  credentials: 'same-origin',
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Requested-With': 'XMLHttpRequest'
  }
});
```

#### Aholkuak:
- Konfiguratu CORS zorrotz backend-ean.
- Erabili segurtasun goiburuak.
- Eskaneatu konfigurazioak OWASP ZAP erabiliz.

---

### 6. A06:2021 - Vulnerable and Outdated Components (Osagai Zaurgarri eta Zaharkituak)

Ahultasunak dituzten liburutegi zaharkituen erabilera.

#### Ezegonkorra:

```javascript
import _ from 'lodash'; // Versión <4.17.13 vulnerable
_.merge({}, JSON.parse(userInput));
```

#### Segurua:

```javascript
import _ from 'lodash'; // "^4.17.21"
_.merge({}, JSON.parse(userInput));
```

#### Aholkuak:
- Erabili npm audit edo Snyk.
- Eguneratu dependentziak erregulartasunez.
- Minimizatu dependentziak.

---

### 7. A07:2021 - Identification and Authentication Failures (Identifikazio eta Autentifikazio Hutsegiteak)

Autentifikazioaren kudeaketa txarra, tokenak esposatzen dituen modukoa.

#### Ezegonkorra: 
Saio mugagabea gordetzea.

```javascript
localStorage.setItem("jwt", token);
```

#### Segurua: 
Iraungipen kontrolatua erabiltzea.

```javascript
setTimeout(() => {
  sessionStorage.removeItem("accessToken");
  alert("Tu sesión ha expirado");
  location.href = "/login";
}, 15 * 60 * 1000); // 15 minutos
```

#### Aholkuak:
- Erabili OAuth/JWT iraungitzerekin.
- Inplementatu MFA backend-arekin.
- Ezabatu tokenak logout egitean.

---

### 8. A08:2021 - Software and Data Integrity Failures (Software eta Datu Integritate Hutsegiteak)

Script-en karga egiaztapen gabe (adib., SRI gabe).

#### Ezegonkorra: 
Script-ak balidazio gabe kargatzea.

```html
<script src="https://cdn.example.com/lib.js"></script>
```

#### Segurua: 
Subresource Integrity (SRI) erabiltzea.

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-xxxxx"
        crossorigin="anonymous"></script>
```

#### Aholkuak:
- Erabili Subresource Integrity (SRI).
- Egiaztatu checksumak.
- Saihestu CDN ez-fidagarriak.

---

### 9. A09:2021 - Security Logging and Monitoring Failures (Segurtasun Log eta Monitorizazio Hutsegiteak)

Datuak esposatzen dituzten logak edo erasoak detektatu ezin dituztenak.

#### Ezegonkorra:

```javascript
console.log('Error with user:', userData);
```

#### Segurua:

```javascript
console.error('Error occurred:', { code: error.code });
```

#### Aholkuak:
- Ez egin PII (Personally Identifiable Information) loggingik.
- Erabili Sentry bezalako tresnak.
- Mugatu logak produkzioan.

---

### 10. A10:2021 - Server-Side Request Forgery (SSRF) (Zerbitzari Aldeko Eskaera Faltsutzea)

Barne baliabideetara request-ak egitera behartzen dituzten bezero eskaerak.

#### Ezegonkorra:

```javascript
const url = document.getElementById('urlInput').value;
fetch(url);
```

#### Segurua:

```javascript
const allowedUrls = ['https://api.example.com'];
const url = document.getElementById('urlInput').value;
if (allowedUrls.some(allowed => url.startsWith(allowed))) {
  fetch(url);
}
```

#### Aholkuak:
- Erabili allowlist-ak URLentzat.
- Balidatu input-ak eskareentzat.
- Mugatu GET metodoetara ahal bada.




# Hurrengo urratsak

- [SQL injekzioak prebenitzeko trikimailu-orria](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

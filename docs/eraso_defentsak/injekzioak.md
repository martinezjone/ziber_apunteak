# 2.1 Injekzioen aurkako defentsak

## SQL injekzioa

### Zer da SQL injekzioa?
SQL injekzioa datu-basearen kontsulta bat aldatzen duen eraso mota bat da, erabiltzailearen sarrera egoki balioztatu gabe kontsultan txertatzen denean gertatzen dena.

### Nola funtzionatzen du?
```sql
-- Erabiltzailearen sarrera: ' OR '1'='1
-- Kontsulta originala:
SELECT * FROM users WHERE username = '' AND password = 'hasia'

-- Injekzioaren ondoren:
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = 'hasia'
-- '1'='1' beti egia denez, kontsultak erabiltzaile guztiak itzuliko ditu
```

### Nola ekidin?

#### 1. Parametro kontsultak erabili (Prepared Statements)

**Python adibidea (SQLite):**
```python
import sqlite3

def login_segurua(erabiltzailea, pasahitza):
    conn = sqlite3.connect('datu_basea.db')
    cursor = conn.cursor()
    
    # Parametro kontsulta erabiliz
    kontsulta = "SELECT * FROM users WHERE username = ? AND password = ?"
    cursor.execute(kontsulta, (erabiltzailea, pasahitza))
    
    erabiltzailea = cursor.fetchone()
    conn.close()
    return erabiltzailea
```

**PHP adibidea (PDO):**
```php
<?php
$erabiltzailea = $_POST['erabiltzailea'];
$pasahitza = $_POST['pasahitza'];

$pdo = new PDO('mysql:host=localhost;dbname=nire_db', 'erabiltzailea', 'pasahitza');
$stmt = $pdo->prepare('SELECT * FROM users WHERE username = :erabiltzailea AND password = :pasahitza');
$stmt->execute(['erabiltzailea' => $erabiltzailea, 'pasahitza' => $pasahitza]);
$erabiltzailea = $stmt->fetch();
?>
```

## XSS (Cross-Site Scripting)

### XSS motak

1. **Ispatutako XSS (Reflected)**
   - Erasotzaileak biktimari URL maltzur bat bidaltzen dio
   - Webguneak erantzunean script-a islatzen du
   - Script-a biktimaren nabigatzailean exekutatzen da

2. **Gordetako XSS (Stored)**
   - Script maltzurra datu-basean gordetzen da
   - Erabiltzaileak orria kargatzen duenean exekutatzen da
   - Kalte handiagoak eragin ditzake

3. **DOM XSS**
   - Nabigatzailean gertatzen da soilik
   - Dokumentuaren objektu-eredua (DOM) aldatzen du

### Nola ekidin XSS-a?

#### 1. Irteera kodifikatu

**JavaScript (Node.js):**
```javascript
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;'
  };
  return text.replace(/[&<>"'/]/g, m => map[m]);
};

// Erabilera
const sarreraArriskutsua = "<script>kodea</script>";
document.getElementById('izena').innerHTML = escapeHtml(sarreraArriskutsua);
```

#### 2. Erabili seguruak diren API-ak

**JavaScript segurua:**
```javascript
// Txarra
document.getElementById('izena').innerHTML = erabiltzailearenSarrera;

// Hobea
document.getElementById('izena').textContent = erabiltzailearenSarrera;
```

#### 3. Content Security Policy (CSP) erabili

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com
```

## Beste injekzio batzuk

### Komando-injekzioa

**Adibide arriskutsua (Python):**
```python
import os

def ping_helbidea(helbidea):
    # Arriskutsua: erabiltzailearen sarrerak komandoak exekuta ditzake
    os.system(f"ping -c 4 {helbidea}")
```

**Segurua:**
```python
import subprocess

def ping_helbidea_segurua(helbidea):
    # Segurua: parametro modura bidaltzen da
    subprocess.run(['ping', '-c', '4', helbidea], check=True)
```

### LDAP injekzioa

**Adibide arriskutsua:**
```python
import ldap

def autentifikatu(erabiltzailea, pasahitza):
    # Arriskutsua: sarrera garbitu gabe
    kontsulta = f"(uid={erabiltzailea})(userPassword={pasahitza})"
    # LDAP kontsulta egin
```

**Segurua:**
```python
import ldap
from ldap.filter import escape_filter_chars

def autentifikatu_segurua(erabiltzailea, pasahitza):
    # Karaktere bereziak iragazita
    erab_garbitua = escape_filter_chars(erabiltzailea)
    pass_garbitua = escape_filter_chars(pasahitza)
    kontsulta = f"(uid={erab_garbitua})(userPassword={pass_garbitua})"
    # LDAP kontsulta egin
```

## Ariketa praktikoa

1. Sortu web orri sinple bat erabiltzaile-izen eta pasahitzarekin
2. Inplementatu SQL injekzioaren aurkako babesa
3. Gehitu XSS babesa sarrera eta irteeran
4. Probatu zure babesak sarrera arriskutsuekin

## Hurrengo urratsak

- [Autentifikazio eta saioen segurtasuna](autentifikazioa.md)
- [Atzera itzuli aurreko atalera](../oinarriak_mehatxuak/owasp_top10.md)

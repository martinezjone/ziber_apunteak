# 2.2 Autentifikazio eta saioen segurtasuna

## Pasahitzen kudeaketa segurua

### Zergatik ez da nahikoa pasahitzak zuzenean gordetzea?
- Datuak lapurtuz gero, erabiltzaileen pasahitzak eskuragarri egongo lirateke
- Erabiltzaileek pasahitz berbera erabiltzen dute hainbat zerbitzutan
- Legezko erabiltzaileak ere ezingo lituzke pasahitzak ikusi

### Pasahitzak hasheatu

#### bcrypt erabiliz (Python)

```python
import bcrypt

def sortu_pasahitza(pasahitza: str) -> bytes:
    # Gatza sortu ausaz
    gatza = bcrypt.gensalt()
    # Pasahitza hasheatu
    hash_ondarra = bcrypt.hashpw(pasahitza.encode('utf-8'), gatza)
    return hash_ondarra

def egiaztatu_pasahitza(pasahitza: str, gordetako_hash: bytes) -> bool:
    # Pasahitza egiaztatu
    return bcrypt.checkpw(pasahitza.encode('utf-8'), gordetako_hash)

# Adibidea
erabiltzaile_pasahitza = "nire_pasahitz_sekretua"
hash_ondarra = sortu_pasahitza(erabiltzaile_pasahitza)
print(f"Gordetako hasha: {hash_ondarra.decode()}")

# Egiaztatu
doitu = egiaztatu_pasahitza("pasahitz_okerra", hash_ondarra)
print(f"Pasahitz okerra: {doitu}")  # False

doitu = egiaztatu_pasahitza(erabiltzaile_pasahitza, hash_ondarra)
print(f"Pasahitz zuzena: {doitu}")  # True
```

### Gatza (Salt) zergatik da garrantzitsua?
- Pasahitz berdinak hash desberdinak sortzen ditu
- Eraso aurrez kalkulatuek (rainbow tables) ez dute funtzionatuko
- Erasotzaileak ezin du hash berdina duten bi erabiltzaile identifikatu

## Saioen kudeaketa segurua

### Cookie seguruak konfiguratu

**Express.js adibidea:**
```javascript
const session = require('express-session');
const crypto = require('crypto');

// Sortu ausazko gako sekretua sesioen sinadurak egiteko
const SESSION_SECRET = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: SESSION_SECRET,
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,      // HTTPS bidez bakarrik bidali
        httpOnly: true,    // JavaScript-ek ezin du atzitu
        sameSite: 'lax',   // CSRF erasoetatik babesteko
        maxAge: 1000 * 60 * 60 * 24, // 1 egun
        domain: '.zure-domeinua.eus'
    }
}));
```

### JWT (JSON Web Tokens)

**Token bat sortu eta egiaztatu (Node.js):**

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Ingurune-aldagaitik kargatu edo sortu gako sekretu sendo bat
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

// Token bat sortu
function sortuTokena(erabiltzailea) {
    return jwt.sign(
        {
            sub: erabiltzailea.id,
            email: erabiltzailea.email,
            // Ez sartu informazio sentikorrik
        },
        JWT_SECRET,
        { 
            expiresIn: '1h',
            issuer: 'ZureAplikazioa',
            audience: 'zureaplikazioa.eus'
        }
    );
}

// Token bat egiaztatu
function egiaztatuTokena(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'ZureAplikazioa',
            audience: 'zureaplikazioa.eus'
        });
        return { baliozkoa: true, edukia: decoded };
    } catch (error) {
        return { 
            baliozkoa: false, 
            errorea: error.message 
        };
    }
}

// Adibidea
const erabiltzailea = { id: 123, email: 'erabiltzailea@adibidea.eus' };
const token = sortuTokena(erabiltzailea);
console.log('Sortutako tokena:', token);

const emaitza = egiaztatuTokena(token);
console.log('Tokena egiaztatuta:', emaitza);
```

## Autentifikazio Anizkoitza (MFA)

### Zergatik erabili MFA?
- Pasahitzak konprometitu arren, sarbidea eragozten du
- "Zerbait dakizu" + "Zerbait duzu" + "Zara zu"

### MFA motak:
1. **Aplikazio autentifikatzaileak** (Google Authenticator, Authy, Microsoft Authenticator)
2. **SMS kodea** (ez da hain segurua SIM swap delako erasoengatik)
3. **Hardware gakoak** (YubiKey, Titan Security Key)
4. **Beharrezko aplikazioak** (banku aplikazioak, Google Prompt)

### OTP (One-Time Password) inplementazioa

```python
import pyotp
import qrcode

def konfiguratuMFA(erabiltzaile_izena):
    # Sortu gako sekretu berria erabiltzailearentzat
    gakoa = pyotp.random_base32()
    
    # Sortu OTP URI bat QR kodea sortzeko
    totp_uri = pyotp.totp.TOTP(gakoa).provisioning_uri(
        name=erabiltzaile_izena,
        issuer_name='Zure Aplikazioa'
    )
    
    # Sortu QR kodea
    qr = qrcode.make(totp_uri)
    qr.save(f'mfa_{erabiltzaile_izena}.png')
    
    return gakoa

def egiaztatuKodea(gakoa, erabiltzailearen_kodea):
    totp = pyotp.TOTP(gakoa)
    return totp.verify(erabiltzailearen_kodea)

# Erabilera adibidea
erabiltzaile_izena = "pertsona@adibidea.eus"
gakoa = konfiguratuMFA(erabiltzaile_izena)
print(f"Eskaneatu QR kodea Google Authenticatorrekin: mfa_{erabiltzaile_izena}.png")

# Erabiltzaileak kodea sartu duela simulatu
erabiltzailearen_kodea = input("Sartu zure autentifikazio aplikazioko kodea: ")
if egiaztatuKodea(gakoa, erabiltzailearen_kodea):
    print("Autentifikazioa arrakastatsua!")
else:
    print("Kode okerra, saiatu berriro.")
```

## Saioen segurtasunerako aholkuak

1. **Saio-identifikatzaile luze eta ausazkoak** erabili
2. **Saioak iraungitzeko** denbora-tarte egokiak ezarri
3. **Saio bakarra** baimendu erabiltzaileko
4. **Saioa ixteko** aukera ezarri
5. **Erabiltzailearen ohiko kokapena** eta **nabigatzailea** monitorizatu
6. **Saio aktiboak erakuts**i erabiltzaileari

## Hurrengo urratsak

- [Sarbide-kontrola eta konfigurazio segurua](sarbide_kontrola.md)
- [Atzera itzuli aurreko atalera](injekzioak.md)

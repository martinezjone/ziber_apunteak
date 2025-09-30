# 3.1 Datu sentikorren kudeaketa eta babesa

## Datuen zifraketa

### Zergatik da garrantzitsua zifraketa erabiltzea?
- Datuak lapurtuz gero, ezingo dira irakurri
- Datuak transferitzerakoan segurtasuna bermatzen du
- Lege betetzea (GDPR, HIPAA, etab.)

### Zifraketa motak

#### 1. Zifraketa simetrikoa (AES)
Gako berbera erabiltzen da zifratu eta deszifratzeko.

**Python adibidea (PyCryptodome):**

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import base64

def zifratu(mezua, gakoa=None):
    if gakoa is None:
        gakoa = get_random_bytes(32)  # 256 bit-eko gakoa
    
    # Sortu ausazko hasieratze-vektorea (IV)
    iv = get_random_bytes(16)
    
    # Sortu zifratzailea
    cipher = AES.new(gakoa, AES.MODE_CBC, iv)
    
    # Zifratu mezua (paddatu behar da 16 byte-ko blokeetarako)
    mezua_ordokitua = pad(mezua.encode('utf-8'), AES.block_size)
    testu_zifratua = cipher.encrypt(mezua_ordokitua)
    
    # Itzuli base64 formatuan (IV + testu zifratua)
    return base64.b64encode(iv + testu_zifratua).decode('utf-8')

deszifratu(mezua_zifratua, gakoa):
    try:
        # Deskodetu base64
        datuak = base64.b64decode(mezua_zifratua)
        
        # Atera IV eta testu zifratua
        iv = datuak[:16]
        testu_zifratua = datuak[16:]
        
        # Sortu zifratzailea
        cipher = AES.new(gakoa, AES.MODE_CBC, iv)
        
        # Deszifratu eta kendu padding-a
        mezua_ordokitua = cipher.decrypt(testu_zifratua)
        mezua = unpad(mezua_ordokitua, AES.block_size).decode('utf-8')
        
        return mezua
    except Exception as e:
        print(f"Errorea deszifratzean: {e}")
        return None

# Adibidea
gakoa = get_random_bytes(32)  # Gorde seguruan gako hau!
mezua = "Hau sekretu bat da!"

# Zifratu
mezua_zifratua = zifratu(mezua, gakoa)
print(f"Zifratua: {mezua_zifratua}")

# Deszifratu
deszifratua = deszifratu(mezua_zifratua, gakoa)
print(f"Deszifratua: {deszifratua}")
```

#### 2. Zifraketa asimetrikoa (RSA)
Gako pribatu/publiko bikotea erabiltzen du.

**Python adibidea (cryptography):**

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes

def sortu_gakoak():
    # Sortu gako pribatua
    pribatua = rsa.generate_private_key(
        public_exponent=65537,
        key_size=4096
    )
    
    # Atera gako publikoa
    publikoa = pribatua.public_key()
    
    return pribatua, publikoa

def zifratu_rsa(mezua, gako_publicoa):
    # Zifratu gako publikoarekin
    testu_zifratua = gako_publicoa.encrypt(
        mezua.encode('utf-8'),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return testu_zifratua

deszifratu_rsa(testu_zifratua, gako_pribatua):
    # Deszifratu gako pribatuarekin
    mezua = gako_pribatua.decrypt(
        testu_zifratua,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return mezua.decode('utf-8')

# Adibidea
pribatua, publikoa = sortu_gakoak()
mezua = "Hau ere sekretu bat da!"

# Zifratu
testu_zifratua = zifratu_rsa(mezua, publikoa)
print(f"Zifratua: {testu_zifratua.hex()}")

# Deszifratu
deszifratua = deszifratu_rsa(testu_zifratua, pribatua)
print(f"Deszifratua: {deszifratua}")
```

## Datuak transferitzerakoan (TLS/HTTPS)

### Nola konfiguratu HTTPS Node.js-n (Express)

```javascript
const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();

// Konfiguratu segurtasun-neurriak
app.use(helmet());

// HSTS (HTTP Strict Transport Security)
app.use(helmet.hsts({
  maxAge: 31536000, // 1 urte
  includeSubDomains: true,
  preload: true
}));

// Beste segurtasun-headerrak
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

// Irakurri SSL/TLS gakoak
const options = {
  key: fs.readFileSync('path/to/private.key'),
  cert: fs.readFileSync('path/to/certificate.crt'),
  // Aukera gehigarriak
  minVersion: 'TLSv1.2',
  ciphers: [
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384',
    // ...
  ].join(':')
};

// Abiarritu HTTPS zerbitzaria
https.createServer(options, app).listen(443, () => {
  console.log('HTTPS zerbitzaria 443 portuan entzuten...');
});
```

## Datuak gordetzeko aholkuak

### 1. Ez gorde datu sentikorrik behar ez baduzu
- Ez gorde pasahitzak, baizik eta hash egindako bertsioak
- Ez gorde kreditu-txartel zenbakiak behar ez baduzu

### 2. Datuen minimizazioa
- Biltzean: Biltzeko baimena duzun datu minimoa baino ez bildu
- Gordean: Beharrezkoak diren datuak soilik gorde
- Iraungitzean: Datuak ezabatu epearen amaieran

### 3. Datuak maskatu erakusteko
```javascript
function maskatuZenbakiKontua(zenbakiKontua) {
  if (!zenbakiKontua) return '';
  const luzeera = zenbakiKontua.length;
  if (luzeera <= 4) return zenbakiKontua;
  return '*'.repeat(luzeera - 4) + zenbakiKontua.slice(-4);
}

// Adibidea
console.log(maskatuZenbakiKontua('1234567890123456')); // "************3456"
```

## Tokenen kudeaketa segurua

### JWT tokenak seguru gordetzeko

**Adibidea (React + localStorage erabiliz - ez da gomendagarria):**
```javascript
// Tokena gordetzeko modu OSO SINPLEA (ez da segurua)
const gordeTokena = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Ezin izan da tokena gorde:', error);
  }
};
```

**Hobea (HTTP-only Cookie erabiliz, zerbitzarian):**
```javascript
// Zerbitzariaren erantzuna (Node.js + Express)
res.cookie('token', token, {
  httpOnly: true,
  secure: true, // HTTPS bidez bakarrik
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 1 egun
});
```

### Tokenen iraungipena
```javascript
// Token bat sortzean (Node.js)
function sortuTokena(erabiltzailea) {
  return jwt.sign(
    {
      sub: erabiltzailea.id,
      iat: Math.floor(Date.now() / 1000), // Noiz sortua
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 ordu barru iraungiko da
      // Beste eremuak...
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256' }
  );
}

// Bezeroan tokena egiaztatu (React)
useEffect(() => {
  const egiaztatuTokena = async () => {
    try {
      const erantzuna = await fetch('/api/egiaztatu-tokena', {
        credentials: 'include' // Cookie bidaltzeko
      });
      
      if (!erantzuna.ok) {
        // Tokena baliogabea da, erabiltzailea deskonektatu
        await deskonektatu();
      }
    } catch (error) {
      console.error('Errorea tokena egiaztatzean:', error);
    }
  };

  // Egiaztatu tokena noizbehinka
  const interval = setInterval(egiaztatuTokena, 5 * 60 * 1000); // 5 minutero
  
  return () => clearInterval(interval);
}, []);
```

## Ariketa praktikoa

1. Inplementatu zifraketa simetrikoa datu sentikorrak gordetzeko
2. Konfiguratu HTTPS zure proiektuan
3. Sortu tokenen kudeaketa sistema bat HTTP-only cookie-kin
4. Egiaztatu zure webgunearen segurtasun-neurriak (helmet, CSP, etb.)

## Hurrengo urratsak

- [API seguruak eta autentifikazioa](api_segurtasuna.md)
- [Atzera itzuli aurreko atalera](../eraso_defentsak/sarbide_kontrola.md)

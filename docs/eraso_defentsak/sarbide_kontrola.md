# 2.3 Sarbide-kontrola eta konfigurazio segurua

## Sarbide-kontrol motak

### 1. RBAC (Role-Based Access Control)
Erabiltzaileak rol ezberdinetan sailkatzen dira eta rol bakoitzak baimen multzo bat du.

**Adibidea (Node.js + Express):**

```javascript
// Rolen definizioa
const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
  BIDALI: 'bidali'
};

// Baimenen definizioa rol bakoitzarentzat
const PERMISSIONS = {
  [ROLES.ADMIN]: ['irakurri', 'idatzi', 'ezabatu', 'aldatu', 'bidali'],
  [ROLES.EDITOR]: ['irakurri', 'idatzi', 'bidali'],
  [ROLES.USER]: ['irakurri', 'bidali'],
  [ROLES.BIDALI]: ['bidali']
};

// Middleware baimenak egiaztatzeko
function checkPermission(ekintza) {
  return (req, res, next) => {
    const erabiltzaileRola = req.user.rola; // Autentifikazio middlewaretik dator
    
    if (!erabiltzaileRola || !PERMISSIONS[erabiltzaileRola] || 
        !PERMISSIONS[erabiltzaileRola].includes(ekintza)) {
      return res.status(403).json({ error: 'Ez duzu baimenik ekintza hau egiteko' });
    }
    next();
  };
}

// Erabilera adibidea
app.delete('/api/erabiltzaileak/:id', 
  authenticateUser, // Lehenik autentifikatu
  checkPermission('ezabatu'), // Ondoren baimena egiaztatu
  (req, res) => {
    // Kodea erabiltzailea ezabatzeko
  }
);
```

### 2. ABAC (Attribute-Based Access Control)
Erabiltzailearen eta baliabidearen atributuen arabera erabakitzen du sarbidea.

**Adibidea (Python + Policy):**

```python
from functools import wraps

def check_access(erabiltzailea, baliabidea, ekintza):
    # Adibide sinple bat
    if ekintza == "irakurri" and baliabidea.jabea == erabiltzailea.id:
        return True
    if ekintza == "editatu" and erabiltzailea.rola == "admin":
        return True
    if ekintza == "bidali" and erabiltzailea.egoera == "aktiboa":
        return True
    return False

def access_required(ekintza):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            erabiltzailea = get_jwt_identity()
            baliabidea = get_baliabidea(kwargs['balibide_id'])
            
            if not check_access(erabiltzailea, baliabidea, ekintza):
                return {"error": "Ez duzu baimenik"}, 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Erabilera adibidea
@app.route('/dokumentua/<int:dokumentu_id>', methods=['PUT'])
@jwt_required()
@access_required('editatu')
def editatu_dokumentua(dokumentu_id):
    # Dokumentua editatzeko kodea
    pass
```

## IDOR (Insecure Direct Object Reference) erasoak

### Zer da IDOR?
Erabiltzaileak baliabideetarako sarbide zuzena duela uste duen baina benetan ez duenean gertatzen den segurtasun akatsa.

### Nola prebenitu?

1. **Balidatu sarbidea baliabide bakoitzeko**

```javascript
// Adibidea Express.js-n
app.get('/api/erabiltzaileak/:id', async (req, res) => {
  try {
    const erabiltzailea = await Erabiltzailea.findById(req.params.id);
    
    // Egiaztatu erabiltzaileak baimena duen baliabidea ikusteko
    if (req.user.id !== erabiltzailea.id && req.user.rola !== 'admin') {
      return res.status(403).json({ error: 'Ez duzu baimenik' });
    }
    
    res.json(erabiltzailea);
  } catch (error) {
    res.status(404).json({ error: 'Erabiltzailea ez da aurkitu' });
  }
});
```

2. **Erabili UUID edo token seguruak** ID sekuentzialen ordez

```python
import uuid
from django.db import models

class Dokumentua(models.Model):
    # ID sekretua erabiliz
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    izena = models.CharField(max_length=255)
    edukia = models.TextField()
    jabea = models.ForeignKey(User, on_delete=models.CASCADE)

# URL adibidea: /dokumentuak/3F2504E0-4F89-11D3-9A0C-0305E82C3301/
```

## Konfigurazio segurua

### Ingurunearen araberako konfigurazioa

**config/development.js**
```javascript
module.exports = {
  // Garapenerako ezarpenak
  database: {
    host: 'localhost',
    port: 5432,
    name: 'nireapp_garapena',
    user: 'postgres'
  },
  server: {
    port: 3000,
    debug: true,
    cors: {
      origin: ['http://localhost:8080']
    }
  },
  auth: {
    jwtSecret: 'garapeneko_giltza_bakarra',
    passwordSaltRounds: 10
  }
};
```

**config/production.js**
```javascript
module.exports = {
  // Produkzioko ezarpenak
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  server: {
    port: process.env.PORT || 3000,
    debug: false,
    cors: {
      origin: ['https://zureaplikazioa.eus']
    }
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    passwordSaltRounds: 12
  }
};
```

### Konfigurazio seguruaren printzipioak

1. **Ez bidali konfigurazio sentikorrak koderik**
   - Erabili ingurune aldagaiak
   - Ez bidali `.env` fitxategia kontrol bertsioetara

2. **Segurtasun neurriak indartu**
   ```http
   # HTTP headers seguruak (adibidea Express.js-ra)
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   Content-Security-Policy: default-src 'self'
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

3. **Erregistro seguruak (Logging)**
   - Ez erregistratu datu sentikorrik (pasahitzak, tokenak, kredentzialak)
   - Erabili maila egokiak (DEBUG, INFO, WARN, ERROR)
   - Birbideratu erroreak monitorizaziorako sistemetara

## Ariketa praktikoa

1. Sortu RBAC sistema bat zure aplikazioan
2. Inplementatu IDOR babesak zure APIetan
3. Konfiguratu ingurune desberdinak (garapena, produkzioa)
4. Egiaztatu zure HTTP headerek seguruak diren

## Hurrengo urratsak

- [Datu sentikorren kudeaketa segurua](../../datu_babesa/datu_sentikorrak.md)
- [Atzera itzuli aurreko atalera](autentifikazioa.md)

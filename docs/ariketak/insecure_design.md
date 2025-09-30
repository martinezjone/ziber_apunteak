# Insecure Design

Diseinu edo arkitektura-aldean falta diren edo txarto diseinatutako kontrolak sortzen dituzten ahultasun multzoari deritzo. Ez da bakarrik kode-errore bat; arazoaren sustraia da beharrezko segurtasun-kontrolak ez ezartzea proiektuaren hasieran (threat modeling, segurtasun-arkitektura, business risk profiling). Horren ondorioz, “perfektuki” inplementatutako kodeak ere huts egin dezake, baldin eta diseinuak ez baditu arrisku batzuk kontuan hartzen. 

## Zergatik garrantzitsua da?

Diseinu-ikasketa txarrak edo definizio gabeziak ekarri ohi dituzte kontrol erabilgarri gutxirekin edo kontrabezaleen aurkako neurri egoki gabe.

Arazo hauen konponbidea ez da beti “patch” lokal bat; normalean diseinuaren aldaketa edo arkitektura-hausnarketa behar izaten da. 

### Adibideak:

- Business logic flaws — e.g., ordainketa logika okerra (grup-txartelen muga gainditu daiteke).
- Lack of rate-limiting / anti-bot design — skalpers edo bot-ak erosketak masiboki egitea.
- Insecure recovery/workflow — pasahitzaren berreskurapena galderetan oinarritzen bada.
- Missing threat model for critical flows — autentikazio, ordainketa, rol- eta pribilegio-fluxuak ez aztertuak. 

### Prebentsioa

- *Integratu threat modeling*: proiektuaren lehen faseetan eta user story bakoitzean. Identify datu sentikorren fluxuak eta arriskuak. 
- *Design patterns eta paved road*: erabili liburutegi seguruenak eta eredu skeletorik onak; ez inventatu berriro egiazko ereduak. 
- *Segregate tenants / segregate tiers*: isolatu datu eta zerbitzu kritikoak.
- *Plausibility checks eta business rules in each tier*: ez fidatu bakarrik client-side checks; egiaztatu beti server-side.
- *Unit/integration tests target*: idatzi testak misuse-cases (no solo happy paths).
- *Plan resource & budget for security activities*: (design reviews, threat model sessions, periodic re-evaluation). 


## Erronkak

### 1. erronka: Improper Input Validation > Missing Encoding
Retrieve the photo of Bjoern's cat in "melee combat-mode".

### 2. erronka: Improper Input Validation > Repetitive Registration
Follow the DRY principle while registering a user.

### 3. erronka: Improper Input Validation > Zero Stars
Give a devastating zero-star feedback to the store.

### 4. erronka: Improper Input Validation > Empty User Registration
Register a user with an empty email and password.

### 5. erronka: Improper Input Validation > Admin Registration
Register as a user with administrator privileges.



## Estekak
- [OWASP Insecure Design](https://owasp.org/Top10/A04_2021-Insecure_Design/)
- [Principios de Diseño Seguros](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Garatzaileek softwarea egiaztatzeko gutxieneko estandarrei buruzko jarraibideak  ](https://nvlpubs.nist.gov/nistpubs/ir/2021/NIST.IR.8397.pdf)



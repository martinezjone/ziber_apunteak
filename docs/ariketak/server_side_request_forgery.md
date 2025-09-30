# Server-Side Request Forgery (SSRF)

SSRF erasoetan, erasotzaileak zerbitzari bati kanpoko edo barne baliabideak lerrokatzeko eskaerak egitera behartzen du. Arrisku nagusia aplikazioak barneko baliabide kritikoetara sartzea (esaterako, AWS metadata zerbitzura), soilik zerbitzarian bertan eskura daitezkeen zerbitzuetara. 

### Adibideak:



### Prebentsioa

Kasu honetan prebentsioa izan behar du bai zerbitzarian bai aplikazio geruzan ere.

Adibidez zerbitzari geruzan ondorengo pausu hauek eman beharko lirateke:
- Sare bereizietan urruneko baliabideetara sartzeko funtzionalitatearen arabera, SSRFen inpaktua murrizteko

- Firewall-politikak "lehenespen gisa ukatu" edo sarera sartzeko kontrol-arauak betearazi, intraneteko trafiko guztia blokeatzeko, funtsezkoa izan ezik.

Eta aplikazio geruzatik aldiz beste hauek beste gauza askoren gain:
- Konpondu eta baliozkotu bezeroak emandako sarrera-datu guztiak
- Bete URL eskema, ataka eta helburua, onartutako item-zerrenda positibo baten bidez

## Erronkak



## Estekak
- [OWASP Server-Side Request Forgery (SSRF)](https://owasp.org/Top10/es/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/)



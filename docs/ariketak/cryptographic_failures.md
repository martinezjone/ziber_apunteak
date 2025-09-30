# Cryptographic Failures

Lehenik eta behin, iragaitzazko eta atsedeneko datuen babes-beharrak zehaztu behar dira. Adibidez, pasahitzek, kreditu txartelen zenbakiek, osasun erregistroek, informazio pertsonalak eta negozio sekretuek aparteko babesa behar dute, batez ere datu horiek pribatutasun legeetan sartzen badira.

Datu horiengatik guztiengatik:

- Testu argian transmititzen al da daturen bat? Honek HTTP, SMTP, FTP bezalako protokoloei eragiten die. Interneteko kanpoko trafikoa oso arriskutsua da. Barne-trafiko guztia egiaztatzea, adibidez, karga-orekatzaileen, web-zerbitzarien edo back-end sistemen artean.

- Algoritmo edo protokolo kriptografiko zahar edo ahulen bat erabiltzen da, bai lehenespenez, bai kode zaharragoan?

- Erabiltzen ari diren kriptografia-gako lehenetsiak, sortutako edo berrerabilitako kriptografia-gako ahulak, edo gakoen kudeaketa edo errotazio egokia falta dira? Kriptografia-gakoak iturburu-kodeen biltegietan aztertzen dira?

- Enkriptatzea ez da derrigortzen, adibidez, HTTP goiburukoak (nabigatzailea) segurtasun-direktibak edo goiburuak falta dira?

- Jasotako zerbitzari-ziurtagiria eta konfiantza-katea behar bezala baliozkotuta daude?

- Etab...

## Erronkak


### 1. erronka: Confidential Document
Access a confidential document.
Saiatuko dugu dokumentu konfidentzial bat topatzen, horretarako begirada bat botako genuke privacy, about us eta horrelakoetan, ezta? 

### 2. erronka: Sensitive Data Exposure > Exposes credentials
A developer was careless with hardcoding unused, but still valid credentials for a testing account on the client-side.





## Estekak
- [OWASP Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)


---

[← Atzera bueltatu OWASP Top 10-ra](../oinarriak_mehatxuak/owasp_top10.md)

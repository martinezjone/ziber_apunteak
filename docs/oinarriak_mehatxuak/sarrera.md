# 1.1 Web Garapenean Zibersegurtasunaren Sarrera

## Zergatik da garrantzitsua zibersegurtasuna web garapenean?

Web aplikazioak gaur egun enpresen eta erabiltzaileen datu sentikorren biltegi gisa funtzionatzen dute. Zibersegurtasuna ezartzeak honako hauek babesten laguntzen du:

- Erabiltzaileen datu pribatuen konfidentzialtasuna
- Webgunearen osotasuna eta erabilgarritasuna
- Enpresaren ospea eta konfiantza
- Lege betetzea (GDPR, CCPA, etab.)

## Garatzailearen rola, "Shift Left" ikuspegia

Tradizionalki, segurtasuna garapen prozesuaren amaieran kontuan hartzen zen. "Shift Left" ikuspegiak segurtasuna garapenaren hasieran txertatzea proposatzen du:

- **Aurretiko prebentzioa**: Akatsak sortu aurretik konpontzea
- **Kostu murrizketa**: Arazoen aurrekariak aurkitzea merkeagoa da
- **Kode kalitate hobea**: Segurtasuna kodearen zati integrala bihurtzen da

## CIA triangelua (Konfidentzialtasuna, Osotasuna, Erabilgarritasuna)

Zibersegurtasunaren oinarrizko printzipioak:

    1. Konfidentzialtasuna (Confidentiality)

    - Sarbide kontrol egokia
    - Datuen zifraketa
    - Baimendutako pertsonek soilik sarbidea

    2. Osotasuna (Integrity)

    - Datuen zehaztasuna eta osotasuna bermatzeko mekanismoak
    - Ez-legezko aldaketak detektatzeko sistemak
    - Transakzioen jarraipena

    3. Erabilgarritasuna (Availability)

    - Zerbitzuaren jarraitasuna
    - Erasoak eta huts-egoerak kudeatzeko gaitasuna
    - Errendimendu egokia

## Mehatxua, ahultasuna, arriskua

Zibermehatxuak, ahultasunak eta arriskuak ulertzea funtsezkoa da:

  - **Mehatxua (Threat):** sistemaren aurkako kalte bat eragin dezakeen gertakari edo aktore bat.

  - **Ahultasuna (Vulnerability):** sistemaren puntu ahul bat, erasotzaile batek aprobetxa dezakeena.

  - **Arriskua (Risk):** mehatxu batek ahultasun bat erabiliz kalte bat eragiteko probabilitatea eta inpaktua.

## Diseinu segurua

### Segurtasuna Diseinutik (Security by Design)
Segurtasuna ez da gehigarri bat, baizik eta diseinuaren parte izan behar du. Horretarako hurrengo puntuak aplikatu behar dira beti:

- Segurtasuna garapenaren hasieran txertatzea
- Oinarrizko segurtasun printzipioak aplikatzea
- Defektuz seguruak diren konfigurazioak erabiltzea

### Sakoneko Defentsa (Defense in Depth)
Segurtasunaren babes sistema geruza ezberdinetan antolatzea da, bakoitzak bere babesa eskaintzen duena. Horrela, geruza batek huts egiten badu, hurrengoak oraindik babesa eskain dezake eta erasoa geldiarazi edo mugatu daiteke. Horretarako: 

- Segurtasun geruza anitzak ezartzea
- Hainbat defentsa mekanismo erabiltzea
- Erasotzaileak geruza bat gainditzen badu, beste batek geldiarazteko aukera izatea

### Pribilegio Gutxiena (Least Privilege)
Erabiltzaile edo prozesu batek egin behar duena bakarrik egiteko baimena izatea. Hau da: 

- Erabiltzaile eta prozesuei beraien eginkizuna betetzeko behar duten baimen minimoak ematea
- Administratzaile baimenak mugatzea
- Baimenen kudeaketa aktiboa

## Hurrengo urratsak

- [Webaren funtzionamenduaren oinarriak](web_oinarriak.md)
- [Web ahultasun arrunten ikuspegi orokorra](owasp_top10.md)

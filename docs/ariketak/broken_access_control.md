# Broken Access Control - Erronkak

Sistema informatiko gehienak hainbat erabiltzailerekin erabiltzeko diseinatuta daude. Pribilegioak erabiltzaile batek egin dezakeena esan nahi du. Pribilegio arrunten artean daude fitxategiak ikustea eta editatzea, edo sistemako fitxategiak aldatzea.

Pribilegioen gorakadak esan nahi du erabiltzaile batek eskubidea ez duten pribilegioak jasotzen dituela. Pribilegio horiek fitxategiak ezabatzeko, informazio pribatua ikusteko edo nahi ez diren programak (adibidez, birusak) instalatzeko erabil daitezke. Normalean, sistema batek segurtasuna saihesteko aukera ematen duen akats bat duenean gertatzen da, edo, bestela, erabiltzeko moduari buruzko diseinu-hipotesi akastunak dituenean.

## Erronkak

### 1. erronka: Miscellaneous > Score Board
    Find the carefully hidden 'Score Board' page.

    Hau izan beharko da gure lehengo ariketa. Score Borad atalean topatuko bait ditugu gainontzeko ariketak.

### 2. erronka: What's the Administrator's email address?
    Saiatuko dugu admin erabiltzailearen emaila topatzen.

### 3. erronka: What parameter is used for searching? 
    Bilaketa bat egiterakoan, zein da kontsultan erabilitako parametroa?

### 4. erronka: Access the administration section of the store

    Score-board-ekin gertatu den bezala, ez dugu administrazio atalera sartzeko esteka zuzena. Guk aurkitu beharko dugu. Hainbat aukera egon daitezke atala topatzeko.

    Hau egiteko SQL injection pixkatxo bat ikusi behar dugu.




## Estekak
- [OWASP Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [PortSwigger - Access Control Vulnerabilities](https://portswigger.net/web-security/access-control)


---

[← Atzera bueltatu OWASP Top 10-ra](../oinarriak_mehatxuak/owasp_top10.md)
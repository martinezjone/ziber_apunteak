# 3.3 Segurtasun-tresna praktikoak

## Garapen Segurua (DevSecOps)

### 1. SAST (Static Application Security Testing)

**ESLint segurtasun-pluginarekin (JavaScript/TypeScript)**

```bash
# Instalatu beharrezko paketeak
npm install --save-dev eslint eslint-plugin-security
```

**.eslintrc.js konfigurazioa:**
```javascript
module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:security/recommended"
  ],
  "plugins": ["security"],
  "rules": {
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escapes": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-non-literal-regexp": "error",
    "security/detect-non-literal-require": "warn",
    "security/detect-object-injection": "off", // Piztu behar bada, kode asko aldatu behar da
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error",
    "security/detect-unsafe-regex": "error"
  }
};
```

### 2. DAST (Dynamic Application Security Testing)

**OWASP ZAP erabiliz (Docker bidez):**

```bash
# OWASP ZAP abiarazi Docker-en
# Web Interfazea: http://localhost:8080
# API: http://localhost:8081

docker run -u zap -p 8080:8080 -p 8081:8081 \
  -i owasp/zap2docker-stable zap-webswing.sh

# Automatizatutako eskaneatzea
# (ZAPen komando-lerro bidez)
docker run -i owasp/zap2docker-stable zap-baseline.py \
  -t https://zure-aplikazioa.eus \
  -r test-report.html \
  -l INFO \
  -a  # Aktiboki probatu arazoak
```

### 3. SCA (Software Composition Analysis)

**Dependabot konfigurazioa GitHub-en (`.github/dependabot.yml`):**

```yaml
version: 2
updates:
  # JavaScript/Node.js eguneraketak
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    # Segurtasun eguneraketak berehala exekutatu
    pull-request-branch-name:
      separator: "-"
    labels:
      - "dependencies"
      - "javascript"
    # OpenSSF Scorecard bidezko segurtasun-azterketa
    open-pull-requests-limit: 10
    # Segurtasun-bulletin baten araberako eguneraketak
    vulnerability-alerts:
      enabled: true

  # Docker irudiak eguneratu
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "docker"
```

## Segurtasun-probak automatzeko

### 1. Nikto (Web Vulnerability Scanner)

```bash
# Instalazioa (Ubuntu/Debian)
sudo apt install nikto

# Oinarrizko erabilera
nikto -h https://zure-aplikazioa.eus

# Erreportea HTML formatuan gordetzeko
nikto -h https://zure-aplikazioa.eus -o nikto_scan.html -F htm

# Proxy bat erabiliz (adibidez, OWASP ZAP)
nikto -h https://zure-aplikazioa.eus -useproxy http://localhost:8080

# Cookie bat gehitu saioari jarraitzeko
nikto -h https://zure-aplikazioa.eus -C "sessionid=abc123; secure;"
```

### 2. Nmap (Sareko eskanerra)

```bash
# Portu irekiak aurkitu
nmap -sS -p- -T4 -v zure-zerbitzaria.eus

# Zerbitzuak eta bertsioak detektatu
nmap -sV -sC -p 80,443,8080 zure-zerbitzaria.eus

# NSE (Nmap Scripting Engine) erabiliz
nmap --script=http-security-headers,http-csrf,http-sql-injection -p 80,443 zure-zerbitzaria.eus

# Irteera XML formatuan gordetzeko
nmap -oX scan_results.xml -sV -sC zure-zerbitzaria.eus
```

## Kodearen Analisi Estatikoa

### 1. SonarQube + SonarLint

**SonarQube konfigurazioa (Docker):**

```yaml
# docker-compose.yml
version: '3'
services:
  sonarqube:
    image: sonarqube:community
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
      - SONAR_JDBC_URL=jdbc:postgresql://db:5432/sonar
      - SONAR_JDBC_USERNAME=sonar
      - SONAR_JDBC_PASSWORD=sonar
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=sonar
      - POSTGRES_PASSWORD=sonar
      - POSTGRES_DB=sonar
    volumes:
      - postgresql_data:/var/lib/postgresql/data
      - postgresql_data_db:/var/lib/postgresql/data/db

volumes:
  sonarqube_data:
  sonarqube_extensions:
  postgresql_data:
  postgresql_data_db:
```

**Sonar-scanner erabilera (proiektu bakoitzean):**

```bash
# sonar-project.properties fitxategia
sonar.projectKey=proiektuaren-izena
sonar.projectName="Proiektuaren Izena"
sonar.projectVersion=1.0
sonar.sources=.
sonar.sourceEncoding=UTF-8
sonar.exclusions=**/node_modules/**,**/*.spec.js
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Exekutatu analisia
docker run --rm \
  -v "$(pwd):/usr/src" \
  -w /usr/src \
  sonarsource/sonar-scanner-cli
```

### 2. Snyk (Dependency Vulnerabilities)

```bash
# Instalatu Snyk CLI
npm install -g snyk

# Erabiltzailearekin autentifikatu
snyk auth

# Proiektu baten analisia egiteko
snyk test

# Monitoretik jarraitu dependientziak
snyk monitor

# Docker irudi baten analisia
snyk container test ubuntu:latest

# IaC (Terraform, CloudFormation) analisia
snyk iac test
```

## Segurtasun-probak automatzeko (CI/CD)

### GitHub Actions adibidea

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0' # Astero igandero

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    # Node.js ingurunea konfiguratu
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    
    # Instalatu dependientziak
    - name: Install dependencies
      run: npm ci
    
    # Exekutatu testak
    - name: Run tests
      run: npm test
    
    # Exekutatu linterra
    - name: Run linter
      run: npx eslint . --ext .js,.jsx,.ts,.tsx
    
    # Snyk bidezko segurtasun-azterketa
    - name: Run Snyk to check for vulnerabilities
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
    
    # OWASP ZAP eskaneatzea (Docker bidez)
    - name: OWASP ZAP Scan
      uses: zaproxy/action-baseline@v0.6.0
      with:
        target: 'https://zure-aplikazioa.eus'
        rules_file_name: '.zap/rules.tsv'
        risk: '1,2,3'  # 1: Informazioa, 2: Arriskutsua, 3: Kritikoa
        fail_action: true  # Erroreak badaude, workflowa apurtu
    
    # Trivy bidezko irudiaren analisia (Docker)
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'zure-irudia:etiqueta'
        format: 'table'
        exit-code: '1'
        ignore-unfixed: true
        severity: 'CRITICAL'
```

## Segurtasun-neurriak probatzeko laborategiak

### 1. OWASP Juice Shop

```bash
# Docker bidez abiarazi
docker run --rm -p 3000:3000 bkimminich/juice-shop

# Eta ondoren nabigatu http://localhost:3000
```

### 2. DVWA (Damn Vulnerable Web Application)

```bash
# Docker bidez abiarazi
docker run --rm -it -p 80:80 vulnerables/web-dvwa

# Eta ondoren nabigatu http://localhost
# Saio-hasierako lehenetsitako kredentzialak:
# Erabiltzailea: admin
# Pasahitza: password
```

### 3. WebGoat

```bash
# Docker bidez abiarazi
docker run -it -p 8080:8080 -p 9090:9090 -e TZ=Europe/Madrid \
  -e WEBGOAT_ADMIN_PASSWORD=ChangeMe! \
  --name webgoat webgoat/goatandwolf:v8.2.2

# Eta ondoren nabigatu http://localhost:8080/WebGoat
```

## Ariketa praktikoa

1. Konfiguratu GitHub Actions zure proiektuarentzat segurtasun-eskaneatze automatikoak egiteko
2. Exekutatu OWASP ZAP zure aplikazio lokalaren kontra eta konpondu aurkitutako arazoak
3. Erabili Snyk edo Dependabot zure proiektuaren dependientzien segurtasuna aztertzeko
4. Instalatu SonarLint zure IDEan eta konpondu aurkitutako arazoak

## Bukatzeko aholkuak

- **Segurtasuna ez da produktu bat, prozesu bat da**: Eguneratu eta aztertu zure aplikazioa etengabe
- **"Secure by Default"**: Segurtasuna hasieratik txertatu garapenean
- **Gutxieneko pribilegioen printzipioa**: Erabiltzaileek eta prozesuek baimen minimoak izan ditzatela
- **Neurri anitzak**: Ez fidatu defentsa bakarrean, erabili hainbat geruza
- **Eduki segurtasun-politika argi bat**: Zure taldeak jakin behar du zer den onartzen den eta zer ez

## Baliabide gehiago

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [Snyk Learn](https://learn.snyk.io/)

## Amaiera

Zorionak! Zibersegurtasunaren oinarriak eta tresna praktikoak ikasi dituzu web garapenean. Gogoan izan segurtasuna ez dela helmuga bat, bidaia bat baizik. Jarri ezazu ikasitakoa praktikan eta mantendu zure gaitasunak eguneratzen!

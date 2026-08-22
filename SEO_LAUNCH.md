# SEO and launch control for seomcp.de

Stand: 22. August 2026. Dieses Dokument ist Audit-Nachweis, URL-Vertrag und Launch-Runbook.

## Verbindliche Entscheidung

Die öffentliche Fläche bleibt crawlbar und `noindex`. Sie hilft Entwicklern, Betriebs- und
Security-Prüfern, den echten Projektzustand zu erkennen, ist ohne realen MCP-Dienst aber keine
eigenständig tragfähige Such-Landingpage. Eine Indexfreigabe würde derzeit falsche
Produkterwartungen erzeugen und mit der redaktionellen Rolle von `seo-mcp.de` kollidieren.

- Hauptprojekt: Contextter; keine Strategieänderung.
- Primärer Nutzer: MCP-Client-Nutzer, Entwickler sowie Betriebs- und Security-Prüfer.
- Spätere Conversion: eine verifizierte Verbindung zu einem realen, begrenzten Contextter-MCP-Dienst.
- Aktuelle nächste Schritte: Projektgrenzen prüfen, Sicherheitskontakt finden, Betreiber und Datenfluss prüfen.
- Nicht-Ziele: Artikelbibliothek, Serververgleich, Keyword-Fan-out, Statusattrappe oder Endpoint-Behauptung.

## Auditumfang und Grenzen

Geprüft wurden Repository, Build-Ausgabe und Live-Site: Statuscodes, Canonicals, Meta- und
HTTP-Robots, Sitemap, Host/HTTPS/Slash-Redirects, unbekannte Pfade, interne und externe Links,
Titles, Descriptions, H1/Headings, Open Graph, JavaScript-Abhängigkeit, Security Header,
Desktop/Mobil, Tastatur, Axe, Konsole, Overflow und Lab-Ladezeiten. Es lagen keine
authentifizierten GSC-, Analytics-, Conversion- oder Backlinkdaten vor; Nachfrage, Indexierung,
Rankings und Conversions sind daher nicht belegt.

Aktuelle Primärquellen:

- [Google: noindex muss crawlbar bleiben](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: Sitemap enthält bevorzugte kanonische Such-URLs](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Canonical- und Redirect-Signale konsistent halten](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: strukturierte Daten müssen sichtbare Inhalte beschreiben](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

## Priorisierte Befunde

- P0/P1: keine offenen kritischen oder launch-verfälschenden Fehler gefunden.
- P2, behoben: Die Fehlerseite deklarierte `/404/`, obwohl diese Variante per 308 auf `/404`
  normalisiert wird. Fehler-Canonical, OG-URL und QA verwenden nun `https://seomcp.de/404`.
- P2, behoben: Der sichtbare Security-Meldeweg führte ausschließlich über eine GitHub-Anmeldung.
  E-Mail, privater Advisory-Kanal und `/.well-known/security.txt` sind nun direkt auffindbar.
- P3, bewusst offen: keine Search-Console-, Analytics- oder Conversion-Baseline. Sie ist vor einer
  Indexfreigabe nicht der Engpass; der fehlende reale Dienst ist der Engpass.

## Evidence Register

| Label | Evidenz | Entscheidung |
| --- | --- | --- |
| Verified | DomainPortfolio und Eigentümerentscheidung führen `seomcp.de` als neue Registrierung und Contextter-Förderdomain. | Keine Legacy-/Archivgates; normale Drittrechte bleiben. |
| Verified | Weder Repo noch Live-Site liefern MCP-Endpoint, Auth, Tenancy, Scopes, Kostenvertrag, Audit oder externen Status. | Service- und Verfügbarkeitsclaims sowie Indexfreigabe bleiben blockiert. |
| Verified | Apex, Security, Impressum und Datenschutz liefern serverseitiges HTML mit eigenem Title, Description, H1, Canonical und OG-URL. | Öffentliche Transparenzfläche bleibt nutzbar und JS-unabhängig. |
| Verified | Meta- und X-Robots-Tag stehen auf `noindex, follow, noarchive`; `robots.txt` erlaubt Crawling; Sitemap-Routen liefern 404. | Korrektes crawlbares Prelaunch-noindex. |
| Verified | Apex/www, HTTP/HTTPS und Slashvarianten enden über 308 auf extensionless HTTPS-Apex-URLs und erhalten Pfad/Query. | Host- und URL-Konsolidierung ist technisch konsistent. |
| Verified | `/404` und unbekannte Pfade liefern 404; die Slashvariante normalisiert per 308; es gibt keine klassifizierten 410-URLs. | Keine pauschalen Homepage-Redirects und kein widersprüchliches Fehler-Canonical. |
| Supported | Eine kurze Prelaunch-Fläche hat einen direkten Transparenznutzen für Entwickler und Prüfer. | Öffentlich erreichbar halten, aber nicht indexieren. |
| Hypothesis | Nach echtem Launch entsteht ein eigener navigationaler Job für Endpoint-Discovery, Verbindung und Betriebsstatus. | Erst mit realem Dienst und Messbaseline als Suchfläche bewerten. |
| Experiment | Nach Launch: 28 Tage lang messen, ob ein früher, kopierbarer Verbindungsblock den Anteil erfolgreicher verifizierter Erstverbindungen erhöht; Rollback bei mehr Fehlverbindungen oder Supportfällen. | Noch nicht starten; Baseline und realer Endpoint fehlen. |
| Rejected | Zweite MCP-Wissensbibliothek, Serververgleich, generische Guides oder PAA-/Keyword-Seiten. | Gehört zu `seo-mcp.de` oder erfüllt keinen eigenen Nutzerjob. |
| Rejected | `SoftwareApplication`-, Service-, Rating-, FAQ- oder Status-Schema im jetzigen Prelaunch. | Keine passende reale sichtbare Entität oder Suchfläche; kein Markup als Ersatz für Belege. |

## Kanonisches Seiteninventar

Aktuell indexierbare URLs: **0**. Alle öffentlichen 200-Seiten sind absichtlich noindex; Utility- und
Fehlerpfade werden nie in die Sitemap aufgenommen.

| URL | Status | Primärer Nutzerjob | Rolle | Index/Sitemap | Nächster Schritt |
| --- | ---: | --- | --- | --- | --- |
| `/` | 200 | realen Projektstatus, Zuständigkeit und Freigabegates verstehen | Prelaunch-Hub | noindex / nein | erst mit realem Dienst zur Service-Landingpage aufwerten |
| `/security` | 200 | aktuellen Scope und privaten Meldeweg finden | Security-Utility | noindex / nie | bei Infrastrukturänderung aktualisieren |
| `/impressum` | 200 | Betreiber und direkten Kontakt prüfen | Legal-Utility | noindex / nie | Betreiberangaben aktuell halten |
| `/datenschutz` | 200 | reale Hosting- und Datenflüsse prüfen | Privacy-Utility | noindex / nie | bei Auth, Logs, Formularen, Analytics oder Storage aktualisieren |
| `/.well-known/security.txt` | 200 | Security-Kontakt maschinenlesbar entdecken | Machine-Utility | X-Robots noindex / nie | Ablaufdatum und Kontakte pflegen |
| `/404` | 404 | unbekannten Pfad erkennen und sicher zurückkehren | Error | noindex / nie | Canonical muss auf nicht-redirectende `/404` zeigen |

## Page-Action-Matrix

| URL | Überlappung / Evidenzlücke | Aktion | Benötigter Beleg und Linkpfad | KPI / Review |
| --- | --- | --- | --- | --- |
| `/` | ohne Dienst kein eigener Suchjob; redaktionelle Nähe zu `seo-mcp.de` | Keep + strengthen + noindex | echter Endpoint, Betriebsvertrag; Links kuratiert zu Security, Legal und redaktioneller Erklärung | Launch-Gates; vor jedem Service-Release |
| `/security` | kein benannter Security-Owner, aber realer Meldeweg vorhanden | Strengthen + noindex | E-Mail, Advisory und `security.txt`; später Owner/SLA nur nach Annahme | Kontakte erreichbar; monatlich und bei Incident-Änderung |
| `/impressum` | keine Intent-Kannibalisierung | Keep + noindex | verifizierte Betreiberangaben; Footer/Home-Verbindung | 200, aktuelle Daten; quartalsweise |
| `/datenschutz` | Datenflüsse ändern sich beim späteren Service stark | Keep + noindex | Hosting/Auth/Logs/Storage/Provider gegen reale Implementierung | Inhaltsgleichheit mit Infrastruktur; vor jedem Providerwechsel |
| `/.well-known/security.txt` | zuvor nur aus QA/Policy, nicht sichtbar auffindbar | Strengthen + noindex | sichtbarer Link von `/security`, direkter E-Mail-Kontakt | 200, gültiges Expires, erreichbare Contacts; monatlich |
| `/404` | Canonical zeigte zuvor auf Redirectvariante | Strengthen + noindex | 404-Status, selbstkonsistente `/404`-Metadaten, kein Sitemap-Eintrag | Live-Route-/Canonical-Test; bei Routingänderung |

## Hub-/Cluster-Map

`/` ist der einzige Hub. Es gibt bewusst keinen vollständigen Seiten-Mesh und keine Sitemap-Orphans.

```text
/  Prelaunch-Hub
├─ /security  Sicherheitsumfang und Meldeweg
│  ├─ /.well-known/security.txt  maschinenlesbare Discovery
│  ├─ mailto:info@matthiasramahi.de  direkter Bericht
│  └─ GitHub Security Advisory  accountgebundener privater Bericht
├─ /impressum  Betreiberbeleg
├─ /datenschutz  realer Datenfluss
├─ seo-mcp.de  redaktionelle Erklärung, transparent gemeinsam betrieben
└─ Contextter  Produktkontext, keine unabhängige Bestätigung
```

Künftige, derzeit **nicht angelegte** Kinder: Endpoint-/Discovery-Metadaten, Verbindung/Auth,
Kompatibilitätsmatrix und extern geprüfter Status/Incidents. Jede URL benötigt eigenen Live-Beleg,
Maintenance-Owner und klaren nächsten Schritt. Vergleich, Methode und Guides bleiben auf `seo-mcp.de`.

## Such- und Nutzerlücken

Jetzt tragfähig und umgesetzt:

- direkter Security-Kontakt ohne GitHub-Konto;
- sichtbare und maschinenlesbare Security-Discovery;
- widerspruchsfreier Fehler-Canonical-Vertrag;
- dauerhafte Audit-, Seiten- und Clusterentscheidung.

Blockiert statt künstlich publiziert:

- Verbindungsanleitung: kein Endpoint und kein unterstützter Client verifiziert;
- Kompatibilitätsseite: keine getestete Server-/Client-Matrix;
- Statusseite: kein externer Check, Incident-Prozess oder benannter Owner;
- Kosten-/Scope-Dokumentation: keine produktiven Verträge;
- Vergleiche/Guides/Tools: falsche Domainrolle und keine eigenständige Evidenz.

## Zentraler SEO- und Sitemap-Vertrag

- `src/data/seo.ts` besitzt Titles, Descriptions, Canonicals, Rollen, Sitemapfähigkeit und Launch-Gates.
- `@astrojs/sitemap` entdeckt gebaute Astro-Routen automatisch und filtert sie durch diese Registry.
- Nur `sitemap: "launch"` kann nach belegtem Gate-Pass aufgenommen werden.
- `robots.txt` erlaubt Crawling und nennt die Sitemap erst nach Launch.
- `BaseLayout.astro` leitet Canonical und Robots aus derselben Registry ab.
- `vercel.json` wird über `pnpm seo:check` gegen X-Robots- und Security-Header geprüft.
- `trailingSlash: false` normalisiert nicht-rootige Slashvarianten dauerhaft auf extensionless URLs.
- Kerninhalt, Navigation und Metadaten benötigen kein Client-JavaScript; externe Fonts, Analytics und Storage fehlen bewusst.

## Risiken und Messplan

| Risiko | Kontrolle | Messung |
| --- | --- | --- |
| falsche Serviceerwartung | sichtbarer Prelaunch-Status, noindex, Claim-Tests | monatlicher Live-Contract-Test |
| Kannibalisierung mit `seo-mcp.de` | Servicebetrieb hier, Redaktion dort | nach Launch GSC Query×Page und Landingpage-Intent prüfen |
| veraltete Security-/Privacy-Angaben | reale Provider/Flows als Release-Gate | Security-Contact, Expires und Privacy-Diff monatlich |
| Sitemap-/Robots-Drift | zentrale Registry + Buildfehler bei Header-Drift | Build und Live-HTTP vor jedem Deploy |
| strukturierte Daten ohne sichtbare Entität | aktuell kein JSON-LD | Rich-Results-Test erst bei realer sichtbarer Entität |
| fehlende Nachfragedaten | keine Content-Skalierung ohne Baseline | nach Indexlaunch 28/56/90 Tage: Canonicals, Impressionen, Klicks, qualifizierte Verbindungen |

## 30/60/90-Tage-Sequenz

### 0–30 Tage

- Prelaunch-noindex, leere Sitemap und monatlichen Live-Contract beibehalten.
- Service-, Security- und Incident-Owner benennen.
- Endpoint-, Tenancy-, Scope-, Kosten-, Audit-, Datenschutz- und Fehlerverträge schreiben.

### 31–60 Tage

- Nur bei realem read-only Backend: Discovery-/Auth-Metadaten und externen Synthetic Check deployen.
- Unterstützte Clients und Fehlermodi reproduzierbar testen; Status nicht aus derselben Fehlerdomäne ableiten.
- Erst dann eigenständige Connection-/Status-URLs mit Proof-Assets registrieren.

### 61–90 Tage

- Minimum-Viable-Launch-Gates, Legal-/Security-Review und komplette Live-QA atomar ausführen.
- Nach Freigabe Search Console verifizieren, automatisch erzeugte Sitemap einreichen und Baseline starten.
- Nach 28/56/90 Tagen technische Eligibility, Discovery, Query×Page, erfolgreiche Verbindungen und Supportfälle bewerten.
- Ohne echten Dienst Reserve-Zustand fortführen; keine Ersatzartikel publizieren.

## Atomarer Launchablauf

1. Reale Evidenz für jedes Gate in `src/data/seo.ts` hinterlegen.
2. Nur eigenständig nützliche Service-/Dokumentationsrouten mit `sitemap: "launch"` registrieren.
3. `pnpm seo:sync`, danach `pnpm verify` und Browser-QA ausführen.
4. Meta-noindex und globales X-Robots-noindex gemeinsam entfernen; Utility-noindex behalten.
5. Prüfen: Sitemap nur kanonische indexierbare 200-Seiten; robots nennt sie; kein Redirect/Error/Utility enthalten.
6. Apex/www, HTTP/HTTPS, Slash/Query, 404/410, interne Links, Legal, Desktop/Mobil, Konsole und Accessibility live testen.
7. Deployment, Commit und stärksten bewiesenen Status im DomainPortfolio erfassen; GSC-Ergebnisse erst nach Authentifizierung behaupten.

Ein einzelnes Meta-Tag ist kein Launch. Solange der reale Dienst und sein Betriebsvertrag fehlen,
bleiben Indexierung, Sitemap und neue Service-Unterseiten gesperrt.

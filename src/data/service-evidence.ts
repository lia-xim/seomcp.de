export const evidenceState = "Nicht belegt" as const;

export const serviceContracts = [
  {
    path: "/service-contract",
    label: "Service-Vertrag",
    title: "Endpoint und Protokollidentität",
    summary: "Definiert die Nachweise, die für den öffentlichen Crawl-Foundry-MCP-Endpunkt vorliegen müssen.",
  },
  {
    path: "/capabilities",
    label: "Capability-Vertrag",
    title: "Fähigkeiten und Laufzeitgrenzen",
    summary: "Definiert die Felder und Tests für jede später tatsächlich bereitgestellte Capability.",
  },
  {
    path: "/authorization",
    label: "Auth-Vertrag",
    title: "Identität, Mandant und Freigabe",
    summary: "Definiert die Belege für Authentifizierung, Autorisierung, Mandantentrennung und Kostenkontrolle.",
  },
  {
    path: "/status",
    label: "Launch-Status",
    title: "Beweisstand vor dem Service-Start",
    summary: "Zeigt ausschließlich die Prelaunch-Gates – keine Uptime, Verfügbarkeit oder Incident-Historie.",
  },
] as const;

export const missingServiceEvidence = {
  endpoint: [
    "Kanonische Produktions-URL mit reproduzierbarer Protokollantwort",
    "Maschinenlesbare Serveridentität und unterstützte MCP-Version",
    "Extern ausgeführter Positiv- und Negativtest mit Prüfzeitpunkt",
    "Benannter Service-Owner für Deployment und Änderungen",
  ],
  capabilities: [
    "Versioniertes Capability-Schema, das der deployten Laufzeit entspricht",
    "Input-, Output- und Fehlerschema je Capability",
    "Kennzeichnung von Lese-, Schreib-, Kosten- und Nebenwirkungen",
    "Getestete Limits, Timeouts, Freigaben und Negativfälle",
  ],
  authorization: [
    "Verifizierte Authentifizierungs- und Token-Lebenszyklen",
    "Bindung von Benutzer, Organisation, Workspace und Ressource",
    "Minimale Scopes, Widerruf und Ablehnung unzulässiger Zugriffe",
    "Vorab sichtbares Kostenverhalten und explizite Aktionsfreigaben",
  ],
  operations: [
    "Benannte Service-, Security- und Incident-Owner",
    "Externer Statuscheck außerhalb derselben Fehlerdomäne",
    "Getesteter Incident-, Eskalations- und Kommunikationsprozess",
    "Auditnachweis für Zugriffe, Änderungen, Kosten und Ablehnungen",
  ],
} as const;

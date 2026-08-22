export const site = {
  domain: "seomcp.de",
  language: "de",
  title: "Contextter für MCP – mit klaren Grenzen",
  description:
    "Technischer Projektstatus der geplanten Contextter-MCP-Oberfläche. Noch ist kein öffentlicher Endpoint freigegeben.",
  canonicalUrl: "https://seomcp.de/",
  purpose:
    "seomcp.de wird die technische Verbindung zwischen unterstützten MCP-Clients und Contextter. Noch ist kein öffentlicher Endpoint freigegeben.",
  status: "Reservierte Infrastruktur. Kein öffentlicher MCP-Endpunkt ist freigegeben.",
  boundary:
    "Keine Endpoint-, Uptime-, Auth- oder Capability-Behauptung ohne tatsächlich bereitgestellten und geprüften Dienst. Redaktionelle Inhalte gehören auf seo-mcp.de.",
  operator: {
    name: "Matthias Ramahi",
    address: ["Kempener Straße 44", "40699 Erkrath", "Deutschland"],
    email: "info@matthiasramahi.de",
    phoneLabel: "+49 176 42 44 98 58",
    phoneHref: "+4917642449858",
  },
  links: {
    contextter: "https://contextter.com/",
    contextterSiteAudit: "https://contextter.com/site-audit/",
    editorial: "https://seo-mcp.de/",
    github: "https://github.com/lia-xim/seomcp.de",
    securityAdvisory: "https://github.com/lia-xim/seomcp.de/security/advisories/new",
    vercelPrivacy: "https://vercel.com/legal/privacy-notice",
    privacyAuthority: "https://www.ldi.nrw.de/",
  },
  navigation: [
    { label: "Vorhaben", href: "/#vorhaben" },
    { label: "Sicherheit", href: "/security" },
    { label: "Status", href: "/#status" },
  ],
  plannedSurfaces: [
    {
      host: "Service-Zugang",
      role: "Geplante Funktion",
      description: "Für den späteren MCP-Zugang reserviert.",
      state: "Noch nicht freigegeben",
    },
    {
      host: "Autorisierung",
      role: "Geplante Funktion",
      description: "Für eine klar begrenzte Verbindung reserviert.",
      state: "Noch nicht freigegeben",
    },
    {
      host: "Betriebsstatus",
      role: "Geplante Funktion",
      description: "Für nachvollziehbaren Betrieb reserviert.",
      state: "Noch nicht freigegeben",
    },
  ],
  launchGates: [
    {
      number: "01",
      label: "Dienst bereitstellen",
      description: "Ein echter, abgegrenzter Dienst muss erreichbar sein.",
    },
    {
      number: "02",
      label: "Grenzen prüfen",
      description: "Berechtigungen, Mandanten und Kosten müssen nachvollziehbar sein.",
    },
    {
      number: "03",
      label: "Betrieb belegen",
      description: "Sicherheit, Status und Fehlerfälle müssen extern prüfbar sein.",
    },
  ],
} as const;

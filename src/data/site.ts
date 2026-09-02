import { seoRoutes, SITE_ORIGIN } from "./seo";

export const site = {
  domain: "seomcp.de",
  language: "de",
  title: seoRoutes.home.title,
  description: seoRoutes.home.description,
  canonicalUrl: SITE_ORIGIN,
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
    contextter: "https://crawlfoundry.com/",
    contextterSiteAudit: "https://crawlfoundry.com/features/site-audit",
    editorial: "https://seo-mcp.de/",
    github: "https://github.com/lia-xim/seomcp.de",
    securityAdvisory: "https://github.com/lia-xim/seomcp.de/security/advisories/new",
    vercelPrivacy: "https://vercel.com/legal/privacy-notice",
    privacyAuthority: "https://www.ldi.nrw.de/",
  },
  navigation: [
    { label: "Vorhaben", href: "/#vorhaben" },
    { label: "Verträge", href: "/#contracts" },
    { label: "Sicherheit", href: "/security" },
    { label: "Status", href: "/status" },
  ],
  plannedSurfaces: [
    {
      host: "Service-Zugang",
      role: "Prelaunch-Vertrag",
      description: "Endpoint, Protokollidentität und externe Prüfbarkeit.",
      state: "NOT PROVEN",
      href: "/service-contract",
    },
    {
      host: "Capabilities",
      role: "Prelaunch-Vertrag",
      description: "Schemas, Nebenwirkungen, Limits und Laufzeittests.",
      state: "NOT PROVEN",
      href: "/capabilities",
    },
    {
      host: "Autorisierung",
      role: "Prelaunch-Vertrag",
      description: "Identität, Mandantenbindung, Scopes, Freigaben und Kosten.",
      state: "NOT PROVEN",
      href: "/authorization",
    },
    {
      host: "Betriebsstatus",
      role: "Prelaunch-Vertrag",
      description: "Owner, externer Check und Incident-Prozess.",
      state: "NOT PROVEN",
      href: "/status",
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

import { seoRoutes, SITE_ORIGIN } from "./seo";

export const site = {
  domain: "seomcp.de",
  language: "de",
  title: seoRoutes.home.title,
  description: seoRoutes.home.description,
  canonicalUrl: SITE_ORIGIN,
  purpose:
    "Diese Domain ist für einen sicher begrenzten Zugriff auf Crawl- und SEO-Daten vorgesehen. Der öffentliche Dienst ist noch nicht gestartet.",
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
    { label: "Status", href: "/status" },
    { label: "Sicherheit", href: "/security" },
    { label: "Dokumentation", href: "/#nachweise" },
  ],
  plannedSurfaces: [
    {
      number: "01",
      host: "Endpoint & Protokoll",
      description: "Produktions-URL, MCP-Version und externe Positiv- und Negativtests.",
      state: "Nicht belegt",
      href: "/service-contract",
    },
    {
      number: "02",
      host: "Capabilities",
      description: "Versionierte Schemas, Datenwirkung, Limits und Laufzeitverhalten.",
      state: "Nicht belegt",
      href: "/capabilities",
    },
    {
      number: "03",
      host: "Auth & Mandanten",
      description: "Identität, Workspace-Bindung, Scopes, Widerruf und Kostenfreigaben.",
      state: "Nicht belegt",
      href: "/authorization",
    },
    {
      number: "04",
      host: "Betrieb & Incidents",
      description: "Verantwortliche, externe Statuschecks und ein getesteter Incident-Prozess.",
      state: "Nicht belegt",
      href: "/status",
    },
  ],
  verifiedAt: "04.09.2026",
} as const;

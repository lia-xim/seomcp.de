export const SITE_ORIGIN = "https://seomcp.de/";
export const SITEMAP_PATH = "/sitemap-index.xml";
export const NOINDEX_DIRECTIVE = "noindex, follow, noarchive";

interface LaunchGate {
  verified: boolean;
  evidence: string | null;
  requirement: string;
}

interface LaunchPolicy {
  approval: string;
  indexWhenReady: boolean;
  readiness: Record<string, LaunchGate>;
}

export const launchPolicy: LaunchPolicy = {
  approval: "approved_when_minimum_viable_service_is_verified",
  indexWhenReady: true,
  readiness: {
    publicReadOnlyService: {
      verified: false,
      evidence: null,
      requirement: "Ein echter, lesender MCP-Dienst ist produktiv bereitgestellt und extern prüfbar.",
    },
    authTenancyAndCostContracts: {
      verified: false,
      evidence: null,
      requirement: "Auth, Mandantenbindung, Scopes und Kostenverhalten sind dokumentiert und geprüft.",
    },
    namedServiceAndSecurityOwners: {
      verified: false,
      evidence: null,
      requirement: "Benannte Service- und Security-Verantwortliche haben den Betrieb übernommen.",
    },
    externalStatusAndIncidentProcess: {
      verified: false,
      evidence: null,
      requirement: "Externe Statuschecks und ein Incident-Kommunikationsprozess sind in Betrieb.",
    },
  },
};

export const seoRoutes = {
  home: {
    path: "/",
    title: "MCP-Zugang für Crawl Foundry: Launch-Status",
    description:
      "Technischer Prelaunch-Status des geplanten Crawl-Foundry-MCP-Zugangs: Endpoint, Capabilities, Autorisierung und Betrieb werden vor dem Start belegt.",
    role: "service_launch",
    sitemap: "launch",
  },
  security: {
    path: "/security",
    title: "Sicherheit und Meldung für das MCP-Vorhaben",
    description:
      "Aktueller Sicherheitsumfang, private Meldestelle und verbindliche Freigabegates für das Crawl Foundry MCP-Vorhaben.",
    role: "security_utility",
    sitemap: "never",
  },
  serviceContract: {
    path: "/service-contract",
    title: "Prelaunch-Vertrag für Endpoint und Protokoll",
    description:
      "Prüfvertrag für den Crawl-Foundry-MCP-Endpunkt. Ein öffentlicher Protokollnachweis wird separat freigegeben.",
    role: "prelaunch_contract",
    sitemap: "never",
  },
  capabilities: {
    path: "/capabilities",
    title: "Prelaunch-Vertrag für MCP-Capabilities",
    description:
      "Benötigte Schemas, Grenzen und Laufzeittests für künftige MCP-Capabilities. Aktuell ist keine Capability veröffentlicht.",
    role: "prelaunch_contract",
    sitemap: "never",
  },
  authorization: {
    path: "/authorization",
    title: "Prelaunch-Vertrag für Auth und Mandanten",
    description:
      "Benötigte Nachweise für Authentifizierung, Scopes, Mandantentrennung, Freigaben und Kosten. Aktuell existiert kein öffentlicher Auth-Flow.",
    role: "prelaunch_contract",
    sitemap: "never",
  },
  status: {
    path: "/status",
    title: "Status des Crawl-Foundry-MCP-Vorhabens",
    description:
      "Aktueller Beweisstand der Launch-Gates. Diese Seite ist kein Uptime-Monitor und behauptet keine Serviceverfügbarkeit.",
    role: "prelaunch_status",
    sitemap: "never",
  },
  imprint: {
    path: "/impressum",
    title: "Impressum und Betreiberangaben",
    description: "Verifizierte Anbieterkennzeichnung, Anschrift und Kontakt für seomcp.de.",
    role: "legal_utility",
    sitemap: "never",
  },
  privacy: {
    path: "/datenschutz",
    title: "Datenschutz der statischen Projektseite",
    description:
      "Datenschutzhinweise zu Hosting, Server-Protokollen, Kontaktwegen und der derzeit statischen Pre-Launch-Infrastruktur von seomcp.de.",
    role: "legal_utility",
    sitemap: "never",
  },
  notFound: {
    path: "/404",
    title: "Seite nicht gefunden",
    description: "Der angeforderte Pfad ist auf seomcp.de nicht belegt.",
    role: "error",
    sitemap: "never",
  },
} as const;

export type SeoRouteKey = keyof typeof seoRoutes;
export type SeoRoute = (typeof seoRoutes)[SeoRouteKey];

export function evaluateLaunchReadiness(policy: LaunchPolicy = launchPolicy) {
  return (
    policy.indexWhenReady &&
    Object.values(policy.readiness).every(
      (gate) => gate.verified === true && typeof gate.evidence === "string" && gate.evidence.trim().length > 0,
    )
  );
}

export const indexingEnabled = evaluateLaunchReadiness();

export function isRouteIndexable(route: SeoRoute, enabled = indexingEnabled) {
  return enabled && route.sitemap === "launch";
}

export function getIndexableRoutes(enabled = indexingEnabled) {
  return Object.values(seoRoutes).filter((route) => isRouteIndexable(route, enabled));
}

export function getIndexableCanonicalUrls(enabled = indexingEnabled) {
  return getIndexableRoutes(enabled).map((route) => new URL(route.path, SITE_ORIGIN).href);
}

export function buildRobotsText(enabled = indexingEnabled) {
  const lines = ["User-agent: *", "Allow: /"];
  if (enabled) lines.push("", `Sitemap: ${new URL(SITEMAP_PATH, SITE_ORIGIN).href}`);
  return `${lines.join("\n")}\n`;
}

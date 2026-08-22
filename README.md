# seomcp.de

Public source repository for the future `seomcp.de` website.

## Current state

Designed pre-launch service surface and Vercel foundation. The future public MCP service is not launched yet. The current deployment is deliberately excluded from indexing and makes no endpoint, uptime, authorization, or capability claim.

## Standalone purpose

Diese Domain ist für Endpoint, Discovery-Metadaten, Autorisierung, Sicherheitskontakt und Status vorgesehen.

## Current status

Reservierte Infrastruktur mit Serviceplan, Sicherheitsgrenze und öffentlichem Projektstatus. Es ist noch kein öffentlicher MCP-Endpunkt freigegeben.

## Hard boundary

Keine Endpoint-, Uptime-, Auth- oder Capability-Behauptung ohne tatsächlich bereitgestellten und geprüften Dienst. Redaktionelle Inhalte gehören auf seo-mcp.de.

Primary portfolio relationship: `Contextter (akzeptiert)`.

## Local development

```bash
corepack pnpm install
corepack pnpm dev
```

Verification:

```bash
corepack pnpm verify
```

## Deployment

Vercel project: `seomcp-de`.

The public pre-launch surface remains crawlable, but carries page-level robots exclusions and an `X-Robots-Tag`. Its `robots.txt` allows crawling so crawlers can observe `noindex`. Remove those exclusions only when the real service passes its strategy, rights, disclosure, quality, security, and launch gates. Connecting the custom domain and changing DNS are separate operations.

## SEO and launch control

SEO metadata, launch readiness, canonical routes and sitemap eligibility are owned by `src/data/seo.ts`.
The official `@astrojs/sitemap` integration discovers built routes and includes only registry-approved,
indexable canonicals. The current service gates are not met, so the preview remains crawlable and noindex.
See `SEO_LAUNCH.md` for the evidence register and atomic release procedure.

## Rights

The domain is an owner-confirmed new registration, not an expired domain. There is no legacy site, former operator, archive identity, or historical brand to continue. Normal third-party rights still apply: this public repository grants no license to reuse external content, brands, media, datasets, or code. No open-source license is granted unless a later commit adds one explicitly.



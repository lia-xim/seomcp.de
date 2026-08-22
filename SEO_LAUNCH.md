# SEO and launch control for seomcp.de

## Current decision

The public preview remains crawlable and `noindex`. It is useful as direct transparency for developers,
operators and security reviewers, but it is not an independently useful search landing page while no real
MCP service exists. Indexing it now would create false product expectations and overlap with the editorial
job of `seo-mcp.de`.

## Evidence register

| Label | Evidence | Decision impact |
| --- | --- | --- |
| Verified | No public MCP endpoint or authentication flow is deployed. | Blocks service launch and indexing. |
| Verified | No named service/security owner or externally checked status/incident process is recorded. | Blocks operational claims and indexing. |
| Verified | The static pages, legal notice, privacy notice and security contact are live and testable. | Supports a public, crawlable noindex preview. |
| Supported | The prelaunch page has a direct transparency job but no distinct search job beyond the future service. | Keep accessible; do not index yet. |
| Rejected | Turning the site into a second MCP editorial library. | Editorial research remains on seo-mcp.de. |

## Central route and sitemap contract

- `src/data/seo.ts` owns route titles, descriptions, canonicals, page roles, sitemap eligibility and launch gates.
- `@astrojs/sitemap` discovers built Astro pages automatically and filters them through that registry.
- Only routes with `sitemap: "launch"` can enter the sitemap, and only when every readiness gate carries verified evidence.
- Legal, security, error, status, search and utility routes remain excluded unless their role is deliberately changed.
- `robots.txt` always permits crawling and references the sitemap only after the launch gates pass.
- `BaseLayout.astro` derives canonical and robots metadata from the same registry.
- `vercel.json` is guarded by `pnpm seo:check`; `pnpm seo:sync` updates X-Robots-Tag routes from the same launch state.

## Page-action matrix

| Route | Current role | Action | Launch condition |
| --- | --- | --- | --- |
| `/` | Transparent service prelaunch | Keep, strengthen, noindex | Index only with a verified minimum viable service. |
| `/security` | Security utility | Keep, noindex | Remains a utility route. |
| `/impressum` | Legal utility | Keep, noindex | Remains a utility route. |
| `/datenschutz` | Legal utility | Keep, noindex | Update when processing changes; remains utility. |
| `/404/` | Error | Keep, noindex, never sitemap | Never index. |

## Atomic launch procedure

1. Add the real service and operational evidence to every gate in `src/data/seo.ts`.
2. Add only genuinely useful service/documentation routes to the central registry with `sitemap: "launch"`.
3. Run `pnpm seo:sync`, then `pnpm verify`.
4. Verify that meta noindex and the global X-Robots-Tag are gone together, robots references the sitemap,
   and the sitemap contains only canonical indexable 200 pages.
5. Test apex, path-preserving www redirect, 404/410 behavior, internal links, legal pages, desktop/mobile and browser console.
6. Deploy, repeat live QA, then record exact evidence in DomainPortfolio and Search Console.

Changing one metadata tag is not a launch. The build remains blocked if the central policy and Vercel headers diverge.

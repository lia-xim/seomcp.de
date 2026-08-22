import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const domain = "seomcp.de";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const read = (relativePath) => readFile(join(root, relativePath), "utf8");
const readDist = (relativePath) => readFile(join(dist, relativePath), "utf8");
const exists = async (absolutePath) => { try { await access(absolutePath); return true; } catch { return false; } };

const [index, security, imprint, privacy, notFound, robots, securityTxt, css, vercelRaw, rightsRaw] = await Promise.all([
  readDist("index.html"),
  readDist(join("security", "index.html")),
  readDist(join("impressum", "index.html")),
  readDist(join("datenschutz", "index.html")),
  readDist("404.html"),
  readDist("robots.txt"),
  readDist(join(".well-known", "security.txt")),
  read("src/styles/global.css"),
  read("vercel.json"),
  read("src/data/rights-and-sources.v1.json"),
]);

const vercel = JSON.parse(vercelRaw);
const rights = JSON.parse(rightsRaw);
const failures = [];
const check = (passed, message) => { if (!passed) failures.push(message); };
const pages = [
  { name: "home", html: index, canonical: "https://seomcp.de/" },
  { name: "security", html: security, canonical: "https://seomcp.de/security" },
  { name: "imprint", html: imprint, canonical: "https://seomcp.de/impressum" },
  { name: "privacy", html: privacy, canonical: "https://seomcp.de/datenschutz" },
  { name: "404", html: notFound, canonical: "https://seomcp.de/404/" },
];

for (const page of pages) {
  check(page.html.includes('content="noindex, nofollow, noarchive"'), `${page.name}: must remain noindex`);
  check(page.html.includes(`rel="canonical" href="${page.canonical}"`), `${page.name}: canonical must be exact`);
  check(page.html.includes('href="#main-content"'), `${page.name}: skip link must target main`);
  check(page.html.includes('id="main-content"'), `${page.name}: main must expose skip target`);
  check(page.html.includes('href="/favicon.svg"'), `${page.name}: favicon must be linked`);
  check(!page.html.includes("__"), `${page.name}: placeholders must be replaced`);
}

check(index.includes(domain), `built page must name ${domain}`);
check(index.includes("Noch ist kein öffentlicher Endpoint freigegeben."), "home: pre-launch boundary must be explicit");
check(index.includes("Gemeinsamer Betreiber. Keine unabhängige Empfehlung."), "home: shared ownership must be explicit");
check(index.includes("PRE-LAUNCH / NOINDEX"), "home: visible pre-launch state must remain present");
check(!/(?:mcp|connect|status)\.seomcp\.de/.test(index), "home: must not publish speculative subdomains");
check(security.includes("GitHubs privaten Security-Advisory-Kanal"), "security: private reporting path must remain present");
check(notFound.includes("Unbekannte URLs werden nicht pauschal"), "404: no blanket redirect rule must be visible");

for (const fact of ["Matthias Ramahi", "Kempener Straße 44", "40699 Erkrath", "info@matthiasramahi.de", "+49 176 42 44 98 58"]) {
  check(imprint.includes(fact), `imprint: missing verified fact ${fact}`);
}
check(imprint.includes("neue Registrierung"), "imprint: fresh-domain correction must be explicit");
for (const fact of ["Vercel Inc.", "440 N Barranca Avenue #4133", "keine Anmeldung", "keine Analyse-", "keine Cookies", "keine externen Webfonts", "Local Storage", "Session Storage"]) {
  check(privacy.includes(fact), `privacy: missing actual-infrastructure disclosure ${fact}`);
}

check(robots.includes("User-agent: *"), "robots.txt must target all crawlers");
check(robots.includes("Allow: /"), "robots.txt must keep public preview crawlable");
check(!robots.includes("Disallow: /"), "robots.txt must not block noindex discovery");
check(securityTxt.includes("Contact: https://github.com/lia-xim/seomcp.de/security/advisories/new"), "security.txt must expose private contact");
check(securityTxt.includes("Policy: https://seomcp.de/security"), "security.txt must link policy");
check(css.includes(":focus-visible"), "CSS must include visible keyboard focus");
check(css.includes("prefers-reduced-motion"), "CSS must include reduced-motion fallback");

const headers = vercel.headers ?? [];
check(headers.some((entry) => entry.headers?.some((header) => header.key === "X-Robots-Tag" && header.value === "noindex, nofollow, noarchive")), "Vercel must emit pre-launch X-Robots-Tag");
check(!("redirects" in vercel), "Vercel must not add unreviewed redirects");
check(rights.schemaVersion === 1, "rights/source manifest schema must be version 1");
check(rights.rights?.domainOrigin === "new_registration", "rights manifest must record new registration");
check(rights.rights?.expiredDomain === false, "rights manifest must reject expired-domain status");
check(rights.rights?.formerOperatorOrSite === false, "rights manifest must reject former-site gate");
check(rights.rights?.thirdPartyMaterialRequiresRights === true, "rights manifest must retain ordinary third-party rights");
check(rights.sources?.some((source) => source.id === "operator-imprint-source"), "rights manifest must record operator source");
check(!(await exists(join(root, "src/data/legacy-url-actions.v1.json"))), "fresh domain must not retain a legacy URL manifest");

check(!(await exists(join(dist, "sitemap-index.xml"))) && !(await exists(join(dist, "sitemap.xml"))), "no sitemap may be emitted while every page is noindex");

const internalTargets = new Map([
  ["/", join(dist, "index.html")],
  ["/security", join(dist, "security", "index.html")],
  ["/impressum", join(dist, "impressum", "index.html")],
  ["/datenschutz", join(dist, "datenschutz", "index.html")],
  ["/.well-known/security.txt", join(dist, ".well-known", "security.txt")],
  ["/favicon.svg", join(dist, "favicon.svg")],
]);

for (const page of pages) {
  const hrefs = [...page.html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("/")) {
      const path = new URL(href, "https://seomcp.de/").pathname;
      if (path.startsWith("/_astro/")) { check(await exists(join(dist, path.slice(1))), `${page.name}: generated asset ${path} is broken`); continue; }
      const target = internalTargets.get(path);
      check(Boolean(target), `${page.name}: internal link ${path} is not registered`);
      if (target) check(await exists(target), `${page.name}: internal link ${path} is broken`);
    } else if (/^https?:/.test(href)) {
      try { new URL(href); } catch { failures.push(`${page.name}: external link is invalid: ${href}`); }
    }
  }
}

for (const claim of ["99.9% Uptime", "Endpoint ist live", "Jetzt mit MCP verbinden", "Alle Systeme funktionieren", "Sofort authentifizieren"]) {
  check(!index.includes(claim), `forbidden unverified claim found: ${claim}`);
}

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`QA passed for ${domain}: routes, legal pages, 404, canonicals, crawlable noindex, security, links, rights, accessibility and forbidden claims`);

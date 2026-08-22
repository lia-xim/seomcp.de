import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRobotsText,
  evaluateLaunchReadiness,
  getIndexableCanonicalUrls,
  indexingEnabled,
  isRouteIndexable,
  launchPolicy,
  NOINDEX_DIRECTIVE,
  seoRoutes,
  SITE_ORIGIN,
} from "../src/data/seo.ts";
import { expectedSeoHeaders } from "./seo-headers-core.mjs";

const domain = "seomcp.de";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const read = (path) => readFile(join(root, path), "utf8");
const readDist = (path) => readFile(join(dist, path), "utf8");
const exists = async (path) => { try { await access(path); return true; } catch { return false; } };

const pageFiles = {
  home: "index.html",
  security: join("security", "index.html"),
  imprint: join("impressum", "index.html"),
  privacy: join("datenschutz", "index.html"),
  notFound: "404.html",
};
const pageEntries = await Promise.all(Object.entries(pageFiles).map(async ([key, file]) => [key, await readDist(file)]));
const pages = Object.fromEntries(pageEntries);
const [robots, securityTxt, css, vercelRaw, rightsRaw] = await Promise.all([
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

for (const [key, html] of Object.entries(pages)) {
  const route = seoRoutes[key];
  const canonical = new URL(route.path, SITE_ORIGIN).href;
  const robotsDirective = isRouteIndexable(route) ? "index, follow" : NOINDEX_DIRECTIVE;
  const title = `${route.title} | ${domain}`;
  check(html.includes(`content="${robotsDirective}"`), `${key}: robots directive must match registry`);
  check(html.includes(`name="description" content="${route.description}"`), `${key}: description must match registry`);
  check(html.includes(`rel="canonical" href="${canonical}"`), `${key}: canonical must match registry`);
  check(html.includes(`<title>${title}</title>`), `${key}: title must match registry`);
  check(html.includes(`property="og:url" content="${canonical}"`), `${key}: Open Graph URL must match canonical`);
  check(html.includes(`property="og:title" content="${title}"`), `${key}: Open Graph title must match title`);
  check(html.includes('href="#main-content"') && html.includes('id="main-content"'), `${key}: skip link and main target required`);
  check(html.includes('href="/favicon.svg"'), `${key}: favicon must be linked`);
  check(!html.includes("__"), `${key}: placeholders must be replaced`);
}

const index = pages.home;
const security = pages.security;
const imprint = pages.imprint;
const privacy = pages.privacy;
const notFound = pages.notFound;
check(index.includes("Noch ist kein öffentlicher Endpoint freigegeben."), "home: pre-launch boundary must be explicit");
check(index.includes("Gemeinsamer Betreiber. Keine unabhängige Empfehlung."), "home: shared ownership must be explicit");
check(index.includes("PRE-LAUNCH / NOINDEX"), "home: visible pre-launch state must remain present");
check(!/(?:mcp|connect|status)\.seomcp\.de/.test(index), "home: must not publish speculative subdomains");
check(security.includes("GitHubs privaten Security-Advisory-Kanal"), "security: private reporting path required");
check(notFound.includes("Unbekannte URLs werden nicht pauschal"), "404: no blanket redirect rule required");
for (const fact of ["Matthias Ramahi", "Kempener Straße 44", "40699 Erkrath", "info@matthiasramahi.de", "+49 176 42 44 98 58"]) check(imprint.includes(fact), `imprint: missing ${fact}`);
for (const fact of ["Vercel Inc.", "440 N Barranca Avenue #4133", "keine Anmeldung", "keine Analyse-", "keine Cookies", "keine externen Webfonts", "Local Storage", "Session Storage"]) check(privacy.includes(fact), `privacy: missing ${fact}`);

check(robots === buildRobotsText(), "robots.txt must be generated from central launch policy");
check(robots.includes("Allow: /") && !robots.includes("Disallow: /"), "robots.txt must stay crawlable");
check(robots.includes("Sitemap:") === indexingEnabled, "robots sitemap discovery must switch with indexing state");
check(securityTxt.includes("Preferred-Languages: de, en"), "security.txt must expose preferred languages");
check(securityTxt.includes("Contact: https://github.com/lia-xim/seomcp.de/security/advisories/new"), "security.txt contact required");
check(css.includes(":focus-visible") && css.includes("prefers-reduced-motion"), "accessibility CSS required");

check(JSON.stringify(vercel.headers ?? []) === JSON.stringify(expectedSeoHeaders(indexingEnabled)), "Vercel X-Robots headers must match central launch policy");
check(!("redirects" in vercel), "Vercel must not add unreviewed redirects");

const sitemapFiles = (await readdir(dist)).filter((name) => /^sitemap(?:-|\.)[^/]*\.xml$/.test(name));
const urlSitemapFiles = sitemapFiles.filter((name) => name !== "sitemap-index.xml");
const sitemapBodies = await Promise.all(urlSitemapFiles.map((name) => readDist(name)));
const sitemapUrls = sitemapBodies.flatMap((xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const expectedSitemapUrls = getIndexableCanonicalUrls();
const normalizedSitemapUrls = sitemapUrls.map((url) => new URL(url).href);
check(JSON.stringify([...normalizedSitemapUrls].sort()) === JSON.stringify([...expectedSitemapUrls].sort()), "sitemap must contain exactly registry-approved indexable canonicals");
for (const url of sitemapUrls) {
  check(url.startsWith(SITE_ORIGIN), `sitemap URL must use canonical origin: ${url}`);
  check(!/[?#]/.test(url), `sitemap URL must not contain query or fragment: ${url}`);
}
check(!sitemapUrls.some((url) => /(?:security|impressum|datenschutz|404)/.test(url)), "utility, legal and error routes must stay outside sitemap");

const simulatedPolicy = {
  ...launchPolicy,
  readiness: Object.fromEntries(Object.entries(launchPolicy.readiness).map(([key, gate]) => [key, { ...gate, verified: true, evidence: `verified-${key}` }])),
};
check(evaluateLaunchReadiness(simulatedPolicy) === true, "all evidenced gates must enable launch simulation");
check(getIndexableCanonicalUrls(true).length === 1 && getIndexableCanonicalUrls(true)[0] === SITE_ORIGIN, "launch simulation must include only the home canonical");
check(buildRobotsText(true).includes(`Sitemap: ${SITE_ORIGIN}sitemap-index.xml`), "launch robots simulation must advertise sitemap");
check(indexingEnabled === false, "current build must remain noindex while service gates are open");

check(rights.sources?.some((source) => source.id === "google-noindex"), "source manifest must record Google noindex guidance");
check(rights.sources?.some((source) => source.id === "google-sitemaps"), "source manifest must record Google sitemap guidance");
check(rights.sources?.some((source) => source.id === "astro-sitemap"), "source manifest must record Astro sitemap guidance");

const internalTargets = new Map(Object.values(seoRoutes).filter((route) => route.role !== "error").map((route) => [route.path, route.path === "/" ? join(dist, "index.html") : join(dist, route.path.slice(1), "index.html")]));
internalTargets.set("/.well-known/security.txt", join(dist, ".well-known", "security.txt"));
internalTargets.set("/favicon.svg", join(dist, "favicon.svg"));
for (const [key, html] of Object.entries(pages)) {
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("/")) {
      const path = new URL(href, SITE_ORIGIN).pathname;
      if (path.startsWith("/_astro/")) { check(await exists(join(dist, path.slice(1))), `${key}: broken asset ${path}`); continue; }
      const target = internalTargets.get(path);
      check(Boolean(target), `${key}: internal link ${path} is not registered`);
      if (target) check(await exists(target), `${key}: internal link ${path} is broken`);
    } else if (/^https?:/.test(href)) { try { new URL(href); } catch { failures.push(`${key}: invalid external link ${href}`); } }
  }
}

for (const claim of ["99.9% Uptime", "Endpoint ist live", "Jetzt mit MCP verbinden", "Alle Systeme funktionieren", "Sofort authentifizieren"]) check(!index.includes(claim), `forbidden unverified claim: ${claim}`);

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`QA passed for ${domain}: central SEO registry, metadata, conditional sitemap, crawlable noindex, launch simulation, legal/security discovery, links and claims`);

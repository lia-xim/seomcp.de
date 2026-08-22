import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://127.0.0.1:4321").replace(/\/$/, "");
const output = process.argv[3] ?? path.join(os.tmpdir(), "seomcp-browser-qa");
const live = base === "https://seomcp.de";
const routes = [
  { path: "/", canonical: "https://seomcp.de/", status: 200 },
  { path: "/security", canonical: "https://seomcp.de/security", status: 200 },
  { path: "/service-contract", canonical: "https://seomcp.de/service-contract", status: 200 },
  { path: "/capabilities", canonical: "https://seomcp.de/capabilities", status: 200 },
  { path: "/authorization", canonical: "https://seomcp.de/authorization", status: 200 },
  { path: "/status", canonical: "https://seomcp.de/status", status: 200 },
  { path: "/impressum", canonical: "https://seomcp.de/impressum", status: 200 },
  { path: "/datenschutz", canonical: "https://seomcp.de/datenschutz", status: 200 },
  { path: "/404", canonical: "https://seomcp.de/404", status: live ? 404 : 200 },
];
const failures = [];
const evidence = { base, viewports: {}, http: null };
const check = (value, message) => { if (!value) failures.push(message); };
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await context.newPage();
  const consoleErrors = [];
  const consoleWarnings = [];
  const requestFailures = [];
  const httpFailures = [];
  page.on("response", (response) => {
    if (response.status() < 400) return;
    const url = new URL(response.url());
    const expectedDocument404 = response.request().resourceType() === "document" && url.pathname === "/404";
    if (!expectedDocument404) httpFailures.push(`${response.status()} ${response.url()}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
    if (message.type() === "warning") consoleWarnings.push(message.text());
  });
  page.on("requestfailed", (request) => requestFailures.push(`${request.url()} ${request.failure()?.errorText ?? "unknown"}`));
  const routeResults = {};

  for (const { path: route, canonical, status: expectedStatus } of routes) {
    const routeConsoleStart = consoleErrors.length;
    const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      return {
        dcl: Math.round(nav?.domContentLoadedEventEnd ?? 0),
        load: Math.round(nav?.loadEventEnd ?? 0),
        resources: resources.length,
        transferBytes: Math.round(resources.reduce((sum, item) => sum + (item.transferSize || 0), 0)),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });
    const result = {
      status: response?.status(),
      h1: await page.locator("h1").count(),
      canonical: await page.locator('link[rel="canonical"]').getAttribute("href"),
      robots: await page.locator('meta[name="robots"]').getAttribute("content"),
      ogUrl: await page.locator('meta[property="og:url"]').getAttribute("content"),
      twitterCard: await page.locator('meta[name="twitter:card"]').getAttribute("content"),
      axe: axe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })),
      metrics,
    };
    routeResults[route] = result;
    check(result.status === expectedStatus, `${viewport.width}px ${route}: status ${result.status}, expected ${expectedStatus}`);
    check(result.h1 === 1, `${viewport.width}px ${route}: h1 ${result.h1}`);
    check(result.canonical === canonical && result.ogUrl === canonical, `${viewport.width}px ${route}: canonical/social mismatch`);
    check(result.robots === "noindex, follow, noarchive", `${viewport.width}px ${route}: robots mismatch`);
    check(result.twitterCard === "summary", `${viewport.width}px ${route}: Twitter card mismatch`);
    check(!metrics.overflow, `${viewport.width}px ${route}: overflow`);
    check(metrics.dcl < 2500 && metrics.load < 4000, `${viewport.width}px ${route}: performance dcl=${metrics.dcl} load=${metrics.load}`);
    check(metrics.resources <= 20 && metrics.transferBytes <= 1_000_000, `${viewport.width}px ${route}: payload resources=${metrics.resources} bytes=${metrics.transferBytes}`);
    check(axe.violations.length === 0, `${viewport.width}px ${route}: Axe ${axe.violations.map((item) => item.id).join(",")}`);
    if (route === "/404" && result.status === expectedStatus) {
      const unexpectedRouteErrors = consoleErrors
        .slice(routeConsoleStart)
        .filter((message) => !/^Failed to load resource: the server responded with a status of 404(?: \((?:Not Found)?\))?$/.test(message));
      consoleErrors.splice(routeConsoleStart, consoleErrors.length - routeConsoleStart, ...unexpectedRouteErrors);
    }
  }

  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const node = document.activeElement;
    const style = node instanceof HTMLElement ? getComputedStyle(node) : null;
    return { className: String(node?.className ?? ""), visible: node instanceof HTMLElement && node.getBoundingClientRect().height > 0, outline: style?.outlineStyle ?? "none" };
  });
  check(focus.className.includes("skip-link") && focus.visible && focus.outline !== "none", `${viewport.width}px: skip focus not visible`);
  await page.keyboard.press("Enter");
  check(new URL(page.url()).hash === "#main-content", `${viewport.width}px: skip link failed`);
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Vorhaben ansehen" }).click();
  check(new URL(page.url()).hash === "#vorhaben" && await page.locator("#vorhaben").isVisible(), `${viewport.width}px: primary interaction failed`);
  await page.getByRole("link", { name: "Impressum" }).last().click();
  await page.waitForURL(/\/impressum$/);
  check(page.url().endsWith("/impressum"), `${viewport.width}px: legal navigation failed`);
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Service-Zugang" }).click();
  await page.waitForURL(/\/service-contract$/);
  check((await page.locator("main").innerText()).includes("NOT PROVEN"), `${viewport.width}px: contract discovery failed`);
  await page.getByRole("link", { name: "Launch-Status" }).last().click();
  await page.waitForURL(/\/status$/);
  check((await page.locator("main").innerText()).includes("kein Uptime-Monitor"), `${viewport.width}px: status boundary failed`);
  const unexpectedConsoleErrors = consoleErrors.filter(
    (message) => !/^Failed to load resource: the server responded with a status of 404(?: \((?:Not Found)?\))?$/.test(message),
  );
  check(unexpectedConsoleErrors.length === 0, `${viewport.width}px: console ${unexpectedConsoleErrors.join(" | ")}`);
  check(requestFailures.length === 0, `${viewport.width}px: requests ${requestFailures.join(" | ")}`);
  check(httpFailures.length === 0, `${viewport.width}px: HTTP resources ${httpFailures.join(" | ")}`);
  await page.goto(`${base}/security`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "/.well-known/security.txt" }).click();
  await page.waitForURL(/\/\.well-known\/security\.txt$/);
  check((await page.locator("body").innerText()).includes("Contact: mailto:info@matthiasramahi.de"), `${viewport.width}px: security discovery failed`);
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const screenshot = `${output}/seomcp-hardening-${live ? "live" : "local"}-${viewport.width}.png`;
  await page.screenshot({ path: screenshot, fullPage: true });
  evidence.viewports[viewport.width] = {
    routes: routeResults,
    focus,
    consoleErrors: unexpectedConsoleErrors,
    expected404ConsoleSignals: consoleErrors.length - unexpectedConsoleErrors.length,
    consoleWarnings,
    requestFailures,
    httpFailures,
    screenshot,
  };
  await context.close();
}

async function request(url) {
  const response = await fetch(url, { redirect: "manual" });
  return { url, status: response.status, location: response.headers.get("location"), headers: Object.fromEntries(response.headers.entries()), text: await response.text() };
}

async function trace(start) {
  const hops = [];
  let url = start;
  for (let count = 0; count < 5; count += 1) {
    const response = await request(url);
    hops.push({ url, status: response.status, location: response.location });
    if (![301, 302, 303, 307, 308].includes(response.status) || !response.location) return { hops, final: url, response };
    url = new URL(response.location, url).href;
  }
  return { hops, final: url, response: null };
}

if (live) {
  const apex = await request(`${base}/`);
  const robots = await request(`${base}/robots.txt`);
  const sitemap = await request(`${base}/sitemap.xml`);
  const sitemapIndex = await request(`${base}/sitemap-index.xml`);
  const missing = await request(`${base}/__hardening_missing__`);
  const securityTxt = await request(`${base}/.well-known/security.txt`);
  const notFoundSlash = await trace(`${base}/404/?source=canonical-audit`);
  const starts = [
    "https://seomcp.de/security/?source=https-apex",
    "https://www.seomcp.de/security/?source=https-www",
    "http://seomcp.de/security/?source=http-apex",
    "http://www.seomcp.de/security/?source=http-www",
  ];
  const traces = await Promise.all(starts.map(trace));
  const expected = starts.map((start) => { const url = new URL(start); return `https://seomcp.de${url.pathname.replace(/\/$/, "")}${url.search}`; });
  const expectedHeaders = {
    "content-security-policy": "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'none'; frame-ancestors 'none'; img-src 'self' data:; manifest-src 'self'; media-src 'self'; object-src 'none'; script-src 'none'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    "x-frame-options": "DENY",
    "x-robots-tag": "noindex, follow, noarchive",
  };
  check(apex.status === 200, `apex status ${apex.status}`);
  for (const [name, value] of Object.entries(expectedHeaders)) check(apex.headers[name] === value, `header ${name} mismatch`);
  check(robots.status === 200 && robots.text.includes("Allow: /") && !robots.text.includes("Disallow: /") && !robots.text.includes("Sitemap:"), "robots contract failed");
  check(sitemap.status === 404 && sitemapIndex.status === 404, "sitemap must remain 404");
  check(missing.status === 404, `missing route ${missing.status}`);
  check(missing.text.includes('rel="canonical" href="https://seomcp.de/404"'), "missing route canonical failed");
  check(
    securityTxt.status === 200 &&
      securityTxt.text.includes("Preferred-Languages: de, en") &&
      securityTxt.text.includes("Contact: mailto:info@matthiasramahi.de"),
    "security.txt failed",
  );
  check(
    notFoundSlash.final === `${base}/404?source=canonical-audit` &&
      notFoundSlash.hops.length === 2 &&
      notFoundSlash.hops[0].status === 308 &&
      notFoundSlash.response?.status === 404,
    `404 slash normalization failed ${JSON.stringify(notFoundSlash.hops)}`,
  );
  traces.forEach((item, index) => {
    check(item.final === expected[index], `redirect final ${item.final}`);
    check(item.hops.length <= 4 && item.hops.slice(0, -1).every((hop) => hop.status === 308), `redirect trace ${JSON.stringify(item.hops)}`);
    check(item.response?.status === 200, `redirect final status ${item.response?.status}`);
  });
  evidence.http = { apex: { status: apex.status, headers: apex.headers }, robots: robots.status, sitemap: sitemap.status, sitemapIndex: sitemapIndex.status, missing: missing.status, securityTxt: securityTxt.status, notFoundSlash, traces };
}

await browser.close();
await fs.writeFile(`${output}/seomcp-hardening-${live ? "live" : "local"}-evidence.json`, JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({ ok: failures.length === 0, failures, evidence }, null, 2));
process.exitCode = failures.length ? 1 : 0;

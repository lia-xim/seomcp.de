export const noindexDirective = "noindex, follow, noarchive";

export const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self'",
  "font-src 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data:",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "script-src 'none'",
  "style-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests",
].join("; ");

export const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

const robotsHeader = () => [{ key: "X-Robots-Tag", value: noindexDirective }];

export function expectedSeoHeaders(indexingEnabled) {
  const globalHeaders = indexingEnabled ? securityHeaders : [...securityHeaders, ...robotsHeader()];
  const headers = [{ source: "/(.*)", headers: globalHeaders }];

  if (indexingEnabled) {
    headers.push(
      { source: "/security", headers: robotsHeader() },
      { source: "/impressum", headers: robotsHeader() },
      { source: "/datenschutz", headers: robotsHeader() },
      { source: "/.well-known/(.*)", headers: robotsHeader() },
    );
  }

  return headers;
}

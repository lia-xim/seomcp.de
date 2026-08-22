export const noindexDirective = "noindex, follow, noarchive";

const header = () => [{ key: "X-Robots-Tag", value: noindexDirective }];

export function expectedSeoHeaders(indexingEnabled) {
  if (!indexingEnabled) return [{ source: "/(.*)", headers: header() }];
  return [
    { source: "/security", headers: header() },
    { source: "/impressum", headers: header() },
    { source: "/datenschutz", headers: header() },
    { source: "/.well-known/(.*)", headers: header() },
  ];
}

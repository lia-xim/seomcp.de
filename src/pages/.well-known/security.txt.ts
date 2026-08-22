import type { APIRoute } from "astro";
import { site } from "../../data/site";

export const GET: APIRoute = () =>
  new Response(
    [
      "Contact: " + site.links.securityAdvisory,
      "Canonical: " + new URL("/.well-known/security.txt", site.canonicalUrl),
      "Policy: " + new URL("/security", site.canonicalUrl),
      "Expires: 2027-08-22T00:00:00.000Z",
      "",
    ].join("\n"),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );

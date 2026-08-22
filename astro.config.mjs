import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { getIndexableCanonicalUrls, indexingEnabled, SITE_ORIGIN } from "./src/data/seo.ts";

const sitemapUrls = new Set(getIndexableCanonicalUrls());

export default defineConfig({
  site: SITE_ORIGIN,
  output: "static",
  trailingSlash: "never",
  integrations: indexingEnabled
    ? [
        sitemap({
          filter: (page) => sitemapUrls.has(new URL(page).href),
        }),
      ]
    : [],
});

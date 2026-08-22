import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { indexingEnabled } from "../src/data/seo.ts";
import { expectedSeoHeaders } from "./seo-headers-core.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const path = join(root, "vercel.json");
const config = JSON.parse(await readFile(path, "utf8"));
const expected = expectedSeoHeaders(indexingEnabled);
const mode = process.argv[2] ?? "--check";

if (mode === "--write") {
  config.headers = expected;
  await writeFile(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(`Synced Vercel SEO headers for indexingEnabled=${indexingEnabled}`);
} else if (mode === "--check") {
  if (JSON.stringify(config.headers ?? []) !== JSON.stringify(expected)) {
    console.error("vercel.json SEO headers do not match the central launch policy. Run: pnpm seo:sync");
    process.exit(1);
  }
  console.log(`Vercel SEO headers match indexingEnabled=${indexingEnabled}`);
} else {
  console.error("Use --check or --write");
  process.exit(1);
}

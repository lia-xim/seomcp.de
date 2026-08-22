import type { APIRoute } from "astro";
import { buildRobotsText } from "../data/seo";

export const GET: APIRoute = () =>
  new Response(buildRobotsText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

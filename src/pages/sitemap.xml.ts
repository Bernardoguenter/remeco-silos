import type { APIRoute } from "astro";
import { getSilosByType } from "@lib/silos";

export const GET: APIRoute = async () => {
  const baseUrl = "https://silosremeco.com";
  const staticRoutes = ["/", "/contacto", "/silos"];
  const siloTypes = ["aereos", "comederos"];
  const dynamicRoutes: string[] = [];

  for (const type of siloTypes) {
    try {
      const silos = await getSilosByType(type);
      for (const silo of silos) {
        dynamicRoutes.push(`/silos/${type}/${encodeURIComponent(silo.name)}`);
      }
    } catch (err) {
      console.error(`Error cargando silos de tipo "${type}":`, err);
    }
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${
      path === "/" ? "1.0" : path.startsWith("/silos") ? "0.8" : "0.9"
    }</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};

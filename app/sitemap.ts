import type { MetadataRoute } from "next";
import { emberlogPath } from "@/lib/emberlog";
import { portfolio } from "@/lib/portfolio-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/showcase",
    emberlogPath,
    `${emberlogPath}/docs`,
    `${emberlogPath}/pricing`,
  ].map((path) => ({ url: `${portfolio.url}${path}` }));
}

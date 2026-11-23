import type { MetadataRoute } from "next";
import { portfolio } from "@/lib/portfolio-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/showcase"].map((path) => ({ url: `${portfolio.url}${path}` }));
}

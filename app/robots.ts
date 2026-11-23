import type { MetadataRoute } from "next";
import { portfolio } from "@/lib/portfolio-content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", portfolio.url).toString(),
  };
}

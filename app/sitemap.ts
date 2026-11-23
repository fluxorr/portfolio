import type { MetadataRoute } from "next";
import { directions, monographPath } from "@/app/showcase/monograph/directions";
import { emberlogPath } from "@/lib/emberlog";
import { portfolio } from "@/lib/portfolio-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/showcase",
    emberlogPath,
    `${emberlogPath}/docs`,
    `${emberlogPath}/pricing`,
    "/showcase/commonhour",
    monographPath,
    `${monographPath}/studio`,
    ...directions.map(({ slug }) => `${monographPath}/directions/${slug}`),
  ].map((path) => ({ url: `${portfolio.url}${path}` }));
}

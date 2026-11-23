import type { Metadata } from "next";
import { directions, monographOg, monographPath } from "../directions";
import { Studio } from "./studio";
import { studioTools } from "./tools";

export const metadata: Metadata = {
  title: "Monograph Studio — Interactive demo",
  description:
    "Edit an example creative direction in the Monograph Studio prototype.",
  alternates: { canonical: `${monographPath}/studio` },
  openGraph: {
    title: "Monograph Studio",
    description: "An interactive creative direction prototype.",
    images: [monographOg],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monograph Studio",
    images: [monographOg],
  },
};

type Props = {
  searchParams: Promise<{
    direction?: string;
    brief?: string;
    paper?: string;
    tool?: string;
  }>;
};

export default async function StudioPage({ searchParams }: Props) {
  const query = await searchParams;
  const direction =
    directions.find(({ slug }) => slug === query.direction) ?? directions[0];
  const incomingBrief =
    typeof query.brief === "string" ? query.brief.trim().slice(0, 180) : "";

  const paper = direction.palette.find((color) => color === query.paper);
  const tool =
    studioTools.find(({ id }) => id === query.tool)?.id ??
    (paper ? "palette" : "type");

  return (
    <Studio
      key={`${direction.slug}:${tool}:${paper}:${incomingBrief}`}
      initialSlug={direction.slug}
      initialBrief={incomingBrief || direction.brief}
      initialPaper={paper}
      initialTool={tool}
    />
  );
}

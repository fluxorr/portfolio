import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/portfolio/links";
import { atelierFonts } from "@/lib/atelier/fonts";
import { type StudySlug, studies } from "@/lib/atelier/studies";
import "@/components/atelier/study-common.css";
import "../study.css";

const tools = {
  palimpsest: dynamic(() =>
    import("@/components/atelier/palimpsest").then(
      (module) => module.Palimpsest,
    ),
  ),
  isobar: dynamic(() =>
    import("@/components/atelier/isobar").then((module) => module.Isobar),
  ),
  switchyard: dynamic(() =>
    import("@/components/atelier/switchyard").then(
      (module) => module.Switchyard,
    ),
  ),
  "figure-zero": dynamic(() =>
    import("@/components/atelier/figure-zero").then(
      (module) => module.FigureZero,
    ),
  ),
  meridian: dynamic(() =>
    import("@/components/atelier/meridian").then((module) => module.Meridian),
  ),
};

type Props = { params: Promise<{ slug: StudySlug }> };

export function generateStaticParams() {
  return studies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = studies.find((item) => item.slug === slug);
  if (!study) return {};
  const title = `${study.name} — Atelier / 05`;
  return {
    title,
    description: study.description,
    alternates: { canonical: `/studies/${slug}` },
    openGraph: {
      title,
      description: study.description,
      url: `/studies/${slug}`,
    },
  };
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;
  const index = studies.findIndex((item) => item.slug === slug);
  const study = studies[index];
  if (!study) notFound();
  const Component = tools[study.slug];
  const next = studies[(index + 1) % studies.length];
  return (
    <div className={`atelier-study ${atelierFonts}`} data-study={slug}>
      <a className="study-skip" href="#study-playground">
        Skip to the interactive study
      </a>
      <header className="study-shell study-nav">
        <Link
          href="/showcase#components"
          prefetch={false}
          className="study-return"
        >
          <span aria-hidden="true">←</span> Atelier / 05
        </Link>
        <span className="study-code">Study {study.number} / 05</span>
      </header>
      <main className="study-shell">
        <div className="study-intro">
          <div>
            <p className="study-code">{study.job}</p>
            <h1>{study.name}</h1>
          </div>
          <p>{study.description}</p>
        </div>
        <section
          id="study-playground"
          tabIndex={-1}
          aria-label={`${study.name} interactive playground`}
        >
          <Component />
        </section>
        <div className="study-colophon">
          <div>
            <h2>Implementation notes</h2>
            <p>{study.note}</p>
          </div>
          <Link href={`/studies/${next.slug}`} prefetch={false}>
            <small className="study-code">Next study · {next.number}</small>
            <span>
              {next.name} <Arrow direction="out" />
            </span>
          </Link>
        </div>
      </main>
      <footer className="study-shell study-site-footer">
        <Link href="/showcase#components" prefetch={false}>
          All five studies
        </Link>
        <Link href="/#contact" prefetch={false}>
          Get in touch <Arrow direction="out" />
        </Link>
      </footer>
    </div>
  );
}

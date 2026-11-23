import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import {
  directionImage,
  directions,
  monographPath,
  studioHref,
} from "../../directions";
import { Icon, Wordmark } from "../../identity";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return directions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const direction = directions.find((item) => item.slug === slug);
  if (!direction) notFound();

  const title = `${direction.name} — Monograph Directions`;
  const url = `${monographPath}/directions/${direction.slug}`;
  return {
    title,
    description: direction.brief,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      description: direction.brief,
      images: [
        {
          url: directionImage(direction.slug),
          width: 512,
          height: 512,
          alt: direction.subject,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: direction.brief,
      images: [directionImage(direction.slug)],
    },
  };
}

export default async function DirectionPage({ params }: Props) {
  const { slug } = await params;
  const index = directions.findIndex((item) => item.slug === slug);
  const direction = directions[index];
  if (!direction) notFound();
  const next = directions[(index + 1) % directions.length];

  return (
    <>
      <header className="mg-header mg-shell mg-inner-header">
        <Wordmark />
        <Link className="mg-link" href={`${monographPath}#directions`}>
          <Icon name="left" /> All directions
        </Link>
      </header>
      <main className="mg-shell mg-case">
        <div
          className="mg-case-hero"
          style={
            {
              "--case-paper": direction.palette[0],
              "--case-ink": direction.palette[2],
            } as CSSProperties
          }
        >
          <div className="mg-case-title" data-type={direction.type}>
            <p className="mg-kicker">{direction.category}</p>
            <h1>{direction.name}</h1>
            <p>{direction.line}</p>
          </div>
          <div className="mg-case-photo">
            <Image
              alt={direction.subject}
              src={directionImage(direction.slug)}
              fill
              sizes="(max-width: 780px) 94vw, 50vw"
              preload
            />
          </div>
        </div>
        <section className="mg-case-info">
          <div>
            <p className="mg-kicker">The brief</p>
            <h2>{direction.brief}</h2>
          </div>
          <div>
            <p className="mg-kicker">Art direction</p>
            <p>{direction.rationale}</p>
            <Link className="mg-button" href={studioHref(direction.slug)}>
              Remix in Studio <Icon name="out" />
            </Link>
          </div>
        </section>
        <div className="mg-case-swatches">
          {direction.palette.map((color, colorIndex) => (
            <div key={color}>
              <span style={{ background: color }} />
              <p>
                {direction.labels[colorIndex]} <code>{color}</code>
              </p>
            </div>
          ))}
        </div>
        <Link
          className="mg-next-direction"
          href={`${monographPath}/directions/${next.slug}`}
        >
          <span>
            <span className="mg-kicker">Next direction</span>
            <strong>{next.name}</strong>
          </span>
          <Icon name="right" />
        </Link>
      </main>
    </>
  );
}

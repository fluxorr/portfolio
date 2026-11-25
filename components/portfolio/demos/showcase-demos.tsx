import Image from "next/image";
import Link from "next/link";
import {
  monographOg,
  monographOgAlt,
} from "@/app/showcase/monograph/directions";
import { AtelierGallery } from "@/components/atelier/gallery";
import { commonhourImage } from "@/lib/commonhour";
import { emberlogImage } from "@/lib/emberlog";
import { memoirOg, memoirOgAlt } from "@/lib/memoir";
import { Arrow } from "../links";

const conceptSites = [
  {
    name: "Emberlog",
    type: "Developer-tool website",
    slug: "emberlog",
    image: emberlogImage,
    wideCover: false,
    coverBackground: "#f7f7f4",
    alt: "Emberlog’s request timeline with an ember playhead and the headline Rewind any request.",
  },
  {
    name: "Commonhour",
    type: "Scheduling product",
    slug: "commonhour",
    image: commonhourImage,
    wideCover: false,
    coverBackground: "#f4f3f8",
    alt: "Commonhour’s live booking workspace on a cobalt dithered background.",
  },
  {
    name: "Monograph",
    type: "AI creative direction studio",
    slug: "monograph",
    image: monographOg,
    alt: monographOgAlt,
    wideCover: true,
  },
  {
    name: "Memoir",
    type: "AI memory workspace",
    slug: "memoir",
    image: memoirOg,
    alt: memoirOgAlt,
    wideCover: true,
    coverBackground: "#151515",
  },
];

export function ShowcaseDemos() {
  return (
    <>
      <section
        aria-labelledby="demo-blocks-title"
        className="showcase-section demo-section"
        id="blocks"
      >
        <h2 id="demo-blocks-title">Concept sites</h2>
        <div className="demo-block-stack">
          {conceptSites.map((block) => (
            <article
              aria-labelledby={`${block.slug}-preview-title`}
              className={block.wideCover ? "demo-block-wide" : undefined}
              key={block.slug}
            >
              <Link
                aria-label={`Open ${block.name} concept site`}
                className="demo-block-link"
                href={`/showcase/${block.slug}`}
                prefetch={false}
              >
                <div
                  className="demo-block-preview"
                  style={
                    block.coverBackground
                      ? { background: block.coverBackground }
                      : undefined
                  }
                >
                  <Image
                    alt={block.alt}
                    fill
                    sizes={
                      block.wideCover
                        ? "(max-width: 1200px) 94vw, 1130px"
                        : "(max-width: 767px) 92vw, (max-width: 1200px) 46vw, 550px"
                    }
                    src={block.image}
                    style={
                      block.coverBackground
                        ? { objectFit: "contain" }
                        : undefined
                    }
                  />
                </div>
                <div className="demo-block-caption">
                  <div>
                    <h3 id={`${block.slug}-preview-title`}>{block.name}</h3>
                    <p>{block.type}</p>
                  </div>
                  <span className="portfolio-button portfolio-button--secondary">
                    Open site <Arrow direction="out" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <AtelierGallery />
    </>
  );
}

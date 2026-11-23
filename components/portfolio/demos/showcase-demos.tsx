import Image from "next/image";
import Link from "next/link";
import {
  monographOg,
  monographOgAlt,
} from "@/app/showcase/monograph/directions";
import { commonhourImage, commonhourPath } from "@/lib/commonhour";
import { emberlogImage } from "@/lib/emberlog";
import { portfolio } from "@/lib/portfolio-content";
import { Arrow } from "../links";
import { GlassFolder } from "./glass-folder";
import { LiquidCheckout } from "./liquid-checkout";
import { SlipsWallet } from "./slips-wallet";

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
];

export function ShowcaseDemos() {
  const slips = portfolio.work.items.find(({ id }) => id === "slips");

  return (
    <>
      <section
        aria-labelledby="demo-components-title"
        className="showcase-section demo-section"
        id="components"
      >
        <h2 id="demo-components-title">Components</h2>
        <div className="demo-component-grid">
          <article
            aria-labelledby="demo-wallet-title"
            className="demo-card demo-wallet-feature"
          >
            <div className="demo-wallet-heading">
              <h3 id="demo-wallet-title">Slips invoice wallet</h3>
              {slips && (
                <a
                  className="portfolio-button portfolio-button--text"
                  href={slips.liveUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View Slips <Arrow direction="out" />
                </a>
              )}
            </div>
            <SlipsWallet />
          </article>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <h3 className="mr-auto text-sm font-medium">Commonhour components</h3>
          <Link
            className="portfolio-button portfolio-button--secondary"
            href={`${commonhourPath}#commonhour-picker`}
            prefetch={false}
          >
            Booking widget <Arrow direction="out" />
          </Link>
          <Link
            className="portfolio-button portfolio-button--secondary"
            href={`${commonhourPath}#commonhour-zones`}
            prefetch={false}
          >
            Time-zone comparison <Arrow direction="out" />
          </Link>
        </div>
        <details className="demo-archive">
          <summary>Earlier component studies</summary>
          <div className="demo-component-grid">
            <article aria-labelledby="demo-folder-title" className="demo-card">
              <h3 id="demo-folder-title">Glass folder</h3>
              <GlassFolder />
            </article>
            <article
              aria-labelledby="demo-checkout-title"
              className="demo-card"
            >
              <h3 id="demo-checkout-title">Liquid glass checkout</h3>
              <LiquidCheckout />
            </article>
          </div>
        </details>
      </section>

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
        <div className="demo-project-cta">
          <Link
            className="portfolio-button portfolio-button--primary"
            href="/#contact"
            prefetch={false}
          >
            Start a project <Arrow direction="out" />
          </Link>
        </div>
      </section>
    </>
  );
}

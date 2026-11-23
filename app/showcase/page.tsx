import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShowcaseDemos } from "@/components/portfolio/demos/showcase-demos";
import { Arrow, Wordmark } from "@/components/portfolio/links";
import { ShowcasePreviews } from "@/components/portfolio/showcase-previews";
import { portfolio } from "@/lib/portfolio-content";
import { showcaseFont } from "@/lib/showcase-font";
import "./showcase.css";
import "./demos.css";
import "./slips-wallet.css";

const description =
  "Explore websites and original interactive design demos by Rahul Chaudhari.";

export const metadata: Metadata = {
  title: "Showcase — byflux",
  description,
  alternates: { canonical: "/showcase" },
  openGraph: {
    title: "Showcase — byflux",
    description,
    url: "/showcase",
    images: ["/social-card.png"],
  },
};

export default function ShowcasePage() {
  return (
    <div className={`portfolio showcase ${showcaseFont.variable}`}>
      <a
        className="portfolio-button portfolio-button--primary portfolio-skip"
        href="#showcase-main"
      >
        Skip to content
      </a>
      <header className="portfolio-header">
        <nav
          aria-label="Main navigation"
          className="portfolio-wide showcase-header"
        >
          <Wordmark />
          <Link
            className="portfolio-button portfolio-button--primary"
            href="/#contact"
            prefetch={false}
          >
            Start a project <Arrow direction="out" />
          </Link>
        </nav>
      </header>
      <main className="portfolio-shell" id="showcase-main" tabIndex={-1}>
        <div className="showcase-intro">
          <h1 className="showcase-title">Showcase</h1>
          <nav aria-label="Showcase sections" className="showcase-section-nav">
            <a href="#full-sites">Full sites</a>
            <a href="#components">Components</a>
            <a href="#blocks">Concept sites</a>
          </nav>
        </div>
        <ShowcasePreviews>
          <section
            aria-label="Full sites"
            className="showcase-section"
            id="full-sites"
          >
            <div className="showcase-grid">
              {portfolio.work.items.map((item) => (
                <article
                  aria-labelledby={`${item.id}-title`}
                  className="showcase-card"
                  key={item.id}
                >
                  <div className="portfolio-project-chrome" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="showcase-image">
                    <Image
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 899px) 44vw, 370px"
                      src={item.image}
                    />
                  </div>
                  <div className="showcase-card-body">
                    <h2 id={`${item.id}-title`}>{item.name}</h2>
                    <div className="showcase-card-actions">
                      <button
                        aria-haspopup="dialog"
                        aria-label={`Preview ${item.name}`}
                        className="portfolio-button portfolio-button--secondary"
                        data-preview-name={item.name}
                        data-preview-url={item.liveUrl}
                        type="button"
                      >
                        Preview
                      </button>
                      <a
                        aria-label={`Open ${item.name} in a new tab`}
                        className="portfolio-button portfolio-button--text"
                        href={item.liveUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Open site <Arrow direction="out" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </ShowcasePreviews>
        <ShowcaseDemos />
      </main>
      <footer className="portfolio-shell portfolio-footer">
        <Wordmark />
        <Link
          href="/#work"
          className="portfolio-button portfolio-button--text"
          prefetch={false}
        >
          Back to portfolio
        </Link>
      </footer>
    </div>
  );
}

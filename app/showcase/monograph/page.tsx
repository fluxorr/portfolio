import type { Metadata } from "next";
import Link from "next/link";
import { DirectionLibrary } from "./direction-library";
import {
  monographOg,
  monographOgAlt,
  monographPath,
  studioHref,
} from "./directions";
import { Hero, Pricing, Process } from "./experience";
import { Icon, Wordmark } from "./identity";

const title = "Monograph — An art direction workspace";
const description =
  "Put a look to the brief. Test type, color, and photography in a live campaign proof, then refine it in Monograph Studio.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: monographPath },
  openGraph: {
    type: "website",
    siteName: "Monograph",
    url: monographPath,
    title,
    description,
    images: [
      { url: monographOg, width: 1200, height: 630, alt: monographOgAlt },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: monographOg, alt: monographOgAlt }],
  },
};

export default function MonographPage() {
  return (
    <>
      <a className="mg-skip" href="#mg-main">
        Skip to content
      </a>
      <header className="mg-header mg-shell">
        <Wordmark />
        <nav aria-label="Monograph navigation">
          <a href="#directions">Directions</a>
          <a href="#process">Process</a>
          <a href="#plans">Plans</a>
        </nav>
        <Link className="mg-button mg-header-cta" href={studioHref()}>
          Open Studio <Icon name="out" />
        </Link>
      </header>
      <main id="mg-main" tabIndex={-1}>
        <Hero />
        <DirectionLibrary />
        <Process />
        <Pricing />
      </main>
      <footer className="mg-shell mg-footer">
        <Wordmark />
        <p>Design concept by Rahul Chaudhari.</p>
        <Link className="mg-link" href="/showcase">
          <Icon name="left" /> Back to Showcase
        </Link>
      </footer>
    </>
  );
}

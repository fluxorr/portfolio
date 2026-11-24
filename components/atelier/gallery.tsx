import Link from "next/link";
import { GlassFolder } from "@/components/portfolio/demos/glass-folder";
import { ImageAccordion } from "@/components/portfolio/demos/image-accordion";
import { LiquidCheckout } from "@/components/portfolio/demos/liquid-checkout";
import { Arrow } from "@/components/portfolio/links";
import { SignatureDemo } from "@/components/signature/signature-demo";
import { atelierFonts } from "@/lib/atelier/fonts";
import { StudyPreview } from "./study-preview";
import "./study-common.css";
import "./gallery.css";

export function AtelierGallery() {
  return (
    <section
      aria-labelledby="atelier-title"
      className={`atelier-gallery ${atelierFonts}`}
      id="components"
    >
      <header className="atelier-intro">
        <div>
          <h2 id="atelier-title">Components</h2>
          <p>Five interactive studies.</p>
        </div>
        <span className="atelier-catalog">
          Atelier <i aria-hidden="true">/</i> 05
        </span>
      </header>
      <div className="atelier-index">
        <article
          className="atelier-entry"
          aria-labelledby="atelier-palimpsest-title"
        >
          <Link
            href="/studies/palimpsest"
            prefetch={false}
            className="atelier-entry-link"
            aria-label="Inspect record · Palimpsest"
          >
            <StudyPreview />
            <div className="atelier-entry-text">
              <span className="atelier-entry-index study-code">01</span>
              <div>
                <h3 id="atelier-palimpsest-title">Palimpsest</h3>
                <p>Provenance cabinet</p>
              </div>
              <span className="atelier-entry-action">
                <span>Inspect record</span>
                <Arrow direction="out" />
              </span>
            </div>
          </Link>
        </article>
        <article
          className="atelier-entry atelier-entry-half"
          aria-labelledby="demo-folder-title"
        >
          <GlassFolder />
          <div className="atelier-entry-text">
            <span className="atelier-entry-index study-code">02</span>
            <h3 id="demo-folder-title">Glass folder</h3>
          </div>
        </article>
        <article
          className="atelier-entry atelier-entry-half"
          aria-labelledby="demo-checkout-title"
        >
          <LiquidCheckout />
          <div className="atelier-entry-text">
            <span className="atelier-entry-index study-code">03</span>
            <h3 id="demo-checkout-title">Liquid glass checkout</h3>
          </div>
        </article>
        <article
          className="atelier-entry"
          aria-labelledby="demo-accordion-title"
        >
          <ImageAccordion />
          <div className="atelier-entry-text">
            <span className="atelier-entry-index study-code">04</span>
            <h3 id="demo-accordion-title">Image accordion</h3>
          </div>
        </article>
        <article
          className="atelier-entry"
          aria-labelledby="demo-signature-title"
          id="signature-approval"
        >
          <SignatureDemo />
          <div className="atelier-entry-text">
            <span className="atelier-entry-index study-code">05</span>
            <h3 id="demo-signature-title">Signature approval</h3>
          </div>
        </article>
      </div>
    </section>
  );
}

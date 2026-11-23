import Link from "next/link";
import { Arrow } from "@/components/portfolio/links";
import { atelierFonts } from "@/lib/atelier/fonts";
import { studies } from "@/lib/atelier/studies";
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
          <p>Five small tools, built to be tried.</p>
        </div>
        <span className="atelier-catalog">
          Atelier <i aria-hidden="true">/</i> 05
        </span>
      </header>

      <div className="atelier-index">
        {studies.map((study) => (
          <article
            key={study.slug}
            className={`atelier-entry atelier-entry-${study.slug}`}
          >
            <Link
              href={`/studies/${study.slug}`}
              prefetch={false}
              className="atelier-entry-link"
              aria-label={`${study.action} · ${study.name}`}
            >
              <StudyPreview slug={study.slug} />
              <div className="atelier-entry-text">
                <span className="atelier-entry-index study-code">
                  {study.number}
                </span>
                <div>
                  <h3>{study.name}</h3>
                  <p>{study.job}</p>
                </div>
                <span className="atelier-entry-action">
                  <span>{study.action}</span>
                  <Arrow direction="out" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

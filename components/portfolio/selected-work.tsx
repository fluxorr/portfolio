import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { portfolio, type WorkItem } from "@/lib/portfolio-content";
import { Arrow, StartProject } from "./links";

const featuredSizes =
  "(max-width: 767px) calc(100vw - 100px), (max-width: 1060px) 55vw, 420px";
const tileSizes =
  "(max-width: 767px) calc(50vw - 30px), (max-width: 1060px) 29vw, 320px";

function ProjectTile({
  project,
  position,
}: {
  project: WorkItem;
  position: number;
}) {
  const featured = position === 0;

  return (
    <li
      className={
        featured
          ? "portfolio-project portfolio-project--featured"
          : "portfolio-project"
      }
      style={{ "--project-order": position } as CSSProperties}
    >
      <a
        aria-label={`${project.name} (opens in a new tab)`}
        className="portfolio-project-link"
        data-portfolio-event="project_open"
        data-portfolio-project={project.id}
        data-portfolio-destination="live"
        href={project.liveUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="portfolio-project-preview">
          <div className="portfolio-project-window">
            <div aria-hidden="true" className="portfolio-project-chrome">
              <span />
              <span />
              <span />
            </div>
            <div className="portfolio-project-screen">
              <Image
                alt={project.imageAlt}
                fill
                loading={featured ? "eager" : "lazy"}
                fetchPriority={featured ? "high" : undefined}
                sizes={featured ? featuredSizes : tileSizes}
                src={project.image}
              />
            </div>
          </div>
          {featured && project.mobileImage ? (
            <div aria-hidden="true" className="portfolio-project-phone">
              <Image alt="" fill sizes="134px" src={project.mobileImage} />
            </div>
          ) : null}
        </div>
        <span className="portfolio-project-caption">
          {project.name}
          <Arrow direction="out" />
        </span>
      </a>
    </li>
  );
}

export function SelectedWork() {
  const { title, items } = portfolio.work;
  return (
    <section
      aria-labelledby="work-title"
      className="portfolio-gallery portfolio-wide"
      id="work"
    >
      <h2 id="work-title">{title}</h2>
      <ul className="portfolio-gallery-grid">
        {items.map((project, position) => (
          <ProjectTile key={project.id} position={position} project={project} />
        ))}
      </ul>
      <div className="portfolio-gallery-footer">
        <StartProject location="after_work" variant="text" />
        <Link
          className="portfolio-button portfolio-button--secondary"
          href="/showcase"
          prefetch={false}
        >
          View showcase <Arrow direction="right" />
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ContactOptions } from "@/components/portfolio/contact-options";
import { Arrow, StartProject, Wordmark } from "@/components/portfolio/links";
import { PortfolioAnalytics } from "@/components/portfolio/portfolio-client";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { portfolio } from "@/lib/portfolio-content";

export default function Home() {
  const { hero, services, about, contactCopy } = portfolio;

  return (
    <div className="portfolio">
      <a
        className="portfolio-button portfolio-button--primary portfolio-skip"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="portfolio-header">
        <nav
          aria-label="Main navigation"
          className="portfolio-nav portfolio-wide"
        >
          <Wordmark />
          <ul className="portfolio-nav-links">
            {portfolio.navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <Link href="/showcase" prefetch={false}>
                Showcase
              </Link>
            </li>
          </ul>
          <StartProject location="nav" variant="compact" />
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="portfolio-hero" aria-labelledby="intro-title">
          <div className="portfolio-hero-copy portfolio-shell">
            <p className="portfolio-hero-identity">{hero.eyebrow}</p>
            <h1 id="intro-title">
              <span>{hero.headline[0]}</span> <span>{hero.headline[1]}</span>
            </h1>
            <p className="portfolio-hero-description">{hero.description}</p>
            <div className="portfolio-actions">
              <StartProject location="hero" />
              <a
                className="portfolio-button portfolio-button--secondary"
                data-portfolio-event="cta_work"
                data-portfolio-location="hero"
                href="#work"
              >
                {portfolio.actions.work}
                <Arrow direction="down" />
              </a>
            </div>
          </div>
          <SelectedWork />
        </section>

        <div className="portfolio-shell portfolio-content">
          <section
            aria-labelledby="services-title"
            className="portfolio-section portfolio-services"
            id="services"
          >
            <div>
              <p className="portfolio-eyebrow">{services.eyebrow}</p>
              <h2 id="services-title">{services.title}</h2>
              <p className="portfolio-body">{services.description}</p>
            </div>
            <div className="portfolio-service-list">
              {services.items.map((service, index) => (
                <details
                  key={service.title}
                  name="portfolio-services"
                  open={index === 0}
                >
                  <summary>
                    {service.title}
                    <span
                      aria-hidden="true"
                      className="portfolio-service-mark"
                    />
                  </summary>
                  <p className="portfolio-body">{service.description}</p>
                </details>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="about-title"
            className="portfolio-section portfolio-about"
            id="about"
          >
            <h2 id="about-title">{about.title}</h2>
            <div>
              <p className="portfolio-body">{about.description}</p>
              {about.experience.length ? (
                <ul className="portfolio-experience">
                  {about.experience.map((entry) => (
                    <li key={`${entry.organization}-${entry.role}`}>
                      <p>
                        {entry.role} · {entry.organization}
                      </p>
                      {entry.context ? (
                        <p className="portfolio-body">{entry.context}</p>
                      ) : null}
                      {entry.dates ? (
                        <p className="portfolio-eyebrow">{entry.dates}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              <a
                className="portfolio-button portfolio-button--text"
                data-portfolio-event="external_profile_click"
                data-portfolio-location="about"
                data-portfolio-destination="github"
                href={portfolio.github}
              >
                GitHub <Arrow direction="out" />
              </a>
            </div>
          </section>
        </div>

        <div className="portfolio-wide">
          <section
            aria-labelledby="contact-title"
            className="portfolio-contact"
            id="contact"
          >
            <div className="portfolio-contact-copy">
              <h2 id="contact-title">{contactCopy.title}</h2>
              <p className="portfolio-body">{contactCopy.description}</p>
            </div>
            <ContactOptions />
          </section>
        </div>
      </main>

      <footer className="portfolio-footer portfolio-shell">
        <div className="portfolio-footer-brand">
          <Wordmark />
          <small>
            © {new Date().getFullYear()} {portfolio.name}
          </small>
        </div>
        <nav aria-label="Footer navigation" className="portfolio-footer-links">
          <a href="#work">Work</a>
          <Link href="/showcase" prefetch={false}>
            Showcase
          </Link>
          <a
            data-portfolio-event="external_profile_click"
            data-portfolio-location="footer"
            data-portfolio-destination="github"
            href={portfolio.github}
          >
            GitHub <Arrow direction="out" />
          </a>
        </nav>
      </footer>
      <PortfolioAnalytics />
    </div>
  );
}

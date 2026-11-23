import { portfolio } from "@/lib/portfolio-content";
import { Arrow } from "../links";
import { GlassFolder } from "./glass-folder";
import { LiquidCheckout } from "./liquid-checkout";
import { SlipsWallet } from "./slips-wallet";

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
    </>
  );
}

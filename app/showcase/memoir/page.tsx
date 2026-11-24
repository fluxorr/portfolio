import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  MemoirIcon,
  MemoirMark,
  MemoirWordmark,
} from "@/components/memoir/brand";
import { MemoryConsole, Thread } from "@/components/memoir/console";
import { MemoirFaq } from "@/components/memoir/faq";
import { MemoryRoom } from "@/components/memoir/memory-room";
import {
  ProductOverview,
  UseCases,
  Walkthrough,
} from "@/components/memoir/product-sections";
import {
  AccessButton,
  MemoirControls,
  MemoirNav,
} from "@/components/memoir/site-controls";
import { MemoryMetrics, Stories } from "@/components/memoir/stories";
import { TraceField } from "@/components/memoir/trace-field";
import { memoirOg, memoirOgAlt, memoirPath } from "@/lib/memoir";
import { portfolio } from "@/lib/portfolio-content";
import "./memoir.css";
import "./memoir-product.css";

const mono = Geist_Mono({
  variable: "--font-memoir-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = "Memoir — Good ideas deserve a better memory";
const description =
  "An AI second brain concept for meetings, conversations, ideas, and decisions. Explore a guided memory library with traceable sources.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: memoirPath },
  openGraph: {
    type: "website",
    siteName: "Memoir",
    url: memoirPath,
    title,
    description,
    images: [{ url: memoirOg, width: 1200, height: 630, alt: memoirOgAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: memoirOg, alt: memoirOgAlt }],
  },
};
export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

const sources = [
  { label: "Calendar", icon: "clock" },
  { label: "Meetings", icon: "meeting" },
  { label: "Voice notes", icon: "voice" },
  { label: "Documents", icon: "note" },
  { label: "Ideas", icon: "idea" },
  { label: "Conversations", icon: "conversation" },
  { label: "Links", icon: "link" },
] as const;

export default function MemoirPage() {
  return (
    <div className={`memoir ${mono.variable}`}>
      <MemoirControls
        waitlistConfigured={Boolean(process.env.MEMOIR_WAITLIST_ENDPOINT)}
      >
        <a href="#memoir-main" className="mm-skip">
          Skip to content
        </a>
        <MemoirNav />
        <main id="memoir-main" tabIndex={-1}>
          <section className="mm-hero" aria-labelledby="memoir-title">
            <div className="mm-hero-banner">
              <TraceField />
              <div className="mm-hero-copy mm-shell">
                <p className="mm-label mm-product-label">
                  Your AI second brain
                </p>
                <h1 id="memoir-title">
                  <span>Good ideas deserve</span>
                  <span>a better memory.</span>
                </h1>
                <p className="mm-hero-description">
                  Find the meetings, conversations, ideas, and decisions you
                  need to move forward.
                </p>
                <div className="mm-hero-actions">
                  <AccessButton />
                  <a className="mm-btn mm-secondary" href="#memoir-demo">
                    Try the demo <MemoirIcon name="down" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mm-hero-visual mm-shell">
              <MemoryConsole />
            </div>
          </section>
          <section className="mm-sources" aria-labelledby="memoir-source-title">
            <div className="mm-shell mm-source-inner">
              <div>
                <p className="mm-label">Example sources</p>
                <h2 id="memoir-source-title">
                  From scattered moments
                  <br />
                  to one clear picture.
                </h2>
              </div>
              <ul>
                {sources.map(({ label, icon }) => (
                  <li key={label}>
                    <MemoirIcon name={icon} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <ProductOverview />
          <MemoryRoom />
          <Walkthrough />
          <UseCases />
          <Stories />
          <MemoryMetrics />
          <MemoirFaq />
          <section className="mm-closing" aria-labelledby="memoir-close-title">
            <div className="mm-shell mm-close-inner">
              <div>
                <h2 id="memoir-close-title">
                  Remember what matters.
                  <br />
                  <em>Make room for everything else.</em>
                </h2>
                <p>
                  Keep the past within reach and give the next thought some
                  space.
                </p>
                <AccessButton />
              </div>
              <div className="mm-close-art" aria-hidden="true">
                <Thread className="mm-close-thread" />
                <span className="mm-close-slip">
                  <MemoirIcon name="voice" /> Voice note
                </span>
                <span className="mm-close-slip">
                  <MemoirIcon name="meeting" /> Product sync
                </span>
                <span className="mm-close-slip">
                  <MemoirIcon name="note" /> Launch notes
                </span>
                <span className="mm-close-stamp">
                  <MemoirMark />
                </span>
              </div>
            </div>
          </section>
        </main>
        <footer className="mm-shell mm-footer">
          <div className="mm-footer-grid">
            <div>
              <MemoirWordmark />
              <p>A second brain for your first one.</p>
            </div>
            <div>
              <h2>Product</h2>
              <a href="#memoir-product">Overview</a>
              <a href="#memoir-room">Memory Room</a>
              <a href="#memoir-process">How it works</a>
              <a href="#memoir-cases">Use cases</a>
            </div>
            <div>
              <h2>Explore</h2>
              <a href="#memoir-stories">Stories</a>
              <a href="#memoir-faq">FAQ</a>
              <a href="#memoir-privacy">Demo privacy</a>
            </div>
            <div>
              <h2>Portfolio</h2>
              <Link href="/showcase#blocks">All concepts</Link>
              <a href={`mailto:${portfolio.contact.email}`}>
                Contact the designer
              </a>
              <a href={portfolio.github}>GitHub</a>
            </div>
          </div>
          <div className="mm-footer-bottom">
            <span>
              © {new Date().getUTCFullYear()} Memoir · A byflux concept
            </span>
            <a href="#memoir-top">
              Back to top <MemoirIcon name="up" />
            </a>
          </div>
        </footer>
      </MemoirControls>
    </div>
  );
}

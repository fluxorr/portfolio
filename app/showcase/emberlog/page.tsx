import Link from "next/link";
import { Notes, Stats, TrustStrip } from "@/components/emberlog/evidence";
import { Faq } from "@/components/emberlog/faq";
import { FeatureCard, Integrations } from "@/components/emberlog/features";
import { Install } from "@/components/emberlog/install";
import { EmberIcon, EmberMark } from "@/components/emberlog/mark";
import { Pricing } from "@/components/emberlog/pricing";
import { RequestReader } from "@/components/emberlog/request-reader";
import { Transport } from "@/components/emberlog/transport";
import { Workflow } from "@/components/emberlog/workflow";
import {
  emberlogDescription,
  emberlogPath,
  features,
  frequentQuestions,
} from "@/lib/emberlog";
import { portfolio } from "@/lib/portfolio-content";

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Emberlog",
    url: portfolio.url + emberlogPath,
    description: emberlogDescription,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: frequentQuestions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  },
];

export default function EmberlogPage() {
  return (
    <main id="emberlog-main" tabIndex={-1}>
      <div className="el-hero-frame">
        <section aria-labelledby="el-title" className="el-hero">
          <div className="el-hero-copy">
            <p className="el-eyebrow">
              <i /> Request replay
            </p>
            <h1 id="el-title">
              <span>Rewind any</span>
              <span>request.</span>
            </h1>
            <p className="el-hero-lead">
              Inspect the spans and payload from a failed request. Change one
              value, then replay it to see what happens.
            </p>
            <div className="el-hero-actions">
              <a className="el-button el-primary" href="#replay">
                Open the replay <EmberIcon name="arrow" />
              </a>
              <Link
                className="el-button el-secondary"
                href={`${emberlogPath}/docs`}
                prefetch={false}
              >
                Read the docs <EmberIcon name="up" />
              </Link>
            </div>
          </div>
          <RequestReader />
        </section>
      </div>
      <section
        aria-labelledby="el-lab-title"
        className="el-section el-shell el-replay-lab"
        id="replay"
      >
        <div className="el-section-head">
          <p className="el-index">Interactive sample</p>
          <h2 id="el-lab-title">Why did checkout time out?</h2>
          <p>
            Follow five spans from the gateway to the payment service. Open Edit
            &amp; replay to test a longer timeout.
          </p>
        </div>
        <div className="el-stage">
          <Transport />
          <p className="el-stage-caption">
            <span>Recorded checkout</span>
            <span>Sample data · 5 spans</span>
          </p>
        </div>
      </section>
      <TrustStrip />
      <Workflow />

      <section
        aria-labelledby="el-features-title"
        className="el-section el-shell"
        id="features"
      >
        <div className="el-section-head">
          <p className="el-index">Tools</p>
          <h2 id="el-features-title">Inspect the request</h2>
        </div>
        <div className="el-bento">
          {features.map((feature) => (
            <FeatureCard feature={feature} key={feature.id} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="el-install-title"
        className="el-section el-shell el-install-section"
        id="install"
      >
        <div className="el-section-head">
          <p className="el-index">Offline demo</p>
          <h2 id="el-install-title">Replay it on your machine</h2>
          <p>
            The offline kit reproduces the same checkout timeout you see above.
          </p>
          <ol className="el-install-steps">
            <li>Download both files</li>
            <li>Replay at 600 ms</li>
            <li>Run it again at 1,200 ms</li>
          </ol>
        </div>
        <Install />
      </section>

      <section
        aria-labelledby="el-stack-title"
        className="el-section el-shell"
        id="integrations"
      >
        <div className="el-section-head">
          <p className="el-index">Adapter directory</p>
          <h2 id="el-stack-title">Find your stack</h2>
        </div>
        <Integrations />
      </section>

      <section
        aria-labelledby="el-evidence-title"
        className="el-section el-evidence el-shell"
      >
        <div className="el-section-head">
          <p className="el-index">Sample scenarios</p>
          <h2 id="el-evidence-title">Sample metrics and teams</h2>
          <p>
            Illustrative figures and fictional team notes from the product
            concept.
          </p>
        </div>
        <Stats />
        <Notes />
      </section>

      <section
        aria-labelledby="el-pricing-title"
        className="el-section el-shell"
        id="pricing"
      >
        <div className="el-section-head">
          <p className="el-index">Pricing</p>
          <h2 id="el-pricing-title">Three plans</h2>
        </div>
        <Pricing />
      </section>

      <section
        aria-labelledby="el-faq-title"
        className="el-section el-shell el-faq"
        id="faq"
      >
        <div className="el-section-head">
          <p className="el-index">FAQ</p>
          <h2 id="el-faq-title">Common questions</h2>
          <Link className="el-textlink" href="/#contact" prefetch={false}>
            Ask the studio <EmberIcon name="up" />
          </Link>
        </div>
        <Faq />
      </section>

      <section aria-labelledby="el-cta-title" className="el-close">
        <EmberMark />
        <h2 id="el-cta-title">
          Stop guessing. <em>Rewind.</em>
        </h2>
        <p>Pick up the sample checkout where it failed.</p>
        <a className="el-button el-primary" href="#replay">
          Try the replay <EmberIcon name="arrow" />
        </a>
      </section>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </main>
  );
}

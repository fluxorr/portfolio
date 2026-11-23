import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/emberlog/faq";
import { EmberIcon } from "@/components/emberlog/mark";
import { Pricing } from "@/components/emberlog/pricing";
import { emberlogPath } from "@/lib/emberlog";

export const metadata: Metadata = {
  title: "Pricing — Emberlog",
  description:
    "Explore Emberlog’s example plans, compare features, and try the interactive replay.",
  alternates: { canonical: `${emberlogPath}/pricing` },
};

export default function EmberlogPricing() {
  return (
    <main className="el-shell el-subpage" id="emberlog-main" tabIndex={-1}>
      <header className="el-subhead">
        <p className="el-index">Pricing</p>
        <h1>Emberlog pricing</h1>
        <p>
          Compare how Emberlog would work for a solo developer, a team, or your
          own infrastructure.
        </p>
      </header>
      <section aria-labelledby="el-plans-title">
        <h2 className="el-sr" id="el-plans-title">
          Compare plans
        </h2>
        <Pricing />
      </section>
      <section aria-labelledby="el-pricing-faq" className="el-section el-faq">
        <div className="el-section-head">
          <h2 id="el-pricing-faq">
            Questions <em>first.</em>
          </h2>
          <Link
            className="el-textlink"
            href={`${emberlogPath}/docs`}
            prefetch={false}
          >
            Read the docs <EmberIcon name="arrow" />
          </Link>
        </div>
        <Faq />
      </section>
    </main>
  );
}

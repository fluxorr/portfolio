import Link from "next/link";
import { emberlogPath } from "@/lib/emberlog";
import { EmberIcon, EmberWordmark } from "./mark";

const groups = [
  {
    title: "Product",
    links: [
      ["Replay", "#replay"],
      ["How it works", "#workflow"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "Developers",
    links: [
      ["Documentation", "/docs"],
      ["Integrations", "#integrations"],
      ["Download the demo", "/docs#download"],
    ],
  },
  {
    title: "Studio",
    links: [
      ["Portfolio showcase", "/showcase#blocks"],
      ["Contact byflux", "/#contact"],
    ],
  },
  {
    title: "About this demo",
    links: [
      ["Sample data", "/docs#sample-data"],
      ["Browser privacy", "/docs#privacy"],
    ],
  },
];

export function EmberFooter() {
  return (
    <footer className="el-footer el-shell">
      <div className="el-footer-links">
        <div className="el-footer-identity">
          <EmberWordmark />
          <p>A request replay concept by byflux.</p>
        </div>
        {groups.map(({ title, links }) => (
          <section key={title}>
            <h2>{title}</h2>
            {links.map(([label, path]) => (
              <Link
                href={
                  path.startsWith("/showcase") || path.startsWith("/#")
                    ? path
                    : emberlogPath + path
                }
                key={label}
                prefetch={false}
              >
                {label}
              </Link>
            ))}
          </section>
        ))}
      </div>
      <div className="el-footer-meta">
        <span>
          <i /> Demo runs locally in your browser
        </span>
        <Link href="/showcase#blocks" prefetch={false}>
          Back to showcase <EmberIcon name="up" />
        </Link>
      </div>
      <div aria-hidden="true" className="el-footer-word">
        emberlog
      </div>
    </footer>
  );
}

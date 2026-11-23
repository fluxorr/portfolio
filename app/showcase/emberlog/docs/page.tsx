import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/emberlog/copy";
import { Install } from "@/components/emberlog/install";
import { EmberIcon } from "@/components/emberlog/mark";
import { emberlogPath } from "@/lib/emberlog";

export const metadata: Metadata = {
  title: "Docs — Emberlog",
  description:
    "Run the Emberlog sample take, read the request timeline, and reproduce the checkout timeout locally.",
  alternates: { canonical: `${emberlogPath}/docs` },
};

const sections = [
  ["quickstart", "Quickstart"],
  ["replay", "Inspect and replay"],
  ["download", "Run offline"],
  ["sample-data", "Sample data"],
  ["privacy", "Browser privacy"],
];

export default function EmberlogDocs() {
  return (
    <main className="el-shell el-subpage" id="emberlog-main" tabIndex={-1}>
      <header className="el-subhead">
        <p className="el-index">Documentation</p>
        <h1>Emberlog docs</h1>
        <p>
          Reproduce a checkout timeout in the browser or run the same fixture on
          your machine.
        </p>
      </header>
      <div className="el-doc-grid">
        <nav aria-label="On this page" className="el-doc-nav">
          {sections.map(([id, title]) => (
            <a href={`#${id}`} key={id}>
              {title}
            </a>
          ))}
        </nav>
        <div className="el-doc-content">
          <section id="quickstart">
            <h2>Quickstart</h2>
            <ol>
              <li>
                Open the browser replay and choose{" "}
                <strong>payments.charge</strong>.
              </li>
              <li>
                Read the sanitized payload and find <code>gateway_timeout</code>
                .
              </li>
              <li>
                Open <strong>Edit &amp; replay</strong>, set the timeout to{" "}
                <strong>1200 ms</strong>, and run it again.
              </li>
            </ol>
            <Link
              className="el-button el-primary"
              href={`${emberlogPath}#replay`}
              prefetch={false}
            >
              Open the browser replay <EmberIcon name="arrow" />
            </Link>
          </section>
          <section id="replay">
            <h2>Inspect and replay</h2>
            <p>
              The timeline is 1,200 ms long and contains five spans. Pick a span
              or use the slider to inspect the latest event. Arrow keys move 10
              ms at a time. Hold Shift for 100 ms, or press Home and End to jump
              to either edge.
            </p>
            <p>
              The sample payment gateway takes 740 ms. A 600 ms timeout returns
              504. A timeout of 740 ms or more returns 200.
            </p>
            <table>
              <thead>
                <tr>
                  <th scope="col">Timeout</th>
                  <th scope="col">Replay result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>600 ms</td>
                  <td>504 gateway timeout</td>
                </tr>
                <tr>
                  <td>1200 ms</td>
                  <td>200 OK</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section id="download">
            <h2>Run offline</h2>
            <p>
              Save the JavaScript replay script and the JSON fixture together.
              You need Node.js or a compatible runtime. Neither file makes
              network requests during replay.
            </p>
            <Install id="el-doc-install" />
            <div className="el-command el-doc-command">
              <pre>
                <code>node emberlog-replay.mjs 600</code>
              </pre>
              <CopyButton text="node emberlog-replay.mjs 600" />
            </div>
            <p>
              The script prints structured JSON. A successful replay exits with
              code 0, a simulated timeout with code 1, and invalid input with
              code 2.
            </p>
          </section>
          <section id="sample-data">
            <h2>Sample data</h2>
            <p>
              The checkout is a synthetic fixture. Fields such as{" "}
              <code>authorization</code>, <code>token</code>, and{" "}
              <code>card</code> are supplied as <code>[redacted]</code>. Demo
              links encode a timeline position in milliseconds and reopen the
              same fixture.
            </p>
            <p>
              The adapter list, plans, measurements, and team notes illustrate
              the product concept.
            </p>
          </section>
          <section id="privacy">
            <h2>Browser privacy</h2>
            <p>
              The site stores your manual theme choice in your browser. Replay
              state stays in memory and resets when you reload. Copying a demo
              link places its URL on your clipboard when your browser permits
              it.
            </p>
            <Link className="el-textlink" href="/#contact" prefetch={false}>
              Contact byflux <EmberIcon name="up" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

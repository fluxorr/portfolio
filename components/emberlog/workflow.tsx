"use client";

import { useEffect, useRef, useState } from "react";
import { steps, take } from "@/lib/emberlog";
import { EmberIcon } from "./mark";

export function Workflow() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = root.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!nodes) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-29% 0px -46% 0px" },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="el-workflow-title"
      className="el-section el-workflow el-shell"
      id="workflow"
      ref={root}
    >
      <div className="el-section-head">
        <p className="el-index">Workflow</p>
        <h2 id="el-workflow-title">From request to replay</h2>
      </div>
      <div className="el-workflow-grid">
        <div className="el-workflow-nav">
          <ol>
            {steps.map((step, index) => (
              <li key={step.title}>
                <button
                  aria-current={index === active ? "step" : undefined}
                  className="el-workflow-control"
                  onClick={() => {
                    setActive(index);
                    document
                      .getElementById(`el-step-${index}`)
                      ?.scrollIntoView({ block: "center" });
                  }}
                  type="button"
                >
                  <span>0{index + 1}</span> {step.title}{" "}
                  <EmberIcon name="arrow" />
                </button>
              </li>
            ))}
          </ol>
          <p key={active}>{steps[active].copy}</p>
        </div>
        <div className="el-workflow-steps">
          {steps.map((step, index) => (
            <article
              className="el-workflow-step"
              data-active={active === index}
              data-step={index}
              id={`el-step-${index}`}
              key={step.title}
            >
              <div className="el-step-art">
                <header>
                  <span>
                    0{index + 1} / {step.title}
                  </span>
                  <span>{take.id}</span>
                </header>
                {index === 0 && (
                  <div className="el-step-capture">
                    <div>
                      <span>Incoming request</span>
                      <code>POST /v2/checkout</code>
                    </div>
                    <div>
                      <EmberIcon name="lock" />
                      <code>
                        authorization: <i>[redacted]</i>
                      </code>
                    </div>
                    <div>
                      <EmberIcon name="check" />
                      <code>Recorded and sanitized</code>
                    </div>
                  </div>
                )}
                {index === 1 && (
                  <div className="el-step-scrub">
                    <span>
                      Inspect <b>pricing.quote</b>
                    </span>
                    <div>
                      <i />
                      <i />
                      <i />
                      <i />
                      <em />
                    </div>
                    <code>00:00.420</code>
                  </div>
                )}
                {index === 2 && (
                  <div className="el-step-replay">
                    <code>
                      <i>$</i> node emberlog-replay.mjs 1200
                    </code>
                    <code>
                      <EmberIcon name="check" /> 200 OK <span>checkout_ok</span>
                    </code>
                  </div>
                )}
              </div>
              <div className="el-step-caption">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

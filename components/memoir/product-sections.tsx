"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";
import { answers, getMemory, sourceLabels } from "@/lib/memoir";
import { MemoirIcon } from "./brand";
import { Thread } from "./console";
import { AnswerCitation, GuidedAsk } from "./guided-ask";

const excerpts = ["m-03", "m-02", "m-01", "m-07", "m-06"];

function CaptureProof() {
  const [source, setSource] = useState("m-01");
  const entry = getMemory(source);
  return (
    <div className="mm-capture-proof">
      <div className="mm-capture-inputs">
        <button
          type="button"
          aria-pressed={source === "m-01"}
          onClick={() => setSource("m-01")}
        >
          <MemoirIcon name="meeting" />
          <span>
            <strong>Product sync</strong>
            <small>Meeting · 10:32</small>
          </span>
        </button>
        <button
          type="button"
          aria-pressed={source === "m-03"}
          onClick={() => setSource("m-03")}
        >
          <MemoirIcon name="voice" />
          <span>
            <strong>Monday voice memo</strong>
            <small>Voice note · 08:41</small>
          </span>
        </button>
      </div>
      <Thread className="mm-capture-thread" key={source} />
      <div className="mm-capture-provenance" key={source} aria-live="polite">
        <p className="mm-label">{sourceLabels[entry.sourceType]} / excerpt</p>
        <p>
          <mark>{entry.excerpt}</mark>
        </p>
        <small>{entry.tags[0]}</small>
      </div>
    </div>
  );
}

export function ProductOverview() {
  const [active, setActive] = useState("m-03");
  const memory = getMemory(active);
  return (
    <section
      className="mm-shell mm-section"
      id="memoir-product"
      aria-labelledby="memoir-product-title"
    >
      <div className="mm-heading">
        <div>
          <p className="mm-label">What Memoir does</p>
          <h2 id="memoir-product-title">
            A place for the things
            <br />
            you’ll want back.
          </h2>
        </div>
        <p>
          Capture a detail when it’s fresh. Follow it across other notes. Find
          it again when you need it.
        </p>
      </div>
      <div className="mm-feature-spread">
        <article className="mm-feature mm-feature-capture" id="memoir-capture">
          <div className="mm-feature-copy">
            <h3>Capture what happened.</h3>
            <p>
              Pull the useful sentence out of a meeting or a quick voice memo.
            </p>
          </div>
          <CaptureProof />
        </article>
        <article className="mm-feature mm-feature-connect">
          <div className="mm-feature-copy">
            <h3>Find the connection.</h3>
            <p>Trace a Monday idea to Thursday’s plan.</p>
          </div>
          <div className="mm-mini-network">
            <ul className="mm-mini-choices" aria-label="Related sample notes">
              {excerpts.map((id, index) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={id === active}
                    onClick={() => setActive(id)}
                  >
                    <span className="mm-label">0{index + 1}</span>
                    {getMemory(id).title}
                  </button>
                </li>
              ))}
            </ul>
            <p key={active} aria-live="polite">
              {memory.excerpt}
            </p>
          </div>
        </article>
        <article className="mm-feature mm-feature-recall" id="memoir-recall">
          <div className="mm-feature-copy">
            <h3>Ask, and see the source.</h3>
            <p>Open the original note behind a sample answer.</p>
          </div>
          <GuidedAsk initialAnswer={answers[2]} withInput={false} />
        </article>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Capture naturally.",
    copy: "A line from Product Sync is captured with the meeting time and the people who were there.",
  },
  {
    title: "Keep the decision with its context.",
    copy: "Thursday becomes the target date. The onboarding fixes stay attached to the decision and the original note.",
  },
  {
    title: "Ask about it later.",
    copy: "Find the answer and open the two notes that support it. The source trail is part of the answer.",
  },
] as const;

function ProcessVisual({ step }: { step: number }) {
  return (
    <div className="mm-process-visual" data-step={step}>
      <div className="mm-proof-header">
        <MemoirIcon
          name={step === 0 ? "voice" : step === 1 ? "threads" : "search"}
        />
        <span className="mm-label">
          {["Meeting excerpt", "Linked decision", "Sourced answer"][step]}
        </span>
        <span className="mm-proof-count">0{step + 1} / 03</span>
      </div>
      {step === 0 && (
        <div className="mm-process-paper">
          <p className="mm-label">Product Sync · 10:32</p>
          <p>
            <strong>Maya</strong> Can we move the beta to Thursday?
          </p>
          <p>
            <strong>Jules</strong> Yes. Let’s fix the{" "}
            <mark>onboarding empty states and invite flow</mark> first.
          </p>
          <div className="mm-waveform" aria-hidden="true">
            {[
              8, 18, 25, 16, 27, 38, 23, 10, 19, 32, 45, 23, 13, 26, 35, 20, 12,
              20, 9, 14, 24, 15, 8,
            ].map((height, index) => (
              <span key={`${index}-${height}`} style={{ height }} />
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="mm-process-paper">
          <p className="mm-label">Beta launch</p>
          <strong className="mm-process-statement">
            Move the beta to Thursday.
          </strong>
          <p>Maya · Agreed in Product Sync</p>
          <Thread className="mm-process-thread" />
          <p className="mm-process-chip">
            <MemoirIcon name="note" /> Launch notes
          </p>
        </div>
      )}
      {step === 2 && (
        <div className="mm-process-paper">
          <p className="mm-label">Question</p>
          <strong className="mm-process-statement">
            {answers[0].question}
          </strong>
          <AnswerCitation answer={answers[0]} />
        </div>
      )}
    </div>
  );
}

export function Walkthrough() {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elements = stepsRef.current?.querySelectorAll<HTMLElement>(
      "[data-process-step]",
    );
    if (!elements) return;
    let observer: IntersectionObserver | undefined;
    function observe() {
      observer?.disconnect();
      if (window.innerWidth < 900 || !elements) return;
      const height = window.innerHeight;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting)
              setActive(
                Number((entry.target as HTMLElement).dataset.processStep),
              );
        },
        {
          rootMargin: `-${Math.round(height * 0.4)}px 0px -${Math.round(height * 0.46)}px 0px`,
        },
      );
      for (const element of elements) observer.observe(element);
    }
    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, []);
  return (
    <section
      className="mm-shell mm-section"
      id="memoir-process"
      aria-labelledby="memoir-process-title"
    >
      <div className="mm-heading">
        <div>
          <p className="mm-label">How it works</p>
          <h2 id="memoir-process-title">
            Useful long after
            <br />
            the moment.
          </h2>
        </div>
        <p>
          Follow one decision from a meeting to the question you ask a week
          later.
        </p>
      </div>
      <div className="mm-process-layout">
        <div className="mm-process-sticky">
          <ProcessVisual key={active} step={active} />
        </div>
        <div className="mm-process-steps" ref={stepsRef}>
          {steps.map((step, index) => (
            <article
              data-process-step={index}
              data-active={index === active}
              key={step.title}
            >
              <span className="mm-label">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              <div className="mm-process-mobile">
                <ProcessVisual step={index} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const cases = [
  {
    id: "after",
    title: "After a meeting",
    intro: "Check the decision while the details are still fresh.",
    answer: answers[0],
  },
  {
    id: "during",
    title: "Mid-project",
    intro: "Trace the backstory without reopening every tab.",
    answer: answers[1],
  },
  {
    id: "before",
    title: "Before a conversation",
    intro: "Bring one detail worth following up on.",
    answer: answers[2],
  },
];

export function UseCases() {
  const [value, setValue] = useState(cases[0].id);
  return (
    <section
      className="mm-use-cases"
      id="memoir-cases"
      aria-labelledby="memoir-cases-title"
    >
      <div className="mm-shell mm-section">
        <div className="mm-heading">
          <div>
            <p className="mm-label">Use cases</p>
            <h2 id="memoir-cases-title">
              Find it when
              <br />
              it matters.
            </h2>
          </div>
          <p>
            Three moments when the original context is more useful than a blank
            search bar.
          </p>
        </div>
        <Tabs.Root
          value={value}
          onValueChange={setValue}
          className="mm-case-layout"
        >
          <Tabs.List aria-label="Use cases" className="mm-case-tabs">
            {cases.map(({ id, title, intro }) => (
              <Tabs.Trigger value={id} key={id}>
                <span>
                  <strong>{title}</strong>
                  <small>{intro}</small>
                </span>
                <MemoirIcon name="arrow" />
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {cases.map(({ id, answer }) => (
            <Tabs.Content className="mm-case-detail" value={id} key={id}>
              <p className="mm-label">Question</p>
              <h3>{answer.question}</h3>
              <AnswerCitation answer={answer} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}

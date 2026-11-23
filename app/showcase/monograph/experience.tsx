"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type FormEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type BrandDirection,
  directionImage,
  directions,
  matchDirection,
  monographPath,
  studioHref,
} from "./directions";
import { Icon, Mark } from "./identity";

const examples = [
  { label: "Coffee", brief: "A small Tokyo coffee roastery." },
  { label: "Ceramics", brief: "A ceramics atelier inspired by river stones." },
  { label: "Outdoor apparel", brief: "An outdoor label for long hikes." },
] as const;

export function Hero() {
  const [brief, setBrief] = useState<string>(examples[0].brief);
  const [result, setResult] = useState<{
    direction: BrandDirection;
    brief: string;
    matched: boolean;
    version: number;
  }>();
  const art = useRef<HTMLElement>(null);

  function findDirection(idea: string) {
    const match = matchDirection(idea);
    setResult((current) => ({
      direction: match ?? directions[0],
      brief: idea,
      matched: Boolean(match),
      version: (current?.version ?? 0) + 1,
    }));
    if (window.matchMedia("(max-width: 780px)").matches) {
      art.current?.scrollIntoView({ block: "nearest" });
    }
  }

  function explore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const idea = brief.trim();
    if (idea) findDirection(idea);
  }

  function moveArtwork(event: PointerEvent<HTMLDivElement>) {
    if (
      result ||
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const frame = event.currentTarget;
    const bounds = frame.getBoundingClientRect();
    frame.style.setProperty(
      "--fold-x",
      `${((event.clientX - bounds.left) / bounds.width) * 14 - 7}px`,
    );
    frame.style.setProperty(
      "--fold-y",
      `${((event.clientY - bounds.top) / bounds.height) * 14 - 7}px`,
    );
  }

  return (
    <section className="mg-hero mg-shell" aria-labelledby="mg-title">
      <div className="mg-hero-copy">
        <p className="mg-kicker">Art direction workspace</p>
        <h1 id="mg-title">
          <span>Put a look</span>
          <em>to the brief.</em>
        </h1>
        <p className="mg-hero-intro">
          Try type, color, and photography together before you commit to a
          direction.
        </p>
        <form className="mg-prompt" onSubmit={explore}>
          <label htmlFor="mg-brief">Start with a brief</label>
          <div>
            <input
              id="mg-brief"
              name="brief"
              value={brief}
              maxLength={180}
              onChange={(event) => setBrief(event.target.value)}
              required
            />
            <button
              className="mg-prompt-button"
              type="submit"
              disabled={!brief.trim()}
            >
              <span>Find a direction</span>
              <Icon name="right" />
            </button>
          </div>
          <ul className="mg-prompt-examples" aria-label="Example briefs">
            {examples.map((example) => (
              <li key={example.label}>
                <button
                  type="button"
                  onClick={() => {
                    setBrief(example.brief);
                    findDirection(example.brief);
                  }}
                >
                  {example.label}
                </button>
              </li>
            ))}
          </ul>
        </form>
      </div>
      <figure className="mg-art" ref={art}>
        <div
          className="mg-art-frame"
          onPointerMove={moveArtwork}
          onPointerLeave={(event) => {
            event.currentTarget.style.removeProperty("--fold-x");
            event.currentTarget.style.removeProperty("--fold-y");
          }}
        >
          {result ? (
            <div
              className="mg-art-result"
              key={result.version}
              style={
                {
                  "--board-paper": result.direction.palette[0],
                  "--board-ink": result.direction.palette[2],
                } as CSSProperties
              }
            >
              <div className="mg-result-photo">
                <Image
                  src={directionImage(result.direction.slug)}
                  alt={result.direction.subject}
                  fill
                  sizes="(max-width: 780px) 94vw, 50vw"
                />
              </div>
              <div className="mg-result-copy">
                <p className="mg-kicker">
                  {result.matched
                    ? "Suggested direction"
                    : "No close match · Try this sample"}
                </p>
                <strong>{result.direction.name}</strong>
                <div className="mg-mini-swatches" aria-hidden="true">
                  {result.direction.palette.map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </div>
                <Link
                  className="mg-link"
                  href={studioHref(result.direction.slug, result.brief)}
                >
                  Edit in Studio <Icon name="out" />
                </Link>
              </div>
            </div>
          ) : (
            <Image
              className="mg-fold"
              src={`${monographPath}/fold.webp`}
              alt="A vermilion paper ribbon folded into a sculptural M"
              fill
              preload
              sizes="(max-width: 780px) 94vw, 50vw"
            />
          )}
        </div>
        <figcaption className="mg-art-caption mg-kicker">
          <span>
            {result ? result.direction.category : "Folded paper, vermilion"}
          </span>
        </figcaption>
      </figure>
      <output className="mg-sr-only">
        {result &&
          (result.matched
            ? `Suggested direction: ${result.direction.name}.`
            : `No close match. Previewing ${result.direction.name} as a starting point.`)}
      </output>
    </section>
  );
}

const steps = [
  {
    name: "Brief",
    headline: "An unhurried cup.",
    detail:
      "Kissa is a small Tokyo roastery. The brief starts with a morning ritual and the pace it sets for the day.",
  },
  {
    name: "Photograph",
    headline: "Light through a paper screen.",
    detail:
      "Low morning light picks out the red tin and the rough glaze on the cup. Those two materials set the direction.",
  },
  {
    name: "Type and color",
    headline: "Paper, persimmon, roast.",
    detail:
      "Three colors come from the photograph. Close-set sans serif type makes the name feel at home on a small tin.",
  },
  {
    name: "Proof",
    headline: "The first campaign proof.",
    detail:
      "The image, name, and palette sit on one board, ready for a second pair of eyes.",
  },
] as const;

export function Process() {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLDivElement>(null);
  const sample = directions[0];

  useEffect(() => {
    const cards = section.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!cards?.length) return;
    let observer: IntersectionObserver | undefined;

    function observeSteps() {
      observer?.disconnect();
      if (!cards || window.innerWidth <= 780) return;
      const top = Math.round(window.innerHeight * 0.4);
      const bottom = Math.round(window.innerHeight * 0.48);
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(Number((entry.target as HTMLElement).dataset.step));
            }
          }
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px` },
      );
      for (const card of cards) observer.observe(card);
    }

    observeSteps();
    window.addEventListener("resize", observeSteps);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observeSteps);
    };
  }, []);

  return (
    <section
      className="mg-process"
      id="process"
      aria-labelledby="mg-process-title"
    >
      <div className="mg-shell mg-section">
        <div className="mg-section-heading">
          <h2 id="mg-process-title">Behind the Kissa proof</h2>
          <p>Four decisions behind a coffee roastery’s first campaign.</p>
        </div>
        <div className="mg-process-grid" ref={section}>
          <div className="mg-process-visual" data-stage={active}>
            <fieldset className="mg-process-picker">
              <legend className="mg-sr-only">Kissa process stages</legend>
              {steps.map((step, index) => (
                <button
                  key={step.name}
                  type="button"
                  aria-pressed={active === index}
                  aria-controls={`mg-step-${index + 1}`}
                  onClick={() => setActive(index)}
                >
                  {step.name}
                </button>
              ))}
            </fieldset>
            <div className="mg-process-bar mg-kicker">
              <Mark />
              <span>Kissa / Direction board</span>
              <span>0{active + 1} / 04</span>
            </div>
            <div className="mg-process-board" aria-hidden="true">
              <div className="mg-process-brief">
                <span className="mg-kicker">The brief</span>
                <p>{sample.brief}</p>
              </div>
              <div className="mg-process-photo">
                <Image
                  alt=""
                  src={directionImage(sample.slug)}
                  fill
                  sizes="(max-width: 780px) 48vw, 34vw"
                />
              </div>
              <div className="mg-process-type">
                <span className="mg-kicker">Type study</span>
                <strong>
                  Kissa<span>.</span>
                </strong>
              </div>
              <div className="mg-process-colors">
                {sample.palette.map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </div>
              <span className="mg-process-final mg-kicker">Morning ritual</span>
            </div>
          </div>
          <div className="mg-process-steps">
            {steps.map((step, index) => (
              <article
                className="mg-process-step"
                id={`mg-step-${index + 1}`}
                data-step={index}
                data-active={active === index}
                key={step.name}
              >
                <p className="mg-kicker">
                  0{index + 1} / {step.name}
                </p>
                <h3>{step.headline}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <Link className="mg-process-link mg-link" href={studioHref()}>
          Open Kissa in Studio <Icon name="out" />
        </Link>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Sketch",
    description: "For one project at a time.",
    monthly: 0,
    annually: 0,
    features: [
      "Personal workspace",
      "3 direction boards",
      "Type, color, and image controls",
    ],
  },
  {
    name: "Studio",
    description: "For independent creatives.",
    monthly: 24,
    annually: 19,
    features: [
      "Unlimited direction boards",
      "Campaign layout tools",
      "Board links for review",
    ],
  },
  {
    name: "Collective",
    description: "For a shared studio.",
    monthly: 62,
    annually: 49,
    features: [
      "Shared workspaces",
      "Team asset library",
      "Collaborator access",
    ],
  },
] as const;

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      className="mg-shell mg-section mg-pricing"
      id="plans"
      aria-labelledby="mg-plans-title"
    >
      <div className="mg-section-heading">
        <div>
          <h2 id="mg-plans-title">Plans</h2>
          <p>Sample pricing for the Monograph concept.</p>
        </div>
        <fieldset className="mg-billing">
          <legend className="mg-sr-only">Billing interval</legend>
          <button
            type="button"
            aria-pressed={!annual}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={annual}
            onClick={() => setAnnual(true)}
          >
            Yearly
          </button>
        </fieldset>
      </div>
      <div className="mg-plan-grid">
        {plans.map((plan) => (
          <article className="mg-plan" key={plan.name}>
            <div>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>
            <p className="mg-price" aria-live="polite">
              <strong>${annual ? plan.annually : plan.monthly}</strong>
              <span>
                {" "}
                / month{annual && plan.annually > 0 ? ", billed yearly" : ""}
              </span>
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="mg-plan-foot">
        <Link className="mg-link" href={studioHref()}>
          Try the free demo <Icon name="out" />
        </Link>
      </div>
    </section>
  );
}

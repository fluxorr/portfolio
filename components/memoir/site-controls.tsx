"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MemoirIcon, MemoirMark, MemoirWordmark } from "./brand";
import { GuidedAsk } from "./guided-ask";

type Panel = "waitlist" | "ask" | "menu" | "sign-in";
const PanelContext = createContext<
  ((panel: Panel, trigger: HTMLElement) => void) | null
>(null);
const links = [
  ["How it works", "#memoir-process"],
  ["Use cases", "#memoir-cases"],
  ["Stories", "#memoir-stories"],
  ["FAQ", "#memoir-faq"],
] as const;
const products = [
  {
    title: "Capture",
    detail: "Gather the moments worth keeping.",
    href: "#memoir-capture",
    icon: "voice",
  },
  {
    title: "Recall",
    detail: "Get an answer with its sources.",
    href: "#memoir-recall",
    icon: "search",
  },
  {
    title: "Connections",
    detail: "Follow a thread across your notes.",
    href: "#memoir-room",
    icon: "threads",
  },
  {
    title: "Privacy",
    detail: "See what stays in your browser.",
    href: "#memoir-privacy",
    icon: "shield",
  },
] as const;
const panelInfo = {
  waitlist: ["Get early access", "Join the Memoir waitlist."],
  ask: ["Ask Memoir", "Guided demo · Questions stay in this browser."],
  menu: ["Explore Memoir", "Product and site navigation"],
  "sign-in": [
    "Sign in",
    "This showcase uses a shared sample workspace. Account sign-in is unavailable in the preview.",
  ],
} as const;

export function AccessButton({
  className = "mm-btn mm-primary",
}: {
  className?: string;
}) {
  const open = useContext(PanelContext);
  return (
    <button
      className={className}
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => open?.("waitlist", event.currentTarget)}
    >
      Get early access <MemoirIcon name="arrow" />
    </button>
  );
}

function Waitlist({ configured }: { configured: boolean }) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const request = useRef<AbortController>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const email = new FormData(event.currentTarget).get("email");
    const controller = new AbortController();
    request.current = controller;
    setStatus("pending");
    setMessage("Submitting your email…");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      const result = await res.json();
      setStatus(res.ok ? "success" : "error");
      setMessage(result.message ?? "Please try again.");
    } catch {
      if (!controller.signal.aborted) {
        setStatus("error");
        setMessage("Couldn’t reach the waitlist. Try again in a moment.");
      }
    } finally {
      request.current = null;
    }
  }

  if (!configured)
    return (
      <div className="mm-waitlist-note">
        <p>
          The waitlist isn’t connected in this preview. You can try the sample
          workspace without an account.
        </p>
        <Dialog.Close asChild>
          <a className="mm-btn mm-primary" href="#memoir-demo">
            Try the workspace <MemoirIcon name="arrow" />
          </a>
        </Dialog.Close>
      </div>
    );
  return (
    <div>
      {status !== "success" && (
        <form className="mm-waitlist" onSubmit={submit}>
          <label htmlFor="mm-email">Email address</label>
          <input
            type="email"
            id="mm-email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            aria-describedby="mm-waitlist-status"
          />
          <button
            className="mm-btn mm-primary"
            type="submit"
            disabled={status === "pending"}
          >
            Join the waitlist <MemoirIcon name="arrow" />
          </button>
        </form>
      )}
      <output
        id="mm-waitlist-status"
        className="mm-form-status"
        data-status={status}
      >
        {message}
      </output>
    </div>
  );
}

export function MemoirControls({
  children,
  waitlistConfigured,
}: {
  children: ReactNode;
  waitlistConfigured: boolean;
}) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [lastPanel, setLastPanel] = useState<Panel>("ask");
  const trigger = useRef<HTMLElement>(null);
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  const active = panel ?? lastPanel;
  function open(next: Panel, element: HTMLElement) {
    trigger.current = element;
    setLastPanel(next);
    setPanel(next);
  }
  function close() {
    setPanel(null);
  }
  return (
    <PanelContext.Provider value={open}>
      {children}
      <button
        className="mm-launcher"
        aria-label="Ask Memoir"
        type="button"
        aria-haspopup="dialog"
        onClick={(event) => open("ask", event.currentTarget)}
      >
        <MemoirMark />{" "}
        <span aria-hidden="true">
          Ask<span className="mm-launcher-name"> Memoir</span>
        </span>
      </button>
      <div ref={setPortal} />
      <Dialog.Root
        open={panel !== null}
        onOpenChange={(value) => {
          if (!value) close();
        }}
      >
        <Dialog.Portal container={portal}>
          <Dialog.Overlay className="mm-dialog-overlay" />
          <Dialog.Content
            className="mm-dialog"
            data-panel={active}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (trigger.current?.isConnected)
                trigger.current.focus({ preventScroll: true });
              else
                document
                  .getElementById("memoir-mobile-menu")
                  ?.focus({ preventScroll: true });
            }}
          >
            <div className="mm-dialog-head">
              <Dialog.Title>{panelInfo[active][0]}</Dialog.Title>
              <Dialog.Close
                className="mm-icon-button"
                aria-label="Close dialog"
              >
                <MemoirIcon name="close" />
              </Dialog.Close>
            </div>
            <Dialog.Description
              className={
                active === "menu" ||
                (active === "waitlist" && !waitlistConfigured)
                  ? "mm-sr"
                  : "mm-dialog-description"
              }
            >
              {panelInfo[active][1]}
            </Dialog.Description>
            {active === "ask" && <GuidedAsk />}
            {active === "waitlist" && (
              <Waitlist configured={waitlistConfigured} />
            )}
            {active === "sign-in" && (
              <Dialog.Close asChild>
                <a className="mm-btn mm-primary" href="#memoir-demo">
                  Open the sample workspace <MemoirIcon name="arrow" />
                </a>
              </Dialog.Close>
            )}
            {active === "menu" && (
              <div className="mm-mobile-links">
                {products.map(({ title, href, icon }) => (
                  <a href={href} key={title} onClick={close}>
                    <MemoirIcon name={icon} />
                    {title}
                  </a>
                ))}
                {links.map(([label, href]) => (
                  <a href={href} key={href} onClick={close}>
                    {label}
                    <MemoirIcon name="arrow" />
                  </a>
                ))}
                <button
                  type="button"
                  onClick={(event) => open("sign-in", event.currentTarget)}
                >
                  Sign in
                </button>
                <AccessButton />
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </PanelContext.Provider>
  );
}

export function MemoirNav() {
  const open = useContext(PanelContext);
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target))
        setExpanded(false);
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpanded(false);
        toggle.current?.focus();
      }
    }
    function focusOutside(event: FocusEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target))
        setExpanded(false);
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("focusin", focusOutside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("focusin", focusOutside);
    };
  }, [expanded]);

  return (
    <>
      <div className="mm-announcement" id="memoir-top">
        <a href="#memoir-process">
          <span>Introducing Memoir</span>
          <span>Meet your memory, on demand</span>
          <MemoirIcon name="arrow" />
        </a>
      </div>
      <header className="mm-header" data-scrolled={scrolled}>
        <div className="mm-shell mm-nav">
          <MemoirWordmark />
          <nav className="mm-desktop-nav" aria-label="Memoir navigation">
            <div ref={menu} className="mm-product-menu">
              <button
                ref={toggle}
                type="button"
                aria-expanded={expanded}
                aria-controls="mm-product-links"
                onClick={() => setExpanded(!expanded)}
              >
                Product <MemoirIcon name="down" />
              </button>
              {expanded && (
                <div id="mm-product-links" className="mm-mega-menu">
                  {products.map(({ title, detail, href, icon }) => (
                    <a
                      href={href}
                      key={title}
                      onClick={() => setExpanded(false)}
                    >
                      <span className="mm-menu-diagram">
                        <MemoirIcon name={icon} />
                      </span>
                      <span>
                        <strong>{title}</strong>
                        <small>{detail}</small>
                      </span>
                      <MemoirIcon name="arrow" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            {links.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="mm-nav-actions">
            <button
              className="mm-nav-login"
              type="button"
              aria-haspopup="dialog"
              onClick={(event) => open?.("sign-in", event.currentTarget)}
            >
              Sign in
            </button>
            <AccessButton />
          </div>
          <button
            className="mm-icon-button mm-menu-toggle"
            id="memoir-mobile-menu"
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={(event) => open?.("menu", event.currentTarget)}
          >
            <MemoirIcon name="menu" />
          </button>
        </div>
      </header>
    </>
  );
}

"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";
import { faq } from "@/lib/memoir";
import { MemoirIcon } from "./brand";

export function MemoirFaq() {
  const [value, setValue] = useState("");
  useEffect(() => {
    function followPrivacyLink() {
      if (location.hash === "#memoir-privacy") setValue("3");
    }
    followPrivacyLink();
    window.addEventListener("hashchange", followPrivacyLink);
    return () => window.removeEventListener("hashchange", followPrivacyLink);
  }, []);
  return (
    <section
      className="mm-shell mm-section mm-faq"
      id="memoir-faq"
      aria-labelledby="memoir-faq-title"
    >
      <div>
        <p className="mm-label">FAQ</p>
        <h2 id="memoir-faq-title">Good to know.</h2>
      </div>
      <Accordion.Root
        className="mm-faq-list"
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
      >
        {faq.map(([question, answer], index) => (
          <Accordion.Item
            key={question}
            value={String(index)}
            id={index === 3 ? "memoir-privacy" : undefined}
          >
            <Accordion.Header>
              <Accordion.Trigger>
                {question}
                <MemoirIcon name="plus" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="mm-faq-content">
              <p>{answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}

"use client";

import { type FormEvent, useId, useState } from "react";
import {
  answers,
  type DemoAnswer,
  findAnswer,
  getMemory,
  sourceLabels,
} from "@/lib/memoir";
import { MemoirIcon } from "./brand";

export function AnswerCitation({
  answer,
  onSource,
  showQuestion = false,
}: {
  answer: DemoAnswer;
  showQuestion?: boolean;
  onSource?: (id: string) => void;
}) {
  const [sourceId, setSourceId] = useState<string>();
  const detailId = useId();
  const memory = sourceId ? getMemory(sourceId) : null;

  return (
    <div className="mm-answer">
      <p className="mm-label">
        <MemoirIcon name="threads" /> Sample answer
      </p>
      {showQuestion && <p className="mm-answer-question">{answer.question}</p>}
      <p className="mm-answer-text">{answer.answer}</p>
      <ul className="mm-citations" aria-label="Supporting sources">
        {answer.sourceMemoryIds.map((id) => {
          const source = getMemory(id);
          return (
            <li key={id}>
              <button
                type="button"
                aria-pressed={sourceId === id}
                aria-controls={detailId}
                onClick={() => {
                  setSourceId(sourceId === id ? undefined : id);
                  onSource?.(id);
                }}
              >
                <MemoirIcon name={source.sourceType} />
                {source.title}
              </button>
            </li>
          );
        })}
      </ul>
      <div id={detailId} aria-live="polite">
        {memory && (
          <blockquote className="mm-cited-source">
            <span className="mm-label">
              {sourceLabels[memory.sourceType]} · {memory.capturedAt}
            </span>
            <p>{memory.excerpt}</p>
          </blockquote>
        )}
      </div>
    </div>
  );
}

export function GuidedAsk({
  initialAnswer,
  withInput = true,
  onSource,
}: {
  initialAnswer?: DemoAnswer;
  withInput?: boolean;
  onSource?: (id: string) => void;
}) {
  const [answer, setAnswer] = useState<DemoAnswer | undefined>(initialAnswer);
  const [unmatched, setUnmatched] = useState(false);
  const [question, setQuestion] = useState("");
  const inputId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    const match = findAnswer(question);
    setAnswer(match);
    setUnmatched(!match);
    setQuestion("");
  }

  return (
    <div className="mm-ask">
      {withInput && (
        <form className="mm-composer" onSubmit={submit}>
          <label htmlFor={inputId} className="mm-sr">
            Ask a sample question
          </label>
          <input
            id={inputId}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask the sample library…"
            autoComplete="off"
            maxLength={250}
          />
          <button
            type="submit"
            aria-label="Find answer"
            disabled={!question.trim()}
          >
            <MemoirIcon name="up" />
          </button>
        </form>
      )}
      <ul className="mm-ask-options" aria-label="Example questions">
        {answers.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              aria-pressed={answer?.id === option.id}
              aria-label={option.question}
              onClick={() => {
                setAnswer(option);
                setQuestion("");
                setUnmatched(false);
              }}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      <div aria-live="polite">
        {answer ? (
          <AnswerCitation
            answer={answer}
            onSource={onSource}
            showQuestion
            key={answer.id}
          />
        ) : (
          <p className="mm-empty-answer">
            {unmatched
              ? "This is a guided demo. Pick one of the example questions to see a sourced answer."
              : "Choose an example to see what’s in the sample library."}
          </p>
        )}
      </div>
    </div>
  );
}

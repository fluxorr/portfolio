"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useState } from "react";
import {
  type BrandDirection,
  directionImage,
  directions,
  monographPath,
  readableInk,
  studioHref,
} from "./directions";
import { Icon } from "./identity";

export function DirectionLibrary() {
  const [direction, setDirection] = useState<BrandDirection>(directions[0]);
  const [paperIndex, setPaperIndex] = useState(0);
  const paper = direction.palette[paperIndex];
  const colors = {
    "--proof-paper": paper,
    "--proof-ink": readableInk(paper, direction.palette[2]),
  } as CSSProperties;

  return (
    <section
      className="mg-shell mg-section mg-library"
      id="directions"
      aria-labelledby="mg-directions-title"
    >
      <div className="mg-section-heading">
        <h2 id="mg-directions-title">Direction library</h2>
        <p>
          Six sample identities. Pick one and try its colors on the campaign
          proof.
        </p>
      </div>
      <div className="mg-library-grid">
        <ul className="mg-library-index" aria-label="Sample identities">
          {directions.map((option) => (
            <li key={option.slug}>
              <button
                type="button"
                aria-pressed={option.slug === direction.slug}
                aria-controls="mg-direction-proof"
                onClick={() => {
                  if (option.slug === direction.slug) return;
                  setDirection(option);
                  setPaperIndex(0);
                }}
              >
                <span>
                  <strong>{option.name}</strong>
                  <span>{option.category}</span>
                </span>
                <Icon name="right" />
              </button>
            </li>
          ))}
        </ul>
        <div className="mg-proof" id="mg-direction-proof">
          <div
            className="mg-proof-board"
            data-type={direction.type}
            data-direction={direction.slug}
            style={colors}
          >
            <div className="mg-proof-type">
              <span className="mg-kicker">{direction.category}</span>
              <h3>{direction.name}</h3>
              <p>{direction.line}</p>
            </div>
            <div className="mg-proof-image" key={direction.slug}>
              <Image
                src={directionImage(direction.slug)}
                alt={direction.subject}
                fill
                sizes="(max-width: 530px) 85vw, (max-width: 780px) 51vw, 32vw"
              />
            </div>
          </div>
          <div className="mg-proof-controls">
            <fieldset className="mg-proof-palette">
              <legend>Proof background</legend>
              {direction.palette.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  aria-pressed={index === paperIndex}
                  aria-label={direction.labels[index]}
                  title={direction.labels[index]}
                  onClick={() => setPaperIndex(index)}
                >
                  <span
                    className="mg-proof-chip"
                    style={{ background: color }}
                  />
                  <span className="mg-proof-chip-label">
                    {direction.labels[index]}
                  </span>
                </button>
              ))}
            </fieldset>
            <div className="mg-proof-links">
              <Link
                className="mg-link"
                href={`${monographPath}/directions/${direction.slug}`}
              >
                Read the direction <Icon name="out" />
              </Link>
              <Link
                className="mg-button"
                href={studioHref(direction.slug, undefined, paper)}
              >
                Edit this proof <Icon name="out" />
              </Link>
            </div>
          </div>
          <output className="mg-sr-only">
            {direction.name} proof on {direction.labels[paperIndex]}.
          </output>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { emberlogPath, plans } from "@/lib/emberlog";
import { EmberIcon } from "./mark";

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <div className="el-pricing">
      <div className="el-pricing-controls">
        <p>Illustrative plans for the Emberlog concept.</p>
        <fieldset className="el-billing" data-annual={annual}>
          <legend className="el-sr">Billing interval</legend>
          <button
            aria-pressed={!annual}
            onClick={() => setAnnual(false)}
            type="button"
          >
            Monthly
          </button>
          <button
            aria-pressed={annual}
            onClick={() => setAnnual(true)}
            type="button"
          >
            Yearly
          </button>
        </fieldset>
      </div>
      <div className="el-plan-grid">
        {plans.map((plan, index) => {
          const price = annual ? plan.yearly : plan.monthly;
          return (
            <article
              className="el-plan"
              data-featured={index === 1}
              key={plan.name}
            >
              <div className="el-plan-heading">
                <h3>{plan.name}</h3>
                {index === 1 && annual && <span>Save 21%</span>}
              </div>
              <p>{plan.copy}</p>
              <div
                aria-live={index === 1 ? "polite" : undefined}
                className="el-price"
              >
                <strong key={price}>
                  {price === null ? "Custom" : `$${price}`}
                </strong>
                {price !== null && (
                  <span>{index === 0 ? "free" : "/ seat per month"}</span>
                )}
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <EmberIcon name="check" /> {feature}
                  </li>
                ))}
              </ul>
              <Link
                className={`el-button ${index === 1 ? "el-primary" : "el-secondary"}`}
                href={
                  index === 2
                    ? "/#contact"
                    : index === 1
                      ? `${emberlogPath}/docs#replay`
                      : `${emberlogPath}#replay`
                }
                prefetch={false}
              >
                {index === 2
                  ? "Contact the studio"
                  : index === 1
                    ? "Explore team workflow"
                    : "Try the replay"}{" "}
                <EmberIcon name={index === 2 ? "up" : "arrow"} />
              </Link>
            </article>
          );
        })}
      </div>
      <details className="el-compare">
        <summary>
          Compare every feature <EmberIcon name="down" />
        </summary>
        <div>
          <table>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.name} scope="col">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Stored takes", "100", "10,000", "Custom"],
                ["History", "7 days", "30 days", "Custom"],
                ["Local replay", "Included", "Included", "Included"],
                ["Shared links", "—", "Included", "Included"],
                ["Self-hosting", "—", "—", "Included"],
              ].map(([label, ...entries]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {entries.map((entry, index) => (
                    <td key={plans[index].name}>{entry}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

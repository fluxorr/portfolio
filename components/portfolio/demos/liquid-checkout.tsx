"use client";

import Image from "next/image";
import { useState } from "react";
import { Arrow, Check } from "../links";
import { usePointerPosition } from "./use-pointer-position";

const ticketPrice = 48;
const feePerTicket = 4;
const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function LiquidCheckout() {
  const stageRef = usePointerPosition<HTMLDivElement>();
  const [{ quantity, direction }, setTickets] = useState({
    quantity: 1,
    direction: 0,
  });
  const [complete, setComplete] = useState(false);
  const subtotal = quantity * ticketPrice;
  const fee = quantity * feePerTicket;
  const total = subtotal + fee;

  function changeQuantity(direction: number) {
    setTickets((current) => ({
      quantity: Math.max(1, Math.min(6, current.quantity + direction)),
      direction,
    }));
  }

  return (
    <div className="demo-liquid-stage" ref={stageRef}>
      <div
        className="demo-liquid-panel"
        data-complete={complete}
        data-direction={direction}
      >
        <div className="demo-liquid-header">
          <h4>Checkout</h4>
          <span>USD</span>
        </div>
        <div className="demo-liquid-state">
          <div
            aria-hidden={!complete}
            className="demo-liquid-success"
            inert={!complete}
          >
            <div aria-hidden="true" className="demo-liquid-check">
              <Check />
            </div>
            <output>
              <strong>Demo order complete</strong>
              <span>
                {quantity} {quantity === 1 ? "ticket" : "tickets"} ·{" "}
                {formatPrice.format(total)}
              </span>
            </output>
          </div>
          <div
            aria-hidden={complete}
            className="demo-liquid-order"
            inert={complete}
          >
            <div className="demo-liquid-item">
              <div className="demo-liquid-thumb">
                <Image
                  alt=""
                  fill
                  sizes="56px"
                  src="/showcase/night-signal-street.webp"
                />
              </div>
              <div className="demo-liquid-item-copy">
                <strong>Night Signal</strong>
                <p>Screening ticket</p>
              </div>
              <fieldset className="demo-liquid-stepper">
                <legend className="sr-only">Ticket quantity</legend>
                <button
                  aria-label="Remove one ticket"
                  disabled={quantity === 1}
                  onClick={() => changeQuantity(-1)}
                  type="button"
                >
                  −
                </button>
                <output aria-label="Quantity">
                  <span className="demo-liquid-number" key={quantity}>
                    {quantity}
                  </span>
                </output>
                <button
                  aria-label="Add one ticket"
                  disabled={quantity === 6}
                  onClick={() => changeQuantity(1)}
                  type="button"
                >
                  +
                </button>
              </fieldset>
            </div>
            <dl className="demo-liquid-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>
                  <span className="demo-liquid-number" key={subtotal}>
                    {formatPrice.format(subtotal)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Booking fee</dt>
                <dd>
                  <span className="demo-liquid-number" key={fee}>
                    {formatPrice.format(fee)}
                  </span>
                </dd>
              </div>
              <div className="demo-liquid-total">
                <dt>Total</dt>
                <dd>
                  <output>
                    <span className="demo-liquid-number" key={total}>
                      {formatPrice.format(total)}
                    </span>
                  </output>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <button
          className="demo-liquid-primary"
          onClick={() => setComplete((value) => !value)}
          type="button"
        >
          <span className="demo-liquid-primary-label">
            <span aria-hidden={complete}>Complete demo order</span>
            <span aria-hidden={!complete}>Back to checkout</span>
          </span>
          <Arrow />
        </button>
      </div>
    </div>
  );
}

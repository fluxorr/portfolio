import { useId } from "react";

type Slip = {
  id: string;
  vendor: string;
  line: string;
  reference: string;
  amount: string;
};

export const sampleInvoices: Slip[] = [
  {
    id: "rivet",
    vendor: "Rivet Studio",
    line: "Design services",
    reference: "RVT–2084",
    amount: "₹14,500.00",
  },
  {
    id: "forma",
    vendor: "Forma Press",
    line: "Print production",
    reference: "FP–1046",
    amount: "₹8,200.00",
  },
  {
    id: "field",
    vendor: "Field Supply",
    line: "Studio supplies",
    reference: "FS–0261",
    amount: "₹3,240.00",
  },
];

const paperColors = ["#f1e8d4", "#e9ead9", "#eee2d8"];

function trimSlipText(value: string, max: number) {
  const characters = Array.from(value);
  return characters.length > max
    ? `${characters.slice(0, max - 1).join("")}…`
    : value;
}

// Leather, stitching, and invoice art adapted from Slips' wallet-object.tsx.
export function WalletObject({
  selected,
  slips,
}: {
  selected: number;
  slips: Slip[];
}) {
  const id = useId();
  const stack = slips
    .map((invoice, index) => ({
      invoice,
      index,
      position: (index - selected + slips.length) % slips.length,
    }))
    .sort((a, b) => b.position - a.position);
  const fill = (name: string) => `url(#${id}-${name})`;
  const pocket =
    "M92 222 C150 211 193 212 222 224 C275 246 339 248 397 227 C428 216 460 214 505 222 V358 C505 387 490 399 464 399 H134 C105 399 92 383 92 354 Z";
  const backing =
    "M93 221 V157 C93 131 110 115 135 115 H462 C489 115 505 133 505 158 V222 L479 337 H123 Z";

  return (
    <svg
      className="wallet-object"
      viewBox="0 -78 600 524"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-shell`}
          x1="150"
          y1="119"
          x2="467"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c58158" />
          <stop offset=".28" stopColor="#9a5136" />
          <stop offset=".75" stopColor="#6e3425" />
          <stop offset="1" stopColor="#381810" />
        </linearGradient>
        <linearGradient
          id={`${id}-lining`}
          x1="183"
          y1="125"
          x2="362"
          y2="325"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3d2119" />
          <stop offset=".53" stopColor="#53291b" />
          <stop offset="1" stopColor="#2d1814" />
        </linearGradient>
        <linearGradient
          id={`${id}-pocket`}
          x1="95"
          y1="219"
          x2="438"
          y2="446"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#bb7350" />
          <stop offset=".23" stopColor="#a95c3d" />
          <stop offset=".64" stopColor="#86452e" />
          <stop offset=".9" stopColor="#64321f" />
          <stop offset="1" stopColor="#55291d" />
        </linearGradient>
        <linearGradient
          id={`${id}-sheen`}
          x1="235"
          y1="217"
          x2="260"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffbe91" stopOpacity=".2" />
          <stop offset=".32" stopColor="#ea9a73" stopOpacity="0" />
          <stop offset=".86" stopColor="#2e140e" stopOpacity=".14" />
          <stop offset="1" stopColor="#2e140e" stopOpacity=".5" />
        </linearGradient>
        <linearGradient id={`${id}-paper-light`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fffdf7" stopOpacity=".33" />
          <stop offset=".55" stopColor="#fffdf7" stopOpacity="0" />
          <stop offset="1" stopColor="#62523d" stopOpacity=".27" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffdf92" />
          <stop offset=".36" stopColor="#d5ab61" />
          <stop offset=".65" stopColor="#886033" />
          <stop offset="1" stopColor="#c49a56" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#120b08" stopOpacity=".76" />
          <stop offset=".65" stopColor="#120b08" stopOpacity=".37" />
          <stop offset="1" stopColor="#120b08" stopOpacity="0" />
        </radialGradient>
        <pattern
          id={`${id}-grain`}
          width="125"
          height="125"
          patternUnits="userSpaceOnUse"
        >
          <image href="/showcase/slips-grain.webp" width="125" height="125" />
        </pattern>
        <clipPath id={`${id}-slips`}>
          <path d="M34 -110H566V237H34Z" />
        </clipPath>
      </defs>

      <g transform="rotate(-9 300 240)">
        <ellipse cx="329" cy="392" rx="267" ry="49" fill={fill("shadow")} />
        <ellipse cx="312" cy="397" rx="216" ry="19" fill={fill("shadow")} />
        <path
          d={backing}
          fill={fill("shell")}
          stroke="#2e170f"
          strokeWidth="4"
        />
        <path
          d="M101 225 V158 Q101 123 136 123 H460 Q496 123 496 158 V224 L470 364 H127Z"
          fill={fill("lining")}
          stroke="#dc9062"
          strokeOpacity=".44"
        />
        <path
          d="M106 211 V158 Q106 129 136 129 H460 Q491 129 491 158 V211"
          stroke="#db9669"
          strokeOpacity=".55"
          strokeWidth="1.4"
          strokeDasharray="3 4.8"
          strokeLinecap="round"
        />

        {slips.length > 0 && (
          <g clipPath={fill("slips")}>
            {stack.map(({ invoice, index, position }) => (
              <g
                key={invoice.id}
                className="wallet-slip-position"
                data-position={position}
              >
                <g transform="translate(173 48)">
                  <rect
                    x="2"
                    y="4"
                    width="241"
                    height="259"
                    rx="5"
                    fill="#271b13"
                    opacity=".38"
                  />
                  <rect
                    width="239"
                    height="259"
                    rx="4"
                    fill={paperColors[index % paperColors.length]}
                    stroke="#544638"
                    strokeOpacity=".33"
                  />
                  <rect
                    x="1"
                    y="1"
                    width="237"
                    height="257"
                    rx="3"
                    fill={fill("paper-light")}
                    stroke="#fff8e9"
                    strokeOpacity=".72"
                  />
                  <rect
                    x="21"
                    y="23"
                    width="197"
                    height="1"
                    fill="#716351"
                    opacity=".38"
                  />
                  <text x="21" y="44" className="slip-mono" fill="#645e53">
                    INVOICE
                  </text>
                  <text
                    x="218"
                    y="44"
                    className="slip-mono"
                    textAnchor="end"
                    fill="#645e53"
                  >
                    {trimSlipText(invoice.reference, 22)}
                  </text>
                  <text x="20" y="77" className="slip-vendor" fill="#2f281e">
                    {trimSlipText(invoice.vendor, 17)}
                  </text>
                  <text x="21" y="96" className="slip-note" fill="#615546">
                    {invoice.line}
                  </text>
                  <path
                    d="M21 116H218M21 160H218M21 187H218"
                    stroke="#6a5944"
                    strokeOpacity=".3"
                  />
                  <text x="21" y="143" className="slip-mono" fill="#645e53">
                    TOTAL
                  </text>
                  <text
                    x="218"
                    y="144"
                    className="slip-total"
                    textAnchor="end"
                    fill="#392d22"
                  >
                    {invoice.amount}
                  </text>
                  <path
                    d="M21 175h75m-75 25h55m-55 12h37"
                    stroke="#6a5944"
                    strokeOpacity=".32"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            ))}
          </g>
        )}

        <path
          d={pocket}
          transform="translate(2 6)"
          fill="#462218"
          stroke="#311912"
          strokeWidth="3"
        />
        <path
          d={pocket}
          fill={fill("pocket")}
          stroke="#59301f"
          strokeWidth="2"
        />
        <path
          d={pocket}
          fill={fill("grain")}
          opacity=".42"
          style={{ mixBlendMode: "soft-light" }}
        />
        <path d={pocket} fill={fill("sheen")} />
        <path
          d="M93 223 C150 211 193 212 222 224 C275 246 339 248 397 227 C428 216 460 214 504 222"
          stroke="#e5a27f"
          strokeOpacity=".72"
          strokeWidth="1.7"
        />
        <path
          d="M102 231 C154 221 197 222 219 234 C275 255 341 256 402 236 C432 227 463 224 495 231 V353 Q495 388 463 388 H135 Q102 388 102 353Z"
          stroke="#4b2417"
          strokeOpacity=".68"
          strokeWidth="2.4"
          strokeDasharray="3.1 4.3"
          strokeLinecap="round"
        />
        <path
          d="M102 230 C154 220 197 221 219 233 C275 254 341 255 402 235 C432 226 463 223 495 230 V352 Q495 387 463 387 H135 Q102 387 102 352Z"
          stroke="#e49b73"
          strokeOpacity=".78"
          strokeWidth="1.35"
          strokeDasharray="3.1 4.3"
          strokeLinecap="round"
        />

        <g transform="translate(119 309)">
          <path
            d="M-.5 4H72Q84 4 84 16V35Q84 48 72 48H-.5Z"
            fill="#3b1c13"
            opacity=".72"
          />
          <path
            d="M-25 1H71Q82 1 82 13V36Q82 44 71 44H-25Z"
            fill={fill("shell")}
            stroke="#6b3724"
            strokeWidth="1.4"
          />
          <path
            d="M-25 1H71Q82 1 82 13V36Q82 44 71 44H-25Z"
            fill={fill("grain")}
            opacity=".4"
            style={{ mixBlendMode: "soft-light" }}
          />
          <path
            d="M-20 7H70Q76 7 76 13V34Q76 38 70 38H-20"
            stroke="#e3a17d"
            strokeOpacity=".65"
            strokeWidth="1.2"
            strokeDasharray="2.3 3.7"
            strokeLinecap="round"
          />
          <circle cx="59" cy="24" r="11" fill="#4c2919" />
          <circle
            cx="59"
            cy="22"
            r="10"
            fill={fill("brass")}
            stroke="#d0a26f"
          />
          <circle cx="59" cy="22" r="6.8" stroke="#7b562f" strokeOpacity=".7" />
          <path
            d="M55 22h8"
            stroke="#60401f"
            strokeOpacity=".5"
            strokeLinecap="round"
          />
        </g>
        <text
          x="469"
          y="366"
          className="wallet-imprint"
          textAnchor="end"
          fill="#d8946b"
          opacity=".53"
        >
          slips.
        </text>
        <text
          x="469"
          y="365"
          className="wallet-imprint"
          textAnchor="end"
          fill="#3d1f16"
          opacity=".81"
        >
          slips.
        </text>
      </g>
    </svg>
  );
}

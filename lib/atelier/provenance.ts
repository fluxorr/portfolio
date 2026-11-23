export type ClaimStatus = "Documented" | "Unconfirmed" | "Conflicting";
export type EvidenceStage = {
  id: "origin" | "revisions" | "custody";
  title: string;
  date: string;
  text: string;
  status: ClaimStatus;
  by: string;
  source?: { href: string; label: string };
  hash?: string;
};
export type Revision = {
  id: string;
  date: string;
  note: string;
  versions?: { before: string; after: string };
};
export type AssetRecord = {
  id: string;
  title: string;
  contributor: string;
  created: string;
  license: string;
  sample: boolean;
  image?: string;
  stages: EvidenceStage[];
  revisions: Revision[];
};
export const sampleRecord: AssetRecord = {
  id: "014",
  title: "Tidal Index",
  contributor: "Studio specimen",
  created: "2026-11-20",
  license: "Creative Commons CC0",
  sample: true,
  image: "/studies/tidal-index.svg",
  stages: [
    {
      id: "origin",
      title: "Origin",
      date: "2026-11-20",
      text: "The cover begins as an original vector plate. The drawing file supplied here is the source recorded for this sample.",
      status: "Documented",
      by: "Atelier sample archive",
      source: {
        href: "/studies/tidal-index.svg",
        label: "Open source artwork",
      },
      hash: "eb374638898ea435caf466bda3d4da44f3c89d8bd852911e0660af42a7f0bcbc",
    },
    {
      id: "revisions",
      title: "Revisions",
      date: "2026-11-22",
      text: "Three change notes were supplied with the cover. This record includes the final artwork and a written history.",
      status: "Documented",
      by: "Studio specimen",
    },
    {
      id: "custody",
      title: "Custody",
      date: "2026-11-23",
      text: "The sample lists a studio handoff and a CC0 license. Recipient acknowledgement is absent from the chain of custody.",
      status: "Unconfirmed",
      by: "Studio specimen",
    },
  ],
  revisions: [
    {
      id: "v01",
      date: "2026-11-20",
      note: "Drafted the baseline contours and set the circular crop.",
    },
    {
      id: "v02",
      date: "2026-11-21",
      note: "Changed the contour intervals and shifted the tide marker toward the upper right.",
    },
    {
      id: "v03",
      date: "2026-11-22",
      note: "Increased the contrast of the contour lines and added the edition inscription.",
    },
  ],
};

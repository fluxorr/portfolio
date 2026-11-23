import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { CommonhourExperience } from "@/components/commonhour/experience";
import { commonhourImage, commonhourPath } from "@/lib/commonhour";
import { showcaseFont } from "@/lib/showcase-font";
import "./commonhour.css";

const numbers = Space_Grotesk({
  subsets: ["latin"],
  variable: "--ch-numbers",
  preload: false,
});
const title = "Commonhour — Meet in the middle";
const description =
  "A scheduling concept for creative teams that work across time zones. Preview working hours and book a sample meeting.";
const image = {
  url: commonhourImage,
  width: 1200,
  height: 630,
  alt: "Commonhour’s live booking workspace on a cobalt dithered background.",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: commonhourPath },
  openGraph: { title, description, url: commonhourPath, images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  colorScheme: "light",
};

export default function CommonhourPage() {
  return (
    <div className={`commonhour ${showcaseFont.variable} ${numbers.variable}`}>
      <CommonhourExperience />
    </div>
  );
}

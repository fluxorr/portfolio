import { Geist_Mono, Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({
  variable: "--font-atelier-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
const mono = Geist_Mono({
  variable: "--font-atelier-mono",
  subsets: ["latin"],
  display: "swap",
});
export const atelierFonts = `${serif.variable} ${mono.variable}`;

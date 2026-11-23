import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { portfolio } from "@/lib/portfolio-content";
import "./globals.css";
import "./portfolio.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: portfolio.title,
  description: portfolio.description,
  authors: [{ name: portfolio.name, url: portfolio.url }],
  creator: portfolio.name,
  metadataBase: new URL(portfolio.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: portfolio.title,
    description: portfolio.description,
    url: portfolio.url,
    siteName: portfolio.wordmark,
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "byflux — Seven selected website projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolio.title,
    description: portfolio.description,
    images: ["/social-card.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={geistSans.variable}>
        {children}
        {process.env.VERCEL === "1" ? <Analytics /> : null}
      </body>
    </html>
  );
}

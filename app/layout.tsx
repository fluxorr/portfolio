import type { Metadata } from "next";
import {
  Funnel_Display,
  Geist,
  Geist_Mono,
  Inter,
  Playwrite_FR_Moderne_Guides,
  Syne,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const playwrite = Playwrite_FR_Moderne_Guides({
  variable: "--font-hand",
  weight: ["400"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Fluxorr.", template: "%s | Fluxorr." },
  description:
    "Full-stack engineer portfolio — building thoughtful interfaces and systems.",
  keywords: [
    "portfolio",
    "full-stack",
    "engineer",
    "developer",
    "react",
    "next.js",
  ],
  authors: [{ name: "Rahul Chaudhari", url: "https://byflux.me" }],
  creator: "Rahul Chaudhari",
  metadataBase: new URL("https://byflux.me"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fluxorr.",
    description:
      "Full-stack engineer portfolio — building thoughtful interfaces and systems.",
    url: "https://byflux.me",
    siteName: "Fluxorr.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fluxorr.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluxorr.",
    description:
      "Full-stack engineer portfolio — building thoughtful interfaces and systems.",
    creator: "@fluxorr_",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const classes = cn(
    "antialiased",
    geistSans.variable,
    geistMono.variable,
    inter.variable,
    funnelDisplay.variable,
    playwrite.variable,
    syne.variable,
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
(function(){try{var h=document.documentElement,e=localStorage.getItem("theme");if(e==="dark"||(e!="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches))h.classList.add("dark")}catch(e){}})()
            `.trim(),
          }}
        />
      </head>
      <body className={cn("min-h-full flex flex-col selection:bg-foreground/40 dark:selection:bg-foreground/40 dark:selection:text-background selection:text-background  ", classes, "font-sans")}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

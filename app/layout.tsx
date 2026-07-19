import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Funnel_Display, Playwrite_FR_Moderne_Guides, Syne } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
  title: "Fluxorr.",
  description: "Minimal portfolio",
  openGraph: {
    title: "Fluxorr.",
    description: "Minimal portfolio",
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
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const classes = cn("antialiased", geistSans.variable, geistMono.variable, inter.variable, funnelDisplay.variable, playwrite.variable, syne.variable);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){try{var h=document.documentElement,e=localStorage.getItem("theme");if(e==="dark"||(e!="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches))h.classList.add("dark")}catch(e){}})()
            `.trim(),
          }}
        />
      </head>
      <body className={cn("min-h-full flex flex-col", classes, "font-sans")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

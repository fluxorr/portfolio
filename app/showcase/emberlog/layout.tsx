import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { EmberNav } from "@/components/emberlog/chrome";
import { EmberFooter } from "@/components/emberlog/footer";
import {
  emberlogDescription,
  emberlogImage,
  emberlogPath,
} from "@/lib/emberlog";
import "./emberlog.css";

const body = Hanken_Grotesk({
  variable: "--el-body",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--el-mono",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

const image = {
  url: emberlogImage,
  width: 1200,
  height: 630,
  alt: "Emberlog’s isometric request reader and ember playhead beside the headline Rewind any request.",
};
export const metadata: Metadata = {
  title: "Emberlog — Rewind any request",
  description: emberlogDescription,
  alternates: { canonical: emberlogPath },
  icons: { icon: "/emberlog/icon.svg" },
  openGraph: {
    siteName: "Emberlog",
    title: "Emberlog — Rewind any request",
    description: emberlogDescription,
    url: emberlogPath,
    type: "website",
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emberlog — Rewind any request",
    description: emberlogDescription,
    images: [image],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#111210" },
  ],
};

const initializeTheme =
  "try{var theme=localStorage.getItem('emberlog-theme');if(theme==='light'||theme==='dark')document.getElementById('emberlog-site').dataset.theme=theme}catch{}";

export default function EmberlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`el-site ${body.variable} ${mono.variable}`}
      id="emberlog-site"
      suppressHydrationWarning
    >
      <script suppressHydrationWarning>{initializeTheme}</script>
      <EmberNav />
      {children}
      <EmberFooter />
    </div>
  );
}

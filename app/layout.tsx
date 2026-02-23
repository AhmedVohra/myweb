import type { Metadata } from "next";
import "../styles/retro.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CRTOverlay from "@/components/CRTOverlay";

export const metadata: Metadata = {
  title: "BC.KNOWLEDGE | AL Developer's Knowledgebase",
  description:
    "A personal knowledgebase and blog for Business Central and AL development — tips, tutorials, patterns, and best practices.",
  keywords:
    "Business Central, AL Development, Dynamics 365, Microsoft, NAV, ERP, Development",
  openGraph: {
    title: "BC.KNOWLEDGE | AL Developer's Knowledgebase",
    description:
      "Retro-styled knowledgebase for Business Central and AL developers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="boot-animate">
        <CRTOverlay />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer
          className="border-t mt-12 py-8 px-4 text-center"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--text-muted)",
              lineHeight: 2.5,
            }}
          >
            <div style={{ color: "var(--primary)" }}>BC.KNOWLEDGE</div>
            <div>
              &copy; {new Date().getFullYear()} // AL DEVELOPER&apos;S
              KNOWLEDGEBASE
            </div>
            <div style={{ color: "var(--secondary)" }}>
              BUILT WITH NEXT.JS + CLOUDFLARE PAGES
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

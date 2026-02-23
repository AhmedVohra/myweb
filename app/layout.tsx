import type { Metadata } from "next";
import "../styles/retro.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BC.KNOWLEDGE | AL Developer's Knowledgebase",
  description:
    "A personal knowledgebase and blog for Business Central and AL development — tips, tutorials, patterns, and best practices.",
  keywords:
    "Business Central, AL Development, Dynamics 365, Microsoft, NAV, ERP, Development",
  openGraph: {
    title: "BC.KNOWLEDGE | AL Developer's Knowledgebase",
    description:
      "A knowledgebase for Business Central and AL developers",
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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

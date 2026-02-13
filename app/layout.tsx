import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "VaultVerse",
  description: "Universal collectibles discovery and social showcasing platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl px-6 py-6">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}

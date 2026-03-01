import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FortNexus – The Ultimate Worldwide Fortnite Hub 2026",
  description:
    "FortNexus is the ultimate Fortnite fan hub – live streams, item shop, leaderboards, news, leaks, events and community all in one place.",
  keywords: ["Fortnite", "FortNexus", "Fortnite Hub", "Fortnite News", "Fortnite Leaks", "FNCS", "Fortnite Streamers"],
  openGraph: {
    title: "FortNexus – The Ultimate Worldwide Fortnite Hub 2026",
    description: "Chapter 7 • Season 1 – Pacific Break | Live streams, item shop, leaderboards, news & more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}

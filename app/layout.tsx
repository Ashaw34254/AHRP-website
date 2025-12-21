import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Aurora Horizon Roleplay | Next-Generation FiveM RP",
  description: "A next-generation FiveM roleplay experience focused on realistic, immersive roleplay with professional staff and custom systems.",
  keywords: ["FiveM", "roleplay", "RP", "gaming", "Aurora Horizon", "Aurora Horizon RP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import { site } from "@/lib/config";

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(base),
  title: `For ${site.daughterShort}, with our deepest sympathy`,
  description: site.intro,
  robots: { index: false, follow: false },
  openGraph: {
    title: `For ${site.daughterShort}, with our deepest sympathy`,
    description: `In loving memory of ${site.honoree}, ${site.born} – ${site.died}. From the AAS Scholar cohort 2027.`,
    images: ["/og.jpg"],
  },
};

export const viewport = { themeColor: "#1c1b1a" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&family=Kantumruy+Pro:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
import { site } from "@/lib/config";

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(base),
  title: `In loving memory of ${site.honoree}`,
  description: site.intro,
  robots: { index: false, follow: false },
  openGraph: {
    title: `In loving memory of ${site.honoree}`,
    description: `${site.born} – ${site.died}. ${site.blessing}.`,
    images: ["/og.jpg"],
  },
};

export const viewport = { themeColor: "#f6f3ee" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Inter:wght@400;500&family=Noto+Serif+Khmer:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

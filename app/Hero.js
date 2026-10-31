import { site } from "@/lib/config";
import Ornament from "./Ornament";

// Compact header for the form and admin pages.
export default function Hero({ title, children }) {
  return (
    <header className="hero">
      <p className="km-line" lang="km">{site.condolenceKhmer}</p>
      <h1>{title}</h1>
      <p className="sub">In loving memory of {site.honoree} · {site.born} – {site.died}</p>
      {children}
      <Ornament />
    </header>
  );
}

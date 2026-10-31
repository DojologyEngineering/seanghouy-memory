import { site } from "@/lib/config";
import Ornament from "./Ornament";

export default function Hero({ children }) {
  return (
    <header className="hero">
      <div className="org">
        <span className="org-logo" role="img" aria-label="Australia Awards" />
        <span className="org-name">Cambodia · Scholar cohort 2027</span>
      </div>
      <div className="portrait">
        <img src={site.photo} alt={`Portrait of ${site.honoree}`} />
      </div>
      <p className="blessing-km" lang="km">{site.blessingKhmer}</p>
      <p className="blessing">{site.blessing}</p>
      <h1>{site.honoree}</h1>
      <p className="name-km" lang="km">{site.honoreeKhmer}</p>
      <div className="dates"><span>{site.born}</span><span className="sep" /><span>{site.died}</span></div>
      {children}
      <Ornament />
    </header>
  );
}

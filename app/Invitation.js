"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/lib/config";
import MessageCard from "./MessageCard";
import Ornament, { Lotus } from "./Ornament";

// sealed → opening (seal lifts, flap folds back, letter slides out)
//        → reveal (the letter grows into the full card while the envelope sinks away)
//        → open (card + messages, page scrolls)
const T_REVEAL = 2050;
const T_DONE = 3500;
export default function Invitation({ messages }) {
  const [stage, setStage] = useState("sealed");
  const [muted, setMuted] = useState(false);
  const [petals, setPetals] = useState([]);
  const audioRef = useRef(null);
  const letterRef = useRef(null);
  const cardRef = useRef(null);
  const fromRect = useRef(null);
  const envRef = useRef(null);
  const fromClip = useRef(null);

  useEffect(() => {
    setPetals(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 9,
        dur: 9 + Math.random() * 8,
        size: 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 160,
      }))
    );
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", stage !== "open");
  }, [stage]);

  // FLIP: start the real card exactly where the envelope's letter is, then let it grow into place.
  useLayoutEffect(() => {
    if (stage !== "reveal" || !cardRef.current || !fromRect.current) return;
    const from = fromRect.current;
    const to = cardRef.current.getBoundingClientRect();
    cardRef.current.animate(
      [
        {
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        },
        { transform: "none", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" },
      ],
      { duration: 1350, easing: "cubic-bezier(0.65, 0, 0.25, 1)", fill: "backwards" }
    );
    // The lower part of the letter was still tucked in the pocket: start with that part hidden.
    if (fromClip.current) {
      cardRef.current.animate(
        [{ clipPath: fromClip.current }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)" }],
        { duration: 650, easing: "cubic-bezier(0.33, 1, 0.68, 1)", fill: "backwards" }
      );
    }
  }, [stage]);

  function open() {
    if (stage !== "sealed") return;
    const a = audioRef.current;
    if (a) {
      a.volume = 0;
      a.play().catch(() => {});
      let v = 0;
      const fade = setInterval(() => {
        v = Math.min(0.55, v + 0.03);
        a.volume = v;
        if (v >= 0.55) clearInterval(fade);
      }, 120);
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setStage("open");
    window.scrollTo(0, 0);
    setStage("opening");
    setTimeout(() => {
      const L = letterRef.current?.getBoundingClientRect();
      const E = envRef.current?.getBoundingClientRect();
      if (L) fromRect.current = L;
      if (L && E) {
        // The pocket's V runs from the envelope's top corners to its centre at 55% height.
        const cx = E.left + E.width / 2, cy = E.top + E.height * 0.55;
        const yAt = (x) => (x < cx ? E.top + ((x - E.left) / (cx - E.left)) * (cy - E.top) : cy - ((x - cx) / (E.right - cx)) * (cy - E.top));
        const pct = (y) => `${(((y - L.top) / L.height) * 100).toFixed(2)}%`;
        fromClip.current = `polygon(0% 0%, 100% 0%, 100% ${pct(yAt(L.right))}, 50% ${pct(cy)}, 0% ${pct(yAt(L.left))})`;
      }
      setStage("reveal");
    }, T_REVEAL);
    setTimeout(() => setStage("open"), T_DONE);
  }

  function toggleMute() {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
    if (!a.muted && a.paused) a.play().catch(() => {});
  }

  const count = messages.length;

  return (
    <>
      <audio ref={audioRef} src="/lament.mp3" loop preload="auto" />

      {stage !== "sealed" && (
        <div className="petals" aria-hidden="true">
          {petals.map((p) => (
            <span
              key={p.id}
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size * 0.62,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
                "--drift": `${p.drift}px`,
              }}
            />
          ))}
        </div>
      )}

      {stage !== "open" && (
        <section className={`stage ${stage}`} aria-hidden={stage !== "sealed"}>
          <div className="glow" aria-hidden="true" />
          <div className="addressee">
            <p className="km-line" lang="km">{site.toKhmer}</p>
            <h1>{site.daughter}</h1>
          </div>

          <div className="envelope" ref={envRef}>
            <div className="env-back" />
            <div className="env-letter" ref={letterRef}>
              <Lotus className="lotus" />
              <span>{site.condolence}</span>
            </div>
            <div className="env-pocket" />
            <div className="env-flap" />
            <button className="seal" onClick={open} aria-label="Open the envelope">
              <Lotus className="seal-lotus" />
            </button>
          </div>

          <p className="hint">
            <span lang="km">ចុចលើត្រា ដើម្បីបើក</span> · Tap the seal to open
          </p>
        </section>
      )}

      {(stage === "reveal" || stage === "open") && (
        <main className="opened">
          <article className="letter-card" ref={cardRef}>
            <div className="frame">
              <p className="km-title" lang="km">{site.condolenceKhmer}</p>
              <p className="en-title">{site.condolence}</p>
              <Lotus className="lotus big" />
              <p className="memory-of">In loving memory of</p>
              <h1 className="honoree">{site.honoree}</h1>
              <p className="honoree-km" lang="km">{site.honoreeKhmer}</p>
              <div className="dates">
                <span>{site.born}</span>
                <span className="sep" />
                <span>{site.died}</span>
              </div>
              <p className="letter">{site.letter}</p>
              <p className="from">{site.from}</p>
            </div>
          </article>

          <a className="scroll-cue" href="#messages">
            <span lang="km">រំកិលចុះ ដើម្បីអានសារ</span>
            <span>Scroll to read our messages</span>
            <span className="arrow" aria-hidden="true">↓</span>
          </a>

          <section id="messages" className="messages">
            <Ornament />
            <h2 className="section-title">
              {count > 0 ? `${count} ${count === 1 ? "message" : "messages"} of love` : "Messages of love"}
            </h2>
            <div className="list">
              {count === 0 ? (
                <p className="empty">Messages of love and remembrance will appear here.</p>
              ) : (
                messages.map((m, i) => <MessageCard key={m.id} m={m} index={i} />)
              )}
            </div>
            <p className="closing">{site.from}</p>
          </section>
        </main>
      )}

      {stage !== "sealed" && (
        <button className="sound" onClick={toggleMute} aria-label={muted ? "Play music" : "Mute music"}>
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M17 9l4 6M21 9l-4 6" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></svg>
          )}
        </button>
      )}
    </>
  );
}

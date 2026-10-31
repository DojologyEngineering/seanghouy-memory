"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/config";
import MessageCard from "./MessageCard";
import Ornament, { Lotus } from "./Ornament";

// sealed → opening (flap lifts, card rises, petals fall) → open (card + messages)
export default function Invitation({ messages }) {
  const [stage, setStage] = useState("sealed");
  const [muted, setMuted] = useState(false);
  const [petals, setPetals] = useState([]);
  const audioRef = useRef(null);

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
    setStage("opening");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => setStage("open"), reduce ? 50 : 2600);
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
        <section className={`stage ${stage}`}>
          <div className="addressee">
            <p className="km-line" lang="km">{site.toKhmer}</p>
            <h1>{site.daughter}</h1>
          </div>

          <div className="envelope">
            <div className="env-back" />
            <div className="env-letter">
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

      {stage === "open" && (
        <main className="opened">
          <article className="letter-card">
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
              <p className="blessing-km" lang="km">{site.blessingKhmer}</p>
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

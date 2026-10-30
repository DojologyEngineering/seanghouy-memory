"use client";

import { useEffect, useState } from "react";

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function MessageCard({ m, onDelete }) {
  // Format on the client so each reader sees their own local time.
  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(
      new Date(m.createdAt).toLocaleString(undefined, {
        day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
      })
    );
  }, [m.createdAt]);

  return (
    <article className="card">
      <div className="card-head">
        {m.photoUrl ? (
          <img className="avatar" src={m.photoUrl} alt="" />
        ) : (
          <div className="avatar" aria-hidden="true">{initials(m.name)}</div>
        )}
        <div>
          <div className="name">{m.name}</div>
          <time className="time" dateTime={m.createdAt}>{time}</time>
        </div>
        {onDelete && (
          <button className="link" onClick={() => onDelete(m)}>Delete</button>
        )}
      </div>
      <p className="body">{m.message}</p>
    </article>
  );
}

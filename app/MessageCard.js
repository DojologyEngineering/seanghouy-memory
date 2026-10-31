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

export default function MessageCard({ m, onDelete, onEdit, index = 0 }) {
  // Format on the client so each reader sees their own local time.
  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(
      new Date(m.createdAt).toLocaleString(undefined, {
        day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit",
      })
    );
  }, [m.createdAt]);

  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}>
      <p className="body">{m.message}</p>
      <div className="card-foot">
        {m.photoUrl ? (
          <img className="avatar" src={m.photoUrl} alt="" />
        ) : (
          <div className="avatar" aria-hidden="true">{initials(m.name)}</div>
        )}
        <div>
          <div className="name">{m.name}</div>
          <time className="time" dateTime={m.createdAt}>{time}</time>
        </div>
        {onEdit && (
          <button className="link-edit" onClick={() => onEdit(m)}>Edit</button>
        )}
        {onDelete && (
          <button className="link-danger" onClick={() => onDelete(m)}>Remove</button>
        )}
      </div>
    </article>
  );
}

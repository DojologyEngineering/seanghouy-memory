"use client";

import { useState } from "react";
import MessageCard from "../../MessageCard";

// Shrink photos in the browser so uploads stay small and fast.
async function resizeImage(file, size = 400) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, size / Math.min(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
}

export default function WriteForm({ adminKey, initial }) {
  const [messages, setMessages] = useState(initial);
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState({ busy: false, error: "", ok: "" });

  async function onPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return setPhoto(null), setPreview(null);
    try {
      const small = await resizeImage(file);
      setPhoto(small);
      setPreview(URL.createObjectURL(small));
    } catch {
      setStatus({ busy: false, ok: "", error: "Could not read that photo. Try a JPG or PNG." });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    data.delete("photoFile");
    data.set("key", adminKey);
    if (photo) data.set("photo", photo, "photo.jpg");
    setStatus({ busy: true, error: "", ok: "" });
    const res = await fetch("/api/messages", { method: "POST", body: data });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return setStatus({ busy: false, ok: "", error: body.error || "Something went wrong. Please try again." });
    }
    setMessages((prev) => [body, ...prev]);
    formEl.reset();
    setPhoto(null);
    setPreview(null);
    setStatus({ busy: false, error: "", ok: "Thank you. Your message has been posted." });
  }

  async function onDelete(m) {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    const res = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: adminKey, id: m.id }),
    });
    if (res.ok) setMessages((prev) => prev.filter((x) => x.id !== m.id));
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          Your name
          <input type="text" name="name" required maxLength={80} />
        </label>
        <label>
          Profile picture (optional)
          <div className="photo-row">
            {preview && <img className="avatar" src={preview} alt="" />}
            <input type="file" name="photoFile" accept="image/*" onChange={onPhoto} />
          </div>
        </label>
        <label>
          Your message
          <textarea name="message" required maxLength={3000} />
        </label>
        <div>
          <button type="submit" disabled={status.busy}>
            {status.busy ? "Posting…" : "Post message"}
          </button>
        </div>
        {status.error && <p className="error">{status.error}</p>}
        {status.ok && <p className="ok">{status.ok}</p>}
      </form>

      <h2>Posted messages</h2>
      <p className="note">Only people with this link can delete messages.</p>
      <section className="list">
        {messages.map((m) => (
          <MessageCard key={m.id} m={m} onDelete={onDelete} />
        ))}
      </section>
    </>
  );
}

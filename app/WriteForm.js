"use client";

import { useRef, useState } from "react";
import MessageCard from "./MessageCard";

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

// Without adminKey this is the public form; with it, the admin view that can also remove messages.
export default function WriteForm({ adminKey, initial = [] }) {
  const [messages, setMessages] = useState(initial);
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState({ busy: false, error: "", ok: "" });
  const [posted, setPosted] = useState(false);
  const fileRef = useRef(null);

  async function onPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const small = await resizeImage(file);
      setPhoto(small);
      setPreview(URL.createObjectURL(small));
    } catch {
      setStatus({ busy: false, ok: "", error: "Could not read that photo. Please try a JPG or PNG." });
    }
  }

  function clearPhoto() {
    setPhoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    data.delete("photoFile");
    if (photo) data.set("photo", photo, "photo.jpg");
    setStatus({ busy: true, error: "", ok: "" });
    const res = await fetch("/api/messages", { method: "POST", body: data });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return setStatus({ busy: false, ok: "", error: body.error || "Something went wrong. Please try again." });
    }
    setMessages((prev) => [body, ...prev]);
    formEl.reset();
    clearPhoto();
    setStatus({ busy: false, error: "", ok: "Thank you. Your message is now on the memorial page." });
    setPosted(true);
  }

  async function onDelete(m) {
    if (!confirm(`Remove the message from ${m.name}?`)) return;
    const res = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: adminKey, id: m.id }),
    });
    if (res.ok) setMessages((prev) => prev.filter((x) => x.id !== m.id));
  }

  async function onEdit(m) {
    const text = prompt(`Edit the message from ${m.name}:`, m.message);
    if (text === null || !text.trim() || text === m.message) return;
    const res = await fetch("/api/messages", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: adminKey, id: m.id, message: text }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, message: body.message } : x)));
    else alert(body.error || "Could not save the change.");
  }

  return (
    <>
      <div className="panel">
        <form onSubmit={onSubmit}>
          <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="field">
            <span>Your name</span>
            <input type="text" name="name" required maxLength={80} autoComplete="name" />
          </label>
          <div className="field">
            <span>Your photo (optional)</span>
            <div className="photo-pick">
              {preview ? (
                <img className="avatar lg" src={preview} alt="" />
              ) : (
                <div className="avatar lg" aria-hidden="true">+</div>
              )}
              <label className="ghost">
                {preview ? "Change photo" : "Choose photo"}
                <input ref={fileRef} type="file" name="photoFile" accept="image/*" onChange={onPhoto} />
              </label>
              {preview && <button type="button" className="ghost" onClick={clearPhoto}>Remove</button>}
            </div>
          </div>
          <label className="field">
            <span>Your message</span>
            <textarea name="message" required maxLength={3000} placeholder="Share a memory, a prayer, or a few words of comfort…" />
          </label>
          <div className="actions">
            <button className="primary" type="submit" disabled={status.busy}>
              {status.busy ? "Sending…" : "Share message"}
            </button>
            {status.error && <p className="error">{status.error}</p>}
            {status.ok && <p className="ok">{status.ok}</p>}
            {posted && !adminKey && <a className="ghost" href="/">View the memorial page</a>}
          </div>
        </form>
      </div>
      {adminKey && (
        <>
          <p className="admin-note">Admin view: only people with this private link can edit or remove messages.</p>
          <h2 className="section-title" style={{ marginTop: 56 }}>Shared so far</h2>
          <section className="list">
            {messages.length === 0 && <p className="empty">No messages yet.</p>}
            {messages.map((m, i) => (
              <MessageCard key={m.id} m={m} index={i} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </section>
        </>
      )}
    </>
  );
}

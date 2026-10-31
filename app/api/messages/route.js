import { NextResponse } from "next/server";
import { addMessage, deleteMessage, isAdminKey, updateMessage } from "@/lib/messages";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export async function POST(req) {
  const form = await req.formData();
  // Bots fill in the hidden "website" field; people never see it.
  if (form.get("website")) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }
  const name = String(form.get("name") || "").trim().slice(0, 80);
  const message = String(form.get("message") || "").trim().slice(0, 3000);
  const photo = form.get("photo");
  if (!name || !message) {
    return NextResponse.json({ error: "Please enter your name and a message." }, { status: 400 });
  }
  if (photo && typeof photo === "object" && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "The photo must be an image." }, { status: 400 });
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "The photo is too large." }, { status: 400 });
    }
  }
  const record = await addMessage({
    name,
    message,
    photo: photo && typeof photo === "object" ? photo : null,
  });
  return NextResponse.json(record, { status: 201 });
}

export async function DELETE(req) {
  const { key, id } = await req.json();
  if (!isAdminKey(key)) {
    return NextResponse.json({ error: "This link is not valid." }, { status: 401 });
  }
  const ok = await deleteMessage(id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

export async function PATCH(req) {
  const { key, id, message } = await req.json();
  if (!isAdminKey(key)) {
    return NextResponse.json({ error: "This link is not valid." }, { status: 401 });
  }
  const text = String(message || "").trim().slice(0, 3000);
  if (!text) return NextResponse.json({ error: "The message cannot be empty." }, { status: 400 });
  const updated = await updateMessage(id, text);
  return updated
    ? NextResponse.json(updated)
    : NextResponse.json({ error: "Message not found." }, { status: 404 });
}

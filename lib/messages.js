import { list, put, del } from "@vercel/blob";

const PREFIX = "messages/";

export function isAdminKey(key) {
  const expected = process.env.ADMIN_KEY;
  return Boolean(expected) && key === expected;
}

export async function getMessages() {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const messages = await Promise.all(
    blobs.map(async (b) => {
      const res = await fetch(b.url, { cache: "no-store" });
      if (!res.ok) return null;
      return { ...(await res.json()), url: b.url };
    })
  );
  return messages
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addMessage({ name, message, photo }) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  let photoUrl = null;
  if (photo && photo.size > 0) {
    const ext = (photo.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
    const uploaded = await put(`photos/${id}.${ext}`, photo, {
      access: "public",
      contentType: photo.type,
    });
    photoUrl = uploaded.url;
  }
  const record = { id, name, message, photoUrl, createdAt };
  await put(`${PREFIX}${createdAt.replace(/[:.]/g, "-")}-${id}.json`, JSON.stringify(record), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return record;
}

export async function deleteMessage(id) {
  const all = await getMessages();
  const m = all.find((x) => x.id === id);
  if (!m) return false;
  await del([m.url, ...(m.photoUrl ? [m.photoUrl] : [])]);
  return true;
}

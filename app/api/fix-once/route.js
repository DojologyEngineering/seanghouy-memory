import { NextResponse } from "next/server";
import { getMessages, isAdminKey, updateMessage } from "@/lib/messages";

export const dynamic = "force-dynamic";

// Temporary: removes the photo from Meng's own message, then this route is removed.
export async function GET(req) {
  const key = new URL(req.url).searchParams.get("key");
  if (!isAdminKey(key)) return NextResponse.json({ error: "no" }, { status: 401 });
  const all = await getMessages();
  const targets = all.filter((m) => m.name.trim().toLowerCase() === "pen lymeng" && m.photoUrl);
  for (const m of targets) await updateMessage(m.id, { removePhoto: true });
  return NextResponse.json({ updated: targets.length });
}

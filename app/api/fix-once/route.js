import { NextResponse } from "next/server";
import { getMessages, isAdminKey, updateMessage } from "@/lib/messages";

export const dynamic = "force-dynamic";

// Temporary: applies one wording change Meng asked for, then this route is removed.
const NEW_TEXT =
  "Dear Seanghouy, my deepest condolences to you and your family for your loss. I hope your father rests in peace. I know he must have been incredibly proud of you and all that you are accomplishing. Please take care, and let us know if you need any support during this difficult time.";

export async function GET(req) {
  const key = new URL(req.url).searchParams.get("key");
  if (!isAdminKey(key)) return NextResponse.json({ error: "no" }, { status: 401 });
  const all = await getMessages();
  const targets = all.filter(
    (m) => m.name.trim().toLowerCase() === "pen lymeng" && m.message.startsWith("My condolences for your family")
  );
  const done = [];
  for (const m of targets) done.push(await updateMessage(m.id, NEW_TEXT));
  return NextResponse.json({ updated: done.length, matches: all.map((m) => ({ name: m.name, message: m.message.slice(0, 60) })) });
}

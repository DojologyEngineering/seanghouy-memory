import { notFound } from "next/navigation";
import { site } from "@/lib/config";
import { getMessages, isAdminKey } from "@/lib/messages";
import WriteForm from "./WriteForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave a message" };

export default async function WritePage({ params }) {
  const { key } = await params;
  if (!isAdminKey(key)) notFound();
  const messages = await getMessages();
  return (
    <main className="wrap">
      <header className="hero">
        <div className="eyebrow">Leave a message</div>
        <h1>{site.honoree}</h1>
        <p className="intro">Your message will appear on the memorial page with your name, photo and the time you posted it.</p>
      </header>
      <WriteForm adminKey={key} initial={messages} />
    </main>
  );
}

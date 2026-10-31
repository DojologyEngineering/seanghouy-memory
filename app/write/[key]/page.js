import { notFound } from "next/navigation";
import { site } from "@/lib/config";
import { getMessages, isAdminKey } from "@/lib/messages";
import Hero from "../../Hero";
import WriteForm from "./WriteForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave a message" };

export default async function WritePage({ params }) {
  const { key } = await params;
  if (!isAdminKey(key)) notFound();
  const messages = await getMessages();
  return (
    <main className="wrap">
      <Hero>
        <p className="intro">
          Leave a few words for {site.daughter} and her family. Your message will appear on the memorial page with your name, photo and the time you wrote it.
        </p>
      </Hero>
      <WriteForm adminKey={key} initial={messages} />
    </main>
  );
}

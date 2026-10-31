import { notFound } from "next/navigation";
import { site } from "@/lib/config";
import { getMessages, isAdminKey } from "@/lib/messages";
import Hero from "../../Hero";
import WriteForm from "../../WriteForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Messages" };

export default async function WritePage({ params }) {
  const { key } = await params;
  if (!isAdminKey(key)) notFound();
  const messages = await getMessages();
  return (
    <main className="wrap">
      <Hero title="Messages for Seanghouy">
        <p className="intro">
          Share a memory, a prayer or a few words of comfort. Your message will be placed inside her condolence envelope with your name, photo and the time you wrote it.
        </p>
      </Hero>
      <WriteForm adminKey={key} initial={messages} />
    </main>
  );
}

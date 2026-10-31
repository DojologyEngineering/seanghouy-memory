import { site } from "@/lib/config";
import { getMessages } from "@/lib/messages";
import Hero from "./Hero";
import MessageCard from "./MessageCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const messages = await getMessages();
  return (
    <main className="wrap">
      <Hero>
        <p className="intro">{site.intro}</p>
      </Hero>
      <h2 className="section-title">
        {messages.length > 0
          ? `${messages.length} ${messages.length === 1 ? "message" : "messages"} of love`
          : "Messages of love"}
      </h2>
      <section className="list">
        {messages.length === 0 ? (
          <p className="empty">Messages of love and remembrance will appear here.</p>
        ) : (
          messages.map((m, i) => <MessageCard key={m.id} m={m} index={i} />)
        )}
      </section>
      <p className="closing">{site.closing}</p>
    </main>
  );
}

import { site } from "@/lib/config";
import { getMessages } from "@/lib/messages";
import MessageCard from "./MessageCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const messages = await getMessages();
  return (
    <main className="wrap">
      <header className="hero">
        <div className="eyebrow">{site.title}</div>
        <h1>{site.honoree}</h1>
        <div className="dates">{site.dates}</div>
        <p className="intro">{site.intro}</p>
        <div className="divider" />
      </header>
      <section className="list">
        {messages.length === 0 ? (
          <p className="empty">Messages will appear here.</p>
        ) : (
          messages.map((m) => <MessageCard key={m.id} m={m} />)
        )}
      </section>
    </main>
  );
}

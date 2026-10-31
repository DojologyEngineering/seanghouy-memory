import { site } from "@/lib/config";
import Hero from "../Hero";
import WriteForm from "../WriteForm";

export const metadata = { title: `Leave a message · ${site.honoree}` };

export default function LeaveMessagePage() {
  return (
    <main className="wrap">
      <Hero title="Leave a message for Seanghouy">
        <p className="intro">
          Share a memory, a prayer or a few words of comfort. Your message will be placed inside her condolence envelope with your name, photo and the time you wrote it.
        </p>
      </Hero>
      <WriteForm />
    </main>
  );
}

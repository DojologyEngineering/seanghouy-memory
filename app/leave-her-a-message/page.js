import { site } from "@/lib/config";
import Hero from "../Hero";
import WriteForm from "../WriteForm";

export const metadata = { title: `Leave a message · ${site.honoree}` };

export default function LeaveMessagePage() {
  return (
    <main className="wrap">
      <Hero>
        <p className="intro">
          Leave a few words for {site.daughter} and her family. Your message will appear on the memorial page with your name, photo and the time you wrote it.
        </p>
      </Hero>
      <WriteForm />
    </main>
  );
}

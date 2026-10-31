import { getMessages } from "@/lib/messages";
import Invitation from "./Invitation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const messages = await getMessages();
  return <Invitation messages={messages} />;
}

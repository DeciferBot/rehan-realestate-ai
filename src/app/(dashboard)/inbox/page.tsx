import { getConversations, getConversationThread } from "@/lib/spine";
import { getContactDossier } from "@/lib/subagents";
import InboxView from "./InboxView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inbox",
  description: "Every lead conversation across voice, WhatsApp, and email in one thread.",
};

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  // Fetch conversation list and the selected thread in parallel
  const [conversations, threadEarly] = await Promise.all([
    getConversations(),
    c ? getConversationThread(c) : Promise.resolve(null),
  ]);
  const selectedId = c ?? conversations[0]?.id ?? null;
  // If no ?c param, load the first conversation (already have it if c was set)
  const thread = threadEarly ?? (selectedId && !c ? await getConversationThread(selectedId) : null);
  const dossier = thread ? await getContactDossier(thread.contact.budget) : null;

  return <InboxView conversations={conversations} thread={thread} dossier={dossier} selectedId={selectedId} c={c} />;
}

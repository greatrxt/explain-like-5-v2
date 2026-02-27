import type { UIMessage } from "ai";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { Chat } from "@/components/chat/chat";
import { getChatById, updateUserIdForChat } from "@/db/queries";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chat = await getChatById({ id });

  if (!chat) notFound();

  const session = await auth();

  // If logged-in user visits an anonymous chat, claim it
  if (session?.user?.id && !chat.userId) {
    await updateUserIdForChat({ chatId: id, userId: session.user.id });
  }

  // If chat belongs to another user, redirect to home
  if (chat.userId && session?.user?.id && chat.userId !== session.user.id) {
    redirect("/");
  }

  return (
    <Chat id={chat.id} initialMessages={chat.messages as UIMessage[]} />
  );
}

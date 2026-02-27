import { auth } from "@/auth";
import { getChatsByUserId } from "@/db/queries";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json("Unauthorized", { status: 401 });
  }

  const chats = await getChatsByUserId({ id: session.user.id });

  const summaries = chats.map((chat) => {
    const msgs = chat.messages as Array<{ role: string; content: string }>;
    const firstUserMsg = msgs.find((m) => m.role === "user");
    const title = firstUserMsg?.content?.slice(0, 80) ?? "Untitled";
    return {
      id: chat.id,
      title,
      createdAt: chat.createdAt,
    };
  });

  return Response.json(summaries);
}

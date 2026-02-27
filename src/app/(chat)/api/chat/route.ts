import { convertToModelMessages, streamText } from "ai";
import type { UIMessage } from "ai";
import { cookies } from "next/headers";

import { getModel } from "@/ai";
import { personas, DEFAULT_PERSONA_ID } from "@/ai/models";
import { auth } from "@/auth";
import { saveChat, getChatById, deleteChatById } from "@/db/queries";
import { generateUUID } from "@/lib/utils";

export const maxDuration = 60;

const VISITOR_COOKIE = "eli5_visitor_id";

async function getOrCreateVisitorId(): Promise<string> {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = generateUUID();
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      path: "/",
      maxAge: 86400 * 365 * 5,
      secure: true,
      sameSite: "strict",
    });
  }
  return visitorId;
}

export async function POST(request: Request) {
  const { id, messages, personaId } = (await request.json()) as {
    id: string;
    messages: UIMessage[];
    personaId: string;
  };

  const session = await auth();
  const visitorId = await getOrCreateVisitorId();

  const persona =
    personas.find((p) => p.id === personaId) ??
    personas.find((p) => p.id === DEFAULT_PERSONA_ID)!;

  const result = streamText({
    model: getModel(),
    system: `Your name is ${persona.name}. ${persona.systemPrompt}`,
    messages: await convertToModelMessages(messages as UIMessage[]),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages as UIMessage[],
    onFinish: async ({ messages: newMessages }) => {
      try {
        await saveChat({
          id,
          model: persona.name,
          messages: newMessages,
          userId: session?.user?.id ?? null,
          visitorId,
        });
      } catch (error) {
        console.error("Failed to save chat:", error);
      }
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return new Response("Missing id", { status: 400 });

  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  try {
    const chat = await getChatById({ id });
    if (!chat || chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    await deleteChatById({ id });
    return new Response("Deleted", { status: 200 });
  } catch {
    return new Response("Error", { status: 500 });
  }
}

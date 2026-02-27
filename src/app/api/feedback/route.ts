import { auth } from "@/auth";
import { saveFeedback } from "@/db/queries";

export async function POST(request: Request) {
  try {
    const { feedback } = (await request.json()) as { feedback: string };
    if (!feedback || typeof feedback !== "string" || !feedback.trim()) {
      return new Response("Missing feedback", { status: 400 });
    }

    const session = await auth();
    await saveFeedback({
      feedback: feedback.trim(),
      userId: session?.user?.id ?? null,
    });

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Error", { status: 500 });
  }
}

import { eq, desc, asc, gt, and } from "drizzle-orm";
import { getDb } from ".";
import { users, chats, documents, suggestions, feedback } from "./schema";

// ─── Users ──────────────────────────────────────────────────────────────────

export async function getUser(email: string) {
  const db = getDb();
  return db.select().from(users).where(eq(users.email, email));
}

export async function createUser(
  id: string,
  email: string,
  password?: string
) {
  const db = getDb();
  return db.insert(users).values({ id, email, password });
}

// ─── Chats ──────────────────────────────────────────────────────────────────

export async function saveChat({
  id,
  model,
  messages,
  userId,
  visitorId,
}: {
  id: string;
  model?: string;
  messages: unknown;
  userId?: string | null;
  visitorId?: string | null;
}) {
  const db = getDb();
  const serializedMessages = JSON.stringify(messages);

  return db
    .insert(chats)
    .values({
      id,
      model,
      messages: serializedMessages,
      userId,
      visitorId,
    })
    .onConflictDoUpdate({
      target: chats.id,
      set: {
        model,
        messages: serializedMessages,
        userId,
        visitorId,
      },
    });
}

export async function getChatById({ id }: { id: string }) {
  const db = getDb();
  const result = await db.select().from(chats).where(eq(chats.id, id));
  if (result.length === 0) return null;

  const chat = result[0];
  return {
    ...chat,
    messages: chat.messages ? JSON.parse(chat.messages) : [],
  };
}

export async function getChatsByUserId({ id }: { id: string }) {
  const db = getDb();
  const results = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, id))
    .orderBy(desc(chats.createdAt));

  return results.map((chat) => ({
    ...chat,
    messages: chat.messages ? JSON.parse(chat.messages) : [],
  }));
}

export async function deleteChatById({ id }: { id: string }) {
  const db = getDb();
  return db.delete(chats).where(eq(chats.id, id));
}

export async function updateUserIdForChat({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) {
  const db = getDb();
  return db.update(chats).set({ userId }).where(eq(chats.id, chatId));
}

// ─── Documents ──────────────────────────────────────────────────────────────

export async function saveDocument({
  id,
  title,
  content,
  userId,
}: {
  id: string;
  title: string;
  content?: string;
  userId: string;
}) {
  const db = getDb();
  return db.insert(documents).values({ id, title, content, userId });
}

export async function getDocumentById({ id }: { id: string }) {
  const db = getDb();
  const results = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .orderBy(desc(documents.createdAt));

  return results.length > 0 ? results[0] : null;
}

export async function getDocumentsById({ id }: { id: string }) {
  const db = getDb();
  return db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .orderBy(asc(documents.createdAt));
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: string;
}) {
  const db = getDb();
  return db
    .delete(documents)
    .where(and(eq(documents.id, id), gt(documents.createdAt, timestamp)));
}

// ─── Suggestions ────────────────────────────────────────────────────────────

export async function saveSuggestions({
  suggestions: suggestionsToInsert,
}: {
  suggestions: Array<{
    id?: string;
    documentId: string;
    documentCreatedAt: string;
    originalText: string;
    suggestedText: string;
    description?: string;
    isResolved?: number;
    userId: string;
  }>;
}) {
  const db = getDb();
  return db.insert(suggestions).values(suggestionsToInsert);
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  const db = getDb();
  return db
    .select()
    .from(suggestions)
    .where(eq(suggestions.documentId, documentId));
}

// ─── Feedback ───────────────────────────────────────────────────────────────

export async function saveFeedback({
  feedback: feedbackText,
  userId,
}: {
  feedback: string;
  userId?: string | null;
}) {
  const db = getDb();
  return db.insert(feedback).values({ feedback: feedbackText, userId });
}

"use client";

import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

import { DEFAULT_PERSONA_ID } from "@/ai/models";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/message";
import { Overview } from "@/components/chat/overview";
import { useScrollToBottom } from "@/components/chat/use-scroll-to-bottom";
import { useSession } from "@/components/layout/session-context";

export function Chat({
  id,
  initialMessages,
  initialPersonaId,
}: {
  id: string;
  initialMessages: UIMessage[];
  initialPersonaId?: string;
}) {
  const [personaId, setPersonaId] = useState(
    initialPersonaId ?? DEFAULT_PERSONA_ID
  );

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
  } = useChat({
    id,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { id, personaId },
    }),
    messages: initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/chat/${id}`);
    },
  });

  const session = useSession();
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex min-w-0 flex-col h-dvh">
      <ChatHeader
        selectedPersonaId={personaId}
        onPersonaChange={setPersonaId}
        isLoggedIn={!!session?.user}
      />

      {messages.length === 0 ? (
        <Overview />
      ) : (
        <div
          ref={messagesContainerRef}
          className="flex flex-1 flex-col gap-4 overflow-y-auto py-4"
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              parts={message.parts}
              personaId={personaId}
            />
          ))}
          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl px-4 pb-4 md:pb-6">
        <ChatInput
          sendMessage={sendMessage}
          isLoading={isLoading}
          stop={stop}
          hasMessages={messages.length > 0}
        />
      </div>
    </div>
  );
}

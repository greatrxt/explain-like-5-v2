"use client";

import type { UIMessagePart, UIDataTypes, UITools } from "ai";
import { Sparkles } from "lucide-react";

import { personas } from "@/ai/models";
import { cn } from "@/lib/utils";

import { Markdown } from "./markdown";

function getTextContent(parts: UIMessagePart<UIDataTypes, UITools>[]): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");
}

export function ChatMessage({
  role,
  parts,
  personaId,
}: {
  role: string;
  parts: UIMessagePart<UIDataTypes, UITools>[];
  personaId?: string;
}) {
  const persona = personas.find((p) => p.id === personaId);
  const content = getTextContent(parts);

  return (
    <div
      className={cn("group animate-fade-in-up w-full max-w-3xl mx-auto px-4")}
      data-role={role}
    >
      <div
        className={cn("flex gap-3", {
          "justify-end": role === "user",
        })}
      >
        {role === "assistant" && (
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-xl text-sm",
              persona ? cn(persona.bgColor, persona.borderColor, "border") : "border bg-background"
            )}
          >
            {persona?.emoji ?? <Sparkles className="size-4" />}
          </div>
        )}

        <div
          className={cn("flex flex-col gap-1 max-w-[85%]", {
            "items-end": role === "user",
          })}
        >
          <div
            className={cn("rounded-2xl px-4 py-2.5", {
              "bg-primary text-primary-foreground": role === "user",
              [persona?.bgColor ?? "bg-muted"]: role === "assistant",
            })}
          >
            {role === "user" ? (
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            ) : (
              <Markdown>{content}</Markdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

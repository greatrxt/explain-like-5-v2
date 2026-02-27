"use client";

import { ArrowUp, Square } from "lucide-react";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { type Question, getRandomQuestions } from "@/ai/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput({
  sendMessage,
  isLoading,
  stop,
  hasMessages,
}: {
  sendMessage: (message: { text: string }) => void;
  isLoading: boolean;
  stop: () => void;
  hasMessages: boolean;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [suggestions, setSuggestions] = useState<Question[]>([]);

  useEffect(() => {
    setSuggestions(getRandomQuestions(2));
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }, [input]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const submitForm = useCallback(() => {
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput("");
    textareaRef.current?.focus();
  }, [input, sendMessage]);

  const showSuggestions = !hasMessages;

  return (
    <div className="relative w-full flex flex-col gap-3">
      {showSuggestions && suggestions.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage({ text: q.full })}
              className="flex flex-col items-start gap-0.5 rounded-xl border border-border/60 bg-gradient-to-br from-background to-accent/40 px-4 py-3 text-left text-sm transition-all hover:scale-[1.02] hover:shadow-sm"
            >
              <span className="font-medium">{q.title}</span>
              <span className="text-muted-foreground">{q.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Ask anything..."
          value={input}
          onChange={handleInput}
          rows={1}
          className="min-h-[52px] max-h-[200px] resize-none rounded-xl border-border/60 bg-muted/60 pr-12 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (isLoading) {
                toast.error("Please wait for the response to finish.");
              } else if (input.trim()) {
                submitForm();
              }
            }
          }}
        />

        {isLoading ? (
          <Button
            size="icon"
            className="absolute bottom-2 right-2 size-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              stop();
            }}
          >
            <Square className="size-3 fill-current" />
            <span className="sr-only">Stop generating</span>
          </Button>
        ) : (
          <Button
            size="icon"
            className="absolute bottom-2 right-2 size-8 rounded-full"
            disabled={!input.trim()}
            onClick={(e) => {
              e.preventDefault();
              submitForm();
            }}
          >
            <ArrowUp className="size-4" />
            <span className="sr-only">Send message</span>
          </Button>
        )}
      </div>
    </div>
  );
}

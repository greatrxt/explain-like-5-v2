"use client";

import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";

import { PersonaSelector } from "@/components/chat/persona-selector";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatHeader({
  selectedPersonaId,
  onPersonaChange,
  isLoggedIn,
}: {
  selectedPersonaId: string;
  onPersonaChange: (id: string) => void;
  isLoggedIn: boolean;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border/50 bg-background/80 px-3 backdrop-blur-sm md:h-12">
      <SidebarTrigger />

      <span className="font-display text-sm font-bold text-primary md:hidden">
        🧒 ELI5
      </span>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 md:hidden"
            asChild
          >
            <Link href="/">
              <MessageSquarePlus className="size-4" />
              <span className="sr-only">New Chat</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>New Chat</TooltipContent>
      </Tooltip>

      <PersonaSelector
        selectedPersonaId={selectedPersonaId}
        onSelect={onPersonaChange}
      />

      <div className="ml-auto">
        {!isLoggedIn && (
          <Button size="sm" className="rounded-xl" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

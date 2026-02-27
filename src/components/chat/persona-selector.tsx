"use client";

import { Check, ChevronDown } from "lucide-react";
import { startTransition, useMemo, useOptimistic, useState } from "react";

import { personas } from "@/ai/models";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function PersonaSelector({
  selectedPersonaId,
  onSelect,
  className,
}: {
  selectedPersonaId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [optimisticId, setOptimisticId] = useOptimistic(selectedPersonaId);

  const selected = useMemo(
    () => personas.find((p) => p.id === optimisticId),
    [optimisticId]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "gap-1.5 px-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            className
          )}
        >
          <span className="text-base">{selected?.emoji}</span>
          <span className="hidden font-display font-bold sm:inline">
            {selected?.name}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona.id}
            onSelect={() => {
              setOpen(false);
              startTransition(() => {
                setOptimisticId(persona.id);
                onSelect(persona.id);
              });
            }}
            className="group/item gap-3 py-2.5"
            data-active={persona.id === optimisticId}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-xl text-xl",
                persona.bgColor
              )}
            >
              {persona.emoji}
            </span>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold">{persona.name}</span>
                <span className="text-xs text-muted-foreground">
                  {persona.label}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {persona.description}
              </span>
            </div>
            <Check className="ml-auto size-4 opacity-0 group-data-[active=true]/item:opacity-100" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

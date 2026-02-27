"use client";

import { personas } from "@/ai/models";
import { cn } from "@/lib/utils";

export function Overview() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <div className="animate-fade-in-up flex flex-col items-center gap-3">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Explain Like I Am 5
          </h1>
          <p className="max-w-md text-base text-muted-foreground">
            Pick a character, ask anything. Get fun, memorable
            explanations from unique AI personas.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona, i) => (
            <div
              key={persona.id}
              className={cn(
                "animate-fade-in-scale group flex flex-col items-center gap-2 rounded-2xl border p-5 transition-shadow hover:shadow-md",
                persona.bgColor,
                persona.borderColor
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-4xl transition-transform group-hover:animate-wiggle">
                {persona.emoji}
              </span>
              <span className={cn("font-display text-lg font-bold", persona.textColor)}>
                {persona.name}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {persona.label}
              </span>
              <span className="text-sm italic text-muted-foreground">
                &ldquo;{persona.tagline}&rdquo;
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

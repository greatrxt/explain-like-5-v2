"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: feedback.trim() }),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 text-center">
          <h1 className="text-2xl font-bold">Thank you!</h1>
          <p className="text-sm text-muted-foreground">
            Your feedback has been submitted. We appreciate you taking the time
            to help us improve.
          </p>
          <Link href="/">
            <Button className="w-full">Back to chat</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Send feedback</h1>
          <p className="text-sm text-muted-foreground">
            Let us know how we can improve Explain Like I Am 5.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 sm:px-16">
          <div className="flex flex-col gap-2">
            <Label htmlFor="feedback">Your feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What could be better? What do you love?"
              rows={5}
              required
              className="resize-none"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit feedback"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium underline">
            Back to chat
          </Link>
        </p>
      </div>
    </div>
  );
}

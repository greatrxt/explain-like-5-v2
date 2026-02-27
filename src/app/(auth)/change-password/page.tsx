"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex w-full flex-col gap-6 text-center">
        <span className="animate-bounce-in text-5xl">🎉</span>
        <h1 className="font-display text-2xl font-bold">Password updated</h1>
        <p className="text-sm text-muted-foreground">
          Your password has been changed successfully.
        </p>
        <Link href="/">
          <Button className="w-full">Go to chat</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="animate-bounce-in text-5xl">🔒</span>
        <h1 className="font-display text-2xl font-bold">Change password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            required
            minLength={6}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            placeholder="Min. 6 characters"
            required
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full">
          Update password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="font-medium text-primary underline">
          Back to chat
        </Link>
      </p>
    </div>
  );
}

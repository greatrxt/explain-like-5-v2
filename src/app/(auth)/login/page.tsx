"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { type AuthState, login } from "@/app/(auth)/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    login,
    {}
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="animate-bounce-in text-5xl">🧒</span>
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to save your chats and access them anywhere.
        </p>
      </div>

      <AuthForm action={formAction}>
        {state.error && (
          <p className="text-sm text-destructive text-center">{state.error}</p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </AuthForm>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary underline">
          Sign up
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="text-primary underline">
          Continue without an account
        </Link>
      </p>
    </div>
  );
}

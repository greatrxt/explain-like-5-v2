"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { type AuthState, register } from "@/app/(auth)/actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    register,
    {}
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="animate-bounce-in text-5xl">✨</span>
        <h1 className="font-display text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Sign up to save chats and pick up where you left off.
        </p>
      </div>

      <AuthForm action={formAction}>
        {state.error && (
          <p className="text-sm text-destructive text-center">{state.error}</p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </AuthForm>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

"use server";

import { signIn, signOut } from "@/auth";
import { createUser, getUser } from "@/db/queries";
import { generateUUID } from "@/lib/utils";
import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface AuthState {
  error?: string;
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const parsed = authSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { error: "Invalid email or password." };
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  redirect("/");
}

export async function register(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid email or password format." };
  }

  const { email, password } = parsed.data;

  const existingUsers = await getUser(email);
  if (existingUsers.length > 0) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  await createUser(generateUUID(), email, hashedPassword);

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  redirect("/");
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

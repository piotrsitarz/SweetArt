"use server";

import { NextResponse } from "next/server";
import { signIn } from "@/auth";

import { AuthError } from "next-auth";

export async function POST(request) {
  const { name, password } = await request.json();

  try {
    await signIn("credentials", { name, password });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            { message: "Invalid username or password." },
            { status: 401 }
          );
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

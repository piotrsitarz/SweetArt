"use server";

import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function GET() {
  try {
    await signOut();
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status }
    );
  }
}

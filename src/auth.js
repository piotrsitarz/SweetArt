import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserByName(name) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await getUserByName(credentials.name);

        if (!user) {
          return null;
        }

        const isValid = credentials.password === user.password;

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});

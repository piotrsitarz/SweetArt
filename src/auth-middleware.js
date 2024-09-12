import { auth } from "@/auth";

export async function authMiddleware() {
  try {
    const authRes = await auth();

    if (authRes?.user?.name) {
      return authRes?.user?.name;
    }

    return null;
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
}

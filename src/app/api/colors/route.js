import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authMiddleware() {
  try {
    const authRes = await auth();

    // return true;
    if (authRes?.user?.name) {
      return authRes?.user?.name; // Return the user's ID
    }
    // return null; // User not authenticated
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
}

export async function GET() {
  try {
    const userName = await authMiddleware();
    if (!userName) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const colors = await prisma.color.findMany({ where: { userName } });
    console.log("colors", colors);
    return new Response(JSON.stringify(colors), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const { name, value } = await request.json();
    const userName = await authMiddleware();
    if (!userName) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const newColor = await prisma.color.create({
      data: {
        name,
        value,
        userName,
      },
    });

    return new Response(JSON.stringify(newColor), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  try {
    const { id, name, value } = await request.json();
    const userName = await authMiddleware();
    if (!userName) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const updatedColor = await prisma.color.update({
      where: { id, userName },
      data: { name, value },
    });
    return new Response(JSON.stringify(updatedColor), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const userName = await authMiddleware();
    if (!userName) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await prisma.color.delete({ where: { id, userName } });
    return new Response(JSON.stringify({ message: "Color deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

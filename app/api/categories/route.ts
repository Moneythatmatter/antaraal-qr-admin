import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatCategory } from "@/lib/api-format";
import { requireAdminApi } from "@/lib/api-auth";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(categories.map(formatCategory));
  } catch (error) {
    console.error("GET /categories error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const category = await prisma.category.create({
      data: {
        name: String(body.name ?? "").trim(),
        order: body.order !== undefined ? Number(body.order) : 0,
      },
    });
    return NextResponse.json(formatCategory(category), { status: 201 });
  } catch (error) {
    console.error("POST /categories error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 400 });
  }
}

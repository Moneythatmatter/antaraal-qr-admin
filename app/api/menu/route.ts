import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatMenuItem, parseMenuBody } from "@/lib/api-format";
import { requireAdminApi } from "@/lib/api-auth";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const menuItems = await prisma.menu.findMany({
      include: { category: true },
    });
    return NextResponse.json(menuItems.map((item) => formatMenuItem(item)));
  } catch (error) {
    console.error("GET /menu error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const data = parseMenuBody(body);

    if (!data.name || data.price === undefined || !data.categoryId) {
      return NextResponse.json(
        { message: "name, price, and category are required" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menu.create({
      data: {
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        description: data.description,
        image: data.image ?? "",
        dietType: data.dietType ?? "veg",
        isAvailable: data.isAvailable ?? true,
      },
    });

    return NextResponse.json(formatMenuItem(menuItem, false), { status: 201 });
  } catch (error) {
    console.error("POST /menu error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatMenuItem, parseMenuBody, toPrismaMenuUpdate } from "@/lib/api-format";
import { requireAdminApi } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const menuItem = await prisma.menu.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!menuItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(formatMenuItem(menuItem));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = toPrismaMenuUpdate(parseMenuBody(body));

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    const menuItem = await prisma.menu.update({
      where: { id },
      data,
    });

    return NextResponse.json(formatMenuItem(menuItem, false));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    await prisma.menu.delete({ where: { id } });
    return NextResponse.json({ message: "Menu item deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 400 });
  }
}

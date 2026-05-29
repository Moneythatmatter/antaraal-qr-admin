import type { Category, Menu } from "@prisma/client";

type MenuWithCategory = Menu & { category?: Category | null };

export function formatCategory(category: Category) {
  return {
    _id: category.id,
    name: category.name,
    order: category.order,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function formatMenuItem(item: MenuWithCategory, populate = true) {
  const formatted: Record<string, unknown> = {
    _id: item.id,
    name: item.name,
    description: item.description ?? undefined,
    price: item.price,
    image: item.image,
    dietType: item.dietType ?? "veg",
    isAvailable: item.isAvailable,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };

  if (populate && item.category) {
    formatted.category = formatCategory(item.category);
  } else {
    formatted.category = item.categoryId;
  }

  return formatted;
}

export function parseCategoryId(category: unknown): string | null {
  if (typeof category === "string") return category;
  if (category && typeof category === "object" && "_id" in category) {
    const id = (category as { _id: unknown })._id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

export function parseMenuBody(body: Record<string, unknown>) {
  const data: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    image?: string;
    dietType?: string;
    isAvailable?: boolean;
  } = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.image !== undefined) data.image = String(body.image);
  if (body.dietType === "veg" || body.dietType === "non-veg") data.dietType = body.dietType;
  if (typeof body.isAvailable === "boolean") data.isAvailable = body.isAvailable;

  const categoryId = parseCategoryId(body.category);
  if (categoryId) data.categoryId = categoryId;

  return data;
}

/** Strip undefined keys so Prisma partial updates only touch provided fields. */
export function toPrismaMenuUpdate(data: ReturnType<typeof parseMenuBody>) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

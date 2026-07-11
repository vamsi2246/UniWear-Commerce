import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
  },

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    return category;
  },

  async create(data: { name: string; description?: string; image?: string | null }) {
    const slug = slugify(data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw ApiError.conflict("A category with this name already exists");
    }

    return prisma.category.create({
      data: { ...data, slug },
      include: { _count: { select: { products: true } } },
    });
  },

  async update(id: string, data: { name?: string; description?: string | null; image?: string | null }) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw ApiError.notFound("Category not found");

    const updateData: any = { ...data };
    if (data.name && data.name !== category.name) {
      updateData.slug = slugify(data.name);
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { products: true } } },
    });
  },

  async delete(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) throw ApiError.notFound("Category not found");

    if (category._count.products > 0) {
      throw ApiError.badRequest(
        `Cannot delete category with ${category._count.products} products. Move or delete products first.`
      );
    }

    return prisma.category.delete({ where: { id } });
  },
};

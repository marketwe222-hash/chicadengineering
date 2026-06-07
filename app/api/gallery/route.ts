import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type GalleryImage = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string;
  altText: string | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.clone();
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "12");
    const search = url.searchParams.get("search")?.trim() ?? "";
    const category = url.searchParams.get("category")?.trim() ?? "";

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (search) {
      Object.assign(where, {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (category && category !== "All") {
      Object.assign(where, {
        category,
      });
    }

    const total = await prisma.galleryImage.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const galleryImages = await prisma.galleryImage.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      data: galleryImages,
      pagination: {
        page: currentPage,
        pageSize,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to load gallery." },
      { status: 500 },
    );
  }
}

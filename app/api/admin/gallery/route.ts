import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const galleryImages = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(galleryImages);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user.admin) throw new Error("FORBIDDEN");

    const body = await req.json();
    const { title, description, category, altText, imageUrl, isPublished } =
      body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "A title and image URL are required." },
        { status: 400 },
      );
    }

    const galleryImage = await prisma.galleryImage.create({
      data: {
        adminId: user.admin.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category?.trim() || null,
        altText: altText?.trim() || null,
        imageUrl: imageUrl.trim(),
        isPublished: Boolean(isPublished),
      },
      include: {
        admin: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(galleryImage);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

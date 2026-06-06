import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(_req: NextRequest, context: any) {
  const params = context?.params ?? {};
  try {
    await requireAdmin();

    const galleryImage = await prisma.galleryImage.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!galleryImage) {
      return NextResponse.json(
        { error: "Gallery image not found." },
        { status: 404 },
      );
    }

    await prisma.galleryImage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

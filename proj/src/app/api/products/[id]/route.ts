import { NextRequest, NextResponse } from "next/server";
import { deleteProduct } from "@/lib/pg";
import { getSignedInUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSignedInUser(req);
  if (!user) return NextResponse.json({ error: "Ürün silmek için giriş yapmalısınız." }, { status: 401 });

  const { id } = await params;
  const changes = await deleteProduct(id);
  if (changes === 0) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

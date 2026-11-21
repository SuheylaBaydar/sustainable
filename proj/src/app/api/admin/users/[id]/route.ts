import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/lib/pg";
import { getAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const { id } = await params;
  if (String(admin.id) === String(id)) {
    return NextResponse.json({ error: "Aktif admin hesabı silinemez." }, { status: 400 });
  }
  const changes = await deleteUser(id);
  if (changes === 0) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

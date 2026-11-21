import { NextRequest, NextResponse } from "next/server";
import { createMessage, listMessages } from "@/lib/pg";
import { getAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Mesaj gönderme — herkese açık ("Bize Katılın" formu)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? "").toString().trim();
    const surname = (body?.surname ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim();
    const city = (body?.city ?? "").toString().trim();
    const message = (body?.message ?? "").toString().trim();

    if (!email && !name) {
      return NextResponse.json({ error: "Lütfen ad veya e-posta girin." }, { status: 400 });
    }

    const saved = await createMessage({ name, surname, email, city, message });
    return NextResponse.json({ ok: true, message: saved }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Mesaj gönderilemedi." },
      { status: 500 }
    );
  }
}

// Mesaj listeleme — yalnızca admin
export async function GET(req: NextRequest) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  const messages = await listMessages();
  return NextResponse.json({ messages });
}

import { NextRequest, NextResponse } from "next/server";
import { createUser, userExists } from "@/lib/pg";

export const runtime = "nodejs";

// Kayıt Ol formu (name, email, password) -> PostgreSQL
// Şifre veri katmanında scrypt ile hashlenerek saklanır.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = (body?.name ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();
    // Formda ayrı kullanıcı adı alanı yok; e-posta kullanıcı adı olur.
    const username = (body?.username ?? email).toString().trim().toLowerCase();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "Şifre en az 4 karakter olmalıdır." },
        { status: 400 }
      );
    }

    if (await userExists(username, email)) {
      return NextResponse.json(
        { error: "Bu kullanıcı veya e-posta zaten kayıtlı." },
        { status: 409 }
      );
    }

    const user = await createUser(username, password, name || undefined, email);
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

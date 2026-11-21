import { NextRequest, NextResponse } from "next/server";
import { listUsers, createUser, userExists } from "@/lib/pg";
import { getAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  const users = await listUsers();
  return NextResponse.json({ users, me: admin });
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const username = (body?.username ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();
    const name = (body?.name ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim().toLowerCase();

    if (!username || !password) {
      return NextResponse.json({ error: "Kullanıcı adı ve şifre zorunludur." }, { status: 400 });
    }
    if (await userExists(username, email)) {
      return NextResponse.json({ error: "Bu kullanıcı veya e-posta zaten mevcut." }, { status: 409 });
    }
    const user = await createUser(username, password, name || undefined, email || undefined);
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Kullanıcı oluşturulamadı." }, { status: 500 });
  }
}

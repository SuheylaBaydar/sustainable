import { NextRequest, NextResponse } from "next/server";
import { createAppointment, listAppointments } from "@/lib/pg";
import { getAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Randevu alma — herkese açık ("Çevrimiçi Danışmanlık Alın" formu)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? "").toString().trim();
    const surname = (body?.surname ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim();
    const date = (body?.date ?? "").toString().trim();
    const time = (body?.time ?? "").toString().trim();

    if (!email) {
      return NextResponse.json({ error: "E-posta zorunludur." }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Tarih zorunludur." }, { status: 400 });
    }

    const saved = await createAppointment({ name, surname, email, date, time });
    return NextResponse.json({ ok: true, appointment: saved }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Randevu oluşturulamadı." },
      { status: 500 }
    );
  }
}

// Randevu listeleme — yalnızca admin
export async function GET(req: NextRequest) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  const appointments = await listAppointments();
  return NextResponse.json({ appointments });
}

import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/pg";
import { getSignedInUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Ürün listeleme — herkese açık (mağaza/anasayfa kullanabilir)
export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Ürünler getirilemedi." },
      { status: 500 }
    );
  }
}

// Ürün ekleme — oturum açmış kullanıcılar
export async function POST(req: NextRequest) {
  const user = await getSignedInUser(req);
  if (!user) return NextResponse.json({ error: "Ürün eklemek için giriş yapmalısınız." }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? "").toString().trim();
    const description = (body?.description ?? "").toString().trim();
    const image_url = (body?.image_url ?? "").toString().trim();
    const rawPrice = body?.price;
    const price =
      rawPrice === "" || rawPrice === null || rawPrice === undefined
        ? null
        : Number(rawPrice);

    if (!name) {
      return NextResponse.json({ error: "Ürün adı zorunludur." }, { status: 400 });
    }
    if (price !== null && Number.isNaN(price)) {
      return NextResponse.json({ error: "Fiyat geçerli bir sayı olmalıdır." }, { status: 400 });
    }

    const product = await createProduct({ name, description, price, image_url });
    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Ürün eklenemedi." },
      { status: 500 }
    );
  }
}

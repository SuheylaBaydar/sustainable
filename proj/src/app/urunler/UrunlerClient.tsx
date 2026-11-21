"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string | number | null;
  image_url: string | null;
  created_at: string;
}

export default function UrunlerClient() {
  const { status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setNotice("Ürünler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");

    if (status !== "authenticated") {
      setNotice("Ürün eklemek için önce giriş yapmalısınız.");
      signIn();
      return;
    }

    if (!name || !price || !imageUrl) {
      setNotice("Lütfen ürün adı, fiyat ve görsel linki giriniz.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price,
          image_url: imageUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error ?? "Ürün eklenemedi.");
        return;
      }
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setShowForm(false);
      setNotice("Ürün veritabanına eklendi.");
      loadProducts();
    } catch {
      setNotice("Ürün eklenirken hata oluştu.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (status !== "authenticated") {
      setNotice("Ürün silmek için önce giriş yapmalısınız.");
      signIn();
      return;
    }
    if (!confirm("Bu ürün silinsin mi?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error ?? "Ürün silinemedi.");
        return;
      }
      setProducts((items) => items.filter((product) => product.id !== id));
      setNotice("Ürün veritabanından silindi.");
    } catch {
      setNotice("Ürün silinirken hata oluştu.");
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden bg-primary pb-20 pt-40">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Ürünler</h1>
          <p className="text-white/80 text-lg">
            Veritabanından gelen kullanıcı ürünleri
          </p>

          <nav className="mt-4 flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-white">Ürünler</span>
          </nav>
        </div>
      </section>

      <section className="py-20 bg-AliceBlue dark:bg-darkmode min-h-[60vh]">
        <div className="container mx-auto px-6">
          <div className="mb-10 flex justify-center">
            <button
              onClick={() => {
                if (status !== "authenticated") {
                  setNotice("Ürün eklemek için önce giriş yapmalısınız.");
                  signIn();
                  return;
                }
                setShowForm(true);
              }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-darkprimary transition"
            >
              Üye Ol ve Ürün Ekle
            </button>
          </div>

          {notice && (
            <p className="mx-auto mb-8 max-w-xl rounded-lg bg-white p-4 text-center text-primary shadow-sm dark:bg-darklight">
              {notice}
            </p>
          )}

          {showForm && (
            <div className="max-w-xl mx-auto bg-white dark:bg-darklight rounded-2xl shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold text-secondary dark:text-white mb-6 text-center">
                Ürün Ekle
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block mb-2 font-medium text-secondary dark:text-white">
                    Ürün Görsel Linki
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full border rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-secondary dark:text-white">
                    Ürün İsmi
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Doğal Sabun"
                    className="w-full border rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-secondary dark:text-white">
                    Açıklama
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ürün açıklaması"
                    className="w-full border rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-secondary dark:text-white">
                    Ürün Fiyatı
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Örn: 250"
                    className="w-full border rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-darkprimary transition"
                >
                  Ürün Ekle
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-SlateBlue dark:text-darktext">Ürünler yükleniyor...</div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-secondary dark:text-white mb-3">
                Henüz Ürün Yok
              </h3>

              <p className="text-SlateBlue dark:text-darktext mb-8 max-w-md">
                Üye olarak ilk ürününüzü ekleyin. Eklenen ürünler PostgreSQL veritabanına kaydedilecek.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-secondary dark:text-white">
                  {products.length} Ürün Listelendi
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-darklight rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark">
                      <img src={product.image_url || "/images/portfolio/portfolio-1.jpg"} alt={product.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        aria-label="Ürünü sil"
                        title="Sil"
                        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-secondary dark:text-white mb-2">{product.name}</h3>
                      {product.description && <p className="text-SlateBlue dark:text-darktext mb-3">{product.description}</p>}
                      <p className="text-primary text-xl font-bold mb-2">{product.price != null ? `${product.price} TL` : "Fiyat belirtilmedi"}</p>
                      <p className="text-xs text-gray-400">{new Date(product.created_at).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

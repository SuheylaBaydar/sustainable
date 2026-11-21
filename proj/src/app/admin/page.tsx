"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Tab = "users" | "products" | "messages" | "appointments";

interface UserRow { id: number; username: string; name: string | null; email: string | null; created_at: string; }
interface ProductRow { id: number; name: string; description: string | null; price: string | number | null; image_url: string | null; created_at: string; }
interface MessageRow { id: number; name: string | null; surname: string | null; email: string | null; city: string | null; message: string | null; created_at: string; }
interface AppointmentRow { id: number; name: string | null; surname: string | null; email: string | null; appt_date: string | null; appt_time: string | null; created_at: string; }

const inputClass =
  "w-full rounded-md border border-BorderLine dark:border-dark_border border-solid bg-transparent px-4 py-2.5 text-sm text-dark outline-hidden transition placeholder:text-gray-400 focus:border-primary dark:text-white dark:focus:border-primary";

export default function AdminPage() {
  const { status } = useSession();

  const [tab, setTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [me, setMe] = useState<{ name?: string | null } | null>(null);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);

  const [userForm, setUserForm] = useState({ username: "", name: "", email: "", password: "" });
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", image_url: "" });
  const [busy, setBusy] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setForbidden(false);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (res.status === 401) { setForbidden(true); return; }
      const data = await res.json();
      setUsers(data.users ?? []);
      setMe(data.me ?? null);

      const [p, m, a] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/messages", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/appointments", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setProducts(p.products ?? []);
      setMessages(m.messages ?? []);
      setAppointments(a.appointments ?? []);
    } catch {
      toast.error("Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadAll();
    else if (status === "unauthenticated") setLoading(false);
  }, [status, loadAll]);

  /* -------- mutations -------- */
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.username || !userForm.password) return toast.error("Kullanıcı adı ve şifre zorunlu.");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userForm),
      });
      const d = await res.json();
      if (!res.ok) return toast.error(d.error ?? "Eklenemedi.");
      toast.success("Kullanıcı eklendi.");
      setUserForm({ username: "", name: "", email: "", password: "" });
      loadAll();
    } finally { setBusy(false); }
  };

  const delUser = async (id: number, username: string) => {
    if (!confirm(`"${username}" silinsin mi?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) return toast.error(d.error ?? "Silinemedi.");
    toast.success("Silindi."); setUsers((u) => u.filter((x) => x.id !== id));
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return toast.error("Ürün adı zorunlu.");
    setBusy(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(productForm),
      });
      const d = await res.json();
      if (!res.ok) return toast.error(d.error ?? "Eklenemedi.");
      toast.success("Ürün eklendi.");
      setProductForm({ name: "", description: "", price: "", image_url: "" });
      loadAll();
    } finally { setBusy(false); }
  };

  const delProduct = async (id: number, name: string) => {
    if (!confirm(`"${name}" silinsin mi?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) return toast.error(d.error ?? "Silinemedi.");
    toast.success("Silindi."); setProducts((p) => p.filter((x) => x.id !== id));
  };

  /* -------- states -------- */
  if (status === "loading" || (status === "authenticated" && loading)) {
    return <Shell><div className="flex items-center justify-center py-32 text-darktext">Yükleniyor…</div></Shell>;
  }
  if (status === "unauthenticated") {
    return (
      <Shell>
        <Card>
          <h2 className="text-xl font-semibold text-secondary dark:text-white">Giriş gerekli</h2>
          <p className="mt-2 text-sm text-darktext">Yönetim paneline erişmek için admin hesabıyla giriş yapın.</p>
          <button onClick={() => signIn()} className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm text-white transition hover:bg-darkprimary">Giriş Yap</button>
        </Card>
      </Shell>
    );
  }
  if (forbidden) {
    return (
      <Shell>
        <Card>
          <h2 className="text-xl font-semibold text-secondary dark:text-white">Yetkisiz erişim</h2>
          <p className="mt-2 text-sm text-darktext">Bu sayfa yalnızca <strong>admin</strong> hesabına açıktır.</p>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-5 rounded-md border border-BorderLine dark:border-dark_border px-5 py-2.5 text-sm text-secondary dark:text-white transition hover:border-primary">Oturumu kapat</button>
        </Card>
      </Shell>
    );
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "users", label: "Kullanıcılar", count: users.length },
    { key: "products", label: "Ürünler", count: products.length },
    { key: "messages", label: "Mesajlar", count: messages.length },
    { key: "appointments", label: "Randevular", count: appointments.length },
  ];

  return (
    <Shell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Sustainable · Yönetim</p>
          <h1 className="mt-1 text-2xl font-semibold text-secondary dark:text-white sm:text-3xl">Yönetim Paneli</h1>
          <p className="mt-1 text-sm text-darktext">Hoş geldin{me?.name ? `, ${me.name}` : ""}. PostgreSQL veritabanına bağlı.</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="self-start rounded-md border border-BorderLine dark:border-dark_border px-4 py-2 text-sm text-secondary dark:text-white transition hover:border-primary sm:self-auto">Çıkış Yap</button>
      </div>

      {/* Sekmeler */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-primary text-white"
                : "border border-BorderLine dark:border-dark_border text-secondary dark:text-white hover:border-primary"
            }`}
          >
            {t.label}
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${tab === t.key ? "bg-white/20" : "bg-AliceBlue dark:bg-darklight text-darkprimary"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* KULLANICILAR */}
      {tab === "users" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden p-0">
            <CardHead title="Kullanıcılar" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="text-xs uppercase tracking-wide text-darktext">
                  <Th>ID</Th><Th>Kullanıcı</Th><Th>E-posta</Th><Th>Kayıt</Th><Th className="text-right">İşlem</Th>
                </tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-BorderLine/60 dark:border-dark_border/60">
                      <Td className="text-darktext">{u.id}</Td>
                      <Td><div className="font-medium text-secondary dark:text-white">{u.name || u.username}</div><div className="text-xs text-darktext">@{u.username}</div></Td>
                      <Td className="text-darktext">{u.email || "—"}</Td>
                      <Td className="text-darktext">{u.created_at?.slice(0, 10)}</Td>
                      <Td className="text-right">
                        {u.username === "admin"
                          ? <span className="rounded-full bg-AliceBlue px-2.5 py-1 text-xs font-medium text-darkprimary dark:bg-darklight">admin</span>
                          : <DeleteBtn onClick={() => delUser(u.id, u.username)} />}
                      </Td>
                    </tr>
                  ))}
                  {users.length === 0 && <EmptyRow cols={5} />}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <h2 className="text-base font-semibold text-secondary dark:text-white">Yeni Kullanıcı</h2>
            <p className="mt-1 mb-4 text-xs text-darktext">Doğrudan veritabanına eklenir.</p>
            <form onSubmit={addUser} className="space-y-3">
              <input className={inputClass} placeholder="Kullanıcı adı *" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} />
              <input className={inputClass} placeholder="Ad Soyad" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
              <input className={inputClass} type="email" placeholder="E-posta" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
              <input className={inputClass} placeholder="Şifre *" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
              <SubmitBtn busy={busy}>Kullanıcı Ekle</SubmitBtn>
            </form>
          </Card>
        </div>
      )}

      {/* ÜRÜNLER */}
      {tab === "products" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden p-0">
            <CardHead title="Ürünler" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="text-xs uppercase tracking-wide text-darktext">
                  <Th>ID</Th><Th>Ürün</Th><Th>Fiyat</Th><Th className="text-right">İşlem</Th>
                </tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-BorderLine/60 dark:border-dark_border/60">
                      <Td className="text-darktext">{p.id}</Td>
                      <Td>
                        <div className="font-medium text-secondary dark:text-white">{p.name}</div>
                        {p.description && <div className="text-xs text-darktext max-w-xs truncate">{p.description}</div>}
                      </Td>
                      <Td className="text-darktext">{p.price != null ? `${p.price} ₺` : "—"}</Td>
                      <Td className="text-right"><DeleteBtn onClick={() => delProduct(p.id, p.name)} /></Td>
                    </tr>
                  ))}
                  {products.length === 0 && <EmptyRow cols={4} text="Henüz ürün yok." />}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <h2 className="text-base font-semibold text-secondary dark:text-white">Yeni Ürün</h2>
            <p className="mt-1 mb-4 text-xs text-darktext">Veritabanına kaydedilir.</p>
            <form onSubmit={addProduct} className="space-y-3">
              <input className={inputClass} placeholder="Ürün adı *" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              <textarea className={inputClass} placeholder="Açıklama" rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              <input className={inputClass} type="number" step="0.01" placeholder="Fiyat (₺)" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              <input className={inputClass} placeholder="Görsel URL" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} />
              <SubmitBtn busy={busy}>Ürün Ekle</SubmitBtn>
            </form>
          </Card>
        </div>
      )}

      {/* MESAJLAR */}
      {tab === "messages" && (
        <Card className="overflow-hidden p-0">
          <CardHead title="Gelen Mesajlar" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs uppercase tracking-wide text-darktext">
                <Th>Gönderen</Th><Th>E-posta</Th><Th>Şehir</Th><Th>Mesaj</Th><Th>Tarih</Th>
              </tr></thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} className="border-t border-BorderLine/60 dark:border-dark_border/60">
                    <Td><span className="font-medium text-secondary dark:text-white">{[m.name, m.surname].filter(Boolean).join(" ") || "—"}</span></Td>
                    <Td className="text-darktext">{m.email || "—"}</Td>
                    <Td className="text-darktext">{m.city || "—"}</Td>
                    <Td className="text-darktext max-w-sm">{m.message || "—"}</Td>
                    <Td className="text-darktext whitespace-nowrap">{m.created_at?.slice(0, 10)}</Td>
                  </tr>
                ))}
                {messages.length === 0 && <EmptyRow cols={5} text="Henüz mesaj yok." />}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* RANDEVULAR */}
      {tab === "appointments" && (
        <Card className="overflow-hidden p-0">
          <CardHead title="Randevu Talepleri" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs uppercase tracking-wide text-darktext">
                <Th>Kişi</Th><Th>E-posta</Th><Th>Tarih</Th><Th>Saat</Th><Th>Talep</Th>
              </tr></thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t border-BorderLine/60 dark:border-dark_border/60">
                    <Td><span className="font-medium text-secondary dark:text-white">{[a.name, a.surname].filter(Boolean).join(" ") || "—"}</span></Td>
                    <Td className="text-darktext">{a.email || "—"}</Td>
                    <Td className="text-darktext whitespace-nowrap">{a.appt_date ? String(a.appt_date).slice(0, 10) : "—"}</Td>
                    <Td className="text-darktext">{a.appt_time || "—"}</Td>
                    <Td className="text-darktext whitespace-nowrap">{a.created_at?.slice(0, 10)}</Td>
                  </tr>
                ))}
                {appointments.length === 0 && <EmptyRow cols={5} text="Henüz randevu yok." />}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Toaster position="top-center" />
    </Shell>
  );
}

/* ---------- yardımcı bileşenler ---------- */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-AliceBlue/40 dark:bg-darkmode min-h-screen pt-32 pb-20">
      <div className="mx-auto w-full max-w-1200 px-4 sm:px-6">{children}</div>
    </section>
  );
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-14 border border-BorderLine dark:border-dark_border bg-white dark:bg-darklight p-6 shadow-light-shadwo ${className}`}>{children}</div>;
}
function CardHead({ title }: { title: string }) {
  return <div className="border-b border-BorderLine dark:border-dark_border px-5 py-4"><h2 className="text-base font-semibold text-secondary dark:text-white">{title}</h2></div>;
}
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3 font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 ${className}`}>{children}</td>;
}
function EmptyRow({ cols, text = "Henüz kayıt yok." }: { cols: number; text?: string }) {
  return <tr><td colSpan={cols} className="px-5 py-10 text-center text-darktext">{text}</td></tr>;
}
function DeleteBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30">Sil</button>;
}
function SubmitBtn({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return <button type="submit" disabled={busy} className="w-full rounded-md bg-primary px-5 py-2.5 text-sm text-white transition hover:bg-darkprimary disabled:opacity-60">{busy ? "İşleniyor…" : children}</button>;
}

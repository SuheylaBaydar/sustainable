# SQL Veritabanı Kurulumu

Giriş artık gerçek bir **SQL veritabanına** (SQLite – `better-sqlite3`) bağlı.

## Kurulum

Projede yeni bir bağımlılık eklendiği için bir kez bağımlılıkları kurman gerekiyor:

```bash
npm install
```

(Eğer pnpm kullanıyorsan: `pnpm install`)

Bu komut `better-sqlite3` sürücüsünü kurar.

## Çalıştırma

```bash
npm run dev
```

Uygulama ilk çalıştığında, proje kökünde otomatik olarak bir veritabanı dosyası
oluşturulur:

```
data/app.db
```

İçinde `users` tablosu oluşturulur ve varsayılan yönetici hesabı eklenir:

| Kullanıcı Adı | Şifre    |
| ------------- | -------- |
| `admin`       | `admin123` |

Şifre düz metin olarak değil, `scrypt` ile **hashlenerek** saklanır.

## Nasıl Çalışır

- `src/lib/db.ts` → SQLite bağlantısı, `users` tablosu, admin tohumlama (seed),
  şifre hashleme ve `verifyUser(kullanıcıAdı, şifre)` doğrulama fonksiyonu.
- `src/app/api/auth/[...nextauth]/route.ts` → NextAuth `authorize()` artık sabit
  kontrol yerine `verifyUser` ile veritabanını sorgular.
- Giriş Yap → `admin / admin123` doğruysa kullanıcı veritabanından doğrulanır ve
  başarılı girişte anasayfaya yönlendirilir.

## Yeni Kullanıcı Eklemek (opsiyonel)

`src/lib/db.ts` içindeki `createUser` fonksiyonunu kullanabilirsin:

```ts
import { createUser } from "@/lib/db";
createUser("yeniKullanici", "sifre123", "Ad Soyad", "mail@ornek.com");
```

## Başka bir SQL veritabanı (MySQL/PostgreSQL) kullanmak istersen

Mantık tek bir dosyada (`src/lib/db.ts`) toplandı. Oradaki bağlantı ve sorguları
ilgili sürücüyle (`mysql2`, `pg` vb.) değiştirmen yeterli; `verifyUser` arayüzü
aynı kaldığı sürece giriş akışına dokunman gerekmez.

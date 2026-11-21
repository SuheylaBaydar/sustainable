# PostgreSQL Kurulumu ve Özellikler

Proje artık **PostgreSQL** veritabanına bağlı. Kullanıcılar, ürünler, mesajlar
ve randevular tek bir PostgreSQL veritabanında saklanır. Şifreler **scrypt** ile
hashlenerek yazılır (asla düz metin değil).

## 1. PostgreSQL kurun ve bir veritabanı oluşturun

```sql
CREATE DATABASE sustainable;
```

(Yerelde PostgreSQL yoksa: macOS `brew install postgresql`, Windows için
postgresql.org installer, ya da Docker:
`docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`)

## 2. Ortam değişkenlerini ayarlayın

Proje kökünde `.env.local` dosyası oluşturun (`.env.example` dosyasını kopyalayın):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sustainable
NEXTAUTH_SECRET=uzun-rastgele-bir-deger
NEXTAUTH_URL=http://localhost:3000
```

`NEXTAUTH_SECRET` üretmek için: `openssl rand -base64 32`

## 3. Bağımlılıkları kurun ve çalıştırın

```bash
npm install
npm run dev
```

Uygulama ilk istekte tabloları otomatik oluşturur (`users`, `products`,
`messages`, `appointments`) ve varsayılan admini ekler:

| Kullanıcı Adı | Şifre      |
| ------------- | ---------- |
| `admin`       | `admin123` |

## Özellikler ve uç noktalar

- **Kayıt Ol** → `POST /api/register` — yeni kullanıcı (şifre hashlenir).
- **Giriş Yap** → NextAuth Credentials → `verifyUser` ile PostgreSQL doğrulaması.
- **Ürün ekleme** → `POST /api/products` (yalnızca admin).
- **Ürün listeleme** → `GET /api/products` (herkese açık).
- **Mesaj gönderme** → `POST /api/messages` — anasayfadaki "Bize Katılın" formu.
- **Randevu alma** → `POST /api/appointments` — iletişimdeki "Çevrimiçi Danışmanlık Alın" formu.
- **Admin paneli** → `/admin` — Kullanıcılar, Ürünler, Mesajlar, Randevular sekmeleri.
  Yalnızca kullanıcı adı `admin` olan hesap erişebilir.

## Tüm veri mantığı tek dosyada

`src/lib/pg.ts` — bağlantı havuzu, şema, şifre hashleme ve tüm sorgular burada.
Başka bir kuruluma geçmek isterseniz yalnızca bu dosyayı düzenlemeniz yeterli.

## Admin panele ulaşma

1. Siteyi açın, sağ üstten **admin / admin123** ile giriş yapın.
2. Adres çubuğuna `http://localhost:3000/admin` yazın.

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Basit, kural tabanlı Türkçe asistan.
 * Anahtar kelimelere göre yanıt verir; eşleşme yoksa genel bir yardım metni döner.
 *
 * İleride gerçek bir yapay zekâ modeline bağlamak isterseniz:
 * bu fonksiyonun yerine OpenAI/Anthropic API çağrısı koymanız yeterli.
 */
function getReply(raw: string): string {
  const msg = (raw || "").toLowerCase();
  const has = (...keys: string[]) => keys.some((k) => msg.includes(k));

  if (!msg.trim()) {
    return "Bir şeyler yazarsan yardımcı olmaya çalışayım 🙂";
  }
  if (has("merhaba", "selam", "günaydın", "iyi günler", "hey")) {
    return "Merhaba! 🌱 Sustainable'a hoş geldin. Kayıt, giriş, ürünler, randevu veya iletişim konusunda sorabilirsin.";
  }
  if (has("kayıt", "üye ol", "kaydol", "hesap aç", "register")) {
    return "Kayıt olmak için anasayfadaki “Bize Katılın” formunu ya da Giriş penceresindeki kayıt bölümünü kullanabilirsin. Ad, e-posta ve şifre girmen yeterli; bilgilerin güvenle veritabanına kaydedilir.";
  }
  if (has("giriş", "login", "oturum aç", "giremiyorum")) {
    return "Giriş yapmak için sağ üstteki “Giriş Yap” butonunu kullan. Kayıtlı e-postan ve şifrenle ya da Google ile giriş yapabilirsin. Giriş yapamıyorsan e-posta ve şifreni kontrol et.";
  }
  if (has("şifre", "parola", "unuttum")) {
    return "Şifren güvenlik için şifrelenmiş (hashlenmiş) olarak saklanır, kimse göremez. Şifreni unuttuysan yeni bir hesapla devam edebilir veya yöneticiyle iletişime geçebilirsin.";
  }
  if (has("ürün", "ürünler", "satın", "fiyat listesi", "product")) {
    return "Ürünleri “Ürünler” sayfasında görebilirsin. Satışa veya geri kazanıma uygun gıdalar burada listelenir. Yeni ürünler yöneticiler tarafından eklenir.";
  }
  if (has("randevu", "danışman", "danışmanlık", "appointment")) {
    return "Randevu almak için İletişim sayfasındaki “Çevrimiçi Danışmanlık Alın” formunu doldur: ad, e-posta, tarih ve saat. Talebin bize ulaşır ve en kısa sürede dönüş yapılır.";
  }
  if (has("mesaj", "iletişim", "contact", "ulaş", "yaz")) {
    return "Bize mesaj göndermek için anasayfadaki “Bize Katılın” formunu ya da İletişim sayfasını kullanabilirsin. Mesajın doğrudan ekibimize iletilir.";
  }
  if (has("fiyat", "ücret", "abonelik", "pricing", "ne kadar")) {
    return "Fiyatlandırma seçeneklerini “Pricing” (Fiyatlandırma) sayfasında bulabilirsin.";
  }
  if (has("gıda", "israf", "sürdürülebilir", "çevre", "geri dönüş")) {
    return "Sustainable, gıda israfını azaltmayı amaçlar 🌍 Satılabilecek veya geri dönüştürülebilecek gıdaları kolayca yönetilebilir hale getirerek hem bütçeye hem doğaya katkı sağlar.";
  }
  if (has("admin", "yönetim", "panel")) {
    return "Yönetim paneli yalnızca yetkili admin hesabına açıktır. Yetkiliysen giriş yaptıktan sonra /admin adresinden kullanıcıları, ürünleri, mesajları ve randevuları yönetebilirsin.";
  }
  if (has("teşekkür", "sağ ol", "eyvallah", "thanks")) {
    return "Rica ederim! Başka bir konuda yardımcı olabilir miyim? 🌱";
  }
  if (has("kim", "nedir", "ne yap", "hakkında", "about")) {
    return "Sustainable, gıda israfını azaltmaya yönelik bir platform. Kullanıcılar ürünleri görüntüleyebilir, danışmanlık randevusu alabilir ve bizimle iletişime geçebilir. Daha fazlası için “Hakkımızda” sayfasına göz at.";
  }

  return "Bunu tam anlayamadım, ama yardımcı olmak isterim. Şunları sorabilirsin: kayıt olma, giriş yapma, ürünler, randevu alma veya iletişim. Hangisini istersin?";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body?.message ?? "").toString();
    const reply = getReply(message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Bir sorun oluştu, lütfen tekrar deneyin." },
      { status: 200 }
    );
  }
}

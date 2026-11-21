import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şartlar ve Koşullar | Sustainable",
};

const page = () => {
  return (
    <>
      <HeroSub title="Şartlar ve Koşullar" description="" />

      <section className="py-20 bg-white dark:bg-darkmode">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-AliceBlue dark:bg-darklight rounded-3xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-secondary dark:text-white mb-6">
              Kullanım Şartları
            </h2>

            <div className="space-y-6 text-SlateBlue dark:text-darktext leading-relaxed">
              <p>
                Sustainable platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
              </p>

              <div>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
                  1. Ürün Bilgileri
                </h3>
                <p>
                  Satıcılar ekledikleri ürünlerin görsel, isim, fiyat ve açıklama bilgilerinin doğru olmasından sorumludur.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
                  2. Gıda Güvenliği
                </h3>
                <p>
                  Platformda listelenen ürünlerin tüketilebilir durumda olması ve sağlık koşullarına uygun şekilde sunulması satıcının sorumluluğundadır.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
                  3. Kullanıcı Sorumluluğu
                </h3>
                <p>
                  Kullanıcılar platformu doğru, güvenli ve yasalara uygun şekilde kullanmayı kabul eder.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
                  4. Sürdürülebilirlik Amacı
                </h3>
                <p>
                  Sustainable, gıda israfını azaltmayı ve uygun fiyatlı ürünlerin kullanıcılarla buluşmasını amaçlar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
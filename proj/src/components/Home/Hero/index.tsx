"use client";

import { useState } from "react";
import Image from "next/image";
import { getImgPath } from "@/utils/imagePath";

const Hero = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    city: "",
    message: "",
  });
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [note, setNote] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setStatus("error");
      setNote("Lütfen Şartlar ve Koşullar'ı kabul edin.");
      return;
    }
    setStatus("sending");
    setNote("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setNote(data.error ?? "Mesaj gönderilemedi.");
        return;
      }
      setStatus("ok");
      setNote("Mesajınız alındı, teşekkürler!");
      setForm({ name: "", surname: "", email: "", city: "", message: "" });
      setAgree(false);
    } catch {
      setStatus("error");
      setNote("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <section
        className="relative overflow-x-clip top-0 bg-primary circalanimat"
        style={
          {
            "--work-line-bg": `url(${getImgPath("/images/work-grow/work-line.png")})`,
          } as React.CSSProperties
        }
      >
        <div className="banner-shap it-wrapper">
          <div className="container py-20">
            <div className="flex flex-wrap">
              <div className="pb-3 sm:pb-0 md:w-2/3 w-full relative z-1">
                <h1 className="text-white relative max-w-473">
                  Gıdanı Koru İsrafın Önüne Geç
                </h1>

                <button className="bg-white text-base font-normal text-primary py-3 px-12 rounded-lg mb-16 mt-8 transition-all duration-0.4s hover:bg-secondary hover:text-white">
                  Bize Katılın
                </button>

                <p className="text-base font-normal text-white leading-7 pb-11 max-w-408">
                  Satılabilecek veya geri dönüştürülebilecek gıdaları daha bilinçli şekilde herkesin
                  kullanabileceği kolay tasarımlı bir uygulamayla nasıl kontrol sağlanılabilir?
                  İşte bu ancak bizimle mümkün.
                </p>

                <div className="flex items-center gap-6">
                  <Image
                    src={getImgPath("/images/hero/wise_white.png")}
                    alt="logo"
                    width={80}
                    height={20}
                    quality={100}
                    className="w-20 h-5"
                  />
                  <Image
                    src={getImgPath("/images/hero/google_white.png")}
                    alt="logo"
                    width={80}
                    height={20}
                    quality={100}
                    className="h-5 w-auto"
                  />
                  <Image
                    src={getImgPath("/images/hero/pay_white.png")}
                    alt="logo"
                    width={80}
                    height={20}
                    quality={100}
                    className="h-5 w-auto"
                  />
                  <Image
                    src={getImgPath("/images/hero/stripe_white.png")}
                    alt="logo"
                    width={56}
                    height={20}
                    quality={100}
                    className="w-14 h-5"
                  />
                </div>
              </div>

              <div
                className="md:w-1/4 w-full md:-ml-16 -ml-0 relative z-1"
                style={
                  {
                    "--grid-line-bg": `url(${getImgPath("/images/hero/grid-line.png")})`,
                    "--circal-bg": `url(${getImgPath("/images/hero/circal.png")})`,
                  } as React.CSSProperties
                }
              >
                <form onSubmit={handleSubmit}>
                  <h6 className="text-white sm:text-[26px] leading-[2.11rem] text-xl font-bold pb-5">
                    Bize Katılın
                  </h6>

                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-center mb-6">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="bg-white text-darkmode text-base rounded-lg block w-full p-2.5"
                      placeholder="Ad"
                      required
                    />

                    <input
                      type="text"
                      name="surname"
                      value={form.surname}
                      onChange={handleChange}
                      className="bg-white text-darkmode text-base rounded-lg block w-full p-2.5"
                      placeholder="Soyad"
                      required
                    />

                    <input
                      type="text"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="md:col-span-2 bg-white text-darkmode text-base rounded-lg block w-full p-2.5"
                      placeholder="email@website.com"
                      required
                    />

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="md:col-span-2 bg-white text-darkmode text-base rounded-lg block w-full p-2.5"
                      placeholder="Şehir"
                      required
                    />

                    <textarea
                      rows={4}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className="md:col-span-2 bg-white block p-2.5 w-full text-base text-darkmode rounded-lg"
                      placeholder="Düşüncelerinizi yazınız..."
                    ></textarea>
                  </div>

                  <div className="flex items-start mb-6">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="w-4 h-4 mt-1 border border-gray-300 rounded-sm checked:accent-LightApricot"
                      required
                    />

                    <p className="ms-2 text-base font-normal text-white dark:text-gray-300">
                      Okudum ve kabul ediyorum{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="underline font-semibold text-white"
                      >
                        Şartlar ve Koşullar
                      </button>
                      .
                    </p>
                  </div>

                  {note && (
                    <p
                      className={`mb-4 text-base font-medium ${
                        status === "ok" ? "text-white" : "text-LightApricot"
                      }`}
                    >
                      {note}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="text-secondary bg-LightApricot hover:bg-secondary hover:text-white font-normal rounded-lg text-base w-full px-5 py-2.5 text-center transition-all duration-0.4s disabled:opacity-70"
                  >
                    {status === "sending" ? "Gönderiliyor..." : "Gönder"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] px-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-5 text-3xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-secondary mb-6">
              Şartlar ve Koşullar
            </h2>

            <div className="space-y-4 text-SlateBlue leading-relaxed">
              <p>
                Sustainable platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
              </p>

              <div>
                <h3 className="font-bold text-secondary text-lg">1. Ürün Bilgileri</h3>
                <p>
                  Satıcılar ekledikleri ürünlerin görsel, isim, fiyat ve açıklama bilgilerinin doğru olmasından sorumludur.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-secondary text-lg">2. Gıda Güvenliği</h3>
                <p>
                  Platformda listelenen ürünlerin tüketilebilir durumda olması ve sağlık koşullarına uygun şekilde sunulması satıcının sorumluluğundadır.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-secondary text-lg">3. Kullanıcı Sorumluluğu</h3>
                <p>
                  Kullanıcılar platformu doğru, güvenli ve yasalara uygun şekilde kullanmayı kabul eder.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-secondary text-lg">4. Sürdürülebilirlik Amacı</h3>
                <p>
                  Sustainable, gıda israfını azaltmayı ve uygun fiyatlı ürünlerin kullanıcılarla buluşmasını amaçlar.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="mt-8 w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;

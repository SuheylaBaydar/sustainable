import HeroSub from '@/components/SharedComponent/HeroSub'
import React from 'react'
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Sustainable",
};

const page = () => {
  return (
    <>
      <HeroSub title="Hakkımızda" description="" />

      <section className="py-20 bg-white dark:bg-darkmode">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">

            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Biz Kimiz?
            </span>

            <h2 className="text-secondary dark:text-white text-3xl md:text-4xl font-bold mb-8 leading-snug">
              Gıda İsrafına Son, Lezzete Merhaba
            </h2>

            <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-10">
              <Image
                src="/images/about/deneme.jpg"
                alt="Sustainable Marketplace"
                fill
                priority
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center px-6">
                  <h3 className="text-white text-3xl md:text-5xl font-bold mb-4">
                    Gıda İsrafını Birlikte Önleyelim
                  </h3>

                  <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
                    Satıcıları ve tüketicileri buluşturan sürdürülebilir pazar yeri.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-SlateBlue dark:text-darktext text-lg leading-relaxed max-w-3xl mx-auto">
              Hem satıcıların satış yapabileceği kalitedeki ürünlerini uygun fiyata satabileceği hem de kullanıcılara zorluk yaşatmadan yapay zeka destek doğrultusunda ürünlere kolaylıkla erişebileceği sitemize hoşgeldiniz. Siz de gıda israfının önüne geçmek isteyen bir işletmeci veya müşteriyseniz hemen üye olun. Ürünlerinizi görsel ve bilgilendirmeyle yükleyin ve satıcılara kolaylıkla ulaşın.
            </p>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
              <div className="bg-AliceBlue dark:bg-darklight rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>

                <h4 className="text-secondary dark:text-white font-bold text-lg mb-2">
                  Satıcılar İçin
                </h4>

                <p className="text-SlateBlue dark:text-darktext text-sm leading-relaxed">
                  Kaliteli ürünlerinizi uygun fiyatlarla kolayca listeleyin, geniş müşteri kitlesine ulaşın.
                </p>
              </div>

              <div className="bg-AliceBlue dark:bg-darklight rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>

                <h4 className="text-secondary dark:text-white font-bold text-lg mb-2">
                  Yapay Zeka Desteği
                </h4>

                <p className="text-SlateBlue dark:text-darktext text-sm leading-relaxed">
                  Akıllı öneriler ve yapay zeka destekli arama ile ihtiyacınız olan ürünlere anında ulaşın.
                </p>
              </div>

              <div className="bg-AliceBlue dark:bg-darklight rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <h4 className="text-secondary dark:text-white font-bold text-lg mb-2">
                  Gıda İsrafı Yok
                </h4>

                <p className="text-SlateBlue dark:text-darktext text-sm leading-relaxed">
                  Sürdürülebilir bir gelecek için gıda israfının önüne geçin, çevreye katkı sağlayın.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default page
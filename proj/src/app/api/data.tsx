import { getImgPath } from '@/utils/imagePath';

export const count = [
  {
    icon: getImgPath("/images/counter/star.svg"),
    value: "4.86",
    description: "Google platformunda 3896 incelemeden 5 yıldız",
  },
  {
    icon: getImgPath("/images/counter/admin.svg"),
    value: "364",
    description: "2021 yılında alınan müşteri referanslar",
  },
  {
    icon: getImgPath("/images/counter/bag.svg"),
    value: "45M+",
    description: "Yeni işletmeler ve pazarlama yoluyla elde edilen gelir",
  },
];

export const cardData = [
  {
    iconUrl: getImgPath('/images/build-amazing/beautiful-design.svg'),
    title: 'İşletmeler İçin Kolay Satış',
    description: 'Gün sonunda kalan ürünlerinizi dakikalar içinde yükleyin ve müşterilerle buluşturun.',
    link: '/',
  },
  {
    iconUrl: getImgPath('/images/build-amazing/coded.svg'),
    title: 'Güvenli ve Hızlı Alışveriş',
    description: 'Ürün bilgilerini görüntüleyin, siparişinizi oluşturun ve teslim alın.',
    link: '/',
  },
  {
    iconUrl: getImgPath('/images/build-amazing/amazing.svg'),
    title: 'Çevreye Katkı Sağlayın',
    description: 'Her satın alma ile çöpe gitmesi muhtemel gıdaların değerlendirilmesine destek olun.',
    link: '/',
  },
  {
    iconUrl: getImgPath('/images/build-amazing/beautiful-design.svg'),
    title: 'Uygun Fiyatlı Fırsatlar',
    description: 'Kaliteli ürünleri daha ekonomik fiyatlarla satın alın ve tasarruf edin.',
    link: '/',
  },
];

export const boxData = [
  {
    src: getImgPath('/images/work-grow/mobile-application.jpg'),
    alt: 'work-grow',
    title: 'Hakkımızda',
    slug: "portfolio-1"
  },
  {
    src: getImgPath('/images/work-grow/weby-dashboard-design.jpg'),
    alt: 'work-grow',
    title: 'Ürünler',
    slug: "portfolio-2"
  },
  {
    src: getImgPath('/images/work-grow/frontend-development.jpg'),
    alt: 'work-grow',
    title: 'İletişim',
    slug: "portfolio-3"
  },


];

export const accordionData = [
  {
    title: "Gıdalar neden indirimli satılıyor?",
    content:
      "Platformumuzda yer alan ürünler; son tüketim tarihine yaklaşan, gün sonunda elde kalan veya fazla üretilen ancak tüketim için tamamen uygun gıdalardır. Bu sayede işletmeler israfı azaltırken kullanıcılar kaliteli ürünlere daha uygun fiyatlarla ulaşabilir.",
  },
  {
    title: "Satın aldığım ürünlerin tüketimi güvenli mi?",
    content:
      "Evet. Platforma yüklenen tüm ürünler işletmeler tarafından gıda güvenliği kurallarına uygun şekilde sunulur. Son tüketim tarihi geçmiş ürünlerin satışına izin verilmez ve kullanıcıların güvenli alışveriş yapması önceliğimizdir.",
  },
  {
    title: "Bir işletme olarak ürünlerimi nasıl satışa sunabilirim?",
    content:
      "İşletme hesabı oluşturarak elinizde kalan veya fazla üretilen ürünleri birkaç adımda sisteme yükleyebilirsiniz. Ürün bilgilerini, fiyatını ve teslim alma saatlerini belirledikten sonra müşteriler ürünlerinizi görüntüleyip satın alabilir.",
  },
  {
    title: "Siparişimi nasıl teslim alabilirim?",
    content:
      "Satın alma işlemi tamamlandıktan sonra siparişinizi belirtilen saat aralığında ilgili işletmeden teslim alabilirsiniz. Teslim alma bilgileri sipariş onay ekranında ve hesabınızda görüntülenir.",
  },
  {
    title: "Bu platform gıda israfını nasıl azaltıyor?",
    content:
      "Her yıl tonlarca gıda tüketilebilecek durumda olmasına rağmen çöpe gitmektedir. Platformumuz, işletmelerde kalan ürünleri tüketicilerle buluşturarak hem ekonomik tasarruf sağlar hem de çevresel etkileri azaltarak sürdürülebilir bir geleceğe katkıda bulunur.",
  },
];

export const sections = {
  features: [
    { name: 'Online Ödeme', href: '/' },
    { name: 'Finansal Fikirler', href: '/' },
    { name: 'Aylık Ödeme Talimatları ', href: '/' },

  ],
  resources: [
    { name: 'Dokümantasyon', href: '/' },
    { name: 'Entegrasyonlar', href: '/' },
    { name: 'Destek', href: '/' },
    { name: 'Yardım', href: '/' },
  ],
  platform: [
    { name: 'Altyapı', href: '/' },
    { name: 'Sertifika', href: '/' },
    { name: 'Lisans', href: '/' },
    { name: 'Şartlar ve Koşullar ', href: '/' },
    { name: 'Hukuki', href: '/' },
  ],
};
export interface Community {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  forWhom: string[];
  activities: string[];
  relatedProgram?: { slug: string; title: string };
  /** Future home of this community, if it lives on its own domain. */
  externalDomain?: string;
  /**
   * External community platform URL (Circle / Skool / Discord / WhatsApp group, etc.).
   * Leave `null` until the platform is ready — the page then shows an e-posta
   * waitlist form. Drop a URL here and the page switches to a "Topluluğa Katıl"
   * button that opens it. This is the single config point for the live forum.
   */
  joinUrl: string | null;
}

export const communities: Community[] = [
  {
    slug: 'acemi-zurafa',
    name: 'Acemi Zürafa Topluluğu',
    tagline: 'Şiddetsiz İletişim’i birlikte pratik edenlerin alanı',
    intro:
      'Acemi Zürafa, Anahtar Ayrımlar’ın hayatta nerede karşımıza çıktığını birlikte fark ettiğimiz, NVC’yi daha akıcı konuşmak için düzenli pratik yaptığımız bir topluluktur. “Zürafa” NVC’de empati dilinin sembolüdür; “acemi” ise birlikte öğrenmeye, denemeye ve gelişmeye açık olmayı anlatır.',
    forWhom: [
      'En az bir temel NVC eğitimi almış olanlar',
      'Anahtar Ayrımlar programına katılan veya katılmış olanlar',
      'NVC pratiğini düzenli olarak sürdürmek isteyenler',
    ],
    activities: [
      'Düzenli pratik buluşmaları',
      'Gerçek hayat durumlarıyla empati çalışmaları',
      'Üyeler arası destek ve deneyim paylaşımı',
    ],
    relatedProgram: { slug: 'anahtar-ayrimlar', title: 'Anahtar Ayrımlar Programı' },
    joinUrl: null,
  },
  {
    slug: 'anlasmazlik-donusturme',
    name: 'Anlaşmazlık Dönüştürme Topluluğu',
    tagline: 'Çatışmayı bağlantıya dönüştürmeyi birlikte çalışanlar',
    intro:
      'Anlaşmazlık Dönüştürme Topluluğu, çatışma ve kopukluk anlarında Şiddetsiz İletişim temelli arabuluculuk yaklaşımlarını birlikte çalıştığımız bir alandır. Üyeler kendi deneyimlerini paylaşır, vaka çalışmalarıyla pratik yapar ve birbirini destekler.',
    forWhom: [
      'Anlaşmazlık Dönüştürme programına ilgi duyanlar',
      'Arabuluculuk ve çatışma dönüşümü pratiği yapmak isteyenler',
      'NVC temelli yaklaşımı derinleştirmek isteyenler',
    ],
    activities: [
      'Vaka çalışmaları ve canlı pratik',
      'Deneyim paylaşımı ve akran desteği',
      'Anlaşmazlık dönüştürme araçlarının birlikte uygulanması',
    ],
    relatedProgram: { slug: 'anlasmazlik-donusturme', title: 'Anlaşmazlık Dönüştürme Programı' },
    externalDomain: 'anlasmazlikdonusturme.com',
    joinUrl: null,
  },
];

export function getCommunity(slug: string): Community | undefined {
  return communities.find((c) => c.slug === slug);
}

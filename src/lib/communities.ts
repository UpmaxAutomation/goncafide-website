import type { Lang } from '../i18n/ui';

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
   * Leave `null` until the platform is ready — the page then shows an email
   * waitlist form. Drop a URL here and the page switches to a "join" button that
   * opens it. This is the single config point for the live forum.
   */
  joinUrl: string | null;
}

/**
 * Slugs are shared across languages — they identify the community, and the
 * English pages live at /en/community/<same-slug>. Only the prose differs.
 */
const tr: Community[] = [
  {
    slug: 'acemi-zurafa',
    name: 'Acemi Zürafa Topluluğu',
    tagline: 'Şiddetsiz İletişim’i ve Anahtar Ayrımları birlikte çalışanların alanı',
    intro:
      'Acemi Zürafa, Anahtar Ayrımlar’ın hayatta nerede karşımıza çıktığını birlikte fark ettiğimiz, NVC’yi daha akıcı konuşmak için düzenli pratik yaptığımız bir topluluktur. “Zürafa” NVC’de empati dilinin sembolüdür; “acemi” ise birlikte öğrenmeye, denemeye ve gelişmeye açık olmayı anlatır.',
    forWhom: [
      'Anahtar Ayrımlar Programını bitirmiş olanlar',
      'Öğrenmeye pratik yaparak devam etmek isteyenler',
    ],
    activities: [
      'Düzenli pratik buluşmaları',
      'Empati çalışmaları',
      'Üyeler arası destek ve deneyim paylaşımı',
    ],
    relatedProgram: { slug: 'anahtar-ayrimlar', title: 'Anahtar Ayrımlar Programı' },
    joinUrl: null,
  },
  {
    slug: 'anlasmazlik-donusturme',
    name: 'Anlaşmazlık Dönüştürme Topluluğu',
    tagline: 'Anlaşmazlığı bağlantıya dönüştürmeyi birlikte çalışanlar',
    intro:
      'Anlaşmazlık Dönüştürme Topluluğu, programı bitirenlerin kendi hızında buluşarak edindikleri becerileri taze tuttukları bir alan sunar. Üyeler kendi deneyimlerini paylaşır, vaka çalışmalarıyla pratik yapar ve birbirini destekler.',
    forWhom: [
      'Anlaşmazlık Dönüştürme Programını bitirmiş olanlar',
      'Pratik yaparak öğrenmeye devam etmek isteyenler',
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

const en: Community[] = [
  {
    slug: 'acemi-zurafa',
    name: 'Clumsy Giraffe Community',
    tagline: 'A space for those working through Nonviolent Communication and the Key Differentiations together',
    intro:
      'The Clumsy Giraffe (Acemi Zürafa) is a community where we notice together where the Key Differentiations meet us in life, and where we practise regularly in order to speak NVC more fluently. In NVC the giraffe is the symbol of the language of empathy; being clumsy speaks to staying open to learning, trying and growing together.',
    forWhom: [
      'Those who have completed the Key Differentiations Programme',
      'Those who want to keep learning through practice',
    ],
    activities: [
      'Regular practice meetings',
      'Empathy work',
      'Support and shared experience among members',
    ],
    relatedProgram: { slug: 'anahtar-ayrimlar', title: 'Key Differentiations Programme' },
    joinUrl: null,
  },
  {
    slug: 'anlasmazlik-donusturme',
    name: 'Conflict Transformation Community',
    tagline: 'Those working together on turning disagreement into connection',
    intro:
      'The Conflict Transformation Community offers a space where those who have completed the programme meet at their own pace and keep the skills they gained alive. Members share their own experience, practise through case work, and support one another.',
    forWhom: [
      'Those who have completed the Conflict Transformation Programme',
      'Those who want to keep learning through practice',
    ],
    activities: [
      'Case work and live practice',
      'Shared experience and peer support',
      'Applying the tools of conflict transformation together',
    ],
    relatedProgram: { slug: 'anlasmazlik-donusturme', title: 'Conflict Transformation Programme' },
    externalDomain: 'anlasmazlikdonusturme.com',
    joinUrl: null,
  },
];

export const communitiesByLang: Record<Lang, Community[]> = { tr, en };

/** Turkish list, kept as the default export shape for existing callers. */
export const communities = tr;

export function getCommunities(lang: Lang): Community[] {
  return communitiesByLang[lang];
}

export function getCommunity(slug: string, lang: Lang = 'tr'): Community | undefined {
  return communitiesByLang[lang].find((c) => c.slug === slug);
}

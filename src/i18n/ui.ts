/**
 * Bilingual site plumbing — Turkish is the default and keeps the bare URLs
 * ("/hakkimda"); English lives under "/en/" with its own readable slugs
 * ("/en/about") rather than mirroring the Turkish ones, so each language gets
 * URLs a reader of that language can make sense of.
 *
 * `pagePairs` is the single source of truth linking the two: the language
 * switcher and the hreflang tags both read from it, so a page can never
 * advertise an alternate that does not exist.
 */

export const languages = {
  tr: 'Türkçe',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'tr';

/** Every page that exists in both languages, as [Turkish, English]. */
export const pagePairs: ReadonlyArray<readonly [string, string]> = [
  ['/', '/en/'],
  ['/nvc-nedir', '/en/what-is-nvc'],
  ['/hakkimda', '/en/about'],
  ['/programlar', '/en/programs'],
  ['/topluluk', '/en/community'],
  ['/etkinlikler', '/en/events'],
  ['/blog', '/en/blog'],
  ['/sss', '/en/faq'],
  ['/iletisim', '/en/contact'],
  ['/kurumsal', '/en/for-organizations'],
  ['/tesekkurler', '/en/thank-you'],
] as const;

/** Nav order is shared; only the labels and hrefs differ. */
export const nav: Record<Lang, ReadonlyArray<{ href: string; label: string }>> = {
  tr: [
    { href: '/nvc-nedir', label: 'NVC Nedir?' },
    { href: '/hakkimda', label: 'Hakkımda' },
    { href: '/programlar', label: 'Sunduklarım' },
    { href: '/topluluk', label: 'Topluluk' },
    { href: '/etkinlikler', label: 'Etkinlikler' },
    { href: '/blog', label: 'Blog' },
    { href: '/sss', label: 'SSS' },
  ],
  en: [
    { href: '/en/what-is-nvc', label: 'What is NVC?' },
    { href: '/en/about', label: 'About' },
    { href: '/en/programs', label: 'Offerings' },
    { href: '/en/community', label: 'Community' },
    { href: '/en/events', label: 'Events' },
    { href: '/en/blog', label: 'Blog' },
    { href: '/en/faq', label: 'FAQ' },
  ],
};

/** Mobile menu lists every destination, including home and contact. */
export const navFull: Record<Lang, ReadonlyArray<{ href: string; label: string }>> = {
  tr: [
    { href: '/', label: 'Ana Sayfa' },
    ...nav.tr,
    { href: '/iletisim', label: 'İletişim' },
  ],
  en: [
    { href: '/en/', label: 'Home' },
    ...nav.en,
    { href: '/en/contact', label: 'Contact' },
  ],
};

/**
 * Section roots. Detail slugs (a programme, a post) stay identical in both
 * languages — they are names, not prose — so only the section changes.
 */
export const section: Record<Lang, Record<'programs' | 'community' | 'blog' | 'events', string>> = {
  tr: { programs: '/programlar', community: '/topluluk', blog: '/blog', events: '/etkinlikler' },
  en: { programs: '/en/programs', community: '/en/community', blog: '/en/blog', events: '/en/events' },
};

/** Footer quick links. English names are flagged in GLOSSARY.md for review. */
export const programLinks: Record<Lang, ReadonlyArray<{ slug: string; label: string }>> = {
  tr: [
    { slug: 'anda-kal-canda-kal', label: 'Anda Kal Canda Kal' },
    { slug: 'anahtar-ayrimlar', label: 'Anahtar Ayrımlar' },
    { slug: 'anlasmazlik-donusturme', label: 'Anlaşmazlık Dönüştürme' },
    { slug: 'empatik-kocluk', label: 'Empatik Koçluk' },
    { slug: 'mentorluk-programi', label: 'Mentörlük' },
  ],
  en: [
    { slug: 'anda-kal-canda-kal', label: 'Anda Kal Canda Kal' },
    { slug: 'anahtar-ayrimlar', label: 'Key Differentiations' },
    { slug: 'anlasmazlik-donusturme', label: 'Conflict Transformation' },
    { slug: 'empatik-kocluk', label: 'Empathic Coaching' },
    { slug: 'mentorluk-programi', label: 'Mentoring' },
  ],
};

/**
 * Interface strings. Content lives in the collections; this covers the chrome
 * around it — buttons, labels, empty states, form copy.
 */
export const ui = {
  tr: {
    'nav.aria': 'Ana navigasyon',
    'nav.cta': 'İletişime Geç',
    'nav.open': 'Menüyü aç',
    'nav.close': 'Menüyü kapat',
    'lang.switch': 'Switch to English',
    'lang.label': 'Dil',
    'nav.menu': 'Navigasyon menüsü',
    'brand.slogan': 'birbirine bağlar güçlendirir',

    'events.title': 'Etkinlikler',
    'events.heading': 'Yaklaşan atölyeler',
    'events.intro':
      'Yeni dönem grup programları ve tek oturumluk seminerlerin tarihlerini burada paylaşıyorum.',
    'events.enroll': 'Kayıt',
    'events.info': 'Bilgi al',
    'events.video': 'Tanıtım Videosu',
    'events.poster': 'afişini büyüt',
    'events.empty.heading': 'Şu an planlanmış bir tarih yok',
    'events.empty.body':
      'Yeni dönem atölyeleri açıldığında ilk siz haberdar olun. Bültene katılın ya da doğrudan yazın — size uygun bir grup oluştuğunda haber vereyim.',
    'events.empty.contact': 'İletişime Geç',
    'events.empty.programs': 'Programları İncele',

    'form.name': 'Adınız',
    'form.email': 'E-posta',
    'form.message': 'Mesajınız',
    'form.submit': 'Mesajı Gönder',
    'form.sending': 'Gönderiliyor…',
    'form.required': 'zorunlu',
    'form.ok': 'Teşekkürler! Mesajınız ulaştı. En kısa sürede geri döneceğim.',
    'form.error':
      'Bir sorun oluştu. Lütfen tekrar deneyin ya da info@goncafide.com adresine yazın.',

    'footer.newsletter': 'Yeni programlardan ilk sen haber al.',
    'footer.subscribe': 'Kayıt Ol',
    'footer.eyebrow': 'Duyurulardan Haberdar Ol',
    'footer.formAria': 'Bülten kaydı formu',
    'footer.honeypot': 'Bunu doldurmayın:',
    'footer.emailLabel': 'E-posta adresiniz',
    'footer.pages': 'Sayfalar',
    'footer.programs': 'Programlar',
    'footer.rights': 'Tüm hakları saklıdır.',
    'footer.tagline': 'Şiddetsiz İletişim · Empati · Dönüşüm',
    'contact.mail': 'E-posta gönderin',
  },
  en: {
    'nav.aria': 'Main navigation',
    'nav.cta': 'Get in touch',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'lang.switch': "Türkçe'ye geç",
    'lang.label': 'Language',
    'nav.menu': 'Navigation menu',
    // Brand line. Gonca's call whether English keeps the Turkish original.
    'brand.slogan': 'connects and strengthens',

    'events.title': 'Events',
    'events.heading': 'Upcoming workshops',
    'events.intro':
      'Dates for new group programmes and single-session seminars are posted here.',
    'events.enroll': 'Register',
    'events.info': 'Enquire',
    'events.video': 'Introduction',
    'events.poster': 'poster, view full size',
    'events.empty.heading': 'No dates scheduled just now',
    'events.empty.body':
      'Be the first to hear when a new round opens. Join the newsletter or write to me directly — I will let you know as soon as a suitable group forms.',
    'events.empty.contact': 'Get in touch',
    'events.empty.programs': 'Browse the programmes',

    'form.name': 'Your name',
    'form.email': 'Email',
    'form.message': 'Your message',
    'form.submit': 'Send message',
    'form.sending': 'Sending…',
    'form.required': 'required',
    'form.ok': 'Thank you — your message reached me. I will get back to you shortly.',
    'form.error':
      'Something went wrong. Please try again, or write to info@goncafide.com.',

    'footer.newsletter': 'Be first to hear about new programmes.',
    'footer.subscribe': 'Subscribe',
    'footer.eyebrow': 'Stay in the loop',
    'footer.formAria': 'Newsletter signup form',
    'footer.honeypot': 'Please leave this empty:',
    'footer.emailLabel': 'Your email address',
    'footer.pages': 'Pages',
    'footer.programs': 'Programmes',
    'footer.rights': 'All rights reserved.',
    'footer.tagline': 'Nonviolent Communication · Empathy · Transformation',
    'contact.mail': 'Send an email',
  },
} as const;

/** Read the active language off the URL. Anything outside /en/ is Turkish. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : defaultLang;
}

/** Translator bound to one language, falling back to Turkish for gaps. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)['tr']): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}

/** Trailing slashes vary by how a link was written; compare without them. */
function normalise(path: string): string {
  return path.length > 1 ? path.replace(/\/$/, '') : path;
}

/**
 * The same page in the other language, or null when it has no counterpart —
 * in which case the switcher points at that language's home page rather than
 * sending the reader to a 404.
 */
export function getAlternate(pathname: string, to: Lang): string | null {
  const here = normalise(pathname);
  for (const [tr, en] of pagePairs) {
    if (normalise(tr) === here) return to === 'en' ? en : tr;
    if (normalise(en) === here) return to === 'en' ? en : tr;
  }
  return null;
}

/** Home page for a language — the switcher's fallback. */
export function homeFor(lang: Lang): string {
  return lang === 'en' ? '/en/' : '/';
}

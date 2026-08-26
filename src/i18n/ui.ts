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
    'events.metaDescription':
      'Gonca Fide ile yaklaşan Şiddetsiz İletişim atölyeleri ve seminerleri. Yeni dönem tarihleri ve kayıt bilgileri.',
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

    'post.ctaEyebrow': 'Programa Kaydol',
    'post.ctaHeading': 'NVC yolculuğuna başlamaya hazır mısınız?',
    'post.ctaIntro': 'Başlangıç programından ileri seviye seanslarına, size uygun bir yol var.',
    'post.ctaButton': 'Programlara Bak',
    'post.authorEyebrow': 'Yazar Hakkında',
    'post.more': 'Daha fazla bilgi',
    'post.authorBio': 'CNVC Sertifikalı Şiddetsiz İletişim Eğitmeni. 1000+ saat NVC eğitimi almış, 900+ saat eğitim vermiş.',

    'trust.eyebrow': 'Neden Gonca Fide?',
    'trust.heading': 'Güvenle öğrenebileceğiniz bir alan',
    'trust.certified': 'Sertifikalı Eğitmen',
    'trust.certifiedDetail': '2022\u2019den beri (Center for Nonviolent Communication)',
    'trust.hours': 'saat NVC eğitimi',
    'trust.hoursDetail': 'Liv Larsson, Katarina Hoffman, Miki Kashtan ve CNVC eğitmenlerinden',
    'trust.degree': 'Sosyoloji mezunu',
    'trust.degreeDetail': 'Orta Doğu Teknik Üniversitesi',
    'trust.member': 'Dernek üyeliği',
    'trust.memberDetail': 'Şiddetsiz İletişim Türkiye Derneği',
    'testimonials.eyebrow': 'Katılımcı Deneyimleri',
    'testimonials.heading': 'Dönüşüm hikayeleri',
    'teaser.eyebrow': 'Programlar',
    'teaser.heading1': 'Sizi bekleyen',
    'teaser.heading2': 'dönüşüm yolculukları',

    'pillars.eyebrow': 'Şiddetsiz İletişim',
    'pillars.heading': 'Dört adımda daha derin bir bağ',
    'pillars.intro': 'Marshall Rosenberg tarafından geliştirilen NVC modeli, empatiyi merkeze alır ve iletişimi dönüştürür.',
    'services.eyebrow': 'Sunduklarım',
    'services.heading1': 'Hangi alanda',
    'services.heading2': 'destek istiyorsunuz?',
    'homecta.eyebrow': 'Başlamaya hazır mısınız?',
    'homecta.h1': 'Şiddetsiz İletişim',
    'homecta.h2': 'yolculuğunuza',
    'homecta.h3': 'başlayın',
    'homecta.intro': 'Size en uygun programı bulmak için iletişime geçin. Tüm sorularınızı yanıtlamaktan mutluluk duyarım.',
    'homecta.contact': 'Bana Ulaşın',
    'homecta.programs': 'Programlara Bak',

    'home.title': 'Gonca Fide — Şiddetsiz İletişim Eğitmeni',
    'home.metaDescription': 'Gonca Fide, CNVC Sertifikalı Şiddetsiz İletişim (NVC) Eğitmeni. Online NVC kursları, empati koçluğu ve anlaşmazlık dönüştürme seansları. 1500+ saat deneyim.',
    'hero.eyebrow': 'CNVC Sertifikalı Eğitmen',
    'hero.h1a': 'Şiddetsiz',
    'hero.h1b': 'İletişim Eğitmeni',
    'hero.intro': 'Kendimizle ve başkalarıyla daha derin bir bağ kurmak için NVC araçlarını öğrenin. 1500+ saat eğitim deneyimiyle online gruplar ve bireysel seanslar.',
    'hero.ctaPrograms': 'Programları Keşfet',
    'hero.ctaNvc': 'NVC Nedir?',
    'hero.statHours': 'saat NVC eğitimi',
    'hero.statTrainer': 'Sertifikalı Eğitmen',
    'hero.statMember': 'Dernek üyesi',
    'hero.since': '2022\u2019den beri',
    'hero.photoAlt': 'Gonca Fide — CNVC Sertifikalı Şiddetsiz İletişim Eğitmeni',

    'blog.title': 'Blog',
    'blog.metaDescription': 'Şiddetsiz İletişim, empati, ilişkiler ve iç dünya üzerine yazılar. Gonca Fide\u2019nin NVC blog yazıları.',
    'blog.heading': 'Yazılar',
    'blog.empty': 'Yakında yazılar gelecek…',

    'community.forWhom': 'Kimler için?',
    'community.activities': 'Neler yapıyoruz?',
    'community.apply': 'Başvuru',
    'community.applyForm': 'Programı bitirenler için başvuru formu',
    'community.join': 'Topluluğa katılın',
    'community.related': 'İlgili program:',
    'community.breadcrumbHome': 'Ana Sayfa',
    'community.breadcrumb': 'Topluluk',

    'community.title': 'Topluluklar',
    'community.metaDescription': 'Gonca Fide ile Şiddetsiz İletişim topluluklarını keşfedin: Acemi Zürafa Topluluğu ve Anlaşmazlık Dönüştürme Topluluğu. Birlikte pratik yapın, üyelerle bağlantı kurun.',
    'community.heading': 'Birlikte güçleniyoruz',
    'community.intro': 'Anahtar Ayrımlar Programını bitirenlerin oluşturduğu Acemi Zürafa Topluluğu\u2019nda programda öğrenilenler mezunlarla tekrar ediliyor ve NVC bu şekilde içselleştiriliyor. Anlaşmazlık Dönüştürme Topluluğu ise programı bitirenlerin kendi hızında buluşarak edindikleri becerileri taze tuttukları bir alan sunuyor. Bu programları bitirdiğinizde ilgili programa ait topluluğun doğal üyesi olursunuz.',

    'programs.title': 'Sunduklarım',
    'programs.metaDescription': 'Gonca Fide’nin Şiddetsiz İletişim programları: başlangıçtan ileri seviyeye grup kursları, tematik seminerler ve bireysel seanslar. Online NVC eğitimleri.',
    'programs.heading1': 'NVC yolculuğunuzu',
    'programs.heading2': 'seçin',
    'programs.intro': 'Her seviye ve ihtiyaç için bir alan var: başlangıçtan ileri seviyeye grup programları, tek oturumluk tematik seminerler ve bire bir seanslar.',
    'programs.pathLabel': 'Önerilen yolculuk:',
    'programs.path': 'Anda Kal Canda Kal → Anahtar Ayrımlar → Anlaşmazlık Dönüştürme → Belirli Konularda Güçlenme',
    'programs.levelSuffix': 'Seviye',
    'programs.seminarsEyebrow': 'Belirli Konularda Güçlenme',
    'programs.seminarsHeading': 'Tek oturumluk tematik güçlenme atölyeleri',
    'programs.seminarsIntro': 'Kıyas, küsmek ve mizah gibi belirli bir temayı NVC merceğiyle ele alan, tek seanslık buluşmalar.',
    'programs.corpHeading': 'Kurumunuz için özel tasarım',
    'programs.corpIntro': 'Ekipler ve organizasyonlar için ihtiyaca göre tasarlanmış NVC eğitimleri.',
    'programs.corpCta': 'Kurumsal Eğitimler',
    'programs.ctaHeading': 'Hangi program size uygun?',
    'programs.ctaIntro': 'Bir programı seçmekte zorlanıyorsanız, birlikte konuşabiliriz.',

    'prog.video': 'Tanıtım Videosu',
    'prog.enroll': 'Kayıt',
    'prog.enrollCta': 'Kayıt İçin İletişime Geç',
    'prog.level': 'Seviye',
    'prog.format': 'Format',
    'prog.duration': 'Süre',
    'prog.hours': 'saat',
    'prog.all': 'Tüm programlar',
    'prog.metaSuffix': 'seviye',

    'cjoin.aria': 'katılım formu',
    'cjoin.optional': '(opsiyonel)',
    'cjoin.messagePh': 'NVC deneyiminiz ya da neden katılmak istediğiniz…',
    'cjoin.submit': 'Katılmak istiyorum',
    'cjoin.ok': 'Teşekkürler! Kaydınızı aldım. Topluluk açıldığında size haber vereceğim.',

    'form.namePh': 'Adınız Soyadınız',
    'form.emailPh': 'ornek@email.com',
    'form.program': 'İlgilendiğiniz program',
    'form.programNone': 'Program seçin (opsiyonel)',
    'form.programOther': 'Diğer / Genel bilgi',
    'form.messagePh': 'Merhaba, hakkında bilgi almak istiyorum...',
    'form.aria': 'İletişim formu',
    'form.honeypot': 'Bunu doldurmayın:',
    'contact.title': 'İletişim',
    'contact.metaDescription': 'Gonca Fide ile iletişime geçin. NVC programları, empati koçluğu ve bireysel seanslar hakkında bilgi alabilirsiniz.',
    'contact.heading': 'İletişime Geçin',
    'contact.intro': 'Program kaydı, bireysel seans veya herhangi bir soru için mesaj gönderin. En kısa sürede geri döneceğim.',
    'contact.channels': 'Diğer Kanallar',
    'contact.emailLabel': 'E-posta',
    'contact.location': 'Konum',
    'contact.locationValue': 'Ankara · Online',
    'contact.replyTime': 'iş günü',
    'contact.replyNote': 'Mesajlara genellikle',
    'contact.replyNoteEnd': 'içinde yanıt veriyorum.',

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
    'events.metaDescription':
      'Upcoming Nonviolent Communication workshops and seminars with Gonca Fide. Dates for new rounds, and how to register.',
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

    'post.ctaEyebrow': 'Join a programme',
    'post.ctaHeading': 'Ready to begin your NVC journey?',
    'post.ctaIntro': 'From the introductory programme through to advanced sessions, there is a path that fits.',
    'post.ctaButton': 'See the programmes',
    'post.authorEyebrow': 'About the author',
    'post.more': 'Read more',
    'post.authorBio': 'CNVC Certified Nonviolent Communication Trainer. Over 1000 hours of NVC training received, and more than 900 hours taught.',

    'trust.eyebrow': 'Why Gonca Fide?',
    'trust.heading': 'A place you can learn in safely',
    'trust.certified': 'Certified Trainer',
    'trust.certifiedDetail': 'Since 2022 (Center for Nonviolent Communication)',
    'trust.hours': 'hours of NVC training',
    'trust.hoursDetail': 'With Liv Larsson, Katarina Hoffman, Miki Kashtan and CNVC trainers',
    'trust.degree': 'Sociology graduate',
    'trust.degreeDetail': 'Middle East Technical University (METU)',
    'trust.member': 'Association member',
    'trust.memberDetail': 'Nonviolent Communication Association of Turkey',
    'testimonials.eyebrow': 'Participant experiences',
    'testimonials.heading': 'Stories of change',
    'teaser.eyebrow': 'Programmes',
    'teaser.heading1': 'The journeys of change',
    'teaser.heading2': 'waiting for you',

    'pillars.eyebrow': 'Nonviolent Communication',
    'pillars.heading': 'A deeper connection, in four steps',
    'pillars.intro': 'Developed by Marshall Rosenberg, the NVC model puts empathy at the centre and transforms how we communicate.',
    'services.eyebrow': 'Offerings',
    'services.heading1': 'Where would you like',
    'services.heading2': 'support?',
    'homecta.eyebrow': 'Ready to begin?',
    'homecta.h1': 'Begin your',
    'homecta.h2': 'Nonviolent Communication',
    'homecta.h3': 'journey',
    'homecta.intro': 'Get in touch and we will find the programme that suits you. I am glad to answer any question you have.',
    'homecta.contact': 'Write to me',
    'homecta.programs': 'See the programmes',

    'home.title': 'Gonca Fide — Nonviolent Communication Trainer',
    'home.metaDescription': 'Gonca Fide, CNVC Certified Nonviolent Communication (NVC) Trainer. Online NVC courses, empathic coaching and conflict transformation sessions. Over 1500 hours of experience.',
    'hero.eyebrow': 'CNVC Certified Trainer',
    'hero.h1a': 'Nonviolent',
    'hero.h1b': 'Communication Trainer',
    'hero.intro': 'Learn the tools of NVC for a deeper connection with yourself and with others. Online groups and one-to-one sessions, drawing on over 1500 hours of training experience.',
    'hero.ctaPrograms': 'Explore the programmes',
    'hero.ctaNvc': 'What is NVC?',
    'hero.statHours': 'hours of NVC training',
    'hero.statTrainer': 'Certified Trainer',
    'hero.statMember': 'Association member',
    'hero.since': 'since 2022',
    'hero.photoAlt': 'Gonca Fide — CNVC Certified Nonviolent Communication Trainer',

    'blog.title': 'Blog',
    'blog.metaDescription': 'Writing on Nonviolent Communication, empathy, relationships and the inner world. Gonca Fide\u2019s NVC blog.',
    'blog.heading': 'Writing',
    'blog.empty': 'Posts are on their way…',

    'community.forWhom': 'Who is it for?',
    'community.activities': 'What do we do?',
    'community.apply': 'Apply',
    'community.applyForm': 'Application form for those who completed the programme',
    'community.join': 'Join the community',
    'community.related': 'Related programme:',
    'community.breadcrumbHome': 'Home',
    'community.breadcrumb': 'Community',

    'community.title': 'Communities',
    'community.metaDescription': 'Discover the Nonviolent Communication communities around Gonca Fide: the Acemi Zürafa community and the Conflict Transformation community. Practise together and connect with other members.',
    'community.heading': 'We grow stronger together',
    'community.intro': 'In the Acemi Zürafa community, formed by those who have completed the Key Differentiations Programme, what was learned is revisited among graduates — and that is how NVC settles in. The Conflict Transformation community offers a space where those who finished that programme meet at their own pace and keep their skills alive. On completing either programme you become a natural member of its community.',

    'programs.title': 'Offerings',
    'programs.metaDescription': 'Gonca Fide\u2019s Nonviolent Communication programmes: group courses from beginner to advanced, thematic seminars and one-to-one sessions. Online NVC training.',
    'programs.heading1': 'Choose your',
    'programs.heading2': 'NVC journey',
    'programs.intro': 'There is a space for every level and every need: group programmes from beginner to advanced, single-session thematic seminars, and one-to-one work.',
    'programs.pathLabel': 'Suggested path:',
    'programs.path': 'Anda Kal Canda Kal → Key Differentiations → Conflict Transformation → Thematic deepening',
    'programs.levelSuffix': 'level',
    'programs.seminarsEyebrow': 'Going deeper on a theme',
    'programs.seminarsHeading': 'Single-session thematic workshops',
    'programs.seminarsIntro': 'Single meetings that take up one theme — comparison, withdrawing into silence, humour — through the lens of NVC.',
    'programs.corpHeading': 'Designed for your organisation',
    'programs.corpIntro': 'NVC training shaped around what teams and organisations actually need.',
    'programs.corpCta': 'For organisations',
    'programs.ctaHeading': 'Which programme is right for you?',
    'programs.ctaIntro': 'If choosing between them feels hard, we can talk it through together.',

    'prog.video': 'Introduction',
    'prog.enroll': 'Register',
    'prog.enrollCta': 'Get in touch to register',
    'prog.level': 'Level',
    'prog.format': 'Format',
    'prog.duration': 'Length',
    'prog.hours': 'hours',
    'prog.all': 'All programmes',
    'prog.metaSuffix': 'level',

    'cjoin.aria': 'join form',
    'cjoin.optional': '(optional)',
    'cjoin.messagePh': 'Your experience with NVC, or why you would like to join…',
    'cjoin.submit': 'I would like to join',
    'cjoin.ok': 'Thank you — I have your details. I will let you know when the community opens.',

    'form.namePh': 'Your full name',
    'form.emailPh': 'you@example.com',
    'form.program': 'Programme you are interested in',
    'form.programNone': 'Choose a programme (optional)',
    'form.programOther': 'Something else / general enquiry',
    'form.messagePh': 'Hello, I would like to know more about…',
    'form.aria': 'Contact form',
    'form.honeypot': 'Please leave this empty:',
    'contact.title': 'Contact',
    'contact.metaDescription': 'Get in touch with Gonca Fide. Ask about NVC programmes, empathic coaching and one-to-one sessions.',
    'contact.heading': 'Get in touch',
    'contact.intro': 'Write with a registration, a session enquiry, or any question at all. I will get back to you shortly.',
    'contact.channels': 'Other channels',
    'contact.emailLabel': 'Email',
    'contact.location': 'Location',
    'contact.locationValue': 'Ankara · Online',
    'contact.replyTime': 'working days',
    'contact.replyNote': 'I usually reply within',
    'contact.replyNoteEnd': '.',

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

/**
 * Level and format are schema enums stored in Turkish — they are keys, not
 * prose — so English content files keep the Turkish value and it is translated
 * here at render time.
 */
const LEVEL_EN: Record<string, string> = {
  'Başlangıç': 'Beginner',
  'Orta': 'Intermediate',
  'Orta-İleri': 'Upper-intermediate',
  'İleri': 'Advanced',
  'Tüm Seviyeler': 'All levels',
};

const FORMAT_EN: Record<string, string> = {
  'Online Grup': 'Online group',
  'Yüz Yüze': 'In person',
  'Hibrit': 'Hybrid',
  'Bireysel (1:1)': 'One to one',
};

export function levelLabel(value: string, lang: Lang): string {
  return lang === 'en' ? (LEVEL_EN[value] ?? value) : value;
}

export function formatLabel(value: string, lang: Lang): string {
  return lang === 'en' ? (FORMAT_EN[value] ?? value) : value;
}

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

/**
 * Content collections hold both languages: English entries live in an `en/`
 * subfolder, so their id is prefixed. These two helpers are how pages pick the
 * right set and recover the shared slug.
 */
export function entriesFor<T extends { id: string }>(entries: T[], lang: Lang): T[] {
  const wantEnglish = lang === 'en';
  return entries.filter((e) => e.id.startsWith('en/') === wantEnglish);
}

/** Slug without the language folder — identical across languages by design. */
export function slugOf(id: string): string {
  return id.replace(/^en\//, '');
}

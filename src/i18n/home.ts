/**
 * Structured home-page content, per language.
 *
 * These live here rather than inside the components so the two languages sit
 * side by side and stay in step — and so the components keep only presentation
 * concerns (icons, colours, layout).
 */
import type { Lang } from './ui';

export interface Pillar {
  number: string;
  label: string;
  description: string;
  color: string;
}

const COLORS = [
  'var(--color-plum-500)',
  'var(--color-plum-600)',
  'var(--color-orchid-500)',
  'var(--color-plum-700)',
];

/** The four components of NVC. Terms follow GLOSSARY.md. */
export const pillars: Record<Lang, Pillar[]> = {
  tr: [
    { number: '01', label: 'Gözlem', description: 'Değerlendirme yapmadan gözlemlediğimizi somut biçimde ifade ederiz.', color: COLORS[0] },
    { number: '02', label: 'Duygu', description: 'Gözlemimizle ilişkili olarak ne hissettiğimizi fark ederiz.', color: COLORS[1] },
    { number: '03', label: 'İhtiyaç', description: 'Duygularımıza zemin olan ihtiyaçları, değerleri, arzuları ortaya koyarız.', color: COLORS[2] },
    { number: '04', label: 'Rica', description: 'Hayatımızı zenginleştirecek eylemleri net biçimde dile getiririz.', color: COLORS[3] },
  ],
  en: [
    { number: '01', label: 'Observation', description: 'We state concretely what we observe, without mixing in evaluation.', color: COLORS[0] },
    { number: '02', label: 'Feeling', description: 'We notice what we feel in relation to what we observed.', color: COLORS[1] },
    { number: '03', label: 'Need', description: 'We name the needs, values and longings underneath those feelings.', color: COLORS[2] },
    { number: '04', label: 'Request', description: 'We ask clearly for the actions that would enrich our lives.', color: COLORS[3] },
  ],
};

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export const services: Record<Lang, Service[]> = {
  tr: [
    { icon: 'sprout', title: 'Şiddetsiz İletişim\'e Giriş', description: 'NVC\'nin temel kavramlarını, 4 adımını ve günlük hayatta nasıl uygulanacağını keşfedersiniz.' },
    { icon: 'layers', title: 'Belirli Konularda Güçlenme', description: 'Kıyas, küsmek ve mizah gibi belirli temaları NVC merceğiyle ele alan tematik çalışmalar.' },
    { icon: 'key', title: 'Anahtar Ayrımlar', description: 'Liv Larsson ve Katarina Hoffman\'ın 54 anahtar ayrımıyla NVC anlayışınızı ileri seviyeye taşırsınız.' },
    { icon: 'heart', title: 'Empati Koçluğu', description: 'Bireysel seanslarda empatik varlık pratiği yaparak kendi iç sesinizi daha net duyarsınız.' },
    { icon: 'bridge', title: 'Anlaşmazlık Dönüştürme', description: 'NVC temelli arabuluculuk araçlarıyla çatışmaları dönüştürmeyi öğrenirsiniz.' },
    { icon: 'compass', title: 'Mentörlük', description: 'NVC pratisyenleri için özelleştirilmiş birebir mentörlük süreci.' },
  ],
  en: [
    { icon: 'sprout', title: 'Introduction to Nonviolent Communication', description: 'Discover the core concepts of NVC, its four steps, and how to put them to work in daily life.' },
    { icon: 'layers', title: 'Going deeper on a theme', description: 'Thematic work taking up one subject — comparison, withdrawing into silence, humour — through the lens of NVC.' },
    { icon: 'key', title: 'Key Differentiations', description: 'Take your understanding of NVC further through the 54 key differentiations of Liv Larsson and Katarina Hoffman.' },
    { icon: 'heart', title: 'Empathic Coaching', description: 'Practise empathic presence in one-to-one sessions and hear your own inner voice more clearly.' },
    { icon: 'bridge', title: 'Conflict Transformation', description: 'Learn to transform conflict with the tools of NVC-based mediation.' },
    { icon: 'compass', title: 'Mentoring', description: 'A one-to-one mentoring process shaped around NVC practitioners.' },
  ],
};

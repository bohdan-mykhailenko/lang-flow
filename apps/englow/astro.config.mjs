import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://englow.lang-flow.app',
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
  integrations: [
    starlight({
      title: 'Englow / Британська англійська',
      description:
        "English Learning, British Phonetics, & Strict Teacher's VIP Classroom for Настінька.",
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        uk: {
          label: 'Українська',
          lang: 'uk',
        },
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'The English Alphabet',
          translations: { uk: 'Англійський алфавіт' },
          items: [
            {
              label: 'Alphabet Explorer (A-Z)',
              translations: { uk: 'Інтерактивний алфавіт (A-Z)' },
              slug: 'index',
            },
          ],
        },
        {
          label: 'The VIP Classroom',
          translations: { uk: 'Приватний VIP Клас' },
          items: [
            {
              label: 'Strict Teacher & Настінька (Anasteysha)',
              translations: { uk: 'Суворий Вчитель і Настінька' },
              slug: 'classroom/overview',
            },
          ],
        },
        {
          label: 'Phonetics & Pronunciation Lab',
          translations: { uk: 'Фонетика та вимова' },
          items: [
            {
              label: 'The TH Sound & Consonants',
              translations: { uk: 'Звуки TH та приголосні' },
              slug: 'phonetics/th-and-consonants',
            },
            {
              label: 'British Vowels & Diphthongs',
              translations: { uk: 'Британські голосні та дифтонги' },
              slug: 'phonetics/vowels-and-diphthongs',
            },
          ],
        },
        {
          label: 'Core Grammar & Verbs',
          translations: { uk: 'Граматика та дієслова' },
          items: [
            {
              label: 'Essential Tenses (Present, Past, Future)',
              translations: {
                uk: 'Основні часи (Теперішній, Минулий, Майбутній)',
              },
              slug: 'grammar/essential-tenses',
            },
            {
              label: 'Irregular Verbs Mastery',
              translations: { uk: 'Таблиця неправильних дієслів' },
              slug: 'grammar/irregular-verbs',
            },
          ],
        },
      ],
      social: {
        github: 'https://github.com/bohdan-mykhailenko/lang-flow',
      },
      lastUpdated: true,
    }),
  ],
});

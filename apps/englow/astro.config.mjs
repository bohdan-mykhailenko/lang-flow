import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://englow.lang-flow.app',
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
  integrations: [
    starlight({
      title: 'Englow',
      description: 'American English & 1-on-1 Learning Portal.',
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
      head: [
        {
          tag: 'script',
          attrs: {
            src: '/scripts/floating-lang.js',
            defer: true,
          },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Team',
          translations: { uk: 'Команда' },
          slug: 'team',
        },
        {
          label: 'Alphabet',
          translations: { uk: 'Алфавіт' },
          slug: 'index',
        },
        {
          label: 'English Variations (US vs UK & World)',
          translations: { uk: 'Варіанти англійської (US vs UK та світ)' },
          slug: 'variations',
        },
        {
          label: 'Pronunciation',
          translations: { uk: 'Вимова' },
          items: [
            {
              label: 'IPA Atlas (All 44 Sounds)',
              translations: { uk: 'Атлас IPA (Усі 44 звуки)' },
              slug: 'phonetics/ipa-chart',
            },
            {
              label: 'Vowels & The Schwa',
              translations: { uk: 'Голосні та Шва /ə/' },
              slug: 'phonetics/vowels',
            },
            {
              label: 'Diphthongs & Glides',
              translations: { uk: 'Дифтонги та плавні звуки' },
              slug: 'phonetics/diphthongs',
            },
            {
              label: 'Consonants & Challenging Sounds',
              translations: { uk: 'Приголосні та підступні звуки' },
              slug: 'phonetics/consonants',
            },
            {
              label: 'Connected Speech & Rhythm',
              translations: { uk: "Зв'язне мовлення та ритм" },
              slug: 'phonetics/connected-speech',
            },
          ],
        },
        {
          label: 'Grammar',
          translations: { uk: 'Граматика' },
          items: [
            {
              label: 'Basic Tenses',
              translations: { uk: 'Основні часи' },
              slug: 'grammar/essential-tenses',
            },
            {
              label: 'Irregular Verbs',
              translations: { uk: 'Неправильні дієслова' },
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

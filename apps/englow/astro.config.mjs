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
          label: 'English Variations (US, UK, AU)',
          translations: { uk: 'Варіанти англійської (US, UK, AU)' },
          slug: 'variations',
        },
        {
          label: 'Pronunciation',
          translations: { uk: 'Вимова' },
          items: [
            {
              label: 'The TH Sound',
              translations: { uk: 'Звуки TH' },
              slug: 'phonetics/th-sound',
            },
            {
              label: 'Vowels & Sounds',
              translations: { uk: 'Голосні звуки' },
              slug: 'phonetics/vowels-and-diphthongs',
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

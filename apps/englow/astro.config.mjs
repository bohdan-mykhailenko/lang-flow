import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://englow.lang-flow.app',
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
  integrations: [
    {
      name: 'mermaid-client',
      hooks: {
        'astro:config:setup': ({ injectScript }) => {
          injectScript('page', `import "/src/scripts/mermaid.ts";`);
        },
      },
    },
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
          label: 'Variations',
          translations: { uk: 'Варіанти' },
          slug: 'variations',
        },
        {
          label: 'Pronunciation',
          translations: { uk: 'Вимова' },
          items: [
            {
              label: 'IPA Atlas',
              translations: { uk: 'Атлас IPA' },
              slug: 'phonetics/ipa-chart',
            },
            {
              label: 'Vowels & Schwa',
              translations: { uk: 'Голосні та Шва' },
              slug: 'phonetics/vowels',
            },
            {
              label: 'Diphthongs',
              translations: { uk: 'Дифтонги' },
              slug: 'phonetics/diphthongs',
            },
            {
              label: 'Consonants',
              translations: { uk: 'Приголосні' },
              slug: 'phonetics/consonants',
            },
            {
              label: 'Connected Speech',
              translations: { uk: "Зв'язне мовлення" },
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

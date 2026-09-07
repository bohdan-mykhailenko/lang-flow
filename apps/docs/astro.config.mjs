import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://grammar.lang-flow.app',
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
  integrations: [
    starlight({
      title: 'Българска граматика / Болгарська граматика',
      description:
        'Пълен справочник по българска граматика, звукова система, правопис и правоговор.',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Български',
          lang: 'bg',
        },
        uk: {
          label: 'Українська',
          lang: 'uk',
        },
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Азбука и звук',
          translations: { uk: 'Алфавіт і звук' },
          items: [
            {
              label: 'Българската азбука',
              translations: { uk: 'Болгарський алфавіт' },
              slug: 'index',
            },
          ],
        },
        {
          label: 'Фонетика и правоговор',
          translations: { uk: 'Фонетика та вимова' },
          items: [
            {
              label: 'Гласни звукове и редукция',
              translations: { uk: 'Голосні звуки та редукція' },
              slug: 'fonetika/glasni-i-reduktsiya',
            },
            {
              label: 'Съгласни и обеззвучаване',
              translations: { uk: 'Приголосні та знезвучнення' },
              slug: 'fonetika/saglasni-i-obezzvuchavane',
            },
            {
              label: 'Специфични букви: Ъ, Ь, Щ, Ю, Я',
              translations: { uk: 'Специфічні літери: Ъ, Ь, Щ, Ю, Я' },
              slug: 'fonetika/spetsifichni-bukvi',
            },
          ],
        },
        {
          label: 'Местоимения и морфология',
          translations: { uk: 'Займенники та морфологія' },
          items: [
            {
              label: 'Лични местоимения и глаголът „Съм“',
              translations: { uk: 'Особові займенники та дієслово „Съм“' },
              slug: 'morfologiya/mestoimeniya-i-sam',
            },
            {
              label: 'Пълен и кратък член (-ът / -я)',
              translations: { uk: 'Повний і короткий артикль (-ът / -я)' },
              slug: 'morfologiya/chlenuvane',
            },
            {
              label: 'Глаголни спрежения и вид',
              translations: { uk: 'Дієвідміни та види дієслів' },
              slug: 'morfologiya/glagoli',
            },
            {
              label: 'Основни правописни правила',
              translations: { uk: 'Основні правописні правила' },
              slug: 'morfologiya/pravopis',
            },
          ],
        },
        {
          label: 'Глаголна система и времена',
          translations: { uk: 'Дієслівна система та часи' },
          items: [
            {
              label: 'Най-употребяваните глаголи',
              translations: { uk: 'Найуживаніші дієслова на практиці' },
              slug: 'glagoli/osnovni-glagoli',
            },
            {
              label: 'Основни глаголни времена (Сегашно, Бъдеще, Минало)',
              translations: {
                uk: 'Основні часи (Теперішній, Майбутній, Минулий)',
              },
              slug: 'glagoli/vremena',
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

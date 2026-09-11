import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  HStack,
  VStack,
  Badge,
  Flex,
  Link,
  Input,
} from '@chakra-ui/react';
import { Volume2, BookOpen, ExternalLink, Search, X } from 'lucide-react';
import { TopicProgressionCard } from '@/components/TopicProgressionCard';
import {
  HighlightedWord,
  speakEnglishWord,
} from '@/components/HighlightedWord';
import { useColorModeValue } from '@/components/ui/color-mode';

export const meta = {
  title: 'Правила читання',
  folder: 'Основи',
  folderSlug: 'basics',
  pageSlug: 'reading-rules',
  path: '/basics/reading-rules',
};

// --- DATA STRUCTURES ---

interface ExampleWord {
  word: string; // contains {target} highlight
  ipa: string;
  ua?: string;
}

interface ReadingRuleItem {
  id: string;
  category:
    | 'syllables'
    | 'syllable-types'
    | 'vowels'
    | 'vowel-r'
    | 'vowel-digraphs'
    | 'consonants';
  title: string;
  soundIpa?: string;
  condition?: string;
  description: string;
  examples: ExampleWord[];
  notes?: string;
}

const readingRulesData: ReadingRuleItem[] = [
  // ==========================================
  // CATEGORY 1: SYLLABLES (Склади в англійській мові)
  // ==========================================
  {
    id: 'syl-definition',
    category: 'syllables',
    title: 'Складоподіл та голосні звуки',
    description:
      'Складом (syllable) називається звук чи звукосполучення, що вимовляються разом, одним поштовхом повітря. Кількість складів у слові відповідає кількості саме голосних звуків, а не букв.',
    examples: [
      { word: 'cat', ipa: '/kæt/', ua: '1 склад' },
      { word: 'take', ipa: '/teɪk/', ua: '1 склад (кінцева «e» німа)' },
      { word: 'car-rot', ipa: '/ˈkær.ət/', ua: '2 склади' },
      { word: 'im-por-tant', ipa: '/ɪmˈpɔː.tənt/', ua: '3 склади' },
      { word: 'syl-la-ble', ipa: '/ˈsɪl.ə.bəl/', ua: '3 склади' },
    ],
    notes:
      'Головну роль відіграють голосні: 6 букв передають понад 20 різних голосних звуків.',
  },
  {
    id: 'syl-silent-letters',
    category: 'syllables',
    title: 'Звуки проти букв: німі літери та злиття',
    description:
      'Під час поділу на склади враховують звуки: німі літери не утворюють складу, а подвійні голосні часто дають один звук.',
    examples: [
      {
        word: 'tak{e}',
        ipa: '/teɪk/',
        ua: '2 голосні букви, 1 звук -> 1 склад',
      },
      {
        word: 'fr{ee}',
        ipa: '/friː/',
        ua: '2 голосні букви, 1 довгий звук -> 1 склад',
      },
      {
        word: 'ch{ee}s{e}',
        ipa: '/tʃiːz/',
        ua: '3 голосні букви, 1 звук -> 1 склад',
      },
    ],
  },
  {
    id: 'syl-stress',
    category: 'syllables',
    title: 'Наголошені та ненаголошені склади',
    description:
      'Наголошений склад (stressed syllable) виділяється силою голосу та інтонацією. Ненаголошений (unstressed) вимовляється значно коротше, часто редукується до звука [ə].',
    examples: [
      { word: 'a-{bout}', ipa: '/əˈbaʊt/', ua: 'наголос на 2-й склад' },
      { word: '{eve}-ry', ipa: '/ˈev.ri/', ua: 'наголос на 1-й склад' },
      { word: 'mous-{tache}', ipa: '/məˈstɑːʃ/', ua: 'наголос на 2-й склад' },
      {
        word: '{em}-pha-size',
        ipa: '/ˈem.fə.saɪz/',
        ua: 'наголос на 1-й склад',
      },
      { word: 'ex-{am}-ple', ipa: '/ɪɡˈzɑːm.pəl/', ua: 'наголос на 2-й склад' },
    ],
  },
  {
    id: 'syl-meaning-stress',
    category: 'syllables',
    title: 'Смислорозрізнювальна роль наголосу',
    description:
      'Зміна наголосу між складами може повністю змінювати частину мови або значення слова (іменник на першому складі проти дієслова на другому).',
    examples: [
      {
        word: '{dis}-cus',
        ipa: '/ˈdɪs.kəs/',
        ua: 'диск, кидання диску (іменник)',
      },
      { word: 'dis-{cuss}', ipa: '/dɪˈskʌs/', ua: 'обговорювати (дієслово)' },
      {
        word: '{pres}-ent',
        ipa: '/ˈprez.ənt/',
        ua: 'подарунок, теперішній (іменник/прикм.)',
      },
      {
        word: 'pre-{sent}',
        ipa: '/prɪˈzent/',
        ua: 'представляти, вручати (дієслово)',
      },
    ],
  },

  // ==========================================
  // CATEGORY 2: 7 SYLLABLE TYPES (Види складів)
  // ==========================================
  {
    id: 'type-closed',
    category: 'syllable-types',
    title: '1. Закритий склад (Closed syllable)',
    condition: 'Склад закінчується на приголосний',
    description:
      "Складається з одного голосного звука та обов'язково закінчується на один або кілька приголосних. Голосна звучить коротко.",
    examples: [
      { word: '{i}n', ipa: '/ɪn/', ua: 'в' },
      { word: '{o}f', ipa: '/ɒv/', ua: 'з' },
      { word: 'h{i}t', ipa: '/hɪt/', ua: 'влучати' },
      { word: '{a}sk', ipa: '/ɑːsk/', ua: 'питати' },
      { word: '{e}lk', ipa: '/elk/', ua: 'лось' },
      { word: 'tw{e}lfth', ipa: '/twelfθ/', ua: 'дванадцятий' },
      { word: 'd{u}st', ipa: '/dʌst/', ua: 'пил' },
      { word: 'c{a}t', ipa: '/kæt/', ua: 'кіт' },
    ],
  },
  {
    id: 'type-open',
    category: 'syllable-types',
    title: '2. Відкритий склад (Open syllable)',
    condition: 'Склад закінчується на голосну',
    description:
      'Має один голосний звук на кінці або складається з однієї голосної. Голосна читається довго — так, як називається в алфавіті.',
    examples: [
      { word: '{I}', ipa: '/aɪ/', ua: 'я' },
      { word: '{a}', ipa: '/eɪ/', ua: 'артикль' },
      { word: 'n{o}', ipa: '/nəʊ/', ua: 'ні' },
      { word: 'm{y}', ipa: '/maɪ/', ua: 'мій' },
      { word: 'w{e}', ipa: '/wiː/', ua: 'ми' },
      { word: 'sh{e}', ipa: '/ʃiː/', ua: 'вона' },
      { word: 'tr{y}', ipa: '/traɪ/', ua: 'намагатися' },
      { word: 'cr{y}', ipa: '/kraɪ/', ua: 'плакати' },
    ],
  },
  {
    id: 'type-silent-e',
    category: 'syllable-types',
    title: '3. Склад з німою E (Silent-e syllable)',
    condition: 'Голосна + приголосна + німа e',
    description:
      'Кінцева «e» не вимовляється, але відкриває попередній склад: перший голосний звук вимовляється за назвою в алфавіті.',
    examples: [
      { word: '{a}te', ipa: '/eɪt/', ua: 'їв' },
      { word: '{i}ce', ipa: '/aɪs/', ua: 'лід' },
      { word: '{a}le', ipa: '/eɪl/', ua: 'ель' },
      { word: 't{a}ke', ipa: '/teɪk/', ua: 'брати' },
      { word: 'm{a}ke', ipa: '/meɪk/', ua: 'робити' },
      { word: 'th{e}se', ipa: '/ðiːz/', ua: 'ці' },
      { word: 't{i}me', ipa: '/taɪm/', ua: 'час' },
      { word: 't{u}ne', ipa: '/tjuːn/', ua: 'мелодія' },
      { word: 'str{o}ke', ipa: '/strəʊk/', ua: 'удар, погладжування' },
    ],
  },
  {
    id: 'type-vowel-comb',
    category: 'syllable-types',
    title: '4. Склад з поєднанням кількох голосних (Vowel team)',
    condition: 'Сполучення 2-3 голосних або голосної з напівголосною',
    description:
      'Дві або більше голосних букв стоять поруч і передають один злитий монофтонг або дифтонг.',
    examples: [
      { word: 'cl{ue}', ipa: '/kluː/', ua: 'підказка' },
      { word: 'tr{ue}', ipa: '/truː/', ua: 'правдивий' },
      { word: 'd{ay}', ipa: '/deɪ/', ua: 'день' },
      { word: 'v{ei}l', ipa: '/veɪl/', ua: 'вуаль' },
      { word: 'fr{ee}', ipa: '/friː/', ua: 'вільний' },
      { word: 'd{ie}', ipa: '/daɪ/', ua: 'помирати' },
      { word: 'n{oi}se', ipa: '/nɔɪz/', ua: 'шум' },
      { word: 'b{oy}', ipa: '/bɔɪ/', ua: 'хлопець' },
      { word: 'p{ie}ce', ipa: '/piːs/', ua: 'шматок' },
    ],
  },
  {
    id: 'type-vowel-r',
    category: 'syllable-types',
    title: '5. Склад з голосною + R (Vowel + R)',
    condition: 'Голосна + буква r (без наступної голосної)',
    description:
      'Літера «r» видовжує звучання попередньої голосної, а сама в британській вимові майже не вимовляється.',
    examples: [
      { word: '{o}r', ipa: '/ɔːr/', ua: 'або' },
      { word: 'c{a}r', ipa: '/kɑːr/', ua: 'автомобіль' },
      { word: 'b{a}r', ipa: '/bɑːr/', ua: 'бар' },
      { word: 'h{e}r', ipa: '/hɜːr/', ua: 'її' },
      { word: 't{e}rm', ipa: '/tɜːm/', ua: 'термін' },
      { word: 'f{i}rm', ipa: '/fɜːm/', ua: 'фірма, міцний' },
    ],
  },
  {
    id: 'type-vowel-re',
    category: 'syllable-types',
    title: '6. Склад з голосною + RE (Vowel + RE)',
    condition: 'Голосна + r + німа e',
    description:
      'У присутності німої «e» після «r» голосний звук розпадається на дифтонг або трифтонг із кінцевим [ə].',
    examples: [
      { word: 'm{o}re', ipa: '/mɔːr/', ua: 'більше' },
      { word: 'c{a}re', ipa: '/keər/', ua: 'турбота' },
      { word: '{i}re', ipa: '/aɪər/', ua: 'гнів' },
      { word: 'd{ee}r', ipa: '/dɪər/', ua: 'олень' },
      { word: '{ea}r', ipa: '/ɪər/', ua: 'вухо' },
      { word: 'p{ai}r', ipa: '/peər/', ua: 'пара' },
      { word: 'f{i}re', ipa: '/faɪər/', ua: 'вогонь' },
    ],
  },
  {
    id: 'type-consonant-le',
    category: 'syllable-types',
    title: '7. Склад з приголосною + LE (Consonant + LE)',
    condition: 'Кінцеве сполучення: -ble, -cle, -dle, -fle, -tle, -gle',
    description:
      'Зустрічається в словах з двома або більше складами. Ненаголошене закінчення, де буква «e» німа, а «l» стає складотворчою.',
    examples: [
      { word: 'a-{ble}', ipa: '/ˈeɪ.bəl/', ua: 'здатний' },
      { word: 'prof-it-a-{ble}', ipa: '/ˈprɒf.ɪ.tə.bəl/', ua: 'прибутковий' },
      { word: 'mir-a-{cle}', ipa: '/ˈmɪr.ə.kəl/', ua: 'диво' },
      { word: 'i-{dle}', ipa: '/ˈaɪ.dəl/', ua: 'бездіяльний' },
      { word: 'can-{dle}', ipa: '/ˈkæn.dəl/', ua: 'свічка' },
      { word: 'rif-{fle}', ipa: '/ˈrɪf.əl/', ua: 'хвиля на воді' },
      { word: 'bat-{tle}', ipa: '/ˈbæt.əl/', ua: 'битва' },
      { word: 'cas-{tle}', ipa: '/ˈkɑː.səl/', ua: 'замок' },
      { word: 'an-{gle}', ipa: '/ˈæŋ.ɡəl/', ua: 'кут' },
    ],
  },

  // ==========================================
  // CATEGORY 3: VOWEL READING TABLES (Голосні A, E, I, O, U, Y)
  // ==========================================
  {
    id: 'vowel-a-open',
    category: 'vowels',
    title: 'Літера A у відкритому складі',
    soundIpa: '[ eɪ ]',
    condition: 'Відкритий склад або перед німою «e»',
    description: 'Читається як дифтонг [ eɪ ] (як назва в алфавіті).',
    examples: [
      { word: 'b{a}ke', ipa: '/beɪk/', ua: 'випікати' },
      { word: 'c{a}me', ipa: '/keɪm/', ua: 'прийшов' },
      { word: 'p{a}per', ipa: '/ˈpeɪ.pər/', ua: 'папір' },
    ],
    notes:
      'У ненаголошеному положенні в кінці слів читається як [ ə ]: extra [ˈekstrə], agenda [əˈdʒendə], Canada [ˈkænədə].',
  },
  {
    id: 'vowel-a-closed',
    category: 'vowels',
    title: 'Літера A у закритому складі',
    soundIpa: '[ æ ] / [ ɑː ] / [ ɔː ]',
    condition: 'Закритий склад, перед ss/sk/ft або l/w',
    description:
      'Зазвичай короткий звук [ æ ]. Перед ss, sk, ft часто дає довгий [ ɑː ]. Перед l, w дає довгий [ ɔː ]. Після w, wh, qu звучить як [ ɒ ].',
    examples: [
      { word: '{a}ct', ipa: '/ækt/', ua: 'діяти' },
      { word: 'c{a}t', ipa: '/kæt/', ua: 'кіт' },
      { word: '{a}sk', ipa: '/ɑːsk/', ua: 'запитувати [ɑː]' },
      { word: '{a}ll', ipa: '/ɔːl/', ua: 'всі [ɔː]' },
      { word: 'dr{a}w', ipa: '/drɔː/', ua: 'малювати [ɔː]' },
      { word: 'w{a}s', ipa: '/wɒz/', ua: 'був [ɒ]' },
    ],
  },
  {
    id: 'vowel-e-rules',
    category: 'vowels',
    title: 'Літера E у відкритому та закритому складі',
    soundIpa: '[ iː ] / [ e ]',
    condition: 'Відкритий склад -> [iː]; закритий -> [e]',
    description:
      'У відкритому складі дає довгий [ iː ]. У закритому — короткий [ e ]. Перед «w» утворює [ uː ] або [ juː ]. Кінцева «e» після приголосної — німа.',
    examples: [
      { word: 'h{e}', ipa: '/hiː/', ua: 'він [iː]' },
      { word: 'th{e}se', ipa: '/ðiːz/', ua: 'ці [iː]' },
      { word: 'm{e}n', ipa: '/men/', ua: 'чоловіки [e]' },
      { word: 'd{e}ntist', ipa: '/ˈden.tɪst/', ua: 'стоматолог [e]' },
      { word: 'n{e}w', ipa: '/njuː/', ua: 'новий [juː]' },
    ],
  },
  {
    id: 'vowel-i-rules',
    category: 'vowels',
    title: 'Літера I у відкритому та закритому складі',
    soundIpa: '[ aɪ ] / [ ɪ ]',
    condition:
      'Відкритий -> [aɪ]; закритий -> [ɪ]; перед ld, nd, gn, gh -> [aɪ]',
    description:
      'У відкритому складі читається як [ aɪ ]. У закритому — як короткий [ ɪ ]. Перед сполученнями ld, nd, gn, gh читається як [ aɪ ].',
    examples: [
      { word: 'm{i}ne', ipa: '/maɪn/', ua: 'мій [aɪ]' },
      { word: '{i}n', ipa: '/ɪn/', ua: 'в [ɪ]' },
      { word: 'p{i}g', ipa: '/pɪɡ/', ua: 'порося [ɪ]' },
      { word: 'w{i}ld', ipa: '/waɪld/', ua: 'дикий [aɪ]' },
      { word: 'm{i}nd', ipa: '/maɪnd/', ua: 'розум [aɪ]' },
      { word: 'l{i}ght', ipa: '/laɪt/', ua: 'світло [aɪ]' },
    ],
    notes:
      'Виняток: wind [wɪnd] (вітер), хоча дієслово to wind читається як [waɪnd] (заводити).',
  },
  {
    id: 'vowel-o-rules',
    category: 'vowels',
    title: 'Літера O у відкритому та закритому складі',
    soundIpa: '[ əʊ ] / [ ɒ ] / [ ʌ ]',
    condition:
      'Відкритий -> [əʊ]; закритий -> [ɒ]; перед ld/w -> [əʊ]; перед th/n/m -> [ʌ]',
    description:
      'У відкритому складі звучить як дифтонг [ əʊ ] (або [ oʊ ]). У закритому — як короткий [ ɒ ]. Перед th, n, m часто звучить як короткий [ ʌ ].',
    examples: [
      { word: 'g{o}', ipa: '/ɡəʊ/', ua: 'йти [əʊ]' },
      { word: 'h{o}me', ipa: '/həʊm/', ua: 'дім [əʊ]' },
      { word: '{o}ff', ipa: '/ɒf/', ua: 'вимкнено [ɒ]' },
      { word: '{o}ld', ipa: '/əʊld/', ua: 'старий [əʊ]' },
      { word: 'L{o}ndon', ipa: '/ˈlʌn.dən/', ua: 'Лондон [ʌ]' },
      { word: 'm{o}ther', ipa: '/ˈmʌð.ər/', ua: 'мати [ʌ]' },
    ],
  },
  {
    id: 'vowel-u-rules',
    category: 'vowels',
    title: 'Літера U у відкритому та закритому складі',
    soundIpa: '[ juː ] / [ ʌ ] / [ ʊ ]',
    condition: 'Відкритий -> [juː]; закритий -> [ʌ]; після b, f, p -> [ʊ]',
    description:
      'У відкритому складі дає довгий [ juː ] (або [ uː ]). У закритому — короткий звук [ ʌ ]. Після b, f, p та перед l, sh читається як [ ʊ ].',
    examples: [
      { word: '{u}se', ipa: '/juːz/', ua: 'використовувати [juː]' },
      { word: 'c{u}be', ipa: '/kjuːb/', ua: 'куб [juː]' },
      { word: 'c{u}p', ipa: '/kʌp/', ua: 'чашка [ʌ]' },
      { word: 'f{u}ll', ipa: '/fʊl/', ua: 'повний [ʊ]' },
      { word: 'p{u}sh', ipa: '/pʊʃ/', ua: 'штовхати [ʊ]' },
    ],
  },
  {
    id: 'vowel-y-rules',
    category: 'vowels',
    title: 'Літера Y як голосна',
    soundIpa: '[ aɪ ] / [ ɪ ]',
    condition: 'Відкритий наголошений -> [aɪ]; закритий / ненаголошений -> [ɪ]',
    description:
      'У відкритому наголошеному складі читається як [ aɪ ]. У ненаголошеному положенні або закритому складі звучить як [ ɪ ].',
    examples: [
      { word: 'fr{y}', ipa: '/fraɪ/', ua: 'смажити [aɪ]' },
      { word: 'sk{y}', ipa: '/skaɪ/', ua: 'небо [aɪ]' },
      { word: 'bab{y}', ipa: '/ˈbeɪ.bi/', ua: 'дитина [ɪ]' },
      { word: 's{y}stem', ipa: '/ˈsɪs.təm/', ua: 'система [ɪ]' },
      { word: 'm{y}th', ipa: '/mɪθ/', ua: 'міф [ɪ]' },
    ],
  },

  // ==========================================
  // CATEGORY 4: VOWEL + R and RE (R-controlled)
  // ==========================================
  {
    id: 'vr-ar',
    category: 'vowel-r',
    title: 'Сполучення AR',
    soundIpa: '[ ɑː ]',
    description:
      'Дає довгий глибокий звук [ ɑː ]. Буква r у британській не вимовляється.',
    examples: [
      { word: 'b{ar}', ipa: '/bɑːr/', ua: 'бар' },
      { word: 'ch{ar}ge', ipa: '/tʃɑːdʒ/', ua: 'заряджати, плата' },
      { word: 'm{ar}velous', ipa: '/ˈmɑː.vəl.əs/', ua: 'чудовий' },
    ],
  },
  {
    id: 'vr-er-ir-ur',
    category: 'vowel-r',
    title: 'Сполучення ER, IR, UR, YR',
    soundIpa: '[ ɜː ]',
    description:
      'Всі три сполучення дають однаковий довгий нейтральний звук [ ɜː ].',
    examples: [
      { word: 'h{er}', ipa: '/hɜːr/', ua: 'її' },
      { word: 't{er}m', ipa: '/tɜːm/', ua: 'термін' },
      { word: 'f{ir}m', ipa: '/fɜːm/', ua: 'фірма' },
      { word: 'g{ir}l', ipa: '/ɡɜːl/', ua: 'дівчина' },
      { word: 'c{ur}ly', ipa: '/ˈkɜː.li/', ua: 'кучерявий' },
      { word: 'B{yr}d', ipa: '/bɜːd/', ua: 'Берд (прізвище)' },
    ],
  },
  {
    id: 'vr-or',
    category: 'vowel-r',
    title: 'Сполучення OR',
    soundIpa: '[ ɔː ] / [ ə ]',
    description:
      'Під наголосом дає довгий [ ɔː ]. У ненаголошених складах редукується до [ ə ].',
    examples: [
      { word: '{or}', ipa: '/ɔːr/', ua: 'або [ɔː]' },
      { word: 's{or}t', ipa: '/sɔːt/', ua: 'сортувати [ɔː]' },
      { word: 'f{or}give', ipa: '/fəˈɡɪv/', ua: 'прощати [ə]' },
      { word: 'monit{or}', ipa: '/ˈmɒn.ɪ.tər/', ua: 'монітор [ə]' },
    ],
  },
  {
    id: 'vr-are-ere-ire-ore-ure',
    category: 'vowel-r',
    title: 'Голосна + RE (care, here, fire, more, sure)',
    soundIpa: '[ eə ] / [ ɪə ] / [ aɪə ] / [ ɔː ] / [ ʊə ]',
    description:
      'Німа «e» після «r» розкриває дифтонги із закінченням на нейтральний [ ə ].',
    examples: [
      { word: 'c{are}', ipa: '/keər/', ua: 'турбота [eə]' },
      { word: 'h{ere}', ipa: '/hɪər/', ua: 'тут [ɪə]' },
      { word: 'th{ere}', ipa: '/ðeər/', ua: 'там [eə]' },
      { word: 'f{ire}', ipa: '/faɪər/', ua: 'вогонь [aɪə]' },
      { word: 'm{ore}', ipa: '/mɔːr/', ua: 'більше [ɔː]' },
      { word: 's{ure}', ipa: '/ʃʊər/', ua: 'впевнений [ʊə]' },
    ],
    notes: 'Виняток: were [wɜː] (були).',
  },

  // ==========================================
  // CATEGORY 5: VOWEL DIGRAPHS (Буквосполучення голосних)
  // ==========================================
  {
    id: 'vd-ai-ay',
    category: 'vowel-digraphs',
    title: 'Сполучення AI, AY',
    soundIpa: '[ eɪ ] / [ eə ]',
    description:
      'Зазвичай читаються як [ eɪ ]. Перед буквою «r» дають дифтонг [ eə ].',
    examples: [
      { word: 'r{ai}n', ipa: '/reɪn/', ua: 'дощ' },
      { word: 'd{ay}', ipa: '/deɪ/', ua: 'день' },
      { word: 'p{air}', ipa: '/peər/', ua: 'пара [eə]' },
    ],
  },
  {
    id: 'vd-ea-ee',
    category: 'vowel-digraphs',
    title: 'Сполучення EA, EE',
    soundIpa: '[ iː ] / [ e ]',
    description:
      'Найчастіше дають довгий [ iː ]. Перед d, th, lth, sure сполучення EA часто дає короткий [ e ].',
    examples: [
      { word: 't{ea}', ipa: '/tiː/', ua: 'чай' },
      { word: 'm{ea}t', ipa: '/miːt/', ua: "м'ясо" },
      { word: 's{ee}', ipa: '/siː/', ua: 'бачити' },
      { word: 'h{ea}d', ipa: '/hed/', ua: 'голова [e]' },
      { word: 'w{ea}lthy', ipa: '/ˈwel.θi/', ua: 'багатий [e]' },
      { word: 'pl{ea}sure', ipa: '/ˈpleʒ.ər/', ua: 'задоволення [e]' },
    ],
    notes: 'Винятки: break [breɪk], breakfast [ˈbrek.fəst].',
  },
  {
    id: 'vd-oa-oe',
    category: 'vowel-digraphs',
    title: 'Сполучення OA, OE',
    soundIpa: '[ əʊ ]',
    description:
      'Передають дифтонг [ əʊ ] (або [ oʊ ]). Перед «r» OA читається як довгий [ ɔː ].',
    examples: [
      { word: 'b{oa}t', ipa: '/bəʊt/', ua: 'човен' },
      { word: 'r{oa}d', ipa: '/rəʊd/', ua: 'дорога' },
      { word: 't{oe}', ipa: '/təʊ/', ua: 'палець ноги' },
      { word: 'b{oa}rd', ipa: '/bɔːd/', ua: 'дошка, борт [ɔː]' },
    ],
  },
  {
    id: 'vd-oi-oy',
    category: 'vowel-digraphs',
    title: 'Сполучення OI, OY',
    soundIpa: '[ ɔɪ ]',
    description: 'Завжди вимовляються як чіткий дифтонг [ ɔɪ ] («ой»).',
    examples: [
      { word: 'n{oi}se', ipa: '/nɔɪz/', ua: 'шум' },
      { word: 'v{oi}ce', ipa: '/vɔɪs/', ua: 'голос' },
      { word: 'b{oy}', ipa: '/bɔɪ/', ua: 'хлопець' },
      { word: 'empl{oy}', ipa: '/ɪmˈplɔɪ/', ua: 'наймати' },
    ],
  },
  {
    id: 'vd-oo',
    category: 'vowel-digraphs',
    title: 'Сполучення OO',
    soundIpa: '[ uː ] / [ ʊ ] / [ ɔː ]',
    description:
      'Перед k, d зазвичай короткий [ ʊ ] (book, took). В інших випадках — довгий [ uː ]. Перед r читається як [ ɔː ].',
    examples: [
      { word: 'z{oo}', ipa: '/zuː/', ua: 'зоопарк [uː]' },
      { word: 't{oo}k', ipa: '/tʊk/', ua: 'взяв [ʊ]' },
      { word: 'm{oo}se', ipa: '/muːs/', ua: 'лось [uː]' },
      { word: 'd{oo}r', ipa: '/dɔːr/', ua: 'двері [ɔː]' },
      { word: 'fl{oo}r', ipa: '/flɔːr/', ua: 'підлога [ɔː]' },
    ],
  },
  {
    id: 'vd-ou-ow',
    category: 'vowel-digraphs',
    title: 'Сполучення OU, OW',
    soundIpa: '[ aʊ ] / [ əʊ ]',
    description:
      'Під наголосом зазвичай звучать як дифтонг [ aʊ ] (house, out, brown). OW також може передавати [ əʊ ] (know, show).',
    examples: [
      { word: 'h{ou}se', ipa: '/haʊs/', ua: 'будинок [aʊ]' },
      { word: 'f{ou}nd', ipa: '/faʊnd/', ua: 'знайшов [aʊ]' },
      { word: 'sh{ow}', ipa: '/ʃəʊ/', ua: 'показувати [əʊ]' },
      { word: 'b{ou}ght', ipa: '/bɔːt/', ua: 'купив (перед ght дає [ɔː])' },
    ],
  },

  // ==========================================
  // CATEGORY 6: CONSONANTS AND DIGRAPHS (Приголосні та буквосполучення)
  // ==========================================
  {
    id: 'cd-c',
    category: 'consonants',
    title: 'Літера C: [ k ] чи [ s ]',
    soundIpa: '[ s ] / [ k ]',
    condition: 'Перед e, i, y -> [s]; перед іншими -> [k]',
    description:
      "Перед голосними e, i, y літера C читається як м'який [ s ]. Перед a, o, u та приголосними — як твердий [ k ].",
    examples: [
      { word: '{c}ell', ipa: '/sel/', ua: 'клітина [s]' },
      { word: '{c}inema', ipa: '/ˈsɪn.ə.mə/', ua: 'кінотеатр [s]' },
      { word: '{c}yber', ipa: '/ˈsaɪ.bər/', ua: 'кібер [s]' },
      { word: '{c}all', ipa: '/kɔːl/', ua: 'кликати [k]' },
      { word: '{c}reature', ipa: '/ˈkriː.tʃər/', ua: 'створіння [k]' },
    ],
  },
  {
    id: 'cd-g',
    category: 'consonants',
    title: 'Літера G: [ ɡ ] чи [ dʒ ]',
    soundIpa: '[ dʒ ] / [ ɡ ]',
    condition: 'Перед e, i, y -> [dʒ]; перед іншими -> [ɡ]',
    description:
      'Перед e, i, y літера G зазвичай читається як африкат [ dʒ ]. Перед іншими буквами — як твердий [ ɡ ].',
    examples: [
      { word: '{g}in', ipa: '/dʒɪn/', ua: 'джин [dʒ]' },
      { word: '{g}enius', ipa: '/ˈdʒiː.ni.əs/', ua: 'геній [dʒ]' },
      { word: '{g}un', ipa: '/ɡʌn/', ua: 'пістолет [ɡ]' },
      { word: '{g}arlic', ipa: '/ˈɡɑː.lɪk/', ua: 'часник [ɡ]' },
    ],
    notes:
      'Винятки германського походження: give [ɡɪv], get [ɡet], foggy [ˈfɒɡ.i].',
  },
  {
    id: 'cd-sh-ch',
    category: 'consonants',
    title: 'Буквосполучення SH та CH',
    soundIpa: '[ ʃ ] / [ tʃ ] / [ k ]',
    description:
      'SH завжди читається як [ ʃ ]. CH зазвичай читається як твердий [ tʃ ], але в словах грецького походження — як [ k ], а французького — як [ ʃ ].',
    examples: [
      { word: '{sh}ow', ipa: '/ʃəʊ/', ua: 'показ [ʃ]' },
      { word: '{ch}urch', ipa: '/tʃɜːtʃ/', ua: 'церква [tʃ]' },
      { word: 's{ch}ool', ipa: '/skuːl/', ua: 'школа (грец. [k])' },
      { word: '{Ch}rist', ipa: '/kraɪst/', ua: 'Христос (грец. [k])' },
      { word: '{ch}ampagne', ipa: '/ʃæmˈpeɪn/', ua: 'шампанське (франц. [ʃ])' },
    ],
  },
  {
    id: 'cd-th',
    category: 'consonants',
    title: 'Буквосполучення TH: дзвінкий [ ð ] та глухий [ θ ]',
    soundIpa: '[ ð ] / [ θ ]',
    description:
      'Між голосними та в службових словах (the, this, mother) дає дзвінкий [ ð ]. На початку більшості повнозначних слів та в кінці дає глухий [ θ ].',
    examples: [
      { word: '{th}e', ipa: '/ðiː/', ua: 'означений артикль [ð]' },
      { word: 'fa{th}er', ipa: '/ˈfɑː.ðər/', ua: 'батько [ð]' },
      { word: 'o{th}er', ipa: '/ˈʌð.ər/', ua: 'інший [ð]' },
      { word: '{th}eatre', ipa: '/ˈθɪə.tər/', ua: 'театр [θ]' },
      { word: 'fil{th}', ipa: '/fɪlθ/', ua: 'бруд [θ]' },
    ],
  },
  {
    id: 'cd-ph-wh-qu',
    category: 'consonants',
    title: 'Сполучення PH, WH, QU',
    soundIpa: '[ f ] / [ w ] / [ h ] / [ kw ]',
    description:
      'PH завжди передає звук [ f ]. WH перед «o» звучить як [ h ] (who), перед іншими голосними — як [ w ]. QU вимовляється як [ kw ].',
    examples: [
      { word: '{ph}oto', ipa: '/ˈfəʊ.təʊ/', ua: 'фото [f]' },
      { word: '{ph}ysics', ipa: '/ˈfɪz.ɪks/', ua: 'фізика [f]' },
      { word: '{wh}at', ipa: '/wɒt/', ua: 'що [w]' },
      { word: '{wh}o', ipa: '/huː/', ua: 'хто [h]' },
      { word: '{qu}ick', ipa: '/kwɪk/', ua: 'швидкий [kw]' },
      { word: '{qu}est', ipa: '/kwest/', ua: 'пошук [kw]' },
    ],
  },
  {
    id: 'cd-silent-consonants',
    category: 'consonants',
    title: 'Німі приголосні: KN, WR, GN, MB, BT, LK',
    description:
      'В англійській мові ряд історичних приголосних букв пишеться, але не вимовляється.',
    examples: [
      { word: '{k}nife', ipa: '/naɪf/', ua: 'ніж (k не читається)' },
      { word: '{k}nowledge', ipa: '/ˈnɒl.ɪdʒ/', ua: 'знання' },
      { word: '{w}rong', ipa: '/rɒŋ/', ua: 'неправильний (w не читається)' },
      { word: '{w}rite', ipa: '/raɪt/', ua: 'писати' },
      { word: 'la{mb}', ipa: '/læm/', ua: 'ягня (b не читається)' },
      { word: 'de{bt}', ipa: '/det/', ua: 'борг (b не читається)' },
      { word: 'ta{l}k', ipa: '/tɔːk/', ua: 'говорити (l не читається)' },
      { word: 'ha{l}f', ipa: '/hɑːf/', ua: 'половина (l не читається)' },
    ],
  },
  {
    id: 'cd-suffixes-tion-ture',
    category: 'consonants',
    title: 'Закінчення -TION, -SION, -TURE',
    soundIpa: '[ ʃən ] / [ ʒən ] / [ tʃər ]',
    description:
      'Суфікс -TION після голосних звучить як [ ʃən ]. -SION після голосних звучить як [ ʒən ]. -TURE у кінці слів читається як [ tʃər ].',
    examples: [
      { word: 'popula{tion}', ipa: '/ˌpɒp.jəˈleɪ.ʃən/', ua: 'населення [ʃən]' },
      { word: 'vi{sion}', ipa: '/ˈvɪʒ.ən/', ua: 'бачення [ʒən]' },
      { word: 'conclu{sion}', ipa: '/kənˈkluː.ʒən/', ua: 'висновок [ʒən]' },
      { word: 'cul{ture}', ipa: '/ˈkʌl.tʃər/', ua: 'культура [tʃər]' },
      { word: 'na{ture}', ipa: '/ˈneɪ.tʃər/', ua: 'природа [tʃər]' },
      { word: 'fu{ture}', ipa: '/ˈfjuː.tʃər/', ua: 'майбутнє [tʃər]' },
    ],
  },
];

export function ReadingRulesPage() {
  const [activeCategory, setActiveCategory] = useState<
    | 'all'
    | 'syllables'
    | 'syllable-types'
    | 'vowels'
    | 'vowel-r'
    | 'vowel-digraphs'
    | 'consonants'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bgCard = useColorModeValue('#FFFFFF', '#1E293B');
  const borderColor = useColorModeValue('#E2E8F0', '#334155');
  const headingColor = useColorModeValue('#1E293B', '#F8FAFC');
  const textColor = useColorModeValue('#475569', '#94A3B8');
  const subtextColor = useColorModeValue('#64748B', '#94A3B8');
  const blueAccent = useColorModeValue('#2563EB', '#3B82F6');
  const blueLightBg = useColorModeValue('#EFF6FF', '#172554');

  const categoryCounts = useMemo(() => {
    return {
      all: readingRulesData.length,
      syllables: readingRulesData.filter((r) => r.category === 'syllables')
        .length,
      'syllable-types': readingRulesData.filter(
        (r) => r.category === 'syllable-types',
      ).length,
      vowels: readingRulesData.filter((r) => r.category === 'vowels').length,
      'vowel-r': readingRulesData.filter((r) => r.category === 'vowel-r')
        .length,
      'vowel-digraphs': readingRulesData.filter(
        (r) => r.category === 'vowel-digraphs',
      ).length,
      consonants: readingRulesData.filter((r) => r.category === 'consonants')
        .length,
    };
  }, []);

  const categories = [
    { id: 'all', label: 'Усі розділи', count: categoryCounts.all },
    {
      id: 'syllables',
      label: 'Склади в мові',
      count: categoryCounts.syllables,
    },
    {
      id: 'syllable-types',
      label: '7 типів складів',
      count: categoryCounts['syllable-types'],
    },
    {
      id: 'vowels',
      label: 'Голосні A, E, I, O, U, Y',
      count: categoryCounts.vowels,
    },
    {
      id: 'vowel-r',
      label: 'Голосна + R / RE',
      count: categoryCounts['vowel-r'],
    },
    {
      id: 'vowel-digraphs',
      label: 'Диграфи голосних',
      count: categoryCounts['vowel-digraphs'],
    },
    {
      id: 'consonants',
      label: 'Приголосні та диграфи',
      count: categoryCounts.consonants,
    },
  ];

  const filteredRules = useMemo(() => {
    return readingRulesData.filter((rule) => {
      const matchesCat =
        activeCategory === 'all' || rule.category === activeCategory;
      const cleanQ = searchQuery.trim().toLowerCase();
      if (!cleanQ) return matchesCat;

      const matchesTitle = rule.title.toLowerCase().includes(cleanQ);
      const matchesDesc = rule.description.toLowerCase().includes(cleanQ);
      const matchesWords = rule.examples.some(
        (ex) =>
          ex.word.toLowerCase().includes(cleanQ) ||
          (ex.ua && ex.ua.toLowerCase().includes(cleanQ)),
      );
      const matchesIpa = rule.soundIpa
        ? rule.soundIpa.toLowerCase().includes(cleanQ)
        : false;

      return (
        matchesCat &&
        (matchesTitle || matchesDesc || matchesWords || matchesIpa)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <Box>
      <Box mb={6}>
        <Heading
          as="h1"
          fontSize={{ base: '32px', md: '42px' }}
          fontWeight="800"
          color={headingColor}
          mb={2}
          letterSpacing="-0.5px"
        >
          Правила читання
        </Heading>
        <Text fontSize="16px" color={subtextColor} fontWeight="medium">
          Повний курс правил вимови: типи складів, читання голосних, сполучення
          з R та приголосні диграфи
        </Text>
      </Box>

      {/* Intro Box */}
      <Box
        bg={bgCard}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 1px 3px rgba(0,0,0,0.04)"
        mb={8}
      >
        <Text color={textColor} fontSize="15px" lineHeight="1.7">
          Прочитання та вимова літер і буквосполучень в англійській мові
          залежить від положення у слові, <strong>типу складу</strong> та
          сусідніх звуків. Нижче наведено повну систематизовану базу знань
          GrammarWay з підсвічуванням цільових літер червоним кольором та
          інтерактивною озвучкою прикладів.
        </Text>
      </Box>

      {/* Section Filter & Search Card */}
      <Box
        bg={bgCard}
        p={{ base: 4, md: 5 }}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 4px 20px rgba(0,0,0,0.03)"
        mb={8}
      >
        {/* Top: Search Input + Result Stats */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', sm: 'center' }}
          gap={3}
          mb={4}
        >
          <Box position="relative" flex="1">
            <Box
              position="absolute"
              left="14px"
              top="50%"
              transform="translateY(-50%)"
              pointerEvents="none"
              color={subtextColor}
            >
              <Search size={16} />
            </Box>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук правила, букви або слова (напр: th, silent-e, ea)..."
              size="md"
              borderRadius="xl"
              pl="42px"
              pr={searchQuery ? '36px' : '14px'}
              bg={useColorModeValue('#F8FAFC', '#0F172A')}
              borderColor={borderColor}
              _hover={{ borderColor: blueAccent }}
              _focus={{
                borderColor: blueAccent,
                bg: bgCard,
                boxShadow: `0 0 0 1px ${blueAccent}`,
              }}
              fontSize="sm"
            />
            {searchQuery && (
              <Box
                as="button"
                onClick={() => setSearchQuery('')}
                position="absolute"
                right="12px"
                top="50%"
                transform="translateY(-50%)"
                color={subtextColor}
                _hover={{ color: headingColor }}
                p={1}
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <X size={15} />
              </Box>
            )}
          </Box>

          <Badge
            bg={useColorModeValue('#EFF6FF', '#172554')}
            color={blueAccent}
            border="1px solid"
            borderColor={useColorModeValue('#BFDBFE', '#1E3A8A')}
            borderRadius="full"
            px={3.5}
            py={1.5}
            fontSize="xs"
            fontWeight="bold"
            alignSelf={{ base: 'flex-start', sm: 'center' }}
            whiteSpace="nowrap"
          >
            Знайдено: {filteredRules.length}{' '}
            {filteredRules.length === 1
              ? 'правило'
              : filteredRules.length < 5
                ? 'правила'
                : 'правил'}
          </Badge>
        </Flex>

        {/* Divider */}
        <Box h="1px" bg={borderColor} mb={4} />

        {/* Bottom: Filter Chips */}
        <Flex gap={2} wrap="wrap" align="center">
          {categories.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <Button
                key={tab.id}
                size="sm"
                borderRadius="full"
                bg={
                  isActive
                    ? blueAccent
                    : useColorModeValue('#F8FAFC', '#0F172A')
                }
                color={isActive ? '#FFFFFF' : textColor}
                border="1px solid"
                borderColor={isActive ? blueAccent : borderColor}
                boxShadow={
                  isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                }
                _hover={{
                  borderColor: blueAccent,
                  color: isActive ? '#FFFFFF' : headingColor,
                  transform: 'translateY(-1px)',
                }}
                px={3.5}
                py={1.5}
                fontSize="xs"
                fontWeight={isActive ? '700' : '600'}
                onClick={() =>
                  setActiveCategory(
                    tab.id as
                      | 'all'
                      | 'syllables'
                      | 'syllable-types'
                      | 'vowels'
                      | 'vowel-r'
                      | 'vowel-digraphs'
                      | 'consonants',
                  )
                }
                transition="all 0.15s ease"
              >
                {tab.label}
                <Badge
                  ml={1.5}
                  borderRadius="full"
                  px={1.5}
                  py={0.2}
                  fontSize="10px"
                  bg={
                    isActive
                      ? 'rgba(255,255,255,0.25)'
                      : useColorModeValue('#E2E8F0', '#334155')
                  }
                  color={isActive ? '#FFFFFF' : subtextColor}
                >
                  {tab.count}
                </Badge>
              </Button>
            );
          })}
        </Flex>
      </Box>

      {/* Rules List Sectioning */}
      {filteredRules.length === 0 ? (
        <Box
          p={10}
          textAlign="center"
          bg={bgCard}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          mb={8}
        >
          <Text color={subtextColor}>
            За вказаним запитом правил не знайдено.
          </Text>
        </Box>
      ) : (
        <VStack gap={6} align="stretch" mb={8}>
          {filteredRules.map((rule) => (
            <Box
              key={rule.id}
              p={{ base: 5, md: 6 }}
              borderRadius="2xl"
              bg={bgCard}
              border="1px solid"
              borderColor={borderColor}
              boxShadow="0 2px 10px rgba(0,0,0,0.02)"
              transition="all 0.2s ease"
              _hover={{
                borderColor: blueAccent,
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
              }}
            >
              <Flex
                justify="space-between"
                align="start"
                wrap="wrap"
                gap={3}
                mb={3}
              >
                <Box>
                  <HStack gap={2} mb={1}>
                    <Heading size="md" color={headingColor} fontWeight="700">
                      {rule.title}
                    </Heading>
                    {rule.soundIpa && (
                      <Badge
                        bg={blueLightBg}
                        color={blueAccent}
                        fontFamily="mono"
                        fontSize="xs"
                        px={2.5}
                        py={0.5}
                        borderRadius="md"
                        fontWeight="bold"
                      >
                        {rule.soundIpa}
                      </Badge>
                    )}
                  </HStack>
                  {rule.condition && (
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color={blueAccent}
                    >
                      Умова: {rule.condition}
                    </Text>
                  )}
                </Box>
              </Flex>

              <Text fontSize="15px" color={textColor} lineHeight="1.7" mb={4}>
                {rule.description}
              </Text>

              {/* Examples Grid */}
              <Box
                bg={useColorModeValue('#F8FAFC', '#0F172A')}
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={subtextColor}
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                  mb={3}
                >
                  Приклади вимови (натисніть на слово для прослуховування):
                </Text>

                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  gap={2.5}
                >
                  {rule.examples.map((ex, exIdx) => (
                    <Box
                      key={exIdx}
                      as="button"
                      onClick={() => speakEnglishWord(ex.word)}
                      p={3}
                      borderRadius="lg"
                      bg={bgCard}
                      border="1px solid"
                      borderColor={borderColor}
                      textAlign="left"
                      transition="all 0.15s"
                      _hover={{
                        borderColor: blueAccent,
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
                        transform: 'translateY(-1px)',
                      }}
                    >
                      <Flex justify="space-between" align="center" mb={1}>
                        <HighlightedWord
                          text={ex.word}
                          fontSize="15px"
                          fontWeight="700"
                          color={headingColor}
                        />
                        <Volume2 size={13} color="#94A3B8" />
                      </Flex>
                      <Text
                        fontSize="11px"
                        color={subtextColor}
                        fontFamily="mono"
                      >
                        {ex.ipa}
                      </Text>
                      {ex.ua && (
                        <Text
                          fontSize="xs"
                          color={textColor}
                          mt={0.5}
                          lineClamp={1}
                        >
                          {ex.ua}
                        </Text>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              {rule.notes && (
                <Box
                  mt={3}
                  p={3}
                  borderRadius="lg"
                  bg={useColorModeValue('#FFFBEB', '#451A03')}
                  border="1px solid"
                  borderColor={useColorModeValue('#FDE68A', '#78350F')}
                >
                  <Text
                    fontSize="xs"
                    color={useColorModeValue('#B45309', '#FDE68A')}
                  >
                    💡 {rule.notes}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </VStack>
      )}

      {/* Cloud Firestore Progress Tracking */}
      <TopicProgressionCard
        topicId="reading-rules"
        topicTitle="Правила читання"
      />

      {/* External Reference Link */}
      <Box mt={8} pt={4} borderTop="1px solid" borderColor={borderColor}>
        <Flex align="center" gap={2} fontSize="sm" color={subtextColor}>
          <BookOpen size={16} />
          <Text>Першоджерело правил та транскрипцій:</Text>
          <Link
            href="https://grammarway.com/ua/reading-rules"
            target="_blank"
            rel="noopener noreferrer"
            color={blueAccent}
            fontWeight="semibold"
            display="inline-flex"
            alignItems="center"
            gap={1}
            _hover={{ textDecoration: 'underline' }}
          >
            GrammarWay — Правила читання в англійській мові{' '}
            <ExternalLink size={12} />
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}

import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  HStack,
  Badge,
  Flex,
  Link,
  Input,
} from '@chakra-ui/react';
import { Volume2, BookOpen, ExternalLink, Search } from 'lucide-react';
import { TopicProgressionCard } from '@/components/TopicProgressionCard';
import {
  HighlightedWord,
  speakEnglishWord,
} from '@/components/HighlightedWord';
import { useColorModeValue } from '@/components/ui/color-mode';

export const meta = {
  title: 'Фонетика',
  folder: 'Основи',
  folderSlug: 'basics',
  pageSlug: 'phonetics',
  path: '/basics/phonetics',
};

interface WordExample {
  word: string; // contains {highlight} markup
  ipa: string;
  ua: string;
}

interface SoundItem {
  sound: string;
  type: 'consonant' | 'vowel' | 'diphthong';
  uaDesc: string;
  examples: WordExample[];
}

// 44 full sounds directly from GrammarWay (24 consonants, 12 vowels, 8 diphthongs)
const all44Sounds: SoundItem[] = [
  // --- 24 CONSONANTS ---
  {
    sound: '[ p ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український звук [ п ], тільки більш глухий та вимовляється дещо з придихом.',
    examples: [
      { word: '{p}ull', ipa: '/pʊl/', ua: 'тягнути' },
      { word: 'a{pp}le', ipa: '/ˈæp.əl/', ua: 'яблуко' },
      { word: 'sto{p}', ipa: '/stɒp/', ua: 'стоп' },
    ],
  },
  {
    sound: '[ f ]',
    type: 'consonant',
    uaDesc: 'Вимовляється енергійніше за український звук [ ф ].',
    examples: [
      { word: '{f}loor', ipa: '/flɔːr/', ua: 'підлога, поверх' },
      { word: '{f}ood', ipa: '/fuːd/', ua: 'їжа, пожива' },
      { word: '{f}ish', ipa: '/fɪʃ/', ua: 'риба' },
    ],
  },
  {
    sound: '[ t ]',
    type: 'consonant',
    uaDesc:
      "Схожий на український звук [ т ], однак вимовляється з придихом та м'якіше на альвеолах.",
    examples: [
      { word: '{t}ree', ipa: '/triː/', ua: 'дерево' },
      { word: 's{t}op', ipa: '/stɒp/', ua: 'стоп' },
      { word: 'wan{t}', ipa: '/wɒnt/', ua: 'хотіти, бажати' },
    ],
  },
  {
    sound: '[ θ ]',
    type: 'consonant',
    uaDesc:
      'В українській мові відсутній. Кінчик язика між передніми зубами, глухий шепелявий звук між [с] та [ф].',
    examples: [
      { word: '{th}row', ipa: '/θrəʊ/', ua: 'кидати' },
      { word: '{th}igh', ipa: '/θaɪ/', ua: 'стегно' },
      { word: 'ear{th}', ipa: '/ɜːθ/', ua: 'земля, світ' },
    ],
  },
  {
    sound: '[ tʃ ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український приголосний звук [ ч ], однак вимовляється твердіше.',
    examples: [
      { word: '{ch}air', ipa: '/tʃeər/', ua: 'стілець' },
      { word: 'tea{ch}er', ipa: '/ˈtiː.tʃər/', ua: 'вчитель' },
      { word: '{ch}oice', ipa: '/tʃɔɪs/', ua: 'вибір' },
    ],
  },
  {
    sound: '[ s ]',
    type: 'consonant',
    uaDesc: 'Практично тотожний українському приголосному [ с ].',
    examples: [
      { word: '{s}top', ipa: '/stɒp/', ua: 'стоп' },
      { word: 'fa{s}t', ipa: '/fɑːst/', ua: 'швидкий, швидко' },
      { word: '{sea}t', ipa: '/siːt/', ua: 'місце для сидіння' },
    ],
  },
  {
    sound: '[ ʃ ]',
    type: 'consonant',
    uaDesc: "Нагадує український приголосний звук [ ш ], але дещо пом'якшений.",
    examples: [
      { word: '{sh}oe', ipa: '/ʃuː/', ua: 'туфля, черевик' },
      { word: '{s}ure', ipa: '/ʃɔːr/', ua: 'впевнений' },
      { word: 'fi{sh}', ipa: '/fɪʃ/', ua: 'риба' },
    ],
  },
  {
    sound: '[ k ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український [ к ], однак вимовляється з придихом і в кінці слів звучить чітко.',
    examples: [
      { word: 'wal{k}', ipa: '/wɔːk/', ua: 'ходити пішки' },
      { word: 'dar{k}', ipa: '/dɑːk/', ua: 'темний' },
      { word: '{c}up', ipa: '/kʌp/', ua: 'чашка' },
    ],
  },
  {
    sound: '[ b ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український [ б ], тільки дзвінкіший та вимовляється дещо з придихом.',
    examples: [
      { word: '{b}et', ipa: '/bet/', ua: 'парі, заклад' },
      { word: 'a{b}out', ipa: '/əˈbaʊt/', ua: 'про, щодо' },
      { word: '{b}eer', ipa: '/bɪər/', ua: 'пиво' },
    ],
  },
  {
    sound: '[ v ]',
    type: 'consonant',
    uaDesc:
      'Вимовляється так само, як і український дзвінкий приголосний звук [ в ].',
    examples: [
      { word: '{v}ow', ipa: '/vaʊ/', ua: 'клятва, обітниця' },
      { word: 'obser{v}er', ipa: '/əbˈzɜː.vər/', ua: 'спостерігач' },
      { word: 'li{ve}', ipa: '/lɪv/', ua: 'жити' },
    ],
  },
  {
    sound: '[ d ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український [ д ], але язик притискається до альвеол. Ніколи не оглушується в кінці слова.',
    examples: [
      { word: '{d}oor', ipa: '/dɔːr/', ua: 'двері' },
      { word: '{d}ay', ipa: '/deɪ/', ua: 'день' },
      { word: 're{d}', ipa: '/red/', ua: 'червоний' },
    ],
  },
  {
    sound: '[ ð ]',
    type: 'consonant',
    uaDesc:
      'Дзвінкий міжзубний звук: язик між зубами з включенням голосу (дзвінкий варіант звука [ θ ]).',
    examples: [
      { word: '{th}e', ipa: '/ðiː/', ua: 'означений артикль' },
      { word: 'mo{th}er', ipa: '/ˈmʌð.ər/', ua: 'мати' },
      { word: 'brea{th}e', ipa: '/briːð/', ua: 'дихати' },
    ],
  },
  {
    sound: '[ dʒ ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український злитий звук [ дж ], вимовляється твердо й енергійно.',
    examples: [
      { word: '{j}oy', ipa: '/dʒɔɪ/', ua: 'радість' },
      { word: '{g}entle', ipa: '/ˈdʒen.təl/', ua: 'ніжний' },
      { word: '{j}ud{ge}', ipa: '/dʒʌdʒ/', ua: 'суддя' },
    ],
  },
  {
    sound: '[ z ]',
    type: 'consonant',
    uaDesc: 'Вимовляється так само, як український дзвінкий приголосний [ з ].',
    examples: [
      { word: '{z}oo', ipa: '/zuː/', ua: 'зоопарк' },
      { word: 'la{z}y', ipa: '/ˈleɪ.zi/', ua: 'ледачий' },
      { word: 'ro{s}e', ipa: '/rəʊz/', ua: 'троянда' },
    ],
  },
  {
    sound: '[ ʒ ]',
    type: 'consonant',
    uaDesc: "Нагадує український звук [ ж ], але вимовляється дещо м'якше.",
    examples: [
      { word: 'plea{s}ure', ipa: '/ˈpleʒ.ər/', ua: 'задоволення' },
      { word: 'televi{s}ion', ipa: '/ˈtel.ɪ.vɪʒ.ən/', ua: 'телебачення' },
      { word: '{g}enre', ipa: '/ˈʒɑ̃ː.rə/', ua: 'жанр' },
    ],
  },
  {
    sound: '[ g ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український вибуховий приголосний звук [ ґ ], не оглушується в кінці слова.',
    examples: [
      { word: '{g}un', ipa: '/ɡʌn/', ua: 'пістолет' },
      { word: 'fo{gg}y', ipa: '/ˈfɒɡ.i/', ua: 'туманний' },
      { word: 'fro{g}', ipa: '/frɒɡ/', ua: 'жаба' },
    ],
  },
  {
    sound: '[ h ]',
    type: 'consonant',
    uaDesc:
      "Легкий видих повітря без шуму й напруження, набагато м'якший за український [ х ].",
    examples: [
      { word: '{h}ot', ipa: '/hɒt/', ua: 'гарячий' },
      { word: 'be{h}ind', ipa: '/bɪˈhaɪnd/', ua: 'позаду' },
      { word: '{h}ill', ipa: '/hɪl/', ua: 'пагорб' },
    ],
  },
  {
    sound: '[ m ]',
    type: 'consonant',
    uaDesc:
      'Вимовляється так само, як і український носовий приголосний [ м ].',
    examples: [
      { word: '{m}ap', ipa: '/mæp/', ua: 'карта' },
      { word: 'le{m}on', ipa: '/ˈlem.ən/', ua: 'лимон' },
      { word: 'la{mb}', ipa: '/læm/', ua: 'ягня' },
    ],
  },
  {
    sound: '[ n ]',
    type: 'consonant',
    uaDesc: 'Схожий на український [ н ], але язик притиснутий до альвеол.',
    examples: [
      { word: '{n}o', ipa: '/nəʊ/', ua: 'ні' },
      { word: 'di{nn}er', ipa: '/ˈdɪn.ər/', ua: 'вечеря' },
      { word: 'su{n}', ipa: '/sʌn/', ua: 'сонце' },
    ],
  },
  {
    sound: '[ ŋ ]',
    type: 'consonant',
    uaDesc:
      "Носовий задньоязиковий звук: задня спинка язика змикається з м'яким піднебінням, повітря крізь ніс.",
    examples: [
      { word: 'si{ng}', ipa: '/sɪŋ/', ua: 'співати' },
      { word: 'lo{ng}', ipa: '/lɒŋ/', ua: 'довгий' },
      { word: 'morni{ng}', ipa: '/ˈmɔː.nɪŋ/', ua: 'ранок' },
    ],
  },
  {
    sound: '[ l ]',
    type: 'consonant',
    uaDesc:
      "Середній між твердим [ л ] та м'яким [ л'] в українській мові. Кінчик язика торкається альвеол.",
    examples: [
      { word: '{l}eg', ipa: '/leɡ/', ua: 'нога' },
      { word: 'ye{ll}ow', ipa: '/ˈjel.əʊ/', ua: 'жовтий' },
      { word: 'ba{ll}', ipa: '/bɔːl/', ua: "м'яч" },
    ],
  },
  {
    sound: '[ r ]',
    type: 'consonant',
    uaDesc:
      'Кінчик язика загнутий назад до альвеол і не вібрує, на відміну від українського вібруючого [ р ].',
    examples: [
      { word: '{r}un', ipa: '/rʌn/', ua: 'бігти' },
      { word: 'ca{rr}ot', ipa: '/ˈkær.ət/', ua: 'морква' },
      { word: '{r}ed', ipa: '/red/', ua: 'червоний' },
    ],
  },
  {
    sound: '[ w ]',
    type: 'consonant',
    uaDesc:
      'Губи витягуються вперед у трубочку, як для свисту, і розмикаються у широкий звук.',
    examples: [
      { word: '{w}ater', ipa: '/ˈwɔː.tər/', ua: 'вода' },
      { word: '{w}indow', ipa: '/ˈwɪn.dəʊ/', ua: 'вікно' },
      { word: '{w}e', ipa: '/wiː/', ua: 'ми' },
    ],
  },
  {
    sound: '[ j ]',
    type: 'consonant',
    uaDesc:
      'Схожий на український приголосний звук [ й ], але вимовляється значно слабше.',
    examples: [
      { word: '{y}es', ipa: '/jes/', ua: 'так' },
      { word: '{y}ellow', ipa: '/ˈjel.əʊ/', ua: 'жовтий' },
      { word: 'bo{y}', ipa: '/bɔɪ/', ua: 'хлопець' },
    ],
  },

  // --- 12 VOWELS (SHORT & LONG) ---
  {
    sound: '[ iː ]',
    type: 'vowel',
    uaDesc:
      'Довгий напружений звук «і», кутики губ розтягнуті в легкій посмішці.',
    examples: [
      { word: 't{ea}', ipa: '/tiː/', ua: 'чай' },
      { word: 's{ee}', ipa: '/siː/', ua: 'бачити' },
      { word: 'p{ie}ce', ipa: '/piːs/', ua: 'шматок' },
    ],
  },
  {
    sound: '[ ɪ ]',
    type: 'vowel',
    uaDesc: 'Короткий ненапружений звук між українськими [ і ] та [ и ].',
    examples: [
      { word: '{i}n', ipa: '/ɪn/', ua: 'в, у' },
      { word: 'p{i}g', ipa: '/pɪɡ/', ua: 'порося' },
      { word: 'b{i}t', ipa: '/bɪt/', ua: 'шматочок' },
    ],
  },
  {
    sound: '[ e ]',
    type: 'vowel',
    uaDesc:
      'Короткий ненапружений звук, схожий на український [ е ] у слові «день».',
    examples: [
      { word: 'm{e}n', ipa: '/men/', ua: 'чоловіки' },
      { word: 'b{e}d', ipa: '/bed/', ua: 'ліжко' },
      { word: 'h{ea}d', ipa: '/hed/', ua: 'голова' },
    ],
  },
  {
    sound: '[ æ ]',
    type: 'vowel',
    uaDesc:
      'Широкий відкритий звук: щелепа опускається низько, щось середнє між [е] та [а].',
    examples: [
      { word: 'c{a}t', ipa: '/kæt/', ua: 'кіт' },
      { word: '{a}ct', ipa: '/ækt/', ua: 'діяти' },
      { word: 'h{a}nd', ipa: '/hænd/', ua: 'рука' },
    ],
  },
  {
    sound: '[ ɑː ]',
    type: 'vowel',
    uaDesc:
      'Довгий глибокий задньоязиковий звук [ а ], корінь язика відтягнутий назад.',
    examples: [
      { word: 'c{ar}', ipa: '/kɑːr/', ua: 'автомобіль' },
      { word: 'st{ar}', ipa: '/stɑːr/', ua: 'зірка' },
      { word: 'f{a}ther', ipa: '/ˈfɑː.ðər/', ua: 'батько' },
    ],
  },
  {
    sound: '[ ɒ ]',
    type: 'vowel',
    uaDesc:
      'Короткий відкритий звук [ о ], губи злегка округлені, але не витягнуті.',
    examples: [
      { word: '{o}ff', ipa: '/ɒf/', ua: 'геть, вимкнено' },
      { word: 'n{o}t', ipa: '/nɒt/', ua: 'не' },
      { word: 'd{o}g', ipa: '/dɒɡ/', ua: 'собака' },
    ],
  },
  {
    sound: '[ ɔː ]',
    type: 'vowel',
    uaDesc: 'Довгий напружений звук [ о ], губи округлені й злегка напружені.',
    examples: [
      { word: '{or}', ipa: '/ɔːr/', ua: 'або' },
      { word: 'd{oo}r', ipa: '/dɔːr/', ua: 'двері' },
      { word: 'b{all}', ipa: '/bɔːl/', ua: "м'яч" },
    ],
  },
  {
    sound: '[ ʊ ]',
    type: 'vowel',
    uaDesc: 'Короткий ненапружений звук між українськими [ у ] та [ о ].',
    examples: [
      { word: 'b{oo}k', ipa: '/bʊk/', ua: 'книга' },
      { word: 'p{u}t', ipa: '/pʊt/', ua: 'класти' },
      { word: 'c{oul}d', ipa: '/kʊd/', ua: 'міг' },
    ],
  },
  {
    sound: '[ uː ]',
    type: 'vowel',
    uaDesc:
      'Довгий звук «у», губи помітно округлені, але менше витягнуті вперед, ніж в українській мові.',
    examples: [
      { word: 'f{oo}d', ipa: '/fuːd/', ua: 'їжа' },
      { word: 'ch{oo}se', ipa: '/tʃuːz/', ua: 'вибирати' },
      { word: 'bl{ue}', ipa: '/bluː/', ua: 'синій' },
    ],
  },
  {
    sound: '[ ʌ ]',
    type: 'vowel',
    uaDesc:
      'Короткий звук, нагадує ненаголошений український [ а ] в слові «сади».',
    examples: [
      { word: 'c{u}p', ipa: '/kʌp/', ua: 'чашка' },
      { word: 's{u}n', ipa: '/sʌn/', ua: 'сонце' },
      { word: 'm{o}ney', ipa: '/ˈmʌn.i/', ua: 'гроші' },
    ],
  },
  {
    sound: '[ ɜː ]',
    type: 'vowel',
    uaDesc:
      'Довгий напружений нейтральний звук, середнє між довгим [ о ] та [ е ].',
    examples: [
      { word: 'h{er}', ipa: '/hɜːr/', ua: 'її' },
      { word: 'b{ir}d', ipa: '/bɜːd/', ua: 'птах' },
      { word: 'g{ir}l', ipa: '/ɡɜːl/', ua: 'дівчина' },
    ],
  },
  {
    sound: '[ ə ]',
    type: 'vowel',
    uaDesc:
      'Шва (нейтральний звук): найчастіший звук в англійській мові, звучить тільки в ненаголошених складах.',
    examples: [
      { word: '{a}bout', ipa: '/əˈbaʊt/', ua: 'про, біля' },
      { word: 'banan{a}', ipa: '/bəˈnɑː.nə/', ua: 'банан' },
      { word: 'sist{er}', ipa: '/ˈsɪs.tər/', ua: 'сестра' },
    ],
  },

  // --- 8 DIPHTHONGS ---
  {
    sound: '[ eɪ ]',
    type: 'diphthong',
    uaDesc:
      'Дифтонг: починається з відкритого [ е ] і плавно ковзає до короткого [ ɪ ].',
    examples: [
      { word: 'f{a}ce', ipa: '/feɪs/', ua: 'обличчя' },
      { word: 'd{ay}', ipa: '/deɪ/', ua: 'день' },
      { word: 'tr{ai}n', ipa: '/treɪn/', ua: 'потяг' },
    ],
  },
  {
    sound: '[ aɪ ]',
    type: 'diphthong',
    uaDesc:
      'Дифтонг: ковзання від відкритого звука [ а ] до короткого [ ɪ ], як українське «ай».',
    examples: [
      { word: 'pr{i}ce', ipa: '/praɪs/', ua: 'ціна' },
      { word: 'fl{y}', ipa: '/flaɪ/', ua: 'літати' },
      { word: 't{i}me', ipa: '/taɪm/', ua: 'час' },
    ],
  },
  {
    sound: '[ ɔɪ ]',
    type: 'diphthong',
    uaDesc:
      'Дифтонг: починається з [ о ] і плавно переходить у [ ɪ ], як українське «ой».',
    examples: [
      { word: 'b{oy}', ipa: '/bɔɪ/', ua: 'хлопець' },
      { word: 'n{oi}se', ipa: '/nɔɪz/', ua: 'шум' },
      { word: 'c{oi}n', ipa: '/kɔɪn/', ua: 'монета' },
    ],
  },
  {
    sound: '[ aʊ ]',
    type: 'diphthong',
    uaDesc:
      'Дифтонг: ковзання від відкритого [ а ] до слабкого [ ʊ ], нагадує «ау».',
    examples: [
      { word: 'c{ow}', ipa: '/kaʊ/', ua: 'корова' },
      { word: 'h{ou}se', ipa: '/haʊs/', ua: 'будинок' },
      { word: '{ou}t', ipa: '/aʊt/', ua: 'назовні' },
    ],
  },
  {
    sound: '[ əʊ ]',
    type: 'diphthong',
    uaDesc:
      'Дифтонг: починається з нейтрального [ ə ] та плавно переходить у слабкий [ ʊ ].',
    examples: [
      { word: 'g{o}', ipa: '/ɡəʊ/', ua: 'йти' },
      { word: 'b{oa}t', ipa: '/bəʊt/', ua: 'човен' },
      { word: 'h{o}me', ipa: '/həʊm/', ua: 'дім' },
    ],
  },
  {
    sound: '[ ɪə ]',
    type: 'diphthong',
    uaDesc:
      'Дифтонг: починається з короткого [ ɪ ] і закінчується нейтральним звуком [ ə ].',
    examples: [
      { word: '{ear}', ipa: '/ɪər/', ua: 'вухо' },
      { word: 'h{ere}', ipa: '/hɪər/', ua: 'тут' },
      { word: 'n{ear}', ipa: '/nɪər/', ua: 'близько' },
    ],
  },
  {
    sound: '[ eə ]',
    type: 'diphthong',
    uaDesc:
      'Дифтонг: плавний перехід від відкритого [ е ] до нейтрального звука [ ə ].',
    examples: [
      { word: 'h{air}', ipa: '/heər/', ua: 'волосся' },
      { word: 'ch{air}', ipa: '/tʃeər/', ua: 'стілець' },
      { word: 'c{are}', ipa: '/keər/', ua: 'турбота' },
    ],
  },
  {
    sound: '[ ʊə ]',
    type: 'diphthong',
    uaDesc:
      "Дифтонг: починається з ненапруженого [ ʊ ] і м'яко ковзає до нейтрального [ ə ].",
    examples: [
      { word: 'c{ure}', ipa: '/kjʊər/', ua: 'лікування' },
      { word: 't{our}ist', ipa: '/ˈtʊə.rɪst/', ua: 'турист' },
      { word: 'p{ure}', ipa: '/pjʊər/', ua: 'чистий' },
    ],
  },
];

export function PhoneticsPage() {
  const [filterType, setFilterType] = useState<
    'all' | 'consonant' | 'vowel' | 'diphthong'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSound, setSelectedSound] = useState<SoundItem>(
    all44Sounds[0]!,
  );

  const bgCard = useColorModeValue('#FFFFFF', '#1E293B');
  const borderColor = useColorModeValue('#E2E8F0', '#334155');
  const headingColor = useColorModeValue('#1E293B', '#F8FAFC');
  const textColor = useColorModeValue('#475569', '#94A3B8');
  const subtextColor = useColorModeValue('#64748B', '#94A3B8');
  const blueAccent = useColorModeValue('#2563EB', '#3B82F6');
  const blueLightBg = useColorModeValue('#EFF6FF', '#172554');
  const toggleBg = useColorModeValue('#F1F5F9', '#334155');

  const filteredSounds = useMemo(() => {
    return all44Sounds.filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesType;

      const matchesSound = item.sound.toLowerCase().includes(cleanQuery);
      const matchesDesc = item.uaDesc.toLowerCase().includes(cleanQuery);
      const matchesWords = item.examples.some(
        (ex) =>
          ex.word.toLowerCase().includes(cleanQuery) ||
          ex.ua.toLowerCase().includes(cleanQuery),
      );

      return matchesType && (matchesSound || matchesDesc || matchesWords);
    });
  }, [filterType, searchQuery]);

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
          Фонетика
        </Heading>
        <Text fontSize="16px" color={subtextColor} fontWeight="medium">
          Усі 44 звуки англійської мови: приголосні, голосні та дифтонги з
          інтерактивною вимовою
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
          В англійській мові існує <strong>44 звуки</strong>, тоді як літер
          всього <strong>26</strong>. Тому одна й та сама літера в різних
          положеннях у слові та сполученнях з іншими літерами може читатися
          по-різному. Для точного позначення звукового складу використовується{' '}
          <strong>фонетична транскрипція</strong>. У наведеній таблиці нижче
          червоним кольором виділено літери, які передають конкретний звук.
        </Text>
      </Box>

      {/* Filter and Search Bar */}
      <Box mb={6}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          {/* Category Tabs */}
          <HStack bg={toggleBg} p="4px" borderRadius="xl" gap={1} wrap="wrap">
            {[
              { id: 'all', label: `Усі (${all44Sounds.length})` },
              { id: 'consonant', label: 'Приголосні (24)' },
              { id: 'vowel', label: 'Голосні (12)' },
              { id: 'diphthong', label: 'Дифтонги (8)' },
            ].map((tab) => (
              <Button
                key={tab.id}
                size="sm"
                borderRadius="lg"
                bg={filterType === tab.id ? blueAccent : 'transparent'}
                color={filterType === tab.id ? '#FFFFFF' : textColor}
                _hover={{ opacity: 0.9 }}
                px={3.5}
                fontSize="xs"
                onClick={() =>
                  setFilterType(
                    tab.id as 'all' | 'consonant' | 'vowel' | 'diphthong',
                  )
                }
              >
                {tab.label}
              </Button>
            ))}
          </HStack>

          {/* Quick Search */}
          <Box position="relative" minW={{ base: '100%', md: '280px' }}>
            <Box
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              pointerEvents="none"
              color={subtextColor}
            >
              <Search size={15} />
            </Box>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Шукати звук, слово або букву..."
              size="sm"
              borderRadius="xl"
              pl="36px"
              bg={bgCard}
              borderColor={borderColor}
              _focus={{
                borderColor: blueAccent,
                boxShadow: `0 0 0 1px ${blueAccent}`,
              }}
            />
          </Box>
        </Flex>
      </Box>

      {/* Sound Cards Grid */}
      <Box
        bg={bgCard}
        p={{ base: 4, md: 6 }}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 4px 20px rgba(0,0,0,0.03)"
        mb={8}
      >
        {filteredSounds.length === 0 ? (
          <Box py={10} textAlign="center">
            <Text color={subtextColor}>
              За вашим запитом звуків не знайдено.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 2, sm: 4, md: 6, lg: 8 }} gap={2.5}>
            {filteredSounds.map((item, idx) => {
              const isSelected = selectedSound.sound === item.sound;
              return (
                <Box
                  key={idx}
                  as="button"
                  onClick={() => {
                    setSelectedSound(item);
                    if (item.examples[0])
                      speakEnglishWord(item.examples[0].word);
                  }}
                  p={3}
                  borderRadius="xl"
                  bg={isSelected ? blueLightBg : bgCard}
                  border="2px solid"
                  borderColor={isSelected ? blueAccent : borderColor}
                  textAlign="center"
                  cursor="pointer"
                  transition="all 0.15s ease-in-out"
                  _hover={{
                    borderColor: blueAccent,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.12)',
                  }}
                >
                  <Text
                    fontSize="20px"
                    fontWeight="800"
                    color={isSelected ? blueAccent : headingColor}
                    fontFamily="mono"
                    mb={1}
                  >
                    {item.sound}
                  </Text>
                  <Badge
                    bg={
                      item.type === 'vowel'
                        ? '#EFF6FF'
                        : item.type === 'diphthong'
                          ? '#FAF5FF'
                          : '#F1F5F9'
                    }
                    color={
                      item.type === 'vowel'
                        ? '#2563EB'
                        : item.type === 'diphthong'
                          ? '#7C3AED'
                          : '#475569'
                    }
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="10px"
                    fontWeight="bold"
                  >
                    {item.type === 'vowel'
                      ? 'Голосний'
                      : item.type === 'diphthong'
                        ? 'Дифтонг'
                        : 'Приголосний'}
                  </Badge>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Box>

      {/* Selected Sound Inspector */}
      {selectedSound && (
        <Box
          p={{ base: 5, md: 7 }}
          borderRadius="2xl"
          bg={bgCard}
          border="2px solid"
          borderColor={blueAccent}
          boxShadow="0 8px 30px rgba(0,0,0,0.06)"
          mb={8}
        >
          <Flex
            justify="space-between"
            align="start"
            mb={4}
            wrap="wrap"
            gap={3}
          >
            <HStack gap={4}>
              <Box
                w="60px"
                h="60px"
                borderRadius="xl"
                bg={blueLightBg}
                border="2px solid"
                borderColor={blueAccent}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="24px"
                fontWeight="800"
                color={blueAccent}
                fontFamily="mono"
              >
                {selectedSound.sound}
              </Box>
              <Box>
                <Flex align="center" gap={2}>
                  <Heading size="md" color={headingColor}>
                    Звук {selectedSound.sound}
                  </Heading>
                  <Badge
                    bg={
                      selectedSound.type === 'vowel'
                        ? '#EFF6FF'
                        : selectedSound.type === 'diphthong'
                          ? '#FAF5FF'
                          : '#F1F5F9'
                    }
                    color={
                      selectedSound.type === 'vowel'
                        ? '#2563EB'
                        : selectedSound.type === 'diphthong'
                          ? '#7C3AED'
                          : '#475569'
                    }
                    borderRadius="full"
                    px={2.5}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {selectedSound.type === 'vowel'
                      ? 'Голосний'
                      : selectedSound.type === 'diphthong'
                        ? 'Дифтонг'
                        : 'Приголосний'}
                  </Badge>
                </Flex>
                <Text
                  fontSize="sm"
                  color={textColor}
                  mt={1}
                  maxW="700px"
                  lineHeight="tall"
                >
                  {selectedSound.uaDesc}
                </Text>
              </Box>
            </HStack>

            <Button
              size="sm"
              bg={blueAccent}
              color="white"
              borderRadius="full"
              px={4}
              _hover={{ opacity: 0.9 }}
              onClick={() => {
                if (selectedSound.examples[0])
                  speakEnglishWord(selectedSound.examples[0].word);
              }}
            >
              <Volume2 size={15} style={{ marginRight: '6px' }} />
              Слухати зразок
            </Button>
          </Flex>

          <Box mt={5} pt={4} borderTop="1px solid" borderColor={borderColor}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={subtextColor}
              textTransform="uppercase"
              letterSpacing="0.5px"
              mb={3}
            >
              Приклади слів (червоним виділено літери, що дають цей звук;
              натисніть для вимови):
            </Text>

            <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
              {selectedSound.examples.map((ex, exIdx) => (
                <Box
                  key={exIdx}
                  as="button"
                  onClick={() => speakEnglishWord(ex.word)}
                  p={4}
                  borderRadius="xl"
                  bg={useColorModeValue('#F8FAFC', '#0F172A')}
                  border="1px solid"
                  borderColor={borderColor}
                  textAlign="left"
                  transition="all 0.15s"
                  _hover={{
                    borderColor: blueAccent,
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                    transform: 'translateY(-1px)',
                  }}
                >
                  <Flex justify="space-between" align="center" mb={1}>
                    <HighlightedWord
                      text={ex.word}
                      fontSize="17px"
                      fontWeight="700"
                      color={headingColor}
                    />
                    <Volume2 size={14} color="#94A3B8" />
                  </Flex>
                  <Text
                    fontSize="xs"
                    color={subtextColor}
                    fontFamily="mono"
                    mb={1}
                  >
                    {ex.ipa}
                  </Text>
                  <Text fontSize="sm" color={textColor} fontWeight="medium">
                    {ex.ua}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      )}

      {/* Direct Cloud Firestore Progress Tracking */}
      <TopicProgressionCard topicId="phonetics" topicTitle="Фонетика" />

      {/* External Reference Link */}
      <Box mt={8} pt={4} borderTop="1px solid" borderColor={borderColor}>
        <Flex align="center" gap={2} fontSize="sm" color={subtextColor}>
          <BookOpen size={16} />
          <Text>Першоджерело правил та транскрипцій:</Text>
          <Link
            href="https://grammarway.com/ua/phonetics"
            target="_blank"
            rel="noopener noreferrer"
            color={blueAccent}
            fontWeight="semibold"
            display="inline-flex"
            alignItems="center"
            gap={1}
            _hover={{ textDecoration: 'underline' }}
          >
            GrammarWay — Фонетичний склад англійської мови{' '}
            <ExternalLink size={12} />
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}

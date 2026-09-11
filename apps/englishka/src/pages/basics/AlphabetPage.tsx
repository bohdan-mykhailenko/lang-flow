import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  HStack,
  Flex,
  Badge,
  Link,
} from '@chakra-ui/react';
import { Volume2, BookOpen, ExternalLink } from 'lucide-react';
import { TopicProgressionCard } from '@/components/TopicProgressionCard';
import {
  HighlightedWord,
  speakEnglishWord,
} from '@/components/HighlightedWord';
import { useColorModeValue } from '@/components/ui/color-mode';

export const meta = {
  title: 'Алфавіт',
  folder: 'Основи',
  folderSlug: 'basics',
  pageSlug: 'alphabet',
  path: '/basics/alphabet',
};

interface WordExample {
  word: string;
  ipa: string;
  ua: string;
}

interface LetterData {
  letter: string;
  charOnly: string;
  ipa: string;
  ukrPhonetic: string;
  isVowel: boolean;
  note?: string;
  words: WordExample[];
}

const alphabetData: LetterData[] = [
  {
    letter: 'A a',
    charOnly: 'A',
    ipa: '[ ei ]',
    ukrPhonetic: 'ей',
    isVowel: true,
    note: 'Голосна літера. Має відкриту вимову /eɪ/ (name) та коротку закриту /æ/ (cat).',
    words: [
      { word: '{A}pple', ipa: '/ˈæp.əl/', ua: 'Яблуко' },
      { word: '{A}irplane', ipa: '/ˈer.pleɪn/', ua: 'Літак' },
      { word: '{A}nt', ipa: '/ænt/', ua: 'Мураха' },
    ],
  },
  {
    letter: 'B b',
    charOnly: 'B',
    ipa: '[ bi: ]',
    ukrPhonetic: 'бі:',
    isVowel: false,
    note: 'Дзвінкий приголосний звук /b/. Не оглушується в кінці слів.',
    words: [
      { word: '{B}ook', ipa: '/bʊk/', ua: 'Книга' },
      { word: '{B}anana', ipa: '/bəˈnæn.ə/', ua: 'Банан' },
      { word: '{B}oy', ipa: '/bɔɪ/', ua: 'Хлопець' },
    ],
  },
  {
    letter: 'C c',
    charOnly: 'C',
    ipa: '[ si: ]',
    ukrPhonetic: 'сі:',
    isVowel: false,
    note: 'Читається як /s/ перед e, i, y (city, nice), та як /k/ перед a, o, u або приголосними (cat, cold).',
    words: [
      { word: '{C}at', ipa: '/kæt/', ua: 'Кіт' },
      { word: '{C}ity', ipa: '/ˈsɪt.i/', ua: 'Місто' },
      { word: '{C}offee', ipa: '/ˈkɑː.fi/', ua: 'Кава' },
    ],
  },
  {
    letter: 'D d',
    charOnly: 'D',
    ipa: '[ di: ]',
    ukrPhonetic: 'ді:',
    isVowel: false,
    note: 'Альвеолярний звук /d/. Кінчик язика торкається бугорків за верхніми зубами.',
    words: [
      { word: '{D}og', ipa: '/dɔːɡ/', ua: 'Собака' },
      { word: '{D}oor', ipa: '/dɔːr/', ua: 'Двері' },
      { word: '{D}ay', ipa: '/deɪ/', ua: 'День' },
    ],
  },
  {
    letter: 'E e',
    charOnly: 'E',
    ipa: '[ i: ]',
    ukrPhonetic: 'і:',
    isVowel: true,
    note: 'Найчастіша літера в англійській мові. У відкритому складі — довге /iː/ (be, she), у закритому — /e/ (bed, pen). В кінці слова часто «німа».',
    words: [
      { word: '{E}lephant', ipa: '/ˈel.ə.fənt/', ua: 'Слон' },
      { word: '{E}agle', ipa: '/ˈiː.ɡəl/', ua: 'Орел' },
      { word: '{E}gg', ipa: '/eɡ/', ua: 'Яйце' },
    ],
  },
  {
    letter: 'F f',
    charOnly: 'F',
    ipa: '[ ef ]',
    ukrPhonetic: 'еф',
    isVowel: false,
    note: 'Глухий губно-зубний звук /f/. Нижня губа злегка торкається верхніх різців.',
    words: [
      { word: '{F}ish', ipa: '/fɪʃ/', ua: 'Риба' },
      { word: '{F}lower', ipa: '/ˈflaʊ.ɚ/', ua: 'Квітка' },
      { word: '{F}riend', ipa: '/frend/', ua: 'Друг' },
    ],
  },
  {
    letter: 'G g',
    charOnly: 'G',
    ipa: '[ dʒi: ]',
    ukrPhonetic: 'джі:',
    isVowel: false,
    note: 'Перед e, i, y часто читається як /dʒ/ (page, giant), перед іншими літерами — як твердий /ɡ/ (game, good).',
    words: [
      { word: '{G}arden', ipa: '/ˈɡɑːr.dən/', ua: 'Сад' },
      { word: '{G}irl', ipa: '/ɡɝːl/', ua: 'Дівчина' },
      { word: '{G}reen', ipa: '/ɡriːn/', ua: 'Зелений' },
    ],
  },
  {
    letter: 'H h',
    charOnly: 'H',
    ipa: '[ eitʃ ]',
    ukrPhonetic: 'ейч',
    isVowel: false,
    note: 'Легкий придиховий звук /h/. Не має українського хрипкого «х», вимовляється як видих.',
    words: [
      { word: '{H}ouse', ipa: '/haʊs/', ua: 'Будинок' },
      { word: '{H}at', ipa: '/hæt/', ua: 'Капелюх' },
      { word: '{H}eart', ipa: '/hɑːrt/', ua: 'Серце' },
    ],
  },
  {
    letter: 'I i',
    charOnly: 'I',
    ipa: '[ ai ]',
    ukrPhonetic: 'ай',
    isVowel: true,
    note: 'У відкритому складі вимовляється як дифтонг /aɪ/ (time, like), у закритому — короткий звук /ɪ/ (milk, sit). Займенник «I» (Я) завжди пишеться з великої літери.',
    words: [
      { word: '{I}ce cream', ipa: '/ˈaɪs ˌkriːm/', ua: 'Морозиво' },
      { word: '{I}sland', ipa: '/ˈaɪ.lənd/', ua: 'Острів' },
      { word: '{I}dea', ipa: '/aɪˈdiː.ə/', ua: 'Ідея' },
    ],
  },
  {
    letter: 'J j',
    charOnly: 'J',
    ipa: '[ dʒei ]',
    ukrPhonetic: 'джей',
    isVowel: false,
    note: 'Завжди позначає злитий африкатний звук /dʒ/ (як українське сполучення «дж» у слові «джерело»).',
    words: [
      { word: '{J}uice', ipa: '/dʒuːs/', ua: 'Сік' },
      { word: '{J}oy', ipa: '/dʒɔɪ/', ua: 'Радість' },
      { word: '{J}acket', ipa: '/ˈdʒæk.ɪt/', ua: 'Куртка' },
    ],
  },
  {
    letter: 'K k',
    charOnly: 'K',
    ipa: '[ kei ]',
    ukrPhonetic: 'кей',
    isVowel: false,
    note: 'Твердий глухий приголосний /k/. На початку слова перед літерою n ніколи не вимовляється (knife, know, knee).',
    words: [
      { word: '{K}ey', ipa: '/kiː/', ua: 'Ключ' },
      { word: '{K}angaroo', ipa: '/ˌkæŋ.ɡəˈruː/', ua: 'Кенгуру' },
      { word: '{K}ing', ipa: '/kɪŋ/', ua: 'Король' },
    ],
  },
  {
    letter: 'L l',
    charOnly: 'L',
    ipa: '[ el ]',
    ukrPhonetic: 'ел',
    isVowel: false,
    note: 'Має світлу вимову «light L» перед голосними (light) та темну тверду «dark L» перед приголосними та в кінці слів (ball, milk).',
    words: [
      { word: '{L}emon', ipa: '/ˈlem.ən/', ua: 'Лимон' },
      { word: '{L}ion', ipa: '/ˈlaɪ.ən/', ua: 'Лев' },
      { word: '{L}ove', ipa: '/lʌv/', ua: 'Любов' },
    ],
  },
  {
    letter: 'M m',
    charOnly: 'M',
    ipa: '[ em ]',
    ukrPhonetic: 'ем',
    isVowel: false,
    note: 'Носовий губно-губний звук /m/. Губи щільно стулені, повітря проходить крізь ніс.',
    words: [
      { word: '{M}oon', ipa: '/muːn/', ua: 'Місяць' },
      { word: '{M}usic', ipa: '/ˈmjuː.zɪk/', ua: 'Музика' },
      { word: '{M}ountain', ipa: '/ˈmaʊn.tən/', ua: 'Гора' },
    ],
  },
  {
    letter: 'N n',
    charOnly: 'N',
    ipa: '[ en ]',
    ukrPhonetic: 'ен',
    isVowel: false,
    note: 'Носовий звук /n/. У сполученні -ng в кінці слова утворює задньоязиковий носовий звук /ŋ/ (sing, song).',
    words: [
      { word: '{N}ight', ipa: '/naɪt/', ua: 'Ніч' },
      { word: '{N}ature', ipa: '/ˈneɪ.tʃɚ/', ua: 'Природа' },
      { word: '{N}otebook', ipa: '/ˈnoʊt.bʊk/', ua: 'Зошит' },
    ],
  },
  {
    letter: 'O o',
    charOnly: 'O',
    ipa: '[ ou ]',
    ukrPhonetic: 'оу',
    isVowel: true,
    note: 'У відкритому складі читається як дифтонг /oʊ/ (go, no, home), у закритому — як короткий /ɒ/ (hot, box, dog).',
    words: [
      { word: '{O}range', ipa: '/ˈɔːr.ɪndʒ/', ua: 'Апельсин' },
      { word: '{O}cean', ipa: '/ˈoʊ.ʃən/', ua: 'Океан' },
      { word: '{O}wl', ipa: '/aʊl/', ua: 'Сова' },
    ],
  },
  {
    letter: 'P p',
    charOnly: 'P',
    ipa: '[ pi: ]',
    ukrPhonetic: 'пі:',
    isVowel: false,
    note: 'Глухий звук /p/ з помітним придихом (аспірацією) перед голосними (pen, paper).',
    words: [
      { word: '{P}en', ipa: '/pen/', ua: 'Ручка' },
      { word: '{P}icture', ipa: '/ˈpɪk.tʃɚ/', ua: 'Картина' },
      { word: '{P}eace', ipa: '/piːs/', ua: 'Мир' },
    ],
  },
  {
    letter: 'Q q',
    charOnly: 'Q',
    ipa: '[ kju: ]',
    ukrPhonetic: 'кʼю:',
    isVowel: false,
    note: 'В англійських словах практично завжди вживається у сполученні з літерою u (qu), яке вимовляється як /kw/ (queen, quick).',
    words: [
      { word: '{Q}ueen', ipa: '/kwiːn/', ua: 'Королева' },
      { word: '{Q}uick', ipa: '/kwɪk/', ua: 'Швидкий' },
      { word: '{Q}uiet', ipa: '/ˈkwaɪ.ət/', ua: 'Тихий' },
    ],
  },
  {
    letter: 'R r',
    charOnly: 'R',
    ipa: '[ a: ] / [ a:r ]',
    ukrPhonetic: 'а: / а:р',
    isVowel: false,
    note: 'Вимовляється без вібрації язика: кінчик язика загинається назад до піднебіння, не торкаючись його. В американській англійській чітко звучить у кінці слів.',
    words: [
      { word: '{R}ose', ipa: '/roʊz/', ua: 'Троянда' },
      { word: '{R}ainbow', ipa: '/ˈreɪn.boʊ/', ua: 'Веселка' },
      { word: '{R}iver', ipa: '/ˈrɪv.ɚ/', ua: 'Річка' },
    ],
  },
  {
    letter: 'S s',
    charOnly: 'S',
    ipa: '[ es ]',
    ukrPhonetic: 'ес',
    isVowel: false,
    note: 'Вимовляється як глухий /s/ (sun) або дзвінкий /z/ між голосними та після дзвінких приголосних (rose, dogs).',
    words: [
      { word: '{S}un', ipa: '/sʌn/', ua: 'Сонце' },
      { word: '{S}tar', ipa: '/stɑːr/', ua: 'Зірка' },
      { word: '{S}mile', ipa: '/smaɪl/', ua: 'Посмішка' },
    ],
  },
  {
    letter: 'T t',
    charOnly: 'T',
    ipa: '[ ti: ]',
    ukrPhonetic: 'ті:',
    isVowel: false,
    note: 'Альвеолярний звук /t/ з придихом. У буквосполученні th дає міжзубні звуки /θ/ (think) та /ð/ (this).',
    words: [
      { word: '{T}ree', ipa: '/triː/', ua: 'Дерево' },
      { word: '{T}ime', ipa: '/taɪm/', ua: 'Час' },
      { word: '{T}ea', ipa: '/tiː/', ua: 'Чай' },
    ],
  },
  {
    letter: 'U u',
    charOnly: 'U',
    ipa: '[ ju: ]',
    ukrPhonetic: 'йу:',
    isVowel: true,
    note: 'У відкритому складі читається як /juː/ або /uː/ (music, blue), у закритому — як короткий звук /ʌ/ (cup, sun, umbrella).',
    words: [
      { word: '{U}mbrella', ipa: '/ʌmˈbrel.ə/', ua: 'Парасолька' },
      { word: '{U}niform', ipa: '/ˈjuː.nə.fɔːrm/', ua: 'Форма' },
      { word: '{U}niverse', ipa: '/ˈjuː.nə.vɝːs/', ua: 'Всесвіт' },
    ],
  },
  {
    letter: 'V v',
    charOnly: 'V',
    ipa: '[ vi: ]',
    ukrPhonetic: 'ві:',
    isVowel: false,
    note: 'Дзвінкий губно-зубний звук /v/. На відміну від звука /w/, верхні зуби обовʼязково торкаються нижньої губи.',
    words: [
      { word: '{V}iolin', ipa: '/ˌvaɪəˈlɪn/', ua: 'Скрипка' },
      { word: '{V}oice', ipa: '/vɔɪs/', ua: 'Голос' },
      { word: '{V}illage', ipa: '/ˈvɪl.ɪdʒ/', ua: 'Село' },
    ],
  },
  {
    letter: 'W w',
    charOnly: 'W',
    ipa: '[ dʌbl ju: ]',
    ukrPhonetic: 'дабл-йу:',
    isVowel: false,
    note: 'Губно-губний звук /w/: губи округлюються в трубочку, як при вимові українського звуку [у], але без голосу.',
    words: [
      { word: '{W}ater', ipa: '/ˈwɑː.t̬ɚ/', ua: 'Вода' },
      { word: '{W}indow', ipa: '/ˈwɪn.doʊ/', ua: 'Вікно' },
      { word: '{W}orld', ipa: '/wɝːld/', ua: 'Світ' },
    ],
  },
  {
    letter: 'X x',
    charOnly: 'X',
    ipa: '[ eks ]',
    ukrPhonetic: 'екс',
    isVowel: false,
    note: 'Найчастіше передає звукосполучення /ks/ (fox, six) або /ɡz/ перед наголошеною голосною (exam). На початку слів грецького походження читається як /z/ (xylophone).',
    words: [
      { word: 'Bo{x}', ipa: '/bɑːks/', ua: 'Коробка' },
      { word: 'Fo{x}', ipa: '/fɑːks/', ua: 'Лисиця' },
      { word: '{X}ylophone', ipa: '/ˈzaɪ.lə.foʊn/', ua: 'Ксилофон' },
    ],
  },
  {
    letter: 'Y y',
    charOnly: 'Y',
    ipa: '[ wai ]',
    ukrPhonetic: 'уай',
    isVowel: true,
    note: 'Універсальна літера: приголосна на початку слова /j/ (yes, year), але голосна в середині та кінці /aɪ/ чи /i/ (fly, baby).',
    words: [
      { word: '{Y}ellow', ipa: '/ˈjel.oʊ/', ua: 'Жовтий' },
      { word: '{Y}ear', ipa: '/jɪr/', ua: 'Рік' },
      { word: '{Y}oung', ipa: '/jʌŋ/', ua: 'Молодий' },
    ],
  },
  {
    letter: 'Z z',
    charOnly: 'Z',
    ipa: '[ zed ] / [ zi: ]',
    ukrPhonetic: 'зед / зі',
    isVowel: false,
    note: 'Британська назва — [zed] «зед», американська назва — [ziː] «зі». Обидві назви зрозумілі скрізь.',
    words: [
      { word: '{Z}oo', ipa: '/zuː/', ua: 'Зоопарк' },
      { word: '{Z}ero', ipa: '/ˈzɪr.oʊ/', ua: 'Нуль' },
      { word: '{Z}ebra', ipa: '/ˈziː.brə/', ua: 'Зебра' },
    ],
  },
];

export function AlphabetPage() {
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(
    alphabetData[0] ?? null,
  );

  // Dynamic color tokens for light / dark mode
  const bgCard = useColorModeValue('#FFFFFF', '#1E293B');
  const borderColor = useColorModeValue('#E2E8F0', '#334155');
  const headingColor = useColorModeValue('#1E293B', '#F8FAFC');
  const textColor = useColorModeValue('#475569', '#94A3B8');
  const subtextColor = useColorModeValue('#64748B', '#94A3B8');
  const blueAccent = useColorModeValue('#2563EB', '#3B82F6');
  const blueLightBg = useColorModeValue('#EFF6FF', '#172554');

  return (
    <Box>
      {/* GrammarWay Title & Subtitle */}
      <Box mb={6}>
        <Heading
          as="h1"
          fontSize={{ base: '32px', md: '42px' }}
          fontWeight="800"
          color={headingColor}
          mb={2}
          letterSpacing="-0.5px"
        >
          Алфавіт
        </Heading>
        <Text fontSize="16px" color={subtextColor} fontWeight="medium">
          Англійський алфавіт з транскрипцією та вимовою
        </Text>
      </Box>

      {/* GrammarWay Pedagogical Intro Paragraph */}
      <Box
        bg={bgCard}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 1px 3px rgba(0,0,0,0.04)"
        mb={8}
      >
        <Text color={textColor} fontSize="16px" lineHeight="1.7">
          Англійський алфавіт нараховує <strong>26 літер</strong>:{' '}
          <strong>6 літер</strong> позначають голосні звуки та{' '}
          <strong>21 літера</strong> відповідає приголосним звукам. Літера{' '}
          <strong>Y</strong> може позначати як голосний звук, так і приголосний
          залежно від того, з якими літерами вона поєднується. Британська та
          американська назви літери <strong>Z</strong> відрізняються:
          британський варіант — <code>[zed]</code> «<strong>зед</strong>», а
          американський – <code>[ziː]</code> «<strong>зі</strong>».
        </Text>
      </Box>

      {/* 26 Letters Uniform Cards Grid with Combined IPA and Ukrainian Transcriptions */}
      <Box
        bg={bgCard}
        p={{ base: 3, sm: 4, md: 6 }}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 4px 20px rgba(0,0,0,0.03)"
        mb={8}
      >
        <SimpleGrid
          columns={{ base: 3, sm: 4, md: 6, lg: 8, xl: 9 }}
          gap={{ base: 2, sm: 3 }}
        >
          {alphabetData.map((item) => {
            const isSelected = selectedLetter?.charOnly === item.charOnly;
            return (
              <Box
                key={item.charOnly}
                as="button"
                onClick={() => {
                  setSelectedLetter(item);
                  speakEnglishWord(item.charOnly);
                }}
                p={{ base: 2, sm: 2.5 }}
                borderRadius="xl"
                bg={isSelected ? blueLightBg : bgCard}
                border="2px solid"
                borderColor={isSelected ? blueAccent : borderColor}
                textAlign="center"
                cursor="pointer"
                transition="all 0.15s ease-in-out"
                minH={{ base: '86px', sm: '96px', md: '106px' }}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                _hover={{
                  borderColor: blueAccent,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                }}
              >
                <Text
                  fontSize={{ base: '17px', sm: '20px', md: '22px' }}
                  fontWeight="800"
                  color={item.isVowel ? blueAccent : headingColor}
                  lineHeight="1.1"
                  mb={1}
                >
                  {item.letter}
                </Text>
                <Text
                  fontSize={{ base: '11px', sm: '12px' }}
                  fontWeight="700"
                  color={item.isVowel ? blueAccent : headingColor}
                  fontFamily="mono"
                  lineHeight="1.2"
                >
                  {item.ipa}
                </Text>
                <Text
                  fontSize={{ base: '10px', sm: '11px' }}
                  fontWeight="semibold"
                  color={subtextColor}
                  lineHeight="1.2"
                  mt={0.5}
                >
                  [ {item.ukrPhonetic} ]
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>

        <Flex
          justify="center"
          align="center"
          gap={{ base: 3, sm: 6 }}
          mt={{ base: 4, sm: 6 }}
          pt={3}
          borderTop="1px solid"
          borderColor={borderColor}
          fontSize="xs"
          wrap="wrap"
        >
          <Flex align="center" gap={2}>
            <Box w="10px" h="10px" borderRadius="full" bg={blueAccent} />
            <Text color={textColor} fontWeight="medium">
              Голосні літери (6)
            </Text>
          </Flex>
          <Flex align="center" gap={2}>
            <Box w="10px" h="10px" borderRadius="full" bg={subtextColor} />
            <Text color={textColor} fontWeight="medium">
              Приголосні літери (21)
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Enhanced Interactive Letter Inspector */}
      {selectedLetter && (
        <Box
          p={{ base: 4, sm: 6 }}
          borderRadius="2xl"
          bg={bgCard}
          border="2px solid"
          borderColor={blueAccent}
          boxShadow="0 8px 30px rgba(0,0,0,0.06)"
          mb={8}
          position="relative"
        >
          <Flex
            justify="space-between"
            align={{ base: 'stretch', sm: 'start' }}
            mb={4}
            wrap="wrap"
            gap={3}
          >
            <HStack gap={{ base: 3, sm: 4 }}>
              <Box
                w={{ base: '44px', sm: '52px' }}
                h={{ base: '44px', sm: '52px' }}
                borderRadius="xl"
                bg={
                  selectedLetter.isVowel
                    ? blueLightBg
                    : useColorModeValue('#F1F5F9', '#0F172A')
                }
                border="2px solid"
                borderColor={blueAccent}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text
                  fontSize={{ base: '20px', sm: '24px' }}
                  fontWeight="800"
                  color={selectedLetter.isVowel ? blueAccent : headingColor}
                >
                  {selectedLetter.charOnly}
                </Text>
              </Box>
              <Box>
                <Flex align="center" gap={2} wrap="wrap">
                  <Heading size={{ base: 'md', sm: 'lg' }} color={headingColor}>
                    Літера {selectedLetter.letter}
                  </Heading>
                  <Badge
                    bg={
                      selectedLetter.isVowel
                        ? blueLightBg
                        : useColorModeValue('#F1F5F9', '#334155')
                    }
                    color={selectedLetter.isVowel ? blueAccent : textColor}
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="10px"
                    fontWeight="bold"
                  >
                    {selectedLetter.isVowel ? 'Голосна' : 'Приголосна'}
                  </Badge>
                </Flex>
                <Text fontSize="xs" color={subtextColor} mt={0.5}>
                  Транскрипція: <strong>{selectedLetter.ipa}</strong> • Вимова:{' '}
                  <strong>{selectedLetter.ukrPhonetic}</strong>
                </Text>
              </Box>
            </HStack>

            <Button
              size="sm"
              bg={blueAccent}
              color="white"
              _hover={{ opacity: 0.9 }}
              borderRadius="full"
              px={4}
              w={{ base: 'full', sm: 'auto' }}
              onClick={() => speakEnglishWord(selectedLetter.charOnly)}
            >
              <Volume2 size={16} style={{ marginRight: '6px' }} />
              Слухати літеру
            </Button>
          </Flex>

          {selectedLetter.note && (
            <Box
              p={3.5}
              borderRadius="lg"
              bg={useColorModeValue('#F8FAFC', '#0F172A')}
              border="1px solid"
              borderColor={borderColor}
              mb={5}
            >
              <Text fontSize="sm" color={textColor} lineHeight="tall">
                💡 {selectedLetter.note}
              </Text>
            </Box>
          )}

          <Text
            fontSize="xs"
            fontWeight="bold"
            color={subtextColor}
            textTransform="uppercase"
            letterSpacing="0.5px"
            mb={3}
          >
            Практичні приклади слів (натисніть, щоб прослухати):
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
            {selectedLetter.words.map((w, idx) => (
              <Box
                key={idx}
                as="button"
                onClick={() => speakEnglishWord(w.word)}
                p={4}
                borderRadius="xl"
                bg={useColorModeValue('#FFFFFF', '#0F172A')}
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
                    text={w.word}
                    fontSize="16px"
                    fontWeight="700"
                    color={headingColor}
                  />
                  <Volume2 size={14} color="#94A3B8" />
                </Flex>
                <Text
                  fontSize="xs"
                  color={subtextColor}
                  fontFamily="mono"
                  mb={1.5}
                >
                  {w.ipa}
                </Text>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  {w.ua}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Progression & Topic Assessment Widget with BTS Reactions */}
      <TopicProgressionCard
        topicId="alphabet"
        topicTitle="Англійський алфавіт"
      />

      {/* GrammarWay Reference Footer Block */}
      <Box mt={8} pt={4} borderTop="1px solid" borderColor={borderColor}>
        <Flex align="center" gap={2} fontSize="sm" color={subtextColor}>
          <BookOpen size={16} />
          <Text>Першоджерело правил та транскрипцій:</Text>
          <Link
            href="https://grammarway.com/ua/alphabet"
            target="_blank"
            rel="noopener noreferrer"
            color={blueAccent}
            fontWeight="semibold"
            display="inline-flex"
            alignItems="center"
            gap={1}
            _hover={{ textDecoration: 'underline' }}
          >
            GrammarWay — Англійська абетка <ExternalLink size={12} />
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}

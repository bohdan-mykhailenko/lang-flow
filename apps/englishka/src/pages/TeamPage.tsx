import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Badge,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { Target, Heart, Compass } from 'lucide-react';
import { useColorModeValue } from '@/components/ui/color-mode';

export function TeamPage() {
  const bgCard = useColorModeValue('#FFFFFF', '#1E293B');
  const borderColor = useColorModeValue('#E2E8F0', '#334155');
  const innerBg = useColorModeValue('#F8FAFC', '#0F172A');
  const headingColor = useColorModeValue('#1E293B', '#F8FAFC');
  const textColor = useColorModeValue('#475569', '#CBD5E1');
  const subtextColor = useColorModeValue('#64748B', '#94A3B8');
  const blueAccent = useColorModeValue('#2563EB', '#3B82F6');

  return (
    <Box>
      {/* Title & Subtitle */}
      <Box mb={8}>
        <Heading
          as="h1"
          fontSize={{ base: '32px', md: '44px' }}
          fontWeight="800"
          color={headingColor}
          mb={2}
          letterSpacing="-0.5px"
        >
          Команда
        </Heading>
        <Text fontSize="16px" color={subtextColor} fontWeight="medium">
          Богдан та Настінька — персональне навчання 1-на-1.
        </Text>
      </Box>

      {/* Team Cards Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mb={12}>
        {/* Bohdan Card */}
        <Box
          p={8}
          borderRadius="2xl"
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
          boxShadow="0 4px 20px rgba(0,0,0,0.03)"
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-3px)',
            borderColor: blueAccent,
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
          }}
        >
          <Box
            w="120px"
            h="120px"
            mx="auto"
            mb={6}
            borderRadius="full"
            overflow="hidden"
            border="4px solid"
            borderColor={blueAccent}
            boxShadow="0 4px 12px rgba(37, 99, 235, 0.25)"
          >
            <Image
              src="/avatars/bohdan.jpg"
              alt="Богдан"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>
          <Heading size="xl" color={headingColor} mb={2} fontWeight="700">
            Богдан
          </Heading>
          <Badge
            bg={useColorModeValue('#EFF6FF', '#172554')}
            color={blueAccent}
            border="1px solid"
            borderColor={blueAccent}
            mb={5}
            px={3.5}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            Вчитель
          </Badge>
          <Text color={textColor} fontSize="15px" lineHeight="1.8">
            Структурований, гнучкий та створює комфортний простір для розвитку.
            Занурюється в глибину для широкого бачення, перетворюючи мову на
            щоденний інструмент для кращого життя.
          </Text>
        </Box>

        {/* Nastinka Card */}
        <Box
          p={8}
          borderRadius="2xl"
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
          boxShadow="0 4px 20px rgba(0,0,0,0.03)"
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-3px)',
            borderColor: '#EC4899',
            boxShadow: '0 8px 24px rgba(236, 72, 153, 0.12)',
          }}
        >
          <Box
            w="120px"
            h="120px"
            mx="auto"
            mb={6}
            borderRadius="full"
            overflow="hidden"
            border="4px solid"
            borderColor="#EC4899"
            boxShadow="0 4px 12px rgba(236, 72, 153, 0.2)"
          >
            <Image
              src="/avatars/nastinka.jpg"
              alt="Настінька"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>
          <Heading size="xl" color={headingColor} mb={2} fontWeight="700">
            Настінька
          </Heading>
          <Badge
            bg={useColorModeValue('#FDF2F8', '#831843')}
            color={useColorModeValue('#BE185D', '#F472B6')}
            border="1px solid"
            borderColor="#FBCFE8"
            mb={5}
            px={3.5}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            VIP Учениця
          </Badge>
          <Text color={textColor} fontSize="15px" lineHeight="1.8">
            Талановита, амбітна та швидко схоплює нові концепції. Має гостру
            інтуїцію і виняткову пам'ять, невимушено перетворюючи знання на
            природну впевненість.
          </Text>
        </Box>
      </SimpleGrid>

      {/* Principles of Learning in GrammarWay style */}
      <Box
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        bg={bgCard}
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 2px 10px rgba(0,0,0,0.03)"
      >
        <Heading as="h2" size="lg" mb={6} color={headingColor} fontWeight="700">
          🎯 Принципи навчання
        </Heading>
        <VStack align="stretch" gap={5}>
          <Flex
            p={4}
            borderRadius="xl"
            bg={innerBg}
            border="1px solid"
            borderColor={borderColor}
            align="start"
            gap={4}
          >
            <Box
              p={2.5}
              borderRadius="lg"
              bg={useColorModeValue('#EFF6FF', '#172554')}
              color={blueAccent}
            >
              <Compass size={22} />
            </Box>
            <Box>
              <Text fontSize="16px" color={headingColor} fontWeight="bold">
                1. Жити з мовою
              </Text>
              <Text color={textColor} fontSize="14px" mt={1} lineHeight="tall">
                Мова — це щоденний органічний досвід і занурення, а не механічне
                зазубрювання сухих правил.
              </Text>
            </Box>
          </Flex>

          <Flex
            p={4}
            borderRadius="xl"
            bg={innerBg}
            border="1px solid"
            borderColor={borderColor}
            align="start"
            gap={4}
          >
            <Box
              p={2.5}
              borderRadius="lg"
              bg={useColorModeValue('#FDF2F8', '#831843')}
              color="#EC4899"
            >
              <Heart size={22} />
            </Box>
            <Box>
              <Text fontSize="16px" color={headingColor} fontWeight="bold">
                2. Комфортний простір
              </Text>
              <Text color={textColor} fontSize="14px" mt={1} lineHeight="tall">
                Будь-яке питання вітається; справжня мовна свобода й сміливість
                приходять через легкий і відкритий діалог.
              </Text>
            </Box>
          </Flex>

          <Flex
            p={4}
            borderRadius="xl"
            bg={innerBg}
            border="1px solid"
            borderColor={borderColor}
            align="start"
            gap={4}
          >
            <Box
              p={2.5}
              borderRadius="lg"
              bg={useColorModeValue('#F0FDF4', '#064E3B')}
              color="#10B981"
            >
              <Target size={22} />
            </Box>
            <Box>
              <Text fontSize="16px" color={headingColor} fontWeight="bold">
                3. Від глибини до простоти
              </Text>
              <Text color={textColor} fontSize="14px" mt={1} lineHeight="tall">
                Ми розкладаємо найскладніші граматичні явища на прості,
                зрозумілі та практичні пазли, які легко запам'ятовуються.
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}

import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  Sparkles,
  Brain,
  BookOpen,
  MessageSquareText,
  Volume2,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'study' | 'library' | 'tutor'>(
    'study',
  );

  return (
    <Box minH="100vh" bg="#0B0F17" color="gray.100">
      {/* Top Navbar */}
      <Box
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
        px={6}
        py={3.5}
        bg="rgba(11, 15, 23, 0.8)"
        position="sticky"
        top={0}
        zIndex={50}
      >
        <Container
          maxW="6xl"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack gap={3}>
            <Box
              p={2}
              borderRadius="lg"
              bgGradient="to-br"
              gradientFrom="teal.500"
              gradientTo="cyan.500"
              color="white"
            >
              <Sparkles size={20} />
            </Box>
            <VStack align="start" gap={0}>
              <Heading size="md" fontWeight="700" letterSpacing="-0.02em">
                LangFlow
              </Heading>
              <Text fontSize="xs" color="gray.400">
                AI Active-Recall SRS • Bulgarian (B1+)
              </Text>
            </VStack>
          </HStack>

          <HStack gap={2}>
            <Button
              size="sm"
              variant={activeTab === 'study' ? 'solid' : 'ghost'}
              colorScheme="teal"
              onClick={() => setActiveTab('study')}
            >
              <Brain size={16} />
              Review Deck
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'library' ? 'ghost' : 'ghost'}
              onClick={() => setActiveTab('library')}
            >
              <BookOpen size={16} />
              Library
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'tutor' ? 'ghost' : 'ghost'}
              onClick={() => setActiveTab('tutor')}
            >
              <MessageSquareText size={16} />
              AI Tutor
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxW="4xl" py={12}>
        <VStack gap={8} align="stretch">
          {/* Active Review Card Preview */}
          <Box
            p={8}
            borderRadius="2xl"
            bg="#111827"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 20px 40px rgba(0,0,0,0.5)"
            textAlign="center"
          >
            <HStack justify="space-between" mb={6}>
              <Badge
                colorScheme="teal"
                variant="subtle"
                px={2.5}
                py={0.5}
                borderRadius="full"
              >
                FSRS Due (Card 1 / 15)
              </Badge>
              <Button size="xs" variant="outline" colorScheme="gray">
                <Volume2 size={14} />
                TTS Audio (Space)
              </Button>
            </HStack>

            <Heading
              size="2xl"
              my={6}
              fontWeight="700"
              letterSpacing="-0.03em"
              color="teal.300"
            >
              свиквам
            </Heading>
            <Text color="gray.400" fontSize="sm" mb={8}>
              глагол • несвършен вид (свикна)
            </Text>

            <Box
              p={4}
              borderRadius="xl"
              bg="whiteAlpha.50"
              border="1px dashed"
              borderColor="whiteAlpha.200"
              mb={8}
            >
              <Text fontSize="md" color="gray.300" fontStyle="italic">
                "Трябваше ми време да{' '}
                <strong style={{ color: '#5EEAD4' }}>свикна</strong> с новия
                ритъм на живот."
              </Text>
            </Box>

            {/* FSRS Rating Actions */}
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
              <Button colorScheme="red" variant="subtle" size="lg">
                [1] Again (10m)
              </Button>
              <Button colorScheme="orange" variant="subtle" size="lg">
                [2] Hard (1d)
              </Button>
              <Button colorScheme="teal" variant="solid" size="lg">
                [3] Good (3d)
              </Button>
              <Button colorScheme="blue" variant="subtle" size="lg">
                [4] Easy (7d)
              </Button>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

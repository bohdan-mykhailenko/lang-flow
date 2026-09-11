import { ReactNode, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  Button,
  Link,
} from '@chakra-ui/react';
import { BookOpen, Users, Menu, X, ChevronRight } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { routes } from '@/router/routes';
import { ColorModeButton, useColorModeValue } from '@/components/ui/color-mode';

interface DocsLayoutProps {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  activeView: 'page' | 'team';
  onSelectTeam: () => void;
}

export function DocsLayout({
  children,
  currentPath,
  onNavigate,
  activeView,
  onSelectTeam,
}: DocsLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bgApp = useColorModeValue('#F8FAFC', '#0B0F17');
  const bgHeader = useColorModeValue('#FFFFFF', '#0F172A');
  const borderCol = useColorModeValue('#E2E8F0', '#1E293B');
  const logoText = useColorModeValue('#1E293B', '#F8FAFC');
  const blueAccent = useColorModeValue('#2563EB', '#3B82F6');
  const footerBg = useColorModeValue('#FFFFFF', '#0F172A');
  const footerText = useColorModeValue('#64748B', '#94A3B8');
  const mobileNavBg = useColorModeValue('#FFFFFF', '#0F172A');

  const lessonIcons: Record<string, string> = {
    '/basics/alphabet': '🔤',
    '/basics/reading-rules': '📖',
    '/basics/phonetics': '🔊',
  };

  return (
    <Box
      minH="100vh"
      bg={bgApp}
      color={useColorModeValue('#1E293B', '#F8FAFC')}
      display="flex"
      flexDirection="column"
    >
      {/* GrammarWay Top Header */}
      <Box
        as="header"
        bg={bgHeader}
        borderBottom="1px solid"
        borderColor={borderCol}
        position="sticky"
        top={0}
        zIndex={100}
        boxShadow="0 1px 4px rgba(0,0,0,0.03)"
      >
        <Container
          maxW="7xl"
          py={{ base: 2, md: 2.5 }}
          px={{ base: 3, sm: 4, md: 6 }}
        >
          <Flex align="center" justify="space-between">
            {/* Brand Logo */}
            <Flex
              align="center"
              gap={{ base: 2, sm: 3 }}
              cursor="pointer"
              onClick={() => {
                onNavigate('/basics/alphabet');
                setMobileMenuOpen(false);
              }}
            >
              <Box
                w={{ base: '34px', sm: '38px' }}
                h={{ base: '34px', sm: '38px' }}
                borderRadius="xl"
                bg={blueAccent}
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 2px 8px rgba(37, 99, 235, 0.3)"
              >
                <BookOpen size={18} />
              </Box>
              <Box>
                <Text
                  fontFamily="'Georgia', serif"
                  fontSize={{ base: '20px', sm: '24px' }}
                  fontWeight="bold"
                  fontStyle="italic"
                  color={logoText}
                  lineHeight="1"
                  letterSpacing="-0.5px"
                >
                  Englishka
                </Text>
                <Text
                  fontSize="9px"
                  color={blueAccent}
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                >
                  GrammarWay Edition
                </Text>
              </Box>
            </Flex>

            {/* Header Right Actions: Team + Dark/Light Theme Switcher (NO UA label) */}
            <HStack gap={{ base: 1.5, sm: 2.5 }}>
              {/* Top-Level: Команда (Team in the Header) */}
              <Button
                variant={activeView === 'team' ? 'solid' : 'ghost'}
                bg={activeView === 'team' ? blueAccent : 'transparent'}
                color={
                  activeView === 'team'
                    ? '#FFFFFF'
                    : useColorModeValue('#475569', '#CBD5E1')
                }
                _hover={{
                  bg:
                    activeView === 'team'
                      ? '#1D4ED8'
                      : useColorModeValue('#F1F5F9', '#1E293B'),
                  color: activeView === 'team' ? '#FFFFFF' : blueAccent,
                }}
                size="sm"
                borderRadius="full"
                px={{ base: 2.5, sm: 4 }}
                fontWeight="bold"
                fontSize="xs"
                onClick={() => {
                  onSelectTeam();
                  setMobileMenuOpen(false);
                }}
              >
                <Users size={14} style={{ marginRight: '4px' }} />
                Команда
              </Button>

              {/* Dark / Light Mode Switcher */}
              <ColorModeButton />

              {/* Mobile Hamburger Menu Button */}
              <Box
                as="button"
                display={{ base: 'flex', md: 'none' }}
                alignItems="center"
                justifyContent="center"
                w="32px"
                h="32px"
                borderRadius="lg"
                bg={useColorModeValue('#F1F5F9', '#1E293B')}
                color={useColorModeValue('#334155', '#E2E8F0')}
                border="1px solid"
                borderColor={borderCol}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Навігаційне меню"
                cursor="pointer"
              >
                {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
              </Box>
            </HStack>
          </Flex>
        </Container>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <Box
            display={{ base: 'block', md: 'none' }}
            bg={mobileNavBg}
            borderTop="1px solid"
            borderColor={borderCol}
            px={4}
            py={3}
            boxShadow="0 10px 25px rgba(0,0,0,0.15)"
          >
            <Text
              fontSize="10px"
              fontWeight="bold"
              color={useColorModeValue('#94A3B8', '#64748B')}
              textTransform="uppercase"
              letterSpacing="0.08em"
              mb={2}
            >
              Оберіть тему уроку:
            </Text>
            <Flex direction="column" gap={1.5}>
              {routes.map((r) => {
                const isActive =
                  currentPath === r.path && activeView !== 'team';
                return (
                  <Flex
                    key={r.path}
                    as="button"
                    onClick={() => {
                      onNavigate(r.path);
                      setMobileMenuOpen(false);
                    }}
                    align="center"
                    justify="space-between"
                    p={2.5}
                    borderRadius="xl"
                    bg={
                      isActive
                        ? useColorModeValue('#EFF6FF', '#1E293B')
                        : 'transparent'
                    }
                    color={
                      isActive
                        ? blueAccent
                        : useColorModeValue('#334155', '#E2E8F0')
                    }
                    fontWeight={isActive ? '700' : '600'}
                    fontSize="13px"
                    textAlign="left"
                    borderLeft={
                      isActive
                        ? `3px solid ${blueAccent}`
                        : '3px solid transparent'
                    }
                  >
                    <HStack gap={2.5}>
                      <Text fontSize="14px">{lessonIcons[r.path] ?? '📄'}</Text>
                      <Text>{r.title}</Text>
                    </HStack>
                    <ChevronRight
                      size={14}
                      color={isActive ? blueAccent : '#94A3B8'}
                    />
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        )}

        {/* Quick Horizontal Lesson Pills (iPhone 16 Mobile Bar) */}
        <Box
          display={{ base: 'block', md: 'none' }}
          bg={useColorModeValue('#F8FAFC', '#0B0F17')}
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor={borderCol}
          px={3}
          py={2}
          overflowX="auto"
          whiteSpace="nowrap"
          style={{ scrollbarWidth: 'none' }}
        >
          <HStack gap={2} display="inline-flex">
            {routes.map((r) => {
              const isActive = currentPath === r.path && activeView !== 'team';
              return (
                <Button
                  key={r.path}
                  size="xs"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="11px"
                  fontWeight={isActive ? '700' : '600'}
                  bg={
                    isActive
                      ? blueAccent
                      : useColorModeValue('#FFFFFF', '#1E293B')
                  }
                  color={
                    isActive
                      ? '#FFFFFF'
                      : useColorModeValue('#475569', '#CBD5E1')
                  }
                  border="1px solid"
                  borderColor={isActive ? blueAccent : borderCol}
                  boxShadow={
                    isActive ? '0 2px 6px rgba(37,99,235,0.25)' : 'none'
                  }
                  onClick={() => {
                    onNavigate(r.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span style={{ marginRight: '4px' }}>
                    {lessonIcons[r.path] ?? '📄'}
                  </span>
                  {r.title}
                </Button>
              );
            })}
          </HStack>
        </Box>
      </Box>

      {/* Main Layout Container: Left Sidebar (Desktop only) + Content Area */}
      <Flex
        flex="1"
        w="full"
        maxW="7xl"
        mx="auto"
        direction={{ base: 'column', md: 'row' }}
      >
        {/* Left Sidebar: strictly desktop */}
        <Box display={{ base: 'none', md: 'block' }}>
          <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
        </Box>

        {/* Content Area: perfectly sized on mobile with no overflow */}
        <Box
          as="main"
          flex="1"
          py={{ base: 4, md: 8 }}
          px={{ base: 3, sm: 5, md: 8 }}
          maxW="full"
          overflowX="hidden"
        >
          {children}
        </Box>
      </Flex>

      {/* Footer */}
      <Box
        as="footer"
        bg={footerBg}
        borderTop="1px solid"
        borderColor={borderCol}
        py={6}
        mt="auto"
      >
        <Container maxW="7xl" px={6}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <HStack gap={6} fontSize="xs" color={footerText}>
              <Link
                href="https://grammarway.com/ua"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ color: blueAccent, textDecoration: 'underline' }}
              >
                Оригінальний довідник GrammarWay
              </Link>
              <Link
                href="https://dictionary.cambridge.org/"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ color: blueAccent, textDecoration: 'underline' }}
              >
                Cambridge Dictionary
              </Link>
            </HStack>
            <Text fontSize="xs" color={footerText}>
              © 2016 – 2026 Englishka.com • Усі правила англійської мови з
              прикладами
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

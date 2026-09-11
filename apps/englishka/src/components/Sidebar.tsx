import { useState } from 'react';
import { Box, VStack, HStack, Text, Flex } from '@chakra-ui/react';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { folderGroups } from '@/router/routes';
import { useColorModeValue } from '@/components/ui/color-mode';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  // Keep all folders open by default or track open folders
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    basics: true,
  });

  const toggleFolder = (slug: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const bgSidebar = useColorModeValue('#FFFFFF', '#0F172A');
  const borderCol = useColorModeValue('#E2E8F0', '#1E293B');
  const folderHeaderBg = useColorModeValue('transparent', 'transparent');
  const folderHeaderHover = useColorModeValue('#F1F5F9', '#1E293B');
  const folderTitleColor = useColorModeValue('#334155', '#E2E8F0');
  const activeBg = useColorModeValue('#EFF6FF', '#1E293B');
  const activeText = useColorModeValue('#2563EB', '#60A5FA');
  const inactiveText = useColorModeValue('#64748B', '#94A3B8');
  const hoverBg = useColorModeValue('#F8FAFC', '#1E293B');

  return (
    <Box
      as="aside"
      w={{ base: 'full', md: '260px' }}
      minW={{ md: '260px' }}
      bg={bgSidebar}
      borderRight="1px solid"
      borderColor={borderCol}
      p={4}
      h="full"
      overflowY="auto"
    >
      <VStack align="stretch" gap={3}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color={useColorModeValue('#94A3B8', '#64748B')}
          textTransform="uppercase"
          letterSpacing="0.08em"
          px={2}
          mb={1}
        >
          Зміст підручника
        </Text>

        {folderGroups.map((group) => {
          const isOpen = openFolders[group.folderSlug] ?? true;

          return (
            <Box key={group.folderSlug} mb={1}>
              {/* Folder Header */}
              <Flex
                as="button"
                onClick={() => toggleFolder(group.folderSlug)}
                w="full"
                align="center"
                justify="space-between"
                px={2.5}
                py={2}
                borderRadius="md"
                bg={folderHeaderBg}
                _hover={{ bg: folderHeaderHover }}
                transition="background 0.15s"
                cursor="pointer"
              >
                <HStack gap={2}>
                  {isOpen ? (
                    <FolderOpen size={16} color="#2563EB" />
                  ) : (
                    <Folder size={16} color="#2563EB" />
                  )}
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color={folderTitleColor}
                    letterSpacing="-0.2px"
                  >
                    {group.folderTitle}
                  </Text>
                </HStack>

                {isOpen ? (
                  <ChevronDown size={14} color="#94A3B8" />
                ) : (
                  <ChevronRight size={14} color="#94A3B8" />
                )}
              </Flex>

              {/* Nested Pages inside this Folder */}
              {isOpen && (
                <VStack align="stretch" gap={1} mt={1} pl={4}>
                  {group.pages.map((page) => {
                    const isActive = currentPath === page.path;

                    return (
                      <Flex
                        key={page.path}
                        as="button"
                        onClick={() => onNavigate(page.path)}
                        align="center"
                        gap={2.5}
                        px={3}
                        py={2}
                        borderRadius="md"
                        bg={isActive ? activeBg : 'transparent'}
                        color={isActive ? activeText : inactiveText}
                        fontWeight={isActive ? '700' : 'medium'}
                        fontSize="13px"
                        textAlign="left"
                        w="full"
                        cursor="pointer"
                        borderLeft={
                          isActive
                            ? '3px solid #2563EB'
                            : '3px solid transparent'
                        }
                        transition="all 0.15s"
                        _hover={{
                          bg: isActive ? activeBg : hoverBg,
                          color: isActive
                            ? activeText
                            : useColorModeValue('#0F172A', '#F8FAFC'),
                        }}
                      >
                        <FileText
                          size={13}
                          style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}
                        />
                        <Text truncate>{page.title}</Text>
                      </Flex>
                    );
                  })}
                </VStack>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

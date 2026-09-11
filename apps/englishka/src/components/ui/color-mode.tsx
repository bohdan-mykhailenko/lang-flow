import type { IconButtonProps } from '@chakra-ui/react';
import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

export type ColorModeProviderProps = ThemeProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = 'light' | 'dark';

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };
  return {
    colorMode: (resolvedTheme as ColorMode) || 'dark',
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? <Moon size={16} /> : <Sun size={16} />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  'aria-label'?: string;
}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label={
          colorMode === 'dark'
            ? 'Увімкнути світлу тему'
            : 'Увімкнути темну тему'
        }
        size="sm"
        ref={ref}
        title={colorMode === 'dark' ? 'Світла тема' : 'Темна тема'}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { system } from '../../theme';

export function Provider(props: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {props.children}
      </ThemeProvider>
    </ChakraProvider>
  );
}

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#eff6ff' },
          100: { value: '#dbeafe' },
          200: { value: '#bfdbfe' },
          300: { value: '#93c5fd' },
          400: { value: '#60a5fa' },
          500: { value: '#2563eb' }, // Primary sapphire blue
          600: { value: '#1d4ed8' },
          700: { value: '#1e40af' },
          800: { value: '#1e3a8a' },
          900: { value: '#172554' },
          950: { value: '#0f172a' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: '#ffffff' },
          fg: {
            value: {
              _light: '{colors.brand.600}',
              _dark: '{colors.brand.300}',
            },
          },
          muted: { value: '{colors.brand.100}' },
          subtle: {
            value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' },
          },
          emphasized: { value: '{colors.brand.200}' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);

import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

interface HighlightedWordProps extends TextProps {
  text: string;
  highlightColor?: string;
}

/**
 * Clean audio speech utility that strips highlight markup before speaking.
 */
export const speakEnglishWord = (rawText: string, rate: number = 0.85) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const cleanWord = rawText.replace(/[{}]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};

/**
 * Component that parses GrammarWay-style curly-bracket highlights `{a}` and renders
 * target letters with GrammarWay coral-red highlighting.
 * Example: `b{a}ke` -> "b" is normal, "a" is highlighted in coral-red, "ke" is normal.
 */
export function HighlightedWord({
  text,
  highlightColor = '#EF4444',
  ...props
}: HighlightedWordProps) {
  const parts = text.split(/(\{[^}]+\})/);

  return (
    <Text as="span" {...props}>
      {parts.map((part, index) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          const content = part.slice(1, -1);
          return (
            <Text
              as="span"
              key={index}
              color={highlightColor}
              fontWeight="bold"
            >
              {content}
            </Text>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </Text>
  );
}

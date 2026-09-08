// Renders ```mermaid code blocks in Starlight as interactive, themed diagrams.
//
// Starlight uses Expressive Code rather than Astro's default Shiki pipeline.
// Expressive Code tokenizes code fences into `<figure>` and `<pre data-language="mermaid">`
// with one `.ec-line` per source line.
//
// This script runs client-side, extracts the source text from the Expressive Code fence,
// replaces the container with `<div class="mermaid-diagram">`, and renders SVG via Mermaid.js.
// It also watches for Starlight theme toggles (light/dark) and re-renders with the matching palette.

import mermaid from 'mermaid';

const MERMAID_SELECTOR =
  'pre[data-language="mermaid"], pre > code.language-mermaid';
const SOURCE_ATTRIBUTE = 'data-mermaid-source';

let renderIdCounter = 0;

const readSource = (element: HTMLElement): string => {
  const lines = element.querySelectorAll('.ec-line .code');

  if (lines.length > 0) {
    return [...lines].map((line) => line.textContent ?? '').join('\n');
  }

  return element.textContent ?? '';
};

const THEME_VARIABLES = {
  dark: {
    background: 'transparent',
    primaryColor: '#1e293b',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#3b82f6',
    lineColor: '#94a3b8',
    secondaryColor: '#0f172a',
    tertiaryColor: '#1e293b',
    fontSize: '14px',
    fontFamily: 'var(--sl-font-sans, system-ui, sans-serif)',
  },
  light: {
    background: 'transparent',
    primaryColor: '#eff6ff',
    primaryTextColor: '#0f172a',
    primaryBorderColor: '#2563eb',
    lineColor: '#64748b',
    secondaryColor: '#f8fafc',
    tertiaryColor: '#f1f5f9',
    fontSize: '14px',
    fontFamily: 'var(--sl-font-sans, system-ui, sans-serif)',
  },
} as const;

const currentTheme = (): keyof typeof THEME_VARIABLES =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

const collectDiagrams = (): HTMLElement[] =>
  [...document.querySelectorAll<HTMLElement>(MERMAID_SELECTOR)].map(
    (element) => {
      // Expressive Code wraps the <pre> in a figure with a copy button and line numbers;
      // replace the whole figure so no code block furniture is left around the diagram.
      const host =
        element.closest('figure') ?? element.closest('pre') ?? element;
      const container = document.createElement('div');

      container.className = 'mermaid-diagram';
      container.setAttribute(SOURCE_ATTRIBUTE, readSource(element));
      host.replaceWith(container);

      return container;
    },
  );

const render = async (containers: HTMLElement[]): Promise<void> => {
  const theme = currentTheme();

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    themeVariables: THEME_VARIABLES[theme],
  });

  await Promise.all(
    containers.map(async (container, index) => {
      const source = container.getAttribute(SOURCE_ATTRIBUTE) ?? '';
      if (!source.trim()) return;

      const uniqueId = `englow-mermaid-${theme}-${index}-${++renderIdCounter}`;

      try {
        const { svg } = await mermaid.render(uniqueId, source);
        container.innerHTML = svg;
      } catch (error) {
        console.warn('[Englow Mermaid] Rendering failed for diagram:', error);
        // Fallback: show formatted code if diagram has a syntax error
        container.innerHTML = `<pre class="mermaid-fallback"><code>${source.replace(/[<&]/g, (c) => (c === '<' ? '&lt;' : '&amp;'))}</code></pre>`;
      }
    }),
  );
};

const start = async (): Promise<void> => {
  const newContainers = collectDiagrams();
  const existingContainers = [
    ...document.querySelectorAll<HTMLElement>(`[${SOURCE_ATTRIBUTE}]`),
  ];

  const allContainers = Array.from(
    new Set([...newContainers, ...existingContainers]),
  );

  if (allContainers.length === 0) {
    return;
  }

  await render(allContainers);
};

// Listen for Starlight theme toggles
const themeObserver = new MutationObserver(() => {
  const containers = [
    ...document.querySelectorAll<HTMLElement>(`[${SOURCE_ATTRIBUTE}]`),
  ];
  if (containers.length > 0) {
    void render(containers);
  }
});

themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme'],
});

// Run on initial load and Astro client-side navigation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void start());
} else {
  void start();
}

document.addEventListener('astro:page-load', () => void start());

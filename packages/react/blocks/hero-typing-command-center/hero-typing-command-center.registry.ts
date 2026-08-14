import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-typing-command-center',
  type: 'registry:block',
  categories: ['hero', 'marketing'],
  framework: 'react',
  description:
    'Interactive CLI command center hero with animated execution simulator, output logs, and quick workflow presets.',
  files: [
    {
      path: 'HeroTypingCommandCenter.tsx',
      target: 'components/blocks/hero-typing-command-center/HeroTypingCommandCenter.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/hero-typing-command-center/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/utils.json',
    'https://uipkge.dev/r/input.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'code-terminal-session',
  title: 'Code — Terminal Session',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Terminal transcript that types itself out line by line on mount, showing prompts, output, and a success summary, and rendering instantly under reduced-motion.',
  framework: 'vue',
  files: [{ path: 'CodeTerminalSession.vue', target: 'components/blocks/CodeTerminalSession.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

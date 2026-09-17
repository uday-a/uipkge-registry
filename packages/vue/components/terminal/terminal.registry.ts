import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'terminal',
  type: 'registry:ui',
  categories: ['display'],
  framework: 'vue',
  description:
    'Terminal/command-line display with a macOS-style title bar, command history, prompt character, dark/light themes, auto-scroll, optional typing animation, and a line slot for custom formatting.',
  files: [
    { path: 'Terminal.vue', target: 'components/ui/terminal/Terminal.vue' },
    { path: 'index.ts', target: 'components/ui/terminal/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

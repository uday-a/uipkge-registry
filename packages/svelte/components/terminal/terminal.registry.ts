import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'terminal',
  type: 'registry:ui',
  categories: ['display'],
  framework: 'svelte',
  description:
    'Terminal/command-line display with a macOS-style title bar, command history, prompt character, dark/light themes, auto-scroll, optional typing animation, and a line snippet for custom formatting.',
  files: [
    { path: 'Terminal.svelte', target: 'components/ui/terminal/Terminal.svelte' },
    { path: 'index.ts', target: 'components/ui/terminal/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'terminal',
  type: 'registry:ui',
  categories: ['display'],
  framework: 'angular',
  description:
    'Terminal/command-line display with a macOS-style title bar, command history, prompt character, dark/light themes, auto-scroll, optional typing animation, and a max-height scroll body.',
  files: [
    { path: 'terminal.component.ts', target: 'components/ui/terminal/terminal.component.ts' },
    { path: 'index.ts', target: 'components/ui/terminal/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

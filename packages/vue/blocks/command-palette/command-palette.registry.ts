import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'command-palette',
  type: 'registry:block',
  categories: ['layout', 'dashboard', 'overlay', 'navigation'],
  description:
    'Header-grade search/command palette. Bundles the slim trigger button (with platform-aware ⌘K/Ctrl-K kbd hint) AND the modal CommandDialog into one block; consumers drop it once and the global keyboard shortcut wires itself. Takes a `groups` array of `{ heading, items: [{ label, hint, icon, onSelect }] }` and emits `select`. `show-trigger=false` hides the inline button so the consumer can fire it from elsewhere via the exposed `show()` / `toggle()` methods.',
  framework: 'vue',
  files: [{ path: 'CommandPalette.vue', target: 'components/blocks/CommandPalette.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/command.json', 'https://uipkge.dev/r/kbd.json'],
})

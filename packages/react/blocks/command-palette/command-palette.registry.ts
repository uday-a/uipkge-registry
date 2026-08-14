import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'command-palette',
  type: 'registry:block',
  categories: ['layout', 'dashboard', 'overlay', 'navigation'],
  description:
    'Header-grade search/command palette. Bundles the slim trigger button (with platform-aware ⌘K/Ctrl-K kbd hint) AND the modal CommandDialog into one block; consumers drop it once and the global keyboard shortcut wires itself. Takes a `groups` array of `{ heading, items: [{ label, hint, icon, onSelect }] }` and calls `onSelect`. `showTrigger={false}` hides the inline button so the consumer can control open state from elsewhere.',
  files: [{ path: 'CommandPalette.tsx', target: 'components/blocks/CommandPalette.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/command.json', 'https://uipkge.dev/r/kbd.json'],
})

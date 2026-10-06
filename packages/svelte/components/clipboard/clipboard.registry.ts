import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'clipboard',
  type: 'registry:ui',
  categories: ['utility', 'control'],
  framework: 'svelte',
  description:
    'Copy-to-clipboard button with success/error feedback. Swaps the icon to a check on success, shows a tooltip with configurable feedback text, supports a visible label, disabled state, a custom timeout for feedback reset, and copy/success/error callbacks. Includes a legacy execCommand fallback for non-secure contexts. Composes the tooltip primitive.',
  files: [
    { path: 'Clipboard.svelte', target: 'components/ui/clipboard/Clipboard.svelte' },
    { path: 'index.ts', target: 'components/ui/clipboard/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/tooltip.json'],
})

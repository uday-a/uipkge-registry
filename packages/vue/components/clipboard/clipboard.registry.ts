import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'clipboard',
  type: 'registry:ui',
  categories: ['utility', 'control'],
  framework: 'vue',
  description:
    'Copy-to-clipboard button with success/error feedback. Swaps the icon to a check on success, shows a tooltip with configurable feedback text, supports a visible label, disabled state, a custom timeout for feedback reset, and copy/success/error events. Includes a legacy execCommand fallback for non-secure contexts. Composes the tooltip primitive.',
  files: [
    { path: 'Clipboard.vue', target: 'components/ui/clipboard/Clipboard.vue' },
    { path: 'index.ts', target: 'components/ui/clipboard/index.ts' },
  ],
  dependencies: ['lucide-vue-next', 'reka-ui'],
  registryDependencies: ['https://uipkge.dev/r/tooltip.json'],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tooltip',
  type: 'registry:ui',
  categories: ['overlay'],
  description:
    'Small popover triggered by hover/focus, used for short labels — icon-button names, abbreviation expansions, keyboard shortcuts. Auto-positions and respects `prefers-reduced-motion`.',
  files: [
    { path: 'tooltip.tsx', target: 'components/ui/tooltip/tooltip.tsx' },
    { path: 'index.ts', target: 'components/ui/tooltip/index.ts' },
  ],
  dependencies: ['@radix-ui/react-tooltip'],
  registryDependencies: [],
})

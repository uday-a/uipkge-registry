import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'transfer',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'Dual-list move-between control. Two columns plus a center pair of move buttons. Optional search, pagination, and one-way mode.',
  files: [
    { path: 'transfer.component.ts', target: 'components/ui/transfer/transfer.component.ts' },
    { path: 'index.ts', target: 'components/ui/transfer/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/scroll-area.json',
    'https://uipkge.dev/r/popper.json',
  ],
})

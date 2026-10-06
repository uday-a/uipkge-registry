import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hover-card',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Rich popover triggered by hover/focus instead of click. Use for inline previews — user cards on @mentions, link previews, KPI explanations. Radix HoverCard behaviour: configurable open/close delays, stays open while the pointer is on the card, portalled + positioned with flip/shift, Escape and outside clicks dismiss.',
  files: [
    { path: 'hover-card.component.ts', target: 'components/ui/hover-card/hover-card.component.ts' },
    { path: 'index.ts', target: 'components/ui/hover-card/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})

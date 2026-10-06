import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hover-card',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Rich popover triggered by hover/focus instead of click. Use for inline previews — user cards on @mentions, link previews, KPI explanations. Hand-rolled runes port (no headless dependency) with configurable open/close delay, side/align placement, and bindable open state.',
  files: [
    { path: 'HoverCard.svelte', target: 'components/ui/hover-card/HoverCard.svelte' },
    { path: 'HoverCardContent.svelte', target: 'components/ui/hover-card/HoverCardContent.svelte' },
    { path: 'HoverCardTrigger.svelte', target: 'components/ui/hover-card/HoverCardTrigger.svelte' },
    { path: 'index.ts', target: 'components/ui/hover-card/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

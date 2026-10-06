import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'popover',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Click-triggered floating panel anchored to a trigger element. Supports optional localStorage persistence and configurable dismissal (click-outside, escape, manual). Hand-rolled runes positioning with viewport clamping.',
  files: [
    { path: 'Popover.svelte', target: 'components/ui/popover/Popover.svelte' },
    { path: 'PopoverAnchor.svelte', target: 'components/ui/popover/PopoverAnchor.svelte' },
    { path: 'PopoverContent.svelte', target: 'components/ui/popover/PopoverContent.svelte' },
    { path: 'PopoverTrigger.svelte', target: 'components/ui/popover/PopoverTrigger.svelte' },
    { path: 'context.ts', target: 'components/ui/popover/context.ts' },
    { path: 'index.ts', target: 'components/ui/popover/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

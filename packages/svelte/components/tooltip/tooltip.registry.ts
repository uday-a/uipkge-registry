import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tooltip',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Small popover triggered by hover/focus, used for short labels — icon-button names, abbreviation expansions, keyboard shortcuts. Auto-positions and respects `prefers-reduced-motion`.',
  files: [
    { path: 'Tooltip.svelte', target: 'components/ui/tooltip/Tooltip.svelte' },
    { path: 'TooltipContent.svelte', target: 'components/ui/tooltip/TooltipContent.svelte' },
    { path: 'TooltipProvider.svelte', target: 'components/ui/tooltip/TooltipProvider.svelte' },
    { path: 'TooltipTrigger.svelte', target: 'components/ui/tooltip/TooltipTrigger.svelte' },
    { path: 'context.svelte.ts', target: 'components/ui/tooltip/context.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/tooltip/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

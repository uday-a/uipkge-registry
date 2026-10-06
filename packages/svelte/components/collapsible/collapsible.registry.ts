import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'collapsible',
  type: 'registry:ui',
  categories: ['disclosure'],
  framework: 'svelte',
  description:
    'Headless single-region show/hide primitive with Svelte 5 runes (no headless dependency — open state, ids, and trigger/content wiring are hand-rolled via context). Use it when Accordion is overkill — a single toggle reveals one panel of content. Controlled (bind:open) or uncontrolled (defaultOpen); the trigger supports a child snippet for custom buttons.',
  files: [
    { path: 'Collapsible.svelte', target: 'components/ui/collapsible/Collapsible.svelte' },
    { path: 'CollapsibleContent.svelte', target: 'components/ui/collapsible/CollapsibleContent.svelte' },
    { path: 'CollapsibleTrigger.svelte', target: 'components/ui/collapsible/CollapsibleTrigger.svelte' },
    { path: 'index.ts', target: 'components/ui/collapsible/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'collapsible',
  type: 'registry:ui',
  categories: ['disclosure'],
  framework: 'vue',
  description:
    'Headless single-region show/hide primitive. Use it when Accordion is overkill — a single toggle reveals one panel of content. Smooth height animation built in.',
  files: [
    { path: 'Collapsible.vue', target: 'components/ui/collapsible/Collapsible.vue' },
    { path: 'CollapsibleContent.vue', target: 'components/ui/collapsible/CollapsibleContent.vue' },
    { path: 'CollapsibleTrigger.vue', target: 'components/ui/collapsible/CollapsibleTrigger.vue' },
    { path: 'index.ts', target: 'components/ui/collapsible/index.ts' },
  ],
  dependencies: ['reka-ui'],
  registryDependencies: [],
})

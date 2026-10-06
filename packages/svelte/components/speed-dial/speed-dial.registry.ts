import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'speed-dial',
  type: 'registry:ui',
  categories: ['control', 'navigation'],
  framework: 'svelte',
  description:
    'Expanding floating action button that reveals a list of secondary action buttons. Supports click or hover triggers, four expansion directions (up/down/left/right), staggered entrance animation, a configurable main FAB icon, and close-on-action. Self-contained (FAB trigger styling and popover positioning hand-rolled).',
  files: [
    { path: 'SpeedDial.svelte', target: 'components/ui/speed-dial/SpeedDial.svelte' },
    { path: 'index.ts', target: 'components/ui/speed-dial/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})

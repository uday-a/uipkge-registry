import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'speed-dial',
  type: 'registry:ui',
  categories: ['control', 'navigation'],
  framework: 'angular',
  description:
    'Expanding floating action button (Fab + Popover) that reveals secondary icon actions. Click or hover triggers, four expansion directions, 40ms staggered entrance, configurable FAB icon template, close-on-action, disabled actions.',
  files: [
    { path: 'speed-dial.component.ts', target: 'components/ui/speed-dial/speed-dial.component.ts' },
    { path: 'index.ts', target: 'components/ui/speed-dial/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/fab.json',
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/popper.json',
  ],
})

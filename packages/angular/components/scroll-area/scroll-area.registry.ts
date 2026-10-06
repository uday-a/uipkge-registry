import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'scroll-area',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'angular',
  description:
    'Custom scrollbar that always renders the same way across OSes (no flashing native scrollbars on Windows). Radix semantics: native scrollbar hidden, thumb sized and positioned from scroll metrics, draggable thumb, hover / scroll / auto / always visibility. Use for sidebars, dropdown content, and any overflow region you want to feel consistent.',
  files: [
    { path: 'scroll-area.component.ts', target: 'components/ui/scroll-area/scroll-area.component.ts' },
    { path: 'index.ts', target: 'components/ui/scroll-area/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'radio-group',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'Single-selection group of radio inputs. Vertical or horizontal layout, optional descriptions per item, and full keyboard navigation. Pair with Form for validation messages.',
  files: [
    { path: 'radio-group.tsx', target: 'components/ui/radio-group/radio-group.tsx' },
    { path: 'index.ts', target: 'components/ui/radio-group/index.ts' },
  ],
  dependencies: ['lucide-react', '@radix-ui/react-radio-group'],
  registryDependencies: [],
})

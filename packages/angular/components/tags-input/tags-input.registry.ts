import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tags-input',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Multi-tag input — type a value, hit Enter, get a chip. Backspace removes the last tag. Use for email recipient lists, tag sets, and free-form keyword inputs.',
  files: [
    { path: 'tags-input.component.ts', target: 'components/ui/tags-input/tags-input.component.ts' },
    { path: 'index.ts', target: 'components/ui/tags-input/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

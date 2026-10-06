import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'utils',
  type: 'registry:lib',
  framework: 'angular',
  description:
    'Tailwind class merge helper: cn(). Combines clsx and tailwind-merge. Every component imports it relatively.',
  files: [{ path: 'utils.ts', target: '~/src/lib/utils.ts' }],
  dependencies: ['clsx', 'tailwind-merge'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'utils',
  type: 'registry:lib',
  description: 'Tailwind class merge helper: cn(). Combines clsx and tailwind-merge.',
  framework: 'vue',
  files: [{ path: 'utils.ts', target: '~/app/lib/utils.ts' }],
  dependencies: [],
  registryDependencies: [],
})

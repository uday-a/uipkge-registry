import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'input',
  type: 'registry:ui',
  categories: ['control'],
  framework: 'svelte',
  description:
    'Text input — single-line. Three sizes, three variants (outlined / filled / borderless), error / warning status, prefix / suffix (string, icon, or snippet), addonBefore / addonAfter, allow-clear, password toggle, char count, and composite InputGroup with addons and action buttons.',
  files: [
    { path: 'Input.svelte', target: 'components/ui/input/Input.svelte' },
    { path: 'InputGroup.svelte', target: 'components/ui/input/InputGroup.svelte' },
    { path: 'InputGroupAddon.svelte', target: 'components/ui/input/InputGroupAddon.svelte' },
    { path: 'InputGroupButton.svelte', target: 'components/ui/input/InputGroupButton.svelte' },
    { path: 'index.ts', target: 'components/ui/input/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'input',
  type: 'registry:ui',
  categories: ['control'],
  description:
    'Text input — single-line. Three sizes, three variants (outlined / filled / borderless), error / warning status, prefix / suffix nodes, addonBefore / addonAfter, allow-clear, password toggle, char count, and composite InputGroup with addons and action buttons.',
  files: [
    { path: 'Input.tsx', target: 'components/ui/input/Input.tsx' },
    { path: 'InputGroup.tsx', target: 'components/ui/input/InputGroup.tsx' },
    { path: 'InputGroupAddon.tsx', target: 'components/ui/input/InputGroupAddon.tsx' },
    { path: 'InputGroupButton.tsx', target: 'components/ui/input/InputGroupButton.tsx' },
    { path: 'index.ts', target: 'components/ui/input/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [],
})

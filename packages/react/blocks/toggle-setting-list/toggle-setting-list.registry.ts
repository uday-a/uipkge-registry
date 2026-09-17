import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'toggle-setting-list',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'List of toggle-able settings in a SectionCard. The `value` prop binds a Record<string, boolean> keyed by item.key; `onValueChange` emits the next record.',
  files: [{ path: 'ToggleSettingList.tsx', target: 'components/blocks/ToggleSettingList.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/section-card.json'],
})

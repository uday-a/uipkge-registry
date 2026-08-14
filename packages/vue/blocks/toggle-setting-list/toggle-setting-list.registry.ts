import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'toggle-setting-list',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'List of toggle-able settings in a SectionCard. v-model binds a Record<string, boolean> keyed by item.key.',
  framework: 'vue',
  files: [{ path: 'ToggleSettingList.vue', target: 'components/blocks/ToggleSettingList.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/section-card.json'],
})

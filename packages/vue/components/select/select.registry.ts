import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'select',
  type: 'registry:ui',
  categories: ['control'],
  framework: 'vue',
  description:
    'Dropdown select primitive — single-select with optional groups, descriptions per item, headless popover mode (reka-ui), and zero-JS styled NativeSelect for lightweight/mobile use.',
  files: [
    { path: 'Select.vue', target: 'components/ui/select/Select.vue' },
    { path: 'SelectContent.vue', target: 'components/ui/select/SelectContent.vue' },
    { path: 'SelectGroup.vue', target: 'components/ui/select/SelectGroup.vue' },
    { path: 'SelectItem.vue', target: 'components/ui/select/SelectItem.vue' },
    { path: 'SelectItemText.vue', target: 'components/ui/select/SelectItemText.vue' },
    { path: 'SelectLabel.vue', target: 'components/ui/select/SelectLabel.vue' },
    { path: 'SelectScrollDownButton.vue', target: 'components/ui/select/SelectScrollDownButton.vue' },
    { path: 'SelectScrollUpButton.vue', target: 'components/ui/select/SelectScrollUpButton.vue' },
    { path: 'SelectSeparator.vue', target: 'components/ui/select/SelectSeparator.vue' },
    { path: 'SelectTrigger.vue', target: 'components/ui/select/SelectTrigger.vue' },
    { path: 'SelectValue.vue', target: 'components/ui/select/SelectValue.vue' },
    { path: 'NativeSelect.vue', target: 'components/ui/select/NativeSelect.vue' },
    { path: 'index.ts', target: 'components/ui/select/index.ts' },
    { path: 'option-types.ts', target: 'components/ui/select/option-types.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})

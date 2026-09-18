import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'switch',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'On/off toggle — visual analog of a hardware switch. Use for binary settings where the change takes effect immediately, not for form fields that submit later (use Checkbox there).',
  files: [
    { path: 'Switch.vue', target: 'components/ui/switch/Switch.vue' },
    { path: 'index.ts', target: 'components/ui/switch/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})

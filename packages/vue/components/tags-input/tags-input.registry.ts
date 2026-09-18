import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tags-input',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'Multi-tag input — type a value, hit Enter, get a Chip. Backspace removes the last tag. Use for email recipient lists, tag sets, and free-form keyword inputs.',
  files: [
    { path: 'TagsInput.vue', target: 'components/ui/tags-input/TagsInput.vue' },
    { path: 'TagsInputInput.vue', target: 'components/ui/tags-input/TagsInputInput.vue' },
    { path: 'TagsInputItem.vue', target: 'components/ui/tags-input/TagsInputItem.vue' },
    { path: 'TagsInputItemDelete.vue', target: 'components/ui/tags-input/TagsInputItemDelete.vue' },
    { path: 'TagsInputItemText.vue', target: 'components/ui/tags-input/TagsInputItemText.vue' },
    { path: 'index.ts', target: 'components/ui/tags-input/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'mentions',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'Textarea with trigger-character autocomplete and companion MentionTag with Twitter/X-style hover profile card popup.',
  files: [
    { path: 'Mentions.vue', target: 'components/ui/mentions/Mentions.vue' },
    { path: 'MentionTag.vue', target: 'components/ui/mentions/MentionTag.vue' },
    { path: 'caret-position.ts', target: 'components/ui/mentions/caret-position.ts' },
    { path: 'index.ts', target: 'components/ui/mentions/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/hover-card.json',
    'https://uipkge.dev/r/avatar.json',
  ],
})

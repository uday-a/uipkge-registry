import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'content-calendar-matrix',
  type: 'registry:block',
  categories: ['media', 'app', 'marketing'],
  description:
    'Editorial publishing calendar and content matrix with pacing KPI summary cards, channel filter tabs, month picker, publication status pipeline, author avatars, SEO keywords, and contextual action menus.',
  framework: 'vue',
  files: [{ path: 'ContentCalendarMatrix.vue', target: 'components/blocks/ContentCalendarMatrix.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/table.json',
  ],
})

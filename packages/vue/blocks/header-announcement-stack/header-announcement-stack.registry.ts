import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'header-announcement-stack',
  title: 'Header — Announcement Stack',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-tier site header: a dismissible announcement strip above a sticky navbar, where dismissing the strip collapses it and leaves the navbar flush against the viewport top.',
  framework: 'vue',
  files: [{ path: 'HeaderAnnouncementStack.vue', target: 'components/blocks/HeaderAnnouncementStack.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
  ],
})

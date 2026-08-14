import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'announcement-corner-toast',
  title: 'Announcement — Corner Card',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Corner announcement card that slides in after a delay carrying a thumbnail, headline, supporting line, and two actions, staying out of the page flow entirely.',
  framework: 'vue',
  files: [{ path: 'AnnouncementCornerToast.vue', target: 'components/blocks/AnnouncementCornerToast.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

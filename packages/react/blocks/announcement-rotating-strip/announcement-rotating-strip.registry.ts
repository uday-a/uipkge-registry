import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'announcement-rotating-strip',
  title: 'Announcement — Rotating Strip',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Announcement bar that cycles through several messages on a timer, pausing on hover and on focus, with dot controls for stepping between them manually.',
  files: [{ path: 'AnnouncementRotatingStrip.tsx', target: 'components/blocks/AnnouncementRotatingStrip.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})

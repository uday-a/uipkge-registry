import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'announcement-banner-split',
  title: 'Announcement — Split Banner',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Full-width announcement band split between a labelled message column and an action column, sized for release notes and maintenance notices rather than promotions.',
  files: [{ path: 'AnnouncementBannerSplit.tsx', target: 'components/blocks/AnnouncementBannerSplit.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

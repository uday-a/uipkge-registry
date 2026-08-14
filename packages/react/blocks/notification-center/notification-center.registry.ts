import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'notification-center',
  type: 'registry:block',
  categories: ['communication', 'dashboard'],
  description:
    'Full-page notification center: unread badge, mark-all-read, All/Unread/Mentions tabs with functional filtering, day-grouped rows (Today / Earlier) pairing category icon tiles with titles, bodies, relative timestamps, unread dots and hover actions (mark read, dismiss). Per-tab empty states included; swap `notifications` for your source.',
  files: [{ path: 'NotificationCenter.tsx', target: 'components/blocks/NotificationCenter.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/relative-time.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

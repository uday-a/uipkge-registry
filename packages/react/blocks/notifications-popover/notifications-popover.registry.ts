import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'notifications-popover',
  type: 'registry:block',
  categories: ['communication', 'dashboard', 'overlay'],
  description:
    'Header-grade notifications panel. Slot-trigger Popover the consumer wraps around their own Bell button. Filter tabs (All/Unread), Today/Earlier groups, category-coloured accent bars, hover-dismiss, mark-all-read, slide-in animation. Slot receives `unreadCount` so the trigger can show a badge.',
  files: [
    {
      path: 'NotificationsPopover.tsx',
      target: 'components/blocks/NotificationsPopover.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/popover.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'announcement-countdown-bar',
  title: 'Announcement — Countdown Bar',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Top strip counting down to a deadline in days, hours, minutes and seconds, with the offer line, an inline CTA, and a dismiss control that keeps it closed for the session.',
  framework: 'vue',
  files: [{ path: 'AnnouncementCountdownBar.vue', target: 'components/blocks/AnnouncementCountdownBar.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

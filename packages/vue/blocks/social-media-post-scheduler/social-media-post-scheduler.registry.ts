import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'social-media-post-scheduler',
  type: 'registry:block',
  categories: ['marketing', 'app'],
  description:
    'Multi-platform social media composer and post scheduler. Features channel toggles, rich text composer with emoji & hashtag insertion, character counter, media upload preview, scheduled time picker with best-time recommendations, auto-repost toggle, and high-fidelity live social feed previews for X (Twitter), LinkedIn, Instagram, and Threads.',
  framework: 'vue',
  files: [{ path: 'SocialMediaPostScheduler.vue', target: 'components/blocks/SocialMediaPostScheduler.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

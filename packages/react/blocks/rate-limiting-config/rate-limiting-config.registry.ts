import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rate-limiting-config',
  type: 'registry:block',
  categories: ['devops', 'app', 'dashboard'],
  description:
    'Cloudflare/Upstash style API rate limiting rules builder and token bucket traffic monitor with 4 health metrics cards, interactive token bucket vs sliding window simulation slider, and configured mitigation rules table with status controls and contextual action menus.',
  files: [{ path: 'RateLimitingConfig.tsx', target: 'components/blocks/RateLimitingConfig.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})

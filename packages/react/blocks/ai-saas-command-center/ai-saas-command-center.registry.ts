import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ai-saas-command-center',
  type: 'registry:block',
  categories: ['ai', 'analytics', 'dashboard', 'app'],
  description:
    'Modern AI SaaS platform command center with real-time token burn telemetry, GPU cluster health, latency percentiles, and cost anomaly alerts.',
  files: [{ path: 'AiSaasCommandCenter.tsx', target: 'components/blocks/AiSaasCommandCenter.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

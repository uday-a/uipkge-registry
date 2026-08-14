import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'daily-standup-summary',
  type: 'registry:block',
  categories: ['productivity', 'collaboration', 'dashboard', 'app'],
  description:
    'Slack and Geekbot style async engineering daily standup summary with squad pulse cards, critical blocker alert callout, structured yesterday/today/blockers submission entries, reaction counts, and thread actions.',
  framework: 'react',
  files: [{ path: 'DailyStandupSummary.tsx', target: 'components/blocks/DailyStandupSummary.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

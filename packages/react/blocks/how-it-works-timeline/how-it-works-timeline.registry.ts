import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'how-it-works-timeline',
  title: 'How It Works — Vertical Timeline',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Vertical numbered timeline with a continuous rail, per-stage status badge, outcome bullets, and a paired detail card — for onboarding or implementation narratives that need more room than a three-up row.',
  files: [{ path: 'HowItWorksTimeline.tsx', target: 'components/blocks/HowItWorksTimeline.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

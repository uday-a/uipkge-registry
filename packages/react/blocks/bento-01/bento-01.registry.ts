import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bento-01',
  title: 'Telemetry Bento',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'High-density bento grid featuring an interactive AI query copilot workbench, real-time edge network telemetry feed, live latency radar, and SOC 2 compliance vault status.',
  framework: 'react',
  files: [{ path: 'Bento01.tsx', target: 'components/blocks/Bento01.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'logo-ticker-infinite',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Infinite marquee brand partner ticker with sector category filters, speed and pause controls, and interactive telemetry hover cards.',
  files: [{ path: 'LogoTickerInfinite.tsx', target: 'components/blocks/LogoTickerInfinite.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/card.json'],
})

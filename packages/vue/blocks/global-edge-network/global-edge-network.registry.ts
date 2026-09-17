import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'global-edge-network',
  type: 'registry:block',
  categories: ['dashboard', 'devops', 'analytics'],
  description:
    'Cloudflare Radar and Vercel Edge style infrastructure console with real-time anycast telemetry, interactive DottedMapChart with Bezier flow corridors, P95 latency HUD metrics, and live edge node routing table.',
  framework: 'vue',
  files: [
    { path: 'GlobalEdgeNetwork.vue', target: 'components/blocks/GlobalEdgeNetwork.vue' },
    { path: 'index.ts', target: 'components/blocks/global-edge-network/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/dotted-map-chart.json'],
})

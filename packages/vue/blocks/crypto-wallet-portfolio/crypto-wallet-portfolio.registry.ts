import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'crypto-wallet-portfolio',
  type: 'registry:block',
  categories: ['finance', 'app', 'dashboard'],
  description:
    'Coinbase and Phantom-style multi-asset crypto holdings dashboard: treasury header with address copy and network badge, portfolio balance hero with 24h PnL and multi-asset allocation bar, asset holdings table with real-time token metrics, and an interactive quick swap calculator.',
  framework: 'vue',
  files: [{ path: 'CryptoWalletPortfolio.vue', target: 'components/blocks/CryptoWalletPortfolio.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

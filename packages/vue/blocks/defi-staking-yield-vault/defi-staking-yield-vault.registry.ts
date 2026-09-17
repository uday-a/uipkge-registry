import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'defi-staking-yield-vault',
  type: 'registry:block',
  categories: ['finance', 'app', 'dashboard'],
  description:
    'Nodeka and Uniswap-inspired decentralized finance staking yield vault, liquidity pool APY calculator, and reward claimer with live TVL metrics, multi-tier lockup multipliers, and real-time yield simulator.',
  framework: 'vue',
  files: [{ path: 'DefiStakingYieldVault.vue', target: 'components/blocks/DefiStakingYieldVault.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/table.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'defi-staking-yield-vault',
  type: 'registry:block',
  categories: ['finance', 'app', 'dashboard'],
  description:
    'Nodeka and Uniswap-inspired decentralized finance staking yield vault, liquidity pool APY calculator, and reward claimer with live TVL metrics, multi-tier lockup multipliers, and real-time yield simulator.',
  files: [{ path: 'DefiStakingYieldVault.tsx', target: 'components/blocks/DefiStakingYieldVault.tsx' }],
  dependencies: ['lucide-react'],
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

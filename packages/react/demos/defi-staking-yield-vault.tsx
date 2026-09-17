import Story from '../../components/story/Story'
import { DefiStakingYieldVault } from '@react-registry-blocks/defi-staking-yield-vault/DefiStakingYieldVault'

export default function DefiStakingYieldVaultDemo() {
  return (
    <Story
      title="Default"
      description="Nodeka and Uniswap-inspired decentralized finance staking yield vault, liquidity pool APY calculator, and reward claimer with live TVL metrics, multi-tier lockup multipliers, and real-time yield simulator."
    >
      <DefiStakingYieldVault />
    </Story>
  )
}

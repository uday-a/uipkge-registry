import Story from '../../components/story/Story'
import { LoyaltyRewardsTierHub } from '@react-registry-blocks/loyalty-rewards-tier-hub/LoyaltyRewardsTierHub'

export default function LoyaltyRewardsTierHubDemo() {
  return (
    <Story
      title="Default"
      description="VIP customer loyalty tier dashboard with points wallet, Diamond progress tracker, 4 tier privilege perks, 3 redeemable catalog rewards, and points transaction ledger."
    >
      <LoyaltyRewardsTierHub />
    </Story>
  )
}

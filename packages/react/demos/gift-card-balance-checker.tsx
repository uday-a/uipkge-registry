import Story from '../../components/story/Story'
import { GiftCardBalanceChecker } from '@react-registry-blocks/gift-card-balance-checker/GiftCardBalanceChecker'

export default function GiftCardBalanceCheckerDemo() {
  return (
    <Story
      title="Default Storefront View"
      description="Customer gift card balance lookup with interactive card hero, quick reloads, and detailed redemption history."
    >
      <GiftCardBalanceChecker />
    </Story>
  )
}

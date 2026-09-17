import Story from '../../components/story/Story'
import { BillingAccount } from '@react-registry-blocks/billing-account/BillingAccount'

export default function BillingAccountDemo() {
  return (
    <Story
      title="Default"
      description="Full account billing page: current plan with Pro badge, usage meters, payment method, and billing history."
    >
      <BillingAccount />
    </Story>
  )
}

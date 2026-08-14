import { PricingEnterpriseSlaCard } from '@/components/blocks/pricing-enterprise-sla-card'
import { Story } from '@/components/story/Story'

export default function PricingEnterpriseSlaCardDemo() {
  return (
    <Story
      title="Default"
      description="Enterprise contract specification card with penalty-backed SLAs, compliance badges, and private deployment options."
    >
      <PricingEnterpriseSlaCard />
    </Story>
  )
}

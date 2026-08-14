import { HeroSaasMetricsDashboard } from '@/components/blocks/hero-saas-metrics-dashboard'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="SaaS hero section with timeframe filter and dynamic SVG telemetry chart">
      <div className="w-full">
        <HeroSaasMetricsDashboard />
      </div>
    </Story>
  )
}

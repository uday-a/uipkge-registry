import { CustomerMetricsBand } from '@/components/blocks/customer-metrics-band'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Customer velocity and ROI telemetry band with cohort segmentation">
      <div className="w-full">
        <CustomerMetricsBand />
      </div>
    </Story>
  )
}

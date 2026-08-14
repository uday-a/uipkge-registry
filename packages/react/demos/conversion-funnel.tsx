import Story from '../../components/story/Story'
import { ConversionFunnel } from '@react-registry-blocks/conversion-funnel/ConversionFunnel'

const stages = [
  { name: 'Views', value: 72000 },
  { name: 'Cart', value: 38200 },
  { name: 'Checkout', value: 16800 },
  { name: 'Purchase', value: 5600 },
]

export default function ConversionFunnelDemo() {
  return (
    <Story
      title="Conversion Funnel"
      description="SmoothFunnel chart read as a single horizontal flow: a count strip above each stage, percent-of-top pills inside each band, and stage names with stage-to-stage retention below. Works for any 3–6 stage drop-off (acquisition, checkout, onboarding)."
    >
      <ConversionFunnel data={stages} />
    </Story>
  )
}

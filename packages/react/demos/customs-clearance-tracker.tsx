import Story from '../../components/story/Story'
import { CustomsClearanceTracker } from '@react-registry-blocks/customs-clearance-tracker/CustomsClearanceTracker'

export default function CustomsClearanceTrackerDemo() {
  return (
    <Story
      title="Default"
      description="International import/export customs declaration lifecycle stepper, tariff calculation breakdown, and HTSUS declared commodity line items."
    >
      <CustomsClearanceTracker />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { CustomerJourneyMap } from '@react-registry-blocks/customer-journey-map/CustomerJourneyMap'

export default function CustomerJourneyMapDemo() {
  return (
    <Story
      title="Customer Journey & Growth Lifecycle Map"
      description="Visual lifecycle funnel mapping touchpoints across Acquisition, Activation, Monetization, and Retention with conversion velocity, sentiment indicators, friction points, and growth experiments."
    >
      <CustomerJourneyMap />
    </Story>
  )
}

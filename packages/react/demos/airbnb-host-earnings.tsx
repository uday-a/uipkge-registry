import Story from '../../components/story/Story'
import { AirbnbHostEarnings } from '@react-registry-blocks/airbnb-host-earnings/AirbnbHostEarnings'

export default function AirbnbHostEarningsDemo() {
  return (
    <Story
      title="Default"
      description="Short-term rental host revenue dashboard with occupancy metrics, payout schedule, dynamic pricing recommendations, and itemized reservation payouts."
    >
      <AirbnbHostEarnings />
    </Story>
  )
}

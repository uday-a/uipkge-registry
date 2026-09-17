import Story from '../../components/story/Story'
import { PriceDropAlertCard } from '@react-registry-blocks/price-drop-alert-card/PriceDropAlertCard'

export default function PriceDropAlertCardDemo() {
  return (
    <Story
      title="Price Drop Alert & Tracker (Default)"
      description="Interactive wishlist price tracker featuring 90-day historical trend chart, dynamic target threshold slider, notification trigger configuration, and active tracked products table."
    >
      <PriceDropAlertCard />
    </Story>
  )
}

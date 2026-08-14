import Story from '../../components/story/Story'
import { InventoryReorderForecast } from '@react-registry-blocks/inventory-reorder-forecast/InventoryReorderForecast'

export default function InventoryReorderForecastDemo() {
  return (
    <Story
      title="Default"
      description="Supply chain inventory replenishment planner: facility selector, 4 forecasting KPI metric cards, safety stock triggers, multi-SKU demand table, and automated purchase order generation."
    >
      <InventoryReorderForecast />
    </Story>
  )
}

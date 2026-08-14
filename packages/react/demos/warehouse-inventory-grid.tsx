import Story from '../../components/story/Story'
import { WarehouseInventoryGrid } from '@react-registry-blocks/warehouse-inventory-grid/WarehouseInventoryGrid'

export default function WarehouseInventoryGridDemo() {
  return (
    <Story
      title="Default"
      description="WMS warehouse inventory management grid: facility selector, 4 KPI metric cards, safety stock triggers, searchable SKU table with bin badges, and slide-over relocation drawer."
    >
      <WarehouseInventoryGrid />
    </Story>
  )
}

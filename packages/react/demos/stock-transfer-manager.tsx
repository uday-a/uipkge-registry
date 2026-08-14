import Story from '../../components/story/Story'
import { StockTransferManager } from '@react-registry-blocks/stock-transfer-manager'

export default function StockTransferManagerDemo() {
  return (
    <Story title="Default" description="Multi-warehouse inventory transfer and bin management console.">
      <div className="p-4">
        <StockTransferManager />
      </div>
    </Story>
  )
}

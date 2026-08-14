import Story from '../../components/story/Story'
import { VendorSupplierPortal } from '@react-registry-blocks/vendor-supplier-portal'

export default function VendorSupplierPortalDemo() {
  return (
    <Story
      title="Default"
      description="Supplier performance scorecard with active purchase order console and contracted catalog pricing."
    >
      <div className="p-4">
        <VendorSupplierPortal />
      </div>
    </Story>
  )
}

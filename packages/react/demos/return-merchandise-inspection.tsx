import Story from '../../components/story/Story'
import { ReturnMerchandiseInspection } from '@react-registry-blocks/return-merchandise-inspection/ReturnMerchandiseInspection'

export default function ReturnMerchandiseInspectionDemo() {
  return (
    <>
      <Story
        title="Default (Grade A Restock)"
        description="Standard intake inspection station with item UPC verification, Grade A condition rating, and primary inventory putaway routing."
      >
        <ReturnMerchandiseInspection />
      </Story>

      <Story
        title="Grade B (Outlet Store Re-routing)"
        description="Open box item evaluated for secondary outlet store sales channel with standard priority putaway."
      >
        <ReturnMerchandiseInspection initialGrade="grade-b" />
      </Story>

      <Story
        title="Grade D (Quarantine & Vendor RTV)"
        description="Damaged merchandise intake triggering quarantine hold, RTV vendor credit claim, and defect documentation."
      >
        <ReturnMerchandiseInspection initialGrade="grade-d" initialRefundAction="full-refund" />
      </Story>

      <Story
        title="Store Credit Incentive (+10% Bonus)"
        description="Customer return settlement configured for instant store credit digital gift card with +10% loyalty bonus value."
      >
        <ReturnMerchandiseInspection initialGrade="grade-a" initialRefundAction="store-credit" />
      </Story>

      <Story
        title="Completed Disposition Receipt"
        description="Post-inspection confirmation screen with generated Pallet/Tote LPN barcode label and printable warehouse manifest."
      >
        <ReturnMerchandiseInspection initialSubmitted={true} />
      </Story>
    </>
  )
}

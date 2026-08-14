import Story from '../../components/story/Story'
import { ReturnsPortal } from '@react-registry-blocks/returns-portal/ReturnsPortal'

export default function ReturnsPortalDemo() {
  return (
    <>
      <Story title="Default" description="Initial order lookup step with order number and email inputs.">
        <ReturnsPortal />
      </Story>

      <Story
        title="Select Items"
        description="Order items list with selection checkboxes, return reason selectors, and quantities."
      >
        <ReturnsPortal initialStep={2} />
      </Story>

      <Story
        title="Choose Resolution"
        description="Resolution selector with exchange sizing, +10% bonus store credit, and original payment refund."
      >
        <ReturnsPortal initialStep={3} />
      </Story>

      <Story
        title="Confirmation & Label"
        description="Success screen with instant prepaid return label download, QR code drop-off pass, and return summary."
      >
        <ReturnsPortal initialStep={4} />
      </Story>

      <Story title="Compact" description="Self-serve returns wizard at mobile container width.">
        <div className="mx-auto max-w-md">
          <ReturnsPortal initialStep={2} />
        </div>
      </Story>
    </>
  )
}

import Story from '../../components/story/Story'
import { OrderConfirmation } from '@react-registry-blocks/order-confirmation/OrderConfirmation'

export default function OrderConfirmationDemo() {
  return (
    <Story
      title="Default"
      description="Post-purchase order confirmation & tracking page featuring success banner, 4-step progress stepper, itemized summary, and customer delivery cards."
    >
      <OrderConfirmation />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { CheckoutFlow } from '@react-registry-blocks/checkout-flow/CheckoutFlow'

const sampleCart = [
  { id: '1', name: 'Aurora desk lamp', qty: 1, price: 89, image: '' },
  { id: '2', name: 'Walnut coaster set (4)', qty: 2, price: 24, image: '' },
  { id: '3', name: 'Linen throw blanket', qty: 1, price: 64, image: '' },
]

const singleItem = [{ id: 'a', name: 'Annual subscription', qty: 1, price: 99, image: '' }]

async function fakeSuccess() {
  await new Promise((r) => setTimeout(r, 1200))
  return { orderId: 'ORDER-' + Math.random().toString(36).slice(2, 8).toUpperCase() }
}

async function fakeFailure(): Promise<{ orderId: string }> {
  await new Promise((r) => setTimeout(r, 900))
  throw new Error('Issuer rejected the charge. Please contact your bank.')
}

export default function CheckoutFlowDemo() {
  return (
    <>
      <Story
        title="3-step happy path"
        description="Cart → Payment → Confirm → Success (with confetti + animated checkmark). Walk through it."
      >
        <CheckoutFlow items={sampleCart} currency="USD" taxRate={0.0825} shippingFee={6.99} onSubmit={fakeSuccess} />
      </Story>

      <Story
        title="Error path"
        description="Submit rejects at the confirm step → animated X + retry button that returns to the payment form."
      >
        <CheckoutFlow items={sampleCart} currency="USD" onSubmit={fakeFailure} />
      </Story>

      <Story title="Single-item cart" description="Minimal cart screen when there's only one line item.">
        <CheckoutFlow items={singleItem} currency="USD" onSubmit={fakeSuccess} />
      </Story>
    </>
  )
}

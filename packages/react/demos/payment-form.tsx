import Story from '../../components/story/Story'
import { PaymentForm } from '@react-registry-blocks/payment-form/PaymentForm'

async function fakeSuccess() {
  await new Promise((r) => setTimeout(r, 1500))
}

async function fakeFailure() {
  await new Promise((r) => setTimeout(r, 1200))
  throw new Error('Card declined. Try a different payment method.')
}

function onWallet(kind: string) {
  // In production, the consumer wires Apple/Google/PayPal SDK here.
  console.log('wallet selected:', kind)
}

export default function PaymentFormDemo() {
  return (
    <>
      <Story
        title="Default ($49.99)"
        description="All wallets + card form. The card preview mirrors typed values; CVC focus flips the card. Fake processor resolves after 1.5s."
      >
        <PaymentForm amount={49.99} onSubmit={fakeSuccess} onWallet={onWallet} />
      </Story>

      <Story
        title="Failure path"
        description="Submit rejects. Form shakes and you get a toast — the success animation is skipped."
      >
        <PaymentForm amount={120} onSubmit={fakeFailure} />
      </Story>

      <Story title="Cards only (no wallets)" description="Disable the wallet shortcut row with showWallets={false}.">
        <PaymentForm amount={9.5} showWallets={false} onSubmit={fakeSuccess} />
      </Story>

      <Story title="Subset of wallets" description="Pick which wallet buttons render via wallets.">
        <PaymentForm amount={14.99} wallets={['apple']} onSubmit={fakeSuccess} />
      </Story>
    </>
  )
}

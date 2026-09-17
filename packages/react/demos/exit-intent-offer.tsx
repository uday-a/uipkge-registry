import Story from '../../components/story/Story'
import { ExitIntentOffer } from '@react-registry-blocks/exit-intent-offer/ExitIntentOffer'
// ExitIntentOffer is the block file the user installs. Open
// `components/blocks/ExitIntentOffer.tsx` after install to change the offer.
// The listener watches for the pointer leaving through the top edge only.

export default function ExitIntentOfferDemo() {
  return (
    <Story
      title="Exit Intent — Offer"
      description="Fires once per session when the pointer leaves toward the browser chrome, offering an extended trial. Move the cursor above the frame to trigger it."
    >
      <ExitIntentOffer />
    </Story>
  )
}

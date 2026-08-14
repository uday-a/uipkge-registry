import Story from '../../components/story/Story'
import { WaitlistReferralPosition } from '@react-registry-blocks/waitlist-referral-position/WaitlistReferralPosition'
// WaitlistReferralPosition is the block file the user installs. Open
// `components/blocks/WaitlistReferralPosition.tsx` after install to replace
// the stub position with a real queue lookup.

export default function WaitlistReferralPositionDemo() {
  return (
    <Story
      title="Waitlist — Referral Position"
      description="Waitlist capture that swaps on submit to a queue position, a referral link that moves it, and a progress meter toward the next access tier."
    >
      <WaitlistReferralPosition />
    </Story>
  )
}

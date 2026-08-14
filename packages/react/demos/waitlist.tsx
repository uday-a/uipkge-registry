import Story from '../../components/story/Story'
import { Waitlist } from '@react-registry-blocks/waitlist/Waitlist'

export default function WaitlistDemo() {
  return (
    <Story
      title="Waitlist"
      description="Pre-launch signup page. Split layout with pitch + benefit bullets on the left, email capture card that flips to a queue-position confirmation with referral hint on the right."
    >
      <Waitlist />
    </Story>
  )
}

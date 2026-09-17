import Story from '../../components/story/Story'
import { ExitIntentNewsletter } from '@react-registry-blocks/exit-intent-newsletter/ExitIntentNewsletter'
// ExitIntentNewsletter is the block file the user installs. Open
// `components/blocks/ExitIntentNewsletter.tsx` after install to wire the
// submit handler; dismissal is session-scoped.

export default function ExitIntentNewsletterDemo() {
  return (
    <Story
      title="Exit Intent — Newsletter"
      description="Exit-intent capture for the newsletter rather than a discount, naming the last issue so the ask is concrete rather than generic."
    >
      <ExitIntentNewsletter />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { NewsletterSignup } from '@react-registry-blocks/newsletter-signup/NewsletterSignup'

export default function NewsletterSignupDemo() {
  return (
    <>
      <Story
        title="Centered"
        description="Muted mail tile, headline and copy, joined input + button form with fine print. Flips to a subscribed confirmation after submit."
      >
        <NewsletterSignup variant="centered" />
      </Story>

      <Story
        title="Split"
        description="Bordered card container with copy and check-mark benefits on the left, form on the right. Flips to a subscribed confirmation after submit."
      >
        <NewsletterSignup variant="split" />
      </Story>
    </>
  )
}

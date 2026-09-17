import Story from '../../components/story/Story'
import { FooterMegaNewsletter } from '@react-registry-blocks/footer-mega-newsletter/FooterMegaNewsletter'
// FooterMegaNewsletter is the block file the user installs. Open
// `components/blocks/FooterMegaNewsletter.tsx` after install to wire the
// signup form; the columns render from a single `sections` array.

export default function FooterMegaNewsletterDemo() {
  return (
    <Story
      title="Footer — Mega with Newsletter"
      description="Large footer: newsletter signup and status line beside five link columns, over a social row and a legal bar with locale and theme controls."
    >
      <FooterMegaNewsletter />
    </Story>
  )
}

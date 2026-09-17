import Story from '../../components/story/Story'
import { Footer01 } from '@react-registry-blocks/footer-01/Footer01'
// Footer01 ships with a local newsletter form (no backend). Wire the
// `subscribe()` handler in `components/blocks/Footer01.tsx` to your
// mailing-list provider after install.

export default function Footer01Demo() {
  return (
    <Story
      title="Footer 01"
      description="Site footer. Brand + newsletter on the left, four link columns on the right, separator, copyright, social icons."
    >
      <Footer01 />
    </Story>
  )
}

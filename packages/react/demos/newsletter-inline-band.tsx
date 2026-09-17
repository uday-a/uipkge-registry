import Story from '../../components/story/Story'
import { NewsletterInlineBand } from '@react-registry-blocks/newsletter-inline-band/NewsletterInlineBand'
// NewsletterInlineBand is the block file the user installs. Open
// `components/blocks/NewsletterInlineBand.tsx` after install to wire the
// submit handler; validation is the browser's own email type.

export default function NewsletterInlineBandDemo() {
  return (
    <Story
      title="Newsletter — Inline Band"
      description="Slim signup band: inline field, submit, subscriber count as proof, and a status row that is reserved up front so confirming does not shift the page."
    >
      <NewsletterInlineBand />
    </Story>
  )
}

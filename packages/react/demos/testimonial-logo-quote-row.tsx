import Story from '../../components/story/Story'
import { TestimonialLogoQuoteRow } from '@react-registry-blocks/testimonial-logo-quote-row/TestimonialLogoQuoteRow'
// TestimonialLogoQuoteRow is the block file the user installs. Open
// `components/blocks/TestimonialLogoQuoteRow.tsx` after install to swap the
// wordmarks for real logo files; one sentence per quote is the constraint.

export default function TestimonialLogoQuoteRowDemo() {
  return (
    <Story
      title="Testimonial — Logo & Quote Row"
      description="Three inline logo-and-quote pairs with compact attribution — the lightweight proof row for pages that cannot spare a full testimonial section."
    >
      <TestimonialLogoQuoteRow />
    </Story>
  )
}

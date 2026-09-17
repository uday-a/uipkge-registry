import Story from '../../components/story/Story'
import { TestimonialSocialCards } from '@react-registry-blocks/testimonial-social-cards/TestimonialSocialCards'
// TestimonialSocialCards is the block file the user installs. Open
// `components/blocks/TestimonialSocialCards.tsx` after install to wire real
// posts. CSS columns drive the masonry, so no JS layout pass is needed.

export default function TestimonialSocialCardsDemo() {
  return (
    <Story
      title="Testimonial — Social Cards"
      description="Social-post style endorsements in a masonry column flow — handle, avatar, timestamp, body, and engagement counts, written as posts rather than polished quotes."
    >
      <TestimonialSocialCards />
    </Story>
  )
}

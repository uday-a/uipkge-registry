import Story from '../../components/story/Story'
import { TestimonialMarqueeScroll } from '@react-registry-blocks/testimonial-marquee-scroll/TestimonialMarqueeScroll'
// TestimonialMarqueeScroll is the block file the user installs. Open
// `components/blocks/TestimonialMarqueeScroll.tsx` after install to edit the
// quotes. The track duplicates its children to loop seamlessly.

export default function TestimonialMarqueeScrollDemo() {
  return (
    <Story
      title="Testimonial — Marquee Scroll"
      description="Two counter-scrolling rows of quote cards. Hover pauses the row under the cursor, reduced-motion stops both, and edge masks fade the cards into the page."
    >
      <TestimonialMarqueeScroll />
    </Story>
  )
}

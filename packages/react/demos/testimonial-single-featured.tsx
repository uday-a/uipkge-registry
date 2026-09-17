import Story from '../../components/story/Story'
import { TestimonialSingleFeatured } from '@react-registry-blocks/testimonial-single-featured/TestimonialSingleFeatured'
// TestimonialSingleFeatured is the block file the user installs. Open
// `components/blocks/TestimonialSingleFeatured.tsx` after install to replace
// the quote and metric. Keep the quote short; the size is doing the work.

export default function TestimonialSingleFeaturedDemo() {
  return (
    <Story
      title="Testimonial — Single Featured"
      description="One pull quote given the whole section — oversized text, avatar attribution, customer wordmark, and a supporting result metric alongside."
    >
      <TestimonialSingleFeatured />
    </Story>
  )
}

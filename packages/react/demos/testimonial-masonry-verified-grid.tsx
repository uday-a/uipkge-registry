import { TestimonialMasonryVerifiedGrid } from '@/components/blocks/testimonial-masonry-verified-grid'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Masonry grid of verified testimonials with category filters and metric badges">
      <div className="w-full">
        <TestimonialMasonryVerifiedGrid />
      </div>
    </Story>
  )
}

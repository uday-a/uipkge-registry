import { TestimonialQuoteCarouselTelemetry } from '@/components/blocks/testimonial-quote-carousel-telemetry'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story
      title="Default"
      description="Enterprise case study spotlight with interactive company switcher and telemetry KPIs"
    >
      <div className="w-full">
        <TestimonialQuoteCarouselTelemetry />
      </div>
    </Story>
  )
}

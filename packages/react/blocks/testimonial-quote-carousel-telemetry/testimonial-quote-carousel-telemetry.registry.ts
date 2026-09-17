import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonial-quote-carousel-telemetry',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Enterprise customer spotlight case study carousel with interactive company tabs, executive quotes, and verified quantitative telemetry KPIs.',
  files: [
    {
      path: 'TestimonialQuoteCarouselTelemetry.tsx',
      target: 'components/blocks/TestimonialQuoteCarouselTelemetry.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

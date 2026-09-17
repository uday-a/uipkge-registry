import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonial-marquee-scroll',
  title: 'Testimonial — Marquee Scroll',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two counter-scrolling marquee rows of quote cards that pause on hover and stop entirely under reduced-motion, with edge masks fading the cards into the page.',
  files: [{ path: 'TestimonialMarqueeScroll.tsx', target: 'components/blocks/TestimonialMarqueeScroll.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
  ],
})

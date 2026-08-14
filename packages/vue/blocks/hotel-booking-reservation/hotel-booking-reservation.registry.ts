import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hotel-booking-reservation',
  type: 'registry:block',
  categories: ['commerce', 'hospitality', 'booking', 'ecommerce', 'app'],
  description:
    'Luxury hotel room booking and reservation widget with interactive date range picker, guest & room steppers, room upgrade checkboxes, live reactive pricing breakdown, and instant reservation checkout.',
  framework: 'vue',
  files: [{ path: 'HotelBookingReservation.vue', target: 'components/blocks/HotelBookingReservation.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

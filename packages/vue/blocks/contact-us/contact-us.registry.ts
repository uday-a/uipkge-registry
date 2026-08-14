import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'contact-us',
  type: 'registry:block',
  categories: ['marketing'],
  title: 'Contact Us',
  framework: 'vue',
  description:
    'Two-column contact section. Left: eyebrow, headline, lede, icon contact rows (email / phone / office) and a live Mapbox map pinned to your office (pass access-token + location; falls back to a placeholder without a token). Right: a Card-wrapped form (name / email / company / subject Select / message Textarea) that swaps to a success state. Emits "submit" with the payload.',
  files: [{ path: 'ContactUs.vue', target: 'components/blocks/ContactUs.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/textarea.json',
    'https://uipkge.dev/r/map.json',
  ],
})

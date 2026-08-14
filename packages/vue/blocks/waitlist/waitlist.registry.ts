import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'waitlist',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Pre-launch signup page. Split layout with product pitch, logo mark, three benefit bullets on the left and an email capture card on the right that flips to a queue-position confirmation with referral hint after submit.',
  framework: 'vue',
  files: [{ path: 'Waitlist.vue', target: 'components/blocks/Waitlist.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
  ],
})

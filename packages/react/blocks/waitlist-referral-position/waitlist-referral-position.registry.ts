import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'waitlist-referral-position',
  title: 'Waitlist — Referral Position',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Waitlist capture that swaps on submit to show queue position, the referral link that moves it, and a progress meter to the next tier of early access.',
  files: [{ path: 'WaitlistReferralPosition.tsx', target: 'components/blocks/WaitlistReferralPosition.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

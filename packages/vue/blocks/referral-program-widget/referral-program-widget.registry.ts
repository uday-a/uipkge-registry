import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'referral-program-widget',
  type: 'registry:block',
  categories: ['marketing', 'dashboard'],
  description:
    'Rewardful and Viral Loops-style customer referral program and milestone reward tracker. Features a balance summary header with available credits and referral counts, shareable link and code copy actions with quick social sharing, a 4-tier milestone stepper with dynamic progress, and a recent referrals activity table with payout statuses.',
  framework: 'vue',
  files: [{ path: 'ReferralProgramWidget.vue', target: 'components/blocks/ReferralProgramWidget.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

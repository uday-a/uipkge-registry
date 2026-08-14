import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'influencer-campaign-card',
  type: 'registry:block',
  categories: ['marketing', 'dashboard', 'app'],
  description:
    'Creator partnership management card with verified creator hero profile, multi-channel reach demographics, 4-column campaign telemetry HUD, contract deliverables checklist with live asset telemetry, and affiliate promo code ROI tracker.',
  files: [{ path: 'InfluencerCampaignCard.tsx', target: 'components/blocks/InfluencerCampaignCard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

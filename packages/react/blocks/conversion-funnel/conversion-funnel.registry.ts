import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'conversion-funnel',
  type: 'registry:block',
  categories: ['analytics', 'dashboard'],
  description:
    'Horizontal conversion funnel with count strip above the SmoothFunnel chart and a stage-name + retention-from-previous footer below. Works for hiring (applied → hired), e-commerce (sessions → purchases), onboarding (signed up → activated). 3-6 stages. Theme-aware via OKLCH chart tokens.',
  files: [{ path: 'ConversionFunnel.tsx', target: 'components/blocks/ConversionFunnel.tsx' }],
  registryDependencies: ['https://uipkge.dev/r/smooth-funnel.json'],
})

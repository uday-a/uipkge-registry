import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'onboarding-equipment-provisioning',
  type: 'registry:block',
  categories: ['hr', 'app'],
  description:
    'Enterprise IT hardware, peripherals, and software license provisioning portal for new hires with primary workstation selection, display and peripheral bundles, security keys, cloud SaaS seats, and courier tracking.',
  files: [
    {
      path: 'OnboardingEquipmentProvisioning.tsx',
      target: 'components/blocks/OnboardingEquipmentProvisioning.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

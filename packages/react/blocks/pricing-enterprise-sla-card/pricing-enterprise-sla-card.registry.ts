import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-enterprise-sla-card',
  type: 'registry:block',
  categories: ['pricing', 'marketing'],
  framework: 'react',
  description:
    'Enterprise contract specification block detailing 99.999% SLA metrics, SOC2/HIPAA compliance, and dedicated VPC architecture.',
  files: [
    {
      path: 'PricingEnterpriseSlaCard.tsx',
      target: 'components/blocks/pricing-enterprise-sla-card/PricingEnterpriseSlaCard.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/pricing-enterprise-sla-card/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

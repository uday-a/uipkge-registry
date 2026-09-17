import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-enterprise-sla-card',
  type: 'registry:block',
  categories: ['pricing', 'marketing'],
  framework: 'vue',
  description:
    'Enterprise contract specification block detailing 99.999% SLA metrics, SOC2/HIPAA compliance, and dedicated VPC architecture.',
  files: [
    {
      path: 'PricingEnterpriseSlaCard.vue',
      target: 'components/blocks/pricing-enterprise-sla-card/PricingEnterpriseSlaCard.vue',
    },
    { path: 'index.ts', target: 'components/blocks/pricing-enterprise-sla-card/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

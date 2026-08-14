import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'insurance-eligibility-checker',
  type: 'registry:block',
  categories: ['healthcare', 'app'],
  description:
    'Real-time health insurance eligibility and benefits verification dashboard: patient member demographics, active payer status, individual deductible and out-of-pocket maximum progress trackers, primary care and specialist copay benefit cards, category-level coverage breakdown table with in/out-of-network rates, and Medicare secondary coordination of benefits.',
  files: [{ path: 'InsuranceEligibilityChecker.tsx', target: 'components/blocks/InsuranceEligibilityChecker.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

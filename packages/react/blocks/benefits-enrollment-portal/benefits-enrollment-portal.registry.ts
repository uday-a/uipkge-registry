import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'benefits-enrollment-portal',
  type: 'registry:block',
  categories: ['hr', 'app', 'form'],
  description:
    'Employee benefits open enrollment portal with interactive medical, dental, and vision plan comparisons, customizable 401(k) contribution slider with real-time employer match calculation, and a sticky paycheck impact summary.',
  files: [{ path: 'BenefitsEnrollmentPortal.tsx', target: 'components/blocks/BenefitsEnrollmentPortal.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
  ],
})

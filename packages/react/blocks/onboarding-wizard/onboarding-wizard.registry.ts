import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'onboarding-wizard',
  type: 'registry:block',
  categories: ['auth', 'app', 'onboarding'],
  description:
    'Multi-step workspace setup flow in a SectionCard: a four-step Stepper (Workspace → Team → Preferences → Done) with check icons on completed steps, a workspace-name input with live URL slug preview, teammate invites as removable email chips with a skip link, preference Switch rows, and a success panel with a glowing check circle. Footer carries Back/Continue actions plus a Step X of 4 counter. Data is stubbed inline — wire your API of choice.',
  files: [{ path: 'OnboardingWizard.tsx', target: 'components/blocks/OnboardingWizard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/stepper.json',
    'https://uipkge.dev/r/switch.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'onboarding-checklist',
  type: 'registry:block',
  categories: ['auth', 'app', 'onboarding'],
  description:
    'Progressive activation checklist card: header with title, an N of M complete counter and a linear Progress bar, tappable task rows with icon tiles, one-line descriptions and chevrons (completed tasks flip to a filled check tile with muted copy), a footer with a Skip for now ghost link and an X dismiss that fades the card out, and a success panel with a glowing check circle at 5 of 5. State is local — wire tasks to your own activation API.',
  files: [{ path: 'OnboardingChecklist.tsx', target: 'components/blocks/OnboardingChecklist.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
  ],
})

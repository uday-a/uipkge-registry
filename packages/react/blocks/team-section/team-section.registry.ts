import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'team-section',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Centered marketing team section. Eyebrow + headline + lede over a responsive member card grid (initials avatar, role badge, one-line bio, ghost social buttons). Members with a department field group under uppercase headers; variant="compact" drops bios for tighter cards. Roster is stub data — edit DEFAULT_MEMBERS or pass members.',
  files: [{ path: 'TeamSection.tsx', target: 'components/blocks/TeamSection.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

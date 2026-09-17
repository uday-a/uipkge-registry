import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'user-profile-page',
  type: 'registry:block',
  categories: ['auth', 'app'],
  description:
    'Profile page composition: gradient cover banner with an overlapping ringed avatar, identity row with role badge plus edit button and a kebab actions menu, an inline follower stats row, and tabs for Overview (bio + icon detail rows), Activity (muted-tile feed), and Projects (progress cards). All data is hardcoded inline for you to replace.',
  files: [{ path: 'UserProfilePage.tsx', target: 'components/blocks/UserProfilePage.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

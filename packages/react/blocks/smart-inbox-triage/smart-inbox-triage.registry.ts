import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'smart-inbox-triage',
  type: 'registry:block',
  categories: ['communication', 'productivity', 'layout'],
  description:
    'Superhuman-style high-velocity email inbox triage command center with keyboard shortcuts, split category tabs (VIP, Team & GitHub, Newsletters, Archived), dual-pane split reader, fast triage actions (Archive, Snooze, Star, Quick Reply), and command palette.',
  files: [{ path: 'SmartInboxTriage.tsx', target: 'components/blocks/SmartInboxTriage.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

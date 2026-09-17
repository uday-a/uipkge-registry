import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'inbox',
  type: 'registry:block',
  categories: ['communication', 'layout'],
  description:
    'Three-pane mail surface. Left rail: Compose button, folders (Inbox/Starred/Sent/Drafts/Spam/Trash) with unread counts, colour-coded labels with totals. Middle: searchable message list with sender, subject, preview, labels, attachment glyphs, star toggle, smart timestamps. Right: reader pane with subject, from/to, body, attachment chip, reply/forward/archive actions. Stateful demo — swap `mails` for your data source.',
  files: [{ path: 'Inbox.tsx', target: 'components/blocks/Inbox.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
  ],
})

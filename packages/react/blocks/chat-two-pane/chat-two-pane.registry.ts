import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'chat-two-pane',
  type: 'registry:block',
  categories: ['communication', 'layout'],
  description:
    'Two-pane messaging surface. Left rail: searchable conversation list with avatars, online dots, pinned section, unread badges, mute icons, last-message preview, smart timestamps. Right pane: active thread with day separators, own/peer bubbles, read ticks, typing indicator, attach/emoji/send composer. Stateful demo — replace `conversations` and `messagesByConvo` with your data layer.',
  files: [{ path: 'ChatTwoPane.tsx', target: 'components/blocks/ChatTwoPane.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'chat-thread',
  type: 'registry:block',
  categories: ['communication'],
  description:
    'Single-pane conversation surface. Peer header (avatar + online dot + call/video/more), grouped messages with day separators (Today/Yesterday/date), own vs. peer bubbles, read/delivered/sent ticks, typing indicator, composer with attach/emoji and Enter-to-send. Stateful demo; swap the `messages` ref for your transport.',
  files: [{ path: 'ChatThread.tsx', target: 'components/blocks/ChatThread.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

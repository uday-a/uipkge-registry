import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'peer-discussion-forum',
  type: 'registry:block',
  categories: ['education', 'app', 'community'],
  description:
    'StackOverflow and EdStem style student community Q&A thread with upvoting, accepted instructor answers, markdown code formatting, rich answer composer, and related discussions sidebar.',
  framework: 'vue',
  files: [{ path: 'PeerDiscussionForum.vue', target: 'components/blocks/PeerDiscussionForum.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

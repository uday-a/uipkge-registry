import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ai-llm-chat',
  type: 'registry:block',
  categories: ['ai', 'communication'],
  description:
    'ChatGPT/Claude-style LLM chat surface. Collapsible left sidebar with New chat, searchable thread history grouped Today/Yesterday/Previous 7 days/Earlier, account row. Centered conversation: empty state with suggested-prompt tiles, user/assistant turns with code-block rendering and copy/regenerate/feedback actions, streaming dots, stop button. Composer with model picker (Opus/Sonnet/Haiku), attach, Enter-to-send, autosizing textarea. Stateful demo — wire `send()` to your streaming endpoint.',
  framework: 'vue',
  files: [{ path: 'AiLlmChat.vue', target: 'components/blocks/AiLlmChat.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
  ],
})

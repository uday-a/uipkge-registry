import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'prompt-playground',
  type: 'registry:block',
  categories: ['ai', 'app'],
  description:
    'AI model prompt engineering studio & parameter tuner with system instructions, user input, temperature, max tokens, top-p sliders, JSON/stream modes, and interactive response evaluation.',
  files: [{ path: 'PromptPlayground.tsx', target: 'components/blocks/PromptPlayground.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

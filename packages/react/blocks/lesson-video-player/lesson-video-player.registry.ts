import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'lesson-video-player',
  type: 'registry:block',
  categories: ['education', 'app', 'media'],
  description:
    'Online lecture video player with playback speed selector, interactive timestamped transcript, and note-taking drawer.',
  files: [{ path: 'LessonVideoPlayer.tsx', target: 'components/blocks/LessonVideoPlayer.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})

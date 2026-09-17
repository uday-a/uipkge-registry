import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'video-playlist-sidebar',
  type: 'registry:block',
  categories: ['media', 'app', 'education'],
  description:
    'YouTube and Vimeo style video playlist drawer with active playing indicator, durations, auto-play next switch, loop/shuffle controls, and active lesson summary card.',
  framework: 'react',
  files: [{ path: 'VideoPlaylistSidebar.tsx', target: 'components/blocks/VideoPlaylistSidebar.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
  ],
})

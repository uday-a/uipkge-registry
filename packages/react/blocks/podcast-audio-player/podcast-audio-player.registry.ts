import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'podcast-audio-player',
  type: 'registry:block',
  categories: ['media', 'app', 'audio'],
  description:
    'Spotify and Apple Podcasts style audio player with 32-bar visual SVG waveform scrubber, chapter markers, playback speed controls, and show notes accordion.',
  files: [{ path: 'PodcastAudioPlayer.tsx', target: 'components/blocks/PodcastAudioPlayer.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
  ],
})

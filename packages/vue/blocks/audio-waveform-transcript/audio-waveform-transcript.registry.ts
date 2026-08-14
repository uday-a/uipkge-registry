import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'audio-waveform-transcript',
  type: 'registry:block',
  categories: ['media', 'content', 'ai'],
  description:
    'Descript and Otter style interactive podcast speech-to-text transcript with speaker diarization tags, interactive audio waveform scrubber, keyword search highlighting, talking time ratio analytics, clickable timecodes, and VTT/TXT export.',
  framework: 'vue',
  files: [{ path: 'AudioWaveformTranscript.vue', target: 'components/blocks/AudioWaveformTranscript.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

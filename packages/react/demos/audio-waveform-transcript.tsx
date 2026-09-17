import Story from '../../components/story/Story'
import { AudioWaveformTranscript } from '@react-registry-blocks/audio-waveform-transcript/AudioWaveformTranscript'

export default function AudioWaveformTranscriptDemo() {
  return (
    <Story
      title="Audio Waveform Transcript"
      description="Descript and Otter style interactive podcast speech-to-text transcript with speaker diarization tags, audio waveform scrubber, keyword search highlighting, speaker talking time ratio analytics, clickable timecodes, and VTT/TXT export."
    >
      <AudioWaveformTranscript />
    </Story>
  )
}

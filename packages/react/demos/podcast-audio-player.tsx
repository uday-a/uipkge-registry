import Story from '../../components/story/Story'
import { PodcastAudioPlayer } from '@react-registry-blocks/podcast-audio-player/PodcastAudioPlayer'

export default function PodcastAudioPlayerDemo() {
  return (
    <Story
      title="Podcast Audio Player"
      description="Spotify and Apple Podcasts style audio player with 32-bar visual SVG waveform scrubber, chapter markers, playback speed controls, and show notes accordion."
    >
      <PodcastAudioPlayer />
    </Story>
  )
}

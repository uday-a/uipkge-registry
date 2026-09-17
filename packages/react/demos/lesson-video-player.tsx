import Story from '../../components/story/Story'
import { LessonVideoPlayer } from '@react-registry-blocks/lesson-video-player/LessonVideoPlayer'

export default function LessonVideoPlayerDemo() {
  return (
    <Story
      title="Lesson Video Player"
      description="Online lecture video player with playback speed selector, interactive timestamped transcript, and note-taking drawer."
    >
      <LessonVideoPlayer />
    </Story>
  )
}

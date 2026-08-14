import Story from '../../components/story/Story'
import { SprintTimeline } from '@react-registry-blocks/sprint-timeline/SprintTimeline'

export default function SprintTimelineDemo() {
  return (
    <Story
      title="Agile Sprint Execution Timeline"
      description="2-week sprint deliverable schedule with story point counters, milestone tracking, and task dependency handoffs."
    >
      <SprintTimeline />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { ActivityFeed } from '@react-registry-blocks/activity-feed/ActivityFeed'

export default function ActivityFeedDemo() {
  return (
    <Story
      title="Default"
      description="Timeline of avatar rows. Actor, verb, optional comment, and a relative timestamp — all inline."
    >
      <ActivityFeed />
    </Story>
  )
}

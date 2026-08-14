import Story from '../../components/story/Story'
import { AnnouncementCountdownBar } from '@react-registry-blocks/announcement-countdown-bar/AnnouncementCountdownBar'
// AnnouncementCountdownBar is the block file the user installs. Open
// `components/blocks/AnnouncementCountdownBar.tsx` after install and set
// `deadline` to a real date. The timer starts only after mount, so server
// and client first paint agree.

export default function AnnouncementCountdownBarDemo() {
  return (
    <Story
      title="Announcement — Countdown Bar"
      description="Top strip counting down to a deadline. The timer ticks in place without relaying out the bar, and dismissing it keeps it closed for the session."
    >
      <AnnouncementCountdownBar />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { AnnouncementRotatingStrip } from '@react-registry-blocks/announcement-rotating-strip/AnnouncementRotatingStrip'
// AnnouncementRotatingStrip is the block file the user installs. Open
// `components/blocks/AnnouncementRotatingStrip.tsx` after install to edit the
// `messages` array; rotation pauses whenever the bar has focus.

export default function AnnouncementRotatingStripDemo() {
  return (
    <Story
      title="Announcement — Rotating Strip"
      description="Announcement bar cycling through several messages on a timer. Hover or focus pauses the rotation; dot controls step between messages manually."
    >
      <AnnouncementRotatingStrip />
    </Story>
  )
}

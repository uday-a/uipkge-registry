import Story from '../../components/story/Story'
import { AnnouncementCornerToast } from '@react-registry-blocks/announcement-corner-toast/AnnouncementCornerToast'
// AnnouncementCornerToast is the block file the user installs. Open
// `components/blocks/AnnouncementCornerToast.tsx` after install to change the
// `delay` or the copy. Dismissal is session-scoped.

export default function AnnouncementCornerToastDemo() {
  return (
    <Story
      title="Announcement — Corner Card"
      description="Corner card that slides in after a short delay with a thumbnail, headline, supporting line, and two actions — announcement weight without taking page space."
    >
      <AnnouncementCornerToast />
    </Story>
  )
}

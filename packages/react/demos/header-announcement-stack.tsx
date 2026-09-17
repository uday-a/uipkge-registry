import Story from '../../components/story/Story'
import { HeaderAnnouncementStack } from '@react-registry-blocks/header-announcement-stack/HeaderAnnouncementStack'
// HeaderAnnouncementStack is the block file the user installs. Open
// `components/blocks/HeaderAnnouncementStack.tsx` after install to change the
// strip copy. Dismissal is session-scoped, like the sticky CTA bar.

export default function HeaderAnnouncementStackDemo() {
  return (
    <Story
      title="Header — Announcement Stack"
      description="Two-tier header. A dismissible announcement strip sits above a sticky navbar; dismissing it collapses the strip and the navbar settles flush to the top without a jump."
    >
      <HeaderAnnouncementStack />
    </Story>
  )
}

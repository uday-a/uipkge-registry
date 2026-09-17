import Story from '../../components/story/Story'
import { AnnouncementBannerSplit } from '@react-registry-blocks/announcement-banner-split/AnnouncementBannerSplit'
// AnnouncementBannerSplit is the block file the user installs. Open
// `components/blocks/AnnouncementBannerSplit.tsx` after install to change the
// `tone` between neutral and attention.

export default function AnnouncementBannerSplitDemo() {
  return (
    <Story
      title="Announcement — Split Banner"
      description="Full-width band split between a labelled message column and an action column — sized for release notes and maintenance notices rather than promotions."
    >
      <AnnouncementBannerSplit />
    </Story>
  )
}

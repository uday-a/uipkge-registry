import { BannerAnnouncementSticky } from '@/components/blocks/banner-announcement-sticky'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Sticky release announcement banner with version badge and dismiss trigger">
      <div className="w-full">
        <BannerAnnouncementSticky />
      </div>
    </Story>
  )
}

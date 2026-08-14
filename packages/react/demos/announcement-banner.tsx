import { useState } from 'react'
import Story from '../../components/story/Story'
import { Button } from '@react-registry/button'
import { AnnouncementBanner } from '@react-registry-blocks/announcement-banner/AnnouncementBanner'

function BannerStory({
  title,
  description,
  variant,
  className,
}: {
  title: string
  description: string
  variant: 'solid' | 'soft' | 'gradient'
  className?: string
}) {
  const [key, setKey] = useState(0)

  return (
    <Story title={title} description={description}>
      <div className="flex w-full flex-col items-center gap-3">
        <AnnouncementBanner key={key} variant={variant} className={className} />
        <Button variant="outline" size="sm" onClick={() => setKey((k) => k + 1)}>
          Reset banner
        </Button>
      </div>
    </Story>
  )
}

export default function AnnouncementBannerDemo() {
  return (
    <div className="space-y-4">
      <BannerStory
        title="Solid"
        description="Primary pill with short copy, arrow link, and inline dismiss. Dismiss it, then reset to bring it back."
        variant="solid"
      />
      <BannerStory
        title="Soft"
        description="Muted strip with sparkle icon, version badge, supporting copy, Read more link, and dismiss."
        variant="soft"
        className="w-full"
      />
      <BannerStory
        title="Gradient"
        description="Subtle left-to-right primary tint with centered content. Flip the theme toggle to check the alpha gradient in dark mode."
        variant="gradient"
        className="w-full"
      />
    </div>
  )
}

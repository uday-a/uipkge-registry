import { HeroVideoModalWalkthrough } from '@/components/blocks/hero-video-modal-walkthrough'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Hero section with interactive video walkthrough modal and chapter timeline">
      <div className="w-full">
        <HeroVideoModalWalkthrough />
      </div>
    </Story>
  )
}

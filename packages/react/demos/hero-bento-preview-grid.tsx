import { HeroBentoPreviewGrid } from '@/components/blocks/hero-bento-preview-grid'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="3-column asymmetric bento hero with interactive palette and parity testers">
      <div className="w-full">
        <HeroBentoPreviewGrid />
      </div>
    </Story>
  )
}

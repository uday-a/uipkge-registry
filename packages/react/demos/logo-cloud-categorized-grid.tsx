import { LogoCloudCategorizedGrid } from '@/components/blocks/logo-cloud-categorized-grid'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Categorized customer logo grid with vertical filters and testimonial modal">
      <div className="w-full">
        <LogoCloudCategorizedGrid />
      </div>
    </Story>
  )
}

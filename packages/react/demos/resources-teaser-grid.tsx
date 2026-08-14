import Story from '../../components/story/Story'
import { ResourcesTeaserGrid } from '@react-registry-blocks/resources-teaser-grid/ResourcesTeaserGrid'
// ResourcesTeaserGrid is the block file the user installs. Open
// `components/blocks/ResourcesTeaserGrid.tsx` after install to wire the
// `featured` and `recent` entries to your CMS. Kind badges are plain
// strings, so any taxonomy works.

export default function ResourcesTeaserGridDemo() {
  return (
    <Story
      title="Resources Teaser Grid"
      description="Blog and resources teaser. A featured article spans two columns with kind badge and read time, beside a stacked list of four recent pieces and a view-all link row."
    >
      <ResourcesTeaserGrid />
    </Story>
  )
}

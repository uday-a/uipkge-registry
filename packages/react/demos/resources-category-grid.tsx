import Story from '../../components/story/Story'
import { ResourcesCategoryGrid } from '@react-registry-blocks/resources-category-grid/ResourcesCategoryGrid'
// ResourcesCategoryGrid is the block file the user installs. Open
// `components/blocks/ResourcesCategoryGrid.tsx` after install to wire the
// categories to your CMS.

export default function ResourcesCategoryGridDemo() {
  return (
    <Story
      title="Resources — Category Grid"
      description="Resource library by category, each card listing its three most recent entries with kind and read time, over a link to the full archive."
    >
      <ResourcesCategoryGrid />
    </Story>
  )
}

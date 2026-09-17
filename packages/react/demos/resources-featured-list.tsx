import Story from '../../components/story/Story'
import { ResourcesFeaturedList } from '@react-registry-blocks/resources-featured-list/ResourcesFeaturedList'
// ResourcesFeaturedList is the block file the user installs. Open
// `components/blocks/ResourcesFeaturedList.tsx` after install to swap in
// real posts.

export default function ResourcesFeaturedListDemo() {
  return (
    <Story
      title="Resources — Featured List"
      description="One featured long-read beside a numbered further-reading list, each entry carrying kind, date, and read time."
    >
      <ResourcesFeaturedList />
    </Story>
  )
}

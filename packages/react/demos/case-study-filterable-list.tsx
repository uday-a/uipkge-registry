import Story from '../../components/story/Story'
import { CaseStudyFilterableList } from '@react-registry-blocks/case-study-filterable-list/CaseStudyFilterableList'
// CaseStudyFilterableList is the block file the user installs. Open
// `components/blocks/CaseStudyFilterableList.tsx` after install to point the
// `studies` array at your CMS; chips derive from the industries present.

export default function CaseStudyFilterableListDemo() {
  return (
    <Story
      title="Case Studies — Filterable List"
      description="Filterable index of customer stories. Industry chips narrow rows carrying the headline result, stack, and read time; an empty state covers no matches."
    >
      <CaseStudyFilterableList />
    </Story>
  )
}

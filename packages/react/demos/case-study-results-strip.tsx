import Story from '../../components/story/Story'
import { CaseStudyResultsStrip } from '@react-registry-blocks/case-study-results-strip/CaseStudyResultsStrip'
// CaseStudyResultsStrip is the block file the user installs. Open
// `components/blocks/CaseStudyResultsStrip.tsx` after install to swap the
// wordmarks for logo files. One result per customer is the constraint.

export default function CaseStudyResultsStripDemo() {
  return (
    <Story
      title="Case Studies — Results Strip"
      description="A compact band of customer wordmarks each paired with one headline result — proof for the gap between a feature section and pricing."
    >
      <CaseStudyResultsStrip />
    </Story>
  )
}

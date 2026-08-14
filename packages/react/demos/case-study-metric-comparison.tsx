import Story from '../../components/story/Story'
import { CaseStudyMetricComparison } from '@react-registry-blocks/case-study-metric-comparison/CaseStudyMetricComparison'
// CaseStudyMetricComparison is the block file the user installs. Open
// `components/blocks/CaseStudyMetricComparison.tsx` after install to edit
// the `metrics` array; direction drives the delta colour.

export default function CaseStudyMetricComparisonDemo() {
  return (
    <Story
      title="Case Study — Metric Comparison"
      description="One customer's results as a before-and-after table — prior value, current value, and delta per metric, under a line of context on how it was measured."
    >
      <CaseStudyMetricComparison />
    </Story>
  )
}

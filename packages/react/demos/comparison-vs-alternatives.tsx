import Story from '../../components/story/Story'
import { ComparisonVsAlternatives } from '@react-registry-blocks/comparison-vs-alternatives/ComparisonVsAlternatives'
// ComparisonVsAlternatives is the block file the user installs. Open
// `components/blocks/ComparisonVsAlternatives.tsx` after install to edit the
// `rows` array. Describing mechanisms rather than scoring rivals is the point.

export default function ComparisonVsAlternativesDemo() {
  return (
    <Story
      title="Comparison — Versus Alternatives"
      description="Row-by-row comparison against the status quo, where each line names a mechanism rather than assigning the alternative a score."
    >
      <ComparisonVsAlternatives />
    </Story>
  )
}

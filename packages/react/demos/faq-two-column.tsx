import Story from '../../components/story/Story'
import { FaqTwoColumn } from '@react-registry-blocks/faq-two-column/FaqTwoColumn'
// FaqTwoColumn is the block file the user installs. Open
// `components/blocks/FaqTwoColumn.tsx` after install to edit the `faqs`
// array; entries are dealt into the two columns automatically.

export default function FaqTwoColumnDemo() {
  return (
    <Story
      title="FAQ — Two Column"
      description="Two independent accordion columns. Expanding a long answer on the left never shifts the questions on the right, which a single-column list cannot avoid."
    >
      <FaqTwoColumn />
    </Story>
  )
}

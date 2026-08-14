import Story from '../../components/story/Story'
import { UseCasesIndustryGrid } from '@react-registry-blocks/use-cases-industry-grid/UseCasesIndustryGrid'
// UseCasesIndustryGrid is the block file the user installs. Open
// `components/blocks/UseCasesIndustryGrid.tsx` after install to edit the
// `useCases` array — the filter chips derive from the segments present, so
// new segments need no extra wiring.

export default function UseCasesIndustryGridDemo() {
  return (
    <Story
      title="Use Cases — Industry Grid"
      description="Filterable industry use-case grid. Segment chips narrow six cards in place; each card carries an icon, industry label, outcome headline, proof metric, and a read-more link."
    >
      <UseCasesIndustryGrid />
    </Story>
  )
}

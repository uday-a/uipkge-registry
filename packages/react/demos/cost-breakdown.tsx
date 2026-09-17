import Story from '../../components/story/Story'
import { CostBreakdown } from '@react-registry-blocks/cost-breakdown/CostBreakdown'

export default function CostBreakdownDemo() {
  return (
    <Story
      title="Default"
      description="Three-panel spend dashboard. Stacked weekly bars on top, plus two categorical pies for share by lane and by carrier."
    >
      <CostBreakdown />
    </Story>
  )
}

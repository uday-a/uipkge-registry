import Story from '../../components/story/Story'
import { StatsBand } from '@react-registry-blocks/stats-band/StatsBand'

export default function StatsBandDemo() {
  return (
    <>
      <Story
        title="Plain"
        description="Bare full-width band. Four stats in a 2x2 grid on mobile, four columns with vertical dividers on desktop."
      >
        <StatsBand />
      </Story>

      <Story
        title="Bordered"
        description="Same band wrapped in a rounded card container with border and subtle shadow."
      >
        <StatsBand variant="bordered" />
      </Story>
    </>
  )
}

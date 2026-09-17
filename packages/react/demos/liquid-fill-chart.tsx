import Story from '../../components/story/Story'
import { LiquidFillChart } from '@react-registry/charts'

export default function LiquidFillChartDemo() {
  return (
    <>
      <Story title="Quota used" description="Animated dual waves inside a ring.">
        <LiquidFillChart value={68} unit="%" height={220} />
      </Story>
      <Story title="Full" description="Waves rise to the value; label centres automatically.">
        <LiquidFillChart value={92} unit="%" height={220} />
      </Story>
      <Story title="No label" description="Hide the centre label for tile grids.">
        <LiquidFillChart value={55} showLabel={false} height={180} />
      </Story>
    </>
  )
}

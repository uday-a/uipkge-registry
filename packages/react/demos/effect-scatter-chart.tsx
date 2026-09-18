import Story from '../../components/story/Story'
import { EffectScatterChart } from '@react-registry/charts'

const incidents = [
  { x: 10, y: 22, c: 'p1' },
  { x: 18, y: 30, c: 'p1' },
  { x: 26, y: 18, c: 'p2' },
  { x: 34, y: 42, c: 'p2' },
  { x: 42, y: 28, c: 'p3' },
  { x: 50, y: 36, c: 'p3' },
]

export default function EffectScatterChartDemo() {
  return (
    <>
      <Story title="Alert ripple" description="Ripple animation draws the eye to live points. Grouped by category.">
        <EffectScatterChart data={incidents} xField="x" yField="y" categoryField="c" height={300} />
      </Story>
      <Story title="Slow ripple" description="Longer period for ambient dashboards.">
        <EffectScatterChart data={incidents} xField="x" yField="y" categoryField="c" ripplePeriod={8} height={300} />
      </Story>
    </>
  )
}

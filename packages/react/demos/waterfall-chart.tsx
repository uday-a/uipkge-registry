import Story from '../../components/story/Story'
import { WaterfallChart } from '@react-registry/charts'

const cashflow = [
  { label: 'Opening', value: 12000 },
  { label: 'Sales', value: 8400 },
  { label: 'Refunds', value: -1800 },
  { label: 'COGS', value: -5200 },
  { label: 'Opex', value: -3100 },
  { label: 'Tax', value: -1400 },
]

const noTotal = [
  { label: 'Q1', value: 3200 },
  { label: 'Q2', value: -800 },
  { label: 'Q3', value: 2400 },
  { label: 'Q4', value: 1800 },
]

export default function WaterfallChartDemo() {
  return (
    <>
      <Story
        title="Cashflow waterfall"
        description="Signed deltas accumulate. Positives teal, negatives orange, Total computed."
      >
        <WaterfallChart data={cashflow} height={320} />
      </Story>
      <Story title="Without total" description="Hide the computed Total bar when you only want the walk.">
        <WaterfallChart data={noTotal} showTotal={false} height={280} />
      </Story>
      <Story title="Compact" description="Shorter frame for dashboard tiles.">
        <WaterfallChart data={cashflow.slice(0, 4)} height={240} />
      </Story>
    </>
  )
}

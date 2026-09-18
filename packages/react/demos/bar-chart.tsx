import Story from '../../components/story/Story'
import { BarChart } from '@react-registry/charts'

const sales = [
  { category: 'Electronics', value: 350 },
  { category: 'Clothing', value: 280 },
  { category: 'Home', value: 210 },
  { category: 'Sports', value: 160 },
  { category: 'Books', value: 90 },
]

const grouped = [
  { quarter: 'Q1', north: 240, south: 180, east: 210, west: 150 },
  { quarter: 'Q2', north: 310, south: 220, east: 260, west: 190 },
  { quarter: 'Q3', north: 380, south: 280, east: 290, west: 230 },
  { quarter: 'Q4', north: 450, south: 340, east: 350, west: 280 },
]

const cashflow = [
  { week: 'W1', net: 1200 },
  { week: 'W2', net: -420 },
  { week: 'W3', net: 980 },
  { week: 'W4', net: -180 },
  { week: 'W5', net: 1540 },
  { week: 'W6', net: -680 },
]

// Air cargo: weekly flown tonnage per carrier.
const carrierWeeks = [
  { week: 'W20', sq: 820, cx: 640, lh: 410 },
  { week: 'W21', sq: 880, cx: 610, lh: 430 },
  { week: 'W22', sq: 790, cx: 660, lh: 390 },
  { week: 'W23', sq: 910, cx: 700, lh: 450 },
  { week: 'W24', sq: 860, cx: 680, lh: 470 },
  { week: 'W25', sq: 930, cx: 720, lh: 460 },
]

// MTD window behind the current partial week.
const mtdOption = {
  series: [
    {
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(148, 163, 184, 0.12)' },
        label: { color: '#64748b', fontSize: 10, position: 'insideTop' as const },
        data: [[{ name: 'MTD', xAxis: 'W25' }, { xAxis: 'W25' }]],
      },
    },
  ],
}

// Horizontal: swap the axis types via the option override.
const horizontalOption = {
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: sales.map((s) => s.category) },
}

// Stacked: shared stack key across all bar series.
const stackedOption = {
  series: [{ stack: 'r' }, { stack: 'r' }, { stack: 'r' }, { stack: 'r' }],
}

// Negative-value: colour positives chart-2 (teal) and negatives chart-4 (orange/red).
const negativeOption = {
  series: [
    {
      itemStyle: {
        color: (params: any) => (params.value >= 0 ? '#14b8a6' : '#f97316'),
      },
    },
  ],
}

export default function BarChartDemo() {
  return (
    <>
      <Story
        title="Vertical bars"
        description="Default orientation. Rounded tops and a 32px max width keep wide bars readable."
      >
        <BarChart data={sales} xField="category" yField="value" height="280" />
      </Story>

      <Story
        title="Horizontal bars"
        description="Swap xAxis and yAxis types via the option escape hatch to flip orientation. Great for long category labels."
      >
        <BarChart data={sales} xField="category" yField="value" option={horizontalOption} height="280" />
      </Story>

      <Story title="Grouped" description="Pass an array to y-field to render side-by-side groups. Legend auto-appears.">
        <BarChart data={grouped} xField="quarter" yField={['north', 'south', 'east', 'west']} height="320" />
      </Story>

      <Story
        title="Stacked"
        description="Same multi-series data as above, stacked on a shared key via the option override."
      >
        <BarChart
          data={grouped}
          xField="quarter"
          yField={['north', 'south', 'east', 'west']}
          option={stackedOption}
          height="320"
        />
      </Story>

      <Story
        title="Negative values"
        description="Diverging bars around zero. Per-bar colour callback flips positive vs. negative."
      >
        <BarChart data={cashflow} xField="week" yField="net" option={negativeOption} height="280" />
      </Story>

      <Story title="Value labels" description="Exact numbers on top of every bar for glanceable decks.">
        <BarChart data={sales} xField="category" yField="value" valueLabels height="300" />
      </Story>

      <Story title="Stacked prop" description="One-word stacking without the series override.">
        <BarChart data={grouped} xField="quarter" yField={['north', 'south', 'east', 'west']} stacked height="320" />
      </Story>

      <Story
        title="Carrier tonnage, MTD shading"
        description="Weekly uplift by carrier with the month-to-date window boxed — the app's MTD-interval pattern."
      >
        <BarChart
          data={carrierWeeks}
          xField="week"
          yField={['sq', 'cx', 'lh']}
          stacked
          option={mtdOption}
          height="320"
        />
      </Story>
    </>
  )
}

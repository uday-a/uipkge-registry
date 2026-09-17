import Story from '../../components/story/Story'
import { ComboChart } from '@react-registry/charts'

const monthly = [
  { m: 'Jan', orders: 320, conversion: 2.1 },
  { m: 'Feb', orders: 410, conversion: 2.4 },
  { m: 'Mar', orders: 380, conversion: 2.2 },
  { m: 'Apr', orders: 520, conversion: 2.9 },
  { m: 'May', orders: 480, conversion: 2.7 },
  { m: 'Jun', orders: 610, conversion: 3.4 },
]

// Air cargo: monthly flown tonnage with average yield.
const laneMonths = [
  { m: 'Jan', tonnes: 18200, rate: 4.1 },
  { m: 'Feb', tonnes: 16400, rate: 5.9 },
  { m: 'Mar', tonnes: 19800, rate: 4.4 },
  { m: 'Apr', tonnes: 20500, rate: 4.0 },
  { m: 'May', tonnes: 21300, rate: 4.3 },
  { m: 'Jun', tonnes: 22100, rate: 4.7 },
]

export default function ComboChartDemo() {
  return (
    <>
      <Story title="Orders + conversion" description="Bars on the left axis, smooth line on the right axis.">
        <ComboChart data={monthly} xField="m" barField="orders" lineField="conversion" height={320} />
      </Story>
      <Story title="Multi-bar + line" description="Pass arrays to render grouped bars beside the trend line.">
        <ComboChart
          data={[
            { m: 'Jan', a: 120, b: 90, t: 200 },
            { m: 'Feb', a: 150, b: 110, t: 240 },
            { m: 'Mar', a: 130, b: 100, t: 220 },
          ]}
          xField="m"
          barField={['a', 'b']}
          lineField="t"
          height={300}
        />
      </Story>

      <Story
        title="Bookings vs rate"
        description="Air cargo dual axis: flown tonnage bars with the average $/kg line — the app's externalDataset pattern."
      >
        <ComboChart data={laneMonths} xField="m" barField="tonnes" lineField="rate" height={320} />
      </Story>
    </>
  )
}

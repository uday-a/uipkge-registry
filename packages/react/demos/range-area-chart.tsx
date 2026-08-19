import Story from "../../components/story/Story";
import { RangeAreaChart } from "@react-registry/charts";

const temps = [
  { d: "Mon", min: 12, avg: 17, max: 22 },
  { d: "Tue", min: 13, avg: 18, max: 24 },
  { d: "Wed", min: 11, avg: 16, max: 21 },
  { d: "Thu", min: 14, avg: 19, max: 25 },
  { d: "Fri", min: 15, avg: 21, max: 27 },
  { d: "Sat", min: 16, avg: 22, max: 28 },
];

export default function RangeAreaChartDemo() {
  return (
    <>
      <Story
        title="Forecast band"
        description="Min/max envelope with the average trend on top."
      >
        <RangeAreaChart data={temps} xField="d" height={320} />
      </Story>
    </>
  );
}

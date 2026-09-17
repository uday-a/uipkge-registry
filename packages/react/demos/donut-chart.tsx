import Story from "../../components/story/Story";
import { DonutChart } from "@react-registry/charts";

const share = [
  { name: "Product", value: 45 },
  { name: "Services", value: 25 },
  { name: "Support", value: 20 },
  { name: "Other", value: 10 },
];

const devices = [
  { name: "Desktop", value: 52 },
  { name: "Mobile", value: 38 },
  { name: "Tablet", value: 10 },
];

export default function DonutChartDemo() {
  return (
    <>
      <Story
        title="Revenue split"
        description="Full ring with rounded segments and a centre total."
      >
        <DonutChart data={share} height={320} />
      </Story>
      <Story
        title="Filled donut"
        description="Thickness 0 collapses the ring into a pie."
      >
        <DonutChart data={share} thickness={0} height={320} />
      </Story>
      <Story
        title="Half donut"
        description="Semicircle gauge with the total tucked under the arc."
      >
        <DonutChart data={devices} type="half" height={280} />
      </Story>
      <Story
        title="KPI ring"
        description="Custom centre label for goal tracking."
      >
        <DonutChart
          data={[
            { name: "Used", value: 68 },
            { name: "Left", value: 32 },
          ]}
          centerLabel="68%"
          height={280}
        />
      </Story>
    </>
  );
}

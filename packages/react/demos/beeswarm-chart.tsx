import Story from "../../components/story/Story";
import { BeeswarmChart } from "@react-registry/charts";

const scores = [
  { group: "Eng", value: 82 },
  { group: "Eng", value: 88 },
  { group: "Eng", value: 74 },
  { group: "Eng", value: 91 },
  { group: "Eng", value: 79 },
  { group: "Design", value: 76 },
  { group: "Design", value: 84 },
  { group: "Design", value: 69 },
  { group: "Design", value: 81 },
  { group: "Sales", value: 64 },
  { group: "Sales", value: 71 },
  { group: "Sales", value: 58 },
  { group: "Sales", value: 77 },
  { group: "Sales", value: 66 },
];

export default function BeeswarmChartDemo() {
  return (
    <>
      <Story
        title="Scores by team"
        description="One dot per observation; jitter is deterministic so SSR matches."
      >
        <BeeswarmChart
          data={scores}
          valueField="value"
          groupField="group"
          height={300}
        />
      </Story>
    </>
  );
}

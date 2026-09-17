import Story from "../../components/story/Story";
import { ChordChart } from "@react-registry/charts";

const nodes = [
  { name: "API" },
  { name: "Worker" },
  { name: "DB" },
  { name: "Cache" },
  { name: "Queue" },
];
const links = [
  { source: "API", target: "DB", value: 42 },
  { source: "API", target: "Cache", value: 30 },
  { source: "API", target: "Queue", value: 24 },
  { source: "Queue", target: "Worker", value: 24 },
  { source: "Worker", target: "DB", value: 18 },
  { source: "Worker", target: "Cache", value: 8 },
];

export default function ChordChartDemo() {
  return (
    <>
      <Story
        title="Service traffic"
        description="Weighted ribbons; hover a node to isolate its flows."
      >
        <ChordChart nodes={nodes} links={links} height={380} />
      </Story>
    </>
  );
}

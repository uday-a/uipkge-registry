import Story from "../../components/story/Story";
import { DumbbellChart } from "@react-registry/charts";

const churn = [
  { label: "Acme", a: 4.2, b: 2.1 },
  { label: "Globex", a: 3.8, b: 3.1 },
  { label: "Initech", a: 5.1, b: 2.8 },
  { label: "Umbrella", a: 2.4, b: 2.9 },
];

export default function DumbbellChartDemo() {
  return (
    <>
      <Story
        title="Churn before/after"
        description="Joined dots make movement direction obvious."
      >
        <DumbbellChart data={churn} names={["Q1", "Q2"]} height={300} />
      </Story>
    </>
  );
}

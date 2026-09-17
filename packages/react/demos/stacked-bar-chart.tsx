import Story from "../../components/story/Story";
import { StackedBarChart } from "@react-registry/charts";

const mix = [
  { q: "Q1", organic: 240, paid: 180, referral: 120 },
  { q: "Q2", organic: 310, paid: 220, referral: 150 },
  { q: "Q3", organic: 380, paid: 280, referral: 170 },
  { q: "Q4", organic: 450, paid: 340, referral: 210 },
];

export default function StackedBarChartDemo() {
  return (
    <>
      <Story
        title="Channel mix"
        description="Absolute stacking with a shared legend."
      >
        <StackedBarChart
          data={mix}
          xField="q"
          yFields={["organic", "paid", "referral"]}
          height={320}
        />
      </Story>
      <Story
        title="100% share"
        description="Percent mode normalises every column."
      >
        <StackedBarChart
          data={mix}
          xField="q"
          yFields={["organic", "paid", "referral"]}
          percent
          height={320}
        />
      </Story>
    </>
  );
}

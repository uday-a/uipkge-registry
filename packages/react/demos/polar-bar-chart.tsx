import Story from "../../components/story/Story";
import { PolarBarChart } from "@react-registry/charts";

const traffic = [
  { category: "Organic", value: 42 },
  { category: "Paid", value: 28 },
  { category: "Referral", value: 18 },
  { category: "Social", value: 24 },
  { category: "Email", value: 12 },
];

export default function PolarBarChartDemo() {
  return (
    <>
      <Story
        title="Channel mix"
        description="Categories around the radius axis with rounded caps."
      >
        <PolarBarChart data={traffic} height={320} />
      </Story>
    </>
  );
}

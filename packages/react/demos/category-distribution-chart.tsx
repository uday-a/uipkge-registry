import Story from "../../components/story/Story";
import { CategoryDistributionChart } from "@react-registry/charts";

const budget = [
  { label: "Marketing", percentage: 40, value: 4000 },
  { label: "Sales", percentage: 25, value: 2500 },
  { label: "Development", percentage: 20, value: 2000 },
  { label: "Support", percentage: 15, value: 1500 },
];

export default function CategoryDistributionChartDemo() {
  return (
    <>
      <Story
        title="Budget split"
        description="KPI plus trend pill, share bar, and value legend."
      >
        <CategoryDistributionChart
          primaryValue="10,000"
          primaryLabel="Total spend"
          trend={{ value: "8.2%", direction: "up" }}
          categories={budget}
          height={240}
        />
      </Story>
    </>
  );
}

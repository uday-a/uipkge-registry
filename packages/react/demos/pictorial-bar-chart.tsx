import Story from "../../components/story/Story";
import { PictorialBarChart } from "@react-registry/charts";

const hiring = [
  { category: "Eng", value: 24 },
  { category: "Design", value: 12 },
  { category: "Sales", value: 18 },
  { category: "Support", value: 9 },
  { category: "Ops", value: 6 },
];

export default function PictorialBarChartDemo() {
  return (
    <>
      <Story
        title="Headcount"
        description="Repeated rect symbols fill to the value."
      >
        <PictorialBarChart data={hiring} height={300} />
      </Story>
      <Story
        title="Diamond symbols"
        description="Swap the pictogram via the symbol prop."
      >
        <PictorialBarChart data={hiring} symbol="diamond" height={300} />
      </Story>
    </>
  );
}

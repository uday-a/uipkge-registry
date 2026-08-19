import Story from "../../components/story/Story";
import { BarRaceChart } from "@react-registry/charts";

const frames = [
  {
    label: "2022",
    values: [
      { category: "Aurora", value: 42 },
      { category: "Boreal", value: 38 },
      { category: "Cirrus", value: 31 },
      { category: "Drift", value: 24 },
    ],
  },
  {
    label: "2023",
    values: [
      { category: "Aurora", value: 48 },
      { category: "Boreal", value: 45 },
      { category: "Cirrus", value: 39 },
      { category: "Drift", value: 30 },
    ],
  },
  {
    label: "2024",
    values: [
      { category: "Boreal", value: 58 },
      { category: "Aurora", value: 55 },
      { category: "Drift", value: 44 },
      { category: "Cirrus", value: 41 },
    ],
  },
  {
    label: "2025",
    values: [
      { category: "Boreal", value: 66 },
      { category: "Drift", value: 57 },
      { category: "Aurora", value: 54 },
      { category: "Cirrus", value: 43 },
    ],
  },
];

export default function BarRaceChartDemo() {
  return (
    <>
      <Story
        title="Revenue race"
        description="Frames auto-advance with smooth resorting; watch Boreal take the lead."
      >
        <BarRaceChart frames={frames} height={360} />
      </Story>
    </>
  );
}

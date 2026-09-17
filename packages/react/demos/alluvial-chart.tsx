import Story from "../../components/story/Story";
import { AlluvialChart } from "@react-registry/charts";

// Booking funnel: quotes that survive each stage.
const funnel = [
  { source: "Inquiry", target: "Quote", value: 1200 },
  { source: "Quote", target: "Booking", value: 860 },
  { source: "Quote", target: "Lost", value: 340 },
  { source: "Booking", target: "Flown", value: 790 },
  { source: "Booking", target: "Rolled", value: 70 },
  { source: "Flown", target: "Invoiced", value: 775 },
  { source: "Flown", target: "Claim", value: 15 },
];

export default function AlluvialChartDemo() {
  return (
    <>
      <Story
        title="Booking funnel"
        description="Quote-to-cash flowing top to bottom — the rolled and claim trickles stay visible."
      >
        <AlluvialChart links={funnel} height={440} />
      </Story>
    </>
  );
}

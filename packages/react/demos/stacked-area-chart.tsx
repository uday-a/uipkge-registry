import Story from "../../components/story/Story";
import { StackedAreaChart } from "@react-registry/charts";

const traffic = [
  { m: "Jan", organic: 120, paid: 80, referral: 40 },
  { m: "Feb", organic: 150, paid: 95, referral: 52 },
  { m: "Mar", organic: 135, paid: 88, referral: 48 },
  { m: "Apr", organic: 180, paid: 110, referral: 64 },
  { m: "May", organic: 210, paid: 128, referral: 72 },
];

export default function StackedAreaChartDemo() {
  return (
    <>
      <Story
        title="Traffic streams"
        description="Absolute stacking with series focus on hover."
      >
        <StackedAreaChart
          data={traffic}
          xField="m"
          yFields={["organic", "paid", "referral"]}
          height={320}
        />
      </Story>
      <Story
        title="100% share"
        description="Percent mode turns streams into share bands."
      >
        <StackedAreaChart
          data={traffic}
          xField="m"
          yFields={["organic", "paid", "referral"]}
          percent
          height={320}
        />
      </Story>
    </>
  );
}

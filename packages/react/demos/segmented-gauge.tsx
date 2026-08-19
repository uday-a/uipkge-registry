import Story from "../../components/story/Story";
import { SegmentedGauge } from "@react-registry/charts";

const browsers = [
  { value: 76.1, label: "Chrome" },
  { value: 13.4, label: "Safari" },
  { value: 6.2, label: "Firefox" },
  { value: 3.4, label: "Edge" },
];

const regions = [
  { value: 42, color: "var(--chart-1)", label: "AMER" },
  { value: 31, color: "var(--chart-2)", label: "EMEA" },
  { value: 18, color: "var(--chart-3)", label: "APAC" },
  { value: 9, color: "var(--chart-5)", label: "LATAM" },
];

const sentiment = [
  { value: 64, color: "#34d399", label: "Positive" },
  { value: 24, color: "#94a3b8", label: "Neutral" },
  { value: 12, color: "#fb7185", label: "Negative" },
];

const splitFifty = [
  { value: 1, color: "var(--chart-1)" },
  { value: 1, color: "var(--chart-2)" },
];

export default function SegmentedGaugeDemo() {
  return (
    <>
      <Story
        title="Browser share"
        description="Four colored segments with a 4-degree gap and rounded line caps. Use the `center` slot to drop a KPI value + label into the dish."
      >
        <div className="mx-auto max-w-sm">
          <SegmentedGauge segments={browsers}>
            <p className="text-3xl font-bold tracking-tight tabular-nums">
              1,735
            </p>
            <p className="text-muted-foreground text-xs">Clicks</p>
          </SegmentedGauge>
        </div>
      </Story>

      <Story
        title="Regional split"
        description="Same shape, different domain. The default colors come from the registry palette; pass `color` per-segment when the brand colors need to win."
      >
        <div className="mx-auto max-w-sm">
          <SegmentedGauge segments={regions}>
            <p className="text-3xl font-bold tracking-tight tabular-nums">
              12.4k
            </p>
            <p className="text-muted-foreground text-xs">Sessions</p>
          </SegmentedGauge>
        </div>
      </Story>

      <Story
        title="Sentiment tri-band"
        description="Three segments scaled by their relative share. Segments are normalised internally so the input values can be raw counts or percentages."
      >
        <div className="mx-auto max-w-sm">
          <SegmentedGauge segments={sentiment}>
            <p className="text-3xl font-bold tracking-tight tabular-nums">
              72%
            </p>
            <p className="text-muted-foreground text-xs">Positive</p>
          </SegmentedGauge>
        </div>
      </Story>

      <Story
        title="Wider stroke, no track"
        description="Bump stroke to 28 and turn off the background track for a pill-cluster look — works when the chart sits on a dark surface and the muted track would compete with the segments."
      >
        <div className="mx-auto max-w-sm">
          <SegmentedGauge
            segments={splitFifty}
            stroke={28}
            showTrack={false}
            gap={6}
          />
        </div>
      </Story>

      <Story
        title="Compact"
        description="Shorter height + no center slot for sparkline-style placement next to a metric label. The arc proportions stay readable down to ~100px."
      >
        <div className="mx-auto w-40">
          <SegmentedGauge segments={browsers} height="90" stroke={10} />
        </div>
      </Story>
    </>
  );
}

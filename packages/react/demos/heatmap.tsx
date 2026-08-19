import Story from "../../components/story/Story";
import { Heatmap } from "@react-registry/charts";

// [xIndex, yIndex, value] tuples for a 5x4 matrix.
const usageData: [number, number, number][] = [];
const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const yLabels = ["Morning", "Afternoon", "Evening", "Night"];

// Air cargo: lane × week load factors (%) into peak season.
const laneLabels = [
  "SIN–HKG",
  "PVG–LAX",
  "ICN–ORD",
  "FRA–JFK",
  "DXB–SIN",
  "HKG–ANC",
];
const weekLabels = ["W20", "W21", "W22", "W23", "W24", "W25", "W26", "W27"];
const loadRows = [
  [68, 74, 71, 66, 63, 70],
  [71, 76, 73, 68, 65, 72],
  [69, 78, 75, 70, 64, 74],
  [74, 82, 78, 72, 69, 77],
  [77, 85, 80, 74, 71, 79],
  [81, 88, 83, 77, 74, 82],
  [84, 91, 86, 80, 77, 85],
  [88, 94, 89, 83, 80, 87],
];
const loadData: [number, number, number][] = loadRows.flatMap((row, w) =>
  row.map((v, l) => [w, l, v] as [number, number, number]),
);
const peaks: Record<string, number> = {
  "0,0": 12,
  "0,1": 24,
  "0,2": 38,
  "0,3": 9,
  "1,0": 18,
  "1,1": 36,
  "1,2": 52,
  "1,3": 14,
  "2,0": 22,
  "2,1": 42,
  "2,2": 64,
  "2,3": 18,
  "3,0": 24,
  "3,1": 38,
  "3,2": 58,
  "3,3": 22,
  "4,0": 14,
  "4,1": 22,
  "4,2": 30,
  "4,3": 8,
};
for (let x = 0; x < xLabels.length; x++) {
  for (let y = 0; y < yLabels.length; y++) {
    usageData.push([x, y, peaks[`${x},${y}`] ?? 0]);
  }
}

// "Heatmap with gaps" — values of 0 set to NaN-ish display.
const sparse: [number, number, number][] = usageData.map(([x, y, v]) =>
  v < 12 ? [x, y, 0] : [x, y, v],
);
const gapsOption = {
  series: [
    { itemStyle: { borderRadius: 3, borderColor: "#fff", borderWidth: 2 } },
  ],
  visualMap: {
    inRange: { color: ["#fef3c7", "#f59e0b", "#b45309"] },
  },
};

// Override the default blue ramp with a teal / orange palette.
const tealRampOption = {
  visualMap: { inRange: { color: ["#ccfbf1", "#14b8a6", "#0f766e"] } },
};
const orangeRampOption = {
  visualMap: { inRange: { color: ["#ffedd5", "#fb923c", "#9a3412"] } },
};

export default function HeatmapDemo() {
  return (
    <>
      <Story
        title="Basic heatmap"
        description="5×4 grid (day-of-week × time-of-day). Default blue ramp + bottom visualMap legend."
      >
        <Heatmap
          data={usageData}
          xLabels={xLabels}
          yLabels={yLabels}
          height="320"
        />
      </Story>

      <Story
        title="With gaps"
        description="Low-value cells are still rendered but visually quieter — the borderRadius + border carve them out into discrete tiles."
      >
        <Heatmap
          data={sparse}
          xLabels={xLabels}
          yLabels={yLabels}
          option={gapsOption}
          height="320"
        />
      </Story>

      <Story
        title="Teal palette"
        description="Override the default cool-blue ramp with a custom green / teal scale via the option escape hatch."
      >
        <Heatmap
          data={usageData}
          xLabels={xLabels}
          yLabels={yLabels}
          option={tealRampOption}
          height="320"
        />
      </Story>

      <Story
        title="Warm palette"
        description="Same data, orange-to-burnt ramp. Useful when the axis communicates intensity rather than coolness."
      >
        <Heatmap
          data={usageData}
          xLabels={xLabels}
          yLabels={yLabels}
          option={orangeRampOption}
          height="320"
        />
      </Story>

      <Story
        title="Compact (no legend)"
        description="Drop the visualMap legend and shrink the height for in-card placement next to a KPI. Tooltip still shows the exact value on hover."
      >
        <Heatmap
          data={usageData}
          xLabels={xLabels}
          yLabels={yLabels}
          option={{ visualMap: { show: false } }}
          height="160"
        />
      </Story>

      <Story
        title="Lane load factors"
        description="Air cargo belly fill by lane and week — watch the peak-season ramp into W27."
      >
        <Heatmap
          data={loadData}
          xLabels={weekLabels}
          yLabels={laneLabels}
          min={60}
          max={100}
          height="300"
        />
      </Story>
    </>
  );
}

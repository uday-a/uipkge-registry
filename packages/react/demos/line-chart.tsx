import Story from "../../components/story/Story";
import { LineChart } from "@react-registry/charts";

const traffic = [
  { day: "Mon", sessions: 2400, signups: 240 },
  { day: "Tue", sessions: 2900, signups: 310 },
  { day: "Wed", sessions: 2700, signups: 280 },
  { day: "Thu", sessions: 3400, signups: 380 },
  { day: "Fri", sessions: 3800, signups: 450 },
  { day: "Sat", sessions: 2100, signups: 180 },
  { day: "Sun", sessions: 1900, signups: 160 },
];

const smoothOption = {
  series: [
    { smooth: true, symbol: "none" },
    { smooth: true, symbol: "none" },
  ],
};

const dashedOption = {
  series: [
    {
      lineStyle: { width: 2, type: "solid" as const },
      symbol: "circle",
      symbolSize: 6,
    },
    { lineStyle: { width: 2, type: "dashed" as const }, symbol: "none" },
  ],
};

const steppedOption = {
  series: [
    { smooth: false, step: "middle" as const, symbol: "circle", symbolSize: 5 },
  ],
};

// Air cargo demand: monthly tonnage, flown vs forecast.
const cargoDemand = [
  { m: "Jan", flown: 18200, forecast: 17800 },
  { m: "Feb", flown: 16400, forecast: 17200 },
  { m: "Mar", flown: 19800, forecast: 19100 },
  { m: "Apr", flown: 20500, forecast: 20300 },
  { m: "May", flown: 21300, forecast: 21000 },
  { m: "Jun", flown: 22100, forecast: 22400 },
  { m: "Jul", flown: 21800, forecast: 23100 },
  { m: "Aug", flown: 23600, forecast: 24000 },
  { m: "Sep", flown: 26400, forecast: 25800 },
  { m: "Oct", flown: 28900, forecast: 27600 },
  { m: "Nov", flown: 30100, forecast: 29400 },
  { m: "Dec", flown: 27600, forecast: 28200 },
];

// Peak-season shading behind the series.
const peakOption = {
  series: [
    {
      markArea: {
        silent: true,
        itemStyle: { color: "rgba(245, 158, 11, 0.08)" },
        label: {
          color: "#b45309",
          fontSize: 10,
          position: "insideTop" as const,
        },
        data: [[{ name: "Peak Sep–Dec", xAxis: "Sep" }, { xAxis: "Dec" }]],
      },
    },
    {},
  ],
};

// Spot rates $/kg on the two headhaul lanes.
const spotRates = [
  { m: "Jan", tpeb: 4.1, fewb: 3.8 },
  { m: "Feb", tpeb: 5.9, fewb: 5.2 },
  { m: "Mar", tpeb: 4.4, fewb: 4.0 },
  { m: "Apr", tpeb: 4.0, fewb: 3.7 },
  { m: "May", tpeb: 4.3, fewb: 3.9 },
  { m: "Jun", tpeb: 4.7, fewb: 4.2 },
];

// CNY capacity crunch marker.
const cnyOption = {
  series: [
    {
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: { type: "dashed" as const, color: "#dc2626" },
        label: {
          formatter: "CNY Feb 17",
          color: "#dc2626",
          fontSize: 10,
          position: "insideEndTop" as const,
        },
        data: [{ xAxis: "Feb" }],
      },
    },
  ],
};

// Freighter induction change points.
const changeOption = {
  series: [
    {
      markPoint: {
        symbol: "diamond",
        symbolSize: 16,
        itemStyle: { color: "#14b8a6" },
        label: { color: "#fff", fontSize: 9, formatter: "{b}" },
        data: [
          { name: "B747", coord: ["Apr", 3.7] },
          { name: "+1 rot", coord: ["Jun", 4.2] },
        ],
      },
    },
  ],
};

// Mark a peak point + a target horizontal line.
const markersOption = {
  series: [
    {
      markPoint: {
        symbol: "pin",
        symbolSize: 36,
        label: { color: "#fff", fontSize: 10 },
        data: [{ type: "max", name: "Peak" }],
      },
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: { type: "dashed" as const, color: "#94a3b8" },
        label: { formatter: "Target", position: "insideEndTop" as const },
        data: [{ yAxis: 3200 }],
      },
    },
  ],
};

export default function LineChartDemo() {
  return (
    <>
      <Story
        title="Basic line"
        description="Single-series line with point markers. Smooth interpolation is on by default in the wrapper."
      >
        <LineChart data={traffic} xField="day" yField="sessions" height="280" />
      </Story>

      <Story
        title="Multi-series"
        description="Pass an array to y-field for parallel series; legend renders automatically."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField={["sessions", "signups"]}
          height="300"
        />
      </Story>

      <Story
        title="Smooth, no markers"
        description="Hide point dots when individual values aren't the focus — better for trend-only views."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField={["sessions", "signups"]}
          option={smoothOption}
          height="300"
        />
      </Story>

      <Story
        title="Solid + dashed"
        description="Mix line types: solid actual, dashed projection. The dashed variant tends to read as forecast or last-period."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField={["sessions", "signups"]}
          option={dashedOption}
          height="300"
        />
      </Story>

      <Story
        title="Stepped"
        description="Discrete-state visual — use when the metric only changes at tick boundaries (deploys, releases, threshold tiers)."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField="sessions"
          option={steppedOption}
          height="280"
        />
      </Story>

      <Story
        title="Peak marker + target line"
        description="markPoint highlights extrema; markLine draws a reference baseline. Both are stock ECharts features piped through the option prop."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField="sessions"
          option={markersOption}
          height="280"
        />
      </Story>

      <Story
        title="Linear curves"
        description="Straight segments via the curve prop — no option override needed."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField={["sessions", "signups"]}
          curve="linear"
          height="300"
        />
      </Story>

      <Story
        title="Step start"
        description="Step interpolation flavours (step, stepStart, stepEnd) for discrete metrics."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField="sessions"
          curve="stepStart"
          height="280"
        />
      </Story>

      <Story
        title="Stacked lines"
        description="Cumulative stacking as a first-class prop."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField={["sessions", "signups"]}
          stacked
          height="300"
        />
      </Story>

      <Story
        title="Dashed forecast"
        description="Dashed stroke plus hidden markers reads as projection."
      >
        <LineChart
          data={traffic}
          xField="day"
          yField="sessions"
          dashed
          markers={false}
          height="280"
        />
      </Story>

      <Story
        title="Forecast vs flown, peak shading"
        description="Air cargo demand: flown tonnage against forecast, with the Sep–Dec peak season shaded via markArea."
      >
        <LineChart
          data={cargoDemand}
          xField="m"
          yField={["flown", "forecast"]}
          option={peakOption}
          height="320"
        />
      </Story>

      <Story
        title="Lunar New Year window"
        description="Spot rates ($/kg) with the CNY capacity crunch marked — factories shut, belly space vanishes."
      >
        <LineChart
          data={spotRates}
          xField="m"
          yField="tpeb"
          option={cnyOption}
          height="300"
        />
      </Story>

      <Story
        title="Capacity change points"
        description="Diamond pins where freighters entered the lane — the aircargo app's change-point pattern."
      >
        <LineChart
          data={spotRates}
          xField="m"
          yField="fewb"
          option={changeOption}
          height="300"
        />
      </Story>
    </>
  );
}

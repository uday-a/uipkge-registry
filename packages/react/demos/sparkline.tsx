import Story from "../../components/story/Story";
import { Sparkline } from "@react-registry/charts";

const trendUp = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40];
const trendDown = [42, 38, 41, 33, 36, 28, 30, 22, 19, 14];
const flat = [22, 24, 21, 23, 22, 25, 22, 24, 23, 22];
const winLoss = [1, 1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1];

// Bar-style sparkline via the option escape hatch.
const barOption = {
  series: [
    {
      type: "bar",
      barCategoryGap: "25%",
      itemStyle: { color: "#14b8a6", borderRadius: [2, 2, 0, 0] },
      areaStyle: undefined,
      lineStyle: undefined,
    },
  ],
};

// Win/loss: ±1 values rendered as up-bars (green) / down-bars (red).
const winLossOption = {
  series: [
    {
      type: "bar",
      barCategoryGap: "15%",
      data: winLoss,
      areaStyle: undefined,
      lineStyle: undefined,
      itemStyle: {
        color: (params: any) => (params.value >= 0 ? "#14b8a6" : "#f97316"),
        borderRadius: 1,
      },
    },
  ],
  yAxis: { type: "value", show: false, min: -1.2, max: 1.2 },
};

export default function SparklineDemo() {
  return (
    <>
      <Story
        title="Trend up"
        description="Default line sparkline with gradient fill. Sized for inline use next to a KPI number."
      >
        <div className="flex items-center gap-6 px-2">
          <div>
            <div className="text-muted-foreground font-mono text-xs">MRR</div>
            <div className="text-xl font-semibold">$8.4k</div>
          </div>
          <div className="w-32">
            <Sparkline data={trendUp} height={40} />
          </div>
        </div>
      </Story>

      <Story
        title="Trend down (custom color)"
        description="Pass a single `color` to override the default teal — useful to encode direction without re-styling everything."
      >
        <div className="flex items-center gap-6 px-2">
          <div>
            <div className="text-muted-foreground font-mono text-xs">Churn</div>
            <div className="text-xl font-semibold">3.2%</div>
          </div>
          <div className="w-32">
            <Sparkline data={trendDown} color="#f97316" height={40} />
          </div>
        </div>
      </Story>

      <Story
        title="Flat trend"
        description="Low-variance series. Sparkline still renders a faint area, which tells the reader 'no meaningful change'."
      >
        <div className="flex items-center gap-6 px-2">
          <div>
            <div className="text-muted-foreground font-mono text-xs">
              Latency p50
            </div>
            <div className="text-xl font-semibold">22ms</div>
          </div>
          <div className="w-32">
            <Sparkline data={flat} color="#94a3b8" height={40} />
          </div>
        </div>
      </Story>

      <Story
        title="Bar sparkline"
        description="Same data, but the option escape hatch swaps the series type to `bar` for a categorical-feeling micro-chart."
      >
        <div className="flex items-center gap-6 px-2">
          <div>
            <div className="text-muted-foreground font-mono text-xs">
              Daily signups
            </div>
            <div className="text-xl font-semibold">128</div>
          </div>
          <div className="w-32">
            <Sparkline data={trendUp} option={barOption} height={44} />
          </div>
        </div>
      </Story>

      <Story
        title="Win / loss"
        description="A ±1 sequence rendered as up-vs-down bars. Classic streak visualization for tests, releases, AB cohorts."
      >
        <div className="flex items-center gap-6 px-2">
          <div>
            <div className="text-muted-foreground font-mono text-xs">
              A/B win rate
            </div>
            <div className="text-xl font-semibold">8 / 13</div>
          </div>
          <div className="w-40">
            <Sparkline data={winLoss} option={winLossOption} height={36} />
          </div>
        </div>
      </Story>
    </>
  );
}

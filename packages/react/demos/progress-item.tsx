import Story from "../../components/story/Story";
import { ProgressItem } from "@react-registry/progress-item";

export default function ProgressItemDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Stacked rows with label, value, secondary label, and per-row colorIndex (chart-1..5)."
      >
        <div className="max-w-md space-y-3">
          <ProgressItem
            label="Engineering"
            value={42}
            secondaryLabel="42%"
            colorIndex={0}
          />
          <ProgressItem
            label="Product"
            value={22}
            secondaryLabel="22%"
            colorIndex={1}
          />
          <ProgressItem
            label="Design"
            value={14}
            secondaryLabel="14%"
            colorIndex={2}
          />
          <ProgressItem
            label="Sales"
            value={12}
            secondaryLabel="12%"
            colorIndex={3}
          />
          <ProgressItem
            label="Marketing"
            value={10}
            secondaryLabel="10%"
            colorIndex={4}
          />
        </div>
      </Story>

      <Story
        title="Single item"
        description="One progress row — label on the left, percent on the right by default."
      >
        <div className="max-w-md">
          <ProgressItem label="Profile completion" value={68} />
        </div>
      </Story>

      <Story
        title="Custom barClass"
        description="Override the indicator color with any utility — barClass takes precedence over colorIndex."
      >
        <div className="max-w-md space-y-3">
          <ProgressItem
            label="Healthy"
            value={76}
            barClass="[&_[data-slot=progress-indicator]]:bg-emerald-500"
          />
          <ProgressItem
            label="At risk"
            value={48}
            barClass="[&_[data-slot=progress-indicator]]:bg-amber-500"
          />
          <ProgressItem
            label="Critical"
            value={22}
            barClass="[&_[data-slot=progress-indicator]]:bg-red-500"
          />
        </div>
      </Story>

      <Story
        title="Custom secondary labels"
        description="Use secondaryLabel for non-percentage units like counts, time, or fractions."
      >
        <div className="max-w-md space-y-3">
          <ProgressItem
            label="Tasks completed"
            value={62}
            secondaryLabel="124 / 200"
            colorIndex={1}
          />
          <ProgressItem
            label="Storage used"
            value={34}
            secondaryLabel="3.4 GB / 10 GB"
            colorIndex={2}
          />
          <ProgressItem
            label="Time elapsed"
            value={80}
            secondaryLabel="48m left"
            colorIndex={3}
          />
        </div>
      </Story>

      <Story
        title="Compact stack"
        description="Multiple progress rows in a denser two-column grid for dashboards."
      >
        <div className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-3">
          <ProgressItem label="API uptime" value={99} colorIndex={0} />
          <ProgressItem label="DB uptime" value={97} colorIndex={1} />
          <ProgressItem label="Cache hit rate" value={84} colorIndex={2} />
          <ProgressItem label="Error budget" value={62} colorIndex={3} />
          <ProgressItem
            label="P95 latency"
            value={78}
            secondaryLabel="78ms"
            colorIndex={4}
          />
          <ProgressItem
            label="Throughput"
            value={55}
            secondaryLabel="5.5k/s"
            colorIndex={5}
          />
        </div>
      </Story>
    </>
  );
}

import Story from "../../components/story/Story";
import { Knob } from "@react-registry/knob";
import { useState } from "react";

export default function KnobDemo() {
  const [v1, setV1] = useState(40);
  const [v2, setV2] = useState(7);
  const [v3, setV3] = useState(60);
  const [v4, setV4] = useState(20);
  const [v5, setV5] = useState(75);
  const [v6, setV6] = useState(50);

  return (
    <>
      <Story
        title="Default"
        description="A 100px knob with 0-100 range and step 1. Drag, arrow keys, or wheel to change."
      >
        <div className="flex items-center gap-6">
          <Knob value={v1} onValueChange={setV1} />
          <span className="text-muted-foreground text-sm">value: {v1}</span>
        </div>
      </Story>

      <Story
        title="Custom range and step"
        description="0-10 with step 1. Use any numeric domain."
      >
        <div className="flex items-center gap-6">
          <Knob value={v2} onValueChange={setV2} min={0} max={10} step={1} />
          <span className="text-muted-foreground text-sm">value: {v2}</span>
        </div>
      </Story>

      <Story
        title="Sized"
        description="Pass size in pixels. The dial is square; text scales with the SVG viewBox."
      >
        <div className="flex items-end gap-6">
          <Knob value={v3} onValueChange={setV3} size={60} />
          <Knob value={v3} onValueChange={setV3} size={100} />
          <Knob value={v3} onValueChange={setV3} size={160} />
        </div>
      </Story>

      <Story
        title="Custom colors"
        description="valueColor and rangeColor accept any CSS color or var."
      >
        <div className="flex items-center gap-6">
          <Knob
            value={v4}
            onValueChange={setV4}
            valueColor="var(--chart-1)"
            rangeColor="var(--muted)"
          />
          <Knob
            value={v4}
            onValueChange={setV4}
            valueColor="var(--destructive)"
          />
        </div>
      </Story>

      <Story
        title="Readonly and disabled"
        description="Readonly displays the value but blocks input. Disabled also greys out and removes focus."
      >
        <div className="flex items-center gap-6">
          <Knob value={v5} onValueChange={setV5} readonly />
          <Knob value={v5} onValueChange={setV5} disabled />
        </div>
      </Story>

      <Story
        title="Custom value template"
        description="Override the centered text via the value slot."
      >
        <div className="flex items-center gap-6">
          <Knob
            value={v6}
            onValueChange={setV6}
            renderValue={(value) => <tspan>{value}%</tspan>}
          />
        </div>
      </Story>
    </>
  );
}

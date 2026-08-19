import { useState } from "react";
import Story from "../../components/story/Story";
import { Slider, type SliderMark } from "@react-registry/slider";

export default function SliderDemo() {
  const [single, setSingle] = useState([50]);
  const [singleArray, setSingleArray] = useState([40]);
  const [rangeValue, setRangeValue] = useState([20, 80]);
  const [stepped, setStepped] = useState([30]);
  const [disabledVal, setDisabledVal] = useState([60]);
  const [reversed, setReversed] = useState([30]);
  const [includedOff, setIncludedOff] = useState([40]);
  const [marksValue, setMarksValue] = useState([37]);
  const [dotsValue, setDotsValue] = useState([30]);
  const [verticalVal, setVerticalVal] = useState([30]);
  const [smallVal, setSmallVal] = useState([25]);
  const [tooltipCustom, setTooltipCustom] = useState([50]);

  const marks: Record<number, string | SliderMark> = {
    0: "0°C",
    26: "26°C",
    37: "37°C",
    50: "50°C",
    100: {
      label: "100°C",
      style: { color: "#f50" },
    },
  };

  const formatter = (val: number) => `${val}%`;

  return (
    <>
      <Story
        title="Default (single thumb)"
        description="Number model — the simplest single-thumb slider."
      >
        <div className="max-w-md space-y-3">
          <Slider value={single} onValueChange={setSingle} max={100} step={1} />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{single[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Backward-compat array"
        description="Array model preserved for existing consumers."
      >
        <div className="max-w-md space-y-3">
          <Slider
            value={singleArray}
            onValueChange={setSingleArray}
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{singleArray[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Range"
        description="Dual-thumb range selection with range prop."
      >
        <div className="max-w-md space-y-3">
          <Slider
            value={rangeValue}
            onValueChange={setRangeValue}
            range
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{rangeValue.join(" – ")}</code>
          </p>
        </div>
      </Story>

      <Story title="With step" description="step=10 snaps to multiples of 10.">
        <div className="max-w-md space-y-3">
          <Slider
            value={stepped}
            onValueChange={setStepped}
            max={100}
            step={10}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{stepped[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Disabled"
        description="Non-interactive state with reduced opacity."
      >
        <div className="max-w-md">
          <Slider
            value={disabledVal}
            onValueChange={setDisabledVal}
            max={100}
            step={1}
            disabled
          />
        </div>
      </Story>

      <Story title="Small size" description="Compact track and thumb.">
        <div className="max-w-md space-y-3">
          <Slider
            value={smallVal}
            onValueChange={setSmallVal}
            size="small"
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{smallVal[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Reverse"
        description="Right-to-left rendering using reverse prop."
      >
        <div className="max-w-md space-y-3">
          <Slider
            value={reversed}
            onValueChange={setReversed}
            reverse
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{reversed[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Included = false"
        description="Track fill hidden; only thumbs are visible."
      >
        <div className="max-w-md space-y-3">
          <Slider
            value={includedOff}
            onValueChange={setIncludedOff}
            included={false}
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{includedOff[0]}</code>
          </p>
        </div>
      </Story>

      <Story title="Dots" description="Show dots at every step position.">
        <div className="max-w-md space-y-3">
          <Slider
            value={dotsValue}
            onValueChange={setDotsValue}
            dots
            max={100}
            step={10}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{dotsValue[0]}</code>
          </p>
        </div>
      </Story>

      <Story title="Marks" description="Custom labels at specific values.">
        <div className="max-w-md space-y-6">
          <Slider
            value={marksValue}
            onValueChange={setMarksValue}
            marks={marks}
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{marksValue[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Marks + dots + included"
        description="Combined marks, dots and filled track."
      >
        <div className="max-w-md space-y-6">
          <Slider
            value={marksValue}
            onValueChange={setMarksValue}
            dots
            marks={marks}
            max={100}
            step={10}
          />
        </div>
      </Story>

      <Story
        title="Tooltip formatter"
        description="Custom tooltip text via formatter function."
      >
        <div className="max-w-md space-y-3">
          <Slider
            value={tooltipCustom}
            onValueChange={setTooltipCustom}
            tooltip={formatter}
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value:
            <code className="text-foreground">{tooltipCustom[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="No tooltip"
        description="Tooltip hidden with tooltip=false."
      >
        <div className="max-w-md">
          <Slider
            value={single}
            onValueChange={setSingle}
            tooltip={false}
            max={100}
            step={1}
          />
        </div>
      </Story>

      <Story
        title="Vertical"
        description="Vertical orientation with height prop."
      >
        <div className="flex gap-8">
          <Slider
            value={verticalVal}
            onValueChange={setVerticalVal}
            vertical
            height={160}
            max={100}
            step={1}
          />
          <p className="text-muted-foreground self-end text-xs">
            Value:
            <code className="text-foreground">{verticalVal[0]}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Vertical with marks"
        description="Vertical slider + marks + dots."
      >
        <div className="flex gap-8">
          <Slider
            value={verticalVal}
            onValueChange={setVerticalVal}
            vertical
            dots
            height={160}
            marks={{
              0: "0",
              50: "50",
              100: "100",
            }}
            max={100}
            step={10}
          />
          <p className="text-muted-foreground self-end text-xs">
            Value:
            <code className="text-foreground">{verticalVal[0]}</code>
          </p>
        </div>
      </Story>
    </>
  );
}

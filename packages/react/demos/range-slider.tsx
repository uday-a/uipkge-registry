import Story from "../../components/story/Story";
import { useState } from "react";
import { RangeSlider } from "@react-registry/range-slider";

const currency = (n: number) => `$${n}`;
const percent = (n: number) => `${n}%`;

export default function RangeSliderDemo() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  const [ticked, setTicked] = useState<[number, number]>([25, 75]);
  const [stepped, setStepped] = useState<[number, number]>([10, 40]);
  const [labeled, setLabeled] = useState<[number, number]>([30, 70]);
  const [priced, setPriced] = useState<[number, number]>([100, 750]);
  const [colored, setColored] = useState<[number, number]>([20, 80]);
  const [small, setSmall] = useState<[number, number]>([20, 80]);
  const [large, setLarge] = useState<[number, number]>([20, 80]);
  const [errored, setErrored] = useState<[number, number]>([60, 40]);
  const [locked, setLocked] = useState<[number, number]>([25, 75]);
  const [inverted, setInverted] = useState<[number, number]>([20, 80]);

  return (
    <>
      <Story
        title="Default"
        description="Two-handle slider for selecting a numeric range bounded by min and max."
      >
        <div className="max-w-md space-y-3">
          <RangeSlider
            value={value}
            onValueChange={setValue}
            max={100}
            step={1}
          />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{value.join(" – ")}</code>
          </p>
        </div>
      </Story>

      <Story
        title="With ticks"
        description="Render tick marks at regular intervals with showTicks and tickInterval."
      >
        <div className="max-w-md space-y-3">
          <RangeSlider
            value={ticked}
            onValueChange={setTicked}
            max={100}
            step={1}
            showTicks
            tickInterval={25}
          />
        </div>
      </Story>

      <Story
        title="Custom step + tick interval"
        description="Quantize values with step and align ticks to a different interval."
      >
        <div className="max-w-md space-y-3">
          <RangeSlider
            value={stepped}
            onValueChange={setStepped}
            min={0}
            max={50}
            step={5}
            showTicks
            tickInterval={10}
          />
          <p className="text-muted-foreground text-xs">
            Value:{" "}
            <code className="text-foreground">{stepped.join(" – ")}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Always-visible thumb labels"
        description="Pass thumbLabel to keep the value bubble pinned above each handle."
      >
        <div className="max-w-md space-y-6">
          <RangeSlider
            value={labeled}
            onValueChange={setLabeled}
            max={100}
            thumbLabel
          />
        </div>
      </Story>

      <Story
        title="Custom format (currency)"
        description="Use thumbLabelFormat to render formatted values in the thumb bubble."
      >
        <div className="max-w-md space-y-6">
          <RangeSlider
            value={priced}
            onValueChange={setPriced}
            min={0}
            max={1000}
            step={50}
            thumbLabel
            thumbLabelFormat={currency}
          />
        </div>
      </Story>

      <Story
        title="Color variants"
        description="Use the color prop to recolor the active range."
      >
        <div className="max-w-md space-y-4">
          <RangeSlider
            value={colored}
            onValueChange={setColored}
            max={100}
            color="primary"
          />
          <RangeSlider
            value={colored}
            onValueChange={setColored}
            max={100}
            color="success"
          />
          <RangeSlider
            value={colored}
            onValueChange={setColored}
            max={100}
            color="warning"
          />
          <RangeSlider
            value={colored}
            onValueChange={setColored}
            max={100}
            color="error"
          />
          <RangeSlider
            value={colored}
            onValueChange={setColored}
            max={100}
            color="info"
          />
        </div>
      </Story>

      <Story
        title="Sizes"
        description="Combine thumbSize and trackHeight to scale the slider up or down."
      >
        <div className="max-w-md space-y-4">
          <RangeSlider
            value={small}
            onValueChange={setSmall}
            max={100}
            thumbSize="sm"
            trackHeight="sm"
          />
          <RangeSlider
            value={value}
            onValueChange={setValue}
            max={100}
            thumbSize="md"
            trackHeight="md"
          />
          <RangeSlider
            value={large}
            onValueChange={setLarge}
            max={100}
            thumbSize="lg"
            trackHeight="lg"
          />
        </div>
      </Story>

      <Story
        title="With label and hint"
        description="Pass label and hint props for an embedded form-field layout."
      >
        <div className="max-w-md space-y-3">
          <RangeSlider
            value={labeled}
            onValueChange={setLabeled}
            max={100}
            label="Volume"
            hint="Drag either handle to set the range."
            thumbLabel
            thumbLabelFormat={percent}
          />
        </div>
      </Story>

      <Story
        title="Error state"
        description="Set error or pass errorMessages to surface validation issues."
      >
        <div className="max-w-md space-y-3">
          <RangeSlider
            value={errored}
            onValueChange={setErrored}
            max={100}
            label="Acceptable range"
            error
            errorMessages="Lower bound must be below upper bound."
          />
        </div>
      </Story>

      <Story title="Disabled" description="Lock the slider via disabled.">
        <div className="max-w-md space-y-3">
          <RangeSlider
            value={locked}
            onValueChange={setLocked}
            max={100}
            disabled
          />
        </div>
      </Story>

      <Story
        title="Inverted"
        description="Flip the active range direction with inverted."
      >
        <div className="max-w-md space-y-3">
          <RangeSlider
            value={inverted}
            onValueChange={setInverted}
            max={100}
            inverted
          />
        </div>
      </Story>
    </>
  );
}

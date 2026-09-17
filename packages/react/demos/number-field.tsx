import Story from '../../components/story/Story'
import { Label } from '@react-registry/label'
import { NumberField } from '@react-registry/number-field'
import { useState } from 'react'

export default function NumberFieldDemo() {
  const [basic, setBasic] = useState<number | undefined>(5)
  const [sized, setSized] = useState<number | undefined>(10)
  const [statused, setStatused] = useState<number | undefined>(20)
  const [formatted, setFormatted] = useState<number | undefined>(1000)
  const [precisioned, setPrecisioned] = useState<number | undefined>(3.14159)
  const [rightControls, setRightControls] = useState<number | undefined>(50)
  const [keyboardOff, setKeyboardOff] = useState<number | undefined>(25)
  const [prefixed, setPrefixed] = useState<number | undefined>(100)
  const [bounded, setBounded] = useState<number | undefined>(5)

  return (
    <>
      <Story
        title="Default"
        description="Basic numeric input with increment and decrement buttons, bounded by min and max."
      >
        <div className="max-w-xs space-y-2">
          <Label htmlFor="qty">Quantity</Label>
          <NumberField id="qty" value={basic} onValueChange={setBasic} min={0} max={20} />
        </div>
      </Story>

      <Story title="Sizes" description="Small, middle (default), and large sizes.">
        <div className="flex items-center gap-4">
          <NumberField value={sized} onValueChange={setSized} size="small" min={0} />
          <NumberField value={sized} onValueChange={setSized} size="middle" min={0} />
          <NumberField value={sized} onValueChange={setSized} size="large" min={0} />
        </div>
      </Story>

      <Story title="Status" description="Error and warning validation states.">
        <div className="flex items-center gap-4">
          <NumberField value={statused} onValueChange={setStatused} status="error" min={0} />
          <NumberField value={statused} onValueChange={setStatused} status="warning" min={0} />
        </div>
      </Story>

      <Story title="Formatter / Parser" description="Display formatting with custom formatter and parser functions.">
        <div className="max-w-xs space-y-2">
          <Label>Price</Label>
          <NumberField
            value={formatted}
            onValueChange={setFormatted}
            prefix="$"
            formatter={(v) => v?.toLocaleString() ?? ''}
            parser={(v) => Number(v.replace(/[^0-9.-]/g, ''))}
          />
        </div>
      </Story>

      <Story title="Precision" description="Fixed decimal places using the precision prop.">
        <div className="max-w-xs space-y-2">
          <Label>Pi (3 decimals)</Label>
          <NumberField value={precisioned} onValueChange={setPrecisioned} precision={3} step={0.001} />
        </div>
      </Story>

      <Story title="Controls position right" description="Stacked increment and decrement buttons on the right.">
        <div className="max-w-xs space-y-2">
          <Label>Amount</Label>
          <NumberField value={rightControls} onValueChange={setRightControls} controlsPosition="right" min={0} />
        </div>
      </Story>

      <Story title="Keyboard disabled" description="Arrow keys do not change the value when keyboard is false.">
        <div className="max-w-xs space-y-2">
          <Label>Manual only</Label>
          <NumberField value={keyboardOff} onValueChange={setKeyboardOff} keyboard={false} min={0} />
        </div>
      </Story>

      <Story title="Prefix &amp; Suffix" description="Add text or icons before and after the input value.">
        <div className="flex items-center gap-4">
          <NumberField value={prefixed} onValueChange={setPrefixed} prefix="$" />
          <NumberField value={prefixed} onValueChange={setPrefixed} suffix="%" />
        </div>
      </Story>

      <Story title="Min / Max bounds" description="Buttons visually disable when reaching boundaries.">
        <div className="max-w-xs space-y-2">
          <Label>Bounded (0 – 10)</Label>
          <NumberField value={bounded} onValueChange={setBounded} min={0} max={10} />
        </div>
      </Story>

      <Story title="Disabled &amp; Read-only" description="Non-interactive states.">
        <div className="flex items-center gap-4">
          <NumberField defaultValue={42} disabled />
          <NumberField defaultValue={42} readOnly />
        </div>
      </Story>
    </>
  )
}

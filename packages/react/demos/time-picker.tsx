import Story from '../../components/story/Story'
import { useState } from 'react'
import { Label } from '@react-registry/label'
import { TimePicker, TimeRangePicker } from '@react-registry/time-picker'

const timePresets = [
  { label: 'Morning', value: '08:00' },
  { label: 'Noon', value: '12:00' },
  { label: 'Afternoon', value: '14:00' },
  { label: 'Evening', value: '18:00' },
  { label: 'Night', value: '21:00' },
]

const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 20, 21, 22, 23]
const disabledMinutes = (h: number) => {
  if (h === 12) return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
  return []
}
const disabledSeconds = (h: number, m: number) => {
  if (h === 12 && m === 30) return [0, 1, 2, 3, 4, 5]
  return []
}

export default function TimePickerDemo() {
  const [basicValue, setBasicValue] = useState('09:30')
  const [hmsValue, setHmsValue] = useState('14:30:45')
  const [h12Value, setH12Value] = useState('14:30')
  const [amPmValue, setAmPmValue] = useState('09:30')
  const [disabledValue, setDisabledValue] = useState('12:00')
  const [hideDisabledValue, setHideDisabledValue] = useState('12:00')
  const [stepValue, setStepValue] = useState('09:00')
  const [presetValue, setPresetValue] = useState('09:00')
  const [rangeValue, setRangeValue] = useState<[string, string] | null>(['09:00', '17:00'])
  const rangePresets = [
    { label: 'Work Day', value: ['09:00', '17:00'] as [string, string] },
    { label: 'Morning Shift', value: ['06:00', '14:00'] as [string, string] },
    { label: 'Night Shift', value: ['22:00', '06:00'] as [string, string] },
  ]
  const [smValue, setSmValue] = useState('08:00')
  const [mdValue, setMdValue] = useState('12:00')
  const [lgValue, setLgValue] = useState('18:00')
  const [errorValue, setErrorValue] = useState('')
  const [warningValue, setWarningValue] = useState('')
  const [clearableValue, setClearableValue] = useState('10:00')
  const [nonClearableValue, setNonClearableValue] = useState('10:00')
  const [fullValue, setFullValue] = useState('14:30:45')

  return (
    <>
      {/* 1. Basic */}
      <Story title="Default" description="24-hour time input bound to a string in HH:mm format.">
        <div className="max-w-xs space-y-2">
          <Label>Pick a time</Label>
          <TimePicker value={basicValue} onValueChange={setBasicValue} />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{basicValue}</code>
          </p>
        </div>
      </Story>

      {/* 2. Format HH:mm:ss */}
      <Story title="With Seconds" description="HH:mm:ss format includes a seconds column.">
        <div className="max-w-xs space-y-2">
          <Label>Pick a time</Label>
          <TimePicker value={hmsValue} onValueChange={setHmsValue} format="HH:mm:ss" secondStep={5} />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{hmsValue}</code>
          </p>
        </div>
      </Story>

      {/* 3. Format hh:mm A */}
      <Story title="12-Hour Format" description="hh:mm A displays AM/PM and uses 12-hour columns.">
        <div className="max-w-xs space-y-2">
          <Label>Pick a time</Label>
          <TimePicker value={h12Value} onValueChange={setH12Value} format="hh:mm A" />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{h12Value}</code>
          </p>
        </div>
      </Story>

      {/* 4. use12Hours prop */}
      <Story title="use12Hours" description="Explicit 12-hour mode with AM/PM selector.">
        <div className="max-w-xs space-y-2">
          <Label>Pick a time</Label>
          <TimePicker value={amPmValue} onValueChange={setAmPmValue} use12Hours />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{amPmValue}</code>
          </p>
        </div>
      </Story>

      {/* 5. Disabled time */}
      <Story title="Disabled Time" description="Programmatically disable specific hours, minutes, and seconds.">
        <div className="max-w-xs space-y-2">
          <Label>Business hours only</Label>
          <TimePicker
            value={disabledValue}
            onValueChange={setDisabledValue}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            format="HH:mm:ss"
            secondStep={5}
          />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{disabledValue}</code>
          </p>
        </div>
      </Story>

      {/* 6. Hide disabled options */}
      <Story
        title="Hide Disabled Options"
        description="Disabled values are completely hidden from the columns rather than greyed out."
      >
        <div className="max-w-xs space-y-2">
          <Label>Business hours (hidden)</Label>
          <TimePicker
            value={hideDisabledValue}
            onValueChange={setHideDisabledValue}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            hideDisabledOptions
          />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{hideDisabledValue}</code>
          </p>
        </div>
      </Story>

      {/* 7. Steps */}
      <Story title="Steps" description="Skip values with hour, minute, and second steps.">
        <div className="max-w-xs space-y-2">
          <Label>15-min intervals</Label>
          <TimePicker
            value={stepValue}
            onValueChange={setStepValue}
            hourStep={2}
            minuteStep={15}
            secondStep={10}
            format="HH:mm:ss"
          />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{stepValue}</code>
          </p>
        </div>
      </Story>

      {/* 8. Presets */}
      <Story title="Presets" description="Quick-select common times from a preset list.">
        <div className="max-w-xs space-y-2">
          <Label>Quick select</Label>
          <TimePicker value={presetValue} onValueChange={setPresetValue} presets={timePresets} />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{presetValue}</code>
          </p>
        </div>
      </Story>

      <Story title="Range Picker" description="Select a start and end time side by side.">
        <div className="max-w-sm space-y-2">
          <Label>Working hours</Label>
          <TimeRangePicker value={rangeValue} onValueChange={setRangeValue} presets={rangePresets} />
          <p className="text-muted-foreground text-xs">
            Value:{' '}
            <code className="text-foreground">{rangeValue ? `${rangeValue[0]} ~ ${rangeValue[1]}` : 'none'}</code>
          </p>
        </div>
      </Story>

      {/* 9. Sizes */}
      <Story title="Sizes" description="Small, middle (default), and large trigger heights.">
        <div className="flex max-w-xs flex-col gap-3">
          <TimePicker value={smValue} onValueChange={setSmValue} size="small" placeholder="Small" />
          <TimePicker value={mdValue} onValueChange={setMdValue} size="middle" placeholder="Middle" />
          <TimePicker value={lgValue} onValueChange={setLgValue} size="large" placeholder="Large" />
        </div>
      </Story>

      {/* 10. Status */}
      <Story title="Status" description="Error and warning validation states.">
        <div className="flex max-w-xs flex-col gap-3">
          <TimePicker value={errorValue} onValueChange={setErrorValue} status="error" placeholder="Error state" />
          <TimePicker
            value={warningValue}
            onValueChange={setWarningValue}
            status="warning"
            placeholder="Warning state"
          />
        </div>
      </Story>

      {/* 11. Allow Clear */}
      <Story title="Allow Clear" description="Click the X to clear the selected time.">
        <div className="flex max-w-xs flex-col gap-3">
          <TimePicker value={clearableValue} onValueChange={setClearableValue} allowClear placeholder="Clearable" />
          <TimePicker
            value={nonClearableValue}
            onValueChange={setNonClearableValue}
            allowClear={false}
            placeholder="Not clearable"
          />
        </div>
      </Story>

      {/* 12. Suffix Icon */}
      <Story title="Suffix Icon" description="Clock icon is shown by default in the trigger.">
        <div className="max-w-xs space-y-2">
          <Label>Default clock icon</Label>
          <TimePicker value={basicValue} onValueChange={setBasicValue} />
          <p className="text-muted-foreground text-xs">The Clock icon from Lucide is always rendered.</p>
        </div>
      </Story>

      {/* 13. Full Featured */}
      <Story title="Full Featured" description="Seconds + 12-hour + steps + disabled time + presets all together.">
        <div className="max-w-xs space-y-2">
          <Label>Full featured</Label>
          <TimePicker
            value={fullValue}
            onValueChange={setFullValue}
            format="HH:mm:ss"
            use12Hours
            hourStep={1}
            minuteStep={5}
            secondStep={5}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            presets={timePresets}
            allowClear
          />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{fullValue}</code>
          </p>
        </div>
      </Story>
    </>
  )
}

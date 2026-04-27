import { useState } from 'react'
import Story from '../../components/story/Story'
import { Label } from '@react-registry/label'
import { PinInput, PinInputGroup, PinInputSeparator, PinInputSlot } from '@react-registry/pin-input'

export default function PinInputDemo() {
  const [value, setValue] = useState('')
  const [password, setPassword] = useState('')
  const [small, setSmall] = useState('')
  const [large, setLarge] = useState('')
  const [medium, setMedium] = useState('')
  const [grouped, setGrouped] = useState('')
  const [statusSuccess, setStatusSuccess] = useState('1234')
  const [shakeCode, setShakeCode] = useState('')
  const [shakeStatus, setShakeStatus] = useState<'default' | 'error'>('default')

  return (
    <>
      <Story title="Default" description="Six-slot one-time code input bound to a string array model.">
        <div className="space-y-2">
          <Label>One-time code</Label>
          <PinInput value={value} onChange={setValue} maxLength={6}>
            <PinInputGroup>
              {Array.from({ length: 6 }, (_, i) => (
                <PinInputSlot key={i} index={i} />
              ))}
            </PinInputGroup>
          </PinInput>
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{value || '—'}</code>
          </p>
        </div>
      </Story>

      <Story title="Masked (Password)" description="Hides entered characters like a password field.">
        <div className="space-y-2">
          <Label>Secure PIN</Label>
          <PinInput value={password} onChange={setPassword} maxLength={4} mask>
            <PinInputGroup>
              {Array.from({ length: 4 }, (_, i) => (
                <PinInputSlot key={i} index={i} />
              ))}
            </PinInputGroup>
          </PinInput>
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{password || '—'}</code>
          </p>
        </div>
      </Story>

      <Story title="Sizes" description="Small, medium (default), and large slot sizes.">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Small</Label>
            <PinInput value={small} onChange={setSmall} maxLength={4} size="sm">
              <PinInputGroup>
                {Array.from({ length: 4 }, (_, i) => (
                  <PinInputSlot key={i} index={i} />
                ))}
              </PinInputGroup>
            </PinInput>
          </div>
          <div className="space-y-2">
            <Label>Medium (default)</Label>
            <PinInput value={medium} onChange={setMedium} maxLength={4}>
              <PinInputGroup>
                {Array.from({ length: 4 }, (_, i) => (
                  <PinInputSlot key={i} index={i} />
                ))}
              </PinInputGroup>
            </PinInput>
          </div>
          <div className="space-y-2">
            <Label className="text-lg">Large</Label>
            <PinInput value={large} onChange={setLarge} maxLength={4} size="lg">
              <PinInputGroup>
                {Array.from({ length: 4 }, (_, i) => (
                  <PinInputSlot key={i} index={i} />
                ))}
              </PinInputGroup>
            </PinInput>
          </div>
        </div>
      </Story>

      <Story title="Status" description="Error, warning, and success visual states.">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Error</Label>
            <PinInput maxLength={4} status="error">
              <PinInputGroup>
                {Array.from({ length: 4 }, (_, i) => (
                  <PinInputSlot key={i} index={i} />
                ))}
              </PinInputGroup>
            </PinInput>
          </div>
          <div className="space-y-2">
            <Label>Success</Label>
            <PinInput value={statusSuccess} onChange={setStatusSuccess} maxLength={4} status="success">
              <PinInputGroup>
                {Array.from({ length: 4 }, (_, i) => (
                  <PinInputSlot key={i} index={i} />
                ))}
              </PinInputGroup>
            </PinInput>
          </div>
        </div>
      </Story>

      <Story
        title="Error shake"
        description="One-shot shake when status becomes error. Enter any code except 1234 to trigger."
      >
        <div className="space-y-2">
          <Label>Try a code (correct: 1234)</Label>
          <PinInput
            value={shakeCode}
            maxLength={4}
            status={shakeStatus}
            onChange={(v) => {
              setShakeCode(v)
              if (shakeStatus === 'error' && v.length > 0) setShakeStatus('default')
            }}
            onComplete={(v) => {
              if (v === '1234') {
                setShakeStatus('default')
                return
              }
              setShakeStatus('error')
              window.setTimeout(() => {
                setShakeCode('')
              }, 450)
            }}
          >
            <PinInputGroup>
              {Array.from({ length: 4 }, (_, i) => (
                <PinInputSlot key={i} index={i} />
              ))}
            </PinInputGroup>
          </PinInput>
          <p className="text-muted-foreground text-xs">
            Status: <code className="text-foreground">{shakeStatus}</code>
          </p>
        </div>
      </Story>

      <Story title="With Separator" description="Visual grouping with separators.">
        <div className="space-y-2">
          <Label>Grouped code</Label>
          <PinInput value={grouped} onChange={setGrouped} maxLength={6}>
            <PinInputGroup>
              {Array.from({ length: 3 }, (_, i) => (
                <PinInputSlot key={i} index={i} />
              ))}
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              {Array.from({ length: 3 }, (_, i) => (
                <PinInputSlot key={i + 3} index={i + 3} />
              ))}
            </PinInputGroup>
          </PinInput>
        </div>
      </Story>

      <Story title="Auto Submit" description="Emits complete event when all slots are filled.">
        <div className="space-y-2">
          <Label>Auto-submit PIN</Label>
          <PinInput maxLength={4} onComplete={(v) => alert('PIN complete: ' + v)}>
            <PinInputGroup>
              {Array.from({ length: 4 }, (_, i) => (
                <PinInputSlot key={i} index={i} />
              ))}
            </PinInputGroup>
          </PinInput>
          <p className="text-muted-foreground text-xs">Fill all 4 digits to trigger the complete event</p>
        </div>
      </Story>

      <Story title="Disabled" description="Non-interactive state.">
        <div className="space-y-2">
          <Label>Disabled</Label>
          <PinInput value="1234" onChange={() => {}} maxLength={4} disabled>
            <PinInputGroup>
              {Array.from({ length: 4 }, (_, i) => (
                <PinInputSlot key={i} index={i} />
              ))}
            </PinInputGroup>
          </PinInput>
        </div>
      </Story>
    </>
  )
}

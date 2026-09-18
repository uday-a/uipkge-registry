import Story from '../../components/story/Story'
import { useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@react-registry/toggle-group'
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react'

export default function ToggleGroupDemo() {
  const [align, setAlign] = useState('center')
  const [formats, setFormats] = useState<string[]>(['bold'])
  const [variantValue, setVariantValue] = useState('left')
  const [sizeValue, setSizeValue] = useState('center')
  const [spacedValue, setSpacedValue] = useState<string[]>(['bold', 'italic'])
  const [lockedValue, setLockedValue] = useState('center')
  const [staticValue, setStaticValue] = useState('center')

  return (
    <>
      <Story title="Single select" description="Mutually exclusive icon toggles for text alignment.">
        <ToggleGroup type="single" value={align} onValueChange={(v) => v && setAlign(v)}>
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </Story>

      <Story title="Multiple select" description="Type='multiple' allows several items to be active at once.">
        <div className="space-y-2">
          <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-muted-foreground text-xs">
            Active: <code className="text-foreground">{formats.join(', ') || '—'}</code>
          </p>
        </div>
      </Story>

      <Story title="Variants" description="Default and outline variants applied at the group level.">
        <div className="space-y-3">
          <ToggleGroup
            type="single"
            variant="default"
            value={variantValue}
            onValueChange={(v) => v && setVariantValue(v)}
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            variant="outline"
            value={variantValue}
            onValueChange={(v) => v && setVariantValue(v)}
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Story>

      <Story title="Sizes" description="Small, default, and large heights propagate to all items.">
        <div className="space-y-3">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={sizeValue}
            onValueChange={(v) => v && setSizeValue(v)}
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            variant="outline"
            size="default"
            value={sizeValue}
            onValueChange={(v) => v && setSizeValue(v)}
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            variant="outline"
            size="lg"
            value={sizeValue}
            onValueChange={(v) => v && setSizeValue(v)}
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Story>

      <Story title="With spacing" description="Pass a numeric spacing prop to gap items apart instead of joining them.">
        <ToggleGroup type="multiple" variant="outline" spacing={2} value={spacedValue} onValueChange={setSpacedValue}>
          <ToggleGroupItem value="bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </Story>

      <Story title="Disabled" description="Disable the entire group or individual items.">
        <div className="space-y-3">
          <ToggleGroup
            type="single"
            variant="outline"
            disabled
            value={lockedValue}
            onValueChange={(v) => v && setLockedValue(v)}
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            variant="outline"
            value={lockedValue}
            onValueChange={(v) => v && setLockedValue(v)}
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" disabled>
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Story>

      <Story title="Static (no indicator)" description="animated=false paints on-state chrome on the item itself.">
        <ToggleGroup
          type="single"
          variant="outline"
          animated={false}
          value={staticValue}
          onValueChange={(v) => v && setStaticValue(v)}
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </Story>
    </>
  )
}

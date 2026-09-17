import { useState } from 'react'
import Story from '../../components/story/Story'
import { Switch } from '@react-registry/switch'
import { Label } from '@react-registry/label'
import { Check, X } from 'lucide-react'

export default function SwitchDemo() {
  const [enabled, setEnabled] = useState(true)

  return (
    <>
      <Story title="Default" description="Two-way bound boolean. Click toggles the state.">
        <div className="flex items-center gap-2">
          <Switch id="airplane" checked={enabled} onCheckedChange={setEnabled} />
          <Label htmlFor="airplane">Airplane mode {enabled ? '(on)' : '(off)'}</Label>
        </div>
      </Story>

      <Story title="States" description="On / off / disabled / disabled-on combinations.">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Switch id="s1" defaultChecked />
            <Label htmlFor="s1">Default on</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="s2" />
            <Label htmlFor="s2">Default off</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="s3" disabled />
            <Label htmlFor="s3" className="text-muted-foreground">
              Disabled
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="s4" defaultChecked disabled />
            <Label htmlFor="s4" className="text-muted-foreground">
              Disabled on
            </Label>
          </div>
        </div>
      </Story>

      <Story title="With text" description="Checked and unchecked text labels inside the track.">
        <div className="flex flex-wrap items-center gap-4">
          <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
          <Switch checkedChildren="Yes" unCheckedChildren="No" size="lg" defaultChecked />
          <Switch checkedChildren="Yes" unCheckedChildren="No" size="lg" />
        </div>
      </Story>

      <Story title="With icons" description="Nodes for checked and unchecked children support icons.">
        <div className="flex flex-wrap items-center gap-4">
          <Switch
            defaultChecked
            checkedChildren={<Check className="size-3" />}
            unCheckedChildren={<X className="size-3" />}
          />
          <Switch checkedChildren={<Check className="size-3" />} unCheckedChildren={<X className="size-3" />} />
          <Switch
            size="lg"
            defaultChecked
            checkedChildren={<Check className="size-3.5" />}
            unCheckedChildren={<X className="size-3.5" />}
          />
        </div>
      </Story>

      <Story title="Loading" description="Loading state shows a spinner and disables interaction.">
        <div className="flex flex-wrap items-center gap-4">
          <Switch loading defaultChecked />
          <Switch loading />
          <Switch loading size="lg" defaultChecked />
          <Switch loading size="lg" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
        </div>
      </Story>

      <Story title="Sizes" description="Three sizes with and without inner labels.">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <Switch size="sm" defaultChecked />
            <Switch size="default" defaultChecked />
            <Switch size="lg" defaultChecked />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Switch size="sm" checkedChildren="1" unCheckedChildren="0" defaultChecked />
            <Switch size="default" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
            <Switch size="lg" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
          </div>
        </div>
      </Story>

      <Story title="Colors" description="Custom track colors beyond the default primary.">
        <div className="flex flex-wrap items-center gap-4">
          <Switch color="success" defaultChecked />
          <Switch color="warning" defaultChecked />
          <Switch color="error" defaultChecked />
          <Switch color="info" defaultChecked />
          <Switch color="secondary" defaultChecked />
          <Switch color="#8b5cf6" defaultChecked />
        </div>
      </Story>
    </>
  )
}

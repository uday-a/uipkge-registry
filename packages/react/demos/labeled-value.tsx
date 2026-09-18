import Story from '../../components/story/Story'
import { Avatar, AvatarFallback } from '@react-registry/avatar'
import { Badge } from '@react-registry/badge'
import { Button } from '@react-registry/button'
import { Card, CardContent } from '@react-registry/card'
import { LabeledValue } from '@react-registry/labeled-value'
import { Copy, Check, Mail } from 'lucide-react'
import { useState } from 'react'

const apiKey = 'mock_key_8f3a92c1d4e5b6a7f8e9d0c1b2a3'

export default function LabeledValueDemo() {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard?.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <Story
        title="Default grid"
        description="Horizontal label/value pairs arranged in a responsive three-column grid."
      >
        <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
          <LabeledValue label="Status" value="Active" />
          <LabeledValue label="Plan" value="Pro · Annual" />
          <LabeledValue label="Renewal" value="Sep 12, 2026" />
          <LabeledValue label="Owner" value="Admin User" />
          <LabeledValue label="Members" value="24" />
          <LabeledValue label="Created" value="Mar 4, 2025" />
        </div>
      </Story>

      <Story title="Vertical stack" description="Single-column layout suitable for narrow detail panels and sidebars.">
        <Card className="max-w-xs">
          <CardContent className="space-y-3 p-6">
            <LabeledValue label="Account ID" value="acc_92f8a1b4" />
            <LabeledValue label="Plan" value="Enterprise" />
            <LabeledValue label="Seats" value="120 / 200" />
            <LabeledValue label="Region" value="us-east-1" />
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Custom value via slot"
        description="The default slot replaces the value text — drop in a Badge, icon row, or any composition."
      >
        <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
          <LabeledValue label="Status">
            <Badge>Active</Badge>
          </LabeledValue>
          <LabeledValue label="Health">
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Healthy</Badge>
          </LabeledValue>
          <LabeledValue label="Owner">
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarFallback className="text-xs">UA</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Uday A.</span>
            </div>
          </LabeledValue>
          <LabeledValue label="Contact">
            <div className="flex items-center gap-1.5">
              <Mail className="text-muted-foreground size-3.5" aria-hidden="true" />
              <span className="text-sm font-medium">team@acme.dev</span>
            </div>
          </LabeledValue>
        </div>
      </Story>

      <Story
        title="Truncated long values"
        description="Long text gets truncated to keep the row aligned in tight layouts."
      >
        <Card className="max-w-md">
          <CardContent className="space-y-3 p-6">
            <LabeledValue label="Webhook URL">
              <span className="max-w-[60%] truncate text-sm font-medium">
                https://hooks.example.com/v1/incoming/very-long-id-9f8a2b1c4d5e6f7
              </span>
            </LabeledValue>
            <LabeledValue label="User agent">
              <span className="max-w-[60%] truncate text-sm font-medium">
                Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15
              </span>
            </LabeledValue>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="With copy-button trailing"
        description="Pair a monospace value with a copy button to expose secrets and IDs."
      >
        <Card className="max-w-md">
          <CardContent className="space-y-3 p-6">
            <LabeledValue label="API key">
              <div className="flex items-center gap-2">
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{apiKey.slice(0, 12)}…</code>
                <Button variant="ghost" size="icon" className="size-7" onClick={copy}>
                  {copied ? (
                    <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3.5" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </LabeledValue>
            <LabeledValue label="Project ID">
              <div className="flex items-center gap-2">
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">prj_4a2b9c8d</code>
                <Button variant="ghost" size="icon" className="size-7">
                  <Copy className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </LabeledValue>
          </CardContent>
        </Card>
      </Story>
    </>
  )
}

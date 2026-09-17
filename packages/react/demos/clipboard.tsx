import { useState } from 'react'
import Story from '../../components/story/Story'
import { Clipboard } from '@react-registry/clipboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { cn } from '@/lib/utils'

export default function ClipboardDemo() {
  const [log, setLog] = useState<string[]>([])

  function onCopy(t: string) {
    setLog((prev) => [
      `Copied "${t.slice(0, 40)}${t.length > 40 ? '…' : ''}" at ${new Date().toLocaleTimeString()}`,
      ...prev,
    ])
  }

  return (
    <>
      <Story
        title="Install command"
        description="The most common pattern — a copy icon next to an install or CLI command."
      >
        <div className="bg-muted flex max-w-md items-center justify-between rounded-md p-3">
          <code className="text-sm">npm install @uipkge/ui</code>
          <Clipboard text="npm install @uipkge/ui" onCopy={onCopy} />
        </div>
      </Story>

      <Story
        title="API key & secrets"
        description="Copy a generated API key with a label and a longer timeout so users can confirm it landed in their clipboard."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Live API key</CardTitle>
            <CardDescription>Use this key in your server-side code. Keep it secret.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <code className="text-sm">mock_key_a1b2c3d4e5f6g7h8i9j0</code>
              <Clipboard text="mock_key_a1b2c3d4e5f6g7h8i9j0" label="Copy key" timeout={3000} onCopy={onCopy} />
            </div>
            <div className="bg-muted/50 flex items-center justify-between rounded-md p-3">
              <code className="text-muted-foreground text-sm">sk_test_z9y8x7w6v5u4t3s2r1</code>
              <Clipboard text="sk_test_z9y8x7w6v5u4t3s2r1" label="Copy test key" onCopy={onCopy} />
            </div>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Code snippets"
        description="A copy button anchored to a git clone command and a config snippet — the docs-site staple."
      >
        <div className="max-w-md space-y-3">
          <div className="bg-muted flex items-center justify-between rounded-md p-3">
            <code className="text-sm">git clone https://github.com/uday-a/next-boilerplate.git</code>
            <Clipboard text="git clone https://github.com/uday-a/next-boilerplate.git" onCopy={onCopy} />
          </div>
          <div className="bg-muted flex items-center justify-between rounded-md p-3">
            <code className="text-sm">VITE_API_URL=https://api.example.com</code>
            <Clipboard text="VITE_API_URL=https://api.example.com" onCopy={onCopy} />
          </div>
        </div>
      </Story>

      <Story
        title="Contact details"
        description="Copy an email or URL with a custom tooltip so users know exactly what they are copying."
      >
        <div className="flex max-w-md flex-wrap items-center gap-4">
          <Clipboard
            text="support@uipkge.dev"
            tooltip="Copy email"
            successText="Email copied!"
            label="support@uipkge.dev"
            onCopy={onCopy}
          />
          <Clipboard
            text="https://uipkge.dev/docs/getting-started"
            tooltip="Copy link"
            successText="Link copied!"
            label="Copy docs link"
            onCopy={onCopy}
          />
        </div>
      </Story>

      <Story
        title="Label-only & custom render prop"
        description="hideIcon shows just the label; the children render-prop lets you render fully custom copy UI."
      >
        <div className="flex max-w-md flex-wrap items-center gap-4">
          <Clipboard text="label-only-text" label="Copy this text" hideIcon onCopy={onCopy} />
          <Clipboard text="slot-demo" onCopy={onCopy}>
            {(state) => (
              <span
                className={cn(
                  'text-xs font-medium',
                  state === 'success' ? 'text-emerald-500' : 'text-muted-foreground',
                )}
              >
                {state === 'success' ? 'Done!' : 'Copy me'}
              </span>
            )}
          </Clipboard>
        </div>
      </Story>

      <Story
        title="Button-styled"
        description="Apply button classes via the className prop for a prominent copy action in toolbars."
      >
        <Clipboard
          text="npx shadcn@latest add https://uipkge.dev/r/react/button.json"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-1.5"
          label="Copy install command"
          onCopy={onCopy}
        />
      </Story>

      <Story
        title="Event log"
        description="copy / success / error events fire at each stage — the log below updates live as you copy."
      >
        <div className="max-w-md space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Clipboard text="event-demo-1" onCopy={onCopy} />
            <Clipboard text="event-demo-2" label="Copy second" onCopy={onCopy} />
            <Clipboard text="cannot-copy" disabled tooltip="Disabled" />
          </div>
          <div className="bg-muted/40 rounded-md p-3 text-xs">
            {log.length === 0 ? (
              <p className="text-muted-foreground">No copies yet — click a button above.</p>
            ) : (
              <ul className="space-y-1">
                {log.slice(0, 5).map((line, i) => (
                  <li key={i} className="text-foreground">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Story>
    </>
  )
}

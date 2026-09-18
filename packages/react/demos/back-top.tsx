import * as React from 'react'
import { ArrowUp, ChevronUp } from 'lucide-react'
import Story from '../../components/story/Story'
import { BackTop } from '@react-registry/back-top'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'

const feed = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Release notes v0.${i + 12}.0`,
  excerpt: 'Bug fixes, performance improvements, and a few new primitives shipped this week.',
}))

export default function BackTopDemo() {
  const [visibleLog, setVisibleLog] = React.useState<string[]>([])

  function onVisible(v: boolean) {
    setVisibleLog((prev) => {
      const next = [`${v ? 'shown' : 'hidden'} at ${new Date().toLocaleTimeString()}`, ...prev]
      return next.slice(0, 3)
    })
  }

  return (
    <>
      <Story
        title="In a long article"
        description="A realistic reading surface — scroll the card and the button fades in at the bottom-right once you pass the threshold."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Changelog</CardTitle>
            <CardDescription>Scroll the list below to reveal the back-to-top button.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="back-top-feed border-border relative max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
              {feed.map((item) => (
                <div key={item.id} className="bg-muted/40 rounded-md p-3">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{item.excerpt}</p>
                </div>
              ))}
              <BackTop target=".back-top-feed" offset={8} threshold={40} position="bottom-right" absolute />
            </div>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Page-level (live)"
        description="One live instance bound to the window. Scroll the whole page down past 200px and the button appears in the corner."
      >
        <p className="text-muted-foreground max-w-md text-sm">
          Scroll the page itself to reveal the floating button. It smooth-scrolls back to the top on click.
        </p>
        <BackTop threshold={200} offset={24} position="bottom-right" onVisible={onVisible} />
      </Story>

      <Story
        title="Visibility events"
        description="The onVisible event fires whenever the button toggles. Scroll the page above to populate the log."
      >
        <div className="max-w-md space-y-1 text-xs">
          {visibleLog.map((log) => (
            <p key={log} className="text-muted-foreground tabular-nums">
              {log}
            </p>
          ))}
          {visibleLog.length === 0 && (
            <p className="text-muted-foreground">Scroll the page to fire onVisible events.</p>
          )}
        </div>
      </Story>

      <Story
        title="Size variants"
        description="sm, default, and lg shown in matched containers so the relative scale reads at a glance."
      >
        <div className="flex items-end gap-4">
          <div className="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <BackTop size="sm" threshold={0} absolute offset={4} />
            <span className="text-muted-foreground mb-1 text-xs">sm</span>
          </div>
          <div className="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <BackTop size="default" threshold={0} absolute offset={4} />
            <span className="text-muted-foreground mb-1 text-xs">default</span>
          </div>
          <div className="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <BackTop size="lg" threshold={0} absolute offset={4} />
            <span className="text-muted-foreground mb-1 text-xs">lg</span>
          </div>
        </div>
      </Story>

      <Story
        title="Custom icon"
        description="Override the default arrow via the icon prop — useful when the action is 'jump to section' rather than 'to top'."
      >
        <div className="flex items-end gap-4">
          <div className="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <BackTop threshold={0} absolute offset={4} icon={<ChevronUp />} />
            <span className="text-muted-foreground mb-1 text-xs">ChevronUp</span>
          </div>
          <div className="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <BackTop threshold={0} absolute offset={4} icon={<ArrowUp className="size-5" />} />
            <span className="text-muted-foreground mb-1 text-xs">ArrowUp</span>
          </div>
        </div>
      </Story>

      <Story
        title="Edge anchors"
        description="Four corner positions for the floating button. Each preview box is a positioned container."
      >
        <div className="grid max-w-md grid-cols-2 gap-4">
          <div className="border-border relative h-28 rounded-md border p-3">
            <span className="text-muted-foreground text-xs">bottom-right</span>
            <BackTop threshold={0} position="bottom-right" offset={8} absolute />
          </div>
          <div className="border-border relative h-28 rounded-md border p-3">
            <span className="text-muted-foreground text-xs">bottom-left</span>
            <BackTop threshold={0} position="bottom-left" offset={8} absolute />
          </div>
          <div className="border-border relative h-28 rounded-md border p-3">
            <span className="text-muted-foreground text-xs">top-right</span>
            <BackTop threshold={0} position="top-right" offset={8} absolute />
          </div>
          <div className="border-border relative h-28 rounded-md border p-3">
            <span className="text-muted-foreground text-xs">top-left</span>
            <BackTop threshold={0} position="top-left" offset={8} absolute />
          </div>
        </div>
      </Story>

      <Story
        title="Threshold & behavior"
        description="threshold controls when the button appears (default 200px); behavior switches between smooth and instant scroll."
      >
        <p className="text-muted-foreground max-w-md text-sm">
          Use a higher <code className="text-foreground">threshold</code> like 600px to delay visibility until the user
          has scrolled significantly. Set <code className="text-foreground">behavior="auto"</code> for an instant jump
          instead of the default animated scroll.
        </p>
      </Story>
    </>
  )
}

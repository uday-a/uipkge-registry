import Story from '../../components/story/Story'
import { AnimatedNumber } from '@react-registry/animated-number'
import { TrendingDown, TrendingUp } from 'lucide-react'
import * as React from 'react'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const percent = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const deDe = new Intl.NumberFormat('de-DE')

function LiveTicker() {
  const [live, setLive] = React.useState(4200)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLive((v) => Math.max(0, v + Math.round((Math.random() - 0.4) * 300)))
    }, 2000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="bg-card inline-flex items-baseline gap-2 rounded-lg border px-5 py-3">
      <span className="text-muted-foreground text-xs tracking-widest uppercase">requests/min</span>
      <span className="text-3xl font-bold">
        <AnimatedNumber value={live} />
      </span>
    </div>
  )
}

function Retargeting() {
  const [target, setTarget] = React.useState(1200)
  return (
    <div className="space-y-3">
      <p className="text-4xl font-bold">
        <AnimatedNumber value={target} />
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium"
          onClick={() => setTarget((t) => t + 1000)}
        >
          +1000
        </button>
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium"
          onClick={() => setTarget((t) => t * 2)}
        >
          ×2
        </button>
        <button
          type="button"
          className="hover:bg-accent rounded-md border px-3 py-1.5 text-sm font-medium"
          onClick={() => setTarget(1200)}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default function AnimatedNumberDemo() {
  return (
    <>
      <Story title="Default" description="Integer count-up from zero on load.">
        <p className="text-4xl font-bold">
          <AnimatedNumber value={2481} />
        </p>
      </Story>

      <Story title="Currency" description="Formatted with Intl.NumberFormat USD.">
        <p className="text-4xl font-bold">
          <AnimatedNumber value={98750} format={(v) => usd.format(v)} />
        </p>
      </Story>

      <Story title="Percentage" description="One decimal place via Intl percent style.">
        <p className="text-4xl font-bold">
          <AnimatedNumber value={0.842} format={(v) => percent.format(v)} />
        </p>
      </Story>

      <Story title="Compact notation" description="Large numbers collapse to 1.2K / 3.4M style.">
        <p className="text-4xl font-bold">
          <AnimatedNumber value={3420000} format={(v) => compact.format(v)} />
        </p>
      </Story>

      <Story title="Fast vs slow" description="300ms vs 2400ms side by side — pick a duration that matches the moment.">
        <div className="flex items-end gap-10">
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">fast · 300ms</p>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={512} duration={300} />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">slow · 2400ms</p>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={512} duration={2400} />
            </p>
          </div>
        </div>
      </Story>

      <Story
        title="Live ticker"
        description="Value drifts every two seconds; the tween retargets from the displayed value."
      >
        <LiveTicker />
      </Story>

      <Story title="KPI delta" description="Negative renders red with a down arrow, positive green with an up arrow.">
        <div className="flex gap-8">
          <div className="text-success flex items-center gap-1.5">
            <TrendingUp className="size-4" aria-hidden="true" />
            <span className="text-lg font-semibold">
              +<AnimatedNumber value={12.4} format={(v) => v.toFixed(1)} />%
            </span>
          </div>
          <div className="text-destructive flex items-center gap-1.5">
            <TrendingDown className="size-4" aria-hidden="true" />
            <span className="text-lg font-semibold">
              −<AnimatedNumber value={3.8} format={(v) => v.toFixed(1)} />%
            </span>
          </div>
        </div>
      </Story>

      <Story title="Tabular column" description="tabular-nums keeps a column of changing figures aligned.">
        <div className="w-64 space-y-2">
          {[3, 17, 128].map((n) => (
            <div key={n} className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">Region {n}</span>
              <span className="font-medium">
                <AnimatedNumber value={n * 137} duration={1400} />
              </span>
            </div>
          ))}
        </div>
      </Story>

      <Story title="Staggered trio" description="Delay 0 / 150 / 300ms for a cascading count-up.">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={99} delay={0} />
            </p>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">uptime %</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={54} delay={150} />
            </p>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">components</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={12} delay={300} />
            </p>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">blocks</p>
          </div>
        </div>
      </Story>

      <Story title="Disabled" description="disabled renders the target instantly — useful above the fold or in print.">
        <p className="text-4xl font-bold">
          <AnimatedNumber value={7777} disabled />
        </p>
      </Story>

      <Story
        title="Retargeting"
        description="Buttons jump the target mid-animation; the tween eases from wherever it is."
      >
        <Retargeting />
      </Story>

      <Story title="Locale" description="de-DE grouping — formatters are just functions.">
        <p className="text-4xl font-bold">
          <AnimatedNumber value={1234567} format={(v) => deDe.format(v)} />
        </p>
      </Story>
    </>
  )
}

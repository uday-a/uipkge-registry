import Story from '../../components/story/Story'
import { ProgressLinear } from '@react-registry/progress-linear'

export default function ProgressLinearDemo() {
  return (
    <>
      <Story title="Determinate" description="Linear progress bar driven by a fixed model value (0–100).">
        <div className="max-w-md">
          <ProgressLinear value={60} />
        </div>
      </Story>

      <Story title="Indeterminate" description="indeterminate animates a sliding bar for unknown-duration tasks.">
        <div className="max-w-md">
          <ProgressLinear indeterminate />
        </div>
      </Story>

      <Story
        title="Buffer"
        description="buffer renders a secondary fill behind the main value — useful for pre-loading or video buffering."
      >
        <div className="max-w-md">
          <ProgressLinear value={35} buffer={65} />
        </div>
      </Story>

      <Story
        title="Stream"
        description="stream animates a dotted overlay on the track (determinate only — disabled while indeterminate)."
      >
        <div className="max-w-md">
          <ProgressLinear value={40} stream buffer={70} />
        </div>
      </Story>

      <Story title="Striped" description="striped paints diagonal hatch marks on the fill for a loading aesthetic.">
        <div className="max-w-md space-y-3">
          <ProgressLinear value={70} striped />
          <ProgressLinear value={45} striped color="var(--info)" />
        </div>
      </Story>

      <Story
        title="Color tokens"
        description="color accepts a CSS color or a token name (primary / success / warning / info / destructive)."
      >
        <div className="max-w-md space-y-3">
          <ProgressLinear value={60} color="var(--success)" />
          <ProgressLinear value={40} color="var(--warning)" />
          <ProgressLinear value={20} color="var(--destructive)" />
          <ProgressLinear value={80} color="var(--info)" />
        </div>
      </Story>

      <Story
        title="Heights"
        description="height (px or any CSS length) tunes the track thickness from a hairline to a chunky bar."
      >
        <div className="max-w-md space-y-3">
          <ProgressLinear value={60} height={2} />
          <ProgressLinear value={60} height={4} />
          <ProgressLinear value={60} height={8} />
          <ProgressLinear value={60} height={14} rounded="full" />
        </div>
      </Story>

      <Story
        title="Reverse"
        description="reverse fills from right-to-left — useful for RTL UIs or count-down semantics."
      >
        <div className="max-w-md">
          <ProgressLinear value={35} reverse />
        </div>
      </Story>
    </>
  )
}

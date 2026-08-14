import { LogoTickerInfinite } from '@/components/blocks/logo-ticker-infinite'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story
      title="Default"
      description="Infinite logo ticker with category tabs, pause/speed controls, and telemetry hover"
    >
      <div className="w-full">
        <LogoTickerInfinite />
      </div>
    </Story>
  )
}

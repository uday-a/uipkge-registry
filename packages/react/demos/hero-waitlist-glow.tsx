import { HeroWaitlistGlow } from '@/components/blocks/hero-waitlist-glow'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Early access waitlist hero with role tracks and queue allocation">
      <div className="w-full">
        <HeroWaitlistGlow />
      </div>
    </Story>
  )
}

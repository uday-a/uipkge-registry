import { SocialProofStatCounterStream } from '@/components/blocks/social-proof-stat-counter-stream'
import { Story } from '@/components/story/Story'

export default function SocialProofStatCounterStreamDemo() {
  return (
    <Story
      title="Default"
      description="Live telemetry stat counter with animated numerical streams and global edge round-trip latency ticker."
    >
      <SocialProofStatCounterStream />
    </Story>
  )
}

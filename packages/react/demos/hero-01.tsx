import Story from '../../components/story/Story'
import { Hero01 } from '@react-registry-blocks/hero-01/Hero01'
// Hero01 is the block file the user installs. Open
// `components/blocks/Hero01.tsx` after install to edit copy, swap the KPI
// tiles, or replace the avatar list with real onboarding data.

export default function Hero01Demo() {
  return (
    <Story
      title="Hero 01"
      description="Two-column hero. Eyebrow badge, large headline, supporting copy, primary + outline CTAs, social-proof row, and a 3-card KPI collage on the right (active users / uptime / onboarding queue)."
    >
      <Hero01 />
    </Story>
  )
}

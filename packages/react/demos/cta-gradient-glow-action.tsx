import { CtaGradientGlowAction } from '@/components/blocks/cta-gradient-glow-action'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="High-impact conversion CTA with ambient glow and copyable terminal installer">
      <div className="w-full">
        <CtaGradientGlowAction />
      </div>
    </Story>
  )
}

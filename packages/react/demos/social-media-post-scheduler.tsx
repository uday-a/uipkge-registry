import Story from '../../components/story/Story'
import { SocialMediaPostScheduler } from '@react-registry-blocks/social-media-post-scheduler/SocialMediaPostScheduler'

export default function SocialMediaPostSchedulerDemo() {
  return (
    <>
      <Story
        title="Default multi-channel composer"
        description="Buffer and Hootsuite style social post composer and scheduler with target channel toggles, character limit monitoring, hashtag and emoji quick insert, media dropzone, optimal engagement scheduling, and high-fidelity live social feed previews."
      >
        <SocialMediaPostScheduler />
      </Story>

      <Story
        title="Product launch announcement"
        description="Technical release announcement tailored for developer audiences across X (Twitter), LinkedIn, and Threads."
      >
        <SocialMediaPostScheduler
          initialContent="🚀 UIPKGE v2.4 is live! 40+ accessible headless UI primitives, zero npm lock-in, and full OKLCH dark mode tokens. Built for speed and craft. Try the interactive playground now! 👇&#10;&#10;#UI #OpenSource #DesignSystem #WebDev"
          initialChannels={['twitter', 'linkedin', 'threads']}
          initialMediaUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
          initialDate="2026-08-28"
          initialTime="10:00 AM EST"
          initialAutoRepost={true}
        />
      </Story>

      <Story
        title="Instagram visual campaign"
        description="Media-centric photography workflow showcasing responsive aspect ratios and Instagram feed layout mockup."
      >
        <SocialMediaPostScheduler
          initialContent="Behind the scenes: Crafting pixel-perfect spring physics and sub-pixel optical alignments in our design engineering studio. ✨&#10;&#10;#DesignSystem #Frontend #UI #Tech"
          initialChannels={['instagram', 'threads']}
          initialMediaUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
          initialDate="2026-08-30"
          initialTime="01:30 PM EST"
          initialAutoRepost={false}
        />
      </Story>
    </>
  )
}

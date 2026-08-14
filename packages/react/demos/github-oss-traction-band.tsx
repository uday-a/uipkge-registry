import { GithubOssTractionBand } from '@/components/blocks/github-oss-traction-band'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Open source community traction band with star count and release pulse">
      <div className="w-full">
        <GithubOssTractionBand />
      </div>
    </Story>
  )
}

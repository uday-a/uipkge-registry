import { FeatureVisualChangelogDiff } from '@/components/blocks/feature-visual-changelog-diff'
import { Story } from '@/components/story/Story'

export default function FeatureVisualChangelogDiffDemo() {
  return (
    <Story
      title="Default"
      description="Visual semantic git changelog with unified code diff highlighting and commit hash copy verification."
    >
      <FeatureVisualChangelogDiff />
    </Story>
  )
}

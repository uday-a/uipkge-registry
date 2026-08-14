import Story from '../../components/story/Story'
import { CaseStudyFeaturedStory } from '@react-registry-blocks/case-study-featured-story/CaseStudyFeaturedStory'
// CaseStudyFeaturedStory is the block file the user installs. Open
// `components/blocks/CaseStudyFeaturedStory.tsx` after install to replace
// the narrative and the `results` array. The panel is `lg:sticky`, so long
// narratives keep the numbers in view.

export default function CaseStudyFeaturedStoryDemo() {
  return (
    <Story
      title="Case Study — Featured Story"
      description="One featured customer story. The narrative column carries challenge, approach, and result copy with a pull quote; the results panel pins four metrics and company facts alongside."
    >
      <CaseStudyFeaturedStory />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { RatingsAwardWall } from '@react-registry-blocks/ratings-award-wall/RatingsAwardWall'
// RatingsAwardWall is the block file the user installs. Open
// `components/blocks/RatingsAwardWall.tsx` after install to swap the entries;
// keep the period, it is what makes an award meaningful.

export default function RatingsAwardWallDemo() {
  return (
    <Story
      title="Ratings — Award Wall"
      description="Award grid where each entry names the awarding body, category, and period — a badge wall that stays checkable rather than decorative."
    >
      <RatingsAwardWall />
    </Story>
  )
}

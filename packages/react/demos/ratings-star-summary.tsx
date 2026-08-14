import Story from '../../components/story/Story'
import { RatingsStarSummary } from '@react-registry-blocks/ratings-star-summary/RatingsStarSummary'
// RatingsStarSummary is the block file the user installs. Open
// `components/blocks/RatingsStarSummary.tsx` after install to feed real
// counts; stars render from the score, so halves need no extra markup.

export default function RatingsStarSummaryDemo() {
  return (
    <Story
      title="Ratings — Star Summary"
      description="A large aggregate score with a partial-star row, beside the per-star distribution and the review count each bar represents."
    >
      <RatingsStarSummary />
    </Story>
  )
}

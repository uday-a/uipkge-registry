import Story from '../../components/story/Story'
import { RatingsReviewBadges } from '@react-registry-blocks/ratings-review-badges/RatingsReviewBadges'
// RatingsReviewBadges is the block file the user installs. Open
// `components/blocks/RatingsReviewBadges.tsx` after install to edit the
// `platforms` and `distribution` arrays. Stars are rendered from the score,
// so a half-star value needs no extra markup.

export default function RatingsReviewBadgesDemo() {
  return (
    <Story
      title="Ratings & Review Badges"
      description="Third-party rating proof. Four platform cards show stars, score, review count, and category award, over a rating-distribution breakdown and a verified-reviews footnote."
    >
      <RatingsReviewBadges />
    </Story>
  )
}

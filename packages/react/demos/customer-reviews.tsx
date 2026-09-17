import Story from '../../components/story/Story'
import { CustomerReviews } from '@react-registry-blocks/customer-reviews/CustomerReviews'

export default function CustomerReviewsDemo() {
  return (
    <Story
      title="Customer Reviews"
      description="Dedicated customer reviews section with ratings breakdown, interactive distribution bars, photo gallery with thumbnail overlay, filter chips, sort options, detailed verified buyer cards with attached photos, reactive helpful counter, and review submission form."
    >
      <CustomerReviews />
    </Story>
  )
}

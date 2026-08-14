'use client'

import { ProductQaCommunity } from '@/components/blocks/product-qa-community'
import { Story } from '../../components/story/Story'

export default function ProductQaCommunityDemo() {
  return (
    <Story
      title="Product Q&A & Community Hub"
      description="Searchable customer and staff engineering Q&A forum with upvoting, question ask form, and verified owner answers."
    >
      <ProductQaCommunity />
    </Story>
  )
}

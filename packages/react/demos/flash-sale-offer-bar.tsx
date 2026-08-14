'use client'

import { FlashSaleOfferBar } from '@/components/blocks/flash-sale-offer-bar'
import { Story } from '../../components/story/Story'

export default function FlashSaleOfferBarDemo() {
  return (
    <Story
      title="Flash Sale & Tiered Discounts"
      description="Limited-time lightning deal with claim progress and multi-buy volume tiers."
    >
      <FlashSaleOfferBar />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { PropertyListingCard } from '@react-registry-blocks/property-listing-card/PropertyListingCard'

export default function PropertyListingCardDemo() {
  return (
    <Story
      title="Real Estate Property Listings"
      description="Zillow and Redfin style real estate property card featuring 16:9 interactive image carousels, live price and mortgage estimates, specification pills (beds, baths, sq ft, $/sqft), key feature tags, broker attribution, and direct tour scheduling."
    >
      <PropertyListingCard />
    </Story>
  )
}

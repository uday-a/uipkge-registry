import Story from '../../components/story/Story'
import { PropertyAmenitiesGrid } from '@react-registry-blocks/property-amenities-grid/PropertyAmenitiesGrid'

export default function PropertyAmenitiesGridDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Full community and luxury building amenities grid with interactive category filtering, live keyword search, and rich feature cards."
      >
        <PropertyAmenitiesGrid />
      </Story>

      <Story
        title="Custom Copy"
        description="Customized title, subtitle, and eyebrow badge tailored to luxury hospitality or boutique residences."
      >
        <PropertyAmenitiesGrid
          badge="Resort Privileges"
          title="Exclusive Resident Sanctuaries"
          subtitle="Experience an elevated lifestyle curated for health, high performance, and uncompromised ease."
        />
      </Story>
    </>
  )
}

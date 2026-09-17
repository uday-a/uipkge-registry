import Story from '../../components/story/Story'
import { FreightQuoteCalculator } from '@react-registry-blocks/freight-quote-calculator/FreightQuoteCalculator'

export default function FreightQuoteCalculatorDemo() {
  return (
    <>
      <Story
        title="Interactive Freight Rate & Cargo Quote Calculator"
        description="Multimodal Air, Ocean, and Ground freight rate estimator with CBM volumetric weight calculation, interactive dimensions, value-added services, and live sticky quote comparison."
      >
        <FreightQuoteCalculator />
      </Story>

      <Story
        title="Transatlantic Freight Lane (Rotterdam to New York)"
        description="Preconfigured European trade route with EUR currency, 12 pallets volume, and dynamic container capacity estimation."
      >
        <FreightQuoteCalculator
          initialOrigin="NLRTM"
          initialDestination="USNYC"
          initialPallets={12}
          initialLengthCm={120}
          initialWidthCm={100}
          initialHeightCm={180}
          initialGrossWeightKg={450}
          initialCurrency="EUR"
        />
      </Story>

      <Story
        title="Express Air Cargo Consignment (Singapore to Felixstowe)"
        description="High-priority air cargo configuration with Singapore hub origin, GBP currency, and 4 high-density pallets."
      >
        <FreightQuoteCalculator
          initialOrigin="SGSIN"
          initialDestination="GBFXT"
          initialPallets={4}
          initialLengthCm={120}
          initialWidthCm={80}
          initialHeightCm={140}
          initialGrossWeightKg={220}
          initialCurrency="GBP"
        />
      </Story>
    </>
  )
}

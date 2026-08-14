import Story from '../../components/story/Story'
import { CommercialInvoiceGenerator } from '@react-registry-blocks/commercial-invoice-generator'

export default function CommercialInvoiceGeneratorDemo() {
  return (
    <Story
      title="Default"
      description="B2B cross-border commercial customs invoice generator with HTS codes and CIF valuation."
    >
      <div className="p-4">
        <CommercialInvoiceGenerator />
      </div>
    </Story>
  )
}

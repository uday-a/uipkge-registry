import Story from '../../components/story/Story'
import { InvoiceCreatorWizard } from '@react-registry-blocks/invoice-creator-wizard/InvoiceCreatorWizard'

const euroRetainerItems = [
  {
    id: 'ret-1',
    description: 'Monthly Product Design Retainer (Sprint 34)',
    quantity: 1,
    unitPrice: 4500,
  },
  {
    id: 'ret-2',
    description: 'Design System Governance & Token Updates',
    quantity: 12,
    unitPrice: 150,
  },
  {
    id: 'ret-3',
    description: 'Interactive Prototyping Workshop & Team Training',
    quantity: 1,
    unitPrice: 1200,
  },
]

export default function InvoiceCreatorWizardDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Full interactive invoice wizard with itemized table, real-time calculations, client presets, and live printable document preview."
      >
        <InvoiceCreatorWizard />
      </Story>

      <Story
        title="European Agency Retainer"
        description="Pre-configured invoice in EUR with VAT rate, custom discount, and Net 15 payment terms."
      >
        <InvoiceCreatorWizard
          initialInvoiceNumber="INV-2026-EU-089"
          initialCurrency="EUR"
          initialTaxRate={20}
          initialDiscountValue={200}
          initialPaymentTerms="net15"
          initialItems={euroRetainerItems}
        />
      </Story>
    </>
  )
}

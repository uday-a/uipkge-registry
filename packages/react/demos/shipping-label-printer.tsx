import Story from '../../components/story/Story'
import { ShippingLabelPrinter } from '@react-registry-blocks/shipping-label-printer/ShippingLabelPrinter'

export default function ShippingLabelPrinterDemo() {
  return (
    <>
      <Story
        title="Shipping Label Creation & Dispatch Station"
        description="Multi-carrier shipping label workstation (FedEx, UPS, USPS, DHL) with live digital scale sync, package dimensional weight calculator, delivery accessorials, and realistic 4×6 high-contrast thermal printable label preview."
      >
        <ShippingLabelPrinter />
      </Story>

      <Story
        title="UPS Ground Preset"
        description="Pre-configured dispatch workstation preset for UPS Ground shipping with tracked guaranteed transit."
      >
        <ShippingLabelPrinter initialCarrier="ups" initialOrderRef="#ORD-94102" />
      </Story>

      <Story
        title="USPS Priority Mail Preset"
        description="Pre-configured dispatch workstation preset for USPS Priority Mail commercial rate dispatch."
      >
        <ShippingLabelPrinter initialCarrier="usps" initialOrderRef="#ORD-88231" />
      </Story>

      <Story
        title="DHL Express International Preset"
        description="Pre-configured dispatch workstation preset for DHL Express time-definite worldwide air transit."
      >
        <ShippingLabelPrinter initialCarrier="dhl" initialOrderRef="#ORD-77190" />
      </Story>
    </>
  )
}

import Story from '../../components/story/Story'
import { BillOfLadingViewer } from '@react-registry-blocks/bill-of-lading-viewer/BillOfLadingViewer'

export default function BillOfLadingViewerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Standard original negotiable ocean bill of lading with carrier verification, multi-party logistics grid, container cargo manifest, freight terms, and customs compliance inspector."
      >
        <BillOfLadingViewer />
      </Story>

      <Story
        title="Air Waybill / Transatlantic Air Cargo"
        description="Air consignment note variant configured for scheduled air freight with IATA airport routing, expedited carrier details, and custom freight terms."
      >
        <BillOfLadingViewer
          documentTitle="Air Waybill (Non-Negotiable Consignment Note)"
          bolNumber="#AWB-2026-449102"
          carrierName="Lufthansa Cargo AG"
          scacCode="LH"
          bookingReference="BKG-LH-99201"
          exportReference="EXP-DE-2026-771"
          placeOfIssue="Frankfurt, Germany"
          vesselVoyage="Boeing 777-F / Flight LH8401"
          vesselImo="ICAO DLH"
          vesselFlag="Germany (DE)"
          portOfLoading="Frankfurt Airport (FRA)"
          portOfDischarge="Chicago O'Hare Intl (ORD)"
          placeOfDelivery="Chicago Midwest Cargo Hub (ORD)"
          finalDestination="Detroit Distribution Center #2"
          declaredValue="$89,400.00 USD"
          freightTerms="Prepaid"
        />
      </Story>
    </>
  )
}

import Story from '../../components/story/Story'
import { PrivacyDataExportPortal } from '@react-registry-blocks/privacy-data-export-portal/PrivacyDataExportPortal'

export default function PrivacyDataExportPortalDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Complete GDPR Article 15 and CCPA personal data export portal with governance stats, multi-category archive generator, and previous archive history."
      >
        <PrivacyDataExportPortal />
      </Story>

      <Story
        title="Custom Preset Selection"
        description="Pre-configured export selection targeting only Profile and Financial data domains in JSON format."
      >
        <PrivacyDataExportPortal initialCategories={['profile', 'financial']} initialFormat="json" />
      </Story>
    </>
  )
}

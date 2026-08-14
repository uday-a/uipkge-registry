import Story from '../../components/story/Story'
import { NdaAgreementGenerator } from '@react-registry-blocks/nda-agreement-generator/NdaAgreementGenerator'

export default function NdaAgreementGeneratorDemo() {
  return (
    <>
      <Story
        title="Default NDA Customizer & Document Canvas"
        description="Full Non-Disclosure Agreement builder with bilateral/unilateral modes, customizable protective covenants, live legal parchment preview, and e-signature execution pad."
      >
        <NdaAgreementGenerator />
      </Story>

      <Story
        title="Fully Executed & Countersigned NDA"
        description="Fully executed agreement displaying verified digital signatures from both disclosing and receiving parties with SHA-256 cryptographic audit hashes and PDF export."
      >
        <NdaAgreementGenerator initialSigned={true} />
      </Story>

      <Story
        title="Unilateral Vendor Agreement Preset"
        description="Unilateral confidentiality agreement preset under California jurisdiction with a 5-year confidentiality term and custom protective covenants."
      >
        <NdaAgreementGenerator
          initialAgreementType="unilateral"
          initialJurisdiction="california"
          initialTerm="5 Years"
        />
      </Story>
    </>
  )
}

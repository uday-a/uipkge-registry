import Story from '../../components/story/Story'
import { LeaseAgreementSign } from '@react-registry-blocks/lease-agreement-sign/LeaseAgreementSign'

export default function LeaseAgreementSignDemo() {
  return (
    <>
      <Story
        title="Default Review & Sign"
        description="Full residential lease agreement review and signature workflow with financial terms summary, pending initial markers on Sections 2 and 4, and sticky action sidebar."
      >
        <LeaseAgreementSign />
      </Story>

      <Story
        title="Ready for Final Signature"
        description="All required clause initials completed, unlocking the electronic signature pad and execution button."
      >
        <LeaseAgreementSign initialInitialsCompleted={true} />
      </Story>

      <Story
        title="Executed & Legally Binding"
        description="Countersigned lease agreement displaying verified landlord and tenant digital signature stamps, cryptographic audit hash, and download actions."
      >
        <LeaseAgreementSign initialSigned={true} />
      </Story>
    </>
  )
}

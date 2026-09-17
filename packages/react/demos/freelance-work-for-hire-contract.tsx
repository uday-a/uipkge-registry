import Story from '../../components/story/Story'
import { FreelanceWorkForHireContract } from '@react-registry-blocks/freelance-work-for-hire-contract/FreelanceWorkForHireContract'

export default function FreelanceWorkForHireContractDemo() {
  return (
    <>
      <Story
        title="Default Review & Execution"
        description="Independent contractor Master Services Agreement (MSA) review workflow featuring 17 U.S.C. § 101 work-for-hire IP assignment, 3 milestone deliverables table, 25% kill fee terms, and interactive electronic signature pad."
      >
        <FreelanceWorkForHireContract />
      </Story>

      <Story
        title="Ready for Final Signature"
        description="All clause initials completed on IP Assignment (Section 2) and Kill Fee (Section 4), unlocking the electronic signature pad and execution action."
      >
        <FreelanceWorkForHireContract initialInitialsCompleted={true} />
      </Story>

      <Story
        title="Fully Executed & Legally Binding"
        description="Countersigned contract displaying verified client CTO and contractor principal digital signature stamps, cryptographic audit hash, and download actions."
      >
        <FreelanceWorkForHireContract initialSigned={true} />
      </Story>
    </>
  )
}

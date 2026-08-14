import Story from '../../components/story/Story'
import { CommuteReimbursementClaims } from '@react-registry-blocks/commute-reimbursement-claims/CommuteReimbursementClaims'

export default function CommuteReimbursementClaimsDemo() {
  return (
    <>
      <Story
        title="Commute & Transit Expense Claims Portal"
        description="Monthly commuter transit pass, mileage, and EV charging expense claim reimbursement portal with IRS pre-tax allowance metrics, claim submission card with receipt dropzone, and claims history ledger."
      >
        <CommuteReimbursementClaims />
      </Story>

      <Story
        title="Custom Policy & Period"
        description="Portal with custom claim period and corporate commuter benefit policy parameters."
      >
        <CommuteReimbursementClaims
          title="Q3 Commuter & Mobility Portal"
          policyText="Executive Commute Program · Up to $315.00/mo Transit, Parking & EV Subsidy"
          claimPeriod="September 2026"
        />
      </Story>
    </>
  )
}

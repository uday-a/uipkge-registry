import Story from '../../components/story/Story'
import { CapTableOwnershipSummary } from '@react-registry-blocks/cap-table-ownership-summary/CapTableOwnershipSummary'

export default function CapTableOwnershipSummaryDemo() {
  return (
    <>
      <Story
        title="Default Cap Table & Modeling"
        description="Full Carta-style capitalization table with equity overview cards, multi-segment ownership progress distribution bar, shareholder vesting breakdown table, and interactive Series A dilution simulator."
      >
        <CapTableOwnershipSummary />
      </Story>

      <Story
        title="Custom Growth Round Scenario"
        description="Pre-configured with a $15M Series A investment model at a $60M pre-money valuation scenario."
      >
        <CapTableOwnershipSummary initialInvestment={15000000} initialPreMoney={60000000} />
      </Story>
    </>
  )
}

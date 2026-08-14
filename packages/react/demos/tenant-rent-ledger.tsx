import Story from '../../components/story/Story'
import { TenantRentLedger } from '@react-registry-blocks/tenant-rent-ledger/TenantRentLedger'

export default function TenantRentLedgerDemo() {
  return (
    <Story
      title="Default"
      description="Resident rent ledger and payment portal with resident header, 4 financial overview cards, autopay configuration, and 6-record payment history."
    >
      <TenantRentLedger />
    </Story>
  )
}

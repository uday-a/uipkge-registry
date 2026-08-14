import Story from '../../components/story/Story'
import { PayoutsManagementTable } from '@react-registry-blocks/payouts-management-table/PayoutsManagementTable'

export default function PayoutsManagementTableDemo() {
  return (
    <Story
      title="Default"
      description="Merchant payout schedule, balance cards, destination bank account verification, and batch settlement history."
    >
      <PayoutsManagementTable />
    </Story>
  )
}

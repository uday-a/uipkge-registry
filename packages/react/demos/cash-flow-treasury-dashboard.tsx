import Story from '../../components/story/Story'
import { CashFlowTreasuryDashboard } from '@react-registry-blocks/cash-flow-treasury-dashboard/CashFlowTreasuryDashboard'

export default function CashFlowTreasuryDashboardDemo() {
  return (
    <Story
      title="Default"
      description="Fluxo and Mercury style corporate cash flow treasury dashboard with 30-day runway projection, liquidity buffer monitor, inflow/outflow breakdown, and connected bank accounts table."
    >
      <CashFlowTreasuryDashboard />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { TransactionFeed } from '@react-registry-blocks/transaction-feed/TransactionFeed'

export default function TransactionFeedDemo() {
  return (
    <Story
      title="Corporate Transaction Feed"
      description="Brex/Ramp-style real-time corporate expense ledger with financial summary cards, search and filter toolbar, merchant icons, cardholder details, receipt indicators, and row actions."
    >
      <TransactionFeed />
    </Story>
  )
}

import Story from '../../components/story/Story'
import { BillingUsageCenter } from '@react-registry-blocks/billing-usage-center/BillingUsageCenter'

interface DemoMetric {
  id: string
  label: string
  usedText: string
  includedText: string
  percent: number
  overageNote?: string
}

interface DemoInvoice {
  id: string
  number: string
  period: string
  amount: string
  status: 'paid' | 'open' | 'past-due'
}

const nearLimitUsage: DemoMetric[] = [
  { id: 'storage', label: 'Storage', usedText: '9.6 GB', includedText: '10 GB', percent: 96 },
  { id: 'bandwidth', label: 'Bandwidth', usedText: '880 GB', includedText: '1 TB', percent: 88 },
  { id: 'api-calls', label: 'API calls', usedText: '470K', includedText: '1M', percent: 47 },
]

const overageUsage: DemoMetric[] = [
  {
    id: 'storage',
    label: 'Storage',
    usedText: '12.4 GB',
    includedText: '10 GB',
    percent: 124,
    overageNote: '2.4 GB over included — billed at $0.10 per extra GB on your next invoice.',
  },
  { id: 'bandwidth', label: 'Bandwidth', usedText: '1 TB', includedText: '1 TB', percent: 100 },
  { id: 'api-calls', label: 'API calls', usedText: '310K', includedText: '1M', percent: 31 },
]

const pastDueInvoices: DemoInvoice[] = [
  { id: 'pd1', number: 'INV-2026-009', period: 'Jul 1 – Jul 31, 2026', amount: '$49.00', status: 'past-due' },
  { id: 'pd2', number: 'INV-2026-008', period: 'Jun 1 – Jun 30, 2026', amount: '$49.00', status: 'open' },
  { id: 'pd3', number: 'INV-2026-007', period: 'May 1 – May 31, 2026', amount: '$49.00', status: 'paid' },
]

const annualPlan = {
  name: 'Pro Annual',
  price: '$490',
  cadence: 'year',
  renewalDate: 'September 12, 2027',
  seatsUsed: 11,
  seatsTotal: 20,
}

const seatsFullPlan = {
  name: 'Team',
  price: '$149',
  cadence: 'month',
  renewalDate: 'August 30, 2026',
  seatsUsed: 20,
  seatsTotal: 20,
}

const singleInvoice: DemoInvoice[] = [
  { id: 'si1', number: 'INV-2026-001', period: 'Jan 1 – Jan 31, 2026', amount: '$49.00', status: 'paid' },
]

const manyInvoices: DemoInvoice[] = [
  { id: 'mi1', number: 'INV-2026-008', period: 'Jul 1 – Jul 31, 2026', amount: '$49.00', status: 'open' },
  { id: 'mi2', number: 'INV-2026-007', period: 'Jun 1 – Jun 30, 2026', amount: '$49.00', status: 'paid' },
  { id: 'mi3', number: 'INV-2026-006', period: 'May 1 – May 31, 2026', amount: '$49.00', status: 'paid' },
  { id: 'mi4', number: 'INV-2026-005', period: 'Apr 1 – Apr 30, 2026', amount: '$49.00', status: 'paid' },
  { id: 'mi5', number: 'INV-2026-004', period: 'Mar 1 – Mar 31, 2026', amount: '$49.00', status: 'paid' },
  { id: 'mi6', number: 'INV-2026-003', period: 'Feb 1 – Feb 28, 2026', amount: '$49.00', status: 'paid' },
  { id: 'mi7', number: 'INV-2026-002', period: 'Jan 1 – Jan 31, 2026', amount: '$49.00', status: 'paid' },
  { id: 'mi8', number: 'INV-2025-012', period: 'Dec 1 – Dec 31, 2025', amount: '$39.00', status: 'paid' },
]

export default function BillingUsageCenterDemo() {
  return (
    <>
      <Story title="Default" description="Pro plan with healthy usage and a fully paid invoice history.">
        <BillingUsageCenter />
      </Story>

      <Story
        title="Near-limit usage"
        description="Bars shift to warning as metrics close in on their included allowance."
      >
        <BillingUsageCenter usage={nearLimitUsage} />
      </Story>

      <Story
        title="Overage state"
        description="A metric past 100% clamps the bar to destructive and surfaces an overage note; a metric at exactly 100% stays destructive without one."
      >
        <BillingUsageCenter usage={overageUsage} />
      </Story>

      <Story
        title="Past-due banner"
        description="Any unpaid invoice pins a warning alert above the table; the count and past-due breakdown are computed from the data."
      >
        <BillingUsageCenter invoices={pastDueInvoices} />
      </Story>

      <Story title="Empty invoices" description="Centered empty state before the first billing cycle closes.">
        <BillingUsageCenter invoices={[]} />
      </Story>

      <Story title="Annual plan" description="Yearly cadence with a next-year renewal date and a lower seat count.">
        <BillingUsageCenter plan={annualPlan} />
      </Story>

      <Story title="Single invoice" description="One paid row — singular labels and pill styling stay correct.">
        <BillingUsageCenter invoices={singleInvoice} />
      </Story>

      <Story
        title="Many invoices"
        description="Eight cycles of history; the unpaid banner stays pinned above the table."
      >
        <BillingUsageCenter invoices={manyInvoices} />
      </Story>

      <Story title="Seats at limit" description="Seat meter full — a prompt to upsell more seats.">
        <BillingUsageCenter plan={seatsFullPlan} invoices={singleInvoice} />
      </Story>
    </>
  )
}

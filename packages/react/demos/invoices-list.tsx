import Story from '../../components/story/Story'
import { InvoicesList } from '@react-registry-blocks/invoices-list/InvoicesList'

export default function InvoicesListDemo() {
  return (
    <Story
      title="Default"
      description="Invoice history with summary strip, status badges, and per-row action menus over stub data."
    >
      <InvoicesList />
    </Story>
  )
}

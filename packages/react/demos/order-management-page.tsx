import Story from '../../components/story/Story'
import { OrderManagementPage } from '@react-registry-blocks/order-management-page/OrderManagementPage'

export default function OrderManagementPageDemo() {
  return (
    <Story
      title="Order management page"
      description="E-commerce and SaaS fulfillment dashboard: KPI summary cards, filterable order table with status badges, and slide-over order details drawer."
    >
      <OrderManagementPage />
    </Story>
  )
}

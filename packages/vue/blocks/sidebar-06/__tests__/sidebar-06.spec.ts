import { h } from 'vue'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar06 from '../Sidebar06.vue'

describeBlock('Sidebar06', {
  render: () => h(SidebarProvider, () => h(Sidebar06)),
})

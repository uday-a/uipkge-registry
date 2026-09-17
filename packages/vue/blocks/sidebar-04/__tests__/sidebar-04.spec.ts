import { h } from 'vue'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar04 from '../Sidebar04.vue'

describeBlock('Sidebar04', {
  render: () => h(SidebarProvider, () => h(Sidebar04)),
})

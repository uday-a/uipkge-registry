import { h } from 'vue'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar01 from '../Sidebar01.vue'

describeBlock('Sidebar01', {
  render: () => h(SidebarProvider, () => h(Sidebar01)),
})

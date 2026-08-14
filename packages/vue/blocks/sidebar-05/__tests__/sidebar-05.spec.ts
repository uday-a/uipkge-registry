import { h } from 'vue'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar05 from '../Sidebar05.vue'

describeBlock('Sidebar05', {
  render: () => h(SidebarProvider, () => h(Sidebar05)),
})

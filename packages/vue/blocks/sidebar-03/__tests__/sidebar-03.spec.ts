import { h } from 'vue'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar03 from '../Sidebar03.vue'

describeBlock('Sidebar03', {
  render: () => h(SidebarProvider, () => h(Sidebar03)),
})

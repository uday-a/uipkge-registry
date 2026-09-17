import { h } from 'vue'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar07 from '../Sidebar07.vue'

describeBlock('Sidebar07', {
  render: () => h(SidebarProvider, () => h(Sidebar07)),
})

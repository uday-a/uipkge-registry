import { h } from 'vue'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar02 from '../Sidebar02.vue'

describeBlock('Sidebar02', {
  render: () => h(SidebarProvider, () => h(Sidebar02)),
})

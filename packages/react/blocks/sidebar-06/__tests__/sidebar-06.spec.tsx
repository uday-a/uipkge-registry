import * as React from 'react'
import { describeBlock } from '../../../test-utils/test-render'
import { SidebarProvider } from '@/components/ui/sidebar'
import * as BlockModule from '../Sidebar06'

const Inner =
  (BlockModule as any).default || (BlockModule as any)['Sidebar06'] || (BlockModule as any)[Object.keys(BlockModule)[0]]
const Component = (props: any) => React.createElement(SidebarProvider, null, React.createElement(Inner, props))

describeBlock('Sidebar06', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../QuickActions'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['QuickActions'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('QuickActions', Component, {
  props: {
    actions: [{ id: '1', label: 'Action 1', route: '/test' }],
  },
})

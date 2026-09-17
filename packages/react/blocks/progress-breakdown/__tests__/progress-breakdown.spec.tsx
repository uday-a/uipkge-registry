import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ProgressBreakdown'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ProgressBreakdown'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ProgressBreakdown', Component, {
  props: {
    items: [
      { name: 'Item 1', value: 75, secondaryLabel: '75%' },
      { name: 'Item 2', value: 25, secondaryLabel: '25%' },
    ],
  },
})

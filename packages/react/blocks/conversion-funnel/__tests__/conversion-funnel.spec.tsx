import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ConversionFunnel'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ConversionFunnel'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ConversionFunnel', Component, {
  props: {
    data: [
      { name: 'Stage 1', value: 100 },
      { name: 'Stage 2', value: 60 },
    ],
  },
})

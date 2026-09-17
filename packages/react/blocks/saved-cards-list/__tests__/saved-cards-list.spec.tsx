import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SavedCardsList'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SavedCardsList'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SavedCardsList', Component, {
  props: {
    cards: [],
  },
})

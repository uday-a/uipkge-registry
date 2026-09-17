import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PropertyListingCard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PropertyListingCard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PropertyListingCard', Component)

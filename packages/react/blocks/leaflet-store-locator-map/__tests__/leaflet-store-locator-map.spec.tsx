import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletStoreLocatorMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletStoreLocatorMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletStoreLocatorMap', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StoreLocatorMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StoreLocatorMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StoreLocatorMap', Component)

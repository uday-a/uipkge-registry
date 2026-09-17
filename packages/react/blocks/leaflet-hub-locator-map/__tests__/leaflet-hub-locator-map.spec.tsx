import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletHubLocatorMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletHubLocatorMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletHubLocatorMap', Component)

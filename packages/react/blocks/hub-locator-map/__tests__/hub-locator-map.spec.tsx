import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HubLocatorMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HubLocatorMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HubLocatorMap', Component)

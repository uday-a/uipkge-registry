import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DisasterResponseMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DisasterResponseMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DisasterResponseMap', Component)

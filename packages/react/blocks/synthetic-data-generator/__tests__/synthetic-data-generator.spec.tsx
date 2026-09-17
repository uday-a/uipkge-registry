import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SyntheticDataGenerator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SyntheticDataGenerator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SyntheticDataGenerator', Component)

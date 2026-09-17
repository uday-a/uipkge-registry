import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ContractRedlineDiff'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ContractRedlineDiff'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ContractRedlineDiff', Component)

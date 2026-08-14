import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DataContractGovernance'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DataContractGovernance'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DataContractGovernance', Component)

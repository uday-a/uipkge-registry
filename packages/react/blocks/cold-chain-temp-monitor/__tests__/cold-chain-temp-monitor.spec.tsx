import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ColdChainTempMonitor'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ColdChainTempMonitor'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ColdChainTempMonitor', Component)

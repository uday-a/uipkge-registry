import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SubpoenaLegalHoldManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SubpoenaLegalHoldManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SubpoenaLegalHoldManager', Component)

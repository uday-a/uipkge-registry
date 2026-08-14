import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CdcReplicationStream'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CdcReplicationStream'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CdcReplicationStream', Component)

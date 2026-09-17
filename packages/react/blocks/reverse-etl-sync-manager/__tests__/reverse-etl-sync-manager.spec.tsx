import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ReverseEtlSyncManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ReverseEtlSyncManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ReverseEtlSyncManager', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DnsRecordManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DnsRecordManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DnsRecordManager', Component)

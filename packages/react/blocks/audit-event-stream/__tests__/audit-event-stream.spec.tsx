import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AuditEventStream'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AuditEventStream'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AuditEventStream', Component)

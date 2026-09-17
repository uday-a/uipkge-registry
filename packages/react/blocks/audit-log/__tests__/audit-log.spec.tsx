import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AuditLog'

const Component =
  (BlockModule as any).default || (BlockModule as any)['AuditLog'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AuditLog', Component)

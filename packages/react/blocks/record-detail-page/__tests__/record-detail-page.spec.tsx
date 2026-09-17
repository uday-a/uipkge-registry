import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RecordDetailPage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RecordDetailPage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RecordDetailPage', Component)

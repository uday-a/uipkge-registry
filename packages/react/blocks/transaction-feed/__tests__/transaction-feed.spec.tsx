import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TransactionFeed'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TransactionFeed'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TransactionFeed', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../WebhookTester'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['WebhookTester'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('WebhookTester', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ExitIntentNewsletter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ExitIntentNewsletter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ExitIntentNewsletter', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Webhooks'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Webhooks'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Webhooks', Component)

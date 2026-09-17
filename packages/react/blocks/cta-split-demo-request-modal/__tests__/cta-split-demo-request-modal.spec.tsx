import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CtaSplitDemoRequestModal'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CtaSplitDemoRequestModal'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CtaSplitDemoRequestModal', Component)

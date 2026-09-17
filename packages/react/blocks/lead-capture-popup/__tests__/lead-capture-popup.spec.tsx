import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeadCapturePopup'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeadCapturePopup'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeadCapturePopup', Component)

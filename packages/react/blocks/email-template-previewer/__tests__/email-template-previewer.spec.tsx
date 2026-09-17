import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EmailTemplatePreviewer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EmailTemplatePreviewer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EmailTemplatePreviewer', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeroBentoPreviewGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeroBentoPreviewGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeroBentoPreviewGrid', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureCodePreviewSplit'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureCodePreviewSplit'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureCodePreviewSplit', Component)

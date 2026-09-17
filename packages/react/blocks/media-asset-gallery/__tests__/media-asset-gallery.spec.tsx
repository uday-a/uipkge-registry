import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../MediaAssetGallery'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['MediaAssetGallery'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('MediaAssetGallery', Component)

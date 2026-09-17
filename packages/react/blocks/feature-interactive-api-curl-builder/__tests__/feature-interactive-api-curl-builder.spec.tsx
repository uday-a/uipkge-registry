import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureInteractiveApiCurlBuilder'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureInteractiveApiCurlBuilder'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureInteractiveApiCurlBuilder', Component)

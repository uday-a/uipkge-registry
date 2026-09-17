import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureVisualChangelogDiff'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureVisualChangelogDiff'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureVisualChangelogDiff', Component)

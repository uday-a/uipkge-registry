import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CaseStudyFeaturedStory'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CaseStudyFeaturedStory'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CaseStudyFeaturedStory', Component)

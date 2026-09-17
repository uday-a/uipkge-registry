import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureAccordionMedia'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureAccordionMedia'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureAccordionMedia', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureScrollSpyWalkthrough'

const Component =
  (BlockModule as any).default || (BlockModule as any)['Workbench'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Workbench', Component)

import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../UseCasesScenarioWalkthrough'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['UseCasesScenarioWalkthrough'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('UseCasesScenarioWalkthrough', Component)

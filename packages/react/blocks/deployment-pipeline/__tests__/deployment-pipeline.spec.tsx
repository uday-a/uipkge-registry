import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DeploymentPipeline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DeploymentPipeline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DeploymentPipeline', Component)

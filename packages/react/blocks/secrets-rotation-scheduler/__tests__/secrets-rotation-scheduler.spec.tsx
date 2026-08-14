import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SecretsRotationScheduler'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SecretsRotationScheduler'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SecretsRotationScheduler', Component)

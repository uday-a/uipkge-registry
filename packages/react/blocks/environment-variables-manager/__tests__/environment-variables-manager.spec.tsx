import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EnvironmentVariablesManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EnvironmentVariablesManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EnvironmentVariablesManager', Component)

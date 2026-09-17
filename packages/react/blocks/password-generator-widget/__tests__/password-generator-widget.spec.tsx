import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PasswordGeneratorWidget'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PasswordGeneratorWidget'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PasswordGeneratorWidget', Component)

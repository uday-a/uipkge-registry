import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DatabaseMigrationSchemaDiff'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DatabaseMigrationSchemaDiff'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DatabaseMigrationSchemaDiff', Component)

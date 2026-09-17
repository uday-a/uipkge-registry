import Story from '../../components/story/Story'
import { ComparisonMigrationPath } from '@react-registry-blocks/comparison-migration-path/ComparisonMigrationPath'
// ComparisonMigrationPath is the block file the user installs. Open
// `components/blocks/ComparisonMigrationPath.tsx` after install to edit the
// `rows` array for the tool you are actually replacing.

export default function ComparisonMigrationPathDemo() {
  return (
    <Story
      title="Comparison — Migration Path"
      description="What a team keeps, changes, and retires when migrating from an existing tool, with an effort estimate on every row."
    >
      <ComparisonMigrationPath />
    </Story>
  )
}

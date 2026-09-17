import Story from '../../components/story/Story'
import { DatabaseMigrationSchemaDiff } from '@react-registry-blocks/database-migration-schema-diff/DatabaseMigrationSchemaDiff'

export default function DatabaseMigrationSchemaDiffDemo() {
  return (
    <Story
      title="Default"
      description="Prisma / Flyway / Liquibase database migration runner with target cluster status, pending DDL visual diffs, rollback scripts, schema integrity telemetry, and execution history."
    >
      <DatabaseMigrationSchemaDiff />
    </Story>
  )
}

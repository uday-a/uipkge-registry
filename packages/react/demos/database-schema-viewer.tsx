import Story from '../../components/story/Story'
import { DatabaseSchemaViewer } from '@react-registry-blocks/database-schema-viewer/DatabaseSchemaViewer'

export default function DatabaseSchemaViewerDemo() {
  return (
    <Story
      title="Default"
      description="Visual database schema inspector and SQL query previewer with table navigation, column types, relationships, indexes, and DDL code generator."
    >
      <DatabaseSchemaViewer />
    </Story>
  )
}

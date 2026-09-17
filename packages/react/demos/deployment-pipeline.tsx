import Story from '../../components/story/Story'
import { DeploymentPipeline } from '@react-registry-blocks/deployment-pipeline/DeploymentPipeline'

export default function DeploymentPipelineDemo() {
  return (
    <>
      <Story
        title="Default"
        description="CI/CD deployment pipeline dashboard with active environment status, execution stepper, interactive build log terminal, and filterable history table."
      >
        <DeploymentPipeline />
      </Story>

      <Story title="Production only" description="Pre-filtered deployment history table showing production releases.">
        <DeploymentPipeline initialEnv="production" />
      </Story>

      <Story title="Collapsed logs" description="Compact hero card overview with build terminal collapsed by default.">
        <DeploymentPipeline initialLogsOpen={false} />
      </Story>
    </>
  )
}

import Story from '../../components/story/Story'
import { FeatureFlagsManager } from '@react-registry-blocks/feature-flags-manager/FeatureFlagsManager'

export default function FeatureFlagsManagerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="LaunchDarkly and PostHog style feature flags management dashboard with summary metrics, master switches, rollout progress, targeting rules, and environment badges."
      >
        <FeatureFlagsManager />
      </Story>

      <Story
        title="Filtered View"
        description="Feature flags management initialized with a custom set of active rollout flags."
      >
        <FeatureFlagsManager
          initialFlags={[
            {
              id: 'ff-prod-1',
              name: 'Vector Search Pipeline',
              key: 'vector-search-v3',
              description: 'Hybrid sparse-dense vector retrieval powered by pgvector embeddings.',
              tags: ['AI', 'Core'],
              enabled: true,
              rollout: 75,
              targetingRules: "tier === 'enterprise' && latency_tier === 'low'",
              environments: {
                production: true,
                staging: true,
                development: true,
              },
            },
            {
              id: 'ff-prod-2',
              name: 'Granular RBAC Policies',
              key: 'rbac-v2-enforcement',
              description: 'Fine-grained policy decision point evaluation on every request.',
              tags: ['Backend', 'Security'],
              enabled: false,
              rollout: 0,
              targetingRules: "workspace_id in ['ws_enterprise_01']",
              environments: {
                production: false,
                staging: true,
                development: true,
              },
            },
          ]}
        />
      </Story>

      <Story title="Empty State" description="Clean empty state representation when no feature flags are configured.">
        <FeatureFlagsManager initialFlags={[]} />
      </Story>
    </>
  )
}

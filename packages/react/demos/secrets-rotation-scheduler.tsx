import Story from '../../components/story/Story'
import {
  SecretsRotationScheduler,
  type ManagedSecret,
} from '@react-registry-blocks/secrets-rotation-scheduler/SecretsRotationScheduler'

const alertSecrets: ManagedSecret[] = [
  {
    id: 'sec-alert-1',
    name: 'prod/legacy-oracle/db-credentials',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/legacy-oracle/db-cred-110a',
    type: 'Postgres DB',
    schedule: {
      interval: 'Manual Only',
      daysInterval: 0,
      zeroDowntimeVerified: false,
    },
    lastRotated: 'Nov 14, 2025',
    nextRotationDue: 'Feb 14, 2026',
    dueRelative: 'Overdue (180 days)',
    status: 'manual-needed',
    currentVersion: 'v1.0 (AWSCURRENT)',
    stagingVersion: undefined,
    lastLogSnippet: 'Manual intervention required. Database cluster connection pool lacks dual-auth shadow accounts.',
  },
  {
    id: 'sec-alert-2',
    name: 'prod/twilio/api-auth-token',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/twilio/api-token-77b2',
    type: 'API Key',
    schedule: {
      interval: 'Every 90 Days',
      daysInterval: 90,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:RotateTwilioToken',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'May 20, 2026',
    nextRotationDue: 'Aug 21, 2026',
    dueRelative: 'in 6 hours',
    status: 'due-soon',
    currentVersion: 'v2.1 (AWSCURRENT)',
    stagingVersion: 'v2.2 (AWSPENDING)',
    lastLogSnippet: 'Rotation worker scheduled for immediate invocation during low-traffic window.',
  },
  {
    id: 'sec-alert-3',
    name: 'prod/vault/root-unseal-key',
    arn: 'arn:aws:kms:us-east-1:182938491029:key/mrk-9912019a-221b-4f21-8811',
    type: 'KMS Key',
    schedule: {
      interval: 'Every 365 Days',
      daysInterval: 365,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:KmsUnsealRotation',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'Aug 19, 2026',
    nextRotationDue: 'Aug 19, 2027',
    dueRelative: 'in 363 days',
    status: 'healthy',
    currentVersion: 'v4.0 (AWSCURRENT)',
    stagingVersion: undefined,
    lastLogSnippet: 'KMS HSM backing key material regenerated. Key unseal check passed with 0 errors.',
  },
]

const highVelocitySecrets: ManagedSecret[] = [
  {
    id: 'sec-auto-1',
    name: 'prod/auth0/m2m-client-secret',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/auth0/m2m-sec-4819',
    type: 'API Key',
    schedule: {
      interval: 'Every 7 Days',
      daysInterval: 7,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:RotateAuth0M2MSecret',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'Aug 20, 2026',
    nextRotationDue: 'Aug 27, 2026',
    dueRelative: 'in 6 days',
    status: 'healthy',
    currentVersion: 'v18.0 (AWSCURRENT)',
    stagingVersion: undefined,
    lastLogSnippet: 'Auth0 client secret rotated. Secondary client credential revoked after 24h grace period.',
  },
  {
    id: 'sec-auto-2',
    name: 'prod/aurora/read-replica-credentials',
    arn: 'arn:aws:secretsmanager:us-east-1:182938491029:secret:prod/aurora/read-cred-991f',
    type: 'Postgres DB',
    schedule: {
      interval: 'Every 30 Days',
      daysInterval: 30,
      lambdaArn: 'arn:aws:lambda:us-east-1:182938491029:function:RotateAuroraClusterCreds',
      zeroDowntimeVerified: true,
    },
    lastRotated: 'Aug 15, 2026',
    nextRotationDue: 'Sep 14, 2026',
    dueRelative: 'in 24 days',
    status: 'healthy',
    currentVersion: 'v6.2 (AWSCURRENT)',
    stagingVersion: undefined,
    lastLogSnippet: 'Aurora read pool shadow user credentials synchronized across 8 reader instances.',
  },
]

export default function SecretsRotationSchedulerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="AWS Secrets Manager style automated credential rotation scheduler and security key audit with lifecycle telemetry cards, zero-downtime dual-version workflow, and CloudWatch lambda log inspection."
      >
        <SecretsRotationScheduler />
      </Story>

      <Story
        title="Overdue audit & compliance alerts"
        description="Security posture highlighting manual rotation requirements, overdue keys, and compliance alerts."
      >
        <SecretsRotationScheduler
          initialStats={{
            totalSecrets: 12,
            autoRotationActive: 7,
            autoRotationPercentage: 58.3,
            dueSoonCount: 3,
            overdueCount: 2,
          }}
          initialSecrets={alertSecrets}
        />
      </Story>

      <Story
        title="High-velocity 100% automated rotation"
        description="Zero-downtime microservice fleet with 7-day automatic key rotation across all production secrets."
      >
        <SecretsRotationScheduler
          initialStats={{
            totalSecrets: 24,
            autoRotationActive: 24,
            autoRotationPercentage: 100.0,
            dueSoonCount: 1,
            overdueCount: 0,
          }}
          initialSecrets={highVelocitySecrets}
        />
      </Story>
    </>
  )
}

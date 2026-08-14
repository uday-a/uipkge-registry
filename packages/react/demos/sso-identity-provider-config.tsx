import Story from '../../components/story/Story'
import { SsoIdentityProviderConfig } from '@react-registry-blocks/sso-identity-provider-config/SsoIdentityProviderConfig'

export default function SsoIdentityProviderConfigDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Enterprise SAML 2.0 Identity Provider configuration wizard with IdP preset picker (Okta default), SP credentials copying, metadata XML upload simulation, PEM certificate validator, domain enforcement switch, and live assertion diagnostic runner."
      >
        <SsoIdentityProviderConfig />
      </Story>

      <Story
        title="Microsoft Entra ID (Azure AD)"
        description="Pre-configured with Microsoft Entra ID (Azure AD / O365) federation endpoints and STS issuer settings."
      >
        <SsoIdentityProviderConfig initialPreset="entra" />
      </Story>

      <Story
        title="Google Workspace"
        description="Pre-configured for Google Cloud IAM and Google Workspace SAML 2.0 Web SSO integration."
      >
        <SsoIdentityProviderConfig initialPreset="google" />
      </Story>

      <Story
        title="Custom SAML 2.0 Provider"
        description="Generic configuration for self-hosted Keycloak, PingFederate, Shibboleth, or OneLogin setups."
      >
        <SsoIdentityProviderConfig initialPreset="custom" />
      </Story>

      <Story
        title="SSO Disabled State"
        description="Demonstrating initial inactive state where SSO enforcement is bypassed for standard credential logins."
      >
        <SsoIdentityProviderConfig initialSsoEnabled={false} initialEnforceDomain={false} />
      </Story>
    </>
  )
}

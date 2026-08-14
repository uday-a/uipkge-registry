<script setup lang="ts">
import SsoIdentityProviderConfig from '@/components/blocks/sso-identity-provider-config/SsoIdentityProviderConfig.vue'
</script>

<template>
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
    <SsoIdentityProviderConfig initial-preset="entra" />
  </Story>

  <Story
    title="Google Workspace"
    description="Pre-configured for Google Cloud IAM and Google Workspace SAML 2.0 Web SSO integration."
  >
    <SsoIdentityProviderConfig initial-preset="google" />
  </Story>

  <Story
    title="Custom SAML 2.0 Provider"
    description="Generic configuration for self-hosted Keycloak, PingFederate, Shibboleth, or OneLogin setups."
  >
    <SsoIdentityProviderConfig initial-preset="custom" />
  </Story>

  <Story
    title="SSO Disabled State"
    description="Demonstrating initial inactive state where SSO enforcement is bypassed for standard credential logins."
  >
    <SsoIdentityProviderConfig :initial-sso-enabled="false" :initial-enforce-domain="false" />
  </Story>
</template>

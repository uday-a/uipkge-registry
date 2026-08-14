<script setup lang="ts">
import Error404 from '@/components/blocks/error-404/Error404.vue'
</script>

<template>
  <Story
    title="Default"
    description="Full-page 404 — HTTP 404 response panel, display code, Back to home + Contact support."
  >
    <Error404 layout="contained" />
  </Story>

  <Story title="Page layout" description='layout="page" fills the viewport height for a dedicated error route.'>
    <div class="max-h-[32rem] overflow-auto">
      <Error404 />
    </div>
  </Story>

  <Story
    title="Custom copy"
    description="title, description, and code rewrite the route for a branded empty workspace URL."
  >
    <Error404
      layout="contained"
      code="4xx"
      title="This workspace moved"
      description="Acme migrated docs to /help. The old URL is retired — open the help center or ping docs."
      primary-label="Open help center"
      secondary-label="Contact docs"
    />
  </Story>

  <Story title="No image" description='image="" hides the HTTP panel and leaves a copy-only stack.'>
    <Error404 layout="contained" image="" />
  </Story>

  <Story title="Hide secondary" description="showSecondary=false leaves a single primary action.">
    <Error404 layout="contained" :show-secondary="false" />
  </Story>

  <Story title="Disabled" description="primaryDisabled freezes Back to home while a redirect is still resolving.">
    <Error404 layout="contained" primary-disabled />
  </Story>

  <Story title="Hrefs" description="primaryHref and secondaryHref render the actions as links.">
    <Error404 layout="contained" primary-href="/" secondary-href="/support" />
  </Story>

  <Story
    title="Callbacks"
    description="onPrimary / onSecondary fire from the matching buttons — wire these to your router."
  >
    <Error404
      layout="contained"
      :on-primary="() => console.log('onPrimary')"
      :on-secondary="() => console.log('onSecondary')"
    />
  </Story>

  <Story
    title="Long copy"
    description="A longer description wraps at max-w-md under the headline without pushing the HTTP panel off the grid."
  >
    <Error404
      layout="contained"
      title="We looked. Nothing lives at this address."
      description="The path may have been renamed, the record deleted, or the link copied with a trailing character. Check the URL, go home, or ask support to trace the request id from your last session."
    />
  </Story>
</template>

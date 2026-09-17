<script setup lang="ts">
import UtmCampaignBuilder from '@/components/blocks/utm-campaign-builder/UtmCampaignBuilder.vue'
</script>

<template>
  <Story
    title="Default"
    description="Full interactive UTM Campaign Builder with preset presets, syntax-highlighted live URL preview, shortlink generator, and vector QR code pass."
  >
    <UtmCampaignBuilder />
  </Story>

  <Story
    title="Email Newsletter Campaign"
    description="Pre-configured for a Substack/Mailchimp weekly newsletter with email medium and article button content parameters."
  >
    <UtmCampaignBuilder
      initial-preset="weekly_newsletter"
      initial-base-url="https://uipkge.dev/blog"
      initial-source="newsletter"
      initial-medium="email"
      initial-campaign="weekly_digest_issue_48"
      initial-term="developer_tools"
      initial-content="featured_article_button"
      initial-shortlink-slug="digest-48"
    />
  </Story>

  <Story
    title="Google Search Ads (Paid CPC)"
    description="Pre-configured for paid search ad campaigns with target search keywords and ad variation content."
  >
    <UtmCampaignBuilder
      initial-preset="google_search_ads"
      initial-base-url="https://uipkge.dev"
      initial-source="google"
      initial-medium="cpc"
      initial-campaign="search_brand_core_us"
      initial-term="vue_react_components"
      initial-content="headline_v2_price_test"
      initial-shortlink-slug="google-ads"
    />
  </Story>
</template>

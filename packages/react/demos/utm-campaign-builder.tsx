import Story from '../../components/story/Story'
import { UtmCampaignBuilder } from '@react-registry-blocks/utm-campaign-builder/UtmCampaignBuilder'

export default function UtmCampaignBuilderDemo() {
  return (
    <>
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
          initialPreset="weekly_newsletter"
          initialBaseUrl="https://uipkge.dev/blog"
          initialSource="newsletter"
          initialMedium="email"
          initialCampaign="weekly_digest_issue_48"
          initialTerm="developer_tools"
          initialContent="featured_article_button"
          initialShortlinkSlug="digest-48"
        />
      </Story>

      <Story
        title="Google Search Ads (Paid CPC)"
        description="Pre-configured for paid search ad campaigns with target search keywords and ad variation content."
      >
        <UtmCampaignBuilder
          initialPreset="google_search_ads"
          initialBaseUrl="https://uipkge.dev"
          initialSource="google"
          initialMedium="cpc"
          initialCampaign="search_brand_core_us"
          initialTerm="vue_react_components"
          initialContent="headline_v2_price_test"
          initialShortlinkSlug="google-ads"
        />
      </Story>
    </>
  )
}

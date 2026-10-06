<script lang="ts">
  import { XmlTreeView } from '@svelte-registry/xml-tree-view'

  let { story }: { story: string } = $props()

  const catalogXml = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101" available="true">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
  </book>
  <book id="bk102" available="false">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
  </book>
  <book id="bk103" available="true">
    <author>Corets, Eva</author>
    <title>Maeve Ascendant</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-11-17</publish_date>
  </book>
</catalog>`

  const soapFaultXml = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Client</faultcode>
      <faultstring>Invalid message format</faultstring>
      <detail>
        <error code="VAL_001">
          <field>customerId</field>
          <message>must be a positive integer</message>
        </error>
        <error code="VAL_002">
          <field>amount</field>
          <message>must be greater than zero</message>
        </error>
      </detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`

  const configXml = `<?xml version="1.0"?>
<!-- Application configuration -->
<config env="production" version="2.4.1">
  <database>
    <host>db.example.com</host>
    <port>5432</port>
    <name>app_prod</name>
    <pool min="2" max="20" />
  </database>
  <features>
    <feature name="billing" enabled="true" />
    <feature name="analytics" enabled="true" />
    <feature name="beta-ui" enabled="false" />
  </features>
  <logging level="info">
    <![CDATA[
    appenders: [console, file]
    path: /var/log/app.log
    ]]>
  </logging>
</config>`

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>UIPKGE Blog</title>
    <link>https://uipkge.dev/blog</link>
    <description>Design system updates and guides</description>
    <item>
      <title>Introducing XML Tree View</title>
      <link>https://uipkge.dev/blog/xml-tree-view</link>
      <pubDate>Mon, 11 Mar 2024 09:00:00 GMT</pubDate>
      <description>Collapsible XML inspection for admin tools.</description>
    </item>
    <item>
      <title>Registry dual-framework parity</title>
      <link>https://uipkge.dev/blog/parity</link>
      <pubDate>Fri, 01 Mar 2024 12:00:00 GMT</pubDate>
      <description>Vue and React mirrors stay in lockstep.</description>
    </item>
  </channel>
</rss>`

  const svgXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
  <path d="M8 12l3 3 5-6" fill="none" stroke="currentColor" stroke-width="2" />
</svg>`

  const invalidXml = `<root><unclosed>`

  let lastCopied = $state('')
  function onCopy(value: string, path: string) {
    lastCopied = `${path} = ${value.slice(0, 50)}`
  }
</script>

{#if story === 'Book catalog'}
  <XmlTreeView data={catalogXml} expandDepth={2} class="max-h-96" />
{/if}

{#if story === 'SOAP fault'}
  <XmlTreeView data={soapFaultXml} rootLabel="Envelope" expandDepth={3} class="max-h-96" />
{/if}

{#if story === 'App config with comment + CDATA'}
  <XmlTreeView data={configXml} expandDepth={2} class="max-h-96" />
{/if}

{#if story === 'RSS feed'}
  <XmlTreeView data={rssXml} expandDepth={2} class="max-h-80" />
{/if}

{#if story === 'SVG markup'}
  <XmlTreeView data={svgXml} expandDepth={1} class="max-h-64" />
{/if}

{#if story === 'In a debug card'}
  <div class="bg-card max-w-2xl rounded-lg border">
    <div class="p-6 pb-0">
      <h3 class="flex items-center justify-between text-base font-semibold">
        <span>GET /api/v1/catalog.xml</span>
        <span class="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 font-mono text-xs">200 OK</span>
      </h3>
    </div>
    <div class="p-6">
      <XmlTreeView data={catalogXml} expandDepth={1} class="max-h-72" />
    </div>
  </div>
{/if}

{#if story === 'Searchable + copy on click'}
  <XmlTreeView data={catalogXml} expandDepth={3} oncopy={onCopy} class="max-h-96" />
  {#if lastCopied}
    <p class="text-muted-foreground mt-2 text-xs">Last copied: {lastCopied}</p>
  {/if}
{/if}

{#if story === 'Collapsed vs. expanded'}
  <div class="grid gap-4 lg:grid-cols-2">
    <div class="space-y-1.5">
      <span class="text-muted-foreground text-xs">expandDepth 0 — collapsed</span>
      <XmlTreeView data={catalogXml} expandDepth={0} class="max-h-64" />
    </div>
    <div class="space-y-1.5">
      <span class="text-muted-foreground text-xs">expandDepth 2 — expanded</span>
      <XmlTreeView data={catalogXml} expandDepth={2} class="max-h-64" />
    </div>
  </div>
{/if}

{#if story === 'Minimal toolbar'}
  <div class="grid gap-4 lg:grid-cols-2">
    <div class="space-y-1.5">
      <span class="text-muted-foreground text-xs">No search</span>
      <XmlTreeView data={catalogXml} showSearch={false} expandDepth={1} class="max-h-56" />
    </div>
    <div class="space-y-1.5">
      <span class="text-muted-foreground text-xs">No toolbar</span>
      <XmlTreeView data={catalogXml} showToolbar={false} showSearch={false} expandDepth={1} class="max-h-56" />
    </div>
  </div>
{/if}

{#if story === 'Parse error'}
  <XmlTreeView data={invalidXml} class="max-h-40" />
{/if}

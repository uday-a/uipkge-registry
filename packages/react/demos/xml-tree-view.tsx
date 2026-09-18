import { useState } from 'react'
import Story from '../../components/story/Story'
import { XmlTreeView } from '@react-registry/xml-tree-view'
import { Card, CardContent, CardHeader, CardTitle } from '@react-registry/card'
import { Badge } from '@react-registry/badge'
import { toast } from 'sonner'

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
  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
  <path d="M8 12l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
</svg>`

const invalidXml = `<root><unclosed>`

export default function XmlTreeViewDemo() {
  const [lastCopied, setLastCopied] = useState('')

  function onCopy(value: string, path: string) {
    setLastCopied(`${path} = ${value.slice(0, 50)}`)
    toast.success('Copied to clipboard', { description: path })
  }

  return (
    <>
      <Story
        title="Book catalog"
        description="A classic nested catalog document — attributes on book nodes, text leaves for author/title/price."
      >
        <XmlTreeView data={catalogXml} expandDepth={2} className="max-h-96" />
      </Story>

      <Story
        title="SOAP fault"
        description="Namespaced SOAP envelope with a nested fault detail array — common in integration logs."
      >
        <XmlTreeView data={soapFaultXml} rootLabel="Envelope" expandDepth={3} className="max-h-96" />
      </Story>

      <Story
        title="App config with comment + CDATA"
        description="Comments, self-closing feature flags, and a CDATA logging block — the full node-type mix."
      >
        <XmlTreeView data={configXml} expandDepth={2} className="max-h-96" />
      </Story>

      <Story title="RSS feed" description="Channel + item list — how an RSS/Atom inspector looks with expandDepth 2.">
        <XmlTreeView data={rssXml} expandDepth={2} className="max-h-80" />
      </Story>

      <Story
        title="SVG markup"
        description="Inline SVG as XML — useful when debugging icons or exported vector markup."
      >
        <XmlTreeView data={svgXml} expandDepth={1} className="max-h-64" />
      </Story>

      <Story
        title="In a debug card"
        description="Embedded in a Card with a status badge — how it looks in a real admin / network panel."
      >
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>GET /api/v1/catalog.xml</span>
              <Badge variant="secondary" className="font-mono text-xs">
                200 OK
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <XmlTreeView data={catalogXml} expandDepth={1} className="max-h-72" />
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Searchable + copy on click"
        description="Filter dims non-matching nodes; click any node to copy its subtree and fire a copy event."
      >
        <XmlTreeView data={catalogXml} expandDepth={3} onCopy={onCopy} className="max-h-96" />
        {lastCopied && <p className="text-muted-foreground mt-2 text-xs">Last copied: {lastCopied}</p>}
      </Story>

      <Story
        title="Collapsed vs. expanded"
        description="expandDepth 0 shows only the root; expandDepth 2 reveals two levels. Use the toolbar to expand all."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">expandDepth 0 — collapsed</span>
            <XmlTreeView data={catalogXml} expandDepth={0} className="max-h-64" />
          </div>
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">expandDepth 2 — expanded</span>
            <XmlTreeView data={catalogXml} expandDepth={2} className="max-h-64" />
          </div>
        </div>
      </Story>

      <Story
        title="Minimal toolbar"
        description="Hide search controls or the whole toolbar for a cleaner embed where filtering isn't needed."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">No search</span>
            <XmlTreeView data={catalogXml} showSearch={false} expandDepth={1} className="max-h-56" />
          </div>
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs">No toolbar</span>
            <XmlTreeView
              data={catalogXml}
              showToolbar={false}
              showSearch={false}
              expandDepth={1}
              className="max-h-56"
            />
          </div>
        </div>
      </Story>

      <Story title="Parse error" description="Malformed XML surfaces a clear error state instead of crashing the tree.">
        <XmlTreeView data={invalidXml} className="max-h-40" />
      </Story>
    </>
  )
}

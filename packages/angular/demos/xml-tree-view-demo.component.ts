import { Component, Input } from '@angular/core'
import { UiXmlTreeViewComponent } from '../../../../../packages/registry-angular/components/xml-tree-view/xml-tree-view.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'

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

@Component({
  selector: 'angular-xml-tree-view-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiXmlTreeViewComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardContentComponent,
    UiBadgeComponent,
  ],
  template: `
    @switch (story) {
      @case ('Book catalog') {
        <ui-xml-tree-view [data]="catalogXml" [expandDepth]="2" class="max-h-96" />
      }
      @case ('SOAP fault') {
        <ui-xml-tree-view [data]="soapFaultXml" rootLabel="Envelope" [expandDepth]="3" class="max-h-96" />
      }
      @case ('App config with comment + CDATA') {
        <ui-xml-tree-view [data]="configXml" [expandDepth]="2" class="max-h-96" />
      }
      @case ('RSS feed') {
        <ui-xml-tree-view [data]="rssXml" [expandDepth]="2" class="max-h-80" />
      }
      @case ('SVG markup') {
        <ui-xml-tree-view [data]="svgXml" [expandDepth]="1" class="max-h-64" />
      }
      @case ('In a debug card') {
        <ui-card class="max-w-2xl">
          <ui-card-header>
            <ui-card-title class="flex items-center justify-between text-base">
              <span>GET /api/v1/catalog.xml</span>
              <ui-badge variant="secondary" class="font-mono text-xs"> 200 OK </ui-badge>
            </ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <ui-xml-tree-view [data]="catalogXml" [expandDepth]="1" class="max-h-72" />
          </ui-card-content>
        </ui-card>
      }
      @case ('Searchable + copy on click') {
        <ui-xml-tree-view [data]="catalogXml" [expandDepth]="3" (copy)="onCopy($event)" class="max-h-96" />
        @if (lastCopied) {
          <p class="text-muted-foreground mt-2 text-xs">Last copied: {{ lastCopied }}</p>
        }
      }
      @case ('Collapsed vs. expanded') {
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">expandDepth 0 — collapsed</span>
            <ui-xml-tree-view [data]="catalogXml" [expandDepth]="0" class="max-h-64" />
          </div>
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">expandDepth 2 — expanded</span>
            <ui-xml-tree-view [data]="catalogXml" [expandDepth]="2" class="max-h-64" />
          </div>
        </div>
      }
      @case ('Minimal toolbar') {
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">No search</span>
            <ui-xml-tree-view [data]="catalogXml" [showSearch]="false" [expandDepth]="1" class="max-h-56" />
          </div>
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">No toolbar</span>
            <ui-xml-tree-view
              [data]="catalogXml"
              [showToolbar]="false"
              [showSearch]="false"
              [expandDepth]="1"
              class="max-h-56"
            />
          </div>
        </div>
      }
      @case ('Parse error') {
        <ui-xml-tree-view [data]="invalidXml" class="max-h-40" />
      }
    }
  `,
})
export class AngularXmlTreeViewDemoComponent {
  @Input() story = 'Book catalog'

  readonly catalogXml = catalogXml
  readonly soapFaultXml = soapFaultXml
  readonly configXml = configXml
  readonly rssXml = rssXml
  readonly svgXml = svgXml
  readonly invalidXml = invalidXml

  lastCopied = ''

  onCopy(event: { value: string; path: string }): void {
    this.lastCopied = `${event.path} = ${event.value.slice(0, 50)}`
  }
}

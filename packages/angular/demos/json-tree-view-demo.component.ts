import { Component, Input } from '@angular/core'
import {
  UiJsonTreeViewComponent,
  type JsonValue,
} from '../../../../../packages/registry-angular/components/json-tree-view/json-tree-view.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'

const apiResponse: JsonValue = {
  status: 'success',
  data: {
    user: {
      id: 8421,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@acme.com',
      role: 'admin',
      verified: true,
      createdAt: '2023-04-12T08:30:00Z',
    },
    organization: {
      id: 'org_abc123',
      name: 'Acme Inc.',
      plan: 'enterprise',
      seats: 50,
      usedSeats: 37,
    },
    permissions: ['read', 'write', 'delete', 'admin'],
    metadata: {
      lastLogin: '2024-03-15T14:22:11Z',
      ipAddress: '192.168.1.42',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      factors: null,
    },
  },
  pagination: {
    page: 1,
    perPage: 20,
    total: 1,
    hasNext: false,
  },
}

const errorResponse: JsonValue = {
  error: {
    code: 'VALIDATION_FAILED',
    message: 'The request body did not match the expected schema.',
    details: [
      { field: 'email', issue: 'must be a valid email address' },
      { field: 'age', issue: 'must be a positive integer' },
    ],
    requestId: 'req_01HZK8XJ9F2P3Q4R5S6T7U8V9W',
    timestamp: '2024-03-15T14:23:01Z',
  },
}

const webhookPayload: JsonValue = {
  event: 'order.created',
  id: 'evt_173829',
  created: 1710510184,
  data: {
    object: {
      id: 'ord_5521',
      number: 'ACME-0042',
      status: 'paid',
      total: 12900,
      currency: 'usd',
      customer: {
        id: 'cus_881',
        email: 'buyer@example.com',
      },
      items: [
        { sku: 'WIDGET-RED', quantity: 2, unitPrice: 4500 },
        { sku: 'WIDGET-BLUE', quantity: 1, unitPrice: 3900 },
      ],
    },
  },
  livemode: false,
}

@Component({
  selector: 'angular-json-tree-view-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiJsonTreeViewComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardContentComponent,
    UiBadgeComponent,
  ],
  template: `
    @switch (story) {
      @case ('API response inspector') {
        <ui-json-tree-view [data]="apiResponse" rootLabel="response" [expandDepth]="2" class="max-h-96" />
      }
      @case ('Error response') {
        <ui-json-tree-view [data]="errorResponse" rootLabel="error" [expandDepth]="3" class="max-h-80" />
      }
      @case ('Webhook payload') {
        <ui-json-tree-view [data]="webhookPayload" rootLabel="event" [expandDepth]="2" class="max-h-96" />
      }
      @case ('In a debug card') {
        <ui-card class="max-w-2xl">
          <ui-card-header>
            <ui-card-title class="flex items-center justify-between text-base">
              <span>GET /api/v2/users/8421</span>
              <ui-badge variant="secondary" class="font-mono text-xs"> 200 OK </ui-badge>
            </ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <ui-json-tree-view [data]="apiResponse" rootLabel="response" [expandDepth]="1" class="max-h-72" />
          </ui-card-content>
        </ui-card>
      }
      @case ('Searchable + copy on click') {
        <ui-json-tree-view
          [data]="apiResponse"
          rootLabel="response"
          [expandDepth]="3"
          (copy)="onCopy($event)"
          class="max-h-96"
        />
        @if (lastCopied) {
          <p class="text-muted-foreground mt-2 text-xs">Last copied: {{ lastCopied }}</p>
        }
      }
      @case ('Collapsed vs. expanded') {
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">expandDepth 0 — collapsed</span>
            <ui-json-tree-view [data]="apiResponse" rootLabel="response" [expandDepth]="0" class="max-h-64" />
          </div>
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">expandDepth 2 — expanded</span>
            <ui-json-tree-view [data]="apiResponse" rootLabel="response" [expandDepth]="2" class="max-h-64" />
          </div>
        </div>
      }
      @case ('Minimal toolbar') {
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">No search</span>
            <ui-json-tree-view
              [data]="apiResponse"
              rootLabel="response"
              [showSearch]="false"
              [expandDepth]="1"
              class="max-h-56"
            />
          </div>
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">No toolbar</span>
            <ui-json-tree-view
              [data]="apiResponse"
              rootLabel="response"
              [showToolbar]="false"
              [showSearch]="false"
              [expandDepth]="1"
              class="max-h-56"
            />
          </div>
        </div>
      }
    }
  `,
})
export class AngularJsonTreeViewDemoComponent {
  @Input() story = 'API response inspector'

  readonly apiResponse = apiResponse
  readonly errorResponse = errorResponse
  readonly webhookPayload = webhookPayload

  lastCopied = ''

  onCopy(event: { value: string; path: string }): void {
    this.lastCopied = `${event.path} = ${event.value.slice(0, 50)}`
  }
}

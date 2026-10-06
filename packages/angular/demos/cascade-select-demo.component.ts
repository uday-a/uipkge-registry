import { Component, Input, signal } from '@angular/core'
import { UiCascadeSelectComponent } from '../../../../../packages/registry-angular/components/cascade-select/cascade-select.component'
import type { CascadeOption } from '../../../../../packages/registry-angular/components/cascade-select/types'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

const regionData: CascadeOption[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          { value: 'xihu', label: 'West Lake' },
          { value: 'binjiang', label: 'Binjiang' },
        ],
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        children: [
          { value: 'haishu', label: 'Haishu' },
          { value: 'jiangbei', label: 'Jiangbei' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          { value: 'xuanwu', label: 'Xuanwu' },
          { value: 'gulou', label: 'Gulou' },
        ],
      },
      {
        value: 'suzhou',
        label: 'Suzhou',
        children: [
          { value: 'gusu', label: 'Gusu' },
          { value: 'wuzhong', label: 'Wuzhong' },
        ],
      },
    ],
  },
  {
    value: 'guangdong',
    label: 'Guangdong',
    children: [
      {
        value: 'guangzhou',
        label: 'Guangzhou',
        children: [
          { value: 'tianhe', label: 'Tianhe' },
          { value: 'yuexiu', label: 'Yuexiu' },
        ],
      },
      {
        value: 'shenzhen',
        label: 'Shenzhen',
        children: [
          { value: 'nanshan', label: 'Nanshan' },
          { value: 'futian', label: 'Futian' },
        ],
      },
    ],
  },
]

const categoryData: CascadeOption[] = [
  {
    value: 'electronics',
    label: 'Electronics',
    children: [
      {
        value: 'phones',
        label: 'Phones',
        children: [
          { value: 'iphone', label: 'iPhone' },
          { value: 'android', label: 'Android' },
        ],
      },
      {
        value: 'laptops',
        label: 'Laptops',
        children: [
          { value: 'macbook', label: 'MacBook' },
          { value: 'windows', label: 'Windows' },
        ],
      },
    ],
  },
  {
    value: 'clothing',
    label: 'Clothing',
    children: [
      {
        value: 'mens',
        label: "Men's",
        children: [
          { value: 'shirts', label: 'Shirts' },
          { value: 'pants', label: 'Pants' },
        ],
      },
      {
        value: 'womens',
        label: "Women's",
        children: [
          { value: 'dresses', label: 'Dresses' },
          { value: 'tops', label: 'Tops' },
        ],
      },
    ],
  },
]

const restrictedData: CascadeOption[] = [
  {
    value: 'level1',
    label: 'Level 1',
    children: [
      { value: 'l1-a', label: 'Option A', disabled: true },
      { value: 'l1-b', label: 'Option B' },
    ],
  },
]

/** Angular demo for the cascade-select page. Mirrors demos/react/cascade-select.tsx story by story. */
@Component({
  selector: 'angular-cascade-select-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiCascadeSelectComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Region picker') {
        <div class="max-w-md space-y-2">
          <ui-cascade-select
            [value]="regionValue()"
            (valueChange)="regionValue.set($event)"
            [options]="regionData"
            placeholder="Select a region..."
            class="w-full"
          />
          <p class="text-muted-foreground text-xs">Selected: {{ regionValue()?.join(' / ') ?? 'none' }}</p>
        </div>
      }
      @case ('Product category') {
        <div class="max-w-md space-y-2">
          <ui-cascade-select
            [value]="categoryValue()"
            (valueChange)="categoryValue.set($event)"
            [options]="categoryData"
            placeholder="Select category..."
            class="w-full"
          />
          <p class="text-muted-foreground text-xs">Selected: {{ categoryValue()?.join(' / ') ?? 'none' }}</p>
        </div>
      }
      @case ('Size variants') {
        <div class="max-w-md space-y-3">
          <ui-cascade-select
            [value]="smValue()"
            (valueChange)="smValue.set($event)"
            [options]="regionData"
            size="sm"
            placeholder="Small..."
            class="w-full"
          />
          <ui-cascade-select [options]="regionData" placeholder="Default..." class="w-full" />
          <ui-cascade-select
            [value]="lgValue()"
            (valueChange)="lgValue.set($event)"
            [options]="regionData"
            size="lg"
            placeholder="Large..."
            class="w-full"
          />
        </div>
      }
      @case ('States & restrictions') {
        <div class="max-w-md space-y-3">
          <ui-cascade-select [options]="regionData" loading placeholder="Loading..." class="w-full" />
          <ui-cascade-select [options]="regionData" disabled placeholder="Disabled" class="w-full" />
          <ui-cascade-select [options]="restrictedData" placeholder="Restricted options..." class="w-full" />
        </div>
      }
      @case ('Custom separator') {
        <div class="max-w-md space-y-2">
          <ui-cascade-select
            [value]="preselectedValue()"
            (valueChange)="preselectedValue.set($event)"
            [options]="regionData"
            [clearable]="false"
            separator=" > "
            placeholder="Select a region..."
            class="w-full"
          />
          <p class="text-muted-foreground text-xs">Path: {{ preselectedValue()?.join(' > ') }}</p>
        </div>
      }
      @case ('In context: Shipping address') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Shipping address</h3>
            <p ui-card-description>Select your province, city, and district to calculate delivery.</p>
          </div>
          <div ui-card-content class="space-y-4">
            <ui-cascade-select
              [value]="shippingValue()"
              (valueChange)="shippingValue.set($event)"
              [options]="regionData"
              searchable
              searchPlaceholder="Search districts..."
              placeholder="Select delivery region..."
              class="w-full"
            />
            @if (shippingValue(); as v) {
              <p class="text-muted-foreground text-xs">Delivering to: {{ v.join(' / ') }}</p>
            } @else {
              <p class="text-muted-foreground text-xs">No region selected yet.</p>
            }
          </div>
        </div>
      }
    }
  `,
})
export class AngularCascadeSelectDemoComponent {
  @Input() story = 'Region picker'
  readonly regionData = regionData
  readonly categoryData = categoryData
  readonly restrictedData = restrictedData
  readonly regionValue = signal<string[] | null>(null)
  readonly categoryValue = signal<string[] | null>(null)
  readonly preselectedValue = signal<string[] | null>(['zhejiang', 'hangzhou', 'xihu'])
  readonly smValue = signal<string[] | null>(null)
  readonly lgValue = signal<string[] | null>(null)
  readonly shippingValue = signal<string[] | null>(null)
}

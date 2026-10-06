import { Component, Input, ViewChild } from '@angular/core'
import { UiVirtualListComponent } from '../../../../../packages/registry-angular/components/virtual-list'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button'

interface FixedItem {
  id: number
  name: string
}

interface DynamicItem {
  id: number
  name: string
  size: number
}

interface HorizontalItem {
  id: number
  name: string
}

const fixed: FixedItem[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Row ${i + 1}`,
}))

const dynamic: DynamicItem[] = Array.from({ length: 5000 }, (_, i) => {
  const size = 32 + (i % 7) * 12
  return { id: i, name: `Row ${i + 1} (h=${size})`, size }
})

const horizontal: HorizontalItem[] = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  name: `Col ${i + 1}`,
}))

@Component({
  selector: 'ui-virtual-list-demo',
  standalone: true,
  imports: [UiVirtualListComponent, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Fixed size, 10k rows') {
        <ui-virtual-list
          [items]="fixed"
          [itemSize]="40"
          [height]="400"
          class="rounded-md border"
          [itemTemplate]="fixedTpl"
        />
        <ng-template #fixedTpl let-item>
          <div class="flex h-10 items-center border-b px-4 text-sm">{{ item.name }}</div>
        </ng-template>
      }

      @case ('Dynamic size') {
        <ui-virtual-list
          [items]="dynamic"
          [itemSize]="dynamicSizeFn"
          [height]="400"
          class="rounded-md border"
          [itemTemplate]="dynamicTpl"
        />
        <ng-template #dynamicTpl let-item>
          <div class="flex items-center border-b px-4 text-sm" [style.height.px]="item.size">
            {{ item.name }}
          </div>
        </ng-template>
      }

      @case ('Imperative scrollToIndex') {
        <div class="space-y-2">
          <div class="flex gap-2">
            <button ui-button size="sm" (click)="jumpTo(0)">Top</button>
            <button ui-button size="sm" (click)="jumpTo(2500)">2500</button>
            <button ui-button size="sm" (click)="jumpTo(7500)">7500</button>
            <button ui-button size="sm" (click)="jumpTo(9999)">End</button>
          </div>
          <ui-virtual-list
            #listRef
            [items]="fixed"
            [itemSize]="32"
            [height]="320"
            class="rounded-md border"
            [itemTemplate]="scrollTpl"
          />
          <ng-template #scrollTpl let-item let-index="index">
            <div class="flex h-8 items-center border-b px-4 text-xs">
              <span class="text-muted-foreground w-12">{{ index }}</span>
              {{ item.name }}
            </div>
          </ng-template>
        </div>
      }

      @case ('Horizontal') {
        <ui-virtual-list
          [items]="horizontal"
          [itemSize]="80"
          [height]="120"
          direction="horizontal"
          class="rounded-md border"
          [itemTemplate]="horizontalTpl"
        />
        <ng-template #horizontalTpl let-item>
          <div class="flex h-full w-20 items-center justify-center border-r text-xs">{{ item.name }}</div>
        </ng-template>
      }
    }
  `,
})
export class VirtualListDemoComponent {
  @Input() story?: string

  @ViewChild('listRef') listRef?: UiVirtualListComponent

  fixed = fixed
  dynamic = dynamic
  horizontal = horizontal

  dynamicSizeFn = (item: unknown): number => (item as DynamicItem).size

  jumpTo(index: number): void {
    this.listRef?.scrollToIndex(index, { align: 'center' })
  }
}

import { Component, Input, signal } from '@angular/core'
import {
  UiTransferComponent,
  type TransferItem,
} from '../../../../../packages/registry-angular/components/transfer/transfer.component'

const data: TransferItem[] = Array.from({ length: 15 }, (_, i) => ({
  key: `k-${i + 1}`,
  label: `Item ${i + 1}`,
  description: i % 3 === 0 ? `Group A` : `Group B`,
  disabled: i === 2,
}))

const big: TransferItem[] = Array.from({ length: 200 }, (_, i) => ({
  key: `big-${i}`,
  label: `Record ${i + 1}`,
}))

/** Angular demo for the transfer page. Mirrors demos/react/transfer.tsx story by story. */
@Component({
  selector: 'angular-transfer-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiTransferComponent],
  template: `
    @switch (story) {
      @case ('Basic') {
        <ui-transfer [targetKeys]="target1()" (targetKeysChange)="target1.set($event)" [dataSource]="data" />
      }
      @case ('With search') {
        <ui-transfer [targetKeys]="target2()" (targetKeysChange)="target2.set($event)" [dataSource]="data" showSearch />
      }
      @case ('With pagination') {
        <ui-transfer
          [targetKeys]="target3()"
          (targetKeysChange)="target3.set($event)"
          [dataSource]="big"
          [pagination]="{ pageSize: 8 }"
          showSearch
        />
      }
      @case ('One-way') {
        <ui-transfer [targetKeys]="target4()" (targetKeysChange)="target4.set($event)" [dataSource]="data" oneWay />
      }
      @case ('Drag and drop') {
        <ui-transfer
          [targetKeys]="target6()"
          (targetKeysChange)="target6.set($event)"
          [dataSource]="data"
          draggable
          showSearch
        />
      }
      @case ('Selectable=false (no checkboxes)') {
        <ui-transfer
          [targetKeys]="target7()"
          (targetKeysChange)="target7.set($event)"
          [dataSource]="data"
          [selectable]="false"
          draggable
        />
      }
      @case ('Custom titles + footer') {
        <ng-template #tip
          ><span class="text-muted-foreground text-xs">Tip: enable \`draggable\` for DnD.</span></ng-template
        >
        <ui-transfer
          [targetKeys]="target5()"
          (targetKeysChange)="target5.set($event)"
          [dataSource]="data"
          [titles]="['Available', 'Selected']"
          [footerLeft]="tip"
        />
      }
    }
  `,
})
export class AngularTransferDemoComponent {
  @Input() story = 'Basic'
  readonly data = data
  readonly big = big
  readonly target1 = signal<string[]>([])
  readonly target2 = signal<string[]>(['k-5', 'k-7'])
  readonly target3 = signal<string[]>([])
  readonly target4 = signal<string[]>([])
  readonly target5 = signal<string[]>([])
  readonly target6 = signal<string[]>(['k-1', 'k-4', 'k-6'])
  readonly target7 = signal<string[]>([])
}

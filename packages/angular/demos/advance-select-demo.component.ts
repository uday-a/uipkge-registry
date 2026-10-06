import { Component, Input, signal } from '@angular/core'
import { UiAdvanceSelectComponent } from '../../../../../packages/registry-angular/components/advance-select/advance-select.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'

const basicOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian' },
  { value: 'elderberry', label: 'Elderberry' },
]

const groupedOptions = [
  { value: 'beijing', label: 'Beijing', group: 'China' },
  { value: 'shanghai', label: 'Shanghai', group: 'China' },
  { value: 'tokyo', label: 'Tokyo', group: 'Japan' },
  { value: 'osaka', label: 'Osaka', group: 'Japan' },
  { value: 'seoul', label: 'Seoul', group: 'Korea' },
  { value: 'busan', label: 'Busan', group: 'Korea' },
]

const disabledOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
]

const userOptions = [
  { value: '1', label: 'Alice Chen', role: 'Engineer', avatar: 'AC' },
  { value: '2', label: 'Bob Smith', role: 'Designer', avatar: 'BS' },
  { value: '3', label: 'Carol Jones', role: 'PM', avatar: 'CJ' },
  { value: '4', label: 'David Park', role: 'Engineer', avatar: 'DP' },
  { value: '5', label: 'Eve Wilson', role: 'Designer', avatar: 'EW' },
]

const customFieldOptions = [
  { id: '1', name: 'Alice', dept: 'Engineering' },
  { id: '2', name: 'Bob', dept: 'Design' },
  { id: '3', name: 'Carol', dept: 'Product' },
]

const virtualOptions = Array.from({ length: 10000 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i + 1}`,
}))

/** Angular demo for the advance-select page. Mirrors demos/react/advance-select.tsx story by story. */
@Component({
  selector: 'angular-advance-select-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiAdvanceSelectComponent, UiBadgeComponent],
  template: `
    <ng-template #userOption let-option="option">
      <div class="flex items-center gap-2">
        <div
          class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold"
        >
          {{ option.avatar }}
        </div>
        <div class="flex flex-col">
          <span class="text-sm">{{ option.label }}</span>
          <span class="text-muted-foreground text-xs">{{ option.role }}</span>
        </div>
      </div>
    </ng-template>

    @switch (story) {
      @case ('Basic') {
        <ui-advance-select
          [value]="basicValue()"
          (valueChange)="basicValue.set($event)"
          [options]="basicOptions"
          placeholder="Pick a fruit"
          class="w-64"
        />
      }
      @case ('Searchable') {
        <ui-advance-select
          [value]="searchValue()"
          (valueChange)="searchValue.set($event)"
          [options]="basicOptions"
          showSearch
          placeholder="Search fruits..."
          class="w-64"
        />
      }
      @case ('Multiple') {
        <ui-advance-select
          [value]="multiValue()"
          (valueChange)="multiValue.set($any($event))"
          mode="multiple"
          [options]="basicOptions"
          placeholder="Pick fruits"
          class="w-80"
        />
      }
      @case ('Tags') {
        <ui-advance-select
          [value]="tagsValue()"
          (valueChange)="tagsValue.set($any($event))"
          mode="tags"
          [options]="basicOptions"
          placeholder="Type and press enter"
          class="w-80"
        />
      }
      @case ('Grouped') {
        <ui-advance-select
          [value]="groupedValue()"
          (valueChange)="groupedValue.set($event)"
          [options]="groupedOptions"
          placeholder="Pick a city"
          class="w-64"
        />
      }
      @case ('Disabled options') {
        <ui-advance-select
          [value]="disabledValue()"
          (valueChange)="disabledValue.set($event)"
          [options]="disabledOptions"
          placeholder="Pick a fruit"
          class="w-64"
        />
      }
      @case ('Loading') {
        <ui-advance-select
          [value]="loadingValue()"
          (valueChange)="loadingValue.set($event)"
          [options]="[]"
          loading
          placeholder="Loading..."
          class="w-64"
        />
      }
      @case ('Size: small') {
        <ui-advance-select
          [value]="smValue()"
          (valueChange)="smValue.set($event)"
          [options]="basicOptions"
          size="sm"
          placeholder="Small select"
          class="w-64"
        />
      }
      @case ('Size: large') {
        <ui-advance-select
          [value]="lgValue()"
          (valueChange)="lgValue.set($event)"
          [options]="basicOptions"
          size="lg"
          placeholder="Large select"
          class="w-64"
        />
      }
      @case ('Status: error') {
        <ui-advance-select
          [value]="errorValue()"
          (valueChange)="errorValue.set($event)"
          [options]="basicOptions"
          status="error"
          placeholder="Error state"
          class="w-64"
        />
      }
      @case ('Status: warning') {
        <ui-advance-select
          [value]="warningValue()"
          (valueChange)="warningValue.set($event)"
          [options]="basicOptions"
          status="warning"
          placeholder="Warning state"
          class="w-64"
        />
      }
      @case ('Clearable') {
        <ui-advance-select
          [value]="clearableValue()"
          (valueChange)="clearableValue.set($event)"
          [options]="basicOptions"
          allowClear
          placeholder="Pick a fruit"
          class="w-64"
        />
      }
      @case ('Max count') {
        <ui-advance-select
          [value]="maxCountValue()"
          (valueChange)="maxCountValue.set($any($event))"
          mode="multiple"
          [options]="basicOptions"
          [maxCount]="3"
          placeholder="Max 3 fruits"
          class="w-80"
        />
      }
      @case ('Max tag count') {
        <ui-advance-select
          [value]="maxTagValue()"
          (valueChange)="maxTagValue.set($any($event))"
          mode="multiple"
          [options]="basicOptions"
          [maxTagCount]="2"
          placeholder="Pick fruits"
          class="w-80"
        />
      }
      @case ('Hide selected') {
        <ui-advance-select
          [value]="hideSelectedValue()"
          (valueChange)="hideSelectedValue.set($any($event))"
          mode="multiple"
          [options]="basicOptions"
          hideSelected
          placeholder="Pick fruits"
          class="w-80"
        />
      }
      @case ('Custom option render') {
        <ui-advance-select
          [value]="customOptValue()"
          (valueChange)="customOptValue.set($event)"
          [options]="userOptions"
          showSearch
          placeholder="Pick a user"
          class="w-80"
          [renderOption]="userOption"
        />
      }
      @case ('Custom tag render') {
        <ng-template #starTag let-label="label" let-closable="closable" let-onClose="onClose">
          <span ui-badge variant="outline" class="h-6 gap-1 pr-1 pl-2 text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-star size-3 text-amber-500"
              aria-hidden="true"
            >
              <path
                d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
              />
            </svg>
            <span>{{ label }}</span>
            @if (closable) {
              <span
                role="button"
                tabindex="0"
                class="hover:bg-muted-foreground/20 inline-flex cursor-pointer items-center rounded-full p-0.5 transition-colors"
                [attr.aria-label]="'Remove ' + label"
                (click)="onClose($event)"
                (keydown.enter)="$event.preventDefault(); onClose()"
                (keydown.space)="$event.preventDefault(); onClose()"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-x size-3"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </span>
            }
          </span>
        </ng-template>
        <ui-advance-select
          [value]="customTagValue()"
          (valueChange)="customTagValue.set($any($event))"
          mode="multiple"
          [options]="basicOptions"
          class="w-80"
          [renderTag]="starTag"
        />
      }
      @case ('Virtual scroll') {
        <ui-advance-select
          [value]="virtualValue()"
          (valueChange)="virtualValue.set($event)"
          [options]="virtualOptions"
          showSearch
          placeholder="Search 10,000 items..."
          class="w-80"
        />
      }
      @case ('Variants') {
        <div class="flex w-64 flex-col gap-3">
          <ui-advance-select
            [value]="variantOutlined()"
            (valueChange)="variantOutlined.set($event)"
            [options]="basicOptions"
            variant="outlined"
            placeholder="Outlined"
          />
          <ui-advance-select
            [value]="variantFilled()"
            (valueChange)="variantFilled.set($event)"
            [options]="basicOptions"
            variant="filled"
            placeholder="Filled"
          />
          <ui-advance-select
            [value]="variantBorderless()"
            (valueChange)="variantBorderless.set($event)"
            [options]="basicOptions"
            variant="borderless"
            placeholder="Borderless"
          />
        </div>
      }
      @case ('Token separators') {
        <ui-advance-select
          [value]="tokenValue()"
          (valueChange)="tokenValue.set($any($event))"
          mode="tags"
          [options]="basicOptions"
          [tokenSeparators]="[',', ' ']"
          placeholder="Type and separate with comma or space"
          class="w-96"
        />
      }
      @case ('Not found') {
        <ui-advance-select
          [value]="notFoundValue()"
          (valueChange)="notFoundValue.set($event)"
          [options]="basicOptions"
          showSearch
          notFoundContent="No fruits match your search. Try 'mango'."
          placeholder="Search..."
          class="w-64"
        />
      }
      @case ('Auto clear search') {
        <div class="flex w-80 flex-col gap-3">
          <ui-advance-select
            [value]="autoClearOn()"
            (valueChange)="autoClearOn.set($any($event))"
            mode="multiple"
            [options]="basicOptions"
            showSearch
            placeholder="Auto clears (default)"
          />
          <ui-advance-select
            [value]="autoClearOff()"
            (valueChange)="autoClearOff.set($any($event))"
            mode="multiple"
            [options]="basicOptions"
            showSearch
            [autoClearSearchValue]="false"
            placeholder="Keeps search text"
          />
        </div>
      }
      @case ('Custom field names') {
        <ui-advance-select
          [value]="customFieldValue()"
          (valueChange)="customFieldValue.set($event)"
          [options]="customFieldOptions"
          [fieldNames]="{ label: 'name', value: 'id', group: 'dept' }"
          placeholder="Pick an employee"
          class="w-64"
        />
      }
      @case ('Remote search') {
        <ui-advance-select
          [value]="remoteValue()"
          (valueChange)="remoteValue.set($event)"
          [options]="remoteOptions()"
          showSearch
          [loading]="remoteLoading()"
          (searchChange)="handleRemoteSearch($event)"
          placeholder="Type to search..."
          class="w-80"
        />
      }
      @case ('Label in value') {
        <div class="w-80 space-y-2">
          <ui-advance-select
            [value]="labelValue()?.value"
            (optionChange)="onLabelChange($event)"
            [options]="basicOptions"
            placeholder="Pick a fruit"
            class="w-64"
          />
          <p class="text-muted-foreground text-xs">Selected: {{ labelValue() ? stringify(labelValue()) : 'none' }}</p>
        </div>
      }
      @case ('Prefix & suffix icons') {
        <ng-template #searchIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-search text-muted-foreground size-4"
            aria-hidden="true"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </ng-template>
        <ng-template #pinIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-map-pin text-muted-foreground size-4"
            aria-hidden="true"
          >
            <path
              d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </ng-template>
        <ui-advance-select
          [value]="prefixValue()"
          (valueChange)="prefixValue.set($event)"
          [options]="basicOptions"
          placeholder="Pick a fruit"
          class="w-64"
          [prefix]="searchIcon"
          [suffixIcon]="pinIcon"
        />
      }
      @case ('Full featured') {
        <ui-advance-select
          [value]="fullValue()"
          (valueChange)="fullValue.set($any($event))"
          mode="multiple"
          [options]="userOptions"
          showSearch
          [maxCount]="5"
          allowClear
          placeholder="Pick team members"
          class="w-96"
          [renderOption]="userOption"
        />
      }
    }
  `,
})
export class AngularAdvanceSelectDemoComponent {
  @Input() story = 'Basic'
  readonly basicOptions = basicOptions
  readonly groupedOptions = groupedOptions
  readonly disabledOptions = disabledOptions
  readonly userOptions = userOptions
  readonly customFieldOptions = customFieldOptions
  readonly virtualOptions = virtualOptions

  readonly basicValue = signal<unknown>(undefined)
  readonly searchValue = signal<unknown>(undefined)
  readonly multiValue = signal<unknown[]>([])
  readonly tagsValue = signal<unknown[]>([])
  readonly groupedValue = signal<unknown>(undefined)
  readonly disabledValue = signal<unknown>(undefined)
  readonly loadingValue = signal<unknown>(undefined)
  readonly smValue = signal<unknown>(undefined)
  readonly lgValue = signal<unknown>(undefined)
  readonly errorValue = signal<unknown>(undefined)
  readonly warningValue = signal<unknown>(undefined)
  readonly clearableValue = signal<unknown>(undefined)
  readonly maxCountValue = signal<unknown[]>([])
  readonly maxTagValue = signal<unknown[]>(['apple', 'banana', 'cherry', 'durian'])
  readonly hideSelectedValue = signal<unknown[]>([])
  readonly customOptValue = signal<unknown>(undefined)
  readonly customTagValue = signal<unknown[]>(['apple', 'banana'])
  readonly virtualValue = signal<unknown>(undefined)
  readonly variantOutlined = signal<unknown>(undefined)
  readonly variantFilled = signal<unknown>(undefined)
  readonly variantBorderless = signal<unknown>(undefined)
  readonly tokenValue = signal<unknown[]>([])
  readonly notFoundValue = signal<unknown>(undefined)
  readonly autoClearOn = signal<unknown[]>([])
  readonly autoClearOff = signal<unknown[]>([])
  readonly customFieldValue = signal<unknown>(undefined)
  readonly prefixValue = signal<unknown>(undefined)
  readonly fullValue = signal<unknown[]>([])

  // Remote search — simulated async fetch with debounce + loading state.
  readonly remoteValue = signal<unknown>(undefined)
  readonly remoteLoading = signal(false)
  readonly remoteOptions = signal<{ value: string; label: string }[]>([])
  private remoteTimeout?: ReturnType<typeof setTimeout>
  handleRemoteSearch(q: string): void {
    this.remoteLoading.set(true)
    clearTimeout(this.remoteTimeout)
    this.remoteTimeout = setTimeout(() => {
      if (!q.trim()) this.remoteOptions.set([])
      else
        this.remoteOptions.set(
          Array.from({ length: 5 }, (_, i) => ({ value: `${q}-${i}`, label: `${q} result ${i + 1}` })),
        )
      this.remoteLoading.set(false)
    }, 600)
  }

  // Label in value — capture both the value and its option.
  readonly labelValue = signal<{ value: unknown; label: string } | undefined>(undefined)
  onLabelChange(e: { value: unknown; option: unknown }): void {
    this.labelValue.set(e.value == null ? undefined : { value: e.value, label: (e.option as { label: string }).label })
  }
  stringify(v: unknown): string {
    return JSON.stringify(v)
  }
}

import { Component, Input } from '@angular/core'
import {
  UiBottomNavigationComponent,
  type BottomNavItem,
} from '../../../../../packages/registry-angular/components/bottom-navigation/bottom-navigation.component'

const HOME_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home size-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
const SEARCH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search size-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
const BELL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell size-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`
const USER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user size-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const CART_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart size-5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
const HEART_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart size-5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
const INBOX_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox size-5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`
const MENU_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu size-5"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`
const SETTINGS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings size-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`

@Component({
  selector: 'bottom-navigation-demo',
  standalone: true,
  imports: [UiBottomNavigationComponent],
  template: `
    @switch (story) {
      @case ('Mobile app shell') {
        <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
          <div class="bg-background flex h-56 flex-col items-center justify-center gap-2 p-6 text-center">
            <p class="text-sm font-medium">{{ activeLabel }}</p>
            <p class="text-muted-foreground text-xs">{{ views[active] }}</p>
          </div>
          <ui-bottom-navigation [items]="items" [value]="active" (valueChange)="active = $event" [fixed]="false" />
        </div>
      }
      @case ('Shopping app with badges') {
        <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
          <div class="bg-background flex h-48 flex-col items-center justify-center gap-1 p-6 text-center">
            <p class="text-sm font-medium">{{ shopActiveLabel }}</p>
            <p class="text-muted-foreground text-xs">Your shopping hub</p>
          </div>
          <ui-bottom-navigation
            [items]="shopItems"
            [value]="shopActive"
            (valueChange)="shopActive = $event"
            [fixed]="false"
          />
        </div>
      }
      @case ('Custom active color') {
        <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
          <div class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-sm">
            Violet brand
          </div>
          <ui-bottom-navigation
            [items]="items"
            [value]="active"
            (valueChange)="active = $event"
            [fixed]="false"
            activeColor="text-violet-600"
          />
        </div>
      }
      @case ('5 tabs & no indicator') {
        <div class="grid max-w-md gap-4 sm:grid-cols-2">
          <div class="border-border overflow-hidden rounded-2xl border">
            <div class="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs">Five tabs</div>
            <ui-bottom-navigation
              [items]="fiveItems"
              [value]="fiveActive"
              (valueChange)="fiveActive = $event"
              [fixed]="false"
            />
          </div>
          <div class="border-border overflow-hidden rounded-2xl border">
            <div class="bg-muted/30 text-muted-foreground flex h-36 items-center justify-center text-xs">No pill</div>
            <ui-bottom-navigation
              [items]="items"
              [value]="active"
              (valueChange)="active = $event"
              [fixed]="false"
              [showIndicator]="false"
            />
          </div>
        </div>
      }
      @case ('Long labels on narrow screens') {
        <div class="border-border mx-auto w-full max-w-[200px] overflow-hidden rounded-2xl border">
          <div class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs">Narrow</div>
          <ui-bottom-navigation
            [items]="narrowItems"
            [value]="narrowActive"
            (valueChange)="narrowActive = $event"
            [fixed]="false"
          />
        </div>
      }
      @case ('Router integration') {
        <div class="border-border mx-auto w-full max-w-sm overflow-hidden rounded-2xl border">
          <div class="bg-muted/30 text-muted-foreground flex h-40 items-center justify-center text-xs">
            Router-ready
          </div>
          <ui-bottom-navigation [items]="routerItems" [fixed]="false" />
        </div>
      }
    }
  `,
})
export class BottomNavigationDemoComponent {
  @Input() story = 'Mobile app shell'

  active = 'home'
  shopActive = 'shop'
  fiveActive = 'a'
  narrowActive = 'a'

  items: BottomNavItem[] = [
    { value: 'home', label: 'Home', icon: HOME_ICON },
    { value: 'search', label: 'Search', icon: SEARCH_ICON },
    { value: 'notifications', label: 'Alerts', icon: BELL_ICON, badge: 3 },
    { value: 'profile', label: 'Profile', icon: USER_ICON },
  ]

  shopItems: BottomNavItem[] = [
    { value: 'shop', label: 'Shop', icon: CART_ICON },
    { value: 'saved', label: 'Saved', icon: HEART_ICON, badge: 12 },
    { value: 'inbox', label: 'Inbox', icon: INBOX_ICON, badge: '!' },
    { value: 'menu', label: 'More', icon: MENU_ICON },
  ]

  fiveItems: BottomNavItem[] = [
    { value: 'a', label: 'Home', icon: HOME_ICON },
    { value: 'b', label: 'Search', icon: SEARCH_ICON },
    { value: 'c', label: 'Alerts', icon: BELL_ICON, badge: 5 },
    { value: 'd', label: 'Settings', icon: SETTINGS_ICON },
    { value: 'e', label: 'Profile', icon: USER_ICON },
  ]

  narrowItems: BottomNavItem[] = [
    { value: 'a', label: 'Dashboard', icon: HOME_ICON },
    { value: 'b', label: 'Notifications', icon: BELL_ICON, badge: 99 },
    { value: 'c', label: 'Account Settings', icon: SETTINGS_ICON },
  ]

  routerItems: BottomNavItem[] = [
    { value: 'home', label: 'Home', icon: HOME_ICON, to: '/' },
    { value: 'about', label: 'About', icon: SEARCH_ICON, to: '/about' },
    { value: 'settings', label: 'Settings', icon: SETTINGS_ICON, to: '/settings' },
  ]

  views: Record<string, string> = {
    home: 'Welcome back — your feed is up to date.',
    search: 'Search across products, orders, and stores.',
    notifications: '3 new alerts waiting for you.',
    profile: 'Manage your account and preferences.',
  }

  get activeLabel(): string {
    return this.items.find((i) => i.value === this.active)?.label ?? ''
  }

  get shopActiveLabel(): string {
    return this.shopItems.find((i) => i.value === this.shopActive)?.label ?? ''
  }
}

// Loaded before every spec (vitest setupFiles). The JIT compiler lets partially
// compiled Angular packages (@angular/common, @angular/forms) load, and jsdom specs
// get a TestBed environment so they can render real templates.
import '@angular/compiler'
import { afterEach } from 'vitest'
import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

if (typeof document !== 'undefined') {
  getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: { destroyAfterEach: true },
  })
  // Angular only auto-resets TestBed under jasmine/jest globals; vitest needs it explicitly.
  afterEach(() => getTestBed().resetTestingModule())
}

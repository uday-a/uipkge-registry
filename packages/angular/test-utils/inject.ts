import {
  ChangeDetectorRef,
  DestroyRef,
  ElementRef,
  Injector,
  ViewContainerRef,
  runInInjectionContext,
  type Provider,
} from '@angular/core'

/**
 * Instantiate a component / directive class inside a real Angular injection context,
 * without TestBed (the registry's vitest env has no matching @angular/compiler). Lets
 * specs exercise inject()-based state, DI sharing and host handlers directly.
 */
export function create<T>(cls: new () => T, providers: Provider[] = [], parent?: Injector): T {
  const injector = Injector.create({ providers, parent })
  return runInInjectionContext(injector, () => new cls())
}

/** Child injector providing `instance` under its own class token (what a parent element would expose). */
export function providing<T extends object>(instance: T, parent?: Injector, extra: Provider[] = []): Injector {
  return Injector.create({ providers: [{ provide: instance.constructor, useValue: instance }, ...extra], parent })
}

export function elementRef(tag = 'button'): ElementRef<HTMLElement> {
  return new ElementRef(document.createElement(tag))
}

export const noopDestroyRef: Provider = { provide: DestroyRef, useValue: { onDestroy: () => () => {} } }

/**
 * Minimal ViewContainerRef whose createEmbeddedView renders `build()` as real DOM, so
 * BodyPortal-backed content (menus, sheets, tooltips) can be shown / hidden in jsdom.
 */
export function fakeViewContainer(build: () => HTMLElement[]): Provider {
  const vcr = {
    createEmbeddedView: () => {
      const rootNodes = build()
      return { rootNodes, detectChanges: () => {}, destroy: () => rootNodes.forEach((n) => n.remove()) }
    },
  }
  return { provide: ViewContainerRef, useValue: vcr }
}

/** ChangeDetectorRef for components that schedule zoneless repaints (form writes). */
export const cdrStub: Provider = {
  provide: ChangeDetectorRef,
  useValue: {
    markForCheck: () => {},
    detectChanges: () => {},
    detach: () => {},
    reattach: () => {},
    checkNoChanges: () => {},
  },
}

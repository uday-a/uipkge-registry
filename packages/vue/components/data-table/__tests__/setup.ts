import { config } from "@vue/test-utils";
import { defineComponent } from "vue";

// Nuxt/Astro consumer component — passthrough for unit tests.
const ClientOnly = defineComponent({
  name: "ClientOnly",
  setup(_, { slots }) {
    return () => slots.default?.() ?? null;
  },
});

config.global.components = {
  ...(config.global.components ?? {}),
  ClientOnly,
};

// quiet reka-ui / ResizeObserver noise in happy-dom
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error test polyfill
globalThis.ResizeObserver = globalThis.ResizeObserver ?? RO;

// @ts-expect-error test polyfill
Element.prototype.scrollIntoView =
  Element.prototype.scrollIntoView ?? (() => {});

// matchMedia stub for any responsive hooks
// @ts-expect-error test polyfill
globalThis.matchMedia =
  globalThis.matchMedia ??
  ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));

// IntersectionObserver stub for happy-dom (marks in-view immediately)
class DefaultIO {
  private cb: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
  }
  observe(el: Element) {
    this.cb(
      [
        {
          isIntersecting: true,
          target: el,
          intersectionRatio: 1,
          boundingClientRect:
            el.getBoundingClientRect?.() ?? ({} as DOMRectReadOnly),
          intersectionRect:
            el.getBoundingClientRect?.() ?? ({} as DOMRectReadOnly),
          rootBounds: null,
          time: Date.now(),
        },
      ],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
// @ts-expect-error test polyfill
globalThis.IntersectionObserver = DefaultIO;

// Canvas 2D context stub for ECharts / zrender / charts
if (typeof HTMLCanvasElement !== "undefined") {
  const dummyCtx = {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray(0) }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({
      width: 0,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 0,
    }),
    transform: () => {},
    rect: () => {},
    strokeRect: () => {},
    clip: () => {},
    bezierCurveTo: () => {},
    quadraticCurveTo: () => {},
    arcTo: () => {},
    isPointInPath: () => false,
    isPointInStroke: () => false,
    setLineDash: () => {},
    getLineDash: () => [],
    createPattern: () => null,
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
  };
  // @ts-expect-error test polyfill
  HTMLCanvasElement.prototype.getContext = function (type: string) {
    if (type === "2d") return dummyCtx;
    return null;
  };
}

// URL.createObjectURL for export tests
if (typeof URL.createObjectURL !== "function") {
  // @ts-expect-error test polyfill
  URL.createObjectURL = () => "blob:test";
}
if (typeof URL.revokeObjectURL !== "function") {
  // @ts-expect-error test polyfill
  URL.revokeObjectURL = () => {};
}

// Chart container client dimensions for ECharts/zrender in happy-dom
if (typeof HTMLElement !== "undefined") {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return 500;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get() {
      return 300;
    },
  });
}

vi.mock("mapbox-gl", () => {
  class NavigationControl {
    showCompass = false;
  }
  class FullscreenControl {}
  return {
    default: {
      NavigationControl,
      FullscreenControl,
      Map: class {},
    },
    NavigationControl,
    FullscreenControl,
  };
});

vi.mock("@studiometa/vue-mapbox-gl", () => {
  const mapInst: any = {
    __v_isRef: true,
    once: () => {},
    on: () => {},
    off: () => {},
    isStyleLoaded: () => true,
    addLayer: () => {},
    addSource: () => {},
    removeLayer: () => {},
    removeSource: () => {},
    getLayer: () => null,
    getSource: () => null,
    setPaintProperty: () => {},
  };
  mapInst.value = mapInst;
  return {
    useMap: () => ({ map: mapInst }),
    MapboxMap: {
      name: "MapboxMap",
      props: {
        accessToken: { type: String, default: "" },
        mapStyle: { type: String, default: "" },
      },
      template: '<div class="mock-mapbox-map"><slot /></div>',
    },
    MapboxMarker: { name: "MapboxMarker", template: "<div><slot /></div>" },
    MapboxPopup: { name: "MapboxPopup", template: "<div><slot /></div>" },
    MapboxLayer: { name: "MapboxLayer", template: "<div />" },
    MapboxSource: { name: "MapboxSource", template: "<div />" },
    MapboxNavigationControl: {
      name: "MapboxNavigationControl",
      template: "<div />",
    },
    MapboxFullscreenControl: {
      name: "MapboxFullscreenControl",
      template: "<div />",
    },
  };
});

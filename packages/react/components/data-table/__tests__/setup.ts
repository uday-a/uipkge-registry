import "@testing-library/jest-dom/vitest";
import * as React from "react";

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error test polyfill
globalThis.ResizeObserver = globalThis.ResizeObserver ?? RO;

// IntersectionObserver polyfill for jsdom (marks elements as intersecting immediately)
class IO {
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
  root = null;
  rootMargin = "";
  thresholds = [];
}
// @ts-expect-error test polyfill
globalThis.IntersectionObserver = IO;

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
// @ts-expect-error test polyfill
Element.prototype.scrollIntoView =
  Element.prototype.scrollIntoView ?? (() => {});
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

// URL.createObjectURL for export tests
if (typeof URL.createObjectURL !== "function") {
  // @ts-expect-error test polyfill
  URL.createObjectURL = () => "blob:test";
}
if (typeof URL.revokeObjectURL !== "function") {
  // @ts-expect-error test polyfill
  URL.revokeObjectURL = () => {};
}

// Chart container client dimensions for ECharts/zrender in jsdom
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

vi.mock("react-map-gl/mapbox", () => ({
  default: ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", { className: "mock-map" }, children),
  NavigationControl: () =>
    React.createElement("div", { className: "mock-nav" }),
  FullscreenControl: () =>
    React.createElement("div", { className: "mock-fullscreen" }),
  Marker: () => React.createElement("div"),
  Popup: () => React.createElement("div"),
  Layer: () => React.createElement("div"),
  Source: () => React.createElement("div"),
}));

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

vi.mock("leaflet", () => {
  const fakeLayer = () => ({
    addTo: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    setLatLng: vi.fn(),
    setLatLngs: vi.fn(),
    setStyle: vi.fn(),
    setRadius: vi.fn(),
    setUrl: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    setZIndexOffset: vi.fn(),
    on: vi.fn(),
    bindPopup: vi.fn(),
    bindTooltip: vi.fn(),
    unbindPopup: vi.fn(),
    unbindTooltip: vi.fn(),
    clearLayers: vi.fn(),
    addData: vi.fn(),
  });
  return {
    map: vi.fn(() => ({
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      remove: vi.fn(),
      setView: vi.fn(),
      flyTo: vi.fn(),
      panTo: vi.fn(),
      fitBounds: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      invalidateSize: vi.fn(),
      getCenter: vi.fn(() => ({ lat: 20, lng: 0 })),
      getZoom: vi.fn(() => 2),
      getMaxZoom: vi.fn(() => 18),
      getMinZoom: vi.fn(() => 0),
      eachLayer: vi.fn(),
      scrollWheelZoom: { enable: vi.fn(), disable: vi.fn() },
      on: vi.fn(),
    })),
    tileLayer: vi.fn(() => fakeLayer()),
    marker: vi.fn(() => fakeLayer()),
    polyline: vi.fn(() => fakeLayer()),
    polygon: vi.fn(() => fakeLayer()),
    circle: vi.fn(() => fakeLayer()),
    circleMarker: vi.fn(() => fakeLayer()),
    geoJSON: vi.fn(() => fakeLayer()),
    popup: vi.fn(() => ({
      ...fakeLayer(),
      setLatLng: vi.fn().mockReturnThis(),
      setContent: vi.fn().mockReturnThis(),
      openOn: vi.fn(),
    })),
    tooltip: vi.fn(() => ({
      ...fakeLayer(),
      setLatLng: vi.fn().mockReturnThis(),
      setContent: vi.fn().mockReturnThis(),
    })),
    divIcon: vi.fn((opts: any) => opts),
    latLngBounds: vi.fn((a: any, b: any) => [a, b]),
    control: {
      zoom: vi.fn(() => ({ addTo: vi.fn(), remove: vi.fn() })),
      attribution: vi.fn(() => ({ addTo: vi.fn(), remove: vi.fn() })),
    },
    Icon: { Default: { mergeOptions: vi.fn() } },
  };
});

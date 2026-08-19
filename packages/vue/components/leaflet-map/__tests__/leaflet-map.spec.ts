import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

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
  setIcon: vi.fn(),
  on: vi.fn(),
  bindPopup: vi.fn(),
  bindTooltip: vi.fn(),
  unbindPopup: vi.fn(),
  unbindTooltip: vi.fn(),
  clearLayers: vi.fn(),
  addData: vi.fn(),
  getElement: vi.fn(() => null),
});

vi.mock("leaflet", () => ({
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
}));

import { LeafletMap } from "../index";

describe("LeafletMap", () => {
  it('renders container with data-slot="leaflet-map"', () => {
    const w = mount(LeafletMap, { attachTo: document.body });
    expect(w.find('[data-slot="leaflet-map"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on container", () => {
    const w = mount(LeafletMap, { attachTo: document.body });
    expect(
      w.find('[data-slot="leaflet-map"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("applies custom class", () => {
    const w = mount(LeafletMap, {
      props: { class: "h-96" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="leaflet-map"]').classes()).toContain("h-96");
    w.unmount();
  });

  it("renders as a div", () => {
    const w = mount(LeafletMap, { attachTo: document.body });
    expect(w.find('div[data-slot="leaflet-map"]').exists()).toBe(true);
    w.unmount();
  });

  it("has bg-muted class by default", () => {
    const w = mount(LeafletMap, { attachTo: document.body });
    expect(w.find('[data-slot="leaflet-map"]').classes()).toContain("bg-muted");
    w.unmount();
  });

  it("sets data-variant from the variant prop", () => {
    const w = mount(LeafletMap, {
      props: { variant: "satellite" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="leaflet-map"]').attributes("data-variant")).toBe(
      "satellite",
    );
    w.unmount();
  });

  it("marks data-muted for the muted variant", () => {
    const w = mount(LeafletMap, {
      props: { variant: "muted" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="leaflet-map"]').attributes("data-muted")).toBe(
      "true",
    );
    w.unmount();
  });

  it("shows a fullscreen button only when fullscreen is set", async () => {
    const off = mount(LeafletMap, { attachTo: document.body });
    await flushPromises();
    expect(off.find('[aria-label="Toggle fullscreen"]').exists()).toBe(false);
    off.unmount();
    const on = mount(LeafletMap, {
      props: { fullscreen: true },
      attachTo: document.body,
    });
    await flushPromises();
    expect(on.find('[aria-label="Toggle fullscreen"]').exists()).toBe(true);
    on.unmount();
  });
});

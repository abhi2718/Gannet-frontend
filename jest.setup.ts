import "@testing-library/jest-dom";

// jsdom does not implement matchMedia / IntersectionObserver / ResizeObserver,
// all of which are touched by motion and recharts during render.
if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
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

  class MockObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  const g = global as unknown as {
    IntersectionObserver?: unknown;
    ResizeObserver?: unknown;
  };
  g.IntersectionObserver = g.IntersectionObserver || MockObserver;
  g.ResizeObserver = g.ResizeObserver || MockObserver;

  window.scrollTo = window.scrollTo || (() => {});
}

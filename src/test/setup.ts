import "@testing-library/jest-dom";

// Mock matchMedia for components that use media queries
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock crypto.randomUUID for tests
if (!crypto.randomUUID) {
  Object.defineProperty(crypto, "randomUUID", {
    value: () => "00000000-0000-0000-0000-000000000000",
  });
}

// Mock crypto.subtle for PoW tests
if (!crypto.subtle) {
  Object.defineProperty(crypto, "subtle", {
    value: {
      digest: async (algorithm: string, data: ArrayBuffer) => {
        return new Uint8Array(32).buffer;
      },
    },
  });
}

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "sessionStorage", { value: mockSessionStorage });

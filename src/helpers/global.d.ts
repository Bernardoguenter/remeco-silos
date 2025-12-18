export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: Array<Record<string, any>>;
  }
}

declare global {
  interface Window {
    dataLayer: GTMEvent[];
  }
}

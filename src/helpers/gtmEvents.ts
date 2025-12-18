export function pushGtmEvent(
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...payload,
  });
}

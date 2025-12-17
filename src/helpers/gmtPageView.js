export function gtmPageView(url) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_view",
    page_path: url,
    page_location: window.location.href,
  });
}

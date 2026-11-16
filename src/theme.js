export function applyTheme(doc = document, preview = false) {
  const root = doc.documentElement;
  if (!root) return;
  root.dataset.v2pTheme = "minimalist";
  root.dataset.vxTheme = "minimalist";
  if (/^\/t\/\d+/.test(doc.location?.pathname ?? location.pathname)) root.dataset.v2pPage = "topic";
  if (preview) root.dataset.v2pPreview = "1";
  doc.body?.classList.add("v2p-theme-minimalist");
  if (doc.querySelector("#site-header")) {
    root.dataset.v2pMobile = "true";
    doc.body?.classList.add("v2p-mobile");
  }
}

export const THEME_STYLE_ID = "v2ex-lite-theme";
export const DEFAULT_THEME = "minimalist";
export const THEMES = Object.freeze(["minimalist", "arco-clear", "native"]);

export function normalizeTheme(value) {
  return THEMES.includes(value) ? value : DEFAULT_THEME;
}

export function applyTheme(
  doc = document,
  preview = false,
  theme = doc.documentElement?.dataset.vxTheme,
) {
  const root = doc.documentElement;
  if (!root) return;
  root.dataset.vxTheme = normalizeTheme(theme);
  if (root.dataset.vxTheme === "native") delete root.dataset.v2pTheme;
  else {
    root.dataset.v2pTheme = "minimalist";
    if (!root.hasAttribute("data-vx-system-dark")) {
      const scheme = doc.defaultView?.matchMedia?.("(prefers-color-scheme: dark)");
      const sync = () => (root.dataset.vxSystemDark = scheme?.matches ? "1" : "0");
      sync();
      scheme?.addEventListener("change", sync);
    }
  }
  if (/^\/t\/\d+/.test(doc.location?.pathname ?? location.pathname)) root.dataset.v2pPage = "topic";
  if (preview) root.dataset.v2pPreview = "1";
  doc.body?.classList.toggle("v2p-theme-minimalist", root.dataset.vxTheme !== "native");
  if (doc.querySelector("#site-header")) {
    root.dataset.v2pMobile = "true";
    doc.body?.classList.add("v2p-mobile");
  }
}

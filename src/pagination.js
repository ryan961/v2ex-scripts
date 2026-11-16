import { t } from "./i18n.js";
import { element, owned } from "./dom.js";

export function createPagination({
  container,
  first,
  toolbar,
  pages,
  current,
  total: initialTotal,
  loadPage,
}) {
  let reading = current,
    total = initialTotal,
    loading = [],
    signature = "",
    scheduled = false,
    navigation = 0,
    lastJump;
  const candidates = [...container.children].filter(
    (node) =>
      !node.matches('.cell[id^="r_"]') &&
      node.querySelector(".page_current,.page_normal,.page_input"),
  );
  const bottom =
    candidates.findLast((node) => first.compareDocumentPosition(node) & 4) ??
    owned(element("div", undefined, "cell ps_container"));
  container.append(bottom);
  bottom.before(toolbar);
  const bars = [...new Set([...candidates, bottom])];
  for (const bar of bars) owned(bar);

  function pageURL(page) {
    const url = new URL(location.href);
    url.searchParams.set("p", String(page));
    url.hash = "";
    return url.href;
  }
  function setReading(page) {
    if (reading === page) return;
    reading = page;
    refresh(total, loading);
  }
  async function navigate(page) {
    if (!Number.isInteger(page) || page < 1 || page > total) return false;
    const ticket = ++navigation;
    if (!pages.has(page) && !(await loadPage(page))) return false;
    if (ticket !== navigation) return false;
    setReading(page);
    lastJump = pages.get(page);
    lastJump?.scrollIntoView({ block: "start" });
    return true;
  }
  function controls() {
    const visible =
      total <= 9
        ? Array.from({ length: total }, (_, i) => i + 1)
        : [
            ...new Set([
              1,
              total,
              ...Array.from({ length: 5 }, (_, i) => reading + i - 2).filter(
                (p) => p > 1 && p < total,
              ),
            ]),
          ].sort((a, b) => a - b);
    const table = element("table");
    table.setAttribute("cellpadding", "0");
    table.setAttribute("cellspacing", "0");
    table.setAttribute("border", "0");
    table.style.width = "100%";
    const body = element("tbody"),
      row = element("tr"),
      numbers = element("td"),
      arrows = element("td");
    numbers.style.width = "92%";
    arrows.style.width = "8%";
    arrows.align = "right";
    let previous = 0;
    for (const page of visible) {
      if (previous && page > previous + 1) numbers.append(element("span", " \u2026 "));
      const link = element("a", String(page), page === reading ? "page_current" : "page_normal");
      link.href = pageURL(page);
      link.dataset.vxPage = String(page);
      link.title = pages.has(page) ? t("jumpPage", page) : t("loadPage", page);
      if (page === reading) link.setAttribute("aria-current", "page");
      if (loading.includes(page)) link.setAttribute("aria-busy", "true");
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)
          return;
        event.preventDefault();
        void navigate(page);
      });
      numbers.append(link, " ");
      previous = page;
    }
    const input = element("input");
    input.type = "number";
    input.className = "page_input";
    input.autocomplete = "off";
    input.value = String(reading);
    input.min = "1";
    input.max = String(total);
    input.setAttribute("aria-label", t("pageNumber"));
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const page = Number(input.value);
      void navigate(page);
    });
    numbers.append(input);
    const inner = element("table"),
      innerBody = element("tbody"),
      innerRow = element("tr");
    inner.setAttribute("cellpadding", "0");
    inner.setAttribute("cellspacing", "0");
    inner.setAttribute("border", "0");
    inner.style.width = "100%";
    for (const [direction, text] of [
      [-1, "\u276e"],
      [1, "\u276f"],
    ]) {
      const page = reading + direction,
        disabled = page < 1 || page > total;
      const cell = element(
        "td",
        text,
        `super ${direction === 1 ? "normal_page_right" : "normal"} button`,
      );
      Object.assign(cell.style, {
        display: "table-cell",
        width: "50%",
        textAlign: "center",
        opacity: disabled ? "0.4" : "",
      });
      if (direction < 0)
        Object.assign(cell.style, {
          borderRight: "none",
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
        });
      else Object.assign(cell.style, { borderTopLeftRadius: "0", borderBottomLeftRadius: "0" });
      cell.tabIndex = disabled ? -1 : 0;
      cell.setAttribute("role", "button");
      cell.setAttribute("aria-disabled", String(disabled));
      if (loading.includes(page)) cell.setAttribute("aria-busy", "true");
      cell.dataset.vxDirection = String(direction);
      cell.title = direction < 0 ? t("previousPage") : t("nextPage");
      cell.setAttribute("aria-label", cell.title);
      const go = () => {
        if (!disabled) void navigate(page);
      };
      cell.addEventListener("click", go);
      cell.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          go();
        }
      });
      innerRow.append(cell);
    }
    innerBody.append(innerRow);
    inner.append(innerBody);
    arrows.append(inner);
    row.append(numbers, arrows);
    body.append(row);
    table.append(body);
    return table;
  }
  function refresh(nextTotal = total, nextLoading = loading) {
    total = nextTotal;
    loading = nextLoading;
    const key = `${reading}:${total}:${loading.join(",")}:${[...pages.keys()].join(",")}`;
    if (key === signature) return;
    signature = key;
    for (const bar of bars) {
      bar.hidden = total <= 1;
      bar.dataset.vxPagination = "";
      bar.setAttribute("aria-label", t("replyPages"));
      const focused = document.activeElement;
      let selector;
      if (bar.contains(focused)) {
        if (focused.matches(".page_input")) selector = ".page_input";
        else if (focused.dataset.vxPage) selector = `[data-vx-page="${focused.dataset.vxPage}"]`;
        else if (focused.dataset.vxDirection)
          selector = `[data-vx-direction="${focused.dataset.vxDirection}"]`;
      }
      bar.replaceChildren(controls());
      if (selector) {
        const replacement = bar.querySelector(selector);
        if (replacement?.matches(".page_input")) replacement.value = focused.value;
        replacement?.focus({ preventScroll: true });
      }
    }
  }
  function trackReading() {
    const threshold = Math.min(100, window.innerHeight / 4);
    if (lastJump) {
      const top = lastJump.getBoundingClientRect().top;
      const bottom = document.documentElement.scrollHeight - window.innerHeight;
      if (top > threshold && top < window.innerHeight && bottom > 0 && window.scrollY >= bottom - 1)
        return;
      lastJump = null;
    }
    const ordered = [...pages].sort(([a], [b]) => a - b);
    let page = ordered[0]?.[0] ?? current;
    for (const [number, marker] of ordered)
      if (marker.isConnected && marker.getBoundingClientRect().top <= threshold) page = number;
    setReading(page);
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      trackReading();
    });
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  container.addEventListener("load", schedule, true);
  container.addEventListener("click", (event) => {
    if (event.target.closest?.(".v2p-expand-btn")) schedule();
  });
  const observer =
    typeof window.ResizeObserver === "function" ? new window.ResizeObserver(schedule) : null;
  observer?.observe(container);
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) observer?.disconnect();
  });
  refresh();
  return {
    bottom,
    navigate,
    refresh,
    trackReading,
    get reading() {
      return reading;
    },
  };
}

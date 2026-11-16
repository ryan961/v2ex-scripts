import { currentUser } from "./dom.js";

export function dayKey(now = Date.now()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function canAttempt(state, day, now) {
  return (
    !state || state.day !== day || (!state.success && state.attempts < 3 && now >= state.nextAt)
  );
}

export function redeemed(doc) {
  return /\u6bcf\u5929\u7684\u767b\u5f55\u5956\u52b1\u5df2\u7ecf\u9886\u53d6|\u6bcf\u65e5\u767b\u5f55\u5956\u52b1\u5df2\u9886\u53d6|\u4eca\u65e5\u767b\u5f55\u5956\u52b1\u5df2\u9886\u53d6|\u4f60\u5df2\u7ecf\u9886\u53d6\u4e86\u4eca\u5929\u7684\u767b\u5f55\u5956\u52b1|\u5df2\u6210\u529f\u9886\u53d6|Daily (?:login )?reward (?:received|already redeemed)/i.test(
    doc.querySelector("#Main")?.textContent ?? "",
  );
}

export function createCheckIn({
  store,
  getDocument,
  locks = navigator.locks,
  now = Date.now,
  onStatus = () => {},
}) {
  let running = false;
  return async function run(name) {
    if (!name || running) return;
    if (!locks) {
      onStatus("Automatic check-in requires Web Locks. Use /mission/daily manually.");
      return;
    }
    running = true;
    try {
      await locks.request("v2ex-lite:check-in", { ifAvailable: true }, async (lock) => {
        if (!lock) return;
        const time = now();
        const day = dayKey(time);
        const key = `daily:${name.toLowerCase()}`;
        let state = store.get(key);
        if (!canAttempt(state, day, time)) return;
        // shortcut: Web Locks are origin-scoped; the GM lease only reduces races between mirrors.
        const lease = store.get("daily-lease");
        if (lease?.until > time) return;
        const owner = crypto.randomUUID();
        store.set("daily-lease", { owner, until: time + 45_000 });
        if (store.get("daily-lease")?.owner !== owner) return;
        state = {
          day,
          attempts: state?.day === day ? state.attempts + 1 : 1,
          success: false,
          nextAt: time + 60_000,
        };
        // Persist the attempt before networking so navigation cannot create unbounded retries.
        store.set(key, state);
        try {
          const doc = await getDocument("/mission/daily");
          if (currentUser(doc)?.toLowerCase() !== name.toLowerCase())
            throw new Error("Account changed or signed out.");
          if (!redeemed(doc)) {
            const link = doc.querySelector('a[href^="/mission/daily/redeem?once="]');
            const inline = [...doc.querySelectorAll("input[onclick], button[onclick]")]
              .map(
                (node) =>
                  /["'](\/mission\/daily\/redeem\?once=\d+)["']/.exec(
                    node.getAttribute("onclick"),
                  )?.[1],
              )
              .find(Boolean);
            const path = link?.getAttribute("href") ?? inline;
            if (!path || !/^\/mission\/daily\/redeem\?once=\d+$/.test(path))
              throw new Error("Reward link not found.");
            const result = await getDocument(path);
            if (!redeemed(result)) throw new Error("Reward was not confirmed; no immediate retry.");
          }
          store.set(key, { ...state, success: true, nextAt: 0 });
          onStatus("Daily reward received.");
        } catch (error) {
          store.set(key, { ...state, nextAt: time + (state.attempts === 1 ? 60_000 : 300_000) });
          onStatus(`Check-in: ${error.message}`);
        } finally {
          if (store.get("daily-lease")?.owner === owner)
            store.set("daily-lease", { owner, until: 0 });
        }
      });
    } finally {
      running = false;
    }
  };
}

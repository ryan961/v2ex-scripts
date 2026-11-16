import { button, element, matching, modal, owned, safeContent } from "./dom.js";

export function createTopics(options, getDocument) {
  const seen = new WeakSet();
  const cache = new Map();
  function get(path) {
    const entry = cache.get(path);
    if (entry && entry.expires > Date.now()) return entry.promise;
    const promise = getDocument(path)
      .then((doc) => {
        const content = doc.querySelector(".topic_content");
        const title = doc.querySelector("#Main h1");
        if (!title) throw new Error("Topic unavailable or sign-in required.");
        return {
          title: title.textContent,
          content: content ? safeContent(content, new URL(path, location.href).href) : null,
          supplements: [...doc.querySelectorAll(".subtle .topic_content")]
            .filter((node) => node !== content)
            .map((node) => safeContent(node, new URL(path, location.href).href)),
        };
      })
      .catch((error) => {
        cache.delete(path);
        throw error;
      });
    if (cache.size >= 20) cache.delete(cache.keys().next().value);
    cache.set(path, { promise, expires: Date.now() + 600_000 });
    return promise;
  }
  return {
    enhance(root) {
      for (const link of matching(root, ".item_title a[href], a.topic-link[href]")) {
        if (seen.has(link)) continue;
        seen.add(link);
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || !/^\/t\/\d+\/?$/.test(url.pathname)) continue;
        if (options.newTab) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        if (options.preview) {
          const trigger = owned(
            button("Preview", async () => {
              const dialog = modal("Topic preview");
              const body = element("div", "Loading...", "vx-preview");
              const original = element("a", "Open topic");
              original.href = link.href;
              original.target = "_blank";
              original.rel = "noopener noreferrer";
              dialog.append(original, body);
              try {
                const topic = await get(url.pathname);
                if (!dialog.isConnected) return;
                dialog.querySelector("h2").textContent = topic.title;
                body.replaceChildren();
                if (topic.content) body.append(topic.content.cloneNode(true));
                else body.append(element("p", "No topic body."));
                for (const content of topic.supplements)
                  body.append(element("hr"), content.cloneNode(true));
              } catch (error) {
                body.textContent = error.message;
              }
            }),
          );
          link.after(trigger);
        }
      }
    },
  };
}

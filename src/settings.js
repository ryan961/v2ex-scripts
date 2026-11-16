import { button, element, modal, owned } from "./dom.js";
import { openUploadHistory } from "./upload.js";

export function openSettings(store) {
  if (document.querySelector("#vx-settings-dialog")) return;
  const options = store.options();
  const dialog = modal("V2EX Lite \u8bbe\u7f6e");
  dialog.root.id = "vx-settings-dialog";
  const form = element("form", undefined, "v2p-topic-preview");
  const fields = new Map();
  function field(key, label, description, control) {
    const wrapper = element("div", undefined, "cell");
    const caption = element("label", `${label} `);
    control.id = `vx-option-${key}`;
    control.name = key;
    const help = element("p", description, "fade");
    help.id = `${control.id}-help`;
    control.setAttribute("aria-describedby", help.id);
    caption.append(control);
    wrapper.append(caption, help);
    form.append(wrapper);
    fields.set(key, control);
  }
  const names = {
    privacy: [
      "\u9632\u7aa5\u5c4f",
      "\u906e\u6321\u8d26\u53f7\u4e0e\u4f59\u989d\uff0c\u5e76\u66ff\u6362\u7ad9\u70b9\u6807\u8bc6\uff1b\u4e0d\u4f1a\u6e05\u9664\u767b\u5f55\u72b6\u6001\uff0c\u4e5f\u4e0d\u9690\u85cf\u6b63\u6587\u6216\u6d4f\u89c8\u5386\u53f2\u3002",
    ],
    newTab: [
      "\u5728\u65b0\u6807\u7b7e\u9875\u6253\u5f00\u4e3b\u9898",
      "\u63a7\u5236\u4e3b\u9898\u6807\u9898\u548c\u7528\u6237\u5361\u7247\u4e2d\u7684\u4e3b\u9898\u94fe\u63a5\uff1b\u9884\u89c8\u4ecd\u5728\u5f53\u524d\u9875\u5f39\u7a97\u4e2d\u6253\u5f00\u3002",
    ],
    preview: [
      "\u4e3b\u9898\u9884\u89c8",
      "\u5728\u4e3b\u9898\u5217\u8868\u6807\u9898\u540e\u663e\u793a\u5e38\u9a7b\u9884\u89c8\u6309\u94ae\uff0c\u6253\u5f00\u5b8c\u6574\u4e3b\u9898\u9875\u9762\uff1b\u7528\u6237\u5361\u7247\u4e2d\u7684\u4e3b\u9898\u4e5f\u53ef\u9884\u89c8\u3002",
    ],
    userCards: [
      "\u7528\u6237\u60ac\u6d6e\u5361\u7247",
      "\u60ac\u505c\u7ea6 350 \u6beb\u79d2\u540e\u663e\u793a Polish \u540c\u6b3e\u8d44\u6599\u4e0e\u6700\u8fd1\u53d1\u5e16\uff1b\u5173\u95ed\u5361\u7247\u4f1a\u53d6\u6d88\u672a\u5b8c\u6210\u8bf7\u6c42\uff0c\u540c\u4e00\u9875\u9762\u7f13\u5b58 10 \u5206\u949f\u3002",
    ],
    tags: [
      "\u7528\u6237\u6807\u7b7e",
      "\u4ece\u60ac\u6d6e\u5361\u7247\u6dfb\u52a0\u6807\u7b7e\uff0c\u70b9\u51fb\u5df2\u6709\u6807\u7b7e\u53ef\u7f16\u8f91\uff1b\u5173\u95ed\u8d44\u6599\u5361\u7247\u540e\u4ecd\u53ef\u901a\u8fc7\u60ac\u505c\u7f16\u8f91\u6807\u7b7e\u3002",
    ],
    hotReplies: [
      "\u5f53\u524d\u9875\u70ed\u95e8\u56de\u590d",
      "\u6cbf\u7528 REP \u4fa7\u680f\u5e03\u5c40\uff0c\u6309\u5df2\u52a0\u8f7d\u56de\u590d\u7684\u611f\u8c22\u6570\u6392\u5e8f\uff1b\u6ca1\u6709\u83b7\u611f\u8c22\u7684\u56de\u590d\u65f6\u4e0d\u663e\u793a\u3002",
    ],
    autoCheckIn: [
      "\u81ea\u52a8\u9886\u53d6\u6bcf\u65e5\u5956\u52b1",
      "\u6253\u5f00\u9875\u9762\u6216\u8fd4\u56de\u53ef\u89c1\u6807\u7b7e\u9875\u65f6\u68c0\u67e5\uff0c\u6210\u529f\u540e\u5f53\u65e5\u4e0d\u91cd\u590d\u9886\u53d6\uff1b\u5931\u8d25\u6bcf\u5929\u6700\u591a\u5c1d\u8bd5\u4e09\u6b21\u3002",
    ],
    upload: [
      "\u56fe\u7247\u4e0a\u4f20",
      "\u652f\u6301\u9009\u62e9\u3001\u7c98\u8d34\u548c\u62d6\u62fd\uff0c\u56fe\u7247\u53d1\u9001\u5230 Imgur \u516c\u5f00\u56fe\u5e8a\uff1b\u4e0a\u4f20\u8bb0\u5f55\u4e0e\u5220\u9664\u5165\u53e3\u4fdd\u5b58\u5728\u672c\u5730\u3002",
    ],
    emoji: [
      "Polish \u8868\u60c5\u9009\u62e9\u5668",
      "\u56de\u590d\u6309\u94ae\u65c1\u663e\u793a\u8868\u60c5\u5165\u53e3\uff1b\u56fe\u7247\u8868\u60c5\u4ee3\u7801\u5728\u63d0\u4ea4\u65f6\u8f6c\u6362\u4e3a\u56fe\u7247\u5730\u5740\uff0c\u9009\u62e9\u8868\u60c5\u4e0d\u4f1a\u53d1\u8868\u56de\u590d\u3002",
    ],
  };
  for (const [key, [label, description]] of Object.entries(names)) {
    const input = element("input");
    input.type = "checkbox";
    input.checked = options[key];
    field(key, label, description, input);
  }
  const pages = element("input");
  pages.type = "number";
  pages.min = "0";
  pages.max = "5";
  pages.step = "1";
  pages.required = true;
  pages.value = String(options.preloadPages);
  field(
    "preloadPages",
    "\u81ea\u52a8\u8ffd\u52a0\u56de\u590d\u9875\u6570",
    "\u8303\u56f4 0\uff5e5\uff0c\u6307\u5f53\u524d\u9875\u4e4b\u540e\u989d\u5916\u52a0\u8f7d\u7684\u9875\u6570\uff1b\u8bbe\u4e3a 0 \u5173\u95ed\u81ea\u52a8\u52a0\u8f7d\uff0c\u4ecd\u53ef\u624b\u52a8\u8ffd\u52a0\u3002",
    pages,
  );
  const client = element("input");
  client.type = "text";
  client.autocomplete = "off";
  client.pattern = "[A-Za-z0-9]{0,64}";
  client.value = options.imgurClientId;
  client.placeholder = "\u7559\u7a7a\u4f7f\u7528\u5185\u7f6e\u5171\u4eab Client ID";
  field(
    "imgurClientId",
    "\u81ea\u5b9a\u4e49 Imgur Client ID\uff08\u53ef\u9009\uff09",
    "\u9ed8\u8ba4\u514d\u914d\u7f6e\uff0c\u5171\u4eab\u4e0a\u6e38\u5e94\u7528\u914d\u989d\uff1b\u9047\u5230\u9650\u6d41\u4f1a\u505c\u6b62\u961f\u5217\uff0c\u4e0d\u8f6e\u6362 ID \u6216\u81ea\u52a8\u91cd\u8bd5\u3002\u4e0d\u8981\u586b\u5199 Client Secret\u3002",
    client,
  );
  const message = element("p");
  message.setAttribute("aria-live", "polite");
  const save = element("button", "\u4fdd\u5b58\u5e76\u5237\u65b0", "normal button special");
  save.type = "submit";
  form.append(save);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) return;
    const next = { ...options };
    for (const [key, control] of fields)
      next[key] = control.type === "checkbox" ? control.checked : control.value;
    next.preloadPages = Number(next.preloadPages);
    try {
      store.saveOptions(next);
      location.reload();
    } catch {
      message.textContent =
        "\u4fdd\u5b58\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u811a\u672c\u7ba1\u7406\u5668\u7684\u672c\u5730\u5b58\u50a8\u7a7a\u95f4\u540e\u91cd\u8bd5\u3002";
    }
  });
  const file = element("input");
  file.type = "file";
  file.accept = ".json,application/json,text/plain";
  file.hidden = true;
  file.setAttribute("aria-label", "\u9009\u62e9\u6807\u7b7e\u5907\u4efd\u6587\u4ef6");
  file.addEventListener("change", async () => {
    try {
      if (!file.files[0]) return;
      if (file.files[0].size > 2_000_000)
        throw new Error("\u5907\u4efd\u6587\u4ef6\u4e0d\u80fd\u8d85\u8fc7 2 MB\u3002");
      const count = store.import(await file.files[0].text());
      message.textContent = `\u5df2\u5bfc\u5165 ${count} \u4e2a\u7528\u6237\u7684\u6807\u7b7e\uff0c\u672c\u5730\u5df2\u6709\u6761\u76ee\u4fdd\u6301\u4e0d\u53d8\u3002\u5237\u65b0\u9875\u9762\u540e\u663e\u793a\u66f4\u65b0\u3002`;
    } catch (error) {
      message.textContent =
        error instanceof SyntaxError
          ? "\u5bfc\u5165\u5931\u8d25\uff1aJSON \u683c\u5f0f\u4e0d\u6b63\u786e\u3002"
          : `\u5bfc\u5165\u5931\u8d25\uff1a${error.message}`;
    } finally {
      file.value = "";
    }
  });
  const backup = element("div", undefined, "v2p-topic-preview");
  backup.append(
    element("h3", "\u672c\u5730\u5907\u4efd\u4e0e Polish \u6807\u7b7e\u8fc1\u79fb"),
    element(
      "p",
      "\u5907\u4efd\u5305\u542b\u660e\u6587\u6807\u7b7e\u548c\u8bbe\u7f6e\uff0c\u8bf7\u79c1\u4e0b\u4fdd\u5b58\u3002\u5bfc\u5165\u53ea\u5408\u5e76\u6807\u7b7e\uff0c\u672c\u5730\u6761\u76ee\u4f18\u5148\uff0c\u4fdd\u7559\u73b0\u6709\u8bbe\u7f6e\uff1bClient ID\u3001\u4e0a\u4f20\u8bb0\u5f55\u3001\u5220\u9664\u51ed\u8bc1\u548c\u7b7e\u5230\u72b6\u6001\u4e0d\u8fdb\u5165\u5907\u4efd\u3002\u652f\u6301\u6700\u5927 2 MB \u7684 JSON \u6587\u4ef6\u3002",
    ),
    button("\u5bfc\u51fa JSON \u5907\u4efd", () => {
      const url = URL.createObjectURL(new Blob([store.export()], { type: "application/json" }));
      const anchor = element("a");
      anchor.href = url;
      anchor.download = "v2ex-lite-backup.json";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }),
    button("\u5bfc\u5165\u6807\u7b7e JSON", () => file.click()),
    file,
    message,
  );
  dialog.content.append(form, backup);
  dialog.actions.prepend(
    button("\u4e0a\u4f20\u8bb0\u5f55", () => {
      dialog.close();
      openUploadHistory(store);
    }),
  );
}

export function installSettings(store) {
  const footer = owned(element("div", undefined, "v2p-footer"));
  footer.append(element("div", "V2EX Lite \u00b7 V2EX Polish", "v2p-footer-text"));
  const links = element("div", undefined, "v2p-footer-links");
  const entry = element("a", "\u8bbe\u7f6e", "v2p-footer-link v2p-hover-btn");
  entry.href = "#";
  entry.addEventListener("click", (event) => {
    event.preventDefault();
    openSettings(store);
  });
  entry.id = "vx-settings";
  const uploads = element("a", "\u4e0a\u4f20\u8bb0\u5f55", "v2p-footer-link v2p-hover-btn");
  uploads.href = "#";
  uploads.addEventListener("click", (event) => {
    event.preventDefault();
    openUploadHistory(store);
  });
  links.append(entry, uploads);
  footer.append(links);
  (document.querySelector("#Bottom .content") ?? document.body).append(footer);
  GM_registerMenuCommand("V2EX Lite \u8bbe\u7f6e", () => openSettings(store));
}

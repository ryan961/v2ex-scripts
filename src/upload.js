import { t } from "./i18n.js";
import { element, modal, owned, safeURL } from "./dom.js";
import { DEFAULT_IMGUR_CLIENT_ID } from "./storage.js";

export function replacePlaceholder(textarea, marker, replacement) {
  const offset = textarea.value.indexOf(marker);
  if (offset < 0) return false;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  textarea.setRangeText(replacement, offset, offset + marker.length, "preserve");
  const adjust = (position) =>
    position <= offset
      ? position
      : position >= offset + marker.length
        ? position + replacement.length - marker.length
        : offset + replacement.length;
  textarea.setSelectionRange(adjust(start), adjust(end));
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

export function uploadImage(file, clientId = DEFAULT_IMGUR_CLIENT_ID, request = GM_xmlhttpRequest) {
  clientId ||= DEFAULT_IMGUR_CLIENT_ID;
  if (!/^[a-z0-9]{1,64}$/i.test(clientId)) return Promise.reject(new Error(t("invalidClient")));
  if (
    !/^image\/(png|jpeg|gif|webp)$/.test(file.type) ||
    file.size > 10 * 1024 * 1024 ||
    file.size === 0
  ) {
    return Promise.reject(new Error(t("imageFormat")));
  }
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append("image", file);
    request({
      method: "POST",
      url: "https://api.imgur.com/3/image",
      headers: { Authorization: `Client-ID ${clientId}` },
      data,
      anonymous: true,
      timeout: 30_000,
      onload(response) {
        try {
          if (
            response.status === 429 ||
            (response.status === 403 && /rate.?limit|quota|credits/i.test(response.responseText))
          ) {
            const retry = /^retry-after:\s*(.+)$/im
              .exec(response.responseHeaders ?? "")?.[1]
              ?.trim();
            const delay = Number(retry) > 0 ? Number(retry) * 1000 : Date.parse(retry) - Date.now();
            const error = new Error(t("imgurRateLimit"));
            error.rateLimited = true;
            error.retryAt = Date.now() + (Number.isFinite(delay) && delay > 0 ? delay : 3_600_000);
            throw error;
          }
          let body;
          try {
            body = JSON.parse(response.responseText);
          } catch {
            throw new Error(t("imgurResponse"));
          }
          const link = safeURL(body.data?.link, "https://i.imgur.com", true);
          if (
            response.status < 200 ||
            response.status >= 300 ||
            body.success !== true ||
            !link ||
            new URL(link).hostname !== "i.imgur.com"
          ) {
            throw new Error(t("imgurHTTP", response.status));
          }
          resolve({
            link,
            deleteHash: /^[a-z0-9]+$/i.test(body.data?.deletehash ?? "")
              ? body.data.deletehash
              : null,
          });
        } catch (error) {
          reject(error);
        }
      },
      onerror: () => reject(new Error(t("imgurNetwork"))),
      ontimeout: () => reject(new Error(t("imgurTimeout"))),
      onabort: () => reject(new Error(t("imgurAborted"))),
    });
  });
}

function sourceTopicURL(value) {
  const href = safeURL(value, location.href, true);
  if (!href) return null;
  const url = new URL(href);
  if (!/(^|\.)v2ex\.com$/i.test(url.hostname) || !/^\/t\/\d+\/?$/.test(url.pathname)) return null;
  return url.origin + url.pathname.replace(/\/$/, "");
}

export function openUploadHistory(store) {
  const dialog = modal(t("uploadHistory"));
  const content = element("div", undefined, "v2p-topic-preview");
  const records = store.uploads();
  if (!records.length) content.append(element("p", t("noUploads")));
  for (const record of records) {
    const row = element("div", undefined, "cell vx-upload-record");
    const details = element("div", undefined, "vx-upload-record-details");
    details.append(element("p", `${record.createdAt} · ${record.fileName}`));
    const url = safeURL(record.link, "https://i.imgur.com", true);
    if (url && new URL(url).origin === "https://i.imgur.com") {
      const link = element("a", url);
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const preview = link.cloneNode(false);
      preview.className = "vx-upload-record-preview";
      const image = element("img");
      image.alt = record.fileName || t("preview");
      image.setAttribute("loading", "lazy");
      image.setAttribute("decoding", "async");
      image.setAttribute("referrerpolicy", "no-referrer");
      const thumbnail = new URL(url);
      thumbnail.pathname = thumbnail.pathname.replace(
        /^\/([a-z0-9]+)\.(jpe?g|png|gif|webp)$/i,
        "/$1m.$2",
      );
      image.addEventListener("error", () => {
        if (image.src === url) preview.remove();
        else image.src = url;
      });
      image.src = thumbnail.href;
      preview.append(image);
      row.append(preview);
      details.append(link);
    }
    if (/^[a-z0-9]+$/i.test(record.deleteHash ?? "")) {
      const link = element("a", t("deleteImage"));
      link.href = `https://imgur.com/delete/${record.deleteHash}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      details.append(" · ", link);
    }
    const source = sourceTopicURL(record.sourceTopic?.url);
    if (source) {
      const context = element("p");
      const title = record.sourceTopic.title;
      const link = element("a", typeof title === "string" && title.trim() ? title : source);
      link.href = source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      context.append(element("strong", t("sourceTopic")), " ", link);
      details.append(context);
    }
    row.append(details);
    content.append(row);
  }
  dialog.content.append(content);
}

export function initUpload(options, store, request = GM_xmlhttpRequest) {
  const textarea = document.querySelector(
    'textarea#reply_content, #reply-box textarea, textarea[name="content"]',
  );
  if (!textarea || !options.upload) return;
  const sourceURL = sourceTopicURL(location.href);
  const sourceTopic = sourceURL
    ? {
        title:
          document.querySelector("#Main .header h1")?.textContent.trim() || document.title.trim(),
        url: sourceURL,
      }
    : null;
  const toolbar = owned(element("div", undefined, "vx-upload"));
  const input = element("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/gif,image/webp";
  input.multiple = true;
  Object.assign(input.style, {
    visibility: "hidden",
    position: "absolute",
    top: "0",
    left: "0",
    width: "0",
    height: "0",
  });
  const messages = element("div");
  messages.setAttribute("aria-live", "polite");
  const pick = owned(element("a", ` + ${t("insertImage")}`, "vr_upload_image"));
  pick.tabIndex = 0;
  pick.setAttribute("role", "button");
  pick.setAttribute("aria-label", t("uploadToImgur"));
  pick.style.paddingLeft = "10px";
  pick.title = t("uploadToImgur");
  pick.addEventListener("click", () => input.click());
  pick.addEventListener("keydown", (event) => {
    if (event.key === "Enter") input.click();
  });
  const appendPosition = document.querySelector("#reply-box > div > div") ?? textarea.form;
  appendPosition?.append(pick);
  toolbar.append(input, messages);
  textarea.after(toolbar);
  let queue = Promise.resolve();
  let pending = 0;
  let pausedUntil = store.get("upload-paused-until", 0);
  const paused = () => Math.max(pausedUntil, store.get("upload-paused-until", 0)) > Date.now();

  function enqueue(files) {
    const images = [...files].filter((file) => file.type.startsWith("image/"));
    if (!images.length) return false;
    if (paused()) {
      messages.textContent = t("uploadPaused");
      return false;
    }
    if (images.length + pending > 10) {
      messages.textContent = t("queueLimit");
      return false;
    }
    for (const file of images) {
      pending++;
      const marker = `[vx-upload:${crypto.randomUUID()}]`;
      textarea.setRangeText(`\n${marker}\n`, textarea.selectionEnd, textarea.selectionEnd, "end");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      const row = element("p", t("queued", file.name || t("pastedImage")));
      messages.append(row);
      while (messages.children.length > 20) messages.firstElementChild.remove();
      queue = queue.then(async () => {
        if (paused()) {
          replacePlaceholder(textarea, marker, "");
          row.textContent = t("cancelQueued");
          pending--;
          return;
        }
        row.textContent = t("uploading", file.name || t("pastedImage"));
        try {
          const result = await uploadImage(file, options.imgurClientId, request);
          const replaced = replacePlaceholder(textarea, marker, result.link);
          row.textContent = replaced ? t("uploaded") : t("draftMarkerRemoved");
          const link = element("a", result.link);
          link.href = result.link;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          row.append(link);
          if (result.deleteHash) {
            const deletion = element("a", ` ${t("saveDelete")}`);
            deletion.href = `https://imgur.com/delete/${result.deleteHash}`;
            deletion.target = "_blank";
            deletion.rel = "noopener noreferrer";
            row.append(deletion);
          }
          try {
            const record = { ...result, fileName: file.name || t("pastedImage") };
            if (sourceTopic) record.sourceTopic = sourceTopic;
            store.recordUpload(record);
          } catch {
            row.append(` ${t("uploadRecordFailed")}`);
          }
        } catch (error) {
          if (error.rateLimited) {
            pausedUntil = error.retryAt;
            try {
              store.set("upload-paused-until", error.retryAt);
            } catch {
              /* Keep this page paused even when storage is full. */
            }
          }
          replacePlaceholder(textarea, marker, "");
          row.textContent = `${file.name || t("pastedImage")}: ${error.message}${error.rateLimited ? "" : ` ${t("selectAgain")}`}`;
        } finally {
          pending--;
        }
      });
    }
    return true;
  }

  input.addEventListener("change", () => {
    enqueue(input.files);
    input.value = "";
  });
  textarea.addEventListener("paste", (event) => {
    const images = [...(event.clipboardData?.items ?? [])]
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter(Boolean);
    if (enqueue(images)) event.preventDefault();
  });
  textarea.addEventListener("dragover", (event) => {
    if ([...(event.dataTransfer?.items ?? [])].some((item) => item.type.startsWith("image/")))
      event.preventDefault();
  });
  textarea.addEventListener("drop", (event) => {
    if (enqueue(event.dataTransfer?.files ?? [])) event.preventDefault();
  });
  textarea.form?.addEventListener(
    "submit",
    (event) => {
      if (pending || /\[vx-upload:[^\]]+\]/.test(textarea.value)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        messages.append(element("p", t("finishUploads")));
      }
    },
    true,
  );
}

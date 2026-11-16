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
  if (!/^[a-z0-9]{1,64}$/i.test(clientId))
    return Promise.reject(new Error("Invalid Imgur Client ID."));
  if (
    !/^image\/(png|jpeg|gif|webp)$/.test(file.type) ||
    file.size > 10 * 1024 * 1024 ||
    file.size === 0
  ) {
    return Promise.reject(new Error("Use a PNG, JPEG, GIF or WebP image up to 10 MB."));
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
            const error = new Error(
              "Imgur rate limit reached. Upload queue stopped; no automatic retry.",
            );
            error.rateLimited = true;
            error.retryAt = Date.now() + (Number.isFinite(delay) && delay > 0 ? delay : 3_600_000);
            throw error;
          }
          const body = JSON.parse(response.responseText);
          const link = safeURL(body.data?.link, "https://i.imgur.com", true);
          if (
            response.status < 200 ||
            response.status >= 300 ||
            body.success !== true ||
            !link ||
            new URL(link).hostname !== "i.imgur.com"
          ) {
            throw new Error(`Imgur upload failed (HTTP ${response.status}).`);
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
      onerror: () => reject(new Error("Imgur network error.")),
      ontimeout: () =>
        reject(
          new Error(
            "Imgur upload timed out. Check Imgur before retrying; it may have received the image.",
          ),
        ),
      onabort: () => reject(new Error("Imgur upload aborted.")),
    });
  });
}

export function openUploadHistory(store) {
  const dialog = modal("Upload history");
  const content = element("div", undefined, "v2p-topic-preview");
  const records = store.uploads();
  if (!records.length) content.append(element("p", "No saved uploads."));
  for (const record of records) {
    const row = element("div", undefined, "cell");
    row.append(element("p", `${record.createdAt} · ${record.fileName}`));
    const url = safeURL(record.link, "https://i.imgur.com", true);
    if (url && new URL(url).hostname === "i.imgur.com") {
      const link = element("a", url);
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      row.append(link);
    }
    if (/^[a-z0-9]+$/i.test(record.deleteHash ?? "")) {
      const link = element("a", " Delete image");
      link.href = `https://imgur.com/delete/${record.deleteHash}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      row.append(" · ", link);
    }
    content.append(row);
  }
  dialog.content.append(content);
}

export function initUpload(options, store, request = GM_xmlhttpRequest) {
  const textarea = document.querySelector(
    'textarea#reply_content, #reply-box textarea, textarea[name="content"]',
  );
  if (!textarea || !options.upload) return;
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
  const pick = element("a", " + \u63D2\u5165\u56FE\u7247", "vr_upload_image");
  pick.tabIndex = 0;
  pick.setAttribute("role", "button");
  pick.setAttribute("aria-label", "Upload images to Imgur");
  pick.style.paddingLeft = "10px";
  pick.title = "Uploads images to public Imgur hosting.";
  pick.addEventListener("click", () => input.click());
  pick.addEventListener("keydown", (event) => {
    if (event.key === "Enter") input.click();
  });
  toolbar.append(pick, input, messages);
  textarea.after(toolbar);
  let queue = Promise.resolve();
  let pending = 0;
  let pausedUntil = store.get("upload-paused-until", 0);
  const paused = () => Math.max(pausedUntil, store.get("upload-paused-until", 0)) > Date.now();

  function enqueue(files) {
    const images = [...files].filter((file) => file.type.startsWith("image/"));
    if (!images.length) return false;
    if (paused()) {
      messages.textContent = "Imgur uploads paused after rate limiting. Try again later.";
      return false;
    }
    if (images.length + pending > 10) {
      messages.textContent = "Queue limit: 10 images. Wait for current uploads to finish.";
      return false;
    }
    for (const file of images) {
      pending++;
      const marker = `[vx-upload:${crypto.randomUUID()}]`;
      textarea.setRangeText(`\n${marker}\n`, textarea.selectionEnd, textarea.selectionEnd, "end");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      const row = element("p", `${file.name || "Pasted image"}: queued`);
      messages.append(row);
      while (messages.children.length > 20) messages.firstElementChild.remove();
      queue = queue.then(async () => {
        if (paused()) {
          replacePlaceholder(textarea, marker, "");
          row.textContent = "Queued upload cancelled after rate limiting.";
          pending--;
          return;
        }
        row.textContent = `${file.name || "Pasted image"}: uploading...`;
        try {
          const result = await uploadImage(file, options.imgurClientId, request);
          const replaced = replacePlaceholder(textarea, marker, result.link);
          row.textContent = replaced ? "Uploaded: " : "Draft marker removed; copy this URL: ";
          const link = element("a", result.link);
          link.href = result.link;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          row.append(link);
          if (result.deleteHash) {
            const deletion = element("a", " Save deletion link");
            deletion.href = `https://imgur.com/delete/${result.deleteHash}`;
            deletion.target = "_blank";
            deletion.rel = "noopener noreferrer";
            row.append(deletion);
          }
          try {
            store.recordUpload({ ...result, fileName: file.name || "Pasted image" });
          } catch {
            row.append(
              " Upload history could not be saved. Save this deletion link before leaving.",
            );
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
          row.textContent = `${file.name || "Pasted image"}: ${error.message}${error.rateLimited ? "" : " Select the file again to retry."}`;
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
        messages.append(
          element("p", "Wait for uploads or remove unfinished upload markers before submitting."),
        );
      }
    },
    true,
  );
}

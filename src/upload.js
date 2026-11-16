import { button, element, owned, safeURL } from "./dom.js";

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

export function uploadImage(file, clientId, request = GM_xmlhttpRequest) {
  if (!/^[a-z0-9]{1,64}$/i.test(clientId))
    return Promise.reject(new Error("Configure your Imgur Client ID in settings first."));
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

export function initUpload(options) {
  const textarea = document.querySelector(
    'textarea#reply_content, #reply-box textarea, textarea[name="content"]',
  );
  if (!textarea || !options.upload) return;
  const toolbar = owned(element("div", undefined, "vx-upload"));
  const input = element("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/gif,image/webp";
  input.multiple = true;
  input.hidden = true;
  const messages = element("div");
  messages.setAttribute("aria-live", "polite");
  const pick = button("Upload images to Imgur", () => input.click());
  toolbar.append(
    pick,
    element(
      "small",
      " Public image hosting. Paste or drop images here; replies are never submitted automatically.",
    ),
    input,
    messages,
  );
  textarea.before(toolbar);
  let queue = Promise.resolve();
  let pending = 0;

  function enqueue(files) {
    const images = [...files].filter((file) => file.type.startsWith("image/"));
    if (!images.length) return false;
    if (!options.imgurClientId) {
      messages.textContent = "Set your own Imgur Client ID in V2EX Lite settings first.";
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
        row.textContent = `${file.name || "Pasted image"}: uploading...`;
        try {
          const result = await uploadImage(file, options.imgurClientId);
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
        } catch (error) {
          replacePlaceholder(textarea, marker, "");
          row.textContent = `${file.name || "Pasted image"}: ${error.message} Select the file again to retry.`;
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

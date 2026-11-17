import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const files = {
  "/": ["index.html", "text/html"],
  "/app.js": ["app.js", "text/javascript"],
  "/style.css": ["style.css", "text/css"],
};
const port = 8765;
const origin = `http://localhost:${port}`;

createServer(async (request, response) => {
  if (request.headers.host !== `localhost:${port}` || request.method !== "GET") {
    response.writeHead(403).end();
    return;
  }
  const path = new URL(request.url, origin).pathname;
  const entry = Object.hasOwn(files, path) && files[path];
  if (!entry) {
    response.writeHead(404).end();
    return;
  }
  try {
    const [name, type] = entry;
    const bytes = await readFile(new URL(`../docs/backup/${name}`, import.meta.url));
    response
      .writeHead(200, {
        "Content-Type": `${type}; charset=utf-8`,
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' https://accounts.google.com/gsi/; connect-src https:; frame-src https://accounts.google.com/gsi/; style-src 'self' https://accounts.google.com/gsi/style; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
      })
      .end(bytes);
  } catch {
    response.writeHead(500).end();
  }
}).listen(port, "127.0.0.1", () => console.log(`V2EX Lite Cloud Backup: ${origin}`));

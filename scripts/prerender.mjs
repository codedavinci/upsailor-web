import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const PORT = 4173;
const URL = `http://localhost:${PORT}/`;
const DIST_INDEX = resolve("dist/index.html");

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolveReady, reject) => {
    const check = () => {
      fetch(url)
        .then(() => resolveReady())
        .catch(() => {
          if (Date.now() - start > timeoutMs) reject(new Error("Preview server did not start in time"));
          else setTimeout(check, 300);
        });
    };
    check();
  });
}

async function main() {
  const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    stdio: "inherit",
    shell: true,
  });

  try {
    await waitForServer(URL);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 500));

    const html = await page.evaluate(() => "<!doctype html>\n" + document.documentElement.outerHTML);
    await browser.close();

    writeFileSync(DIST_INDEX, html);
    console.log(`Prerendered ${DIST_INDEX} (${html.length} bytes)`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

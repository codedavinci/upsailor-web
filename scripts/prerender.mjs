import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const PORT = 4173;
const URL = `http://localhost:${PORT}/`;
const DIST_INDEX = resolve("dist/index.html");
const VITE_BIN = resolve("node_modules/.bin/vite");

const LOCAL_CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
];

async function resolveExecutablePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  // On Vercel (and other serverless-style build containers) the system is
  // missing the shared libs a normal desktop Chrome download needs, so use
  // the statically-linked Chromium build made for exactly this environment.
  if (process.env.VERCEL) {
    return chromium.executablePath();
  }

  const { existsSync } = await import("node:fs");
  const found = LOCAL_CHROME_PATHS.find((p) => existsSync(p));
  if (found) return found;

  // Fall back to sparticuz's chromium even locally if nothing else is found.
  return chromium.executablePath();
}

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
  const server = spawn(VITE_BIN, ["preview", "--port", String(PORT), "--strictPort"], {
    stdio: "inherit",
  });

  try {
    await waitForServer(URL);

    const executablePath = await resolveExecutablePath();
    const browser = await puppeteer.launch({
      executablePath,
      args: process.env.VERCEL ? chromium.args : [],
      headless: true,
    });
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

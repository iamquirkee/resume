// Builds the site, serves dist/ via `vite preview`, and prints it to PDF with Puppeteer.
import { build, preview } from 'vite';
import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const OUT_DIR = resolve('out');
const OUT_FILE = resolve(OUT_DIR, 'kenneth-ho-resume.pdf');

await build({ logLevel: 'warn' });
const server = await preview({ preview: { port: 4173, strictPort: false }, logLevel: 'warn' });
const url = server.resolvedUrls.local[0];

const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.emulateMediaType('print');
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('html[data-ready="true"]');

  await mkdir(OUT_DIR, { recursive: true });
  await page.pdf({
    path: OUT_FILE,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(`PDF written: ${OUT_FILE}`);
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}

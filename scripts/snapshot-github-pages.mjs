import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourceUrl = process.env.SNAPSHOT_URL ?? "http://localhost:3001/";
const projectRoot = resolve(import.meta.dirname, "..");
const clientDir = resolve(projectRoot, "dist", "client");
const docsDir = resolve(projectRoot, "docs");

await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });
await cp(clientDir, docsDir, { recursive: true });

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Snapshot request failed: ${response.status}`);

let html = await response.text();
html = html
  .replaceAll("http://localhost:3001/og.png", "./og.png")
  .replaceAll("/_next/", "./_next/")
  .replaceAll("/images/", "./images/")
  .replaceAll("/data/", "./data/");

await writeFile(resolve(docsDir, "index.html"), html, "utf8");
await writeFile(resolve(docsDir, "404.html"), html, "utf8");
await writeFile(resolve(docsDir, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages snapshot written to ${docsDir}`);

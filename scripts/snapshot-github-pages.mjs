import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourceUrl = process.env.SNAPSHOT_URL ?? "http://localhost:3001/";
const projectRoot = resolve(import.meta.dirname, "..");
const clientDir = resolve(projectRoot, "dist", "client");
const docsDir = resolve(projectRoot, "docs");

await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });
await cp(clientDir, docsDir, { recursive: true });

// Vite's preload helper prefixes lazy client assets with `/`, which points at
// the GitHub domain root instead of this project's `/mlt/` subdirectory.
// Resolve those assets against the current document so hydration and language
// switching keep working after the static snapshot is published.
const manifest = JSON.parse(await readFile(resolve(docsDir, ".vite", "manifest.json"), "utf8"));
const browserEntry = manifest["virtual:vinext-app-browser-entry"]?.file;
if (!browserEntry) throw new Error("Unable to locate the vinext browser entry in the Vite manifest");
const browserEntryPath = resolve(docsDir, browserEntry);
let browserCode = await readFile(browserEntryPath, "utf8");
const rootPreloadPattern = /([A-Za-z_$][\w$]*)=function\(e\)\{return`\/`\+e\}/u;
if (!rootPreloadPattern.test(browserCode)) throw new Error("Unable to locate Vite's root-relative preload helper");
browserCode = browserCode.replace(rootPreloadPattern, "$1=function(e){return new URL(e,document.baseURI).href}");
await writeFile(browserEntryPath, browserCode, "utf8");

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

import { readFile, rename, writeFile } from "node:fs/promises";

const endpoint = "https://api.gohakka.org/v3/pro/text/translations";
const token = process.env.GOHAKKA_TOKEN;
if (!token) throw new Error("GOHAKKA_TOKEN is required");

const sourcePath = new URL("../translations/mlt_site_zh_segments.json", import.meta.url);
const outputPath = new URL("../translations/mlt_site_gohakka_raw_translations.json", import.meta.url);
const temporaryPath = new URL("../translations/mlt_site_gohakka_raw_translations.tmp.json", import.meta.url);
const sourceDocument = JSON.parse(await readFile(sourcePath, "utf8"));
const segments = sourceDocument.segments;
const concurrency = Math.max(1, Math.min(3, Number(process.env.GOHAKKA_CONCURRENCY || 3)));

let previous = null;
try {
  previous = JSON.parse(await readFile(outputPath, "utf8"));
} catch {
  // A missing or incomplete previous run starts from a clean record.
}

const resumable = previous?.metadata?.transport === "api"
  ? new Map(previous.translations?.filter((item) => item?.uiStatus === "success" || item?.status === "success").map((item) => [item.id, item]))
  : new Map();

const document = {
  metadata: {
    provider: "GoHakka",
    endpoint,
    sourceLanguage: "zh-Hant",
    targetLanguage: "hak-TW",
    dialectCode: "sixian",
    mode: "natural",
    engine: "model",
    transport: "api",
    sourceSegmentCount: segments.length,
    startedAt: previous?.metadata?.transport === "api" ? previous.metadata.startedAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  translations: Array(segments.length).fill(null),
};

for (const [index, segment] of segments.entries()) {
  const existing = resumable.get(segment.id);
  if (existing?.source === segment.text && existing?.payload?.engine === "model") document.translations[index] = existing;
}

let completed = document.translations.filter(Boolean).length;
let nextIndex = 0;
let saving = Promise.resolve();

async function save() {
  document.metadata.updatedAt = new Date().toISOString();
  const body = `${JSON.stringify(document, null, 2)}\n`;
  saving = saving.then(async () => {
    await writeFile(temporaryPath, body, "utf8");
    await rename(temporaryPath, outputPath);
  });
  return saving;
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function translate(segment, index) {
  const payload = { text: segment.text, dialectCode: "sixian", targetCode: "hak", engine: "model" };
  let lastRecord = null;

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    const startedAt = new Date().toISOString();
    try {
      const form = new FormData();
      for (const [key, value] of Object.entries(payload)) form.append(key, value);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
        signal: controller.signal,
      });
      let parsedResponse = null;
      try {
        parsedResponse = await response.json();
      } catch {
        // Preserve a null parsed response when the upstream body is not JSON.
      }
      const translated = Array.isArray(parsedResponse?.data?.hak) ? parsedResponse.data.hak.join("").trim() : "";
      const success = response.ok && parsedResponse?.success === true && translated;
      lastRecord = {
        index,
        id: segment.id,
        scope: segment.scope,
        source: segment.text,
        payload,
        httpStatus: response.status,
        status: success ? "success" : "error",
        response: parsedResponse,
        translated,
        attempt,
        startedAt,
        completedAt: new Date().toISOString(),
      };
      if (success) return lastRecord;
      if (![408, 425, 429, 500, 502, 503, 504].includes(response.status)) return lastRecord;
    } catch (error) {
      lastRecord = {
        index,
        id: segment.id,
        scope: segment.scope,
        source: segment.text,
        payload,
        httpStatus: null,
        status: "error",
        response: { success: false, data: null, error: { message: error instanceof Error ? error.message : String(error) } },
        translated: "",
        attempt,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    } finally {
      clearTimeout(timer);
    }
    await wait(Math.min(8_000, 500 * 2 ** (attempt - 1)));
  }
  return lastRecord;
}

async function worker() {
  while (true) {
    const index = nextIndex;
    nextIndex += 1;
    if (index >= segments.length) return;
    if (document.translations[index]?.status === "success") continue;
    document.translations[index] = await translate(segments[index], index);
    completed += 1;
    if (completed % 10 === 0 || completed === segments.length) {
      await save();
      console.log(`GoHakka ${completed}/${segments.length}`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
await save();
const errors = document.translations.filter((item) => item?.status !== "success");
console.log(JSON.stringify({ segments: segments.length, completed, errors: errors.length, concurrency }));
if (errors.length) process.exitCode = 1;

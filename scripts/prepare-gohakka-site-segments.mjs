import { mkdir, readFile, writeFile } from "node:fs/promises";

const writers = JSON.parse(await readFile(new URL("../app/data/writers.json", import.meta.url), "utf8"));
const siteCopy = JSON.parse(await readFile(new URL("../app/data/site-copy.json", import.meta.url), "utf8"));

const segments = [];
const seen = new Map();

function add(id, scope, text) {
  const normalized = String(text ?? "").trim();
  if (!normalized) return;
  if (seen.has(normalized)) return;
  seen.set(normalized, id);
  segments.push({ id, scope, text: normalized });
}

for (const [key, text] of Object.entries(siteCopy)) add(`site.${key}`, "site", text);

for (const writer of writers) {
  for (const field of ["bio", "workIntro", "style", "relation"]) {
    add(`writer.${writer.id}.${field}`, `writer:${writer.id}`, writer[field]);
  }
  for (const [index, work] of writer.works.entries()) {
    if (work.note) add(`writer.${writer.id}.works.${index}.note`, `writer:${writer.id}:work`, work.note);
  }
}

const workTypes = [...new Set(writers.flatMap((writer) => writer.works.map((work) => work.type)).filter(Boolean))];
for (const [index, type] of workTypes.entries()) add(`workType.${index}`, "work-type", type);

await mkdir(new URL("../translations/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../translations/mlt_site_zh_segments.json", import.meta.url),
  JSON.stringify({
    metadata: {
      sourceLanguage: "zh-Hant",
      targetLanguage: "hak-TW",
      dialectCode: "sixian",
      mode: "natural",
      engine: "model",
      generatedAt: new Date().toISOString(),
      note: "作家姓名、作品名、機構名、來源名稱與網址保留原文；其餘可見網站文案逐段翻譯。"
    },
    segments
  }, null, 2) + "\n",
  "utf8"
);

console.log(JSON.stringify({ writers: writers.length, segments: segments.length, characters: segments.reduce((sum, segment) => sum + segment.text.length, 0) }, null, 2));

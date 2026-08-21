import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const load = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const [siteZh, siteHak, writers, writersHak, manifest, raw, reviewed] = await Promise.all([
  load("../app/data/site-copy.json"),
  load("../app/data/site-copy-hak.json"),
  load("../app/data/writers.json"),
  load("../app/data/writers-hak.json"),
  load("../translations/mlt_site_zh_segments.json"),
  load("../translations/mlt_site_gohakka_raw_translations.json"),
  load("../translations/mlt_site_hakka_reviewed_segments.json"),
]);

assert.deepEqual(Object.keys(siteHak).sort(), Object.keys(siteZh).sort(), "Mandarin and Hakka site-copy keys differ");
assert.equal(writersHak.length, writers.length, "Mandarin and Hakka writer counts differ");
assert.deepEqual(writersHak.map(({ id }) => id).sort(), writers.map(({ id }) => id).sort(), "Mandarin and Hakka writer IDs differ");

const manifestSources = new Set(manifest.segments.map(({ text }) => text));
const rawSources = new Set(raw.translations.map(({ source }) => source));
const reviewedSources = new Set(reviewed.segments.map(({ source }) => source));
const expectedSources = [
  ...Object.values(siteZh),
  ...writers.flatMap((writer) => [writer.bio, writer.workIntro, writer.style, writer.relation]),
  ...writers.flatMap((writer) => writer.works.flatMap((work) => [work.type, work.note].filter(Boolean))),
];

for (const source of expectedSources) {
  assert.ok(manifestSources.has(source), `Mandarin content changed without GoHakka preparation: ${source.slice(0, 50)}`);
  assert.ok(rawSources.has(source), `Missing GoHakka raw result: ${source.slice(0, 50)}`);
  assert.ok(reviewedSources.has(source), `Missing reviewed Hakka result: ${source.slice(0, 50)}`);
}

assert.equal(raw.translations.length, manifest.segments.length, "GoHakka raw result count is out of sync");
assert.equal(reviewed.segments.length, manifest.segments.length, "Reviewed Hakka result count is out of sync");
for (const entry of raw.translations) {
  assert.equal(entry.httpStatus, 200, `GoHakka request failed: ${entry.id}`);
  assert.equal(entry.status, "success", `GoHakka result is incomplete: ${entry.id}`);
  assert.ok(entry.translated, `GoHakka returned no translation: ${entry.id}`);
}

const hakkaById = new Map(writersHak.map((writer) => [writer.id, writer]));
for (const writer of writers) {
  const hakka = hakkaById.get(writer.id);
  assert.ok(hakka?.bio && hakka?.workIntro && hakka?.style && hakka?.relation, `Incomplete Hakka writer: ${writer.id}`);
  assert.equal(hakka.works.length, writer.works.length, `Hakka work count differs: ${writer.id}`);
  for (const [index, work] of hakka.works.entries()) {
    assert.ok(work.type, `Missing Hakka work type: ${writer.id}/${index}`);
    assert.notEqual(work.note, undefined, `Missing Hakka work note: ${writer.id}/${index}`);
  }
}

assert.equal(writers.length, 39);
assert.equal(writers.reduce((sum, writer) => sum + writer.works.length, 0), 252);
console.log(`Bilingual content synchronized: ${Object.keys(siteZh).length} UI strings, ${writers.length} writers, ${manifest.segments.length} GoHakka segments.`);

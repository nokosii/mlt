import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("writer archive has the requested 39 records and genre counts", async () => {
  const writers = JSON.parse(await readFile(new URL("public/data/writers.json", root), "utf8"));
  assert.equal(writers.length, 39);
  const counts = Object.fromEntries(Object.entries(Object.groupBy(writers, (writer) => writer.genre)).map(([genre, rows]) => [genre, rows.length]));
  assert.deepEqual(counts, { 古典文學: 11, 小說: 6, 散文: 6, 新詩: 9, 劇作: 2, 兒童文學: 3, 報導文學: 2 });
  for (const writer of writers) {
    assert.ok(writer.name && writer.bio && writer.workTitle && writer.links.length, `${writer.id} is incomplete`);
    assert.ok(Array.isArray(writer.works) && writer.works.length, `${writer.id} has no audited works`);
    for (const work of writer.works) assert.ok(work.title && work.type, `${writer.id} has an incomplete work entry`);
  }
  assert.equal(writers.reduce((sum, writer) => sum + writer.works.length, 0), 252);
  const zhangHanwen = writers.find((writer) => writer.id === "zhang-hanwen");
  assert.equal(zhangHanwen.years, "1902—1979");
  assert.deepEqual(zhangHanwen.links, [{
    label: "國家文化記憶庫・張漢文",
    url: "https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_People&id=333870",
  }]);
  assert.ok(!JSON.stringify(zhangHanwen).includes("lin.nmtl.gov.tw"));
});

test("GitHub Pages snapshot contains the finished site", async () => {
  const html = await readFile(new URL("docs/index.html", root), "utf8");
  assert.match(html, /苗栗文學步道/);
  assert.match(html, /苗栗作家資料庫/);
  assert.match(html, /https:\/\/forms\.gle\/otkC9QQo6Hp31ShK6/);
  assert.match(html, /\.\/downloads\/苗栗文學作家資料庫\.xlsx/);
  assert.match(html, /trail-hero-identity\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:_next|images)\//);
  assert.ok((await readFile(new URL("docs/downloads/苗栗文學作家資料庫.xlsx", root))).length > 10_000);
  assert.ok((await readFile(new URL("docs/images/trail-hero-identity.png", root))).length > 1_000_000);
});
